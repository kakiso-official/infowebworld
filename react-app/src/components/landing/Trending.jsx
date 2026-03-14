import { Link } from 'react-router-dom'

const StarSvg = () => <svg viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>

const items = [
  { rank:1, biz:'cloudsync-pro', name:'CloudSync Pro', cat:'Technology', rating:'4.9', votes:847, change:'+32%', iconBg:'rgba(108,114,241,.1)', color:'var(--accent)', medal:'gold', icon:<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /> },
  { rank:2, biz:'the-garden-table', name:'The Garden Table', cat:'Restaurant', rating:'4.9', votes:723, change:'+28%', iconBg:'rgba(239,107,74,.1)', color:'var(--coral)', medal:'silver', icon:<><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" /></> },
  { rank:3, biz:'mindbridge-wellness', name:'MindBridge Wellness', cat:'Healthcare', rating:'4.8', votes:691, change:'+24%', iconBg:'rgba(139,92,246,.1)', color:'var(--plum)', medal:'bronze', icon:<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /> },
  { rank:4, biz:'brightpath-academy', name:'BrightPath Academy', cat:'Education', rating:'4.8', votes:612, change:'+19%', iconBg:'rgba(20,184,166,.1)', color:'var(--teal)', icon:<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></> },
  { rank:5, biz:'urbannest-realty', name:'UrbanNest Realty', cat:'Real Estate', rating:'4.7', votes:578, change:'+17%', iconBg:'rgba(59,130,246,.1)', color:'var(--azure)', icon:<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></> },
  { rank:6, biz:'legalshield-partners', name:'LegalShield Partners', cat:'Legal Services', rating:'4.7', votes:541, change:'+15%', iconBg:'rgba(108,114,241,.1)', color:'var(--accent)', icon:<><circle cx="12" cy="12" r="10" /><path d="m16 10-5.12 5.12-2.88-2.88" /></> },
  { rank:7, biz:'creativeforge-studio', name:'CreativeForge Studio', cat:'Marketing', rating:'4.7', votes:503, change:'+12%', iconBg:'rgba(236,72,153,.1)', color:'var(--rose)', icon:<><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" /></> },
  { rank:8, biz:'primefix-home-services', name:'PrimeFix Home Services', cat:'Home Services', rating:'4.6', votes:467, change:'+10%', iconBg:'rgba(245,158,11,.1)', color:'var(--amber)', icon:<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /> },
  { rank:9, biz:'freshbite-catering', name:'FreshBite Catering', cat:'Food & Events', rating:'4.6', votes:431, change:'+8%', iconBg:'rgba(47,174,106,.1)', color:'var(--emerald)', icon:<><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" /></> },
  { rank:10, biz:'datavault-analytics', name:'DataVault Analytics', cat:'Technology', rating:'4.5', votes:398, change:'+6%', iconBg:'rgba(59,130,246,.1)', color:'var(--azure)', icon:<><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></> },
]

const maxVotes = items[0].votes

const MedalIcon = ({ type }) => {
  const colors = { gold: '#E5A100', silver: '#9CA3AF', bronze: '#D97706' }
  return (
    <svg viewBox="0 0 24 24" className="podium-medal-svg" fill={colors[type]} stroke={colors[type]} strokeWidth="1">
      <circle cx="12" cy="14" r="7" opacity=".15" />
      <circle cx="12" cy="14" r="5" fill="none" strokeWidth="1.5" />
      <path d="M8 2l4 6 4-6" fill="none" strokeWidth="1.5" />
    </svg>
  )
}

export default function Trending() {
  // Podium order: silver(#2), gold(#1), bronze(#3)
  const podium = [items[1], items[0], items[2]]
  const leaderboard = items.slice(3)

  return (
    <section className="section trending fade-section">
      <div className="container">
        <div className="section-header-row">
          <div className="section-header">
            <div className="section-label">Popular</div>
            <h2 className="section-title">Trending This Week</h2>
            <p className="section-subtitle">The most searched and highest-voted businesses across every category.</p>
          </div>
          <Link to="/best-of" className="view-all-link">View Full Rankings <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg></Link>
        </div>
        <div className="trend-stats-bar">
          <div className="trend-stat-pill"><svg viewBox="0 0 24 24" stroke="var(--accent)" fill="none" strokeWidth="1.5"><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" /></svg><span className="trend-stat-num">2,847</span><span className="trend-stat-text">votes this week</span></div>
          <div className="trend-stat-divider"></div>
          <div className="trend-stat-pill"><svg viewBox="0 0 24 24" stroke="var(--emerald)" fill="none" strokeWidth="1.5"><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></svg><span className="trend-stat-num">+18%</span><span className="trend-stat-text">avg growth</span></div>
          <div className="trend-stat-divider"></div>
          <div className="trend-stat-pill"><svg viewBox="0 0 24 24" stroke="var(--azure)" fill="none" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg><span className="trend-stat-num">Live</span><span className="trend-stat-text">updated daily</span></div>
        </div>

        {/* ── Podium: Top 3 ── */}
        <div className="podium">
          {podium.map((t, i) => {
            const isGold = t.medal === 'gold'
            return (
              <Link to={`/listing?biz=${t.biz}`} className={`podium-card podium-card--${t.medal}`} key={t.rank}>
                <div className="podium-medal"><MedalIcon type={t.medal} /><span className="podium-rank">#{t.rank}</span></div>
                <div className="podium-icon" style={{background:t.iconBg}}><svg viewBox="0 0 24 24" stroke={t.color} fill="none" strokeWidth="1.5">{t.icon}</svg></div>
                <div className="podium-name">{t.name}</div>
                <div className="podium-cat">{t.cat}</div>
                <div className="podium-rating"><StarSvg /><span className="podium-rating-num">{t.rating}</span><span className="podium-rating-count">({t.votes})</span></div>
                <div className="podium-change">{t.change}</div>
                {isGold && <div className="podium-crown">
                  <svg viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)" strokeWidth="1"><path d="M2 4l3 12h14l3-12-6 7-4-9-4 9-6-7z" opacity=".2" /><path d="M2 4l3 12h14l3-12-6 7-4-9-4 9-6-7z" fill="none" strokeWidth="1.5" /></svg>
                </div>}
              </Link>
            )
          })}
        </div>

        {/* ── Runners-up: 4-10 ── */}
        <div className="runners-grid">
          {leaderboard.map(t => (
            <Link to={`/listing?biz=${t.biz}`} className="runner-card" key={t.rank}>
              <div className="runner-rank-badge">#{t.rank}</div>
              <div className="runner-icon" style={{background:t.iconBg}}>
                <svg viewBox="0 0 24 24" stroke={t.color} fill="none" strokeWidth="1.5">{t.icon}</svg>
              </div>
              <div className="runner-name">{t.name}</div>
              <div className="runner-cat">{t.cat}</div>
              <div className="runner-stats">
                <div className="runner-rating"><StarSvg /><span>{t.rating}</span></div>
                <div className="runner-votes">{t.votes} votes</div>
              </div>
              <div className="runner-bar-wrap">
                <div className="runner-bar" style={{width: `${(t.votes / maxVotes) * 100}%`}}></div>
              </div>
              <div className="runner-change">{t.change} this week</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
