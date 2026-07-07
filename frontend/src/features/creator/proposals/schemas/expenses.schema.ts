import z from "zod"

export const expensesSchema = z.object({
  reimbursementDays: z.number()
    .min(1, "Reimbursement period must be at least 1."),
  giftedProductTerms: z.string()
    .min(1, "Gifted product terms is required. Write N/A if none."),
  cancellationDays: z.number()
    .min(1, "Cancellation period must be at least 1."),
})