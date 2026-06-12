/**
 * Shared AI client. Providers live side by side:
 *   groqChat()       — text completion via Groq (OpenAI-compatible). GROQ_API_KEY.
 *   groqTranscribe() — audio → text via Groq Whisper. GROQ_API_KEY.
 *   geminiChat()     — text completion via Google Gemini (generativelanguage
 *                      REST); drop-in shape-compatible with groqChat. GEMINI_API_KEY.
 *
 * Keys are read from env (.env.local for local dev, Vercel project settings for
 * production). All retry on transient upstream errors (429/5xx) with backoff.
 */

const GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_AUDIO_URL = 'https://api.groq.com/openai/v1/audio/transcriptions'

/** Default text model — fast + capable on Groq's free tier. */
export const GROQ_TEXT_MODEL = 'llama-3.3-70b-versatile'
/** Whisper model for speech-to-text. */
export const GROQ_WHISPER_MODEL = 'whisper-large-v3'

const RETRY_CODES = new Set([429, 500, 502, 503])

export type ChatMsg = { role: 'system' | 'user' | 'assistant'; content: string }

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

interface ChatArgs {
  /** Provide a full conversation, OR a single `prompt` (+ optional `system`). */
  messages?: ChatMsg[]
  prompt?: string
  system?: string
  temperature?: number
  maxTokens?: number
  topP?: number
  model?: string
  /** Force a JSON-object reply (Groq JSON mode). The prompt must mention JSON. */
  json?: boolean
}

/**
 * Text completion. Returns the assistant message content as a string. Throws
 * on a hard failure after retries — callers decide how to surface it (the
 * Gemini routes threw too, so call-site behaviour is unchanged).
 */
export async function groqChat(args: ChatArgs): Promise<string> {
  const key = process.env.GROQ_API_KEY
  if (!key) throw new Error('GROQ_API_KEY not set')

  const messages: ChatMsg[] = args.messages
    ? args.messages
    : [
        ...(args.system ? [{ role: 'system' as const, content: args.system }] : []),
        { role: 'user' as const, content: args.prompt || '' },
      ]

  const payload: Record<string, unknown> = {
    model: args.model || GROQ_TEXT_MODEL,
    messages,
    temperature: args.temperature ?? 0.4,
    max_tokens: args.maxTokens ?? 4096,
  }
  if (args.topP != null) payload.top_p = args.topP
  if (args.json) payload.response_format = { type: 'json_object' }

  for (let attempt = 0; attempt <= 4; attempt++) {
    let res: Response
    try {
      res = await fetch(GROQ_CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify(payload),
      })
    } catch (err) {
      if (attempt < 4) { await sleep(Math.min(1500 * 2 ** attempt, 20000)); continue }
      throw err
    }
    if (res.ok) {
      const json = await res.json()
      return json.choices?.[0]?.message?.content || ''
    }
    if (RETRY_CODES.has(res.status) && attempt < 4) {
      await sleep(Math.min(1500 * 2 ** attempt, 20000))
      continue
    }
    throw new Error(`Groq ${res.status}: ${(await res.text().catch(() => '')).slice(0, 300)}`)
  }
  throw new Error('Groq: max retries exceeded')
}

/** Default Gemini text model — multimodal, JSON-capable, fast. Override via env. */
export const GEMINI_TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || 'gemini-2.5-flash'

/**
 * Text completion via Google Gemini (generativelanguage REST). Same args and
 * return type as groqChat(), so call sites swap one for the other with no other
 * change. Reads GEMINI_API_KEY; throws on a hard failure after retries.
 *
 * Gemini has no "system" role — any system turns are folded into
 * systemInstruction, assistant turns map to role "model".
 */
export async function geminiChat(args: ChatArgs): Promise<string> {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('GEMINI_API_KEY not set')

  const msgs: ChatMsg[] = args.messages
    ? args.messages
    : [
        ...(args.system ? [{ role: 'system' as const, content: args.system }] : []),
        { role: 'user' as const, content: args.prompt || '' },
      ]

  const systemText = msgs.filter(m => m.role === 'system').map(m => m.content).join('\n\n')
  const contents: Array<{ role: string; parts: Array<{ text: string }> }> = msgs
    .filter(m => m.role !== 'system')
    .map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }))
  if (contents.length === 0) contents.push({ role: 'user', parts: [{ text: args.prompt || '' }] })

  const generationConfig: Record<string, unknown> = {
    temperature: args.temperature ?? 0.4,
    maxOutputTokens: args.maxTokens ?? 4096,
  }
  if (args.topP != null) generationConfig.topP = args.topP
  if (args.json) generationConfig.responseMimeType = 'application/json'

  const payload: Record<string, unknown> = { contents, generationConfig }
  if (systemText) payload.systemInstruction = { parts: [{ text: systemText }] }

  const model = args.model || GEMINI_TEXT_MODEL
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`

  for (let attempt = 0; attempt <= 4; attempt++) {
    let res: Response
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch (err) {
      if (attempt < 4) { await sleep(Math.min(1500 * 2 ** attempt, 20000)); continue }
      throw err
    }
    if (res.ok) {
      const json = await res.json()
      if (json?.promptFeedback?.blockReason) throw new Error(`Gemini blocked: ${json.promptFeedback.blockReason}`)
      const parts = json?.candidates?.[0]?.content?.parts
      return Array.isArray(parts) ? parts.map((p: { text?: string }) => p.text || '').join('') : ''
    }
    if (RETRY_CODES.has(res.status) && attempt < 4) {
      await sleep(Math.min(1500 * 2 ** attempt, 20000))
      continue
    }
    throw new Error(`Gemini ${res.status}: ${(await res.text().catch(() => '')).slice(0, 300)}`)
  }
  throw new Error('Gemini: max retries exceeded')
}

/**
 * Speech → text via Whisper. `file` is the audio Blob from the browser.
 * `filename` should carry the right extension (Whisper infers format from it).
 * Returns the plain-text transcript in the spoken language.
 */
export async function groqTranscribe(
  file: Blob,
  opts?: { model?: string; language?: string; prompt?: string; filename?: string }
): Promise<string> {
  const key = process.env.GROQ_API_KEY
  if (!key) throw new Error('GROQ_API_KEY not set')

  const form = new FormData()
  form.append('file', file, opts?.filename || 'audio.webm')
  form.append('model', opts?.model || GROQ_WHISPER_MODEL)
  form.append('response_format', 'text')
  if (opts?.language) form.append('language', opts.language)
  if (opts?.prompt) form.append('prompt', opts.prompt)

  for (let attempt = 0; attempt <= 3; attempt++) {
    let res: Response
    try {
      res = await fetch(GROQ_AUDIO_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}` },
        body: form,
      })
    } catch (err) {
      if (attempt < 3) { await sleep(Math.min(1500 * 2 ** attempt, 15000)); continue }
      throw err
    }
    if (res.ok) return (await res.text()).trim()
    if (RETRY_CODES.has(res.status) && attempt < 3) {
      await sleep(Math.min(1500 * 2 ** attempt, 15000))
      continue
    }
    throw new Error(`Groq Whisper ${res.status}: ${(await res.text().catch(() => '')).slice(0, 300)}`)
  }
  throw new Error('Groq Whisper: max retries exceeded')
}
