"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import dynamic from "next/dynamic"
import { useMemo } from "react"
import { useSubmittedProposalDetails } from "@/src/features/creator/proposals/hooks/useSubmittedProposalDetails"
import { mapCampaignSetupToProposalSummary } from "@/src/features/creator/proposals/utils/mapCampaignSetupToProposalSummary"

const ContractAgreementPreview = dynamic(
  () =>
    import("@/src/features/creator/proposals/components/proposal-summary/contract-agreement-pdf").then(
      (m) => m.ContractAgreementPreview
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#78746e] rounded-[3px] flex items-center justify-center">
        <p className="text-white text-sm tracking-wide">Loading preview...</p>
      </div>
    ),
  }
)

interface SubmittedProposalPreviewDialogProps {
  publicId: string | null
  creatorName: string
  onClose: () => void
}

export function SubmittedProposalPreviewDialog({
  publicId,
  creatorName,
  onClose,
}: SubmittedProposalPreviewDialogProps) {
  const { data, isLoading, isError } = useSubmittedProposalDetails(publicId ?? undefined)

  const summary = useMemo(
    () => (data ? mapCampaignSetupToProposalSummary(data, creatorName) : null),
    [data, creatorName]
  )

  return (
    <Dialog open={!!publicId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="!max-w-4xl w-full bg-[#F2F0EA]" showCloseButton>
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal text-foreground">
            Proposal Preview
          </DialogTitle>
        </DialogHeader>

        <div className="w-full h-[520px] bg-[#78746e] rounded-[3px] mt-2">
          {isLoading && (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-white text-sm tracking-wide">Loading proposal details...</p>
            </div>
          )}
          {!isLoading && isError && (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-white text-sm tracking-wide">Failed to load proposal.</p>
            </div>
          )}
          {!isLoading && summary && publicId && (
            <ContractAgreementPreview summary={summary} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
