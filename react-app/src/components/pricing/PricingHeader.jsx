import { Link } from 'react-router-dom'

export default function PricingHeader({ annual, setAnnual }) {
  return (
    <div className="container">
      <nav className="pr-breadcrumb">
        <Link to="/">Home</Link>
        <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
        <span>Pricing</span>
      </nav>
      <div className="pr-header">
        <div className="pr-header-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          Simple & Transparent
        </div>
        <h1 className="pr-header-title">Plans that grow with your business</h1>
        <p className="pr-header-sub">No hidden fees. No surprises. Start free and upgrade when you're ready.</p>

        {/* Billing toggle */}
        <div className="pr-toggle-wrap">
          <span className={`pr-toggle-label${!annual ? ' active' : ''}`}>Monthly</span>
          <button className={`pr-toggle${annual ? ' pr-toggle--on' : ''}`} onClick={() => setAnnual(!annual)} aria-label="Toggle billing">
            <span className="pr-toggle-knob"></span>
          </button>
          <span className={`pr-toggle-label${annual ? ' active' : ''}`}>Annual</span>
          <span className="pr-toggle-save">Save 20%</span>
        </div>
      </div>
    </div>
  )
}
