'use client'
import { useMemo } from 'react'
import { Country, State, City } from 'country-state-city'
import Field from '../components/Field'
import Select from '../components/Select'
import PhoneRow from '../components/PhoneRow'
import type { StepProps } from '../types'

/**
 * Company form, Step 2 — Details.
 * Contact + location + socials + the optional "We're hiring" toggle.
 * Single screen, scannable. Fields here mirror what a Crunchbase /
 * LinkedIn company-about block would show.
 */
export default function CompanyStep2Details({ form, set, errors }: StepProps) {
  const countryOpts = useMemo(
    () => Country.getAllCountries()
      .map(c => ({ value: c.isoCode, label: c.name }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    [],
  )
  const stateOpts = useMemo(() => {
    if (!form.countryCode) return []
    return State.getStatesOfCountry(form.countryCode)
      .map(s => ({ value: s.isoCode, label: s.name }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [form.countryCode])
  const cityOpts = useMemo(() => {
    if (!form.countryCode || !form.stateCode) return []
    return City.getCitiesOfState(form.countryCode, form.stateCode)
      .map(c => ({ value: c.name, label: c.name }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [form.countryCode, form.stateCode])

  return (
    <>
      <header className="df-section-head">
        <h2 className="df-section-title">Contact &amp; location</h2>
        <p className="df-section-sub">
          How visitors reach you, where you&apos;re based, and the social profiles people might
          look up before reaching out.
        </p>
      </header>

      <div className="df-grid-2">
        <Field label="Your name" required error={errors.contactName}>
          <input
            type="text"
            className="df-input"
            value={form.contactName}
            onChange={e => set('contactName', e.target.value)}
            placeholder="Jane Doe"
            maxLength={120}
          />
        </Field>
        <Field label="Contact email" required error={errors.email}
          hint="We email you here when your profile is approved.">
          <input
            type="email"
            className="df-input"
            value={form.email}
            onChange={e => set('email', e.target.value)}
            placeholder="hello@acme.com"
            maxLength={180}
          />
        </Field>
      </div>

      <Field label="Phone" hint="Optional. Shown on the profile next to the address.">
        <PhoneRow
          iso={form.phoneIso}
          code={form.phoneCode}
          phone={form.phone}
          onCountry={(iso, code) => {
            set('phoneIso', iso)
            set('phoneCode', code)
          }}
          onPhone={v => set('phone', v)}
        />
      </Field>

      <div className="df-grid-3">
        <Field label="Country" required error={errors.country}>
          <Select
            value={form.countryCode}
            onChange={v => {
              const c = Country.getCountryByCode(v)
              set('countryCode', v)
              set('country', c?.name || '')
              set('stateCode', '')
              set('state', '')
              set('city', '')
            }}
            options={countryOpts}
            placeholder="Pick a country"
            searchable
          />
        </Field>
        <Field label="State / region">
          <Select
            value={form.stateCode}
            onChange={v => {
              const s = State.getStateByCodeAndCountry(v, form.countryCode)
              set('stateCode', v)
              set('state', s?.name || '')
              set('city', '')
            }}
            options={stateOpts}
            placeholder={form.countryCode ? 'Pick a state' : 'Pick a country first'}
            disabled={!form.countryCode}
            searchable
          />
        </Field>
        <Field label="City">
          <Select
            value={form.city}
            onChange={v => set('city', v)}
            options={cityOpts}
            placeholder={form.stateCode ? 'Pick a city' : 'Pick a state first'}
            disabled={!form.stateCode}
            searchable
          />
        </Field>
      </div>

      <Field label="HQ address"
        hint="Full mailing address. Shown next to the phone number on your profile.">
        <input
          type="text"
          className="df-input"
          value={form.hqLocation}
          onChange={e => set('hqLocation', e.target.value)}
          placeholder="675 Ponce de Leon Ave NE, Atlanta, GA, USA"
          maxLength={200}
        />
      </Field>

      <header className="df-section-head" style={{ marginTop: 8 }}>
        <h3 className="df-section-title" style={{ fontSize: 15 }}>Social profiles</h3>
        <p className="df-section-sub">Optional. Each link adds an icon-row to your profile.</p>
      </header>

      <div className="df-grid-2">
        <Field label="LinkedIn">
          <input
            type="url"
            className="df-input"
            value={form.linkedin}
            onChange={e => set('linkedin', e.target.value)}
            placeholder="https://linkedin.com/company/…"
            maxLength={300}
          />
        </Field>
        <Field label="Twitter / X">
          <input
            type="url"
            className="df-input"
            value={form.twitter}
            onChange={e => set('twitter', e.target.value)}
            placeholder="https://twitter.com/…"
            maxLength={300}
          />
        </Field>
        <Field label="Facebook">
          <input
            type="url"
            className="df-input"
            value={form.facebook}
            onChange={e => set('facebook', e.target.value)}
            placeholder="https://facebook.com/…"
            maxLength={300}
          />
        </Field>
        <Field label="Hiring status" hint="Shows a 'We're hiring' badge on the profile when on.">
          <label className="df-toggle-row">
            <input
              type="checkbox"
              checked={form.isHiring}
              onChange={e => set('isHiring', e.target.checked)}
            />
            <span>We&apos;re actively hiring</span>
          </label>
        </Field>
      </div>
    </>
  )
}
