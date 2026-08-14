import { DashboardDeliverable } from "@/src/features/creator/dashboard/types/dashboard-deliverable.types"
import { API_BASE_URL } from "@/src/config/api"

export async function getCampaignDeliverables(
  campaignPublicId: string,
): Promise<DashboardDeliverable[]> {
  const response = await fetch(
    `${API_BASE_URL}/deliverables/campaign/${campaignPublicId}`,
    { credentials: "include" },
  )
  if (!response.ok) {
    throw new Error("Failed to fetch deliverables")
  }
  return response.json()
}
