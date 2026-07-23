import { useQuery } from "@tanstack/react-query"
import { getAnalytics } from "@/src/features/creator/dashboard/services/analytics-api"
import { useAuth } from "@/src/features/auth/hooks/useAuth"

export function useAnalytics() {
  const { user } = useAuth(false)

  return useQuery({
    queryKey: ["analytics", user?.user_id],
    queryFn: () => getAnalytics(user!.user_id),
    enabled: !!user?.user_id,
  })
}
