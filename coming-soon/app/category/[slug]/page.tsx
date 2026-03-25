import { Suspense } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import CategoryPage from '../CategoryPage'

export default async function CategoryDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return (
    <>
      <Navbar />
      <Suspense><CategoryPage slug={slug} /></Suspense>
      <Footer />
    </>
  )
}
