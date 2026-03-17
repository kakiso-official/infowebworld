import { createContext, useContext } from 'react'
import usConfig from '../data/landing/us'

const CountryContext = createContext(usConfig)

export function CountryProvider({ country, children }) {
  return (
    <CountryContext.Provider value={country}>
      {children}
    </CountryContext.Provider>
  )
}

export function useCountry() {
  return useContext(CountryContext)
}

export default CountryContext
