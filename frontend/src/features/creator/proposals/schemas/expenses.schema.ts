import z from "zod"

export const expensesSchema = z.object({
  reimbursementDays: z.number()
    .min(1, "Reimbursement period must be at least 1.")
    .max(60, "Reimbursment period cannot exceed 60 days."),
  giftedProductTerms: z.string()
    .min(1, "Gifted product terms is required. Write N/A if none.")
    .max(1000, "Gifted product terms cannot exceed 1000 characters."),
  cancellationDays: z.number()
    .int("Cancellation period must be a whole number.")
    .min(1, "Cancellation period must be at least 1.")
    .max(365, "Cancellation period must not exceed 365 days."),
})
