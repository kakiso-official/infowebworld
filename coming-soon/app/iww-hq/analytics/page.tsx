'use client'
import { useState, useEffect, useMemo } from 'react'

const API = '/infowebworld/api.php?action=dashboard_stats'

// ============================================================
// SVG ICONS — Premium Lucide-style, 1.5px stroke
// ============================================================
const I = ({ d, size = 18, color = 'currentColor', sw = 1.5 }: { d: string; size?: number; color?: string; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d.split('|').map((p, i) => <path key={i} d={p} />)}</svg>
)
// Filled circle with number inside
const Rank = ({ n, color }: { n: number; color: string }) => (
  <svg width={18} height={18} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill={color} opacity={0.12} />
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth={1.5} fill="none" />
    <text x="12" y="16" textAnchor="middle" fill={color} fontSize="11" fontWeight="800" fontFamily="var(--font-nunito)">{n}</text>
  </svg>
)

// Icon paths (Lucide-compatible SVG path data)
const icons = {
  eye:        'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z|M12 9a3 3 0 100 6 3 3 0 000-6z',
  barChart:   'M12 20V10|M18 20V4|M6 20v-4',
  user:       'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2|M12 3a4 4 0 100 8 4 4 0 000-8z',
  users:      'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2|M9 3a4 4 0 100 8 4 4 0 000-8z|M23 21v-2a4 4 0 00-3-3.87|M16 3.13a4 4 0 010 7.75',
  mail:       'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z|M22 6l-10 7L2 6',
  diamond:    'M12 2L2 7l10 15L22 7z|M2 7h20',
  trendUp:    'M23 6l-9.5 9.5-5-5L1 18|M17 6h6v6',
  trendDown:  'M23 18l-9.5-9.5-5 5L1 6|M17 18h6v-6',
  monitor:    'M2 3h20v14H2z|M8 21h8|M12 17v4',
  smartphone: 'M6 2h12a1 1 0 011 1v18a1 1 0 01-1 1H6a1 1 0 01-1-1V3a1 1 0 011-1z|M12 18h.01',
  tablet:     'M5 2h14a1 1 0 011 1v18a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1z|M12 18h.01',
  globe:      'M12 2a10 10 0 100 20 10 10 0 000-20z|M2 12h20|M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10A15 15 0 0112 2z',
  link:       'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71|M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
  target:     'M12 2a10 10 0 100 20 10 10 0 000-20z|M12 6a6 6 0 100 12 6 6 0 000-12z|M12 10a2 2 0 100 4 2 2 0 000-4z',
  arrowDown:  'M12 5v14|M19 12l-7 7-7-7',
  megaphone:  'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
  msgCircle:  'M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z',
  bookOpen:   'M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z|M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z',
  penTool:    'M12 19l7-7 3 3-7 7-3-3z|M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z|M2 2l7.586 7.586|M11 11a2 2 0 100 4 2 2 0 000-4z',
  share:      'M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8|M16 6l-4-4-4 4|M12 2v13',
  clock:      'M12 2a10 10 0 100 20 10 10 0 000-20z|M12 6v6l4 2',
  award:      'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  rocket:     'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z|M12 15l-3-3a22 22 0 015-10.06A22 22 0 0124 7a22 22 0 01-10.06 5z|M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0|M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5',
  fileText:   'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z|M14 2v6h6|M16 13H8|M16 17H8|M10 9H8',
  home:       'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z|M9 22V12h6v10',
  layers:     'M12 2L2 7l10 5 10-5-10-5z|M2 17l10 5 10-5|M2 12l10 5 10-5',
  pin:        'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z|M12 7a3 3 0 100 6 3 3 0 000-6z',
}

// ── Country code → name ──
const countryName: Record<string, string> = {
  US: 'United States', IN: 'India', GB: 'United Kingdom', CA: 'Canada', AU: 'Australia',
  DE: 'Germany', FR: 'France', NL: 'Netherlands', SG: 'Singapore', AE: 'UAE',
  BR: 'Brazil', JP: 'Japan', KR: 'South Korea', MX: 'Mexico', PH: 'Philippines',
  ID: 'Indonesia', NG: 'Nigeria', PK: 'Pakistan', BD: 'Bangladesh', ZA: 'South Africa',
  IT: 'Italy', ES: 'Spain', SE: 'Sweden', NO: 'Norway', FI: 'Finland',
  DK: 'Denmark', PL: 'Poland', IE: 'Ireland', NZ: 'New Zealand', MY: 'Malaysia',
}

// ── Country code → flag (proper Unicode flags) ──
const flag = (code: string) => {
  if (!code || code.length !== 2) return null
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1F1E6 - 65 + c.charCodeAt(0)))
}

// ── Reusable components (outside render for perf) ──
const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid var(--h-border)', padding: '1.25rem', ...style }}>{children}</div>
)
const Heading = ({ children, sub, icon }: { children: React.ReactNode; sub?: string; icon?: string }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '.5rem', marginBottom: '1rem' }}>
    {icon && <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--h-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}><I d={icons[icon as keyof typeof icons] || ''} size={15} color="var(--h-muted)" /></div>}
    <div>
      <h3 style={{ fontSize: '.78rem', fontWeight: 800, fontFamily: "var(--font-bricolage)", color: 'var(--h-heading)', margin: 0 }}>{children}</h3>
      {sub && <p style={{ fontSize: '.54rem', color: 'var(--h-muted)', marginTop: '.1rem', fontWeight: 500 }}>{sub}</p>}
    </div>
  </div>
)
const Bar = ({ pct, color, height = 6 }: { pct: number; color: string; height?: number }) => (
  <div style={{ height, borderRadius: 999, background: 'var(--h-border)' }}>
    <div style={{ height: '100%', borderRadius: 999, width: `${Math.min(pct, 100)}%`, background: color, transition: 'width .6s cubic-bezier(0.16,1,0.3,1)' }} />
  </div>
)
const Pill = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <span style={{ fontSize: '.54rem', fontWeight: 700, padding: '.18rem .55rem', borderRadius: 999, background: `${color}12`, color, display: 'inline-block' }}>{children}</span>
)

type DeviceRow = { device_type: string; cnt: number; uniques: number }
type CountryRow = { country_code: string; cnt: number; uniques: number }
type UtmRow = { utm_source: string; utm_medium: string; cnt: number; uniques: number }
type DashData = {
  stats: Record<string, number>
  dailyViews: number[]; dayLabels: string[]
  topPages: { page: string; cnt: number }[]
  topReferrers: { ref: string; cnt: number }[]
  byPlan: Record<string, number>
  byCat: { name: string; cnt: number }[]
  recent: { id: number; company_name: string; email: string; status: string; created_at: string; category: string; plan_slug: string }[]
  waitlistBySrc: Record<string, number>
  blogStats: { totalViews: number; totalShares: number; avgReadTime: number; totalPosts: number; topPosts: { title: string; slug: string; views: number }[] }
  devices: DeviceRow[]
  countries: CountryRow[]
  utmSources: UtmRow[]
}

const deviceIconMap: Record<string, string> = { desktop: 'monitor', mobile: 'smartphone', tablet: 'tablet' }
const deviceColors: Record<string, string> = { desktop: '#3B82F6', mobile: '#E8553D', tablet: '#F59E0B' }
const srcIconMap: Record<string, string> = { hero: 'target', footer: 'arrowDown', cta: 'megaphone', popup: 'msgCircle', referral: 'link' }
const srcColors: Record<string, string> = { hero: '#E8553D', footer: '#3B82F6', cta: '#F59E0B', popup: '#8B5CF6', referral: '#2FAE6A' }

export default function Analytics() {
  const [d, setD] = useState<DashData | null>(null)
  const [tab, setTab] = useState<'overview' | 'traffic' | 'content'>('overview')

  useEffect(() => { fetch(API).then(r => r.json()).then(setD).catch(() => {}) }, [])

  const computed = useMemo(() => {
    if (!d) return null
    const s = d.stats
    const maxV = Math.max(...d.dailyViews, 1)
    const maxPage = d.topPages[0]?.cnt || 1
    const maxRef = d.topReferrers[0]?.cnt || 1
    const totalDevices = (d.devices || []).reduce((a, r) => a + Number(r.cnt), 0) || 1
    const maxCountry = (d.countries || [])[0]?.cnt || 1
    const maxUtm = (d.utmSources || [])[0]?.cnt || 1
    const weekTotal = d.dailyViews.reduce((a, b) => a + b, 0)
    const prevDayViews = d.dailyViews[5] || 0
    const todayViews = d.dailyViews[6] || 0
    const dayChange = prevDayViews > 0 ? Math.round(((todayViews - prevDayViews) / prevDayViews) * 100) : 0

    const funnel = [
      { label: 'Views', val: s.totalPageViews, color: '#E8553D', icon: 'eye' },
      { label: 'Waitlist', val: s.waitlistTotal, color: '#F59E0B', icon: 'mail' },
      { label: 'Submissions', val: s.totalSubmissions, color: '#3B82F6', icon: 'fileText' },
      { label: 'Paid', val: s.paidMembers, color: '#2FAE6A', icon: 'diamond' },
    ]
    const maxF = Math.max(...funnel.map(f => f.val), 1)

    return { s, maxV, maxPage, maxRef, totalDevices, maxCountry, maxUtm, weekTotal, dayChange, funnel, maxF }
  }, [d])

  if (!d || !computed) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--h-muted)', fontSize: '.85rem' }}>Loading analytics...</div>

  const { s, maxV, maxPage, maxRef, totalDevices, maxCountry, maxUtm, weekTotal, dayChange, funnel, maxF } = computed

  const tabStyle = (t: string): React.CSSProperties => ({
    padding: '.45rem 1rem', borderRadius: 999, fontSize: '.68rem', fontWeight: 700,
    fontFamily: 'var(--font-nunito)', cursor: 'pointer', border: 'none', transition: 'all .25s',
    background: tab === t ? 'var(--h-heading)' : 'transparent',
    color: tab === t ? '#fff' : 'var(--h-muted)',
  })

  const statCards = [
    { l: 'Total Views', v: s.totalPageViews, c: '#E8553D', icon: 'eye' },
    { l: 'Today', v: s.todayViews, c: '#14B8A6', icon: 'barChart', badge: dayChange !== 0 ? `${dayChange > 0 ? '+' : ''}${dayChange}%` : null, badgeColor: dayChange >= 0 ? '#2FAE6A' : '#EF4444' },
    { l: 'Unique Today', v: s.todayUnique, c: '#8B5CF6', icon: 'user' },
    { l: 'All-Time Unique', v: s.totalUnique, c: '#3B82F6', icon: 'users' },
    { l: 'Waitlist', v: s.waitlistTotal, c: '#F59E0B', icon: 'mail' },
    { l: 'Paid Members', v: s.paidMembers, c: '#2FAE6A', icon: 'diamond' },
  ]

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '.65rem' }}>

      {/* Header + Tab Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-bricolage)', color: 'var(--h-heading)', margin: 0 }}>Analytics</h2>
          <p style={{ fontSize: '.62rem', color: 'var(--h-muted)', margin: 0 }}>Real-time visitor data — bots filtered, unique visitors deduplicated</p>
        </div>
        <div style={{ display: 'flex', gap: '.25rem', background: 'var(--h-border-light)', borderRadius: 999, padding: '.2rem' }}>
          <button onClick={() => setTab('overview')} style={tabStyle('overview')}>Overview</button>
          <button onClick={() => setTab('traffic')} style={tabStyle('traffic')}>Traffic</button>
          <button onClick={() => setTab('content')} style={tabStyle('content')}>Content</button>
        </div>
      </div>

      {/* ═══ OVERVIEW TAB ═══ */}
      {tab === 'overview' && <>
        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '.55rem' }}>
          {statCards.map(x => (
            <div key={x.l} style={{ background: '#fff', borderRadius: 20, border: '1.5px solid var(--h-border)', padding: '.85rem 1rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: x.c }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--h-muted)', marginBottom: '.25rem' }}>{x.l}</p>
                  <p style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: "var(--font-nunito)", color: 'var(--h-heading)', lineHeight: 1 }}>{x.v.toLocaleString()}</p>
                </div>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: `${x.c}0A`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <I d={icons[x.icon as keyof typeof icons]} size={16} color={x.c} />
                </div>
              </div>
              {x.badge && (
                <span style={{ position: 'absolute', top: 10, right: 10, fontSize: '.48rem', fontWeight: 800, padding: '.12rem .4rem', borderRadius: 999, background: `${x.badgeColor}15`, color: x.badgeColor, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <I d={icons[dayChange >= 0 ? 'trendUp' : 'trendDown']} size={10} color={x.badgeColor!} sw={2} />
                  {x.badge}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Conversion funnel */}
        <Card>
          <Heading sub="Views  →  Waitlist  →  Submissions  →  Paid" icon="layers">Conversion Funnel</Heading>
          <div style={{ display: 'flex', gap: '.35rem', alignItems: 'flex-end', height: 140 }}>
            {funnel.map((f, i) => {
              const prevVal = i > 0 ? funnel[i - 1].val : 0
              const convRate = prevVal > 0 ? ((f.val / prevVal) * 100).toFixed(1) : null
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: `${f.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <I d={icons[f.icon as keyof typeof icons]} size={14} color={f.color} />
                  </div>
                  <span style={{ fontSize: '.72rem', fontWeight: 800, color: 'var(--h-heading)', fontFamily: 'var(--font-nunito)' }}>{f.val.toLocaleString()}</span>
                  <div style={{ width: '100%', borderRadius: '10px 10px 0 0', height: `${Math.max((f.val / maxF) * 100, 8)}%`, background: f.color, minHeight: 8, transition: 'height .6s cubic-bezier(0.16,1,0.3,1)' }} />
                  <span style={{ fontSize: '.5rem', fontWeight: 700, color: 'var(--h-muted)', textAlign: 'center' }}>{f.label}</span>
                  {convRate && (
                    <span style={{ fontSize: '.46rem', fontWeight: 700, color: f.color, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <I d={icons.arrowDown} size={8} color={f.color} sw={2.5} /> {convRate}%
                    </span>
                  )}
                </div>
              )
            })}
          </div>
          {s.totalPageViews > 0 && (
            <div style={{ textAlign: 'center', marginTop: '.75rem', paddingTop: '.6rem', borderTop: '1px solid var(--h-border-light)' }}>
              <span style={{ fontSize: '.62rem', fontWeight: 700, color: '#E8553D' }}>
                Overall: {((s.paidMembers / Math.max(s.totalPageViews, 1)) * 100).toFixed(2)}% conversion
              </span>
            </div>
          )}
        </Card>

        {/* Daily chart + Device split */}
        <div className="adm-grid-2" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '.65rem' }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem' }}>
              <Heading icon="barChart">Daily Views — 7 Days</Heading>
              <Pill color="#E8553D">{weekTotal.toLocaleString()} this week</Pill>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '.35rem', height: 140 }}>
              {d.dailyViews.map((v, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <span style={{ fontSize: '.5rem', fontWeight: 700, color: i === 6 ? '#E8553D' : 'var(--h-muted)' }}>{v}</span>
                  <div style={{ width: '100%', borderRadius: '6px 6px 0 0', height: `${Math.max((v / maxV) * 100, 4)}%`, background: i === 6 ? '#E8553D' : 'var(--h-border)', minHeight: 4, transition: 'height .5s' }} />
                  <span style={{ fontSize: '.46rem', fontWeight: 600, color: i === 6 ? '#E8553D' : 'var(--h-muted)' }}>{d.dayLabels[i]}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <Heading sub="Last 30 days" icon="monitor">Devices</Heading>
            {(!d.devices || d.devices.length === 0) ? (
              <p style={{ fontSize: '.72rem', color: 'var(--h-muted)', textAlign: 'center', padding: '1.5rem 0' }}>No device data yet — visits after this update will show here</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                <div style={{ display: 'flex', height: 12, borderRadius: 999, overflow: 'hidden' }}>
                  {d.devices.map(r => (
                    <div key={r.device_type} style={{ width: `${(Number(r.cnt) / totalDevices) * 100}%`, background: deviceColors[r.device_type] || '#9CA3AF', transition: 'width .5s' }} />
                  ))}
                </div>
                {d.devices.map(r => {
                  const pct = ((Number(r.cnt) / totalDevices) * 100).toFixed(1)
                  const iconKey = deviceIconMap[r.device_type] || 'monitor'
                  return (
                    <div key={r.device_type} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.45rem' }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: `${deviceColors[r.device_type]}0A`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <I d={icons[iconKey as keyof typeof icons]} size={14} color={deviceColors[r.device_type]} />
                        </div>
                        <span style={{ fontSize: '.68rem', fontWeight: 700, color: 'var(--h-heading)', textTransform: 'capitalize' }}>{r.device_type}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                        <span style={{ fontSize: '.6rem', fontWeight: 600, color: 'var(--h-muted)' }}>{Number(r.cnt).toLocaleString()}</span>
                        <Pill color={deviceColors[r.device_type] || '#9CA3AF'}>{pct}%</Pill>
                      </div>
                    </div>
                  )
                })}
                <div style={{ paddingTop: '.5rem', borderTop: '1px solid var(--h-border-light)', fontSize: '.56rem', color: 'var(--h-muted)', textAlign: 'center' }}>
                  {d.devices.reduce((a, r) => a + Number(r.uniques || 0), 0).toLocaleString()} unique across all devices
                </div>
              </div>
            )}
          </Card>
        </div>
      </>}

      {/* ═══ TRAFFIC TAB ═══ */}
      {tab === 'traffic' && <>
        <div className="adm-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.65rem' }}>
          {/* Countries */}
          <Card>
            <Heading sub="Top 10 · Last 30 days · via Cloudflare" icon="globe">Countries</Heading>
            {(!d.countries || d.countries.length === 0) ? (
              <p style={{ fontSize: '.72rem', color: 'var(--h-muted)', textAlign: 'center', padding: '1.5rem 0' }}>No country data yet — Cloudflare headers will populate this</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
                {d.countries.map((r, i) => (
                  <div key={r.country_code}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                        <span style={{ fontSize: '.78rem', lineHeight: 1 }}>{flag(r.country_code)}</span>
                        <span style={{ fontSize: '.66rem', fontWeight: 700, color: 'var(--h-heading)' }}>
                          {countryName[r.country_code] || r.country_code}
                        </span>
                        {i === 0 && <Pill color="#E8553D">Top</Pill>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                        <span style={{ fontSize: '.56rem', fontWeight: 600, color: 'var(--h-muted)' }}>{Number(r.uniques || 0).toLocaleString()} unique</span>
                        <span style={{ fontSize: '.62rem', fontWeight: 800, color: 'var(--h-heading)' }}>{Number(r.cnt).toLocaleString()}</span>
                      </div>
                    </div>
                    <Bar pct={(Number(r.cnt) / maxCountry) * 100} color={i === 0 ? '#E8553D' : i === 1 ? '#3B82F6' : i === 2 ? '#2FAE6A' : 'var(--h-muted)'} />
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* UTM Sources */}
          <Card>
            <Heading sub="Campaign tracking · Last 30 days" icon="link">UTM Sources</Heading>
            {(!d.utmSources || d.utmSources.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '1.25rem 0' }}>
                <p style={{ fontSize: '.72rem', color: 'var(--h-muted)', marginBottom: '.75rem' }}>No UTM data yet</p>
                <div style={{ background: 'var(--h-bg)', borderRadius: 14, padding: '.85rem', textAlign: 'left' }}>
                  <p style={{ fontSize: '.56rem', fontWeight: 700, color: 'var(--h-heading)', marginBottom: '.35rem' }}>Add UTM params to your links:</p>
                  <code style={{ fontSize: '.5rem', color: '#E8553D', wordBreak: 'break-all', lineHeight: 1.6 }}>
                    ?utm_source=twitter&utm_medium=social&utm_campaign=launch
                  </code>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
                {d.utmSources.map((r, i) => (
                  <div key={`${r.utm_source}-${r.utm_medium}`}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                        <span style={{ fontSize: '.66rem', fontWeight: 700, color: 'var(--h-heading)' }}>{r.utm_source}</span>
                        {r.utm_medium && <Pill color="#8B5CF6">{r.utm_medium}</Pill>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                        <span style={{ fontSize: '.56rem', color: 'var(--h-muted)' }}>{Number(r.uniques || 0)} unique</span>
                        <span style={{ fontSize: '.62rem', fontWeight: 800, color: 'var(--h-heading)' }}>{Number(r.cnt).toLocaleString()}</span>
                      </div>
                    </div>
                    <Bar pct={(Number(r.cnt) / maxUtm) * 100} color={['#E8553D', '#3B82F6', '#8B5CF6', '#2FAE6A', '#F59E0B'][i % 5]} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Referrers + Top Pages */}
        <div className="adm-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.65rem' }}>
          <Card>
            <Heading sub="Where visitors come from" icon="share">Referrers</Heading>
            {d.topReferrers.length === 0 ? (
              <p style={{ fontSize: '.72rem', color: 'var(--h-muted)' }}>No referrer data</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                {d.topReferrers.map((r, i) => (
                  <div key={r.ref}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.63rem', fontWeight: 600, color: 'var(--h-heading)', marginBottom: '.2rem' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '.5rem' }}>{r.ref || 'Direct'}</span>
                      <span>{r.cnt}</span>
                    </div>
                    <Bar pct={(r.cnt / maxRef) * 100} color={i === 0 ? '#E8553D' : '#3B82F6'} />
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <Heading sub="Most visited pages" icon="layers">Top Pages</Heading>
            {d.topPages.length === 0 ? (
              <p style={{ fontSize: '.72rem', color: 'var(--h-muted)' }}>No views yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                {d.topPages.map((p, i) => (
                  <div key={p.page}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '.63rem', fontWeight: 600, color: 'var(--h-heading)', marginBottom: '.2rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '.5rem' }}>
                        {p.page === '/infowebworld' && <I d={icons.home} size={12} color="var(--h-muted)" />}
                        {p.page === '/infowebworld' ? 'Home' : p.page.replace('/infowebworld', '')}
                      </span>
                      <span>{p.cnt}</span>
                    </div>
                    <Bar pct={(p.cnt / maxPage) * 100} color={i === 0 ? '#2FAE6A' : '#14B8A6'} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Waitlist sources */}
        <Card>
          <Heading sub="Which sections convert best" icon="target">Waitlist by Source</Heading>
          {Object.keys(d.waitlistBySrc).length === 0 ? (
            <p style={{ fontSize: '.72rem', color: 'var(--h-muted)' }}>No waitlist signups yet</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '.5rem' }}>
              {Object.entries(d.waitlistBySrc).sort((a, b) => b[1] - a[1]).map(([src, cnt]) => {
                const iconKey = srcIconMap[src] || 'pin'
                const color = srcColors[src] || 'var(--h-muted)'
                return (
                  <div key={src} style={{ background: 'var(--h-bg)', borderRadius: 14, padding: '.75rem', textAlign: 'center' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}10`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '.3rem' }}>
                      <I d={icons[iconKey as keyof typeof icons]} size={18} color={color} />
                    </div>
                    <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--h-heading)', fontFamily: 'var(--font-nunito)', margin: '.2rem 0' }}>{cnt}</p>
                    <p style={{ fontSize: '.52rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color }}>{src}</p>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </>}

      {/* ═══ CONTENT TAB ═══ */}
      {tab === 'content' && <>
        {/* Blog stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '.55rem' }}>
          {[
            { l: 'Blog Views', v: d.blogStats?.totalViews || 0, c: '#E8553D', icon: 'bookOpen' },
            { l: 'Published Posts', v: d.blogStats?.totalPosts || 0, c: '#3B82F6', icon: 'penTool' },
            { l: 'Total Shares', v: d.blogStats?.totalShares || 0, c: '#2FAE6A', icon: 'share' },
            { l: 'Avg Read Time', v: d.blogStats?.avgReadTime || 0, c: '#8B5CF6', icon: 'clock', suffix: 's' },
          ].map(x => (
            <div key={x.l} style={{ background: '#fff', borderRadius: 20, border: '1.5px solid var(--h-border)', padding: '.85rem 1rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: x.c }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--h-muted)', marginBottom: '.25rem' }}>{x.l}</p>
                  <p style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: "var(--font-nunito)", color: 'var(--h-heading)', lineHeight: 1 }}>
                    {x.v.toLocaleString()}{(x as { suffix?: string }).suffix || ''}
                  </p>
                </div>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: `${x.c}0A`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <I d={icons[x.icon as keyof typeof icons]} size={16} color={x.c} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Top blog posts + Categories */}
        <div className="adm-grid-2" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '.65rem' }}>
          <Card>
            <Heading sub="By total views" icon="bookOpen">Top Blog Posts</Heading>
            {(!d.blogStats?.topPosts || d.blogStats.topPosts.length === 0) ? (
              <p style={{ fontSize: '.72rem', color: 'var(--h-muted)', textAlign: 'center', padding: '1rem 0' }}>No blog views yet — publish posts and share them</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                {d.blogStats.topPosts.map((p, i) => {
                  const maxBlog = d.blogStats.topPosts[0]?.views || 1
                  const rankColors = ['#E8553D', '#F59E0B', '#3B82F6', '#8B5CF6', '#2FAE6A']
                  return (
                    <div key={p.slug}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.35rem', overflow: 'hidden' }}>
                          <Rank n={i + 1} color={rankColors[i] || 'var(--h-muted)'} />
                          <span style={{ fontSize: '.66rem', fontWeight: 700, color: 'var(--h-heading)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</span>
                        </div>
                        <span style={{ fontSize: '.6rem', fontWeight: 800, color: '#E8553D', flexShrink: 0, marginLeft: '.5rem' }}>{p.views}</span>
                      </div>
                      <Bar pct={(p.views / maxBlog) * 100} color={rankColors[i] || 'var(--h-muted)'} />
                    </div>
                  )
                })}
              </div>
            )}
          </Card>

          <Card>
            <Heading sub="Submission categories" icon="layers">Top Categories</Heading>
            {(!d.byCat || d.byCat.length === 0) ? (
              <p style={{ fontSize: '.72rem', color: 'var(--h-muted)' }}>No submissions yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
                {d.byCat.map((c, i) => {
                  const maxCat = d.byCat[0]?.cnt || 1
                  const catColors = ['#E8553D', '#3B82F6', '#2FAE6A', '#8B5CF6', '#F59E0B']
                  return (
                    <div key={c.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.63rem', fontWeight: 600, color: 'var(--h-heading)', marginBottom: '.2rem' }}>
                        <span>{c.name}</span><span>{c.cnt}</span>
                      </div>
                      <Bar pct={(c.cnt / maxCat) * 100} color={catColors[i % 5]} />
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Plan breakdown */}
        <Card>
          <Heading sub="Which pricing tier are businesses choosing" icon="diamond">Submissions by Plan</Heading>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Founding', slug: 'founding', color: '#E8553D', icon: 'award', desc: 'Lifetime  ·  $240' },
              { label: 'Early Adopter', slug: 'early-adopter', color: '#4361EE', icon: 'rocket', desc: 'Yearly  ·  $99' },
              { label: 'Standard', slug: 'standard', color: '#2FAE6A', icon: 'fileText', desc: 'Yearly  ·  $240' },
            ].map(p => {
              const count = d.byPlan[p.slug] || 0
              const pct = s.totalSubmissions > 0 ? ((count / s.totalSubmissions) * 100).toFixed(0) : '0'
              return (
                <div key={p.slug} style={{ background: 'var(--h-bg)', borderRadius: 16, padding: '1.15rem', textAlign: 'center', border: count > 0 ? `1.5px solid ${p.color}20` : '1.5px solid transparent' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: `${p.color}0A`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '.4rem' }}>
                    <I d={icons[p.icon as keyof typeof icons]} size={20} color={p.color} />
                  </div>
                  <p style={{ fontSize: '1.6rem', fontWeight: 800, color: p.color, fontFamily: 'var(--font-nunito)', margin: '.2rem 0' }}>{count}</p>
                  <p style={{ fontSize: '.7rem', fontWeight: 700, color: 'var(--h-heading)' }}>{p.label}</p>
                  <p style={{ fontSize: '.52rem', color: 'var(--h-muted)', marginTop: '.15rem' }}>{p.desc}  ·  {pct}%</p>
                </div>
              )
            })}
          </div>
        </Card>
      </>}

      <style>{`@media (max-width: 768px) { .adm-grid-2 { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
