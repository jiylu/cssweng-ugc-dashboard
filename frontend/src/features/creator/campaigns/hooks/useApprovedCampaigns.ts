import { useQueries } from "@tanstack/react-query"
import type { Campaign } from "@/src/features/creator/campaigns/types/campaign.types"
import { getProposalClientByCampaign } from "@/src/features/creator/proposals/services/submitted-proposals-api"

const ACCEPTED_PROPOSAL_STATUS = "ACCEPTED"

export function useApprovedCampaigns(campaigns: Campaign[] | undefined) {
  const proposalResults = useQueries({
    queries: (campaigns ?? []).map((campaign) => ({
      queryKey: ["proposal-client", campaign.public_id],
      queryFn: () => getProposalClientByCampaign(campaign.public_id),
      enabled: !!campaign.public_id,
      retry: false,
    })),
  })

  const isLoading = proposalResults.some((result) => result.isLoading)
  const approvedCampaigns = (campaigns ?? []).filter(
    (campaign, index) =>
      proposalResults[index]?.data?.proposal_status === ACCEPTED_PROPOSAL_STATUS,
  )
  const proposalClients = (campaigns ?? []).reduce<Record<string, string>>(
    (acc, campaign, index) => {
      const client = proposalResults[index]?.data
      if (client) {
        acc[campaign.public_id] =
          `${client.client_first_name} ${client.client_last_name}`.trim()
      }
      return acc
    },
    {},
  )

  return { approvedCampaigns, proposalClients, isLoading }
}
