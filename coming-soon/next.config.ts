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
      // afterFiles runs AFTER checking public/ — static files served first
      afterFiles: [
        // Fallback proxy for uploads not in public/ (legacy cPanel)
        {
          source: '/infowebworld/uploads/:path*',
          destination: 'https://infowebworld.com/infowebworld/uploads/:path*',
        },
      ],
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
