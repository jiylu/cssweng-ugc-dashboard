export type ClientCampaignStatus =
  | "COMPLETE"
  | "ACTIVE"
  | "PENDING"
  | "FOR REVISIONS";

export interface ClientCampaign {
  id: string;
  name: string;
  creatorName: string;
  startDate: string;
  deadline: string;
  status: ClientCampaignStatus;
}
