import type { Metadata } from 'next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchNews, type NewsArticle, type NewsCategory } from '../../lib/news'
import NewsHomepage from './NewsHomepage'

/* ─────────────────────────────────────────────────────────────
   /news — Times-of-India-style news aggregator.

   Server fetches 8 GNews.io categories in parallel, each cached for
   1 hour. Layout: hero strip (1 lead + 4 side stories) + category
   sections in a dense multi-column grid.
   ───────────────────────────────────────────────────────────── */

export const revalidate = 3600   // 1 hour at the route level too

export const metadata: Metadata = {
  title: 'News \u2014 InfoWebWorld',
  description:
    'Latest world, business, technology, sports, entertainment, science and health headlines from leading international publishers. Updated hourly.',
  alternates: { canonical: 'https://infowebworld.com/news' },
  robots: { index: false, follow: false },
}

const CATEGORY_PLAN: { key: NewsCategory; label: string; max: number }[] = [
  { key: 'general',       label: 'Top Stories',    max: 14 },
  { key: 'business',      label: 'Business',       max: 12 },
  { key: 'technology',    label: 'Technology',     max: 12 },
  { key: 'entertainment', label: 'Entertainment',  max: 12 },
  { key: 'sports',        label: 'Sports',         max: 12 },
  { key: 'world',         label: 'World',          max: 12 },
  { key: 'science',       label: 'Science',        max: 10 },
  { key: 'health',        label: 'Health',         max: 10 },
]

export default async function NewsRoute() {
  const sets = await Promise.all(
    CATEGORY_PLAN.map(c => fetchNews(c.key, c.max))
  )

  const sections: { key: NewsCategory; label: string; articles: NewsArticle[] }[] =
    CATEGORY_PLAN.map((c, i) => ({ key: c.key, label: c.label, articles: sets[i] }))

  // Free RSS — never needs setup. If every section is empty it means
  // every publisher is unreachable (network issue) and we surface a
  // brief notice; in normal operation this is always false.
  const hasAnyData = sections.some(s => s.articles.length > 0)
  const setupNeeded = !hasAnyData

  return (
    <>
      <Navbar />
      <NewsHomepage sections={sections} setupNeeded={setupNeeded} />
      <Footer />
    </>
  )
}
