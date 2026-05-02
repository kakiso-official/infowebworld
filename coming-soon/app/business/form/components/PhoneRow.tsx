'use client'
import { useMemo } from 'react'
import { Country } from 'country-state-city'
import CustomSelect from './CustomSelect'
import FlagImg from './FlagImg'

type Props = {
  iso: string
  code: string
  phone: string
  onCountry: (iso: string, code: string) => void
  onPhone: (v: string) => void
}

export default function PhoneRow({ iso, code, phone, onCountry, onPhone }: Props) {
  const options = useMemo(
    () => Country.getAllCountries()
      .map(c => ({
        value: c.isoCode,
        label: `${c.name} (+${c.phonecode.replace('+', '')})`,
        icon: <FlagImg iso={c.isoCode} />,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    []
  )

  return (
    <div className="lf2-phone-row">
      <div className="lf2-phone-country">
        <CustomSelect
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
      <div className="lf2-phone-code-box">{code}</div>
      <input
        type="tel"
        className="lf2-input"
        value={phone}
        onChange={e => onPhone(e.target.value)}
        placeholder="Phone number"
        maxLength={15}
      />
    </div>
  )
}
