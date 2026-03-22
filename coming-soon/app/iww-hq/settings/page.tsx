'use client'
import { useState, useEffect } from 'react'
import { clearSession } from '../utils/hash'
import { getConfig, saveConfig, getDefaults, type SiteConfig } from '../../config/site-config'

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
  const [cfg, setCfg] = useState<SiteConfig>(getDefaults())
  const [saved, setSaved] = useState(false)

  useEffect(() => { setCfg(getConfig()) }, [])

  const set = <K extends keyof SiteConfig>(k: K, v: SiteConfig[K]) => setCfg(prev => ({ ...prev, [k]: v }))

  const handleSave = () => {
    saveConfig(cfg)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    if (!confirm('Reset all config to defaults?')) return
    const d = getDefaults()
    setCfg(d)
    saveConfig(d)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      {/* ── Pioneer Tier Numbers ── */}
      <Card title="Pioneer Tier">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.65rem' }}>
          <div>
            <label style={lbl}>Members Joined</label>
            <input type="number" style={inp} value={cfg.pioneerJoined} onChange={e => set('pioneerJoined', Number(e.target.value))} onFocus={fo} onBlur={bl} />
          </div>
          <div>
            <label style={lbl}>Total Spots</label>
            <input type="number" style={inp} value={cfg.pioneerTotal} onChange={e => set('pioneerTotal', Number(e.target.value))} onFocus={fo} onBlur={bl} />
          </div>
          <div>
            <label style={lbl}>Total Spots (All Tiers)</label>
            <input type="number" style={inp} value={cfg.totalSpots} onChange={e => set('totalSpots', Number(e.target.value))} onFocus={fo} onBlur={bl} />
          </div>
        </div>
        <p style={{ fontSize: '.6rem', color: 'var(--h-muted)', marginTop: '.5rem' }}>
          Remaining: <strong style={{ color: 'var(--h-accent)' }}>{cfg.pioneerTotal - cfg.pioneerJoined}</strong> spots &middot; {Math.round((cfg.pioneerJoined / cfg.pioneerTotal) * 100)}% filled
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

      {/* Save / Reset buttons */}
      <div style={{ display: 'flex', gap: '.65rem', marginBottom: '1.5rem' }}>
        <button onClick={handleSave} style={{ flex: 1, height: 44, borderRadius: 999, border: 'none', background: '#E8553D', color: '#fff', fontSize: '.82rem', fontWeight: 700, cursor: 'pointer', fontFamily: "var(--font-nunito)", transition: 'all .3s' }}>
          {saved ? 'Saved!' : 'Save All Changes'}
        </button>
        <button onClick={handleReset} style={{ height: 44, padding: '0 1.25rem', borderRadius: 999, border: '1.5px solid var(--h-border)', background: '#fff', color: 'var(--h-body)', fontSize: '.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: "var(--font-nunito)", transition: 'all .3s' }}>
          Reset to Defaults
        </button>
      </div>

      {/* ── Session Info ── */}
      <Card title="Session">
        <Row label="Status"><span style={{ fontSize: '.58rem', fontWeight: 700, padding: '.2rem .6rem', borderRadius: 999, background: 'rgba(47,174,106,.1)', color: '#2FAE6A' }}>Active</span></Row>
        <Row label="Expiry"><span style={{ fontSize: '.72rem', fontWeight: 500, color: 'var(--h-heading)' }}>4 hours from login</span></Row>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.6rem 0' }}>
          <span style={{ fontSize: '.72rem', fontWeight: 600, color: 'var(--h-body)' }}>Storage</span>
          <span style={{ fontSize: '.72rem', fontWeight: 500, color: 'var(--h-heading)' }}>Session only (closes with tab)</span>
        </div>
      </Card>

      {/* ── Danger Zone ── */}
      <Card title="Danger Zone" color="#E8553D">
        <p style={{ fontSize: '.72rem', color: 'var(--h-body)', marginBottom: '1rem', lineHeight: 1.5 }}>End your current session.</p>
        <button onClick={() => { clearSession(); window.location.href = '/iww-hq' }}
          style={{ padding: '.55rem 1.5rem', borderRadius: 999, border: 'none', background: '#E8553D', color: '#fff', fontSize: '.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: "var(--font-nunito)" }}>
          Logout
        </button>
      </Card>
    </div>
  )
}
