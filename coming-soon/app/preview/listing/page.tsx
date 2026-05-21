import type { Metadata } from 'next'
import PreviewClient from './PreviewClient'
import './preview-banner.css'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Preview · InfoWebWorld',
  robots: { index: false, follow: false },
}

/**
 * /preview/listing — live in-progress preview for the dashboard listing form.
 *
 * Reads `iww_listing_preview` from localStorage and renders the real
 * ListingDetailPage (products) or CompanyDetailPage (companies). All
 * state is per-browser, so no auth check is needed — visitors who haven't
 * started a listing just see the empty state.
 *
 * Intentionally placed OUTSIDE app/dashboard so the page gets the site
 * Navbar/Footer chrome (matching the real /company/[slug] surface) instead
 * of the dashboard shell sidebar.
 */
export default function PreviewListingPage() {
  return <PreviewClient />
}
