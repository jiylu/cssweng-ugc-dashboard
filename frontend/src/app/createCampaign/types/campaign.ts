export interface Deliverable {
  id: number;
  deliverable_title: string;
  description: string;
  deliverable_type: string;
  deadline: string;
  pricing: string;
}

export interface CreateCampaignPayload {
  campaign: {
    ugcId: string;
    projectName: string;
    description: string;
    startDate: string;
    endDate: string;
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