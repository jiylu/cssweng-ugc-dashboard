import { Campaign } from "@/src/features/creator/campaigns/types/campaign.types"
import { CAMPAIGNS_PAGE_SIZE } from "../services/getCampaigns"
import { cn } from "@/lib/utils"
import { CampaignCard } from "./campaign-card"
import { useRouter } from "next/navigation"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface CampaignListProps {
  campaigns: Campaign[]
  page: number
  onPageChange: (page: number) => void
}


export function CampaignList({ campaigns, page, onPageChange }: CampaignListProps) {
  const router = useRouter()
  const limit = CAMPAIGNS_PAGE_SIZE
  
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
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (page > 1) onPageChange(page - 1)
                }}
                aria-disabled={page === 1}
                className={cn(page === 1 && "pointer-events-none opacity-50")}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (campaigns.length === limit) onPageChange(page + 1)
                }}
                aria-disabled={campaigns.length < limit}
                className={cn(campaigns.length < limit && "pointer-events-none opacity-50")}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}