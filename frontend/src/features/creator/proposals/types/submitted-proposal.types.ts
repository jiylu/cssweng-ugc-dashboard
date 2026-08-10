export type ProposalStatus = "ACTIVE" | "REJECTED" | "COMPLETED"

export interface SubmittedProposal {
    id: string
    campaignName: string
    campaignType: string
    clientName: string
    durationStart: string
    durationEnd: string
    totalPrice: string
    status: ProposalStatus
}