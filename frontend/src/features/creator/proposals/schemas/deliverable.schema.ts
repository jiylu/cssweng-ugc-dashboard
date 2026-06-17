import z from "zod";

export const deliverableSchema = z.object({
  deliverable_title: z.string()
      .min(1, "Deliverable title is required.")
      .max(50, "Deliverable name must be less than 50 characters."),

  description: z.string()
      .min(20, "Deliverable description must be at least 20 characters.")
      .max(100, "Description must be less than 100 characters."),
  
  deliverable_type: z.string()
    .min(1, "Please select a deliverable type."),
  
  deadline: z.string()
    .min(1, "Please select a deadline."),

  pricing: z.string()
    .min(1, "Pricing is required."),
})
