import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { useParams, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import ContractActionPanel from "../components/contract-action-panel";
import ContractReviewHeader from "../components/contract-review-header";
import { useQuery } from "@tanstack/react-query";
import { getContractStatus, getUnsignedContractPreview } from "../services/contracts-api";
import { mapCampaignSetupToProposalSummary } from "@/src/features/creator/proposals/utils/mapCampaignSetupToProposalSummary";

const ContractAgreementPreview = dynamic(
  () => import("@/src/features/creator/proposals/components/proposal-summary/contract-agreement-pdf").then((module) => module.ContractAgreementPreview),
  { ssr: false },
);

export default function ClientContractReview() {
  const params = useParams<{ proposalId: string }>();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const proposalPublicId = searchParams.get("proposal") ?? undefined;
  const { data: contract } = useQuery({
    queryKey: ["contract", params.proposalId],
    queryFn: () => getContractStatus(params.proposalId),
  });
  const previewQuery = useQuery({
    queryKey: ["unsigned-contract-preview", proposalPublicId],
    queryFn: () => getUnsignedContractPreview(proposalPublicId!),
    enabled: Boolean(proposalPublicId),
  });
  const summary = useMemo(
    () => previewQuery.data
      ? mapCampaignSetupToProposalSummary(previewQuery.data.details, previewQuery.data.creatorName)
      : null,
    [previewQuery.data],
  );

  if (!user) {
    return;
  }

  return (
    <main className="min-h-screen bg-[#f2f0ea] pb-10">
      <ContractReviewHeader />

      <div className="grid grid-cols-[1fr_340px] gap-10 px-10 pt-6">
        <section className="h-[calc(100vh-125px)] min-h-[620px] overflow-hidden rounded border border-[#d8d4cb] bg-[#78746e]">
          {!proposalPublicId && <div className="flex h-full items-center justify-center px-6 text-center text-sm text-white">The proposal reference is missing from this contract link.</div>}
          {proposalPublicId && previewQuery.isPending && <div className="flex h-full items-center justify-center text-sm text-white">Loading contract...</div>}
          {previewQuery.isError && <div className="flex h-full items-center justify-center px-6 text-center text-sm text-white">{previewQuery.error instanceof Error ? previewQuery.error.message : "Unable to load contract."}</div>}
          {summary && <ContractAgreementPreview summary={summary} />}
        </section>

        <aside className="pt-0">
          <ContractActionPanel
            contractPublicId={params.proposalId}
            proposalPublicId={proposalPublicId}
            contract={contract}
          />
        </aside>
      </div>
    </main>
  );
}
