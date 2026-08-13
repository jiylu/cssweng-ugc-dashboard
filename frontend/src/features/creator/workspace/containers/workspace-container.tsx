"use client"
import { useState } from "react";
import { toast } from "sonner"
import CreatorSidebar from "@/src/components/organisms/creator-sidebar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/src/features/auth/hooks/useAuth"
import LogoLoader from "@/src/components/molecules/logo-loader";
import { WorkspaceHeader } from "@/src/features/creator/workspace/components/workspace-header"
import { CampaignProgress } from "@/src/features/creator/workspace/components/campaign-progress"
import { WrittenAssetsPanel } from "@/src/features/creator/workspace/components/deliverables-submission/written-assets-panel"
import { DeliverablesSidebar } from "@/src/features/creator/workspace/components/deliverables-sidebar"
import { FeedbackPanel } from "@/src/features/creator/workspace/components/deliverables-submission/feedback-panel"
import { HistoryOverlay } from "@/src/features/creator/workspace/components/deliverables-submission/history-overlay"
import { VideoSubmissionContainer } from "@/src/features/creator/workspace/containers/video-submission-container"
import { DeliverableApprovedCard } from "@/src/features/creator/workspace/components/deliverables-submission/deliverable-approved-card"
import { ContractSigningPanel } from "@/src/features/creator/workspace/components/contract-signing/contract-signing-panel"
import { useWorkspace } from "@/src/features/creator/workspace/hooks/useWorkspace"
import { useCampaignSetup } from "@/src/features/creator/workspace/hooks/useCampaignSetup"
import { useDeliverableItems } from "@/src/features/creator/workspace/hooks/useDeliverableItems"
import { useAllDeliverableItems } from "@/src/features/creator/workspace/hooks/useAllDeliverableItems"
import { useLatestWrittenAsset, useLatestMediaAsset } from "@/src/features/creator/workspace/hooks/useLatestAsset"
import { useSubmitWrittenAsset } from "@/src/features/creator/workspace/hooks/useSubmitWrittenAsset"

interface WorkspaceProps {
  campaignId: string
}

export default function Workspace({ campaignId }: WorkspaceProps) {
  const { user, loading } = useAuth()
  const { activeStep, setActiveStep, activeDeliverable, setActiveDeliverable, historyOpen, setHistoryOpen } = useWorkspace()
  const [activeDeliverableStep, setActiveDeliverableStep] = useState(0)
  const [activeDeliverableItem, setActiveDeliverableItem] = useState(0)
  const [historyType, setHistoryType] = useState<"written" | "media">("written")
  const { data: campaignSetup, isLoading: campaignLoading } = useCampaignSetup(campaignId)
  const campaign = campaignSetup?.campaign
  const deliverables = campaignSetup?.deliverables ?? []

  const selectedDeliverable = deliverables[activeDeliverable]
  const {
    data: deliverableItems,
    isLoading: itemsLoading,
    error: itemsError,
  } = useDeliverableItems(selectedDeliverable?.public_id)
  const activeDeliverables = deliverables.filter((deliverable) => !deliverable.is_deleted)
  const deliverableItemsQueries = useAllDeliverableItems(activeDeliverables)
  const allDeliverablesApproved =
    activeDeliverables.length > 0 &&
    deliverableItemsQueries.every((result) => {
      const items = result.data ?? []
      return items.length > 0 && items.every((item) => item.deliverable_item_status === "APPROVED")
    })
  const approvalLoading = deliverableItemsQueries.some((result) => result.isLoading)
  const itemsByDeliverableId = new Map(
    activeDeliverables.map((deliverable, index) => [
      deliverable.public_id,
      deliverableItemsQueries[index]?.data ?? [],
    ]),
  )
  const selectedDeliverableItem = deliverableItems?.[activeDeliverableItem]
  const { data: latestWrittenAsset } = useLatestWrittenAsset(selectedDeliverableItem?.public_id)
  const { data: latestMediaAsset } = useLatestMediaAsset(selectedDeliverableItem?.public_id)
  const { mutate: submitWrittenAsset, isPending: isSubmittingWrittenAsset } = useSubmitWrittenAsset()

  const activeDeliverableName =
    selectedDeliverableItem && (deliverableItems?.length ?? 0) > 1
      ? `${deliverables[activeDeliverable]?.deliverable_content} ${selectedDeliverableItem.deliverable_index}`
      : deliverables[activeDeliverable]?.deliverable_content ?? "Deliverable"

  const handleDeliverableChange = (index: number) => {
    setActiveDeliverable(index)
    setActiveDeliverableItem(0)
    setActiveDeliverableStep(0)
  }

  const handleDeliverableItemChange = (itemIndex: number) => {
    setActiveDeliverableItem(itemIndex)
    setActiveDeliverableStep(0)
  }

  const handleDeliverableStepChange = (step: number) => {
    if (step >= 1 && !selectedDeliverableItem?.written_asset_approved) {
      toast.info("Written assets must be approved before moving to Media Assets.")
      return
    }
    if (step >= 2 && selectedDeliverableItem?.deliverable_item_status !== "APPROVED") {
      toast.info("This deliverable is not yet approved.")
      return
    }
    setActiveDeliverableStep(step)
  }

  const handleStepChange = (step: number) => {
    if (step < 2) {
      setActiveStep(step)
      return
    }
    if (itemsLoading || approvalLoading) {
      toast.info("Deliverable approvals are still loading. Please try again.")
      return
    }
    if (!allDeliverablesApproved) {
      toast.info("All deliverables must be approved before proceeding to invoicing.")
      return
    }
    setActiveStep(step)
  }

  const handleSubmitWrittenAsset = (content: string) => {
    if (!selectedDeliverableItem) {
      toast.error("Deliverable items are still loading. Please try again.")
      return
    }
    submitWrittenAsset(
      { deliverableItemId: selectedDeliverableItem.public_id, content },
      {
        onSuccess: () => toast.success("Written assets submitted for approval."),
        onError: (error) =>
          toast.error(error instanceof Error ? error.message : "Unable to submit written assets."),
      },
    )
  }

  if (loading || campaignLoading) return <LogoLoader label="Loading workspace" />;

  if (!user) return null

  return (
    <main className="flex flex-row w-full h-screen overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden;">
      <CreatorSidebar />
      <section className="flex-1 h-screen overflow-y-scroll scrollbar-gutter-stable">
        <div className="flex flex-col gap-6 p-8 w-full max-w-325 m-auto">
          {/* Header */}
          <div className="flex items-start justify-between">
            <h1 className="text-4xl font-normal text-foreground">Workspace</h1>
          </div>
          <Separator />
          <div className="flex items-start justify-between bg-white px-8 py-7">
            <WorkspaceHeader
                campaignName={campaign?.project_name ?? "Campaign Name"}
                campaignOverview={campaign?.description ?? "Campaign Overview"}
            />
            <CampaignProgress 
              activeStep={activeStep} 
              onStepChange={handleStepChange}
            />
          </div>


          {/* Main Content */}
          <div className="flex gap-6 justify-center">
            <HistoryOverlay
              open={historyOpen}
              onClose={() => setHistoryOpen(false)}
              deliverableItemPublicId={selectedDeliverableItem?.public_id}
              type={historyType}
            />
            {activeStep === 1 && (
              <DeliverablesSidebar
                deliverables={deliverables}
                itemsByDeliverable={deliverables.map(
                  (deliverable) => itemsByDeliverableId.get(deliverable.public_id) ?? [],
                )}
                activeDeliverable={activeDeliverable}
                activeDeliverableItem={activeDeliverableItem}
                activeDeliverableStep={activeDeliverableStep}
                onChange={handleDeliverableChange}
                onDeliverableItemChange={handleDeliverableItemChange}
                onStepChange={handleDeliverableStepChange}
              />
            )}
            {activeStep === 0 && (
              <ContractSigningPanel 
                contract={campaignSetup?.contract} 
                onSigned={() => setActiveStep(1)} 
              />
            )}
            {activeStep === 1 && (
              <>
                {activeDeliverableStep === 0 && (
                  <WrittenAssetsPanel
                    version={latestWrittenAsset?.version_number ?? 1}
                    onHistory={() => {
                      setHistoryType("written")
                      setHistoryOpen(true)
                    }}
                    onSaveDraft={() => console.log("Save draft")}
                    onSubmit={handleSubmitWrittenAsset}
                    onNext={() => setActiveDeliverableStep(1)}
                    writtenAsset={latestWrittenAsset}
                    isSubmitting={isSubmittingWrittenAsset}
                    itemsLoading={itemsLoading}
                    itemsError={!!itemsError}
                  />
                )}

                {activeDeliverableStep === 1 && (
                  <VideoSubmissionContainer
                    version={latestMediaAsset?.version_number ?? 1}
                    onHistory={() => {
                      setHistoryType("media")
                      setHistoryOpen(true)
                    }}
                    onNext={() => setActiveDeliverableStep(2)}
                    deliverableItemPublicId={selectedDeliverableItem?.public_id}
                    mediaAsset={latestMediaAsset}
                  />
                )}

                {activeDeliverableStep === 2 && (
                  <DeliverableApprovedCard
                    deliverableName={activeDeliverableName}
                  />
                )}

                {activeDeliverableStep < 2 && (
                  <FeedbackPanel
                    writtenAsset={latestWrittenAsset}
                    mediaAsset={latestMediaAsset}
                    type={activeDeliverableStep === 0 ? "written" : "media"}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}