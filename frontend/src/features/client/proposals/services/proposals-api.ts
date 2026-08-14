import { API_BASE_URL } from "@/src/config/api";
import { parseApiError } from "@/src/features/auth/services/users-api";
import type {
  ContractTerm,
  ProposalAddOn,
  ProposalCampaign,
  ProposalContract,
  ProposalDeliverable,
  ProposalGiftedProduct,
  ProposalRecord,
  ProposalReviewData,
} from "../types/proposal-review.types";

interface RawDeliverable {
  quantity: number;
  deliverable_type: string;
  deliverable_content: string;
  requirements: string;
  due_date: string;
  post_date: string;
  pricing: string;
}

interface RawAddOn {
  public_id: string;
  add_on_name: string;
  description: string;
  fee: string;
  opt_in: boolean;
}

interface RawGiftedProduct {
  public_id: string;
  product_name: string;
  value: number | string;
  shipping_address: {
    delivery_address_line_1: string;
    delivery_address_line_2?: string;
    city: string;
    state_province: string;
    country: string;
    zip_code: number;
  } | null;
  delivery_instructions: string;
  ownership_terms: string;
}

interface CampaignSetupResponse {
  campaign: ProposalCampaign;
  proposal: ProposalRecord;
  contract: ProposalContract;
  deliverables: RawDeliverable[];
  addOns: RawAddOn[] | null;
  giftedProducts: RawGiftedProduct[] | null;
}

interface CreatorResponse {
  first_name: string;
  last_name: string;
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatAddress(address: RawGiftedProduct["shipping_address"]) {
  if (!address) return "Not specified";
  return [address.delivery_address_line_1, address.delivery_address_line_2, address.city, address.state_province, address.country, address.zip_code]
    .filter((part) => part !== undefined && part !== null && part !== "")
    .join(", ");
}

function readable(value: unknown) {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value === null || value === undefined || value === "") return "Not specified";
  return String(value).replaceAll("_", " ");
}

function formatPaymentMethod(value: unknown) {
  const normalized = String(value ?? "").trim().toLowerCase();
  const labels: Record<string, string> = {
    gcash: "GCash",
    paypal: "PayPal",
    check: "Check",
    bank_transfer: "Bank Transfer",
    "bank transfer": "Bank Transfer",
  };
  return labels[normalized] ?? readable(value);
}

function sentenceCase(value: string) {
  const words = value.replaceAll("_", " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function describe(data: Record<string, unknown> | null) {
  if (!data) return [{ label: "Status", value: "Not included in this proposal" }];
  return Object.entries(data)
    .map(([key, value]) => ({ label: sentenceCase(key), value: readable(value) }));
}

function mapTerms(contract: ProposalContract): ContractTerm[] {
  return [
    { title: "Revision Policy", items: describe(contract.revision_policy) },
    {
      title: "Cancellation",
      items: [
        {
          label: "Notice period",
          value: `${contract.cancellation_period} ${contract.cancellation_period === 1 ? "day" : "days"}`,
        },
      ],
    },
    { title: "Usage Rights", items: describe(contract.usage_rights) },
    { title: "Posting Requirements", items: describe(contract.posting_requirements) },
    { title: "Exclusivity", items: describe(contract.exclusivity) },
    { title: "General Terms", items: describe(contract.general_terms) },
  ];
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) {
    throw new Error(await parseApiError(response, "Unable to load proposal."));
  }
  return response.json() as Promise<T>;
}

export async function getProposalReview(publicId: string): Promise<ProposalReviewData> {
  const setup = await request<CampaignSetupResponse>(
    `/campaign-setup/proposal/${publicId}`,
  );
  const creator = await request<CreatorResponse>(
    `/users/${setup.campaign.ugc_creator_id}`,
  );
  const currency = setup.campaign.currency;
  const baseFee = setup.deliverables.reduce(
    (total, item) => total + Number(item.pricing),
    0,
  );
  const addOns: ProposalAddOn[] = (setup.addOns ?? []).map((item) => ({
    id: item.public_id,
    name: item.add_on_name,
    description: item.description,
    price: formatMoney(Number(item.fee), currency),
    fee: Number(item.fee),
    selected: item.opt_in,
  }));
  const selectedAddOnsFee = (setup.addOns ?? [])
    .filter((item) => item.opt_in)
    .reduce((total, item) => total + Number(item.fee), 0);
  const giftedProducts: ProposalGiftedProduct[] = (setup.giftedProducts ?? []).map((item) => ({
    id: item.public_id,
    productName: item.product_name,
    value: formatMoney(Number(item.value), currency),
    numericValue: Number(item.value),
    shippingAddress: formatAddress(item.shipping_address),
    deliveryInstructions: item.delivery_instructions || "Not specified",
    ownershipTerms: item.ownership_terms || "Not specified",
  }));
  const giftedProductsTotal = giftedProducts.reduce((total, item) => total + item.numericValue, 0);
  const taxRate = Number(setup.campaign.tax);
  const totalDue = (baseFee + selectedAddOnsFee + giftedProductsTotal) * (1 + taxRate / 100);
  const deliverables: ProposalDeliverable[] = setup.deliverables.map((item) => ({
    quantity: item.quantity,
    deliverable: `${item.deliverable_type} ${item.deliverable_content}`,
    requirements: item.requirements,
    dueDate: formatDate(item.due_date),
    postDate: formatDate(item.post_date),
    price: formatMoney(Number(item.pricing), currency),
  }));

  return {
    proposal: setup.proposal,
    campaign: setup.campaign,
    contract: setup.contract,
    creatorName: `${creator.first_name} ${creator.last_name}`.trim(),
    deliverables,
    terms: mapTerms(setup.contract),
    addOns,
    giftedProducts,
    giftedProductsTotal,
    paymentMethod: formatPaymentMethod(setup.contract.payment_terms.payment_method),
    baseFee,
    selectedAddOnsFee,
    taxRate,
    totalDue,
  };
}

export async function requestProposalRevision(proposalId: string, comment: string) {
  await request(`/proposals/${proposalId}/comments`, {
    method: "PATCH",
    body: JSON.stringify({ comment }),
  });
  return request<ProposalRecord>(`/proposals/status/${proposalId}`, {
    method: "PATCH",
    body: JSON.stringify({ proposalStatus: "FOR_REVISION" }),
  });
}

export function declineProposal(proposalId: string) {
  return request<ProposalRecord>(`/proposals/status/${proposalId}`, {
    method: "PATCH",
    body: JSON.stringify({ proposalStatus: "REJECTED" }),
  });
}

export function acceptProposal(proposalId: string) {
  return request<ProposalRecord>(`/proposals/accept/${proposalId}`, {
    method: "PATCH",
  });
}

export function updateAddOnOptIn(addOnId: string, optIn: boolean) {
  return request(`/add-ons/opt-in/${addOnId}`, {
    method: "POST",
    body: JSON.stringify({ optIn }),
  });
}
