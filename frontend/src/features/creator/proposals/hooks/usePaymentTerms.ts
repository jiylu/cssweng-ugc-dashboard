import { useState } from "react"
import { GiftedProduct, PaymentTermsData } from "@/src/features/creator/proposals/types/payment-terms.types"
import { validatePaymentTerms } from "@/src/features/creator/proposals/utils/validators"

export function usePaymentTerms() {
  const [giftedProducts, setGiftedProducts] = useState<GiftedProduct[]>([
    {
      id: 1,
      productName: "",
      value: "0",
      ownershipTerms: "",
      shippingAddress: "",
      deliveryInstructions: "",
    }
  ])
  const [paymentSchedule, setPaymentSchedule] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  function addGiftedProduct() {
    const newId = giftedProducts.length > 0 ? Math.max(...giftedProducts.map(p => p.id)) + 1 : 1
    setGiftedProducts([...giftedProducts, {
      id: newId,
      productName: "",
      value: "0",
      ownershipTerms: "",
      shippingAddress: "",
      deliveryInstructions: "",
    }])
  }

  function removeGiftedProduct(id: number) {
    setGiftedProducts(prev => prev.filter(p => p.id !== id))
  }

  function updateGiftedProduct(id: number, field: keyof GiftedProduct, value: string) {
    setGiftedProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  function buildData(): PaymentTermsData {
    return { giftedProducts, paymentSchedule, paymentMethod }
  }
  function validateForm(): boolean {
    const newErrors = validatePaymentTerms(buildData())
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return {
    giftedProducts,
    addGiftedProduct,
    removeGiftedProduct,
    updateGiftedProduct,
    paymentSchedule,
    setPaymentSchedule,
    paymentMethod,
    setPaymentMethod,
    errors,
    validateForm,
    buildData,
  }
}