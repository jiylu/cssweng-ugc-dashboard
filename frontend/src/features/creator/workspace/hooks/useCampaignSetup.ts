import { useQuery } from "@tanstack/react-query"
import { getCampaignSetup } from "@/src/features/creator/workspace/services/getCampaignSetup"

export function useCampaignSetup(campaignId: string | undefined) {
  return useQuery({
    queryKey: ["campaignSetup", campaignId],
    queryFn: () => getCampaignSetup(campaignId!),
    enabled: !!campaignId,
    staleTime: 5 * 60 * 1000,
  })
}
