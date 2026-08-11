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
  tableCellText: {},
  tableHeadCellText: {
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
    marginBottom: 5,
  },
  termTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
  },
  clauseTitle: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 1,
  },
  termBody: {
    lineHeight: 1.5,
  },
  termBullet: {
    lineHeight: 1.25,
    marginBottom: 1,
    paddingLeft: 9,
    textIndent: -9,
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

function formatAddressParts(addr: ProposalSummaryData["payment"]["shippingAddress"]): string {
  if (!addr) return "—"
  return [addr.addressLine1, addr.addressLine2, addr.city, addr.stateProvince, addr.zipCode, addr.country]
    .filter(Boolean)
    .join(", ")
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

const COLUMN_WIDTHS = [95, 80, 40, 80, 95, 107]
const GIFTED_PRODUCT_COLUMN_WIDTHS = [89, 74, 119, 109, 104]

function TermsTable({ children }: { children: React.ReactNode }) {
  return <View style={styles.table}>{children}</View>
}

function TermsTableRow({
  cells,
  head,
  last,
  widths = COLUMN_WIDTHS,
}: {
  cells: string[]
  head?: boolean
  last?: boolean
  widths?: number[]
}) {
  return (
    <View style={head ? styles.tableHead : last ? styles.tableRowLast : styles.tableRow}>
      {cells.map((cell, i) => (
        <View
          key={i}
          style={[
            styles.tableCell,
            {
              width: widths[i % widths.length],
              flexShrink: 0,
              flexGrow: 0,
              minWidth: 0,
            },
          ]}
        >
          <Text
            hyphenationCallback={(word) =>
              word.length > 15 ? (word.match(/.{1,15}/g) ?? [word]) : [word]
            }
            style={[
              { width: "100%", minWidth: 0 },
              head ? styles.tableHeadCellText : styles.tableCellText,
            ]}
          >
            {cell}
          </Text>
        </View>
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
  const exclusivityText = summary.exclusivity.hasExclusivity
    ? [
        ...(summary.exclusivity.category ? [`Category: ${summary.exclusivity.category}`] : []),
        ...(summary.exclusivity.competitorList ? [`Competitor list: ${summary.exclusivity.competitorList}`] : []),
        ...(summary.exclusivity.territory ? [`Territory: ${summary.exclusivity.territory}`] : []),
        ...(summary.exclusivity.startDate || summary.exclusivity.endDate
          ? [`Period: ${summary.exclusivity.startDate || "TBD"} - ${summary.exclusivity.endDate || "TBD"}`]
          : []),
        ...(summary.exclusivity.fee ? [`Additional exclusivity fee: ${summary.exclusivity.fee}`] : []),
      ].join(". ")
    : ""

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
          <LabelValueRow label="Client" value={summary.campaign.brand} />
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contract Terms</Text>
          <View style={styles.termBlock}>
            <Text style={styles.clauseTitle}>6. Posting Requirements and Disclosure</Text>
            <Text style={styles.termBullet}>
              • Creator will include required tags, mentions, links, promo codes, captions, and hashtags provided by Brand.
            </Text>
            <Text style={styles.termBullet}>
              • Creator will clearly disclose the partnership using appropriate disclosure language, such as {summary.contract.partnershipTags ? summary.contract.partnershipTags : "[#ad / #sponsored / gifted]"}, in accordance with applicable advertising laws, platform rules, and industry guidelines.
            </Text>
            <Text style={styles.termBullet}>
              • Creator will not make false claims, unsupported product claims, or statements that Creator does not honestly believe.
            </Text>
            <Text style={styles.termBullet}>
              • Unless otherwise stated, published posts must remain live for at least {summary.contract.contentRetention} months, subject to normal platform errors, removals, or account issues outside Creator's control.
            </Text>
          </View>
          <View style={styles.termBlock}>
            <Text style={styles.clauseTitle}>7. Exclusivity</Text>
            <Text style={styles.termBullet}>
              • {summary.exclusivity.hasExclusivity && exclusivityText
                ? `Exclusivity applies as follows: ${exclusivityText}.`
                : "No exclusivity applies unless selected as an add-on or stated here. If exclusivity applies, specify category, competitor list, territory, start date, end date, and additional exclusivity fee."}
            </Text>
          </View>
          <View style={styles.termBlock}>
            <Text style={styles.clauseTitle}>8. Expenses, Purchases, and Product Delivery</Text>
            <Text style={styles.termBullet}>
              • Brand will provide any required products, access, discount codes, tickets, or location details needed for the content.
            </Text>
            <Text style={styles.termBullet}>
              • Creator is not required to make out-of-pocket purchases unless approved in writing by both Parties.
            </Text>
            <Text style={styles.termBullet}>
              • Approved expenses must be reimbursed by Brand within {summary.contract.reimbursementDays} days after Creator submits valid receipts.
            </Text>
            <Text style={styles.termBullet}>
              • If gifted products are part of the compensation, any return, resale, damage, warranty, or repayment terms must be clearly listed here: {summary.contract.giftedProductTerms}
            </Text>
          </View>
          <View style={styles.termBlock}>
            <Text style={styles.clauseTitle}>9. Cancellation and Termination</Text>
            <Text style={styles.termBullet}>
              • If Brand cancels after work has begun, Creator may invoice for work completed, time reserved, production costs, and any approved expenses.
            </Text>
            <Text style={styles.termBullet}>
              • If Creator cannot complete the Deliverables due to illness, emergency, shipping delay, product issue, platform issue, or other reasonable cause, the Parties will work in good faith to update the timeline.
            </Text>
            <Text style={styles.termBullet}>
              • Either Party may terminate this Agreement if the other Party materially breaches the Agreement and does not fix the issue within {summary.contract.cancellationDays} days after written notice.
            </Text>
          </View>
          <View style={styles.termBlock}>
            <Text style={styles.clauseTitle}>10. Creator Responsibilities</Text>
            <Text style={styles.termBullet}>
              • Creator confirms that the Deliverables will be original to Creator and will not knowingly infringe third-party rights.
            </Text>
            <Text style={styles.termBullet}>
              • Creator will obtain permission for any third-party music, images, locations, people, or materials used, unless provided or approved by Brand.
            </Text>
            <Text style={styles.termBullet}>
              • Creator will perform the services as an independent contractor, not as an employee, partner, or agent of Brand.
            </Text>
            <Text style={styles.termBullet}>
              • Creator is responsible for Creator's own taxes, filings, insurance, equipment, and business expenses, unless otherwise stated in this Agreement.
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
