import { useState } from "react"
import { ShippingAddress } from "@/src/features/creator/proposals/types/payment-terms.types"
import { validateShippingAddress } from "@/src/features/creator/proposals/utils/validators"

const EMPTY_ADDRESS: ShippingAddress = {
  addressLine1: "",
  addressLine2: "",
  country: "",
  stateProvince: "",
  city: "",
  zipCode: "",
}

export function useShippingAddress(initial: ShippingAddress | null) {
  const [form, setForm] = useState<ShippingAddress>(initial ?? EMPTY_ADDRESS)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function update(field: keyof ShippingAddress, val: string) {
    setForm((prev) => ({
      ...prev,
      [field]: val,
      ...(field === "country" ? { stateProvince: "", city: "" } : {}),
      ...(field === "stateProvince" ? { city: "" } : {}),
    }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function reset(initial: ShippingAddress | null) {
    setForm(initial ?? EMPTY_ADDRESS)
    setErrors({})
  }

  function validateAndSave(onSave: (address: ShippingAddress) => void): boolean {
    const newErrors = validateShippingAddress(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      onSave(form)
      return true
    }
    return false
  }

  return {
    form,
    errors,
    update,
    reset,
    validateAndSave,
  }
}
