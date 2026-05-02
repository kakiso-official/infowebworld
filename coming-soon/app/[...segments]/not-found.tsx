import RootNotFound from '../not-found'

/* Co-located not-found so notFound() inside [...segments]/page.tsx properly
   resolves to 404 status (Next.js 16 looks up the closest not-found.tsx; without
   this file the framework was falling back to the root one but returning 200). */
export default RootNotFound
