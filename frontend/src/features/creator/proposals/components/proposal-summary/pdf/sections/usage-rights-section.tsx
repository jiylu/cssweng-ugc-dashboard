import { Text, View } from "@react-pdf/renderer"
import { ProposalSummaryData } from "../../../../types/proposal-summary.types"
import { styles } from "../pdf-styles"

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
    </View>
  )
}
