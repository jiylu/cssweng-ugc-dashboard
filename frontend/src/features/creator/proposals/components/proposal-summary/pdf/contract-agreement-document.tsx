import { Document, Page, Text, View } from "@react-pdf/renderer"
import { ProposalSummaryData } from "../../../types/proposal-summary.types"
import { styles } from "./pdf-styles"
import { formatAgreementDate } from "./pdf-utils"
import { CampaignOverviewSection } from "./sections/campaign-overview-section"
import { DeliverablesSection } from "./sections/deliverables-section"
import { UsageRightsSection } from "./sections/usage-rights-section"
import { ContractTermsSection } from "./sections/contract-terms-section"
import { SignaturesSection } from "./sections/signatures-section"

export function ContractAgreementDocument({
  summary,
}: {
  summary: ProposalSummaryData
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
          <Text style={styles.title}>Influencer Collaboration Agreement</Text>
          <Text style={styles.subtitle}>
            Made this {formatAgreementDate()} by and between the undersigned parties.
          </Text>
        </View>

        <CampaignOverviewSection summary={summary} />
        <DeliverablesSection summary={summary} />
        <UsageRightsSection summary={summary} />
        <ContractTermsSection summary={summary} />
        <SignaturesSection summary={summary} />

        <View style={styles.footer} fixed>
          <Text>Influencer Collaboration Agreement</Text>
          <Text>Page {""}</Text>
        </View>
      </Page>
    </Document>
  )
}
