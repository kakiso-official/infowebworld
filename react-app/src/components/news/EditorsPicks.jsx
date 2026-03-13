import { Link } from 'react-router-dom'

const picks = [
  {
    id: 'directory-listing-roi',
    tag: 'Business',
    tagClass: 'nws-tag--accent',
    color: 'var(--accent)',
    title: 'How Directory Listings Deliver 3x ROI for Service Businesses',
    excerpt: 'Data from 10,000 verified businesses shows directory presence outperforms paid ads for local customer acquisition.',
    author: 'Rachel Park',
    date: 'Mar 10',
    readTime: '5 min'
  },
  {
    id: 'saas-consolidation-trend',
    tag: 'Technology',
    tagClass: 'nws-tag--coral',
    color: 'var(--coral)',
    title: 'The Great SaaS Consolidation: Why Vendors Are Merging at Record Pace',
    excerpt: 'Industry analysis reveals a wave of consolidation reshaping the B2B software landscape in 2026.',
    author: 'James Wu',
    date: 'Mar 9',
    readTime: '7 min'
  },
  {
    id: 'healthcare-digital-transformation',
    tag: 'Healthcare',
    tagClass: 'nws-tag--emerald',
    color: 'var(--emerald)',
    title: 'Digital-First Healthcare: Clinics That Embrace Tech See 60% More Bookings',
    excerpt: 'Practices with strong digital presence and verified directory listings attract significantly more patients.',
    author: 'Sara Lopez',
    date: 'Mar 8',
    readTime: '4 min'
  },
  {
    id: 'review-authenticity-standards',
    tag: 'Industry',
    tagClass: 'nws-tag--plum',
    color: 'var(--plum)',
    title: 'New Industry Standards for Review Authenticity Set to Transform Trust Online',
    excerpt: 'A coalition of major platforms announces unified verification standards to combat fake reviews.',
    author: 'David Mitchell',
    date: 'Mar 7',
    readTime: '6 min'
  },
  {
    id: 'ai-small-business-tools',
    tag: 'AI & Tech',
    tagClass: 'nws-tag--azure',
    color: 'var(--azure)',
    title: 'Top 10 AI Tools Every Small Business Should Adopt in 2026',
    excerpt: 'From automated invoicing to AI chatbots, these tools are leveling the playing field for small businesses.',
    author: 'Nina Kapoor',
    date: 'Mar 6',
    readTime: '8 min'
  }
]

export default function EditorsPicks() {
  return (
    <div className="nws-picks">
      <div className="container">
        <div className="nws-picks-header">
          <div className="nws-picks-title">
            <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg>
            Editor's Picks
          </div>
          <Link to="/news" className="nws-side-card-link">
            View all
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>
        </div>
        <div className="nws-picks-scroll">
          {picks.map((p, i) => (
            <Link to={`/news-article?id=${p.id}`} className="nws-pick-card" key={p.id} style={{ '--pick-color': p.color }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, borderRadius: '12px 12px 0 0', background: p.color }} />
              <span className="nws-pick-num">{i + 1}</span>
              <span className={`nws-tag ${p.tagClass}`}>{p.tag}</span>
              <h4>{p.title}</h4>
              <p>{p.excerpt}</p>
              <div className="nws-pick-footer">
                <span className="nws-pick-meta">
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  {p.readTime}
                </span>
                <span className="nws-pick-meta">{p.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
