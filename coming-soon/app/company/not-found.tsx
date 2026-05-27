import RootNotFound from '../not-found'

/* Co-located not-found so notFound() inside company/[slug]/page.tsx properly
   resolves to 404 status (Next.js 16 looks up the closest not-found.tsx; without
   this file the framework falls back to the root one but returns 200 — same
   quirk handled in app/[...segments]/not-found.tsx). */
export default RootNotFound
