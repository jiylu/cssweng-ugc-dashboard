import { useQueries } from "@tanstack/react-query"
import { Campaign } from "@/src/features/creator/campaigns/types/campaign.types"
import { getProposalClientByCampaign } from "../services/submitted-proposals-api"

export interface CampaignProposalMeta {
  clientName: string
  proposalStatus: string
  proposalPublicId: string
}

function toClientName(firstName: string, lastName: string): string {
  return [firstName, lastName].filter(Boolean).join(" ").trim()
}

export function useProposalMetaByCampaign(
  campaigns: Campaign[] | undefined
): Map<string, CampaignProposalMeta> {
  const queries = useQueries({
    queries: (campaigns ?? []).map((campaign) => ({
      queryKey: ["proposal-client", campaign.public_id],
      queryFn: () => getProposalClientByCampaign(campaign.public_id),
      enabled: !!campaign.public_id,
      retry: false,
    })),
  })

  const meta = new Map<string, CampaignProposalMeta>()
  ;(campaigns ?? []).forEach((campaign, index) => {
    const data = queries[index]?.data
    if (data) {
      meta.set(campaign.public_id, {
        clientName: toClientName(data.client_first_name, data.client_last_name),
        proposalStatus: data.proposal_status,
        proposalPublicId: data.public_id,
      })
    }
  })

  return meta
}
