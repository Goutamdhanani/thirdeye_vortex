import { mailService } from './mailService';
import { useCampaignStore } from '../store/campaignStore';
import type { Campaign, Step, Lead } from '../store/campaignStore';

interface CampaignProgress {
  campaignId: string;
  stepId: string;
  leadIndex: number;
  status: 'running' | 'paused' | 'completed' | 'error';
  error?: string;
}

class CampaignRunner {
  private runningCampaigns: Map<string, CampaignProgress>;
  private intervalIds: Map<string, NodeJS.Timeout>;

  constructor() {
    this.runningCampaigns = new Map();
    this.intervalIds = new Map();
  }

  async startCampaign(campaign: Campaign) {
    if (this.runningCampaigns.has(campaign.id)) {
      throw new Error('Campaign is already running');
    }

    try {
      // Set up campaign templates in Mailgun
      await mailService.setupCampaign(campaign);

      // Initialize campaign progress
      const progress: CampaignProgress = {
        campaignId: campaign.id,
        stepId: campaign.steps[0].id,
        leadIndex: 0,
        status: 'running',
      };

      this.runningCampaigns.set(campaign.id, progress);

      // Start sending emails with interval
      const intervalId = setInterval(
        () => this.processNextBatch(campaign),
        60000 // Process batch every minute
      );

      this.intervalIds.set(campaign.id, intervalId);

      // Update campaign status in store
      const store = useCampaignStore.getState();
      store.updateCampaign(campaign.id, { status: 'active' });

      return true;
    } catch (error: any) {
      console.error('Error starting campaign:', error);
      throw error;
    }
  }

  async pauseCampaign(campaignId: string) {
    const progress = this.runningCampaigns.get(campaignId);
    if (!progress) {
      throw new Error('Campaign is not running');
    }

    progress.status = 'paused';
    this.runningCampaigns.set(campaignId, progress);

    // Clear interval
    const intervalId = this.intervalIds.get(campaignId);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervalIds.delete(campaignId);
    }

    // Update campaign status in store
    const store = useCampaignStore.getState();
    store.updateCampaign(campaignId, { status: 'paused' });

    return true;
  }

  async resumeCampaign(campaign: Campaign) {
    const progress = this.runningCampaigns.get(campaign.id);
    if (!progress || progress.status !== 'paused') {
      throw new Error('Campaign is not paused');
    }

    progress.status = 'running';
    this.runningCampaigns.set(campaign.id, progress);

    // Restart interval
    const intervalId = setInterval(
      () => this.processNextBatch(campaign),
      60000
    );
    this.intervalIds.set(campaign.id, intervalId);

    // Update campaign status in store
    const store = useCampaignStore.getState();
    store.updateCampaign(campaign.id, { status: 'active' });

    return true;
  }

  private async processNextBatch(campaign: Campaign) {
    const progress = this.runningCampaigns.get(campaign.id);
    if (!progress || progress.status !== 'running') {
      return;
    }

    const currentStep = campaign.steps.find(step => step.id === progress.stepId);
    if (!currentStep) {
      return;
    }

    try {
      // Get next batch of leads (10 at a time)
      const batchSize = 10;
      const leads = campaign.leads.slice(
        progress.leadIndex,
        progress.leadIndex + batchSize
      );

      if (leads.length === 0) {
        // Move to next step or complete campaign
        const currentStepIndex = campaign.steps.findIndex(
          step => step.id === progress.stepId
        );

        if (currentStepIndex < campaign.steps.length - 1) {
          // Move to next step
          progress.stepId = campaign.steps[currentStepIndex + 1].id;
          progress.leadIndex = 0;
        } else {
          // Campaign completed
          progress.status = 'completed';
          this.runningCampaigns.set(campaign.id, progress);

          // Clear interval
          const intervalId = this.intervalIds.get(campaign.id);
          if (intervalId) {
            clearInterval(intervalId);
            this.intervalIds.delete(campaign.id);
          }

          // Update campaign status in store
          const store = useCampaignStore.getState();
          store.updateCampaign(campaign.id, { status: 'completed' });
        }
        return;
      }

      // Send emails for the current batch
      const results = await mailService.sendCampaignEmails(
        campaign,
        currentStep,
        leads
      );

      // Update progress
      progress.leadIndex += leads.length;
      this.runningCampaigns.set(campaign.id, progress);

      // Update campaign stats
      const stats = await mailService.getCampaignStats(campaign.id);
      const store = useCampaignStore.getState();
      store.updateCampaign(campaign.id, {
        sent: stats.delivered,
        click: stats.clicked,
        replied: stats.replied,
        opportunities: Math.floor(stats.replied * 0.3), // Example conversion rate
        progress: Math.floor(
          (progress.leadIndex / campaign.leads.length) * 100
        ),
      });

    } catch (error: any) {
      console.error('Error processing campaign batch:', error);
      progress.status = 'error';
      progress.error = error.message;
      this.runningCampaigns.set(campaign.id, progress);

      // Clear interval
      const intervalId = this.intervalIds.get(campaign.id);
      if (intervalId) {
        clearInterval(intervalId);
        this.intervalIds.delete(campaign.id);
      }

      // Update campaign status in store
      const store = useCampaignStore.getState();
      store.updateCampaign(campaign.id, { status: 'error' });
    }
  }

  getCampaignProgress(campaignId: string): CampaignProgress | undefined {
    return this.runningCampaigns.get(campaignId);
  }
}

export const campaignRunner = new CampaignRunner();
export default campaignRunner;
