import type { Metadata } from 'next'
import InfoPageShell, { IPSection, IPCardGrid, IPCard } from '../components/InfoPageShell'
import { faqNode, articleNode, itemListNode, BASE_URL, ID_ORG } from '../components/seo-schema'

const URL = `${BASE_URL}/team`

const openRoles = [
  { name: 'Staff Engineer (Next.js / TypeScript / MySQL)', description: 'Remote, full-time. Build the next generation of business discovery tooling end-to-end.' },
  { name: 'Growth Lead (SEO + AI search)', description: 'Remote, full-time. Own the org-wide growth function across SEO and AEO.' },
  { name: 'Content Editor (category guides + business writing)', description: 'Part-time, contract. Write category guides and editorial across 13,000+ subcategories.' },
  { name: 'Design Engineer (UI systems + brand)', description: 'Remote, full-time. Own the UI system, design tokens, and brand expression.' },
]

const faqs = [
  {
    q: 'How big is the InfoWebWorld team?',
    a: 'Small and high-output — a remote-first team across Australia, India, and the EU. Everyone ships, everyone talks to users, everyone owns outcomes end-to-end. No layers of approval, no 30-person meetings.',
  },
  {
    q: 'How does InfoWebWorld work as a remote-first team?',
    a: 'Distributed across Australia, India, and the EU with asynchronous workdays and weekly syncs. We value craftsmanship over clock hours, and evidence over opinion.',
  },
  {
    q: 'Is InfoWebWorld hiring?',
    a: 'Yes — actively. Open roles include Staff Engineer (Next.js / TypeScript / MySQL), Growth Lead (SEO + AI search), Content Editor, and Design Engineer. We also accept speculative applications from operators and makers whose work impresses us.',
  },
  {
    q: 'How do I apply for a role at InfoWebWorld?',
    a: 'Send a short note plus links to your work via the contact page with [HIRING] in the subject line. No CV templates please — just show us something you are proud of.',
  },
  {
    q: 'What tech stack does InfoWebWorld use?',
    a: 'Next.js 16 on Vercel, TypeScript, MySQL on cPanel, and a design-led, performance-obsessed culture shipping daily.',
  },
]

const articleJsonLd = articleNode({
  id: `${URL}#article`,
  headline: 'The Team Building InfoWebWorld',
  description:
    'Small, remote-first team of operators, designers, and engineers building the global business discovery platform. Distributed across Australia, India, and the EU.',
  pageUrl: URL,
  datePublished: '2026-04-21',
  dateModified: '2026-05-17',
  articleSection: 'About',
  wordCount: 550,
  about: ['InfoWebWorld team', 'Remote-first team', 'Engineering culture', 'Open roles'],
  keywords: ['InfoWebWorld team', 'remote first team', 'engineering culture', 'open roles directory'],
})

const rolesList = itemListNode(openRoles, `${URL}#open-roles`, 'Open roles at InfoWebWorld')

const jobPostings = openRoles.map(role => ({
  '@type': 'JobPosting',
  '@id': `${URL}#${role.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  title: role.name,
  description: role.description,
  hiringOrganization: { '@id': ID_ORG },
  employmentType: role.name.includes('Part-time') ? 'PART_TIME' : 'FULL_TIME',
  jobLocationType: 'TELECOMMUTE',
  applicantLocationRequirements: {
    '@type': 'Country',
    name: ['Australia', 'India', 'European Union'],
  },
  datePosted: '2026-04-21',
  validThrough: '2026-12-31',
  directApply: false,
  applicationContact: { '@type': 'ContactPoint', url: `${BASE_URL}/contact` },
}))

const faqJsonLd = faqNode(faqs, `${URL}#faq`, `${URL}#webpage`)

export const metadata: Metadata = {
  title: 'The Team - InfoWebWorld · Remote-First Across AU, IN, EU',
  description:
    'Meet the small, remote-first team building InfoWebWorld — operators, designers, and engineers shipping daily across Australia, India, and the EU. Open roles in engineering, growth, design, and content.',
  keywords: [
    'InfoWebWorld team',
    'business directory team',
    'remote first startup team',
    'directory engineering jobs',
    'Next.js TypeScript MySQL engineer job',
    'SEO growth lead role',
    'design engineer role startup',
    'content editor directory',
    'Australian SaaS team',
    'remote first SaaS jobs',
    'AEO growth lead role',
    'startup hiring 2026',
    'distributed team Australia India EU',
    'how to apply InfoWebWorld',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'The Team Building InfoWebWorld',
    description: 'Small, remote-first team across AU/IN/EU. Open roles in eng, growth, design, content.',
    url: URL,
    siteName: 'InfoWebWorld',
    type: 'website',
    locale: 'en_US',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'The InfoWebWorld Team' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The InfoWebWorld Team',
    description: 'Small, remote-first team. Open roles in eng, growth, design, content.',
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
}

export default function TeamPage() {
  return (
    <InfoPageShell
      kicker="People"
      title="The Team Building InfoWebWorld"
      subtitle="A small, remote-first team of operators, designers, and engineers — obsessed with making business discovery actually work for buyers and sellers."
      webPageType={['WebPage', 'AboutPage', 'FAQPage']}
      about={[
        'InfoWebWorld team',
        'Remote-first team',
        'Engineering culture',
        'Open roles',
        'Distributed team',
      ]}
      mentions={['Next.js', 'TypeScript', 'MySQL', 'Vercel', 'Asynchronous work', 'Australia', 'India', 'European Union']}
      schemaKeywords={['team', 'hiring', 'remote first', 'engineering culture']}
      extraGraph={[articleJsonLd, rolesList, ...jobPostings, faqJsonLd]}
      cta={{
        label: "We're Hiring",
        href: '/contact',
        description: 'Roles open across engineering, design, content, and growth. Send us your work.',
      }}
    >
      <IPSection title="How We Work">
        <p>
          We are a <strong>small team with an outsized output</strong>. Everyone ships,
          everyone talks to users, and everyone owns outcomes end-to-end. No layers of
          approval, no 30-person meetings, no performative busy-work.
        </p>
        <p>
          We&apos;re distributed across Australia, India, and the EU — working asynchronously
          with weekly syncs. We value craftsmanship over clock hours and evidence over
          opinion.
        </p>
      </IPSection>

      <IPSection title="Leadership">
        <IPCardGrid cols={2}>
          <IPCard icon="🎯" title="Founders' Office">
            Product direction, SEO strategy, and long-range partnerships. Reachable via
            the contact form for serious conversations.
          </IPCard>
          <IPCard icon="⚙️" title="Engineering & Design">
            Next.js, MySQL, Vercel — built for speed and scale. Design-led, performance-
            obsessed, shipped daily.
          </IPCard>
        </IPCardGrid>
      </IPSection>

      <IPSection title="Open Roles">
        <p>
          We&apos;re actively looking for operators and makers who want to build the next
          generation of business discovery tooling. If that&apos;s you, we&apos;d love to hear
          from you — even if we don&apos;t have a posted role matching your skills.
        </p>
        <ul>
          <li><strong>Staff Engineer (Next.js / TypeScript / MySQL)</strong> — remote, full-time.</li>
          <li><strong>Growth Lead (SEO + AI search)</strong> — remote, full-time.</li>
          <li><strong>Content Editor (category guides + business writing)</strong> — part-time, contract.</li>
          <li><strong>Design Engineer (UI systems + brand)</strong> — remote, full-time.</li>
        </ul>
        <p>
          Send a short note + links to your work via the <a href="/contact">contact page</a>
          with <em>[HIRING]</em> in the subject line. No CV templates, please — just show us something you&apos;re proud of.
        </p>
      </IPSection>

      <IPSection title="Team Alumni">
        <p>
          Great companies are also defined by the people who passed through them. See our
          <a href="/team/past"> past team →</a>
        </p>
      </IPSection>

      <IPSection title="Working at InfoWebWorld FAQ">
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
