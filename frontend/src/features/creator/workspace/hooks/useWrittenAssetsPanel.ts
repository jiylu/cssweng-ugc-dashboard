import { useState } from "react"
import { validateWrittenAssets } from "../utils/validators"

export function useWrittenAssetsPanel() {
  const [content, setContent] = useState<string>("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  function updateContent(val: string) {
    setContent(val)
    if (errors.content) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next.content
        return next
      })
    }
  }

  function validateAndSave(onSave: (content: string) => void): boolean {
    const newErrors = validateWrittenAssets({ content })
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      onSave(content)
      return true
    }
    return false
  }

  return {
    content,
    errors,
    updateContent,
    validateAndSave,
  }
}
