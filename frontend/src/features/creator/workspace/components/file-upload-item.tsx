import { Button } from "@/components/ui/button"
import { CheckCircle, X } from "lucide-react"

interface FileUploadItemProps {
  filename: string
  status: "done" | "uploading"
  progress?: number
  onPreview?: () => void
  onRemove?: () => void
}

export function FileUploadItem({ filename, status, progress, onPreview, onRemove }: FileUploadItemProps) {
  return (
    <div className="flex items-center justify-between border border-border rounded-[3px] px-3 py-2 text-sm text-foreground">
      <span className="text-sm text-foreground">{filename}</span>

      {status === "done" && (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-6 text-xs rounded-[3px]" onClick={onPreview}>
            Preview
          </Button>
          <CheckCircle size={16} className="text-[#2d7a3a]" />
          <button onClick={onRemove} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={14} />
          </button>
        </div>
      )}

      {status === "uploading" && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{progress}%</span>
          <div className="w-4 h-4 border-2 border-[#6b1fa8] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}