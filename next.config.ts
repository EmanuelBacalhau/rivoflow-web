import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "orion-flow-api-sa-east-1-bucket.s3.sa-east-1.amazonaws.com",
      },
    ],
    qualities: [100, 75],
  },
};

export default nextConfig;
