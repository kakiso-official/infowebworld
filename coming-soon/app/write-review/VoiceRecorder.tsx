'use client'

import { useEffect, useRef, useState } from 'react'

type Draft = { rating: number; title: string; body: string; language?: string }

interface Props {
  companyName: string
  onDraftReady: (draft: Draft) => void
  onCancel: () => void
}

type Phase = 'idle' | 'requesting' | 'recording' | 'processing' | 'error'

const MAX_SECONDS = 180  // 3-minute cap matches the server-side size limit
const MIN_SECONDS = 3

function pickMime(): string {
  /* Prefer Opus in WebM (best Chrome/Firefox default + great compression),
     fall back to whatever the browser supports. Safari typically lands on
     audio/mp4. */
  if (typeof MediaRecorder === 'undefined') return ''
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4',
    'audio/wav',
  ]
  for (const m of candidates) {
    try { if (MediaRecorder.isTypeSupported(m)) return m } catch {}
  }
  return ''
}

/**
 * Live voice review recorder.
 *
 * Workflow:
 *   1. User clicks the big mic — we ask for permission, start MediaRecorder.
 *   2. Live timer + animated audio-level halo.
 *   3. User clicks stop (or hits the 3-min cap).
 *   4. Audio blob is POSTed to /api/review/transcribe; we never persist it
 *      locally, and the server discards it after Gemini returns the draft.
 *   5. Draft bubbles up to the parent (-> ReviewEditor for confirm/edit).
 */
export default function VoiceRecorder({ companyName, onDraftReady, onCancel }: Props) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [error, setError] = useState('')
  const [seconds, setSeconds] = useState(0)
  const [level, setLevel] = useState(0)  // 0-1, drives the pulsing halo

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const startedAtRef = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const rafRef = useRef<number | null>(null)

  /* Tear down everything on unmount. */
  useEffect(() => {
    return () => { cleanup() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cleanup = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    if (rafRef.current != null) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {})
      audioCtxRef.current = null
    }
    analyserRef.current = null
    mediaRecorderRef.current = null
  }

  const startRecording = async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setError('Your browser does not support audio recording.')
      setPhase('error')
      return
    }
    const mime = pickMime()
    if (!mime) {
      setError('No supported audio format on this browser.')
      setPhase('error')
      return
    }

    setPhase('requesting')
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      /* Audio-level meter via WebAudio AnalyserNode — feeds the pulsing
         halo so the user knows we're actually hearing them. */
      const Ctx = (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext || AudioContext
      const ac = new Ctx()
      audioCtxRef.current = ac
      const src = ac.createMediaStreamSource(stream)
      const analyser = ac.createAnalyser()
      analyser.fftSize = 256
      src.connect(analyser)
      analyserRef.current = analyser

      const buf = new Uint8Array(analyser.frequencyBinCount)
      const tick = () => {
        analyser.getByteTimeDomainData(buf)
        let sum = 0
        for (let i = 0; i < buf.length; i++) {
          const v = (buf[i] - 128) / 128
          sum += v * v
        }
        const rms = Math.sqrt(sum / buf.length)
        setLevel(Math.min(1, rms * 3))
        rafRef.current = requestAnimationFrame(tick)
      }
      tick()

      const mr = new MediaRecorder(stream, { mimeType: mime })
      chunksRef.current = []
      mr.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onerror = () => {
        setError('Recording failed.')
        setPhase('error')
        cleanup()
      }
      mr.onstop = () => onRecordingStopped(mime)
      mediaRecorderRef.current = mr
      mr.start(250)  // collect chunks every 250ms

      startedAtRef.current = Date.now()
      setSeconds(0)
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000)
        setSeconds(elapsed)
        if (elapsed >= MAX_SECONDS) {
          stopRecording()
        }
      }, 250)

      setPhase('recording')
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      if (/denied|notallowed/i.test(msg)) {
        setError('Microphone access was denied. Allow microphone in your browser to record a review.')
      } else if (/notfound|requested device/i.test(msg)) {
        setError('No microphone was found. Plug one in or use the manual flow.')
      } else {
        setError('Could not access the microphone. Try the manual flow.')
      }
      setPhase('error')
      cleanup()
    }
  }

  const stopRecording = () => {
    const mr = mediaRecorderRef.current
    if (!mr) return
    if (mr.state !== 'inactive') {
      try { mr.stop() } catch {}
    }
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    if (rafRef.current != null) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    setLevel(0)
  }

  const onRecordingStopped = async (mime: string) => {
    const chunks = chunksRef.current
    chunksRef.current = []
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    const duration = Math.floor((Date.now() - startedAtRef.current) / 1000)
    if (duration < MIN_SECONDS) {
      setError(`That was only ${duration}s — please record at least ${MIN_SECONDS} seconds.`)
      setPhase('error')
      return
    }

    setPhase('processing')
    try {
      const blob = new Blob(chunks, { type: mime })
      const form = new FormData()
      form.append('audio', blob, 'review.webm')
      form.append('company', companyName)
      const r = await fetch('/api/review/transcribe', { method: 'POST', body: form })
      const j = await r.json().catch(() => ({}))
      if (!r.ok || !j.ok) {
        setError(j.error || 'Transcription failed. Try again or write it manually.')
        setPhase('error')
        return
      }
      onDraftReady(j.draft as Draft)
    } catch {
      setError('Network error. Try again.')
      setPhase('error')
    }
  }

  const retry = () => {
    setError('')
    setSeconds(0)
    setLevel(0)
    setPhase('idle')
    cleanup()
  }

  const remaining = Math.max(0, MAX_SECONDS - seconds)
  const mm = (n: number) => String(Math.floor(n / 60)).padStart(1, '0')
  const ss = (n: number) => String(n % 60).padStart(2, '0')

  /* ── Visual state machine ───────────────────────────────────────────── */

  if (phase === 'processing') {
    return (
      <div className="wr-rec wr-rec--processing">
        <div className="wr-rec-spinner" aria-hidden="true" />
        <h3 className="wr-rec-title">Transcribing your review…</h3>
        <p className="wr-rec-sub">
          We are turning what you said into a clean English review. Takes a few seconds.
        </p>
      </div>
    )
  }

  if (phase === 'error') {
    return (
      <div className="wr-rec wr-rec--error">
        <div className="wr-rec-error-ico" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="13" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="wr-rec-title">Recording didn&apos;t work</h3>
        <p className="wr-rec-sub">{error}</p>
        <div className="wr-rec-actions">
          <button type="button" className="wr-btn wr-btn--ghost" onClick={onCancel}>Back</button>
          <button type="button" className="wr-btn wr-btn--primary" onClick={retry}>Try again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="wr-rec">
      <h3 className="wr-rec-title">
        {phase === 'recording' ? "Speak now — we're listening." : "Hit record and speak your review."}
      </h3>
      <p className="wr-rec-sub">
        Mention what worked, what didn&apos;t, who&apos;d benefit. Up to 3 minutes.
        We&apos;ll auto-translate to English and you can edit everything before submitting.
      </p>

      <div className="wr-rec-stage">
        <div
          className={'wr-rec-halo' + (phase === 'recording' ? ' wr-rec-halo--on' : '')}
          style={{ transform: `scale(${1 + level * 0.5})`, opacity: phase === 'recording' ? 0.35 + level * 0.6 : 0 }}
          aria-hidden="true"
        />
        <button
          type="button"
          className={'wr-rec-btn' + (phase === 'recording' ? ' wr-rec-btn--on' : '')}
          onClick={phase === 'recording' ? stopRecording : startRecording}
          disabled={phase === 'requesting'}
          aria-label={phase === 'recording' ? 'Stop recording' : 'Start recording'}
        >
          {phase === 'recording' ? (
            <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">
              <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor" aria-hidden="true">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="8" y1="23" x2="16" y2="23"  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      <div className="wr-rec-timer" aria-live="polite">
        {phase === 'recording' ? (
          <>
            <span className="wr-rec-dot" aria-hidden="true" />
            <span className="wr-rec-time">{mm(seconds)}:{ss(seconds)}</span>
            <span className="wr-rec-remaining">{remaining}s left</span>
          </>
        ) : (
          <span className="wr-rec-hint">{phase === 'requesting' ? 'Waiting for microphone…' : 'Tap to start'}</span>
        )}
      </div>

      <div className="wr-rec-actions">
        <button type="button" className="wr-btn wr-btn--ghost" onClick={onCancel} disabled={phase === 'recording'}>
          Back
        </button>
      </div>

      <p className="wr-rec-privacy">
        🔒 No audio is uploaded or stored — only the text we generate from it.
      </p>
    </div>
  )
}
