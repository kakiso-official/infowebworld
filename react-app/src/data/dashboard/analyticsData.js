export const stats = [
  { label: 'Total Views', value: '38,421', change: '+22.4%', up: true, gradient: 'linear-gradient(135deg,var(--accent),var(--plum))', spark: [18,22,19,28,25,32,30,38,35,42,40,48,45,52], icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z|M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' },
  { label: 'Unique Visitors', value: '12,847', change: '+18.2%', up: true, gradient: 'linear-gradient(135deg,var(--azure),var(--accent))', spark: [8,12,10,15,13,18,16,20,19,22,21,24,23,26], icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2|M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z|M23 21v-2a4 4 0 0 0-3-3.87|M16 3.13a4 4 0 0 1 0 7.75' },
  { label: 'Avg. Session', value: '2m 34s', change: '+8.1%', up: true, gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))', spark: [100,115,108,125,118,132,128,140,135,148,142,155,150,160], icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z|M12 6v6l4 2' },
  { label: 'Bounce Rate', value: '24.3%', change: '-5.7%', up: true, gradient: 'linear-gradient(135deg,var(--amber),var(--coral))', spark: [38,35,36,32,34,30,31,28,29,26,27,25,26,24], icon: 'M23 6l-9.5 9.5-5-5L1 18' },
]

export const daily30 = [
  320,380,410,390,450,480,420,350,310,460,500,520,480,540,560,530,490,470,580,620,600,580,640,670,650,620,700,720,710,680
]

export const dailyVisitors30 = [
  180,210,230,220,250,270,240,200,180,260,280,290,270,300,310,300,280,270,320,340,330,320,350,370,360,340,380,400,390,370
]

export const dailyLabels = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 1, 13 + i)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
})

export const trafficSources = [
  { source: 'Organic Search', value: 16142, pct: 42, color: 'var(--accent)', icon: 'M11 11a8 8 0 1 0 0-16 8 8 0 0 0 0 16z|M21 21l-4.35-4.35' },
  { source: 'Direct Traffic', value: 10758, pct: 28, color: 'var(--emerald)', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3' },
  { source: 'Social Media', value: 6916, pct: 18, color: 'var(--azure)', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
  { source: 'Referral Links', value: 3074, pct: 8, color: 'var(--amber)', icon: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71|M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71' },
  { source: 'Email Campaigns', value: 1531, pct: 4, color: 'var(--plum)', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z|M22 6l-10 7L2 6' },
]

export const topSearchTerms = [
  { term: 'cloud security solutions', count: 342, change: +12, spark: [20,25,22,28,30,26,34,38,35,40] },
  { term: 'enterprise cybersecurity', count: 256, change: +8, spark: [15,18,16,20,22,19,24,26,25,28] },
  { term: 'zero trust architecture', count: 198, change: +24, spark: [8,10,12,14,16,20,22,26,28,32] },
  { term: 'business security services', count: 167, change: -3, spark: [18,20,19,17,18,16,17,15,16,14] },
  { term: 'IT security consulting', count: 134, change: +5, spark: [10,11,12,11,13,12,14,13,15,14] },
  { term: 'SOC 2 compliance provider', count: 98, change: +32, spark: [3,5,6,8,10,12,14,16,18,22] },
  { term: 'cloud infrastructure audit', count: 87, change: +15, spark: [5,7,8,7,9,10,12,11,13,14] },
]

export const topPages = [
  { page: 'Main Listing Page', views: 8421, sessions: 6240, bounceRate: 18, avgTime: '3:12' },
  { page: 'Reviews Section', views: 5632, sessions: 4180, bounceRate: 22, avgTime: '2:45' },
  { page: 'Contact / Quote Form', views: 3847, sessions: 2850, bounceRate: 31, avgTime: '1:58' },
  { page: 'Photo Gallery', views: 2156, sessions: 1600, bounceRate: 35, avgTime: '1:42' },
  { page: 'About / Team', views: 1890, sessions: 1400, bounceRate: 28, avgTime: '2:15' },
  { page: 'Pricing Page', views: 1245, sessions: 920, bounceRate: 40, avgTime: '1:20' },
]

/* Hour x Day heatmap data (0-23 hours, Mon-Sun) */
export const heatmapData = [
  [2,1,0,0,0,1,3,12,28,35,42,38,30,32,40,45,42,35,28,18,12,8,5,3],
  [3,1,1,0,0,2,4,14,30,38,45,40,32,35,42,48,44,38,30,20,14,9,6,4],
  [2,2,0,0,1,2,5,16,32,40,48,44,35,38,46,50,47,40,32,22,15,10,7,3],
  [3,1,1,0,0,1,4,15,34,42,50,46,38,40,48,52,48,42,34,24,16,11,6,4],
  [4,2,1,0,0,2,5,18,36,44,52,48,40,42,50,55,50,44,36,28,20,14,8,5],
  [6,4,2,1,0,1,2,8,16,22,28,32,28,26,24,22,20,18,16,14,12,10,8,6],
  [5,3,2,1,0,0,1,6,12,18,22,26,24,22,20,18,16,14,12,10,8,7,6,4],
]

export const heatDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const deviceData = [
  { device: 'Desktop', pct: 52, sessions: 6680, color: 'var(--accent)' },
  { device: 'Mobile', pct: 38, sessions: 4882, color: 'var(--emerald)' },
  { device: 'Tablet', pct: 10, sessions: 1285, color: 'var(--amber)' },
]

export const geoData = [
  { country: 'United States', visits: 8420, pct: 65.5, flag: '\u{1F1FA}\u{1F1F8}' },
  { country: 'United Kingdom', visits: 1540, pct: 12.0, flag: '\u{1F1EC}\u{1F1E7}' },
  { country: 'Canada', visits: 980, pct: 7.6, flag: '\u{1F1E8}\u{1F1E6}' },
  { country: 'Germany', visits: 620, pct: 4.8, flag: '\u{1F1E9}\u{1F1EA}' },
  { country: 'Australia', visits: 480, pct: 3.7, flag: '\u{1F1E6}\u{1F1FA}' },
  { country: 'India', visits: 340, pct: 2.6, flag: '\u{1F1EE}\u{1F1F3}' },
  { country: 'Others', visits: 467, pct: 3.8, flag: '\u{1F30D}' },
]

export const conversionGoals = [
  { goal: 'Quote Request Submitted', completions: 847, rate: 6.6, change: +18, color: 'var(--accent)' },
  { goal: 'Contact Form Filled', completions: 623, rate: 4.8, change: +12, color: 'var(--emerald)' },
  { goal: 'Phone Number Clicked', completions: 412, rate: 3.2, change: +8, color: 'var(--azure)' },
  { goal: 'Directions Requested', completions: 256, rate: 2.0, change: -2, color: 'var(--amber)' },
]

export const audienceInsights = [
  { label: 'New Visitors', value: '68%', sub: '8,736 users', gradient: 'linear-gradient(135deg,var(--azure),var(--accent))' },
  { label: 'Returning Visitors', value: '32%', sub: '4,111 users', gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))' },
  { label: 'Pages / Session', value: '3.4', sub: '+0.6 vs last month', gradient: 'linear-gradient(135deg,var(--plum),var(--rose))' },
  { label: 'Avg. Visit Duration', value: '2:34', sub: '+18s vs last month', gradient: 'linear-gradient(135deg,var(--amber),var(--coral))' },
]

export const browserData = [
  { name: 'Chrome', pct: 58 },
  { name: 'Safari', pct: 22 },
  { name: 'Firefox', pct: 10 },
  { name: 'Edge', pct: 7 },
  { name: 'Other', pct: 3 },
]

export const referrers = [
  { site: 'google.com', visits: 5420, trend: 'up' },
  { site: 'linkedin.com', visits: 1840, trend: 'up' },
  { site: 'twitter.com', visits: 980, trend: 'down' },
  { site: 'techcrunch.com', visits: 640, trend: 'up' },
  { site: 'producthunt.com', visits: 420, trend: 'up' },
  { site: 'reddit.com', visits: 380, trend: 'down' },
]
