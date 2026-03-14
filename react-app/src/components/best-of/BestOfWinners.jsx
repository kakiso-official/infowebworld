import { Link } from 'react-router-dom'

const StarSvg = () => <svg viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>

const categories = [
  {
    name: 'Technology & SaaS', color: 'var(--accent)', bg: 'rgba(108,114,241,.08)',
    icon: <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>,
    winners: [
      { rank: 1, biz: 'cloudsync-pro', name: 'CloudSync Pro', rating: '4.9', reviews: 412, sat: 94, badge: 'Winner' },
      { rank: 2, biz: 'novabyte-analytics', name: 'NovaByte Analytics', rating: '4.8', reviews: 189, sat: 91 },
      { rank: 3, biz: 'datavault-analytics', name: 'DataVault Analytics', rating: '4.7', reviews: 398, sat: 88 },
    ]
  },
  {
    name: 'Restaurants & Food', color: 'var(--coral)', bg: 'rgba(239,107,74,.08)',
    icon: <><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></>,
    winners: [
      { rank: 1, biz: 'the-garden-table', name: 'The Garden Table', rating: '4.9', reviews: 287, sat: 96, badge: 'Winner' },
      { rank: 2, biz: 'freshbite-catering', name: 'FreshBite Catering', rating: '4.8', reviews: 431, sat: 92 },
      { rank: 3, biz: 'harvest-kitchen', name: 'Harvest Kitchen', rating: '4.7', reviews: 156, sat: 89 },
    ]
  },
  {
    name: 'Healthcare & Wellness', color: 'var(--emerald)', bg: 'rgba(47,174,106,.08)',
    icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>,
    winners: [
      { rank: 1, biz: 'mindbridge-wellness', name: 'MindBridge Wellness', rating: '4.8', reviews: 198, sat: 93, badge: 'Winner' },
      { rank: 2, biz: 'evergreen-fitness', name: 'Evergreen Fitness Co', rating: '4.8', reviews: 234, sat: 90 },
      { rank: 3, biz: 'telewell-health', name: 'TeleWell Health', rating: '4.7', reviews: 167, sat: 87 },
    ]
  },
  {
    name: 'Real Estate & Property', color: 'var(--azure)', bg: 'rgba(59,130,246,.08)',
    icon: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    winners: [
      { rank: 1, biz: 'urbannest-realty', name: 'UrbanNest Realty', rating: '4.7', reviews: 345, sat: 91, badge: 'Winner' },
      { rank: 2, biz: 'skyline-properties', name: 'Skyline Properties', rating: '4.6', reviews: 213, sat: 88 },
      { rank: 3, biz: 'premier-estates', name: 'Premier Estates', rating: '4.5', reviews: 178, sat: 85 },
    ]
  },
  {
    name: 'Education & Training', color: 'var(--teal)', bg: 'rgba(20,184,166,.08)',
    icon: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>,
    winners: [
      { rank: 1, biz: 'brightpath-academy', name: 'BrightPath Academy', rating: '4.8', reviews: 523, sat: 95, badge: 'Winner' },
      { rank: 2, biz: 'skillforge-online', name: 'SkillForge Online', rating: '4.7', reviews: 267, sat: 91 },
      { rank: 3, biz: 'learnhub-pro', name: 'LearnHub Pro', rating: '4.6', reviews: 198, sat: 87 },
    ]
  },
  {
    name: 'Home Services', color: 'var(--amber)', bg: 'rgba(245,158,11,.08)',
    icon: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>,
    winners: [
      { rank: 1, biz: 'precisionfix-plumbing', name: 'PrecisionFix Plumbing', rating: '4.9', reviews: 178, sat: 97, badge: 'Winner' },
      { rank: 2, biz: 'sparkclean-pro', name: 'SparkClean Pro', rating: '4.7', reviews: 321, sat: 92 },
      { rank: 3, biz: 'primefix-home', name: 'PrimeFix Home Services', rating: '4.6', reviews: 467, sat: 89 },
    ]
  },
  {
    name: 'Legal & Financial', color: 'var(--plum)', bg: 'rgba(139,92,246,.08)',
    icon: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3"/></>,
    winners: [
      { rank: 1, biz: 'summit-legal', name: 'Summit Legal Group', rating: '4.7', reviews: 312, sat: 92, badge: 'Winner' },
      { rank: 2, biz: 'truenorth-accounting', name: 'TrueNorth Accounting', rating: '4.8', reviews: 274, sat: 90 },
      { rank: 3, biz: 'legalshield-partners', name: 'LegalShield Partners', rating: '4.7', reviews: 541, sat: 88 },
    ]
  },
  {
    name: 'Marketing & Creative', color: 'var(--rose)', bg: 'rgba(236,72,153,.08)',
    icon: <><path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></>,
    winners: [
      { rank: 1, biz: 'creativeforge-studio', name: 'CreativeForge Studio', rating: '4.7', reviews: 267, sat: 90, badge: 'Winner' },
      { rank: 2, biz: 'pixel-code-studio', name: 'Pixel & Code Studio', rating: '4.7', reviews: 198, sat: 88 },
      { rank: 3, biz: 'brightwave-media', name: 'BrightWave Media', rating: '4.5', reviews: 145, sat: 85 },
    ]
  },
]

export default function BestOfWinners() {
  return (
    <div className="bo-winners">
      {categories.map((cat, ci) => (
        <div className="bo-cat-block fade-in" key={ci}>
          <div className="bo-cat-header">
            <div className="bo-cat-icon" style={{ background: cat.bg }}>
              <svg viewBox="0 0 24 24" stroke={cat.color} fill="none" strokeWidth="1.5">{cat.icon}</svg>
            </div>
            <h3 className="bo-cat-name">{cat.name}</h3>
            <Link to={`/category?cat=${cat.name.toLowerCase().replace(/\s.*/, '')}`} className="bo-cat-viewall">View all <svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></Link>
          </div>
          <div className="bo-cat-winners">
            {cat.winners.map(w => (
              <Link to={`/listing?biz=${w.biz}`} className={`bo-winner-card${w.badge ? ' bo-winner-card--gold' : ''}`} key={w.rank}>
                {w.badge && <div className="bo-winner-badge"><svg viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>{w.badge}</div>}
                <div className="bo-winner-rank" style={{ color: cat.color }}>#{w.rank}</div>
                <div className="bo-winner-name">{w.name}</div>
                <div className="bo-winner-stats">
                  <div className="bo-winner-rating"><StarSvg /><span>{w.rating}</span></div>
                  <span className="bo-winner-reviews">{w.reviews} reviews</span>
                </div>
                <div className="bo-winner-sat">
                  <div className="bo-winner-sat-bar">
                    <div className="bo-winner-sat-fill" style={{ width: `${w.sat}%`, background: cat.color }}></div>
                  </div>
                  <span className="bo-winner-sat-num">{w.sat}% satisfaction</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
