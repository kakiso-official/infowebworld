import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../DashboardLayout'

export default function SuccessView({ form, onCreateAnother }) {
  const navigate = useNavigate()

  return (
    <DashboardLayout title="Listing Created" subtitle="Your new listing has been submitted">
      <div className="db-card db-full">
        <div className="db-card-body" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div className="dcl-success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--gray-900)', margin: '16px 0 8px' }}>Listing Submitted Successfully!</h2>
          <p style={{ fontSize: 13, fontWeight: 300, color: 'var(--gray-500)', maxWidth: 420, margin: '0 auto 24px', lineHeight: 1.7 }}>
            Your listing <strong style={{ color: 'var(--gray-700)', fontWeight: 500 }}>{form.name || 'New Listing'}</strong> has been submitted for review.
            Our team will review it within 24-48 hours. You'll receive an email at <strong style={{ color: 'var(--gray-700)', fontWeight: 500 }}>{form.email || 'your email'}</strong> once it goes live.
          </p>
          <div className="dcl-success-plan">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" style={{ width: 16, height: 16 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Your listing is covered under your current <strong>Pro Plan</strong> — no additional charges.
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
            <button className="db-btn db-btn--primary" onClick={() => navigate('/dashboard/listing')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 14, height: 14 }}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Manage Listing
            </button>
            <button className="db-btn db-btn--outline" onClick={onCreateAnother}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 14, height: 14 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              Create Another
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
