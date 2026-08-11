import z from "zod";

export const deliverableSchema = z.object({
  description: z.string()
    .min(50, "Deliverable requirement must be at least 50 characters."),
  
  deliverableType: z.string()
    .min(1, "Deliverable type is required."),
  
  draftDeadline: z.string()
    .min(1, "Please select a valid deadline."),

  pricing: z.string()
    .min(1, "Pricing is required."),

  quantity: z.string()
    .min(1, "Quantity is required."),

  platform: z.string()
    .min(1, "Platform is required."),

  contentType: z.string()
    .min(1, "Content type is required."),

  postDate: z.string()
    .min(1, "Post date is required."),
}).refine((data) => {
  if (!data.postDate || !data.draftDeadline) return true
  return new Date(data.postDate) <= new Date(data.draftDeadline)
}, {
  message: "Post date cannot be after the due date.",
  path: ["postDate"]
})
