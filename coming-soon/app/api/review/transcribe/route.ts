import { NextRequest } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/tracking'
import { groqChat, groqTranscribe } from '@/lib/ai'

/* ═══════════════════════════════════════════════════════════════════════
   POST /api/review/transcribe
   Body: multipart/form-data with:
     - audio  : Blob (audio/webm | audio/mp4 | audio/ogg | audio/wav)
     - company: string  (display name, used for prompt context)

   Two-step pipeline on Groq:
     1. Whisper (whisper-large-v3) transcribes the audio → raw text.
     2. Llama 3.3 70B turns the transcript into a clean English review +
        rating + detected language, returned as JSON.
     3. Discard the audio — never persisted.

   The user then confirms/edits and submits via the existing review POST.
   ═══════════════════════════════════════════════════════════════════════ */

/* Max accepted audio size — generous for a 3-minute review. */
const MAX_AUDIO_BYTES = 12 * 1024 * 1024  // 12 MB

const ACCEPTED_BARE = new Set(['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/wav', 'audio/x-wav', 'audio/mpeg', 'audio/mp3'])
const EXT: Record<string, string> = {
  'audio/webm': 'webm', 'audio/ogg': 'ogg', 'audio/mp4': 'm4a',
  'audio/mpeg': 'mp3', 'audio/mp3': 'mp3', 'audio/wav': 'wav', 'audio/x-wav': 'wav',
}

function buildPrompt(companyName: string, transcript: string): string {
  return `A customer recorded a spoken review of "${companyName}". Below is the raw transcript — it may be in any language and contain filler words, false starts, or errors.

TRANSCRIPT:
"""
${transcript}
"""

Return ONLY a raw JSON object (no markdown fences, no preamble) with these EXACT fields:
{
  "rating": integer 1-5 inferring overall sentiment (1 = furious, 2 = unhappy, 3 = neutral or mixed, 4 = positive, 5 = enthusiastic),
  "title": short one-line summary, max 80 characters, no quotes,
  "body": a clean, well-written English review of 60-280 words in first person. Preserve every key point the speaker made (pros, cons, specific incidents, comparisons). Do NOT invent details. If the transcript is in another language, faithfully translate to natural English. Fix filler words and grammar — a polished review, not a literal transcript.
  "language": ISO 639-1 code of the transcript's original language (e.g. "en", "es", "hi", "fr")
}

Rules:
- Output ONLY the JSON object.
- If the transcript is empty, nonsensical, or under ~5 words, return rating 0 and body "AUDIO_UNCLEAR".
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

  if (!process.env.GROQ_API_KEY) {
    console.error('[review/transcribe] GROQ_API_KEY not set')
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
  const ext = EXT[bare] || 'webm'

  try {
    /* 1 — Whisper: audio → transcript (in the spoken language). */
    let transcript = ''
    try {
      transcript = await groqTranscribe(file, {
        filename: `review.${ext}`,
        prompt: `A spoken customer review of ${companyName}.`,
      })
    } catch (err) {
      console.error('[review/transcribe] Whisper error', err instanceof Error ? err.message : err)
      return Response.json({ ok: false, error: 'Transcription failed. You can still write your review manually.' }, { status: 502 })
    }

    if (transcript.trim().split(/\s+/).filter(Boolean).length < 5) {
      return Response.json({ ok: false, code: 'audio_unclear', error: 'The audio was too short or unclear. Try recording again or write it manually.' }, { status: 400 })
    }

    /* 2 — Llama: transcript → polished English review + rating, as JSON. */
    let text = ''
    try {
      text = await groqChat({
        prompt: buildPrompt(companyName, transcript),
        json: true,
        temperature: 0.35,
        maxTokens: 2048,
      })
    } catch (err) {
      console.error('[review/transcribe] Groq chat error', err instanceof Error ? err.message : err)
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
