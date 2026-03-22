'use client'
import { useState, useEffect } from 'react'
import { getConfig } from '../config/site-config'

function getLaunchDate(): Date {
  if (typeof window === 'undefined') return new Date('2026-04-25T00:00:00')
  return new Date(getConfig().launchDate)
}

function getTimeLeft() {
  const diff = getLaunchDate().getTime() - Date.now()
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
    setTime(getTimeLeft())
    const interval = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(interval)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <section className="countdown-section">
      <div className="container">
        <p className="countdown-tag">Limited Early Access</p>
        <h2 className="countdown-label">
          We Launch In
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
        <p className="countdown-note">Lock in founding member pricing before launch day</p>
      </div>
    </section>
  )
}
