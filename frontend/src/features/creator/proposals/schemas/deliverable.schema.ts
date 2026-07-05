import z from "zod";

export const deliverableSchema = z.object({
  deliverableTitle: z.string()
    .min(1, "Deliverable title is required.")
    .max(50, "Deliverable name must be less than 50 characters."),

  description: z.string()
    .min(20, "Deliverable description must be at least 20 characters.")
    .max(100, "Description must be less than 100 characters."),
  
  deliverableType: z.string()
    .min(1, "Deliverable type is required."),
  
  draftDeadline: z.string()
    .min(1, "Please select a valid deadline."),

  pricing: z.string()
    .min(1, "Pricing is required."),

  quantity: z.string()
    .min(1, "Quantity is required."),

  contentType: z.string()
    .min(1, "Content type is required."),

  postDate: z.string()
    .min(1, "Post date is required."),
})
