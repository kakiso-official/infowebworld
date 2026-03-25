'use client'
import { useState, useEffect } from 'react'
import { fetchConfig } from '../../config/site-config'

export default function Stats() {
  const [cfg, setCfg] = useState({ statWaitlist: '10,000+', statListings: '500+', statIndustries: '80+', statCountries: '12', statLanguages: '8' })
  useEffect(() => { fetchConfig().then(c => setCfg({ statWaitlist: c.statWaitlist, statListings: c.statListings, statIndustries: c.statIndustries, statCountries: c.statCountries, statLanguages: c.statLanguages })) }, [])

  const stats = [
    { num: cfg.statWaitlist, label: 'Waitlist Target' },
    { num: cfg.statListings, label: 'Launch Listings' },
    { num: cfg.statIndustries, label: 'Industries' },
    { num: cfg.statCountries, label: 'Countries' },
    { num: cfg.statLanguages, label: 'Languages' },
  ]

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map(s => (
            <div key={s.label} className="stat-item">
              <div className="stat-num" dangerouslySetInnerHTML={{ __html: s.num.replace('+', '<em>+</em>') }} />
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
