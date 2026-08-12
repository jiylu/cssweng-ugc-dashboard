import { writtenAssetsSchema } from "../schemas/written-assets.schema"

export interface WrittenAssetsData {
  content: string
}

export const validateWrittenAssets = (data: WrittenAssetsData): Record<string, string> => {
  const result = writtenAssetsSchema.safeParse(data)

  if (result.success) return {}

  const errors: Record<string, string> = {}

  for (const issue of result.error.issues) {
    errors[issue.path.join(".")] = issue.message
  }

  return errors
}
