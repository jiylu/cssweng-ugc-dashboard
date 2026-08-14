import { CreateCampaignPayload, GiftedProductShippingAddress } from "@/src/features/creator/proposals/types/campaign-setup.types"
import { ShippingAddress } from "@/src/features/creator/proposals/types/payment-terms.types"
import { useCampaignForm } from "@/src/features/creator/proposals/hooks/useCampaignForm"
import { useContractTerms } from "@/src/features/creator/proposals/hooks/useContractTerms"
import { usePaymentTerms } from "@/src/features/creator/proposals/hooks/usePaymentTerms"
import { useAddOns } from "@/src/features/creator/proposals/hooks/useAddOns"

interface BuildPayloadParams {
  userId: string
  form: ReturnType<typeof useCampaignForm>
  contractTerms: ReturnType<typeof useContractTerms>
  paymentTerms: ReturnType<typeof usePaymentTerms>
  addOns: ReturnType<typeof useAddOns>
}

export function trimString(value: string | null | undefined): string {
  return value?.trim() ?? ""
}

function toIsoDate(value: string): string {
  if (!value) return ""
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "" : date.toISOString()
}

export function toShippingAddressPayload(
  address: ShippingAddress | null | undefined,
): GiftedProductShippingAddress | null {
  if (!address) return null
  return {
    delivery_address_line_1: trimString(address.addressLine1),
    delivery_address_line_2: trimString(address.addressLine2) || undefined,
    country: trimString(address.country),
    state_province: trimString(address.stateProvince),
    city: trimString(address.city),
    zip_code: Number(address.zipCode) || 0,
  }
}

export function buildProposalPayload({ userId, form, contractTerms, paymentTerms, addOns }: BuildPayloadParams): CreateCampaignPayload {
  const [clientFirstName = "", ...clientLastNameParts] =
    form.contactPerson.trim().split(/\s+/)
  const clientLastName = clientLastNameParts.join(" ") || clientFirstName

  return {
    campaign: {
      ugcId: userId,
      projectName: form.projectName.trim(),
      description: form.campaignDescription.trim(),
      currency: form.currency,
      tax: paymentTerms.taxRate,
      platforms: Object.fromEntries(
        form.platforms.map((p) => [p.platform.trim(), p.handle.trim()]),
      ),
      startDate: toIsoDate(form.startDate),
      endDate: toIsoDate(form.endDate),
    },
    deliverables: form.deliverables.map((d) => ({
      quantity: Number(d.quantity ?? 1),
      deliverableType: d.deliverableType as 'COLLABORATION' | 'UGC',
      deliverableContent: `${d.platform.trim()} ${d.contentType.trim()}`.trim(),
      requirements: d.description.trim(),
      dueDate: toIsoDate(d.draftDeadline),
      postDate: toIsoDate(d.postDate),
      pricing: parseFloat(d.pricing.replace(/,/g, '') || '0'),
    })),
    proposal: {
      clientEmail: form.contactEmail.trim(),
      client_first_name: clientFirstName || form.contactPerson,
      client_last_name: clientLastName,
    },
    contract: {
      revision_policy: {
        revision_rounds: contractTerms.revisionRounds,
        revision_window_days: contractTerms.revisionDays,
        auto_approve_after_days: contractTerms.feedbackDays,
      },
      usage_rights: {
        is_exclusive: contractTerms.hasExclusivity,
        is_transferrable: false,
        organic_usage: contractTerms.includedOrganicUsage,
        // paid_usage_ads: "",
        // whitelisting_spark_ads: "",
        territory: contractTerms.territory.trim(),
        restrictions: contractTerms.restrictions.trim(),
      },
      posting_requirements: {
        content_retention_months: contractTerms.contentRetention,
        partnership_tags: contractTerms.partnershipTags.trim(),
      },
      ...(contractTerms.hasExclusivity && {
        exclusivity: {
          category: contractTerms.exclusivityCategory.trim(),
          startDate: toIsoDate(contractTerms.exclusivityStartDate),
          endDate: toIsoDate(contractTerms.exclusivityEndDate),
          territory: contractTerms.exclusivityTerritory.trim(),
          brandlist: contractTerms.exclusivityCompetitorList.trim(),
          exclusivity_fee: parseFloat(
            contractTerms.exclusivityFee.replace(/,/g, "") || "0"
          ),
        },
      }),
      expenses_purchases_terms: {
        reimbursement_period: contractTerms.reimbursementDays,
        gifted_product_terms: contractTerms.giftedProductTerms.trim(),
      },
      cancellation_period: contractTerms.cancellationDays,
      payment_terms: {
        payment_schedule: paymentTerms.paymentSchedule,
        payment_method: paymentTerms.paymentMethod,
      },
      invoice_requirements: {
        name: (form.contactPerson || "TEMPORARY_NAME").trim(),
        email: form.contactEmail.trim(),
        campaign_name: form.projectName.trim(),
        // tax_number: "",
        payment_details: "TEMPORARY_PAYMENT_DETAILS",
      },
      general_terms: {
        governed_by: contractTerms.governingLaw.trim(),
        disputes_handled_in: contractTerms.disputeLocation.trim(),
      },
      extra_notes: (contractTerms.extraNotes ?? "").trim(),
    },
    addOns: addOns.addOns.filter((a) => a.isEnabled).map((a) => ({
      addOnName: a.title.trim(),
      description: (a.desc ?? "").trim(),
      fee: a.fee ?? 0,
      initials: a.title.trim().split(/\s+/).map((w) => w[0]).join("").toUpperCase(),
    })),
    ...(paymentTerms.giftedProducts.length > 0 && {
      giftedProducts: paymentTerms.giftedProducts.map((p) => ({
        productName: p.productName.trim(),
        value: parseFloat(p.value.replace(/,/g, '') || '0'),
        shippingAddress: toShippingAddressPayload(p.shippingAddress),
        deliveryInstructions: (p.deliveryInstructions ?? "").trim(),
        ownershipTerms: (p.ownershipTerms ?? "").trim(),
      }))
    }),
  }
}
