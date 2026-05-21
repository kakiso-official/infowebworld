import { NextRequest } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/tracking'

/* ═══════════════════════════════════════════════════════════════════════
   POST /api/review/transcribe
   Body: multipart/form-data with:
     - audio  : Blob (audio/webm | audio/mp4 | audio/ogg | audio/wav)
     - company: string  (display name, used for prompt context)

   Pipeline:
     1. Accept audio blob from the browser MediaRecorder (no file upload).
     2. Base64-encode and pass to Gemini 2.5 Flash as `inlineData`.
     3. Gemini transcribes + cleans + scores sentiment.
     4. Return { rating, title, body, language } as JSON.
     5. Discard the audio — never persisted.

   The user then confirms/edits and submits via the existing review POST.
   We don't store the recording — our promise is "voice in, English review
   out". Privacy by design.
   ═══════════════════════════════════════════════════════════════════════ */

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

/* Max accepted audio size — generous enough for a 3-minute review at
   high bitrate, small enough to keep base64 payloads under the inline
   data cap (20MB after base64 inflation = ~14MB raw). */
const MAX_AUDIO_BYTES = 12 * 1024 * 1024  // 12 MB

const ACCEPTED_MIME = new Set([
  'audio/webm', 'audio/webm;codecs=opus',
  'audio/ogg',  'audio/ogg;codecs=opus',
  'audio/mp4',  'audio/mp4;codecs=mp4a',
  'audio/mpeg', 'audio/mp3',
  'audio/wav',  'audio/x-wav',
])

function buildPrompt(companyName: string): string {
  return `You are analysing a customer's spoken review of "${companyName}".

Listen to the attached audio carefully. Then return a JSON object with these EXACT fields:

{
  "rating": integer 1-5 inferring overall sentiment (1 = furious, 2 = unhappy, 3 = neutral or mixed, 4 = positive, 5 = enthusiastic),
  "title": short one-line summary, max 80 characters, no quotes,
  "body": a clean, well-written English review of 60-280 words. Preserve every key point the speaker made (pros, cons, specific incidents, comparisons). Do NOT invent details that were not said. If they spoke in a non-English language, faithfully translate to natural English. Fix filler words, false starts, and grammar — the user wants a polished review, not a literal transcript. Write in first person.
  "language": ISO 639-1 code of the detected spoken language (e.g. "en", "es", "hi", "fr")
}

Rules:
- Output ONLY the raw JSON. No markdown fences, no preamble, no trailing prose.
- If the audio is silent, unintelligible, or under 3 seconds, return rating: 0 and body: "AUDIO_UNCLEAR" so the caller can handle it.
- If the speaker does not actually review the company (talks about something else), return rating: 0 and body: "OFF_TOPIC".
- Never include explicit content, slurs, or personally identifying info about third parties.`
}

interface GeminiDraft {
  rating: number
  title: string
  body: string
  language: string
}

function safeParseDraft(raw: string): GeminiDraft | null {
  /* Strip any accidental markdown fences and trim. */
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  try {
    const obj = JSON.parse(cleaned) as Partial<GeminiDraft>
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

  const key = process.env.GEMINI_API_KEY
  if (!key) {
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

  /* Normalise the MIME type the browser reported. WebM/Opus is the most
     common Chrome/Firefox default; Safari often sends audio/mp4. Strip
     codec params for Gemini compatibility. */
  let mime = (file.type || 'audio/webm').toLowerCase()
  if (!ACCEPTED_MIME.has(mime)) {
    /* Some browsers report "audio/webm;codecs=opus" — accept by prefix. */
    const bare = mime.split(';')[0]
    if (bare === 'audio/webm' || bare === 'audio/ogg' || bare === 'audio/mp4' || bare === 'audio/wav' || bare === 'audio/mpeg') {
      mime = bare
    } else {
      return Response.json({ ok: false, error: `Unsupported audio format: ${mime}` }, { status: 415 })
    }
  }

  /* Base64 encode for inline transmission to Gemini. */
  const buf = Buffer.from(await file.arrayBuffer())
  const b64 = buf.toString('base64')

  const prompt = buildPrompt(companyName)

  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inlineData: { mimeType: mime, data: b64 } },
            { text: prompt },
          ],
        }],
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
        },
      }),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      console.error('[review/transcribe] Gemini error', res.status, errText.slice(0, 500))
      const friendly = res.status === 429
        ? 'Transcription service is busy — try again in a moment.'
        : 'Transcription failed. You can still write your review manually.'
      return Response.json({ ok: false, error: friendly }, { status: 502 })
    }

    const json = await res.json()
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    if (!text) {
      return Response.json({ ok: false, error: 'Empty response from transcription service.' }, { status: 502 })
    }

    const draft = safeParseDraft(text)
    if (!draft) {
      console.error('[review/transcribe] Could not parse Gemini output:', text.slice(0, 500))
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
