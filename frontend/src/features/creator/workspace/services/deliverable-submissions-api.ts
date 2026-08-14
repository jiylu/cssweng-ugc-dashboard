import { API_BASE_URL } from "@/src/config/api"
import { parseApiError } from "@/src/features/auth/services/users-api"
import type {
  DeliverableItem,
  MediaAsset,
  WrittenAsset,
} from "@/src/features/client/workspace/services/deliverable-submissions-api"

export async function getDeliverableItems(
  deliverablePublicId: string,
): Promise<DeliverableItem[]> {
  const response = await fetch(
    `${API_BASE_URL}/deliverable-items/deliverable/${deliverablePublicId}`,
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

export async function getWrittenAssetHistory(
  deliverableItemPublicId: string,
): Promise<WrittenAsset[]> {
  const response = await fetch(
    `${API_BASE_URL}/written-assets/history/${deliverableItemPublicId}`,
    { credentials: "include" },
  )
  if (response.status === 404) return []
  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Unable to fetch written asset history."),
    )
  }
  return response.json()
}

export async function getLatestMediaAsset(
  deliverableItemPublicId: string,
): Promise<MediaAsset | null> {
  const response = await fetch(
    `${API_BASE_URL}/media-assets/latest/${deliverableItemPublicId}`,
    { credentials: "include" },
  )
  if (response.status === 404) return null
  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Unable to fetch media asset."),
    )
  }
  return response.json()
}

export interface WrittenAssetDraft {
  public_id: string
  content: string
  created_at: string
  updated_at: string | null
}

export async function saveWrittenAssetDraft(
  writtenAssetPublicId: string,
  content: string,
): Promise<WrittenAssetDraft> {
  const response = await fetch(
    `${API_BASE_URL}/written-asset-drafts`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        writtenAssetPublicId,
        content,
      }),
    },
  )
  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Unable to save written asset draft."),
    )
  }
  return response.json()
}

export async function getMediaAssetHistory(
  deliverableItemPublicId: string,
): Promise<MediaAsset[]> {
  const response = await fetch(
    `${API_BASE_URL}/media-assets/history/${deliverableItemPublicId}`,
    { credentials: "include" },
  )
  if (response.status === 404) return []
  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Unable to fetch media asset history."),
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
        deliverableItemPublicId,
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

export async function submitMediaAsset(
  deliverableItemPublicId: string,
  file: File,
): Promise<MediaAsset> {
  const formData = new FormData()
  formData.append("deliverableItemPublicId", deliverableItemPublicId)
  formData.append("file", file)

  const response = await fetch(
    `${API_BASE_URL}/deliverable-submissions/media-assets`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
  )
  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Unable to submit media asset."),
    )
  }
  return response.json()
}
