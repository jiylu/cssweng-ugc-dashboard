"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import dynamic from "next/dynamic"
import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSubmittedProposalDetails } from "@/src/features/creator/proposals/hooks/useSubmittedProposalDetails"
import { mapCampaignSetupToProposalSummary } from "@/src/features/creator/proposals/utils/mapCampaignSetupToProposalSummary"
import { getContractSignatures } from "@/src/features/client/contracts/services/contracts-api"

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

interface SignedContractPreviewDialogProps {
  open: boolean
  campaignId: string
  contractPublicId: string
  creatorName: string
  onClose: () => void
}

export function SignedContractPreviewDialog({
  open,
  campaignId,
  contractPublicId,
  creatorName,
  onClose,
}: SignedContractPreviewDialogProps) {
  const { data, isLoading, isError } = useSubmittedProposalDetails(
    open ? campaignId : undefined
  )
  const { data: signatures } = useQuery({
    queryKey: ["contract-signatures", contractPublicId],
    queryFn: () => getContractSignatures(contractPublicId),
    enabled: open,
  })

  const summary = useMemo(
    () => (data ? mapCampaignSetupToProposalSummary(data, creatorName) : null),
    [data, creatorName]
  )

  const signatureImages = useMemo(() => {
    if (!signatures) return undefined
    const client = signatures.find((signature) => signature.signer_role === "CLIENT")
    const creator = signatures.find((signature) => signature.signer_role === "CREATOR")
    if (!client && !creator) return undefined
    return {
      client: client?.signature_url,
      creator: creator?.signature_url,
    }
  }, [signatures])

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="!max-w-4xl w-full bg-[#F2F0EA]" showCloseButton>
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal text-foreground">
            Signed Contract
          </DialogTitle>
        </DialogHeader>

        <div className="w-full h-[520px] bg-[#78746e] rounded-[3px] mt-2">
          {isLoading && (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-white text-sm tracking-wide">Loading contract details...</p>
            </div>
          )}
          {!isLoading && isError && (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-white text-sm tracking-wide">Failed to load contract.</p>
            </div>
          )}
          {!isLoading && summary && open && (
            <ContractAgreementPreview summary={summary} signatures={signatureImages} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
