import { useQuery } from "@tanstack/react-query"
import { getCampaigns } from "@/src/features/creator/campaigns/services/getCampaigns"

export function useCampaigns(creatorId: string, page: number) {
  return useQuery({
    queryKey: ["campaigns", creatorId, page],
    queryFn: () => getCampaigns(creatorId, page),
    enabled: !!creatorId
  })
}