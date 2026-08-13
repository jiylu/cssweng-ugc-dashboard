import { useQuery } from "@tanstack/react-query"
import { getMediaAssetHistory } from "../services/deliverable-submissions-api"

export function useMediaAssetHistory(
  deliverableItemPublicId: string | undefined,
) {
  return useQuery({
    queryKey: ["mediaAssetHistory", deliverableItemPublicId],
    queryFn: () => getMediaAssetHistory(deliverableItemPublicId!),
    enabled: !!deliverableItemPublicId,
  })
}
