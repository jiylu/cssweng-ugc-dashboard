import { useCampaignForm } from "../hooks/useCampaignForm"
import { useContractTerms } from "../hooks/useContractTerms"
import { usePaymentTerms } from "../hooks/usePaymentTerms"
import { useAddOns } from "../hooks/useAddOns"
import { CampaignSetupDetails } from "../types/campaign-setup-response.types"
import { PlatformEntry } from "../types/campaign-setup.types"
import { DEFAULT_ADD_ONS } from "./defaultAddOns"

interface ApplyCampaignSetupParams {
  form: ReturnType<typeof useCampaignForm>
  contractTerms: ReturnType<typeof useContractTerms>
  paymentTerms: ReturnType<typeof usePaymentTerms>
  addOns: ReturnType<typeof useAddOns>
  details: CampaignSetupDetails
}

export interface LoadedSetupIds {
  contractId: string
  deliverableIds: string[]
  addOnIds: string[]
  giftedProductIds: string[]
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : ""
}

function splitDeliverableContent(content: string): { platform: string; contentType: string } {
  const trimmed = content.trim()
  const spaceIndex = trimmed.indexOf(" ")
  if (spaceIndex === -1) return { platform: trimmed, contentType: "" }
  return {
    platform: trimmed.slice(0, spaceIndex),
    contentType: trimmed.slice(spaceIndex + 1),
  }
}

export function applyCampaignSetupToForm({ form, contractTerms, paymentTerms, addOns, details }: ApplyCampaignSetupParams): LoadedSetupIds {
  const campaign = details.campaign
  const proposal = details.proposal
  const contract = details.contract

  form.setProjectName(asString(campaign.project_name))
  form.setCampaignDescription(asString(campaign.description))
  form.setCurrency(asString(campaign.currency) || "PHP")
  form.setStartDate(asString(campaign.start_date))
  form.setEndDate(asString(campaign.end_date))
  if (proposal) {
    form.setContactEmail(asString(proposal.client_email))
  }
  if (contract?.invoice_requirements?.name) {
    form.setContactPerson(asString(contract.invoice_requirements.name))
  }

  const platformsValue = campaign.platforms ?? {}
  const platforms: PlatformEntry[] = Array.isArray(platformsValue)
    ? platformsValue.map((p) =>
        typeof p === "string" ? { platform: p, handle: "" } : { platform: String(p), handle: "" },
      )
    : Object.entries(platformsValue).map(([platform, handle]) => ({
        platform,
        handle: asString(handle),
      }))
  form.setPlatforms(platforms)

  form.setDeliverables(
    details.deliverables.map((d, index) => {
      const { platform, contentType } = splitDeliverableContent(d.deliverable_content)
      return {
        id: index + 1,
        dbId: d.deliverable_id,
        description: d.requirements,
        deliverableType: d.deliverable_type,
        draftDeadline: d.due_date,
        pricing: String(d.pricing),
        quantity: String(d.quantity || 1),
        platform,
        contentType,
        postDate: d.post_date,
      }
    }),
  )

  if (contract) {
    contractTerms.setRevisionRounds(contract.revision_policy?.revision_rounds ?? 0)
    contractTerms.setRevisionDays(contract.revision_policy?.revision_window_days ?? 0)
    contractTerms.setFeedbackDays(contract.revision_policy?.auto_approve_after_days ?? 0)

    contractTerms.setIncludedOrganicUsage(contract.usage_rights?.organic_usage ?? "")
    contractTerms.setTerritory(contract.usage_rights?.territory ?? "")
    contractTerms.setRestrictions(contract.usage_rights?.restrictions ?? "")
    contractTerms.setHasExclusivity(contract.usage_rights?.is_exclusive ?? false)

    contractTerms.setContentRetention(contract.posting_requirements?.content_retention_months ?? 0)
    contractTerms.setPartnershipTags(contract.posting_requirements?.partnership_tags ?? "")

    if (contract.exclusivity && Object.keys(contract.exclusivity).length > 0) {
      contractTerms.setHasExclusivity(true)
      contractTerms.setExclusivityCategory(contract.exclusivity.category)
      contractTerms.setExclusivityStartDate(contract.exclusivity.startDate)
      contractTerms.setExclusivityEndDate(contract.exclusivity.endDate)
      contractTerms.setExclusivityTerritory(contract.exclusivity.territory)
      contractTerms.setExclusivityCompetitorList(contract.exclusivity.brandlist)
      contractTerms.setExclusivityFee(String(contract.exclusivity.exclusivity_fee))
    }

    contractTerms.setReimbursementDays(contract.expenses_purchases_terms?.reimbursement_period ?? 0)
    contractTerms.setGiftedProductTerms(contract.expenses_purchases_terms?.gifted_product_terms ?? "")
    contractTerms.setCancellationDays(contract.cancellation_period ?? 0)

    paymentTerms.setPaymentSchedule(contract.payment_terms?.payment_schedule ?? "")
    paymentTerms.setPaymentMethod(contract.payment_terms?.payment_method ?? "")

    contractTerms.setGoverningLaw(contract.general_terms?.governed_by ?? "")
    contractTerms.setDisputeLocation(contract.general_terms?.disputes_handled_in ?? "")
    contractTerms.setExtraNotes(contract.extra_notes ?? "")
  }

  paymentTerms.setTaxRate(Number(campaign.tax) || 0)

  const defaultAddOnsByTitle = new Map(DEFAULT_ADD_ONS.map((a) => [a.title, a]))
  const loadedAddOns = details.addOns ?? []
  addOns.setAddOns(
    loadedAddOns.map((a, index) => {
      const defaultAddOn = defaultAddOnsByTitle.get(a.add_on_name)
      return {
        id: defaultAddOn?.id ?? `existing-${index}`,
        dbId: a.add_on_id,
        title: a.add_on_name,
        desc: a.description,
        fee: a.fee,
        isPermanent: defaultAddOn ? true : false,
        isEnabled: a.opt_in ?? false,
      }
    }),
  )

  const loadedGiftedProducts = details.giftedProducts ?? []
  paymentTerms.setGiftedProducts(
    loadedGiftedProducts.map((p, index) => {
      const address = p.shipping_address
      return {
        id: index + 1,
        dbId: p.gifted_product_id,
        productName: p.product_name,
        value: String(p.value),
        ownershipTerms: p.ownership_terms,
        shippingAddress: address
          ? {
              addressLine1: address.delivery_address_line_1,
              addressLine2: address.delivery_address_line_2 ?? "",
              country: address.country,
              stateProvince: address.state_province,
              city: address.city,
              zipCode: String(address.zip_code),
            }
          : null,
        deliveryInstructions: p.delivery_instructions,
      }
    }),
  )

  return {
    contractId: contract?.contract_id ?? "",
    deliverableIds: details.deliverables.map((d) => d.deliverable_id),
    addOnIds: loadedAddOns.map((a) => a.add_on_id),
    giftedProductIds: loadedGiftedProducts.map((g) => g.gifted_product_id),
  }
}
