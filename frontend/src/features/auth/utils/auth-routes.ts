import type { AuthUser } from "@/src/features/auth/schemas/auth-user.schema";

export const LOGIN_ROUTE = "/login";

export function getAuthenticatedHomeRoute(user?: Pick<AuthUser, "role"> | null) {
  if (user?.role === "CLIENT") {
    return "/dashboard";
  }

  return "/creator-dashboard";
}
