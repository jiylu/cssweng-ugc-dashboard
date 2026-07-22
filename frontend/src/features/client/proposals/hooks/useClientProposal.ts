import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  declineProposal,
  getProposalReview,
  requestProposalRevision,
  updateAddOnOptIn,
} from "../services/proposals-api";
import type { ProposalReviewData } from "../types/proposal-review.types";

export function useClientProposal(publicId: string) {
  const queryClient = useQueryClient();
  const proposalQuery = useQuery({
    queryKey: ["client-proposal", publicId],
    queryFn: () => getProposalReview(publicId),
    enabled: Boolean(publicId) && publicId !== "preview",
  });

  const revisionMutation = useMutation({
    mutationFn: ({ proposalId, comment }: { proposalId: string; comment: string }) =>
      requestProposalRevision(proposalId, comment),
  });

  const declineMutation = useMutation({ mutationFn: declineProposal });
  const addOnMutation = useMutation({
    mutationFn: ({ addOnId, optIn }: { addOnId: string; optIn: boolean }) =>
      updateAddOnOptIn(addOnId, optIn),
    onMutate: async ({ addOnId, optIn }) => {
      const queryKey = ["client-proposal", publicId];
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ProposalReviewData>(queryKey);

      queryClient.setQueryData<ProposalReviewData>(queryKey, (current) => {
        if (!current) return current;
        const addOn = current.addOns.find((item) => item.id === addOnId);
        if (!addOn || addOn.selected === optIn) return current;

        const selectedAddOnsFee = current.selectedAddOnsFee + (optIn ? addOn.fee : -addOn.fee);
        return {
          ...current,
          addOns: current.addOns.map((item) =>
            item.id === addOnId ? { ...item, selected: optIn } : item,
          ),
          selectedAddOnsFee,
          totalDue: (current.baseFee + selectedAddOnsFee) * (1 + current.taxRate / 100),
        };
      });

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["client-proposal", publicId], context.previous);
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["client-proposal", publicId] }),
  });

  return { proposalQuery, revisionMutation, declineMutation, addOnMutation };
}
