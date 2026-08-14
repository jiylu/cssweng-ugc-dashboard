import { Card } from "@/src/components/atoms/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ChevronUp, ChevronDown } from "lucide-react"

interface ExpensesProps {
  reimbursementDays: number
  setReimbursementDays: (v: number) => void
  giftedProductTerms: string
  setGiftedProductTerms: (v: string) => void
  cancellationDays: number
  setCancellationDays: (v: number) => void
  errors: Record<string, string>
}

export function Expenses({ 
                          reimbursementDays, setReimbursementDays, 
                          giftedProductTerms, setGiftedProductTerms, 
                          cancellationDays, setCancellationDays, 
                          errors }: ExpensesProps) 
                        {
  return (
    <div className="grid grid-cols-[3fr_2fr] gap-6">

      {/* Expenses */}
      <Card className="flex flex-col gap-4">
        <h2 className="text-2xl font-normal text-foreground">Expenses, Purchases, and Product Delivery</h2>
        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground uppercase tracking-[0.03em]">REIMBURSEMENT PERIOD<span className="text-[#ff6467] ml-1">*</span></label>
          <div className="flex items-center gap-2">
            <InputGroup className="border border-border rounded-[3px] bg-white w-full">
              <InputGroupAddon>
                <div className="flex flex-col shrink-0 px-1.5">
                  <ChevronUp size={12} className="cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setReimbursementDays(Math.min(60, reimbursementDays + 1))} />
                  <ChevronDown size={12} className="cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setReimbursementDays(Math.max(1, reimbursementDays - 1))} />
                </div>
              </InputGroupAddon>
              <InputGroupInput
                type="number"
                value={reimbursementDays}
                onChange={(e) => setReimbursementDays(Math.max(1, 60))}
                className="border-0 p-0 h-auto text-sm shadow-none focus-visible:ring-0 px-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <InputGroupAddon align="inline-end">DAYS</InputGroupAddon>
            </InputGroup>
          </div>
          {errors.reimbursementDays && <p className="text-xs mt-1 text-[#ff6467]">{errors.reimbursementDays}</p>}
          <p className="text-xs text-muted-foreground italic mt-1">NOTE: Approved expenses must be reimbursed by Brand within set amount of days after Creator submits valid receipts.</p>
          <div className="flex flex-col gap-1 mt-3">
            <label className="text-sm text-muted-foreground uppercase tracking-[0.03em]">GIFTED PRODUCT TERMS</label>
            <Textarea
              placeholder="Enter gifted product terms. N/A if none."
              value={giftedProductTerms}
              onChange={(e) => setGiftedProductTerms(e.target.value)}
              className="resize-none min-h-[80px] border border-border rounded-[3px] text-sm bg-transparent"
            />
            {errors.giftedProductTerms && <p className="text-xs mt-1 text-[#ff6467]">{errors.giftedProductTerms}</p>}
            <p className="text-xs text-muted-foreground italic mt-1">NOTE: If gifted products are part of the compensation, any return, resale, damage, warranty, or repayment terms must be clearly listed here.</p>
          </div>
        </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-muted-foreground uppercase tracking-[0.03em]">TERMS</label>
            <div className="border border-border rounded-[3px] p-3 text-xs flex flex-col gap-2 bg-[#F2F0EA] h-full leading-snug">
              <p>1. BRAND WILL PROVIDE ANY REQUIRED PRODUCTS, ACCESS, DISCOUNT CODES, TICKETS, OR LOCATION DETAILS NEEDED FOR THE CONTENT.</p>
              <p>2. CREATOR IS NOT REQUIRED TO MAKE OUT-OF-POCKET PURCHASES UNLESS APPROVED IN WRITING BY BOTH PARTIES.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Cancellation */}
      <Card className="flex flex-col gap-4">
        <h2 className="text-2xl font-normal text-foreground">Cancellation and Termination</h2>
        <Separator />

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-muted-foreground uppercase tracking-[0.03em]">CANCELLATION PERIOD<span className="text-[#ff6467] ml-1">*</span></label>
            <div className="flex items-center gap-2">
              <InputGroup className="border border-border rounded-[3px] bg-white w-full">
                <InputGroupAddon>
                  <div className="flex flex-col shrink-0 px-1.5">
                    <ChevronUp size={12} className="cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setCancellationDays(cancellationDays + 1)} />
                    <ChevronDown size={12} className="cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setCancellationDays(Math.max(1, cancellationDays - 1))} />
                  </div>
                </InputGroupAddon>
                <InputGroupInput
                  type="number"
                  value={cancellationDays}
                  onChange={(e) => setCancellationDays(Math.max(1, Number(e.target.value)))}
                  className="border-0 p-0 h-auto text-sm shadow-none focus-visible:ring-0 px-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <InputGroupAddon align="inline-end">DAYS NOTICE</InputGroupAddon>
              </InputGroup>
            </div>
            <p className="text-xs text-muted-foreground italic mt-1">Either Party may terminate this Agreement if the other Party materially breaches the Agreement and fails to fix the issue within the SET AMOUNT of days after written notice.</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-muted-foreground uppercase tracking-[0.03em]">TERMS</label>
            <div className="border border-border rounded-[3px] p-3 text-xs flex flex-col gap-2 bg-[#F2F0EA] leading-snug">
              <p>1. IF BRAND CANCELS AFTER WORK HAS BEGUN, CREATOR MAY INVOICE FOR WORK COMPLETED, TIME RESERVED, PRODUCTION COSTS, AND ANY APPROVED EXPENSES.</p>
              <p>2. IF CREATOR CANNOT COMPLETE THE DELIVERABLES DUE TO ILLNESS, EMERGENCY, SHIPPING DELAY, PRODUCT ISSUE, PLATFORM ISSUE, OR OTHER REASONABLE CAUSE, THE PARTIES WILL WORK IN GOOD FAITH TO UPDATE THE TIMELINE.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}