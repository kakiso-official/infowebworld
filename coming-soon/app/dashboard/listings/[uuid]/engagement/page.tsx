import Link from 'next/link'
import { notFound } from 'next/navigation'
import { query, queryOne } from '@/lib/db'
import { requireDashboardUser } from '@/lib/user-auth'
import DashboardHeader from '../../../DashboardHeader'

export const dynamic = 'force-dynamic'

interface Listing {
  id: number
  uuid: string
  slug: string
  company_name: string
  logo_url: string | null
  status: string
}
interface ReviewRow {
  id: number
  rating: number
  title: string
  body: string
  created_at: string
  status: string
  user_id: number
  user_name: string | null
  user_avatar_url: string | null
  user_email: string | null
}
interface ReactionRow {
  kind: 'like' | 'dislike'
  created_at: string
  user_name: string | null
  user_avatar_url: string | null
  user_email: string | null
}
interface FollowRow {
  created_at: string
  user_name: string | null
  user_avatar_url: string | null
  user_email: string | null
}
interface BookmarkRow {
  created_at: string
  user_name: string | null
  user_avatar_url: string | null
  user_email: string | null
}
interface InboxRow {
  id: number
  email: string
  ip_address: string | null
  created_at: string
}

function formatDate(input: string): string {
  if (!input) return ''
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return input
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}
function formatRelative(input: string): string {
  if (!input) return ''
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return input
  const diff = (Date.now() - d.getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 86400 * 30) return `${Math.floor(diff / 86400)}d ago`
  return formatDate(input)
}
function initialsOf(name: string | null, fallback: string): string {
  const src = (name && name.trim()) || fallback
  return src
    .trim().split(/\s+/).map(s => s[0] || '').filter(Boolean).slice(0, 2).join('').toUpperCase() || '?'
}
function displayName(name: string | null, email: string | null): string {
  if (name && name.trim()) return name.trim()
  if (email) return email.split('@')[0]
  return 'Anonymous'
}

export default async function EngagementPage({
  params,
}: {
  params: Promise<{ uuid: string }>
}) {
  const { uuid } = await params
  const user = await requireDashboardUser()

  const listing = await queryOne<Listing>(
    `SELECT id, uuid, slug, company_name, logo_url, status
       FROM submissions
      WHERE uuid = ? AND user_id = ?
      LIMIT 1`,
    [uuid, user.id]
  )
  if (!listing) notFound()

  const [reviews, reactions, follows, bookmarks, inbox] = await Promise.all([
    query<ReviewRow>(
      `SELECT r.id, r.rating, r.title, r.body, r.created_at, r.status, r.user_id,
              u.name AS user_name, u.avatar_url AS user_avatar_url, u.email AS user_email
         FROM reviews r
         LEFT JOIN business_users u ON u.id = r.user_id
        WHERE r.listing_id = ?
        ORDER BY r.created_at DESC LIMIT 200`,
      [listing.id]
    ),
    query<ReactionRow>(
      `SELECT lr.kind, lr.created_at,
              u.name AS user_name, u.avatar_url AS user_avatar_url, u.email AS user_email
         FROM listing_reactions lr
         LEFT JOIN business_users u ON u.id = lr.user_id
        WHERE lr.listing_id = ?
        ORDER BY lr.created_at DESC LIMIT 200`,
      [listing.id]
    ),
    query<FollowRow>(
      `SELECT lf.created_at,
              u.name AS user_name, u.avatar_url AS user_avatar_url, u.email AS user_email
         FROM listing_follows lf
         LEFT JOIN business_users u ON u.id = lf.user_id
        WHERE lf.listing_id = ?
        ORDER BY lf.created_at DESC LIMIT 200`,
      [listing.id]
    ),
    query<BookmarkRow>(
      `SELECT lb.created_at,
              u.name AS user_name, u.avatar_url AS user_avatar_url, u.email AS user_email
         FROM listing_bookmarks lb
         LEFT JOIN business_users u ON u.id = lb.user_id
        WHERE lb.listing_id = ?
        ORDER BY lb.created_at DESC LIMIT 200`,
      [listing.id]
    ),
    query<InboxRow>(
      `SELECT id, email, ip_address, created_at
         FROM listing_inbox_emails
        WHERE listing_id = ?
        ORDER BY created_at DESC LIMIT 200`,
      [listing.id]
    ),
  ])

  const likes = reactions.filter(r => r.kind === 'like')
  const dislikes = reactions.filter(r => r.kind === 'dislike')

  const avgRating = reviews.length > 0
    ? Number((reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / reviews.length).toFixed(1))
    : 0

  const isLive = listing.status === 'active' || listing.status === 'paid'

  return (
    <div className="dash eng-page">
      <DashboardHeader
        title={`Engagement · ${listing.company_name}`}
        subtitle={
          <>
            Reviews, reactions, followers and inbound leads on this listing.
            {' · '}
            {isLive
              ? <Link href={`/company/${listing.slug}`} target="_blank" rel="noopener noreferrer">View live page ↗</Link>
              : <span className="eng-muted">Awaiting review — not live yet</span>}
            {' · '}
            <Link href={`/dashboard/listings/${listing.uuid}/edit`}>Edit listing</Link>
          </>
        }
        breadcrumb={{
          trail: [
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'My listings', href: '/dashboard/listings' },
          ],
          current: listing.company_name,
        }}
      />

      {/* ── Stat tiles ── */}
      <div className="eng-stats">
        <a href="#reviews" className="eng-stat eng-stat--reviews">
          <div className="eng-stat-num">{reviews.length}</div>
          <div className="eng-stat-lbl">Reviews</div>
          {reviews.length > 0 && (
            <div className="eng-stat-sub">
              <span className="eng-stat-stars">★</span>
              <span>{avgRating.toFixed(1)} avg</span>
            </div>
          )}
        </a>
        <a href="#leads" className="eng-stat eng-stat--leads">
          <div className="eng-stat-num">{inbox.length}</div>
          <div className="eng-stat-lbl">Lead emails</div>
          {inbox.length > 0 && (
            <div className="eng-stat-sub">Latest {formatRelative(inbox[0].created_at)}</div>
          )}
        </a>
        <a href="#likes" className="eng-stat eng-stat--likes">
          <div className="eng-stat-num">{likes.length}</div>
          <div className="eng-stat-lbl">Likes</div>
        </a>
        <a href="#dislikes" className="eng-stat eng-stat--dislikes">
          <div className="eng-stat-num">{dislikes.length}</div>
          <div className="eng-stat-lbl">Dislikes</div>
        </a>
        <a href="#followers" className="eng-stat eng-stat--followers">
          <div className="eng-stat-num">{follows.length}</div>
          <div className="eng-stat-lbl">Followers</div>
        </a>
        <a href="#bookmarks" className="eng-stat eng-stat--bookmarks">
          <div className="eng-stat-num">{bookmarks.length}</div>
          <div className="eng-stat-lbl">Saves</div>
        </a>
      </div>

      {/* ── Reviews ── */}
      <section className="eng-sec" id="reviews">
        <header className="eng-sec-head">
          <h2 className="eng-sec-title">Reviews</h2>
          <span className="eng-sec-count">{reviews.length}</span>
          {reviews.length > 0 && (
            <span className="eng-sec-meta">
              <span className="eng-stat-stars">★</span>
              {avgRating.toFixed(1)} average
            </span>
          )}
        </header>
        {reviews.length === 0 ? (
          <EmptyCard
            title="No reviews yet"
            body={`When ${listing.company_name} gets its first review, it will appear here. You'll also get an email so you can reply fast.`}
          />
        ) : (
          <div className="eng-reviews">
            {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
        )}
      </section>

      {/* ── Lead inbox ── */}
      <section className="eng-sec" id="leads">
        <header className="eng-sec-head">
          <h2 className="eng-sec-title">Lead inbox</h2>
          <span className="eng-sec-count eng-sec-count--accent">{inbox.length}</span>
          <span className="eng-sec-meta">visitors who asked to be contacted</span>
        </header>
        {inbox.length === 0 ? (
          <EmptyCard
            title="No leads yet"
            body="Visitors can leave their email on your listing asking for more info. Each lead lands here and in your inbox."
          />
        ) : (
          <div className="eng-leads">
            {inbox.map(row => (
              <div key={row.id} className="eng-lead">
                <div className="eng-lead-main">
                  <a href={`mailto:${row.email}?subject=Re%3A%20${encodeURIComponent(listing.company_name)}`} className="eng-lead-email">
                    {row.email}
                  </a>
                  <div className="eng-lead-meta">
                    {formatRelative(row.created_at)} · {formatDate(row.created_at)}
                  </div>
                </div>
                <a href={`mailto:${row.email}?subject=Re%3A%20${encodeURIComponent(listing.company_name)}`}
                   className="eng-lead-reply">
                  Reply
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Likes / Dislikes side-by-side on desktop, stacked on mobile ── */}
      <div className="eng-react-grid">
        <ReactionList id="likes" kind="like" rows={likes} title="People who liked your listing" />
        <ReactionList id="dislikes" kind="dislike" rows={dislikes} title="People who disliked" />
      </div>

      {/* ── Followers ── */}
      <PeopleSection
        id="followers"
        title="Followers"
        rows={follows}
        emptyTitle="No followers yet"
        emptyBody="Followers see your updates first when you post product news, releases or content."
        accent="green"
      />

      {/* ── Bookmarks ── */}
      <PeopleSection
        id="bookmarks"
        title="Saved by"
        rows={bookmarks}
        emptyTitle="No saves yet"
        emptyBody="A save is a strong 'I'll be back' signal — usually evaluation or comparison intent."
        accent="purple"
      />
    </div>
  )
}

/* ────────────────────────── Sub-components ────────────────────────── */

function ReviewCard({ review }: { review: ReviewRow }) {
  const stars = '★★★★★'.slice(0, review.rating).padEnd(5, '☆')
  const name = displayName(review.user_name, review.user_email)
  return (
    <article className="eng-rev">
      <div className="eng-rev-head">
        <Avatar
          name={review.user_name}
          email={review.user_email}
          url={review.user_avatar_url}
          accent="#0C9A9A"
          size={42}
        />
        <div className="eng-rev-who">
          <div className="eng-rev-name">{name}</div>
          <div className="eng-rev-meta">
            <span className="eng-rev-stars">{stars}</span>
            <span className="eng-rev-rating">{review.rating}/5</span>
            <span className="eng-rev-dot">·</span>
            <span>{formatRelative(review.created_at)}</span>
            {review.status !== 'approved' && (
              <span className={`eng-rev-status eng-rev-status--${review.status}`}>{review.status}</span>
            )}
          </div>
        </div>
        {review.user_email && (
          <a href={`mailto:${review.user_email}`} className="eng-rev-reply" title="Email this reviewer">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 8v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" />
              <path d="M21 8L12 14 3 8" />
              <path d="M3 8l9-5 9 5" />
            </svg>
          </a>
        )}
      </div>
      <h3 className="eng-rev-title">{review.title}</h3>
      <p className="eng-rev-body">{review.body}</p>
    </article>
  )
}

function ReactionList({
  id, kind, rows, title,
}: {
  id: string
  kind: 'like' | 'dislike'
  rows: ReactionRow[]
  title: string
}) {
  return (
    <section className={`eng-sec eng-sec--small eng-sec--${kind}`} id={id}>
      <header className="eng-sec-head">
        <h2 className="eng-sec-title">
          {kind === 'like' ? '👍' : '👎'} {title}
        </h2>
        <span className={`eng-sec-count eng-sec-count--${kind}`}>{rows.length}</span>
      </header>
      {rows.length === 0 ? (
        <EmptyCard
          title={kind === 'like' ? 'No likes yet' : 'No dislikes yet'}
          body={kind === 'like'
            ? 'A thumbs-up is a quick "I rate this" signal. They start showing here as visitors react.'
            : 'A thumbs-down can be a hint that something on the page is missing or unclear. Track changes to fix the signal.'}
          subtle
        />
      ) : (
        <ul className="eng-people">
          {rows.map((r, i) => (
            <li key={`${r.user_email || 'anon'}-${i}`} className="eng-person">
              <Avatar name={r.user_name} email={r.user_email} url={r.user_avatar_url}
                accent={kind === 'like' ? '#16A34A' : '#DC2626'} size={36} />
              <div className="eng-person-text">
                <div className="eng-person-name">{displayName(r.user_name, r.user_email)}</div>
                <div className="eng-person-meta">{formatRelative(r.created_at)}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function PeopleSection({
  id, title, rows, emptyTitle, emptyBody, accent,
}: {
  id: string
  title: string
  rows: { user_name: string | null; user_avatar_url: string | null; user_email: string | null; created_at: string }[]
  emptyTitle: string
  emptyBody: string
  accent: 'green' | 'purple'
}) {
  const accentColor = accent === 'green' ? '#0C9A9A' : '#8B5CF6'
  return (
    <section className="eng-sec" id={id}>
      <header className="eng-sec-head">
        <h2 className="eng-sec-title">{title}</h2>
        <span className={`eng-sec-count eng-sec-count--${accent}`}>{rows.length}</span>
      </header>
      {rows.length === 0 ? (
        <EmptyCard title={emptyTitle} body={emptyBody} />
      ) : (
        <ul className="eng-people eng-people--grid">
          {rows.map((r, i) => (
            <li key={`${r.user_email || 'anon'}-${i}`} className="eng-person">
              <Avatar name={r.user_name} email={r.user_email} url={r.user_avatar_url}
                accent={accentColor} size={36} />
              <div className="eng-person-text">
                <div className="eng-person-name">{displayName(r.user_name, r.user_email)}</div>
                <div className="eng-person-meta">{formatRelative(r.created_at)}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function Avatar({
  name, email, url, accent, size = 36,
}: {
  name: string | null
  email: string | null
  url: string | null
  accent: string
  size?: number
}) {
  if (url) {
    return <img className="eng-avatar" src={url} alt="" width={size} height={size} style={{ width: size, height: size }} />
  }
  const initials = initialsOf(name, email || 'A')
  return (
    <span className="eng-avatar eng-avatar--initials" style={{
      width: size, height: size, background: accent, fontSize: Math.round(size * 0.36),
    }}>{initials}</span>
  )
}

function EmptyCard({
  title, body, subtle,
}: { title: string; body: string; subtle?: boolean }) {
  return (
    <div className={`eng-empty${subtle ? ' eng-empty--subtle' : ''}`}>
      <div className="eng-empty-title">{title}</div>
      <p className="eng-empty-body">{body}</p>
    </div>
  )
}
