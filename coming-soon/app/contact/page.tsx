import type { Metadata } from 'next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ContactPage from './ContactPage'

export const metadata: Metadata = {
  title: 'Contact InfoWebWorld — Business Inquiries & Support',
  description: 'Get in touch with the InfoWebWorld team. We respond within 24 hours — questions, partnerships, business inquiries, feedback, or technical support.',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://infowebworld.com' },
    { '@type': 'ListItem', position: 2, name: 'Contact' },
  ],
}

const contactJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'InfoWebWorld',
  url: 'https://infowebworld.com',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'iww@brainstream.com.au',
    url: 'https://infowebworld.com/contact',
    availableLanguage: 'English',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Brain Stream Australia Pty Ltd',
    addressLocality: 'Parramatta',
    addressRegion: 'NSW',
    postalCode: '2150',
    addressCountry: 'AU',
  },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <Navbar />
      <ContactPage />
      <Footer />
    </>
  )
}
