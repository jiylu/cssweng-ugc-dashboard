import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWrittenAssetHistory } from "../../hooks/useWrittenAssetHistory"
import { WrittenAssetPreview } from "./written-asset-preview"
import type { WrittenAsset } from "@/src/features/client/workspace/services/deliverable-submissions-api"

interface HistoryOverlayProps {
  open: boolean
  onClose: () => void
  deliverableItemPublicId?: string
}

function formatDate(value: string) {
  return new Date(value).toLocaleString()
}

function statusLabel(asset: WrittenAsset) {
  switch (asset.written_asset_action) {
    case "APPROVE":
      return "Approved"
    case "REVISE":
      return "Revision requested"
    default:
      return "Submitted and awaiting approval"
  }
}

function statusBadgeClass(asset: WrittenAsset) {
  if (asset.written_asset_action === "APPROVE") {
    return "text-[#2d7a3a] bg-[#e7f4ea] border border-[#2d7a3a]/30"
  }
  return "text-[#b45309] bg-[#fef3c7] border border-[#b45309]/30"
}

export function HistoryOverlay({ open, onClose, deliverableItemPublicId }: HistoryOverlayProps) {
  const { data: history, isLoading } = useWrittenAssetHistory(
    open ? deliverableItemPublicId : undefined,
  )

  return (
    <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="!max-w-[900px] w-[900px] p-8 border border-[#6b1fa8] bg-[#F2F0EA]" showCloseButton={false}>
            <DialogHeader className="flex flex-row items-center justify-between mb-4">
                <DialogTitle className="text-3xl font-normal text-foreground">
                    Version History
                </DialogTitle>
                <Button variant="ghost" size="icon" onClick={onClose}>
                <X size={20} />
                </Button>
            </DialogHeader>

            <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
                {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading versions…</p>
                ) : history && history.length > 0 ? (
                    history.map((asset) => (
                        <div
                            key={asset.public_id}
                            className="flex flex-col gap-2 rounded-md border border-[#d8d4cb] bg-white p-4"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-medium text-foreground">
                                        Version {asset.version_number}
                                    </h3>
                                    <span className="text-sm text-muted-foreground">
                                        {formatDate(asset.created_at)}
                                    </span>
                                </div>
                                <span className={`text-xs rounded px-2 py-0.5 whitespace-nowrap ${statusBadgeClass(asset)}`}>
                                    {statusLabel(asset)}
                                </span>
                            </div>
                            {asset.client_comments?.trim() && (
                                <p className="text-xs text-muted-foreground">
                                    Client feedback: {asset.client_comments}
                                </p>
                            )}
                            <WrittenAssetPreview content={asset.content} />
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">No versions yet.</p>
                )}
            </div>
        </DialogContent>
    </Dialog>
  )
}
