import { Campaign } from "@/src/features/creator/campaigns/types/campaign.types"
import { Deliverable } from "@/src/features/creator/workspace/types/workspace.types"
import { API_BASE_URL } from "@/src/config/api"

export interface CampaignContract {
  public_id: string;
  creator_signed: boolean;
  client_signed: boolean;
  effective_date: string | null;
}

export interface CampaignSetupProposal {
  client_first_name: string;
  client_last_name: string;
}

export interface CampaignSetupResponse {
  campaign: Campaign
  deliverables: Deliverable[]
  proposal: CampaignSetupProposal | null
  contract: CampaignContract
  addOns: unknown[] | null
  giftedProducts: unknown[] | null
}

export async function getCampaignSetup(campaignId: string): Promise<CampaignSetupResponse> {
  const response = await fetch(
    `${API_BASE_URL}/campaign-setup/${campaignId}`,
    { credentials: "include" }
  )
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    console.log("Backend error:", error)
    throw new Error("Failed to fetch campaign setup")
  }
  return response.json()
}
