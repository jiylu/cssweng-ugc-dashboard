"use client"
import CreatorProposalsNavigation from "@/src/features/creator/proposals/components/proposals-nav";
import CreatorSidebar from "@/src/components/organisms/creator-sidebar";
import { SubmittedProposalsHeader } from "@/src/features/creator/proposals/components/submitted-proposals/submitted-proposals-header"
import { SubmittedProposalsTable } from "@/src/features/creator/proposals/components/submitted-proposals/submitted-proposals-table"
import { SubmittedProposal } from "@/src/features/creator/proposals/types/submitted-proposal.types"
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import LogoLoader from "@/src/components/molecules/logo-loader";
import { Separator } from "@/components/ui/separator";

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
    const { user, loading } = useAuth();

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

    if (loading) return <LogoLoader label="Loading submitted proposals" />;

    if (!user) return null;

    return (
        <main className="flex flex-row w-full h-screen overflow-hidden">
            <CreatorSidebar />
            <section className="flex-1 h-screen overflow-y-scroll scrollbar-gutter-stable">
                <div className="p-7.5 w-full max-w-300 m-auto text-[#141518]">
                    <CreatorProposalsNavigation
                        activeTab="submitted"
                        userFirstName={user.first_name}
                        userLastName={user.last_name}
                        userEmail={user.email}
                    />
                    <Separator />
                    <div className="flex flex-col gap-6 mt-5">
                        <SubmittedProposalsHeader />
                        <Separator />
                        <SubmittedProposalsTable
                            proposals={MOCK_PROPOSALS}
                            onView={handleView}
                            onSendReminder={handleSendReminder}
                            onCancel={handleCancel}
                        />
                    </div>
                </div>
            </section>
        </main>
    )
}
