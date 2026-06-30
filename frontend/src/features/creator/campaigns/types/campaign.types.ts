export interface Campaign {
  id: number;
  project_name: string;
  comapny_name: string;
  start_date: string;
  deadline: string;
  status: "COMPLETE" | "ACTIVE" | "PENDING" | "FOR REVISIONS";
}

export interface CampaignListResponse {
  data: Campaign[]
  total: number
  page: number
  limit: number
}