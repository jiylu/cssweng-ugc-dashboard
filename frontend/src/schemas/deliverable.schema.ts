import z from "zod";

export const deliverableSchema = z.object({
  deliverableTitle: z.string()
      .min(1, "Deliverable title is required.")
      .max(50, "Deliverable name must be less than 50 characters."),

  description: z.string()
      .min(20, "Deliverable description is required.")
      .max(100, "Description must be less than 100 characters."),
  
  deliverableType: z.string()
    .min(1, "Please select a deliverable type."),
  
  deadline: z.string()
    .min(1, "Please select a deadline."),

  pricing: z.string()
    .min(1, "Pricing is required."),
})
