import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/src/components/atoms/card"
import { Separator } from "@/components/ui/separator"
import { useWrittenAssetsPanel } from "@/src/features/creator/workspace/hooks/useWrittenAssetsPanel"
import RichTextEditor from "@/components/ui/rich-text-editor"
import { WrittenAssetPreview } from "./written-asset-preview"
import type { WrittenAsset } from "@/src/features/client/workspace/services/deliverable-submissions-api"

interface WrittenAssetsPanelProps {
  version: number
  onDirtyChange: (dirty: boolean) => void
  onSaveDraft: () => void
  onSubmit: (content: string) => void
  onNext: () => void
  onHistory: () => void
  writtenAsset?: WrittenAsset | null
  isSubmitting?: boolean
  itemsLoading?: boolean
  itemsError?: boolean
}

export function WrittenAssetsPanel({
  version,
  onDirtyChange,
  onSaveDraft,
  onSubmit,
  onNext,
  onHistory,
  writtenAsset,
  isSubmitting,
  itemsLoading,
  itemsError,
}: WrittenAssetsPanelProps) {
  const { content, errors, updateContent, validateAndSave } = useWrittenAssetsPanel()

  const submittedContent = writtenAsset?.content ?? ""

  useEffect(() => {
    updateContent(submittedContent)
  }, [writtenAsset?.public_id])

  useEffect(() => {
    onDirtyChange(content !== "" && content !== submittedContent)
    return () => onDirtyChange(false)
  }, [content, submittedContent, onDirtyChange])

  const action = writtenAsset?.written_asset_action
  const isAwaitingReview = action === "PENDING"
  const isApproved = action === "APPROVE"
  const isRevisionRequested = action === "REVISE"
  const isLocked = isAwaitingReview || isApproved

  return (
    <Card className="flex-1 border border-[#6b1fa8] p-5 flex flex-col gap-4 min-w-0 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl text-foreground">Written Assets</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Version {version}</span>
          <Button variant="outline" className="rounded-[3px]" size="sm" onClick={onHistory}>History</Button>
        </div>
      </div>

      <Separator />

      {isApproved && (
        <p className="text-xs text-[#2d7a3a] bg-[#e7f4ea] border border-[#2d7a3a]/30 rounded px-3 py-2">
          Approved. You can now move on to Media Assets.
        </p>
      )}
      {isAwaitingReview && (
        <p className="text-xs text-[#b45309] bg-[#fef3c7] border border-[#b45309]/30 rounded px-3 py-2">
          Submitted and awaiting client approval.
        </p>
      )}
      {isRevisionRequested && (
        <p className="text-xs text-[#b45309] bg-[#fef3c7] border border-[#b45309]/30 rounded px-3 py-2">
          {writtenAsset?.client_comments
            ? `Revision requested: ${writtenAsset.client_comments}`
            : "Revision requested. Please revise and resubmit."}
        </p>
      )}
      {itemsLoading && (
        <p className="text-xs text-muted-foreground bg-muted border border-muted-foreground/20 rounded px-3 py-2">
          Loading deliverable items…
        </p>
      )}
      {itemsError && (
        <p className="text-xs text-[#ff6467] bg-[#fdecec] border border-[#ff6467]/30 rounded px-3 py-2">
          Could not load deliverable items. Please refresh and try again.
        </p>
      )}

      {isLocked ? (
        <WrittenAssetPreview content={writtenAsset?.content ?? ""} />
      ) : (
        <RichTextEditor content={content} onChange={updateContent} />
      )}

      <p className="text-xs mt-1 text-[#ff6467] min-h-[16px]">{errors.content ?? ""}</p>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onSaveDraft}>Save Draft</Button>
        {isApproved ? (
          <Button
            onClick={onNext}
            className="bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white"
          >
            Next: Media Assets
          </Button>
        ) : (
          <Button
            onClick={() => validateAndSave(onSubmit)}
            disabled={isSubmitting}
            title={isAwaitingReview ? "Submitted and awaiting client approval." : undefined}
            className="bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        )}
      </div>
    </Card>
  )
}
