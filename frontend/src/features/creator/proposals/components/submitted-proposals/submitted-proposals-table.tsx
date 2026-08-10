import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Mail, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProposalStatus, SubmittedProposal } from "@/src/features/creator/proposals/types/submitted-proposal.types"

interface SubmittedProposalsTableProps {
  proposals: SubmittedProposal[]
  onView: (id: string) => void
  onSendReminder: (id: string) => void
  onCancel: (id: string) => void
}

const STATUS_LABELS: Record<ProposalStatus, string> = {
  ACTIVE: "Active",
  REJECTED: "Rejected",
  COMPLETED: "Completed",
}

const STATUS_STYLES: Record<ProposalStatus, string> = {
  ACTIVE: "text-[#6b1fa8]",
  REJECTED: "text-[#ff6467]",
  COMPLETED: "text-[#2d7a3a]",
}

export function SubmittedProposalsTable({ proposals, onView, onSendReminder, onCancel }: SubmittedProposalsTableProps) {
    return (
        <div className="rounded overflow-hidden border border-border">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent bg-[#E4E0D5]">
                        <TableHead className="text-sm text-foreground uppercase tracking-[0.03em]">
                            Campaign Details
                        </TableHead>
                        <TableHead className="text-sm text-foreground uppercase tracking-[0.03em]">
                            Client
                        </TableHead>
                        <TableHead className="text-sm text-foreground uppercase tracking-[0.03em]">
                            Duration
                        </TableHead>
                        <TableHead className="text-sm text-foreground uppercase tracking-[0.03em]">
                            Total Price
                        </TableHead>
                        <TableHead className="text-sm text-foreground uppercase tracking-[0.03em]">
                            Status
                        </TableHead>
                        <TableHead className="text-sm text-foreground uppercase tracking-[0.03em] text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {proposals.map((proposal) => {
                        const isClosed = proposal.status === "COMPLETED" || proposal.status === "REJECTED"

                        return (
                            <TableRow key={proposal.id} className="hover:bg-transparent bg-white">
                                <TableCell>
                                    <p className="text-sm font-medium text-[#6b1fa8]">
                                    {proposal.campaignName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                    {proposal.campaignType}
                                    </p>
                                </TableCell>
                                <TableCell className="text-sm font-medium text-[#6b1fa8]">
                                    {proposal.clientName}
                                </TableCell>
                                <TableCell className="text-sm text-foreground">
                                    {proposal.durationStart} &ndash; {proposal.durationEnd}
                                </TableCell>
                                <TableCell className="text-sm text-foreground">
                                    {proposal.totalPrice}
                                </TableCell>
                                <TableCell>
                                    <span
                                    className={cn(
                                        "text-sm font-medium",
                                        STATUS_STYLES[proposal.status]
                                    )}
                                    >
                                    {STATUS_LABELS[proposal.status]}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        aria-label="View proposal"
                                        onClick={() => onView(proposal.id)}
                                        className="text-foreground hover:text-[#6b1fa8]"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    {!isClosed && (
                                        <>
                                        <button
                                            type="button"
                                            aria-label="Send reminder"
                                            onClick={() => onSendReminder(proposal.id)}
                                            className="text-foreground hover:text-[#6b1fa8]"
                                        >
                                            <Mail size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="Cancel proposal"
                                            onClick={() => onCancel(proposal.id)}
                                            className="text-foreground hover:text-[#ff6467]"
                                        >
                                            <X size={16} />
                                        </button>
                                        </>
                                    )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}