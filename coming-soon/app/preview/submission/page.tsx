import type { Metadata } from 'next'
import AdminSubmissionPreview from './AdminSubmissionPreview'
import '../listing/preview-banner.css'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Submission preview · InfoWebWorld',
  robots: { index: false, follow: false },
}

/**
 * /preview/submission — admin-only, full-fidelity preview of a single
 * submission, embedded as an <iframe> inside /iww-hq/submissions.
 *
 * It receives the selected RealSubmission from the parent admin window via
 * postMessage (same-origin), maps it to the exact `initialData` shape the
 * real ListingDetailPage / CompanyDetailPage consume, and renders it with the
 * public Navbar/Footer chrome. The admin therefore sees precisely how the
 * live /listing/[slug] or /profile/[slug] page will look AFTER approval —
 * including pending rows that aren't yet public.
 *
 * Why a separate route + iframe (not an inline panel):
 *   - The listing page toggles classes on document.body, owns a sticky header
 *     bound to the site navbar height, and sets html/body overflow. Its own
 *     document keeps all of that from corrupting the admin's two-pane layout.
 *   - The iframe width is what the page reads as the viewport, so the admin's
 *     Desktop/Tablet/Mobile toggle exercises the page's real responsive
 *     breakpoints.
 *
 * Lives OUTSIDE /iww-hq on purpose: that segment is wrapped in the admin
 * shell sidebar; this needs the public site chrome instead. No data is
 * fetched here and nothing is persisted — the parent pushes the row from
 * memory.
 */
export default function SubmissionPreviewPage() {
  return <AdminSubmissionPreview />
}
