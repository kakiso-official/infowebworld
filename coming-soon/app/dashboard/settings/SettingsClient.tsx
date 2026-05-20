'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { UserPlan } from '@/lib/user-plan-types'

interface UserView {
  uuid: string
  email: string
  name: string | null
  avatarUrl: string | null
  provider: string
  emailVerified: boolean
  createdAt: string
}

interface Props {
  user: UserView
  plan: UserPlan
  sessionsCount: number
}

const PROVIDER_LABEL: Record<string, string> = {
  email: 'Email & password',
  google: 'Google',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  reddit: 'Reddit',
  x: 'X (Twitter)',
}

/**
 * Settings — compact Goodfirms-style cards. Each card is one logical group
 * with read-only metadata and one editable / actionable row. Inline name
 * editing patches /api/auth/me; sign-out-everywhere hits /api/auth/logout-all.
 * Avatars are read-only here — they come from the OAuth provider.
 */
export default function SettingsClient({ user, plan, sessionsCount }: Props) {
  const router = useRouter()
  const [name, setName] = useState(user.name || '')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(user.name || '')
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [signingOutAll, setSigningOutAll] = useState(false)

  const initials = (user.name || user.email).slice(0, 2).toUpperCase()
  const memberSince = new Date(user.createdAt).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  const saveName = async () => {
    const trimmed = draft.trim()
    if (!trimmed) { setErr('Name cannot be empty'); return }
    setSaving(true); setErr(null)
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) {
        setErr(data.error || 'Could not save')
        setSaving(false)
        return
      }
      setName(trimmed)
      setEditing(false)
      setSavedAt(Date.now())
      router.refresh()
    } catch {
      setErr('Network error')
    } finally {
      setSaving(false)
    }
  }

  const signOutEverywhere = async () => {
    if (!confirm('Sign out of every device, including this one?')) return
    setSigningOutAll(true)
    try {
      await fetch('/api/auth/logout-all', { method: 'POST' })
      router.push('/')
      router.refresh()
    } catch {
      setSigningOutAll(false)
    }
  }

  return (
    <div className="set-stack">
      {/* ── Profile ── */}
      <section className="set-card">
        <header className="set-card-head">
          <h2 className="set-card-title">Profile</h2>
          <p className="set-card-sub">How you appear across InfoWebWorld.</p>
        </header>

        <div className="set-profile">
          <div className="set-avatar">
            {user.avatarUrl
              ? <img src={user.avatarUrl} alt="" />
              : <span>{initials}</span>}
          </div>
          <div className="set-profile-body">
            <div className="set-profile-name">{name || <em className="set-muted">no name yet</em>}</div>
            <div className="set-profile-email">{user.email}</div>
          </div>
        </div>

        <div className="set-rows">
          <div className="set-row">
            <div className="set-row-info">
              <span className="set-row-lbl">Display name</span>
              {!editing && <span className="set-row-val">{name || <em className="set-muted">not set</em>}</span>}
              {editing && (
                <div className="set-row-edit">
                  <input
                    type="text"
                    className="set-input"
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    placeholder="Your name"
                    maxLength={120}
                    autoFocus
                  />
                  {err && <span className="set-row-err">{err}</span>}
                </div>
              )}
            </div>
            <div className="set-row-actions">
              {!editing && (
                <button
                  type="button"
                  className="set-link"
                  onClick={() => { setDraft(name); setEditing(true); setErr(null) }}
                >
                  Edit
                </button>
              )}
              {editing && (
                <>
                  <button
                    type="button"
                    className="set-link set-link--muted"
                    onClick={() => { setEditing(false); setErr(null) }}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="set-btn"
                    onClick={saveName}
                    disabled={saving || draft.trim() === name.trim()}
                  >
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                </>
              )}
              {!editing && savedAt && (Date.now() - savedAt) < 4000 && (
                <span className="set-row-saved">Saved</span>
              )}
            </div>
          </div>

          <div className="set-row">
            <div className="set-row-info">
              <span className="set-row-lbl">Email</span>
              <span className="set-row-val">
                {user.email}
                {user.emailVerified
                  ? <span className="set-pill set-pill--ok">Verified</span>
                  : <span className="set-pill set-pill--warn">Unverified</span>}
              </span>
            </div>
          </div>

          <div className="set-row">
            <div className="set-row-info">
              <span className="set-row-lbl">Signed in with</span>
              <span className="set-row-val">{PROVIDER_LABEL[user.provider] || user.provider}</span>
            </div>
          </div>

          <div className="set-row">
            <div className="set-row-info">
              <span className="set-row-lbl">Member since</span>
              <span className="set-row-val">{memberSince}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Plan ── */}
      <section className="set-card">
        <header className="set-card-head">
          <h2 className="set-card-title">Plan</h2>
          <p className="set-card-sub">Your current InfoWebWorld plan.</p>
        </header>
        <div className="set-rows">
          <div className="set-row">
            <div className="set-row-info">
              <span className="set-row-lbl">Current plan</span>
              <span className="set-row-val">
                {plan.label}
                {plan.tier === 'free' && <span className="set-pill set-pill--muted">Free</span>}
                {plan.tier !== 'free' && <span className="set-pill set-pill--accent">Paid</span>}
              </span>
            </div>
            <div className="set-row-actions">
              {plan.tier === 'lifetime'
                ? <span className="set-muted">All features unlocked</span>
                : <Link href="/business/plans" className="set-btn">Upgrade</Link>}
            </div>
          </div>
        </div>
      </section>

      {/* ── Security ── */}
      <section className="set-card">
        <header className="set-card-head">
          <h2 className="set-card-title">Security</h2>
          <p className="set-card-sub">Sessions and account access.</p>
        </header>
        <div className="set-rows">
          <div className="set-row">
            <div className="set-row-info">
              <span className="set-row-lbl">Active sessions</span>
              <span className="set-row-val">
                {sessionsCount} {sessionsCount === 1 ? 'device' : 'devices'}
              </span>
            </div>
            <div className="set-row-actions">
              <button
                type="button"
                className="set-btn set-btn--danger"
                onClick={signOutEverywhere}
                disabled={signingOutAll}
              >
                {signingOutAll ? 'Signing out…' : 'Sign out everywhere'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Support ── */}
      <section className="set-card">
        <header className="set-card-head">
          <h2 className="set-card-title">Support</h2>
          <p className="set-card-sub">Need help? We&rsquo;re here.</p>
        </header>
        <div className="set-rows">
          <div className="set-row">
            <div className="set-row-info">
              <span className="set-row-lbl">Contact us</span>
              <span className="set-row-val">
                <Link href="/contact" className="set-link">Open contact form</Link>
              </span>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
