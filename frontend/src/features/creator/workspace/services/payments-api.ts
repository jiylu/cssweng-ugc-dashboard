import { API_BASE_URL } from "@/src/config/api"
import { parseApiError } from "@/src/features/auth/services/users-api"

export interface Payment {
  public_id: string
  proof_payment_url: string
  is_payment_verified: boolean
  created_at: string
  verified_at: string | null
}

export async function getPaymentForCampaign(
  campaignPublicId: string,
): Promise<Payment | null> {
  const response = await fetch(
    `${API_BASE_URL}/payments/campaign/${encodeURIComponent(campaignPublicId)}`,
    { credentials: "include" },
  )
  if (!response.ok) {
    throw new Error(await parseApiError(response, "Unable to fetch invoice."))
  }
  return response.json()
}

export async function validatePayment(paymentPublicId: string): Promise<Payment> {
  const response = await fetch(
    `${API_BASE_URL}/payments/validate/${encodeURIComponent(paymentPublicId)}`,
    { method: "PATCH", credentials: "include" },
  )
  console.log(response)
  if (!response.ok) {
    throw new Error(await parseApiError(response, "Unable to send invoice."))
  }
  return response.json()
}
