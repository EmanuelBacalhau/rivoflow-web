import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const nonce = crypto
    .getRandomValues(new Uint8Array(16))
    .reduce((acc, byte) => acc + byte.toString(16).padStart(2, "0"), "");

  const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://assets-flow.rivocode.com.br https://assets-dev-flow.rivocode.com.br https://lh3.googleusercontent.com;
    media-src 'self' blob: https://assets-flow.rivocode.com.br https://assets-dev-flow.rivocode.com.br;
    connect-src 'self' https://api.flow.rivocode.com.br https://api-dev.flow.rivocode.com.br https://*.amazoncognito.com wss:;
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
