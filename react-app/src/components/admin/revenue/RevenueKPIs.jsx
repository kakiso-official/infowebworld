import AdminStatCard from '../shared/AdminStatCard'

const kpis = [
  {
    label: 'Monthly Recurring Revenue',
    value: '$147,520',
    change: '+15%',
    up: true,
    gradient: 'linear-gradient(135deg, var(--accent), #5b3cc4)',
    icon: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>,
    spark: [98, 105, 112, 118, 125, 132, 138, 142, 147],
  },
  {
    label: 'Annual Recurring Revenue',
    value: '$1,770,240',
    change: '+15%',
    up: true,
    gradient: 'linear-gradient(135deg, var(--emerald), #059669)',
    icon: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>,
    spark: [1180, 1260, 1350, 1440, 1530, 1620, 1700, 1770],
  },
  {
    label: 'Avg Revenue Per User',
    value: '$38.40',
    change: '+8%',
    up: true,
    gradient: 'linear-gradient(135deg, var(--amber), #d97706)',
    icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></>,
    spark: [32, 33, 34, 35, 35.5, 36, 37, 38, 38.4],
  },
  {
    label: 'Customer Lifetime Value',
    value: '$1,842',
    change: '+12%',
    up: true,
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    icon: <><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></>,
    spark: [1420, 1500, 1580, 1640, 1700, 1760, 1800, 1842],
  },
  {
    label: 'Churn Rate',
    value: '2.4%',
    change: '-0.3%',
    up: true,
    gradient: 'linear-gradient(135deg, var(--coral), #dc2626)',
    icon: <><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="18" y1="8" x2="23" y2="13" /><line x1="23" y1="8" x2="18" y2="13" /></>,
    spark: [3.2, 3.0, 2.8, 2.9, 2.7, 2.5, 2.6, 2.4, 2.4],
    sparkColor: 'var(--emerald)',
  },
]

export default function RevenueKPIs() {
  return (
    <div className="db-stats">
      {kpis.map((kpi, i) => (
        <AdminStatCard key={i} {...kpi} />
      ))}
    </div>
  )
}
