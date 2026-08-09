"use client"
import CreatorProposalsNavigation from "@/src/features/creator/proposals/components/proposals-nav";
import CreatorSidebar from "@/src/components/organisms/creator-sidebar";
import { ProposalDraftsHeader } from "@/src/features/creator/proposals/components/proposal-drafts/proposal-drafts-header"
import { ProposalDraftsTable } from "@/src/features/creator/proposals/components/proposal-drafts/proposal-drafts-table"
import { ProposalDraft } from "@/src/features/creator/proposals/types/proposal-draft.types"
import { useAuth } from "@/src/features/auth/hooks/useAuth"
import LogoLoader from "@/src/components/molecules/logo-loader";

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
  const { user, loading } = useAuth();

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

  if (loading) return <LogoLoader label="Loading proposal drafts" />;

  if (!user) return null;

  return (
    <main className="flex flex-row w-full h-screen overflow-hidden">
      <CreatorSidebar />
      <section className="flex-1 h-screen overflow-y-scroll scrollbar-gutter-stable">
        <div className="p-7.5 w-full max-w-300 m-auto text-[#141518]">
          <CreatorProposalsNavigation
            activeTab="drafts"
            userFirstName={user.first_name}
            userLastName={user.last_name}
            userEmail={user.email}
          />
          <div className="flex flex-col gap-6 mt-5">
            <ProposalDraftsHeader />
            <ProposalDraftsTable
              drafts={MOCK_DRAFTS}
              onContinueEditing={handleContinueEditing}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </section>
    </main>
  )
}