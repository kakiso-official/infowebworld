import AdminStatCard from '../shared/AdminStatCard'

const stats = [
  {
    label: 'Total Listings',
    value: '3,847',
    change: '+8%',
    up: true,
    gradient: 'linear-gradient(135deg,var(--accent),var(--plum))',
    icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>,
    spark: [120, 135, 128, 145, 152, 160, 155, 170, 168, 182, 178, 190],
  },
  {
    label: 'Active',
    value: '3,542',
    change: '+6%',
    up: true,
    gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))',
    icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>,
    spark: [110, 118, 115, 130, 138, 142, 140, 155, 150, 165, 160, 172],
  },
  {
    label: 'Pending Approval',
    value: '5',
    gradient: 'linear-gradient(135deg,var(--amber),var(--coral))',
    icon: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>,
  },
  {
    label: 'Avg Rating',
    value: '4.6',
    change: '+0.1',
    up: true,
    gradient: 'linear-gradient(135deg,var(--azure),var(--accent))',
    icon: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>,
    spark: [4.2, 4.3, 4.3, 4.4, 4.4, 4.5, 4.5, 4.5, 4.6, 4.6, 4.6, 4.6],
  },
  {
    label: 'Total Views',
    value: '892K',
    change: '+12%',
    up: true,
    gradient: 'linear-gradient(135deg,var(--teal),var(--azure))',
    icon: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
    spark: [580, 610, 625, 650, 680, 710, 735, 760, 790, 820, 855, 892],
  },
  {
    label: 'Avg Quality Score',
    value: '82/100',
    change: '+3',
    up: true,
    gradient: 'linear-gradient(135deg,var(--coral),var(--plum))',
    icon: <><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></>,
    spark: [72, 74, 75, 76, 77, 78, 79, 79, 80, 81, 81, 82],
  },
]

export default function ListingStatCards() {
  return (
    <div className="db-stats">
      {stats.map((s, i) => (
        <AdminStatCard key={i} {...s} />
      ))}
    </div>
  )
}
