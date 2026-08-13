"use client"
import { toast } from "sonner"
import { useFileUploads } from "@/src/features/creator/workspace/hooks/useFileUpload"
import { useSubmitMediaAsset } from "@/src/features/creator/workspace/hooks/useSubmitMediaAsset"
import { VideoSubmission } from "@/src/features/creator/workspace/components/deliverables-submission/video-submission"
import type { MediaAsset } from "@/src/features/client/workspace/services/deliverable-submissions-api"
import type { UploadedFile } from "../types/file-upload.types"

interface VideoSubmissionContainerProps {
  version: number
  onHistory: () => void
  deliverableItemPublicId?: string
  mediaAsset?: MediaAsset | null
  onSubmit?: (files: UploadedFile[]) => void
  onNext?: () => void
}

export function VideoSubmissionContainer({
  version,
  onHistory,
  deliverableItemPublicId,
  mediaAsset,
  onSubmit,
  onNext,
}: VideoSubmissionContainerProps) {
  const { files, addFiles, removeFile } = useFileUploads()
  const { mutateAsync: submitMediaAsset, isPending: isSubmitting } =
    useSubmitMediaAsset()

  const handlePreview = (id: string) => {
    const target = files.find((f) => f.id === id)
    if (target) window.open(target.previewUrl, "_blank")
  }

  const handleSubmit = async () => {
    const readyFiles = files.filter((f) => f.status === "done")
    if (readyFiles.length === 0) return

    if (!deliverableItemPublicId) {
      toast.error("Deliverable items are still loading. Please try again.")
      return
    }

    if (onSubmit) {
      onSubmit(readyFiles)
      return
    }

    try {
      for (const file of readyFiles) {
        await submitMediaAsset({
          deliverableItemPublicId,
          file: file.file,
        })
      }
      toast.success("Media asset submitted for approval.")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to submit media asset.",
      )
    }
  }

  return (
    <VideoSubmission
      version={version}
      files={files}
      mediaAsset={mediaAsset}
      onHistory={onHistory}
      onFileDrop={addFiles}
      onRemoveFile={removeFile}
      onPreviewFile={handlePreview}
      onSubmit={handleSubmit}
      onNext={onNext}
      isSubmitting={isSubmitting}
    />
  )
}
