export const allUsers = [
  { id: 1, name: 'Sarah Mitchell', email: 'sarah.m@techcorp.com', role: 'business', plan: 'Enterprise', status: 'active', verified: true, joinDate: 'Jan 12, 2025', lastActive: '2 hours ago', listings: 3, reviews: 28, revenue: '$8,964', avatar: 'SM', color: 'var(--emerald)', country: 'US' },
  { id: 2, name: 'David Chen', email: 'dchen@startupxyz.io', role: 'business', plan: 'Pro', status: 'active', verified: true, joinDate: 'Feb 28, 2025', lastActive: '5 hours ago', listings: 2, reviews: 15, revenue: '$3,588', avatar: 'DC', color: 'var(--azure)', country: 'US' },
  { id: 3, name: 'Emma Rodriguez', email: 'emma.r@financegroup.com', role: 'business', plan: 'Pro', status: 'active', verified: true, joinDate: 'Mar 5, 2025', lastActive: '1 day ago', listings: 1, reviews: 42, revenue: '$1,794', avatar: 'ER', color: 'var(--plum)', country: 'US' },
  { id: 4, name: 'James Wilson', email: 'jwilson@retail.co', role: 'business', plan: 'Basic', status: 'active', verified: false, joinDate: 'Apr 18, 2025', lastActive: '3 days ago', listings: 1, reviews: 8, revenue: '$588', avatar: 'JW', color: 'var(--amber)', country: 'US' },
  { id: 5, name: 'Lisa Park', email: 'lpark@healthsys.org', role: 'business', plan: 'Enterprise', status: 'active', verified: true, joinDate: 'May 2, 2025', lastActive: '1 hour ago', listings: 4, reviews: 56, revenue: '$11,940', avatar: 'LP', color: 'var(--coral)', country: 'US' },
  { id: 6, name: 'Robert Kim', email: 'rkim@edutechco.com', role: 'business', plan: 'Pro', status: 'suspended', verified: true, joinDate: 'Jun 14, 2025', lastActive: '2 weeks ago', listings: 2, reviews: 19, revenue: '$3,588', avatar: 'RK', color: 'var(--teal)', country: 'US' },
  { id: 7, name: 'Anna Thompson', email: 'athompson@lawfirm.com', role: 'user', plan: 'Free', status: 'active', verified: true, joinDate: 'Jul 8, 2025', lastActive: '4 hours ago', listings: 0, reviews: 67, revenue: '$0', avatar: 'AT', color: 'var(--rose)', country: 'US' },
  { id: 8, name: 'Mark Stevens', email: 'mstevens@mfg.co', role: 'business', plan: 'Basic', status: 'inactive', verified: false, joinDate: 'Aug 22, 2025', lastActive: '1 month ago', listings: 1, reviews: 3, revenue: '$294', avatar: 'MS', color: 'var(--gray-400)', country: 'US' },
  { id: 9, name: 'Priya Sharma', email: 'psharma@globalretail.in', role: 'business', plan: 'Enterprise', status: 'active', verified: true, joinDate: 'Sep 1, 2025', lastActive: '30 min ago', listings: 5, reviews: 89, revenue: '$14,925', avatar: 'PS', color: 'var(--accent)', country: 'IN' },
  { id: 10, name: 'Tom Bradley', email: 'tbradley@finserv.com', role: 'business', plan: 'Pro', status: 'active', verified: true, joinDate: 'Sep 15, 2025', lastActive: '6 hours ago', listings: 2, reviews: 31, revenue: '$3,588', avatar: 'TB', color: 'var(--emerald)', country: 'US' },
  { id: 11, name: 'Michelle Lee', email: 'mlee@cloudnative.dev', role: 'user', plan: 'Free', status: 'active', verified: true, joinDate: 'Oct 3, 2025', lastActive: '12 hours ago', listings: 0, reviews: 24, revenue: '$0', avatar: 'ML', color: 'var(--azure)', country: 'US' },
  { id: 12, name: 'Carlos Mendez', email: 'cmendez@logistix.com', role: 'business', plan: 'Basic', status: 'active', verified: false, joinDate: 'Oct 20, 2025', lastActive: '2 days ago', listings: 1, reviews: 7, revenue: '$588', avatar: 'CM', color: 'var(--plum)', country: 'MX' },
  { id: 13, name: 'Yuki Tanaka', email: 'ytanaka@toyotech.jp', role: 'business', plan: 'Pro', status: 'active', verified: true, joinDate: 'Nov 5, 2025', lastActive: '8 hours ago', listings: 3, reviews: 45, revenue: '$5,382', avatar: 'YT', color: 'var(--coral)', country: 'JP' },
  { id: 14, name: 'Alexandra Petrov', email: 'apetrov@eurotech.de', role: 'business', plan: 'Enterprise', status: 'active', verified: true, joinDate: 'Nov 18, 2025', lastActive: '1 hour ago', listings: 6, reviews: 72, revenue: '$17,910', avatar: 'AP', color: 'var(--teal)', country: 'DE' },
  { id: 15, name: 'Jordan Blake', email: 'jblake@creativeai.com', role: 'user', plan: 'Free', status: 'banned', verified: false, joinDate: 'Dec 1, 2025', lastActive: '3 weeks ago', listings: 0, reviews: 2, revenue: '$0', avatar: 'JB', color: 'var(--gray-400)', country: 'US' },
  { id: 16, name: 'Nina Vasquez', email: 'nvasquez@biomedical.co', role: 'business', plan: 'Pro', status: 'active', verified: true, joinDate: 'Dec 12, 2025', lastActive: '4 hours ago', listings: 2, reviews: 18, revenue: '$3,588', avatar: 'NV', color: 'var(--amber)', country: 'CO' },
  { id: 17, name: 'Hassan Al-Rashid', email: 'hassan@dubatech.ae', role: 'business', plan: 'Enterprise', status: 'active', verified: true, joinDate: 'Jan 3, 2026', lastActive: '45 min ago', listings: 4, reviews: 38, revenue: '$11,940', avatar: 'HR', color: 'var(--accent)', country: 'AE' },
  { id: 18, name: 'Sophie Martin', email: 'smartin@paristech.fr', role: 'business', plan: 'Basic', status: 'active', verified: true, joinDate: 'Jan 20, 2026', lastActive: '1 day ago', listings: 1, reviews: 12, revenue: '$588', avatar: 'SM', color: 'var(--rose)', country: 'FR' },
  { id: 19, name: 'Ryan O\'Connor', email: 'roconnor@dublinsoft.ie', role: 'user', plan: 'Free', status: 'active', verified: true, joinDate: 'Feb 5, 2026', lastActive: '3 hours ago', listings: 0, reviews: 34, revenue: '$0', avatar: 'RO', color: 'var(--emerald)', country: 'IE' },
  { id: 20, name: 'Wei Zhang', email: 'wzhang@shenzhentec.cn', role: 'business', plan: 'Pro', status: 'pending', verified: false, joinDate: 'Feb 18, 2026', lastActive: '10 hours ago', listings: 1, reviews: 5, revenue: '$1,794', avatar: 'WZ', color: 'var(--azure)', country: 'CN' },
  { id: 21, name: 'Emily Foster', email: 'efoster@greenenergy.com', role: 'business', plan: 'Basic', status: 'active', verified: true, joinDate: 'Feb 25, 2026', lastActive: '2 days ago', listings: 1, reviews: 9, revenue: '$588', avatar: 'EF', color: 'var(--teal)', country: 'US' },
  { id: 22, name: 'Lucas Silva', email: 'lsilva@braziltech.br', role: 'business', plan: 'Pro', status: 'active', verified: true, joinDate: 'Mar 1, 2026', lastActive: '5 hours ago', listings: 2, reviews: 22, revenue: '$3,588', avatar: 'LS', color: 'var(--plum)', country: 'BR' },
  { id: 23, name: 'Aisha Okafor', email: 'aokafor@lagosdigital.ng', role: 'business', plan: 'Basic', status: 'active', verified: false, joinDate: 'Mar 5, 2026', lastActive: '1 day ago', listings: 1, reviews: 4, revenue: '$294', avatar: 'AO', color: 'var(--coral)', country: 'NG' },
  { id: 24, name: 'Daniel Kim', email: 'dkim@seoulai.kr', role: 'business', plan: 'Enterprise', status: 'active', verified: true, joinDate: 'Mar 10, 2026', lastActive: '20 min ago', listings: 3, reviews: 15, revenue: '$8,964', avatar: 'DK', color: 'var(--amber)', country: 'KR' },
  { id: 25, name: 'Rachel Green', email: 'rgreen@test.com', role: 'user', plan: 'Free', status: 'pending', verified: false, joinDate: 'Mar 18, 2026', lastActive: 'Just now', listings: 0, reviews: 0, revenue: '$0', avatar: 'RG', color: 'var(--accent)', country: 'US' },
]

export const userStatusMap = {
  active: { label: 'Active', cls: 'db-badge--active' },
  suspended: { label: 'Suspended', cls: 'db-badge--pending' },
  banned: { label: 'Banned', cls: 'db-badge--inactive' },
  inactive: { label: 'Inactive', cls: 'db-badge--inactive' },
  pending: { label: 'Pending', cls: 'db-badge--pending' },
}

export const userRoleMap = {
  business: { label: 'Business', cls: 'db-badge--active' },
  user: { label: 'User', cls: 'db-badge--info' },
  admin: { label: 'Admin', cls: 'db-badge--positive' },
}

export const userGrowth = {
  labels: ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'],
  data: [18200, 19100, 19800, 20400, 21100, 21800, 22400, 23000, 23500, 24000, 24400, 24831],
}
