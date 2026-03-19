export const allListings = [
  { id: 1, name: 'CloudGuard Technologies', owner: 'Priya Sharma', category: 'Cloud Security', status: 'active', verified: true, rating: 4.8, reviews: 342, views: 12847, leads: 384, quality: 95, created: 'Jan 15, 2025', plan: 'Enterprise' },
  { id: 2, name: 'DataShield Pro', owner: 'Lisa Park', category: 'Data Protection', status: 'active', verified: true, rating: 4.7, reviews: 291, views: 10234, leads: 291, quality: 92, created: 'Feb 8, 2025', plan: 'Enterprise' },
  { id: 3, name: 'NetWatch Solutions', owner: 'Alexandra Petrov', category: 'Network Security', status: 'active', verified: true, rating: 4.6, reviews: 267, views: 9876, leads: 267, quality: 88, created: 'Mar 2, 2025', plan: 'Pro' },
  { id: 4, name: 'CyberFort Systems', owner: 'David Chen', category: 'Endpoint Security', status: 'active', verified: true, rating: 4.5, reviews: 234, views: 8923, leads: 234, quality: 85, created: 'Mar 20, 2025', plan: 'Pro' },
  { id: 5, name: 'SecureFlow Inc.', owner: 'Tom Bradley', category: 'IAM Solutions', status: 'active', verified: true, rating: 4.7, reviews: 198, views: 7845, leads: 198, quality: 90, created: 'Apr 5, 2025', plan: 'Pro' },
  { id: 6, name: 'ThreatHunter AI', owner: 'Hassan Al-Rashid', category: 'Threat Detection', status: 'active', verified: true, rating: 4.4, reviews: 176, views: 7234, leads: 176, quality: 82, created: 'Apr 22, 2025', plan: 'Enterprise' },
  { id: 7, name: 'ComplianceHub', owner: 'Sarah Mitchell', category: 'GRC Platform', status: 'active', verified: true, rating: 4.6, reviews: 165, views: 6891, leads: 165, quality: 87, created: 'May 10, 2025', plan: 'Enterprise' },
  { id: 8, name: 'VaultKeeper Pro', owner: 'Emma Rodriguez', category: 'Password Management', status: 'active', verified: false, rating: 4.3, reviews: 152, views: 6543, leads: 152, quality: 78, created: 'Jun 1, 2025', plan: 'Basic' },
  { id: 9, name: 'FirewallX Pro', owner: 'Yuki Tanaka', category: 'Network Security', status: 'active', verified: true, rating: 4.5, reviews: 134, views: 5982, leads: 134, quality: 84, created: 'Jun 18, 2025', plan: 'Pro' },
  { id: 10, name: 'PhishGuard AI', owner: 'Lucas Silva', category: 'Email Security', status: 'active', verified: true, rating: 4.2, reviews: 98, views: 4521, leads: 98, quality: 76, created: 'Jul 5, 2025', plan: 'Pro' },
  { id: 11, name: 'AccessControl Pro', owner: 'Nina Vasquez', category: 'IAM Solutions', status: 'active', verified: true, rating: 4.4, reviews: 87, views: 4123, leads: 87, quality: 81, created: 'Aug 12, 2025', plan: 'Basic' },
  { id: 12, name: 'BackupVault', owner: 'Daniel Kim', category: 'Data Protection', status: 'active', verified: true, rating: 4.1, reviews: 76, views: 3876, leads: 76, quality: 73, created: 'Sep 3, 2025', plan: 'Pro' },
  { id: 13, name: 'TechVault Inc.', owner: 'Carlos Mendez', category: 'Cloud Security', status: 'pending', verified: false, rating: 0, reviews: 0, views: 0, leads: 0, quality: 65, created: 'Mar 18, 2026', plan: 'Basic' },
  { id: 14, name: 'QuickHack Tools', owner: 'Jordan Blake', category: 'Penetration Testing', status: 'rejected', verified: false, rating: 0, reviews: 0, views: 0, leads: 0, quality: 22, created: 'Mar 15, 2026', plan: 'Free' },
  { id: 15, name: 'FreeVPN Plus', owner: 'Mark Stevens', category: 'VPN Services', status: 'pending', verified: false, rating: 0, reviews: 0, views: 0, leads: 0, quality: 45, created: 'Mar 16, 2026', plan: 'Free' },
  { id: 16, name: 'SecurityBot AI', owner: 'Wei Zhang', category: 'AI Security', status: 'pending', verified: false, rating: 0, reviews: 0, views: 0, leads: 0, quality: 72, created: 'Mar 17, 2026', plan: 'Pro' },
  { id: 17, name: 'CloudArmor Suite', owner: 'Sophie Martin', category: 'Cloud Security', status: 'pending', verified: false, rating: 0, reviews: 0, views: 0, leads: 0, quality: 58, created: 'Mar 17, 2026', plan: 'Basic' },
  { id: 18, name: 'PrivacyShield EU', owner: 'Alexandra Petrov', category: 'Compliance', status: 'pending', verified: false, rating: 0, reviews: 0, views: 0, leads: 0, quality: 80, created: 'Mar 18, 2026', plan: 'Enterprise' },
  { id: 19, name: 'ZeroTrust Platform', owner: 'Hassan Al-Rashid', category: 'Zero Trust', status: 'active', verified: true, rating: 4.6, reviews: 45, views: 2340, leads: 45, quality: 91, created: 'Nov 20, 2025', plan: 'Enterprise' },
  { id: 20, name: 'PenTestPro', owner: 'Robert Kim', category: 'Penetration Testing', status: 'suspended', verified: true, rating: 3.8, reviews: 23, views: 1245, leads: 23, quality: 55, created: 'Oct 8, 2025', plan: 'Pro' },
]

export const listingStatusMap = {
  active: { label: 'Active', cls: 'db-badge--active' },
  pending: { label: 'Pending', cls: 'db-badge--pending' },
  rejected: { label: 'Rejected', cls: 'db-badge--inactive' },
  suspended: { label: 'Suspended', cls: 'db-badge--inactive' },
}

export const categoryDistribution = [
  { label: 'Cloud Security', pct: 22, color: 'var(--accent)' },
  { label: 'Data Protection', pct: 15, color: 'var(--emerald)' },
  { label: 'Network Security', pct: 13, color: 'var(--azure)' },
  { label: 'IAM Solutions', pct: 12, color: 'var(--amber)' },
  { label: 'Endpoint Security', pct: 10, color: 'var(--coral)' },
  { label: 'Other', pct: 28, color: 'var(--gray-300)' },
]

export const qualityDistribution = [
  { label: '90-100', value: 6, color: 'var(--emerald)' },
  { label: '80-89', value: 5, color: 'var(--teal)' },
  { label: '70-79', value: 4, color: 'var(--azure)' },
  { label: '60-69', value: 2, color: 'var(--amber)' },
  { label: '50-59', value: 2, color: 'var(--coral)' },
  { label: '0-49', value: 1, color: 'var(--gray-400)' },
]
