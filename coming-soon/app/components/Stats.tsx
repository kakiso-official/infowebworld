'use client'
import { useState, useEffect } from 'react'
import { fetchConfig } from '../config/site-config'

export default function Stats() {
  const [cfg, setCfg] = useState({ statWaitlist: 'Only 199', statListings: 'Only 999', statIndustries: '#000+', statCountries: '#00+', statLanguages: '#0+' })
  useEffect(() => { fetchConfig().then(c => setCfg({ statWaitlist: c.statWaitlist, statListings: c.statListings, statIndustries: c.statIndustries, statCountries: c.statCountries, statLanguages: c.statLanguages })) }, [])

  const stats = [
    { num: cfg.statWaitlist, label: 'Elite Founding Businesses' },
    { num: cfg.statListings, label: 'Early Business Listings' },
    { num: cfg.statIndustries, label: 'Thousands of Categories' },
    { num: cfg.statCountries, label: 'Countries - Millions of Visitors' },
    { num: cfg.statLanguages, label: 'Languages - Coming Soon' },
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
