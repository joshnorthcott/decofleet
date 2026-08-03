import type { NextConfig } from "next"

const nextConfig: NextConfig = {
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
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
