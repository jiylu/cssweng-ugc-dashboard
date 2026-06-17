import { campaignSchema } from "../schemas/campaign.schema";
import { Deliverable } from "../types/deliverables.types";

interface FormData {
    projectName: string;
    startDate: string;
    endDate: string;
    campaignDescription: string;
    contactEmail: string;
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