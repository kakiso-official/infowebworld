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
      beforeFiles: [
        // Rewrite /infowebworld/uploads/* to /uploads/* (served from public/)
        {
          source: '/infowebworld/uploads/:path*',
          destination: '/uploads/:path*',
        },
      ],
      afterFiles: [],
      fallback: [],
    }
  },
  async redirects() {
    return [
      // Redirect old /listing/:slug to /company/:slug (proxy will add country prefix)
      {
        source: '/listing/:slug',
        destination: '/company/:slug',
        permanent: true,
      },
      // Country-prefixed listing → company redirect
      {
        source: '/:country(in|uk|ca|au|eu)/listing/:slug',
        destination: '/:country/company/:slug',
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
