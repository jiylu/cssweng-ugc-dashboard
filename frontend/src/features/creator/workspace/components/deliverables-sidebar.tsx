import { Deliverable } from "../types/workspace.types"
import type { DeliverableItem } from "@/src/features/client/workspace/services/deliverable-submissions-api"
import { DeliverableCard } from "./deliverable-card"

interface DeliverablesSidebarProps {
  deliverables: Deliverable[]
  itemsByDeliverable: DeliverableItem[][]
  activeDeliverable: number
  activeDeliverableItem: number
  activeDeliverableStep: number
  onChange: (index: number) => void
  onDeliverableItemChange: (itemIndex: number) => void
  onStepChange: (step: number) => void
}

export function DeliverablesSidebar({
  deliverables,
  itemsByDeliverable,
  activeDeliverable,
  activeDeliverableItem,
  activeDeliverableStep,
  onChange,
  onDeliverableItemChange,
  onStepChange,
}: DeliverablesSidebarProps) {
  return (
    <div className="flex flex-col gap-3 w-64 shrink-0">
      <p className="text-2xl text-foreground">Deliverables</p>
      {deliverables.map((deliverable, index) => (
        <DeliverableCard
          key={deliverable.public_id}
          deliverable={deliverable}
          items={itemsByDeliverable[index] ?? []}
          isActive={activeDeliverable === index}
          activeItemIndex={activeDeliverableItem}
          activeStep={activeDeliverableStep}
          onClick={() => onChange(index)}
          onItemClick={onDeliverableItemChange}
          onStepChange={onStepChange}
        />
      ))}
    </div>
  )
}
