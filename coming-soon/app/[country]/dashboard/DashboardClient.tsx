'use client'
import Link from 'next/link'
import type { UserPlan } from '@/lib/user-plan-types'

interface SectionCard {
  key: string
  title: string
  blurb: string
  iconKey: string
  color: string
  unlocked: number
  total: number
}

/**
 * Dashboard overview — 7 section tiles, no icons, pure-black type.
 * A thin color stripe identifies the section; the title carries the tile.
 * Layout locked to one viewport: 4 + 3 rows, no scroll anywhere.
 */
export default function DashboardClient({
  country, plan, sectionCards,
}: {
  country: string
  plan: UserPlan
  sectionCards: SectionCard[]
}) {
  const topRow = sectionCards.slice(0, 4)
  const botRow = sectionCards.slice(4)

  return (
    <div className="dash-home">
      <div className="dash-home-row">
        {topRow.map((s, i) => <SectionTile key={s.key} country={country} s={s} index={i + 1} />)}
      </div>
      <div className="dash-home-row">
        {botRow.map((s, i) => <SectionTile key={s.key} country={country} s={s} index={i + 5} />)}
      </div>
    </div>
  )
}

function SectionTile({ country, s, index }: { country: string; s: SectionCard; index: number }) {
  const href = `/${country}/dashboard/section/${s.key}`
  const pct = s.total > 0 ? (s.unlocked / s.total) * 100 : 0
  const isFull = s.unlocked === s.total
  const allLocked = s.unlocked === 0 && s.total > 0

  return (
    <Link
      href={href}
      className={
        'dash-tile' +
        (isFull ? ' dash-tile--full' : '') +
        (allLocked ? ' dash-tile--locked' : '')
      }
      style={{ ['--sec-color' as string]: s.color }}
    >
      <div className="dash-tile-top">
        <span className="dash-tile-num" aria-hidden="true">
          {String(index).padStart(2, '0')}
        </span>
        {allLocked ? (
          <span className="dash-tile-pill dash-tile-pill--lock" aria-label="All locked">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor"
              strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            Locked
          </span>
        ) : (
          <span className={`dash-tile-pill${isFull ? ' dash-tile-pill--full' : ''}`}>
            {s.unlocked}/{s.total}
          </span>
        )}
      </div>

      <h2 className="dash-tile-title">{s.title}</h2>

      <div className="dash-tile-bottom">
        <div className="dash-tile-progress" aria-hidden="true">
          <span style={{ width: `${pct}%` }} />
        </div>
        <span className="dash-tile-go" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
            strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
