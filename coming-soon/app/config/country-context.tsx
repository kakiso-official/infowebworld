'use client'
import { createContext, useContext } from 'react'
import type { CountryCode } from './countries'
import { DEFAULT_COUNTRY } from './countries'

const CountryContext = createContext<CountryCode>(DEFAULT_COUNTRY)

export function CountryProvider({ country, children }: { country: CountryCode; children: React.ReactNode }) {
  return <CountryContext.Provider value={country}>{children}</CountryContext.Provider>
}

export function useCountry() {
  return useContext(CountryContext)
}
