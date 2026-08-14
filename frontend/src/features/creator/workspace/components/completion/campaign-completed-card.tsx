import { Flag, Download, Undo2 } from "lucide-react"
import { Card } from "@/src/components/atoms/card"
import { Button } from "@/components/ui/button"

interface CampaignCompletedCardProps {
  isDownloading?: boolean
  onDownloadAssets: () => void
  onBackToDashboard: () => void
  onPrevious?: () => void
}

export function CampaignCompletedCard({ isDownloading, onDownloadAssets, onBackToDashboard, onPrevious }: CampaignCompletedCardProps) {
  return (
    <Card className="flex flex-col items-center gap-3 px-10 py-10 max-w-md mx-auto text-center">
      <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-[#6b1fa8]">
        <Flag className="text-white" size={28} fill="white" />
      </div>

      <h2 className="text-2xl font-normal text-foreground">
        Campaign Completed &amp; Approved
      </h2>

      <p className="text-sm text-muted-foreground">
        All creative assets have been finalized and approved by the client.
        The final deliverables are now available for download below.
      </p>

      <div className="flex flex-col gap-2 w-full max-w-64 mt-1">
        <Button
          variant="outline"
          className="rounded-[3px] border-[#6b1fa8] text-[#6b1fa8] hover:bg-[#6b1fa8]/5 hover:text-[#6b1fa8]"
          onClick={onDownloadAssets}
          disabled={isDownloading}
        >
          {isDownloading ? "Downloading..." : "Download Assets"}
          <Download size={16} />
        </Button>

        <Button
          className="rounded-[3px] bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white"
          onClick={onBackToDashboard}
        >
          Back to Dashboard
          <Undo2 size={16} />
        </Button>

        {onPrevious && (
          <Button
            type="button"
            variant="outline"
            className="rounded-[3px] border-[#6b1fa8] text-[#6b1fa8] hover:bg-[#6b1fa8]/5 hover:text-[#6b1fa8]"
            onClick={onPrevious}
          >
            Previous: Invoicing
          </Button>
        )}
      </div>
    </Card>
  )
}