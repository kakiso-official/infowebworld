import { useState } from 'react'
import DashboardLayout from '../components/dashboard/DashboardLayout'

const reviews = [
  { id: 1, name: 'Sarah Mitchell', initials: 'SM', bg: 'var(--emerald)', rating: 5, text: 'Absolutely fantastic service! The team was professional, responsive, and delivered beyond expectations. Highly recommend to anyone looking for quality.', date: 'Mar 14, 2026', replied: false },
  { id: 2, name: 'Jason Park', initials: 'JP', bg: 'var(--azure)', rating: 5, text: 'Incredible attention to detail. They took the time to understand our specific needs and delivered a solution that exceeded our expectations.', date: 'Mar 13, 2026', replied: false },
  { id: 3, name: 'Maria Garcia', initials: 'MG', bg: 'var(--amber)', rating: 4, text: 'Great service overall. The initial consultation was thorough and the implementation was smooth. Would use again.', date: 'Mar 12, 2026', replied: true },
  { id: 4, name: 'Mike Rodriguez', initials: 'MR', bg: 'var(--plum)', rating: 4, text: 'Good experience. Communication was excellent throughout the project. Minor delays but the end result was impressive.', date: 'Mar 11, 2026', replied: true },
  { id: 5, name: 'Emily Chen', initials: 'EC', bg: 'var(--coral)', rating: 5, text: 'Best in the business! I\'ve used several similar services but this one stands head and shoulders above the rest.', date: 'Mar 10, 2026', replied: true },
  { id: 6, name: 'David Kim', initials: 'DK', bg: 'var(--teal)', rating: 3, text: 'Decent service but communication could be improved. The deliverables were good quality though.', date: 'Mar 8, 2026', replied: false },
  { id: 7, name: 'Rachel Adams', initials: 'RA', bg: 'var(--rose)', rating: 5, text: 'Transformed our entire workflow. The team is knowledgeable, patient, and truly cares about delivering results.', date: 'Mar 7, 2026', replied: false },
  { id: 8, name: 'Tom Wilson', initials: 'TW', bg: 'var(--accent)', rating: 4, text: 'Solid work on a tight timeline. Appreciated the transparency and regular updates throughout the project.', date: 'Mar 5, 2026', replied: true },
]

const ratingDist = [
  { stars: 5, count: 186, pct: 62 },
  { stars: 4, count: 78, pct: 26 },
  { stars: 3, count: 24, pct: 8 },
  { stars: 2, count: 8, pct: 3 },
  { stars: 1, count: 4, pct: 1 },
]

export default function DashboardReviewsPage() {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? reviews : filter === 'unreplied' ? reviews.filter(r => !r.replied) : reviews.filter(r => r.rating === parseInt(filter))

  return (
    <DashboardLayout title="Reviews" subtitle={`${reviews.filter(r => !r.replied).length} awaiting reply`}>
      <div className="db-grid-2" style={{ marginBottom: 24 }}>
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              Rating Overview
            </div>
          </div>
          <div className="db-card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 40, fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1 }}>4.8</div>
                <div className="db-stars" style={{ justifyContent: 'center', margin: '6px 0' }}>
                  {[1,2,3,4,5].map(s => <svg key={s} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>)}
                </div>
                <div style={{ fontSize: 12, fontWeight: 300, color: 'var(--gray-400)' }}>300 reviews</div>
              </div>
              <div style={{ flex: 1 }}>
                {ratingDist.map(r => (
                  <div key={r.stars} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--gray-500)', width: 14, textAlign: 'right' }}>{r.stars}</span>
                    <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, fill: 'var(--amber)', stroke: 'none' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    <div style={{ flex: 1, height: 6, background: 'var(--gray-100)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${r.pct}%`, background: 'var(--amber)', borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 300, color: 'var(--gray-400)', width: 30, textAlign: 'right' }}>{r.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /></svg>
              Review Stats
            </div>
          </div>
          <div className="db-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'This Month', value: '24', change: '+33%' },
                { label: 'Response Rate', value: '87%', change: '+5%' },
                { label: 'Avg Response Time', value: '4.2h', change: '-18%' },
                { label: 'Sentiment Score', value: '92%', change: '+3%' },
              ].map(s => (
                <div key={s.label} style={{ padding: '12px 14px', background: 'var(--gray-50)', borderRadius: 'var(--r-sm)' }}>
                  <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--gray-900)' }}>{s.value}</div>
                  <div style={{ fontSize: 11, fontWeight: 300, color: 'var(--gray-500)', marginBottom: 2 }}>{s.label}</div>
                  <span className="db-stat-change db-stat-change--up" style={{ fontSize: 10 }}>{s.change}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="db-card db-full">
        <div className="db-card-header" style={{ flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['all', 'unreplied', '5', '4', '3'].map(f => (
              <button key={f} className={`db-btn ${filter === f ? 'db-btn--primary' : 'db-btn--outline'}`} style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : f === 'unreplied' ? 'Needs Reply' : `${f} Stars`}
              </button>
            ))}
          </div>
        </div>
        <div className="db-card-body" style={{ padding: '4px 20px' }}>
          {filtered.map(r => (
            <div className="db-review" key={r.id}>
              <div className="db-review-top">
                <div className="db-review-author">
                  <div className="db-review-avatar" style={{ background: r.bg }}>{r.initials}</div>
                  <div>
                    <div className="db-review-name">{r.name}</div>
                    <div className="db-review-date">{r.date}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {!r.replied && <span className="db-badge-pill db-badge--pending">Needs Reply</span>}
                  <div className="db-stars">
                    {[1,2,3,4,5].map(s => <svg key={s} viewBox="0 0 24 24" className={s > r.rating ? 'empty' : ''}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>)}
                  </div>
                </div>
              </div>
              <div className="db-review-text">{r.text}</div>
              <div className="db-review-actions">
                <button className="db-review-action"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>{r.replied ? 'Edit Reply' : 'Reply'}</button>
                <button className="db-review-action"><svg viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>Thank</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="db-card-empty">No reviews matching this filter</div>}
        </div>
      </div>
    </DashboardLayout>
  )
}
