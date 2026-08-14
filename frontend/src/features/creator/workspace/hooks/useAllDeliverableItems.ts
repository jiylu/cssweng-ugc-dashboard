import { useQueries } from "@tanstack/react-query"
import { getDeliverableItems } from "../services/deliverable-submissions-api"
import type { Deliverable } from "../types/workspace.types"

export function useAllDeliverableItems(deliverables: Deliverable[]) {
  return useQueries({
    queries: deliverables.map((deliverable) => ({
      queryKey: ["deliverableItems", deliverable.public_id],
      queryFn: () => getDeliverableItems(deliverable.public_id),
    })),
  })
}
