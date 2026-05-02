import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { queryOne } from '@/lib/db'
import { USER_COOKIE_NAME } from '@/lib/user-auth'
import { getUserPlan } from '@/lib/user-plan'
import { canAccess, TIER_LABEL, type PlanTier } from '@/lib/user-plan-types'
import { countryHref } from '@/app/config/countries'
import { SECTIONS, FEATURES, type Feature } from '../../features'
import { I, ic, type IconKey } from '../../../components/icons'

export const dynamic = 'force-dynamic'

/** Pricing copy used on upgrade CTAs. */
const TIER_PRICE_SHORT: Record<PlanTier, string> = {
  lifetime: '$239',
  yearly: '$99/yr',
  starter: '$49',
  free: 'Free',
}

/** Full tier name shown on tile pills. */
const TIER_PILL_LABEL: Record<PlanTier, string> = {
  lifetime: 'LIFETIME',
  yearly: 'EARLY ADOPTER',
  starter: 'STARTER',
  free: 'FREE',
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ key: string }>
}) {
  const { key  } = await params; const country = ""

  const store = await cookies()
  const token = store.get(USER_COOKIE_NAME)?.value
  if (!token) redirect(countryHref(country, '/business'))

  const user = await queryOne<{ id: number }>(
    `SELECT u.id FROM business_sessions s JOIN business_users u ON u.id = s.user_id
     WHERE s.token = ? AND s.expires_at > NOW() LIMIT 1`,
    [token]
  )
  if (!user) redirect(countryHref(country, '/business'))

  const section = SECTIONS.find(s => s.key === key)
  if (!section) notFound()

  const plan = await getUserPlan(user.id)
  const all = FEATURES.filter(f => f.sectionKey === key)

  const included = all.filter(f => canAccess(plan.tier, f.requiredTier))
  // Segment locked features by which tier unlocks them — gives the user a
  // clear "what you'd get at each tier" upgrade path instead of one big bucket.
  const lockedTiers: PlanTier[] = (['starter', 'yearly', 'lifetime'] as PlanTier[])
    .filter(t => !canAccess(plan.tier, t))
  const lockedByTier: Record<PlanTier, Feature[]> = {
    lifetime: [], yearly: [], starter: [], free: [],
  }
  for (const f of all) {
    if (!canAccess(plan.tier, f.requiredTier)) {
      lockedByTier[f.requiredTier].push(f)
    }
  }

  const pct = all.length > 0 ? (included.length / all.length) * 100 : 0

  return (
    <div className="sec-page" style={{ ['--sec-color' as string]: section.color }}>
      <Link href={countryHref(country, '/dashboard')} className="sec-back">
        <I d={ic.arrowLeft} size={12} sw={2} />
        <span>Dashboard</span>
      </Link>

      {/* ── Header ── */}
      <header className="sec-head">
        <div className="sec-hero">
          <div className="sec-icon" aria-hidden="true">
            <I d={ic[section.iconKey as IconKey] || ic.grid} size={22} sw={1.8} />
          </div>
          <div className="sec-hero-text">
            <h1 className="sec-title">{section.title}</h1>
            <p className="sec-blurb">{section.blurb}</p>
          </div>
        </div>

        <div className="sec-stats">
          <div className="sec-stats-row">
            <div className="sec-stats-text">
              <strong>{included.length}</strong>
              <span> of {all.length} features unlocked </span>
              <span className="sec-stats-plan">
                · on <strong>{plan.label}</strong> plan
              </span>
            </div>
            {plan.tier !== 'lifetime' && (
              <Link href={countryHref(country, '/business/plans')} className="sec-stats-upgrade">
                Upgrade
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            )}
          </div>
          <div className="sec-stats-bar" aria-hidden="true">
            <span style={{ width: `${pct}%` }} />
          </div>
        </div>
      </header>

      {/* ── Included on your plan ── */}
      {included.length > 0 && (
        <section className="sec-group">
          <header className="sec-group-head">
            <span className="sec-group-title">
              Included in <strong>{plan.label}</strong>
            </span>
            <span className="sec-group-count sec-group-count--on">{included.length}</span>
          </header>
          <div className="sec-grid">
            {included.map((f, i) => (
              <UnlockedTile key={f.slug} country={country} feature={f} index={i + 1} />
            ))}
          </div>
        </section>
      )}

      {/* ── Locked groups, split by required tier ── */}
      {lockedTiers.map(tier => {
        const rows = lockedByTier[tier]
        if (rows.length === 0) return null
        return (
          <section key={tier} className={`sec-group sec-group--${tier}`}>
            <header className="sec-group-head">
              <span className="sec-group-title">
                Unlock with <strong>{TIER_LABEL[tier]}</strong>
              </span>
              <span className={`sec-group-count sec-group-count--${tier}`}>{rows.length}</span>
              <Link
                href={countryHref(country, '/business/plans')}
                className={`sec-group-cta sec-group-cta--${tier}`}
              >
                Unlock for {TIER_PRICE_SHORT[tier]}
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </header>
            <div className="sec-grid">
              {rows.map((f, i) => (
                <LockedTile
                  key={f.slug}
                  country={country}
                  feature={f}
                  index={i + 1}
                  tier={tier}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

/* ────────────────────── Unlocked tile ────────────────────── */

function UnlockedTile({
  country, feature, index,
}: { country: string; feature: Feature; index: number }) {
  return (
    <Link
      href={countryHref(country, `/dashboard/feature/${feature.slug}`)}
      className="sec-tile sec-tile--on"
    >
      <div className="sec-tile-wash" aria-hidden="true" />

      <div className="sec-tile-top">
        <span className="sec-tile-num" aria-hidden="true">
          {String(index).padStart(2, '0')}
        </span>
        <span className="sec-tile-status sec-tile-status--on">
          <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Active</span>
        </span>
      </div>

      <h3 className="sec-tile-label">{feature.label}</h3>

      <div className="sec-tile-foot">
        <span className="sec-tile-action sec-tile-action--on">
          Open
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
        <span className="sec-tile-tier sec-tile-tier--included">
          {TIER_PILL_LABEL[feature.requiredTier]}
        </span>
      </div>
    </Link>
  )
}

/* ────────────────────── Locked / upgrade tile ────────────────────── */

function LockedTile({
  country, feature, index, tier,
}: { country: string; feature: Feature; index: number; tier: PlanTier }) {
  return (
    <Link
      href={countryHref(country, `/dashboard/feature/${feature.slug}`)}
      className={`sec-tile sec-tile--off sec-tile--${tier}`}
    >
      {/* Diagonal shimmer strip — gives locked tiles a premium "gated" shine. */}
      <div className="sec-tile-shine" aria-hidden="true" />

      <div className="sec-tile-top">
        <span className="sec-tile-num" aria-hidden="true">
          {String(index).padStart(2, '0')}
        </span>
        <span className={`sec-tile-status sec-tile-status--${tier}`}>
          <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          <span>Premium</span>
        </span>
      </div>

      <h3 className="sec-tile-label">{feature.label}</h3>

      <div className="sec-tile-foot">
        <span className={`sec-tile-action sec-tile-action--${tier}`}>
          Upgrade
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
        <span className={`sec-tile-tier sec-tile-tier--${tier}`}>
          {TIER_PILL_LABEL[tier]}
          <span className="sec-tile-price">· {TIER_PRICE_SHORT[tier]}</span>
        </span>
      </div>
    </Link>
  )
}
