import { API_BASE_URL } from "@/src/config/api";
import { parseApiError } from "@/src/features/auth/services/users-api";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface DeliverableItem {
  public_id: string;
  deliverable_index: number;
  deliverable_item_status: "PENDING" | "FOR_REVIEW" | "APPROVED" | "DELETED";
  written_asset_approved: boolean;
  media_asset_approved: boolean;
}

export interface WrittenAsset {
  public_id: string;
  version_number: number;
  content: string;
  client_comments: string;
  written_asset_action: "PENDING" | "REVISE" | "APPROVE";
  created_at: string;
  updated_at: string | null;
}

export interface MediaAsset {
  public_id: string;
  version_number: number;
  is_video: boolean;
  content_url: string;
  client_comments: string;
  media_asset_action: "PENDING" | "REVISE" | "APPROVE";
  created_at: string;
  updated_at: string | null;
}

// ── Fetch Deliverable Items ────────────────────────────────────────────────────

export async function getDeliverableItems(
  deliverablePublicId: string,
): Promise<DeliverableItem[]> {
  const response = await fetch(
    `${API_BASE_URL}/deliverable-items/deliverable/${deliverablePublicId}`,
    { credentials: "include" },
  );
  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Unable to fetch deliverable items."),
    );
  }
  return response.json();
}

// ── Fetch Latest Assets ────────────────────────────────────────────────────────

export async function getLatestWrittenAsset(
  deliverableItemPublicId: string,
): Promise<WrittenAsset | null> {
  const response = await fetch(
    `${API_BASE_URL}/written-assets/latest/${deliverableItemPublicId}`,
    { credentials: "include" },
  );
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Unable to fetch written asset."),
    );
  }
  return response.json();
}

export async function getLatestMediaAsset(
  deliverableItemPublicId: string,
): Promise<MediaAsset | null> {
  const response = await fetch(
    `${API_BASE_URL}/media-assets/latest/${deliverableItemPublicId}`,
    { credentials: "include" },
  );
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Unable to fetch media asset."),
    );
  }
  return response.json();
}

// ── Approve / Revise Written Assets ────────────────────────────────────────────

export async function approveWrittenAsset(publicId: string) {
  const response = await fetch(
    `${API_BASE_URL}/deliverable-submissions/written-assets/${publicId}/approve`,
    {
      method: "PATCH",
      credentials: "include",
    },
  );
  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Unable to approve written asset."),
    );
  }
  return response.json();
}

export async function reviseWrittenAsset(publicId: string, comment: string) {
  const response = await fetch(
    `${API_BASE_URL}/deliverable-submissions/written-assets/${publicId}/revise`,
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment }),
    },
  );
  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Unable to request revision."),
    );
  }
  return response.json();
}

// ── Approve / Revise Media Assets ──────────────────────────────────────────────

export async function approveMediaAsset(publicId: string) {
  const response = await fetch(
    `${API_BASE_URL}/deliverable-submissions/media-assets/${publicId}/approve`,
    {
      method: "PATCH",
      credentials: "include",
    },
  );
  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Unable to approve media asset."),
    );
  }
  return response.json();
}

export async function reviseMediaAsset(publicId: string, comment: string) {
  const response = await fetch(
    `${API_BASE_URL}/deliverable-submissions/media-assets/${publicId}/revise`,
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment }),
    },
  );
  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Unable to request revision."),
    );
  }
  return response.json();
}
