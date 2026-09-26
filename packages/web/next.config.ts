import type { NextConfig } from 'next'

const API_BASE = process.env.NEXT_PUBLIC_KPILY_API_BASE || 'https://kpapis-cac9fhczeadxbvhm.uksouth-01.azurewebsites.net'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/api/:path*', destination: `${API_BASE}/api/:path*` },
        { source: '/v1/:path*', destination: `${API_BASE}/v1/:path*` },
      ],
      afterFiles: [],
      fallback: [],
    }
  },
}

export default nextConfig
