import type { Metadata } from 'next'
import Navbar from '../components/Navbar'
import Footer from '../../components/Footer'
import PlansPage from './PlansPage'

export const metadata: Metadata = {
  title: 'Plans & Pricing - Lifetime & Yearly Plans | InfoWebWorld',
  description:
    'Compare InfoWebWorld pricing plans — Lifetime and Yearly. Full feature comparison, transparent pricing, and everything you need to grow your business on the global business directory.',
  alternates: { canonical: 'https://www.infowebworld.com/business/plans' },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.infowebworld.com' },
    { '@type': 'ListItem', position: 2, name: 'Plans & Pricing' },
  ],
}

const APPLICABLE_COUNTRIES = [
  'US', 'CA', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE',
  'GB', 'IE', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'PT', 'SE', 'NO', 'DK', 'FI', 'CH', 'AT', 'PL', 'CZ', 'GR', 'RO',
  'AU', 'NZ', 'IN', 'SG', 'JP', 'KR', 'HK', 'TW', 'MY', 'TH', 'ID', 'PH', 'VN', 'CN', 'BD', 'PK',
  'AE', 'SA', 'IL', 'QA', 'KW', 'TR',
  'ZA', 'NG', 'EG', 'KE',
]

const merchantReturnPolicy = {
  '@type': 'MerchantReturnPolicy',
  applicableCountry: APPLICABLE_COUNTRIES,
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
  merchantReturnDays: 14,
  returnMethod: 'https://schema.org/ReturnByMail',
  returnFees: 'https://schema.org/FreeReturn',
  merchantReturnLink: 'https://www.infowebworld.com/terms#payments',
}

const productJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'InfoWebWorld Business Listing',
  image: 'https://www.infowebworld.com/og-image.png',
  description: 'Premium business listing on the global business directory with verified reviews, dofollow backlinks, analytics, and lead generation.',
  brand: { '@type': 'Brand', name: 'InfoWebWorld' },
  offers: [
    {
      '@type': 'Offer',
      name: 'Elite Lifetime Founding Business Plan',
      price: '239',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://www.infowebworld.com/business/plans',
      description: 'One-time payment for permanent access to all features. No renewals, no price increases.',
      hasMerchantReturnPolicy: merchantReturnPolicy,
    },
    {
      '@type': 'Offer',
      name: 'Early Adopter Yearly Plan',
      price: '99',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://www.infowebworld.com/business/plans',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '99',
        priceCurrency: 'USD',
        billingDuration: { '@type': 'QuantitativeValue', value: 1, unitCode: 'ANN' },
      },
      description: 'Annual subscription with the same full feature set, renewed yearly.',
      hasMerchantReturnPolicy: merchantReturnPolicy,
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
