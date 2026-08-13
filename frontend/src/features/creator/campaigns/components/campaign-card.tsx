import { Card } from "@/src/components/atoms/card"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Campaign } from "../types/campaign.types"
import { formatDate } from "@/src/utils/date"

const statusStyles: Record<string, string> = {
  COMPLETE: "bg-[#2d7a3a] text-white border-0",
  ACTIVE: "bg-[#F2F0EA] text-foreground border border-[#2d7a3a]",
  PENDING: "bg-[#F2F0EA] text-foreground border border-border",
  "FOR REVISIONS": "bg-transparent text-foreground border border-border",
}

interface CampaignCardProps {
  campaign: Campaign
  onOpenWorkspace: (id: string) => void
}

export function CampaignCard({ campaign, onOpenWorkspace }: CampaignCardProps) {
  return (
    <Card className="flex flex-row items-center justify-between px-6 py-4 h-20">
      {/* Name & Company */}
      <div className="w-48 shrink-0">
        <p className="font-normal text-foreground break-words min-w-0">{campaign.project_name}</p>
        <p className="text-sm text-muted-foreground">{campaign.currency}</p>
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-border mx-4 shrink-0" />

      {/* Dates */}
      <div className="flex gap-10 shrink-0">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Start Date</span>
          <span className="text-sm text-foreground">{formatDate(new Date(campaign.start_date))}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Deadline</span>
          <span className="text-sm text-foreground">{formatDate(new Date(campaign.end_date))}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-12 bg-border mx-4 shrink-0" />

      {/* Status & Action */}
      <div className="flex items-center gap-3 shrink-0">
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