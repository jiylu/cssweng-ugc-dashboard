import { Campaign } from "@/src/features/creator/campaigns/types/campaign.types"
import { ProposalStatus, SubmittedProposal } from "../types/submitted-proposal.types"

const CURRENCY_SYMBOLS: Record<string, string> = {
  CAD: "CA$",
  USD: "$",
  PHP: "₱",
  EUR: "€",
  GBP: "£",
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

function formatDurationDate(value: unknown, withYear: boolean): string {
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

function toProposalStatus(status: string): ProposalStatus {
  switch (status) {
    case "ACCEPTED":
      return "ACTIVE"
    case "PENDING":
    case "FOR_REVISION":
      return "PENDING"
    case "REJECTED":
      return "REJECTED"
    case "COMPLETED":
    case "COMPLETE":
      return "COMPLETED"
    default:
      return "PENDING"
  }
}

export function mapCampaignToSubmittedProposal(
  campaign: Campaign,
  clientName = "—",
  proposalStatus?: string,
): SubmittedProposal {
  const currency = asString(campaign.currency) || "USD"
  const total = asNumber(campaign.pricing)
  const symbol = CURRENCY_SYMBOLS[currency] ?? "$"
  const platforms = campaign.platforms ?? {}
  const firstPlatform = Object.keys(platforms)[0]

  return {
    id: campaign.public_id,
    campaignName: asString(campaign.project_name) || "Untitled Campaign",
    campaignType: firstPlatform || "Proposal",
    clientName: clientName || "—",
    durationStart: formatDurationDate(campaign.start_date, false),
    durationEnd: formatDurationDate(campaign.end_date, true),
    totalPrice: `${currency} ${symbol}${total.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    status: toProposalStatus(proposalStatus ?? campaign.campaign_status),
  }
}
