import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { getCurrentUser } from "@/src/features/auth/services/auth-session"
import { useRouter } from "next/navigation"

export function useAuth(redirectIfUnauthenticated = true) {
  const router = useRouter()

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth-user"],
    queryFn: getCurrentUser,
    staleTime: 60 * 1000,
  })

  useEffect(() => {
    if (!isLoading && !user && redirectIfUnauthenticated) {
      router.replace("/login")
    }
  }, [user, isLoading, redirectIfUnauthenticated, router])

  return { user: user ?? null, loading: isLoading }
}
