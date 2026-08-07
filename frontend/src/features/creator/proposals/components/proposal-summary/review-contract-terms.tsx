import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ReviewContractTermsProps {
  open: boolean
  onClose: () => void
  onSubmit: () => void
  isPending?: boolean
}

export function ReviewContractTerms({ open, onClose, onSubmit, isPending }: ReviewContractTermsProps) {
    const [agreed, setAgreed] = useState(false)

    return (
    <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl w-full bg-[#F2F0EA]" showCloseButton>
            <DialogHeader>
                <DialogTitle className="text-2xl font-normal text-foreground">
                Review Contract Terms
                </DialogTitle>
            </DialogHeader>

            {/* PDF Placeholder */}
            <div className="w-full h-[480px] bg-[#78746e] rounded-[3px] flex items-center justify-center mt-2">
                <p className="text-white text-sm tracking-wide">PDF FILE</p>
            </div>

            {/* Agreement checkbox */}
            <div className="flex items-center gap-3 mt-2">
                <Checkbox
                checked={agreed}
                onCheckedChange={(v) => setAgreed(!!v)}
                className="w-5 h-5 rounded-[2px] border-border data-[state=checked]:bg-[#6b1fa8] data-[state=checked]:border-[#6b1fa8]"
                />
                <label
                className="text-sm text-foreground cursor-pointer"
                onClick={() => setAgreed(!agreed)}
                >
                I agree to the Influencer Collaboration Agreement terms.
                </label>
            </div>

            {/* Submit button */}
            <Button
                onClick={() => {
                if (agreed) onSubmit()
                }}
                disabled={!agreed || isPending}
                className="w-full bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white rounded-[3px] py-3"
            >
                Submit Proposal
            </Button>
        </DialogContent>
    </Dialog>
    )
}