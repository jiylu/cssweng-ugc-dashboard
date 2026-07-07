import { Card } from "@/src/components/atoms/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaymentInvoicingProps {
  paymentSchedule: string
  setPaymentSchedule: (v: string) => void
  paymentMethod: string
  setPaymentMethod: (v: string) => void
  errors: Record<string, string>
}

export function PaymentInvoicingSection({ paymentSchedule, setPaymentSchedule, paymentMethod, setPaymentMethod, errors }: PaymentInvoicingProps) {
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-2xl font-normal text-foreground">Payment & Invoicing</h2>
      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground uppercase tracking-[0.03em]">PAYMENT SCHEDULE</label>
          <Select value={paymentSchedule} onValueChange={setPaymentSchedule}>
            <SelectTrigger className="border-border rounded-[3px] text-sm">
              <SelectValue placeholder="Select Payment Schedule" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="due_on_final_delivery">Due on Final Delivery</SelectItem>
              <SelectItem value="net_15">Net 15</SelectItem>
              <SelectItem value="net_30">Net 30</SelectItem>
              <SelectItem value="50_50">50% Initial Deposit, 50% Due on Final Delivery</SelectItem>
            </SelectContent>
          </Select>
          {errors.paymentSchedule && <p className="text-xs mt-1 text-[#ff6467]">{errors.paymentSchedule}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground uppercase tracking-[0.03em]">PAYMENT METHOD</label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger className="border-border rounded-[3px] text-sm">
              <SelectValue placeholder="Select Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="gcash">GCash</SelectItem>
              <SelectItem value="paypal">PayPal</SelectItem>
              <SelectItem value="check">Check</SelectItem>
            </SelectContent>
          </Select>
          {errors.paymentMethod && <p className="text-xs mt-1 text-[#ff6467]">{errors.paymentMethod}</p>}
        </div>
      </div>
    </Card>
  )
}