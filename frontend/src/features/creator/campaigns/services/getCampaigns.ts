import { CampaignListResponse } from "@/src/features/creator/campaigns/types/campaign.types"
import { API_BASE_URL } from "@/src/config/api"

export async function getCampaigns(creatorId: string, page: number, limit: number = 10): Promise<CampaignListResponse> {
  const response = await fetch (
    `${API_BASE_URL}/campaigns?creatorId=${creatorId}&page=${page}&limit=${limit}`,
    { credentials: "include" }
  )
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    console.log("Backend error:", error)
    throw new Error("Failed to fetch campaigns")
  }
  return response.json()
}
