import { useQueries } from "@tanstack/react-query"
import { Campaign } from "@/src/features/creator/campaigns/types/campaign.types"
import { getProposalClientByCampaign } from "../services/submitted-proposals-api"

function toClientName(firstName: string, lastName: string): string {
  return [firstName, lastName].filter(Boolean).join(" ").trim()
}

export function useProposalClientNames(campaigns: Campaign[] | undefined) {
  const queries = useQueries({
    queries: (campaigns ?? []).map((campaign) => ({
      queryKey: ["proposal-client", campaign.public_id],
      queryFn: () => getProposalClientByCampaign(campaign.public_id),
      enabled: !!campaign.public_id,
      retry: false,
    })),
  })

  const names = new Map<string, string>()
  ;(campaigns ?? []).forEach((campaign, index) => {
    const data = queries[index]?.data
    if (data) {
      names.set(
        campaign.public_id,
        toClientName(data.client_first_name, data.client_last_name)
      )
    }
  })

  return names
}
