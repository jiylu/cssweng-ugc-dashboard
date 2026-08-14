import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  authUserSchema,
  type AuthUser,
} from "@/src/features/auth/schemas/auth-user.schema";
import {
  getAuthenticatedHomeRoute,
  LOGIN_ROUTE,
} from "@/src/features/auth/utils/auth-routes";

const AUTH_COOKIE_NAME = "ugc_auth_session";
const DEFAULT_API_URL = "http://localhost:8080";

type ValidSession =
  | { isAuthenticated: true; setCookie: string | null; user: AuthUser }
  | { isAuthenticated: false; setCookie: null; user: null };

const protectedRoutes: Array<{
  path: string;
  roles: AuthUser["role"][];
}> = [
  { path: "/dashboard", roles: ["CLIENT"] },
  { path: "/creator-dashboard", roles: ["CREATOR"] },
  { path: "/campaigns", roles: ["CREATOR"] },
  { path: "/workspace", roles: ["CREATOR"] },
  { path: "/client-workspace", roles: ["CLIENT"] },
  { path: "/proposals", roles: ["CLIENT"] },
  { path: "/contracts", roles: ["CLIENT"] },
  { path: "/calendar", roles: ["CREATOR"] },
  { path: "/settings", roles: ["CLIENT", "CREATOR"] },
];

const guestOnlyRoutes = [
  LOGIN_ROUTE,
  "/creator-register",
  "/client-register",
  "/forgot-password",
  "/reset-password",
];

function getApiBaseUrl() {
  const configuredUrl =
    process.env.INTERNAL_API_URL?.replace(/\/$/, "") ?? DEFAULT_API_URL;

  return configuredUrl.endsWith("/api")
    ? configuredUrl
    : `${configuredUrl}/api`;
}

function isRouteMatch(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function getProtectedRoute(pathname: string) {
  return protectedRoutes.find(
    ({ path }) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

function redirectTo(request: NextRequest, route: string) {
  return NextResponse.redirect(new URL(route, request.url));
}

function clearAuthCookie(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });

  return response;
}

function forwardAuthCookieRefresh(
  response: NextResponse,
  setCookie: string | null,
) {
  if (setCookie) {
    response.headers.set("Set-Cookie", setCookie);
  }

  return response;
}

async function validateSession(request: NextRequest): Promise<ValidSession> {
  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) {
    return { isAuthenticated: false, setCookie: null, user: null };
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/users/me`, {
      headers: {
        cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return { isAuthenticated: false, setCookie: null, user: null };
    }

    const user = authUserSchema.safeParse(await response.json());

    if (!user.success) {
      return { isAuthenticated: false, setCookie: null, user: null };
    }

    return {
      isAuthenticated: true,
      setCookie: response.headers.get("set-cookie"),
      user: user.data,
    };
  } catch {
    return { isAuthenticated: false, setCookie: null, user: null };
  }
}

export async function handleAuthMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedRoute = getProtectedRoute(pathname);
  const isProtectedRoute = Boolean(protectedRoute);
  const isGuestOnlyRoute = isRouteMatch(pathname, guestOnlyRoutes);

  if (!isProtectedRoute && !isGuestOnlyRoute) {
    return NextResponse.next();
  }

  const hasAuthCookie = request.cookies.has(AUTH_COOKIE_NAME);

  if (!hasAuthCookie) {
    return isProtectedRoute
      ? redirectTo(request, LOGIN_ROUTE)
      : NextResponse.next();
  }

  const session = await validateSession(request);

  if (!session.isAuthenticated) {
    const response = isProtectedRoute
      ? redirectTo(request, LOGIN_ROUTE)
      : NextResponse.next();

    return clearAuthCookie(response);
  }

  const response = isGuestOnlyRoute
    ? redirectTo(request, getAuthenticatedHomeRoute(session.user))
    : protectedRoute && !protectedRoute.roles.includes(session.user.role)
      ? redirectTo(request, getAuthenticatedHomeRoute(session.user))
      : NextResponse.next();

  return forwardAuthCookieRefresh(response, session.setCookie);
}
