import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"
import { formatDate } from "@/src/utils/date"
import { Deliverable } from "../types/workspace.types"
import type { DeliverableItem } from "@/src/features/client/workspace/services/deliverable-submissions-api"
import { DeliverableStepList } from "./deliverable-step-list"

interface DeliverableCardProps {
  deliverable: Deliverable
  items: DeliverableItem[]
  isActive: boolean
  activeItemIndex: number
  activeStep: number
  onClick: () => void
  onItemClick: (itemIndex: number) => void
  onStepChange: (step: number) => void
}

function itemProgressStep(item: DeliverableItem): number {
  if (item.deliverable_item_status === "APPROVED") return 2
  if (item.written_asset_approved) return 1
  return 0
}

export function DeliverableCard({
  deliverable,
  items,
  isActive,
  activeItemIndex,
  activeStep,
  onClick,
  onItemClick,
  onStepChange,
}: DeliverableCardProps) {
  return (
    <div
      className={cn(
        "w-full rounded-[3px] border border-border overflow-hidden bg-white",
        isActive && "border-[#6b1fa8]"
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex items-start justify-between gap-2 px-4 py-3 w-full text-left",
          isActive && "bg-[#6b1fa8]"
        )}
      >
        <div className="flex flex-col gap-1">
          <span
            className={cn(
              "text-xs font-semibold",
              isActive ? "text-white" : "text-foreground"
            )}
          >
            {deliverable.deliverable_content}
          </span>
          <span
            className={cn(
              "text-xs",
              isActive ? "text-white/80" : "text-muted-foreground"
            )}
          >
            Due: {formatDate(new Date(deliverable.due_date))}
          </span>
        </div>

        <Badge
          className={cn(
            "shrink-0 rounded-sm text-[10px] font-medium tracking-[0.03em] px-2 py-0.5",
            isActive
              ? "bg-white/15 text-white border-0"
              : "bg-[#6b1fa8] text-white border-0"
          )}
        >
          {deliverable.deliverable_type}
        </Badge>
      </button>

      {isActive && items.length > 0 && (
        <div className="px-4 py-4 flex flex-col gap-4">
          {items.map((item, index) => {
            const isItemActive = index === activeItemIndex
            const step = isItemActive ? activeStep : itemProgressStep(item)
            const itemName =
              items.length > 1
                ? `${deliverable.deliverable_content} ${item.deliverable_index}`
                : deliverable.deliverable_content
            const isApproved = item.deliverable_item_status === "APPROVED"

            return (
              <div key={item.public_id} className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => onItemClick(index)}
                  className={cn(
                    "flex items-center justify-between gap-2 w-full px-3 py-2 rounded-[3px] text-left transition-colors",
                    isItemActive
                      ? "bg-[#6b1fa8]/10 text-[#6b1fa8]"
                      : "bg-muted text-foreground hover:bg-muted/70"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-medium truncate">{itemName}</span>
                    <span
                      className={cn(
                        "shrink-0 rounded-[3px] text-[10px] font-medium px-1.5 py-0.5",
                        isApproved
                          ? "text-[#2d7a3a] bg-[#e7f4ea]"
                          : "text-muted-foreground bg-muted-foreground/10"
                      )}
                    >
                      {isApproved ? "Completed" : "Drafting"}
                    </span>
                  </div>
                  {isApproved && (
                    <CheckCircle2 size={16} className="shrink-0 text-[#2d7a3a]" />
                  )}
                </button>

                <div className="pl-3">
                  <DeliverableStepList
                    activeStep={step}
                    onStepChange={(nextStep) => {
                      onItemClick(index)
                      onStepChange(nextStep)
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
