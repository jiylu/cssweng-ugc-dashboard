import { useMutation, useQueryClient } from "@tanstack/react-query"
import { submitWrittenAsset } from "../services/deliverable-submissions-api"

export interface SubmitWrittenAssetPayload {
  deliverableItemId: string
  content: string
}

export function useSubmitWrittenAsset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ deliverableItemId, content }: SubmitWrittenAssetPayload) =>
      submitWrittenAsset(deliverableItemId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliverableItems"] })
      queryClient.invalidateQueries({ queryKey: ["latestWrittenAsset"] })
    },
  })
}
