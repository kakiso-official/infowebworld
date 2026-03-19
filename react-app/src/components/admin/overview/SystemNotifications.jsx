import DashboardCard from '../../dashboard/shared/DashboardCard'
import { systemNotifications } from '../../../data/admin/overviewData'

const statusColor = {
  info: 'var(--azure)',
  success: 'var(--emerald)',
  warning: 'var(--amber)',
  danger: 'var(--coral)',
}

const statusIcon = {
  info: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></>,
  success: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>,
  warning: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
  danger: <><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>,
}

export default function SystemNotifications() {
  return (
    <DashboardCard
      full
      title="System Notifications"
      icon={<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {systemNotifications.map((n, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: '12px 14px', borderRadius: 8,
            borderLeft: `3px solid ${statusColor[n.status]}`,
            background: 'var(--bg)',
          }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
              stroke={statusColor[n.status]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0, marginTop: 1 }}
            >
              {statusIcon[n.status]}
            </svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)', marginBottom: 2 }}>{n.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-light)', lineHeight: 1.5 }}>{n.desc}</div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-light)', whiteSpace: 'nowrap', flexShrink: 0 }}>{n.time}</div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
