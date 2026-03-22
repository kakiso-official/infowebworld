'use client'
import { useState, useEffect } from 'react'

const API = '/infowebworld/api.php?action=dashboard_stats'

const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid var(--h-border)', padding: '1.25rem', ...style }}>{children}</div>
)
const H = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontSize: '.78rem', fontWeight: 800, fontFamily: "var(--font-bricolage)", color: 'var(--h-heading)', marginBottom: '1rem' }}>{children}</h3>
)
const Bar = ({ pct, color }: { pct: number; color: string }) => (
  <div style={{ height: 6, borderRadius: 999, background: 'var(--h-border)' }}>
    <div style={{ height: '100%', borderRadius: 999, width: `${pct}%`, background: color, transition: 'width .5s' }} />
  </div>
)

export default function Analytics() {
  const [d, setD] = useState<{ stats: Record<string, number>; dailyViews: number[]; dayLabels: string[]; topPages: { page: string; cnt: number }[]; topReferrers: { ref: string; cnt: number }[]; waitlistBySrc: Record<string, number> } | null>(null)

  useEffect(() => { fetch(API).then(r => r.json()).then(setD).catch(() => {}) }, [])

  if (!d) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--h-muted)', fontSize: '.85rem' }}>Loading analytics from database...</div>

  const s = d.stats
  const maxV = Math.max(...d.dailyViews, 1)
  const maxPage = d.topPages[0]?.cnt || 1
  const maxRef = d.topReferrers[0]?.cnt || 1

  const funnel = [
    { label: 'Page Views', val: s.totalPageViews, color: 'var(--h-border)' },
    { label: 'Waitlist', val: s.waitlistTotal, color: '#F59E0B' },
    { label: 'Submissions', val: s.totalSubmissions, color: '#3B82F6' },
    { label: 'Paid', val: s.paidMembers, color: '#2FAE6A' },
  ]
  const maxF = Math.max(...funnel.map(f => f.val), 1)

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '.6rem' }}>
        {[
          { l: 'Total Views', v: s.totalPageViews, c: '#E8553D' },
          { l: 'Today', v: s.todayViews, c: '#3B82F6' },
          { l: 'Unique Today', v: s.todayUnique, c: '#8B5CF6' },
          { l: 'Total Unique', v: s.totalUnique, c: '#2FAE6A' },
        ].map(x => (
          <div key={x.l} style={{ background: '#fff', borderRadius: 20, border: '1.5px solid var(--h-border)', padding: '.85rem 1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: x.c }} />
            <p style={{ fontSize: '.52rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--h-muted)', marginBottom: '.2rem' }}>{x.l}</p>
            <p style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: "var(--font-nunito)", color: 'var(--h-heading)', lineHeight: 1 }}>{x.v}</p>
          </div>
        ))}
      </div>

      {/* Funnel */}
      <Card>
        <H>Conversion Funnel (Real Data)</H>
        <div style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-end', height: 120 }}>
          {funnel.map((f, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: '.7rem', fontWeight: 800, color: 'var(--h-heading)', fontFamily: 'var(--font-nunito)' }}>{f.val}</span>
              <div style={{ width: '100%', borderRadius: '8px 8px 0 0', height: `${Math.max((f.val / maxF) * 100, 5)}%`, background: f.color, minHeight: 6 }} />
              <span style={{ fontSize: '.5rem', fontWeight: 700, color: 'var(--h-muted)', textAlign: 'center' }}>{f.label}</span>
            </div>
          ))}
        </div>
        {s.totalPageViews > 0 && (
          <p style={{ textAlign: 'center', marginTop: '.75rem', fontSize: '.65rem', fontWeight: 700, color: '#E8553D' }}>
            {((s.paidMembers / Math.max(s.totalPageViews, 1)) * 100).toFixed(2)}% overall conversion
          </p>
        )}
      </Card>

      <div className="adm-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.65rem' }}>
        {/* Daily chart */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem' }}>
            <H>Daily Views — 7 Days</H>
            <span style={{ fontSize: '.58rem', fontWeight: 700, color: 'var(--h-accent)' }}>{d.dailyViews.reduce((a, b) => a + b, 0)} total</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '.4rem', height: 120 }}>
            {d.dailyViews.map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <span style={{ fontSize: '.48rem', fontWeight: 700, color: 'var(--h-muted)' }}>{v}</span>
                <div style={{ width: '100%', borderRadius: '5px 5px 0 0', height: `${Math.max((v / maxV) * 100, 4)}%`, background: i === 6 ? '#E8553D' : 'var(--h-border)', minHeight: 3 }} />
                <span style={{ fontSize: '.46rem', fontWeight: 600, color: 'var(--h-muted)' }}>{d.dayLabels[i]}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top pages */}
        <Card>
          <H>Top Pages</H>
          {d.topPages.length === 0 ? (
            <p style={{ fontSize: '.72rem', color: 'var(--h-muted)' }}>No data yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
              {d.topPages.map(p => (
                <div key={p.page}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.63rem', fontWeight: 600, color: 'var(--h-heading)', marginBottom: '.2rem' }}>
                    <span>{p.page === '/infowebworld' ? 'Home' : p.page.replace('/infowebworld', '')}</span><span>{p.cnt}</span>
                  </div>
                  <Bar pct={(p.cnt / maxPage) * 100} color="#3B82F6" />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Referrers */}
      <Card>
        <H>Top Referrers</H>
        {d.topReferrers.length === 0 ? (
          <p style={{ fontSize: '.72rem', color: 'var(--h-muted)' }}>No referrer data yet</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
            {d.topReferrers.map(r => (
              <div key={r.ref} style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                <span style={{ fontSize: '.68rem', fontWeight: 600, color: 'var(--h-heading)', width: 120, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.ref || 'Direct'}</span>
                <div style={{ flex: 1 }}><Bar pct={(r.cnt / maxRef) * 100} color="#E8553D" /></div>
                <span style={{ fontSize: '.58rem', fontWeight: 700, color: 'var(--h-muted)', width: 32, textAlign: 'right' }}>{r.cnt}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <style>{`@media (max-width: 768px) { .adm-grid-2 { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
