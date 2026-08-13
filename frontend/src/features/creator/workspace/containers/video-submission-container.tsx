"use client"
import { useEffect } from "react"
import { toast } from "sonner"
import { useFileUploads } from "@/src/features/creator/workspace/hooks/useFileUpload"
import { useSubmitMediaAsset } from "@/src/features/creator/workspace/hooks/useSubmitMediaAsset"
import { VideoSubmission } from "@/src/features/creator/workspace/components/deliverables-submission/video-submission"
import type { MediaAsset } from "@/src/features/client/workspace/services/deliverable-submissions-api"
import type { UploadedFile } from "../types/file-upload.types"

const ALLOWED_EXTENSIONS = [".mp4", ".mov", ".jpg", ".png"]

interface VideoSubmissionContainerProps {
  version: number
  onDirtyChange: (dirty: boolean) => void
  onHistory: () => void
  deliverableItemPublicId?: string
  mediaAsset?: MediaAsset | null
  onSubmit?: (files: UploadedFile[]) => void
  onNext?: () => void
}

export function VideoSubmissionContainer({
  version,
  onDirtyChange,
  onHistory,
  deliverableItemPublicId,
  mediaAsset,
  onSubmit,
  onNext,
}: VideoSubmissionContainerProps) {
  const { files, addFiles, removeFile, clearFiles } = useFileUploads()
  const { mutateAsync: submitMediaAsset, isPending: isSubmitting } =
    useSubmitMediaAsset()

  useEffect(() => {
    onDirtyChange(files.length > 0)
    return () => onDirtyChange(false)
  }, [files.length, onDirtyChange])

  const handleFileDrop = (fileList: FileList | File[]) => {
    const files = Array.from(fileList)
    const allowed = (file: File) =>
      ALLOWED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext))
    const rejected = files.filter((file) => !allowed(file))

    if (rejected.length > 0) {
      toast.error(
        `Only .mp4, .mov, .jpg and .png files are allowed. Skipped: ${rejected
          .map((f) => f.name)
          .join(", ")}`,
      )
    }

    const accepted = files.filter(allowed)
    if (accepted.length > 0) addFiles(accepted)
  }

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
      clearFiles()
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
      onFileDrop={handleFileDrop}
      onRemoveFile={removeFile}
      onPreviewFile={handlePreview}
      onSubmit={handleSubmit}
      onNext={onNext}
      isSubmitting={isSubmitting}
    />
  )
}
