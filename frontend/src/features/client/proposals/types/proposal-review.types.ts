export interface ProposalDeliverable {
  quantity: number;
  deliverable: string;
  requirements: string;
  dueDate: string;
  postDate: string;
  price: string;
}

export interface ContractTerm {
  title: string;
  items: Array<{
    label: string;
    value: string;
  }>;
}

export interface ProposalAddOn {
  id: string;
  name: string;
  description: string;
  price: string;
  fee: number;
  selected: boolean;
}

export interface ProposalGiftedProduct {
  id: string;
  productName: string;
  value: string;
  numericValue: number;
  shippingAddress: string;
  deliveryInstructions: string;
  ownershipTerms: string;
}

export interface ProposalRecord {
  proposal_id: string;
  public_id: string;
  campaign_id: string;
  client_email: string;
  client_comments?: string;
  proposal_status: "PENDING" | "FOR_REVISION" | "REJECTED" | "ACCEPTED";
}

export interface ProposalCampaign {
  campaign_id: string;
  ugc_creator_id: string;
  project_name: string;
  description: string;
  currency: string;
  tax: string;
  pricing: string;
  start_date: string;
  end_date: string;
}

export interface ProposalContract {
  public_id: string;
  revision_policy: Record<string, unknown>;
  usage_rights: Record<string, unknown>;
  posting_requirements: Record<string, unknown>;
  exclusivity: Record<string, unknown> | null;
  expenses_purchases_terms: Record<string, unknown> | null;
  cancellation_period: number;
  payment_terms: Record<string, unknown>;
  general_terms: Record<string, unknown>;
  extra_notes: string | null;
}

export interface ProposalReviewData {
  proposal: ProposalRecord;
  campaign: ProposalCampaign;
  contract: ProposalContract;
  creatorName: string;
  deliverables: ProposalDeliverable[];
  terms: ContractTerm[];
  addOns: ProposalAddOn[];
  giftedProducts: ProposalGiftedProduct[];
  giftedProductsTotal: number;
  paymentMethod: string;
  baseFee: number;
  selectedAddOnsFee: number;
  taxRate: number;
  totalDue: number;
}
