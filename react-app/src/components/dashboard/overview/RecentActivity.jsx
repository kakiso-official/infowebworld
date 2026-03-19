import { Link } from 'react-router-dom'
import { recentActivity } from '../../../data/dashboard/overviewData'

const activityTypes = [
  { type: 'review', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z', fill: true },
  { type: 'quote', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6', fill: false },
  { type: 'search', icon: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm10 2l-4.35-4.35', fill: false },
  { type: 'favorite', icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z', fill: true },
  { type: 'download', icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3', fill: false },
  { type: 'review2', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z', fill: true },
  { type: 'ranking', icon: 'M6 9H3.5a1.5 1.5 0 0 0 0 3H6v3H3.5a1.5 1.5 0 0 0 0 3H6 M10 2v20 M14 9h2.5a1.5 1.5 0 0 1 0 3H14v3h2.5a1.5 1.5 0 0 1 0 3H14', fill: false },
  { type: 'share', icon: 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M16 6l-4-4-4 4 M12 2v13', fill: false },
]

// Map each activity to its type for icon rendering
const typeKeywords = [
  { type: 'review', keywords: ['review', 'star review'] },
  { type: 'quote', keywords: ['quote', 'requested'] },
  { type: 'search', keywords: ['search results', 'appeared in'] },
  { type: 'favorite', keywords: ['favorites', 'saved'] },
  { type: 'download', keywords: ['download', 'report'] },
  { type: 'ranking', keywords: ['Top 10', 'ranking', 'list'] },
  { type: 'share', keywords: ['shared', 'LinkedIn'] },
]

function getActivityType(text) {
  const plain = text.replace(/<[^>]+>/g, '')
  for (const t of typeKeywords) {
    if (t.keywords.some(k => plain.includes(k))) return t.type
  }
  return 'search'
}

function getTypeIcon(type) {
  switch (type) {
    case 'review':
    case 'review2':
      return { path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z', fill: true }
    case 'quote':
      return { path: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6', fill: false }
    case 'search':
      return { path: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35', fill: false }
    case 'favorite':
      return { path: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z', fill: true }
    case 'download':
      return { path: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3', fill: false }
    case 'ranking':
      return { path: 'M8 21h8 M12 17v4 M7 4v9a5 5 0 0 0 10 0V4 M5 4h14', fill: false }
    case 'share':
      return { path: 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M16 6l-4-4-4 4 M12 2v13', fill: false }
    default:
      return { path: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', fill: false }
  }
}

// Group activities by day
const enrichedActivities = recentActivity.map((a, i) => {
  const type = getActivityType(a.text)
  const isUnread = i < 3
  let dayGroup = ''
  const time = a.time.toLowerCase()
  if (time.includes('hour') || time.includes('minute')) dayGroup = 'Today'
  else if (time.includes('yesterday') || time === '1 day ago') dayGroup = 'Yesterday'
  else dayGroup = a.time.replace(/,.*/, '').replace(/\d+ days ago/, 'Earlier')
  return { ...a, type, isUnread, dayGroup }
})

// Group into sections
const grouped = []
let currentGroup = null
enrichedActivities.forEach(a => {
  if (a.dayGroup !== currentGroup) {
    currentGroup = a.dayGroup
    grouped.push({ isLabel: true, label: currentGroup })
  }
  grouped.push(a)
})

const filterTabs = ['All', 'Reviews', 'Leads', 'System']

export default function RecentActivity() {
  return (
    <div className="db-card">
      <div className="db-card-header" style={{ alignItems: 'center' }}>
        <div className="db-card-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          Recent Activity
          <span style={{
            background: 'var(--accent)',
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 10,
            lineHeight: '18px',
            letterSpacing: '0.02em',
          }}>
            {recentActivity.length} recent
          </span>
        </div>
        <button style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          fontSize: 12,
          cursor: 'pointer',
          padding: '4px 10px',
          borderRadius: 6,
          transition: 'all 0.2s',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 5,
        }}
          onMouseEnter={e => { e.target.style.background = 'var(--bg-alt)'; e.target.style.color = 'var(--accent)' }}
          onMouseLeave={e => { e.target.style.background = 'none'; e.target.style.color = 'var(--text-secondary)' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          Mark all as read
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{
        display: 'flex',
        gap: 2,
        padding: '0 20px 6px',
        borderBottom: '1px solid var(--border)',
      }}>
        {filterTabs.map((tab, i) => (
          <span
            key={tab}
            style={{
              fontSize: 12,
              fontWeight: i === 0 ? 600 : 500,
              color: i === 0 ? 'var(--accent)' : 'var(--text-secondary)',
              padding: '5px 12px',
              borderRadius: 6,
              background: i === 0 ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
              letterSpacing: '0.01em',
            }}
          >
            {tab}
          </span>
        ))}
      </div>

      <div className="db-card-body" style={{ padding: '4px 20px 12px', maxHeight: 440, overflowY: 'auto' }}>
        {grouped.map((item, i) => {
          if (item.isLabel) {
            return (
              <div key={'label-' + i} style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: i === 0 ? '10px 0 6px 40px' : '16px 0 6px 40px',
              }}>
                {item.label}
              </div>
            )
          }

          const iconData = getTypeIcon(item.type)

          return (
            <div
              className="db-activity-item"
              key={i}
              style={{
                display: 'flex',
                gap: 14,
                padding: '10px 0',
                position: 'relative',
                alignItems: 'flex-start',
              }}
            >
              {/* Timeline connector line */}
              <div style={{
                position: 'absolute',
                left: 15,
                top: 36,
                bottom: -10,
                width: 2,
                background: 'var(--border)',
                borderRadius: 1,
                zIndex: 0,
              }} />

              {/* Icon circle */}
              <div
                className="db-activity-dot"
                style={{
                  background: item.color,
                  width: 32,
                  height: 32,
                  minWidth: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 1,
                  boxShadow: `0 0 0 3px var(--bg-card), 0 2px 8px color-mix(in srgb, ${item.color} 30%, transparent)`,
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill={iconData.fill ? '#fff' : 'none'}
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={iconData.path} />
                </svg>
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  {/* Unread indicator */}
                  {item.isUnread && (
                    <div style={{
                      width: 7,
                      height: 7,
                      minWidth: 7,
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      marginTop: 6,
                      boxShadow: '0 0 6px color-mix(in srgb, var(--accent) 50%, transparent)',
                    }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div
                      className="db-activity-text"
                      dangerouslySetInnerHTML={{ __html: item.text }}
                      style={{
                        lineHeight: 1.5,
                        fontWeight: item.isUnread ? 500 : 400,
                      }}
                    />
                    <div
                      className="db-activity-time"
                      style={{
                        marginTop: 3,
                        fontSize: 12,
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                      </svg>
                      {item.time}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 20px',
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <Link
          to="/dashboard/activity"
          className="db-card-action"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--accent)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 16px',
            borderRadius: 8,
            transition: 'all 0.2s',
            background: 'color-mix(in srgb, var(--accent) 6%, transparent)',
          }}
        >
          View All Activity
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
