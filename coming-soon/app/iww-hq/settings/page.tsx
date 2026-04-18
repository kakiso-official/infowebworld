'use client'
import { useState, useEffect } from 'react'
import { clearSession } from '../utils/hash'
import { fetchConfig, saveConfigToAPI, defaults, type SiteConfig } from '../../config/site-config'

const lbl: React.CSSProperties = { display: 'block', fontSize: '.65rem', fontWeight: 700, color: 'var(--h-heading)', marginBottom: '.3rem' }
const inp: React.CSSProperties = { width: '100%', height: 40, padding: '0 .75rem', borderRadius: 10, border: '1.5px solid var(--h-border)', background: 'var(--h-bg)', fontSize: '.8rem', color: 'var(--h-heading)', outline: 'none', fontFamily: "var(--font-nunito), 'Nunito', sans-serif", transition: 'border-color .3s, box-shadow .3s' }
const fo = (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = '#E8553D'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,85,61,.08)'; e.currentTarget.style.background = '#fff' }
const bl = (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.background = '' }

const Card = ({ title, color, children }: { title: string; color?: string; children: React.ReactNode }) => (
  <div style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${color ? `${color}30` : 'var(--h-border)'}`, padding: '1.25rem', marginBottom: '.75rem' }}>
    <h3 style={{ fontSize: '.78rem', fontWeight: 800, fontFamily: "var(--font-bricolage), 'Bricolage Grotesque', sans-serif", color: color || 'var(--h-heading)', marginBottom: '.85rem' }}>{title}</h3>
    {children}
  </div>
)

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.6rem 0', borderBottom: '1px solid var(--h-border-light)' }}>
    <span style={{ fontSize: '.72rem', fontWeight: 600, color: 'var(--h-body)' }}>{label}</span>
    {children}
  </div>
)

export default function Settings() {
  const [cfg, setCfg] = useState<SiteConfig>({ ...defaults })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchConfig().then(c => { setCfg(c); setLoading(false) }) }, [])

  const set = <K extends keyof SiteConfig>(k: K, v: SiteConfig[K]) => setCfg(prev => ({ ...prev, [k]: v }))

  const handleSave = async () => {
    const ok = await saveConfigToAPI(cfg)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    if (!ok) alert('Failed to save — check API connection')
  }

  const handleReset = async () => {
    if (!confirm('Reset all config to defaults?')) return
    setCfg({ ...defaults })
    await saveConfigToAPI({ ...defaults })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--h-muted)' }}>Loading settings...</div>

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      {/* ── Plan Slot Tracking ── */}
      <Card title="Plan Slot Tracking" color="#2563EB">
        <p style={{ fontSize: '.6rem', color: 'var(--h-muted)', marginBottom: '.75rem', lineHeight: 1.5 }}>
          Slots auto-decrement on purchase. Pricing changes when threshold is reached.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.65rem' }}>
          <div>
            <label style={lbl}>Lifetime Claimed</label>
            <input type="number" style={inp} value={cfg.lifetimeSlotsClaimed} onChange={e => set('lifetimeSlotsClaimed', Number(e.target.value))} onFocus={fo} onBlur={bl} />
          </div>
          <div>
            <label style={lbl}>Lifetime Total (first N at $239)</label>
            <input type="number" style={inp} value={cfg.lifetimeSlotsTotal} onChange={e => set('lifetimeSlotsTotal', Number(e.target.value))} onFocus={fo} onBlur={bl} />
          </div>
          <div>
            <label style={lbl}>Yearly Claimed</label>
            <input type="number" style={inp} value={cfg.yearlySlotsClaimed} onChange={e => set('yearlySlotsClaimed', Number(e.target.value))} onFocus={fo} onBlur={bl} />
          </div>
          <div>
            <label style={lbl}>Yearly Total (first N at $99/yr)</label>
            <input type="number" style={inp} value={cfg.yearlySlotsTotal} onChange={e => set('yearlySlotsTotal', Number(e.target.value))} onFocus={fo} onBlur={bl} />
          </div>
        </div>
        <p style={{ fontSize: '.6rem', color: 'var(--h-muted)', marginTop: '.5rem' }}>
          Lifetime: <strong style={{ color: 'var(--h-accent)' }}>{cfg.lifetimeSlotsTotal - cfg.lifetimeSlotsClaimed}</strong> remaining
          {cfg.lifetimeSlotsClaimed >= cfg.lifetimeSlotsTotal && <span style={{ color: '#E8553D', fontWeight: 700 }}> &mdash; EXHAUSTED (price is now $999)</span>}
          &nbsp;&middot;&nbsp;
          Yearly: <strong style={{ color: 'var(--h-accent)' }}>{cfg.yearlySlotsTotal - cfg.yearlySlotsClaimed}</strong> remaining
          {cfg.yearlySlotsClaimed >= cfg.yearlySlotsTotal && <span style={{ color: '#E8553D', fontWeight: 700 }}> &mdash; EXHAUSTED (price is now $239/yr)</span>}
        </p>
      </Card>

      {/* ── Stats Section Numbers ── */}
      <Card title="Stats Bar (Landing Page)">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.65rem' }}>
          {([
            { k: 'statWaitlist' as const, l: 'Waitlist Target' },
            { k: 'statListings' as const, l: 'Launch Listings' },
            { k: 'statIndustries' as const, l: 'Industries' },
            { k: 'statCountries' as const, l: 'Countries' },
            { k: 'statLanguages' as const, l: 'Languages' },
          ]).map(f => (
            <div key={f.k}>
              <label style={lbl}>{f.l}</label>
              <input type="text" style={inp} value={cfg[f.k]} onChange={e => set(f.k, e.target.value)} onFocus={fo} onBlur={bl} />
            </div>
          ))}
        </div>
      </Card>

      {/* ── Pricing ── */}
      <Card title="Pricing">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '.65rem' }}>
          <div>
            <label style={lbl}>Founding ($)</label>
            <input type="number" style={inp} value={cfg.foundingPrice} onChange={e => set('foundingPrice', Number(e.target.value))} onFocus={fo} onBlur={bl} />
          </div>
          <div>
            <label style={lbl}>Early Adopter ($/yr)</label>
            <input type="number" style={inp} value={cfg.earlyAdopterPrice} onChange={e => set('earlyAdopterPrice', Number(e.target.value))} onFocus={fo} onBlur={bl} />
          </div>
          <div>
            <label style={lbl}>Standard ($/yr)</label>
            <input type="number" style={inp} value={cfg.standardPrice} onChange={e => set('standardPrice', Number(e.target.value))} onFocus={fo} onBlur={bl} />
          </div>
        </div>
      </Card>

      {/* ── Launch Date ── */}
      <Card title="Launch Date">
        <div>
          <label style={lbl}>Countdown Target</label>
          <input type="datetime-local" style={inp} value={cfg.launchDate.slice(0, 16)} onChange={e => set('launchDate', e.target.value + ':00')} onFocus={fo} onBlur={bl} />
        </div>
      </Card>

      {/* ── Data Source Toggle ── */}
      <Card title="Data Source">
        <Row label="Use real database counts on landing page">
          <button onClick={() => set('useRealData', !cfg.useRealData)} style={{ width: 48, height: 26, borderRadius: 999, border: 'none', background: cfg.useRealData ? '#2FAE6A' : 'var(--h-border)', cursor: 'pointer', position: 'relative', transition: 'background .3s' }}>
            <span style={{ position: 'absolute', top: 3, left: cfg.useRealData ? 24 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left .3s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
          </button>
        </Row>
        <p style={{ fontSize: '.6rem', color: 'var(--h-muted)', marginTop: '.4rem', lineHeight: 1.5 }}>
          {cfg.useRealData ? 'Landing page shows live waitlist/submission counts from DB.' : 'Landing page shows the curated numbers you set above.'}
        </p>
      </Card>

      {/* Save / Reset buttons */}
      <div style={{ display: 'flex', gap: '.65rem', marginBottom: '1.5rem' }}>
        <button onClick={handleSave} style={{ flex: 1, height: 44, borderRadius: 999, border: 'none', background: '#E8553D', color: '#fff', fontSize: '.82rem', fontWeight: 700, cursor: 'pointer', fontFamily: "var(--font-nunito)", transition: 'all .3s' }}>
          {saved ? 'Saved to Database!' : 'Save All Changes'}
        </button>
        <button onClick={handleReset} style={{ height: 44, padding: '0 1.25rem', borderRadius: 999, border: '1.5px solid var(--h-border)', background: '#fff', color: 'var(--h-body)', fontSize: '.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: "var(--font-nunito)", transition: 'all .3s' }}>
          Reset
        </button>
      </div>

      {/* ── Session ── */}
      <Card title="Session">
        <Row label="Status"><span style={{ fontSize: '.58rem', fontWeight: 700, padding: '.2rem .6rem', borderRadius: 999, background: 'rgba(47,174,106,.1)', color: '#2FAE6A' }}>Active</span></Row>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.6rem 0' }}>
          <span style={{ fontSize: '.72rem', fontWeight: 600, color: 'var(--h-body)' }}>Storage</span>
          <span style={{ fontSize: '.72rem', fontWeight: 500, color: 'var(--h-heading)' }}>Database (MySQL)</span>
        </div>
      </Card>

      <Card title="Danger Zone" color="#E8553D">
        <p style={{ fontSize: '.72rem', color: 'var(--h-body)', marginBottom: '1rem', lineHeight: 1.5 }}>End your current session.</p>
        <button onClick={async () => {
          try { await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' }) } catch {}
          clearSession()
          window.location.href = '/iww-hq'
        }}
          style={{ padding: '.55rem 1.5rem', borderRadius: 999, border: 'none', background: '#E8553D', color: '#fff', fontSize: '.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: "var(--font-nunito)" }}>
          Logout
        </button>
      </Card>
    </div>
  )
}
