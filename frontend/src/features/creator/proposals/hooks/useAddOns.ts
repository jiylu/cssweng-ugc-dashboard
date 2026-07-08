import { useState } from "react"
import { AddOnItem } from "../components/add-ons/add-ons-form"
import { validateAddOns } from "../utils/validators"

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

export function useAddOns() {
  const [addOns, setAddOns] = useState<AddOnItem[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  function addCustom() {
    setAddOns((prev) => [
      ...prev,
      {
        id: generateId(),
        title: "",
        desc: "",
        fee: 0,
      },
    ])
  }

  function removeAddOn(id: string) {
    setAddOns((prev) => prev.filter((a) => a.id !== id))
  }

  function adjustPrice(id: string, amount: number) {
    setAddOns((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, fee: Math.max(0, (a.fee ?? 0) + amount) } : a
      )
    )
  }

  function updateAddOn(id: string, field: keyof AddOnItem, value: string | number) {
    setAddOns((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    )
  }

  function validateForm(): boolean {
    const newErrors = validateAddOns({ addOns })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
    }

  return { 
            addOns, 
            addCustom, 
            removeAddOn, 
            adjustPrice, 
            updateAddOn,
            errors,
            validateForm 
        }
}