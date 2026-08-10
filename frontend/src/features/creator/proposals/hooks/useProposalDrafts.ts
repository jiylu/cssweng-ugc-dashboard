import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createDraft,
  deleteDraft,
  getDraft,
  getDraftsForUser,
  updateDraft,
} from "../services/drafts-api"
import { CreateDraftPayload, UpdateDraftPayload } from "../types/draft.types"

const DRAFTS_QUERY_KEY = "proposal-drafts"

export function useProposalDrafts(userId: string | undefined) {
  return useQuery({
    queryKey: [DRAFTS_QUERY_KEY, userId],
    queryFn: () => getDraftsForUser(userId!),
    enabled: !!userId,
  })
}

export function useDraft(publicId: string | undefined) {
  return useQuery({
    queryKey: ["draft", publicId],
    queryFn: () => getDraft(publicId!),
    enabled: !!publicId,
  })
}

export function useCreateDraft() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateDraftPayload) => createDraft(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DRAFTS_QUERY_KEY] })
    },
  })
}

export function useUpdateDraft(publicId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateDraftPayload) => updateDraft(publicId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DRAFTS_QUERY_KEY] })
    },
  })
}

export function useDeleteDraft() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (publicId: string) => deleteDraft(publicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DRAFTS_QUERY_KEY] })
    },
  })
}
