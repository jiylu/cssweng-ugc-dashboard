import { cn } from "@/lib/utils"

const STEPS = ["Contract Signing", "Deliverables Submission", "Invoicing", "Completion"]

interface CampaignProgressProps {
  activeStep: number
  onStepChange: (step: number) => void
}

export function CampaignProgress({ activeStep, onStepChange }: CampaignProgressProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">Campaign Progress</p>
      <div className="flex items-center">
        {STEPS.map((step, index) => (
          <div key={step} className="flex items-center">
            {/* Progress icons */}
            <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => onStepChange(index)}>
              <div
                className={cn(
                  "w-5 h-5 rounded-[3px] border-2 transition-colors",
                  index < activeStep
                    ? "bg-[#2d7a3a] border-[#2d7a3a]"
                    : index === activeStep
                    ? "bg-[#6b1fa8] border-[#6b1fa8]"
                    : "bg-transparent border-border"
                )}
              />
              <span
                className={cn(
                  "text-[11px] whitespace-nowrap",
                  index === activeStep
                    ? "text-[#6b1fa8]"
                    : "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>

            {/* Connector line */}
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-px w-24 mb-4 mx-1",
                  index < activeStep ? "bg-[#2d7a3a]" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}