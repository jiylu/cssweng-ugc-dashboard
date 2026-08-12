export interface CampaignSetupCampaign {
  public_id: string
  ugc_creator_id: string
  client_id: string | null
  project_name: string
  description: string
  currency: string
  tax: number
  pricing: number
  platforms: Record<string, string>
  start_date: string
  end_date: string
  created_at: string
  campaign_status: string
}

export interface CampaignSetupProposal {
  public_id: string
  client_email: string
  client_first_name: string
  client_last_name: string
  client_comments: string
  proposal_status: string
}

export interface CampaignSetupDeliverable {
  public_id: string
  quantity: number
  deliverable_type: string
  deliverable_content: string
  requirements: string
  due_date: string
  post_date: string
  pricing: number
}

export interface CampaignSetupAddOn {
  public_id: string
  add_on_name: string
  description: string
  fee: number
  initials: string
  opt_in: boolean
}

export interface CampaignSetupShippingAddress {
  delivery_address_line_1: string
  delivery_address_line_2?: string
  country: string
  state_province: string
  city: string
  zip_code: number
}

export interface CampaignSetupGiftedProduct {
  gifted_product_id: string
  product_name: string
  value: number
  shipping_address: CampaignSetupShippingAddress | null
  delivery_instructions: string
  ownership_terms: string
}

export interface CampaignSetupContract {
  public_id: string
  revision_policy: {
    revision_rounds: number
    revision_window_days: number
    auto_approve_after_days: number
  }
  usage_rights: {
    is_exclusive: boolean
    is_transferrable: boolean
    organic_usage: string
    territory: string
    restrictions: string
  }
  posting_requirements: {
    content_retention_months: number
    partnership_tags: string
  }
  exclusivity: {
    category: string
    startDate: string
    endDate: string
    territory: string
    brandlist: string
    exclusivity_fee: number
  } | null
  expenses_purchases_terms: {
    reimbursement_period: number
    gifted_product_terms: string
  } | null
  cancellation_period: number
  payment_terms: {
    payment_schedule: string
    payment_method: string
  }
  invoice_requirements: {
    name: string
    email: string
    campaign_name: string
    payment_details: string
  }
  general_terms: {
    governed_by: string
    disputes_handled_in: string
  }
  extra_notes: string | null
}

export interface CampaignSetupDetails {
  campaign: CampaignSetupCampaign
  proposal: CampaignSetupProposal | null
  deliverables: CampaignSetupDeliverable[]
  contract: CampaignSetupContract | null
  addOns: CampaignSetupAddOn[] | null
  giftedProducts: CampaignSetupGiftedProduct[] | null
}
