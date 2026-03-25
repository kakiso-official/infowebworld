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
    <section className="cs-hero" id="hero">
      <div className="cs-bg-text" aria-hidden="true">Launching<br className="cs-bg-text-br" /> Soon</div>
      <div className="cs-content">

        <h1 className="cs-h1">
          Global Growth Platform to <br />
          <span className="cs-h1-line2">
            <span className={`cs-rotate-wrap${jsReady ? ' js-active' : ''}`}>
              {words.map((word, i) => (
                <span key={word} className={`cs-rotate-word${i === current ? ' active' : ''}`}>{word}</span>
              ))}
            </span>{' '}
            right Business <em>for your needs...</em>
          </span>
        </h1>

        <h4 className="cs-subtitle">
          Be the first to know when we launch.
        </h4>
        <div className="cs-actions">
          <form className="cs-form" onSubmit={handleHeroJoin}>
            <input type="email" className="cs-input" placeholder="enter your email id" required value={heroEmail} onChange={e => setHeroEmail(e.target.value)} />
            <button type="submit" className="cs-submit">{heroMsg || 'Join'}</button>
          </form>
        </div>
        <p className="cs-desc">
          InfoWebWorld is the Global Platform to explore / search best trusted businesses worldwide.
          #find #compare #connect with great Local Businesses in AI & ML, SaaS & Software, Startups & Innovations, IT Servcies & Agencies, Professional Services in one place - InfoWebWorld.com
        </p>

        {/* <div className="cs-highlights">
          <div className="cs-hl-card cs-hl--coral cs-hl--wide">
            <span className="cs-hl-num">DA 72+</span>
            <span className="cs-hl-label">Dofollow Backlinks</span>
          </div>
          <div className="cs-hl-card cs-hl--emerald">
            <span className="cs-hl-num">98%</span>
            <span className="cs-hl-label">Verified Reviews</span>
          </div>
          <div className="cs-hl-card cs-hl--azure">
            <span className="cs-hl-num">40+</span>
            <span className="cs-hl-label">Leads/mo</span>
          </div>
          <div className="cs-hl-card cs-hl--amber cs-hl--wide">
            <span className="cs-hl-num">2,500+</span>
            <span className="cs-hl-label">Businesses Listed</span>
          </div>
          <div className="cs-hl-card cs-hl--teal cs-hl--wide">
            <span className="cs-hl-num">Daily</span>
            <span className="cs-hl-label">Industry Insights</span>
          </div>
          <div className="cs-hl-card cs-hl--plum">
            <span className="cs-hl-num">12</span>
            <span className="cs-hl-label">Countries</span>
          </div>
        </div> */}
      </div>
      <div className="cs-marquee-mobile" aria-hidden="true">
        <div className="cs-marquee-track">
          <span>launching soon — infowebworld — discover & list the best businesses — verified reviews — dofollow backlinks — 80+ industries — 12 countries — real leads —&nbsp;</span>
          <span>launching soon — infowebworld — discover & list the best businesses — verified reviews — dofollow backlinks — 80+ industries — 12 countries — real leads —&nbsp;</span>
        </div>
      </div>
    </section>
  )
}
