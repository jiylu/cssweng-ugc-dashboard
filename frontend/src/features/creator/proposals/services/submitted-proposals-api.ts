import { CampaignListResponse } from "@/src/features/creator/campaigns/types/campaign.types"
import { API_BASE_URL } from "@/src/config/api"

export async function getSubmittedProposals(creatorId: string): Promise<CampaignListResponse> {
  const response = await fetch(
    `${API_BASE_URL}/campaigns?creatorId=${encodeURIComponent(creatorId)}`,
    { credentials: "include" }
  )
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message ?? "Failed to fetch submitted proposals")
  }
  return response.json()
}
