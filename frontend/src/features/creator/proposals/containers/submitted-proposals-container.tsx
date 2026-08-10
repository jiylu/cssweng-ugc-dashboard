"use client"
import CreatorProposalsNavigation from "@/src/features/creator/proposals/components/proposals-nav";
import CreatorSidebar from "@/src/components/organisms/creator-sidebar";
import { SubmittedProposalsHeader } from "@/src/features/creator/proposals/components/submitted-proposals/submitted-proposals-header"
import { SubmittedProposalsTable } from "@/src/features/creator/proposals/components/submitted-proposals/submitted-proposals-table"
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { useSubmittedProposals } from "@/src/features/creator/proposals/hooks/useSubmittedProposals";
import { mapCampaignToSubmittedProposal } from "@/src/features/creator/proposals/utils/mapCampaignToSubmittedProposal";
import LogoLoader from "@/src/components/molecules/logo-loader";
import { Separator } from "@/components/ui/separator";

export function SubmittedProposalsContainer() {
    const { user, loading } = useAuth();
    const { data: campaigns, isLoading, isError } = useSubmittedProposals(user?.user_id);

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

    if (loading || isLoading) return <LogoLoader label="Loading submitted proposals" />;

    if (isError) return <p>Something went wrong.</p>;

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
                            proposals={(campaigns ?? []).map(mapCampaignToSubmittedProposal)}
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
