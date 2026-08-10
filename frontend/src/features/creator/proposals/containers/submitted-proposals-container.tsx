"use client"
import CreatorProposalNav from "@/src/features/creator/proposals/components/proposals-nav"
import { SubmittedProposalsHeader } from "@/src/features/creator/proposals/components/submitted-proposals/submitted-proposals-header"
import { SubmittedProposalsTable } from "@/src/features/creator/proposals/components/submitted-proposals/submitted-proposals-table"
import { SubmittedProposal } from "@/src/features/creator/proposals/types/submitted-proposal.types"

// TODO: replace with dynamic data from useSubmittedProposals() hook / API call
const MOCK_PROPOSALS: SubmittedProposal[] = [
  {
    id: "1",
    campaignName: "Campaign Name",
    campaignType: "TikTok Video",
    clientName: "Client Name",
    durationStart: "Jul 7",
    durationEnd: "Oct 15, 2026",
    totalPrice: "CAD $2,825.00",
    status: "PENDING_CLIENT",
  },
  {
    id: "2",
    campaignName: "Campaign Name",
    campaignType: "TikTok Video",
    clientName: "Client Name",
    durationStart: "Jul 7",
    durationEnd: "Oct 15, 2026",
    totalPrice: "CAD $2,825.00",
    status: "OVERDUE",
  },
  {
    id: "3",
    campaignName: "Campaign Name",
    campaignType: "TikTok Video",
    clientName: "Client Name",
    durationStart: "Jul 7",
    durationEnd: "Oct 15, 2026",
    totalPrice: "CAD $2,825.00",
    status: "CLOSED",
  },
]

export function SubmittedProposalsContainer() {
  // TODO: wire up real handlers once the proposals API/service layer exists
  const handleView = (id: string) => {
    console.log("view proposal", id)
  }

  const handleSendReminder = (id: string) => {
    console.log("send reminder", id)
  }

  const handleCancel = (id: string) => {
    console.log("cancel proposal", id)
  }

  return (
    <div className="flex flex-col gap-6">
      <CreatorProposalsNavigation
            activeTab="submitted"
            userFirstName={user.first_name} // TODO: fix
            userLastName={user.last_name} // TODO: fix
            userEmail={user.email} // TODO: fix
        />
      <SubmittedProposalsHeader />
      <SubmittedProposalsTable
        proposals={MOCK_PROPOSALS}
        onView={handleView}
        onSendReminder={handleSendReminder}
        onCancel={handleCancel}
      />
    </div>
  )
}