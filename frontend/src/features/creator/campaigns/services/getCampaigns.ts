import { CampaignListResponse } from "@/src/features/creator/campaigns/types/campaign.types"

export async function getCampaigns(creatorId: string, page: number, limit: number = 10): Promise<CampaignListResponse> {
  const response = await fetch (
    `${process.env.NEXT_PUBLIC_API_URL}/campaigns?creatorId=${creatorId}&page=${page}&limit=${limit}`,
    { credentials: "include" }
  )
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    console.log("Backend error:", error)
    throw new Error("Failed to fetch campaigns")
  }
  return response.json()
}