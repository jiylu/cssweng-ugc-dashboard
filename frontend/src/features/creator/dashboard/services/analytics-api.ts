import { Analytics } from "@/src/features/creator/dashboard/types/analytics.types"
import { API_BASE_URL } from "@/src/config/api"

export async function getAnalytics(userId: string): Promise<Analytics> {
  const response = await fetch(
    `${API_BASE_URL}/analytics/${userId}`,
    { credentials: "include" }
  )
  if (!response.ok) {
    throw new Error("Failed to fetch analytics")
  }
  return response.json()
}
