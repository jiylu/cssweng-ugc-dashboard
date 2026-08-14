import { useCampaignForm } from "../hooks/useCampaignForm"
import { useContractTerms } from "../hooks/useContractTerms"
import { usePaymentTerms } from "../hooks/usePaymentTerms"
import { useAddOns } from "../hooks/useAddOns"
import { CreateDraftPayload } from "../types/draft.types"
import { trimString } from "./buildProposalPayload"

interface BuildDraftPayloadParams {
  userId: string
  form: ReturnType<typeof useCampaignForm>
  contractTerms: ReturnType<typeof useContractTerms>
  paymentTerms: ReturnType<typeof usePaymentTerms>
  addOns: ReturnType<typeof useAddOns>
}

function toIsoDate(value: string): string {
  if (!value) return ""
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "" : date.toISOString()
}

function prune(value: unknown): unknown {
  if (value === null || value === undefined) return undefined
  if (typeof value === "string") return value.trim() === "" ? undefined : value
  if (typeof value === "number" || typeof value === "boolean") return value
  if (Array.isArray(value)) {
    const items = value
      .map(prune)
      .filter((item) => item !== undefined && item !== null)
    return items.length === 0 ? undefined : items
  }
  if (typeof value === "object") {
    const result: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value)) {
      const prunedVal = prune(val)
      if (prunedVal !== undefined) result[key] = prunedVal
    }
    return Object.keys(result).length === 0 ? undefined : result
  }
  return value
}

export function buildDraftPayload({
  userId,
  form,
  contractTerms,
  paymentTerms,
  addOns,
}: BuildDraftPayloadParams): CreateDraftPayload {
  const [clientFirstName = "", ...clientLastNameParts] =
    form.contactPerson.trim().split(/\s+/)
  const clientLastName = clientLastNameParts.join(" ") || clientFirstName

  const campaign = {
    ugcId: userId,
    projectName: trimString(form.projectName),
    description: trimString(form.campaignDescription),
    currency: form.currency,
    tax: paymentTerms.taxRate,
    platforms: Object.fromEntries(
      form.platforms
        .filter((p) => trimString(p.platform) !== "")
        .map((p) => [p.platform.trim(), p.handle.trim()]),
    ),
    startDate: toIsoDate(form.startDate),
    endDate: toIsoDate(form.endDate),
  }

  const proposal = {
    clientEmail: trimString(form.contactEmail),
    client_first_name: clientFirstName || form.contactPerson,
    client_last_name: clientLastName,
  }

  const deliverables = form.deliverables
    .filter(
      (d) =>
        trimString(d.platform) !== "" ||
        trimString(d.contentType) !== "" ||
        trimString(d.description) !== "" ||
        trimString(d.draftDeadline) !== "" ||
        trimString(d.postDate) !== "" ||
        parseFloat(d.pricing.replace(/,/g, "") || "0") > 0,
    )
    .map((d) => ({
      quantity: Number(d.quantity ?? 1),
      deliverableType: d.deliverableType as "COLLABORATION" | "UGC",
      deliverableContent: `${trimString(d.platform)} ${trimString(d.contentType)}`.trim(),
      requirements: trimString(d.description),
      dueDate: toIsoDate(d.draftDeadline),
      postDate: toIsoDate(d.postDate),
      pricing: parseFloat(d.pricing.replace(/,/g, "") || "0"),
    }))

  const contract = {
    revision_policy: {
      revision_rounds: contractTerms.revisionRounds,
      revision_window_days: contractTerms.revisionDays,
      auto_approve_after_days: contractTerms.feedbackDays,
    },
    usage_rights: {
      is_exclusive: contractTerms.hasExclusivity,
      is_transferrable: false,
      organic_usage: trimString(contractTerms.includedOrganicUsage),
      territory: trimString(contractTerms.territory),
      restrictions: trimString(contractTerms.restrictions),
    },
    posting_requirements: {
      content_retention_months: contractTerms.contentRetention,
      partnership_tags: trimString(contractTerms.partnershipTags),
    },
    ...(contractTerms.hasExclusivity && {
      exclusivity: {
        category: trimString(contractTerms.exclusivityCategory),
        startDate: toIsoDate(contractTerms.exclusivityStartDate),
        endDate: toIsoDate(contractTerms.exclusivityEndDate),
        territory: trimString(contractTerms.exclusivityTerritory),
        brandlist: trimString(contractTerms.exclusivityCompetitorList),
        exclusivity_fee: parseFloat(
          contractTerms.exclusivityFee.replace(/,/g, "") || "0",
        ),
      },
    }),
    expenses_purchases_terms: {
      reimbursement_period: contractTerms.reimbursementDays,
      gifted_product_terms: trimString(contractTerms.giftedProductTerms),
    },
    cancellation_period: contractTerms.cancellationDays,
    payment_terms: {
      payment_schedule: paymentTerms.paymentSchedule,
      payment_method: paymentTerms.paymentMethod,
    },
    invoice_requirements: {
      name: trimString(form.contactPerson),
      email: trimString(form.contactEmail),
      campaign_name: trimString(form.projectName),
      payment_details: "",
    },
    general_terms: {
      governed_by: trimString(contractTerms.governingLaw),
      disputes_handled_in: trimString(contractTerms.disputeLocation),
    },
    extra_notes: trimString(contractTerms.extraNotes),
  }

  const draftAddOns = addOns.addOns
    .filter(
      (a) =>
        trimString(a.title) !== "" ||
        trimString(a.desc ?? "") !== "" ||
        (a.fee ?? 0) > 0,
    )
    .map((a) => ({
      addOnName: trimString(a.title),
      description: trimString(a.desc),
      fee: a.fee ?? 0,
    }))

  const giftedProducts = paymentTerms.giftedProducts
    .filter(
      (p) =>
        trimString(p.productName) !== "" ||
        parseFloat(p.value.replace(/,/g, "") || "0") > 0 ||
        trimString(p.deliveryInstructions) !== "" ||
        trimString(p.ownershipTerms) !== "" ||
        p.shippingAddress !== null,
    )
    .map((p) => ({
      productName: trimString(p.productName),
      value: parseFloat(p.value.replace(/,/g, "") || "0"),
      shippingAddress: p.shippingAddress
        ? {
            delivery_address_line_1: trimString(p.shippingAddress.addressLine1),
            delivery_address_line_2:
              trimString(p.shippingAddress.addressLine2) || undefined,
            country: trimString(p.shippingAddress.country),
            state_province: trimString(p.shippingAddress.stateProvince),
            city: trimString(p.shippingAddress.city),
            zip_code: Number(p.shippingAddress.zipCode) || 0,
          }
        : null,
      deliveryInstructions: trimString(p.deliveryInstructions),
      ownershipTerms: trimString(p.ownershipTerms),
    }))

  return prune({
    userId,
    campaign,
    proposal,
    deliverables,
    contract,
    addOns: draftAddOns,
    giftedProducts,
  }) as CreateDraftPayload
}
