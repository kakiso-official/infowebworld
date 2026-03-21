import type { Metadata } from 'next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ListingForm from './ListingForm'

export const metadata: Metadata = {
  title: 'Get Listed — Submit Your Business | InfoWebWorld',
  description:
    'List your business on InfoWebWorld before launch and lock in founding member pricing. Get dofollow backlinks, verified reviews, lead generation, and global exposure across 80+ industries.',
  openGraph: {
    title: 'Get Listed on InfoWebWorld — Pre-Launch Business Listing',
    description:
      'Submit your business before launch. Founding member spots are limited — lock in lifetime pricing today.',
  },
}

export default function GetListedPage() {
  return (
    <>
      <Navbar />
      <ListingForm />
      <Footer />
    </>
  )
}
