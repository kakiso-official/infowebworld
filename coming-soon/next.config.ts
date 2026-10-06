import type { NextConfig } from "next";

/* Sector slug → its public path: the landing, and the prefix of every
   category page in the sector. Same map as LANDING_PATHS in
   lib/sector-paths.ts - keep the two in sync. */
const SECTOR_PATHS: Record<string, string> = {
  'ai-ml': '/ai-si-directory',
  'software-saas': '/saas-directory',
  'it-services-agencies': '/it-directory',
  'startups-innovation': '/startup-directory',
  'local-businesses': '/local-businesses-directory',
  'professional-services': '/professional-service-directory',
}

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
      // The six sectors moved to their "[sector] directory" URLs (Oct 2026
      // SEO specs): the landing AND every page under it, e.g.
      //   /software-saas                → /saas-directory
      //   /software-saas/crm-platforms  → /saas-directory/crm-platforms
      // Internal links use lib/sector-paths.ts, so nothing links to the old
      // paths. Query strings carry over.
      ...Object.entries(SECTOR_PATHS).flatMap(([sector, path]) => [
        { source: `/${sector}`, destination: path, permanent: true },
        { source: `/${sector}/:path+`, destination: `${path}/:path+`, permanent: true },
      ]),
      // Older aliases of two sector slugs → the current URLs, in one hop.
      {
        source: '/artificial-intelligence-ml',
        destination: SECTOR_PATHS['ai-ml'],
        permanent: true,
      },
      {
        source: '/artificial-intelligence-ml/:path+',
        destination: `${SECTOR_PATHS['ai-ml']}/:path+`,
        permanent: true,
      },
      {
        source: '/local-business',
        destination: SECTOR_PATHS['local-businesses'],
        permanent: true,
      },
      {
        source: '/local-business/:path+',
        destination: `${SECTOR_PATHS['local-businesses']}/:path+`,
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
