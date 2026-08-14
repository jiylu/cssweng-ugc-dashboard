"use client"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Receipt, ArrowRight, CircleCheck, ExternalLink, Send, FileText } from "lucide-react"
import { Card } from "@/src/components/atoms/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FileDropzone } from "@/src/features/creator/workspace/components/deliverables-submission/file-dropzone"
import { FileUploadItem } from "@/src/features/creator/workspace/components/deliverables-submission/file-upload-item"
import { useFileUploads } from "@/src/features/creator/workspace/hooks/useFileUpload"
import {
  getPaymentForCampaign,
  getInvoiceForCampaign,
  uploadInvoice,
  sendInvoice,
  validatePayment,
  type Payment,
  type Invoice,
} from "@/src/features/creator/workspace/services/payments-api"

interface InvoiceDetailsCardProps {
  campaignId: string
  onPrevious?: () => void
  onNext?: () => void
}

export function InvoiceDetailsCard({ campaignId, onPrevious, onNext }: InvoiceDetailsCardProps) {
  const [payment, setPayment] = useState<Payment | null>(null)
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const { files, addFiles, removeFile, clearFiles } = useFileUploads()

  useEffect(() => {
    let cancelled = false
    Promise.all([
      getPaymentForCampaign(campaignId).catch(() => null),
      getInvoiceForCampaign(campaignId).catch(() => null),
    ])
      .then(([paymentResult, invoiceResult]) => {
        if (!cancelled) {
          setPayment(paymentResult)
          setInvoice(invoiceResult)
        }
      })
      .finally(() => {
        if (!cancelled) setInitialLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [campaignId])

  const handleFileDrop = (fileList: FileList | File[]) => {
    const dropped = Array.from(fileList)
    const allowed = (file: File) =>
      file.name.toLowerCase().endsWith(".pdf")
    const rejected = dropped.filter((file) => !allowed(file))

    if (rejected.length > 0) {
      toast.error(
        `Only .pdf files are allowed. Skipped: ${rejected
          .map((f) => f.name)
          .join(", ")}`,
      )
    }

    let accepted = dropped.filter(allowed)
    // Only allow 1 file at a time
    const remainingSlots = Math.max(0, 1 - files.length)
    if (accepted.length > remainingSlots) {
      const overflow = accepted.slice(remainingSlots)
      accepted = accepted.slice(0, remainingSlots)
      toast.error(
        `Only 1 file can be uploaded. Skipped: ${overflow
          .map((f) => f.name)
          .join(", ")}`,
      )
    }

    if (accepted.length > 0) addFiles(accepted)
  }

  const handlePreview = (id: string) => {
    const target = files.find((f) => f.id === id)
    if (target) window.open(target.previewUrl, "_blank")
  }

  const handleUploadInvoice = async () => {
    const readyFiles = files.filter((f) => f.status === "done")
    if (readyFiles.length === 0) return

    setIsUploading(true)
    try {
      const result = await uploadInvoice(campaignId, readyFiles[0].file)
      setInvoice(result)
      clearFiles()
      toast.success("Invoice uploaded successfully.")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to upload invoice.",
      )
    } finally {
      setIsUploading(false)
    }
  }

  const handleSendInvoice = async () => {
    setIsSending(true)
    try {
      const result = await sendInvoice(campaignId)
      setPayment(result)
      toast.success("Invoice sent to client.")
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

  // ── Payment verified: show completed state ──
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

  // ── Main invoicing flow ──
  return (
    <Card className="flex flex-col gap-4 p-0 overflow-hidden">
      <h2 className="text-xl text-foreground px-5 pt-4 pb-3">
        Invoice Details
      </h2>

      <Separator />

      <div className="flex flex-col items-center gap-4 px-8 pb-6">
        <Receipt className="text-[#6b1fa8]" size={40} strokeWidth={1.5} />

        <p className="text-sm text-muted-foreground text-center">
          Upload your invoice as a PDF file, then send it to the client
          for review and payment.
        </p>

        {/* Step 1: Upload Invoice via dropzone (media-asset style) */}
        {!invoice && (
          <div className="flex flex-col gap-3 w-full max-w-80">
            <p className="text-xs text-muted-foreground text-center">
              Step 1: Upload your invoice
            </p>

            <FileDropzone
              onFileDrop={handleFileDrop}
              accept=".pdf"
              multiple={false}
            />

            {/* File list */}
            <div className="flex flex-col gap-2">
              {files.map((file) => (
                <FileUploadItem
                  key={file.id}
                  filename={file.filename}
                  status={file.status}
                  progress={Math.round(file.progress)}
                  onPreview={() => handlePreview(file.id)}
                  onRemove={() => removeFile(file.id)}
                />
              ))}
            </div>

            <Button
              type="button"
              className="w-full rounded-[3px] bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white"
              onClick={handleUploadInvoice}
              disabled={
                isUploading ||
                isSending ||
                files.length === 0 ||
                files.some((f) => f.status === "uploading")
              }
            >
              {isUploading ? "Uploading..." : "Submit Invoice"}
              <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
        )}

        {/* Invoice uploaded: show file info and Step 2 */}
        {invoice && (
          <>
            <div className="flex flex-col gap-1 w-full max-w-80 rounded-[3px] border border-[#2d7a3a]/30 bg-[#e7f4ea] px-3 py-2 text-xs text-[#2d7a3a]">
              <span className="flex items-center gap-1">
                <FileText size={12} />
                Invoice uploaded successfully
              </span>
              <span>Invoice ID: {invoice.public_id}</span>
              <a
                href={invoice.invoice_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[#6b1fa8] hover:underline"
              >
                View Invoice PDF
                <ExternalLink size={12} />
              </a>
            </div>

            {/* Step 2: Send Invoice to Client (only if not yet sent / no payment record) */}
            {!payment && (
              <div className="flex flex-col items-center gap-2 w-full max-w-80">
                <p className="text-xs text-muted-foreground">
                  Step 2: Send the invoice to the client
                </p>
                <Button
                  type="button"
                  className="w-full rounded-[3px] bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white"
                  onClick={handleSendInvoice}
                  disabled={isSending || isUploading}
                >
                  {isSending ? "Sending..." : "Send Invoice to Client"}
                  <Send size={16} className="ml-1" />
                </Button>
              </div>
            )}
          </>
        )}

        {/* Invoice sent: show status */}
        {payment && !payment.proof_payment_url && (
          <p className="text-xs text-muted-foreground">
            Invoice sent. Waiting for the client to upload proof of payment.
          </p>
        )}

        {/* Payment proof submitted: show info and validate button */}
        {payment && (
          <div className="flex flex-col gap-1 w-full max-w-80 rounded-[3px] border border-border px-3 py-2 text-xs text-muted-foreground">
            <span>Payment ID: {payment.public_id}</span>
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

        <div className="flex flex-col gap-2 w-full max-w-80">
          {payment?.proof_payment_url && <Button
            type="button"
            className="rounded-[3px] bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white"
            onClick={handleValidatePayment}
            disabled={isSending || isUploading}
          >
            {isSending ? "Validating..." : "Validate Payment"}
            <ArrowRight size={16} />
          </Button>}

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
  