const payload = {
  companyName: 'Local Flow Test',
  contactName: 'Aadil Local',
  email: 'aadil.local+test@example.com',
  phoneCode: '+91',
  phone: '9000000000',
  website: 'https://localflow.example.com',
  category: 'all-purpose-ai-chat-companions',
  categorySlug: 'all-purpose-ai-chat-companions',
  listingTypeId: 9160,
  listingTypeIds: [9160, 9161],
  tagIds: [1, 26, 37, 44, 75, 98],
  country: 'India',
  state: 'Karnataka',
  city: 'Bangalore',
  tagline: 'End-to-end local test submission with uploaded logo',
  description: 'Submitted by the local test harness to verify DB, admin visibility, and image proxy.',
  plan: 'free',
  logoUrl: '/api/file/logos/69e36d8753ea1_1776512391.png',
  screenshots: [],
  features: ['Fast', 'Secure', 'Scalable'],
  faqs: [],
}

const res = await fetch('http://localhost:3000/api/submissions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
})
const text = await res.text()
console.log('status:', res.status)
console.log('body:', text)
