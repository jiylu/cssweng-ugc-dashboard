import { API_BASE_URL, parseApiError } from "@/lib/users-api";

export type AuthUser = {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
};

export async function getCurrentUser(): Promise<AuthUser | null> {
  // PROD: Keep this endpoint (FOR NOW) in dev, but replace the temporary dashboard behavior with real route middleware/guards once protected pages exist.
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await parseApiError(response, "Unable to load session."));
  }

  return response.json();
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
