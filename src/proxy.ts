import { type NextRequest, NextResponse } from "next/server";
import { AuthTokensManager } from "@/lib/AuthTokenManager";

const PROTECTED_ROUTES = ["/dashboard"];
const AUTH_ROUTES = ["/auth/google", "/auth/callback"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get(
    AuthTokensManager.ACCESS_TOKEN_KEY,
  )?.value;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  const isAuth = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtected && !accessToken) {
    return NextResponse.redirect(new URL("/auth/google", request.url));
  }

  if (isAuth && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
