import { Deliverable } from "@/src/features/creator/workspace/types/workspace.types"

export async function getDeliverablesByCampaign(campaignId: string): Promise<Deliverable[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/deliverables/campaign/${campaignId}`,
    { credentials: "include" }
  )
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    console.log("Backend error:", error)
    throw new Error("Failed to fetch deliverables")
  }
  return response.json()
}
