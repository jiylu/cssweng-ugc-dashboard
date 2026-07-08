import { useState } from "react"
import { PlatformEntry } from "../types/campaign-setup.types"

export function useCampaignDetails() {
  const [projectName, setProjectName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [campaignDescription, setCampaignDescription] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [platforms, setPlatforms] = useState<PlatformEntry[]>([])
  const [currency, setCurrency] = useState("PHP")

  return {
    projectName, setProjectName,
    startDate, setStartDate,
    endDate, setEndDate,
    campaignDescription, setCampaignDescription,
    contactEmail, setContactEmail,
    platforms, setPlatforms,
    currency, setCurrency
  }
}