'use client'
import Field from '../components/Field'
import ChipInput from '../components/ChipInput'
import PillToggle from '../components/PillToggle'
import { COMPANY_SIZE_OPTIONS } from '../constants'
import type { StepProps, ServiceShare, ClientLogo, Award } from '../types'

const MAX_SERVICE_LINES = 8
const MAX_FOCUS = 8
const MAX_CLIENT_LOGOS = 16

/**
 * Company form, Step 3 — Services & Pricing.
 *
 * Captures every datum the Clutch-style /profile/[slug] page renders that
 * isn't already in Step 1 (identity) or Step 2 (contact/location):
 *   • Pricing snapshot — min project size, hourly rate, common project size
 *   • Watch our Video link
 *   • "What clients have said" editorial paragraph
 *   • Service Lines pie (name + percentage rows)
 *   • Focus segments pie (name + percentage rows)
 *   • Industries served (free-add chip list)
 *   • Target client sizes (multi-pill)
 *   • Awards (name + year repeating rows)
 *   • Client logos (name + URL repeating rows — favicon resolved at render time)
 *
 * Repeating rows mirror the existing key-features / integrations pattern in
 * Step5Features.tsx so visual + interaction language stays consistent.
 */
export default function CompanyStep3Services({ form, set, errors }: StepProps) {
  /* ── Service Lines ── */
  const updateService = (i: number, patch: Partial<ServiceShare>) => {
    const arr = [...form.serviceLines]
    arr[i] = { ...arr[i], ...patch }
    set('serviceLines', arr)
  }
  const addService = () => {
    if (form.serviceLines.length >= MAX_SERVICE_LINES) return
    set('serviceLines', [...form.serviceLines, { name: '', percentage: 0 }])
  }
  const removeService = (i: number) =>
    set('serviceLines', form.serviceLines.filter((_, j) => j !== i))
  const serviceTotal = form.serviceLines.reduce((s, r) => s + (Number(r.percentage) || 0), 0)

  /* ── Focus Breakdown ── */
  const updateFocus = (i: number, patch: Partial<ServiceShare>) => {
    const arr = [...form.focusBreakdown]
    arr[i] = { ...arr[i], ...patch }
    set('focusBreakdown', arr)
  }
  const addFocus = () => {
    if (form.focusBreakdown.length >= MAX_FOCUS) return
    set('focusBreakdown', [...form.focusBreakdown, { name: '', percentage: 0 }])
  }
  const removeFocus = (i: number) =>
    set('focusBreakdown', form.focusBreakdown.filter((_, j) => j !== i))
  const focusTotal = form.focusBreakdown.reduce((s, r) => s + (Number(r.percentage) || 0), 0)

  /* ── Awards ── */
  const updateAward = (i: number, patch: Partial<Award>) => {
    const arr = [...form.awards]
    arr[i] = { ...arr[i], ...patch }
    set('awards', arr)
  }
  const addAward = () => set('awards', [...form.awards, { name: '', year: '' }])
  const removeAward = (i: number) =>
    set('awards', form.awards.filter((_, j) => j !== i))

  /* ── Client logos ── */
  const updateClient = (i: number, patch: Partial<ClientLogo>) => {
    const arr = [...form.clientLogos]
    arr[i] = { ...arr[i], ...patch }
    set('clientLogos', arr)
  }
  const addClient = () => {
    if (form.clientLogos.length >= MAX_CLIENT_LOGOS) return
    set('clientLogos', [...form.clientLogos, { name: '', logoUrl: '', url: '' }])
  }
  const removeClient = (i: number) =>
    set('clientLogos', form.clientLogos.filter((_, j) => j !== i))

  return (
    <>
      <header className="df-section-head">
        <h2 className="df-section-title">Services &amp; pricing</h2>
        <p className="df-section-sub">
          The pricing snapshot, service-mix pie chart, focus areas, industries you serve and
          notable clients. Everything here renders inline on your <code>/profile</code> page.
        </p>
      </header>

      {/* ── Pricing snapshot ── */}
      <div className="df-grid-2">
        <Field label="Min project size" hint='Free text. e.g. "$10,000+", "Starts at $5K", or "Contact us".'>
          <input
            type="text"
            className="df-input"
            value={form.minProjectSize}
            onChange={e => set('minProjectSize', e.target.value)}
            placeholder="$10,000+"
            maxLength={40}
          />
        </Field>
        <Field label="Hourly rate" hint='e.g. "$150 - $199 / hr" or "Custom".'>
          <input
            type="text"
            className="df-input"
            value={form.hourlyRate}
            onChange={e => set('hourlyRate', e.target.value)}
            placeholder="$150 - $199 / hr"
            maxLength={60}
          />
        </Field>
      </div>

      <div className="df-grid-2">
        <Field label="Most common project size" hint='Range that most of your projects fall into. e.g. "$50,000 - $199,999".'>
          <input
            type="text"
            className="df-input"
            value={form.commonProjectSize}
            onChange={e => set('commonProjectSize', e.target.value)}
            placeholder="$50,000 - $199,999"
            maxLength={60}
          />
        </Field>
        <Field label='"Watch our Video" link' hint="YouTube, Vimeo, or Loom URL. Shown as an inline play link in the hero.">
          <input
            type="url"
            className="df-input"
            value={form.introVideoUrl}
            onChange={e => set('introVideoUrl', e.target.value)}
            placeholder="https://www.youtube.com/watch?v=…"
            maxLength={500}
          />
        </Field>
      </div>

      <Field label="What clients have said" hint="One short paragraph (2-3 sentences). Shown in the Pricing Snapshot block.">
        <textarea
          className="df-textarea"
          value={form.clientsSummary}
          onChange={e => set('clientsSummary', e.target.value)}
          placeholder="What past clients say about your pricing, value, or working with your team."
          rows={4}
          maxLength={800}
        />
      </Field>

      {/* ── Service lines pie ── */}
      <Field
        label={`Service lines (max ${MAX_SERVICE_LINES})`}
        error={errors.serviceLines}
        hint="Each row is one slice of the Services pie chart. Percentages should add to 100."
      >
        {form.serviceLines.map((row, i) => (
          <div key={i} className="df-kf-row">
            <input
              type="text"
              className="df-input df-kf-name"
              value={row.name}
              onChange={e => updateService(i, { name: e.target.value })}
              placeholder={`Service ${i + 1} (e.g. Custom Software Development)`}
              maxLength={80}
            />
            <input
              type="number"
              className="df-input df-kf-desc"
              value={row.percentage || ''}
              onChange={e => updateService(i, { percentage: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })}
              placeholder="%"
              min={0}
              max={100}
              step={1}
            />
            <button
              type="button"
              className="df-icon-btn df-kf-rm"
              onClick={() => removeService(i)}
              aria-label={`Remove service ${i + 1}`}
            >
              <svg viewBox="0 0 24 24" width="14" height="14"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
        ))}
        {form.serviceLines.length < MAX_SERVICE_LINES && (
          <button type="button" className="df-add-btn" onClick={addService}>
            + Add service line
          </button>
        )}
        {form.serviceLines.length > 0 && (
          <div className={'df-help-row' + (serviceTotal === 100 ? ' is-ok' : '')}>
            Total: <strong>{serviceTotal}%</strong>{serviceTotal !== 100 ? ' — should add to 100' : ' — looks good'}
          </div>
        )}
      </Field>

      {/* ── Focus breakdown pie ── */}
      <Field
        label={`Focus breakdown (max ${MAX_FOCUS})`}
        error={errors.focusBreakdown}
        hint='Segment your work — by client size, by industry vertical, anything. Shown under the "Focus" tab. Sum to 100.'
      >
        {form.focusBreakdown.map((row, i) => (
          <div key={i} className="df-kf-row">
            <input
              type="text"
              className="df-input df-kf-name"
              value={row.name}
              onChange={e => updateFocus(i, { name: e.target.value })}
              placeholder={`Focus area ${i + 1} (e.g. Small Business)`}
              maxLength={80}
            />
            <input
              type="number"
              className="df-input df-kf-desc"
              value={row.percentage || ''}
              onChange={e => updateFocus(i, { percentage: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })}
              placeholder="%"
              min={0}
              max={100}
              step={1}
            />
            <button
              type="button"
              className="df-icon-btn df-kf-rm"
              onClick={() => removeFocus(i)}
              aria-label={`Remove focus ${i + 1}`}
            >
              <svg viewBox="0 0 24 24" width="14" height="14"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
        ))}
        {form.focusBreakdown.length < MAX_FOCUS && (
          <button type="button" className="df-add-btn" onClick={addFocus}>
            + Add focus area
          </button>
        )}
        {form.focusBreakdown.length > 0 && (
          <div className={'df-help-row' + (focusTotal === 100 ? ' is-ok' : '')}>
            Total: <strong>{focusTotal}%</strong>{focusTotal !== 100 ? ' — should add to 100' : ' — looks good'}
          </div>
        )}
      </Field>

      {/* ── Industries served ── */}
      <Field label="Industries served" hint="Industries you typically work with. Shown under the Industries tab.">
        <ChipInput
          values={form.industriesServed}
          onChange={v => set('industriesServed', v)}
          placeholder="e.g. Fintech, Healthcare, E-commerce…"
          max={20}
        />
      </Field>

      {/* ── Target client sizes ── */}
      <Field label="Target client sizes" hint="The kinds of buyers your services fit best.">
        <PillToggle
          options={COMPANY_SIZE_OPTIONS}
          selected={form.targetCompanySizes}
          onChange={v => set('targetCompanySizes', v)}
        />
      </Field>

      {/* ── Awards ── */}
      <Field label="Awards & recognitions" hint='Each award shows as a small badge in the sticky header. e.g. "Clutch Top 100 — 2024".'>
        {form.awards.map((aw, i) => (
          <div key={i} className="df-kf-row">
            <input
              type="text"
              className="df-input df-kf-name"
              value={aw.name}
              onChange={e => updateAward(i, { name: e.target.value })}
              placeholder={`Award name ${i + 1}`}
              maxLength={120}
            />
            <input
              type="text"
              className="df-input df-kf-desc"
              value={aw.year || ''}
              onChange={e => updateAward(i, { year: e.target.value.replace(/[^\d]/g, '').slice(0, 4) })}
              placeholder="Year"
              maxLength={4}
            />
            <button
              type="button"
              className="df-icon-btn df-kf-rm"
              onClick={() => removeAward(i)}
              aria-label={`Remove award ${i + 1}`}
            >
              <svg viewBox="0 0 24 24" width="14" height="14"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
        ))}
        <button type="button" className="df-add-btn" onClick={addAward}>
          + Add award
        </button>
      </Field>

      {/* ── Client logos ── */}
      <Field
        label={`Notable clients (max ${MAX_CLIENT_LOGOS})`}
        hint="Each client name + their site URL. We'll fetch their favicon for the Clients tab logo grid."
      >
        {form.clientLogos.map((cl, i) => (
          <div key={i} className="df-int-row">
            <input
              type="text"
              className="df-input"
              value={cl.name}
              onChange={e => updateClient(i, { name: e.target.value })}
              placeholder={`Client name ${i + 1} (e.g. Acme Co)`}
              maxLength={80}
            />
            <input
              type="url"
              className="df-input"
              value={cl.url || ''}
              onChange={e => updateClient(i, { url: e.target.value })}
              placeholder="https://acme.com"
              maxLength={200}
            />
            <button
              type="button"
              className="df-icon-btn df-kf-rm"
              onClick={() => removeClient(i)}
              aria-label={`Remove client ${i + 1}`}
            >
              <svg viewBox="0 0 24 24" width="14" height="14"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
        ))}
        {form.clientLogos.length < MAX_CLIENT_LOGOS && (
          <button type="button" className="df-add-btn" onClick={addClient}>
            + Add client
          </button>
        )}
      </Field>
    </>
  )
}
