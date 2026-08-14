import { useQuery } from "@tanstack/react-query"
import { getWrittenAssetHistory } from "../services/deliverable-submissions-api"

export function useWrittenAssetHistory(
  deliverableItemPublicId: string | undefined,
) {
  return useQuery({
    queryKey: ["writtenAssetHistory", deliverableItemPublicId],
    queryFn: () => getWrittenAssetHistory(deliverableItemPublicId!),
    enabled: !!deliverableItemPublicId,
  })
}
