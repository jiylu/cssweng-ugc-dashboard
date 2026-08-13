import { API_BASE_URL } from "@/src/config/api";
import { parseApiError } from "@/src/features/auth/services/users-api";
import {
  authUserSchema,
  type AuthUser,
} from "@/src/features/auth/schemas/auth-user.schema";

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

export async function updateCurrentUser(payload: {
  firstName: string;
  lastName: string;
  middleName: string;
  displayName: string;
  primaryHandle: string;
  bio: string;
  email: string;
  phoneNumber: string;
  timezone: string;
}): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response, "Unable to save profile."));
  }

  const user = authUserSchema.safeParse(await response.json());
  if (!user.success) throw new Error("Unable to validate updated profile.");
  return user.data;
}

async function parseUpdatedUser(response: Response): Promise<AuthUser> {
  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Unable to update profile picture."),
    );
  }

  const user = authUserSchema.safeParse(await response.json());
  if (!user.success) throw new Error("Unable to validate updated profile.");
  return user.data;
}

export async function uploadProfilePicture(file: File): Promise<AuthUser> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/users/me/profile-picture`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return parseUpdatedUser(response);
}

export async function removeProfilePicture(): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/users/me/profile-picture`, {
    method: "DELETE",
    credentials: "include",
  });

  return parseUpdatedUser(response);
}
