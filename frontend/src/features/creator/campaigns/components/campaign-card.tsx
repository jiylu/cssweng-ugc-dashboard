import { Card } from "@/src/components/atoms/card"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CampaignStatus = "COMPLETE" | "ACTIVE" | "PENDING" | "FOR REVISIONS"

interface CampaignCardProps {
  name: string
  company: string
  startDate: string
  deadline: string
  status: CampaignStatus
}

const statusStyles: Record<CampaignStatus, string> = {
  COMPLETE: "bg-[#2d7a3a] text-white border-0",
  ACTIVE: "bg-transparent text-foreground border border-border",
  PENDING: "bg-transparent text-foreground border border-border",
  "FOR REVISIONS": "bg-transparent text-foreground border border-border",
}

export function CampaignCard({ name, company, startDate, deadline, status }: CampaignCardProps) {
  return (
    <Card className="flex flex-row items-center justify-between px-6 py-4 h-20">
      {/* Name & Company */}
      <div className="w-48 shrink-0">
        <p className="text-xl font-normal text-foreground">{name}</p>
        <p className="text-sm text-muted-foreground">{company}</p>
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-border mx-4 shrink-0" />

      {/* Dates */}
      <div className="flex gap-10 shrink-0">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Start Date</span>
          <span className="text-sm text-foreground">{startDate}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Deadline</span>
          <span className="text-sm text-foreground">{deadline}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-12 bg-border mx-4 shrink-0" />

      {/* Status & Action */}
      <div className="flex items-center gap-3 shrink-0">
        <span className={cn("text-xs font-medium px-4 py-1.5 rounded-[2px] tracking-wide", statusStyles[status])}>
          {status}
        </span>
        <Button type="button" variant="outline" size="lg" className="cursor-pointer">
          Open Workspace
        </Button>
      </div>
    </Card>
  )
}