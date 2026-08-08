import { Document, Page, PDFViewer, StyleSheet, Text, View } from "@react-pdf/renderer"
import { ProposalSummaryData } from "../../types/proposal-summary.types"

interface ContractAgreementPreviewProps {
  summary: ProposalSummaryData
}

const BRAND_COLOR = "#6b1fa8"
const MUTED_COLOR = "#78746e"
const BORDER_COLOR = "#d8d4cb"

const styles = StyleSheet.create({
  viewer: {
    width: "100%",
    height: "100%",
    border: "none",
  },
  page: {
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 48,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#2f2d2a",
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: BRAND_COLOR,
    paddingBottom: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: BRAND_COLOR,
  },
  subtitle: {
    fontSize: 10,
    color: MUTED_COLOR,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: BRAND_COLOR,
    marginBottom: 8,
  },
  section: {
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
  },
  label: {
    width: 130,
    color: MUTED_COLOR,
  },
  value: {
    flex: 1,
  },
  textRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  table: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  tableRowLast: {
    flexDirection: "row",
  },
  tableHead: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
    backgroundColor: "#faf9f6",
  },
  tableCell: {
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  tableHeadCell: {
    paddingVertical: 5,
    paddingHorizontal: 6,
    fontWeight: "bold",
    color: "#5f5a53",
  },
  tableFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 6,
  },
  tableFooterText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  termBlock: {
    marginBottom: 8,
  },
  termTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
  },
  termBody: {
    lineHeight: 1.5,
  },
  signatureRow: {
    flexDirection: "row",
    marginTop: 28,
  },
  signatureCol: {
    flex: 1,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#2f2d2a",
    marginTop: 8,
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 8,
    color: MUTED_COLOR,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
    paddingTop: 8,
    fontSize: 8,
    color: MUTED_COLOR,
  },
})

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)
  } catch {
    return `${currency} ${amount.toLocaleString()}`
  }
}

function formatAgreementDate() {
  const d = new Date()
  const month = d.toLocaleString("en-US", { month: "long" })
  return `${month} ${d.getDate()}, ${d.getFullYear()}`
}

function LabelValueRow({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <View style={styles.textRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  )
}

function TermsTable({ children }: { children: React.ReactNode }) {
  return <View style={styles.table}>{children}</View>
}

function TermsTableRow({
  cells,
  head,
  last,
}: {
  cells: string[]
  head?: boolean
  last?: boolean
}) {
  return (
    <View style={head ? styles.tableHead : last ? styles.tableRowLast : styles.tableRow}>
      {cells.map((cell, i) => (
        <Text
          key={i}
          style={[
            head ? styles.tableHeadCell : styles.tableCell,
            {
              width: i === 0 ? "22%" : i === 1 ? "30%" : i === 2 ? "18%" : "30%",
            },
          ]}
        >
          {cell}
        </Text>
      ))}
    </View>
  )
}

export function ContractAgreementPreview({ summary }: ContractAgreementPreviewProps) {
  return (
    <PDFViewer style={styles.viewer}>
      <ContractAgreementDocument summary={summary} />
    </PDFViewer>
  )
}

export function ContractAgreementDocument({
  summary,
}: {
  summary: ProposalSummaryData
}) {
  const exclusivity = summary.exclusivity.hasExclusivity
    ? [
        ...(summary.exclusivity.category ? [`Category: ${summary.exclusivity.category}`] : []),
        ...(summary.exclusivity.territory ? [`Territory: ${summary.exclusivity.territory}`] : []),
        ...(summary.exclusivity.startDate || summary.exclusivity.endDate
          ? [`Period: ${summary.exclusivity.startDate || "TBD"} - ${summary.exclusivity.endDate || "TBD"}`]
          : []),
        ...(summary.exclusivity.competitorList ? [`Competitors: ${summary.exclusivity.competitorList}`] : []),
      ].join(". ")
    : "No exclusivity applies."

  const usageRightsText = summary.usageRights.length
    ? summary.usageRights.map((u) => `${u.type} (${u.duration})`).join(", ")
    : "No additional usage rights granted."

  const shippingAddress = summary.payment.shippingAddress
    ? [summary.payment.shippingAddress.addressLine1, summary.payment.shippingAddress.addressLine2, summary.payment.shippingAddress.city, summary.payment.shippingAddress.stateProvince, summary.payment.shippingAddress.zipCode, summary.payment.shippingAddress.country]
        .filter(Boolean)
        .join(", ")
    : ""

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
          <Text style={styles.title}>Influencer Collaboration Agreement</Text>
          <Text style={styles.subtitle}>
            Made this {formatAgreementDate()} by and between the undersigned parties.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Campaign Overview</Text>
          <LabelValueRow label="Campaign Name" value={summary.campaign.campaignName} />
          <LabelValueRow label="Brand" value={summary.campaign.brand} />
          <LabelValueRow label="Creator" value={summary.campaign.creator} />
          <LabelValueRow label="Campaign Period" value={summary.campaign.period} />
          <LabelValueRow label="Platforms" value={summary.campaign.platforms.join(", ")} />
          <LabelValueRow label="Description" value={summary.campaign.description} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deliverables &amp; Compensation</Text>
          <TermsTable>
            <TermsTableRow
              head
              cells={["Deliverable", "Format", "Due Date", "Fee"]}
            />
            {summary.deliverables.map((d, i) => (
              <TermsTableRow
                key={i}
                last={i === summary.deliverables.length - 1}
                cells={[
                  d.deliverable,
                  d.format,
                  d.dueDate || "TBD",
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Usage Rights</Text>
          <Text style={styles.termBody}>{usageRightsText}</Text>
          {summary.contract.territory ? <Text style={[styles.termBody, { marginTop: 4 }]}>Territory: {summary.contract.territory}</Text> : null}
          {summary.contract.restrictions ? <Text style={[styles.termBody, { marginTop: 4 }]}>Restrictions: {summary.contract.restrictions}</Text> : null}
          {summary.contract.partnershipTags ? <Text style={[styles.termBody, { marginTop: 4 }]}>Partnership Tags: {summary.contract.partnershipTags}</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contract Terms</Text>
          <View style={styles.termBlock}>
            <Text style={styles.termTitle}>Revision Policy</Text>
            <Text style={styles.termBody}>
              {summary.creativeDirection.revisionRounds} round(s) of revisions within {summary.creativeDirection.revisionDays} days of submission.
            </Text>
          </View>
          <View style={styles.termBlock}>
            <Text style={styles.termTitle}>Auto Approval</Text>
            <Text style={styles.termBody}>
              Content is automatically approved after {summary.creativeDirection.feedbackDays} business days if no feedback is provided.
            </Text>
          </View>
          <View style={styles.termBlock}>
            <Text style={styles.termTitle}>Cancellation</Text>
            <Text style={styles.termBody}>
              {summary.contract.cancellationDays}-day notice required before the campaign start date for full refund/cancellation without penalty.
            </Text>
          </View>
          {summary.contract.reimbursementDays > 0 && (
            <View style={styles.termBlock}>
              <Text style={styles.termTitle}>Reimbursement</Text>
              <Text style={styles.termBody}>
                Expenses are reimbursed within {summary.contract.reimbursementDays} days. {summary.contract.giftedProductTerms ? summary.contract.giftedProductTerms : ""}
              </Text>
            </View>
          )}
          <View style={styles.termBlock}>
            <Text style={styles.termTitle}>Exclusivity</Text>
            <Text style={styles.termBody}>{exclusivity}</Text>
          </View>
          <View style={styles.termBlock}>
            <Text style={styles.termTitle}>General Terms</Text>
            <Text style={styles.termBody}>
              This Agreement shall be governed by the laws of {summary.contract.governingLaw || "the agreed jurisdiction"}, and disputes shall be resolved in {summary.contract.disputeLocation || "the agreed venue"}. {summary.contract.extraNotes ? summary.contract.extraNotes : ""}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Signatures</Text>
          <Text style={styles.termBody}>
            By signing below, both parties agree to the terms and conditions set forth in this Influencer Collaboration Agreement.
          </Text>
          <View style={styles.signatureRow}>
            <View style={styles.signatureCol}>
              <Text style={styles.termTitle}>Brand / Client</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>{summary.campaign.brand}</Text>
            </View>
            <View style={[styles.signatureCol, { marginLeft: 32 }]}>
              <Text style={styles.termTitle}>Creator</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>{summary.campaign.creator}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>Influencer Collaboration Agreement</Text>
          <Text>Page {""}</Text>
        </View>
      </Page>
    </Document>
  )
}
