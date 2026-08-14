"use client"
import CreatorProposalsNavigation from "@/src/features/creator/proposals/components/proposals-nav";
import CreatorSidebar from "@/src/components/organisms/creator-sidebar";
import { ProposalDraftsHeader } from "@/src/features/creator/proposals/components/proposal-drafts/proposal-drafts-header";
import { ProposalDraftsTable } from "@/src/features/creator/proposals/components/proposal-drafts/proposal-drafts-table";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import {
  useDeleteDraft,
  useProposalDrafts,
} from "@/src/features/creator/proposals/hooks/useProposalDrafts";
import { mapDraftToRow } from "@/src/features/creator/proposals/utils/mapDraftToRow";
import LogoLoader from "@/src/components/molecules/logo-loader";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ProposalDraftsContainer() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { data: drafts, isLoading: draftsLoading } = useProposalDrafts(user?.user_id ?? undefined);
    const { mutate: deleteDraft, isPending: isDeleting } = useDeleteDraft();

    const handleContinueEditing = (id: string) => {
        router.push(`/proposals/create-campaign?draft=${id}`);
    };

    const handleDelete = (id: string) => {
        deleteDraft(id, {
            onSuccess: () => toast.success("Draft deleted!"),
            onError: (err) => toast.error(err.message),
        });
    };

    if (loading || draftsLoading) return <LogoLoader label="Loading proposal drafts" />;

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
                <Separator />
                <div className="flex flex-col gap-6 mt-5">
                    <ProposalDraftsHeader />
                    <Separator />
                    <ProposalDraftsTable
                        drafts={(drafts ?? []).map(mapDraftToRow)}
                        onContinueEditing={handleContinueEditing}
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                    />
                </div>
            </div>
        </section>
    </main>
    )
}
