"use client"

import dynamic from "next/dynamic"
import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { API_BASE_URL } from "@/src/config/api"
import { getContractSignatures } from "@/src/features/client/contracts/services/contracts-api"
import { useSubmittedProposalDetails } from "@/src/features/creator/proposals/hooks/useSubmittedProposalDetails"
import { mapCampaignSetupToProposalSummary } from "@/src/features/creator/proposals/utils/mapCampaignSetupToProposalSummary"

const ContractAgreementPreview = dynamic(
  () =>
    import("@/src/features/creator/proposals/components/proposal-summary/contract-agreement-pdf").then(
      (module) => module.ContractAgreementPreview,
    ),
  {
    ssr: false,
    loading: () => <ContractLoading message="Loading signed contract..." />,
  },
)

function ContractLoading({ message }: { message: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#78746e]">
      <p className="text-sm tracking-wide text-white">{message}</p>
    </div>
  )
}

async function getCreatorName(userId: string) {
  const response = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(userId)}`, {
    credentials: "include",
  })
  if (!response.ok) return "Creator"

  const user = (await response.json()) as {
    display_name?: string | null
    first_name?: string
    last_name?: string
  }
  return (
    user.display_name?.trim() ||
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    "Creator"
  )
}

interface SignedContractPanelProps {
  campaignId: string
  contractPublicId: string
  creatorId: string
}

export function SignedContractPanel({
  campaignId,
  contractPublicId,
  creatorId,
}: SignedContractPanelProps) {
  const {
    data,
    isLoading,
    isError,
    refetch: refetchDetails,
  } = useSubmittedProposalDetails(campaignId)
  const {
    data: signatures,
    isLoading: signaturesLoading,
    isError: signaturesError,
    refetch: refetchSignatures,
  } = useQuery({
    queryKey: ["contract-signatures", contractPublicId],
    queryFn: () => getContractSignatures(contractPublicId),
    staleTime: Number.POSITIVE_INFINITY,
    retry: 1,
  })
  const { data: creatorName = "Creator" } = useQuery({
    queryKey: ["contract-creator-name", creatorId],
    queryFn: () => getCreatorName(creatorId),
  })

  const summary = useMemo(
    () => (data ? mapCampaignSetupToProposalSummary(data, creatorName) : null),
    [data, creatorName],
  )
  const signatureImages = useMemo(() => {
    if (!signatures) return undefined
    const client = signatures.find((signature) => signature.signer_role === "CLIENT")
    const creator = signatures.find((signature) => signature.signer_role === "CREATOR")
    return {
      client: client?.signature_url,
      creator: creator?.signature_url,
    }
  }, [signatures])

  const loading = isLoading || signaturesLoading

  return (
    <section className="flex min-h-[550px] min-w-0 flex-1 flex-col rounded border border-[#d8d4cb] bg-white p-5">
      <div className="mb-4 border-b border-[#d8d4cb] pb-3">
        <div>
          <h2 className="text-2xl font-normal text-foreground">Signed contract</h2>
          <p className="text-sm text-muted-foreground">
            Final contract signed by both the client and creator.
          </p>
        </div>
      </div>

      <div className="h-[650px] w-full overflow-hidden rounded bg-[#78746e]">
        {loading && <ContractLoading message="Loading signed contract..." />}
        {!loading && (isError || signaturesError) && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#78746e] text-white">
            <p className="text-sm tracking-wide">Unable to load the signed contract.</p>
            <button
              type="button"
              className="rounded border border-white px-4 py-2 text-sm hover:bg-white/10"
              onClick={() => {
                void refetchDetails()
                void refetchSignatures()
              }}
            >
              Try again
            </button>
          </div>
        )}
        {!loading && !isError && !signaturesError && summary && (
          <ContractAgreementPreview summary={summary} signatures={signatureImages} />
        )}
      </div>
    </section>
  )
}
