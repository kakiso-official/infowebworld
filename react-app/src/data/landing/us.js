/* ── United States (Default / Root Landing) ── */
const usConfig = {
  code: 'us',
  name: 'United States',
  flag: '\u{1F1FA}\u{1F1F8}',
  path: '/',
  currency: '$',
  locale: 'en-US',
  hero: {
    locationPlaceholder: 'City or ZIP code',
  },
  footer: {
    languageLabel: 'English (US)',
  },
  locations: [
    { state: 'California', cities: ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento'] },
    { state: 'New York', cities: ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse'] },
    { state: 'Texas', cities: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'] },
    { state: 'Florida', cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'] },
    { state: 'Illinois', cities: ['Chicago', 'Aurora', 'Naperville', 'Rockford', 'Joliet'] },
    { state: 'Pennsylvania', cities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading'] },
    { state: 'Ohio', cities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron'] },
    { state: 'Georgia', cities: ['Atlanta', 'Augusta', 'Savannah', 'Columbus', 'Macon'] },
    { state: 'North Carolina', cities: ['Charlotte', 'Raleigh', 'Durham', 'Greensboro', 'Winston-Salem'] },
    { state: 'Michigan', cities: ['Detroit', 'Grand Rapids', 'Ann Arbor', 'Lansing', 'Flint'] },
    { state: 'New Jersey', cities: ['Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Trenton'] },
    { state: 'Virginia', cities: ['Virginia Beach', 'Norfolk', 'Richmond', 'Arlington', 'Alexandria'] },
    { state: 'Washington', cities: ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue'] },
    { state: 'Massachusetts', cities: ['Boston', 'Cambridge', 'Worcester', 'Springfield', 'Lowell'] },
    { state: 'Colorado', cities: ['Denver', 'Colorado Springs', 'Aurora', 'Boulder', 'Fort Collins'] },
  ],
}

export default usConfig
