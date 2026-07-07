import z from "zod"

export const expensesSchema = z.object({
  reimbursementDays: z.number().min(1, "Reimbursement period must be at least 1."),
  giftedProductTerms: z.string().optional(),
  cancellationDays: z.number().min(1, "Cancellation period must be at least 1."),
})