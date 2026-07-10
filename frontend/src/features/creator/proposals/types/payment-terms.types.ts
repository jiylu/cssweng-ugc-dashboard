export interface GiftedProduct {
  id: number
  productName: string
  value: string
  ownershipTerms: string
  shippingAddress: string
  deliveryInstructions: string
}

export interface PaymentTermsData {
  giftedProducts: GiftedProduct[]
  paymentSchedule: string
  paymentMethod: string
  taxRate: number
}