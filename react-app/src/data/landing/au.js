/* ── Australia (en-au) Landing ── */
const auConfig = {
  code: 'au',
  name: 'Australia',
  flag: '\u{1F1E6}\u{1F1FA}',
  path: '/en-au',
  currency: 'A$',
  locale: 'en-AU',
  hero: {
    locationPlaceholder: 'City or postcode',
  },
  footer: {
    languageLabel: 'English (AU)',
  },
  locations: [
    { state: 'New South Wales', cities: ['Sydney', 'Newcastle', 'Wollongong', 'Central Coast', 'Coffs Harbour'] },
    { state: 'Victoria', cities: ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo', 'Shepparton'] },
    { state: 'Queensland', cities: ['Brisbane', 'Gold Coast', 'Sunshine Coast', 'Townsville', 'Cairns'] },
    { state: 'Western Australia', cities: ['Perth', 'Mandurah', 'Bunbury', 'Geraldton', 'Kalgoorlie'] },
    { state: 'South Australia', cities: ['Adelaide', 'Mount Gambier', 'Whyalla', 'Murray Bridge', 'Port Augusta'] },
    { state: 'Tasmania', cities: ['Hobart', 'Launceston', 'Devonport', 'Burnie', 'Kingston'] },
    { state: 'Australian Capital Territory', cities: ['Canberra', 'Queanbeyan', 'Belconnen', 'Woden Valley', 'Tuggeranong'] },
    { state: 'Northern Territory', cities: ['Darwin', 'Alice Springs', 'Palmerston', 'Katherine', 'Tennant Creek'] },
  ],
}

export default auConfig
