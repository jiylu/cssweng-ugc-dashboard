import * as React from "react"
import { isValidDate, formatDate } from "@/src/utils/date"

export function useDatePickerInput(value: string, onChange: (iso: string) => void, minDate?: Date, maxDate?: Date) {
  const selectedDate = React.useMemo(() => {
    if (!value) return undefined
    console.log("value received:", value)
    const [datePart] = value.split("T")
    const [year, month, day] = datePart.split("-").map(Number)
    const result = new Date(Date.UTC(year, month - 1, day))
    console.log("selectedDate created:", result.toISOString())
    return result
  }, [value])
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState<Date | undefined>(selectedDate)
  const [inputText, setInputText] = React.useState(formatDate(selectedDate))

  React.useEffect(() => {
    if (!selectedDate) return
    setInputText(formatDate(selectedDate))
    setMonth(selectedDate)
  }, [selectedDate])

function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
  const raw = e.target.value
  setInputText(raw)

  if (!raw) {
    onChange("")
    return
  }

  const parts = raw.split("/")
  if (parts.length === 3) {
    const [month, day, year] = parts
    const m = Number(month)
    const d = Number(day)
    const y = Number(year)

    const utc = new Date(Date.UTC(y, m - 1, d))

    const isExact =
      utc.getUTCFullYear() === y &&
      utc.getUTCMonth() === m - 1 &&
      utc.getUTCDate() === d

    const minimumUtc = minDate
      ? Date.UTC(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
      : undefined
    const isOnOrAfterMinimum = minimumUtc === undefined || utc.getTime() >= minimumUtc
    const maximumUtc = maxDate
      ? Date.UTC(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())
      : undefined
    const isOnOrBeforeMaximum = maximumUtc === undefined || utc.getTime() <= maximumUtc

    if (isValidDate(utc) && isExact && isOnOrAfterMinimum && isOnOrBeforeMaximum) {
      setMonth(utc)
      onChange(utc.toISOString())
    } else {
      onChange("")
    }
  } else {
    onChange("")
  }
}

  return { 
          selectedDate, 
          open, 
          setOpen, 
          month, 
          setMonth, 
          inputText, 
          setInputText, 
          handleTextChange 
         }
}
