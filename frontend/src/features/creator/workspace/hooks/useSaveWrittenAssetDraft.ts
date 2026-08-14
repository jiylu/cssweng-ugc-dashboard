import { useMutation } from "@tanstack/react-query"
import { saveWrittenAssetDraft } from "../services/deliverable-submissions-api"

export interface SaveWrittenAssetDraftPayload {
  writtenAssetPublicId: string
  content: string
}

export function useSaveWrittenAssetDraft() {
  return useMutation({
    mutationFn: ({ writtenAssetPublicId, content }: SaveWrittenAssetDraftPayload) =>
      saveWrittenAssetDraft(writtenAssetPublicId, content),
  })
}
