import { HugeiconsIcon } from '@hugeicons/react'
import {
  StoreVerified02Icon,
  RefreshIcon,
  MedalFirstPlaceIcon,
  Analytics01Icon,
} from '@hugeicons/core-free-icons'

/* ═══════════════════════════════════════════════════════════════════════
   "Why trust InfoWebWorld" banner — light-gray section under the
   stories carousel.

   Reference: GoodFirms "Why trust Goodfirms" — left column with a big
   bold heading, right area with a 2×2 grid of trust points (outlined
   icon + short sentence each).
   ═══════════════════════════════════════════════════════════════════════ */

const POINTS: { icon: typeof StoreVerified02Icon; text: string }[] = [
  {
    icon: StoreVerified02Icon,
    text: 'Every listing on InfoWebWorld is verified for authenticity and ownership.',
  },
  {
    icon: RefreshIcon,
    text: 'Listing data is regularly refreshed so the information stays accurate.',
  },
  {
    icon: MedalFirstPlaceIcon,
    text: 'Ratings and reviews come from real buyers — we never manipulate them.',
  },
  {
    icon: Analytics01Icon,
    text: 'Our research and rankings are transparent, independent, and unbiased.',
  },
]

export default function TrustSection() {
  return (
    <section className="tlp-trust" aria-labelledby="tlp-trust-h">
      <div className="tlp-trust-inner">
        <h2 id="tlp-trust-h" className="tlp-trust-title">
          Why trust <br />InfoWebWorld
        </h2>
        <div className="tlp-trust-grid">
          {POINTS.map(p => (
            <div key={p.text} className="tlp-trust-item">
              <span className="tlp-trust-ico">
                <HugeiconsIcon icon={p.icon} size={32} strokeWidth={1.9} color="currentColor" />
              </span>
              <p className="tlp-trust-text">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
