export type ClientCampaignStatus =
  | "COMPLETE"
  | "ACTIVE"
  | "PENDING"
  | "FOR REVISIONS";

export interface ClientCampaign {
  id: string;
  proposalId: string;
  name: string;
  creatorName: string;
  startDate: string;
  deadline: string;
  status: ClientCampaignStatus;
}
