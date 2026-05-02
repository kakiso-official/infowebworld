import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'infowebworld.com' },
      { protocol: 'https', hostname: 'flagcdn.com' },
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
      // ── Country prefixes removed — single global URL space ──
      // /{country}/path/* → /path/* (308 permanent). Uses `:path+` (one-or-more)
      // so /:country alone falls through to middleware, which handles the
      // bare-prefix case (next.config.ts emits an empty Location for '/' destinations).
      {
        source: '/:country(in|us|uk|ca|au|eu|global)/:path+',
        destination: '/:path+',
        permanent: true,
      },

      // Old /plans → /business/plans
      {
        source: '/plans',
        destination: '/business/plans',
        permanent: true,
      },
      // Old /listing/:slug → /company/:slug
      {
        source: '/listing/:slug',
        destination: '/company/:slug',
        permanent: true,
      },
      // /infowebworld/* → /* (except uploads which are proxied)
      {
        source: '/infowebworld/:path((?!uploads/).*)',
        destination: '/:path',
        permanent: true,
      },
      // /category/:slug* → /:slug*
      {
        source: '/category/:path*',
        destination: '/:path*',
        permanent: true,
      },
      // Old AI slug → new short slug
      {
        source: '/artificial-intelligence-ml/:path*',
        destination: '/ai-ml/:path*',
        permanent: true,
      },
      // Rename local-business → local-businesses (L1 sector)
      {
        source: '/local-business',
        destination: '/local-businesses',
        permanent: true,
      },
      {
        source: '/local-business/:path*',
        destination: '/local-businesses/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
