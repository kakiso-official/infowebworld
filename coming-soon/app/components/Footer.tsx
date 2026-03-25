import Link from 'next/link'
import SafeMailLink from './SafeMailLink'

import { BASE } from '../config/base-path'
const bp = BASE

export default function Footer() {
  return (
    <footer className="ft">
      <div className="container">
        {/* ── Top: Brand + Nav columns ── */}
        <div className="ft-top">
          <div className="ft-brand">
            <img src={`${bp}/logo/infowebworld-logo.png`} alt="InfoWebWorld" className="ft-logo" />
            <p className="ft-tagline">
InfoWebWorld is the Global Platform to explore / search best trusted businesses worldwide.
            </p>
            <div className="ft-social">
              <a href="#" aria-label="Twitter / X">
                <svg viewBox="0 0 24 24"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
              <a href="#" aria-label="YouTube">
                <svg viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
              </a>
            </div>
          </div>

          <div className="ft-columns">
            <div className="ft-col">
              <h4 className="ft-col-title">Company</h4>
              <a href="#benefits" className="ft-col-link">About</a>
                <SafeMailLink user="hello" domain="infowebworld.com" className="ft-col-link">Contact</SafeMailLink>
              <Link href="/blog" className="ft-col-link">Blog</Link>
            </div>
            <div className="ft-col">
              <h4 className="ft-col-title">iWW for Business</h4>
              <Link href="/get-listed" className="ft-col-link">Get Listed</Link>
               <a href="#pricing" className="ft-col-link">Pricing</a>
            </div>
            <div className="ft-col">
              <h4 className="ft-col-title">Legal</h4>
              <a href="#" className="ft-col-link">Privacy Policy</a>
              <a href="#" className="ft-col-link">Terms of Service</a>
              <a href="#" className="ft-col-link">Cookie Policy</a>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="ft-bottom">
          <span className="ft-copy">© 2004 – 2026. Brain Stream Australia Pty Ltd -  <Link href="/" className="ft-col-link">InfoWebWorld.com</Link>. All rights reserved.</span>
          <div className="ft-badges">
            <span className="ft-badge ft-badge--coral">Thousands of Categories</span>
            <span className="ft-badge ft-badge--azure">100+ Countries</span>
            <span className="ft-badge ft-badge--emerald">DA/DR 70* </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
