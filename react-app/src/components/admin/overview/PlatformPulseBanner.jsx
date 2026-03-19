import { platformPulse } from '../../../data/admin/overviewData'

export default function PlatformPulseBanner() {
  return (
    <div className="adm-pulse">
      <div className="adm-pulse-item">
        <span className="adm-pulse-value">{platformPulse.uptime}</span>
        <span className="adm-pulse-label">Uptime</span>
      </div>
      <div className="adm-pulse-item">
        <span className="adm-pulse-value">{platformPulse.activeUsers.toLocaleString()}</span>
        <span className="adm-pulse-label">Active Users</span>
      </div>
      <div className="adm-pulse-item">
        <span className="adm-pulse-value">{platformPulse.avgResponse}</span>
        <span className="adm-pulse-label">Avg Response</span>
      </div>
      <div className="adm-pulse-item">
        <span className={`adm-pulse-dot adm-pulse-dot--${platformPulse.healthStatus}`} />
        <span className="adm-pulse-value">{platformPulse.systemHealth}</span>
        <span className="adm-pulse-label">System Health</span>
      </div>
    </div>
  )
}
