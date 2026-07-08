import { cn } from "@/lib/utils"

const STEPS = [
  { number: 1, label: "Campaign & Deliverables" },
  { number: 2, label: "Contract Terms" },
  { number: 3, label: "Add-Ons" },
  { number: 4, label: "Payment Terms" },
]

export function ProposalProgressBar({ activeStep, onStepChange }: { activeStep: number, onStepChange?: (step: number) => void }) {
  return (
    <div className="flex items-center gap-0 w-full mb-6">
      {STEPS.map((step, index) => (
        <div key={step.number} className={cn("flex items-center cursor-pointer", index < STEPS.length - 1 && "flex-1")} onClick={() => onStepChange?.(step.number)}>
          <div className="flex flex-col items-center gap-1 min-w-max">
            <div className={cn(
              "w-8 h-8 rounded-[3px] flex items-center justify-center text-sm font-medium border",
              activeStep === step.number
                ? "bg-[#6b1fa8] text-white border-[#6b1fa8]"
                : "bg-transparent text-muted-foreground border-border"
            )}>
              {step.number}
            </div>
            <span className={cn(
              "text-xs whitespace-nowrap",
              activeStep === step.number ? "text-[#6b1fa8] font-medium" : "text-muted-foreground"
            )}>
              {step.label}
            </span>
          </div>
          {index < STEPS.length - 1 && (
            <div className="h-px flex-1 bg-border mb-4 mx-2" />
          )}
        </div>
      ))}
    </div>
  )
}