export const platformPulse = {
  uptime: '99.97%',
  activeUsers: 1247,
  avgResponse: '142ms',
  systemHealth: 'Operational',
  healthStatus: 'green',
}

export const platformKPIs = [
  {
    label: 'Total Users',
    value: '24,831',
    change: '+12%',
    up: true,
    gradient: 'linear-gradient(135deg,var(--accent),var(--plum))',
    icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    spark: [180, 210, 195, 230, 245, 260, 255, 280, 295, 310, 305, 328],
  },
  {
    label: 'Active Listings',
    value: '3,847',
    change: '+8%',
    up: true,
    gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))',
    icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>,
    spark: [120, 135, 128, 145, 152, 160, 155, 170, 168, 182, 178, 190],
  },
  {
    label: 'Monthly Revenue',
    value: '$147,520',
    change: '+15%',
    up: true,
    gradient: 'linear-gradient(135deg,var(--amber),var(--coral))',
    icon: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>,
    spark: [85, 92, 88, 105, 112, 118, 125, 130, 128, 142, 138, 148],
  },
  {
    label: 'Total Reviews',
    value: '18,492',
    change: '+22%',
    up: true,
    gradient: 'linear-gradient(135deg,var(--azure),var(--accent))',
    icon: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>,
    spark: [410, 435, 420, 460, 478, 490, 505, 520, 515, 540, 535, 560],
  },
  {
    label: 'Avg Rating',
    value: '4.6',
    change: '+0.1',
    up: true,
    gradient: 'linear-gradient(135deg,var(--plum),var(--rose))',
    icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    spark: [42, 43, 43, 44, 44, 45, 45, 45, 46, 46, 46, 46],
  },
  {
    label: 'Categories',
    value: '42',
    change: '+3',
    up: true,
    gradient: 'linear-gradient(135deg,var(--teal),var(--emerald))',
    icon: <><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></>,
    spark: [32, 33, 34, 35, 36, 37, 37, 38, 39, 40, 41, 42],
  },
]

export const quickActions = [
  { title: 'Manage Users', desc: '12 pending verifications', path: '/admin/users', color: 'var(--accent)', icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></> },
  { title: 'Review Listings', desc: '5 awaiting approval', path: '/admin/listings', color: 'var(--emerald)', icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></> },
  { title: 'Moderate Reviews', desc: '8 flagged for review', path: '/admin/reviews', color: 'var(--coral)', icon: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></> },
  { title: 'Revenue Report', desc: 'March 2026 summary', path: '/admin/revenue', color: 'var(--amber)', icon: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></> },
]

export const revenueMonthly = [
  { month: 'Apr', value: 98400 }, { month: 'May', value: 105200 }, { month: 'Jun', value: 112800 },
  { month: 'Jul', value: 108500 }, { month: 'Aug', value: 118900 }, { month: 'Sep', value: 124300 },
  { month: 'Oct', value: 121700 }, { month: 'Nov', value: 132500 }, { month: 'Dec', value: 138200 },
  { month: 'Jan', value: 135800 }, { month: 'Feb', value: 141900 }, { month: 'Mar', value: 147520 },
]

export const platformGrowth = {
  labels: ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'],
  users: [18200, 19100, 19800, 20400, 21100, 21800, 22400, 23000, 23500, 24000, 24400, 24831],
  listings: [2800, 2950, 3050, 3180, 3280, 3380, 3450, 3540, 3620, 3700, 3780, 3847],
}

export const topListings = [
  { id: 1, name: 'CloudGuard Technologies', category: 'Cloud Security', views: 12847, leads: 384, rating: 4.8, status: 'active' },
  { id: 2, name: 'DataShield Pro', category: 'Data Protection', views: 10234, leads: 291, rating: 4.7, status: 'active' },
  { id: 3, name: 'NetWatch Solutions', category: 'Network Security', views: 9876, leads: 267, rating: 4.6, status: 'active' },
  { id: 4, name: 'CyberFort Systems', category: 'Endpoint Security', views: 8923, leads: 234, rating: 4.5, status: 'active' },
  { id: 5, name: 'SecureFlow Inc.', category: 'IAM Solutions', views: 7845, leads: 198, rating: 4.7, status: 'active' },
  { id: 6, name: 'ThreatHunter AI', category: 'Threat Detection', views: 7234, leads: 176, rating: 4.4, status: 'active' },
  { id: 7, name: 'ComplianceHub', category: 'GRC Platform', views: 6891, leads: 165, rating: 4.6, status: 'active' },
  { id: 8, name: 'VaultKeeper Pro', category: 'Password Management', views: 6543, leads: 152, rating: 4.3, status: 'active' },
]

export const activityFeed = [
  { text: 'New user <strong>Jason Park</strong> registered via Google OAuth', time: '2 min ago', color: 'var(--emerald)' },
  { text: '<strong>TechVault Inc.</strong> submitted a new listing for approval', time: '8 min ago', color: 'var(--azure)' },
  { text: 'Review flagged on <strong>SecureFlow Inc.</strong> — spam detected', time: '15 min ago', color: 'var(--coral)' },
  { text: '<strong>CloudGuard Technologies</strong> upgraded to Enterprise plan', time: '32 min ago', color: 'var(--plum)' },
  { text: 'Category <strong>"AI Security"</strong> created by admin', time: '1 hour ago', color: 'var(--accent)' },
  { text: '<strong>DataShield Pro</strong> received 5-star review from verified user', time: '1 hour ago', color: 'var(--amber)' },
  { text: 'Payment of <strong>$299/mo</strong> received from NetWatch Solutions', time: '2 hours ago', color: 'var(--teal)' },
  { text: 'User <strong>mark@example.com</strong> account suspended — policy violation', time: '3 hours ago', color: 'var(--rose)' },
]

export const flaggedContent = [
  { id: 1, type: 'Review', target: 'SecureFlow Inc.', reason: 'Spam / fake review', severity: 'high', time: '15 min ago' },
  { id: 2, type: 'Listing', target: 'QuickHack Tools', reason: 'Inappropriate content', severity: 'high', time: '2 hours ago' },
  { id: 3, type: 'Review', target: 'DataShield Pro', reason: 'Offensive language', severity: 'medium', time: '5 hours ago' },
  { id: 4, type: 'Listing', target: 'FreeVPN Plus', reason: 'Misleading claims', severity: 'low', time: '1 day ago' },
]

export const systemNotifications = [
  { title: 'SSL Certificate Renewal', desc: 'Certificate expires in 28 days — auto-renewal scheduled', status: 'info', time: 'Mar 19' },
  { title: 'Database Backup Complete', desc: 'Daily backup completed successfully — 2.4 GB', status: 'success', time: 'Today, 3:00 AM' },
  { title: 'API Rate Limit Warning', desc: '3 users exceeded rate limits in the past 24 hours', status: 'warning', time: 'Today, 1:15 AM' },
  { title: 'Failed Login Attempts', desc: '47 failed attempts from 12 IPs — geo-blocked', status: 'danger', time: 'Yesterday' },
]
