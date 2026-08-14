export interface CampaignDeliverable {
  id: string
  deliverableContent: string
  deliverableType: "COLLABORATION" | "UGC"
  quantity: number
  requirements: string
  dueDate: string
  postDate: string
  pricing: number
  status: "PENDING" | "IN_PROGRESS" | "FOR_REVISION" | "COMPLETE"
}

export interface Campaign {
  public_id: string
  ugc_creator_id: string
  client_id: string | null
  project_name: string
  description: string
  currency: string
  tax: string
  pricing: string
  platforms: Record<string, string>
  start_date: string
  end_date: string
  created_at: string
  campaign_status: "ACTIVE" | "REJECTED" | "COMPLETED" | "CANCELLED"
  all_deliverables_approved?: boolean
  paid_full?: boolean
}

export type CampaignListResponse = Campaign[]
