export interface ProposalDraft {
    id: string
    campaignName: string
    campaignType: string
    clientName: string
    durationStart: string
    durationEnd: string
    totalPrice: string
    lastSavedAt: string
    isContinuing?: boolean
}