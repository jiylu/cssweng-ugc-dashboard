import { Button } from "@/components/ui/button"
import { Pencil, ArrowRight } from "lucide-react"
import { useState } from "react"
import { ReviewContractTerms } from "@/src/features/creator/proposals/components/proposal-summary/review-contract-terms"
import { ProposalSummaryData } from "../../types/proposal-summary.types"

interface SummaryFooterProps {
    onEdit: () => void
    onSubmit: () => void
    isPending: boolean
    summary: ProposalSummaryData
}

export function SummaryFooter({ onEdit, onSubmit, isPending, summary }: SummaryFooterProps) {
    const [modalOpen, setModalOpen] = useState(false)

    return (
        <>
            <div className="flex justify-end gap-3 mt-6 pb-8">
                <Button
                    variant="outline"
                    onClick={onEdit}
                    className="flex items-center gap-2"
                >
                    <Pencil size={16} /> Edit
                </Button>
                <Button
                    onClick={() => setModalOpen(true)}
                    disabled={isPending}
                    className="bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white flex items-center gap-2"
                >
                    {isPending ? "Submitting..." : "Submit Proposal"} <ArrowRight size={16} />
                </Button>
            </div>

            <ReviewContractTerms
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={() => {
                setModalOpen(false)
                onSubmit()
                }}
                isPending={isPending}
                summary={summary}
            />
        </>
    )
}
