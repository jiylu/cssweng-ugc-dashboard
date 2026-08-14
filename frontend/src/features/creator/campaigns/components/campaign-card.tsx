import { Card } from "@/src/components/atoms/card"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Campaign } from "../types/campaign.types"
import { formatDate } from "@/src/utils/date"

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-[#F2F0EA] text-foreground border border-[#2d7a3a]",
  COMPLETED: "bg-[#2d7a3a] text-white border-0",
  REJECTED: "bg-transparent text-foreground border border-border",
  CANCELLED: "bg-transparent text-foreground border border-border",
}

interface CampaignCardProps {
  campaign: Campaign
  clientName?: string
  onOpenWorkspace: (id: string) => void
}

export function CampaignCard({ campaign, clientName, onOpenWorkspace }: CampaignCardProps) {
  return (
    <Card className="grid min-h-24 grid-cols-1 items-center gap-4 px-6 py-4 md:grid-cols-[minmax(0,1fr)_auto] xl:grid-cols-[minmax(0,1fr)_auto_auto] xl:gap-6">
      {/* Name & Client */}
      <div className="min-w-0 self-start xl:self-center">
        <p className="break-words font-normal leading-6 text-foreground">
          {campaign.project_name}
        </p>
        <p className="mt-1 break-words text-sm text-muted-foreground">
          {clientName ?? campaign.currency}
        </p>
      </div>

      {/* Dates */}
      <div className="flex shrink-0 gap-8 border-l border-border pl-6">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Start Date</span>
          <span className="whitespace-nowrap text-sm text-foreground">
            {formatDate(new Date(campaign.start_date))}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Deadline</span>
          <span className="whitespace-nowrap text-sm text-foreground">
            {formatDate(new Date(campaign.end_date))}
          </span>
        </div>
      </div>

      {/* Status & Action */}
      <div className="flex shrink-0 items-center justify-end gap-3 border-t border-border pt-4 md:col-span-2 xl:col-span-1 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
        <span className={cn("text-xs font-medium px-4 py-1.5 rounded-[2px] tracking-wide", statusStyles[campaign.campaign_status])}>
          {campaign.campaign_status.replace("_", " ")}
        </span>
        <Button type="button" size="lg" className="cursor-pointer" onClick={() => onOpenWorkspace(campaign.public_id)}>
          Open Workspace
        </Button>
      </div>
    </Card>
  )
}
