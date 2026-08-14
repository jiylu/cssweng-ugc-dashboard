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

export function formatDueIn(dueDate: string): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dueDate)
  const days = Math.ceil(
    (target.getTime() - today.getTime()) / 86400000,
  )
  if (days < 0) return "Overdue"
  if (days === 0) return "Due today"
  return `Due in ${days} day${days === 1 ? "" : "s"}`
}

export function buildUpcomingTodos(
  campaigns: Campaign[] | undefined,
  deliverablesByCampaign: Record<string, DashboardDeliverable[]>,
  count = 3,
): DashboardTodo[] {
  const rows = buildDeliverableRows(campaigns, deliverablesByCampaign)

  return rows.slice(0, count).map((row) => {
    const label = formatDueIn(row.deliverable.due_date).toLowerCase()
    const message =
      label === "overdue" || label === "due today"
        ? `${label.charAt(0).toUpperCase()}${label.slice(1)}.`
        : `Deliverable ${label}.`
    return { campaignName: row.campaignName, message }
  })
}
