import { API_BASE_URL, parseApiError } from "@/src/features/auth/services/users-api";
import { authUserSchema, type AuthUser } from "@/src/features/auth/schemas/auth-user.schema";

export async function getCurrentUser(): Promise<AuthUser | null> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await parseApiError(response, "Unable to load session."));
  }

  const user = authUserSchema.safeParse(await response.json());

  if (!user.success) {
    throw new Error("Unable to validate session user.");
  }

  return user.data;
}

export async function logoutUser() {
  // PROD: Also revoke/invalidate the server-side session record when the backend moves from token-in-cookie to encrypted session ids
  const response = await fetch(`${API_BASE_URL}/users/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response, "Unable to logout."));
  }
}
