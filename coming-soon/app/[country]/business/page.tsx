import type { Metadata } from 'next'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import GetListedLanding from './GetListedLanding'

export const metadata: Metadata = {
  title: 'Get Listed — Submit Your Business | InfoWebWorld',
  description:
    'List your business on InfoWebWorld and lock in founding pricing. Get dofollow backlinks, verified reviews, and leads across 80+ industries.',
  alternates: {
    canonical: 'https://infowebworld.com/business',
    languages: {
      'en-IN': 'https://infowebworld.com/in/business',
      'en-US': 'https://infowebworld.com/us/business',
      'en-GB': 'https://infowebworld.com/uk/business',
      'en-CA': 'https://infowebworld.com/ca/business',
      'en-AU': 'https://infowebworld.com/au/business',
      'x-default': 'https://infowebworld.com/business',
    },
  },
  openGraph: {
    title: 'Get Listed on InfoWebWorld — Pre-Launch Business Listing',
    description:
      'Submit your business before launch. Founding member spots are limited — lock in lifetime pricing today.',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://infowebworld.com' },
    { '@type': 'ListItem', position: 2, name: 'Get Listed' },
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does it cost to list my business on InfoWebWorld?',
      acceptedAnswer: { '@type': 'Answer', text: 'InfoWebWorld offers a free basic listing. Paid plans start at $49 one-time (Starter), $99/year (Early Adopter), or $239 one-time (Elite Lifetime). Founding member pricing is available during pre-launch.' },
    },
    {
      '@type': 'Question',
      name: 'Do I get a dofollow backlink with my listing?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Every listing on InfoWebWorld includes a permanent dofollow backlink to your website, which helps improve your domain authority and search engine rankings.' },
    },
    {
      '@type': 'Question',
      name: 'How do verified reviews work on InfoWebWorld?',
      acceptedAnswer: { '@type': 'Answer', text: 'InfoWebWorld verifies reviews through email confirmation and usage validation. Verified reviews carry a badge and contribute to your business trust score, helping potential customers make informed decisions.' },
    },
    {
      '@type': 'Question',
      name: 'What industries can list on InfoWebWorld?',
      acceptedAnswer: { '@type': 'Answer', text: 'InfoWebWorld covers 80+ industries including SaaS, AI, marketing, IT services, fintech, healthcare, e-commerce, and more. New categories are added regularly to support emerging sectors.' },
    },
    {
      '@type': 'Question',
      name: 'How long does it take for my listing to go live?',
      acceptedAnswer: { '@type': 'Answer', text: 'After submission, listings are reviewed by our team within 24-48 hours. Once approved, your listing goes live with a verified badge, dofollow backlink, and full profile page.' },
    },
  ],
}

export default function GetListedPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />
      <GetListedLanding />
      <Footer />
    </>
  )
}
