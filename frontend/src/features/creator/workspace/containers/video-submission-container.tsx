"use client"
import { useFileUploads } from "@/src/features/creator/workspace/hooks/useFileUpload"
import { VideoSubmission } from "@/src/features/creator/workspace/components/deliverables-submission/video-submission"
import { UploadedFile } from "../types/file-upload.types"

interface VideoSubmissionContainerProps {
  version: number
  onHistory: () => void
  onSubmit?: (files: UploadedFile[]) => void
}

export function VideoSubmissionContainer({ version, onHistory, onSubmit }: VideoSubmissionContainerProps) {
  const { files, addFiles, removeFile } = useFileUploads()

  const handlePreview = (id: string) => {
    const target = files.find((f) => f.id === id)
    if (target) window.open(target.previewUrl, "_blank")
  }

  const handleSubmit = () => {
    // TODO: replace with real submission call once backend endpoint exists
    // onSubmit?.(files)
    console.log(files)
  }

  return (
    <VideoSubmission
      version={version}
      files={files}
      onHistory={onHistory}
      onFileDrop={addFiles}
      onRemoveFile={removeFile}
      onPreviewFile={handlePreview}
      onSubmit={handleSubmit}
    />
  )
}