export const LISTING = {
  name: 'CloudGuard Technologies',
  tagline: 'Enterprise-grade cloud security & compliance platform',
  category: 'Cybersecurity',
  url: 'cloudguard.io',
  logo: 'CG',
  color: '#6C72F1',
  status: 'active',
  plan: 'Pro',
  verified: true,
  featured: true,
  rating: 4.8,
  reviews: 127,
  createdAt: 'Jan 12, 2025',
  lastUpdated: 'Mar 14, 2026',
  slug: 'cloudguard-technologies',
}

export const SERVICES = [
  { name: 'Cloud Security Audits', price: '$5,000', status: 'active' },
  { name: 'Zero-Trust Implementation', price: '$15,000', status: 'active' },
  { name: 'Compliance Consulting (SOC 2)', price: '$8,000', status: 'active' },
  { name: 'Penetration Testing', price: '$3,500', status: 'active' },
  { name: '24/7 Security Monitoring', price: '$2,000/mo', status: 'active' },
  { name: 'Incident Response', price: 'Custom', status: 'draft' },
]

export const HEALTH_ITEMS = [
  { label: 'Business Info', done: true },
  { label: 'Logo & Photos', done: true },
  { label: 'Contact Details', done: true },
  { label: 'Business Hours', done: true },
  { label: 'Services Listed', done: true },
  { label: 'Description (300+ chars)', done: true },
  { label: 'Social Links', done: false },
  { label: 'Video/Demo', done: false },
]

export const ACTIVITY = [
  { text: 'Listing appeared in 42 search results', time: '2 hours ago', icon: 'search', color: 'var(--accent)' },
  { text: 'New review from Michael Chen (5★)', time: '5 hours ago', icon: 'star', color: 'var(--amber)' },
  { text: 'Lead captured from listing page', time: '8 hours ago', icon: 'lead', color: 'var(--emerald)' },
  { text: 'Listing viewed 24 times today', time: '12 hours ago', icon: 'eye', color: 'var(--azure)' },
  { text: 'Featured badge renewed', time: '1 day ago', icon: 'badge', color: 'var(--plum)' },
]

export const QUICK_STATS = [
  { label: 'Profile Views', value: '12,847', change: '+18%', up: true, color: 'var(--accent)', icon: 'eye' },
  { label: 'Search Impressions', value: '5,230', change: '+12%', up: true, color: 'var(--emerald)', icon: 'search' },
  { label: 'Click-through Rate', value: '8.4%', change: '+2.1%', up: true, color: 'var(--azure)', icon: 'click' },
  { label: 'Leads Generated', value: '384', change: '+24%', up: true, color: 'var(--amber)', icon: 'leads' },
]

export const PERFORMANCE_DATA = [
  { m: 'Profile Views', tw: '3,214', lw: '2,847', ch: '+12.9%', up: true },
  { m: 'Search Impressions', tw: '1,340', lw: '1,120', ch: '+19.6%', up: true },
  { m: 'Click-throughs', tw: '567', lw: '498', ch: '+13.9%', up: true },
  { m: 'Leads Captured', tw: '28', lw: '22', ch: '+27.3%', up: true },
  { m: 'Review Responses', tw: '8', lw: '5', ch: '+60%', up: true },
  { m: 'Bounce Rate', tw: '24.3%', lw: '28.1%', ch: '-3.8%', up: true },
]

export const TABS = [
  { key: 'overview', label: 'Overview', icon: 'overview' },
  { key: 'edit', label: 'Edit Listing', icon: 'edit' },
  { key: 'services', label: 'Services & Pricing', icon: 'services' },
  { key: 'seo', label: 'SEO & Visibility', icon: 'seo' },
  { key: 'media', label: 'Media', icon: 'media' },
]

export const VISIBILITY_OPTIONS = [
  { key: 'searchable', label: 'Searchable', desc: 'Your listing appears in search results and category pages' },
  { key: 'featured', label: 'Featured Listing', desc: 'Show as featured in your category (requires Pro plan)' },
  { key: 'acceptLeads', label: 'Accept Leads', desc: 'Allow visitors to submit inquiry forms from your listing' },
  { key: 'showReviews', label: 'Show Reviews', desc: 'Display customer reviews on your public listing page' },
  { key: 'showPricing', label: 'Show Pricing', desc: 'Display service pricing on your listing page' },
]
