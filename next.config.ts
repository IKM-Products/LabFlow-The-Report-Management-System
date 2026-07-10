import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://192.168.1.90:8080/api/:path*", // Proxies client requests seamlessly
      },
    ];
  },
};

export default nextConfig;

