import { API_BASE_URL } from "@/src/config/api";
import { parseApiError } from "@/src/features/auth/services/users-api";

export interface AccountSettings {
  two_factor_enabled: boolean;
  email_proposal_updates: boolean;
  email_contract_updates: boolean;
  email_deliverable_updates: boolean;
  email_payment_updates: boolean;
}

export type UpdateAccountSettings = Partial<{
  twoFactorEnabled: boolean;
  emailProposalUpdates: boolean;
  emailContractUpdates: boolean;
  emailDeliverableUpdates: boolean;
  emailPaymentUpdates: boolean;
}>;

export async function getAccountSettings(): Promise<AccountSettings> {
  const response = await fetch(`${API_BASE_URL}/users/me/settings`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(await parseApiError(response, "Unable to load settings."));
  }
  return response.json();
}

export async function updateAccountSettings(
  payload: UpdateAccountSettings,
): Promise<AccountSettings> {
  const response = await fetch(`${API_BASE_URL}/users/me/settings`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await parseApiError(response, "Unable to save settings."));
  }
  return response.json();
}

export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/users/me/password`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await parseApiError(response, "Unable to change password."));
  }
  return response.json();
}
