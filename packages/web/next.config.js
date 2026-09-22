/** @type {import('next').NextConfig} */
const API_BASE = process.env.NEXT_PUBLIC_KPILY_API_BASE || 'https://kpily-api.azurewebsites.net'

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${API_BASE}/api/:path*`,
        },
        {
          source: '/v1/:path*',
          destination: `${API_BASE}/v1/:path*`,
        },
      ],
    }
  },
}

module.exports = nextConfig