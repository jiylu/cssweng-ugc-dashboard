export interface CreateCampaignPayload {
  campaign: {
    ugcId: string;
    projectName: string;
    description: string;
    startDate: string;
    endDate: string;
    platforms: {
      platform: string;
      handle: string;
    }[];
  };
  deliverables: {
    deliverableTitle: string;
    description: string;
    deliverableType: 'COLLABORATION' | 'UGC';
    deadline: string;
    pricing: number;
  }[];
  proposal: {
    clientEmail: string;
  };
}

export interface CreateCampaignResponse {
  campaign_id: string;
  campaign_status: 'ACTIVE' | 'REJECTED' | 'COMPLETED';
  created_at: string;
}

export interface PlatformEntry {
  platform: string
  handle: string
}