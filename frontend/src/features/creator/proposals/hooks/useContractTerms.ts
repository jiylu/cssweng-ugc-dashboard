import { useState } from "react"
import { useCreativeDirection } from "./useCreativeDirection"
import { useUsageRights } from "./useUsageRights"
import { useExclusivity } from "./useExclusivity"
import { useExpenses } from "./useExpenses"
import { useGeneralTerms } from "./useGeneralTerms"
import { validateContractTerms } from "../utils/validators"
import { ContractTermsData } from "../types/contract-terms.types"

export function useContractTerms() {
  const creativeDirection = useCreativeDirection()
  const usageRights = useUsageRights()
  const exclusivity = useExclusivity()
  const expenses = useExpenses()
  const generalTerms = useGeneralTerms()
  const [errors, setErrors] = useState<Record<string, string>>({})

  function buildData(): ContractTermsData {
    return {
      ...creativeDirection.buildData(),
      ...usageRights.buildData(),
      ...exclusivity.buildData(),
      ...expenses.buildData(),
      ...generalTerms.buildData(),
    }
  }

  function validateForm(campaignDates?: { startDate: string; endDate: string }): boolean {
    const newErrors = validateContractTerms(buildData(), campaignDates)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return {
    ...creativeDirection,
    ...usageRights,
    ...exclusivity,
    ...expenses,
    ...generalTerms,
    errors,
    validateForm,
    buildData,
  }
}