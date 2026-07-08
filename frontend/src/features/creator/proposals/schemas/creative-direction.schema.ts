import z from "zod"

export const creativeDirectionSchema = z.object({
  revisionRounds: z.number().min(1, "Revision rounds must be at least 1."),
  revisionDays: z.number().min(1, "Revision days must be at least 1."),
  feedbackDays: z.number().min(1, "Feedback days must be at least 1."),
})