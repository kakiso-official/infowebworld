import { TABS } from '../../../data/dashboard/listingData'

const TAB_ICONS = {
  overview: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
  edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></>,
  services: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>,
  seo: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  media: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
}

export default function ListingTabs({ activeTab, setActiveTab }) {
  return (
    <div className="dbl-tabs">
      {TABS.map(t => (
        <button key={t.key} className={`dbl-tab${activeTab === t.key ? ' active' : ''}`} onClick={() => setActiveTab(t.key)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{TAB_ICONS[t.icon]}</svg>
          {t.label}
        </button>
      ))}
    </div>
  )
}
