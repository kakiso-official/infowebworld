const HASH = '936fe5dacd517358fd8083b8b16cddfa74bcf0b937602d8433ace3ebb5b614a7'

export async function verifyCredentials(user: string, pass: string): Promise<boolean> {
  const enc = new TextEncoder().encode(`${user}:${pass}`)
  const buf = await crypto.subtle.digest('SHA-256', enc)
  const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
  return hex === HASH
}

const SESSION_KEY = 'iww_adm'
const EXPIRY_MS = 4 * 60 * 60 * 1000 // 4 hours

export function setSession() {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ t: Date.now() }))
}

export function checkSession(): boolean {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return false
    const { t } = JSON.parse(raw)
    return Date.now() - t < EXPIRY_MS
  } catch { return false }
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY)
}
