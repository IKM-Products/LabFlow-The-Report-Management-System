import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // 🎯 Catch-all proxy for all backend routes (patient, user, billing, etc.)
        // This avoids overlapping or breaking your local NextAuth /api/auth routes
        source: "/backend-api/:path*", 
        destination: "http://192.168.1.90:8080/api/:path*",
      },
    ];
  },
};

export default nextConfig;