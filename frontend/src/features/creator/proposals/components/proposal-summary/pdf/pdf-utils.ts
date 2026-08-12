import { ProposalSummaryData } from "../../../types/proposal-summary.types"

export type PdfShippingAddress = NonNullable<
  ProposalSummaryData["payment"]["shippingAddress"]
>

export function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)
  } catch {
    return `${currency} ${amount.toLocaleString()}`
  }
}

export function formatAgreementDate() {
  const d = new Date()
  const month = d.toLocaleString("en-US", { month: "long" })
  return `${month} ${d.getDate()}, ${d.getFullYear()}`
}

export function formatAddressParts(addr: PdfShippingAddress | null | undefined): string {
  if (!addr) return "—"
  return [addr.addressLine1, addr.addressLine2, addr.city, addr.stateProvince, addr.zipCode, addr.country]
    .filter(Boolean)
    .join(", ")
}
