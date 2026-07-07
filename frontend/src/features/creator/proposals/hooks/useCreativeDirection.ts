import { useState } from "react"
import { CreativeDirectionData } from "../types/creative-direction.types"

export function useCreativeDirection() {
  const [revisionRounds, setRevisionRounds] = useState(1)
  const [revisionDays, setRevisionDays] = useState(1)
  const [feedbackDays, setFeedbackDays] = useState(1)

  function buildData(): CreativeDirectionData {
    return { revisionRounds, revisionDays, feedbackDays }
  }

  return { revisionRounds, setRevisionRounds, revisionDays, setRevisionDays, feedbackDays, setFeedbackDays, buildData }
}