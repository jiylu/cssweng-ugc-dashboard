"use client"
import CreatorProposalsNavigation from "@/src/features/creator/proposals/components/proposals-nav";
import { ProposalDraftsHeader } from "@/src/features/creator/proposals/components/proposal-drafts/proposal-drafts-header"
import { ProposalDraftsTable } from "@/src/features/creator/proposals/components/proposal-drafts/proposal-drafts-table"
import { ProposalDraft } from "@/src/features/creator/proposals/types/proposal-draft.types"

// TODO: replace with dynamic data from useProposalDrafts() hook / API call
const MOCK_DRAFTS: ProposalDraft[] = [
  {
    id: "1",
    campaignName: "Campaign Quick Glance",
    campaignType: "TikTok Video",
    clientName: "Client Name",
    durationStart: "Jul 7",
    durationEnd: "Oct 15, 2026",
    totalPrice: "CAD $2,825.00",
    lastSavedAt: "Oct 24, 2026 - 4:30 PM",
    isContinuing: true,
  },
  {
    id: "2",
    campaignName: "Campaign Quick Glance",
    campaignType: "TikTok Video",
    clientName: "Client Name",
    durationStart: "Jul 7",
    durationEnd: "Oct 15, 2026",
    totalPrice: "CAD $2,825.00",
    lastSavedAt: "Oct 24, 2026 - 4:30 PM",
  },
  {
    id: "3",
    campaignName: "Campaign Quick Glance",
    campaignType: "TikTok Video",
    clientName: "Client Name",
    durationStart: "Jul 7",
    durationEnd: "Oct 15, 2026",
    totalPrice: "CAD $2,825.00",
    lastSavedAt: "Oct 24, 2026 - 4:30 PM",
  },
]

export function ProposalDraftsContainer() {
  // TODO: wire up real handlers once the drafts API/service layer exists
  const handleContinueEditing = (id: string) => {
    console.log("continue editing", id)
  }

  const handleDuplicate = (id: string) => {
    console.log("duplicate draft", id)
  }

  const handleDelete = (id: string) => {
    console.log("delete draft", id)
  }

  return (
    <div className="flex flex-col gap-6">
      <ProposalsTabNav activeTab="drafts" />
      <ProposalDraftsHeader />
      <ProposalDraftsTable
        drafts={MOCK_DRAFTS}
        onContinueEditing={handleContinueEditing}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
      />
    </div>
  )
}