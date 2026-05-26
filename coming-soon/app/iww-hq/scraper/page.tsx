import ScraperShell from './ScraperShell'

export const metadata = { robots: 'noindex, nofollow' }
export const dynamic = 'force-dynamic'

export default function ScraperPage() {
  return <ScraperShell />
}
