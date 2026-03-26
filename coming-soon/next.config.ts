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
      // Rewrites checked before filesystem and redirects
      beforeFiles: [
        // Proxy uploaded images to cPanel server (logos, screenshots)
        {
          source: '/infowebworld/uploads/:path*',
          destination: 'https://infowebworld.com/infowebworld/uploads/:path*',
        },
      ],
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
