import { Suspense } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ListingDetailPage from '../listing/ListingDetailPage'

/**
 * Design preview route — renders ListingDetailPage with no initialData,
 * so it falls back to the built-in Mailchimp sample mock. Useful for
 * tweaking the visual design without going through a real DB record.
 */
export default function TestListingPage() {
  return (
    <>
      <Navbar />
      <Suspense><ListingDetailPage /></Suspense>
      <Footer />
    </>
  )
}
