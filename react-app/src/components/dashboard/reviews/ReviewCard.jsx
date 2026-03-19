import Stars from '../shared/Stars'

export default function ReviewCard({ r, expandedReply, setExpandedReply }) {
  return (
    <div className="db-review" style={{ padding: '20px 0' }}>
      {/* Review header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
        <div className="db-review-avatar" style={{ background: r.bg, width: 44, height: 44, fontSize: 13 }}>{r.initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
            <span className="db-review-name" style={{ fontSize: 14 }}>{r.name}</span>
            {r.verified && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 500, color: 'var(--emerald)', background: 'rgba(47,174,106,.08)', padding: '1px 7px', borderRadius: 4 }}>
                <svg viewBox="0 0 24 24" style={{ width: 10, height: 10, stroke: 'var(--emerald)', fill: 'none', strokeWidth: 2 }}><polyline points="20 6 9 17 4 12" /></svg>
                Verified
              </span>
            )}
            <span style={{ fontSize: 10, fontWeight: 400, padding: '2px 7px', borderRadius: 4, background: 'var(--gray-100)', color: 'var(--gray-500)' }}>{r.source}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Stars rating={r.rating} size={13} />
            <span className="db-review-date">{r.date} at {r.time}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {!r.replied && <span className="db-badge-pill db-badge--pending" style={{ animation: 'an-pulse-ring 2s ease infinite' }}>Needs Reply</span>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 400, color: 'var(--gray-400)' }}>
            <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: 'currentColor', fill: 'none', strokeWidth: 1.5 }}><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
            {r.helpful}
          </div>
        </div>
      </div>

      {/* Review text */}
      <div className="db-review-text" style={{ fontSize: 13.5, lineHeight: 1.7, marginLeft: 56, marginBottom: 10 }}>{r.text}</div>

      {/* Tags */}
      <div style={{ marginLeft: 56, display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {r.tags.map(t => (
          <span key={t} style={{
            padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 500,
            background: r.sentiment === 'positive' ? 'rgba(47,174,106,.06)' : r.sentiment === 'negative' ? 'rgba(239,107,74,.06)' : 'rgba(245,158,11,.06)',
            color: r.sentiment === 'positive' ? 'var(--emerald)' : r.sentiment === 'negative' ? 'var(--coral)' : 'var(--amber)',
          }}>{t}</span>
        ))}
      </div>

      {/* Reply (if exists) */}
      {r.replied && r.replyText && (
        <div style={{ marginLeft: 56, background: 'linear-gradient(135deg,rgba(108,114,241,.03),rgba(139,92,246,.02))', border: '1px solid rgba(108,114,241,.1)', borderRadius: 'var(--r-sm)', padding: '14px 16px', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 8, fontWeight: 600, color: '#fff' }}>CG</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>CloudGuard Technologies</span>
            <span style={{ fontSize: 10, fontWeight: 300, color: 'var(--gray-400)' }}>{r.replyDate}</span>
          </div>
          <p style={{ fontSize: 12.5, fontWeight: 350, color: 'var(--gray-600)', lineHeight: 1.6, margin: 0 }}>{r.replyText}</p>
        </div>
      )}

      {/* Actions */}
      <div style={{ marginLeft: 56, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="db-btn db-btn--primary" style={{ padding: '6px 14px', fontSize: 11 }} onClick={(e) => { e.stopPropagation(); setExpandedReply(expandedReply === r.id ? null : r.id) }}>
          <svg viewBox="0 0 24 24" style={{ width: 12, height: 12 }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          {r.replied ? 'Edit Reply' : 'Write Reply'}
        </button>
        <button className="db-review-action">
          <svg viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
          Helpful ({r.helpful})
        </button>
        <button className="db-review-action">
          <svg viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
          Share
        </button>
        <button className="db-review-action">
          <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
          Feature
        </button>
        {r.sentiment !== 'positive' && (
          <button className="db-review-action" style={{ color: 'var(--coral)' }}>
            <svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            Flag
          </button>
        )}
      </div>

      {/* Reply editor */}
      {expandedReply === r.id && (
        <div style={{ marginLeft: 56, marginTop: 12, background: 'var(--gray-50)', borderRadius: 'var(--r)', padding: 16 }}>
          <textarea className="db-form-textarea" placeholder="Write your reply..." defaultValue={r.replyText || ''} style={{ minHeight: 80, marginBottom: 10, background: '#fff' }} />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="db-btn db-btn--primary" style={{ padding: '7px 16px', fontSize: 12 }}>
              <svg viewBox="0 0 24 24" style={{ width: 13, height: 13 }}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
              Post Reply
            </button>
            <button className="db-btn db-btn--outline" style={{ padding: '7px 16px', fontSize: 12 }} onClick={() => setExpandedReply(null)}>Cancel</button>
            <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 300, color: 'var(--gray-400)' }}>Replies are public and visible to all users</span>
          </div>
        </div>
      )}
    </div>
  )
}
