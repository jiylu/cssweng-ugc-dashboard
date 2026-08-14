export interface DraftContent {
  [key: string]: unknown
}

export interface CreateDraftPayload {
  userId: string
  campaign?: DraftContent
  proposal?: DraftContent
  deliverables?: DraftContent[]
  contract?: DraftContent
  addOns?: DraftContent[]
  giftedProducts?: DraftContent[]
}

export interface UpdateDraftPayload {
  campaign?: DraftContent
  proposal?: DraftContent
  deliverables?: DraftContent[]
  contract?: DraftContent
  addOns?: DraftContent[]
  giftedProducts?: DraftContent[]
}

export interface DraftEntity {
  public_id: string
  user_id: string
  campaign_content: DraftContent | null
  proposal_content: DraftContent | null
  deliverable_content: DraftContent[] | null
  contract_content: DraftContent | null
  add_ons_content: DraftContent[] | null
  gifted_products_content: DraftContent[] | null
  updated_at: string
  is_deleted?: boolean
}
