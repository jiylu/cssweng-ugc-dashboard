export interface ProposalSummaryData {
  earnings: {
    currency: string
    total: number
    baseFee: number
    tax: number
    taxRate: number
  }
  campaign: {
    brand: string
    creator: string
    campaignName: string
    platforms: string[]
    period: string
  }
  deliverables: {
    qty: number
    deliverable: string
    format: string
    dueDate: string
  }[]
  addOns: {
    baseFee: number
    tax: number
    taxRate: number
    total: number
  }
  usageRights: {
    type: string
    duration: string
  }[]
}