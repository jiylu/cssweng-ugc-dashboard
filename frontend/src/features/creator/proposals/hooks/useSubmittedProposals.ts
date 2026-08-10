import { useQuery } from "@tanstack/react-query"
import { getSubmittedProposals } from "../services/submitted-proposals-api"

export function useSubmittedProposals(creatorId: string | undefined) {
  return useQuery({
    queryKey: ["submitted-proposals", creatorId],
    queryFn: () => getSubmittedProposals(creatorId!),
    enabled: !!creatorId,
  })
}
