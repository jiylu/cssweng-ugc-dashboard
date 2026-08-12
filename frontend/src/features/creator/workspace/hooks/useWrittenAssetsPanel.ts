import { useState } from "react"

export function useWrittenAssetsPanel() {
  const [content, setContent] = useState<string>("")

  return {
    content,
    setContent
  }
}