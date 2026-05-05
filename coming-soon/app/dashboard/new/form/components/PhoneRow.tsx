'use client'
import { useMemo, useState } from 'react'
import { Country } from 'country-state-city'
import Select from './Select'

type Props = {
  iso: string
  code: string
  phone: string
  onCountry: (iso: string, code: string) => void
  onPhone: (v: string) => void
}

function FlagImg({ iso }: { iso: string }) {
  const [err, setErr] = useState(false)
  if (err) return <span className="df-flag-fb">{iso}</span>
  return (
    <img
      src={`https://flagcdn.com/w40/${iso.toLowerCase()}.png`}
      alt={iso}
      className="df-flag-img"
      onError={() => setErr(true)}
    />
  )
}

export default function PhoneRow({ iso, code, phone, onCountry, onPhone }: Props) {
  const options = useMemo(
    () =>
      Country.getAllCountries()
        .map(c => ({
          value: c.isoCode,
          label: `${c.name} (+${c.phonecode.replace('+', '')})`,
          icon: <FlagImg iso={c.isoCode} />,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [],
  )

  return (
    <div className="df-phone">
      <div className="df-phone-country">
        <Select
          value={iso}
          onChange={v => {
            const c = Country.getCountryByCode(v)
            if (c) onCountry(c.isoCode, `+${c.phonecode.replace('+', '')}`)
          }}
          options={options}
          placeholder="Country"
          searchable
        />
      </div>
      <div className="df-phone-code">{code}</div>
      <input
        type="tel"
        className="df-input df-phone-input"
        value={phone}
        onChange={e => onPhone(e.target.value)}
        placeholder="Phone number"
        maxLength={15}
      />
    </div>
  )
}
