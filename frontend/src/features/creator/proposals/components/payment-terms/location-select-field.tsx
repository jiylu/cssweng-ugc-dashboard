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
}

export function LocationSelectField({ label, value, onValueChange, options, placeholder, loading, disabled, error }: LocationSelectFieldProps) {
  const displayPlaceholder = loading ? "Loading..." : placeholder

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-foreground">{label}</label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className="bg-white border-border rounded-[3px] text-sm whitespace-normal text-left h-auto min-h-8">
          <SelectValue placeholder={displayPlaceholder} />
        </SelectTrigger>
        <SelectContent position="popper" className="max-w-[var(--radix-select-trigger-width)]">
          {options.map((opt) => (
            <SelectItem key={opt.key} value={opt.value} className="whitespace-normal break-words">{opt.value}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs mt-1 text-[#ff6467]">{error}</p>}
    </div>
  )
}
