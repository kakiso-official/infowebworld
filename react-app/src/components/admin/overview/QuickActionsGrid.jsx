import { Link } from 'react-router-dom'
import { quickActions } from '../../../data/admin/overviewData'

export default function QuickActionsGrid() {
  return (
    <div className="adm-actions">
      {quickActions.map((action, i) => (
        <Link to={action.path} key={i} className="adm-action-card" style={{ textDecoration: 'none' }}>
          <div className="adm-action-icon" style={{ background: action.color }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{action.icon}</svg>
          </div>
          <div className="adm-action-title">{action.title}</div>
          <div className="adm-action-desc">{action.desc}</div>
        </Link>
      ))}
    </div>
  )
}
