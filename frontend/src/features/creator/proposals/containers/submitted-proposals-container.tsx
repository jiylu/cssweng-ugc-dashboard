"use client"
import CreatorProposalsNavigation from "@/src/features/creator/proposals/components/proposals-nav";
import CreatorSidebar from "@/src/components/organisms/creator-sidebar";
import { SubmittedProposalsHeader } from "@/src/features/creator/proposals/components/submitted-proposals/submitted-proposals-header"
import { SubmittedProposalsTable } from "@/src/features/creator/proposals/components/submitted-proposals/submitted-proposals-table"
import { SubmittedProposalPreviewDialog } from "@/src/features/creator/proposals/components/submitted-proposals/submitted-proposal-preview-dialog"
import { CancelProposalDialog } from "@/src/features/creator/proposals/components/submitted-proposals/cancel-proposal-dialog"
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { useSubmittedProposals } from "@/src/features/creator/proposals/hooks/useSubmittedProposals";
import { useProposalMetaByCampaign } from "@/src/features/creator/proposals/hooks/useProposalMetaByCampaign";
import { useCancelProposal } from "@/src/features/creator/proposals/hooks/useCancelProposal";
import { mapCampaignToSubmittedProposal } from "@/src/features/creator/proposals/utils/mapCampaignToSubmittedProposal";
import { SubmittedProposal } from "@/src/features/creator/proposals/types/submitted-proposal.types";
import LogoLoader from "@/src/components/molecules/logo-loader";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function SubmittedProposalsContainer() {
    const { user, loading } = useAuth();
    const { data: campaigns, isLoading, isError } = useSubmittedProposals(user?.user_id);
    const proposalMeta = useProposalMetaByCampaign(campaigns);
    const queryClient = useQueryClient();
    const { mutate: cancelProposal, isPending: isCancelling } = useCancelProposal();
    const [previewPublicId, setPreviewPublicId] = useState<string | null>(null);
    const [cancelTarget, setCancelTarget] = useState<{
        proposalPublicId: string
        campaignPublicId: string
        campaignName: string
    } | null>(null);

    const handleView = (id: string) => {
        setPreviewPublicId(id)
    }

    const handleSendReminder = (id: string) => {
        console.log("send reminder", id)
    }

    const handleCancel = (proposal: SubmittedProposal) => {
        setCancelTarget({
            proposalPublicId: proposal.proposalPublicId,
            campaignPublicId: proposal.id,
            campaignName: proposal.campaignName,
        })
    }

    const handleConfirmCancel = () => {
        if (!cancelTarget) return;
        cancelProposal(cancelTarget.proposalPublicId, {
            onSuccess: () => {
                toast.success("Proposal cancelled.");
                queryClient.invalidateQueries({ queryKey: ["submitted-proposals", user?.user_id] });
                queryClient.invalidateQueries({ queryKey: ["proposal-client", cancelTarget.campaignPublicId] });
                setCancelTarget(null);
            },
            onError: (err) => toast.error(err.message),
        });
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
                            proposals={(campaigns ?? []).map((campaign) => {
                                const meta = proposalMeta.get(campaign.public_id)
                                return mapCampaignToSubmittedProposal(
                                    campaign,
                                    meta?.clientName,
                                    meta?.proposalStatus,
                                    meta?.proposalPublicId,
                                )
                            })}
                            onView={handleView}
                            onSendReminder={handleSendReminder}
                            onCancel={handleCancel}
                        />
                    </div>
                </div>
            </section>
            <SubmittedProposalPreviewDialog
                publicId={previewPublicId}
                creatorName={`${user.first_name} ${user.last_name}`.trim()}
                onClose={() => setPreviewPublicId(null)}
            />
            <CancelProposalDialog
                open={!!cancelTarget}
                campaignName={cancelTarget?.campaignName ?? ""}
                isPending={isCancelling}
                onConfirm={handleConfirmCancel}
                onClose={() => setCancelTarget(null)}
            />
        </main>
    )
}
