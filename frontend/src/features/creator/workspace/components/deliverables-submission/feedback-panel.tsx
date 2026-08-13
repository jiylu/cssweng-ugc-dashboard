import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/src/components/atoms/card"
import { Separator } from "@/components/ui/separator"
import type {
  MediaAsset,
  WrittenAsset,
} from "@/src/features/client/workspace/services/deliverable-submissions-api"

interface FeedbackPanelProps {
  writtenAsset?: WrittenAsset | null
  mediaAsset?: MediaAsset | null
  type: "written" | "media"
}

export function FeedbackPanel({ writtenAsset, mediaAsset, type }: FeedbackPanelProps) {
  const asset = type === "written" ? writtenAsset : mediaAsset
  const comment = asset?.client_comments?.trim()
  const isApproved =
    type === "written"
      ? writtenAsset?.written_asset_action === "APPROVE"
      : mediaAsset?.media_asset_action === "APPROVE"

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
              {isApproved
                ? type === "written"
                  ? "Written assets approved."
                  : "Media asset approved."
                : "No feedback yet."}
            </p>
          )}
        </Card>
      </div>
    </div>
  )
}
