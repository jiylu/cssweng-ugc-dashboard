import { useEffect, useState } from "react";
import { getCurrentUser, AuthUser } from "@/lib/auth-session";
import { useRouter } from "next/navigation";

export function useAuth(redirectIfUnauthenticated = true) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        if (!user && redirectIfUnauthenticated) {
          router.replace("/login");
          return;
        }
        setUser(user);
      })
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}