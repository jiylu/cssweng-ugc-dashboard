"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { toast } from "sonner";
import LogoLoader from "@/src/components/molecules/logo-loader";
import CampaignOverviewCard from "../components/campaign-overview-card";
import ContractTermsSection from "../components/contract-terms-section";
import DeliverablesTable from "../components/deliverables-table";
import OptionalAddOnsCard from "../components/optional-add-ons-card";
import PaymentSummaryCard from "../components/payment-summary-card";
import ProposalFeedbackPanel from "../components/proposal-feedback-panel";
import ProposalReviewHeader from "../components/proposal-review-header";
import { useClientProposal } from "../hooks/useClientProposal";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
  }).format(value);
}

const subscribeToGuestAccess = () => () => undefined;

export default function ClientProposalReview() {
  const params = useParams<{ campaignId?: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const proposalPublicId = params.campaignId ?? "";
  const requestedGuestAccess = searchParams.get("guest") === "1";
  const hasGuestAccess = useSyncExternalStore(
    subscribeToGuestAccess,
    () =>
      !requestedGuestAccess ||
      Boolean(
        window.sessionStorage.getItem(`guestProposalAccess:${proposalPublicId}`),
      ),
    () => !requestedGuestAccess,
  );
  const { proposalQuery, revisionMutation, declineMutation, addOnMutation } =
    useClientProposal(proposalPublicId);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (requestedGuestAccess && !hasGuestAccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f2f0ea] px-6">
        <div className="max-w-lg text-center">
          <h1 className="text-4xl text-[#141518]">Guest verification required</h1>
          <p className="mt-4 text-[#6f6a63]">
            Return to the client registration invitation and request a guest
            verification code to view this proposal.
          </p>
        </div>
      </main>
    );
  }

  if (proposalQuery.isLoading) {
    return <LogoLoader label="Loading proposal" />;
  }

  if (proposalPublicId === "preview" || proposalQuery.isError || !proposalQuery.data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f2f0ea] px-6">
        <div className="max-w-lg text-center">
          <h1 className="text-4xl text-[#141518]">Proposal unavailable</h1>
          <p className="mt-4 text-[#6f6a63]">
            {proposalQuery.error instanceof Error
              ? proposalQuery.error.message
              : "Use the proposal link sent by the creator to review it."}
          </p>
        </div>
      </main>
    );
  }

  const data = proposalQuery.data;
  const currency = data.campaign.currency;
  const displayedFeedback = feedback ?? data.proposal.client_comments ?? "";

  const handleReviseProposal = async () => {
    const comment = displayedFeedback.trim();
    if (!comment) return;
    try {
      await revisionMutation.mutateAsync({
        proposalId: data.proposal.public_id,
        comment,
      });
      toast.success("Revision request submitted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to request revision.");
    }
  };

  const handleDecline = async () => {
    try {
      await declineMutation.mutateAsync(data.proposal.public_id);
      toast.success("Proposal declined.");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to decline proposal.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f2f0ea] pb-14">
      <ProposalReviewHeader />

      <div className="mx-auto grid max-w-[1536px] grid-cols-1 gap-8 px-5 pt-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10 lg:px-10">
        <section className="min-w-0 space-y-9">
          <h1 className="text-[46px] leading-none text-[#141518] sm:text-[58px]">
            Proposal Review
          </h1>

          {requestedGuestAccess && (
            <div className="rounded border border-[#c7a9df] bg-[#f7f0fc] px-5 py-4 text-sm text-[#5f1a96]">
              Guest access is view-only. Create an account to revise the proposal,
              change add-ons, decline it, or proceed to contract signing.
            </div>
          )}

          <CampaignOverviewCard
            creatorName={data.creatorName}
            description={data.campaign.description}
            startDate={formatDate(data.campaign.start_date)}
            endDate={formatDate(data.campaign.end_date)}
          />

          <DeliverablesTable deliverables={data.deliverables} />
          <ContractTermsSection terms={data.terms} />
          <OptionalAddOnsCard
            addOns={data.addOns}
            readOnly={requestedGuestAccess}
            onToggle={(addOn) =>
              addOnMutation
                .mutateAsync({ addOnId: addOn.id, optIn: !addOn.selected })
                .catch((error) =>
                  toast.error(
                    error instanceof Error ? error.message : "Unable to update add-on.",
                  ),
                )
            }
          />
        </section>

        <aside className="space-y-12 lg:pt-[44px]">
          {requestedGuestAccess ? (
            <section className="rounded border border-[#d8d4cb] bg-white p-5">
              <h2 className="text-[26px] leading-none text-[#141518]">
                Viewing as Guest
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#6f6a63]">
                Guest access does not create a client record, so proposal revisions
                and contract signing are unavailable. You can return to the invitation
                link at any time to register an account.
              </p>
            </section>
          ) : (
            <ProposalFeedbackPanel
              feedback={displayedFeedback}
              onContractSigning={() => router.push(`/contracts/${data.contract.public_id}`)}
              onDecline={handleDecline}
              onFeedbackChange={setFeedback}
              onReviseProposal={handleReviseProposal}
              revisionSubmitted={revisionMutation.isSuccess}
              isSubmitting={revisionMutation.isPending}
            />
          )}
          <PaymentSummaryCard
            paymentMethod={data.paymentMethod}
            baseFee={formatMoney(data.baseFee, currency)}
            selectedAddOns={formatMoney(data.selectedAddOnsFee, currency)}
            tax={`Tax (${data.taxRate}%): ${formatMoney(
              data.totalDue - data.baseFee - data.selectedAddOnsFee,
              currency,
            )}`}
            totalDue={formatMoney(data.totalDue, currency)}
          />
        </aside>
      </div>
    </main>
  );
}
