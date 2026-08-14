import { API_BASE_URL } from "@/src/config/api"
import { parseApiError } from "@/src/features/auth/services/users-api"

export interface Invoice {
  public_id: string
  invoice_url: string
  created_at: string
}

export interface Payment {
  public_id: string
  proof_payment_url: string | null

@@ -9,6 +15,41 @@ export interface Payment {
  verified_at: string | null
}

export async function uploadInvoice(
  campaignPublicId: string,
  file: File,
): Promise<Invoice> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(
    `${API_BASE_URL}/invoices/store?campaignPublic=${encodeURIComponent(campaignPublicId)}`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
  )
  if (!response.ok) {
    throw new Error(await parseApiError(response, "Unable to upload invoice."))
  }
  return response.json()
}

export async function getInvoiceForCampaign(
  campaignPublicId: string,
): Promise<Invoice | null> {
  const response = await fetch(
    `${API_BASE_URL}/invoices/campaign/${encodeURIComponent(campaignPublicId)}`,
    { credentials: "include" },
  )
  if (!response.ok) {
    throw new Error(await parseApiError(response, "Unable to fetch invoice."))
  }
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export async function getPaymentForCampaign(
  campaignPublicId: string,
): Promise<Payment | null> {

