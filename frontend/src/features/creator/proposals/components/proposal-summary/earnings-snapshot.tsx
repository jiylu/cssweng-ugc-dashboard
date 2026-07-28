import { Card } from "@/src/components/atoms/card"
import { Separator } from "@/components/ui/separator"

interface EarningsSnapshotProps {
  currency: string
  total: number
  baseFee: number
  tax: number
  taxRate: number
  startDate: string
  endDate: string
  platforms: string[]
}

export function EarningsSnapshot({ currency, total, baseFee, tax, taxRate, startDate, endDate, platforms }: EarningsSnapshotProps) {
  function formatAmount(amount: number) {
    return `${currency} ${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
  }

  return (
    <Card className="flex flex-col gap-3 p-5">
      <p className="text-xs text-muted-foreground uppercase tracking-[0.03em]">TOTAL PAYOUT</p>
      <p className="text-3xl font-bold text-foreground">{formatAmount(total)}</p>

      <Separator />

      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">BASE FEE</span>
          <span className="text-foreground font-medium">{formatAmount(baseFee)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">TAX ({taxRate}%)</span>
          <span className="text-foreground font-medium">{formatAmount(tax)}</span>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-2 text-sm">
        <p className="text-xs text-muted-foreground uppercase tracking-[0.03em]">Campaign Quick Glance</p>
        <div className="flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">CLIENT</p>
          <p className="text-sm text-foreground font-medium">Client Name</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">PERIOD</p>
          <p className="text-sm text-foreground">{startDate} - {endDate}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">CONTENT</p>
          <p className="text-sm text-foreground">{platforms.join(", ")}</p>
        </div>
      </div>
    </Card>
  )
}