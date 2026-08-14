import { useState } from "react"
import { UsageRightsData } from "../types/usage-rights.types"

export function useUsageRights() {
  const [includedOrganicUsage, setIncludedOrganicUsage] = useState("")
  const [territory, setTerritory] = useState("")
  const [restrictions, setRestrictions] = useState("")
  const [contentRetention, setContentRetention] = useState(1)
  const [partnershipTags, setPartnershipTags] = useState("")

  function buildData(): UsageRightsData {
    return { includedOrganicUsage, territory, restrictions, contentRetention, partnershipTags }
  }

  return { 
          includedOrganicUsage, setIncludedOrganicUsage, 
          territory, setTerritory, 
          restrictions, setRestrictions, 
          contentRetention, setContentRetention, 
          partnershipTags, setPartnershipTags, 
          buildData 
        }
}