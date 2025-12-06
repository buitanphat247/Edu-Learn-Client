import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Rewrites để proxy API requests và tránh CORS
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1611/api";
    
    return [
      {
        source: "/api-proxy/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
