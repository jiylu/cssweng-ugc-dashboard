import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { SendHorizontal } from "lucide-react"

interface AgreementFooterProps {
  onBack: () => void
  onSubmit: () => void
  isPending: boolean
}

export function AgreementFooter({ onBack, onSubmit, isPending }: AgreementFooterProps) {
  const [agreed, setAgreed] = useState(false)

  return (
    <div className="sticky bottom-0 bg-white border-t border-border px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={agreed}
          onCheckedChange={(v) => setAgreed(!!v)}
          className="data-[state=checked]:bg-[#6b1fa8] data-[state=checked]:border-[#6b1fa8]"
        />
        <p className="text-sm text-foreground">
          I agree to the Influencer Collaboration Agreement{" "}
          <span className="text-[#6b1fa8] underline cursor-pointer">terms.</span>
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack}>
          Back to Edit
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!agreed || isPending}
          className="bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white flex items-center gap-2"
        >
          Confirm & Submit Proposal <SendHorizontal size={16} />
        </Button>
      </div>
    </div>
  )
}