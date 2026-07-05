import z from "zod";

export const deliverableSchema = z.object({
  deliverable_title: z.string()
      .min(1, "Deliverable title is required.")
      .max(50, "Deliverable name must be less than 50 characters."),

  description: z.string()
      .min(20, "Deliverable description must be at least 20 characters.")
      .max(100, "Description must be less than 100 characters."),
  
  deliverable_type: z.string()
    .min(1, "Deliverable type is required."),
  
  deadline: z.string()
    .min(1, "Please select a valid deadline."),

  pricing: z.string()
    .min(1, "Pricing is required."),

  quantity: z.string()
    .min(1, "Quantity is required."),

  content_type: z.string()
    .min(1, "Content type is required."),

  post_date: z.string()
    .min(1, "Post date is required."),
})
