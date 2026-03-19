import DashboardCard from '../../dashboard/shared/DashboardCard'
import MiniBarChart from '../shared/MiniBarChart'
import { revenueMonthly } from '../../../data/admin/overviewData'

export default function RevenueMiniChart() {
  const formatted = revenueMonthly.map(d => ({
    ...d,
    value: Math.round(d.value / 1000),
    label: d.month,
  }))

  return (
    <DashboardCard
      title="Revenue Trend (12 Months)"
      icon={<><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>}
    >
      <MiniBarChart
        data={formatted.map(d => ({ label: d.label, value: d.value, displayValue: `$${d.value}K` }))}
        barColor="var(--accent)"
        height={180}
        labelKey="label"
        valueKey="value"
        showValues
      />
    </DashboardCard>
  )
}
