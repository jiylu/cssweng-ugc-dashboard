import { ProposalSummaryData } from "../../../types/proposal-summary.types"

export type PdfShippingAddress = NonNullable<
  ProposalSummaryData["payment"]["shippingAddress"]
>

export function formatCurrency(amount: number, currency: string) {
  void currency
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
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
