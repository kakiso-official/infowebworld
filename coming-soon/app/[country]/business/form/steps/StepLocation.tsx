'use client'
import { useMemo } from 'react'
import { Country, State, City } from 'country-state-city'
import Field from '../components/Field'
import StepHead from '../components/StepHead'
import CustomSelect from '../components/CustomSelect'
import FlagImg from '../components/FlagImg'
import { I } from '../icons'
import type { StepProps } from '../types'

export default function StepLocation({ form, set, errors }: StepProps) {
  const countries = useMemo(
    () => Country.getAllCountries()
      .map(c => ({ value: c.isoCode, label: c.name, icon: <FlagImg iso={c.isoCode} /> }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    []
  )
  const states = useMemo(() => {
    if (!form.countryCode) return []
    return State.getStatesOfCountry(form.countryCode).map(s => ({ value: s.isoCode, label: s.name }))
  }, [form.countryCode])
  const cities = useMemo(() => {
    if (!form.countryCode || !form.stateCode) return []
    return City.getCitiesOfState(form.countryCode, form.stateCode).map(c => ({ value: c.name, label: c.name }))
  }, [form.countryCode, form.stateCode])

  return (
    <div className="lf2-section">
      <StepHead icon={I.pin} title="Where are you based?"
        sub="Buyers filter by location. Pick your HQ or primary market." />

      <Field label="Country" required error={errors.country}>
        <CustomSelect
          value={form.countryCode}
          onChange={v => {
            const c = Country.getCountryByCode(v)
            if (c) {
              set('countryCode', c.isoCode); set('country', c.name)
              set('stateCode', ''); set('state', ''); set('city', '')
            }
          }}
          options={countries}
          placeholder="Select your country"
          searchable
        />
      </Field>

      <div className="lf2-row-2">
        <Field label="State / Region">
          <CustomSelect
            value={form.stateCode}
            onChange={v => {
              const s = states.find(x => x.value === v)
              if (s) { set('stateCode', s.value); set('state', s.label); set('city', '') }
              else { set('stateCode', ''); set('state', '') }
            }}
            options={states}
            placeholder={states.length ? 'Select state' : 'Pick country first'}
            disabled={states.length === 0}
            searchable
          />
        </Field>
        <Field label="City">
          <CustomSelect
            value={form.city}
            onChange={v => set('city', v)}
            options={cities}
            placeholder={cities.length ? 'Select city' : 'Pick state first'}
            disabled={cities.length === 0}
            searchable
          />
        </Field>
      </div>

      <Field label="HQ location" hint="Optional — full address or landmark city.">
        <input type="text" className="lf2-input" value={form.hqLocation}
          onChange={e => set('hqLocation', e.target.value)}
          placeholder="Bangalore, Karnataka, India" />
      </Field>
    </div>
  )
}
