'use client'
import { useState, useEffect } from 'react'

const API = '/api/dashboard/stats'

type Stats = {
  totalSubmissions: number; paidMembers: number; pendingSubmissions: number; confirmedSubmissions: number
  waitlistTotal: number; totalPageViews: number; todayViews: number; todayUnique: number; totalUnique: number
}
type DashData = {
  stats: Stats
  dailyViews: number[]; dayLabels: string[]
  topPages: { page: string; cnt: number }[]
  topReferrers: { ref: string; cnt: number }[]
  byPlan: Record<string, number>
  byCat: { name: string; cnt: number }[]
  recent: { id: number; company_name: string; contact_name: string; email: string; status: string; payment_status: string; created_at: string; category: string; country: string; plan_name: string; plan_slug: string }[]
  waitlistBySrc: Record<string, number>
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function transformApiResponse(raw: any): DashData {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // dailyViews comes as [{date, views}] — extract to number[] + dayLabels
  const dvArr: any[] = raw.dailyViews || []
  const dailyViews = dvArr.map((d: any) => Number(d.views || 0))
  const dayLabels = dvArr.map((d: any) => {
    const dt = new Date(d.date)
    return days[dt.getUTCDay()] || ''
  })

  // topPages: {page, views} → {page, cnt}
  const topPages = (raw.topPages || []).map((p: any) => ({ page: p.page, cnt: Number(p.views || p.cnt || 0) }))

  // topReferrers: {referrer, count} → {ref, cnt}
  const topReferrers = (raw.topReferrers || []).map((r: any) => ({ ref: r.referrer || r.ref || '', cnt: Number(r.count || r.cnt || 0) }))

  // byPlan: [{plan, count}] → Record<string, number>
  const byPlan: Record<string, number> = {}
  for (const p of (raw.byPlan || [])) byPlan[p.plan || p.slug || ''] = Number(p.count || 0)

  // byCat: [{category, count}] → [{name, cnt}]
  const byCat = (raw.byCat || []).map((c: any) => ({ name: c.category || c.name || '', cnt: Number(c.count || c.cnt || 0) }))

  // recent: map category_name → category
  const recent = (raw.recent || []).map((s: any) => ({ ...s, category: s.category_name || s.category || '' }))

  // waitlistBySrc: [{source, count}] → Record<string, number>
  const waitlistBySrc: Record<string, number> = {}
  for (const w of (raw.waitlistBySrc || [])) waitlistBySrc[w.source || 'direct'] = Number(w.count || 0)

  return {
    stats: {
      totalSubmissions: Number(raw.totalSubmissions ?? 0),
      paidMembers: Number(raw.paidMembers ?? 0),
      pendingSubmissions: Number(raw.pendingSubmissions ?? 0),
      confirmedSubmissions: Number(raw.confirmedSubmissions ?? 0),
      waitlistTotal: Number(raw.waitlistTotal ?? 0),
      totalPageViews: Number(raw.totalPageViews ?? 0),
      todayViews: Number(raw.todayViews ?? 0),
      todayUnique: Number(raw.todayUnique ?? 0),
      totalUnique: Number(raw.totalUnique ?? 0),
    },
    dailyViews,
    dayLabels,
    topPages,
    topReferrers,
    byPlan,
    byCat,
    recent,
    waitlistBySrc,
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const statusColors: Record<string, string> = { paid: '#2FAE6A', confirmed: '#3B82F6', pending: '#F59E0B', active: '#2FAE6A', rejected: '#EF4444' }

const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid var(--h-border)', padding: '1.25rem', ...style }}>{children}</div>
)
const H = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontSize: '.78rem', fontWeight: 800, fontFamily: "var(--font-bricolage), 'Bricolage Grotesque', sans-serif", color: 'var(--h-heading)', marginBottom: '1rem' }}>{children}</h3>
)
const Pill = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <span style={{ fontSize: '.56rem', fontWeight: 700, padding: '.15rem .5rem', borderRadius: 999, background: `${color}15`, color, textTransform: 'capitalize' }}>{children}</span>
)
const Bar = ({ pct, color }: { pct: number; color: string }) => (
  <div style={{ height: 5, borderRadius: 999, background: 'var(--h-border)' }}>
    <div style={{ height: '100%', borderRadius: 999, width: `${pct}%`, background: color, transition: 'width .5s' }} />
  </div>
)

export default function Dashboard() {
  const [d, setD] = useState<DashData | null>(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    fetch(API).then(r => r.json()).then(raw => setD(transformApiResponse(raw))).catch(() => setErr('Could not load dashboard data. Check database connection.'))
  }, [])

  if (err) return <div style={{ maxWidth: 600, margin: '2rem auto', padding: '2rem', background: '#FDDDD6', borderRadius: 20, textAlign: 'center', color: '#E8553D', fontWeight: 700, fontSize: '.85rem' }}>{err}</div>
  if (!d) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--h-muted)', fontSize: '.85rem' }}>Loading real data from database...</div>

  const s = d.stats
  const maxV = Math.max(...d.dailyViews, 1)
  const maxCat = d.byCat[0]?.cnt || 1
  const maxPage = d.topPages[0]?.cnt || 1
  const maxRef = d.topReferrers[0]?.cnt || 1

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '.6rem', marginBottom: '.65rem' }}>
        {[
          { l: 'Total Views', v: s.totalPageViews, c: '#E8553D' },
          { l: 'Today', v: s.todayViews, c: '#14B8A6' },
          { l: 'Unique Visitors', v: s.totalUnique, c: '#3B82F6' },
          { l: 'Submissions', v: s.totalSubmissions, c: '#8B5CF6' },
          { l: 'Waitlist', v: s.waitlistTotal, c: '#F59E0B' },
          { l: 'Paid', v: s.paidMembers, c: '#2FAE6A' },
        ].map(c => (
          <div key={c.l} style={{ background: '#fff', borderRadius: 20, border: '1.5px solid var(--h-border)', padding: '.85rem 1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: c.c }} />
            <p style={{ fontSize: '.52rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--h-muted)', marginBottom: '.2rem' }}>{c.l}</p>
            <p style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: "var(--font-nunito)", color: 'var(--h-heading)', lineHeight: 1 }}>{c.v}</p>
          </div>
        ))}
      </div>

      {/* Row 2: Visitors chart + Plan breakdown */}
      <div className="adm-grid-2" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '.65rem', marginBottom: '.65rem' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem' }}>
            <H>Real Visitors — Last 7 Days</H>
            <span style={{ fontSize: '.58rem', fontWeight: 700, color: 'var(--h-accent)' }}>{d.dailyViews.reduce((a, b) => a + b, 0)} total</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '.4rem', height: 130 }}>
            {d.dailyViews.map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <span style={{ fontSize: '.48rem', fontWeight: 700, color: 'var(--h-muted)' }}>{v}</span>
                <div style={{ width: '100%', borderRadius: '5px 5px 0 0', height: `${Math.max((v / maxV) * 100, 4)}%`, background: i === 6 ? '#E8553D' : 'var(--h-border)', minHeight: 3, transition: 'height .5s' }} />
                <span style={{ fontSize: '.46rem', fontWeight: 600, color: 'var(--h-muted)' }}>{d.dayLabels[i]}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <H>Submissions by Plan</H>
          {[
            { label: 'Founding', slug: 'founding', color: '#E8553D' },
            { label: 'Early Adopter', slug: 'early-adopter', color: '#4361EE' },
            { label: 'Standard', slug: 'standard', color: '#2FAE6A' },
          ].map(p => (
            <div key={p.slug} style={{ marginBottom: '.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.66rem', fontWeight: 700, color: 'var(--h-heading)', marginBottom: '.25rem' }}>
                <span>{p.label}</span><span>{d.byPlan[p.slug] || 0}</span>
              </div>
              <Bar pct={s.totalSubmissions ? ((d.byPlan[p.slug] || 0) / s.totalSubmissions) * 100 : 0} color={p.color} />
            </div>
          ))}
          <div style={{ marginTop: '.5rem', paddingTop: '.5rem', borderTop: '1px solid var(--h-border-light)', display: 'flex', justifyContent: 'space-between', fontSize: '.58rem', color: 'var(--h-muted)' }}>
            <span>Pending: {s.pendingSubmissions}</span>
            <span>Confirmed: {s.confirmedSubmissions}</span>
          </div>
        </Card>
      </div>

      {/* Row 3: Recent + Top pages + Referrers */}
      <div className="adm-grid-2" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '.65rem' }}>
        {/* Recent submissions */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.15rem 1.15rem .65rem' }}><H>Recent Submissions (DB)</H></div>
          {d.recent.length === 0 ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', fontSize: '.78rem', color: 'var(--h-muted)' }}>No submissions yet</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 380 }}>
                <thead>
                  <tr>
                    {['Company', 'Category', 'Status', 'Date'].map(h => (
                      <th key={h} style={{ textAlign: 'left', fontSize: '.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--h-muted)', padding: '.45rem 1.15rem', borderBottom: '1.5px solid var(--h-border)', background: 'var(--h-bg)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {d.recent.map(sub => (
                    <tr key={sub.id} style={{ borderBottom: '1px solid var(--h-border-light)' }}>
                      <td style={{ padding: '.55rem 1.15rem' }}>
                        <span style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, color: 'var(--h-heading)' }}>{sub.company_name}</span>
                        <span style={{ fontSize: '.52rem', color: 'var(--h-muted)' }}>{sub.email}</span>
                      </td>
                      <td style={{ padding: '.55rem 1.15rem' }}><Pill color="#4361EE">{sub.category}</Pill></td>
                      <td style={{ padding: '.55rem 1.15rem' }}><Pill color={statusColors[sub.status] || '#F59E0B'}>{sub.status}</Pill></td>
                      <td style={{ padding: '.55rem 1.15rem', fontSize: '.6rem', color: 'var(--h-muted)' }}>{sub.created_at?.slice(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
          {/* Top pages */}
          <Card>
            <H>Top Pages (Real)</H>
            {d.topPages.length === 0 ? (
              <p style={{ fontSize: '.72rem', color: 'var(--h-muted)' }}>No views yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.55rem' }}>
                {d.topPages.map(p => (
                  <div key={p.page}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.63rem', fontWeight: 600, color: 'var(--h-heading)', marginBottom: '.2rem' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '.5rem' }}>{p.page === '/infowebworld' ? 'Home' : p.page.replace('/infowebworld', '')}</span><span>{p.cnt}</span>
                    </div>
                    <Bar pct={(p.cnt / maxPage) * 100} color="#3B82F6" />
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Top referrers */}
          <Card>
            <H>Referrers (Real)</H>
            {d.topReferrers.length === 0 ? (
              <p style={{ fontSize: '.72rem', color: 'var(--h-muted)' }}>No referrer data</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.55rem' }}>
                {d.topReferrers.map(r => (
                  <div key={r.ref}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.63rem', fontWeight: 600, color: 'var(--h-heading)', marginBottom: '.2rem' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '.5rem' }}>{r.ref || 'Direct'}</span><span>{r.cnt}</span>
                    </div>
                    <Bar pct={(r.cnt / maxRef) * 100} color="#E8553D" />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <style>{`@media (max-width: 768px) { .adm-grid-2 { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
