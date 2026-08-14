import { CheckCircle2 } from "lucide-react"
import { Card } from "@/src/components/atoms/card"
import Button from "@/src/components/atoms/button"

interface DeliverableApprovedCardProps {
  deliverableName: string
  onNext: () => void
}

export function DeliverableApprovedCard({
  deliverableName,
  onNext,
}: DeliverableApprovedCardProps) {
  return (
    <Card className="flex flex-col items-center gap-3 px-10 py-10 max-w-lg mx-auto text-center">
      <CheckCircle2 className="text-[#2d7a3a]" size={56} strokeWidth={1.5} />

      <h2 className="text-2xl font-normal text-foreground">
        Deliverable Completed &amp; Approved
      </h2>

      <p className="text-sm text-muted-foreground">
        Good job! The client has reviewed and approved your {deliverableName} submission.
      </p>

      <p className="text-xs italic text-muted-foreground">
        Tip: You can view your submissions by clicking on the stages in the
        card on the left.
      </p>

      <Button type="button" className="mt-2 min-w-48" onClick={onNext}>
        Next: Invoicing
      </Button>
    </Card>
  )
}
