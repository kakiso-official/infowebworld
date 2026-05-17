import type { Metadata } from 'next'
import InfoPageShell, { IPSection, IPCardGrid, IPCard } from '../components/InfoPageShell'
import { faqNode, articleNode, itemListNode, howToNode, BASE_URL } from '../components/seo-schema'

const URL = `${BASE_URL}/category-guides`

const sectors = [
  { name: 'AI & Machine Learning', url: `${BASE_URL}/ai-ml`, description: 'Chatbots, AI writing, image and video generation, AI code assistants, data analysis, AI agent frameworks, applied AI across verticals.' },
  { name: 'Software & SaaS', url: `${BASE_URL}/software-saas`, description: 'Sales CRM, marketing tools, HR and payroll, developer tools, project management, communication, cybersecurity, analytics, ERP.' },
  { name: 'IT Services & Agencies', url: `${BASE_URL}/it-services-agencies`, description: 'Custom software development, web and mobile app agencies, SEO firms, cloud migration, UX/UI studios, cybersecurity consultants, AI/ML dev shops.' },
  { name: 'Startups & Innovation', url: `${BASE_URL}/startups-innovation`, description: 'FinTech, HealthTech, EdTech, climate tech, AI-native startups, Web3 and blockchain, VCs, accelerators.' },
  { name: 'Local Businesses', url: `${BASE_URL}/local-businesses`, description: 'Restaurants, beauty and spa, home repair, automotive, doctors, pet services, retail, wedding vendors, schools, hospitality.' },
  { name: 'Professional Services', url: `${BASE_URL}/professional-services`, description: 'Law firms, accountants, financial advisors, consulting, engineering firms, architects, real estate, HR consulting, coaching.' },
]

const faqs = [
  {
    q: 'How many category levels does InfoWebWorld use?',
    a: 'Three levels: Sector (L1, the big industry grouping like AI & ML), Category (L2, a specific market inside a sector like AI Chatbots), and Subcategory (L3, a precise niche like Customer Support Chatbots).',
  },
  {
    q: 'How many categories can I list my business in?',
    a: 'One primary subcategory (L3) and up to two secondary subcategories — so buyers find you whether they search broad or narrow.',
  },
  {
    q: 'How do I pick the right category for my business?',
    a: 'Start with how your customers search. If they type "CRM software", go to Sales & CRM. If they type "AI customer support chatbot", go to AI Chatbots. Avoid trendy-but-wrong categories — they get flagged and demoted.',
  },
  {
    q: 'What if my business spans multiple categories?',
    a: 'Use the secondary category slots for overlap. A CRM with AI features lists primarily in Sales CRM, with AI Chatbots as a secondary tag.',
  },
  {
    q: 'How many sectors and categories are on InfoWebWorld?',
    a: 'Six top-level sectors, 80+ Level-2 categories, and 13,000+ Level-3 subcategories across the global directory.',
  },
]

const articleJsonLd = articleNode({
  id: `${URL}#article`,
  headline: 'Category Guides — Picking the Right Sector, Category, and Subcategory',
  description:
    'Complete guide to InfoWebWorld categories: three levels (sector, category, subcategory), six sectors, 80+ categories, 13,000+ subcategories, and how to pick the right placement for your business listing.',
  pageUrl: URL,
  datePublished: '2026-04-21',
  dateModified: '2026-05-17',
  articleSection: 'Guides',
  wordCount: 700,
  about: ['Business categories', 'Industry taxonomy', 'Directory navigation', 'Listing categorization'],
  keywords: ['business category guide', 'sector category subcategory', 'how to categorize business listing', 'industry taxonomy'],
})

const sectorsList = itemListNode(sectors, `${URL}#sectors`, 'The six sectors on InfoWebWorld')

const howToPickJsonLd = howToNode({
  id: `${URL}#how-to-pick`,
  name: 'How to pick the right category for a business listing',
  description: 'Four-step framework for choosing the right sector, category, and subcategory on InfoWebWorld so your listing gets discovered and ranked correctly.',
  totalTime: 'PT10M',
  steps: [
    { name: 'Match how customers search', text: 'Pick the category your customers would actually type into a search bar — not the trendiest label.' },
    { name: 'Avoid overreach', text: 'Picking a trendy but wrong category hurts trust. Listings that do not match their category get flagged and demoted.' },
    { name: 'Use secondary categories for overlap', text: 'Pick one primary L3 subcategory and up to two secondary ones for businesses that span multiple markets.' },
    { name: 'Ask for help if unsure', text: 'Email the team with a two-line description of your business and we will recommend categories.', url: `${BASE_URL}/contact` },
  ],
})

const faqJsonLd = faqNode(faqs, `${URL}#faq`, `${URL}#webpage`)

export const metadata: Metadata = {
  title: 'Category Guides — 6 Sectors · 80+ Categories · 13,000+ Subcategories | InfoWebWorld',
  description:
    'Pick the right business category on InfoWebWorld: 6 sectors (AI & ML, Software & SaaS, IT Services, Startups, Local Businesses, Professional Services), 80+ categories, 13,000+ subcategories. Plus a 4-step how-to for choosing the right placement.',
  keywords: [
    'business category guide',
    'industry taxonomy guide',
    'how to pick category for business listing',
    'sector category subcategory hierarchy',
    'InfoWebWorld categories',
    'directory category structure',
    'AI ML business directory category',
    'SaaS category placement',
    'IT services agency directory',
    'startup directory category',
    'local business directory category',
    'professional services directory',
    'multi-category business listing',
    'best industry categorization framework',
    '13000 subcategories business directory',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Category Guides — InfoWebWorld',
    description: '6 sectors · 80+ categories · 13,000+ subcategories. How to pick the right one.',
    url: URL,
    siteName: 'InfoWebWorld',
    type: 'article',
    locale: 'en_US',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'InfoWebWorld Category Guides' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Category Guides — InfoWebWorld',
    description: '6 sectors · 80+ categories · 13,000+ subcategories.',
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
}

export default function CategoryGuidesPage() {
  return (
    <InfoPageShell
      kicker="Guides"
      title="Category Guides"
      subtitle="A clear map of every sector and category on InfoWebWorld — what each covers, who it's for, and how to pick the right one for your listing."
      webPageType={['WebPage', 'CollectionPage', 'FAQPage']}
      about={[
        'Business categorization',
        'Industry taxonomy',
        'Directory navigation',
        'Multi-level category hierarchy',
        'Listing placement strategy',
      ]}
      mentions={['AI & ML sector', 'Software & SaaS sector', 'IT Services sector', 'Startups sector', 'Local Businesses', 'Professional Services']}
      schemaKeywords={['category guide', 'sector', 'subcategory', 'business directory taxonomy']}
      extraGraph={[articleJsonLd, sectorsList, howToPickJsonLd, faqJsonLd]}
      cta={{
        label: 'Browse All Categories',
        href: '/categories',
      }}
    >
      <IPSection title="How Categories Work">
        <p>
          InfoWebWorld has three category levels:
        </p>
        <ul>
          <li><strong>Sector (L1)</strong> — the big industry grouping. Example: AI & ML.</li>
          <li><strong>Category (L2)</strong> — a specific market inside a sector. Example: AI Chatbots.</li>
          <li><strong>Subcategory (L3)</strong> — a precise niche inside a category. Example: Customer Support Chatbots.</li>
        </ul>
        <p>
          You can list your business under <strong>one primary</strong> subcategory
          (L3) and up to <strong>two secondary</strong> ones — so buyers find you
          whether they search broad or narrow.
        </p>
      </IPSection>

      <IPSection title="The Six Sectors">
        <IPCardGrid cols={2}>
          <IPCard icon="🤖" title="AI & ML">
            Chatbots, AI writing tools, image & video generation, AI code assistants,
            data analysis, AI agent frameworks, and applied AI across verticals.
            <br /><a href="/ai-ml" className="ip-card-link">Browse AI & ML →</a>
          </IPCard>
          <IPCard icon="💻" title="Software & SaaS">
            Sales CRM, marketing tools, HR & payroll software, developer tools, project
            management, communication, cybersecurity, analytics, and ERP.
            <br /><a href="/software-saas" className="ip-card-link">Browse Software & SaaS →</a>
          </IPCard>
          <IPCard icon="🧑‍💻" title="IT Services & Agencies">
            Custom software development, web & mobile app agencies, SEO firms, cloud
            migration, UX/UI studios, cybersecurity consultants, and AI/ML dev shops.
            <br /><a href="/it-services-agencies" className="ip-card-link">Browse IT Services →</a>
          </IPCard>
          <IPCard icon="🚀" title="Startups & Innovation">
            FinTech, HealthTech, EdTech, climate tech, AI-native startups, Web3 &
            blockchain, VCs, accelerators, and the people funding the future.
            <br /><a href="/startups-innovation" className="ip-card-link">Browse Startups →</a>
          </IPCard>
          <IPCard icon="🏪" title="Local Businesses">
            Restaurants, beauty & spa, home repair, automotive, doctors, pet services,
            retail, wedding vendors, schools, and hospitality.
            <br /><a href="/local-businesses" className="ip-card-link">Browse Local Businesses →</a>
          </IPCard>
          <IPCard icon="💼" title="Professional Services">
            Law firms, accountants, financial advisors, consulting, engineering firms,
            architects, real estate, HR consulting, coaching, and corporate training.
            <br /><a href="/professional-services" className="ip-card-link">Browse Professional Services →</a>
          </IPCard>
        </IPCardGrid>
      </IPSection>

      <IPSection title="How to Pick the Right Category">
        <ol>
          <li><strong>Start with how your customers search.</strong> If they&apos;d type &quot;CRM software&quot;, go to Sales & CRM. If they&apos;d type &quot;AI customer support chatbot&quot;, go to AI Chatbots.</li>
          <li><strong>Don&apos;t overreach.</strong> Picking a trendy-but-wrong category hurts trust. Listings that don&apos;t match their category get flagged and demoted.</li>
          <li><strong>Use secondary categories for overlap.</strong> A CRM with AI features lists primarily in Sales CRM, with AI Chatbots as a secondary tag.</li>
          <li><strong>Still unsure?</strong> <a href="/contact">Email us</a> with a 2-line description of your business and we&apos;ll recommend categories.</li>
        </ol>
      </IPSection>

      <IPSection title="Industry-Specific Guides (Coming Soon)">
        <p>
          We&apos;re rolling out per-category written guides over the next few months.
          Each guide will cover: what the category includes, common alternatives, how
          buyers compare, and what makes a great listing. Subscribe to our
          <a href="/blog"> blog </a> or follow us on LinkedIn to get notified as each
          guide lands.
        </p>
      </IPSection>

      <IPSection title="Category Selection FAQ">
        {faqs.map(({ q, a }) => (
          <details key={q} className="ip-faq">
            <summary>{q}</summary>
            <div className="ip-faq-body">{a}</div>
          </details>
        ))}
      </IPSection>
    </InfoPageShell>
  )
}
