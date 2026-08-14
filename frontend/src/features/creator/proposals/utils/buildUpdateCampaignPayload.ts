import { useCampaignForm } from "../hooks/useCampaignForm"
import { useContractTerms } from "../hooks/useContractTerms"
import { usePaymentTerms } from "../hooks/usePaymentTerms"
import { useAddOns } from "../hooks/useAddOns"
import { UpdateCampaignSetupPayload } from "../types/update-campaign-setup.types"
import { LoadedSetupIds } from "./applyCampaignSetupToForm"
import { trimString, toShippingAddressPayload } from "./buildProposalPayload"

interface BuildUpdatePayloadParams {
  form: ReturnType<typeof useCampaignForm>
  contractTerms: ReturnType<typeof useContractTerms>
  paymentTerms: ReturnType<typeof usePaymentTerms>
  addOns: ReturnType<typeof useAddOns>
  loadedIds: LoadedSetupIds
}

function toDeliverable(d: {
  quantity: string
  deliverableType: string
  platform: string
  contentType: string
  description: string
  draftDeadline: string
  postDate: string
  pricing: string
}) {
  return {
    quantity: Number(d.quantity ?? 1),
    deliverableType: d.deliverableType as "COLLABORATION" | "UGC",
    deliverableContent: `${trimString(d.platform)} ${trimString(d.contentType)}`.trim(),
    requirements: trimString(d.description),
    dueDate: d.draftDeadline ? new Date(d.draftDeadline).toISOString() : new Date().toISOString(),
    postDate: d.postDate ? new Date(d.postDate).toISOString() : new Date().toISOString(),
    pricing: parseFloat(d.pricing.replace(/,/g, "") || "0"),
  }
}

function toAddOn(a: { title: string; desc: string; fee?: number }) {
  const title = trimString(a.title)
  return {
    addOnName: title,
    description: trimString(a.desc),
    fee: a.fee ?? 0,
    initials: title
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .toUpperCase(),
  }
}

function toGiftedProduct(g: {
  productName: string
  value: string
  shippingAddress: ReturnType<typeof usePaymentTerms>["giftedProducts"][number]["shippingAddress"]
  deliveryInstructions: string
  ownershipTerms: string
}) {
  return {
    productName: trimString(g.productName),
    value: parseFloat(g.value.replace(/,/g, "") || "0"),
    shippingAddress: toShippingAddressPayload(g.shippingAddress),
    deliveryInstructions: trimString(g.deliveryInstructions),
    ownershipTerms: trimString(g.ownershipTerms),
  }
}

export function buildUpdateCampaignPayload({ form, contractTerms, paymentTerms, addOns, loadedIds }: BuildUpdatePayloadParams): UpdateCampaignSetupPayload {
  const currentDeliverableIds = new Set(form.deliverables.filter((d) => d.dbId).map((d) => d.dbId as string))
  const currentAddOnIds = new Set(addOns.addOns.filter((a) => a.dbId).map((a) => a.dbId as string))
  const currentGiftedProductIds = new Set(paymentTerms.giftedProducts.filter((g) => g.dbId).map((g) => g.dbId as string))

  const deliverablesUpdate = form.deliverables
    .filter((d) => d.dbId)
    .map((d) => ({ deliverableId: d.dbId as string, ...toDeliverable(d) }))
  const deliverablesDelete = loadedIds.deliverableIds.filter((id) => !currentDeliverableIds.has(id))
  const deliverablesCreate = form.deliverables.filter((d) => !d.dbId).map(toDeliverable)

  const addOnsUpdate = addOns.addOns
    .filter((a) => a.dbId)
    .map((a) => ({ addOnId: a.dbId as string, ...toAddOn(a) }))
  const addOnsDelete = loadedIds.addOnIds.filter((id) => !currentAddOnIds.has(id))
  const addOnsCreate = addOns.addOns
    .filter((a) => !a.dbId && a.isEnabled !== false)
    .map(toAddOn)

  const giftedProductsUpdate = paymentTerms.giftedProducts
    .filter((g) => g.dbId)
    .map((g) => ({ giftedProductId: g.dbId as string, ...toGiftedProduct(g) }))
  const giftedProductsDelete = loadedIds.giftedProductIds.filter((id) => !currentGiftedProductIds.has(id))
  const giftedProductsCreate = paymentTerms.giftedProducts.filter((g) => !g.dbId).map(toGiftedProduct)

  const hasExpenses =
    contractTerms.reimbursementDays > 0 || trimString(contractTerms.giftedProductTerms).length > 0

  return {
    campaign: {
      projectName: form.projectName.trim(),
      description: form.campaignDescription.trim(),
      currency: form.currency,
      tax: paymentTerms.taxRate,
      platforms: form.platforms.map((p) => p.platform.trim()).filter(Boolean),
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
    },
    contract: {
      contractId: loadedIds.contractId,
      revision_policy: {
        revision_rounds: contractTerms.revisionRounds,
        revision_window_days: contractTerms.revisionDays,
        auto_approve_after_days: contractTerms.feedbackDays,
      },
      usage_rights: {
        is_exclusive: contractTerms.hasExclusivity,
        is_transferrable: false,
        organic_usage: contractTerms.includedOrganicUsage,
        territory: contractTerms.territory.trim(),
        restrictions: contractTerms.restrictions.trim(),
      },
      posting_requirements: {
        content_retention_months: contractTerms.contentRetention,
        partnership_tags: contractTerms.partnershipTags.trim(),
      },
      exclusivity: contractTerms.hasExclusivity
        ? {
            category: contractTerms.exclusivityCategory.trim(),
            startDate: contractTerms.exclusivityStartDate
              ? new Date(contractTerms.exclusivityStartDate).toISOString()
              : "",
            endDate: contractTerms.exclusivityEndDate
              ? new Date(contractTerms.exclusivityEndDate).toISOString()
              : "",
            territory: contractTerms.exclusivityTerritory.trim(),
            brandlist: contractTerms.exclusivityCompetitorList.trim(),
            exclusivity_fee: parseFloat(contractTerms.exclusivityFee.replace(/,/g, "") || "0"),
          }
        : null,
      ...(hasExpenses && {
        expenses_purchases_terms: {
          reimbursement_period: contractTerms.reimbursementDays,
          gifted_product_terms: contractTerms.giftedProductTerms.trim(),
        },
      }),
      cancellation_period: contractTerms.cancellationDays,
      payment_terms: {
        payment_schedule: paymentTerms.paymentSchedule,
        payment_method: paymentTerms.paymentMethod,
      },
      invoice_requirements: {
        name: (form.contactPerson || "TEMPORARY_NAME").trim(),
        email: form.contactEmail.trim(),
        campaign_name: form.projectName.trim(),
        payment_details: "TEMPORARY_PAYMENT_DETAILS",
      },
      general_terms: {
        governed_by: contractTerms.governingLaw.trim(),
        disputes_handled_in: contractTerms.disputeLocation.trim(),
      },
      extra_notes: (contractTerms.extraNotes ?? "").trim(),
    },
    deliverables: {
      create: deliverablesCreate,
      update: deliverablesUpdate,
      delete: deliverablesDelete,
    },
    addOns: {
      create: addOnsCreate,
      update: addOnsUpdate,
      delete: addOnsDelete,
    },
    giftedProducts: {
      create: giftedProductsCreate,
      update: giftedProductsUpdate,
      delete: giftedProductsDelete,
    },
  }
}
