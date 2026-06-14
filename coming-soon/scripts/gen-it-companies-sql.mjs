#!/usr/bin/env node
/**
 * Generator: database/seed-it-companies.sql
 *
 * 9 real Indian IT-services COMPANY listings (listing_mode='company') for the
 * /profile/[slug] Clutch-style UI. Data is researched + verified (founding year,
 * HQ, headcount band, awards w/ years, official YouTube intro video, socials).
 *
 * IMPORTANT — these are seeded NOT LIVE:
 *   status        = 'pending'   (only 'active'/'paid' render on /profile/[slug])
 *   user_id       = NULL        (unowned → the "Claim Now" button works)
 *   payment_status= 'unpaid'
 * Review them in /iww-hq/submissions (Preview as published), then flip to
 * 'active' + redeploy to go live (a one-liner UPDATE is emitted at the bottom).
 *
 * Re-runnable: deletes its own slugs first. Run the .sql in phpMyAdmin → SQL.
 *
 * Regenerate:  node scripts/gen-it-companies-sql.mjs
 */
import { writeFileSync } from 'node:fs'

/* ── helpers ── */
const s = (v) => (v == null ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`)
const n = (v) => (v == null ? 'NULL' : String(Number(v)))
const j = (v) => (v == null ? 'NULL' : `'${JSON.stringify(v).replace(/'/g, "''")}'`)
const logo = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=256`

/* Client name -> official website. The Clients tab derives each logo from the
   client's `url` (clearbitFavicon -> Google favicon, which always returns an
   icon so there are no broken images) and links the chip to their site.
   A client not in this map renders an initials monogram instead of a logo. */
const CLIENT_URLS = {
  'State Bank of India': 'https://sbi.co.in',
  'Canara Bank': 'https://canarabank.com',
  'Union Bank of India': 'https://www.unionbankofindia.co.in',
  'Punjab National Bank': 'https://www.pnbindia.in',
  'Bank of Baroda': 'https://www.bankofbaroda.in',
  'LIC of India': 'https://licindia.in',
  'NABARD': 'https://www.nabard.org',
  'BHEL': 'https://www.bhel.com',
  'HDFC Bank': 'https://www.hdfcbank.com',
  'SBI Card': 'https://www.sbicard.com',
  'Tata AIG': 'https://www.tataaig.com',
  'Axis Max Life Insurance': 'https://www.maxlifeinsurance.com',
  'Vodafone': 'https://www.vodafone.com',
  'Mashreq': 'https://www.mashreq.com',
  'Income Tax Department (India)': 'https://www.incometax.gov.in',
  'SAP': 'https://www.sap.com',
  'Amazon': 'https://www.amazon.com',
  'Flipkart': 'https://www.flipkart.com',
  'Nykaa': 'https://www.nykaa.com',
  'Persistent Systems': 'https://www.persistent.com',
  'DataWeave': 'https://dataweave.com',
  'United Rentals': 'https://www.unitedrentals.com',
  'Adani': 'https://www.adani.com',
  'IndiGo': 'https://www.goindigo.in',
  'Sun Pharma': 'https://www.sunpharma.com',
  'KFC': 'https://www.kfc.com',
  'Americana': 'https://www.americanarestaurants.com',
  'ZEE5': 'https://www.zee5.com',
  'Hobby Lobby': 'https://www.hobbylobby.com',
}
const clientLogos = (names) =>
  names && names.length ? names.map((nm) => ({ name: nm, url: CLIENT_URLS[nm] })) : null

function faqs(c) {
  const out = [
    { question: `What does ${c.company_name} do?`, answer: c.description },
    {
      question: `Where is ${c.company_name} located?`,
      answer: `${c.company_name} is headquartered in ${c.hq_location}${c.founded_year ? `, and was founded in ${c.founded_year}` : ''}.`,
    },
  ]
  if (c.stock_listing) {
    out.push({
      question: `Is ${c.company_name} a publicly listed company?`,
      answer: `Yes - ${c.company_name} is a publicly listed company (${c.stock_listing}).`,
    })
  }
  out.push({
    question: `How do I get in touch with ${c.company_name}?`,
    answer: `Visit ${c.company_name}'s website or claim this profile on InfoWebWorld to connect, request a proposal, or learn more about their services.`,
  })
  return out
}

/* ── curated, verified company data (see scripts research, Jun 2026) ── */
const COMPANIES = [
  {
    company_name: 'Dynacons Systems & Solutions', slug: 'dynacons-systems-solutions', domain: 'dynacons.com',
    website: 'https://www.dynacons.com/', category_slug: 'managed-it-services',
    city: 'Mumbai', state: 'Maharashtra', hq_location: 'Mumbai, Maharashtra, India',
    tagline: 'Mumbai-based IT infrastructure and systems integration company serving 2,000+ enterprise, BFSI and government clients across India since 1995.',
    description: 'Dynacons Systems & Solutions Ltd is a BSE/NSE-listed Indian IT company founded in 1995 and headquartered in Mumbai. It delivers IT infrastructure solutions, system integration, data center and networking, managed services, cloud computing, and application development and maintenance across 250+ locations in India, serving enterprise, BFSI, government and PSU clients through its System Integration and Technology Workforce Augmentation segments.',
    founded_year: 1995, team_size: '1001-5000', phone_code: '+91', phone: '22 6688 9900',
    linkedin: 'https://www.linkedin.com/company/dynacons-systems-&-solutions-ltd-', twitter: null, facebook: 'https://www.facebook.com/Dynacons/',
    is_hiring: 1, intro_video_url: null, min_project_size: null, hourly_rate: null, common_project_size: null,
    stock_listing: 'BSE: 532365 / NSE: DSSL',
    header_tags: ['IT Infrastructure', 'System Integration', 'Managed Services', 'Cloud & Data Center', 'Networking & Security'],
    industries_served: ['Banking, Financial Services & Insurance (BFSI)', 'Government & PSUs', 'Healthcare', 'Education', 'Shipping', 'Corporate Enterprises'],
    languages: ['English', 'Hindi'],
    awards: [
      { name: 'HPE Solution Provider of the Year', year: 2025 },
      { name: 'Lenovo 360 TruScale DaaS Growth Partner of the Year - Asia Pacific', year: 2026 },
      { name: 'Versa Networks Systems Integration Partner of the Year', year: 2025 },
      { name: 'Financial Times High-Growth Companies Asia-Pacific', year: 2026 },
      { name: 'Deloitte Technology Fast 50 India', year: 2024 },
      { name: "Dun & Bradstreet India's Leading Listed ESG Entities", year: 2024 },
      { name: 'Economic Times Channel Icon - Best Managed Services Provider', year: 2021 },
    ],
    service_lines: [
      { name: 'System Integration & Infrastructure', percentage: 40 },
      { name: 'Managed Services & Infra Management', percentage: 25 },
      { name: 'Data Center & Cloud Solutions', percentage: 15 },
      { name: 'Networking & Security Solutions', percentage: 12 },
      { name: 'Application Development & Maintenance', percentage: 8 },
    ],
    focus_breakdown: [
      { name: 'System Integration', percentage: 75 },
      { name: 'Technology Workforce Augmentation', percentage: 25 },
    ],
    notable_clients: ['State Bank of India', 'Canara Bank', 'Union Bank of India', 'Punjab National Bank', 'Bank of Baroda', 'LIC of India', 'NABARD', 'BHEL'],
    clients_summary: 'Dynacons serves 2,000+ clients across 250+ locations in India, including major banks and public-sector enterprises such as State Bank of India, Canara Bank, Union Bank of India, LIC and BHEL.',
  },
  {
    company_name: 'Dev Information Technology (Dev IT)', slug: 'dev-information-technology', domain: 'devitpl.com',
    website: 'https://devitpl.com/', category_slug: 'managed-it-services',
    city: 'Ahmedabad', state: 'Gujarat', hq_location: 'Ahmedabad, Gujarat, India',
    tagline: 'Listed Indian IT services company delivering cloud, digital transformation, enterprise applications and managed IT services since 1997.',
    description: 'Dev Information Technology Limited (DEV IT) is an Ahmedabad-based IT services company founded in 1997 and publicly listed on the NSE and BSE. It provides cloud services, digital transformation, enterprise applications (Microsoft Dynamics 365), application development and managed IT services to government and enterprise clients. The company is a Microsoft and AWS partner appraised at CMMI Maturity Level 5 for Development.',
    founded_year: 1997, team_size: '501-1000', phone_code: '+91', phone: '94298 99852',
    linkedin: 'https://www.linkedin.com/company/dev-information-technology', twitter: 'https://twitter.com/Devitpl', facebook: 'https://www.facebook.com/devitpl',
    is_hiring: 1, intro_video_url: 'https://www.youtube.com/watch?v=_pxBWsXpafE', min_project_size: '$25,000+', hourly_rate: '< $25 / hr', common_project_size: null,
    stock_listing: 'NSE: DEVIT / BSE: 543462',
    header_tags: ['Managed IT Services', 'Cloud', 'Digital Transformation', 'Microsoft Dynamics 365', 'App Development'],
    industries_served: ['Government & Public Sector', 'Financial Services & Fintech', 'Healthcare, Pharma & Life Sciences', 'Manufacturing & Engineering', 'Real Estate & Infrastructure', 'Retail & FMCG', 'Education', 'Energy & Utilities'],
    languages: ['English', 'Hindi'],
    awards: [
      { name: 'SME Channels Channel Accelerator ISV Award', year: 2025 },
      { name: 'PMI Project Management and Governance Award', year: 2025 },
      { name: 'Best MSP Award for IT Service', year: 2025 },
      { name: 'IAMCP D&I Partner of the Year - Rising Star (Enterprise)', year: 2024 },
      { name: 'Microsoft Best Emerging SI Partner', year: 2023 },
      { name: 'VAR India Best Digital Transformation Partner', year: 2022 },
      { name: 'GESIA ICT Award - Best SI Managed Services Provider', year: 2019 },
      { name: 'India SME 100 - Top 100 SMEs of India', year: 2017 },
    ],
    service_lines: [
      { name: 'Managed IT Services', percentage: 25 },
      { name: 'Cloud Services', percentage: 20 },
      { name: 'Digital Transformation', percentage: 20 },
      { name: 'Enterprise Apps (Dynamics 365)', percentage: 20 },
      { name: 'Application Development', percentage: 15 },
    ],
    focus_breakdown: [
      { name: 'Midmarket ($10M-$1B)', percentage: 40 },
      { name: 'Enterprise (>$1B)', percentage: 40 },
      { name: 'Small Business (<$10M)', percentage: 20 },
    ],
    notable_clients: [],
    clients_summary: 'DEV IT serves government bodies and enterprises across India as a Microsoft and AWS partner appraised at CMMI Maturity Level 5, with a portfolio spanning cloud, Dynamics 365 and managed IT services.',
  },
  {
    company_name: 'Mindteck (India) Ltd', slug: 'mindteck-india-ltd', domain: 'mindteck.com',
    website: 'https://www.mindteck.com/', category_slug: 'custom-software-development',
    city: 'Bengaluru', state: 'Karnataka', hq_location: 'Bengaluru, Karnataka, India',
    tagline: 'Global engineering and technology solutions provider specializing in product engineering, embedded systems, AI, IoT and enterprise data storage since 1991.',
    description: 'Mindteck (India) Ltd is a publicly listed global engineering and technology solutions company headquartered in Bengaluru, incorporated in 1991 (formerly Hinditron Informatics). It provides product engineering, embedded design, AI/ML, IoT, digital transformation, data storage and IT services to clients in medical devices, life sciences, semiconductors, data storage, energy utilities and industrial automation, with development centers in Bengaluru and Kolkata and offices across the US, Canada, UK, Germany, Singapore, Malaysia and Bahrain.',
    founded_year: 1991, team_size: '501-1000', phone_code: '+91', phone: '80 4154 8000',
    linkedin: 'https://www.linkedin.com/company/mindteck', twitter: null, facebook: 'https://www.facebook.com/mindteckglobal/',
    is_hiring: 1, intro_video_url: null, min_project_size: null, hourly_rate: null, common_project_size: null,
    stock_listing: 'BSE: 517344 / NSE: MINDTECK',
    header_tags: ['Product Engineering', 'Embedded Systems', 'AI/ML', 'IoT', 'Data Storage'],
    industries_served: ['Medical Devices & Healthcare', 'Life Sciences & Analytical Instruments', 'Semiconductor', 'Data Storage', 'Energy Utilities & Building Automation', 'Manufacturing & Industrial Automation'],
    languages: ['English', 'Hindi'],
    awards: [
      { name: 'Deloitte Technology Fast 50 India (ranked 41)', year: 2008 },
    ],
    service_lines: [
      { name: 'Product Engineering & Embedded Design', percentage: 35 },
      { name: 'AI/ML & Data Engineering', percentage: 20 },
      { name: 'IoT & Smart Solutions', percentage: 15 },
      { name: 'Digital Transformation & Cloud', percentage: 15 },
      { name: 'Verification & Validation (Testing)', percentage: 10 },
      { name: 'Business Process Management', percentage: 5 },
    ],
    focus_breakdown: [
      { name: 'Engineering / Product Development', percentage: 70 },
      { name: 'IT & Infrastructure Services', percentage: 30 },
    ],
    notable_clients: [],
    clients_summary: 'Mindteck serves Fortune 1000 companies, startups, universities and government entities across 12+ geographies, with deep specialization in medical devices, semiconductors and enterprise data storage.',
  },
  {
    company_name: 'Intense Technologies', slug: 'intense-technologies', domain: 'in10stech.com',
    website: 'https://www.in10stech.com/', category_slug: 'custom-software-development',
    city: 'Hyderabad', state: 'Telangana', hq_location: 'Hyderabad, Telangana, India',
    tagline: 'AI-first, platform-driven enterprise software company for customer communications, data management and process automation - serving BFSI, telecom and government.',
    description: 'Intense Technologies Limited is a publicly listed global enterprise software products company headquartered in Hyderabad, founded in 1990. Its flagship UniServe NXT platform delivers customer communications management (CCM), customer engagement and intelligent data management to BFSI, insurance, telecom and government customers, processing over USD 25 billion in revenue data annually. It also offers the Reasy low-code platform and is recognized by analysts including Gartner, IDC, Aspire, Celent, Omdia and Quadrant.',
    founded_year: 1990, team_size: '201-500', phone_code: '+91', phone: '40 4547 4621',
    linkedin: 'https://www.linkedin.com/company/intense-technologies-ltd-', twitter: 'https://twitter.com/in10stech', facebook: 'https://www.facebook.com/in10stech',
    is_hiring: 1, intro_video_url: 'https://www.youtube.com/watch?v=ljnsLKrWSXo', min_project_size: null, hourly_rate: null, common_project_size: null,
    stock_listing: 'BSE: 532326 / NSE: INTENTECH',
    header_tags: ['Customer Communications (CCM)', 'Data Management', 'Low-Code (Reasy)', 'Enterprise Software', 'Process Automation'],
    industries_served: ['Banking & Financial Services', 'Insurance', 'Telecommunications', 'Government', 'Communications & Media', 'Education'],
    languages: ['English', 'Hindi'],
    awards: [
      { name: 'Gartner Magic Quadrant for CCM - Niche Player', year: 2017 },
      { name: 'Gartner Peer Insights - #1 rated for CCM by customers', year: 2022 },
      { name: 'IDC MarketScape - Major Player for Intelligent CCM', year: null },
      { name: 'Aspire Leaderboard - Leader for IXM', year: null },
      { name: 'Celent CCM Global Insurance Report - Luminary', year: 2024 },
      { name: 'Quadrant SPARK Matrix for CCM', year: 2024 },
      { name: 'Omdia Universe - recognized for Reasy low-code platform', year: 2025 },
    ],
    service_lines: [
      { name: 'Customer Communications (UniServe NXT)', percentage: 45 },
      { name: 'Intelligent Data Management & Engagement', percentage: 25 },
      { name: 'Low-Code & Process Automation (Reasy)', percentage: 15 },
      { name: 'Managed, Data & Cloud Services', percentage: 15 },
    ],
    focus_breakdown: [
      { name: 'BFSI & Insurance', percentage: 45 },
      { name: 'Telecommunications', percentage: 30 },
      { name: 'Government & Public Sector', percentage: 15 },
      { name: 'Comms, Media & Education', percentage: 10 },
    ],
    notable_clients: ['HDFC Bank', 'SBI Card', 'Tata AIG', 'Axis Max Life Insurance', 'Vodafone', 'Mashreq', 'Income Tax Department (India)'],
    clients_summary: "Intense Technologies' UniServe NXT platform serves leading BFSI, telecom and government customers including HDFC Bank, SBI Card, Tata AIG, Vodafone and the Income Tax Department of India.",
  },
  {
    company_name: 'SecureKloud Technologies', slug: 'securekloud-technologies', domain: 'securekloud.com',
    website: 'https://www.securekloud.com/', category_slug: 'cloud-consulting',
    city: 'Chennai', state: 'Tamil Nadu', hq_location: 'Chennai, Tamil Nadu, India',
    tagline: 'Enterprise cloud transformation, cybersecurity and AI-powered managed services for highly regulated industries - formerly 8K Miles.',
    description: 'SecureKloud Technologies (formerly 8K Miles Software Services) is a publicly listed provider of enterprise cloud transformation, secure cloud operations and AI-powered digital services. The company specializes in cloud enablement, cybersecurity and compliance, data engineering and managed services for highly regulated industries such as healthcare, life sciences and BFSI. An AWS Managed Service Partner, SecureKloud operates across the US, India, Canada, Dubai, Singapore and Malaysia.',
    founded_year: 2008, team_size: '51-200', phone_code: '+91', phone: '44 6602 8000',
    linkedin: 'https://in.linkedin.com/company/securekloud-technologies', twitter: 'https://x.com/SecureKloudTech', facebook: 'https://www.facebook.com/people/SecureKloud-Technologies/61565007310158/',
    is_hiring: 0, intro_video_url: null, min_project_size: null, hourly_rate: null, common_project_size: null,
    stock_listing: 'BSE: 512161 / NSE: SECURKLOUD',
    header_tags: ['Cloud Transformation', 'Cybersecurity', 'AWS Partner', 'Data & AI', 'Managed Services'],
    industries_served: ['Healthcare', 'Life Sciences', 'BFSI', 'Manufacturing', 'Government & Public Sector', 'Retail, Logistics & Ecommerce', 'Legal', 'Global Capability Centers (GCCs)'],
    languages: ['English', 'Hindi'],
    awards: [
      { name: 'AWS Managed Service Provider (MSP) Competency', year: 2016 },
      { name: 'AWS Life Sciences Competency', year: null },
      { name: 'AWS Premier Consulting Partner status', year: null },
    ],
    service_lines: [
      { name: 'Cloud Transformation & Migration', percentage: 40 },
      { name: 'Cybersecurity & Compliance', percentage: 25 },
      { name: 'Data Engineering & AI', percentage: 20 },
      { name: 'Managed Cloud Services', percentage: 15 },
    ],
    focus_breakdown: [
      { name: 'Healthcare & Life Sciences', percentage: 45 },
      { name: 'BFSI', percentage: 30 },
      { name: 'Other Regulated Industries', percentage: 25 },
    ],
    notable_clients: [],
    clients_summary: 'SecureKloud delivers compliant (HIPAA, GxP, PCI, SOX) cloud transformation for highly regulated enterprises across healthcare, life sciences and BFSI as an AWS Managed Service Partner.',
  },
  {
    company_name: 'Fidel Softech', slug: 'fidel-softech', domain: 'fidelsoftech.com',
    website: 'https://www.fidelsoftech.com/', category_slug: 'custom-software-development',
    city: 'Pune', state: 'Maharashtra', hq_location: 'Pune, Maharashtra, India',
    tagline: "India's first publicly listed LangTech consulting firm - IT services, software development and localization for global markets.",
    description: 'Fidel Softech Ltd is a Pune-based IT services and consulting company that combines software development and enterprise technology implementation with language technology (LangTech) and localization services across 200+ languages. It helps global product and IT companies localize software and content, with a strong delivery focus on the Japanese market through its Fidel Technologies subsidiaries, and is India\'s first publicly listed premium LangTech consulting company.',
    founded_year: 2004, team_size: '201-500', phone_code: '+91', phone: null,
    linkedin: 'https://in.linkedin.com/company/fidel-softech', twitter: null, facebook: null,
    is_hiring: 1, intro_video_url: null, min_project_size: null, hourly_rate: null, common_project_size: null,
    stock_listing: 'NSE SME Emerge: FIDEL',
    header_tags: ['LangTech & Localization', 'IT Services', 'Software Development', 'Japan Focus', 'Consulting'],
    industries_served: ['Information Technology', 'Software', 'Banking & Finance', 'Healthcare', 'eCommerce', 'Manufacturing', 'Automotive', 'Education'],
    languages: ['English', 'Hindi', 'Japanese'],
    awards: [
      { name: 'DCCIA Pune - Excellence in Language Technology Award', year: 2024 },
    ],
    service_lines: [
      { name: 'Localization & LangTech', percentage: 45 },
      { name: 'IT Services & Software Development', percentage: 40 },
      { name: 'Consulting & Staffing', percentage: 15 },
    ],
    focus_breakdown: [
      { name: 'Japan', percentage: 50 },
      { name: 'India', percentage: 30 },
      { name: 'USA, UK & Europe', percentage: 20 },
    ],
    notable_clients: ['SAP', 'Amazon', 'Flipkart', 'Nykaa', 'Persistent Systems', 'DataWeave'],
    clients_summary: 'Fidel Softech delivers localization and IT services to global product and technology companies including SAP, Amazon, Flipkart and Nykaa, with a strong delivery focus on the Japanese market.',
  },
  {
    company_name: 'Kellton Tech Solutions', slug: 'kellton-tech-solutions', domain: 'kellton.com',
    website: 'https://www.kellton.com/', category_slug: 'custom-software-development',
    city: 'Hyderabad', state: 'Telangana', hq_location: 'Hyderabad, Telangana, India',
    tagline: 'AI-driven digital transformation, product engineering and technology consulting firm - publicly listed (BSE/NSE), CMMI Level 5 certified.',
    description: 'Kellton Tech Solutions is a publicly listed global digital transformation and technology consulting company headquartered in Hyderabad. Using an AI-first approach, it delivers product engineering, cloud, data and analytics, SAP, ServiceNow and digital experience services to enterprises across six continents. The company is CMMI Level 5 and ISO 9001:2015 certified and serves clients across financial services, healthcare, retail, manufacturing and government.',
    founded_year: 2009, team_size: '1001-5000', phone_code: '+91', phone: '124 469 8900',
    linkedin: 'https://www.linkedin.com/company/kellton', twitter: 'https://twitter.com/kelltontech', facebook: 'https://www.facebook.com/people/Kellton/',
    is_hiring: 1, intro_video_url: 'https://www.youtube.com/watch?v=anv3fxwlfho', min_project_size: null, hourly_rate: null, common_project_size: null,
    stock_listing: 'BSE: 519602 / NSE: KELLTONTEC',
    header_tags: ['Digital Transformation', 'Product Engineering', 'AI Services', 'SAP & ServiceNow', 'Cloud & Data'],
    industries_served: ['Financial Services, Banking & Insurance', 'Retail & E-Commerce', 'Healthcare & Life Sciences', 'Government & Education', 'Travel & Logistics', 'Manufacturing', 'Technology & SaaS', 'Energy & Utilities'],
    languages: ['English', 'Hindi'],
    awards: [
      { name: 'Bronze Stevie Award, No-Code/Low-Code Platform - International Business Awards', year: 2024 },
      { name: 'Integration Partner of the Year - Software AG Innovation Tour', year: 2024 },
      { name: "Forbes Asia's Best Under a Billion", year: 2017 },
      { name: 'Leader - Zinnov Zones Digital Engineering & ER&D Services', year: 2023 },
      { name: 'Deloitte Technology Fast 50 India (recognized four times)', year: null },
    ],
    service_lines: [
      { name: 'Product Engineering', percentage: 30 },
      { name: 'AI Services', percentage: 20 },
      { name: 'Cloud & Data Engineering', percentage: 20 },
      { name: 'SAP & ServiceNow', percentage: 20 },
      { name: 'Digital Experience & Consulting', percentage: 10 },
    ],
    focus_breakdown: [
      { name: 'Digital Transformation & Engineering', percentage: 60 },
      { name: 'Enterprise Platforms (SAP/ServiceNow)', percentage: 25 },
      { name: 'AI, Data & Emerging Tech', percentage: 15 },
    ],
    notable_clients: ['United Rentals', 'Adani', 'IndiGo', 'Sun Pharma', 'KFC', 'Americana', 'ZEE5', 'Hobby Lobby'],
    clients_summary: 'Kellton works with global enterprises including United Rentals, Adani, IndiGo, Sun Pharma and KFC, delivering AI-driven digital transformation across six continents.',
  },
  {
    company_name: 'Allied Digital Services', slug: 'allied-digital-services', domain: 'allieddigital.net',
    website: 'https://www.allieddigital.net/', category_slug: 'managed-it-services',
    city: 'Mumbai', state: 'Maharashtra', hq_location: 'Mumbai, Maharashtra, India',
    tagline: 'Global IT infrastructure and managed services provider - serving Fortune 500 enterprises across 70+ countries since 1984.',
    description: 'Allied Digital Services Limited is a publicly traded global IT consulting and managed services company headquartered in Mumbai, with US operations in Torrance, California. Founded in 1984, it delivers enterprise infrastructure management, cloud, cybersecurity, digital workplace, smart-city/IoT and AI-Ops automation services to Fortune 500 enterprises and governments across the Americas, Asia Pacific, Europe, the Middle East and Africa, with a delivery footprint spanning more than 70 countries.',
    founded_year: 1984, team_size: '1001-5000', phone_code: '+91', phone: '22 6681 6400',
    linkedin: 'https://www.linkedin.com/company/adslin/', twitter: 'https://twitter.com/allieddigital', facebook: 'https://www.facebook.com/pages/Allied-Digital-Services-Ltd/166722136675767',
    is_hiring: 0, intro_video_url: null, min_project_size: null, hourly_rate: null, common_project_size: null,
    stock_listing: 'BSE: 532875 / NSE: ADSL',
    header_tags: ['IT Infrastructure', 'Managed Services', 'Cybersecurity', 'Digital Workplace', 'Smart City & IoT'],
    industries_served: ['Government', 'Healthcare', 'Retail', 'Automotive', 'Banking, Financial Services & Insurance (BFSI)'],
    languages: ['English', 'Hindi'],
    awards: [
      { name: 'ET Now Best Brands', year: 2025 },
      { name: 'Best Use of Social Media in Marketing - World Marketing Excellence Awards', year: 2025 },
      { name: 'National Award for Excellence in CSR', year: 2024 },
      { name: 'Best Organisations in Innovation - ET Now Global Innovation Network', year: 2024 },
      { name: "India's Best IT Infrastructure Management Company - Berkshire Media", year: 2023 },
      { name: 'Nasscom SME Inspire Award - Leadership in Innovation (Tech Services)', year: 2023 },
      { name: 'CIO Choice - Managed IT Services', year: 2021 },
      { name: 'CRN Excellence Award - Cloud', year: 2020 },
      { name: 'ChannelWorld Premier 100 Award', year: 2019 },
    ],
    service_lines: [
      { name: 'Enterprise Infrastructure & Cloud Management', percentage: 30 },
      { name: 'Digital Workplace Services', percentage: 20 },
      { name: 'Cyber Security & Networking', percentage: 20 },
      { name: 'AI Ops & Automation', percentage: 15 },
      { name: 'Digital Engineering / IoT & Smart Cities', percentage: 15 },
    ],
    focus_breakdown: [
      { name: 'Managed IT & Infrastructure', percentage: 60 },
      { name: 'System Integration & Safe-City Projects', percentage: 25 },
      { name: 'Digital Engineering & Automation', percentage: 15 },
    ],
    notable_clients: [],
    clients_summary: 'Allied Digital serves Fortune 500 enterprises and governments across 70+ countries, with marquee public-sector projects including the Pune City Surveillance (safe city) deployment.',
  },
  {
    company_name: 'Silver Touch Technologies', slug: 'silver-touch-technologies', domain: 'silvertouch.com',
    website: 'https://www.silvertouch.com/', category_slug: 'erp-implementation',
    city: 'Ahmedabad', state: 'Gujarat', hq_location: 'Ahmedabad, Gujarat, India',
    tagline: 'Enterprise IT, ERP and digital transformation services provider - SAP partner with offices in India, USA, UK and Canada.',
    description: 'Silver Touch Technologies is an Ahmedabad-based IT solutions and digital transformation company incorporated in 1995 and publicly listed on the NSE and BSE. It delivers enterprise software, ERP (including SAP Business One and S/4HANA), e-governance platforms, cloud, managed security and modern workplace services. The company employs over 1,400 IT professionals and serves 2,000+ clients worldwide across enterprise and government sectors, with subsidiaries in the USA, UK and Canada.',
    founded_year: 1995, team_size: '1001-5000', phone_code: '+91', phone: '79 4002 2770',
    linkedin: 'https://www.linkedin.com/company/silver-touch-technologies-ltd', twitter: 'https://twitter.com/silvertouchind', facebook: 'https://www.facebook.com/SilverTouch.Technologies',
    is_hiring: 0, intro_video_url: 'https://www.youtube.com/watch?v=TrjVFb9xO1g', min_project_size: null, hourly_rate: null, common_project_size: null,
    stock_listing: 'NSE: SILVERTUC / BSE: 543525',
    header_tags: ['Enterprise IT & ERP', 'SAP Partner', 'Digital Transformation', 'E-Governance', 'Cloud & Security'],
    industries_served: ['Government / E-Governance', 'Manufacturing', 'Healthcare', 'Education', 'Banking & Financial Services', 'Retail & E-Commerce', 'Travel', 'Transport'],
    languages: ['English', 'Hindi'],
    awards: [
      { name: 'Global Business Excellence Award - Markham Board of Trade, Canada', year: 2025 },
      { name: 'Rookie of the Year - SAP Partner Summit', year: 2024 },
      { name: 'ChannelWorld India Premier 100 - The Resilient 100', year: 2021 },
      { name: 'Nasscom Technology Excellence Award - IoT', year: 2019 },
      { name: 'Partner Leadership Award - Best System Integrator (Government)', year: 2019 },
      { name: 'ChannelWorld Premier 100 - The Imaginative 100', year: 2018 },
    ],
    service_lines: [
      { name: 'Enterprise Software & ERP (SAP)', percentage: 35 },
      { name: 'Digital Transformation & Emerging Tech', percentage: 25 },
      { name: 'E-Governance Solutions', percentage: 20 },
      { name: 'Cloud, Managed Security & Infrastructure', percentage: 20 },
    ],
    focus_breakdown: [
      { name: 'Enterprise / Corporate', percentage: 60 },
      { name: 'Government / Public Sector', percentage: 40 },
    ],
    notable_clients: [],
    clients_summary: 'Silver Touch serves 2,000+ clients across enterprise and government sectors with 350+ ERP implementations, supported by offices in the USA, UK and Canada.',
  },
]

/* ── emit ── */
const cols = [
  'uuid', 'company_name', 'slug', 'contact_name', 'email', 'phone_code', 'phone', 'website',
  'category_id', 'country_id', 'city', 'state', 'hq_location',
  'tagline', 'description', 'logo_url', 'founded_year', 'team_size',
  'linkedin', 'twitter', 'facebook', 'listing_mode', 'is_hiring',
  'header_tags', 'industries_served', 'languages', 'awards', 'faqs',
  'min_project_size', 'hourly_rate', 'common_project_size', 'intro_video_url',
  'timezones', 'service_lines', 'focus_breakdown', 'client_logos', 'clients_summary',
  'status', 'payment_status', 'plan_id', 'user_id',
  'created_at', 'updated_at',
]

function insert(c) {
  const vals = [
    'UUID()', s(c.company_name), s(c.slug), s(`${c.company_name} Team`), s(`info@${c.domain}`), s(c.phone_code), s(c.phone), s(c.website),
    `COALESCE((SELECT id FROM categories WHERE slug='${c.category_slug}' LIMIT 1), @it_sector)`,
    'COALESCE((SELECT id FROM countries WHERE code=\'IN\' LIMIT 1), @fallback_country)',
    s(c.city), s(c.state), s(c.hq_location),
    s(c.tagline), s(c.description), s(logo(c.domain)), n(c.founded_year), s(c.team_size),
    s(c.linkedin), s(c.twitter), s(c.facebook), `'company'`, n(c.is_hiring),
    j(c.header_tags), j(c.industries_served), j(c.languages), j(c.awards), j(faqs(c)),
    s(c.min_project_size), s(c.hourly_rate), s(c.common_project_size), s(c.intro_video_url),
    j(['GMT+05:30 (IST)']), j(c.service_lines), j(c.focus_breakdown), j(clientLogos(c.notable_clients)), s(c.clients_summary),
    `'pending'`, `'unpaid'`, '@free_plan', 'NULL',
    'NOW()', 'NOW()',
  ]
  return `-- ${c.company_name}\nINSERT INTO submissions (\n  ${cols.join(', ')}\n)\nSELECT\n  ${vals.join(',\n  ')};\n`
}

const slugs = COMPANIES.map((c) => `'${c.slug}'`).join(', ')
const out = `-- ============================================================
-- InfoWebWorld - IT Services & Agencies COMPANY listings seed
--
-- 9 real Indian IT-services firms as listing_mode='company' rows that render
-- the Clutch-style /profile/[slug] UI (stat cards, service/focus pie charts,
-- awards row, "Watch our video", pricing snapshot, FAQs).
--
-- SEEDED NOT LIVE:
--   status='pending'  -> NOT shown on /profile/[slug] (only 'active'/'paid' are)
--   user_id=NULL      -> unowned, so the "Claim Now" button works
-- Review in /iww-hq/submissions, then run the GO-LIVE block at the bottom +
-- redeploy to publish.
--
-- Logos = Google favicon API (swap for real logos via admin if desired).
-- Re-runnable: deletes its own slugs first. Run in phpMyAdmin -> SQL tab.
-- Generated by scripts/gen-it-companies-sql.mjs - do not edit by hand.
-- ============================================================

SET @free_plan       := (SELECT id FROM plans WHERE is_active = 1 ORDER BY price ASC LIMIT 1);
SET @fallback_country := (SELECT id FROM countries WHERE code = 'US' LIMIT 1);
SET @it_sector       := (SELECT id FROM categories WHERE slug = 'it-services-agencies' AND level = 1 LIMIT 1);

DELETE FROM submissions WHERE slug IN (${slugs});

${COMPANIES.map(insert).join('\n')}
-- ============================================================
-- GO LIVE (run after you've reviewed them, then redeploy):
--   UPDATE submissions SET status='active', payment_status='completed', activated_at=NOW()
--    WHERE slug IN (${slugs})
--      AND listing_mode='company';
-- ============================================================
`

const target = new URL('../database/seed-it-companies.sql', import.meta.url)
writeFileSync(target, out)
console.log(`Wrote ${COMPANIES.length} company listings -> database/seed-it-companies.sql (${out.length} bytes)`)
