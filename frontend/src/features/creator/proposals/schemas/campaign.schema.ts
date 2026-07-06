import z from "zod";
import { deliverableSchema } from "./deliverable.schema";

export const campaignSchema = z.object({
  projectName: z.string()
      .min(1, "Campaign name is required.")
      .max(50, "Campaign name must be less than 50 characters."),
  
  startDate: z.string().min(1, "Start date is invalid or empty."),  
  
  endDate: z.string().min(1, "End date is invalid or empty."),

  campaignDescription: z.string()
      .min(1, "Description is required.")
      .max(300, "Description must not be less than 300 characters."),

  contactEmail: z.email("Enter a valid email address"),

  deliverables: z.array(deliverableSchema).min(1),
}).refine((data) => {
  if (!data.startDate || !data.endDate) return true
  return new Date(data.endDate) > new Date(data.startDate)
}, {
  message: "End date must be after start date.",
  path: ["endDate"]
})
