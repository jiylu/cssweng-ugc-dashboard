import { useQuery } from "@tanstack/react-query"
import { getDeliverablesByCampaign } from "@/src/features/creator/workspace/services/getDeliverablesByCampaign"

export function useDeliverablesByCampaign(campaignId: string | undefined) {
  return useQuery({
    queryKey: ["deliverables", campaignId],
    queryFn: () => getDeliverablesByCampaign(campaignId!),
    enabled: !!campaignId,
  })
}
