import { GiftedProductShippingAddress } from "./campaign-setup.types"

export interface UpdateDeliverableMutation {
  deliverableId: string
  quantity?: number
  deliverableType?: string
  deliverableContent?: string
  requirements?: string
  dueDate?: string
  postDate?: string
  pricing?: number
}

export interface UpdateAddOnMutation {
  addOnId: string
  addOnName?: string
  description?: string
  fee?: number
  initials?: string
}

export interface UpdateGiftedProductMutation {
  giftedProductId: string
  productName?: string
  value?: number
  shippingAddress?: GiftedProductShippingAddress | null
  deliveryInstructions?: string
  ownershipTerms?: string
}

export interface UpdateCampaignSetupPayload {
  campaign?: {
    projectName?: string
    description?: string
    currency?: string
    tax?: number
    platforms?: string[]
    startDate?: string
    endDate?: string
  }
  contract?: {
    contractId: string
    revision_policy?: {
      revision_rounds?: number
      revision_window_days?: number
      auto_approve_after_days?: number
    }
    usage_rights?: {
      is_exclusive?: boolean
      is_transferrable?: boolean
      organic_usage?: string
      territory?: string
      restrictions?: string
    }
    posting_requirements?: {
      content_retention_months?: number
      partnership_tags?: string
    }
    exclusivity?: {
      category?: string
      startDate?: string
      endDate?: string
      territory?: string
      brandlist?: string
      exclusivity_fee?: number
    } | null
    expenses_purchases_terms?: {
      reimbursement_period?: number
      gifted_product_terms?: string
    } | null
    cancellation_period?: number
    payment_terms?: {
      payment_schedule?: string
      payment_method?: string
    }
    invoice_requirements?: {
      name?: string
      email?: string
      campaign_name?: string
      payment_details?: string
    }
    general_terms?: {
      governed_by?: string
      disputes_handled_in?: string
    }
    extra_notes?: string
  }
  deliverables?: {
    create?: {
      quantity?: number
      deliverableType?: string
      deliverableContent?: string
      requirements?: string
      dueDate?: string
      postDate?: string
      pricing?: number
    }[]
    update?: UpdateDeliverableMutation[]
    delete?: string[]
  }
  addOns?: {
    create?: {
      addOnName?: string
      description?: string
      fee?: number
      initials?: string
    }[]
    update?: UpdateAddOnMutation[]
    delete?: string[]
  }
  giftedProducts?: {
    create?: {
      productName?: string
      value?: number
      shippingAddress?: GiftedProductShippingAddress | null
      deliveryInstructions?: string
      ownershipTerms?: string
    }[]
    update?: UpdateGiftedProductMutation[]
    delete?: string[]
  }
}
