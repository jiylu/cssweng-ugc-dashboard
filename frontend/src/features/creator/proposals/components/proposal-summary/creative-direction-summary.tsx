interface CreativeDirectionSummaryProps {
  revisionRounds: number
  revisionDays: number
  feedbackDays: number
}

export function CreativeDirectionSummary({ revisionRounds, revisionDays, feedbackDays }: CreativeDirectionSummaryProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-foreground">3. Creative Direction, Approval, and Revisions</h3>
      <ul className="flex flex-col gap-1 list-disc list-inside">
        <li className="text-xs text-muted-foreground">Creator agrees to follow the provided creative brief and brand guidelines.</li>
        <li className="text-xs text-muted-foreground">All content must be submitted for brand approval via the Asceoft platform prior to posting.</li>
        <li className="text-xs text-muted-foreground">Brand is entitled to <span className="text-[#6b1fa8]">{revisionRounds === 3 ? "3+" : revisionRounds} round{revisionRounds !== 1 ? "s" : ""}</span> of reasonable revisions per deliverable.</li>
        <li className="text-xs text-muted-foreground">Revisions must be requested within <span className="text-[#6b1fa8]">{revisionDays} business day/s</span> of draft delivery.</li>
        <li className="text-xs text-muted-foreground">Revisions requested outside the original scope may incur additional fees.</li>
        <li className="text-xs text-muted-foreground">Final approved content must not be altered before posting without written consent.</li>
      </ul>
    </div>
  )
}