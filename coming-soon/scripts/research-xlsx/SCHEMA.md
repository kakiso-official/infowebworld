# xlsx-60 seed — research schema (real data only, never fabricate)

60 companies from `InfoWebWorld-Companies-by-Category.xlsx`. AI/ML = `product` (rich, screenshots),
all other sectors = `company`. Categories already resolved to real taxonomy slugs (see table below).

## Hard rules
- **REAL, web-verified data only.** Never invent founded years, employee counts, prices, awards, or clients.
  If a field can't be verified, set it `null` (or `[]` for arrays). An honest gap beats a fake value.
- **Single hyphen `-` in copy, never em-dash `—`.** Plain ASCII. Escape nothing weird.
- **Tagline** ≤ 200 chars, factual, no marketing fluff. **Description** = 2-4 real sentences.
- Cite 2-4 `source_urls` per company (official site, Wikipedia, Crunchbase, LinkedIn).
- Output **strict JSON** (no trailing commas, double-quoted keys/strings). I will `JSON.parse` it.

## Shared enums (use these exact strings)
- `team_size`: one of `Solo / Freelancer` `2-10` `11-50` `51-200` `201-500` `500+`
- `timezones`: from `GMT-08:00 (Pacific)` `GMT-07:00 (Mountain)` `GMT-06:00 (Central)` `GMT-05:00 (Eastern)`
  `GMT+00:00 (London)` `GMT+01:00 (Berlin)` `GMT+05:30 (India)` `GMT+08:00 (Singapore)` `GMT+10:00 (Sydney)` …
- `country_code`: ISO-2 (US, CA, GB, AU, DE, FR, IN, SE …). `state`: US/CA/AU subdivision code or null.
- `hq_location`: "City, ST, Country" (US/CA/AU) or "City, Country".
- `email`: a real generic mailbox if known (info@/support@/hello@domain), else `info@<domain>`.
- `phone`: null unless trivially found. `phone_code`: "+1" etc.

## COMMON fields (all 60)
name, slug (given), category_slug (given), listing_mode (given), website, email, phone_code, phone,
country_code, city, state, hq_location, tagline, description, founded_year (int|null), team_size,
linkedin (url|null), twitter (url|null), header_tags (3-5 short strings), languages (e.g. ["English"]),
faqs (4-6 of {question, answer}), source_urls.

## PRODUCT extra (AI/ML 10) — mirror database/enrich-aiml-listings.sql shapes
facebook: omit. Add:
- industries_served (4-8), use_cases (6-8), target_company_sizes (e.g. ["Freelancers","Small businesses","Midsize companies","Enterprises"])
- key_features (8-10 strings)  (the generator copies this into both key_features and features)
- pricing_model: 'freemium' | 'subscription' | 'usage-based' | 'free' | 'custom'
- pricing_tiers: [{name, price (number|null), period ('month'|'year'|'one-time'|'custom'), features (3-4 strings)}]
  **Prices must come from the official pricing page, current as of 2026.** If unverifiable, price:null + note in source.
- integrations: [{name, website, description}] (3-6; [] if genuinely none)
- support_channels (e.g. ["Email support","Help center","Community forum"]), training_options, compliance ([] if none)
- pros (5-6), cons (4-5)
- starting_price (number|null), starting_price_period ('month'|'year'|'one-time'|null)
- has_free_trial, has_free_version, has_ios_app, has_android_app  (0/1)

## COMPANY extra (SaaS, IT Services, Startups, Pro Services = 40)
facebook (url|null), is_hiring (0; keep 0), industries_served (4-8), awards ([{name, year}] — ONLY real/verified, else []),
timezones (1-2 from HQ), focus_breakdown ([{name, percentage}] summing 100 — client/customer SIZE mix:
"Small Business (<$10M)","Midmarket ($10M - $1B)","Enterprise (>$1B)"; for SaaS/startups use "SMB"/"Mid-Market"/"Enterprise"),
clients_summary (1 real sentence|null), client_logos ([{name, website}] real notable clients only|null).

Per-sector field policy (omit = null):
- **IT Services + Pro Services**: ALSO hourly_rate ('$50 - $99 / hr' | '$100 - $149 / hr' | '$150 - $199 / hr' | '$200 - $300 / hr'),
  min_project_size ('$1,000+' | '$5,000+' | '$10,000+' | '$25,000+' | '$50,000+'), common_project_size (null ok),
  service_lines ([{name, percentage}] summing 100 — their service offerings).
- **SaaS**: service_lines = product/offering breakdown summing 100. OMIT hourly_rate, min_project_size, common_project_size.
- **Startups**: OMIT hourly_rate, min_project_size, common_project_size, service_lines. focus_breakdown optional.

## LOCAL extra (Local Businesses 10) — listing_mode='company' + lb_* (Yelp design). Brand-level/representative data.
- lb_price_range: '$' | '$$' | '$$$' | '$$$$' | ''
- lb_hours: [{day:'Mon'|'Tue'|…|'Sun', time:'11:00 AM - 10:00 PM', closed:false}] — typical/representative chain hours
- lb_amenities: subset of the vertical's amenity slugs that are TRUE for the brand (see vertical map below)
- lb_menu: [{name, price, photo:''}] — REAL signature items only (restaurants→real dishes; services→real service types; retail→real product lines). [] if unsure.
- lb_photos: []  (no real location photos — illustration fallback handles it)
- lb_videos: []
- lb_lat: null, lb_lng: null  (national chains, many locations)
- header_tags: brand descriptors. Also description, founded_year, team_size, website, socials.

### Local vertical → valid amenity slugs (pick the TRUE ones)
- food (Olive Garden, Cheesecake Factory): takeout, delivery, credit_cards, wifi, vegetarian, outdoor_seating, reservations, parking, wheelchair
- home-services (Roto-Rooter→plumbing, Mr. Electric→electrical): free_estimates, licensed_insured, emergency_service, financing, warranty, eco_friendly, credit_cards
- automotive (Midas→auto-repair, CarMax→car-dealers): free_estimates, credit_cards, financing, warranty, loaner_cars, wheelchair
- beauty (Great Clips→hair): by_appointment, walk_ins, credit_cards, wifi, parking, wheelchair, gift_cards
- retail (Gap→apparel): in_store_pickup, curbside, returns_accepted, credit_cards, wifi, parking, wheelchair, gift_cards
- fitness (Planet Fitness→gyms, CorePower→studios): free_trial, personal_training, showers, lockers, parking, wheelchair, credit_cards

## Category resolution table (name → slug, verified against app/config/categories-data.ts)
AI/ML(product): QuillBot=ai-humanizers, Bardeen=ai-browser-automation, ThoughtSpot=ai-business-intelligence,
Teachable=ai-course-builders, Be My Eyes=ai-for-accessibility, Tidio=ai-chatbot-builders, Botpress=ai-chatbot-builders,
FlutterFlow=ai-app-builders, Lindy=autonomous-agents, MagicSchool=ai-course-builders
SaaS(company): Bill.com=accounts-payable-software, Sisense=business-intelligence-software, Brandfolder=digital-asset-management-dam,
Aircall=voip-software, Pendo=data-analysis-software, Nutshell=crm-software, Paylocity=hr-software-hris,
JumpCloud=identity-management-software-iam, Sage Intacct=accounting-software, Tipalti=accounts-payable-software
IT Services(company): Concentrix=bpo-companies, DOOR3=custom-web-development-companies, Mutual Mobile=android-app-development-companies,
Cprime=cloud-consulting-companies, Closeloop=custom-software-development-companies, Brainhub=custom-software-development-companies,
MindK=custom-software-development-companies, Trio=offshore-software-development-companies, Arkenea=iphone-app-development-companies,
Dom & Tom=custom-web-development-companies
Startups(company): Outschool=k-12-edtech-startups, Watershed=climate-tech-startups, Solana Labs=layer-1-blockchain-startups,
Rivian=electric-vehicle-startups, Khan Academy=k-12-edtech-startups, Lucid Motors=electric-vehicle-startups, Maven=k-12-edtech-startups,
Pachama=climate-tech-startups, Aptos=layer-1-blockchain-startups, Polestar=electric-vehicle-startups
Local(company+lb): Olive Garden=american-restaurants, Roto-Rooter=plumbers, Mr. Electric=electricians, Midas=auto-repair-shops,
CarMax=car-dealerships, Great Clips=hair-salons-2, Gap=clothing-stores, Planet Fitness=gyms, CorePower Yoga=yoga-studios,
The Cheesecake Factory=american-restaurants
Pro Services(company): HOK=architects-2, inDinero=bookkeepers, Perkins and Will=architects-2, Stantec=civil-engineering-firms,
WSP=civil-engineering-firms, Robert Walters=hr-consultants, Willis Towers Watson=employee-benefits-consultants,
Perella Weinberg=boutique-investment-banks, Marcum=audit-firms, CliftonLarsonAllen=audit-firms
