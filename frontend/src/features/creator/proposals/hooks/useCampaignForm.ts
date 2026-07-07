import { useState } from "react"
import { useCampaignDetails } from "./useCampaignDetails"
import { useDeliverables } from "./useDeliverables"
import { validateCampaignForm } from "../utils/validators"

export function useCampaignForm() {
  const campaignDetails = useCampaignDetails()
  const deliverables = useDeliverables()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeStep, setActiveStep] = useState(1)

  function validateForm(): boolean {
    const newErrors = validateCampaignForm({
      projectName: campaignDetails.projectName,
      startDate: campaignDetails.startDate,
      endDate: campaignDetails.endDate,
      currency: campaignDetails.currency,
      campaignDescription: campaignDetails.campaignDescription,
      contactEmail: campaignDetails.contactEmail,
      platforms: campaignDetails.platforms,
      deliverables: deliverables.deliverables,
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return {
    ...campaignDetails,
    ...deliverables,
    errors,
    validateForm,
    activeStep,
    setActiveStep,
  }
}