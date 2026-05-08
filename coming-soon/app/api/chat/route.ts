import { NextRequest } from 'next/server'
import { CHAT_SYSTEM_PROMPT } from '@/lib/chat-knowledge'
import { getUserFromRequest } from '@/lib/user-auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/tracking'

/* Gemini 2.5 Flash — streaming endpoint. Returns SSE we forward to the client. */
const GEMINI_STREAM_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse'

const ANON_COOKIE = 'iww_chat_anon'
const ANON_LIMIT = 3                  // free messages before signup required
const ANON_COOKIE_DAYS = 7            // count window — fresh limit after a week
const MESSAGE_MAX_CHARS = 2000        // input cap per message (cheap abuse guard)
const HISTORY_MAX_TURNS = 12          // last N user+assistant turns sent to Gemini

interface ClientMsg { role: 'user' | 'assistant'; content: string }

interface GeminiPart { text?: string }
interface GeminiContent { role?: string; parts?: GeminiPart[] }
interface GeminiCandidate { content?: GeminiContent; finishReason?: string }
interface GeminiStreamChunk { candidates?: GeminiCandidate[] }

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

/* Map our [{role, content}] to Gemini's contents[]. Gemini uses role
   'user' | 'model'; the system instruction goes in a separate field. */
function toGeminiContents(history: ClientMsg[]): GeminiContent[] {
  return history.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return Response.json({ ok: false, error: 'Chat is temporarily unavailable.' }, { status: 503 })
  }

  /* Soft IP rate limit — caps total chat traffic from any single IP regardless
     of auth state. Anything past this is almost certainly a script. */
  const ip = await getClientIp()
  const ipOk = await checkRateLimit(ip, 'chat', 60, 600) // 60 messages / 10 min
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

  /* Validate, sanitise, and trim history to the most recent N turns so the
     context stays tight even if the client somehow forgot to truncate. */
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

  /* Auth gate — anon visitors get ANON_LIMIT messages then must sign up. */
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
    /* Increment now (before the model call) so a flaky network can't be used
       to drain free messages. The cookie is HttpOnly so the client can't roll it back. */
    setCookie = setAnonCookieHeader(anonCount + 1)
  }

  /* Hand off to Gemini's streaming endpoint and pipe the SSE chunks straight
     into our own ReadableStream of plain text. The client just appends each
     chunk to the in-progress message — much better UX than waiting for the
     full response. */
  const upstream = await fetch(`${GEMINI_STREAM_URL}&key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: CHAT_SYSTEM_PROMPT }] },
      contents: toGeminiContents(trimmed),
      generationConfig: {
        temperature: 0.85,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
        /* Gemini 2.5 Flash has thinking ON by default. With a low maxOutput
           it eats every output token on hidden thinking and the user sees
           an empty stream. Hard-disable for chat — we want fast, direct
           replies, not a reasoning trace we're going to throw away. */
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

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => '')
    console.error('[chat] Gemini error', upstream.status, errText)
    return Response.json({ ok: false, error: 'Chat is having a moment — try again.' }, { status: 502 })
  }

  /* SSE-from-Gemini → plain-text stream-to-client. We strip the framing and
     emit just the model's text deltas; the client appends them as they land. */
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  const reader = upstream.body.getReader()

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = ''
      try {
        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })

          /* SSE frames are delimited by blank lines. Process whole frames only. */
          let idx: number
          while ((idx = buffer.indexOf('\n\n')) !== -1) {
            const frame = buffer.slice(0, idx).trim()
            buffer = buffer.slice(idx + 2)
            if (!frame.startsWith('data:')) continue
            const payload = frame.slice(5).trim()
            if (!payload || payload === '[DONE]') continue
            try {
              const parsed = JSON.parse(payload) as GeminiStreamChunk
              const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text
              if (text) controller.enqueue(encoder.encode(text))
            } catch {
              /* Malformed SSE chunk — skip silently. */
            }
          }
        }
      } catch (err) {
        console.error('[chat] stream error', err)
      } finally {
        controller.close()
      }
    },
  })

  const headers = new Headers({
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Anon-Used': String(user ? 0 : anonCount + 1),
    'X-Anon-Limit': String(ANON_LIMIT),
    'X-Authed': user ? '1' : '0',
  })
  if (setCookie) headers.set('Set-Cookie', setCookie)

  return new Response(stream, { headers })
}
