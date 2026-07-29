import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

interface FeesSectionProps {
  baseFee: number
  tax: number
  taxRate: number
  total: number
  currency: string
}

export function FeesSection({ baseFee, tax, taxRate, total, currency }: FeesSectionProps) {
  function formatAmount(amount: number) {
    return `${currency} ${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-foreground">4. Fees & Optional Add-Ons</h3>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="text-xs text-muted-foreground">BASE FEE</TableCell>
            <TableCell className="text-xs text-right font-medium">{formatAmount(baseFee)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-xs text-muted-foreground">TAX ({taxRate}%)</TableCell>
            <TableCell className="text-xs text-right font-medium">{formatAmount(tax)}</TableCell>
          </TableRow>
          <TableRow className="bg-muted font-bold">
            <TableCell className="text-xs font-bold">Total Payout</TableCell>
            <TableCell className="text-xs text-right font-bold">{formatAmount(total)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}