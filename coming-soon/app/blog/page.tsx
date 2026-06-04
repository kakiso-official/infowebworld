import type { Metadata } from 'next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BlogListing from './BlogListing'
import { getPublishedPosts } from '@/lib/blog'

/* Static blog index — reads the markdown posts in content/blog/ at build time.
   New posts go live on the next deploy (git push). */
export const metadata: Metadata = {
  title: 'Blog - Business Insights, Guides & Comparisons | InfoWebWorld',
  description: 'Guides, comparisons and original data on choosing software, agencies and professionals across 80+ industries — from the InfoWebWorld team.',
  alternates: { canonical: 'https://www.infowebworld.com/blog' },
  openGraph: {
    title: 'InfoWebWorld Blog',
    description: 'Guides, comparisons and original data on choosing software, agencies and professionals.',
    url: 'https://www.infowebworld.com/blog',
    type: 'website',
  },
}

export default function BlogPage() {
  /* Strip the markdown body for the listing payload — cards only need meta. */
  const posts = getPublishedPosts().map(({ body, ...rest }) => rest)

  return (
    <>
      <Navbar />
      <BlogListing posts={posts} />
      <Footer />
    </>
  )
}
