import type { Metadata } from 'next'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import PlansPage from './PlansPage'

export const metadata: Metadata = {
  title: 'Plans & Pricing — Lifetime & Yearly Plans | InfoWebWorld',
  description:
    'Compare InfoWebWorld pricing plans — Lifetime and Yearly. Full feature comparison, transparent pricing, and everything you need to grow your business on the global discovery platform.',
  alternates: {
    canonical: 'https://infowebworld.com/plans',
    languages: {
      'en-IN': 'https://infowebworld.com/in/plans',
      'en-US': 'https://infowebworld.com/us/plans',
      'en-GB': 'https://infowebworld.com/uk/plans',
      'en-CA': 'https://infowebworld.com/ca/plans',
      'en-AU': 'https://infowebworld.com/au/plans',
      'x-default': 'https://infowebworld.com/plans',
    },
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://infowebworld.com' },
    { '@type': 'ListItem', position: 2, name: 'Plans & Pricing' },
  ],
}

const productJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'InfoWebWorld Business Listing',
  description: 'Premium business listing on the global discovery platform with verified reviews, dofollow backlinks, analytics, and lead generation.',
  brand: { '@type': 'Brand', name: 'InfoWebWorld' },
  offers: [
    {
      '@type': 'Offer',
      name: 'Elite Lifetime Founding Business Plan',
      price: '239',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://infowebworld.com/plans',
      description: 'One-time payment for permanent access to all features. No renewals, no price increases.',
    },
    {
      '@type': 'Offer',
      name: 'Early Adopter Yearly Plan',
      price: '99',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://infowebworld.com/plans',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '99',
        priceCurrency: 'USD',
        billingDuration: { '@type': 'QuantitativeValue', value: 1, unitCode: 'ANN' },
      },
      description: 'Annual subscription with the same full feature set, renewed yearly.',
    },
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Navbar />
      <PlansPage />
      <Footer />
    </>
  )
}
