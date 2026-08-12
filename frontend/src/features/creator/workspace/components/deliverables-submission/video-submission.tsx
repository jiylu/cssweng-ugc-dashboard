import { Card } from "@/src/components/atoms/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FileDropzone } from "./file-dropzone"
import { FileUploadItem } from "./file-upload-item"

const MOCK_FILES = [
  { id: 1, filename: "file.mp4", status: "done" as const },
  { id: 2, filename: "file.mp4", status: "uploading" as const, progress: 70 },
]

interface VideoSubmissionProps {
  version: number
  onHistory: () => void
  onSubmit: () => void
}

export function VideoSubmission({ version, onHistory, onSubmit }: VideoSubmissionProps) {
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

      {/* Dropzone */}
      <FileDropzone />

      {/* File List */}
      <div className="flex flex-col gap-2">
        {MOCK_FILES.map((file) => (
          <FileUploadItem
            key={file.id}
            filename={file.filename}
            status={file.status}
            progress={file.progress}
            onPreview={() => console.log("Preview", file.filename)}
            onRemove={() => console.log("Remove", file.filename)}
          />
        ))}
      </div>

      {/* Submit */}
      <div className="flex justify-end mt-2">
        <Button onClick={onSubmit} className="bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white">
          Submit
        </Button>
      </div>
    </Card>
  )
}