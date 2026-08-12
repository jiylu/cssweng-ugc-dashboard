import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Deliverable } from "../types/workspace.types"
import { DeliverableStepList } from "./deliverable-step-list"

interface DeliverableCardProps {
  deliverable: Deliverable
  isActive: boolean
  onClick: () => void
  activeStep: number
  onStepChange: (step: number) => void
}

export function DeliverableCard({ deliverable, isActive, onClick, activeStep, onStepChange, }: DeliverableCardProps) {
  return (
    <div
      className={cn(
        "w-full rounded-[3px] border border-border overflow-hidden bg-background",
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
              "text-sm font-semibold",
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
            Due: {deliverable.due_date}
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

      {isActive && (
        <div className="px-4 py-4">
          <DeliverableStepList
            activeStep={activeStep}
            onStepChange={onStepChange}
          />
        </div>
      )}
    </div>
  )
}