/* ── Canada (en-ca) Landing ── */
const caConfig = {
  code: 'ca',
  name: 'Canada',
  flag: '\u{1F1E8}\u{1F1E6}',
  path: '/en-ca',
  currency: 'C$',
  locale: 'en-CA',
  hero: {
    locationPlaceholder: 'City or postal code',
  },
  footer: {
    languageLabel: 'English (CA)',
  },
  locations: [
    { state: 'Ontario', cities: ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'London'] },
    { state: 'Quebec', cities: ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Sherbrooke'] },
    { state: 'British Columbia', cities: ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Kelowna'] },
    { state: 'Alberta', cities: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Medicine Hat'] },
    { state: 'Manitoba', cities: ['Winnipeg', 'Brandon', 'Steinbach', 'Thompson', 'Portage la Prairie'] },
    { state: 'Saskatchewan', cities: ['Saskatoon', 'Regina', 'Prince Albert', 'Moose Jaw', 'Swift Current'] },
    { state: 'Nova Scotia', cities: ['Halifax', 'Dartmouth', 'Sydney', 'Truro', 'New Glasgow'] },
    { state: 'New Brunswick', cities: ['Moncton', 'Saint John', 'Fredericton', 'Dieppe', 'Miramichi'] },
    { state: 'Newfoundland & Labrador', cities: ['St. John\'s', 'Mount Pearl', 'Corner Brook', 'Conception Bay South', 'Grand Falls-Windsor'] },
    { state: 'Prince Edward Island', cities: ['Charlottetown', 'Summerside', 'Stratford', 'Cornwall', 'Montague'] },
    { state: 'Northwest Territories', cities: ['Yellowknife', 'Hay River', 'Inuvik', 'Fort Smith', 'Behchoko'] },
    { state: 'Yukon', cities: ['Whitehorse', 'Dawson City', 'Watson Lake', 'Haines Junction', 'Carmacks'] },
    { state: 'Nunavut', cities: ['Iqaluit', 'Rankin Inlet', 'Arviat', 'Baker Lake', 'Cambridge Bay'] },
  ],
}

export default caConfig
