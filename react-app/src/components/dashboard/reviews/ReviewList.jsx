import Sparkline from '../shared/Sparkline'
import Stars from '../shared/Stars'
import ReviewFilters from './ReviewFilters'
import ReviewCard from './ReviewCard'
import { performanceMetrics } from '../../../data/dashboard/reviewsData'

export default function ReviewList({ filtered, filter, setFilter, searchQuery, setSearchQuery, sortBy, setSortBy, expandedReply, setExpandedReply, unrepliedCount }) {
  return (
    <>
      {/* Response Performance */}
      <div className="db-card db-full">
        <div className="db-card-header">
          <div className="db-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            Response Performance
          </div>
        </div>
        <div className="db-card-body" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="db-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Current</th>
                <th>Last Month</th>
                <th>Target</th>
                <th>Status</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {performanceMetrics.map(r => (
                <tr key={r.metric}>
                  <td className="db-table-name">{r.metric}</td>
                  <td style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{r.curr}</td>
                  <td>{r.prev}</td>
                  <td style={{ color: 'var(--gray-500)' }}>{r.target}</td>
                  <td>
                    <span className={`db-badge-pill ${r.status === 'exceeding' ? 'db-badge--active' : 'db-badge--pending'}`}>
                      {r.status === 'exceeding' ? 'Exceeding' : 'On Track'}
                    </span>
                  </td>
                  <td><Sparkline data={r.spark} color={r.up ? 'var(--emerald)' : 'var(--coral)'} width={60} height={20} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reviews List */}
      <div className="db-card db-full">
        <ReviewFilters
          filter={filter} setFilter={setFilter}
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          sortBy={sortBy} setSortBy={setSortBy}
          unrepliedCount={unrepliedCount}
        />
        <div className="db-card-body" style={{ padding: '0 20px' }}>
          {filtered.map(r => (
            <ReviewCard key={r.id} r={r} expandedReply={expandedReply} setExpandedReply={setExpandedReply} />
          ))}
          {filtered.length === 0 && <div className="db-card-empty">No reviews matching this filter</div>}
        </div>
      </div>

      {/* Review Highlights */}
      <div className="db-grid-2">
        {/* Best Review */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title" style={{ color: 'var(--emerald)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
              Best Review This Month
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: 3 }}>
              <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: 'var(--emerald)', fill: 'none', strokeWidth: 1.5 }}><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
              31 helpful
            </span>
          </div>
          <div className="db-card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div className="db-review-avatar" style={{ background: 'var(--coral)', width: 36, height: 36, fontSize: 11 }}>EC</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-800)' }}>Emily Chen</div>
                <Stars rating={5} size={11} />
              </div>
            </div>
            <p style={{ fontSize: 12.5, fontWeight: 350, color: 'var(--gray-600)', lineHeight: 1.65, margin: 0, fontStyle: 'italic' }}>
              &ldquo;Best in the business! I&apos;ve used several similar services but this one stands head and shoulders above the rest. Their penetration testing uncovered vulnerabilities our previous vendor missed entirely.&rdquo;
            </p>
          </div>
        </div>

        {/* Most Actionable Feedback */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title" style={{ color: 'var(--amber)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              Most Actionable Feedback
            </div>
          </div>
          <div className="db-card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div className="db-review-avatar" style={{ background: 'var(--teal)', width: 36, height: 36, fontSize: 11 }}>DK</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-800)' }}>David Kim</div>
                <Stars rating={3} size={11} />
              </div>
              <span className="db-badge-pill db-badge--pending" style={{ marginLeft: 'auto' }}>Needs Reply</span>
            </div>
            <p style={{ fontSize: 12.5, fontWeight: 350, color: 'var(--gray-600)', lineHeight: 1.65, margin: 0, marginBottom: 12, fontStyle: 'italic' }}>
              &ldquo;Communication could be improved. Response times were inconsistent &mdash; sometimes within the hour, other times 24+ hours.&rdquo;
            </p>
            <div style={{ background: 'rgba(245,158,11,.06)', border: '1px solid rgba(245,158,11,.15)', borderRadius: 'var(--r-sm)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'var(--amber)', fill: 'none', strokeWidth: 1.5, flexShrink: 0 }}><path d="M12 2L2 7l10 5 10-5-10-5z" /></svg>
              <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--gray-600)' }}>
                <strong style={{ color: 'var(--amber)' }}>Action item:</strong> Set up automated response acknowledgments to reduce perceived response time
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
