export const stats = [
  {
    label: 'Profile Views',
    value: '12,847',
    change: '+18%',
    up: true,
    gradient: 'linear-gradient(135deg,var(--accent),var(--plum))',
    icon: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
    spark: [30,45,40,55,50,65,60,72,68,80,75,85],
    sub: '1,247 this week',
    target: '15,000 monthly target',
  },
  {
    label: 'Total Leads',
    value: '384',
    change: '+24%',
    up: true,
    gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))',
    icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></>,
    spark: [20,35,32,48,55,52,60,58,70,65,78,82],
    sub: '62 qualified this week',
    target: '500 monthly target',
  },
  {
    label: 'Avg Rating',
    value: '4.8',
    change: '+0.2',
    up: true,
    gradient: 'linear-gradient(135deg,var(--amber),var(--coral))',
    icon: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>,
    spark: [70,72,73,72,74,75,76,78,78,79,80,82],
    sub: 'Based on 127 reviews',
    target: '4.9 rating goal',
  },
  {
    label: 'Click-throughs',
    value: '2,156',
    change: '-3%',
    up: false,
    gradient: 'linear-gradient(135deg,var(--azure),var(--accent))',
    icon: <><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></>,
    spark: [60,65,70,68,72,70,65,62,60,58,55,52],
    sub: 'vs 2,223 last month',
    target: '2,500 monthly target',
  },
]

export const recentActivity = [
  {
    color: 'var(--emerald)',
    text: '<strong>Sarah M.</strong> left a 5-star review on your listing',
    time: '2 hours ago',
    icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z',
  },
  {
    color: 'var(--azure)',
    text: '<strong>John D.</strong> requested a quote through your profile',
    time: '4 hours ago',
    icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
  },
  {
    color: 'var(--accent)',
    text: 'Your listing appeared in <strong>42 search results</strong> today',
    time: '6 hours ago',
    icon: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm10 2l-4.35-4.35',
  },
  {
    color: 'var(--amber)',
    text: '<strong>Emma W.</strong> saved your business to favorites',
    time: '8 hours ago',
    icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  },
  {
    color: 'var(--coral)',
    text: 'Monthly analytics report is ready to <strong>download</strong>',
    time: 'Yesterday, 6:30 PM',
    icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  },
  {
    color: 'var(--plum)',
    text: '<strong>Mike R.</strong> left a 4-star review on your listing',
    time: 'Yesterday, 2:15 PM',
    icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z',
  },
  {
    color: 'var(--teal)',
    text: 'You appeared in <strong>"Top 10 Security Providers"</strong> list',
    time: 'Mar 15, 11:00 AM',
    icon: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm10 2l-4.35-4.35',
  },
  {
    color: 'var(--rose)',
    text: '<strong>Lisa T.</strong> shared your listing on LinkedIn',
    time: 'Mar 14, 4:45 PM',
    icon: 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M16 6l-4-4-4 4 M12 2v13',
  },
]

export const performanceDays = [
  { day: 'Mar 1', views: 320, clicks: 45 }, { day: 'Mar 2', views: 410, clicks: 62 },
  { day: 'Mar 3', views: 380, clicks: 51 }, { day: 'Mar 4', views: 520, clicks: 78 },
  { day: 'Mar 5', views: 480, clicks: 72 }, { day: 'Mar 6', views: 590, clicks: 85 },
  { day: 'Mar 7', views: 450, clicks: 68 }, { day: 'Mar 8', views: 620, clicks: 92 },
  { day: 'Mar 9', views: 580, clicks: 88 }, { day: 'Mar 10', views: 710, clicks: 105 },
  { day: 'Mar 11', views: 680, clicks: 98 }, { day: 'Mar 12', views: 750, clicks: 112 },
  { day: 'Mar 13', views: 720, clicks: 108 }, { day: 'Mar 14', views: 690, clicks: 95 },
]
export const maxView = Math.max(...performanceDays.map(d => d.views))

export const funnelSteps = [
  { label: 'Search Impressions', value: 38421, pct: 100, color: 'var(--accent)', convFromPrev: null },
  { label: 'Listing Views', value: 12847, pct: 33, color: 'var(--azure)', convFromPrev: '33.4%' },
  { label: 'Click-throughs', value: 2156, pct: 17, color: 'var(--emerald)', convFromPrev: '16.8%' },
  { label: 'Leads Generated', value: 384, pct: 18, color: 'var(--amber)', convFromPrev: '17.8%' },
  { label: 'Conversions', value: 47, pct: 12, color: 'var(--coral)', convFromPrev: '12.2%' },
]

export const healthChecks = [
  { label: 'Business Info', score: 100, icon: '\u2713', desc: 'All fields complete — name, tagline, description, and categories' },
  { label: 'Photos & Media', score: 80, icon: '!', desc: 'Add 5 more photos to reach 100% — listings with 10+ get 3x clicks' },
  { label: 'Contact Details', score: 100, icon: '\u2713', desc: 'Phone, email, and website all verified and up to date' },
  { label: 'Business Hours', score: 100, icon: '\u2713', desc: 'Regular and holiday hours set — last updated 3 days ago' },
  { label: 'Services Listed', score: 90, icon: '\u2713', desc: 'Add pricing to 2 remaining services for a complete profile' },
  { label: 'Response Rate', score: 87, icon: '!', desc: 'Reply to 4 pending reviews to improve — average response time: 6h' },
]
export const overallHealth = Math.round(healthChecks.reduce((a, c) => a + c.score, 0) / healthChecks.length)

export const visitorDevices = [
  {
    device: 'Desktop',
    pct: 52,
    color: 'var(--accent)',
    sessions: 6680,
    change: 3,
    icon: 'M2 3h20v14H2z M6 21h12 M9 17v4 M15 17v4',
  },
  {
    device: 'Mobile',
    pct: 38,
    color: 'var(--emerald)',
    sessions: 4882,
    change: 7,
    icon: 'M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z M12 18h.01',
  },
  {
    device: 'Tablet',
    pct: 10,
    color: 'var(--amber)',
    sessions: 1285,
    change: -2,
    icon: 'M5 2h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z M12 18h.01',
  },
]
export const totalSessions = 12847

export const topLocations = [
  { city: 'San Francisco', pct: 28, flag: '\uD83C\uDDFA\uD83C\uDDF8', growth: 'up' },
  { city: 'New York', pct: 22, flag: '\uD83C\uDDFA\uD83C\uDDF8', growth: 'up' },
  { city: 'Los Angeles', pct: 15, flag: '\uD83C\uDDFA\uD83C\uDDF8', growth: 'flat' },
  { city: 'London', pct: 12, flag: '\uD83C\uDDEC\uD83C\uDDE7', growth: 'down' },
  { city: 'Toronto', pct: 8, flag: '\uD83C\uDDE8\uD83C\uDDE6', growth: 'up' },
]

export const yourListing = { name: 'CloudGuard Technologies', rating: 4.8, reviews: 342, views: '12.8K', category: 'Cloud Security', rankDays: 14 }

export const competitors = [
  { name: 'SecureShield Pro', rating: 4.6, reviews: 289, views: '9.8K', trend: 'up', change: '+2', badge: 'Rising' },
  { name: 'CyberFort Systems', rating: 4.5, reviews: 312, views: '11.2K', trend: 'down', change: '-1', badge: 'Slipping' },
  { name: 'TrustLayer Inc.', rating: 4.4, reviews: 198, views: '7.5K', trend: 'up', change: '+3', badge: 'Rising' },
]

export const growthTips = [
  {
    icon: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>,
    title: 'Add more photos',
    desc: 'Listings with 10+ photos get 3x more clicks. You have 5.',
    color: 'var(--azure)',
    impact: 'High',
    impactScore: 5,
    time: '~5 min',
    cta: 'Upload Photos',
    progress: { current: 5, total: 10 },
  },
  {
    icon: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></>,
    title: 'Reply to 4 pending reviews',
    desc: 'Businesses that reply to reviews get 35% more leads.',
    color: 'var(--emerald)',
    impact: 'High',
    impactScore: 4,
    time: '~15 min',
    cta: 'View Reviews',
    progress: { current: 8, total: 12 },
  },
  {
    icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>,
    title: 'Add case studies',
    desc: 'Showcase your success stories to build trust with prospects.',
    color: 'var(--plum)',
    impact: 'Medium',
    impactScore: 3,
    time: '~20 min',
    cta: 'Create Case Study',
    progress: null,
  },
  {
    icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    title: 'Update business hours',
    desc: 'Ensure your holiday hours are set for the upcoming season.',
    color: 'var(--amber)',
    impact: 'Low',
    impactScore: 2,
    time: '~5 min',
    cta: 'Edit Hours',
    progress: null,
  },
]

export const recentReviews = [
  {
    name: 'Sarah Mitchell',
    initials: 'SM',
    bg: 'var(--emerald)',
    rating: 5,
    text: 'Absolutely fantastic service! The team was professional, responsive, and delivered beyond expectations. Highly recommend to anyone looking for quality.',
    date: '2 hours ago',
    company: 'Vertex Solutions',
    helpful: 14,
    verified: true,
  },
  {
    name: 'Mike Rodriguez',
    initials: 'MR',
    bg: 'var(--azure)',
    rating: 4,
    text: 'Great experience overall. Communication was excellent and the end result was impressive. Minor delays but nothing significant.',
    date: '1 day ago',
    company: 'BrightPath Inc.',
    helpful: 8,
    verified: true,
  },
  {
    name: 'Emily Chen',
    initials: 'EC',
    bg: 'var(--plum)',
    rating: 5,
    text: 'Best in the business! I\'ve used several similar services but this one stands head and shoulders above the rest.',
    date: '3 days ago',
    company: 'NovaTech Labs',
    helpful: 21,
    verified: true,
  },
  {
    name: 'Tom Wilson',
    initials: 'TW',
    bg: 'var(--amber)',
    rating: 4,
    text: 'Solid work on a tight timeline. Appreciated the transparency and regular updates throughout the project.',
    date: '5 days ago',
    company: 'Wilson & Partners',
    helpful: 5,
    verified: false,
  },
]
