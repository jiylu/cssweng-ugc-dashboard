"use client"
import { useState } from "react";
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
import { VideoSubmission } from "@/src/features/creator/workspace/components/deliverables-submission/video-submission"
import { DeliverableApprovedCard } from "@/src/features/creator/workspace/components/deliverables-submission/deliverable-approved-card"
import { ContractSigningPanel } from "@/src/features/creator/workspace/components/contract-signing/contract-signing-panel"
import { useWorkspace } from "@/src/features/creator/workspace/hooks/useWorkspace"
import { useCampaignSetup } from "@/src/features/creator/workspace/hooks/useCampaignSetup"

interface WorkspaceProps {
  campaignId: string
}

export default function Workspace({ campaignId }: WorkspaceProps) {
  const { user, loading } = useAuth()
  const { activeStep, setActiveStep, activeDeliverable, setActiveDeliverable, historyOpen, setHistoryOpen } = useWorkspace()
  const [activeDeliverableStep, setActiveDeliverableStep] = useState(0)
  const { data: campaignSetup, isLoading: campaignLoading } = useCampaignSetup(campaignId)
  const campaign = campaignSetup?.campaign
  const deliverables = campaignSetup?.deliverables ?? []

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
          <div className="flex items-start justify-between">
            <WorkspaceHeader
                campaignName={campaign?.project_name ?? "Campaign Name"}
                campaignOverview={campaign?.description ?? "Campaign Overview"}
            />
            <CampaignProgress 
              activeStep={activeStep} 
              onStepChange={setActiveStep}
            />
          </div>


          {/* Main Content */}
          <div className="flex gap-6 justify-center">
            <HistoryOverlay
              open={historyOpen}
              onClose={() => setHistoryOpen(false)}
              version={2}
              timestamp="DD/MM/YYYY HH:MM"
            />
            {activeStep === 1 && (
              <DeliverablesSidebar
                deliverables={deliverables}
                activeDeliverable={activeDeliverable}
                onChange={setActiveDeliverable}
                activeStep={activeDeliverableStep}
                onStepChange={setActiveDeliverableStep}
              />
            )}
            {activeStep === 0 && (
              <ContractSigningPanel 
                contract={campaignSetup?.contract} 
                onSigned={() => setActiveStep(1)} 
              />
            )}
            {activeStep === 1 && activeDeliverableStep === 0 && (
              <WrittenAssetsPanel
                version={2}
                onHistory={() => setHistoryOpen(true)}
                onSaveDraft={() => console.log("Save draft")}
                onSubmit={() => console.log("Submit")}
              />
            )}
            {activeStep === 1 && activeDeliverableStep === 1 && (
              <VideoSubmission 
                version={2}
                onHistory={() => setHistoryOpen(true)}
                onSubmit={() => console.log("Submit video")}
              />
            )}
            {activeStep === 1 && activeDeliverableStep === 2 && (
              <DeliverableApprovedCard deliverableName={deliverables[activeDeliverable]?.deliverable_content ?? "Deliverable"} />
            )}
            {activeStep === 1 && activeDeliverableStep < 2 && (
              <FeedbackPanel />
            )}
          </div>
        </div>
      </section>
    </main>
  )
}