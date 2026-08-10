import { useCampaignForm } from "../hooks/useCampaignForm"
import { useContractTerms } from "../hooks/useContractTerms"
import { usePaymentTerms } from "../hooks/usePaymentTerms"
import { useAddOns } from "../hooks/useAddOns"
import { DraftEntity } from "../types/draft.types"
import { PlatformEntry } from "../types/campaign-setup.types"
import { DEFAULT_ADD_ONS } from "./defaultAddOns"

interface ApplyDraftParams {
  form: ReturnType<typeof useCampaignForm>
  contractTerms: ReturnType<typeof useContractTerms>
  paymentTerms: ReturnType<typeof usePaymentTerms>
  addOns: ReturnType<typeof useAddOns>
  draft: DraftEntity
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {}
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : ""
}

function asNumber(value: unknown): number {
  if (typeof value === "number") return value
  const parsed = parseFloat(asString(value).replace(/,/g, ""))
  return Number.isNaN(parsed) ? 0 : parsed
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

export function applyDraftToForm({ form, contractTerms, paymentTerms, addOns, draft }: ApplyDraftParams) {
  const campaign = record(draft.campaign_content)
  const proposal = record(draft.proposal_content)
  const contract = record(draft.contract_content)
  const deliverables = Array.isArray(draft.deliverable_content) ? draft.deliverable_content : []
  const draftAddOns = Array.isArray(draft.add_ons_content) ? draft.add_ons_content : []
  const giftedProducts = Array.isArray(draft.gifted_products_content)
    ? draft.gifted_products_content
    : []

  form.setProjectName(asString(campaign.projectName))
  form.setCampaignDescription(asString(campaign.description))
  form.setCurrency(asString(campaign.currency) || "PHP")
  form.setStartDate(asString(campaign.startDate))
  form.setEndDate(asString(campaign.endDate))
  form.setContactEmail(asString(proposal.clientEmail))
  form.setContactPerson(asString(record(contract.invoice_requirements).name))

  const platformsValue = record(campaign.platforms)
  const platforms: PlatformEntry[] = Array.isArray(campaign.platforms)
    ? (campaign.platforms as unknown[]).map((p) => {
        const entry = record(p)
        return {
          platform: typeof p === "string" ? p : asString(entry.platform),
          handle: typeof p === "string" ? "" : asString(entry.handle),
        }
      })
    : Object.keys(platformsValue).length > 0
      ? Object.entries(platformsValue).map(([platform, handle]) => ({
          platform,
          handle: asString(handle),
        }))
      : []
  form.setPlatforms(platforms)

  form.setDeliverables(
    deliverables.map((d, index) => {
      const content = asString(record(d).deliverableContent)
      const { platform, contentType } = splitDeliverableContent(content)
      return {
        id: index + 1,
        description: asString(record(d).requirements),
        deliverableType: asString(record(d).deliverableType),
        draftDeadline: asString(record(d).dueDate),
        pricing: String(asNumber(record(d).pricing)),
        quantity: String(asNumber(record(d).quantity) || 1),
        platform,
        contentType,
        postDate: asString(record(d).postDate),
      }
    }),
  )

  const revisionPolicy = record(contract.revision_policy)
  contractTerms.setRevisionRounds(asNumber(revisionPolicy.revision_rounds))
  contractTerms.setRevisionDays(asNumber(revisionPolicy.revision_window_days))
  contractTerms.setFeedbackDays(asNumber(revisionPolicy.auto_approve_after_days))

  const usageRights = record(contract.usage_rights)
  contractTerms.setIncludedOrganicUsage(asString(usageRights.organic_usage))
  contractTerms.setTerritory(asString(usageRights.territory))
  contractTerms.setRestrictions(asString(usageRights.restrictions))
  contractTerms.setHasExclusivity(Boolean(usageRights.is_exclusive))

  const postingRequirements = record(contract.posting_requirements)
  contractTerms.setContentRetention(asNumber(postingRequirements.content_retention_months))
  contractTerms.setPartnershipTags(asString(postingRequirements.partnership_tags))

  const exclusivity = record(contract.exclusivity)
  if (Object.keys(exclusivity).length > 0) {
    contractTerms.setHasExclusivity(true)
    contractTerms.setExclusivityCategory(asString(exclusivity.category))
    contractTerms.setExclusivityStartDate(asString(exclusivity.startDate))
    contractTerms.setExclusivityEndDate(asString(exclusivity.endDate))
    contractTerms.setExclusivityTerritory(asString(exclusivity.territory))
    contractTerms.setExclusivityCompetitorList(asString(exclusivity.brandlist))
    contractTerms.setExclusivityFee(String(asNumber(exclusivity.exclusivity_fee)))
  }

  const expenses = record(contract.expenses_purchases_terms)
  contractTerms.setReimbursementDays(asNumber(expenses.reimbursement_period))
  contractTerms.setGiftedProductTerms(asString(expenses.gifted_product_terms))
  contractTerms.setCancellationDays(asNumber(contract.cancellation_period))

  const paymentTermsData = record(contract.payment_terms)
  paymentTerms.setPaymentSchedule(asString(paymentTermsData.payment_schedule))
  paymentTerms.setPaymentMethod(asString(paymentTermsData.payment_method))
  paymentTerms.setTaxRate(asNumber(campaign.tax))

  const invoiceRequirements = record(contract.invoice_requirements)
  if (asString(invoiceRequirements.name)) {
    form.setContactPerson(asString(invoiceRequirements.name))
  }

  const generalTerms = record(contract.general_terms)
  contractTerms.setGoverningLaw(asString(generalTerms.governed_by))
  contractTerms.setDisputeLocation(asString(generalTerms.disputes_handled_in))
  contractTerms.setExtraNotes(asString(contract.extra_notes))

  const defaultAddOnsByTitle = new Map(
    DEFAULT_ADD_ONS.map((a) => [a.title, a]),
  )

  addOns.setAddOns(
    draftAddOns.map((a, index) => {
      const addOn = record(a)
      const title = asString(addOn.addOnName)
      const defaultAddOn = defaultAddOnsByTitle.get(title)
      return {
        id: defaultAddOn?.id ?? `draft-${index}`,
        title,
        desc: asString(addOn.description),
        fee: asNumber(addOn.fee),
        isPermanent: defaultAddOn ? true : false,
        isEnabled:
          typeof addOn.enabled === "boolean"
            ? addOn.enabled
            : (defaultAddOn?.isEnabled ?? true),
      }
    }),
  )

  paymentTerms.setGiftedProducts(
    giftedProducts.map((p, index) => {
      const product = record(p)
      const storedAddress = record(product.shippingAddress)
      return {
        id: index + 1,
        productName: asString(product.productName),
        value: String(asNumber(product.value)),
        ownershipTerms: asString(product.ownershipTerms),
        shippingAddress:
          Object.keys(storedAddress).length > 0
            ? {
                addressLine1: asString(storedAddress.delivery_address_line_1),
                addressLine2: asString(storedAddress.delivery_address_line_2),
                country: asString(storedAddress.country),
                stateProvince: asString(storedAddress.state_province),
                city: asString(storedAddress.city),
                zipCode:
                  storedAddress.zip_code !== undefined &&
                  storedAddress.zip_code !== null
                    ? String(storedAddress.zip_code)
                    : "",
              }
            : null,
        deliveryInstructions: asString(product.deliveryInstructions),
      }
    }),
  )
}
