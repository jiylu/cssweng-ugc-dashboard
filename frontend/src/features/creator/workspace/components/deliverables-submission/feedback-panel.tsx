import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/src/components/atoms/card"
import { Separator } from "@/components/ui/separator"
import type { WrittenAsset } from "@/src/features/client/workspace/services/deliverable-submissions-api"

interface FeedbackPanelProps {
  writtenAsset?: WrittenAsset | null
}

export function FeedbackPanel({ writtenAsset }: FeedbackPanelProps) {
  const comment = writtenAsset?.client_comments?.trim()

  return (
    <div className="w-64 shrink-0 flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <Card className="flex flex-col gap-2 p-4">
          <h2 className="text-xl font-normal text-foreground">Feedback</h2>
          <Separator />
          {comment ? (
            <>
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs bg-muted">CB</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground">Client</span>
              </div>
              <p className="text-sm text-muted-foreground">{comment}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              {writtenAsset?.written_asset_action === "APPROVE"
                ? "Written assets approved."
                : "No feedback yet."}
            </p>
          )}
        </Card>
      </div>
    </div>
  )
}
