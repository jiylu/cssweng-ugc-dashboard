import { Deliverable } from "@/src/features/creator/workspace/types/workspace.types"
import { API_BASE_URL } from "@/src/config/api"

export async function getDeliverablesByCampaign(campaignId: string): Promise<Deliverable[]> {
  const response = await fetch(
    `${API_BASE_URL}/deliverables/campaign/${campaignId}`,
    { credentials: "include" }
  )
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    console.log("Backend error:", error)
    throw new Error("Failed to fetch deliverables")
  }
  return response.json()
}
