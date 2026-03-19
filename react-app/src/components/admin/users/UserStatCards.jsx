import AdminStatCard from '../shared/AdminStatCard'

const stats = [
  {
    label: 'Total Users',
    value: '24,831',
    change: '+12%',
    up: true,
    gradient: 'linear-gradient(135deg, var(--accent), var(--azure))',
    icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    spark: [20100, 21200, 21900, 22500, 23100, 23700, 24200, 24831],
    sparkColor: 'var(--accent)',
  },
  {
    label: 'Active Users',
    value: '22,148',
    change: '+8%',
    up: true,
    gradient: 'linear-gradient(135deg, var(--emerald), var(--teal))',
    icon: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></>,
    spark: [18400, 19200, 19800, 20300, 20900, 21400, 21800, 22148],
    sparkColor: 'var(--emerald)',
  },
  {
    label: 'Business Accounts',
    value: '18,624',
    change: '+10%',
    up: true,
    gradient: 'linear-gradient(135deg, var(--azure), var(--plum))',
    icon: <><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>,
    spark: [15100, 15900, 16500, 17000, 17500, 17900, 18300, 18624],
    sparkColor: 'var(--azure)',
  },
  {
    label: 'Free Users',
    value: '6,207',
    change: '+15%',
    up: true,
    gradient: 'linear-gradient(135deg, var(--amber), var(--coral))',
    icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
    spark: [4800, 5100, 5300, 5500, 5700, 5900, 6100, 6207],
    sparkColor: 'var(--amber)',
  },
  {
    label: 'Verified Users',
    value: '19,865',
    change: '+5%',
    up: true,
    gradient: 'linear-gradient(135deg, var(--teal), var(--emerald))',
    icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></>,
    spark: [17200, 17800, 18100, 18500, 18900, 19200, 19500, 19865],
    sparkColor: 'var(--teal)',
  },
  {
    label: 'Suspended / Banned',
    value: '247',
    change: '-18%',
    up: true,
    gradient: 'linear-gradient(135deg, var(--coral), var(--rose))',
    icon: <><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></>,
    spark: [310, 295, 285, 278, 270, 260, 253, 247],
    sparkColor: 'var(--emerald)',
  },
]

export default function UserStatCards() {
  return (
    <div className="db-stats">
      {stats.map((s, i) => (
        <AdminStatCard key={i} {...s} />
      ))}
    </div>
  )
}
