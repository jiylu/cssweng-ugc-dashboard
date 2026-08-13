import { Input } from "@/components/ui/input"

interface AddressFieldProps {
  label: string
  value: string
  onChange: (val: string) => void
  error?: string
  helper?: string
  placeholder?: string
  required?: boolean
}

export function AddressField({ label, value, onChange, error, helper, placeholder, required }: AddressFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-foreground">
        {label}
        {required && <span className="text-[#ff6467] ml-1">*</span>}
      </label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-white border-border rounded-[3px] text-sm"
      />
      {error && <p className="text-xs mt-1 text-[#ff6467]">{error}</p>}
      {!error && helper && <p className="text-xs text-muted-foreground">{helper}</p>}
    </div>
  )
}
