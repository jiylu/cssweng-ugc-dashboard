import { z } from "zod"

export const addOnsSchema = z.object({
  addOns: z.array(
    z.object({
      title: z.string()
        .min(1, "Add-on name is required."),
      desc: z.string()
        .min(1, "Description is required."),
      fee: z.number()
        .min(0, "Fee must be 0 or greater."),
    })
  )
})