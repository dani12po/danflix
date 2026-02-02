import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  images: {
    domains: ['zeldvorik.ru'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zeldvorik.ru',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
