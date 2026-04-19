import { NextRequest } from 'next/server'
import {
  PROVIDERS, ProviderKey, getProviderCreds, getCallbackUrl,
  consumeState, exchangeCodeForToken, fetchUserProfile, upsertOAuthUser,
} from '@/lib/oauth'
import { createUserSession, userCookieHeader } from '@/lib/user-auth'
import { execute } from '@/lib/db'
import { getClientIp } from '@/lib/tracking'

const POPUP_PREFIX = '__popup__:'

/**
 * OAuth callback. Verify state, exchange code for access token, fetch profile,
 * upsert business_users row, create session, then either:
 *   - Popup flow → return HTML that posts a success message to the opener
 *                  and closes the window (cookie still set on this response).
 *   - Normal flow → 302 redirect to dashboard (or stored `next`).
 *
 * On any failure, routes to the error equivalent for the current flow.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider: rawProvider } = await params
  const provider = rawProvider as ProviderKey
  const cfg = PROVIDERS[provider]
  if (!cfg) return redirectError(request, 'unknown-provider', false)

  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  // We don't know the popup-ness until we consume state, but error branches
  // before state consumption still need a sensible default — treat as normal
  // flow for those.
  if (error) return redirectError(request, `provider-denied-${error}`, false)
  if (!code || !state) return redirectError(request, 'missing-code-or-state', false)

  const stored = await consumeState(state, provider)
  if (!stored) return redirectError(request, 'invalid-or-expired-state', false)

  // Decode popup flag from the stored redirect target
  const { isPopup, nextUrl } = decodeStoredRedirect(stored.redirectAfter)

  const creds = getProviderCreds(provider)
  if (!creds) return redirectError(request, 'provider-not-configured', isPopup)

  const redirectUri = getCallbackUrl(request, provider)
  const tokenRes = await exchangeCodeForToken(cfg, creds, code, redirectUri, stored.codeVerifier)
  if ('error' in tokenRes) {
    console.error(`[oauth ${provider}] token exchange failed:`, tokenRes.error)
    return redirectError(request, 'token-exchange-failed', isPopup)
  }

  const profile = await fetchUserProfile(cfg, tokenRes.accessToken)
  if ('error' in profile) {
    console.error(`[oauth ${provider}] userinfo failed:`, profile.error)
    return redirectError(request, 'userinfo-failed', isPopup)
  }

  const userIdOrErr = await upsertOAuthUser(provider, profile)
  if (typeof userIdOrErr !== 'number') {
    console.error(`[oauth ${provider}] upsert failed:`, userIdOrErr.error)
    return redirectError(request, 'upsert-failed', isPopup)
  }

  const ip = await getClientIp()
  const token = await createUserSession(userIdOrErr, ip, request.headers.get('user-agent'))
  await execute(
    `UPDATE business_users SET last_login_at = NOW(), last_login_ip = ? WHERE id = ?`,
    [ip, userIdOrErr]
  )

  const safeNext = isSafeRedirect(nextUrl) ? nextUrl : '/dashboard'

  if (isPopup) {
    return popupSuccessResponse(token, safeNext)
  }

  return new Response(null, {
    status: 302,
    headers: { Location: safeNext, 'Set-Cookie': userCookieHeader(token) },
  })
}

/* ─────────────── helpers ─────────────── */

function decodeStoredRedirect(raw: string | null): { isPopup: boolean; nextUrl: string } {
  if (!raw) return { isPopup: false, nextUrl: '/dashboard' }
  if (raw.startsWith(POPUP_PREFIX)) {
    return { isPopup: true, nextUrl: raw.slice(POPUP_PREFIX.length) || '/dashboard' }
  }
  return { isPopup: false, nextUrl: raw }
}

function redirectError(request: NextRequest, reason: string, isPopup: boolean): Response {
  if (isPopup) return popupErrorResponse(reason)
  const origin = new URL(request.url).origin
  return Response.redirect(`${origin}/?auth_error=${encodeURIComponent(reason)}`, 302)
}

/** Only allow redirects back to our own site; never to arbitrary URLs. */
function isSafeRedirect(u: string): boolean {
  return u.startsWith('/') && !u.startsWith('//')
}

/** Tiny HTML page that signals success to the opener window and closes. */
function popupSuccessResponse(token: string, next: string): Response {
  const safeNext = JSON.stringify(next) // escape for JS string context
  const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Signed in</title></head>
<body style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#FFFFFF;color:#1A1A1A;display:flex;align-items:center;justify-content:center;height:100vh;">
  <div style="text-align:center;padding:2rem;">
    <div style="font-size:1.1rem;font-weight:700;margin-bottom:.3rem;">You're signed in ✓</div>
    <div style="font-size:.85rem;color:#5C5C5C;">You can close this window.</div>
  </div>
  <script>
    (function() {
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            { type: 'iww-auth-success', next: ${safeNext} },
            window.location.origin
          );
        }
      } catch (e) {}
      setTimeout(function() { try { window.close() } catch (e) {} }, 150);
    })();
  </script>
</body></html>`
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Set-Cookie': userCookieHeader(token),
      'Cache-Control': 'no-store',
    },
  })
}

/** Tiny HTML page that signals failure to the opener window and closes. */
function popupErrorResponse(reason: string): Response {
  const safeReason = JSON.stringify(reason)
  const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Sign-in failed</title></head>
<body style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#FFFFFF;color:#1A1A1A;display:flex;align-items:center;justify-content:center;height:100vh;">
  <div style="text-align:center;padding:2rem;">
    <div style="font-size:1.1rem;font-weight:700;margin-bottom:.3rem;">Sign-in couldn't complete</div>
    <div style="font-size:.85rem;color:#5C5C5C;">Returning to sign-in…</div>
  </div>
  <script>
    (function() {
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            { type: 'iww-auth-error', reason: ${safeReason} },
            window.location.origin
          );
        }
      } catch (e) {}
      setTimeout(function() { try { window.close() } catch (e) {} }, 250);
    })();
  </script>
</body></html>`
  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}
