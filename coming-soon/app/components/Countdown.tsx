'use client'
import { useState, useEffect } from 'react'
import { fetchConfig } from '../config/site-config'
import Link from 'next/link'

let _launchDate = new Date('2026-04-25T00:00:00')

function getTimeLeft() {
  const diff = _launchDate.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

const blocks = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
] as const

export default function Countdown() {
  const [time, setTime] = useState(getTimeLeft)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
    fetchConfig().then(c => { _launchDate = new Date(c.launchDate); setTime(getTimeLeft()) })
    const interval = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(interval)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <section className="countdown-section">
      <div className="container">
        <p className="countdown-tag">Limited Early Access</p>
        <h2 className="countdown-label">
          Our beta will Go Live in
        </h2>
        <div className="countdown-grid" suppressHydrationWarning>
          {blocks.map(b => (
            <div key={b.key} className="countdown-block">
              <div className="countdown-num" suppressHydrationWarning>
                {pad(time[b.key])}
              </div>
              <div className="countdown-unit">{b.label}</div>
            </div>
          ))}
        </div>
        <div className="countdown-cta-wrap">
          <p className="countdown-cta-text"><a href="https://infowebworld.com" className="countdown-cta-link">infoWebWorld.com</a> for Business</p>
          <Link href="/get-listed" className="countdown-cta-btn">
            Get Listed
            <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
