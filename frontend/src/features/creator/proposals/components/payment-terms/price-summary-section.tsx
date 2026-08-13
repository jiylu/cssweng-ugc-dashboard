import { Card } from "@/src/components/atoms/card"
import { Separator } from "@/components/ui/separator"

interface PriceSummaryProps {
  baseCreatorFee: number
  currency?: string
  taxRate: number
}

export function PriceSummarySection({ baseCreatorFee, currency = "PHP", taxRate }: PriceSummaryProps) {
  const tax = baseCreatorFee * (taxRate / 100)
  const totalDue = baseCreatorFee + tax

  function formatPHP(amount: number) {
    return `${currency} ${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
  }

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-2xl font-normal text-foreground">Price Summary</h2>
      <Separator />

      <div className="flex flex-col gap-3">
        <div className="flex justify-between text-sm text-foreground">
          <span>Base Creator Fee</span>
          <span className="font-semibold">{formatPHP(baseCreatorFee)}</span>
        </div>
        <div className="flex justify-between text-sm text-foreground">
          <span>Tax ({taxRate}%)</span>
          <span className="font-semibold">{formatPHP(tax)}</span>
        </div>

        <div className="border border-[#6b1fa8] rounded-[3px] p-4 flex flex-col items-center gap-1 mt-2">
          <span className="text-xs text-[#6b1fa8] uppercase tracking-[0.03em]">Total Due</span>
          <span className="text-2xl font-medium text-[#6b1fa8]">{formatPHP(totalDue)}</span>
        </div>
      </div>
    </Card>
  )
}