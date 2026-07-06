import { z } from "zod"

export const generalTermsSchema = z.object({
  governingLaw: z.string()
    .min(1, "Governing address is required."),

  disputeLocation: z.string()
    .min(1, "Dispute location is required."),

  extraNotes: z.string()
    .max(1000, "Extra notes must be less than 1000 characters.")
    .optional(),
})