import { useQuery } from "@tanstack/react-query"
import { getLatestWrittenAsset } from "../services/deliverable-submissions-api"

export function useLatestWrittenAsset(
  deliverableItemPublicId: string | undefined,
) {
  return useQuery({
    queryKey: ["latestWrittenAsset", deliverableItemPublicId],
    queryFn: () => getLatestWrittenAsset(deliverableItemPublicId!),
    enabled: !!deliverableItemPublicId,
  })
}
