import Link from 'next/link'

/* ═══════════════════════════════════════════════════════════════════════
   Final CTA banner — compact, lovely, sits at the very bottom of the
   landing before the footer.

   Reference: GoodFirms "Connect with your next customer on Goodfirms"
   (gray pill-card with a primary button on the right). We refine: soft
   brand-mint gradient + a faint coral radial glow at the corner so the
   card has visual life without being heavy. Single rounded card,
   generous padding, dark-green pill CTA.
   ═══════════════════════════════════════════════════════════════════════ */

export default function FinalCtaSection() {
  return (
    <section className="tlp-fcta" aria-labelledby="tlp-fcta-h">
      <div className="tlp-fcta-inner">
        <div className="tlp-fcta-card">
          <div className="tlp-fcta-text">
            <h2 id="tlp-fcta-h" className="tlp-fcta-title">
              Get in front of your next customer on InfoWebWorld.
            </h2>
            <p className="tlp-fcta-sub">
              Join the directory where buyers actively search, compare, and choose their next partner.
            </p>
          </div>
          <Link href="/business" className="tlp-fcta-btn">
            List your business
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
                 strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
