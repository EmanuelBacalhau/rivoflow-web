import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets-flow.rivocode.com.br",
      },
      {
        protocol: "https",
        hostname: "assets-dev-flow.rivocode.com.br",
      },
    ],
    qualities: [100, 75],
  },
};

export default nextConfig;
