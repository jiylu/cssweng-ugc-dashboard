import z from "zod"

export const expensesSchema = z.object({
  reimbursementDays: z.number()
    .int("Reimbursement period must be a whole number.")
    .min(1, "Reimbursement period must be at least 1.")
    .max(365, "Reimbursement period must not exceed 365 days."),
  giftedProductTerms: z.string()
    .min(1, "Gifted product terms is required. Write N/A if none."),
  cancellationDays: z.number()
    .int("Cancellation period must be a whole number.")
    .min(1, "Cancellation period must be at least 1.")
    .max(365, "Cancellation period must not exceed 365 days."),
})
