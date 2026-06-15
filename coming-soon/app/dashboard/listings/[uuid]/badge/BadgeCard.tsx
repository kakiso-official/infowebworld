'use client'
import { useState } from 'react'

const SITE = 'https://www.infowebworld.com'

export type BadgeStatus = 'none' | 'pending' | 'verified' | 'lost'

const PILL: Record<BadgeStatus, { label: string; bg: string; fg: string }> = {
  none:     { label: 'Not added yet',                                   bg: '#F0EEEA', fg: '#6B6B6B' },
  pending:  { label: 'Waiting for badge — not found yet',          bg: '#FFF4E5', fg: '#B14820' },
  verified: { label: 'Partner ★ — badge verified',           bg: '#E6F6EF', fg: '#0E8F6E' },
  lost:     { label: 'Badge removed — re-add to keep Partner',     bg: '#FDECEC', fg: '#C0392B' },
}

export default function BadgeCard({
  slug,
  companyName,
  publicPath,
  website,
  initialStatus,
}: {
  slug: string
  companyName: string
  publicPath: string
  website: string | null
  initialStatus: BadgeStatus
}) {
  const [status, setStatus] = useState<BadgeStatus>(initialStatus)
  const [checking, setChecking] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const profileUrl = `${SITE}${publicPath}?utm_source=badge&utm_medium=referral`
  const badgeImg = `${SITE}/api/badge/${slug}.svg`
  const snippet =
`<a href="${profileUrl}" target="_blank" rel="noopener">
  <img src="${badgeImg}" alt="${companyName} — Verified on InfoWebWorld" width="220" height="64" loading="lazy">
</a>`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked — the textarea is selectable as a fallback */
    }
  }

  const verify = async () => {
    setChecking(true)
    setMsg(null)
    try {
      const res = await fetch(`/api/listings/${slug}/backlink/verify`, { method: 'POST' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMsg(data.message || 'Could not verify right now. Please try again.')
        return
      }
      setStatus(data.status)
      setMsg(
        data.found
          ? 'Verified! Your badge is live — you now have Partner status.'
          : 'We could not find the badge on your homepage yet. Make sure it is published, then try again.',
      )
    } catch {
      setMsg('Something went wrong. Please try again.')
    } finally {
      setChecking(false)
    }
  }

  const pill = PILL[status]

  return (
    <div className="dash-co-card" style={{ display: 'block', padding: 24, maxWidth: 680 }}>
      <h3 style={{ marginTop: 0 }}>Get the InfoWebWorld Partner badge</h3>
      <p style={{ color: '#6B6B6B' }}>
        Add this badge to your website (your footer is perfect — it then shows on every page).
        It tells visitors you are a verified InfoWebWorld business and unlocks your{' '}
        <strong>Partner &#9733;</strong> mark plus higher placement in our directory. One paste, that&rsquo;s it.
      </p>

      {/* Live preview */}
      <div style={{ margin: '16px 0' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={badgeImg} alt={`${companyName} badge preview`} width={220} height={64} />
      </div>

      {/* Snippet */}
      <label style={{ fontWeight: 700, fontSize: 13, display: 'block' }}>Copy this code into your site:</label>
      <textarea
        readOnly
        value={snippet}
        onFocus={(e) => e.currentTarget.select()}
        style={{
          width: '100%',
          minHeight: 92,
          fontFamily: 'monospace',
          fontSize: 12,
          padding: 12,
          marginTop: 6,
          borderRadius: 8,
          border: '1px solid #E5E2DD',
          resize: 'vertical',
        }}
      />

      <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
        <button type="button" onClick={copy} className="dash-cta-primary">
          {copied ? 'Copied ✓' : 'Copy code'}
        </button>
        <button type="button" onClick={verify} disabled={checking || !website} className="dash-list-btn">
          {checking ? 'Checking…' : 'I’ve added it — verify now'}
        </button>
        {website && (
          <a href={website} target="_blank" rel="noopener noreferrer" className="dash-list-btn dash-list-btn--ghost">
            Open my site &#8599;
          </a>
        )}
      </div>

      {/* Status */}
      <div style={{ marginTop: 18 }}>
        <span
          style={{
            background: pill.bg,
            color: pill.fg,
            padding: '6px 12px',
            borderRadius: 999,
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          {pill.label}
        </span>
        {msg && <p style={{ marginTop: 10, fontSize: 14, color: '#333' }}>{msg}</p>}
      </div>

      {!website && (
        <p style={{ marginTop: 14, color: '#B14820', fontSize: 14 }}>
          Add your website URL to this listing first — we verify the badge by checking your homepage.
        </p>
      )}
    </div>
  )
}
