import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'

/**
 * POST /api/admin/deploy
 *
 * Manual trigger for a Vercel production deploy. The admin clicks the
 * "Deploy" button on /iww-hq/submissions when they want pending-approved
 * listings to go live. The button fires this endpoint, which forwards to
 * the project's Vercel Deploy Hook URL (set in env as VERCEL_DEPLOY_HOOK_URL).
 *
 * To create the hook:
 *   Vercel project → Settings → Git → Deploy Hooks → Create Hook
 *     Name: "Admin manual deploy"
 *     Branch: main
 *   Copy the URL into Vercel env var VERCEL_DEPLOY_HOOK_URL.
 *
 * Vercel returns 201 + { job: { id, state, createdAt } } on success.
 */
export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL
  if (!hookUrl) {
    return Response.json({
      ok: false,
      error: 'Deploy hook not configured. Add VERCEL_DEPLOY_HOOK_URL in Vercel env.',
    }, { status: 503 })
  }

  try {
    const res = await fetch(hookUrl, { method: 'POST' })
    const text = await res.text()
    if (!res.ok) {
      console.error('[deploy] Vercel hook failed', res.status, text.slice(0, 300))
      return Response.json({
        ok: false,
        error: `Vercel returned ${res.status}. Check the hook URL is still valid.`,
      }, { status: 502 })
    }
    /* Vercel returns JSON with { job: { id, state, createdAt } } — pass it
       through so the UI can show the deploy id. Fall back gracefully if
       the body isn't parseable. */
    let job: unknown = null
    try { job = JSON.parse(text) } catch { /* keep null */ }
    return Response.json({ ok: true, job })
  } catch (err) {
    console.error('[deploy] fetch failed', err)
    return Response.json({
      ok: false,
      error: 'Could not reach Vercel. Try again in a moment.',
    }, { status: 502 })
  }
}
