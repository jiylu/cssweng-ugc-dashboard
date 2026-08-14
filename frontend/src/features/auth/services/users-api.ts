import { API_BASE_URL } from "@/src/config/api";
import {
  authUserSchema,
  type AuthUser,
} from "@/src/features/auth/schemas/auth-user.schema";

export type CreateUserPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "CLIENT" | "CREATOR";
  verificationToken: string;
};

export type CreateClientPayload = {
  companyLegalName: string;
  companyEmail: string;
  billablePerson: string;
  contactPerson: string;
  companyContactNumber: string;
  contactPersonContactNumber: string;
};

export type OtpPayload = Pick<CreateUserPayload, "email" | "role">;

export async function requestRegistrationOtp(payload: OtpPayload) {
  const response = await fetch(`${API_BASE_URL}/otps`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await parseApiError(response, "Unable to send verification code."));
  return response.json();
}

export async function validateRegistrationOtp(payload: OtpPayload & { otp: string }) {
  const response = await fetch(`${API_BASE_URL}/otps/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await parseApiError(response, "Unable to verify code."));
  return response.json() as Promise<{ verificationToken: string }>;
}

type GuestOtpPayload = { email: string; proposalPublicId: string };

export async function requestGuestProposalOtp(payload: GuestOtpPayload) {
  const response = await fetch(`${API_BASE_URL}/otps/guest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await parseApiError(response, "Unable to send guest verification code."));
  }
  return response.json();
}

export async function validateGuestProposalOtp(
  payload: GuestOtpPayload & { otp: string },
) {
  const response = await fetch(`${API_BASE_URL}/otps/guest/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await parseApiError(response, "Unable to verify guest access."));
  }
  return response.json();
}

export type LoginUserPayload = {
  email: string;
  password: string;
  rememberMe?: boolean;
  otp?: string;
};

export type LoginUserResponse =
  | { requiresTwoFactor: true; message: string }
  | { requiresTwoFactor: false; user: AuthUser };

export type CreatedUser = Pick<
  AuthUser,
  "user_id" | "email" | "first_name" | "last_name" | "role"
>;

type ApiErrorBody = {
  message?: string | string[];
  code?: string;
  error?: string;
};

export async function parseApiError(response: Response, fallback: string) {
  let body: ApiErrorBody | undefined;

  try {
    body = (await response.json()) as ApiErrorBody;
  } catch {
    body = undefined;
  }

  const message = Array.isArray(body?.message)
    ? body.message.join(" ")
    : body?.message;

  return message ?? body?.error ?? fallback;
}

export async function createUser(
  userDTO: CreateUserPayload,
  clientDTO?: CreateClientPayload,
): Promise<CreatedUser> {
  const payload = { userDTO, clientDTO };

  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await parseApiError(response, "Unable to create account."));
  }
  return response.json() as Promise<CreatedUser>;
}

export async function assignClientToCampaign(
  campaignPublicId: string,
  clientId: string,
) {
  const response = await fetch(
    `${API_BASE_URL}/campaigns/client/${encodeURIComponent(campaignPublicId)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ clientId }),
    },
  );

  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Unable to assign client to campaign."),
    );
  }

  return response.json();
}

export async function loginUser(
  payload: LoginUserPayload,
): Promise<LoginUserResponse> {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response, "Unable to login."));
  }

  const body = (await response.json()) as {
    requiresTwoFactor?: boolean;
    message?: string;
    user?: unknown;
  };
  if (body.requiresTwoFactor) {
    return {
      requiresTwoFactor: true,
      message: body.message ?? "A verification code was sent to your email.",
    };
  }
  const user = authUserSchema.safeParse(body.user);

  if (!user.success) {
    throw new Error("Unable to validate logged-in user.");
  }

  return { requiresTwoFactor: false, user: user.data };
}
