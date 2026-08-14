import z from "zod"

const toText = (html: string) => html.replace(/<[^>]*>/g, "").trim()

export const writtenAssetsSchema = z.object({
  content: z.string()
    .refine((html) => toText(html).length > 0, "Written assets content is required.")
    .refine((html) => toText(html).length >= 50, "Written assets content must be at least 50 characters."),
})
