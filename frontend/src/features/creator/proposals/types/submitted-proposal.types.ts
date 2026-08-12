export type ProposalStatus = "PENDING" | "ACTIVE" | "REJECTED" | "COMPLETED" | "CANCELLED"

export interface SubmittedProposal {
    id: string
    proposalPublicId: string
    campaignName: string
    campaignType: string
    clientName: string
    durationStart: string
    durationEnd: string
    totalPrice: string
    status: ProposalStatus
}