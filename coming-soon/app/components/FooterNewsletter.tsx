'use client'
import { useState } from 'react'
import { addToWaitlist } from '../iww-hq/data/waitlist-storage'

/**
 * Footer newsletter signup — mirrors the Hero form but styled for
 * the dark footer band. Uses source='footer' so we can track where
 * conversions come from.
 */
export default function FooterNewsletter() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState<'ok' | 'dup' | ''>('')
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || busy) return
    setBusy(true)
    setMsg(''); setMsgType('')
    const result = await addToWaitlist(email, 'footer')
    if (result === 'ok') {
      setMsg("You're on the list!"); setMsgType('ok'); setEmail('')
    } else if (result === 'duplicate') {
      setMsg('Already on the waitlist!'); setMsgType('dup')
    } else {
      setMsg('Something went wrong. Try again.'); setMsgType('dup')
    }
    setBusy(false)
    setTimeout(() => { setMsg(''); setMsgType('') }, 5000)
  }

  return (
    <form className="ft-nl-form" onSubmit={onSubmit}>
      <input
        type="email"
        className="ft-nl-input"
        placeholder="your@email.com"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        aria-label="Email address"
      />
      <button
        type="submit"
        className={`ft-nl-btn${msgType === 'ok' ? ' ft-nl-btn--ok' : msgType === 'dup' ? ' ft-nl-btn--dup' : ''}`}
        disabled={busy}
      >
        {msg || (busy ? 'Sending…' : 'Subscribe')}
        {!msg && !busy && (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        )}
      </button>
    </form>
  )
}
