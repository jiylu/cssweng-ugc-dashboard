import { Card } from "@/src/components/atoms/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FileDropzone } from "./file-dropzone"
import { FileUploadItem } from "./file-upload-item"
import { UploadedFile } from "@/src/features/creator/workspace/types/file-upload.types"
import type { MediaAsset } from "@/src/features/client/workspace/services/deliverable-submissions-api"
import { filenameFromUrl } from "./media-file-utils"

interface VideoSubmissionProps {
  version: number
  files: UploadedFile[]
  mediaAsset?: MediaAsset | null
  onHistory: () => void
  onFileDrop: (files: FileList) => void
  onRemoveFile: (id: string) => void
  onPreviewFile: (id: string) => void
  onSubmit: () => void
  onNext?: () => void
  isSubmitting?: boolean
}

export function VideoSubmission({
  version,
  files,
  mediaAsset,
  onHistory,
  onFileDrop,
  onRemoveFile,
  onPreviewFile,
  onSubmit,
  onNext,
  isSubmitting,
}: VideoSubmissionProps) {
  const action = mediaAsset?.media_asset_action
  const isAwaitingReview = action === "PENDING"
  const isApproved = action === "APPROVE"
  const isRevisionRequested = action === "REVISE"
  const isLocked = isAwaitingReview || isApproved

  return (
    <Card className="flex-1 border border-[#6b1fa8] p-5 flex flex-col gap-4 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl text-foreground">Media Assets</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Version {version}</span>
          <Button variant="outline" className="rounded-[3px]" size="sm" onClick={onHistory}>
            History
          </Button>
        </div>
      </div>

      <Separator />

      {isApproved && (
        <p className="text-xs text-[#2d7a3a] bg-[#e7f4ea] border border-[#2d7a3a]/30 rounded px-3 py-2">
          Approved. This deliverable is now completed.
        </p>
      )}
      {isAwaitingReview && (
        <p className="text-xs text-[#b45309] bg-[#fef3c7] border border-[#b45309]/30 rounded px-3 py-2">
          Submitted and awaiting client approval.
        </p>
      )}
      {isRevisionRequested && (
        <p className="text-xs text-[#b45309] bg-[#fef3c7] border border-[#b45309]/30 rounded px-3 py-2">
          {mediaAsset?.client_comments
            ? `Revision requested: ${mediaAsset.client_comments}`
            : "Revision requested. Please revise and resubmit."}
        </p>
      )}

      {isLocked && mediaAsset ? (
        <FileUploadItem
          filename={filenameFromUrl(mediaAsset.content_url)}
          status="done"
          onPreview={() => window.open(mediaAsset.content_url, "_blank")}
        />
      ) : (
        <>
          {/* Dropzone */}
          <FileDropzone onFileDrop={onFileDrop} />

          {/* File List */}
          <div className="flex flex-col gap-2">
            {files.map((file) => (
              <FileUploadItem
                key={file.id}
                filename={file.filename}
                status={file.status}
                progress={Math.round(file.progress)}
                onPreview={() => onPreviewFile(file.id)}
                onRemove={() => onRemoveFile(file.id)}
              />
            ))}
          </div>
        </>
      )}

      {/* Submit */}
      <div className="flex justify-end mt-2">
        {isApproved && onNext ? (
          <Button
            onClick={onNext}
            className="bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={onSubmit}
            disabled={isLocked || files.length === 0 || files.some((f) => f.status === "uploading") || isSubmitting}
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
