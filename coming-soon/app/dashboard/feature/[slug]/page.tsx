import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { queryOne } from '@/lib/db'
import { USER_COOKIE_NAME } from '@/lib/user-auth'
import { getUserPlan, canAccess, TIER_LABEL, TIER_PRICE, type PlanTier } from '@/lib/user-plan'
import { countryHref } from '@/app/config/countries'
import { findFeature, SECTIONS } from '../../features'
import { I, ic } from '../../../components/icons'

export const dynamic = 'force-dynamic'

export default async function FeaturePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug  } = await params; const country = ""
  const store = await cookies()
  const token = store.get(USER_COOKIE_NAME)?.value
  if (!token) redirect(countryHref(country, '/business'))

  const userRow = await queryOne<{ id: number }>(
    `SELECT u.id FROM business_sessions s JOIN business_users u ON u.id = s.user_id
     WHERE s.token = ? AND s.expires_at > NOW() LIMIT 1`,
    [token]
  )
  if (!userRow) redirect(countryHref(country, '/business'))

  const feature = findFeature(slug)
  if (!feature) notFound()

  const plan = await getUserPlan(userRow.id)
  const section = SECTIONS.find(s => s.key === feature.sectionKey)
  const unlocked = canAccess(plan.tier, feature.requiredTier)

  return (
    <div className="dash dash-feat">
      <header className="ds-page-head">
        <div>
          <div className="dash-feat-crumb">
            <Link href={countryHref(country, '/dashboard')}>Dashboard</Link>
            <span className="dash-feat-sep">/</span>
            <span>{section?.title}</span>
          </div>
          <h1 className="ds-page-title">{feature.label}</h1>
          <p className="ds-page-sub">
            Part of <strong>{section?.title}</strong> · Requires{' '}
            <span className={`dash-feat-tier dash-feat-tier--${feature.requiredTier}`}>
              {TIER_LABEL[feature.requiredTier]}
            </span>
            {' '}or higher
          </p>
        </div>
        <div className="ds-page-actions">
          {unlocked ? (
            <span className="dash-feat-state dash-feat-state--on">
              <I d={ic.check} size={14} sw={2.4} /> Unlocked
            </span>
          ) : (
            <span className="dash-feat-state dash-feat-state--off">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
                strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              Locked
            </span>
          )}
        </div>
      </header>

      {unlocked
        ? <UnlockedPanel label={feature.label} sectionBlurb={section?.blurb || ''} />
        : <UpgradePanel country={country} feature={feature.label} required={feature.requiredTier} currentTier={plan.tier} />}
    </div>
  )
}

/* ──────────────────── Unlocked: build-in-progress placeholder ──────────────────── */

function UnlockedPanel({ label, sectionBlurb }: { label: string; sectionBlurb: string }) {
  return (
    <section className="dash-feat-body">
      <div className="dash-feat-placeholder">
        <div className="dash-feat-placeholder-badge">
          <I d={ic.zap} size={18} sw={2} />
          <span>Coming soon</span>
        </div>
        <h2 className="dash-feat-placeholder-title">
          {label}
        </h2>
        <p className="dash-feat-placeholder-copy">
          You've unlocked this feature. The management panel is being built and
          will appear here shortly. {sectionBlurb}
        </p>
        <div className="dash-feat-placeholder-rows">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      </div>
    </section>
  )
}

function SkeletonRow() {
  return (
    <div className="dash-feat-skel">
      <div className="dash-feat-skel-line dash-feat-skel-line--short" />
      <div className="dash-feat-skel-line" />
      <div className="dash-feat-skel-line dash-feat-skel-line--mid" />
    </div>
  )
}

/* ──────────────────── Locked: upgrade CTA ──────────────────── */

function UpgradePanel({
  country, feature, required, currentTier,
}: { country: string; feature: string; required: PlanTier; currentTier: PlanTier }) {
  // Which plans unlock this feature? Show the two cheapest options that do,
  // so users always see a path up rather than being forced to Lifetime.
  const options: Array<{ tier: PlanTier; highlight?: boolean }> = (() => {
    if (required === 'yearly') {
      return [{ tier: 'yearly', highlight: true }, { tier: 'lifetime' }]
    }
    if (required === 'starter') {
      return [{ tier: 'starter', highlight: true }, { tier: 'yearly' }]
    }
    return [{ tier: currentTier === 'free' ? 'starter' : 'yearly' }]
  })()

  return (
    <section className="dash-feat-body">
      <div className="dash-up">
        <div className="dash-up-head">
          <div className="dash-up-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          </div>
          <h2 className="dash-up-title">
            Unlock <em>{feature}</em>
          </h2>
          <p className="dash-up-sub">
            You're on the <strong>{TIER_LABEL[currentTier]}</strong> plan.
            This feature is included on <strong>{TIER_LABEL[required]}</strong> and above.
          </p>
        </div>

        <div className="dash-up-options">
          {options.map(opt => (
            <div key={opt.tier} className={`dash-up-card${opt.highlight ? ' dash-up-card--pick' : ''}`}>
              {opt.highlight && <span className="dash-up-ribbon">Recommended</span>}
              <div className="dash-up-plan-name">{TIER_LABEL[opt.tier]}</div>
              <div className="dash-up-plan-price">{TIER_PRICE[opt.tier]}</div>
              <ul className="dash-up-plan-feats">
                <li>
                  <I d={ic.check} size={14} sw={2.4} />
                  <span>This feature + every feature in its section</span>
                </li>
                <li>
                  <I d={ic.check} size={14} sw={2.4} />
                  <span>Dofollow backlink, verified badge, SEO boost</span>
                </li>
                <li>
                  <I d={ic.check} size={14} sw={2.4} />
                  <span>Cancel anytime · money-back guarantee</span>
                </li>
              </ul>
              <Link
                href={countryHref(country, `/dashboard/new?plan=${opt.tier}`)}
                className={`dash-up-cta${opt.highlight ? ' dash-up-cta--pick' : ''}`}
              >
                Upgrade to {TIER_LABEL[opt.tier]}
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
                  strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        <div className="dash-up-foot">
          Want to compare everything?{' '}
          <Link href={countryHref(country, '/business/plans')}>See the full plan comparison →</Link>
        </div>
      </div>
    </section>
  )
}
