import { useQuery } from "@tanstack/react-query"
import { getCampaigns } from "@/src/features/creator/campaigns/services/getCampaigns"

export function useCampaigns(creatorId: string, page: number, limit?: number) {
  return useQuery({
    queryKey: ["campaigns", creatorId, page, limit],
    queryFn: () => getCampaigns(creatorId, page, limit),
    enabled: !!creatorId
  })
}