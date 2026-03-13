import { Link } from 'react-router-dom'

const headlines = [
  { text: 'AI-powered review tools see 200% adoption surge across SMBs', id: 'ai-review-tools' },
  { text: 'InfoWebWorld launches enhanced comparison engine for SaaS products', id: 'comparison-engine' },
  { text: 'Healthcare directories report 45% increase in patient-driven searches', id: 'healthcare-search' },
  { text: 'Remote work platforms dominate Q1 2026 business software rankings', id: 'remote-work-rankings' },
  { text: 'New compliance standards reshape legal tech marketplace', id: 'legal-compliance' },
  { text: 'Restaurant discovery apps evolve with AI-driven personalization', id: 'restaurant-ai' },
  { text: 'Enterprise cloud migration spending hits $180B globally', id: 'cloud-migration' },
  { text: 'EdTech platforms partner with Fortune 500 for workforce training', id: 'edtech-partnerships' },
]

export default function NewsTicker() {
  // Duplicate items for seamless infinite scroll
  const items = [...headlines, ...headlines]

  return (
    <div className="nws-ticker">
      <div className="nws-ticker-label">
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="12" r="5" /></svg>
        BREAKING
      </div>
      <div className="nws-ticker-track">
        {items.map((h, i) => (
          <span className="nws-ticker-item" key={i}>
            <Link to={`/news-article?id=${h.id}`}>{h.text}</Link>
          </span>
        ))}
      </div>
    </div>
  )
}
