import { useState } from "react"

export function useWorkspace() {
  const [activeStep, setActiveStep] = useState(1)
  const [activeDeliverable, setActiveDeliverable] = useState(0)
  const [historyOpen, setHistoryOpen] = useState(false)

  return {
    activeStep,
    setActiveStep,
    activeDeliverable,
    setActiveDeliverable,
    historyOpen,
    setHistoryOpen,
  }
}