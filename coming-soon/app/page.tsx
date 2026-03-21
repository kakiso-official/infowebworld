import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Countdown from './components/Countdown'
import Stats from './components/Stats'
import Benefits from './components/Benefits'
import EarlyBirdTiers from './components/EarlyBirdTiers'
import Pricing from './components/Pricing'
import HowItWorks from './components/HowItWorks'
import Comparison from './components/Comparison'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'InfoWebWorld',
  url: 'https://infowebworld.com',
  description: 'The global business discovery platform. Search, compare, and review businesses across 80+ industries in 12 countries.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://infowebworld.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'InfoWebWorld',
  url: 'https://infowebworld.com',
  logo: 'https://infowebworld.com/logo/infowebworld-logo.png',
  description: 'Global business discovery platform with verified reviews, dofollow backlinks, and lead generation across 80+ industries.',
  sameAs: [
    'https://twitter.com/infowebworld',
    'https://linkedin.com/company/infowebworld',
    'https://instagram.com/infowebworld',
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

      <Navbar />

      {/* 1. Hero — Email capture + visual showcase */}
      <Hero />

      {/* 2. Countdown timer — urgency */}
      <Countdown />

      {/* 3. Social proof stats */}
      <Stats />

      {/* 4. Benefits — what listed companies get */}
      <Benefits />

      {/* 5. Early bird tiers — FOMO mechanism */}
      <EarlyBirdTiers />

      {/* 6. Pricing plans */}
      <Pricing />

      {/* 7. How it works — simple steps */}
      <HowItWorks />

      {/* 8. Comparison table */}
      <Comparison />

      {/* 9. Final CTA — repeat email capture */}
      <FinalCTA />

      {/* 10. Footer */}
      <Footer />
    </>
  )
}
