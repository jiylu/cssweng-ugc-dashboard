import { cn } from "@/lib/utils"

const MOCK_DELIVERABLES = ["Name 1", "Name 2", "Name 3", "Name 4"]

interface DeliverablesSidebarProps {
  activeDeliverable: number
  onChange: (index: number) => void
}

// TO DO: MAKE THIS DYNAMIC ONCE PROPOSALS ARE FIXED
export function DeliverablesSidebar({ activeDeliverable, onChange }: DeliverablesSidebarProps) {
  return (
    <div className="flex flex-col gap-1 w-48 shrink-0">
      <p className="text-sm font-medium text-foreground mb-2">Deliverables</p>
      {MOCK_DELIVERABLES.map((name, index) => (
        <button
          key={name}
          onClick={() => onChange(index)}
          className={cn(
            "text-left px-4 py-2 text-sm rounded-[3px] transition-colors",
            activeDeliverable === index
              ? "bg-[#6b1fa8] text-white font-medium"
              : "text-muted-foreground hover:bg-muted"
          )}
        >
          {name}
        </button>
      ))}
    </div>
  )
}