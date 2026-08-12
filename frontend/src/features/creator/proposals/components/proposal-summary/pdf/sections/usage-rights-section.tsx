import { Text, View } from "@react-pdf/renderer"
import { ProposalSummaryData } from "../../../../types/proposal-summary.types"
import { styles } from "../pdf-styles"
import { formatAddressParts, formatCurrency } from "../pdf-utils"
import { GIFTED_PRODUCT_COLUMN_WIDTHS, TermsTable, TermsTableRow } from "../pdf-table"

export function UsageRightsSection({
  summary,
}: {
  summary: ProposalSummaryData
}) {
  const usageRightsText = summary.usageRights.length
    ? summary.usageRights.map((u) => `${u.type} (${u.duration})`).join(", ")
    : "No additional usage rights granted."

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Usage Rights</Text>
      <Text style={styles.termBody}>{usageRightsText}</Text>
      {summary.contract.territory ? <Text style={[styles.termBody, { marginTop: 4 }]}>Territory: {summary.contract.territory}</Text> : null}
      {summary.contract.restrictions ? <Text style={[styles.termBody, { marginTop: 4 }]}>Restrictions: {summary.contract.restrictions}</Text> : null}
      {summary.contract.partnershipTags ? <Text style={[styles.termBody, { marginTop: 4 }]}>Partnership Tags: {summary.contract.partnershipTags}</Text> : null}
      {summary.giftedProducts.length > 0 && (
        <>
          <Text style={[styles.termTitle, { marginTop: 10 }]}>Gifted Products / In-Kind Items</Text>
          <TermsTable>
            <TermsTableRow head widths={GIFTED_PRODUCT_COLUMN_WIDTHS} cells={["Product", "Value", "Delivery Address", "Delivery Instructions", "Ownership Terms"]} />
            {summary.giftedProducts.map((p, i) => (
              <TermsTableRow
                key={i}
                last={i === summary.giftedProducts.length - 1}
                widths={GIFTED_PRODUCT_COLUMN_WIDTHS}
                cells={[
                  p.productName,
                  formatCurrency(parseFloat(p.value.replace(/,/g, "") || "0"), summary.fees.currency),
                  formatAddressParts(p.shippingAddress),
                  p.deliveryInstructions || "—",
                  p.ownershipTerms || "—",
                ]}
              />
            ))}
          </TermsTable>
        </>
      )}
    </View>
  )
}
