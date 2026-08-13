import { API_BASE_URL } from "@/src/config/api"
import { parseApiError } from "@/src/features/auth/services/users-api"
import type {
  DeliverableItem,
  WrittenAsset,
} from "@/src/features/client/workspace/services/deliverable-submissions-api"

export async function getDeliverableItems(
  deliverablePublicId: string,
): Promise<DeliverableItem[]> {
  const response = await fetch(
    `${API_BASE_URL}/deliverables/deliverable-items/${deliverablePublicId}`,
    { credentials: "include" },
  )
  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Unable to fetch deliverable items."),
    )
  }
  return response.json()
}

export async function getLatestWrittenAsset(
  deliverableItemPublicId: string,
): Promise<WrittenAsset | null> {
  const response = await fetch(
    `${API_BASE_URL}/written-assets/latest/${deliverableItemPublicId}`,
    { credentials: "include" },
  )
  if (response.status === 404) return null
  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Unable to fetch written asset."),
    )
  }
  return response.json()
}

export async function submitWrittenAsset(
  deliverableItemPublicId: string,
  content: string,
): Promise<WrittenAsset> {
  const response = await fetch(
    `${API_BASE_URL}/deliverable-submissions/written-assets`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deliverableItemId: deliverableItemPublicId,
        content,
      }),
    },
  )
  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Unable to submit written assets."),
    )
  }
  return response.json()
}
