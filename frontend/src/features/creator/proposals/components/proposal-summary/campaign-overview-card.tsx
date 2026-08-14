import { Card } from "@/src/components/atoms/card"
import { Separator } from "@/components/ui/separator"

interface CampaignOverviewCardProps {
    campaignName: string
    startDate: string
    endDate: string
    description: string
}

export function CampaignOverviewCard({ campaignName, startDate, endDate, description }: CampaignOverviewCardProps) {
    return (
        <Card className="flex flex-col gap-4 p-6">
            <h2 className="text-2xl font-normal text-foreground">Campaign Overview</h2>
            <Separator />
            <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1 min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-[0.03em]">Campaign Name</p>
                <p className="text-base font-medium text-foreground uppercase break-words">{campaignName}</p>
            </div>
            <div className="flex flex-col gap-1 min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-[0.03em]">Campaign Date</p>
                <p className="text-base text-foreground break-words">{startDate} - {endDate}</p>
            </div>
            </div>
            <div className="flex flex-col gap-1 min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-[0.03em]">Description</p>
                <p className="text-sm text-foreground leading-relaxed break-words">{description}</p>
            </div>
        </Card>
    )
}