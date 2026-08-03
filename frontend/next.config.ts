import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Route all /backend/... calls through the Next.js proxy route.
  // The proxy injects the auth token (real mode) or serves mock data (MOCK_API=true).
  // In production, configure your reverse proxy (nginx/ALB) for /backend paths instead.
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: "/api/proxy/:path*",
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
    ],
  },
}

export default nextConfig
