"use client"
import { Separator } from "@/components/ui/separator"
import { CampaignOverviewCard } from "../components/proposal-summary/campaign-overview-card"
import { DeliverablesCard } from "../components/proposal-summary/deliverables-card"
import { AddOnsSummaryCard } from "../components/proposal-summary/add-ons-card"
import { PaymentSummaryCard } from "../components/proposal-summary/payment-summary-card"
import { PaymentDeliveryCard } from "../components/proposal-summary/payment-delivery-card"
import { ContractTermsSummaryCard } from "../components/proposal-summary/contract-terms-card"
import { SummaryFooter } from "../components/proposal-summary/summary-footer"
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

export function ProposalSummaryContainer({ form, contractTerms, addOns, paymentTerms, userName, onBack, onSubmit, isPending }: ProposalSummaryContainerProps) {
  const summary = useProposalSummary(form, contractTerms, addOns, paymentTerms, userName)

  const addOnRows = summary.addOns.map((a) => ({
    name: a.title || "Untitled Add-on",
    description: a.desc,
    price: a.fee ?? 0,
  }))

  const contractTermsList = [
    {
      title: "Revision Policy",
      description: `${contractTerms.revisionRounds} round${contractTerms.revisionRounds > 1 ? "s" : ""} within ${contractTerms.revisionDays} days of submission.`,
    },
    {
      title: "Auto Approval",
      description: `Content is automatically approved after ${contractTerms.feedbackDays} business days if no feedback is provided.`,
    },
    {
      title: "Cancellation",
      description: `${contractTerms.cancellationDays}-day notice required before campaign start date for full refund/cancellation without penalty.`,
    },
    ...(contractTerms.hasExclusivity
      ? [{
          title: "Exclusivity",
          description: `No competing ${contractTerms.exclusivityCategory || "brands"} during the exclusivity period within ${contractTerms.exclusivityTerritory || "the agreed territory"}.`,
        }]
      : []),
    ...(contractTerms.contentRetention > 0
      ? [{
          title: "Content Retention",
          description: `Content must remain live for ${contractTerms.contentRetention} months.`,
        }]
      : []),
  ]

  return (
    <div className="flex flex-col gap-6">
      <Separator />

      <div className="mt-5 mb-2">
        <h1 className="text-[44px] font-normal">Proposal Summary</h1>
        <p className="text-[18px] text-muted-foreground">
          Please review the campaign details and contract terms before final submission
        </p>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left column - 2/3 width */}
        <div className="col-span-2 flex flex-col gap-6">
          <CampaignOverviewCard
            campaignName={summary.campaign.campaignName}
            startDate={summary.campaign.startDate}
            endDate={summary.campaign.endDate}
            description={summary.campaign.description}
          />
          <DeliverablesCard deliverables={summary.deliverables} />
          <AddOnsSummaryCard addOns={addOnRows} />
        </div>

        {/* Right column - 1/3 width */}
        <div className="col-span-1 flex flex-col gap-6">
          <PaymentSummaryCard
            baseFee={summary.earnings.baseFeeWithoutAddOns}
            addOnsTotal={summary.earnings.addOnsTotal}
            taxRate={summary.earnings.taxRate}
            tax={summary.earnings.tax}
            total={summary.earnings.total}
            currency={summary.earnings.currency}
          />
          <PaymentDeliveryCard
            paymentMethod={summary.payment.method}
            paymentSchedule={summary.payment.schedule}
            shippingAddress={summary.payment.shippingAddress}
          />
          <ContractTermsSummaryCard terms={contractTermsList} />
        </div>
      </div>

      <SummaryFooter
        onEdit={onBack}
        onSubmit={onSubmit}
        isPending={isPending}
        summary={summary}
      />
    </div>
  )
}
