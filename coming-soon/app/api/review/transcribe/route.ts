import { NextRequest } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/tracking'

/* Audio + a 12 MB body need the Node runtime (Buffer, larger payloads) and a
   longer budget than the default — Gemini audio can take 10-20s. NOTE: on a
   Vercel Hobby plan serverless functions are capped at 10s, so a near-3-min
   recording may time out there; bump the plan or shorten the cap if so. */
export const runtime = 'nodejs'
export const maxDuration = 60

/* ═══════════════════════════════════════════════════════════════════════
   POST /api/review/transcribe
   Body: multipart/form-data with:
     - audio  : Blob (audio/webm | audio/mp4 | audio/ogg | audio/wav)
     - company: string  (display name, used for prompt context)

   Single-call pipeline on Google Gemini (generativelanguage REST):
     1. The audio is sent inline (base64) to a multimodal Gemini model, which
        transcribes (any language) AND returns a clean English review +
        rating + detected language as JSON in one shot.
     2. The audio is never persisted — discarded after the response.

   The user then confirms/edits and submits via the existing review POST.

   Key is read from process.env.GEMINI_API_KEY — NEVER hardcode it (this repo
   is public on GitHub). Set it in .env.local (local) and Vercel env (prod).
   ═══════════════════════════════════════════════════════════════════════ */

/* Max accepted audio size — generous for a 3-minute review. */
const MAX_AUDIO_BYTES = 12 * 1024 * 1024  // 12 MB

/* Multimodal + JSON-capable, fast/cheap. Override via env if needed. */
const GEMINI_MODEL = process.env.GEMINI_TRANSCRIBE_MODEL || 'gemini-2.5-flash'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

const ACCEPTED_BARE = new Set(['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/wav', 'audio/x-wav', 'audio/mpeg', 'audio/mp3'])

/* Gemini's documented audio formats are WAV/MP3/AIFF/AAC/OGG/FLAC — no WebM.
   Chrome records Opus-in-WebM, so we relabel it audio/ogg (also Opus) for
   Gemini; everything else maps to a Gemini-accepted type. */
const GEMINI_MIME: Record<string, string> = {
  'audio/webm': 'audio/ogg',
  'audio/ogg': 'audio/ogg',
  'audio/mp4': 'audio/mp4',
  'audio/mpeg': 'audio/mp3',
  'audio/mp3': 'audio/mp3',
  'audio/wav': 'audio/wav',
  'audio/x-wav': 'audio/wav',
}

function buildPrompt(companyName: string): string {
  return `You are given an audio recording of a customer's spoken review of "${companyName}". It may be in ANY language and contain filler words, false starts, or background noise.

Transcribe it internally, then return ONLY a raw JSON object (no markdown fences, no preamble) with these EXACT fields:
{
  "rating": integer 1-5 inferring overall sentiment (1 = furious, 2 = unhappy, 3 = neutral or mixed, 4 = positive, 5 = enthusiastic),
  "title": short one-line summary, max 80 characters, no quotes,
  "body": a clean, well-written English review of 60-280 words in first person. Preserve every key point the speaker made (pros, cons, specific incidents, comparisons). Do NOT invent details. If spoken in another language, faithfully translate to natural English. Fix filler words and grammar - a polished review, not a literal transcript.
  "language": ISO 639-1 code of the original spoken language (e.g. "en", "es", "hi", "fr")
}

Rules:
- Output ONLY the JSON object.
- If the audio is empty, silent, nonsensical, or under ~5 words, return rating 0 and body "AUDIO_UNCLEAR".
- If it is not actually a review of the company, return rating 0 and body "OFF_TOPIC".
- Never include explicit content, slurs, or personally identifying info about third parties.`
}

interface Draft {
  rating: number
  title: string
  body: string
  language: string
}

function safeParseDraft(raw: string): Draft | null {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  try {
    const obj = JSON.parse(cleaned) as Partial<Draft>
    if (typeof obj.title !== 'string') return null
    if (typeof obj.body !== 'string')  return null
    const rating = Number(obj.rating)
    if (!Number.isFinite(rating)) return null
    return {
      rating: Math.max(0, Math.min(5, Math.round(rating))),
      title: obj.title.slice(0, 120),
      body: obj.body.slice(0, 4000),
      language: typeof obj.language === 'string' ? obj.language.slice(0, 8) : 'en',
    }
  } catch {
    return null
  }
}

/* One multimodal Gemini call: inline audio + instruction -> JSON review.
   Retries on 429 / 5xx; throws on hard failures (caller maps to a 502). */
async function geminiReviewFromAudio(base64: string, mimeType: string, companyName: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('GEMINI_API_KEY not set')

  const body = {
    contents: [{
      role: 'user',
      parts: [
        { inline_data: { mime_type: mimeType, data: base64 } },
        { text: buildPrompt(companyName) },
      ],
    }],
    generationConfig: {
      temperature: 0.35,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json',
    },
  }

  let lastErr = ''
  for (let attempt = 0; attempt < 3; attempt++) {
    let res: Response
    try {
      res = await fetch(`${GEMINI_URL}?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    } catch (e) {
      lastErr = e instanceof Error ? e.message : String(e)
      await new Promise(r => setTimeout(r, 400 * (attempt + 1)))
      continue
    }

    if (res.ok) {
      const j = await res.json()
      const block = j?.promptFeedback?.blockReason
      if (block) throw new Error(`Gemini blocked the prompt: ${block}`)
      const parts = j?.candidates?.[0]?.content?.parts
      const text = Array.isArray(parts)
        ? parts.map((p: { text?: string }) => p.text || '').join('')
        : ''
      if (!text) throw new Error('Gemini returned no text')
      return text
    }

    if (res.status === 429 || res.status >= 500) {
      lastErr = `Gemini ${res.status}`
      await new Promise(r => setTimeout(r, 500 * (attempt + 1)))
      continue
    }
    /* 4xx (bad key, unsupported audio, etc.) — don't retry. */
    throw new Error(`Gemini ${res.status}: ${(await res.text().catch(() => '')).slice(0, 300)}`)
  }
  throw new Error(`Gemini: ${lastErr || 'max retries exceeded'}`)
}

export async function POST(request: NextRequest) {
  const ip = await getClientIp()
  /* Spendy upstream — cap each IP to 8 transcripts per 10 min. */
  const limited = await checkRateLimit(ip, 'review-transcribe', 8, 600)
  if (!limited) {
    return Response.json(
      { ok: false, error: 'Too many transcripts in a short window. Wait a bit and try again.' },
      { status: 429 }
    )
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error('[review/transcribe] GEMINI_API_KEY not set')
    return Response.json({ ok: false, error: 'Voice transcription is not configured on this server.' }, { status: 503 })
  }

  let form: FormData
  try { form = await request.formData() } catch {
    return Response.json({ ok: false, error: 'Invalid form data' }, { status: 400 })
  }

  const file = form.get('audio')
  const companyRaw = form.get('company')
  const companyName = typeof companyRaw === 'string' ? companyRaw.trim().slice(0, 120) : ''
  if (!companyName) {
    return Response.json({ ok: false, error: 'Missing company name' }, { status: 400 })
  }
  if (!(file instanceof Blob)) {
    return Response.json({ ok: false, error: 'Missing audio blob' }, { status: 400 })
  }
  if (file.size === 0) {
    return Response.json({ ok: false, error: 'Audio is empty' }, { status: 400 })
  }
  if (file.size > MAX_AUDIO_BYTES) {
    return Response.json({ ok: false, error: 'Recording is too long — please keep it under 3 minutes.' }, { status: 413 })
  }

  const bare = (file.type || 'audio/webm').toLowerCase().split(';')[0]
  if (!ACCEPTED_BARE.has(bare)) {
    return Response.json({ ok: false, error: `Unsupported audio format: ${file.type}` }, { status: 415 })
  }
  const geminiMime = GEMINI_MIME[bare] || 'audio/ogg'

  try {
    /* audio -> base64 for inline Gemini upload */
    const base64 = Buffer.from(await file.arrayBuffer()).toString('base64')

    let text = ''
    try {
      text = await geminiReviewFromAudio(base64, geminiMime, companyName)
    } catch (err) {
      console.error('[review/transcribe] Gemini error', err instanceof Error ? err.message : err)
      return Response.json({ ok: false, error: 'Transcription failed. You can still write your review manually.' }, { status: 502 })
    }

    const draft = safeParseDraft(text)
    if (!draft) {
      console.error('[review/transcribe] Could not parse output:', text.slice(0, 500))
      return Response.json({ ok: false, error: 'Could not parse the transcription.' }, { status: 502 })
    }

    if (draft.body === 'AUDIO_UNCLEAR') {
      return Response.json({ ok: false, code: 'audio_unclear', error: 'The audio was too short or unclear. Try recording again or write it manually.' }, { status: 400 })
    }
    if (draft.body === 'OFF_TOPIC') {
      return Response.json({ ok: false, code: 'off_topic', error: "We couldn't detect a review in that recording. Try again or write it manually." }, { status: 400 })
    }
    if (draft.rating === 0) {
      /* Couldn't infer rating — let the user pick. */
      draft.rating = 4
    }

    return Response.json({ ok: true, draft })
  } catch (err) {
    console.error('[review/transcribe] error:', err)
    return Response.json({ ok: false, error: 'Network error talking to transcription service.' }, { status: 502 })
  }
}
