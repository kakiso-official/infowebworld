import { Suspense } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import BlogReader from '../post/BlogReader'

export default async function BlogPostRoute({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return (
    <>
      <Navbar />
      <Suspense><BlogReader slug={slug} /></Suspense>
      <Footer />
    </>
  )
}
