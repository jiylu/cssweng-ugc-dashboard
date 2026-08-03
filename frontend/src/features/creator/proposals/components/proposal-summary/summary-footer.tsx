import { Button } from "@/components/ui/button"
import { Pencil, ArrowRight } from "lucide-react"

interface SummaryFooterProps {
    onEdit: () => void
    onSubmit: () => void
    isPending: boolean
}

export function SummaryFooter({ onEdit, onSubmit, isPending }: SummaryFooterProps) {
    return (
        <div className="flex justify-end gap-3 mt-6 pb-8">
            <Button
                variant="outline"
                onClick={onEdit}
                className="flex items-center gap-2"
            >
                <Pencil size={16} /> Edit
            </Button>
            <Button
                onClick={onSubmit}
                disabled={isPending}
                className="bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white flex items-center gap-2"
            >
                {isPending ? "Submitting..." : "Submit Proposal"} <ArrowRight size={16} />
            </Button>
        </div>
    )
}
