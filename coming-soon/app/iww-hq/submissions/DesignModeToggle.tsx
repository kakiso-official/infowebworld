'use client'

import { useState } from 'react'
import { CATEGORIES } from '../../config/categories-data'
import { updateSubmissionDesignMode } from '../data/submissions-storage'

/* ──────────────────────────────────────────────────────────────────────
   Admin design switch — LOCAL-BUSINESS listings only.

   A local-business listing renders Yelp-style by default (LocalBusinessCard
   on category pages + LocalBusinessProfilePage on /profile). This lets an
   admin flip a single listing to the standard design instead — the regular
   listing card + the existing /profile CompanyDetailPage every other listing
   uses. Writes only submissions.lb_design_mode via the focused
   PATCH /api/admin/submissions/[id]/design endpoint.

   The control only renders when the listing's category sits in the
   local-businesses sector (resolved from the committed taxonomy), so it never
   appears on any other sector's listings.
   ────────────────────────────────────────────────────────────────────── */

/** Slugs of every category in the local-businesses sector (any level). */
const LOCAL_CATEGORY_SLUGS = new Set(
  CATEGORIES.filter(c => c.sector_slug === 'local-businesses').map(c => c.slug)
)

export default function DesignModeToggle({
  submissionId, categorySlug, current, busy, onSaved, flash,
}: {
  submissionId: string
  categorySlug: string
  current: 'yelp' | 'classic'
  busy: boolean
  onSaved: () => void | Promise<void>
  flash: (kind: 'ok' | 'err', msg: string) => void
}) {
  const [mode, setMode] = useState<'yelp' | 'classic'>(current === 'classic' ? 'classic' : 'yelp')
  const [saving, setSaving] = useState(false)

  /* Local-business listings only — hidden everywhere else. */
  if (!categorySlug || !LOCAL_CATEGORY_SLUGS.has(categorySlug)) return null

  const choose = async (next: 'yelp' | 'classic') => {
    if (next === mode || saving) return
    const prev = mode
    setMode(next) // optimistic
    setSaving(true)
    try {
      const res = await updateSubmissionDesignMode(submissionId, next)
      if (!res?.ok) {
        setMode(prev)
        flash('err', res?.error || 'Could not change the design.')
        return
      }
      flash('ok', next === 'yelp' ? 'Now using the Yelp-style design.' : 'Now using the standard company profile.')
      await onSaved()
    } catch {
      setMode(prev)
      flash('err', 'Network error.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="sub-sec">
      <header className="sub-sec-h">
        <h3 className="sub-sec-title">Listing design</h3>
        <span className="sub-sec-sub">Local business only — sets the category card &amp; the /profile page</span>
      </header>

      <div className="sub-switch" role="group" aria-label="Listing design">
        <button
          type="button"
          className={'sub-switch-btn' + (mode === 'yelp' ? ' is-active' : '')}
          disabled={busy || saving || mode === 'yelp'}
          onClick={() => choose('yelp')}
        >
          Yelp-style {current === 'yelp' && '(default)'}
        </button>
        <button
          type="button"
          className={'sub-switch-btn' + (mode === 'classic' ? ' is-active' : '')}
          disabled={busy || saving || mode === 'classic'}
          onClick={() => choose('classic')}
        >
          Standard profile
        </button>
      </div>

      <p style={{ margin: '12px 0 0', fontSize: 12, color: 'var(--mute)', lineHeight: 1.5 }}>
        <strong>Yelp-style</strong> is the default for local businesses (photo hero, hours, map).{' '}
        <strong>Standard profile</strong> shows this business in the same /profile company page your
        other listings use. Live listings refresh on the next deploy — use “Rebuild static” above to
        apply it now.
      </p>
    </section>
  )
}
