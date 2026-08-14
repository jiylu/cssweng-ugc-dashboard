import { CampaignListResponse } from "@/src/features/creator/campaigns/types/campaign.types"
import { CampaignSetupDetails } from "../types/campaign-setup-response.types"
import { UpdateCampaignSetupPayload } from "../types/update-campaign-setup.types"
import { API_BASE_URL } from "@/src/config/api"

export async function getSubmittedProposals(creatorId: string): Promise<CampaignListResponse> {
  const response = await fetch(
    `${API_BASE_URL}/campaigns?creatorId=${encodeURIComponent(creatorId)}`,
    { credentials: "include" }
  )
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message ?? "Failed to fetch submitted proposals")
  }
  return response.json()
}

export interface CampaignProposalClient {
  public_id: string
  client_email: string
  client_first_name: string
  client_last_name: string
  client_comments: string
  proposal_status: string
}

export async function getSubmittedProposalDetails(publicId: string): Promise<CampaignSetupDetails> {
  const response = await fetch(
    `${API_BASE_URL}/campaign-setup/${encodeURIComponent(publicId)}`,
    { credentials: "include" }
  )
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message ?? "Failed to fetch proposal details")
  }
  return response.json()
}

export async function getProposalClientByCampaign(campaignPublicId: string): Promise<CampaignProposalClient> {
  const response = await fetch(
    `${API_BASE_URL}/proposals/campaign/${encodeURIComponent(campaignPublicId)}`,
    { credentials: "include" }
  )
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message ?? "Failed to fetch proposal")
  }
  return response.json()
}

export async function cancelProposal(publicId: string): Promise<CampaignProposalClient> {
  const response = await fetch(
    `${API_BASE_URL}/proposals/cancel/${encodeURIComponent(publicId)}`,
    { method: "PATCH", credentials: "include" }
  )
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message ?? "Failed to cancel proposal")
  }
  return response.json()
}

export async function updateCampaignSetup(
  campaignPublicId: string,
  payload: UpdateCampaignSetupPayload
): Promise<unknown> {
  const response = await fetch(
    `${API_BASE_URL}/campaign-setup/${encodeURIComponent(campaignPublicId)}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  )
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message ?? "Failed to update proposal")
  }
  return response.json()
}
