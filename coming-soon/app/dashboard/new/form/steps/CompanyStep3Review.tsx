'use client'
import type { StepProps } from '../types'

/**
 * Company form, Step 3 — Review.
 * Read-only summary of what's about to be submitted. The Footer's
 * "Submit listing" button (rendered by DashboardListingForm) actually
 * fires the POST; this component only displays.
 */
type Props = StepProps & {
  goToStep: (idx: number) => void
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="df-rev-row">
      <div className="df-rev-lbl">{label}</div>
      <div className="df-rev-val">{value || <span className="df-rev-empty">—</span>}</div>
    </div>
  )
}

export default function CompanyStep3Review({ form, goToStep }: Props) {
  const tags = form.headerTags.length > 0 ? form.headerTags.join(' · ') : ''
  const location = [form.city, form.state, form.country].filter(Boolean).join(', ')

  return (
    <>
      <header className="df-section-head">
        <h2 className="df-section-title">Review &amp; submit</h2>
        <p className="df-section-sub">
          One last check before we send this to the moderation team. You can edit any
          field by clicking the section header below.
        </p>
      </header>

      <section className="df-rev-card">
        <header className="df-rev-card-head">
          <h3>Identity</h3>
          <button type="button" onClick={() => goToStep(0)} className="df-rev-edit">Edit</button>
        </header>
        <div className="df-rev-grid">
          <Row label="Logo" value={
            form.logoUrl
              ? <img src={form.logoUrl} alt="" className="df-rev-logo" />
              : ''
          } />
          <Row label="Name" value={form.companyName} />
          <Row label="Tagline" value={form.tagline} />
          <Row label="Website" value={form.website} />
          <Row label="Founded" value={form.founded} />
          <Row label="Team size" value={form.employees} />
          <Row label="Descriptors" value={tags} />
          <Row label="About" value={form.description} />
        </div>
      </section>

      <section className="df-rev-card">
        <header className="df-rev-card-head">
          <h3>Contact &amp; location</h3>
          <button type="button" onClick={() => goToStep(1)} className="df-rev-edit">Edit</button>
        </header>
        <div className="df-rev-grid">
          <Row label="Contact name" value={form.contactName} />
          <Row label="Email" value={form.email} />
          <Row label="Phone" value={form.phone ? `${form.phoneCode} ${form.phone}` : ''} />
          <Row label="Location" value={location} />
          <Row label="HQ address" value={form.hqLocation} />
          <Row label="LinkedIn" value={form.linkedin} />
          <Row label="Twitter / X" value={form.twitter} />
          <Row label="Facebook" value={form.facebook} />
          <Row label="Hiring" value={form.isHiring ? 'Yes — actively hiring' : ''} />
        </div>
      </section>

      <p className="df-rev-foot">
        On submit, your profile is queued for human review. You&apos;ll get an email when it
        goes live (typically 1–3 business days). Once approved, an admin deploys the
        change and your <code>/profile/{'<slug>'}</code> page becomes publicly visible.
      </p>
    </>
  )
}
