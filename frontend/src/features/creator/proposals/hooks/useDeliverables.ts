import { useState } from "react"
import { Deliverable } from "../types/deliverables.types"
import { adjustPriceValue } from "../utils/formatPrice"

const emptyDeliverable = (id: number): Deliverable => ({
  id,
  deliverableTitle: "",
  description: "",
  deliverableType: "",
  draftDeadline: "",
  pricing: "",
  quantity: "1",
  platform: "",
  contentType: "",
  postDate: "",
})

export function useDeliverables() {
  const [deliverables, setDeliverables] = useState<Deliverable[]>([emptyDeliverable(1)])

  function addDeliverable() {
    const newId = deliverables.length > 0 ? Math.max(...deliverables.map(d => d.id)) + 1 : 1
    setDeliverables(prev => [...prev, emptyDeliverable(newId)])
  }

  function updateDeliverable(id: number, field: keyof Deliverable, value: string) {
    setDeliverables(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  function removeDeliverable(id: number) {
    setDeliverables(prev => prev.filter(item => item.id !== id))
  }

  function adjustPrice(id: number, amount: number) {
    setDeliverables(prev => prev.map(item => {
      if (item.id !== id) return item
      return { ...item, pricing: adjustPriceValue(item.pricing, amount) }
    }))
  }

  return {
    deliverables,
    setDeliverables,
    addDeliverable,
    updateDeliverable,
    removeDeliverable,
    adjustPrice,
  }
}