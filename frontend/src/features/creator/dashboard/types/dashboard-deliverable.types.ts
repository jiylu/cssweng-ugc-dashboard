export interface DashboardDeliverable {
  public_id: string
  deliverable_content: string
  deliverable_type: "COLLABORATION" | "UGC"
  due_date: string
  post_date: string
  deliverable_status: "PENDING" | "IN_PROGRESS" | "APPROVED" | "DELETED"
}

export interface DeliverableRow {
  campaignPublicId: string
  campaignName: string
  deliverable: DashboardDeliverable
}

export interface DashboardTodo {
  campaignName: string
  message: string
}
