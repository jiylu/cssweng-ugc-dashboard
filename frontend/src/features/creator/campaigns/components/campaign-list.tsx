import { Campaign } from "@/src/features/creator/campaigns/types/campaign.types"
import { CampaignCard } from "./campaign-card"

interface CampaignListProps {
  campaigns: Campaign[]
  total: number
  page: number
  onPageChange: (page: number) => void
}

export function CampaignList({ campaigns, total, page, onPageChange }: CampaignListProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* TODO: Cnnect to backend */}
      {campaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            name={campaign.project_name}
            company={campaign.comapny_name}
            startDate={campaign.start_date}
            deadline={campaign.deadline}
            status={campaign.status}
          />
      ))}
      <p className="text-sm text-muted-foreground mt-2">
        Showing {campaigns.length} out of {total} Campaigns
      </p>
    </div>
  )
}