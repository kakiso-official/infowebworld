import type { TextLink } from '../components/linked-text'
import { sectorLandingPath } from '@/lib/sector-paths'

/* ═══════════════════════════════════════════════════════════════════════
   /glossary copy - one source for the visible definitions AND the
   DefinedTermSet JSON-LD.

   Terms and definitions are from the SEO specialist's brief (Oct 2026), in
   the brief's order. Deliberate changes: every "See ..." pointer is a link
   (a few were plain text in the brief), sector links use the current
   directory URLs (lib/sector-paths.ts) instead of the old redirecting
   ones, and "Business Listing Approval" matches the /faqs answer (no fixed
   timeline for free listings) instead of the brief's "3 to 5 business
   days", so the two pages don't contradict each other.
   ═══════════════════════════════════════════════════════════════════════ */

export type GlossaryTerm = { term: string; def: string; links?: TextLink[] }
export type GlossaryGroup = { letter: string; terms: GlossaryTerm[] }

export const GLOSSARY_INTRO =
  'This glossary explains the terms you will meet when you search a business directory, list your business, or work on SEO and AI search visibility. Each definition is one or two lines in plain English. Bookmark it, or ask us to add a term.'

const PLANS: TextLink = { text: 'Plans & Pricing', href: '/business/plans' }
const GUIDELINES: TextLink = { text: 'Content Guidelines', href: '/content-guidelines' }
const IT_DIR: TextLink = { text: 'IT Services & Agencies', href: sectorLandingPath('it-services-agencies') }
const STARTUP_DIR: TextLink = { text: 'Startups & Innovation', href: sectorLandingPath('startups-innovation') }

export const GLOSSARY: GlossaryGroup[] = [
  {
    letter: 'A',
    terms: [
      { term: 'AEO (Answer Engine Optimization)', def: 'The practice of structuring content so it surfaces well in AI answer engines like Perplexity, ChatGPT Search, and Google AI Overviews. Sibling discipline to SEO, increasingly important.' },
      { term: 'AI Search Visibility', def: 'How often and how well a business appears in answers from AI assistants such as ChatGPT and Perplexity.' },
      { term: 'Angel Investor', def: 'A wealthy individual who invests their own money in an early-stage startup.' },
      { term: 'API Access', def: 'A programmatic interface for managing your listing - available on the Lifetime plan. Lets you automate updates, reviews, and analytics from your own systems.' },
      { term: 'API (Application Programming Interface)', def: 'A way for two software programs to talk to each other and share data.' },
      { term: 'Artificial Intelligence (AI)', def: 'Computer systems that do tasks that normally need human thinking, such as understanding text or images.' },
    ],
  },
  {
    letter: 'B',
    terms: [
      { term: 'B2B (Business-to-Business)', def: 'Selling products or services from one business to another, such as accounting software sold to companies.' },
      { term: 'B2B Marketplace', def: 'An online platform where businesses buy from and sell to other businesses.' },
      { term: 'B2C (Business-to-Consumer)', def: 'Selling directly to individual customers, like a shop or an online store.' },
      { term: 'Backlink', def: 'A link from another website to yours. Search engines treat high-quality backlinks as endorsement signals. InfoWebWorld paid listings include a permanent dofollow backlink.' },
      { term: 'Badge', def: 'A visual marker on a listing indicating status (Verified, Top Rated, Early Adopter, etc.). Badges increase click-through and trust.' },
      { term: 'Bootstrapping', def: 'Building a company with your own money and revenue, without outside investors.' },
      { term: 'Brand Awareness', def: 'How well people recognise and remember your business.' },
      { term: 'Business Accelerator', def: 'A short, intensive programme that helps startups grow fast, often in exchange for equity.' },
      { term: 'Business Account', def: 'The account a business uses to create and manage its listings. See Business login.', links: [{ text: 'Business login', href: '/dashboard' }] },
      { term: 'Business Categories', def: 'Groups used to sort businesses by what they do, such as software, restaurants or accounting. See Browse all categories.', links: [{ text: 'Browse all categories', href: '/categories' }] },
      { term: 'Business Citation', def: "Any online mention of a business's name, address and phone number, usually in a directory." },
      { term: 'Business Classification', def: 'A system that sorts companies into standard industry groups, which makes them easier to compare and search.' },
      { term: 'Business Contact Information', def: 'The details customers use to reach you, such as phone, email, address and website.' },
      { term: 'Business Dashboard', def: 'The control panel where owners edit listings, track visitors and manage reviews.' },
      { term: 'Business Database', def: 'An organised collection of company records that can be searched, filtered or exported.' },
      { term: 'Business Directory', def: 'An online or printed list of businesses sorted by category, location or industry so people can find and contact them. See business directory.', links: [{ text: 'business directory', href: '/categories' }] },
      { term: 'Business Directory Listing', def: "Another name for a business listing: a company's profile page inside a directory." },
      { term: 'Business Directory Website', def: 'A website whose main purpose is hosting a searchable directory of business listings. See InfoWebWorld.', links: [{ text: 'InfoWebWorld', href: '/about' }] },
      { term: 'Business Discovery', def: 'How buyers find businesses they did not know about, through search, directories, reviews and recommendations.' },
      { term: 'Business Incubator', def: 'A programme that supports very early startups with space, mentoring and resources.' },
      { term: 'Business Information', def: 'The basic facts about a business, such as its name, address, phone number, website, category and opening hours.' },
      { term: 'Business Leads', def: 'Potential customers or companies that have shown interest and may become buyers.' },
      { term: 'Business Listing', def: "One company's entry in a directory, showing its name, category, location, website and contact details." },
      { term: 'Business Listing Approval', def: 'The review a directory does before a submitted listing goes live. On InfoWebWorld, paid listings are reviewed within 48 hours, and there is no specific timeline for free listing approval.' },
      { term: 'Business Listing Guidelines', def: 'Rules for what a listing must include and what is not allowed. See Content Guidelines.', links: [GUIDELINES] },
      { term: 'Business Listing SEO', def: 'Optimising a directory listing with accurate details, a clear description and the right category so it ranks and gets clicks.' },
      { term: 'Business Listing Status', def: 'Where a listing stands in the process, such as pending review, approved or live.' },
      { term: 'Business Listing Submission', def: 'Sending your business details to a directory so it can review and publish them. See Get Listed.', links: [{ text: 'Get Listed', href: '/business' }] },
      { term: 'Business Listing Verification', def: 'Confirming that the person managing a listing is really connected to the business.' },
      { term: 'Business Listing Website', def: 'A website where companies publish listings so customers can find them.' },
      { term: 'Business Location', def: 'The place where a business operates, such as its office, shop or service area.' },
      { term: 'Business Model', def: 'How a company makes money: who it sells to, what it sells and how it charges.' },
      { term: 'Business Networking', def: 'Building professional relationships to share leads, advice and opportunities.' },
      { term: 'Business Portfolio', def: "A showcase of a business's past work, projects or products." },
      { term: 'Business Profile', def: "A public page with a business's key details, services and customer reviews. It is often used for local and small businesses." },
      { term: 'Business Registration', def: 'Officially registering a company with the government. It can also mean signing up a business on a platform.' },
      { term: 'Business Search', def: 'Looking for companies by name, category, location or keyword in a directory or search engine.' },
      { term: 'Business Subscription Plan', def: 'A paid plan, billed yearly or once, that unlocks more features for your listing. See Plans & Pricing.', links: [PLANS] },
      { term: 'Business-to-Business Services', def: 'Services one company sells to other companies, such as consulting, IT support or logistics.' },
      { term: 'Business Verification', def: 'Checks that confirm a business is real and its details are correct, such as reviewing its website or domain email.' },
      { term: 'Business Visibility', def: 'How easily customers can find your business in search, directories and AI answers.' },
      { term: 'Buyer-Supplier Network', def: 'A group of buyers and suppliers connected so they can find each other and trade.' },
    ],
  },
  {
    letter: 'C',
    terms: [
      { term: 'C2C (Consumer-to-Consumer)', def: 'Individuals selling to other individuals, usually through a marketplace or classifieds site.' },
      { term: 'Canonical URL', def: 'The main version of a page that tells search engines which address to count when similar pages exist.' },
      { term: 'Category', def: 'A classification of businesses by industry. InfoWebWorld has three levels: sector (L1, e.g. AI & ML), category (L2, e.g. AI Chatbots), subcategory (L3, e.g. Customer Support Chatbots).' },
      { term: 'Claim a Business Listing', def: 'Taking ownership of an existing listing so you can edit it, usually after proving you represent the business.' },
      { term: 'Claim Listing', def: 'Take ownership of an existing business listing. Typically requires verifying your affiliation via domain email or DNS record.' },
      { term: 'Cloud Computing', def: 'Using servers and storage over the internet instead of owning them yourself.' },
      { term: 'Co-Founder', def: 'One of two or more people who start a company together.' },
      { term: 'Company Directory', def: 'A list of companies, often grouped by industry or place, used to find suppliers, partners or service providers.' },
      { term: 'Company Profile', def: 'A page that summarises a company: what it does, where it is, how to contact it, and what customers say.' },
      { term: 'Content Marketing', def: 'Creating helpful articles, guides or videos to attract and inform potential customers.' },
      { term: 'Conversion Rate', def: 'The share of visitors who take a wanted action, such as sending an enquiry or buying.' },
      { term: 'Country-Specific Business Listing', def: "A listing placed in one country's pages so local buyers can find the business. See Browse by Country.", links: [{ text: 'Browse by Country', href: '/countries' }] },
      { term: 'Crawling', def: 'When search engine bots visit and read pages by following links.' },
      { term: 'CRM (Customer Relationship Management)', def: 'Software that stores customer details and tracks every contact, so teams can sell and support better.' },
      { term: 'CTR (Click-Through Rate)', def: 'The percentage of people who see your listing in search results or category pages and click it. A key engagement metric.' },
      { term: 'Customer Acquisition', def: 'Winning new customers for your business.' },
      { term: 'Customer Reviews', def: 'Ratings and written feedback from people who have used a business. See Write a review.', links: [{ text: 'Write a review', href: '/write-review' }] },
      { term: 'Cybersecurity', def: 'Protecting computers, networks and data from attacks and unauthorised access.' },
    ],
  },
  {
    letter: 'D',
    terms: [
      { term: 'D2C (Direct-to-Consumer)', def: 'A brand selling straight to customers through its own channels, without retailers in the middle.' },
      { term: 'DA/DR (Domain Authority/Rating)', def: 'Third-party metrics (Moz, Ahrefs) estimating the SEO strength of a website. Higher is better for outbound backlinks.' },
      { term: 'Digital Marketing', def: 'Promoting a business online through search, social media, email, ads and content.' },
      { term: 'Digital Transformation', def: 'Using digital tools to change how a business works and serves customers.' },
      { term: 'Distributor Directory', def: 'A directory of distributors that move products from manufacturers to sellers.' },
      { term: 'Dofollow', def: 'A link attribute that signals to search engines to follow and count the link for ranking. Dofollow backlinks from trusted sites are SEO gold.' },
      { term: 'Duplicate Business Listing', def: 'Two or more listings for the same business, which confuse buyers and search engines.' },
    ],
  },
  {
    letter: 'E',
    terms: [
      { term: 'E-E-A-T', def: 'Experience, Expertise, Authoritativeness and Trustworthiness: the qualities Google looks for in helpful content.' },
      { term: 'Email Marketing', def: 'Sending messages to subscribers to inform, nurture and sell.' },
      { term: 'Enterprise', def: 'A large company with many employees, teams and locations.' },
      { term: 'Entity SEO', def: 'Helping search engines and AI understand your business as a clear "thing" with consistent facts across the web.' },
      { term: 'Entrepreneurship', def: 'Starting and running a business, taking on risk in the hope of profit.' },
      { term: 'ERP (Enterprise Resource Planning)', def: "Software that connects a company's finance, stock, HR and operations in one system." },
    ],
  },
  {
    letter: 'F',
    terms: [
      { term: 'Featured Business Listing', def: 'A listing given extra visibility, such as top placement or a highlight, usually on a paid plan.' },
      { term: 'Featured Placement', def: 'Showing a listing in a more visible spot. It is a plan feature, not sold by the click or by the day.' },
      { term: 'Founder', def: 'The person who starts a company.' },
      { term: 'Free Business Listing', def: 'A basic directory listing at no cost, with no credit card needed. See Plans & Pricing.', links: [PLANS] },
    ],
  },
  {
    letter: 'G',
    terms: [
      { term: 'Generative AI', def: 'AI that creates new text, images, audio or code from a prompt. See AI & ML Tools.', links: [{ text: 'AI & ML Tools', href: sectorLandingPath('ai-ml') }] },
      { term: 'GEO (Generative Engine Optimization)', def: 'Optimizing content and business profiles to surface in generative AI responses (citations, summaries).' },
      { term: 'Global Business Directory', def: 'A business directory that lists companies from many countries, so buyers can search for suppliers and services worldwide. See About InfoWebWorld.', links: [{ text: 'About InfoWebWorld', href: '/about' }] },
      { term: 'Global Business Listing', def: 'A listing that makes a company findable by buyers in many countries.' },
    ],
  },
  {
    letter: 'I',
    terms: [
      { term: 'Indexing', def: 'When a search engine stores a page in its database so it can appear in results.' },
      { term: 'Industry Directory', def: 'A directory that covers one industry only and lists just the companies that work in that field.' },
      { term: 'Industry-Specific Directory', def: 'A directory built for one sector, such as software, healthcare or construction.' },
      { term: 'Information Technology (IT) Services', def: "Services that set up, run and support a company's computers, software and networks. See IT Services & Agencies.", links: [IT_DIR] },
      { term: 'Innovation', def: 'Creating a new or better product, service or way of working.' },
      { term: 'International Business Directory', def: 'A directory that lists businesses across several countries for cross-border buyers.' },
      { term: 'IT Services Directory', def: 'A directory of IT firms and agencies, such as web, app and software developers. See IT Services & Agencies.', links: [IT_DIR] },
    ],
  },
  {
    letter: 'K',
    terms: [
      { term: 'Keyword Research', def: 'Finding the words and phrases people type into search engines so you can write content for them.' },
      { term: 'Knowledge Graph', def: "Google's database of people, places and organisations and how they relate, used for info panels and answers." },
    ],
  },
  {
    letter: 'L',
    terms: [
      { term: 'Lead', def: 'A potential customer who has shown interest - by submitting a contact form, requesting a demo, calling, or otherwise engaging with your listing.' },
      { term: 'Lead Generation', def: 'Attracting people who may want to buy and capturing their interest, for example through a form or enquiry.' },
      { term: 'Listing', def: "A business's public profile on InfoWebWorld - name, logo, description, category, reviews, media, and more." },
      { term: 'Listing Description', def: 'The short text on a listing that explains what the business does and who it serves.' },
      { term: 'Listing Moderation', def: 'Checking listings and reviews to keep out spam, fake or rule-breaking content. See Content Guidelines.', links: [GUIDELINES] },
      { term: 'Listing Renewal', def: 'Extending a paid listing for another period. Yearly plans renew each year, while lifetime plans do not need renewal. See Plans & Pricing.', links: [PLANS] },
      { term: 'Local Business Directory', def: 'A directory of businesses in a town or city, such as restaurants, tradespeople and clinics. See Local Businesses.', links: [{ text: 'Local Businesses', href: sectorLandingPath('local-businesses') }] },
      { term: 'Local Business Search', def: 'Searching for businesses near you, usually with a city or "near me" in the query.' },
      { term: 'Local SEO', def: "Improving a business's visibility in local search results and maps for searches near the customer." },
      { term: 'Long-Tail Keyword', def: 'A longer, more specific search phrase, such as "free business listing site in Australia". It has fewer searches but clearer intent.' },
    ],
  },
  {
    letter: 'M',
    terms: [
      { term: 'Machine Learning (ML)', def: 'A type of AI where computers learn patterns from data instead of following fixed rules.' },
      { term: 'Manufacturer Directory', def: 'A directory of companies that make products, used by buyers who want to deal with the producer.' },
      { term: 'Minimum Viable Product (MVP)', def: 'The simplest version of a product that real users can try, built to test an idea.' },
      { term: 'MSME (Micro, Small and Medium Enterprise)', def: 'A term used mainly in India for micro, small and medium businesses, grouped by investment and turnover.' },
      { term: 'Multinational Corporation', def: 'A company that operates in several countries.' },
    ],
  },
  {
    letter: 'N',
    terms: [
      { term: 'NAP (Name, Address, Phone)', def: 'Core business identity data. Consistent NAP across the web is critical for local SEO. InfoWebWorld keeps NAP standardized in listings.' },
      { term: 'NAP Consistency', def: 'Using the exact same name, address and phone number everywhere online so search engines trust them.' },
      { term: 'Nofollow', def: 'A link attribute that tells search engines not to pass ranking signals. Free InfoWebWorld listings use nofollow; paid listings are dofollow.' },
    ],
  },
  {
    letter: 'O',
    terms: [
      { term: 'Off-Page SEO', def: 'Actions outside your site, such as earning backlinks and reviews, that build trust and rankings.' },
      { term: 'Online Business Directory', def: 'A website that lists companies with their name, category, location and contact details, searchable by anyone.' },
      { term: 'Online Marketplace', def: 'A website where many sellers list products or services so buyers can compare them in one place.' },
      { term: 'Online Presence', def: 'All the places your business can be found online, such as your website, directories and social profiles.' },
      { term: 'On-Page SEO', def: 'Improving things on a page, such as titles, headings, content and internal links, to rank better.' },
      { term: 'Organic Traffic', def: 'Visitors who arrive from unpaid search results.' },
    ],
  },
  {
    letter: 'P',
    terms: [
      { term: 'Paid Business Listing', def: 'A listing on a paid plan that adds extras such as a backlink, review tools and analytics. See Plans & Pricing.', links: [PLANS] },
      { term: 'Premium Listing', def: 'A paid listing with extra features and visibility, such as stronger placement and analytics.' },
      { term: 'Procurement', def: 'The process a company uses to find, compare and buy the goods and services it needs.' },
      { term: 'Product-Market Fit', def: 'When a product clearly meets a real market need and customers keep choosing it.' },
      { term: 'Professional Services Directory', def: 'A directory of advisers and specialists such as accountants, consultants and coaches. See Professional Services.', links: [{ text: 'Professional Services', href: sectorLandingPath('professional-services') }] },
    ],
  },
  {
    letter: 'R',
    terms: [
      { term: 'Referral Marketing', def: 'Getting new customers through recommendations from existing customers or partners.' },
      { term: 'Regional Business Directory', def: 'A directory that covers one region, such as a state, province or group of countries.' },
      { term: 'Reputation Management', def: 'Monitoring and shaping what people say about your business online, especially in reviews.' },
      { term: 'RFQ (Request for Quote)', def: 'A buyer-initiated request for pricing and proposals. Paid InfoWebWorld listings include an RFQ button on their profile.' },
    ],
  },
  {
    letter: 'S',
    terms: [
      { term: 'SaaS (Software as a Service)', def: 'Software you use online through a subscription instead of installing it yourself. See Software & SaaS.', links: [{ text: 'Software & SaaS', href: sectorLandingPath('software-saas') }] },
      { term: 'SaaS Company', def: 'A company that sells software as an online subscription.' },
      { term: 'SaaS Directory', def: 'A directory of SaaS products with reviews and comparisons to help buyers choose. See Software & SaaS Directory.', links: [{ text: 'Software & SaaS Directory', href: sectorLandingPath('software-saas') }] },
      { term: 'Schema Markup', def: 'Structured data (JSON-LD) that helps search engines understand your content. InfoWebWorld adds rich schema to every listing automatically.' },
      { term: 'Search Intent', def: 'The goal behind a search, such as learning, comparing or buying.' },
      { term: 'Sector', def: 'The top-level category on InfoWebWorld - AI & ML, Software & SaaS, IT Services & Agencies, Startups & Innovation, Local Businesses, Professional Services.' },
      { term: 'Seed Funding', def: 'The first outside money a startup raises, used to build a product and find early customers.' },
      { term: 'SEO (Search Engine Optimization)', def: 'The discipline of earning organic search traffic. InfoWebWorld gives you a dofollow backlink, rich snippets, and high-authority exposure.' },
      { term: 'Series A Funding', def: 'A funding round after seed, used to grow a startup that has proven its product.' },
      { term: 'Service Provider Directory', def: 'A directory of companies that offer services, such as agencies, consultants and IT firms. See IT Services & Agencies.', links: [IT_DIR] },
      { term: 'Sitemap', def: "A file listing a site's important pages so search engines can find them." },
      { term: 'Small Business', def: 'A company with few employees and modest revenue. The exact size limit differs by country.' },
      { term: 'Small Business Directory', def: 'A directory focused on small businesses, helping them get found by local and online customers.' },
      { term: 'Small Business Owner', def: 'A person who owns and usually runs a small company.' },
      { term: 'SME (Small and Medium-Sized Enterprise)', def: 'A business below a set size, often under 250 employees. The limit varies by country.' },
      { term: 'Social Proof', def: 'Evidence that others trust you, such as reviews, ratings and testimonials.' },
      { term: 'Software Company', def: 'A company that designs, builds and sells software.' },
      { term: 'Startup', def: 'A young company building a new product or service, usually aiming to grow fast. See Startups & Innovation.', links: [STARTUP_DIR] },
      { term: 'Startup Company', def: 'A newly formed business built around a new idea and designed to scale.' },
      { term: 'Startup Directory', def: 'A directory that lists startups by sector, helping investors, partners and customers discover them. See Startups & Innovation.', links: [STARTUP_DIR] },
      { term: 'Startup Ecosystem', def: 'The network of founders, investors, mentors, universities and support groups in a place or industry.' },
      { term: 'Structured Data', def: 'Code added to a page that labels its content, such as a business name or review, so machines understand it.' },
      { term: 'Supplier Directory', def: 'A directory of companies that supply goods or services, helping buyers find sources.' },
      { term: 'Supply Chain', def: 'The chain of steps and companies that turn raw materials into products delivered to customers.' },
    ],
  },
  {
    letter: 'T',
    terms: [
      { term: 'Target Audience', def: 'The specific group of people you want to reach and sell to.' },
      { term: 'Technical SEO', def: 'Fixing how a site is built, such as speed, mobile use and crawlability, so search engines can read it.' },
    ],
  },
  {
    letter: 'U',
    terms: [
      { term: 'Unicorn Startup', def: 'A privately held startup valued at over US$1 billion.' },
      { term: 'Unique Selling Proposition (USP)', def: 'The one thing that makes your business different from competitors.' },
    ],
  },
  {
    letter: 'V',
    terms: [
      { term: 'Value Proposition', def: 'A short statement of the main benefit you offer customers and why it is worth choosing you.' },
      { term: 'Vendor Directory', def: 'A directory of vendors, the companies that sell products or services to other businesses.' },
      { term: 'Venture Capital (VC)', def: 'Money invested in young companies with high growth potential in return for a share of ownership.' },
      { term: 'Verified Business Listing', def: 'A listing that has passed verification checks and carries a badge to build buyer trust.' },
      { term: 'Verified Review', def: "A review from a user whose identity we've validated. Verified reviews carry a badge and count more toward ranking." },
    ],
  },
  {
    letter: 'W',
    terms: [
      { term: 'Wholesaler Directory', def: 'A directory of wholesalers that sell goods in bulk to retailers and other businesses.' },
      { term: 'Wholesale Trade', def: 'Selling goods in large quantities, usually at lower prices, to retailers or other businesses.' },
    ],
  },
]

/** URL fragment for a term: 'AEO (Answer Engine Optimization)' ->
 *  'aeo-answer-engine-optimization'. Used for the on-page anchor and the
 *  DefinedTerm @id, so every @id resolves to a real element. */
export function termSlug(term: string): string {
  return term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}
