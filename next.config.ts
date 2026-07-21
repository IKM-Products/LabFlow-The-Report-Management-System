// next.config.ts
import type { NextConfig } from "next";

const rawApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.1.109:8082/api";
const API_BASE_URL = rawApiUrl.replace(/\/$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend-api/:path*",
        destination: `${API_BASE_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;