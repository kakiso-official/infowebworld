import type { Metadata } from 'next'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Countdown from './components/Countdown'
import BusinessCTA from './components/BusinessCTA'
import Footer from './components/Footer'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'InfoWebWorld',
  url: 'https://infowebworld.com',
  description: 'The global business discovery platform. Search, compare, and review businesses across 80+ industries in 12 countries.',
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'InfoWebWorld',
  url: 'https://infowebworld.com',
  logo: 'https://infowebworld.com/logo/infowebworldlogo-logoforlightbackgrounds.png',
  description: 'Global business discovery platform with verified reviews, dofollow backlinks, and lead generation across 80+ industries.',
  foundingDate: '2026',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Brain Stream Australia Pty Ltd',
    addressLocality: 'Parramatta',
    addressRegion: 'NSW',
    postalCode: '2150',
    addressCountry: 'AU',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'iww@brainstream.com.au',
    url: 'https://infowebworld.com/contact',
  },
  sameAs: [
    'https://x.com/infowebworld_x',
    'https://www.linkedin.com/company/infowebworld/',
    'https://www.instagram.com/infowebworld',
  ],
}

export const metadata: Metadata = {
  alternates: { canonical: 'https://infowebworld.com' },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is InfoWebWorld?',
      acceptedAnswer: { '@type': 'Answer', text: 'InfoWebWorld is a global business discovery platform where users can search, compare, and review businesses across 80+ industries in 12+ countries. It helps professionals find the best solutions through verified reviews and detailed company profiles.' },
    },
    {
      '@type': 'Question',
      name: 'How does InfoWebWorld work?',
      acceptedAnswer: { '@type': 'Answer', text: 'Users can search businesses by category or location, compare companies side by side, read verified reviews, and connect directly with service providers. Every listing includes satisfaction scores, feature breakdowns, and real user feedback.' },
    },
    {
      '@type': 'Question',
      name: 'Is it free to list a business on InfoWebWorld?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes, businesses can submit listings for free on InfoWebWorld. Free listings include a company profile, category placement, and a dofollow backlink. Optional premium plans are available for enhanced visibility and lead generation features.' },
    },
    {
      '@type': 'Question',
      name: 'What industries does InfoWebWorld cover?',
      acceptedAnswer: { '@type': 'Answer', text: 'InfoWebWorld covers 80+ industries including SaaS, marketing, cybersecurity, cloud computing, HR tech, fintech, e-commerce, healthcare, legal services, education technology, and many more. New categories are added regularly based on market demand.' },
    },
    {
      '@type': 'Question',
      name: 'How can I add my business to InfoWebWorld?',
      acceptedAnswer: { '@type': 'Answer', text: 'Visit the Get Listed page to submit your business details. Fill in your company information, choose a category, and submit for review. Once approved, your listing goes live with a verified badge and dofollow backlink.' },
    },
  ],
}

export default function Home() {
  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Navbar />

      {/* 1. Hero — Email capture + visual showcase */}
      <Hero />

      {/* 2. Countdown timer — urgency */}
      <Countdown />

      {/* 3. Business CTA */}
      <BusinessCTA />

      {/* 4. Footer */}
      <Footer />
    </>
  )
}
