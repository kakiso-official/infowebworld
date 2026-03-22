'use client'
import { useState } from 'react'
import { verifyCredentials, setSession } from '../utils/hash'

export default function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const locked = attempts >= 5

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (locked || loading) return
    setLoading(true); setErr('')
    const ok = await verifyCredentials(user, pass)
    if (ok) { setSession(); onSuccess() }
    else { setAttempts(a => a + 1); setErr(attempts >= 4 ? 'Too many attempts. Refresh page.' : 'Invalid credentials.') }
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', height: 48, padding: '0 1rem', borderRadius: 14,
    border: '1.5px solid var(--h-border)', background: 'var(--h-bg)',
    fontSize: '.85rem', color: 'var(--h-heading)', outline: 'none',
    fontFamily: "var(--font-nunito), 'Nunito', sans-serif",
    transition: 'border-color .3s, box-shadow .3s, background .3s',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'var(--h-bg)' }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ background: '#fff', borderRadius: 24, border: '1.5px solid var(--h-border)', padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,.04)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <img src="/infowebworld/logo/infowebworld-logo.png" alt="IWW" style={{ height: 28, margin: '0 auto .85rem' }} />
            <h1 style={{ fontFamily: "var(--font-bricolage), 'Bricolage Grotesque', sans-serif", fontSize: '1.25rem', fontWeight: 800, color: 'var(--h-heading)', letterSpacing: '-.02em' }}>Admin Portal</h1>
            <p style={{ fontSize: '.72rem', color: 'var(--h-muted)', marginTop: '.25rem' }}>Authorized access only</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '.72rem', fontWeight: 700, color: 'var(--h-heading)', marginBottom: '.4rem' }}>Username</label>
              <input type="text" autoComplete="username" value={user} onChange={e => setUser(e.target.value)} style={inputStyle} disabled={locked}
                onFocus={e => { e.currentTarget.style.borderColor = '#E8553D'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(232,85,61,.08)'; e.currentTarget.style.background = '#fff' }}
                onBlur={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.background = '' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '.72rem', fontWeight: 700, color: 'var(--h-heading)', marginBottom: '.4rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={show ? 'text' : 'password'} autoComplete="current-password" value={pass} onChange={e => setPass(e.target.value)} style={{ ...inputStyle, paddingRight: '3rem' }} disabled={locked}
                  onFocus={e => { e.currentTarget.style.borderColor = '#E8553D'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(232,85,61,.08)'; e.currentTarget.style.background = '#fff' }}
                  onBlur={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.background = '' }}
                />
                <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--h-muted)', padding: 4 }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {show ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></> : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {err && <div style={{ marginBottom: '1rem', padding: '.5rem .75rem', borderRadius: 12, background: 'rgba(232,85,61,.08)', color: '#E8553D', fontSize: '.72rem', fontWeight: 600 }}>{err}</div>}

          <button type="submit" disabled={!user || !pass || locked || loading}
            style={{ width: '100%', height: 48, borderRadius: 999, border: 'none', background: '#E8553D', color: '#fff', fontSize: '.85rem', fontWeight: 700, cursor: !user || !pass || locked || loading ? 'not-allowed' : 'pointer', opacity: !user || !pass || locked || loading ? .4 : 1, fontFamily: "var(--font-nunito), 'Nunito', sans-serif", transition: 'all .3s' }}>
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <a href="/" style={{ fontSize: '.72rem', color: 'var(--h-muted)' }}>Back to site</a>
        </div>
      </form>
    </div>
  )
}
