import type { Metadata } from 'next'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import BlogListing from './BlogListing'

export const metadata: Metadata = {
  title: 'Blog — Business Insights & Tips | InfoWebWorld',
  description: 'Read the latest business insights, SEO tips, and industry news from InfoWebWorld.',
}

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <BlogListing />
      <Footer />
    </>
  )
}
