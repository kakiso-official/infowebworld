import { Link } from 'react-router-dom'

export default function DashboardCard({ title, icon, action, actionLink, full, noPadding, maxHeight, children, className = '' }) {
  return (
    <div className={`db-card${full ? ' db-full' : ''} ${className}`}>
      {title && (
        <div className="db-card-header">
          <div className="db-card-title">
            {icon && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>}
            {title}
          </div>
          {action && actionLink && <Link to={actionLink} className="db-card-action">{action}</Link>}
          {action && !actionLink && <span className="db-card-action">{action}</span>}
        </div>
      )}
      <div className="db-card-body" style={{
        ...(noPadding ? { padding: 0 } : {}),
        ...(maxHeight ? { maxHeight, overflowY: 'auto' } : {})
      }}>
        {children}
      </div>
    </div>
  )
}
