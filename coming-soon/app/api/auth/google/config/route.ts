/**
 * Public-safe Google client ID lookup. The Google OAuth client ID is not
 * secret (it's meant to ship to the browser) but it's only stored as a
 * server env var right now, so this tiny endpoint hands it to the One Tap
 * client without forcing a duplicate NEXT_PUBLIC_ env var.
 */
export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
  return Response.json(
    { clientId },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
  )
}
