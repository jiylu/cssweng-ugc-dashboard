import { useMutation } from "@tanstack/react-query"
import { cancelProposal } from "../services/submitted-proposals-api"

export function useCancelProposal() {
  return useMutation({
    mutationFn: (publicId: string) => cancelProposal(publicId),
  })
}
