export const allArticles = [
  { id: 1, title: 'The Rise of AI-Powered Cybersecurity in 2026', category: 'Industry Trends', status: 'published', author: 'Admin', views: 12450, shares: 342, publishDate: 'Mar 18, 2026', featured: true },
  { id: 2, title: 'Top 10 Cloud Security Platforms Compared', category: 'Reviews', status: 'published', author: 'Admin', views: 9870, shares: 287, publishDate: 'Mar 15, 2026', featured: true },
  { id: 3, title: 'Zero Trust Architecture: A Complete Guide', category: 'Guides', status: 'published', author: 'Admin', views: 8234, shares: 198, publishDate: 'Mar 12, 2026', featured: false },
  { id: 4, title: 'GDPR 2.0: What Businesses Need to Know', category: 'Compliance', status: 'published', author: 'Admin', views: 7651, shares: 176, publishDate: 'Mar 10, 2026', featured: false },
  { id: 5, title: 'How to Choose the Right IAM Solution', category: 'Guides', status: 'published', author: 'Admin', views: 6890, shares: 154, publishDate: 'Mar 7, 2026', featured: false },
  { id: 6, title: 'Ransomware Trends: Q1 2026 Report', category: 'Reports', status: 'published', author: 'Admin', views: 5432, shares: 123, publishDate: 'Mar 5, 2026', featured: false },
  { id: 7, title: 'Building a Security-First Culture', category: 'Best Practices', status: 'published', author: 'Admin', views: 4567, shares: 98, publishDate: 'Mar 1, 2026', featured: false },
  { id: 8, title: 'API Security Best Practices for 2026', category: 'Guides', status: 'draft', author: 'Admin', views: 0, shares: 0, publishDate: null, featured: false },
  { id: 9, title: 'Endpoint Detection: EDR vs XDR', category: 'Reviews', status: 'draft', author: 'Admin', views: 0, shares: 0, publishDate: null, featured: false },
  { id: 10, title: 'The Future of Biometric Authentication', category: 'Industry Trends', status: 'scheduled', author: 'Admin', views: 0, shares: 0, publishDate: 'Mar 25, 2026', featured: false },
  { id: 11, title: 'Securing Remote Workforces in 2026', category: 'Best Practices', status: 'scheduled', author: 'Admin', views: 0, shares: 0, publishDate: 'Mar 28, 2026', featured: false },
  { id: 12, title: 'Data Breach Response Playbook', category: 'Guides', status: 'draft', author: 'Admin', views: 0, shares: 0, publishDate: null, featured: false },
]

export const articleStatusMap = {
  published: { label: 'Published', cls: 'db-badge--active' },
  draft: { label: 'Draft', cls: 'db-badge--pending' },
  scheduled: { label: 'Scheduled', cls: 'db-badge--info' },
  archived: { label: 'Archived', cls: 'db-badge--inactive' },
}

export const newsCategoryBreakdown = [
  { label: 'Guides', pct: 33, color: 'var(--accent)' },
  { label: 'Industry Trends', pct: 17, color: 'var(--emerald)' },
  { label: 'Reviews', pct: 17, color: 'var(--azure)' },
  { label: 'Best Practices', pct: 17, color: 'var(--amber)' },
  { label: 'Reports', pct: 8, color: 'var(--coral)' },
  { label: 'Compliance', pct: 8, color: 'var(--plum)' },
]

export const calendarEvents = [
  { day: 1, title: 'Security Culture' },
  { day: 5, title: 'Ransomware Report' },
  { day: 7, title: 'IAM Guide' },
  { day: 10, title: 'GDPR 2.0' },
  { day: 12, title: 'Zero Trust Guide' },
  { day: 15, title: 'Cloud Security Top 10' },
  { day: 18, title: 'AI Cybersecurity' },
  { day: 19, title: 'Today' },
  { day: 25, title: 'Biometric Auth' },
  { day: 28, title: 'Remote Security' },
]
