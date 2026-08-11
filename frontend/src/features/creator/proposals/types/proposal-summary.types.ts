export interface ProposalSummaryData {
  earnings: {
    currency: string
    baseFee: number
    baseFeeWithoutAddOns: number
    addOnsTotal: number
    tax: number
    taxRate: number
    total: number
  }
  campaign: {
    brand: string
    creator: string
    campaignName: string
    platforms: string[]
    period: string
    startDate: string
    endDate: string
    description: string
  }
  deliverables: {
    qty: number
    deliverable: string
    format: string
    dueDate: string
    price: number
    currency: string
  }[]
  creativeDirection: {
    revisionRounds: number
    revisionDays: number
    feedbackDays: number
  }
  fees: {
    baseFee: number
    tax: number
    taxRate: number
    total: number
    currency: string
  }
  usageRights: {
    type: string
    duration: string
  }[]
  exclusivity: {
    hasExclusivity: boolean
    category: string
    territory: string
    competitorList: string
    startDate: string
    endDate: string
    fee: string
  }
  contract: {
    territory: string
    restrictions: string
    includedOrganicUsage: string
    contentRetention: number
    partnershipTags: string
    reimbursementDays: number
    giftedProductTerms: string
    cancellationDays: number
    governingLaw: string
    disputeLocation: string
    extraNotes?: string
  }
  payment: {
    schedule: string
    method: string
    shippingAddress: {
      addressLine1: string
      addressLine2: string
      country: string
      stateProvince: string
      city: string
      zipCode: string
    } | null
  }
  addOns: {
    id: string
    title: string
    desc: string
    fee: number
    isPermanent?: boolean
    isEnabled?: boolean
  }[]
  giftedProducts: {
    id: number
    productName: string
    value: string
    ownershipTerms: string
    shippingAddress: {
      addressLine1: string
      addressLine2: string
      country: string
      stateProvince: string
      city: string
      zipCode: string
    } | null
    deliveryInstructions: string
  }[]
}
