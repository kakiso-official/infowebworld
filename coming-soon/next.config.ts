import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'infowebworld.com' },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    }
  },
  async redirects() {
    return [
      // Redirect old /listing/:slug to /company/:slug
      {
        source: '/listing/:slug',
        destination: '/company/:slug',
        permanent: true,
      },
      // Redirect old /infowebworld/* URLs to /* (except uploads which are proxied)
      {
        source: '/infowebworld/:path((?!uploads/).*)',
        destination: '/:path',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
