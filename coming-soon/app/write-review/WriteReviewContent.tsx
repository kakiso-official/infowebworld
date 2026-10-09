import Link from 'next/link'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMagnifyingGlass, faStar, faPenToSquare, faShieldHalved,
  faBagShopping, faBullseye, faScaleBalanced, faUser, faHandshake, faUserShield,
  faCircleCheck, faCircleXmark, faUserCheck, faBan, faGavel, faCircleQuestion,
  faUsers, faAward, faBullhorn, faBuilding, faPaperPlane, faChevronDown, faArrowRight,
} from '@fortawesome/free-solid-svg-icons'
import { renderLinkedText } from '../components/linked-text'
import { SECTOR_LINKS } from '../components/sector-links'
import {
  WR_STEPS, WR_TIPS, WR_ALLOWED, WR_REMOVED, WR_VERIFY, WR_WHY, WR_ADD_COMPANY,
  WR_CATEGORIES_INTRO, WR_CATEGORY_LABELS, WR_OWNERS, WR_FAQS,
} from './write-review-data'

/* ═══════════════════════════════════════════════════════════════════════
   /write-review guide content - everything below the search box (SEO
   brief, Oct 2026). Server Component rendered by the page right after
   the client flow, so the copy is plain server HTML; write-review.css
   hides it once the visitor moves past the company search.
   ═══════════════════════════════════════════════════════════════════════ */

const STEP_ICONS = [faMagnifyingGlass, faStar, faPenToSquare, faShieldHalved]
const TIP_ICONS = [faBagShopping, faBullseye, faScaleBalanced, faUser, faHandshake, faUserShield]
const VERIFY_ICONS = [faUserCheck, faShieldHalved, faBan, faGavel, faCircleQuestion]
const WHY_ICONS = [faUsers, faAward, faBullhorn]

export default function WriteReviewContent() {
  return (
    <div className="wr-guide">
      {/* ── How to write a review ── */}
      <section className="wr-sec" aria-labelledby="wr-how-h">
        <div className="wr-sec-inner">
          <h2 id="wr-how-h" className="wr-h2">How to Write a Review on InfoWebWorld</h2>
          <ol className="wr-steps">
            {WR_STEPS.map((step, i) => (
              <li key={step.title} className="wr-step">
                <div className="wr-step-top">
                  <span className="wr-step-num" aria-hidden="true">{i + 1}</span>
                  <span className="wr-step-ico" aria-hidden="true"><FontAwesomeIcon icon={STEP_ICONS[i]} /></span>
                </div>
                <p><strong>{step.title}</strong> {step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Tips ── */}
      <section className="wr-sec wr-sec--tint" aria-labelledby="wr-tips-h">
        <div className="wr-sec-inner">
          <h2 id="wr-tips-h" className="wr-h2">Tips for Writing a Helpful Business Review</h2>
          <ul className="wr-tips">
            {WR_TIPS.map((tip, i) => (
              <li key={tip.title} className="wr-tip">
                <span className="wr-tip-ico" aria-hidden="true"><FontAwesomeIcon icon={TIP_ICONS[i]} /></span>
                <p><strong>{tip.title}</strong> {tip.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Allowed vs removed ── */}
      <section className="wr-sec" aria-labelledby="wr-rules-h">
        <div className="wr-sec-inner">
          <h2 id="wr-rules-h" className="wr-h2">What We Allow and What We Remove</h2>
          <div className="wr-rules">
            <div className="wr-rule wr-rule--ok">
              <span className="wr-rule-ico" aria-hidden="true"><FontAwesomeIcon icon={faCircleCheck} /></span>
              <p><strong>{WR_ALLOWED.title}</strong> {WR_ALLOWED.text}</p>
            </div>
            <div className="wr-rule wr-rule--no">
              <span className="wr-rule-ico" aria-hidden="true"><FontAwesomeIcon icon={faCircleXmark} /></span>
              <p><strong>{WR_REMOVED.title}</strong> {renderLinkedText(WR_REMOVED.text, WR_REMOVED.links)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Verification + moderation ── */}
      <section className="wr-sec wr-sec--tint" aria-labelledby="wr-verify-h">
        <div className="wr-sec-inner">
          <h2 id="wr-verify-h" className="wr-h2">How We Verify and Moderate Reviews</h2>
          <ul className="wr-checks">
            {WR_VERIFY.map((item, i) => (
              <li key={item.title} className="wr-check">
                <span className="wr-check-ico" aria-hidden="true"><FontAwesomeIcon icon={VERIFY_ICONS[i]} /></span>
                <p><strong>{item.title}</strong> {renderLinkedText(item.text, item.links)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Why it matters ── */}
      <section className="wr-sec" aria-labelledby="wr-why-h">
        <div className="wr-sec-inner">
          <h2 id="wr-why-h" className="wr-h2">Why Your Review Matters</h2>
          <div className="wr-why">
            {WR_WHY.map((item, i) => (
              <div key={item.title} className="wr-why-card">
                <span className="wr-why-ico" aria-hidden="true"><FontAwesomeIcon icon={WHY_ICONS[i]} /></span>
                <h3 className="wr-h3">{item.title}</h3>
                <p>{renderLinkedText(item.text, item.links)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Company not listed ── */}
      <section className="wr-sec wr-sec--tint" aria-labelledby="wr-add-h">
        <div className="wr-sec-inner">
          <div className="wr-banner">
            <span className="wr-banner-ico" aria-hidden="true"><FontAwesomeIcon icon={faBuilding} /></span>
            <div>
              <h2 id="wr-add-h" className="wr-h2">Can&apos;t Find the Company? Add It First</h2>
              <p>{renderLinkedText(WR_ADD_COMPANY.text, WR_ADD_COMPANY.links)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="wr-sec" aria-labelledby="wr-cats-h">
        <div className="wr-sec-inner">
          <h2 id="wr-cats-h" className="wr-h2">Review Businesses Across Every Category</h2>
          <p className="wr-lead">{WR_CATEGORIES_INTRO}</p>
          <ul className="wr-cats">
            {SECTOR_LINKS.map(s => (
              <li key={s.slug}>
                <Link href={s.href} className="wr-cat" style={{ '--wr-cat': s.accent } as React.CSSProperties}>
                  <span className="wr-cat-ico" aria-hidden="true"><FontAwesomeIcon icon={s.icon} /></span>
                  <span className="wr-cat-name">{WR_CATEGORY_LABELS[s.slug]}</span>
                  <FontAwesomeIcon icon={faArrowRight} className="wr-cat-arrow" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/categories" className="wr-more">
            See all categories <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ── Business owners ── */}
      <section className="wr-sec wr-sec--tint" aria-labelledby="wr-owners-h">
        <div className="wr-sec-inner">
          <div className="wr-banner wr-banner--dark">
            <span className="wr-banner-ico" aria-hidden="true"><FontAwesomeIcon icon={faPaperPlane} /></span>
            <div>
              <h2 id="wr-owners-h" className="wr-h2">Business Owners: Invite Customers to Review You</h2>
              <p>{renderLinkedText(WR_OWNERS.text, WR_OWNERS.links)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="wr-sec" aria-labelledby="wr-faq-h">
        <div className="wr-sec-inner wr-sec-inner--narrow">
          <h2 id="wr-faq-h" className="wr-h2">FAQs</h2>
          <div className="wr-faqs">
            {WR_FAQS.map((faq, i) => (
              <details key={faq.q} className="wr-faq" open={i === 0}>
                <summary>
                  <h3 className="wr-faq-q">{faq.q}</h3>
                  <FontAwesomeIcon icon={faChevronDown} className="wr-faq-chev" aria-hidden="true" />
                </summary>
                <p className="wr-faq-a">{renderLinkedText(faq.a, faq.links)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
