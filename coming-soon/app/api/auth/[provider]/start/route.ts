import { NextRequest } from 'next/server'
import {
  PROVIDERS, ProviderKey, getProviderCreds, getCallbackUrl,
  generateState, generateCodeVerifier, codeChallenge, storeState,
} from '@/lib/oauth'

/**
 * Start the OAuth handshake: pick provider, mint a state token, store it,
 * redirect the browser to the provider's authorize URL. PKCE-aware.
 *
 * /api/auth/{provider}/start?next=/in/business  → preserves post-login destination
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider: rawProvider } = await params
  const provider = rawProvider as ProviderKey
  const cfg = PROVIDERS[provider]
  if (!cfg) return Response.json({ ok: false, error: 'Unknown provider' }, { status: 400 })

  const creds = getProviderCreds(provider)
  if (!creds) {
    return Response.json(
      { ok: false, error: `${cfg.label} sign-in is not configured yet.` },
      { status: 503 }
    )
  }

  const { searchParams } = new URL(request.url)
  const next = searchParams.get('next') || null
  const isPopup = searchParams.get('popup') === '1'
  const state = generateState()
  const codeVerifier = cfg.usesPkce ? generateCodeVerifier() : null
  const challenge = codeVerifier ? codeChallenge(codeVerifier) : null

  // Encode the popup intent into the stored redirect target so the callback
  // knows whether to redirect (normal flow) or return an HTML response that
  // posts a message to the opener window (popup flow).
  const storedRedirect = isPopup
    ? `__popup__:${next || '/dashboard'}`
    : next

  await storeState(state, provider, codeVerifier, storedRedirect)

  const redirectUri = getCallbackUrl(request, provider)
  const authUrl = new URL(cfg.authorizeUrl)
  authUrl.searchParams.set('client_id', creds.clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', cfg.scope)
  authUrl.searchParams.set('state', state)
  if (challenge) {
    authUrl.searchParams.set('code_challenge', challenge)
    authUrl.searchParams.set('code_challenge_method', 'S256')
  }
  for (const [k, v] of Object.entries(cfg.extraAuthParams || {})) authUrl.searchParams.set(k, v)

  return Response.redirect(authUrl.toString(), 302)
}
