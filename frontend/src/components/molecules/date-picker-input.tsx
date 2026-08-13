"use client"
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDatePickerInput } from "@/src/hooks/useDatePickerInput";
import { formatDate } from "@/src/utils/date"

interface DatePickerInputProps {
  value: string
  onChange: (iso: string) => void
  placeholder?: string
  minDate?: Date
}

export function DatePickerInput({ value, onChange, placeholder = "mm/dd/yyyy", minDate }: DatePickerInputProps) {
  const { selectedDate, open, setOpen, month, setMonth, inputText, setInputText, handleTextChange } = useDatePickerInput(value, onChange, minDate)

  return (
    <InputGroup className="border-muted">
      <InputGroupInput
        value={inputText}
        placeholder={placeholder}
        onChange={handleTextChange}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault()
            setOpen(true)
          }
        }}
      />
      <InputGroupAddon align="inline-end">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <InputGroupButton variant="ghost" size="icon-xs" aria-label="Select date">
              <CalendarIcon />
              <span className="sr-only">Select date</span>
            </InputGroupButton>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="end" alignOffset={-8} sideOffset={10}>
            <Calendar
              mode="single"
              selected={selectedDate}
              month={month}
              onMonthChange={setMonth}
              disabled={minDate ? { before: minDate } : undefined}
              onSelect={(date: Date | undefined) => {
              if (date) {
                console.log("raw date from calendar:", date.toString())
                console.log("date parts:", date.getFullYear(), date.getMonth(), date.getDate())
                const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
                console.log("formatDate result:", formatDate(utc))
                onChange(utc.toISOString())
                setInputText(formatDate(utc))
              } else {
                onChange("")
                setInputText("")
              }
              setOpen(false)
            }}
            />
          </PopoverContent>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  )
}
