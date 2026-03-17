/* ── Country Config Registry ── */
import usConfig from './us'
import inConfig from './in'
import euConfig from './eu'
import auConfig from './au'
import caConfig from './ca'
import ukConfig from './uk'

export const countries = {
  us: usConfig,
  in: inConfig,
  eu: euConfig,
  au: auConfig,
  ca: caConfig,
  uk: ukConfig,
}

export const countryList = Object.values(countries)

export function getCountryByCode(code) {
  return countries[code] || countries.us
}

export function getCountryByPath(path) {
  return countryList.find(c => c.path === path) || countries.us
}

export { usConfig, inConfig, euConfig, auConfig, caConfig, ukConfig }
