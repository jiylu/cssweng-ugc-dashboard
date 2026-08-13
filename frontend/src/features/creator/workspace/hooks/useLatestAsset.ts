import { useQuery } from "@tanstack/react-query"
import {
  getLatestMediaAsset,
  getLatestWrittenAsset,
} from "../services/deliverable-submissions-api"

export function useLatestWrittenAsset(
  deliverableItemPublicId: string | undefined,
) {
  return useQuery({
    queryKey: ["latestWrittenAsset", deliverableItemPublicId],
    queryFn: () => getLatestWrittenAsset(deliverableItemPublicId!),
    enabled: !!deliverableItemPublicId,
  })
}

export function useLatestMediaAsset(
  deliverableItemPublicId: string | undefined,
) {
  return useQuery({
    queryKey: ["latestMediaAsset", deliverableItemPublicId],
    queryFn: () => getLatestMediaAsset(deliverableItemPublicId!),
    enabled: !!deliverableItemPublicId,
  })
}
