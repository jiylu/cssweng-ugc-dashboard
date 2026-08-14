import { useMutation, useQueryClient } from "@tanstack/react-query"
import { submitMediaAsset } from "../services/deliverable-submissions-api"

export interface SubmitMediaAssetPayload {
  deliverableItemPublicId: string
  file: File
}

export function useSubmitMediaAsset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      deliverableItemPublicId,
      file,
    }: SubmitMediaAssetPayload) =>
      submitMediaAsset(deliverableItemPublicId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliverableItems"] })
      queryClient.invalidateQueries({ queryKey: ["latestMediaAsset"] })
      queryClient.invalidateQueries({ queryKey: ["mediaAssetHistory"] })
    },
  })
}
