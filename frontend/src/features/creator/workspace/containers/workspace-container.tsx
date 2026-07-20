"use client"
import CreatorSidebar from "@/src/components/organisms/creator-sidebar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/src/features/auth/hooks/useAuth"
import LogoLoader from "@/src/components/molecules/logo-loader";
import { WorkspaceHeader } from "@/src/features/creator/workspace/components/workspace-header"
import { CampaignProgress } from "@/src/features/creator/workspace/components/campaign-progress"
import { WrittenAssetsPanel } from "@/src/features/creator/workspace/components/written-assets-panel"
import { DeliverablesSidebar } from "@/src/features/creator/workspace/components/deliverables-sidebar"
import { FeedbackPanel } from "@/src/features/creator/workspace/components/feedback-panel"
import { HistoryOverlay } from "@/src/features/creator/workspace/components/history-overlay"
import { VideoSubmission } from "@/src/features/creator/workspace/components/video-submission"
import { useWorkspace } from "@/src/features/creator/workspace/hooks/useWorkspace"

interface WorkspaceProps {
  campaignId: string
}

export default function Workspace({ campaignId }: WorkspaceProps) {
  const { user, loading } = useAuth()
  const { activeStep, setActiveStep, activeDeliverable, setActiveDeliverable, historyOpen, setHistoryOpen } = useWorkspace()

  if (loading) return <LogoLoader label="Loading workspace" />;

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
                campaignName="Campaign Name"
                campaignOverview="Campaign Overview"
            />
            <CampaignProgress 
              activeStep={activeStep} 
              onStepChange={setActiveStep}
            />
          </div>


          {/* Main Content */}
          <div className="flex gap-6">
            <HistoryOverlay
              open={historyOpen}
              onClose={() => setHistoryOpen(false)}
              version={2}
              timestamp="DD/MM/YYYY HH:MM"
            />
            <DeliverablesSidebar
              activeDeliverable={activeDeliverable}
              onChange={setActiveDeliverable}
            />
            {activeStep === 1 && (
              <WrittenAssetsPanel
                version={2}
                onHistory={() => setHistoryOpen(true)}
                onSaveDraft={() => console.log("Save draft")}
                onSubmit={() => console.log("Submit")}
              />
            )}
            {activeStep === 2 && (
              <VideoSubmission 
                version={2}
                onHistory={() => setHistoryOpen(true)}
                onSubmit={() => console.log("Submit video")}
              />
            )}
            <FeedbackPanel />
          </div>
        </div>
      </section>
    </main>
  )
}