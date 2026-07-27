import { Deliverable } from "../types/deliverables.types"
import { AddOnItem } from "../components/add-ons/add-ons-form"
import { GiftedProduct } from "../types/payment-terms.types"

export function calculateBaseCreatorFee(
  deliverables: Deliverable[],
  addOns: AddOnItem[],
  exclusivityFee: string,
  hasExclusivity: boolean,
  giftedProducts: GiftedProduct[]
): number {
  const deliverableTotal = deliverables.reduce((sum, d) => {
    return sum + parseFloat(d.pricing.replace(/,/g, '') || '0')
  }, 0)

  const addOnsTotal = addOns.filter((a) => a.isEnabled).reduce((sum, a) => {
    return sum + (a.fee ?? 0)
  }, 0)

  const exclusivityTotal = hasExclusivity
    ? parseFloat(exclusivityFee.replace(/,/g, '') || '0')
    : 0

  const giftedProductsTotal = giftedProducts.reduce((sum, p) => {
    return sum + parseFloat(p.value.replace(/,/g, '') || '0')
  }, 0)

  return deliverableTotal + addOnsTotal + exclusivityTotal + giftedProductsTotal
}