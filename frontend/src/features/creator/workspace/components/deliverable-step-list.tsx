import { cn } from "@/lib/utils"

const STEPS = ["Written Assets", "Media Assets", "Completed"]

interface DeliverableStepListProps {
  activeStep: number
  onStepChange: (step: number) => void
}

export function DeliverableStepList({ activeStep, onStepChange }: DeliverableStepListProps) {
  return (
    <ul className="flex flex-col">
      {STEPS.map((step, index) => {
        const isCompleted = index < activeStep
        const isCurrent = index === activeStep
        const isLast = index === STEPS.length - 1

        return (
          <li key={step}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onStepChange(index)
              }}
              className="flex items-stretch gap-3 w-full text-left"
            >
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-full transition-colors",
                    isCompleted
                      ? "bg-[#2d7a3a]"
                      : isCurrent
                      ? "bg-[#6b1fa8]"
                      : "bg-[#c9c4bb]"
                  )}
                  aria-hidden
                />
                {!isLast && (
                  <span
                    className={cn(
                      "w-px flex-1 my-1 border-l border-dashed transition-colors",
                      isCompleted
                        ? "border-[#2d7a3a]"
                        : "border-[#6b1fa8]/40"
                    )}
                    aria-hidden
                  />
                )}
              </div>
              <span
                className={cn(
                  "text-sm",
                  !isLast && "pb-3",
                  isCurrent
                    ? "font-medium text-[#6b1fa8]"
                    : isCompleted
                    ? "text-[#2d7a3a]"
                    : "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}