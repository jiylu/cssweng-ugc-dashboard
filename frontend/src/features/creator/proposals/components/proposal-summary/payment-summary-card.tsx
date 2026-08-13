import { Card } from "@/src/components/atoms/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/src/features/creator/proposals/utils/formatCurrency"

interface PaymentSummaryCardProps {
    baseFee: number
    addOnsTotal: number
    taxRate: number
    tax: number
    total: number
    currency: string
}

export function PaymentSummaryCard({ baseFee, addOnsTotal, taxRate, tax, total, currency }: PaymentSummaryCardProps) {
    function fmt(amount: number) {
        return formatCurrency(amount, currency)
    }

    return (
        <Card className="flex flex-col gap-4 p-6">
            <h2 className="text-2xl font-normal text-foreground">Payment Summary</h2>
            <Separator />

            <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm text-foreground">
                    <span>Base Fee</span>
                    <span>{fmt(baseFee)}</span>
                </div>
                {addOnsTotal > 0 && (
                    <div className="flex justify-between text-sm text-foreground">
                    <span>Add Ons (Usage Rights)</span>
                    <span>{fmt(addOnsTotal)}</span>
                    </div>
                )}
                <div className="flex justify-between text-sm text-foreground">
                    <span>Tax ({taxRate}%)</span>
                    <span>{fmt(tax)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-[16px] font-bold text-[#6b1fa8]">
                    <span className="uppercase tracking-wide">Total Due</span>
                    <span>{fmt(total)}</span>
                </div>
            </div>
        </Card>
    )
}
