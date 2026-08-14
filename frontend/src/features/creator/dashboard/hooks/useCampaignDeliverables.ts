import { useQueries } from "@tanstack/react-query"
import { Campaign } from "@/src/features/creator/campaigns/types/campaign.types"
import { getCampaignDeliverables } from "@/src/features/creator/dashboard/services/deliverables-api"
import { DashboardDeliverable } from "@/src/features/creator/dashboard/types/dashboard-deliverable.types"

export function useCampaignDeliverables(
  campaigns: Campaign[] | undefined,
) {
  const results = useQueries({
    queries: (campaigns ?? []).map((campaign) => ({
      queryKey: ["campaign-deliverables", campaign.public_id],
      queryFn: () => getCampaignDeliverables(campaign.public_id),
      enabled: !!campaign.public_id,
      retry: false,
    })),
  })

  const isLoading = results.some((result) => result.isLoading)
  const deliverablesByCampaign = (campaigns ?? []).reduce<
    Record<string, DashboardDeliverable[]>
  >((acc, campaign, index) => {
    acc[campaign.public_id] = results[index]?.data ?? []
    return acc
  }, {})

  return { deliverablesByCampaign, isLoading }
}
