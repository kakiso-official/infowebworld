/* ═══════════════════════════════════════════════════════════════════════
   InfoWebWorld for Developers - fixed vocabularies.

   Languages (display names, slug overrides, brand icons), GitHub topic
   display names, the 19 OSS industries (slugs, icons, sector links), the
   free-API categories (icons, title phrases, related categories, hub tab
   buckets) and the SDK language order.

   Pure and isomorphic (no React, no Node APIs): pages, client islands and
   the snapshot scripts all read the same tables. Slug FUNCTIONS (and the
   language slug overrides) live in paths.ts, which stays light for client
   bundles, so the dependency runs one way (taxonomy.ts -> paths.ts).
   This file imports a few dozen Font Awesome icons: import it from server
   components, or from a client island only when it needs the icons.
   ═══════════════════════════════════════════════════════════════════════ */

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { LANGUAGE_SLUG_OVERRIDES, own } from './paths'
import {
  faArrowsRotate, faBitcoinSign, faBook, faBriefcase, faBug, faBuilding, faBus, faCalendarCheck,
  faCalendarDays, faCamera, faCar, faCartShopping, faChartLine, faCircleCheck, faCloud, faCloudArrowUp,
  faCloudSun, faCode, faCodeBranch, faCreditCard, faCubes, faDatabase, faDragon, faEnvelope, faFaceSmile,
  faFileLines, faFilm, faFlask, faGamepad, faGraduationCap, faHeartPulse, faIndustry, faLandmark,
  faLanguage, faLaptopCode, faLayerGroup, faLeaf, faLightbulb, faLink, faLocationCrosshairs,
  faMapLocationDot, faMasksTheater, faMicrochip, faMoneyBillTransfer, faMusic, faNewspaper, faPalette,
  faPaw, faPersonRunning, faPhone, faPlaneDeparture, faPlug, faRobot, faScrewdriverWrench,
  faShieldHalved, faSpellCheck, faTerminal, faTowerCell, faUserLock, faUsers, faUtensils, faVial,
  faVideo,
} from '@fortawesome/free-solid-svg-icons'
import {
  faCss3Alt, faDartLang, faDocker, faErlang, faGolang, faHtml5, faJava, faJs, faJulia, faMarkdown,
  faMicrosoft, faPhp, faPython, faRProject, faRust, faSass, faSvelte, faSwift, faTypescript, faVuejs,
} from '@fortawesome/free-brands-svg-icons'

/* Kept importable from here for existing callers; both live in paths.ts. */
export { LANGUAGE_SLUG_OVERRIDES, own }

/* ── Programming languages ───────────────────────────────────────────── */

/** Known languages with their exact display name (GitHub Linguist casing)
 *  and slug. Lets a page that only has a slug (an SDK language, a URL)
 *  print the right name. Data rows carry their own names; this table is
 *  the fallback, never a filter. */
export const LANGUAGES: ReadonlyArray<{ name: string; slug: string }> = [
  { name: 'JavaScript', slug: 'javascript' },
  { name: 'TypeScript', slug: 'typescript' },
  { name: 'Python', slug: 'python' },
  { name: 'Go', slug: 'go' },
  { name: 'Java', slug: 'java' },
  { name: 'Kotlin', slug: 'kotlin' },
  { name: 'C#', slug: 'csharp' },
  { name: '.NET', slug: 'net' },
  { name: 'C++', slug: 'cpp' },
  { name: 'C', slug: 'c' },
  { name: 'F#', slug: 'fsharp' },
  { name: 'Ruby', slug: 'ruby' },
  { name: 'PHP', slug: 'php' },
  { name: 'Rust', slug: 'rust' },
  { name: 'Swift', slug: 'swift' },
  { name: 'Dart', slug: 'dart' },
  { name: 'R', slug: 'r' },
  { name: 'Scala', slug: 'scala' },
  { name: 'Elixir', slug: 'elixir' },
  { name: 'Erlang', slug: 'erlang' },
  { name: 'Haskell', slug: 'haskell' },
  { name: 'Clojure', slug: 'clojure' },
  { name: 'OCaml', slug: 'ocaml' },
  { name: 'Julia', slug: 'julia' },
  { name: 'Lua', slug: 'lua' },
  { name: 'Perl', slug: 'perl' },
  { name: 'Groovy', slug: 'groovy' },
  { name: 'Solidity', slug: 'solidity' },
  { name: 'Zig', slug: 'zig' },
  { name: 'Nim', slug: 'nim' },
  { name: 'Crystal', slug: 'crystal' },
  { name: 'Elm', slug: 'elm' },
  { name: 'MATLAB', slug: 'matlab' },
  { name: 'Fortran', slug: 'fortran' },
  { name: 'Cuda', slug: 'cuda' },
  { name: 'Assembly', slug: 'assembly' },
  { name: 'WebAssembly', slug: 'webassembly' },
  { name: 'Objective-C', slug: 'objective-c' },
  { name: 'Objective-C++', slug: 'objective-cpp' },
  { name: 'Visual Basic .NET', slug: 'visual-basic-net' },
  { name: 'Shell', slug: 'shell' },
  { name: 'PowerShell', slug: 'powershell' },
  { name: 'Batchfile', slug: 'batchfile' },
  { name: 'Makefile', slug: 'makefile' },
  { name: 'CMake', slug: 'cmake' },
  { name: 'Starlark', slug: 'starlark' },
  { name: 'Nix', slug: 'nix' },
  { name: 'HCL', slug: 'hcl' },
  { name: 'Dockerfile', slug: 'dockerfile' },
  { name: 'Jupyter Notebook', slug: 'jupyter-notebook' },
  { name: 'Vim Script', slug: 'vim-script' },
  { name: 'HTML', slug: 'html' },
  { name: 'CSS', slug: 'css' },
  { name: 'SCSS', slug: 'scss' },
  { name: 'Vue', slug: 'vue' },
  { name: 'Svelte', slug: 'svelte' },
  { name: 'Astro', slug: 'astro' },
  { name: 'MDX', slug: 'mdx' },
  { name: 'Markdown', slug: 'markdown' },
  { name: 'TeX', slug: 'tex' },
  { name: 'Jsonnet', slug: 'jsonnet' },
  { name: 'Smarty', slug: 'smarty' },
  { name: 'Other', slug: 'other' },
]

const LANGUAGE_NAME_BY_SLUG = new Map(LANGUAGES.map(l => [l.slug, l.name]))

/** Display name for a language slug ('csharp' -> 'C#'), or null when the
 *  slug is not in LANGUAGES (use the name stored in the data instead). */
export function languageNameFromSlug(slug: string): string | null {
  return LANGUAGE_NAME_BY_SLUG.get(slug) ?? null
}

/* Font Awesome brand icons, only where the language has its own mark (4.15).
   C# and everything else without one falls back to faCode; .NET gets the
   Microsoft mark (spec: for .NET only). */
const LANGUAGE_ICONS: Readonly<Record<string, IconDefinition>> = {
  javascript: faJs,
  typescript: faTypescript,
  python: faPython,
  go: faGolang,
  java: faJava,
  rust: faRust,
  php: faPhp,
  swift: faSwift,
  dart: faDartLang,
  r: faRProject,
  julia: faJulia,
  erlang: faErlang,
  net: faMicrosoft,
  dockerfile: faDocker,
  html: faHtml5,
  css: faCss3Alt,
  scss: faSass,
  vue: faVuejs,
  svelte: faSvelte,
  markdown: faMarkdown,
}

/** Font Awesome icon for a language slug (faCode when it has no brand mark). */
export function languageIcon(slug: string): IconDefinition {
  return own(LANGUAGE_ICONS, slug) ?? faCode
}

/** True when languageIcon(slug) is the language's own brand mark. */
export function hasLanguageBrandIcon(slug: string): boolean {
  return own(LANGUAGE_ICONS, slug) !== undefined
}

/** Dot colour for a language with no GitHub colour (4.1). */
export const LANGUAGE_FALLBACK_COLOR = '#9CA3AF'

/* ── GitHub topics ───────────────────────────────────────────────────── */

/* Words that title-casing would get wrong. Section 3.11's acronym map plus
   the product and brand names that appear as GitHub topics, written the
   way their owners write them. Alias topics keep their own spelling
   (golang -> Golang, reactjs -> ReactJS, k8s -> K8s): each topic has its
   own page, and 'go' and 'golang' both reading "Go" gave two pages the
   same title and H1. */
const TOPIC_WORDS: Readonly<Record<string, string>> = {
  ai: 'AI', api: 'API', apis: 'APIs', cli: 'CLI', css: 'CSS', gpu: 'GPU', grpc: 'gRPC', http: 'HTTP',
  ios: 'iOS', iot: 'IoT', json: 'JSON', k8s: 'K8s', llm: 'LLM', llms: 'LLMs', ml: 'ML',
  nlp: 'NLP', orm: 'ORM', rest: 'REST', sdk: 'SDK', sdks: 'SDKs', sql: 'SQL', ui: 'UI', ux: 'UX',
  wasm: 'Wasm', xml: 'XML', graphql: 'GraphQL',
  aws: 'AWS', gcp: 'GCP', ci: 'CI', cd: 'CD', cicd: 'CI/CD', rag: 'RAG', gpt: 'GPT', jwt: 'JWT',
  html: 'HTML', html5: 'HTML5', dns: 'DNS', tls: 'TLS', ssl: 'SSL', ssh: 'SSH', p2p: 'P2P',
  saas: 'SaaS', oauth: 'OAuth', oauth2: 'OAuth2', yaml: 'YAML', csv: 'CSV', pdf: 'PDF', ocr: 'OCR',
  cuda: 'CUDA', cpu: 'CPU', ide: 'IDE', jvm: 'JVM', mcp: 'MCP', rpc: 'RPC', sso: 'SSO', ar: 'AR',
  vr: 'VR', db: 'DB', etl: 'ETL', olap: 'OLAP', wasi: 'WASI', ebpf: 'eBPF', webrtc: 'WebRTC',
  websocket: 'WebSocket', websockets: 'WebSockets', javascript: 'JavaScript', typescript: 'TypeScript',
  github: 'GitHub', gitlab: 'GitLab', nodejs: 'Node.js', nextjs: 'Next.js', vuejs: 'Vue.js',
  reactjs: 'ReactJS', golang: 'Golang', cpp: 'C++', csharp: 'C#', dotnet: '.NET', macos: 'macOS',
  devops: 'DevOps', postgresql: 'PostgreSQL', postgres: 'Postgres', mysql: 'MySQL', mongodb: 'MongoDB',
  sqlite: 'SQLite', redis: 'Redis', webassembly: 'WebAssembly', openai: 'OpenAI', pytorch: 'PyTorch',
  tensorflow: 'TensorFlow', vscode: 'VS Code', npm: 'npm', iac: 'IaC', opentelemetry: 'OpenTelemetry',
  devtools: 'DevTools', fastapi: 'FastAPI',
}

/** Display name for a GitHub topic: 'machine-learning' -> 'Machine Learning',
 *  'llm' -> 'LLM', 'golang' -> 'Golang', 'graphql-api' -> 'GraphQL API'. */
export function humanizeTopic(topic: string): string {
  const whole = own(TOPIC_WORDS, topic)
  if (whole) return whole
  return topic
    .split('-')
    .filter(Boolean)
    .map(word => own(TOPIC_WORDS, word) ?? (word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ')
}

/* ── Industries (open-source companies) ──────────────────────────────── */

export const INDUSTRY_NAMES = [
  'Big Tech',
  'Cloud & Infrastructure',
  'Developer Tools',
  'Data & Databases',
  'AI & Machine Learning',
  'Security',
  'Fintech & Payments',
  'E-commerce & Retail',
  'Consumer Internet & Social',
  'Media & Entertainment',
  'Mobility & Travel',
  'Enterprise Software',
  'Hardware & Semiconductors',
  'Telecom',
  'Gaming',
  'Healthcare',
  'Education',
  'IT Services & Consulting',
  'Government & Public Sector',
] as const

export type IndustryName = typeof INDUSTRY_NAMES[number]

export interface Industry {
  name: IndustryName
  /** industrySlug(name) from paths.ts, written out so the table reads alone. */
  slug: string
  icon: IconDefinition
}

export const INDUSTRIES: readonly Industry[] = [
  { name: 'Big Tech', slug: 'big-tech', icon: faBuilding },
  { name: 'Cloud & Infrastructure', slug: 'cloud-and-infrastructure', icon: faCloud },
  { name: 'Developer Tools', slug: 'developer-tools', icon: faScrewdriverWrench },
  { name: 'Data & Databases', slug: 'data-and-databases', icon: faDatabase },
  { name: 'AI & Machine Learning', slug: 'ai-and-machine-learning', icon: faRobot },
  { name: 'Security', slug: 'security', icon: faShieldHalved },
  { name: 'Fintech & Payments', slug: 'fintech-and-payments', icon: faCreditCard },
  { name: 'E-commerce & Retail', slug: 'e-commerce-and-retail', icon: faCartShopping },
  { name: 'Consumer Internet & Social', slug: 'consumer-internet-and-social', icon: faUsers },
  { name: 'Media & Entertainment', slug: 'media-and-entertainment', icon: faFilm },
  { name: 'Mobility & Travel', slug: 'mobility-and-travel', icon: faPlaneDeparture },
  { name: 'Enterprise Software', slug: 'enterprise-software', icon: faLayerGroup },
  { name: 'Hardware & Semiconductors', slug: 'hardware-and-semiconductors', icon: faMicrochip },
  { name: 'Telecom', slug: 'telecom', icon: faTowerCell },
  { name: 'Gaming', slug: 'gaming', icon: faGamepad },
  { name: 'Healthcare', slug: 'healthcare', icon: faHeartPulse },
  { name: 'Education', slug: 'education', icon: faGraduationCap },
  { name: 'IT Services & Consulting', slug: 'it-services-and-consulting', icon: faLaptopCode },
  { name: 'Government & Public Sector', slug: 'government-and-public-sector', icon: faLandmark },
]

const INDUSTRY_BY_NAME = new Map<string, Industry>(INDUSTRIES.map(i => [i.name, i]))
const INDUSTRY_BY_SLUG = new Map<string, Industry>(INDUSTRIES.map(i => [i.slug, i]))

/** The industry with this exact name or slug, or null. */
export function findIndustry(nameOrSlug: string): Industry | null {
  return INDUSTRY_BY_NAME.get(nameOrSlug) ?? INDUSTRY_BY_SLUG.get(nameOrSlug) ?? null
}

/** Font Awesome icon for an industry name or slug (faIndustry fallback). */
export function industryIcon(nameOrSlug: string): IconDefinition {
  return findIndustry(nameOrSlug)?.icon ?? faIndustry
}

/** Industry -> InfoWebWorld L1 sector slug (lib/sector-paths.ts), section
 *  2.6. Industries left out have no matching sector directory and get no
 *  sector link. */
export const INDUSTRY_TO_SECTOR: Readonly<Partial<Record<IndustryName, string>>> = {
  'AI & Machine Learning': 'ai-ml',
  'Developer Tools': 'software-saas',
  'Data & Databases': 'software-saas',
  'Cloud & Infrastructure': 'software-saas',
  'Enterprise Software': 'software-saas',
  'Security': 'software-saas',
  'Fintech & Payments': 'software-saas',
  'IT Services & Consulting': 'it-services-agencies',
}

/** Sector slug for an industry name or slug, or null when it has none. */
export function industrySector(nameOrSlug: string): string | null {
  const industry = findIndustry(nameOrSlug)
  return industry ? INDUSTRY_TO_SECTOR[industry.name] ?? null : null
}

/* ── Free API categories ─────────────────────────────────────────────── */

/* Keyed by the dataset's category slug (public-apis categories, 51). */
const CATEGORY_ICONS: Readonly<Record<string, IconDefinition>> = {
  'animals': faPaw,
  'anime': faDragon,
  'anti-malware': faBug,
  'art-and-design': faPalette,
  'authentication-and-authorization': faUserLock,
  'blockchain': faCubes,
  'books': faBook,
  'business': faBuilding,
  'calendar': faCalendarDays,
  'cloud-storage-and-file-sharing': faCloudArrowUp,
  'continuous-integration': faArrowsRotate,
  'cryptocurrency': faBitcoinSign,
  'currency-exchange': faMoneyBillTransfer,
  'data-validation': faCircleCheck,
  'development': faCode,
  'dictionaries': faSpellCheck,
  'documents-and-productivity': faFileLines,
  'email': faEnvelope,
  'entertainment': faMasksTheater,
  'environment': faLeaf,
  'events': faCalendarCheck,
  'finance': faChartLine,
  'food-and-drink': faUtensils,
  'games-and-comics': faGamepad,
  'geocoding': faMapLocationDot,
  'government': faLandmark,
  'health': faHeartPulse,
  'jobs': faBriefcase,
  'machine-learning': faRobot,
  'music': faMusic,
  'news': faNewspaper,
  'open-data': faDatabase,
  'open-source-projects': faCodeBranch,
  'patent': faLightbulb,
  'personality': faFaceSmile,
  'phone': faPhone,
  'photography': faCamera,
  'programming': faTerminal,
  'science-and-math': faFlask,
  'security': faShieldHalved,
  'shopping': faCartShopping,
  'social': faUsers,
  'sports-and-fitness': faPersonRunning,
  'test-data': faVial,
  'text-analysis': faLanguage,
  'tracking': faLocationCrosshairs,
  'transportation': faBus,
  'url-shorteners': faLink,
  'vehicle': faCar,
  'video': faVideo,
  'weather': faCloudSun,
}

/** Every category slug this module knows, in the dataset's order. */
export const API_CATEGORY_SLUGS: readonly string[] = Object.keys(CATEGORY_ICONS)

/** Font Awesome icon for an API category slug (faPlug fallback). */
export function apiCategoryIcon(slug: string): IconDefinition {
  return own(CATEGORY_ICONS, slug) ?? faPlug
}

/* How a category reads inside "Free {Category} APIs" when its dataset name
   does not (plural nouns -> singular, long names -> the searched phrase).
   Everything else is the dataset name with '&' written as 'and'. */
const CATEGORY_PHRASES: Readonly<Record<string, string>> = {
  'animals': 'Animal',
  'books': 'Book',
  'cloud-storage-and-file-sharing': 'Cloud Storage',
  'dictionaries': 'Dictionary',
  'events': 'Event',
  'games-and-comics': 'Games and Comics',
  'jobs': 'Job',
  'open-source-projects': 'Open Source Project',
  'social': 'Social Media',
  'url-shorteners': 'URL Shortener',
}

/** Title-case phrase for "Free {phrase} APIs": ('weather', 'Weather') ->
 *  'Weather', ('art-and-design', 'Art & Design') -> 'Art and Design'. */
export function apiCategoryPhrase(slug: string, name: string): string {
  return own(CATEGORY_PHRASES, slug) ?? name.replace(/\s*&\s*/g, ' and ')
}

/** The same phrase mid-sentence ("{n} free weather APIs"); acronyms such
 *  as URL keep their capitals. */
export function apiCategoryPhraseLower(slug: string, name: string): string {
  return apiCategoryPhrase(slug, name)
    .split(' ')
    .map(word => (/^[A-Z0-9]{2,}$/.test(word) ? word : word.toLowerCase()))
    .join(' ')
}

/** "Related categories" chips on a category page (3.14): a static map of
 *  neighbours, each 3-6 existing category slugs. */
export const RELATED_API_CATEGORIES: Readonly<Record<string, readonly string[]>> = {
  'animals': ['science-and-math', 'environment', 'photography', 'open-data'],
  'anime': ['games-and-comics', 'entertainment', 'video', 'books'],
  'anti-malware': ['security', 'url-shorteners', 'data-validation', 'development'],
  'art-and-design': ['photography', 'video', 'documents-and-productivity', 'entertainment'],
  'authentication-and-authorization': ['security', 'development', 'email', 'phone'],
  'blockchain': ['cryptocurrency', 'finance', 'currency-exchange', 'security'],
  'books': ['dictionaries', 'news', 'anime', 'documents-and-productivity'],
  'business': ['finance', 'jobs', 'documents-and-productivity', 'email', 'open-data'],
  'calendar': ['events', 'documents-and-productivity', 'email', 'government'],
  'cloud-storage-and-file-sharing': ['documents-and-productivity', 'development', 'photography', 'continuous-integration'],
  'continuous-integration': ['development', 'programming', 'open-source-projects', 'cloud-storage-and-file-sharing'],
  'cryptocurrency': ['blockchain', 'currency-exchange', 'finance', 'business'],
  'currency-exchange': ['finance', 'cryptocurrency', 'business', 'shopping'],
  'data-validation': ['phone', 'email', 'test-data', 'security', 'geocoding'],
  'development': ['programming', 'continuous-integration', 'open-source-projects', 'test-data', 'data-validation'],
  'dictionaries': ['text-analysis', 'books', 'machine-learning'],
  'documents-and-productivity': ['cloud-storage-and-file-sharing', 'calendar', 'business', 'email'],
  'email': ['data-validation', 'authentication-and-authorization', 'business', 'documents-and-productivity'],
  'entertainment': ['video', 'music', 'games-and-comics', 'anime', 'personality'],
  'environment': ['weather', 'science-and-math', 'open-data', 'government', 'transportation'],
  'events': ['calendar', 'music', 'sports-and-fitness', 'entertainment'],
  'finance': ['currency-exchange', 'cryptocurrency', 'business', 'open-data'],
  'food-and-drink': ['health', 'shopping', 'open-data'],
  'games-and-comics': ['anime', 'entertainment', 'sports-and-fitness', 'video'],
  'geocoding': ['transportation', 'weather', 'tracking', 'open-data', 'government'],
  'government': ['open-data', 'environment', 'geocoding', 'health', 'patent'],
  'health': ['food-and-drink', 'sports-and-fitness', 'science-and-math', 'open-data', 'government'],
  'jobs': ['business', 'government', 'open-data'],
  'machine-learning': ['text-analysis', 'photography', 'dictionaries', 'science-and-math', 'development'],
  'music': ['video', 'entertainment', 'events'],
  'news': ['social', 'books', 'government', 'open-data'],
  'open-data': ['government', 'science-and-math', 'environment', 'transportation', 'geocoding'],
  'open-source-projects': ['development', 'programming', 'continuous-integration'],
  'patent': ['government', 'science-and-math', 'business'],
  'personality': ['entertainment', 'social', 'text-analysis'],
  'phone': ['data-validation', 'authentication-and-authorization', 'email'],
  'photography': ['art-and-design', 'video', 'machine-learning'],
  'programming': ['development', 'open-source-projects', 'continuous-integration', 'test-data'],
  'science-and-math': ['open-data', 'environment', 'health', 'machine-learning'],
  'security': ['anti-malware', 'authentication-and-authorization', 'data-validation'],
  'shopping': ['business', 'food-and-drink', 'currency-exchange', 'tracking'],
  'social': ['news', 'video', 'music', 'personality'],
  'sports-and-fitness': ['health', 'events', 'games-and-comics'],
  'test-data': ['development', 'data-validation', 'programming'],
  'text-analysis': ['machine-learning', 'dictionaries', 'documents-and-productivity'],
  'tracking': ['transportation', 'shopping', 'geocoding'],
  'transportation': ['geocoding', 'vehicle', 'tracking', 'weather', 'government'],
  'url-shorteners': ['development', 'social', 'anti-malware'],
  'vehicle': ['transportation', 'tracking', 'government'],
  'video': ['music', 'entertainment', 'photography', 'social'],
  'weather': ['environment', 'geocoding', 'transportation', 'science-and-math'],
}

/** Related category slugs for a category (empty for an unknown slug). */
export function relatedApiCategories(slug: string): readonly string[] {
  return own(RELATED_API_CATEGORIES, slug) ?? []
}

/** Tags that put an enriched API in the AI and LLM collection (3.16),
 *  together with the machine-learning category. A bare 'ai' tag is NOT
 *  one of them: providers add it to almost anything (analytics, job
 *  boards, meme generators), so only tags that name a model capability
 *  count. */
export const AI_LLM_TAGS: readonly string[] = [
  'llm', 'generative-ai', 'language-models', 'text-generation', 'embeddings', 'speech', 'text-to-speech',
  'vision', 'image-generation', 'chatbot',
]

/** Category slug of the AI and LLM collection's base category. */
export const AI_LLM_CATEGORY = 'machine-learning'

export interface ApiTabBucket {
  id: 'all' | 'ai-llm' | 'data' | 'developer-tools'
  label: string
  /** null = every category. */
  categories: readonly string[] | null
  /** An API also joins the bucket when it carries one of these tags. */
  tags: readonly string[]
}

/** Tabs of the "Popular free APIs with official SDKs" band on the free
 *  APIs hub (3.13), in display order. */
export const API_TAB_BUCKETS: readonly ApiTabBucket[] = [
  { id: 'all', label: 'All', categories: null, tags: [] },
  { id: 'ai-llm', label: 'AI and LLM', categories: [AI_LLM_CATEGORY, 'text-analysis'], tags: AI_LLM_TAGS },
  {
    id: 'data',
    label: 'Data',
    categories: [
      'open-data', 'government', 'science-and-math', 'weather', 'geocoding', 'finance', 'currency-exchange',
      'cryptocurrency', 'environment', 'health', 'transportation', 'sports-and-fitness', 'news',
    ],
    tags: [],
  },
  {
    id: 'developer-tools',
    label: 'Developer tools',
    categories: [
      'development', 'programming', 'continuous-integration', 'authentication-and-authorization',
      'data-validation', 'cloud-storage-and-file-sharing', 'email', 'security', 'anti-malware', 'test-data',
      'open-source-projects', 'url-shorteners', 'phone', 'tracking', 'documents-and-productivity',
    ],
    tags: [],
  },
]

/** True when an API (its category slug and tags) belongs in a hub tab. */
export function apiInTabBucket(bucket: ApiTabBucket, api: { categorySlug: string; tags: readonly string[] }): boolean {
  if (bucket.categories === null) return true
  if (bucket.categories.includes(api.categorySlug)) return true
  return api.tags.some(tag => bucket.tags.includes(tag))
}

/* ── SDK languages ───────────────────────────────────────────────────── */

/** Fixed order of SDK languages on API pages and SDK indexes (3.15).
 *  Languages not listed follow, A-Z, and 'other' always comes last. */
export const SDK_LANGUAGE_ORDER: readonly string[] = [
  'javascript', 'typescript', 'python', 'go', 'java', 'kotlin', 'csharp', 'net', 'ruby', 'php', 'rust', 'swift', 'dart',
]

/** Sort rank of an SDK language slug: its index in SDK_LANGUAGE_ORDER,
 *  then every unlisted language, then 'other'. */
export function sdkLanguageRank(slug: string): number {
  const i = SDK_LANGUAGE_ORDER.indexOf(slug)
  if (i >= 0) return i
  return slug === 'other' ? SDK_LANGUAGE_ORDER.length + 1 : SDK_LANGUAGE_ORDER.length
}

/** Comparator for SDK rows or language tiles: fixed order, then A-Z by name. */
export function compareSdkLanguages(
  a: { languageSlug: string; language: string },
  b: { languageSlug: string; language: string },
): number {
  return sdkLanguageRank(a.languageSlug) - sdkLanguageRank(b.languageSlug) || a.language.localeCompare(b.language, 'en')
}

/* JavaScript + TypeScript and C# + .NET share one SDK tab on an API page;
   every other language is its own tab. */
const SDK_TAB_GROUPS: Readonly<Record<string, { key: string; label: string }>> = {
  javascript: { key: 'javascript', label: 'JavaScript / TypeScript' },
  typescript: { key: 'javascript', label: 'JavaScript / TypeScript' },
  csharp: { key: 'csharp', label: 'C# / .NET' },
  net: { key: 'csharp', label: 'C# / .NET' },
}

/** The SdkTabs tab an SDK language belongs to: {key, label}. */
export function sdkTabFor(languageSlug: string, languageName: string): { key: string; label: string } {
  if (languageSlug === 'other') return { key: 'other', label: 'Other' }
  return own(SDK_TAB_GROUPS, languageSlug) ?? { key: languageSlug, label: languageName }
}
