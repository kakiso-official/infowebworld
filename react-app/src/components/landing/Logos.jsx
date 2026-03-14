const logos = [
  { name: 'Hilton', icon: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /> },
  { name: 'Shopify', icon: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></> },
  { name: 'Mayo Clinic', icon: <><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></> },
  { name: 'Deloitte', icon: <><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></> },
  { name: 'Harvard', icon: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></> },
  { name: 'Keller Williams', icon: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></> },
  { name: 'Accenture', icon: <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></> },
  { name: 'Salesforce', icon: <><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></> },
]

export default function Logos() {
  // Duplicate logos for seamless infinite scroll
  const track = [...logos, ...logos]

  return (
    <section className="logos">
      <div className="logos-header">
        <div className="logos-line"></div>
        <span className="logos-label">
          <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          Trusted by industry leaders
        </span>
        <div className="logos-line"></div>
      </div>
      <div className="logos-marquee">
        <div className="logos-track">
          {track.map((l, i) => (
            <div className="logo-item" key={i}>
              <span className="logo-icon">
                <svg viewBox="0 0 24 24">{l.icon}</svg>
              </span>
              <span className="logo-text">{l.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
