'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import CurvedLoop from './CurvedLoop'
import { addToWaitlist } from '../iww-hq/data/waitlist-storage'

const words = ['Search', 'Compare', 'Discover', 'Connect', 'Review', ]

export default function Hero() {
  const [displayed, setDisplayed] = useState('Search')
  const [jsReady, setJsReady] = useState(false)
  const [heroEmail, setHeroEmail] = useState('')
  const [heroMsg, setHeroMsg] = useState('')
  const [heroMsgType, setHeroMsgType] = useState<'ok' | 'dup' | ''>('')

  useEffect(() => {
    setJsReady(true)
    let wordIdx = 0
    let charIdx = 0
    let deleting = false
    let timeout: ReturnType<typeof setTimeout>

    function tick() {
      const word = words[wordIdx]
      if (!deleting) {
        charIdx++
        setDisplayed(word.slice(0, charIdx))
        if (charIdx === word.length) {
          timeout = setTimeout(() => { deleting = true; tick() }, 1200)
          return
        }
        timeout = setTimeout(tick, 100)
      } else {
        charIdx--
        setDisplayed(word.slice(0, charIdx))
        if (charIdx === 0) {
          deleting = false
          wordIdx = (wordIdx + 1) % words.length
          timeout = setTimeout(tick, 300)
          return
        }
        timeout = setTimeout(tick, 60)
      }
    }
    tick()
    return () => clearTimeout(timeout)
  }, [])

  const handleHeroJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!heroEmail) return
    setHeroMsg(''); setHeroMsgType('')
    const result = await addToWaitlist(heroEmail, 'hero')
    if (result === 'ok') {
      setHeroMsg("You're on the list!"); setHeroMsgType('ok'); setHeroEmail('')
    } else if (result === 'duplicate') {
      setHeroMsg('Already on the waitlist!'); setHeroMsgType('dup')
    } else {
      setHeroMsg('Something went wrong. Try again.'); setHeroMsgType('dup')
    }
    setTimeout(() => { setHeroMsg(''); setHeroMsgType('') }, 5000)
  }

  return (
    <section className="cs-hero" id="hero">
      <div className="cs-bg-text" aria-hidden="true">Launching<br className="cs-bg-text-br" /> Soon</div>
      <div className="cs-content">

        <h1 className="cs-h1">
          Global Growth Platform to <br />
          <span className="cs-h1-line2">
            <span className={`cs-type-wrap${jsReady ? ' js-active' : ''}`}>
              <span className="cs-type-text">{displayed}</span>
              <span className="cs-type-cursor" />
            </span>{' '}
            right Business <em>for your needs...</em>
          </span>
        </h1>

        <h4 className="cs-subtitle">
          Be the first to know when we launch.
        </h4>
        <div className="cs-actions">
          <div className="cs-form-arrow-wrap">
            <form className="cs-form" onSubmit={handleHeroJoin}>
              <input type="email" className="cs-input" placeholder="enter your email id" required value={heroEmail} onChange={e => setHeroEmail(e.target.value)} />
              <button type="submit" className={`cs-submit${heroMsgType === 'ok' ? ' cs-submit--ok' : heroMsgType === 'dup' ? ' cs-submit--dup' : ''}`}>{heroMsg || 'Join'}</button>
            </form>
            <svg className="cs-curvy-arrow" viewBox="0 0 100 100" fill="none" aria-hidden="true">
              <path className="cs-arrow-line" d="M90 8 C70 2, 58 74, 16 50" stroke="var(--h-accent)" strokeWidth="2.6" strokeLinecap="round" />
              <path className="cs-arrow-head-1" d="M16 50 L30 42" stroke="var(--h-accent)" strokeWidth="3" strokeLinecap="round" />
              <path className="cs-arrow-head-2" d="M16 50 L28 60" stroke="var(--h-accent)" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <p className="cs-desc">
          InfoWebWorld is the Global Platform to explore / search best trusted businesses worldwide. 
          <strong>#find</strong> <strong>#compare</strong> <strong>#connect</strong> with great Local Businesses in AI & ML, SaaS & Software, Startups & Innovations, IT Services & Agencies, Professional Services in one place - <a href="https://www.infowebworld.com/" className="cs-brand">infoWebWorld.com</a>
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
          <span>Launching Soon - Global Growth Platform - InfoWebWorld.com - Discover & Connect - Leads - Reviews - Compare - News - Thousands of Categories - 100+ Countries Traffic -&nbsp;</span>
          <span>Launching Soon - Global Growth Platform - InfoWebWorld.com - Discover & Connect - Leads - Reviews - Compare - News - Thousands of Categories - 100+ Countries Traffic -&nbsp;</span>
        </div>
      </div>
    </section>
  )
}
