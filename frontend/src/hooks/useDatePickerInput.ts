import * as React from "react"
import { isValidDate, formatDate } from "@/src/utils/date"

export function useDatePickerInput(value: string, onChange: (iso: string) => void) {
  const selectedDate = value ? new Date(value) : undefined
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState<Date | undefined>(selectedDate)
  const [inputText, setInputText] = React.useState(formatDate(selectedDate))

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    setInputText(raw)
    const parsed = new Date(raw)
    if (isValidDate(parsed)) {
      setMonth(parsed)
      onChange(parsed.toISOString())
    }
  }

  return { selectedDate, open, setOpen, month, setMonth, inputText, setInputText, handleTextChange }
}