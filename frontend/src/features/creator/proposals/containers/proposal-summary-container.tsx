"use client"
import CreatorSidebar from "@/src/components/organisms/creator-sidebar"
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

interface ProposalSummaryContainerProps {
  onBack: () => void
  onSubmit: () => void
  isPending: boolean
}

// Static mock data — replace with real data when connecting to backend
const MOCK_DATA = {
  currency: "CAD",
  baseFee: 2500,
  taxRate: 13,
  tax: 325,
  total: 2825,
  startDate: "July 7, 2026",
  endDate: "October 15, 2026",
  platforms: ["TikTok", "Instagram"],
  brand: "BRAND NAME",
  creator: "CREATOR NAME",
  campaignName: "CAMPAIGN NAME",
  period: "July 7 - October 15, 2026",
  deliverables: [
    { qty: 1, deliverable: "TikTok Video", format: "UGC Video, 9:16", dueDate: "Aug 1, 2026" },
    { qty: 1, deliverable: "Instagram Reel", format: "4K Video, Collab Post", dueDate: "Aug 15, 2026" },
  ],
  usageRights: [
    { type: "Organic Social Media", duration: "12 Months" },
    { type: "Paid Ads (Whitelisting)", duration: "3 Months" },
  ],
  revisionRounds: 2,
  revisionDays: 5,
  feedbackDays: 3,
  extraNotes: "Add any special terms, exclusions, or additional notes here. If none, leave blank.",
}

export function ProposalSummaryContainer({ onBack, onSubmit, isPending }: ProposalSummaryContainerProps) {
  return (
    <section className="flex-1 h-screen overflow-y-scroll scrollbar-gutter-stable pb-20 bg-white">
        <div className="p-7.5 w-full max-w-300 m-auto">

        {/* Header */}
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
                currency={MOCK_DATA.currency}
                total={MOCK_DATA.total}
                baseFee={MOCK_DATA.baseFee}
                tax={MOCK_DATA.tax}
                taxRate={MOCK_DATA.taxRate}
                startDate={MOCK_DATA.startDate}
                endDate={MOCK_DATA.endDate}
                platforms={MOCK_DATA.platforms}
            />
            </div>

            {/* Main content */}
            <div className="flex-1 border border-border rounded-[3px] p-8 flex flex-col gap-8">
            <AgreementHeader />

            <CampaignSummarySection
                brand={MOCK_DATA.brand}
                creator={MOCK_DATA.creator}
                campaignName={MOCK_DATA.campaignName}
                platforms={MOCK_DATA.platforms}
                period={MOCK_DATA.period}
            />

            <DeliverablesSection deliverables={MOCK_DATA.deliverables} />

            <CreativeDirectionSummary
                revisionRounds={MOCK_DATA.revisionRounds}
                revisionDays={MOCK_DATA.revisionDays}
                feedbackDays={MOCK_DATA.feedbackDays}
            />

            <FeesSection
                baseFee={MOCK_DATA.baseFee}
                tax={MOCK_DATA.tax}
                taxRate={MOCK_DATA.taxRate}
                total={MOCK_DATA.total}
                currency={MOCK_DATA.currency}
            />

            <UsageRightsSection
                usageRights={MOCK_DATA.usageRights}
                territory="Philippines"
            />

            <StandardClausesSection extraNotes={MOCK_DATA.extraNotes} />
            </div>
        </div>
        </div>

        {/* Sticky footer */}
        <AgreementFooter
            onBack={onBack}
            onSubmit={onSubmit}
            isPending={isPending}
        />
    </section>
  )
}