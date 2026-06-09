export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "/api";

export type CreateUserPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "CLIENT" | "CREATOR";
};

export type LoginUserPayload = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type LoginUserResponse = {
  user: {
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
};

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

export async function createUser(payload: CreateUserPayload) {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response, "Unable to create account."));
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

  return response.json();
}
