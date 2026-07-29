import { Campaign } from "@/src/features/creator/campaigns/types/campaign.types"
import { Button } from "@/components/ui/button"
import { CampaignCard } from "./campaign-card"
import { useRouter } from "next/navigation"

interface CampaignListProps {
  campaigns: Campaign[]
}


export function CampaignList({ campaigns }: CampaignListProps) {
  const router = useRouter()
  const limit = 10
  
  return (
    <div className="flex flex-col gap-3">
      {campaigns.map((campaign) => (
        <CampaignCard
          key={campaign.public_id}
          campaign={campaign}
          onOpenWorkspace={(id) => router.push(`/workspace/${id}`)}
        />
      ))}

      <div className="flex items-center justify-between mt-2">
        <p className="text-sm text-muted-foreground">
          Showing {campaigns.length} Campaign{campaigns.length !== 1 ? "s" : ""}
        </p>
        {/* <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page * limit >= total}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div> */}
      </div>
    </div>
  )
}