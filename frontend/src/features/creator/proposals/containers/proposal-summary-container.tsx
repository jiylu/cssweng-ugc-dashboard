"use client"
import { Separator } from "@/components/ui/separator"
import { EarningsSnapshot } from "../components/proposal-summary/earnings-snapshot"
import { AgreementHeader } from "../components/proposal-summary/agreement-header"
import { CampaignSummarySection } from "../components/proposal-summary/campaign-summary-section"
import { DeliverablesSection } from "../components/proposal-summary/deliverable-section"
import { CreativeDirectionSummary } from "../components/proposal-summary/creative-direction-summary"
import { FeesSection } from "../components/proposal-summary/fees-section"
import { UsageRightsSection } from "../components/proposal-summary/usage-rights-section"
import { StandardClausesSection } from "../components/proposal-summary/standard-clauses-section"
import { AgreementFooter } from "../components/proposal-summary/agreement-footer"
import { useProposalSummary } from "../hooks/useProposalSummary"
import { useCampaignForm } from "../hooks/useCampaignForm"
import { useContractTerms } from "../hooks/useContractTerms"
import { useAddOns } from "../hooks/useAddOns"
import { usePaymentTerms } from "../hooks/usePaymentTerms"

interface ProposalSummaryContainerProps {
  form: ReturnType<typeof useCampaignForm>
  contractTerms: ReturnType<typeof useContractTerms>
  addOns: ReturnType<typeof useAddOns>
  paymentTerms: ReturnType<typeof usePaymentTerms>
  userName: string
  onBack: () => void
  onSubmit: () => void
  isPending: boolean
}

export function ProposalSummaryContainer({ form, contractTerms, addOns, paymentTerms, userName, onBack, onSubmit, isPending, }: ProposalSummaryContainerProps) {
  const summary = useProposalSummary(form, contractTerms, addOns, paymentTerms, userName)

  return (
    <>
        <div className="p-7.5 w-full max-w-300 m-auto">
            <div className="mt-5 mb-5">
                <h1 className="text-[44px] font-normal">Proposal Summary</h1>
                <p className="text-[18px] text-muted-foreground">
                    Please review the campaign details and contract terms before final submission.
                </p>
            </div>

                <Separator className="mb-6" />

            <div className="flex gap-6">
                {/* Left sidebar */}
                <div className="w-56 shrink-0">
                    <EarningsSnapshot
                    currency={summary.earnings.currency}
                    total={summary.earnings.total}
                    baseFee={summary.earnings.baseFee}
                    tax={summary.earnings.tax}
                    taxRate={summary.earnings.taxRate}
                    startDate={summary.campaign.startDate}
                    endDate={summary.campaign.endDate}
                    platforms={summary.campaign.platforms}
                    />
                </div>

                {/* Main content */}
                <div className="flex-1 border border-border rounded-[3px] p-8 flex flex-col gap-8 bg-white">
                    <AgreementHeader />

                    <CampaignSummarySection
                        brand={summary.campaign.brand}
                        creator={summary.campaign.creator}
                        campaignName={summary.campaign.campaignName}
                        platforms={summary.campaign.platforms}
                        period={summary.campaign.period}
                    />

                    <DeliverablesSection deliverables={summary.deliverables} />

                    <CreativeDirectionSummary
                        revisionRounds={summary.creativeDirection.revisionRounds}
                        revisionDays={summary.creativeDirection.revisionDays}
                        feedbackDays={summary.creativeDirection.feedbackDays}
                    />

                    <FeesSection
                        baseFee={summary.fees.baseFee}
                        tax={summary.fees.tax}
                        taxRate={summary.fees.taxRate}
                        total={summary.fees.total}
                        currency={summary.fees.currency}
                    />

                    <UsageRightsSection
                        usageRights={summary.usageRights}
                        territory={summary.contract.territory}
                    />

                    <StandardClausesSection
                        partnershipTags={summary.contract.partnershipTags}
                        contentRetentionMonths={contractTerms.contentRetention}
                        reimbursementDays={summary.contract.reimbursementDays}
                        cancellationDays={summary.contract.cancellationDays}
                        revisionDays={summary.creativeDirection.revisionDays}
                        governingLaw={summary.contract.governingLaw}
                        disputeLocation={summary.contract.disputeLocation}
                        extraNotes={summary.contract.extraNotes}
                        hasExclusivity={summary.exclusivity.hasExclusivity}
                        exclusivityCategory={summary.exclusivity.category}
                        exclusivityTerritory={summary.exclusivity.territory}
                        exclusivityDays={`${summary.exclusivity.startDate} - ${summary.exclusivity.endDate}`}
                    />
                </div>
            </div>
        </div>

        <AgreementFooter
            onBack={onBack}
            onSubmit={onSubmit}
            isPending={isPending}
        />
    </>
  )
}