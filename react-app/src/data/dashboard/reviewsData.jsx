export const reviews = [
  { id: 1, name: 'Sarah Mitchell', initials: 'SM', bg: 'var(--emerald)', rating: 5, text: 'Absolutely fantastic service! The team was professional, responsive, and delivered beyond expectations. Their zero-trust implementation saved us from a potential breach just two weeks after deployment. Worth every penny.', date: 'Mar 14, 2026', time: '2:30 PM', replied: false, helpful: 24, source: 'Google', verified: true, sentiment: 'positive', tags: ['Professional', 'Responsive', 'Security'] },
  { id: 2, name: 'Jason Park', initials: 'JP', bg: 'var(--azure)', rating: 5, text: 'Incredible attention to detail. They took the time to understand our specific needs and delivered a solution that exceeded our expectations. The SOC 2 audit went flawlessly thanks to their preparation.', date: 'Mar 13, 2026', time: '11:45 AM', replied: false, helpful: 18, source: 'InfoWebWorld', verified: true, sentiment: 'positive', tags: ['Detail-oriented', 'SOC 2', 'Excellent'] },
  { id: 3, name: 'Maria Garcia', initials: 'MG', bg: 'var(--amber)', rating: 4, text: 'Great service overall. The initial consultation was thorough and the implementation was smooth. Documentation could be more detailed but the team was always available for questions. Would definitely use again.', date: 'Mar 12, 2026', time: '4:15 PM', replied: true, replyText: 'Thank you Maria! We appreciate the feedback on documentation \u2014 we\'re working on improving our knowledge base. Glad we could help!', replyDate: 'Mar 12, 2026', helpful: 12, source: 'Google', verified: true, sentiment: 'positive', tags: ['Thorough', 'Smooth'] },
  { id: 4, name: 'Mike Rodriguez', initials: 'MR', bg: 'var(--plum)', rating: 4, text: 'Good experience. Communication was excellent throughout the project. There were minor delays in the initial timeline but the team was transparent about it and the end result was impressive. Solid security partner.', date: 'Mar 11, 2026', time: '9:20 AM', replied: true, replyText: 'Thank you for the honest feedback, Mike. We\'ve adjusted our timeline estimation process to prevent delays. Glad the result met your expectations!', replyDate: 'Mar 11, 2026', helpful: 9, source: 'Yelp', verified: true, sentiment: 'positive', tags: ['Communication', 'Transparent'] },
  { id: 5, name: 'Emily Chen', initials: 'EC', bg: 'var(--coral)', rating: 5, text: 'Best in the business! I\'ve used several similar services but this one stands head and shoulders above the rest. Their penetration testing uncovered vulnerabilities our previous vendor missed entirely. Game changer for our security posture.', date: 'Mar 10, 2026', time: '1:00 PM', replied: true, replyText: 'Wow, thank you Emily! We take pride in being thorough with our pen testing. Happy to be your security partner!', replyDate: 'Mar 10, 2026', helpful: 31, source: 'Google', verified: true, sentiment: 'positive', tags: ['Best-in-class', 'Pen Testing'] },
  { id: 6, name: 'David Kim', initials: 'DK', bg: 'var(--teal)', rating: 3, text: 'Decent service but communication could be improved. Response times were inconsistent \u2014 sometimes within the hour, other times 24+ hours. The deliverables were good quality though and the final report was comprehensive.', date: 'Mar 8, 2026', time: '3:40 PM', replied: false, helpful: 6, source: 'InfoWebWorld', verified: true, sentiment: 'mixed', tags: ['Communication', 'Quality'] },
  { id: 7, name: 'Rachel Adams', initials: 'RA', bg: 'var(--rose)', rating: 5, text: 'Transformed our entire workflow. The team is knowledgeable, patient, and truly cares about delivering results. They didn\'t just fix problems \u2014 they educated our team so we could maintain the improvements ourselves.', date: 'Mar 7, 2026', time: '10:30 AM', replied: false, helpful: 22, source: 'Google', verified: true, sentiment: 'positive', tags: ['Knowledgeable', 'Patient', 'Educational'] },
  { id: 8, name: 'Tom Wilson', initials: 'TW', bg: 'var(--accent)', rating: 4, text: 'Solid work on a tight timeline. Appreciated the transparency and regular updates throughout the project. The compliance report was especially well-done and our auditors were impressed.', date: 'Mar 5, 2026', time: '5:15 PM', replied: true, replyText: 'Thanks Tom! We understand the pressure of tight timelines. Happy to hear the auditors were pleased!', replyDate: 'Mar 6, 2026', helpful: 14, source: 'Yelp', verified: false, sentiment: 'positive', tags: ['Timely', 'Transparent', 'Compliance'] },
  { id: 9, name: 'Lisa Nguyen', initials: 'LN', bg: 'var(--emerald)', rating: 5, text: 'Outstanding! From day one, the team demonstrated deep expertise in cloud security. They identified and remediated critical vulnerabilities across our AWS infrastructure in record time. Our CISO was extremely impressed.', date: 'Mar 4, 2026', time: '8:45 AM', replied: false, helpful: 28, source: 'Google', verified: true, sentiment: 'positive', tags: ['Cloud', 'AWS', 'Expert'] },
  { id: 10, name: 'Alex Rivera', initials: 'AR', bg: 'var(--azure)', rating: 2, text: 'The service was okay but overpriced for what we got. Expected more hands-on guidance during the implementation phase. The final report was thorough but the engagement felt rushed.', date: 'Mar 3, 2026', time: '2:10 PM', replied: false, helpful: 3, source: 'InfoWebWorld', verified: true, sentiment: 'negative', tags: ['Pricing', 'Rushed'] },
  { id: 11, name: 'Jennifer Lee', initials: 'JL', bg: 'var(--amber)', rating: 5, text: 'Phenomenal experience. The security assessment they conducted was the most thorough we\'ve ever seen. They even found issues in our CI/CD pipeline that nobody else caught. Already renewed for next year.', date: 'Mar 2, 2026', time: '11:20 AM', replied: true, replyText: 'Thank you Jennifer! CI/CD security is often overlooked \u2014 glad we could provide comprehensive coverage. Looking forward to year two!', replyDate: 'Mar 2, 2026', helpful: 19, source: 'Google', verified: true, sentiment: 'positive', tags: ['Thorough', 'CI/CD', 'Renewed'] },
  { id: 12, name: 'Chris Thompson', initials: 'CT', bg: 'var(--plum)', rating: 4, text: 'Very professional outfit. The team was well-organized and kept us informed at every step. The only area for improvement would be providing more actionable recommendations in the executive summary.', date: 'Mar 1, 2026', time: '4:30 PM', replied: true, replyText: 'Appreciate the feedback, Chris! We\'ve already updated our executive summary template based on your suggestion. Thanks!', replyDate: 'Mar 1, 2026', helpful: 11, source: 'Yelp', verified: true, sentiment: 'positive', tags: ['Professional', 'Organized'] },
]

export const ratingDist = [
  { stars: 5, count: 186, pct: 62 },
  { stars: 4, count: 78, pct: 26 },
  { stars: 3, count: 24, pct: 8 },
  { stars: 2, count: 8, pct: 3 },
  { stars: 1, count: 4, pct: 1 },
]

export const totalReviews = ratingDist.reduce((a, r) => a + r.count, 0)

export const monthlyReviews = [
  { month: 'Oct', count: 18, avg: 4.5 },
  { month: 'Nov', count: 22, avg: 4.6 },
  { month: 'Dec', count: 20, avg: 4.7 },
  { month: 'Jan', count: 26, avg: 4.7 },
  { month: 'Feb', count: 28, avg: 4.8 },
  { month: 'Mar', count: 32, avg: 4.8 },
]

export const sentimentKeywords = [
  { word: 'professional', count: 48, sentiment: 'positive' },
  { word: 'responsive', count: 42, sentiment: 'positive' },
  { word: 'thorough', count: 38, sentiment: 'positive' },
  { word: 'knowledgeable', count: 35, sentiment: 'positive' },
  { word: 'communication', count: 28, sentiment: 'mixed' },
  { word: 'transparent', count: 24, sentiment: 'positive' },
  { word: 'timely', count: 22, sentiment: 'positive' },
  { word: 'expensive', count: 12, sentiment: 'negative' },
  { word: 'delayed', count: 8, sentiment: 'negative' },
  { word: 'excellent', count: 45, sentiment: 'positive' },
]

export const sourcesData = [
  { source: 'Google', count: 156, pct: 52, color: 'var(--accent)', avg: 4.9 },
  { source: 'InfoWebWorld', count: 78, pct: 26, color: 'var(--emerald)', avg: 4.7 },
  { source: 'Yelp', count: 42, pct: 14, color: 'var(--coral)', avg: 4.6 },
  { source: 'Facebook', count: 24, pct: 8, color: 'var(--azure)', avg: 4.5 },
]

export const competitors = [
  { name: 'You (CloudGuard)', rating: 4.8, reviews: 300, rank: 1, isYou: true },
  { name: 'SecureNet Pro', rating: 4.6, reviews: 245, rank: 2 },
  { name: 'CyberShield Corp', rating: 4.5, reviews: 312, rank: 3 },
  { name: 'TrustArmor', rating: 4.3, reviews: 198, rank: 4 },
  { name: 'DataFort Security', rating: 4.1, reviews: 167, rank: 5 },
]

export const avgRating = 4.8

export const sentimentData = [
  { label: 'Positive', pct: 85, color: 'var(--emerald)' },
  { label: 'Mixed', pct: 10, color: 'var(--amber)' },
  { label: 'Negative', pct: 5, color: 'var(--coral)' },
]

export const performanceMetrics = [
  { metric: 'Avg. Response Time', curr: '4.2h', prev: '5.1h', target: '< 6h', status: 'on-track', spark: [8,7,6.5,6,5.5,5.1,4.8,4.2], up: true },
  { metric: 'Response Rate', curr: '87%', prev: '82%', target: '> 85%', status: 'on-track', spark: [72,75,78,80,82,84,86,87], up: true },
  { metric: 'Avg. Rating (New)', curr: '4.8', prev: '4.6', target: '> 4.5', status: 'exceeding', spark: [4.3,4.4,4.5,4.5,4.6,4.7,4.7,4.8], up: true },
  { metric: 'Review Volume', curr: '32/mo', prev: '28/mo', target: '> 25', status: 'exceeding', spark: [18,20,22,24,26,28,30,32], up: true },
  { metric: 'Negative Reviews', curr: '2', prev: '3', target: '< 5', status: 'on-track', spark: [6,5,5,4,4,3,3,2], up: true },
  { metric: '5-Star Ratio', curr: '62%', prev: '58%', target: '> 55%', status: 'exceeding', spark: [48,50,52,54,56,58,60,62], up: true },
]

export const statsRow = [
  { label: 'Total Reviews', value: totalReviews.toString(), change: '+32 this month', gradient: 'linear-gradient(135deg,var(--amber),var(--coral))', spark: [18,22,20,26,28,32], sparkColor: 'var(--amber)', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  { label: 'Avg Rating', value: avgRating.toString(), change: '+0.2 vs last quarter', gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))', spark: [4.3,4.4,4.5,4.6,4.7,4.8], sparkColor: 'var(--emerald)', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
  { label: 'Response Rate', value: '87%', change: '+5% this month', gradient: 'linear-gradient(135deg,var(--accent),var(--plum))', spark: [72,75,78,80,83,87], sparkColor: 'var(--accent)', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { label: 'Sentiment Score', value: '92%', change: '+3% improvement', gradient: 'linear-gradient(135deg,var(--azure),var(--accent))', spark: [82,84,86,88,90,92], sparkColor: 'var(--azure)', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
]
