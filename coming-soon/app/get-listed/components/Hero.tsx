'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import CurvedLoop from './CurvedLoop'
import { addToWaitlist } from '../../iww-hq/data/waitlist-storage'

const words = ['Search', 'Compare', 'Discover', 'Connect', 'Review', ]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [jsReady, setJsReady] = useState(false)
  const [heroEmail, setHeroEmail] = useState('')
  const [heroMsg, setHeroMsg] = useState('')

  useEffect(() => {
    setJsReady(true)
    const interval = setInterval(() => setCurrent(prev => (prev + 1) % words.length), 2200)
    return () => clearInterval(interval)
  }, [])

  const handleHeroJoin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!heroEmail) return
    const ok = addToWaitlist(heroEmail, 'hero')
    setHeroMsg(ok ? 'You\'re on the list!' : 'Already on the waitlist!')
    if (ok) setHeroEmail('')
    setTimeout(() => setHeroMsg(''), 3000)
  }

  return (
    <section className="gcs-hero" id="hero">
      <div className="gcs-bg-text" aria-hidden="true">Launching<br className="gcs-bg-text-br" /> Soon</div>
      <div className="gcs-content">

        <h1 className="gcs-h1">
          Global Growth Platform to <br />
          <span className="gcs-h1-line2">
            <span className={`gcs-rotate-wrap${jsReady ? ' js-active' : ''}`}>
              {words.map((word, i) => (
                <span key={word} className={`gcs-rotate-word${i === current ? ' active' : ''}`}>{word}</span>
              ))}
            </span>{' '}
            right Business <em>for your needs...</em>
          </span>
        </h1>

        <h4 className="gcs-subtitle">
          Be the first to know when we launch.
        </h4>
        <div className="gcs-actions">
          <form className="gcs-form" onSubmit={handleHeroJoin}>
            <input type="email" className="gcs-input" placeholder="enter your email id" required value={heroEmail} onChange={e => setHeroEmail(e.target.value)} />
            <button type="submit" className="gcs-submit">{heroMsg || 'Join'}</button>
          </form>
        </div>
        <p className="gcs-desc">
          InfoWebWorld is the Global Platform to explore / search best trusted businesses worldwide.
          #find #compare #connect with great Local Businesses in AI & ML, SaaS & Software, Startups & Innovations, IT Servcies & Agencies, Professional Services in one place - InfoWebWorld.com
        </p>

        {/* <div className="gcs-highlights">
          <div className="gcs-hl-card gcs-hl--coral gcs-hl--wide">
            <span className="gcs-hl-num">DA 72+</span>
            <span className="gcs-hl-label">Dofollow Backlinks</span>
          </div>
          <div className="gcs-hl-card gcs-hl--emerald">
            <span className="gcs-hl-num">98%</span>
            <span className="gcs-hl-label">Verified Reviews</span>
          </div>
          <div className="gcs-hl-card gcs-hl--azure">
            <span className="gcs-hl-num">40+</span>
            <span className="gcs-hl-label">Leads/mo</span>
          </div>
          <div className="gcs-hl-card gcs-hl--amber gcs-hl--wide">
            <span className="gcs-hl-num">2,500+</span>
            <span className="gcs-hl-label">Businesses Listed</span>
          </div>
          <div className="gcs-hl-card gcs-hl--teal gcs-hl--wide">
            <span className="gcs-hl-num">Daily</span>
            <span className="gcs-hl-label">Industry Insights</span>
          </div>
          <div className="gcs-hl-card gcs-hl--plum">
            <span className="gcs-hl-num">12</span>
            <span className="gcs-hl-label">Countries</span>
          </div>
        </div> */}
      </div>
      <div className="gcs-marquee-mobile" aria-hidden="true">
        <div className="gcs-marquee-track">
          <span>launching soon — infowebworld — discover & list the best businesses — verified reviews — dofollow backlinks — 80+ industries — 12 countries — real leads —&nbsp;</span>
          <span>launching soon — infowebworld — discover & list the best businesses — verified reviews — dofollow backlinks — 80+ industries — 12 countries — real leads —&nbsp;</span>
        </div>
      </div>
    </section>
  )
}
