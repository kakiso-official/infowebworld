import type { Metadata } from 'next'
import InfoPageShell, { IPSection, IPCardGrid, IPCard } from '../../components/InfoPageShell'

export const metadata: Metadata = {
  title: 'Our Team — InfoWebWorld',
  description: 'Meet the team building InfoWebWorld — a small, focused group of operators, designers, and engineers shaping the future of business discovery.',
  alternates: { canonical: 'https://infowebworld.com/team' },
}

export default function TeamPage() {
  return (
    <InfoPageShell
      kicker="People"
      title="The Team Building InfoWebWorld"
      subtitle="A small, remote-first team of operators, designers, and engineers — obsessed with making business discovery actually work for buyers and sellers."
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
          We're distributed across Australia, India, and the EU — working asynchronously
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
          We're actively looking for operators and makers who want to build the next
          generation of business discovery tooling. If that's you, we'd love to hear
          from you — even if we don't have a posted role matching your skills.
        </p>
        <ul>
          <li><strong>Staff Engineer (Next.js / TypeScript / MySQL)</strong> — remote, full-time.</li>
          <li><strong>Growth Lead (SEO + AI search)</strong> — remote, full-time.</li>
          <li><strong>Content Editor (category guides + business writing)</strong> — part-time, contract.</li>
          <li><strong>Design Engineer (UI systems + brand)</strong> — remote, full-time.</li>
        </ul>
        <p>
          Send a short note + links to your work via the <a href="/contact">contact page</a>
          with <em>[HIRING]</em> in the subject line. No CV templates, please — just show us something you're proud of.
        </p>
      </IPSection>

      <IPSection title="Team Alumni">
        <p>
          Great companies are also defined by the people who passed through them. See our
          <a href="/team/past"> past team →</a>
        </p>
      </IPSection>
    </InfoPageShell>
  )
}
