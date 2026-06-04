import type { Metadata } from 'next'
import { Suspense } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WriteReviewClient from './WriteReviewClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Write a Verified Review — InfoWebWorld',
  description:
    'Share your honest experience with a company. Speak your review and we will turn it into a clean English review automatically — or write it yourself. Verified, moderated, never paid.',
  alternates: { canonical: 'https://www.infowebworld.com/write-review' },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    title: 'Write a Verified Review — InfoWebWorld',
    description: 'Speak your review and we will turn it into a clean English review automatically — or write it yourself.',
    type: 'website',
    siteName: 'InfoWebWorld',
  },
}

export default function WriteReviewPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={null}>
        <WriteReviewClient />
      </Suspense>
      <Footer />
    </>
  )
}
