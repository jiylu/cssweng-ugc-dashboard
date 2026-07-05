import { useState } from "react"
import { Deliverable } from "@/src/features/creator/proposals/types/deliverables.types"
import { validateCampaignForm } from "../utils/validators"

export function useCampaignForm() {
  const [projectName, setProjectName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [campaignDescription, setCampaignDescription] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [platforms, setPlatforms] = useState<string[]>([])
  const [deliverables, setDeliverables] = useState<Deliverable[]>([
    {
      id: 1,
      deliverableTitle: "",
      description: "",
      deliverableType: "",
      draftDeadline: "",
      pricing: "",
      quantity: "1",
      contentType: "",
      postDate: "",
    },
  ])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const addDeliverable = () => {
    const newId =
      deliverables.length > 0
        ? Math.max(...deliverables.map(d => d.id)) + 1
        : 1

    setDeliverables([
      ...deliverables,
      {
        id: newId,
        deliverableTitle: "",
        description: "",
        deliverableType: "",
        draftDeadline: "",
        pricing: "",
        quantity: "1",
        contentType: "",
        postDate: "",
      },
    ])
  }

  const updateDeliverable = (
    id: number,
    field: keyof Deliverable,
    value: string
  ) => {
    setDeliverables(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  const adjustPrice = (id: number, amount: number) => {
    setDeliverables(prev =>
      prev.map(item => {
        if (item.id !== id) return item

        const currentVal = parseFloat(
          item.pricing.replace(/,/g, "") || "0"
        )

        const newVal = Math.max(0, currentVal + amount)

        const formatted = newVal
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")

        return {
          ...item,
          pricing: formatted,
        }
      })
    )
  }

  const removeDeliverable = (id: number) => {
    setDeliverables(prev => prev.filter(item => item.id !== id))
  }

  const validateForm = (): boolean => {
    const formData = {
      projectName,
      startDate,
      endDate,
      campaignDescription,
      contactEmail,
      platforms,
      deliverables
    };
    const newErrors = validateCampaignForm(formData)

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }


  return {
    projectName,
    setProjectName,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    campaignDescription,
    setCampaignDescription,
    contactEmail,
    setContactEmail,
    platforms, 
    setPlatforms,
    deliverables,
    setDeliverables,
    updateDeliverable,
    addDeliverable,
    removeDeliverable,
    adjustPrice,
    errors,
    validateForm,
  }
}