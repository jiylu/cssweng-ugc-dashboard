import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { FileText, PenLine, Trash2 } from "lucide-react"
import { ProposalDraft } from "@/src/features/creator/proposals/types/proposal-draft.types"

interface ProposalDraftsTableProps {
  drafts: ProposalDraft[]
  onContinueEditing: (id: string) => void
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export function ProposalDraftsTable({ drafts, onContinueEditing, onDelete, isDeleting }: ProposalDraftsTableProps) {
    if (drafts.length === 0) {
        return (
            <Empty className="border border-border bg-white py-16">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <FileText />
                    </EmptyMedia>
                    <EmptyTitle className="text-lg">No proposal drafts yet</EmptyTitle>
                    <EmptyDescription className="text-base">
                        You don&apos;t have any saved proposal drafts. Start a new campaign proposal to get going.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button asChild className="p-5">
                        <Link href="/proposals/create-campaign">
                            <PenLine />
                            Create a Proposal
                        </Link>
                    </Button>
                </EmptyContent>
            </Empty>
        )
    }

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
                                disabled={isDeleting}
                                className="text-foreground hover:text-[#ff6467] disabled:opacity-50"
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