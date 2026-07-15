import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { WrittenAssetsPanel } from "./written-assets-panel"
import { FeedbackPanel } from "./feedback-panel"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HistoryOverlayProps {
  open: boolean
  onClose: () => void
  version: number
  timestamp: string
}

export function HistoryOverlay({ open, onClose, version, timestamp }: HistoryOverlayProps) {
    return (
    <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="!max-w-[900px] w-[900px] p-8 border border-[#6b1fa8] bg-[#F2F0EA]" showCloseButton={false}>
            {/* Header */}
            <DialogHeader className="flex flex-row items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                <DialogTitle className="text-3xl font-normal text-foreground">
                    Version Title
                </DialogTitle>
                <span className="text-sm text-muted-foreground">{timestamp}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                <X size={20} />
                </Button>
            </DialogHeader>

            {/* Content */}
            <div className="flex flex-row gap-6 w-full">
                <div className="flex-1 min-w-0">
                <WrittenAssetsPanel
                    version={version}
                    onHistory={() => {}}
                    onSaveDraft={() => {}}
                    onSubmit={() => {}}
                />
                </div>
                <div className="w-64 shrink-0">
                <FeedbackPanel />
                </div>
            </div>
        </DialogContent>
    </Dialog>
    )
}