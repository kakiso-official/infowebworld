/* ── United Kingdom (en-uk) Landing ── */
const ukConfig = {
  code: 'uk',
  name: 'United Kingdom',
  flag: '\u{1F1EC}\u{1F1E7}',
  path: '/en-uk',
  currency: '\u00A3',
  locale: 'en-GB',
  hero: {
    locationPlaceholder: 'City or postcode',
  },
  footer: {
    languageLabel: 'English (UK)',
  },
  locations: [
    { state: 'England', cities: ['London', 'Birmingham', 'Manchester', 'Leeds', 'Liverpool'] },
    { state: 'Greater London', cities: ['City of London', 'Westminster', 'Camden', 'Islington', 'Hackney'] },
    { state: 'South East', cities: ['Brighton', 'Oxford', 'Reading', 'Southampton', 'Canterbury'] },
    { state: 'North West', cities: ['Manchester', 'Liverpool', 'Preston', 'Blackpool', 'Chester'] },
    { state: 'West Midlands', cities: ['Birmingham', 'Coventry', 'Wolverhampton', 'Solihull', 'Walsall'] },
    { state: 'East Midlands', cities: ['Nottingham', 'Leicester', 'Derby', 'Northampton', 'Lincoln'] },
    { state: 'Yorkshire', cities: ['Leeds', 'Sheffield', 'York', 'Bradford', 'Hull'] },
    { state: 'East of England', cities: ['Cambridge', 'Norwich', 'Ipswich', 'Colchester', 'Peterborough'] },
    { state: 'South West', cities: ['Bristol', 'Bath', 'Exeter', 'Plymouth', 'Bournemouth'] },
    { state: 'North East', cities: ['Newcastle', 'Sunderland', 'Durham', 'Middlesbrough', 'Darlington'] },
    { state: 'Scotland', cities: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee', 'Inverness'] },
    { state: 'Wales', cities: ['Cardiff', 'Swansea', 'Newport', 'Bangor', 'Wrexham'] },
    { state: 'Northern Ireland', cities: ['Belfast', 'Derry', 'Lisburn', 'Newry', 'Armagh'] },
  ],
}

export default ukConfig
