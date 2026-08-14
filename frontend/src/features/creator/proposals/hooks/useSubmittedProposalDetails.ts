import { useQuery } from "@tanstack/react-query"
import { getSubmittedProposalDetails } from "../services/submitted-proposals-api"

export function useSubmittedProposalDetails(publicId: string | undefined) {
  return useQuery({
    // This endpoint is also used by the workspaces. Keep one canonical cache
    // entry so opening a contract does not fetch the full campaign twice.
    queryKey: ["campaignSetup", publicId],
    queryFn: () => getSubmittedProposalDetails(publicId!),
    enabled: !!publicId,
    staleTime: 5 * 60 * 1000,
  })
}
