'use client'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { refreshAuth } from '@/lib/use-auth'
import { I, ic } from '../icons'

type Mode = 'signup' | 'login'
type Step = 'form' | 'otp'

interface Props {
  open: boolean
  onClose: () => void
  nextUrl?: string
  onSuccess?: () => void
  initialMode?: Mode
}

const RESEND_COOLDOWN = 60 // must match the server

export default function SignupModal({ open, onClose, nextUrl, onSuccess, initialMode = 'signup' }: Props) {
  const [mounted, setMounted] = useState(false)
  const [mode, setMode] = useState<Mode>(initialMode)
  const [step, setStep] = useState<Step>('form')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [code, setCode] = useState('')
  const [resendIn, setResendIn] = useState(0)
  const [info, setInfo] = useState('')

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])

  // Reset everything when the modal opens
  useEffect(() => {
    if (open) {
      setMode(initialMode)
      setStep('form')
      setError(''); setInfo('')
      setEmail(''); setPassword(''); setConfirmPassword(''); setCode('')
      setResendIn(0)
    }
  }, [open, initialMode])

  // Resend countdown tick
  useEffect(() => {
    if (resendIn <= 0) return
    const t = setInterval(() => setResendIn(s => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [resendIn])

  if (!mounted || !open) return null

  const isSignup = mode === 'signup'

  /**
   * Google sign-in opens as a centered popup (Firebase/Slack-style) so the
   * main page stays in context. On message back from the popup we either
   * fire onSuccess or navigate to the post-auth URL. Falls back to a full
   * redirect if the popup is blocked.
   */
  const startGoogle = () => {
    const qp = new URLSearchParams({ popup: '1' })
    if (nextUrl) qp.set('next', nextUrl)
    const authUrl = `/api/auth/google/start?${qp.toString()}`

    const width = 500
    const height = 640
    const left = Math.round((window.screen.width - width) / 2)
    const top = Math.round((window.screen.height - height) / 2)
    const popup = window.open(
      authUrl,
      'iww-google-signin',
      `width=${width},height=${height},left=${left},top=${top},popup=1,noopener=no`
    )

    // Popup blocked (ad-blocker or strict browser settings) — fall through
    // to full-page redirect so sign-in still works.
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      window.location.href = authUrl.replace('popup=1&', '').replace('popup=1', '')
      return
    }

    setError('')
    setBusy(true)

    const cleanup = () => {
      window.removeEventListener('message', onMessage)
      clearInterval(poll)
      setBusy(false)
    }

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return
      const data = e.data
      if (!data || typeof data !== 'object') return
      if (data.type === 'iww-auth-success') {
        cleanup()
        try { popup.close() } catch {}
        /* No-reload success path: sync the shared useAuth() cache so every
           mounted component sees the new session without a page reload. */
        if (onSuccess) { refreshAuth(); onSuccess() }
        else {
          const target = data.next || nextUrl
          if (target) window.location.href = target
          else window.location.reload()
        }
      } else if (data.type === 'iww-auth-error') {
        cleanup()
        try { popup.close() } catch {}
        setError('Sign-in couldn\'t complete. Please try again.')
      }
    }
    window.addEventListener('message', onMessage)

    // If the user closes the popup without finishing, reset the modal state.
    const poll = setInterval(() => {
      if (popup.closed) cleanup()
    }, 500)
  }

  /** Submit the form step. Signup → request OTP. Login → direct login. */
  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (isSignup) {
      if (password.length < 8) {
        setError('Password must be at least 8 characters.')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }

      setBusy(true)
      try {
        const res = await fetch('/api/auth/signup-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, confirmPassword }),
        })
        const j = await res.json()
        if (!res.ok || !j.ok) { setError(j.error || 'Could not send verification code.'); setBusy(false); return }

        setStep('otp')
        setCode('')
        setInfo(j.message || `We sent a 6-digit code to ${email}.`)
        setResendIn(RESEND_COOLDOWN)
        setBusy(false)
      } catch {
        setError('Network error. Please try again.')
        setBusy(false)
      }
      return
    }

    // Login path
    setBusy(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const j = await res.json()
      if (!res.ok || !j.ok) { setError(j.error || 'Something went wrong.'); setBusy(false); return }
      if (onSuccess) { refreshAuth(); onSuccess() }
      else if (nextUrl) window.location.href = nextUrl
      else window.location.reload()
    } catch {
      setError('Network error. Please try again.')
      setBusy(false)
    }
  }

  /** Submit the OTP step → account is created on success. */
  const submitOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit code from your email.')
      return
    }
    setBusy(true)
    try {
      const res = await fetch('/api/auth/signup-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })
      const j = await res.json()
      if (!res.ok || !j.ok) { setError(j.error || 'Verification failed.'); setBusy(false); return }
      if (onSuccess) { refreshAuth(); onSuccess() }
      else if (nextUrl) window.location.href = nextUrl
      else window.location.reload()
    } catch {
      setError('Network error. Please try again.')
      setBusy(false)
    }
  }

  /** Ask the server for a new OTP (respects cooldown on both sides). */
  const resendOtp = async () => {
    if (resendIn > 0 || busy) return
    setError(''); setInfo('')
    setBusy(true)
    try {
      const res = await fetch('/api/auth/signup-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, confirmPassword }),
      })
      const j = await res.json()
      if (!res.ok || !j.ok) { setError(j.error || 'Could not resend code.'); setBusy(false); return }
      setInfo(`New code sent to ${email}.`)
      setResendIn(RESEND_COOLDOWN)
      setCode('')
      setBusy(false)
    } catch {
      setError('Network error. Please try again.')
      setBusy(false)
    }
  }

  return createPortal(
    <div className="sm-overlay" onClick={onClose}>
      <div className="sm-modal" onClick={e => e.stopPropagation()} role="dialog"
        aria-label={isSignup ? 'Sign up' : 'Sign in'}>

        <button className="sm-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {step === 'form' ? (
          <FormStep
            isSignup={isSignup}
            email={email} setEmail={setEmail}
            password={password} setPassword={setPassword}
            confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
            busy={busy} error={error}
            onSubmit={submitForm}
            onGoogle={startGoogle}
            onSwitch={() => { setMode(isSignup ? 'login' : 'signup'); setError('') }}
          />
        ) : (
          <OtpStep
            email={email} code={code} setCode={setCode}
            busy={busy} error={error} info={info}
            resendIn={resendIn}
            onSubmit={submitOtp}
            onResend={resendOtp}
            onBack={() => { setStep('form'); setError(''); setInfo(''); setCode('') }}
          />
        )}
      </div>
    </div>,
    document.body
  )
}

/* ─────────────────────── Form step ─────────────────────── */

function FormStep(props: {
  isSignup: boolean
  email: string; setEmail: (v: string) => void
  password: string; setPassword: (v: string) => void
  confirmPassword: string; setConfirmPassword: (v: string) => void
  busy: boolean; error: string
  onSubmit: (e: React.FormEvent) => void
  onGoogle: () => void
  onSwitch: () => void
}) {
  const { isSignup, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword,
    busy, error, onSubmit, onGoogle, onSwitch } = props

  return (
    <>
      <div className="sm-head">
        <div className="sm-badge" aria-hidden="true">
          <I d={ic.briefcase} size={24} sw={2} />
        </div>
        <h2 className="sm-title">{isSignup ? 'Create your account' : 'Welcome back'}</h2>
        <p className="sm-sub">
          {isSignup ? 'Start listing your business in under a minute.' : 'Sign in to manage your listings.'}
        </p>
      </div>

      <button type="button" className="sm-google" onClick={onGoogle} aria-label="Continue with Google">
        <GoogleIcon />
        <span>Continue with Google</span>
      </button>

      <div className="sm-divider"><span>or {isSignup ? 'sign up' : 'sign in'} with email</span></div>

      <form className="sm-form" onSubmit={onSubmit}>
        <label className="sm-field">
          <span className="sm-label">Email address</span>
          <input type="email" className="sm-input" value={email} required
            onChange={e => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" />
        </label>

        <label className="sm-field">
          <span className="sm-label">Password</span>
          <input type="password" className="sm-input" value={password} required minLength={8}
            onChange={e => setPassword(e.target.value)}
            placeholder={isSignup ? 'At least 8 characters' : 'Your password'}
            autoComplete={isSignup ? 'new-password' : 'current-password'} />
        </label>

        {isSignup && (
          <label className="sm-field">
            <span className="sm-label">Confirm password</span>
            <input type="password" className="sm-input" value={confirmPassword} required minLength={8}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password" autoComplete="new-password" />
          </label>
        )}

        {error && (
          <div className="sm-error" role="alert">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="13" /><line x1="12" y1="16.5" x2="12" y2="16.6" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <button type="submit" className="sm-submit" disabled={busy}>
          {busy ? (
            <span className="sm-spin" aria-hidden="true" />
          ) : (
            <>
              {isSignup ? 'Send verification code' : 'Sign in'}
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </>
          )}
        </button>
      </form>

      <div className="sm-foot">
        {isSignup ? (
          <>Already a member? <button type="button" onClick={onSwitch}>Sign in</button></>
        ) : (
          <>New here? <button type="button" onClick={onSwitch}>Create an account</button></>
        )}
      </div>

      <p className="sm-legal">
        By continuing you agree to our <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>.
      </p>
    </>
  )
}

/* ─────────────────────── OTP step ─────────────────────── */

function OtpStep(props: {
  email: string
  code: string; setCode: (v: string) => void
  busy: boolean; error: string; info: string
  resendIn: number
  onSubmit: (e: React.FormEvent) => void
  onResend: () => void
  onBack: () => void
}) {
  const { email, code, setCode, busy, error, info, resendIn, onSubmit, onResend, onBack } = props
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])
  const digits = code.padEnd(6, ' ').split('').slice(0, 6)

  // Auto-focus the first empty box when we enter the OTP step or after a reset.
  useEffect(() => {
    const firstEmpty = digits.findIndex(d => d === ' ')
    const idx = firstEmpty === -1 ? 5 : firstEmpty
    inputsRef.current[idx]?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code.length === 0])

  const setDigitAt = (idx: number, raw: string) => {
    const v = raw.replace(/\D/g, '').slice(0, 1)
    const arr = digits.slice()
    arr[idx] = v || ' '
    const next = arr.join('').replace(/\s+$/, '')
    setCode(next)
    if (v && idx < 5) inputsRef.current[idx + 1]?.focus()
  }

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[idx].trim() && idx > 0) {
      inputsRef.current[idx - 1]?.focus()
      const arr = digits.slice()
      arr[idx - 1] = ' '
      setCode(arr.join('').replace(/\s+$/, ''))
      e.preventDefault()
    }
    if (e.key === 'ArrowLeft' && idx > 0) { inputsRef.current[idx - 1]?.focus(); e.preventDefault() }
    if (e.key === 'ArrowRight' && idx < 5) { inputsRef.current[idx + 1]?.focus(); e.preventDefault() }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length) {
      e.preventDefault()
      setCode(pasted)
      inputsRef.current[Math.min(pasted.length, 5)]?.focus()
    }
  }

  return (
    <>
      <div className="sm-head">
        <div className="sm-badge" aria-hidden="true">
          <I d={ic.messageCircle} size={24} sw={2} />
        </div>
        <h2 className="sm-title">Check your inbox</h2>
        <p className="sm-sub">
          We sent a 6-digit code to <strong style={{ color: 'var(--h-heading)' }}>{email}</strong>
        </p>
      </div>

      {info && <div className="sm-info" role="status">{info}</div>}

      <form className="sm-form" onSubmit={onSubmit}>
        <div className="sm-otp" onPaste={handlePaste}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <input
              key={idx}
              ref={el => { inputsRef.current[idx] = el }}
              className="sm-otp-box"
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digits[idx].trim()}
              onChange={e => setDigitAt(idx, e.target.value)}
              onKeyDown={e => handleKeyDown(idx, e)}
              aria-label={`Digit ${idx + 1}`}
              autoComplete={idx === 0 ? 'one-time-code' : 'off'}
            />
          ))}
        </div>

        {error && (
          <div className="sm-error" role="alert">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="13" /><line x1="12" y1="16.5" x2="12" y2="16.6" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <button type="submit" className="sm-submit" disabled={busy || code.length !== 6}>
          {busy ? (
            <span className="sm-spin" aria-hidden="true" />
          ) : (
            <>
              Verify &amp; create account
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </>
          )}
        </button>
      </form>

      <div className="sm-foot">
        Didn&apos;t get it?{' '}
        <button type="button" onClick={onResend} disabled={resendIn > 0 || busy}>
          {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend code'}
        </button>
      </div>

      <button type="button" className="sm-back" onClick={onBack}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
        </svg>
        <span>Use a different email</span>
      </button>
    </>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h5.9c-.3 1.4-1 2.6-2.2 3.4v2.8h3.6c2.1-1.9 3.2-4.8 3.2-8.4z"/>
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.7 1.1-2.8 0-5.2-1.9-6.1-4.5H2.2v2.8C4 20.8 7.7 23 12 23z"/>
      <path fill="#FBBC04" d="M5.9 14.1c-.2-.7-.3-1.4-.3-2.1s.1-1.4.3-2.1V7.1H2.2C1.4 8.7 1 10.3 1 12s.4 3.3 1.2 4.9l3.7-2.8z"/>
      <path fill="#EA4335" d="M12 5.5c1.6 0 3 .5 4.1 1.6l3.1-3.1C17.5 2 15 1 12 1 7.7 1 4 3.2 2.2 7.1l3.7 2.8C6.8 7.4 9.2 5.5 12 5.5z"/>
    </svg>
  )
}
