import { formatDate } from "@/src/utils/date"
import { ProposalSummaryData } from "../types/proposal-summary.types"
import {
  CampaignSetupAddOn,
  CampaignSetupContract,
  CampaignSetupDeliverable,
  CampaignSetupDetails,
  CampaignSetupGiftedProduct,
} from "../types/campaign-setup-response.types"

function parseMoney(value: number | string | null | undefined): number {
  if (value === null || value === undefined) return 0
  if (typeof value === "number") return value
  const parsed = parseFloat(value.replace(/,/g, ""))
  return Number.isNaN(parsed) ? 0 : parsed
}

function formatSummaryDate(value: string | null | undefined): string {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return formatDate(date)
}

function mapShippingAddress(
  addr: CampaignSetupGiftedProduct["shipping_address"]
): ProposalSummaryData["payment"]["shippingAddress"] {
  if (!addr) return null
  return {
    addressLine1: addr.delivery_address_line_1,
    addressLine2: addr.delivery_address_line_2 ?? "",
    country: addr.country,
    stateProvince: addr.state_province,
    city: addr.city,
    zipCode: String(addr.zip_code),
  }
}

function mapDeliverable(
  d: CampaignSetupDeliverable,
  currency: string
): ProposalSummaryData["deliverables"][number] {
  return {
    qty: d.quantity,
    deliverable: d.deliverable_content,
    format: d.deliverable_type,
    dueDate: formatSummaryDate(d.due_date),
    postDate: formatSummaryDate(d.post_date),
    price: parseMoney(d.pricing),
    currency,
  }
}

function mapAddOn(a: CampaignSetupAddOn): ProposalSummaryData["addOns"][number] {
  return {
    id: a.public_id,
    title: a.add_on_name,
    desc: a.description,
    fee: parseMoney(a.fee),
    isEnabled: a.opt_in,
  }
}

function mapGiftedProduct(
  g: CampaignSetupGiftedProduct
): ProposalSummaryData["giftedProducts"][number] {
  return {
    id: Number.isFinite(Number(g.gifted_product_id))
      ? Number(g.gifted_product_id)
      : 0,
    productName: g.product_name,
    value: String(parseMoney(g.value)),
    ownershipTerms: g.ownership_terms,
    shippingAddress: mapShippingAddress(g.shipping_address),
    deliveryInstructions: g.delivery_instructions,
  }
}

function mapContractTerms(contract: CampaignSetupContract): ProposalSummaryData["contract"] {
  return {
    territory: contract.usage_rights?.territory ?? "",
    restrictions: contract.usage_rights?.restrictions ?? "",
    includedOrganicUsage: contract.usage_rights?.organic_usage ?? "",
    contentRetention: contract.posting_requirements?.content_retention_months ?? 0,
    partnershipTags: contract.posting_requirements?.partnership_tags ?? "",
    reimbursementDays: contract.expenses_purchases_terms?.reimbursement_period ?? 0,
    giftedProductTerms: contract.expenses_purchases_terms?.gifted_product_terms ?? "",
    cancellationDays: contract.cancellation_period ?? 0,
    governingLaw: contract.general_terms?.governed_by ?? "",
    disputeLocation: contract.general_terms?.disputes_handled_in ?? "",
    extraNotes: contract.extra_notes ?? undefined,
  }
}

export function mapCampaignSetupToProposalSummary(
  details: CampaignSetupDetails,
  creatorName: string
): ProposalSummaryData {
  const currency = details.campaign.currency ?? "USD"
  const deliverables = (details.deliverables ?? []).map((d) =>
    mapDeliverable(d, currency)
  )
  const addOns = (details.addOns ?? []).map(mapAddOn)
  const giftedProducts = (details.giftedProducts ?? []).map(mapGiftedProduct)

  const contract = details.contract
  const rawExclusivity = contract?.exclusivity ?? null
  const exclusivity =
    rawExclusivity &&
    typeof rawExclusivity === "object" &&
    Object.keys(rawExclusivity).length > 0
      ? rawExclusivity
      : null

  const giftedTotal = giftedProducts.reduce((sum, g) => sum + parseMoney(g.value), 0)
  const exclusivityFee = exclusivity ? parseMoney(exclusivity.exclusivity_fee) : 0

  const baseFeeWithoutAddOns =
    deliverables.reduce((sum, d) => sum + d.price, 0) + exclusivityFee + giftedTotal
  const addOnsTotal = addOns
    .filter((a) => a.isEnabled)
    .reduce((sum, a) => sum + a.fee, 0)
  const baseFee = baseFeeWithoutAddOns + addOnsTotal

  const taxRate = parseMoney(details.campaign.tax)
  const tax = baseFeeWithoutAddOns * (taxRate / 100)
  const total = baseFeeWithoutAddOns + tax

  const startDate = formatSummaryDate(details.campaign.start_date)
  const endDate = formatSummaryDate(details.campaign.end_date)

  const clientName = [details.proposal?.client_first_name, details.proposal?.client_last_name]
    .filter(Boolean)
    .join(" ")

  const platformsValue = (details.campaign.platforms ?? {}) as
    | Record<string, string>
    | string[]
  const platforms = Array.isArray(platformsValue)
    ? platformsValue
    : Object.keys(platformsValue)

  return {
    earnings: {
      currency,
      baseFee,
      baseFeeWithoutAddOns,
      addOnsTotal,
      tax,
      taxRate,
      total,
    },
    campaign: {
      brand: clientName || "Client",
      creator: creatorName,
      campaignName: details.campaign.project_name,
      platforms,
      period: `${startDate || "TBD"} - ${endDate || "TBD"}`,
      startDate: startDate || "TBD",
      endDate: endDate || "TBD",
      description: details.campaign.description,
    },
    deliverables,
    creativeDirection: {
      revisionRounds: contract?.revision_policy?.revision_rounds ?? 0,
      revisionDays: contract?.revision_policy?.revision_window_days ?? 0,
      feedbackDays: contract?.revision_policy?.auto_approve_after_days ?? 0,
    },
    fees: {
      baseFee,
      tax,
      taxRate,
      total,
      currency,
    },
    usageRights: [
      ...(contract?.posting_requirements?.content_retention_months
        ? [
            {
              type: "Organic Social Media",
              duration: `${contract.posting_requirements.content_retention_months} Months`,
            },
          ]
        : []),
      ...(exclusivity
        ? [
            {
              type: "Exclusivity",
              duration: `${exclusivity.category} — ${exclusivity.territory}`,
            },
          ]
        : []),
    ],
    exclusivity: {
      hasExclusivity: !!exclusivity,
      category: exclusivity?.category ?? "",
      territory: exclusivity?.territory ?? "",
      competitorList: exclusivity?.brandlist ?? "",
      startDate: formatSummaryDate(exclusivity?.startDate),
      endDate: formatSummaryDate(exclusivity?.endDate),
      fee: exclusivity ? String(exclusivity.exclusivity_fee) : "",
    },
    contract: contract ? mapContractTerms(contract) : {
      territory: "",
      restrictions: "",
      includedOrganicUsage: "",
      contentRetention: 0,
      partnershipTags: "",
      reimbursementDays: 0,
      giftedProductTerms: "",
      cancellationDays: 0,
      governingLaw: "",
      disputeLocation: "",
    },
    payment: {
      schedule: contract?.payment_terms?.payment_schedule ?? "",
      method: contract?.payment_terms?.payment_method ?? "",
      shippingAddress: giftedProducts.find((g) => g.shippingAddress)?.shippingAddress ?? null,
    },
    addOns,
    giftedProducts,
  }
}
