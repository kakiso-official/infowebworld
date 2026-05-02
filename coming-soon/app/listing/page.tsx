import { Suspense } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ListingDetailPage from './ListingDetailPage'

export default function ListingPage() {
  return (
    <>
      <Navbar />
      <Suspense><ListingDetailPage /></Suspense>
      <Footer />
    </>
  )
}
