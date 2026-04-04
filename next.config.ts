import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const assetsHostname = process.env.NEXT_PUBLIC_ASSETS_URL
  ? new URL(process.env.NEXT_PUBLIC_ASSETS_URL).hostname
  : "";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      ...(assetsHostname
        ? [{ protocol: "https" as const, hostname: assetsHostname }]
        : []),
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
    qualities: [100, 75],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
