import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Explicitly exclude /api/auth from the proxy if you have issues, 
        // though typically this should only proxy your own business API
        source: "/api/user/:path*", 
        destination: "http://192.168.1.90:8080/api/user/:path*",
      },
    ];
  },
};

export default nextConfig;