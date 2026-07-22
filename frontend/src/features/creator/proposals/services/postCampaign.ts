import { CreateCampaignPayload, CreateCampaignResponse } from "../types/campaign-setup.types";
import { API_BASE_URL } from "@/src/config/api";

export async function postCampaign(
  payload: CreateCampaignPayload,
): Promise<CreateCampaignResponse> {
  const res = await fetch(`${API_BASE_URL}/campaign-setup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ ...payload }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? 'Failed to create campaign');
  }

  return res.json();
}
