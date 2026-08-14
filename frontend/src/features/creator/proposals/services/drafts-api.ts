import { API_BASE_URL } from "@/src/config/api"
import { CreateDraftPayload, DraftEntity, UpdateDraftPayload } from "../types/draft.types"

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...init,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? "Request failed")
  }

  return res.json()
}

export async function createDraft(payload: CreateDraftPayload): Promise<DraftEntity> {
  return request("/drafts", { method: "POST", body: JSON.stringify(payload) })
}

export async function getDraft(publicId: string): Promise<DraftEntity> {
  return request(`/drafts/${encodeURIComponent(publicId)}`)
}

export async function getDraftsForUser(userId: string): Promise<DraftEntity[]> {
  return request(`/drafts?userId=${encodeURIComponent(userId)}`)
}

export async function updateDraft(
  publicId: string,
  payload: UpdateDraftPayload,
): Promise<DraftEntity> {
  return request(`/drafts/${encodeURIComponent(publicId)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export async function deleteDraft(publicId: string): Promise<DraftEntity> {
  return request(`/drafts/${encodeURIComponent(publicId)}`, { method: "DELETE" })
}
