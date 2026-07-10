import { Card } from "@/src/components/atoms/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { ChevronUp, ChevronDown } from "lucide-react"

interface PaymentInvoicingProps {
  paymentSchedule: string
  setPaymentSchedule: (v: string) => void
  paymentMethod: string
  setPaymentMethod: (v: string) => void
  taxRate: number
  setTaxRate: (v: number) => void
  errors: Record<string, string>
}

export function PaymentInvoicingSection({ paymentSchedule, setPaymentSchedule, paymentMethod, setPaymentMethod, taxRate, setTaxRate, errors }: PaymentInvoicingProps) {
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-2xl font-normal text-foreground">Payment & Invoicing</h2>
      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground uppercase tracking-[0.03em]">PAYMENT SCHEDULE</label>
          <Select value={paymentSchedule} onValueChange={setPaymentSchedule}>
            <SelectTrigger className="border-border whitespace-normal break-words h-auto justify-start py-5 rounded-[3px]">
              <SelectValue placeholder="Select payment schedule" className="text-wrap"/>
            </SelectTrigger>
            <SelectContent className="max-w-[240px]">
              <SelectItem value="DUE_FINAL_DELIVERY">Due on Final Delivery</SelectItem>
              <SelectItem value="NET_15">Net 15</SelectItem>
              <SelectItem value="NET_30">Net 30</SelectItem>
              <SelectItem value="50_DEPOSIT_50_FINAL">50% Initial Deposit, 50% Due on Final Delivery</SelectItem>
            </SelectContent>
          </Select>
          {errors.paymentSchedule && <p className="text-xs mt-1 text-[#ff6467]">{errors.paymentSchedule}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground uppercase tracking-[0.03em]">PAYMENT METHOD</label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger className="border-border rounded-[3px] text-sm max-w-[240px]">
              <SelectValue placeholder="Select payment method" />
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

        <div className="flex flex-col gap-2">
          <label className="text-sm text-muted-foreground uppercase tracking-[0.03em]">TAX RATE</label>
          <InputGroup className="border border-border rounded-[3px] bg-white w-full min-w-[240px]">
            <InputGroupInput
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(Math.min(60, Math.max(1, Number(e.target.value))))}
              className="border-0 p-0 h-auto text-sm shadow-none focus-visible:ring-0 px-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <InputGroupAddon align="inline-end">%</InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <div className="flex flex-col shrink-0 px-1.5">
                <ChevronUp size={12} className="cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setTaxRate(taxRate + 1)} />
                <ChevronDown size={12} className="cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setTaxRate(Math.max(1, taxRate - 1))} />
              </div>
            </InputGroupAddon>
          </InputGroup>
          {errors.taxRate && <p className="text-xs mt-1 text-[#ff6467]">{errors.taxRate}</p>}
        </div>
      </div>
    </Card>
  )
}