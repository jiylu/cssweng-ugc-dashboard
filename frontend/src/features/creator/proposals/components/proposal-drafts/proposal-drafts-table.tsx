import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy, Trash2 } from "lucide-react"
import { ProposalDraft } from "@/src/features/creator/proposals/types/proposal-draft.types"

interface ProposalDraftsTableProps {
  drafts: ProposalDraft[]
  onContinueEditing: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

export function ProposalDraftsTable({ drafts, onContinueEditing, onDuplicate, onDelete }: ProposalDraftsTableProps) {
    return (
        <div className="rounded overflow-hidden border border-border">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent bg-[#E4E0D5]">
                        <TableHead className="text-sm uppercase tracking-[0.03em]">
                            Campaign Details
                        </TableHead>
                        <TableHead className="text-sm uppercase tracking-[0.03em]">
                            Client
                        </TableHead>
                        <TableHead className="text-sm textuppercase tracking-[0.03em]">
                            Duration
                        </TableHead>
                        <TableHead className="text-sm uppercase tracking-[0.03em]">
                            Total Price
                        </TableHead>
                        <TableHead className="text-sm uppercase tracking-[0.03em]">
                            Last Saved
                        </TableHead>
                        <TableHead className="text-sm uppercase tracking-[0.03em]">
                        </TableHead>
                        <TableHead className="text-sm uppercase tracking-[0.03em] text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {drafts.map((draft) => (
                    <TableRow key={draft.id} className="group hover:bg-transparent bg-white">
                        <TableCell>
                            <p className="text-sm font-medium text-[#6b1fa8]">
                                {draft.campaignName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {draft.campaignType}
                            </p>
                        </TableCell>
                        <TableCell className="text-sm font-medium text-[#6b1fa8]">
                            {draft.clientName}
                        </TableCell>
                        <TableCell className="text-sm text-foreground">
                            {draft.durationStart} &ndash; {draft.durationEnd}
                        </TableCell>
                        <TableCell className="text-sm text-foreground">
                            {draft.totalPrice}
                        </TableCell>
                        <TableCell>
                            <p className="text-sm text-foreground">{draft.lastSavedAt}</p>
                        </TableCell>
                        <TableCell>
                            <button
                            type="button"
                            onClick={() => onContinueEditing(draft.id)}
                            className="text-sm text-[#6b1fa8] font-medium opacity-0 transition-opacity group-hover:opacity-100 hover:underline"
                            >
                            Continue Editing
                            </button>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center justify-center gap-3">
                                <button
                                type="button"
                                aria-label="Delete draft"
                                onClick={() => onDelete(draft.id)}
                                className="text-foreground hover:text-[#ff6467]"
                                >
                                <Trash2 size={20} />
                                </button>
                            </div>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}