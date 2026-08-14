import { useState } from "react"
import { GiftedProduct, PaymentTermsData, ShippingAddress } from "@/src/features/creator/proposals/types/payment-terms.types"
import { validatePaymentTerms } from "@/src/features/creator/proposals/utils/validators"

export function usePaymentTerms() {
  const [giftedProducts, setGiftedProducts] = useState<GiftedProduct[]>([
    {
      id: 1,
      productName: "",
      value: "",
      ownershipTerms: "",
      shippingAddress: null,
      deliveryInstructions: "",
    }
  ])
  const [paymentSchedule, setPaymentSchedule] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [taxRate, setTaxRate] = useState(10)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function addGiftedProduct() {
    const newId = giftedProducts.length > 0 ? Math.max(...giftedProducts.map(p => p.id)) + 1 : 1
    setGiftedProducts([...giftedProducts, {
      id: newId,
      productName: "",
      value: "",
      ownershipTerms: "",
      shippingAddress: null,
      deliveryInstructions: "",
    }])
  }

  function removeGiftedProduct(id: number) {
    setGiftedProducts(prev => prev.filter(p => p.id !== id))
  }

  function updateGiftedProduct(id: number, field: keyof GiftedProduct, value: string | ShippingAddress | null) {
    setGiftedProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  function buildData(): PaymentTermsData {
    return { giftedProducts, paymentSchedule, paymentMethod, taxRate }
  }
  function validateForm(): boolean {
    const newErrors = validatePaymentTerms(buildData())
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return {
    giftedProducts,
    setGiftedProducts,
    addGiftedProduct,
    removeGiftedProduct,
    updateGiftedProduct,
    paymentSchedule,
    setPaymentSchedule,
    paymentMethod,
    setPaymentMethod,
    taxRate,
    setTaxRate,
    errors,
    validateForm,
    buildData,
  }
}