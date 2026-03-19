export default function ProfileSectionTabs({ activeSection, setActiveSection }) {
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
      {[
        { key: 'basic', label: 'Basic Info' },
        { key: 'details', label: 'Business Details' },
        { key: 'media', label: 'Photos & Media' },
        { key: 'hours', label: 'Hours & Contact' },
      ].map(t => (
        <button key={t.key} className={`db-btn ${activeSection === t.key ? 'db-btn--primary' : 'db-btn--outline'}`} onClick={() => setActiveSection(t.key)}>
          {t.label}
        </button>
      ))}
    </div>
  )
}
