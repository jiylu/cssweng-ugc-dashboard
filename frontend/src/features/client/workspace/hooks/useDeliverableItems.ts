import { useQuery } from "@tanstack/react-query";
import { getDeliverableItems } from "../services/deliverable-submissions-api";

export function useDeliverableItems(deliverablePublicId: string | undefined) {
  return useQuery({
    queryKey: ["deliverableItems", deliverablePublicId],
    queryFn: () => getDeliverableItems(deliverablePublicId!),
    enabled: !!deliverablePublicId,
  });
}
