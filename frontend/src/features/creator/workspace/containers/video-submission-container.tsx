"use client"
import { useEffect } from "react"
import { toast } from "sonner"
import { useFileUploads } from "@/src/features/creator/workspace/hooks/useFileUpload"
import { useSubmitMediaAsset } from "@/src/features/creator/workspace/hooks/useSubmitMediaAsset"
import { VideoSubmission } from "@/src/features/creator/workspace/components/deliverables-submission/video-submission"
import type { MediaAsset } from "@/src/features/client/workspace/services/deliverable-submissions-api"
import type { UploadedFile } from "../types/file-upload.types"

const ALL_EXTENSIONS = [".mp4", ".mov", ".jpg", ".png"]
const VIDEO_EXTENSIONS = [".mp4", ".mov"]
const SINGLE_VIDEO_TYPES = new Set(["video", "short", "reel"])

interface VideoSubmissionContainerProps {
  version: number
  onDirtyChange: (dirty: boolean) => void
  onHistory: () => void
  deliverableItemPublicId?: string
  mediaAsset?: MediaAsset | null
  contentType?: string
  onSubmit?: (files: UploadedFile[]) => void
  onNext?: () => void
}

export function VideoSubmissionContainer({
  version,
  onDirtyChange,
  onHistory,
  deliverableItemPublicId,
  mediaAsset,
  contentType,
  onSubmit,
  onNext,
}: VideoSubmissionContainerProps) {
  const { files, addFiles, removeFile, clearFiles } = useFileUploads()
  const { mutateAsync: submitMediaAsset, isPending: isSubmitting } =
    useSubmitMediaAsset()

  const normalizedContentType = (contentType ?? "").trim().toLowerCase()
  const isSingleVideo = SINGLE_VIDEO_TYPES.has(normalizedContentType)
  const allowedExtensions = isSingleVideo ? VIDEO_EXTENSIONS : ALL_EXTENSIONS
  const maxFiles = isSingleVideo ? 1 : Number.POSITIVE_INFINITY

  useEffect(() => {
    onDirtyChange(files.length > 0)
    return () => onDirtyChange(false)
  }, [files.length, onDirtyChange])

  const formatExtensions = (extensions: string[]) =>
    extensions.length <= 1
      ? extensions.join("")
      : `${extensions.slice(0, -1).join(", ")} and ${extensions[extensions.length - 1]}`

  const handleFileDrop = (fileList: FileList | File[]) => {
    const dropped = Array.from(fileList)
    const allowed = (file: File) =>
      allowedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
    const rejected = dropped.filter((file) => !allowed(file))

    if (rejected.length > 0) {
      toast.error(
        `Only ${formatExtensions(allowedExtensions)} files are allowed. Skipped: ${rejected
          .map((f) => f.name)
          .join(", ")}`,
      )
    }

    let accepted = dropped.filter(allowed)
    const remainingSlots = Math.max(0, maxFiles - files.length)
    if (accepted.length > remainingSlots) {
      const overflow = accepted.slice(remainingSlots)
      accepted = accepted.slice(0, remainingSlots)
      toast.error(
        `Only ${maxFiles} file${maxFiles === 1 ? "" : "s"} can be uploaded for ${normalizedContentType}. Skipped: ${overflow
          .map((f) => f.name)
          .join(", ")}`,
      )
    }

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
      accept={allowedExtensions.join(",")}
      multiple={!isSingleVideo}
    />
  )
}
