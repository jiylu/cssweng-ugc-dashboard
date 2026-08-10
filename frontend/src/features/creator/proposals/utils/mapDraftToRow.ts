import { ProposalDraft } from "../types/proposal-draft.types"
import { DraftEntity } from "../types/draft.types"

const CURRENCY_SYMBOLS: Record<string, string> = {
  CAD: "CA$",
  USD: "$",
  PHP: "₱",
  EUR: "€",
  GBP: "£",
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {}
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : ""
}

function asNumber(value: unknown): number {
  if (typeof value === "number") return value
  if (typeof value === "string") {
    const parsed = parseFloat(value.replace(/,/g, ""))
    return Number.isNaN(parsed) ? 0 : parsed
  }
  return 0
}

function formatDate(value: unknown, withYear: boolean): string {
  const raw = asString(value)
  if (!raw) return ""
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return raw
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(withYear ? { year: "numeric" } : {}),
  })
}

function formatLastSaved(value: unknown): string {
  const raw = asString(value)
  if (!raw) return ""
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return raw
  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })
  return `${datePart} - ${timePart}`
}

export function mapDraftToRow(draft: DraftEntity): ProposalDraft {
  const campaign = asRecord(draft.campaign_content)
  const proposal = asRecord(draft.proposal_content)
  const deliverables = Array.isArray(draft.deliverable_content)
    ? draft.deliverable_content
    : []
  const firstDeliverable = asRecord(deliverables[0])

  const currency = asString(campaign.currency) || "USD"
  const tax = asNumber(campaign.tax)
  const basePrice = deliverables.reduce((sum, d) => sum + asNumber(asRecord(d).pricing), 0)
  const totalPrice = basePrice + basePrice * (tax / 100)
  const symbol = CURRENCY_SYMBOLS[currency] ?? "$"

  return {
    id: draft.public_id,
    campaignName: asString(campaign.projectName) || "Untitled Campaign",
    campaignType: asString(firstDeliverable.deliverableContent) || "Proposal",
    clientName: asString(proposal.clientEmail) || "—",
    durationStart: formatDate(campaign.startDate, false),
    durationEnd: formatDate(campaign.endDate, true),
    totalPrice: `${currency} ${symbol}${totalPrice.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    lastSavedAt: formatLastSaved(draft.updated_at),
    isContinuing: true,
  }
}
