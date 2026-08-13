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
          <label className="text-sm text-muted-foreground uppercase tracking-[0.03em]">PAYMENT SCHEDULE<span className="text-[#ff6467] ml-1">*</span></label>
          <Select value={paymentSchedule} onValueChange={setPaymentSchedule}>
            <SelectTrigger className="bg-white border-border rounded-[3px] text-sm h-[38px] w-full text-left [&>span]:truncate">
              <SelectValue placeholder="Select payment schedule" />
            </SelectTrigger>
            <SelectContent className="p-1 max-w-[var(--radix-select-trigger-width)]">
              <SelectItem value="DUE_FINAL_DELIVERY" className="rounded-[3px] text-sm cursor-pointer">Due on Final Delivery</SelectItem>
              <SelectItem value="NET_15" className="rounded-[3px] text-sm cursor-pointer">Net 15</SelectItem>
              <SelectItem value="NET_30" className="rounded-[3px] text-sm cursor-pointer">Net 30</SelectItem>
              <SelectItem value="50_DEPOSIT_50_FINAL" className="rounded-[3px] text-sm cursor-pointer">50% Initial Deposit, 50% Due on Final Delivery</SelectItem>
            </SelectContent>
          </Select>
          {errors.paymentSchedule && <p className="text-xs mt-1 text-[#ff6467]">{errors.paymentSchedule}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground uppercase tracking-[0.03em]">PAYMENT METHOD<span className="text-[#ff6467] ml-1">*</span></label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            {/* Set standard h-[40px] and w-full */}
            <SelectTrigger className="bg-white border-border rounded-[3px] text-sm h-[40px] w-full text-left">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent className="p-1 max-w-[var(--radix-select-trigger-width)]">
              <SelectItem value="bank_transfer" className="rounded-[3px] text-sm cursor-pointer">Bank Transfer</SelectItem>
              <SelectItem value="gcash" className="rounded-[3px] text-sm cursor-pointer">GCash</SelectItem>
              <SelectItem value="paypal" className="rounded-[3px] text-sm cursor-pointer">PayPal</SelectItem>
              <SelectItem value="check" className="rounded-[3px] text-sm cursor-pointer">Check</SelectItem>
            </SelectContent>
          </Select>
          {errors.paymentMethod && <p className="text-xs mt-1 text-[#ff6467]">{errors.paymentMethod}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground uppercase tracking-[0.03em]">SET TAX RATE<span className="text-[#ff6467] ml-1">*</span></label>
          <InputGroup className="border border-border rounded-[3px] bg-white w-full h-[38px] flex items-center pr-1">
            <InputGroupInput
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(Math.min(60, Math.max(1, Number(e.target.value))))}
              className="border-0 p-0 h-full text-sm shadow-none focus-visible:ring-0 px-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1"
            />
            <InputGroupAddon align="inline-end" className="text-sm text-muted-foreground">
              %
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <div className="flex flex-col shrink-0 px-1">
                <ChevronUp size={12} className="cursor-pointer text-muted-foreground hover:text-[#6b1fa8]" onClick={() => setTaxRate(taxRate + 1)} />
                <ChevronDown size={12} className="cursor-pointer text-muted-foreground hover:text-[#6b1fa8]" onClick={() => setTaxRate(Math.max(1, taxRate - 1))} />
              </div>
            </InputGroupAddon>
          </InputGroup>
          {errors.taxRate && <p className="text-xs mt-1 text-[#ff6467]">{errors.taxRate}</p>}
        </div>
      </div>
    </Card>
  )
}