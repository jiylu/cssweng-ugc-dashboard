import z from "zod"

export const creativeDirectionSchema = z.object({
  revisionRounds: z.number().min(1, "Please select a revision option.").max(3),
  revisionDays: z.number().min(1).max(14, "Revision days must be between 1 and 14."),
  feedbackDays: z.number().min(1).max(14, "Feedback days must be between 1 and 14."),
})