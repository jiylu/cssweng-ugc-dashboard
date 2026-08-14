import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getNotifications, markNotificationAsRead } from "@/src/features/notifications/services/notifications-api"
import { useAuth } from "@/src/features/auth/hooks/useAuth"

export function useNotifications(limit?: number) {
  const { user } = useAuth(false)

  return useQuery({
    queryKey: ["notifications", user?.user_id, limit],
    queryFn: () => getNotifications(user!.user_id, limit),
    enabled: !!user?.user_id,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}
