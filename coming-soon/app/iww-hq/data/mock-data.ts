export type SubmissionStatus = 'pending' | 'confirmed' | 'paid'
export type Submission = {
  id: string; companyName: string; contactName: string; email: string
  phone: string; category: string; country: string; city: string
  tagline: string; plan: 'founding' | 'early-adopter' | 'standard'
  status: SubmissionStatus; submittedAt: string
}

export type WaitlistEntry = {
  id: string; email: string; source: 'hero' | 'footer' | 'cta'
  subscribedAt: string
}

const d = (ago: number) => new Date(Date.now() - ago * 864e5).toISOString().slice(0, 10)

export const submissions: Submission[] = [
  { id: 'S001', companyName: 'Cloudify Solutions', contactName: 'Sarah Chen', email: 'sarah@cloudify.io', phone: '+1 415-555-0101', category: 'Technology & SaaS', country: 'United States', city: 'San Francisco', tagline: 'Cloud infrastructure simplified', plan: 'founding', status: 'paid', submittedAt: d(1) },
  { id: 'S002', companyName: 'Evergreen Dental', contactName: 'Dr. Raj Patel', email: 'raj@evergreendental.com', phone: '+91 98765-43210', category: 'Healthcare & Wellness', country: 'India', city: 'Mumbai', tagline: 'Modern dentistry for modern families', plan: 'founding', status: 'paid', submittedAt: d(1) },
  { id: 'S003', companyName: 'LegalEdge Partners', contactName: 'Emma Walsh', email: 'emma@legaledge.co.uk', phone: '+44 20-7946-0958', category: 'Legal & Financial', country: 'United Kingdom', city: 'London', tagline: 'Corporate law made accessible', plan: 'founding', status: 'confirmed', submittedAt: d(2) },
  { id: 'S004', companyName: 'Pixel & Co Studio', contactName: 'Marco Rossi', email: 'marco@pixelco.design', phone: '+49 30-1234567', category: 'Design & Architecture', country: 'Germany', city: 'Berlin', tagline: 'Design that tells your story', plan: 'founding', status: 'paid', submittedAt: d(2) },
  { id: 'S005', companyName: 'FreshBite Kitchen', contactName: 'Aisha Mahmoud', email: 'aisha@freshbite.ae', phone: '+971 50-123-4567', category: 'Restaurants & Food', country: 'UAE', city: 'Dubai', tagline: 'Farm-to-table dining experience', plan: 'founding', status: 'paid', submittedAt: d(3) },
  { id: 'S006', companyName: 'MapleLeaf Realty', contactName: 'Jake Thompson', email: 'jake@mapleleaf.ca', phone: '+1 604-555-0199', category: 'Real Estate', country: 'Canada', city: 'Vancouver', tagline: 'Your dream home awaits', plan: 'founding', status: 'confirmed', submittedAt: d(3) },
  { id: 'S007', companyName: 'CodeMentor Academy', contactName: 'Lisa Park', email: 'lisa@codementor.edu', phone: '+65 8123-4567', category: 'Education & Training', country: 'Singapore', city: 'Singapore', tagline: 'Learn to code from the best', plan: 'founding', status: 'paid', submittedAt: d(4) },
  { id: 'S008', companyName: 'Spark Creative Agency', contactName: 'Tom Dubois', email: 'tom@sparkcreative.fr', phone: '+33 1-23-45-67-89', category: 'Marketing & Creative', country: 'France', city: 'Paris', tagline: 'Campaigns that ignite growth', plan: 'founding', status: 'paid', submittedAt: d(5) },
  { id: 'S009', companyName: 'GreenThumb Landscaping', contactName: 'Mike Sullivan', email: 'mike@greenthumb.com.au', phone: '+61 2-9876-5432', category: 'Home Services', country: 'Australia', city: 'Sydney', tagline: 'Transform your outdoor space', plan: 'founding', status: 'pending', submittedAt: d(5) },
  { id: 'S010', companyName: 'Luxe Beauty Lounge', contactName: 'Nina Popov', email: 'nina@luxebeauty.nl', phone: '+31 20-123-4567', category: 'Beauty & Spa', country: 'Netherlands', city: 'Amsterdam', tagline: 'Where beauty meets luxury', plan: 'founding', status: 'paid', submittedAt: d(6) },
  { id: 'S011', companyName: 'IronForge Fitness', contactName: 'Chris Blake', email: 'chris@ironforge.fit', phone: '+1 212-555-0177', category: 'Fitness & Sports', country: 'United States', city: 'New York', tagline: 'Strength through discipline', plan: 'founding', status: 'paid', submittedAt: d(7) },
  { id: 'S012', companyName: 'Wanderlust Travel Co', contactName: 'Priya Nair', email: 'priya@wanderlust.in', phone: '+91 98765-12345', category: 'Travel & Hospitality', country: 'India', city: 'Goa', tagline: 'Curated travel experiences', plan: 'founding', status: 'confirmed', submittedAt: d(8) },
  { id: 'S013', companyName: 'TechNova Inc', contactName: 'David Kim', email: 'david@technova.io', phone: '+1 650-555-0133', category: 'Technology & SaaS', country: 'United States', city: 'Austin', tagline: 'AI-powered business tools', plan: 'founding', status: 'paid', submittedAt: d(9) },
  { id: 'S014', companyName: 'AutoPrime Motors', contactName: 'Hans Weber', email: 'hans@autoprime.de', phone: '+49 89-9876543', category: 'Automotive', country: 'Germany', city: 'Munich', tagline: 'Premium pre-owned vehicles', plan: 'founding', status: 'paid', submittedAt: d(10) },
  { id: 'S015', companyName: 'EcoWave Foundation', contactName: 'Maya Chen', email: 'maya@ecowave.org', phone: '+1 310-555-0144', category: 'Non-Profit & NGO', country: 'United States', city: 'Los Angeles', tagline: 'Clean oceans for all', plan: 'founding', status: 'paid', submittedAt: d(12) },
]

export const waitlist: WaitlistEntry[] = Array.from({ length: 35 }, (_, i) => ({
  id: `W${String(i + 1).padStart(3, '0')}`,
  email: [`alex${i}@gmail.com`, `team@startup${i}.io`, `hello@business${i}.com`, `founder${i}@company.co`][i % 4],
  source: (['hero', 'footer', 'cta'] as const)[i % 3],
  subscribedAt: d(Math.floor(i * 0.8)),
}))

export const analytics = {
  dailyVisitors: [142, 187, 163, 221, 195, 248, 312],
  dayLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  pageViews: { home: 1847, getListed: 623, pricing: 412, compare: 289 },
  devices: { desktop: 58, mobile: 36, tablet: 6 },
  referrers: [
    { source: 'Google Search', visits: 486 },
    { source: 'Twitter / X', visits: 312 },
    { source: 'LinkedIn', visits: 198 },
    { source: 'Product Hunt', visits: 167 },
    { source: 'Direct', visits: 305 },
  ],
  funnel: { visits: 1847, formStarted: 623, formCompleted: 187, paid: 12 },
}

export function getStats() {
  const total = submissions.length
  const paid = submissions.filter(s => s.status === 'paid').length
  const revenue = paid * 240
  const spotsLeft = 200 - total
  const waitlistTotal = waitlist.length
  const byCat = submissions.reduce((a, s) => { a[s.category] = (a[s.category] || 0) + 1; return a }, {} as Record<string, number>)
  const byCountry = submissions.reduce((a, s) => { a[s.country] = (a[s.country] || 0) + 1; return a }, {} as Record<string, number>)
  const byPlan = submissions.reduce((a, s) => { a[s.plan] = (a[s.plan] || 0) + 1; return a }, {} as Record<string, number>)
  return { total, paid, revenue, spotsLeft, waitlistTotal, byCat, byCountry, byPlan }
}
