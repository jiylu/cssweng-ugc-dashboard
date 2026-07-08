export interface CreateCampaignPayload {
  campaign: {
    ugcId: string
    projectName: string
    description: string
    currency: string
    tax: number
    platforms: string[]
    startDate: string
    endDate: string
  }
  deliverables: {
    quantity: number
    deliverableType: 'COLLABORATION' | 'UGC'
    deliverableContent: string
    requirements: string 
    dueDate: string
    postDate: string
    pricing: number
  }[]
  proposal: {
    clientEmail: string
  }
  contract: {
    revision_policy: {
      revision_rounds: number
      revision_window_days: number
      auto_approve_after_days: number
    }
    usage_rights: {
      is_exclusive: boolean
      is_transferrable: boolean
      organic_usage: string
      // paid_usage_ads: string
      // whitelisting_spark_ads: string
      territory: string
      restrictions: string
    }
    posting_requirements: {
      content_retention_months: number
      partnership_tags: string
    }
    exclusivity?: {
      category: string
      startDate: string
      endDate: string
      territory: string
      brandlist: string
      exclusivity_fee: number
    }
    expenses_purchases_terms: {
      reimbursement_period: number
      gifted_product_terms: string
    }
    cancellation_period: number
    payment_terms: {
      payment_schedule: string
      payment_method: string
    }
    invoice_requirements: {
      name: string
      email: string
      campaign_name: string
      // tax_number: string
      payment_details: string
    }
    general_terms: {
      governed_by: string
      disputes_handled_in: string
    }
    extra_notes: string
  }
  addOns: {
    addOnName: string
    description: string
    fee: number
    initials: string
  }[]
  giftedProducts?: {
    productName: string
    value: number
    deliveryAddress: string
    deliveryInstructions: string
    ownershipTerms: string
  }[]
}


export interface CreateCampaignResponse {
  campaign_id: string;
  campaign_status: 'ACTIVE' | 'REJECTED' | 'COMPLETED';
  created_at: string;
}

export interface PlatformEntry {
  platform: string
  handle: string
}