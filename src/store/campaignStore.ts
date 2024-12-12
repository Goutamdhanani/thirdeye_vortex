import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Campaign } from '../types/campaign';

export interface FollowUpRule {
  id: string;
  name: string;
  trigger: {
    type: 'no_reply' | 'opened' | 'clicked' | 'not_opened';
    delay: number;
    delayUnit: string;
  };
}

export interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  progress: number;
  sent: number;
  click: number;
  replied: number;
  opportunities: number;
  schedule: {
    startDate: string;
    endDate: string;
    timeZone: string;
  };
  abTest?: {
    enabled: boolean;
    type: string;
    variants: any[];
    testDuration: number;
  };
  followUpRules?: FollowUpRule[];
  template?: {
    subject: string;
    content: string;
  };
  leads?: any[];
}

interface CampaignStore {
  campaigns: Campaign[];
  draftCampaign: Partial<Campaign> | null;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, campaign: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  setDraftCampaign: (campaign: Partial<Campaign> | null) => void;
  updateDraftCampaign: (data: Partial<Campaign>) => void;
  saveDraftCampaign: () => void;
  fetchCampaigns: () => void; // Add fetchCampaigns to the interface
}

export const useCampaignStore = create<CampaignStore>((set) => ({
  campaigns: [],
  draftCampaign: null,

  addCampaign: (campaign) =>
    set((state) => ({
      campaigns: [...state.campaigns, { ...campaign, id: campaign.id || uuidv4() }],
    })),

  updateCampaign: (id, campaign) =>
    set((state) => ({
      campaigns: state.campaigns.map((c) =>
        c.id === id ? { ...c, ...campaign, updatedAt: new Date() } : c
      ),
    })),

  deleteCampaign: (id) =>
    set((state) => ({
      campaigns: state.campaigns.filter((c) => c.id !== id),
    })),

  setDraftCampaign: (campaign) =>
    set({
      draftCampaign: campaign
        ? {
            ...campaign,
            id: campaign.id || uuidv4(),
            status: 'draft',
            createdAt: new Date(),
            updatedAt: new Date(),
            tracking: {
              openTracking: true,
              clickTracking: true,
              unsubscribeTracking: true,
            },
            metrics: {
              sent: 0,
              delivered: 0,
              opens: 0,
              clicks: 0,
              replies: 0,
              bounces: 0,
              unsubscribes: 0,
              complaints: 0,
            },
          }
        : null,
    }),

  updateDraftCampaign: (data) =>
    set((state) => ({
      draftCampaign: state.draftCampaign
        ? {
            ...state.draftCampaign,
            ...data,
            updatedAt: new Date(),
          }
        : null,
    })),

  saveDraftCampaign: () =>
    set((state) => {
      if (!state.draftCampaign) return state;

      const campaign = state.draftCampaign as Campaign;
      return {
        campaigns: [...state.campaigns, campaign],
        draftCampaign: null,
      };
    }),

  fetchCampaigns: async () => {
    // Fetch campaigns from an API or other source
    const response = await fetch('/api/campaigns');
    const data = await response.json();
    set({ campaigns: data });
  },
}));