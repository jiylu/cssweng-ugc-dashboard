import { useMutation } from "@tanstack/react-query"
import { saveWrittenAssetDraft } from "../services/deliverable-submissions-api"

export interface SaveWrittenAssetDraftPayload {
  deliverableItemPublicId: string
  content: string
}

export function useSaveWrittenAssetDraft() {
  return useMutation({
    mutationFn: ({ deliverableItemPublicId, content }: SaveWrittenAssetDraftPayload) =>
      saveWrittenAssetDraft(deliverableItemPublicId, content),
  })
}
