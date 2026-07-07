import z from "zod"

export const usageRightsSchema = z.object({
  includedOrganicUsage: z.string()
    .min(1, "Included organic usage is required.")
    .max(500, "Included organic usage must be less than 500 characters."),

  territory: z.string()
    .min(1, "Territory is required.")
    .max(100, "Territory must be less than 100 characters."),

  restrictions: z.string()
    .min(1, "Restrictions is required.")
    .max(300, "Restrictions must be less than 300 characters."),

  contentRetention: z.number()
    .min(1, "Content retention must be at least 1 month.")
    .max(120, "Content retention must not exceed 120 months."),

  partnershipTags: z.string()
    .min(1, "Partnership tags are required.")
    .max(200, "Partnership tags must be less than 200 characters.")
    .refine(
      (val) => val.split(",").every((tag) => tag.trim().startsWith("#")),
      "Each tag must start with #. e.g. #ad, #partnership"
    ),
})