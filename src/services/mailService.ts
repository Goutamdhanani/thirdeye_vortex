import formData from 'form-data';
import Mailgun from 'mailgun.js';
import type { Campaign, Lead, Step, Variant } from '../store/campaignStore';

interface EmailTemplate {
  subject: string;
  html: string;
  variables: Record<string, string>;
}

interface CampaignStats {
  delivered: number;
  opened: number;
  clicked: number;
  replied: number;
  bounced: number;
  unsubscribed: number;
}

class MailService {
  private mailgun: any;
  private domain: string;
  private from: string;

  constructor() {
    const mailgun = new Mailgun(formData);
    this.mailgun = mailgun.client({
      username: 'api',
      key: process.env.VITE_MAILGUN_API_KEY || '',
    });
    this.domain = process.env.VITE_MAILGUN_DOMAIN || '';
    this.from = process.env.VITE_MAIL_FROM || '';
  }

  private async createTemplate(name: string, template: EmailTemplate) {
    try {
      await this.mailgun.templates.create(this.domain, {
        name,
        template: template.html,
        description: `Template for campaign: ${name}`,
      });
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }

  private async updateTemplate(name: string, template: EmailTemplate) {
    try {
      await this.mailgun.templates.update(this.domain, name, {
        template: template.html,
      });
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  }

  private async createOrUpdateTemplate(name: string, template: EmailTemplate) {
    try {
      await this.createTemplate(name, template);
    } catch (error: any) {
      if (error.status === 409) {
        // Template already exists, update it
        await this.updateTemplate(name, template);
      } else {
        throw error;
      }
    }
  }

  private async sendEmailWithTemplate(
    to: string,
    templateName: string,
    variables: Record<string, string>,
    campaignId: string,
    stepId: string,
    variantId?: string
  ) {
    try {
      const messageData = {
        from: this.from,
        to,
        template: templateName,
        'h:X-Mailgun-Variables': JSON.stringify(variables),
        'h:X-Campaign-Id': campaignId,
        'h:X-Step-Id': stepId,
        ...(variantId && { 'h:X-Variant-Id': variantId }),
        'o:tracking': true,
        'o:tracking-clicks': true,
        'o:tracking-opens': true,
        'o:tag': [campaignId, stepId, variantId].filter(Boolean),
      };

      const response = await this.mailgun.messages.create(this.domain, messageData);
      return response;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async setupCampaign(campaign: Campaign) {
    try {
      // Create templates for each step and variant
      for (const step of campaign.steps) {
        // Create main step template
        const mainTemplate: EmailTemplate = {
          subject: step.subject,
          html: step.content,
          variables: {},
        };
        await this.createOrUpdateTemplate(
          `${campaign.id}_${step.id}`,
          mainTemplate
        );

        // Create templates for variants
        for (const variant of step.variants) {
          const variantTemplate: EmailTemplate = {
            subject: variant.subject,
            html: variant.content,
            variables: {},
          };
          await this.createOrUpdateTemplate(
            `${campaign.id}_${step.id}_${variant.id}`,
            variantTemplate
          );
        }
      }

      return true;
    } catch (error) {
      console.error('Error setting up campaign:', error);
      throw error;
    }
  }

  async sendCampaignEmails(
    campaign: Campaign,
    step: Step,
    leads: Lead[],
    variant?: Variant
  ) {
    const templateName = variant
      ? `${campaign.id}_${step.id}_${variant.id}`
      : `${campaign.id}_${step.id}`;

    const results = [];

    for (const lead of leads) {
      try {
        const variables = {
          firstName: lead.firstName,
          lastName: lead.lastName,
          company: lead.company,
          position: lead.position,
        };

        const result = await this.sendEmailWithTemplate(
          lead.email,
          templateName,
          variables,
          campaign.id,
          step.id,
          variant?.id
        );

        results.push({ success: true, lead, result });
      } catch (error) {
        console.error(`Error sending email to ${lead.email}:`, error);
        results.push({ success: false, lead, error });
      }
    }

    return results;
  }

  async getCampaignStats(campaignId: string): Promise<CampaignStats> {
    try {
      const events = await this.mailgun.events.get(this.domain, {
        event: ['delivered', 'opened', 'clicked', 'failed', 'unsubscribed'],
        'h:X-Campaign-Id': campaignId,
      });

      const stats: CampaignStats = {
        delivered: 0,
        opened: 0,
        clicked: 0,
        replied: 0,
        bounced: 0,
        unsubscribed: 0,
      };

      events.items.forEach((event: any) => {
        switch (event.event) {
          case 'delivered':
            stats.delivered++;
            break;
          case 'opened':
            stats.opened++;
            break;
          case 'clicked':
            stats.clicked++;
            break;
          case 'failed':
            stats.bounced++;
            break;
          case 'unsubscribed':
            stats.unsubscribed++;
            break;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting campaign stats:', error);
      throw error;
    }
  }

  async getEmailEvents(emailAddress: string) {
    try {
      const events = await this.mailgun.events.get(this.domain, {
        recipient: emailAddress,
      });
      return events.items;
    } catch (error) {
      console.error('Error getting email events:', error);
      throw error;
    }
  }

  async validateEmail(email: string) {
    try {
      const response = await this.mailgun.validate.get(email);
      return response;
    } catch (error) {
      console.error('Error validating email:', error);
      throw error;
    }
  }

  async addUnsubscribe(email: string) {
    try {
      await this.mailgun.unsubscribes.create(this.domain, {
        address: email,
      });
      return true;
    } catch (error) {
      console.error('Error adding unsubscribe:', error);
      throw error;
    }
  }

  async removeUnsubscribe(email: string) {
    try {
      await this.mailgun.unsubscribes.destroy(this.domain, email);
      return true;
    } catch (error) {
      console.error('Error removing unsubscribe:', error);
      throw error;
    }
  }
}

export const mailService = new MailService();
export default mailService;