import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  /* Ensure the markdown blog posts are bundled with the admin file API so it
     can read them at runtime on Vercel (authoring/writing is local-only). */
  outputFileTracingIncludes: {
    '/api/admin/blog/files': ['./content/blog/**/*'],
    '/api/admin/blog/ai': ['./content/blog/**/*'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'infowebworld.com' },
      { protocol: 'https', hostname: 'www.infowebworld.com' },
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
      // ── Country prefixes are NOT valid URLs — do NOT redirect them. ──
      // Legacy /{country}/* paths (/uk/blog, /us/ai-ml, bare /uk, …) are left
      // to 404 through the app/[...segments] catch-all (notFound()) so Google
      // de-indexes them instead of following a redirect. A previous version
      // 308-redirected /:country/:path+ → /:path+; that was removed on purpose.
      // Do NOT re-add a country redirect here.

      // Old /plans → /business/plans
      {
        source: '/plans',
        destination: '/business/plans',
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
