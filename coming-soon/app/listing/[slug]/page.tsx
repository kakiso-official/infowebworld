import { Suspense } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ListingDetailPage from '../ListingDetailPage'

export default async function ListingRoute({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return (
    <>
      <Navbar />
      <Suspense><ListingDetailPage slug={slug} /></Suspense>
      <Footer />
    </>
  )
}
