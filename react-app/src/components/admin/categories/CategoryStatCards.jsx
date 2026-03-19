import AdminStatCard from '../shared/AdminStatCard'

const stats = [
  {
    label: 'Total Categories',
    value: '42',
    change: '+3',
    up: true,
    gradient: 'linear-gradient(135deg, var(--accent), var(--azure))',
    icon: <><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></>,
    spark: [30, 33, 35, 36, 38, 39, 40, 42],
    sparkColor: 'var(--accent)',
  },
  {
    label: 'Active Categories',
    value: '40',
    change: '+2',
    up: true,
    gradient: 'linear-gradient(135deg, var(--emerald), var(--teal))',
    icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>,
    spark: [29, 31, 33, 34, 36, 37, 39, 40],
    sparkColor: 'var(--emerald)',
  },
  {
    label: 'Total Listings',
    value: '3,847',
    change: '+156',
    up: true,
    gradient: 'linear-gradient(135deg, var(--azure), var(--plum))',
    icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>,
    spark: [3200, 3350, 3450, 3550, 3640, 3720, 3790, 3847],
    sparkColor: 'var(--azure)',
  },
]

export default function CategoryStatCards() {
  return (
    <div className="db-stats">
      {stats.map((s, i) => (
        <AdminStatCard key={i} {...s} />
      ))}
    </div>
  )
}
