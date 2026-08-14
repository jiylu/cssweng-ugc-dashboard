"use client"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface CancelProposalDialogProps {
  open: boolean
  campaignName: string
  isPending: boolean
  onConfirm: () => void
  onClose: () => void
}

export function CancelProposalDialog({
  open,
  campaignName,
  isPending,
  onConfirm,
  onClose,
}: CancelProposalDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="!max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle className="text-xl font-normal text-foreground">
            Cancel proposal?
          </DialogTitle>
          <DialogDescription>
            This will cancel the proposal for &ldquo;{campaignName}&rdquo;. The
            proposal and its campaign will be marked as cancelled and can no
            longer be actioned.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Keep proposal
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Cancelling..." : "Cancel proposal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
