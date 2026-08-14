import { API_BASE_URL } from "@/src/config/api"
import { parseApiError } from "@/src/features/auth/services/users-api"

export interface Invoice {
  public_id: string
  invoice_url: string
  created_at: string
}

export async function getInvoiceForCampaign(
  campaignPublicId: string,
): Promise<Invoice | null> {
  const response = await fetch(
    `${API_BASE_URL}/invoices/campaign/${encodeURIComponent(campaignPublicId)}`,
    { credentials: "include" },
  )

  if (!response.ok) {
    throw new Error(await parseApiError(response, "Unable to load invoice."))
  }

  const body = await response.text()
  return body ? (JSON.parse(body) as Invoice) : null
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
    throw new Error(await parseApiError(response, "Unable to send invoice."))
  }

  return response.json()
}
