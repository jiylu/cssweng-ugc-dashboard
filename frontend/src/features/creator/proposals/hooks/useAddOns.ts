import { useState } from "react"
import { AddOnItem } from "@/src/features/creator/proposals/types/add-on.types"
import { DEFAULT_ADD_ONS } from "@/src/features/creator/proposals/utils/defaultAddOns"
import { validateAddOns } from "@/src/features/creator/proposals/utils/validators"

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

export function useAddOns() {
  const [addOns, setAddOns] = useState<AddOnItem[]>(DEFAULT_ADD_ONS)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function toggleAddOn(id: string) {
    setAddOns((prev) =>
      prev.map((a) => a.id === id ? { ...a, isEnabled: !a.isEnabled } : a)
    )
  }

  function addCustom() {
    setAddOns((prev) => [
      ...prev,
      {
        id: generateId(),
        title: "",
        desc: "",
        fee: 0,
        isPermanent: false,
        isEnabled: true,
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
    const enabledAddOns = addOns.filter((a) => a.isEnabled)
    const rawErrors = validateAddOns({ addOns: enabledAddOns })

    const newErrors: Record<string, string> = {}
    for (const [key, value] of Object.entries(rawErrors)) {
      const match = key.match(/^addOns\.(\d+)\.(.+)$/)
      if (match) {
        const filteredIndex = parseInt(match[1])
        const field = match[2]
        const originalIndex = addOns.indexOf(enabledAddOns[filteredIndex])
        if (originalIndex !== -1) {
          newErrors[`addOns.${originalIndex}.${field}`] = value
        }
      } else {
        newErrors[key] = value
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return { 
    addOns, 
    addCustom, 
    toggleAddOn,
    removeAddOn, 
    adjustPrice, 
    updateAddOn,
    errors,
    validateForm 
  }
}