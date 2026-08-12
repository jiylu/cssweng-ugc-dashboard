import { Deliverable } from "../types/workspace.types"
import { DeliverableCard } from "./deliverable-card"

interface DeliverablesSidebarProps {
  deliverables: Deliverable[]
  activeDeliverable: number
  onChange: (index: number) => void
  activeStep: number
  onStepChange: (step: number) => void
}

export function DeliverablesSidebar({ deliverables, activeDeliverable, onChange, activeStep, onStepChange }: DeliverablesSidebarProps) {
  return (
    <div className="flex flex-col gap-3 w-64 shrink-0">
      <p className="text-2xl text-foreground">Deliverables</p>
      {deliverables.map((deliverable, index) => (
        <DeliverableCard
          key={deliverable.public_id}
          deliverable={deliverable}
          isActive={activeDeliverable === index}
          onClick={() => onChange(index)}
          activeStep={activeStep}
          onStepChange={onStepChange}
        />
      ))}
    </div>
  )
}