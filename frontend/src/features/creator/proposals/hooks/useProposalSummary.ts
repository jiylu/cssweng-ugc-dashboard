import { useCampaignForm } from "./useCampaignForm"
import { useContractTerms } from "./useContractTerms"
import { useAddOns } from "./useAddOns"
import { usePaymentTerms } from "./usePaymentTerms"
import { formatDate } from "@/src/utils/date"
import { calculateBaseCreatorFee } from "../utils/calculateTotalFee"

export function useProposalSummary(
  form: ReturnType<typeof useCampaignForm>,
  contractTerms: ReturnType<typeof useContractTerms>,
  addOns: ReturnType<typeof useAddOns>,
  paymentTerms: ReturnType<typeof usePaymentTerms>,
  userName: string
) {
  const baseFee = calculateBaseCreatorFee(
    form.deliverables,
    addOns.addOns.filter((a) => a.isEnabled),
    contractTerms.exclusivityFee,
    contractTerms.hasExclusivity,
    paymentTerms.giftedProducts
  )

  const taxAmount = baseFee * (paymentTerms.taxRate / 100)
  const total = baseFee + taxAmount

  const startDateFormatted = form.startDate
    ? formatDate(new Date(form.startDate))
    : "TBD"

  const endDateFormatted = form.endDate
    ? formatDate(new Date(form.endDate))
    : "TBD"

  return {
    earnings: {
      currency: form.currency,
      baseFee,
      tax: taxAmount,
      taxRate: paymentTerms.taxRate,
      total,
    },
    campaign: {
      brand: form.contactEmail || "Brand Name",
      creator: userName,
      campaignName: form.projectName,
      platforms: form.platforms.map((p) => p.platform),
      period: `${startDateFormatted} - ${endDateFormatted}`,
      startDate: startDateFormatted,
      endDate: endDateFormatted,
      description: form.campaignDescription,
    },
    deliverables: form.deliverables.map((d) => ({
      qty: Number(d.quantity ?? 1),
      deliverable: d.platform,
      format: [d.platform, d.contentType].filter(Boolean).join(", "),
      dueDate: d.draftDeadline ? formatDate(new Date(d.draftDeadline)) : "TBD",
    })),
    creativeDirection: {
      revisionRounds: contractTerms.revisionRounds,
      revisionDays: contractTerms.revisionDays,
      feedbackDays: contractTerms.feedbackDays,
    },
    fees: {
      baseFee,
      tax: taxAmount,
      taxRate: paymentTerms.taxRate,
      total,
      currency: form.currency,
    },
    usageRights: [
      ...(contractTerms.contentRetention > 0 ? [{
        type: "Organic Social Media",
        duration: `${contractTerms.contentRetention} Months`,
      }] : []),
      ...(contractTerms.hasExclusivity ? [{
        type: "Exclusivity",
        duration: `${contractTerms.exclusivityCategory} — ${contractTerms.exclusivityTerritory}`,
      }] : []),
    ],
    exclusivity: {
      hasExclusivity: contractTerms.hasExclusivity,
      category: contractTerms.exclusivityCategory,
      territory: contractTerms.exclusivityTerritory,
      competitorList: contractTerms.exclusivityCompetitorList,
      startDate: contractTerms.exclusivityStartDate
        ? formatDate(new Date(contractTerms.exclusivityStartDate))
        : "",
      endDate: contractTerms.exclusivityEndDate
        ? formatDate(new Date(contractTerms.exclusivityEndDate))
        : "",
      fee: contractTerms.exclusivityFee,
    },
    contract: {
      territory: contractTerms.territory,
      restrictions: contractTerms.restrictions,
      includedOrganicUsage: contractTerms.includedOrganicUsage,
      partnershipTags: contractTerms.partnershipTags,
      reimbursementDays: contractTerms.reimbursementDays,
      giftedProductTerms: contractTerms.giftedProductTerms,
      cancellationDays: contractTerms.cancellationDays,
      governingLaw: contractTerms.governingLaw,
      disputeLocation: contractTerms.disputeLocation,
      extraNotes: contractTerms.extraNotes,
    },
    payment: {
      schedule: paymentTerms.paymentSchedule,
      method: paymentTerms.paymentMethod,
    },
    addOns: addOns.addOns.filter((a) => a.isEnabled),
    giftedProducts: paymentTerms.giftedProducts,
  }
}