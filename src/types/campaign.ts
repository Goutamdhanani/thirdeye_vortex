export interface SenderProfile {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
}

export interface Lead {
  id: string;
  email: string;
  name?: string;
  company?: string;
  jobTitle?: string;
  industry?: string;
  region?: string;
  tags?: string[];
  customFields?: Record<string, string>;
  engagementHistory?: {
    opens: number;
    clicks: number;
    replies: number;
    lastEngagement?: Date;
  };
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  htmlContent?: string;
  variables: string[];
  category: 'initial' | 'followup' | 'webinar' | 'custom';
}

export interface ABTest {
  enabled: boolean;
  type: 'subject' | 'content' | 'sender';
  variants: {
    id: string;
    name: string;
    content: string;
    metrics?: {
      opens: number;
      clicks: number;
      replies: number;
    };
  }[];
  splitRatio: number;
  testDuration: number;
  winningCriteria: 'opens' | 'clicks' | 'replies';
}

export interface ScheduleSettings {
  startDate: Date;
  endDate?: Date;
  timeZone: string;
  sendingSpeed: {
    emailsPerHour: number;
    batchSize: number;
    delayBetweenBatches: number;
  };
  optimizeDeliveryTime: boolean;
  workingHours: {
    start: string;
    end: string;
    days: number[];
  };
}

export interface FollowUpRule {
  id: string;
  trigger: {
    type: 'no_reply' | 'opened' | 'clicked' | 'not_opened';
    delay: number;
  };
  action: {
    type: 'send_email' | 'move_to_segment' | 'tag';
    templateId?: string;
    segmentId?: string;
    tag?: string;
  };
}

export interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  senderProfile: SenderProfile;
  replyToEmail?: string;
  leads: Lead[];
  segments?: {
    id: string;
    name: string;
    rules: Record<string, any>;
  }[];
  template: EmailTemplate;
  abTest?: ABTest;
  schedule: ScheduleSettings;
  followUpRules: FollowUpRule[];
  metrics: {
    sent: number;
    delivered: number;
    opens: number;
    clicks: number;
    replies: number;
    bounces: number;
    unsubscribes: number;
    complaints: number;
  };
  tracking: {
    openTracking: boolean;
    clickTracking: boolean;
    unsubscribeTracking: boolean;
  };
  gdprCompliance: {
    consentRecorded: boolean;
    consentDate?: Date;
    consentSource?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
