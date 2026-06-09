import type { Metadata } from 'next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BlogListing from './BlogListing'
import { getPublishedPosts } from '@/lib/blog'

/* Blog index — published posts from the DB. force-dynamic (edge-cached ~1h via
   middleware) so posts written in the admin panel appear live, no redeploy. */
export const dynamic = 'force-dynamic'

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

export default async function BlogPage() {
  /* Strip the markdown body for the listing payload — cards only need meta. */
  const posts = (await getPublishedPosts()).map(({ body, ...rest }) => rest)

  return (
    <>
      <Navbar />
      <BlogListing posts={posts} />
      <Footer />
    </>
  )
}
