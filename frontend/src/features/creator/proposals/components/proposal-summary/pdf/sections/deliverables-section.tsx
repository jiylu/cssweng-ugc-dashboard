import { Text, View } from "@react-pdf/renderer"
import { ProposalSummaryData } from "../../../../types/proposal-summary.types"
import { styles } from "../pdf-styles"
import { formatAddressParts, formatCurrency } from "../pdf-utils"
import { GIFTED_PRODUCT_COLUMN_WIDTHS, LabelValueRow, TermsTable, TermsTableRow } from "../pdf-table"

export function DeliverablesSection({
  summary,
}: {
  summary: ProposalSummaryData
}) {
  const shippingAddress = summary.payment.shippingAddress
    ? formatAddressParts(summary.payment.shippingAddress)
    : ""

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Deliverables &amp; Compensation</Text>
      <TermsTable>
        <TermsTableRow
          head
          cells={["Deliverable", "Format", "Qty", "Due Date", "Post Date", "Fee"]}
        />
        {summary.deliverables.map((d, i) => (
          <TermsTableRow
            key={i}
            last={i === summary.deliverables.length - 1}
            cells={[
              d.deliverable,
              d.format,
              String(d.qty ?? 1),
              d.dueDate || "TBD",
              d.postDate || "TBD",
              formatCurrency(d.price, d.currency),
            ]}
          />
        ))}
      </TermsTable>
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
      <View style={styles.tableFooter}>
        <Text style={styles.tableFooterText}>
          Total ({summary.fees.currency}): {formatCurrency(summary.fees.total, summary.fees.currency)}
        </Text>
      </View>
      <LabelValueRow label="Payment Method" value={summary.payment.method} />
      <LabelValueRow label="Payment Schedule" value={summary.payment.schedule} />
      {shippingAddress ? <LabelValueRow label="Shipping Address" value={shippingAddress} /> : null}
    </View>
  )
}
