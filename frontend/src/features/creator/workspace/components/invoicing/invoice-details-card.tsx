import { Receipt, Eye, ArrowRight } from "lucide-react"
import { Card } from "@/src/components/atoms/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function InvoiceDetailsCard() {
  return (
    <Card className="flex flex-col gap-4 p-0 overflow-hidden">
      <h2 className="text-xl text-foreground px-5 pt-4 pb-3">
        Invoice Details
      </h2>

      <Separator />

      <div className="flex flex-col items-center gap-4 px-8 pb-6">
        <Receipt className="text-[#6b1fa8]" size={40} strokeWidth={1.5} />

        <p className="text-sm text-muted-foreground text-center">
          Once all deliverables have been submitted, you may issue the
          invoice to the client. Be sure to review the invoice carefully
          before submitting it.
        </p>

        <div className="flex flex-col gap-2 w-full max-w-64">
          <Button
            variant="outline"
            className="rounded-[3px] border-[#6b1fa8] text-[#6b1fa8] hover:bg-[#6b1fa8]/5 hover:text-[#6b1fa8]"
          >
            View Invoice
            <Eye size={16} />
          </Button>

          <Button
            className="rounded-[3px] bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white"
          >
            Send Invoice
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </Card>
  )
}