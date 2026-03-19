import AdminStatCard from '../shared/AdminStatCard'

const stats = [
  {
    label: 'Total Articles',
    value: '12',
    gradient: 'linear-gradient(135deg, var(--accent), var(--azure))',
    icon: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>,
    spark: [5, 6, 7, 8, 9, 10, 11, 12],
    sparkColor: 'var(--accent)',
  },
  {
    label: 'Published',
    value: '7',
    gradient: 'linear-gradient(135deg, var(--emerald), var(--teal))',
    icon: <><polyline points="20 6 9 17 4 12" /></>,
    spark: [3, 3, 4, 5, 5, 6, 6, 7],
    sparkColor: 'var(--emerald)',
  },
  {
    label: 'Drafts',
    value: '3',
    gradient: 'linear-gradient(135deg, var(--amber), var(--coral))',
    icon: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
    spark: [5, 4, 4, 3, 4, 3, 2, 3],
    sparkColor: 'var(--amber)',
  },
  {
    label: 'Scheduled',
    value: '2',
    gradient: 'linear-gradient(135deg, var(--azure), var(--plum))',
    icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    spark: [0, 1, 1, 2, 1, 2, 1, 2],
    sparkColor: 'var(--azure)',
  },
  {
    label: 'Total Views',
    value: '55,094',
    change: '+18%',
    up: true,
    gradient: 'linear-gradient(135deg, var(--plum), var(--accent))',
    icon: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
    spark: [28000, 32000, 36000, 40000, 44000, 48000, 51000, 55094],
    sparkColor: 'var(--plum)',
  },
]

export default function NewsStatCards() {
  return (
    <div className="db-stats">
      {stats.map((s, i) => (
        <AdminStatCard key={i} {...s} />
      ))}
    </div>
  )
}
