import { Card } from "@/src/components/atoms/card"
import { Separator } from "@/components/ui/separator"
import { ChevronUp, ChevronDown } from "lucide-react"

interface CreativeDirectionProps {
  revisionRounds: number
  setRevisionRounds: (v: number) => void
  revisionDays: number
  setRevisionDays: (v: number) => void
  feedbackDays: number
  setFeedbackDays: (v: number) => void
  errors: Record<string, string>
}

function NumberStepper({ value, onIncrement, onDecrement }: { 
  value: number
  onIncrement: () => void
  onDecrement: () => void 
}) {
  return (
    <div className="inline-flex items-center border border-border rounded-[3px] px-2 py-0.5 bg-white">
      <span className="text-sm w-4 text-center">{value}</span>
      <div className="flex flex-col ml-1">
        <ChevronUp size={10} className="cursor-pointer text-muted-foreground hover:text-foreground" onClick={onIncrement} />
        <ChevronDown size={10} className="cursor-pointer text-muted-foreground hover:text-foreground" onClick={onDecrement} />
      </div>
    </div>
  )
}

export function CreativeDirection({ revisionRounds, setRevisionRounds, revisionDays, setRevisionDays, feedbackDays, setFeedbackDays, errors }: CreativeDirectionProps) {
  return (
    <Card className="flex flex-col gap-4 w-full">
      <h2 className="text-2xl font-normal text-foreground">Creative Direction, Approval, and Revisions</h2>
      <Separator />
      <ol className="flex flex-col gap-3 list-decimal list-inside text-sm text-foreground leading-relaxed">
        <li>Creator will follow the approved campaign brief, key messages, and required talking points provided by Brand in writing.</li>
        <li>Creator will submit draft content for Brand review before posting or final delivery, unless the Parties agree otherwise in writing.</li>
        <li className="flex items-center gap-2 flex-wrap">
          The fee includes
          <NumberStepper
            value={revisionRounds}
            onIncrement={() => setRevisionRounds(revisionRounds + 1)}
            onDecrement={() => setRevisionRounds(Math.max(1, revisionRounds - 1))}
          />
          round of reasonable revisions, requested within
          <NumberStepper
            value={revisionDays}
            onIncrement={() => setRevisionDays(revisionDays + 1)}
            onDecrement={() => setRevisionDays(Math.max(1, revisionDays - 1))}
          />
          business days of draft delivery.
        </li>
        <li>Revisions must be reasonable and related to factual accuracy, brand requirements, legal compliance, or the approved brief. Major creative changes, reshoots, or new concepts may require an additional fee.</li>
        <li className="flex items-center gap-2 flex-wrap">
          If Brand does not provide feedback within
          <NumberStepper
            value={feedbackDays}
            onIncrement={() => setFeedbackDays(feedbackDays + 1)}
            onDecrement={() => setFeedbackDays(Math.max(1, feedbackDays - 1))}
          />
          business days, the draft will be considered approved, unless otherwise agreed in writing.
        </li>
      </ol>
      {errors.revisionRounds && <p className="text-xs mt-1 text-[#ff6467]">{errors.revisionRounds}</p>}
      {errors.revisionDays && <p className="text-xs mt-1 text-[#ff6467]">{errors.revisionDays}</p>}
      {errors.feedbackDays && <p className="text-xs mt-1 text-[#ff6467]">{errors.feedbackDays}</p>}
    </Card>
  )
}