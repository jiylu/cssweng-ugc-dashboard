import { Text, View } from "@react-pdf/renderer"
import { ProposalSummaryData } from "../../../../types/proposal-summary.types"
import { styles } from "../pdf-styles"
import { formatAddressParts, formatCurrency } from "../pdf-utils"
import { LabelValueRow, TermsTable, TermsTableRow } from "../pdf-table"

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
      {summary.addOns.length > 0 && (
        <View style={{ marginTop: 6 }}>
          <Text style={styles.termTitle}>Add-ons</Text>
          {summary.addOns.map((a, i) => (
            <View key={i} style={styles.textRow}>
              <Text style={styles.value}>- {a.title}</Text>
              <Text>{formatCurrency(a.fee, summary.earnings.currency)}</Text>
            </View>
          ))}
        </View>
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
