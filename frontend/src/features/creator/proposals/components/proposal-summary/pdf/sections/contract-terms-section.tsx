import type { ReactNode } from "react"
import { Text, View } from "@react-pdf/renderer"
import { ProposalSummaryData } from "../../../../types/proposal-summary.types"
import { styles } from "../pdf-styles"

function ClauseBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.termBlock}>
      <Text style={styles.clauseTitle}>{title}</Text>
      {children}
    </View>
  )
}

function ClauseBullet({ children }: { children: ReactNode }) {
  return <Text style={styles.termBullet}>• {children}</Text>
}

export function ContractTermsSection({
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

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Contract Terms</Text>
      <ClauseBlock title="6. Posting Requirements and Disclosure">
        <ClauseBullet>
          Creator will include required tags, mentions, links, promo codes, captions, and hashtags provided by Brand.
        </ClauseBullet>
        <ClauseBullet>
          Creator will clearly disclose the partnership using appropriate disclosure language, such as {summary.contract.partnershipTags ? summary.contract.partnershipTags : "[#ad / #sponsored / gifted]"}, in accordance with applicable advertising laws, platform rules, and industry guidelines.
        </ClauseBullet>
        <ClauseBullet>
          Creator will not make false claims, unsupported product claims, or statements that Creator does not honestly believe.
        </ClauseBullet>
        <ClauseBullet>
          Unless otherwise stated, published posts must remain live for at least {summary.contract.contentRetention} months, subject to normal platform errors, removals, or account issues outside Creator&apos;s control.
        </ClauseBullet>
      </ClauseBlock>
      <ClauseBlock title="7. Exclusivity">
        <ClauseBullet>
          {summary.exclusivity.hasExclusivity && exclusivityText
            ? `Exclusivity applies as follows: ${exclusivityText}.`
            : "No exclusivity applies unless selected as an add-on or stated here. If exclusivity applies, specify category, competitor list, territory, start date, end date, and additional exclusivity fee."}
        </ClauseBullet>
      </ClauseBlock>
      <ClauseBlock title="8. Expenses, Purchases, and Product Delivery">
        <ClauseBullet>
          Brand will provide any required products, access, discount codes, tickets, or location details needed for the content.
        </ClauseBullet>
        <ClauseBullet>
          Creator is not required to make out-of-pocket purchases unless approved in writing by both Parties.
        </ClauseBullet>
        <ClauseBullet>
          Approved expenses must be reimbursed by Brand within {summary.contract.reimbursementDays} days after Creator submits valid receipts.
        </ClauseBullet>
        <ClauseBullet>
          If gifted products are part of the compensation, any return, resale, damage, warranty, or repayment terms must be clearly listed here: {summary.contract.giftedProductTerms}
        </ClauseBullet>
      </ClauseBlock>
      <ClauseBlock title="9. Cancellation and Termination">
        <ClauseBullet>
          If Brand cancels after work has begun, Creator may invoice for work completed, time reserved, production costs, and any approved expenses.
        </ClauseBullet>
        <ClauseBullet>
          If Creator cannot complete the Deliverables due to illness, emergency, shipping delay, product issue, platform issue, or other reasonable cause, the Parties will work in good faith to update the timeline.
        </ClauseBullet>
        <ClauseBullet>
          Either Party may terminate this Agreement if the other Party materially breaches the Agreement and does not fix the issue within {summary.contract.cancellationDays} days after written notice.
        </ClauseBullet>
      </ClauseBlock>
      <ClauseBlock title="10. Creator Responsibilities">
        <ClauseBullet>
          Creator confirms that the Deliverables will be original to Creator and will not knowingly infringe third-party rights.
        </ClauseBullet>
        <ClauseBullet>
          Creator will obtain permission for any third-party music, images, locations, people, or materials used, unless provided or approved by Brand.
        </ClauseBullet>
        <ClauseBullet>
          Creator will perform the services as an independent contractor, not as an employee, partner, or agent of Brand.
        </ClauseBullet>
        <ClauseBullet>
          Creator is responsible for Creator&apos;s own taxes, filings, insurance, equipment, and business expenses, unless otherwise stated in this Agreement.
        </ClauseBullet>
      </ClauseBlock>
    </View>
  )
}
