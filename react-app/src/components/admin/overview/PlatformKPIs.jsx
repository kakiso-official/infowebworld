import AdminStatCard from '../shared/AdminStatCard'
import { platformKPIs } from '../../../data/admin/overviewData'

export default function PlatformKPIs() {
  return (
    <div className="db-stats">
      {platformKPIs.map((kpi, i) => (
        <AdminStatCard key={i} {...kpi} />
      ))}
    </div>
  )
}
