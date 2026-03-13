import { useState } from 'react'
import { Link } from 'react-router-dom'

const STAR_PATH = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"
const THUMB_UP_PATH_1 = "M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"
const THUMB_UP_PATH_2 = "M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"
const THUMB_DOWN_PATH_1 = "M10 15V19a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z"
const THUMB_DOWN_PATH_2 = "M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"

function HelpfulButton({ icon, label, initialCount }) {
  const [active, setActive] = useState(false)

  return (
    <span
      className="ls-review-helpful-btn"
      style={active ? { color: 'var(--accent)' } : {}}
      onClick={() => setActive(!active)}
    >
      {icon === 'up' ? (
        <svg viewBox="0 0 24 24"><path d={THUMB_UP_PATH_1}/><path d={THUMB_UP_PATH_2}/></svg>
      ) : (
        <svg viewBox="0 0 24 24"><path d={THUMB_DOWN_PATH_1}/><path d={THUMB_DOWN_PATH_2}/></svg>
      )}
      {label} ({initialCount})
    </span>
  )
}

function StarIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "#E5A100" : "#E2E8F0"} stroke="none">
      <path d={STAR_PATH}/>
    </svg>
  )
}

function ReviewCard({ initials, avatarStyle, name, role, stars, date, title, text, pros, cons, helpful, notHelpful }) {
  return (
    <div className="ls-review fade-in visible">
      <div className="ls-review-top">
        <div className="ls-review-avatar" style={avatarStyle || {}}>
          {initials}
        </div>
        <div className="ls-review-author">
          <div className="ls-review-name">{name}</div>
          <div className="ls-review-role">{role}</div>
        </div>
        <div className="ls-review-rating">
          {[1,2,3,4,5].map(i => <StarIcon key={i} filled={i <= stars} />)}
          <span className="ls-review-date">{date}</span>
        </div>
      </div>
      <div className="ls-review-title">{title}</div>
      <div className="ls-review-text">{text}</div>
      <div className="ls-review-pros">
        <div className="ls-review-pros-title">What I Like</div>
        <div className="ls-review-pros-text">{pros}</div>
      </div>
      <div className="ls-review-cons">
        <div className="ls-review-cons-title">What Could Improve</div>
        <div className="ls-review-cons-text">{cons}</div>
      </div>
      <div className="ls-review-helpful">
        <HelpfulButton icon="up" label="Helpful" initialCount={helpful} />
        <HelpfulButton icon="down" label="Not Helpful" initialCount={notHelpful} />
      </div>
    </div>
  )
}

export default function ListingReviews() {
  return (
    <>
      {/* ===== REVIEWS SECTION ===== */}
      <div id="ls-reviews" className="ls-section fade-in visible">
        <div className="ls-section-title">
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          Reviews
        </div>

        {/* Summary */}
        <div className="ls-reviews-summary">
          <div className="ls-reviews-big">
            <div className="ls-reviews-big-score">4.6</div>
            <div className="ls-reviews-big-stars">
              <StarIcon filled={true} />
              <StarIcon filled={true} />
              <StarIcon filled={true} />
              <StarIcon filled={true} />
              <StarIcon filled={false} />
            </div>
            <div className="ls-reviews-big-count">312 reviews</div>
          </div>
          <div className="ls-reviews-bars">
            {[
              { label: '5', width: '52%', pct: '52%' },
              { label: '4', width: '28%', pct: '28%' },
              { label: '3', width: '12%', pct: '12%' },
              { label: '2', width: '5%', pct: '5%' },
              { label: '1', width: '3%', pct: '3%' },
            ].map((bar) => (
              <div className="ls-rev-bar" key={bar.label}>
                <span className="ls-rev-bar-label">{bar.label}</span>
                <div className="ls-rev-bar-track"><div className="ls-rev-bar-fill" style={{width: bar.width}}></div></div>
                <span className="ls-rev-bar-pct">{bar.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review 1 */}
      <ReviewCard
        initials="RK"
        name="Raj Krishnamurthy"
        role="DevOps Lead at ScaleGrid Inc"
        stars={5}
        date="Mar 5, 2026"
        title="Eliminated our cloud management headaches overnight"
        text="We were juggling three different cloud providers with custom scripts that broke constantly. CloudSync Pro replaced all of that within a week. The real-time sync is genuinely real-time, the conflict resolution is smart enough that we rarely need to intervene, and the dashboard gives us visibility we never had before."
        pros="Multi-cloud sync just works. Setup was surprisingly painless. The alerting system caught an AWS outage before our monitoring did."
        cons="The mobile app is bare-bones. Would love better Terraform integration for IaC workflows."
        helpful={24}
        notHelpful={1}
      />

      {/* Review 2 */}
      <ReviewCard
        initials="EM"
        avatarStyle={{background:'linear-gradient(135deg,var(--emerald),var(--teal))'}}
        name="Elena Martinez"
        role="CTO at FinEdge Solutions"
        stars={4}
        date="Feb 21, 2026"
        title="Solid platform with enterprise-grade compliance"
        text="As a fintech company, compliance is non-negotiable. CloudSync Pro's SOC 2 certification and audit logging capabilities made the procurement process smooth. The encryption at rest and in transit meets our security team's requirements. Performance-wise, syncing 2TB+ datasets across regions is fast and reliable."
        pros="Compliance documentation is thorough. Audit logs are detailed. The security posture is genuinely enterprise-grade."
        cons="Pricing jumps significantly from Professional to Enterprise. Wish the API rate limits were higher on mid-tier plans."
        helpful={18}
        notHelpful={0}
      />

      {/* Review 3 */}
      <ReviewCard
        initials="TN"
        avatarStyle={{background:'linear-gradient(135deg,var(--coral),var(--amber))'}}
        name="Tom Nguyen"
        role="Senior SRE at Meridian Health"
        stars={5}
        date="Feb 8, 2026"
        title="Best disaster recovery tool we've used"
        text="After a ransomware scare last year, we invested heavily in backup and DR. CloudSync Pro's one-click rollback literally saved us during a staging environment corruption incident. The backup scheduling is flexible, and the cross-region replication gives us peace of mind. Worth every penny."
        pros="One-click disaster recovery is a lifesaver. Cross-region replication is seamless. Support team responds within hours."
        cons="Documentation could be more detailed for edge cases. The initial data migration took longer than expected for large datasets."
        helpful={31}
        notHelpful={2}
      />

      {/* Write Review CTA */}
      <div className="fade-in visible" style={{textAlign:'center',padding:'8px 0 0'}}>
        <Link to="/write-review" className="ls-btn ls-btn-primary" style={{padding:'9px 28px'}}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          Write a Review
        </Link>
      </div>
    </>
  )
}
