"use client"
import { useState } from "react"
import { toast } from "sonner"
import { Receipt, Eye, ArrowRight, ExternalLink } from "lucide-react"
import { Card } from "@/src/components/atoms/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  getPaymentForCampaign,
  validatePayment,
  type Payment,
} from "@/src/features/creator/workspace/services/payments-api"

interface InvoiceDetailsCardProps {
  campaignId: string
}

export function InvoiceDetailsCard({ campaignId }: InvoiceDetailsCardProps) {
  const [payment, setPayment] = useState<Payment | null>(null)
  const [checked, setChecked] = useState(false)
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const handleViewInvoice = async () => {
    setIsLoadingInvoice(true)
    try {
      const result = await getPaymentForCampaign(campaignId)
      setPayment(result)
      setChecked(true)
      if (result) {
        toast.success("Invoice loaded.")
      } else {
        toast.info("No client payment yet.")
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load invoice.",
      )
    } finally {
      setIsLoadingInvoice(false)
    }
  }

  const handleSendInvoice = async () => {
    setIsSending(true)
    try {
      let current = payment
      if (!current) {
        current = await getPaymentForCampaign(campaignId)
      }
      if (!current) {
        toast.error("No client payment yet to send.")
        return
      }
      const validated = await validatePayment(current.public_id)
      setPayment(validated)
      toast.success("Invoice sent.")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to send invoice.",
      )
    } finally {
      setIsSending(false)
    }
  }

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

        {checked && !payment && (
          <p className="text-xs text-muted-foreground">
            No client payment yet.
          </p>
        )}

        {payment && (
          <div className="flex flex-col gap-1 w-full max-w-64 rounded-[3px] border border-border px-3 py-2 text-xs text-muted-foreground">
            <span>Invoice ID: {payment.public_id}</span>
            <a
              href={payment.proof_payment_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#6b1fa8] hover:underline"
            >
              Proof of Payment
              <ExternalLink size={12} />
            </a>
            <span>
              Status:{" "}
              {payment.is_payment_verified ? "Verified" : "Pending verification"}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-2 w-full max-w-64">
          <Button
            type="button"
            variant="outline"
            className="rounded-[3px] border-[#6b1fa8] text-[#6b1fa8] hover:bg-[#6b1fa8]/5 hover:text-[#6b1fa8]"
            onClick={handleViewInvoice}
            disabled={isLoadingInvoice || isSending}
          >
            {isLoadingInvoice ? "Loading..." : "View Invoice"}
            <Eye size={16} />
          </Button>

          <Button
            type="button"
            className="rounded-[3px] bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white"
            onClick={handleSendInvoice}
            disabled={isSending || isLoadingInvoice}
          >
            {isSending ? "Sending..." : "Send Invoice"}
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </Card>
  )
}
