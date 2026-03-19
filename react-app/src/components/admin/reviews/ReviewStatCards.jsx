import AdminStatCard from '../shared/AdminStatCard'

const stats = [
  {
    label: 'Total Reviews',
    value: '18,492',
    change: '+22%',
    up: true,
    gradient: 'linear-gradient(135deg, var(--accent), var(--azure))',
    icon: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>,
    spark: [12400, 13200, 14100, 14900, 15800, 16500, 17300, 18492],
    sparkColor: 'var(--accent)',
  },
  {
    label: 'Avg Rating',
    value: '4.6',
    change: '+0.1',
    up: true,
    gradient: 'linear-gradient(135deg, var(--emerald), var(--teal))',
    icon: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /><circle cx="12" cy="12" r="3" /></>,
    spark: [4.3, 4.3, 4.4, 4.4, 4.5, 4.5, 4.5, 4.6],
    sparkColor: 'var(--emerald)',
  },
  {
    label: 'Flagged Reviews',
    value: '32',
    change: '+8',
    up: false,
    gradient: 'linear-gradient(135deg, var(--coral), var(--rose))',
    icon: <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></>,
    spark: [18, 22, 20, 25, 24, 28, 30, 32],
    sparkColor: 'var(--coral)',
  },
  {
    label: 'Pending Moderation',
    value: '8',
    gradient: 'linear-gradient(135deg, var(--amber), var(--coral))',
    icon: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>,
    spark: [5, 7, 4, 6, 9, 7, 10, 8],
    sparkColor: 'var(--amber)',
  },
]

export default function ReviewStatCards() {
  return (
    <div className="db-stats">
      {stats.map((s, i) => (
        <AdminStatCard key={i} {...s} />
      ))}
    </div>
  )
}
