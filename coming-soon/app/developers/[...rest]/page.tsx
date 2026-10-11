import { notFound } from 'next/navigation'

/* ── Unknown deep URLs under /developers ──
   Without this route, a path such as /developers/free-apis/a/b/c falls
   through to the root app/[...segments] catch-all, which is force-dynamic
   and streams a 200 before it can 404 (a soft 404). The section's static
   and dynamic routes always win over this catch-all; anything left lands
   here and gets app/developers/not-found.tsx (and its metadata) with a
   real 404 status.

   KEEP IT NON-STREAMED: no segment config, no request APIs, no data. */
export default function DevelopersUnknownPath() {
  notFound()
}
