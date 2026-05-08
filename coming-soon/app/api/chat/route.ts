import { NextRequest } from 'next/server'
import { CHAT_SYSTEM_PROMPT } from '@/lib/chat-knowledge'
import { getUserFromRequest } from '@/lib/user-auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/tracking'

/* Use the exact same model + endpoint format as the working SEO route
   (app/api/admin/generate-seo-content/route.ts). Streaming was hiding
   real upstream errors behind an opaque 502; non-streaming gives us the
   model's full reply in one shot, with errors that bubble up plainly.
   Thinking is disabled so the response isn't an empty string. */
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const ANON_COOKIE = 'iww_chat_anon'
const ANON_LIMIT = 3
const ANON_COOKIE_DAYS = 7
const MESSAGE_MAX_CHARS = 2000
const HISTORY_MAX_TURNS = 12

const SERVER_FALLBACK =
  "Hmm, I lost the thread for a sec. Quick: are you trying to **find a tool/vendor**, **list your business**, or **get help with the site**? " +
  "Or browse all categories on [Categories](/categories)."

interface ClientMsg { role: 'user' | 'assistant'; content: string }

interface GeminiPart { text?: string }
interface GeminiContent { role?: string; parts?: GeminiPart[] }
interface GeminiCandidate { content?: GeminiContent; finishReason?: string }
interface GeminiResponse {
  candidates?: GeminiCandidate[]
  promptFeedback?: { blockReason?: string }
  error?: { code?: number; message?: string; status?: string }
}

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

function toGeminiContents(history: ClientMsg[]): GeminiContent[] {
  return history.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))
}

/* Pull every text part out of a non-streaming response. Defensive about
   shape — Gemini occasionally splits a reply across multiple parts. */
function extractText(json: GeminiResponse): string {
  const parts = json.candidates?.[0]?.content?.parts
  if (!Array.isArray(parts)) return ''
  return parts
    .map(p => (typeof p.text === 'string' ? p.text : ''))
    .join('')
    .trim()
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
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

  let upstream: Response
  try {
    upstream = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: CHAT_SYSTEM_PROMPT }] },
        contents: toGeminiContents(trimmed),
        generationConfig: {
          temperature: 0.85,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 1500,
          /* Hard-disable hidden reasoning so every output token goes to the
             actual reply. Without this, 2.5 Flash burns the budget on
             thinking and returns an empty string. */
          thinkingConfig: { thinkingBudget: 0 },
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
        ],
      }),
    })
  } catch (err) {
    console.error('[chat] fetch failed', err)
    return Response.json({
      ok: false,
      error: 'Could not reach the assistant. Check your connection and retry.',
    }, { status: 502 })
  }

  /* Read the body once so we can both log it on failure AND parse on success. */
  const rawText = await upstream.text()

  if (!upstream.ok) {
    /* Surface the actual upstream error so it's easy to diagnose during
       local testing. The body usually contains a JSON {error:{message}}. */
    let detail = rawText.slice(0, 600)
    try {
      const errJson = JSON.parse(rawText) as GeminiResponse
      if (errJson.error?.message) detail = errJson.error.message
    } catch { /* keep raw text */ }
    console.error('[chat] Gemini error', upstream.status, detail)
    return Response.json({
      ok: false,
      error: `Assistant error (${upstream.status}): ${detail}`,
    }, { status: 502 })
  }

  let parsed: GeminiResponse
  try { parsed = JSON.parse(rawText) }
  catch (err) {
    console.error('[chat] bad JSON from Gemini', err, rawText.slice(0, 300))
    return Response.json({ ok: false, error: 'Assistant returned an unreadable reply.' }, { status: 502 })
  }

  /* Safety-blocked prompt → return a graceful response instead of silence. */
  if (parsed.promptFeedback?.blockReason) {
    const reply =
      "That topic falls outside what I can help with here. " +
      "Want to browse [Categories](/categories) or ask about getting [Listed](/business) instead?"
    const headers = baseHeaders(user, anonCount, setCookie)
    return new Response(reply, { headers })
  }

  let text = extractText(parsed)
  if (!text) {
    /* Empty reply (rare with 2.5-flash + thinkingBudget=0). Hand the user
       SOMETHING they can act on rather than a blank bubble. */
    console.warn('[chat] empty model reply, finishReason:',
      parsed.candidates?.[0]?.finishReason)
    text = SERVER_FALLBACK
  }

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
