import type { Metadata } from 'next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PlansPage from './PlansPage'

export const metadata: Metadata = {
  title: 'Plans & Pricing — InfoWebWorld',
  description:
    'Compare InfoWebWorld pricing plans — Lifetime and Yearly. Full feature comparison, transparent pricing, and everything you need to grow your business on the global discovery platform.',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <PlansPage />
      <Footer />
    </>
  )
}
