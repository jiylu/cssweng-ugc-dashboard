import type { NextRequest } from "next/server";
import { handleAuthMiddleware } from "@/src/features/auth/services/auth-middleware";

export async function proxy(request: NextRequest) {
  return handleAuthMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
