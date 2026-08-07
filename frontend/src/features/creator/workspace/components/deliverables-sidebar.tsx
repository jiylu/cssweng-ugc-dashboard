import { cn } from "@/lib/utils"
import { Deliverable } from "@/src/features/creator/workspace/types/workspace.types"

interface DeliverablesSidebarProps {
  deliverables: Deliverable[]
  activeDeliverable: number
  onChange: (index: number) => void
}

export function DeliverablesSidebar({ deliverables, activeDeliverable, onChange }: DeliverablesSidebarProps) {
  return (
    <div className="flex flex-col gap-1 w-48 shrink-0">
      <p className="text-sm font-medium text-foreground mb-2">Deliverables</p>
      {deliverables.map((deliverable, index) => (
        <button
          key={deliverable.public_id}
          onClick={() => onChange(index)}
          className={cn(
            "text-left px-4 py-2 text-sm rounded-[3px] transition-colors",
            activeDeliverable === index
              ? "bg-[#6b1fa8] text-white font-medium"
              : "text-muted-foreground hover:bg-muted"
          )}
        >
          {deliverable.deliverable_content}
        </button>
      ))}
    </div>
  )
}