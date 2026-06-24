import * as React from "react"

function isValidDate(date: Date | undefined) {
  if (!date) return false
  if (!isNaN(date.getTime()) === false) return false
  const year = date.getFullYear()
  return year >= 1000 && year <= 9999
}

export function formatDate(date: Date | undefined) {
  if (!date) return ""
  if (date.getFullYear() < 1000) return ""
  return date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })
}

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