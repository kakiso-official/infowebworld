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
      // Redirect old /plans to /business/plans
      {
        source: '/plans',
        destination: '/business/plans',
        permanent: true,
      },
      // Country-prefixed /plans → /business/plans
      {
        source: '/:country(in|us|uk|ca|au|eu)/plans',
        destination: '/:country/business/plans',
        permanent: true,
      },
      // Redirect old /listing/:slug to /company/:slug (proxy will add country prefix)
      {
        source: '/listing/:slug',
        destination: '/company/:slug',
        permanent: true,
      },
      // Country-prefixed listing → company redirect
      {
        source: '/:country(in|us|uk|ca|au|eu)/listing/:slug',
        destination: '/:country/company/:slug',
        permanent: true,
      },
      // Redirect old /infowebworld/* URLs to /* (except uploads which are proxied)
      {
        source: '/infowebworld/:path((?!uploads/).*)',
        destination: '/:path',
        permanent: true,
      },
      // Redirect old /category/:slug URLs to /:slug (removed /category/ prefix)
      {
        source: '/category/:path*',
        destination: '/:path*',
        permanent: true,
      },
      // Country-prefixed /category/ redirect
      {
        source: '/:country(in|us|uk|ca|au|eu)/category/:path*',
        destination: '/:country/:path*',
        permanent: true,
      },
      // Old AI slug → new short slug
      {
        source: '/artificial-intelligence-ml/:path*',
        destination: '/ai-ml/:path*',
        permanent: true,
      },
      {
        source: '/:country(in|us|uk|ca|au|eu)/artificial-intelligence-ml/:path*',
        destination: '/:country/ai-ml/:path*',
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
      {
        source: '/:country(in|us|uk|ca|au|eu)/local-business',
        destination: '/:country/local-businesses',
        permanent: true,
      },
      {
        source: '/:country(in|us|uk|ca|au|eu)/local-business/:path*',
        destination: '/:country/local-businesses/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
