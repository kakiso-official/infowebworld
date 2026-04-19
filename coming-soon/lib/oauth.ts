import { randomBytes, createHash } from 'node:crypto'
import { execute, queryOne } from './db'

/**
 * OAuth provider config: where to send the user to authorize, where to exchange
 * the code for a token, where to fetch the profile. Scopes and auth-request
 * tweaks are provider-specific. Secrets are read from env only at request time,
 * so rotating creds doesn't need a redeploy.
 */
export type ProviderKey = 'google' | 'facebook' | 'reddit' | 'linkedin' | 'x'

export interface ProviderConfig {
  key: ProviderKey
  label: string
  authorizeUrl: string
  tokenUrl: string
  userInfoUrl: string
  scope: string
  usesPkce: boolean
  tokenAuth: 'body' | 'basic' // how client_id/secret are sent to the token endpoint
  extraAuthParams?: Record<string, string>
  extraUserInfoHeaders?: Record<string, string>
}

export const PROVIDERS: Record<ProviderKey, ProviderConfig> = {
  google: {
    key: 'google',
    label: 'Google',
    authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://openidconnect.googleapis.com/v1/userinfo',
    scope: 'openid email profile',
    usesPkce: true,
    tokenAuth: 'body',
    extraAuthParams: { access_type: 'online', prompt: 'select_account' },
  },
  facebook: {
    key: 'facebook',
    label: 'Facebook',
    authorizeUrl: 'https://www.facebook.com/v19.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v19.0/oauth/access_token',
    userInfoUrl: 'https://graph.facebook.com/me?fields=id,name,email,picture.width(256).height(256)',
    scope: 'email public_profile',
    usesPkce: false,
    tokenAuth: 'body',
  },
  reddit: {
    key: 'reddit',
    label: 'Reddit',
    authorizeUrl: 'https://www.reddit.com/api/v1/authorize',
    tokenUrl: 'https://www.reddit.com/api/v1/access_token',
    userInfoUrl: 'https://oauth.reddit.com/api/v1/me',
    scope: 'identity',
    usesPkce: false,
    tokenAuth: 'basic',
    extraAuthParams: { duration: 'temporary' },
    extraUserInfoHeaders: { 'User-Agent': 'InfoWebWorld/1.0 (by /u/infowebworld)' },
  },
  linkedin: {
    key: 'linkedin',
    label: 'LinkedIn',
    authorizeUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    userInfoUrl: 'https://api.linkedin.com/v2/userinfo',
    scope: 'openid profile email',
    usesPkce: false,
    tokenAuth: 'body',
  },
  x: {
    key: 'x',
    label: 'X (Twitter)',
    authorizeUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    userInfoUrl: 'https://api.twitter.com/2/users/me?user.fields=profile_image_url,name,username',
    scope: 'tweet.read users.read',
    usesPkce: true,
    tokenAuth: 'basic', // X requires basic auth on confidential clients
  },
}

/** Uppercase env var prefix per provider so `.env.local` entries stay readable. */
export function providerEnvPrefix(p: ProviderKey): string {
  return p === 'x' ? 'X' : p.toUpperCase()
}

export function getProviderCreds(p: ProviderKey): { clientId: string; clientSecret: string } | null {
  const prefix = providerEnvPrefix(p)
  const clientId = process.env[`${prefix}_CLIENT_ID`]
  const clientSecret = process.env[`${prefix}_CLIENT_SECRET`]
  if (!clientId || !clientSecret) return null
  return { clientId, clientSecret }
}

/** Public origin for callback URLs. In dev we read from the request; in prod, env or hardcode. */
export function getCallbackUrl(request: Request, provider: ProviderKey): string {
  const envBase = process.env.PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (envBase) return `${envBase}/api/auth/${provider}/callback`
  const url = new URL(request.url)
  return `${url.origin}/api/auth/${provider}/callback`
}

/* ── State + PKCE helpers ── */

export function generateState(): string { return randomBytes(32).toString('hex') }
export function generateCodeVerifier(): string { return randomBytes(48).toString('base64url') }
export function codeChallenge(verifier: string): string {
  return createHash('sha256').update(verifier).digest('base64url')
}

/** Store a pending OAuth attempt. 10-minute TTL. */
export async function storeState(
  state: string,
  provider: ProviderKey,
  codeVerifier: string | null,
  redirectAfter: string | null
): Promise<void> {
  await execute(
    `INSERT INTO oauth_states (state, provider, code_verifier, redirect_after, expires_at)
     VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))`,
    [state, provider, codeVerifier, redirectAfter]
  )
}

export async function consumeState(state: string, provider: ProviderKey): Promise<{
  codeVerifier: string | null
  redirectAfter: string | null
} | null> {
  const row = await queryOne<{
    code_verifier: string | null; redirect_after: string | null
  }>(
    `SELECT code_verifier, redirect_after FROM oauth_states
     WHERE state = ? AND provider = ? AND expires_at > NOW() LIMIT 1`,
    [state, provider]
  )
  if (!row) return null
  await execute('DELETE FROM oauth_states WHERE state = ?', [state])
  return { codeVerifier: row.code_verifier, redirectAfter: row.redirect_after }
}

/* ── Token exchange ── */

export async function exchangeCodeForToken(
  provider: ProviderConfig,
  creds: { clientId: string; clientSecret: string },
  code: string,
  redirectUri: string,
  codeVerifier: string | null
): Promise<{ accessToken: string; idToken?: string } | { error: string }> {
  const body = new URLSearchParams()
  body.set('grant_type', 'authorization_code')
  body.set('code', code)
  body.set('redirect_uri', redirectUri)
  if (codeVerifier) body.set('code_verifier', codeVerifier)

  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json',
  }
  if (provider.tokenAuth === 'basic') {
    const basic = Buffer.from(`${creds.clientId}:${creds.clientSecret}`).toString('base64')
    headers.Authorization = `Basic ${basic}`
  } else {
    body.set('client_id', creds.clientId)
    body.set('client_secret', creds.clientSecret)
  }

  // Reddit requires a real User-Agent on ALL requests or they return 429
  if (provider.key === 'reddit') headers['User-Agent'] = 'InfoWebWorld/1.0 (by /u/infowebworld)'

  const res = await fetch(provider.tokenUrl, { method: 'POST', headers, body })
  const text = await res.text()
  if (!res.ok) return { error: `token-exchange-failed: ${res.status} ${text.slice(0, 200)}` }

  try {
    const json = JSON.parse(text)
    if (!json.access_token) return { error: `no-access-token: ${text.slice(0, 200)}` }
    return { accessToken: json.access_token, idToken: json.id_token }
  } catch {
    return { error: `bad-json: ${text.slice(0, 200)}` }
  }
}

export interface OAuthProfile {
  providerId: string
  email: string | null
  name: string | null
  avatarUrl: string | null
  emailVerified: boolean
}

export async function fetchUserProfile(
  provider: ProviderConfig,
  accessToken: string
): Promise<OAuthProfile | { error: string }> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/json',
    ...(provider.extraUserInfoHeaders || {}),
  }
  const res = await fetch(provider.userInfoUrl, { headers })
  const text = await res.text()
  if (!res.ok) return { error: `userinfo-failed: ${res.status} ${text.slice(0, 200)}` }

  let json: Record<string, unknown>
  try { json = JSON.parse(text) }
  catch { return { error: `userinfo-bad-json: ${text.slice(0, 200)}` } }

  return normalizeProfile(provider.key, json)
}

function normalizeProfile(key: ProviderKey, raw: Record<string, unknown>): OAuthProfile {
  switch (key) {
    case 'google': {
      return {
        providerId: String(raw.sub || ''),
        email: (raw.email as string) || null,
        name: (raw.name as string) || null,
        avatarUrl: (raw.picture as string) || null,
        emailVerified: Boolean(raw.email_verified),
      }
    }
    case 'facebook': {
      const pic = raw.picture as { data?: { url?: string } } | undefined
      return {
        providerId: String(raw.id || ''),
        email: (raw.email as string) || null,
        name: (raw.name as string) || null,
        avatarUrl: pic?.data?.url || null,
        emailVerified: Boolean(raw.email),
      }
    }
    case 'reddit': {
      return {
        providerId: String(raw.id || ''),
        email: null, // Reddit identity scope doesn't include email
        name: (raw.name as string) || null,
        avatarUrl: typeof raw.icon_img === 'string' ? raw.icon_img.split('?')[0] : null,
        emailVerified: false,
      }
    }
    case 'linkedin': {
      return {
        providerId: String(raw.sub || ''),
        email: (raw.email as string) || null,
        name: (raw.name as string) || null,
        avatarUrl: (raw.picture as string) || null,
        emailVerified: Boolean(raw.email_verified),
      }
    }
    case 'x': {
      const data = (raw.data as Record<string, unknown>) || {}
      return {
        providerId: String(data.id || ''),
        email: null, // X OAuth2 doesn't provide email
        name: (data.name as string) || null,
        avatarUrl: (data.profile_image_url as string) || null,
        emailVerified: false,
      }
    }
  }
}

/**
 * Look up or create a business_users row for an OAuth profile.
 * - Existing user with same provider+providerId → return as-is
 * - New user with email that matches an existing account → link by storing provider_id
 * - Otherwise → create a fresh row
 * Returns the user id. If the provider returns no email, generates a stable
 * placeholder from the providerId so the UNIQUE email constraint doesn't fail.
 */
export async function upsertOAuthUser(
  provider: ProviderKey,
  profile: OAuthProfile
): Promise<number | { error: string }> {
  if (!profile.providerId) return { error: 'missing-provider-id' }

  // 1. already linked?
  const byLink = await queryOne<{ id: number }>(
    `SELECT id FROM business_users WHERE provider = ? AND provider_id = ? LIMIT 1`,
    [provider, profile.providerId]
  )
  if (byLink) return byLink.id

  const email = profile.email || `${provider}_${profile.providerId}@oauth.infowebworld.local`

  // 2. existing user with same email — link account
  const byEmail = await queryOne<{ id: number }>(
    `SELECT id FROM business_users WHERE email = ? LIMIT 1`,
    [email]
  )
  if (byEmail) {
    await execute(
      `UPDATE business_users SET provider = ?, provider_id = ?,
         name = COALESCE(name, ?), avatar_url = COALESCE(avatar_url, ?),
         email_verified = GREATEST(email_verified, ?)
       WHERE id = ?`,
      [provider, profile.providerId, profile.name, profile.avatarUrl, profile.emailVerified ? 1 : 0, byEmail.id]
    )
    return byEmail.id
  }

  // 3. brand new
  const uuid = randomBytes(16).toString('hex').replace(
    /(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5'
  )
  const res = await execute(
    `INSERT INTO business_users (uuid, email, email_verified, name, avatar_url, provider, provider_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [uuid, email, profile.emailVerified ? 1 : 0, profile.name, profile.avatarUrl, provider, profile.providerId]
  )
  return res.insertId
}
