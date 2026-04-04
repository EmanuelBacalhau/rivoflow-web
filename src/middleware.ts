import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const nonce = crypto
    .getRandomValues(new Uint8Array(16))
    .reduce((acc, byte) => acc + byte.toString(16).padStart(2, "0"), "");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const assetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL;
  const oauthUrl = process.env.NEXT_PUBLIC_OAUTH_AUTHORIZATION_URL;
  const oauthOrigin = oauthUrl ? new URL(oauthUrl).origin : "";

  const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: ${assetsUrl} https://lh3.googleusercontent.com;
    media-src 'self' blob: ${assetsUrl};
    connect-src 'self' ${apiUrl} ${assetsUrl} ${oauthOrigin} https://*.s3.sa-east-1.amazonaws.com wss:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|logo.png|open-graph.png).*)",
      missing: [{ type: "header", key: "next-action" }],
    },
  ],
};
