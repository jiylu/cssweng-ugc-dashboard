import { Notification } from "@/src/features/notifications/types/notification.types"
import { API_BASE_URL } from "@/src/config/api"

export async function getNotifications(userId: string, limit?: number): Promise<Notification[]> {
  const params = new URLSearchParams({ userId })
  if (limit) params.set("limit", String(limit))

  const response = await fetch(
    `${API_BASE_URL}/notifications?${params}`,
    { credentials: "include" }
  )
  if (!response.ok) {
    throw new Error("Failed to fetch notifications")
  }
  return response.json()
}

export async function markNotificationAsRead(notificationId: string): Promise<Notification> {
  const response = await fetch(
    `${API_BASE_URL}/notifications/read-notification/${notificationId}`,
    { method: "POST", credentials: "include" }
  )
  if (!response.ok) {
    throw new Error("Failed to mark notification as read")
  }
  return response.json()
}
