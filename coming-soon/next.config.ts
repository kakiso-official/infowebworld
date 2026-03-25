import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'infowebworld.com' },
    ],
  },
  async redirects() {
    return [
      // Redirect old /infowebworld/* URLs to /*
      {
        source: '/infowebworld/:path*',
        destination: '/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
