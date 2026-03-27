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
            <img src={`${bp}/logo/infowebworld-logofordarkbackgrounds.png`} alt="InfoWebWorld" className="ft-logo" />
            <p className="ft-tagline">
InfoWebWorld is the Growth Global Platform to explore / search best trusted businesses worldwide.
            </p>
            <div className="ft-social">
              <a href="https://x.com/infowebworld_x" target="_blank" rel="noopener noreferrer" aria-label="X">
                <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="https://www.linkedin.com/company/infowebworld/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
              <a href="https://www.instagram.com/infowebworld" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
            </div>
            <a href="https://www.producthunt.com/products/infowebworld?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-infowebworld" target="_blank" rel="noopener noreferrer" className="ft-ph">
              <img alt="InfoWebWorld on Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1109100&theme=light&t=1774614445568" className="ft-ph-img" />
            </a>
          </div>

          <div className="ft-columns">
            <div className="ft-col">
              <h4 className="ft-col-title">Company</h4>
              <a href="#benefits" className="ft-col-link">About</a>
                <Link href="/contact" className="ft-col-link">Contact</Link>
              <Link href="#" className="ft-col-link">Blog</Link>
            </div>
            <div className="ft-col">
              <h4 className="ft-col-title">iWW for Business</h4>
                             <a href="#pricing" className="ft-col-link">for Business</a>

              <Link href="/business" className="ft-col-link">Get Listed</Link>
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
