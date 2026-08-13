import { Button } from "@/components/ui/button"
import { Pencil, ArrowRight, Save } from "lucide-react"
import { useState } from "react"
import { ReviewContractTerms } from "@/src/features/creator/proposals/components/proposal-summary/review-contract-terms"
import { ProposalSummaryData } from "../../types/proposal-summary.types"

interface SummaryFooterProps {
    onEdit: () => void
    onSaveDraft: () => void
    onSubmit: () => void
    isPending: boolean
    isSavingDraft: boolean
    summary: ProposalSummaryData
}

export function SummaryFooter({ onEdit, onSaveDraft, onSubmit, isPending, isSavingDraft, summary }: SummaryFooterProps) {
    const [modalOpen, setModalOpen] = useState(false)

    return (
        <>
            <div className="flex justify-end gap-3 mt-6 pb-8">
                <Button
                    variant="outline"
                    onClick={onEdit}
                    className="flex items-center gap-2 p-5"
                >
                    <Pencil size={16} className="-mt-1" /> Edit
                </Button>
                <Button
                    variant="outline"
                    onClick={onSaveDraft}
                    disabled={isSavingDraft || isPending}
                    className="flex items-center gap-2 p-5"
                >
                    <Save size={16} className="-mt-1" /> {isSavingDraft ? "Saving..." : "Save Draft"}
                </Button>
                <Button
                    onClick={() => setModalOpen(true)}
                    disabled={isPending}
                    className="bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white flex items-center gap-2  p-5"
                >
                    {isPending ? "Submitting..." : "Review Contract Terms"} <ArrowRight size={16} className="-mt-1" />
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
