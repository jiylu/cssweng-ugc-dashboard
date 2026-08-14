"use client"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { Receipt, Eye, ArrowRight, CircleCheck, ExternalLink } from "lucide-react"
import { Card } from "@/src/components/atoms/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  getPaymentForCampaign,
  validatePayment,
  type Payment,
} from "@/src/features/creator/workspace/services/payments-api"
import {
  getInvoiceForCampaign,
  uploadInvoice,
  type Invoice,
} from "@/src/features/creator/workspace/services/invoices-api"

interface InvoiceDetailsCardProps {
  campaignId: string
  onPrevious?: () => void
  onNext?: () => void
}

export function InvoiceDetailsCard({ campaignId, onPrevious, onNext }: InvoiceDetailsCardProps) {
  const [payment, setPayment] = useState<Payment | null>(null)
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const invoiceInputRef = useRef<HTMLInputElement>(null)
  const [checked, setChecked] = useState(false)
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      getPaymentForCampaign(campaignId),
      getInvoiceForCampaign(campaignId),
    ])
      .then(([paymentResult, invoiceResult]) => {
        if (!cancelled) {
          setPayment(paymentResult)
          setInvoice(invoiceResult)
          setChecked(true)
        }
      })
      .catch(() => {
        // ignore silent fetch errors on initial load
      })
      .finally(() => {
        if (!cancelled) setInitialLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [campaignId])

  const handleViewInvoice = async () => {
    setIsLoadingInvoice(true)
    try {
      const result = await getInvoiceForCampaign(campaignId)
      setInvoice(result)
      setChecked(true)
      if (result) {
        window.open(result.invoice_url, "_blank", "noopener,noreferrer")
      } else {
        toast.info("No invoice has been sent yet.")
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load invoice.",
      )
    } finally {
      setIsLoadingInvoice(false)
    }
  }

  const handleSendInvoice = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    setIsSending(true)
    try {
      const uploadedInvoice = await uploadInvoice(campaignId, file)
      setInvoice(uploadedInvoice)
      toast.success("Invoice sent.")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to send invoice.",
      )
    } finally {
      setIsSending(false)
    }
  }

  const handleValidatePayment = async () => {
    if (!payment?.proof_payment_url) return
    setIsSending(true)
    try {
      const validated = await validatePayment(payment.public_id)
      setPayment(validated)
      toast.success("Payment validated.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to validate payment.")
    } finally {
      setIsSending(false)
    }
  }

  if (initialLoading) {
    return (
      <Card className="flex flex-col items-center gap-4 overflow-hidden p-8">
        <p className="text-sm text-muted-foreground">Loading invoice...</p>
      </Card>
    )
  }

  if (payment?.is_payment_verified) {
    return (
      <Card className="flex flex-col gap-4 overflow-hidden p-0">
        <h2 className="px-5 pt-4 pb-3 text-xl text-foreground">
          Invoice Completed
        </h2>
        <Separator />
        <div className="flex flex-col items-center gap-4 px-8 pb-6 text-center">
          <CircleCheck className="text-[#2d7a3a]" size={44} strokeWidth={1.5} />
          <div className="flex flex-col gap-1">
            <p className="text-base font-medium text-foreground">
              Payment verified successfully
            </p>
            <p className="text-sm text-muted-foreground">
              The invoice has been completed and the campaign payment is confirmed.
            </p>
          </div>
          <div className="flex w-full max-w-64 flex-col gap-1 rounded-[3px] border border-[#2d7a3a]/30 bg-[#e7f4ea] px-3 py-2 text-left text-xs text-[#2d7a3a]">
            <span>Invoice ID: {payment.public_id}</span>
            {payment.verified_at && (
              <span>
                Verified: {new Date(payment.verified_at).toLocaleDateString()}
              </span>
            )}
          </div>
          <Button asChild type="button" variant="outline" className="w-full max-w-64 rounded-[3px] border-[#6b1fa8] text-[#6b1fa8] hover:bg-[#6b1fa8]/5 hover:text-[#6b1fa8]">
            <a href={payment.proof_payment_url ?? undefined} target="_blank" rel="noreferrer">
              View Proof of Payment
              <ExternalLink size={16} />
            </a>
          </Button>
          <div className="flex w-full max-w-64 items-center justify-between gap-3">
            {onPrevious && (
              <Button
                type="button"
                variant="outline"
                onClick={onPrevious}
                className="w-full flex-1 rounded-[3px] border-[#6b1fa8] text-[#6b1fa8]"
              >
                Previous
              </Button>
            )}
            {onNext && (
              <Button
                type="button"
                onClick={onNext}
                className="w-full flex-1 rounded-[3px] bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white"
              >
                Next
                <ArrowRight size={16} className="ml-1" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    )
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

        {checked && !invoice && (
          <p className="text-xs text-muted-foreground">
            The invoice has not been sent yet.
          </p>
        )}

        {invoice && !payment?.proof_payment_url && (
          <p className="text-xs text-muted-foreground">
            Invoice sent. Waiting for the client to upload proof of payment.
          </p>
        )}

        {invoice && (
          <div className="flex flex-col gap-1 w-full max-w-64 rounded-[3px] border border-border px-3 py-2 text-xs text-muted-foreground">
            <span>Invoice ID: {invoice.public_id}</span>
            {payment.proof_payment_url && <a
              href={payment.proof_payment_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#6b1fa8] hover:underline"
            >
              Proof of Payment
              <ExternalLink size={12} />
            </a>}
            <span>
              Status:{" "}
              {payment.is_payment_verified
                ? "Verified"
                : payment.proof_payment_url
                  ? "Pending verification"
                  : "Awaiting proof of payment"}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-2 w-full max-w-64">
          {invoice && <Button
            type="button"
            variant="outline"
            className="rounded-[3px] border-[#6b1fa8] text-[#6b1fa8] hover:bg-[#6b1fa8]/5 hover:text-[#6b1fa8]"
            onClick={handleViewInvoice}
            disabled={isLoadingInvoice || isSending}
          >
            {isLoadingInvoice ? "Loading..." : "View Invoice"}
            <Eye size={16} />
          </Button>}

          {payment?.proof_payment_url && <Button
            type="button"
            className="rounded-[3px] bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white"
            onClick={handleValidatePayment}
            disabled={isSending || isLoadingInvoice}
          >
            {isSending ? "Validating..." : "Validate Payment"}
            <ArrowRight size={16} />
          </Button>}

          <input
            ref={invoiceInputRef}
            type="file"
            className="hidden"
            accept="application/pdf,image/*"
            onChange={handleSendInvoice}
          />
          {!invoice && (
            <Button
              type="button"
              className="rounded-[3px] bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white"
              onClick={() => invoiceInputRef.current?.click()}
              disabled={isSending || isLoadingInvoice}
            >
              {isSending ? "Sending..." : "Upload and Send Invoice"}
              <ArrowRight size={16} />
            </Button>
          )}
          {onPrevious && (
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-[3px] border-[#6b1fa8] text-[#6b1fa8]"
              onClick={onPrevious}
            >
              Previous: Deliverables
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
