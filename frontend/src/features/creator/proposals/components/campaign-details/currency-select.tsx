import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CURRENCIES } from "@/src/features/creator/proposals/utils/currencies"

interface CurrencySelectProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function CurrencySelect({ value, onChange, error }: CurrencySelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-muted-foreground uppercase tracking-[0.03em]">CURRENCY</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="border-muted rounded-[3px] text-sm w-full">
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent className="p-1">
          {CURRENCIES.map((currency) => (
            <SelectItem key={currency.code} value={currency.code} className="text-sm rounded-[3px]">
              <span className="font-medium mr-2">{currency.code}</span>
              <span>{currency.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs mt-1 text-[#ff6467]">{error}</p>}
    </div>
  )
}