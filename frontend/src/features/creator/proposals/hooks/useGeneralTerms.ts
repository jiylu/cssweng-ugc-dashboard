import { useState } from "react"
import { GeneralTermsData } from "../types/general-terms.types"

export function useGeneralTerms() {
  const [governingLaw, setGoverningLaw] = useState("")
  const [disputeLocation, setDisputeLocation] = useState("")
  const [extraNotes, setExtraNotes] = useState("")

  function buildData(): GeneralTermsData {
    return { governingLaw, disputeLocation, extraNotes }
  }

  return { governingLaw, setGoverningLaw, disputeLocation, setDisputeLocation, extraNotes, setExtraNotes, buildData }
}