export const AUTH_COOKIE_NAME = 'ugc_auth_session';

const THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30;

export type AuthCookiePayload = {
  accessToken: string;
  refreshToken: string;
  rememberMe: boolean;
};

function getSecureCookieAttribute() {
  // TODO: Once in prod, make this unconditional so auth cookies are always sent with the Secure flag.
  return process.env.NODE_ENV === 'production' ? '; Secure' : '';
}

export function serializeAuthCookie(
  payload: AuthCookiePayload,
  rememberMe: boolean,
) {
  const maxAge = rememberMe ? `; Max-Age=${THIRTY_DAYS_SECONDS}` : '';
  // TODO: Keep an encrypted cookie value instead of the actual session data stored server-side
  const value = encodeURIComponent(JSON.stringify(payload));

  return `${AUTH_COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Lax${getSecureCookieAttribute()}${maxAge}`;
}

export function serializeExpiredAuthCookie() {
  // TODO: Keep this Secure behavior matched with serializeAuthCookie.
  return `${AUTH_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax${getSecureCookieAttribute()}; Max-Age=0`;
}

export function parseAuthCookie(cookieHeader?: string): AuthCookiePayload | null {
  const rawCookie = cookieHeader
    ?.split('; ')
    .find((cookie) => cookie.startsWith(`${AUTH_COOKIE_NAME}=`));

  if (!rawCookie) {
    return null;
  }

  try {
    return JSON.parse(
      decodeURIComponent(rawCookie.split('=').slice(1).join('=')),
    ) as AuthCookiePayload;
  } catch {
    return null;
  }
}
