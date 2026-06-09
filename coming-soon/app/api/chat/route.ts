import { NextRequest } from 'next/server'
import { CHAT_SYSTEM_PROMPT } from '@/lib/chat-knowledge'
import { getUserFromRequest } from '@/lib/user-auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/tracking'
import { groqChat, type ChatMsg } from '@/lib/ai'

/* Chat assistant — backed by Groq (Llama 3.3 70B), OpenAI-compatible.
   Non-streaming: the model's full reply comes back in one shot, so upstream
   errors bubble up plainly instead of hiding behind an opaque 502. */

const ANON_COOKIE = 'iww_chat_anon'
const ANON_LIMIT = 3
const ANON_COOKIE_DAYS = 7
const MESSAGE_MAX_CHARS = 2000
const HISTORY_MAX_TURNS = 12

const SERVER_FALLBACK =
  "Hmm, I lost the thread for a sec. Quick: are you trying to **find a tool/vendor**, **list your business**, or **get help with the site**? " +
  "Or browse all categories on [Categories](/categories)."

interface ClientMsg { role: 'user' | 'assistant'; content: string }

function readAnonCount(req: NextRequest): number {
  const raw = req.cookies.get(ANON_COOKIE)?.value
  if (!raw) return 0
  const n = Number.parseInt(raw, 10)
  return Number.isFinite(n) && n >= 0 ? n : 0
}

function setAnonCookieHeader(count: number): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  const maxAge = ANON_COOKIE_DAYS * 24 * 60 * 60
  return `${ANON_COOKIE}=${count}; HttpOnly${secure}; SameSite=Lax; Path=/; Max-Age=${maxAge}`
}

export async function POST(request: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return Response.json({ ok: false, error: 'Chat is temporarily unavailable.' }, { status: 503 })
  }

  const ip = await getClientIp()
  const ipOk = await checkRateLimit(ip, 'chat', 60, 600)
  if (!ipOk) {
    return Response.json({ ok: false, error: 'Too many requests. Try again in a few minutes.' }, { status: 429 })
  }

  let body: { messages?: unknown }
  try { body = await request.json() } catch {
    return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return Response.json({ ok: false, error: 'messages required' }, { status: 400 })
  }

  const cleanHistory: ClientMsg[] = []
  for (const m of body.messages as unknown[]) {
    if (!m || typeof m !== 'object') continue
    const role = (m as { role?: unknown }).role
    const content = (m as { content?: unknown }).content
    if (role !== 'user' && role !== 'assistant') continue
    if (typeof content !== 'string') continue
    const text = content.trim().slice(0, MESSAGE_MAX_CHARS)
    if (!text) continue
    cleanHistory.push({ role, content: text })
  }
  if (cleanHistory.length === 0 || cleanHistory[cleanHistory.length - 1].role !== 'user') {
    return Response.json({ ok: false, error: 'Last message must be from user.' }, { status: 400 })
  }

  const trimmed = cleanHistory.slice(-HISTORY_MAX_TURNS)

  const user = await getUserFromRequest(request)
  let anonCount = 0
  let setCookie: string | null = null
  if (!user) {
    anonCount = readAnonCount(request)
    if (anonCount >= ANON_LIMIT) {
      return Response.json({
        ok: false,
        code: 'auth_required',
        error: `You've used your ${ANON_LIMIT} free messages. Sign up to keep chatting — it's free.`,
        anonLimit: ANON_LIMIT,
        anonUsed: anonCount,
      }, { status: 401 })
    }
    setCookie = setAnonCookieHeader(anonCount + 1)
  }

  /* System prompt + trimmed conversation → Groq chat-completion messages. */
  const messages: ChatMsg[] = [
    { role: 'system', content: CHAT_SYSTEM_PROMPT },
    ...trimmed.map(m => ({ role: m.role, content: m.content }) as ChatMsg),
  ]

  let text: string
  try {
    text = (await groqChat({ messages, temperature: 0.85, topP: 0.95, maxTokens: 1500 })).trim()
  } catch (err) {
    console.error('[chat] Groq error', err instanceof Error ? err.message : err)
    return Response.json({
      ok: false,
      error: 'Could not reach the assistant. Check your connection and retry.',
    }, { status: 502 })
  }

  /* Empty reply (rare) — hand the user something actionable, not a blank bubble. */
  if (!text) text = SERVER_FALLBACK

  const headers = baseHeaders(user, anonCount, setCookie)
  return new Response(text, { headers })
}

function baseHeaders(
  user: { id: number } | null,
  anonCount: number,
  setCookie: string | null,
): Headers {
  const headers = new Headers({
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Anon-Used': String(user ? 0 : anonCount + 1),
    'X-Anon-Limit': String(ANON_LIMIT),
    'X-Authed': user ? '1' : '0',
  })
  if (setCookie) headers.set('Set-Cookie', setCookie)
  return headers
}
