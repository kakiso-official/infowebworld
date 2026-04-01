import { Suspense } from 'react'
import type { Metadata } from 'next'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import CategoryPage from '../CategoryPage'
import { getSectorMeta } from '../sector/sector-demo-data'
import { COUNTRY_LABELS } from '../../../config/countries'
import type { CountryCode } from '../../../config/countries'

/* ── Known L1 sector slugs for static metadata detection ── */
const L1_SLUGS = [
  'artificial-intelligence-ml', 'software-saas', 'it-services-agencies',
  'startups-innovation', 'local-business', 'professional-services',
]

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function currentMonthYear() {
  const d = new Date()
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; segments: string[] }>
}): Promise<Metadata> {
  const { country, segments } = await params
  const slug = segments?.[0]
  if (!slug || !L1_SLUGS.includes(slug)) return {}

  const meta = getSectorMeta(slug)
  const countryName = COUNTRY_LABELS[country as CountryCode] || 'India'
  const monthYear = currentMonthYear()
  const title = `${meta.seoTitle} in ${countryName} ${monthYear} | InfoWebWorld`
  const description = `${meta.seoDescription} Compare the best in ${countryName}, ${monthYear}. InfoWebWorld.com`
  const url = `https://infowebworld.com/${country}/category/${slug}`

  return {
    title,
    description,
    keywords: meta.seoKeywords.join(', '),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'InfoWebWorld',
      type: 'website',
      images: [{ url: meta.heroImage, width: 1200, height: 630, alt: meta.seoTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [meta.heroImage],
    },
    robots: { index: false, follow: false },
  }
}

export default async function CategoryDetailRoute({
  params,
}: {
  params: Promise<{ segments: string[] }>
}) {
  const { segments } = await params
  return (
    <>
      <Navbar />
      <Suspense><CategoryPage segments={segments} /></Suspense>
      <Footer />
    </>
  )
}
