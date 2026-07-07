import { z } from "zod"

export const giftedProductSchema = z.object({
  productName: z.string()
    .min(1, "Product name is required.")
    .max(100, "Product name must be less than 100 characters."),
  value: z.string()
    .min(1, "Value is required."),
  ownershipTerms: z.string()
    .min(1, "Ownership terms are required.").max(500, "Ownership terms must be less than 500 characters."),
  shippingAddress: z.string()
    .min(1, "Shipping address is required.").max(200, "Shipping address must be less than 200 characters."),
  deliveryInstructions: z.string()
    .optional(),
})

export const paymentTermsSchema = z.object({
  giftedProducts: z.array(giftedProductSchema),
  paymentSchedule: z.string()
    .min(1, "Payment schedule is required."),
  paymentMethod: z.string()
    .min(1, "Payment method is required."),
})