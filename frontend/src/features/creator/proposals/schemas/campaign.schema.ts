import z from "zod";
import { deliverableSchema } from "./deliverable.schema";

const platformEntrySchema = z.object({
  platform: z.string()
    .min(1, "Handle is required."),

  handle: z.string()
    .min(1, "Handle is required.")
    .refine((val) => val.startsWith("@"), "Handle must start with @"),
})

export const campaignSchema = z.object({
  projectName: z.string()
    .min(1, "Campaign name is required.")
    .max(50, "Campaign name must be less than 50 characters."),
  
  startDate: z.string()
    .min(1, "Start date is invalid or empty."),  
  
  endDate: z.string()
    .min(1, "End date is invalid or empty."),

  currency: z.string()
    .min(1, "Currency is required."),

  campaignDescription: z.string()
    .min(1, "Description is required.")
    .max(500, "Description must not be less than 300 characters."),

  contactPerson: z.string()
    .min(1, "Contact person is required."),

  contactEmail: z.email("Enter a valid email address")
    .min(1, "Contact email is required."),

  platforms: z.array(platformEntrySchema)
    .min(1, "At least one platform is required."),

  deliverables: z.array(deliverableSchema).min(1),
})
.refine((data) => {
  if (!data.startDate || !data.endDate) return true
  return new Date(data.endDate) > new Date(data.startDate)
}, {
  message: "End date must be after start date.",
  path: ["endDate"]
})
.superRefine((data, ctx) => {
  if (!data.startDate || !data.endDate) return

  const start = new Date(data.startDate)
  const end = new Date(data.endDate)

  data.deliverables.forEach((d, index) => {
    if (d.draftDeadline) {
      const deadline = new Date(d.draftDeadline)
      if (deadline < start || deadline > end) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Draft due date must be between campaign start and end date.",
          path: ["deliverables", index, "draftDeadline"]
        })
      }
    }

    if (d.postDate) {
      const postDate = new Date(d.postDate)
      if (postDate < start || postDate > end) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Post date must be between campaign start and end date.",
          path: ["deliverables", index, "postDate"]
        })
      }
    }
  })
})