import { CreateCampaignPayload, CreateCampaignResponse } from "./../types/campaign";

export async function postCampaign(
  payload: CreateCampaignPayload,
): Promise<CreateCampaignResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaign-setup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? 'Failed to create campaign');
  }

  return res.json();
}