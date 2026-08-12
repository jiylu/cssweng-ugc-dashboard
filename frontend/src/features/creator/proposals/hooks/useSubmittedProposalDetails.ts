import { useQuery } from "@tanstack/react-query"
import { getSubmittedProposalDetails } from "../services/submitted-proposals-api"

export function useSubmittedProposalDetails(publicId: string | undefined) {
  return useQuery({
    queryKey: ["submitted-proposal-details", publicId],
    queryFn: () => getSubmittedProposalDetails(publicId!),
    enabled: !!publicId,
  })
}
