import { Campaign } from "@/src/features/creator/campaigns/types/campaign.types"
import {
  DashboardDeliverable,
  DeliverableRow,
  DashboardTodo,
} from "@/src/features/creator/dashboard/types/dashboard-deliverable.types"

export function buildDeliverableRows(
  campaigns: Campaign[] | undefined,
  deliverablesByCampaign: Record<string, DashboardDeliverable[]>,
): DeliverableRow[] {
  return (campaigns ?? [])
    .filter((campaign) => campaign.campaign_status === "ACTIVE")
    .flatMap((campaign) =>
      (deliverablesByCampaign[campaign.public_id] ?? [])
        .filter((deliverable) => deliverable.deliverable_status !== "DELETED")
        .map((deliverable) => ({
          campaignPublicId: campaign.public_id,
          campaignName: campaign.project_name,
          deliverable,
        })),
    )
    .sort(
      (a, b) =>
        new Date(a.deliverable.due_date).getTime() -
        new Date(b.deliverable.due_date).getTime(),
    )
}

export function buildUpcomingTodos(
  campaigns: Campaign[] | undefined,
  deliverablesByCampaign: Record<string, DashboardDeliverable[]>,
  count = 3,
): DashboardTodo[] {
  const rows = buildDeliverableRows(campaigns, deliverablesByCampaign)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return rows.slice(0, count).map((row) => {
    const dueDate = new Date(row.deliverable.due_date)
    const days = Math.ceil(
      (dueDate.getTime() - today.getTime()) / 86400000,
    )
    const message =
      days < 0
        ? "Overdue."
        : days === 0
          ? "Due today."
          : `Deliverable due in ${days} day${days === 1 ? "" : "s"}.`
    return { campaignName: row.campaignName, message }
  })
}
