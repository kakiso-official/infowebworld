export const allReviews = [
  { id: 1, author: 'Sarah Mitchell', listing: 'CloudGuard Technologies', rating: 5, text: 'Absolutely fantastic cloud security platform! Seamless integration with our AWS infrastructure. The team was incredibly responsive.', status: 'published', flagged: false, verified: true, date: 'Mar 18, 2026', helpful: 24, avatar: 'SM', color: 'var(--emerald)' },
  { id: 2, author: 'Mike Rodriguez', listing: 'DataShield Pro', rating: 4, text: 'Great data protection suite. Implementation was smooth and the documentation is excellent. Minor UI quirks but nothing deal-breaking.', status: 'published', flagged: false, verified: true, date: 'Mar 17, 2026', helpful: 18, avatar: 'MR', color: 'var(--azure)' },
  { id: 3, author: 'SPAMBOT_2026', listing: 'SecureFlow Inc.', rating: 1, text: 'BUY CHEAP FOLLOWERS NOW!!! Visit spamsite dot com for amazing deals! Best prices guaranteed!!!', status: 'flagged', flagged: true, flagReason: 'Spam / fake review', verified: false, date: 'Mar 18, 2026', helpful: 0, avatar: 'SB', color: 'var(--gray-400)' },
  { id: 4, author: 'Emily Chen', listing: 'NetWatch Solutions', rating: 5, text: 'NetWatch transformed our network security posture. Their threat detection is top-notch and the dashboard gives incredible visibility.', status: 'published', flagged: false, verified: true, date: 'Mar 16, 2026', helpful: 31, avatar: 'EC', color: 'var(--plum)' },
  { id: 5, author: 'Anonymous User', listing: 'DataShield Pro', rating: 1, text: 'This company is a complete SCAM!! They stole my money and their product is absolute garbage. DO NOT USE!!!', status: 'flagged', flagged: true, flagReason: 'Offensive language', verified: false, date: 'Mar 17, 2026', helpful: 2, avatar: 'AU', color: 'var(--gray-400)' },
  { id: 6, author: 'Tom Wilson', listing: 'CyberFort Systems', rating: 4, text: 'Solid endpoint protection with reasonable pricing. The support team is knowledgeable and always available within business hours.', status: 'published', flagged: false, verified: true, date: 'Mar 15, 2026', helpful: 14, avatar: 'TW', color: 'var(--amber)' },
  { id: 7, author: 'Jessica Lee', listing: 'ThreatHunter AI', rating: 5, text: 'AI-powered threat detection that actually works. Cut our incident response time by 60%. Worth every penny of the enterprise plan.', status: 'published', flagged: false, verified: true, date: 'Mar 14, 2026', helpful: 42, avatar: 'JL', color: 'var(--coral)' },
  { id: 8, author: 'Competitor Rep', listing: 'ComplianceHub', rating: 1, text: 'Our product CompetitorX is way better than this. They copied our features and charge more. Visit competitorx.com instead.', status: 'flagged', flagged: true, flagReason: 'Competitor sabotage', verified: false, date: 'Mar 16, 2026', helpful: 0, avatar: 'CR', color: 'var(--gray-400)' },
  { id: 9, author: 'Daniel Kim', listing: 'VaultKeeper Pro', rating: 4, text: 'Good password management solution. The browser extension works flawlessly. Would love to see better enterprise features.', status: 'published', flagged: false, verified: true, date: 'Mar 13, 2026', helpful: 9, avatar: 'DK', color: 'var(--teal)' },
  { id: 10, author: 'Rachel Green', listing: 'CloudGuard Technologies', rating: 5, text: 'Switched from a competitor and couldn\'t be happier. The migration support alone was worth it. Highly recommend to mid-size companies.', status: 'published', flagged: false, verified: true, date: 'Mar 12, 2026', helpful: 27, avatar: 'RG', color: 'var(--accent)' },
  { id: 11, author: 'Mark Stevens', listing: 'FirewallX Pro', rating: 3, text: 'Decent firewall solution but the UI feels dated. Performance is good but management console needs a major overhaul.', status: 'published', flagged: false, verified: true, date: 'Mar 11, 2026', helpful: 7, avatar: 'MS', color: 'var(--rose)' },
  { id: 12, author: 'SockPuppet123', listing: 'PhishGuard AI', rating: 5, text: 'Best product ever made! I use it every day and it\'s perfect in every way! 10/10 would recommend to everyone!', status: 'flagged', flagged: true, flagReason: 'Suspected fake review', verified: false, date: 'Mar 15, 2026', helpful: 1, avatar: 'SP', color: 'var(--gray-400)' },
  { id: 13, author: 'Priya Sharma', listing: 'AccessControl Pro', rating: 4, text: 'Robust IAM solution that scales well. SSO integration was painless. Minor documentation gaps for advanced configurations.', status: 'published', flagged: false, verified: true, date: 'Mar 10, 2026', helpful: 15, avatar: 'PS', color: 'var(--emerald)' },
  { id: 14, author: 'Alex Martinez', listing: 'ZeroTrust Platform', rating: 5, text: 'Implementing zero trust was daunting until we found this platform. Incredibly intuitive and their onboarding process is stellar.', status: 'published', flagged: false, verified: true, date: 'Mar 9, 2026', helpful: 33, avatar: 'AM', color: 'var(--azure)' },
  { id: 15, author: 'UserX', listing: 'PenTestPro', rating: 2, text: 'The tool has potential but crashes frequently during large scans. Support response times are unacceptable for a paid product.', status: 'published', flagged: false, verified: true, date: 'Mar 8, 2026', helpful: 11, avatar: 'UX', color: 'var(--amber)' },
  { id: 16, author: 'Lisa Park', listing: 'BackupVault', rating: 4, text: 'Reliable backup solution with good recovery options. The scheduling interface could use some work but overall very satisfied.', status: 'published', flagged: false, verified: true, date: 'Mar 7, 2026', helpful: 8, avatar: 'LP', color: 'var(--plum)' },
  { id: 17, author: 'Review Bot', listing: 'NetWatch Solutions', rating: 5, text: 'Amazing amazing amazing! Best security tool! Buy now! Great product great service great everything!', status: 'flagged', flagged: true, flagReason: 'Spam / bot-generated', verified: false, date: 'Mar 14, 2026', helpful: 0, avatar: 'RB', color: 'var(--gray-400)' },
  { id: 18, author: 'Hassan Al-Rashid', listing: 'PrivacyShield EU', rating: 5, text: 'Perfect for GDPR compliance. The automated data mapping and consent management features saved us months of manual work.', status: 'pending', flagged: false, verified: true, date: 'Mar 18, 2026', helpful: 0, avatar: 'HR', color: 'var(--coral)' },
  { id: 19, author: 'Sophie Martin', listing: 'CloudArmor Suite', rating: 4, text: 'Good cloud security suite with competitive pricing. The threat visualization dashboard is particularly impressive.', status: 'pending', flagged: false, verified: true, date: 'Mar 18, 2026', helpful: 0, avatar: 'SM', color: 'var(--teal)' },
  { id: 20, author: 'Carlos Mendez', listing: 'ThreatHunter AI', rating: 3, text: 'AI features are impressive but the learning curve is steep. Took our team about 3 weeks to get comfortable with the platform.', status: 'published', flagged: false, verified: true, date: 'Mar 6, 2026', helpful: 12, avatar: 'CM', color: 'var(--accent)' },
]

export const reviewStatusMap = {
  published: { label: 'Published', cls: 'db-badge--active' },
  pending: { label: 'Pending', cls: 'db-badge--pending' },
  flagged: { label: 'Flagged', cls: 'db-badge--inactive' },
  removed: { label: 'Removed', cls: 'db-badge--inactive' },
}

export const ratingDistribution = [
  { label: '5 stars', value: 8, pct: 40, color: 'var(--emerald)' },
  { label: '4 stars', value: 6, pct: 30, color: 'var(--teal)' },
  { label: '3 stars', value: 3, pct: 15, color: 'var(--amber)' },
  { label: '2 stars', value: 1, pct: 5, color: 'var(--coral)' },
  { label: '1 star', value: 2, pct: 10, color: 'var(--gray-400)' },
]

export const sentimentBreakdown = [
  { label: 'Positive', pct: 65, color: 'var(--emerald)' },
  { label: 'Neutral', pct: 20, color: 'var(--amber)' },
  { label: 'Negative', pct: 15, color: 'var(--coral)' },
]

export const reviewTrends = {
  labels: ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'],
  total: [980, 1050, 1120, 1180, 1260, 1340, 1420, 1510, 1600, 1680, 1760, 1850],
  flagged: [12, 15, 18, 14, 20, 22, 19, 25, 28, 24, 30, 32],
}

export const topReviewedListings = [
  { name: 'CloudGuard Technologies', reviews: 342, avgRating: 4.8, sentiment: 'positive' },
  { name: 'DataShield Pro', reviews: 291, avgRating: 4.7, sentiment: 'positive' },
  { name: 'NetWatch Solutions', reviews: 267, avgRating: 4.6, sentiment: 'positive' },
  { name: 'CyberFort Systems', reviews: 234, avgRating: 4.5, sentiment: 'positive' },
  { name: 'SecureFlow Inc.', reviews: 198, avgRating: 4.7, sentiment: 'positive' },
]
