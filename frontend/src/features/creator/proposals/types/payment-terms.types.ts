export interface ShippingAddress {
  addressLine1: string
  addressLine2: string
  country: string
  stateProvince: string
  city: string
  zipCode: string
}

export interface GiftedProduct {
  id: number
  dbId?: string
  productName: string
  value: string
  ownershipTerms: string
  shippingAddress: ShippingAddress | null
  deliveryInstructions: string
}

export interface PaymentTermsData {
  giftedProducts: GiftedProduct[]
  paymentSchedule: string
  paymentMethod: string
  taxRate: number
}