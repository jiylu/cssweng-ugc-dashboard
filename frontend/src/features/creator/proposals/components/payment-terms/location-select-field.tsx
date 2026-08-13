import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LocationSelectFieldProps {
  label: string
  value: string
  onValueChange: (val: string) => void
  options: { key: string; value: string }[]
  placeholder?: string
  loading?: boolean
  disabled?: boolean
  error?: string
  required?: boolean
}

export function LocationSelectField({ label, value, onValueChange, options, placeholder, loading, disabled, error, required }: LocationSelectFieldProps) {
  const displayPlaceholder = loading ? "Loading..." : placeholder

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-foreground">
        {label}
        {required && <span className="text-[#ff6467] ml-1">*</span>}
      </label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className="bg-white border-border rounded-[3px] text-sm whitespace-normal break-words text-left w-full data-[size=default]:h-auto min-h-8 items-start py-2 *:data-[slot=select-value]:min-w-0 *:data-[slot=select-value]:whitespace-normal">
          <SelectValue placeholder={displayPlaceholder} className="min-w-0 p-2 whitespace-normal break-words"/>
        </SelectTrigger>
        <SelectContent position="popper" className="p-1 max-w-[var(--radix-select-trigger-width)] max-h-[250px] overflow-y-auto">
          {options.map((opt) => (
            <SelectItem key={opt.key} value={opt.value} className="text-sm rounded-[3px] whitespace-normal break-words p-1.5">{opt.value}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs mt-1 text-[#ff6467]">{error}</p>}
    </div>
  )
}
