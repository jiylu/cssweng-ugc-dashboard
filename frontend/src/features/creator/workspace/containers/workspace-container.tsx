"use client"
import { useCallback, useRef, useState } from "react";
import Profile from "@/src/components/molecules/profile";
import { useRouter } from "next/navigation"
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
import { UnsavedChangesDialog } from "@/src/features/creator/workspace/components/deliverables-submission/unsaved-changes-dialog"
import { ContractSigningPanel } from "@/src/features/creator/workspace/components/contract-signing/contract-signing-panel"
import { InvoiceDetailsCard } from "@/src/features/creator/workspace/components/invoicing/invoice-details-card"
import { CampaignCompletedCard } from "@/src/features/creator/workspace/components/completion/campaign-completed-card"
import { useWorkspace } from "@/src/features/creator/workspace/hooks/useWorkspace"
import { useCampaignSetup } from "@/src/features/creator/workspace/hooks/useCampaignSetup"
import { useDeliverableItems } from "@/src/features/creator/workspace/hooks/useDeliverableItems"
import { useAllDeliverableItems } from "@/src/features/creator/workspace/hooks/useAllDeliverableItems"
import { useLatestWrittenAsset, useLatestMediaAsset } from "@/src/features/creator/workspace/hooks/useLatestAsset"
import { useSubmitWrittenAsset } from "@/src/features/creator/workspace/hooks/useSubmitWrittenAsset"
import { useSaveWrittenAssetDraft } from "@/src/features/creator/workspace/hooks/useSaveWrittenAssetDraft"
import {
  downloadFinalAssetsAsZip,
  getFinalAssetsForCampaign,
} from "@/src/features/creator/workspace/services/final-assets-api"
import { getPaymentForCampaign } from "@/src/features/creator/workspace/services/payments-api"

interface WorkspaceProps {
  campaignId: string
}

export default function Workspace({ campaignId }: WorkspaceProps) {
  const { user, loading } = useAuth()
  const { activeStep, setActiveStep, activeDeliverable, setActiveDeliverable, historyOpen, setHistoryOpen } = useWorkspace()
  const [activeDeliverableStep, setActiveDeliverableStep] = useState(0)
  const [activeDeliverableItem, setActiveDeliverableItem] = useState(0)
  const [historyType, setHistoryType] = useState<"written" | "media">("written")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [creatorSignedLocally, setCreatorSignedLocally] = useState(false)
  const pendingNavigationRef = useRef<
    | { type: "deliverable"; index: number }
    | { type: "item"; index: number }
    | null
  >(null)
  const { data: campaignSetup, isLoading: campaignLoading } = useCampaignSetup(campaignId)
  const campaign = campaignSetup?.campaign
  const clientName = [
    campaignSetup?.proposal?.client_first_name,
    campaignSetup?.proposal?.client_last_name,
  ]
    .filter(Boolean)
    .join(" ") || "Client"
  const creatorName = [user?.first_name, user?.last_name].filter(Boolean).join(" ")
  const deliverables = campaignSetup?.deliverables ?? []
  const isContractSigned =
    creatorSignedLocally ||
    Boolean(
      campaignSetup?.contract?.creator_signed &&
        campaignSetup?.contract?.client_signed,
    )
  const router = useRouter();
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
  const { mutate: saveWrittenAssetDraftMutation, isPending: isSavingDraft } = useSaveWrittenAssetDraft()

  const activeDeliverableName =
    selectedDeliverableItem && (deliverableItems?.length ?? 0) > 1
      ? `${deliverables[activeDeliverable]?.deliverable_content} ${selectedDeliverableItem.deliverable_index}`
      : deliverables[activeDeliverable]?.deliverable_content ?? "Deliverable"

  const activeContentType =
    selectedDeliverable?.deliverable_content
      ?.split(/\s+/)
      .slice(1)
      .join(" ")
      .trim() ?? ""

  const handleDeliverableChange = (index: number) => {
    setActiveDeliverable(index)
    setActiveDeliverableItem(0)
    setActiveDeliverableStep(0)
  }

  const handleDeliverableItemChange = (itemIndex: number) => {
    setActiveDeliverableItem(itemIndex)
    setActiveDeliverableStep(0)
  }

  const handleDirtyChange = useCallback((dirty: boolean) => {
    setHasUnsavedChanges(dirty)
  }, [])

  const runNavigation = (navigation: {
    type: "deliverable" | "item"
    index: number
  }) => {
    setHasUnsavedChanges(false)
    if (navigation.type === "deliverable") {
      handleDeliverableChange(navigation.index)
    } else {
      handleDeliverableItemChange(navigation.index)
    }
  }

  const requestNavigation = (navigation: {
    type: "deliverable" | "item"
    index: number
  }) => {
    if (hasUnsavedChanges) {
      pendingNavigationRef.current = navigation
      setConfirmOpen(true)
      return
    }
    runNavigation(navigation)
  }

  const confirmDiscardAndContinue = () => {
    const navigation = pendingNavigationRef.current
    pendingNavigationRef.current = null
    setConfirmOpen(false)
    if (navigation) runNavigation(navigation)
  }

  const cancelNavigation = () => {
    pendingNavigationRef.current = null
    setConfirmOpen(false)
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

  const handleStepChange = async (step: number) => {
    if (step === 1 && !isContractSigned) {
      toast.info("Please complete contract signing before submitting deliverables.")
      return
    }
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
    if (step === 3) {
      try {
        const payment = await getPaymentForCampaign(campaignId)
        if (!payment?.is_payment_verified) {
          toast.info("Invoicing must be completed before proceeding to completion.")
          return
        }
      } catch {
        toast.error("Unable to verify invoice status. Please try again.")
        return
      }
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

  const handleSaveDraft = (content: string) => {
    if (!latestWrittenAsset) {
      toast.info("Submit a version first to save drafts.")
      return
    }
    saveWrittenAssetDraftMutation(
      {
        writtenAssetPublicId: latestWrittenAsset.public_id,
        content,
      },
      {
        onSuccess: () => toast.success("Draft saved."),
        onError: (error) =>
          toast.error(error instanceof Error ? error.message : "Unable to save draft."),
      },
    )
  }

  const handleDownloadAssets = async () => {
    setIsDownloading(true)
    try {
      const result = await getFinalAssetsForCampaign(campaignId)
      const assets = Object.values(result).flatMap(
        (entry) => entry.finalAssets,
      )
      if (assets.length === 0) {
        toast.info("No final assets available yet.")
        return
      }
      const downloaded = await downloadFinalAssetsAsZip(
        assets,
        `${campaign?.project_name ?? "campaign"}-final-assets.zip`,
      )
      if (downloaded === 0) {
        toast.error("None of the final assets could be downloaded.")
      } else if (downloaded < assets.length) {
        toast.success(`Downloaded ${downloaded} of ${assets.length} assets.`)
      } else {
        toast.success("Final assets downloaded.")
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to download final assets.",
      )
    } finally {
      setIsDownloading(false)
    }
  }

  if (loading || campaignLoading) return <LogoLoader label="Loading workspace" />;

  if (!user) return null

  return (
    <main className="flex flex-row w-full h-screen overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden;">
      <CreatorSidebar />
      <section className="flex-1 h-screen overflow-y-scroll scrollbar-gutter-stable">
        <div className="flex flex-col gap-6 p-8 w-full max-w-325 m-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
                <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-normal text-foreground">Workspace</h1>
                </div>

                <Profile 
                  firstName={user.first_name}
                  lastName={user.last_name}
                  email={user.email}
                />
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
            <UnsavedChangesDialog
              open={confirmOpen}
              onConfirm={confirmDiscardAndContinue}
              onCancel={cancelNavigation}
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
                onChange={(index) => requestNavigation({ type: "deliverable", index })}
                onDeliverableItemChange={(itemIndex) => requestNavigation({ type: "item", index: itemIndex })}
                onStepChange={handleDeliverableStepChange}
              />
            )}
            {activeStep === 0 && (
              <ContractSigningPanel 
                contract={campaignSetup?.contract} 
                campaignId={campaignId}
                creatorName={creatorName}
                onSigned={() => setCreatorSignedLocally(true)}
                onNext={() => setActiveStep(1)}
              />
            )}
            {activeStep === 1 && (
              <>
                {activeDeliverableStep === 0 && (
                  <WrittenAssetsPanel
                    key={selectedDeliverableItem?.public_id}
                    version={latestWrittenAsset?.version_number ?? 1}
                    onDirtyChange={handleDirtyChange}
                    onHistory={() => {
                      setHistoryType("written")
                      setHistoryOpen(true)
                    }}
                    onSaveDraft={handleSaveDraft}
                    onSubmit={handleSubmitWrittenAsset}
                    onNext={() => setActiveDeliverableStep(1)}
                    writtenAsset={latestWrittenAsset}
                    isSubmitting={isSubmittingWrittenAsset}
                    isSavingDraft={isSavingDraft}
                    itemsLoading={itemsLoading}
                    itemsError={!!itemsError}
                  />
                )}

                {activeDeliverableStep === 1 && (
                  <VideoSubmissionContainer
                    key={selectedDeliverableItem?.public_id}
                    version={latestMediaAsset?.version_number ?? 1}
                    onDirtyChange={handleDirtyChange}
                    onHistory={() => {
                      setHistoryType("media")
                      setHistoryOpen(true)
                    }}
                    onNext={() => setActiveDeliverableStep(2)}
                    deliverableItemPublicId={selectedDeliverableItem?.public_id}
                    mediaAsset={latestMediaAsset}
                    contentType={activeContentType}
                  />
                )}

                {activeDeliverableStep === 2 && (
                  <DeliverableApprovedCard
                    deliverableName={activeDeliverableName}
                    onNext={() => handleStepChange(2)}
                  />
                )}

                {activeDeliverableStep < 2 && (
                  <FeedbackPanel
                    writtenAsset={latestWrittenAsset}
                    mediaAsset={latestMediaAsset}
                    type={activeDeliverableStep === 0 ? "written" : "media"}
                    clientName={clientName}
                  />
                )}
              </>
            )}

            {activeStep === 2 && (
              <InvoiceDetailsCard
                campaignId={campaignId}
                onNext={() => handleStepChange(3)}
              />
            )}

            {activeStep === 3 && (
              <CampaignCompletedCard 
                isDownloading={isDownloading}
                onDownloadAssets={handleDownloadAssets}
                onBackToDashboard={() => router.push('/creator-dashboard')}
              />
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
