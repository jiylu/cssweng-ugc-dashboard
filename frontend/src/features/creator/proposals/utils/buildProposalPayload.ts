import { CreateCampaignPayload } from "@/src/features/creator/proposals/types/campaign-setup.types"
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

export function buildProposalPayload({ userId, form, contractTerms, paymentTerms, addOns }: BuildPayloadParams): CreateCampaignPayload {
  return {
    campaign: {
      ugcId: userId,
      projectName: form.projectName,
      description: form.campaignDescription,
      currency: form.currency,
      tax: 12,
      platforms: form.platforms.map((p) => p.platform),
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
    },
    deliverables: form.deliverables.map((d) => ({
      quantity: Number(d.quantity ?? 1),
      deliverableType: d.deliverableType as 'COLLABORATION' | 'UGC',
      deliverableContent: `${d.platform} ${d.contentType}`,
      requirements: d.description,
      dueDate: new Date(d.draftDeadline).toISOString(),
      postDate: d.postDate ? new Date(d.postDate).toISOString() : "",
      pricing: parseFloat(d.pricing.replace(/,/g, '') || '0'),
    })),
    proposal: {
      clientEmail: form.contactEmail,
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
        territory: contractTerms.territory,
        restrictions: contractTerms.restrictions,
      },
      posting_requirements: {
        content_retention_months: contractTerms.contentRetention,
        partnership_tags: contractTerms.partnershipTags,
      },
      ...(contractTerms.hasExclusivity && {
        exclusivity: {
          category: contractTerms.exclusivityCategory,
          startDate: contractTerms.exclusivityStartDate
            ? new Date(contractTerms.exclusivityStartDate).toISOString()
            : "",
          endDate: contractTerms.exclusivityEndDate
            ? new Date(contractTerms.exclusivityEndDate).toISOString()
            : "",
          territory: contractTerms.exclusivityTerritory,
          brandlist: contractTerms.exclusivityCompetitorList,
          exclusivity_fee: parseFloat(
            contractTerms.exclusivityFee.replace(/,/g, "") || "0"
          ),
        },
      }),
      expenses_purchases_terms: {
        reimbursement_period: contractTerms.reimbursementDays,
        gifted_product_terms: contractTerms.giftedProductTerms,
      },
      cancellation_period: contractTerms.cancellationDays,
      payment_terms: {
        payment_schedule: paymentTerms.paymentSchedule,
        payment_method: paymentTerms.paymentMethod,
      },
      invoice_requirements: {
        name: "TEMPORARY_NAME",
        email: form.contactEmail,
        campaign_name: form.projectName,
        // tax_number: "",
        payment_details: "TEMPORARY_PAYMENT_DETAILS",
      },
      general_terms: {
        governed_by: contractTerms.governingLaw,
        disputes_handled_in: contractTerms.disputeLocation,
      },
      extra_notes: contractTerms.extraNotes ?? "",
    },
    addOns: addOns.addOns.map((a) => ({
      addOnName: a.title,
      description: a.desc ?? "",
      fee: a.fee ?? 0,
      initials: a.title.split(" ").map((w) => w[0]).join("").toUpperCase(),
    })),
    ...(paymentTerms.giftedProducts.length > 0 && {
      giftedProducts: paymentTerms.giftedProducts.map((p) => ({
        productName: p.productName,
        value: parseFloat(p.value.replace(/,/g, '') || '0'),
        deliveryAddress: p.shippingAddress,
        deliveryInstructions: p.deliveryInstructions,
        ownershipTerms: p.ownershipTerms,
      }))
    }),
  }
}