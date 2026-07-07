import { useState } from "react"
import { ExclusivityData } from "../types/exclusivity.types"

export function useExclusivity() {
  const [hasExclusivity, setHasExclusivity] = useState(false)
  const [exclusivityCategory, setExclusivityCategory] = useState("")
  const [exclusivityCompetitorList, setExclusivityCompetitorList] = useState("")
  const [exclusivityStartDate, setExclusivityStartDate] = useState("")
  const [exclusivityEndDate, setExclusivityEndDate] = useState("")
  const [exclusivityFee, setExclusivityFee] = useState("")
  const [exclusivityTerritory, setExclusivityTerritory] = useState("")

  function buildData(): ExclusivityData {
    return { hasExclusivity, exclusivityCategory, exclusivityCompetitorList, exclusivityStartDate, exclusivityEndDate, exclusivityFee, exclusivityTerritory }
  }

  return { hasExclusivity, setHasExclusivity, exclusivityCategory, setExclusivityCategory, exclusivityCompetitorList, setExclusivityCompetitorList, exclusivityStartDate, setExclusivityStartDate, exclusivityEndDate, setExclusivityEndDate, exclusivityFee, setExclusivityFee, exclusivityTerritory, setExclusivityTerritory, buildData }
}