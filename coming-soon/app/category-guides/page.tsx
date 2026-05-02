import type { Metadata } from 'next'
import InfoPageShell, { IPSection, IPCardGrid, IPCard } from '../components/InfoPageShell'

export const metadata: Metadata = {
  title: 'Category Guides — InfoWebWorld',
  description: 'Pick the right category for your business listing, understand what each sector includes, and get the most out of InfoWebWorld discovery.',
  alternates: { canonical: 'https://infowebworld.com/category-guides' },
}

export default function CategoryGuidesPage() {
  return (
    <InfoPageShell
      kicker="Guides"
      title="Category Guides"
      subtitle="A clear map of every sector and category on InfoWebWorld — what each covers, who it's for, and how to pick the right one for your listing."
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
          <li><strong>Start with how your customers search.</strong> If they'd type "CRM software", go to Sales & CRM. If they'd type "AI customer support chatbot", go to AI Chatbots.</li>
          <li><strong>Don't overreach.</strong> Picking a trendy-but-wrong category hurts trust. Listings that don't match their category get flagged and demoted.</li>
          <li><strong>Use secondary categories for overlap.</strong> A CRM with AI features lists primarily in Sales CRM, with AI Chatbots as a secondary tag.</li>
          <li><strong>Still unsure?</strong> <a href="/contact">Email us</a> with a 2-line description of your business and we'll recommend categories.</li>
        </ol>
      </IPSection>

      <IPSection title="Industry-Specific Guides (Coming Soon)">
        <p>
          We're rolling out per-category written guides over the next few months.
          Each guide will cover: what the category includes, common alternatives, how
          buyers compare, and what makes a great listing. Subscribe to our
          <a href="/blog"> blog </a> or follow us on LinkedIn to get notified as each
          guide lands.
        </p>
      </IPSection>
    </InfoPageShell>
  )
}
