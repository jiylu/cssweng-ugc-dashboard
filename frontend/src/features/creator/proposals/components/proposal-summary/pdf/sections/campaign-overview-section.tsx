import { Text, View } from "@react-pdf/renderer"
import { ProposalSummaryData } from "../../../../types/proposal-summary.types"
import { styles } from "../pdf-styles"
import { LabelValueRow } from "../pdf-table"

export function CampaignOverviewSection({
  summary,
}: {
  summary: ProposalSummaryData
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Campaign Overview</Text>
      <LabelValueRow label="Campaign Name" value={summary.campaign.campaignName} />
      <LabelValueRow label="Client" value={summary.campaign.brand} />
      <LabelValueRow label="Creator" value={summary.campaign.creator} />
      <LabelValueRow label="Campaign Period" value={summary.campaign.period} />
      <LabelValueRow label="Platforms" value={summary.campaign.platforms.join(", ")} />
      <LabelValueRow label="Description" value={summary.campaign.description} />
    </View>
  )
}
