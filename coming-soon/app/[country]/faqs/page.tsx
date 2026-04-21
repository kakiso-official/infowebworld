import type { Metadata } from 'next'
import InfoPageShell, { IPSection } from '../../components/InfoPageShell'

export const metadata: Metadata = {
  title: 'FAQs — InfoWebWorld',
  description: 'Frequently asked questions about InfoWebWorld — listings, plans, reviews, SEO backlinks, analytics, and more.',
  alternates: { canonical: 'https://infowebworld.com/faqs' },
}

const faqs = [
  {
    section: 'Listings',
    items: [
      { q: 'How do I submit my business?', a: 'Go to the Get Listed page, pick a plan (Free, Starter, Yearly, or Lifetime), and fill out the listing form. Paid listings are reviewed within 48 hours; free listings within 3–5 business days.' },
      { q: 'Can I list multiple businesses on one account?', a: 'Yes. You can submit as many listings as you want from a single account. Each listing is tied to its own plan. Agencies managing multiple clients can apply to our Partner Program for bulk tools.' },
      { q: 'Can I edit my listing after it goes live?', a: 'Yes. Log in to your dashboard at any time to edit content, swap media, add FAQs, update pricing, or change categories. Edits go live immediately for paid plans; free plans require re-review.' },
      { q: 'What happens if my listing is rejected?', a: "We'll email you with the reason. Most rejections are about content-guideline violations (duplicate listings, fake websites, misleading categories). You can edit and resubmit for free." },
    ],
  },
  {
    section: 'Plans & Billing',
    items: [
      { q: "What's the difference between Starter, Yearly, and Lifetime?", a: 'Starter is a $49 one-time payment with core features. Yearly is $99/year with the full feature set and renews annually. Lifetime is $239 one-time with the full feature set forever — no renewals.' },
      { q: 'Do you offer refunds?', a: 'Yes — within 14 days of initial purchase for Yearly plans, and within 14 days for Starter and Lifetime one-time plans. Renewals are non-refundable. Contact support to request.' },
      { q: 'How do I upgrade my plan?', a: 'From your dashboard, click the Upgrade chip next to your plan name, or go to /business/plans and pick your new tier. Upgrades are prorated; downgrades apply at the next renewal.' },
      { q: 'What payment methods do you accept?', a: 'PayPal (covers Visa, Mastercard, Amex, PayPal balance). More methods are coming soon.' },
    ],
  },
  {
    section: 'Reviews',
    items: [
      { q: 'How do I collect reviews?', a: 'Paid plans include a Review Invitation Tool — send customers a direct review link via email or SMS. You can also embed a review widget on your own site.' },
      { q: 'Can I remove a bad review?', a: "Only if it violates our Content Guidelines (fake, paid, defamatory, off-topic, etc.). Flag the review from your dashboard; our moderation team investigates within 72 hours. Legitimate negative reviews stay — but you can always respond publicly." },
      { q: 'Can I pay for better placement?', a: 'Only in the sense that Yearly and Lifetime plans include premium placement in their features. We do not sell ranking by the click or by the day. Ranking is based on plan tier + engagement + review quality.' },
    ],
  },
  {
    section: 'SEO & Backlinks',
    items: [
      { q: 'Are your backlinks dofollow?', a: 'Yes. Every paid listing (Starter, Yearly, Lifetime) includes a permanent dofollow backlink to your website. Free listings get a nofollow link.' },
      { q: "What's InfoWebWorld's domain authority?", a: "We're a new product (launched 2026) with an established parent company. DA/DR grows as we scale — watch this space." },
      { q: 'Will I rank higher on Google because of this?', a: "Our backlinks are one of many ranking factors. Quality listings with good content, real reviews, and steady engagement tend to rank well. We don't promise specific ranking outcomes — nobody honest does." },
    ],
  },
  {
    section: 'Account & Data',
    items: [
      { q: 'How do I sign in with Google?', a: 'Click "Continue with Google" on any sign-in button. A popup opens, you pick your account, and you\'re in. No password needed.' },
      { q: 'How do I delete my account?', a: "Contact support via the Contact page with [DELETE] in the subject line. We'll confirm identity, delete personal data within 30 days, and retain only what's legally required." },
      { q: 'Can I export my listing data?', a: 'Yes — use the dashboard export tool, or contact support for a full CSV of all your submissions, reviews, and analytics.' },
    ],
  },
]

export default function FAQsPage() {
  return (
    <InfoPageShell
      kicker="Support"
      title="Frequently Asked Questions"
      subtitle="The questions we hear most — answered directly. If you can't find what you're looking for, drop us a line."
      cta={{
        label: 'Ask a Question',
        href: '/contact',
      }}
    >
      {faqs.map(group => (
        <IPSection key={group.section} title={group.section}>
          {group.items.map(item => (
            <details key={item.q} className="ip-faq">
              <summary>{item.q}</summary>
              <div className="ip-faq-body">{item.a}</div>
            </details>
          ))}
        </IPSection>
      ))}
    </InfoPageShell>
  )
}
