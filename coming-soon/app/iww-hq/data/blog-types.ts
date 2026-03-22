export type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  coverImage: string
  author: string
  category: string
  tags: string[]
  status: 'draft' | 'published'
  featured: boolean
  readTime: number
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
    ogImage: string
    canonicalUrl: string
    noIndex: boolean
  }
}

export const blogCategories = [
  'Business Tips', 'Industry News', 'SEO & Marketing', 'Startup Guide',
  'Product Updates', 'Case Studies', 'How-To Guides', 'Trends & Insights',
]

/* Curated cover images — click to pick */
export const stockCovers = [
  { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', label: 'Business' },
  { url: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80', label: 'Tech' },
  { url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80', label: 'Startup' },
  { url: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80', label: 'SEO' },
  { url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', label: 'Team' },
  { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', label: 'Analytics' },
  { url: 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?w=800&q=80', label: 'Marketing' },
  { url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', label: 'Office' },
  { url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80', label: 'Growth' },
  { url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80', label: 'Digital' },
  { url: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80', label: 'News' },
  { url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80', label: 'Global' },
]
