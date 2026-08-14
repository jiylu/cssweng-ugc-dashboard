import { API_BASE_URL } from "@/src/config/api";
import { parseApiError } from "@/src/features/auth/services/users-api";

export async function uploadPaymentProof(
  campaignPublicId: string,
  file: File,
) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/payments/pay?campaignPublic=${encodeURIComponent(campaignPublicId)}`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Unable to upload proof of payment."),
    );
  }

  return response.json();
}

export interface Payment {
  public_id: string;
  proof_payment_url: string | null;
  invoice_sent_at: string | null;
  is_payment_verified: boolean;
  created_at: string;
  verified_at: string | null;
}

export async function getPaymentForCampaign(
  campaignPublicId: string,
): Promise<Payment | null> {
  const response = await fetch(
    `${API_BASE_URL}/payments/campaign/${encodeURIComponent(campaignPublicId)}`,
    { credentials: "include" },
  );

  if (!response.ok) {
    throw new Error(await parseApiError(response, "Unable to load invoice."));
  }

  const body = await response.text();
  return body ? (JSON.parse(body) as Payment) : null;
}
