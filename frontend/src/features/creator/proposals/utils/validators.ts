import { campaignSchema } from "../schemas/campaign.schema";
import { Deliverable } from "../types/deliverables.types";
import { contractTermsSchema } from "../schemas/contract-terms.schema";
import { ContractTermsData } from "../types/contract-terms.types";
import { paymentTermsSchema } from "../schemas/payment-terms.schema"
import { PaymentTermsData } from "../types/payment-terms.types"

interface FormData {
    projectName: string;
    startDate: string;
    endDate: string;
    currency: string
    campaignDescription: string;
    contactEmail: string;
    platforms: { platform: string; handle: string }[]
    deliverables: Deliverable[];
}

export const validateCampaignForm = (data: FormData) => {
  const result = campaignSchema.safeParse(data);

  if (result.success) return {};

  const errors: Record<string, string> = {};

  for (const issue of result.error.issues) {
    const path = issue.path.join('.');
    errors[path] = issue.message; 
  }

  return errors;
}

export const validateContractTerms = (data: ContractTermsData) => {
  const result = contractTermsSchema.safeParse(data);

  if (result.success) return {};

  const errors: Record<string, string> = {};

  for (const issue of result.error.issues) {
    const path = issue.path.join('.');
    errors[path] = issue.message;
  }

  return errors;
}

export const validatePaymentTerms = (data: PaymentTermsData) => {
  const result = paymentTermsSchema.safeParse(data)
  
  if (result.success) return {}

  const errors: Record<string, string> = {}
  for (const issue of result.error.issues) {
    const path = issue.path.join(".")
    errors[path] = issue.message
  }
  return errors
}