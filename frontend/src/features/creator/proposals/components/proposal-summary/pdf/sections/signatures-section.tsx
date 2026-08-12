import { Text, View } from "@react-pdf/renderer"
import { ProposalSummaryData } from "../../../../types/proposal-summary.types"
import { styles } from "../pdf-styles"

export function SignaturesSection({
  summary,
}: {
  summary: ProposalSummaryData
}) {
  return (
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
  )
}
