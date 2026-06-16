# Research brief — 500 real IT-services & agency company profiles (InfoWebWorld)

You are one of several parallel research agents. Your job: produce a set of **real,
web-verified, fully-loaded** IT-services / digital-agency companies for InfoWebWorld's
`/profile/[slug]` directory. These become claimable company listings used for outreach,
so every company must be a **real, currently-active business we could actually email**.

## Absolute rules (do not break)
1. **NEVER fabricate.** Every field must come from the company's own website or a
   credible source (LinkedIn, Clutch, press, awards body). If you cannot verify a field,
   set it to `null` / `[]` / `""` — do NOT guess, invent, or approximate.
2. **No duplicates.** First read `scripts/research-500/AVOID-DOMAINS.txt` (209 domains
   already in our directory). Skip any company whose root domain is in that file. Also do
   not list the same company twice within your own output.
3. **Skip the unreachable giants.** Do NOT include mega-corps that ignore outreach
   (Accenture, TCS, Infosys, Wipro, Cognizant, Capgemini, IBM, Deloitte Digital, EPAM,
   Globant, Endava, etc.). Favor **responsive, established agencies of 11–500 employees**
   (a few up to ~1000 is fine). The sweet spot is a real agency with a real contact email
   that would actually reply to a partnership email.
4. **Verify the company is alive:** website loads, recent activity, real HQ.

## "Fully-loaded" target (this is the whole point)
Bias HARD toward companies where you can fill **every** section. For each company you MUST
find and include:
- a real **contact email** published on their own site (info@/hello@/contact@/etc.),
- real **awards / certifications / partner tiers** (Clutch/Awwwards wins, Google/Adobe/AWS/
  Microsoft partner tiers, ISO, FT/Inc/Deloitte lists, local awards) — most agencies have these,
- **named clients WITH their root domains** (for logo rendering) — at least 3 where possible.

And **strongly prefer** companies that ALSO have an official **intro/explainer video on their
OWN YouTube channel**. Aim for **at least ~60% of your list to have a real video.** Only set
`intro_video_url` after you confirm the video is on the company's own channel (not a third party).
If a strong company has everything except a video, still include it (leave video null) — but
prioritize the ones that have it.

**How to verify a video is own-channel (do this — it's the reliable method):** a normal YouTube
watch page does NOT render via WebFetch, but the oEmbed JSON does. WebFetch
`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=VIDEO_ID&format=json` — the
returned `author_name` / `author_url` is the channel. Set `intro_video_url` only when that channel
is clearly the company's own. This is how to confidently reach the ~60% video target without guessing.

## Output record schema (one JSON object per company)
```json
{
  "company_name": "Acme Digital",
  "domain": "acmedigital.com",                       // root domain ONLY, lowercase, no www, no path
  "website": "https://www.acmedigital.com",          // full URL
  "category_slug": "custom-web-development",          // MUST be one of the valid slugs below
  "country_code": "BR",                              // ISO-3166 alpha-2, uppercase
  "city": "Sao Paulo",
  "state": "",                                       // state/province if applicable, else ""
  "founded_year": 2011,                              // integer, or null
  "team_size": "51-200",                             // EXACTLY one band from the list below
  "description": "Two to four factual sentences about what they do, where they are, and who they serve. Plain text, no marketing fluff, no emojis.",
  "linkedin": "https://www.linkedin.com/company/acme-digital",   // or null
  "industries_served": ["Retail","Fintech","Healthcare","SaaS","Travel"],   // up to 5
  "header_tags": ["Web Development","React","UX/UI","eCommerce","CMS"],      // up to 6 short service tags
  "email": "hello@acmedigital.com",                  // real published contact email, or null
  "intro_video_url": "https://www.youtube.com/watch?v=XXXX",     // own-channel only, or null
  "awards": [{"name":"Clutch Top Web Developer","year":2023},{"name":"Google Premier Partner","year":null}],
  "notable_clients": [{"name":"Nestle","domain":"nestle.com"},{"name":"Sony","domain":"sony.com"}]
}
```

### Field rules
- `team_size` ∈ `"11-50"`, `"51-200"`, `"201-500"`, `"501-1000"`, `"1001-5000"`, `"5000+"`.
- `category_slug` must be the single best-fit slug from your assigned cluster (see below).
- `awards`: `year` is an integer or `null`. Include partner tiers & certs as awards. Only verified.
- `notable_clients`: each needs the client's real root `domain` (e.g. `"domain":"ikea.com"`) so the
  profile renders a favicon logo. Drop any client whose domain you can't determine.
- Keep `description` ASCII-friendly; straight quotes are fine.

## Valid category_slugs (use the one that best fits each company)
**Web Development:** custom-web-development, javascript-frameworks, php-frameworks, python-frameworks, ruby-on-rails, microsoft-net, java, cms-development, web-hosting-devops
**Mobile:** native-ios-development, native-android-development, cross-platform-development, specialized-mobile, game-development-services
**Software:** custom-software-development, outsourced-offshore, quality-assurance-testing, devops-sre, salesforce-crm, erp-implementation
**eCommerce:** ecommerce-platforms-services, ecommerce-specializations, subscription-recurring-commerce
**Design & UX:** web-design, ui-ux-design, branding-identity, graphic-print-design, product-design-services, digital-creative
**Digital Marketing:** search-engine-optimization-seo, paid-advertising-ppc, social-media-marketing-services, content-marketing-services, email-marketing-automation, conversion-growth, mobile-app-marketing, full-service-digital, specialized-marketing
**AI & Emerging Tech:** artificial-intelligence, machine-learning-data-science, chatbots-conversational-ai, blockchain, ar-vr-metaverse, internet-of-things-iot, rpa-automation, low-code-no-code
**IT Services & Consulting:** managed-it-services, cloud-consulting, cybersecurity-services, data-analytics, it-consulting-strategy, system-database, voip-telecom, microsoft-ecosystem
**Creative & Production:** video-production, animation-motion-graphics, audio-podcast-production, photography-services, writing-translation
**Business Services & BPO:** call-centers-customer-support, business-process-outsourcing

## Global coverage
We want true worldwide spread. Use real ISO-2 country codes. Beyond the usual US/UK/India/
Germany/Australia, deliberately include under-covered regions where your assignment says so:
LATAM (BR, MX, AR, CO, CL, UY, PE, CR), SE Asia (VN, PH, ID, MY, SG, TH), East Asia (JP, KR, CN, TW),
South Asia (IN, PK, BD, LK, NP), MENA (AE, SA, EG, TR, IL, JO, QA), Africa (ZA, NG, KE, GH, MA),
Nordics (SE, NO, DK, FI, IS), Eastern Europe (PL, UA, RO, BG, CZ, RS, LT, LV, EE, HR, HU, SK, SI),
Western/South Europe (DE, FR, NL, ES, PT, IT, BE, CH, AT, IE, GR).

## How to work
1. Read `scripts/research-500/AVOID-DOMAINS.txt` and `scripts/research-500/SCHEMA.md` (this file).
2. Use **WebSearch** + **WebFetch** to find and verify companies (load them via ToolSearch if needed).
   Good sources: Clutch / DesignRush / GoodFirms / The Manifest category+country lists, Awwwards,
   agency "about/contact/clients/awards" pages, LinkedIn company pages, YouTube channels.
3. For each candidate: open its site, confirm it's active, grab the factual record + contact email
   + awards + named clients (with domains) + own-channel video if any.
4. Write your final JSON **array** to your assigned output file (e.g. `scripts/research-500/g01.json`)
   using the Write tool. The file must be valid JSON (an array of the objects above), nothing else.
5. Return a one-line summary: count written, how many have video / awards / clients / email, file path.
