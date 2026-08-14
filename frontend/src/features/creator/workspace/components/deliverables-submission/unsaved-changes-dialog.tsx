import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface UnsavedChangesDialogProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function UnsavedChangesDialog({ open, onConfirm, onCancel }: UnsavedChangesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => (next ? undefined : onCancel())}>
      <DialogContent className="!max-w-[420px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-lg">Discard unsaved changes?</DialogTitle>
          <DialogDescription>
            You have unsaved changes in the current deliverable. Switching will
            discard them.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white"
          >
            Discard &amp; Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
