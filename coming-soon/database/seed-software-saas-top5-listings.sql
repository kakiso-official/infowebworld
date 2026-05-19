-- ═══════════════════════════════════════════════════════════════════════════
-- Software & SaaS — Top 5 CRM listings (all-in-one-crm-software L3)
-- 1) Salesforce  2) HubSpot  3) Zoho CRM  4) Pipedrive  5) Freshsales
--
-- All listings mirror Claude's schema:
--   • Logo from Google s2 favicon
--   • 2 live screenshots via image.thum.io
--   • pricing_tiers with proper free=0 / custom=null handling
--   • pros / cons arrays
--   • integrations with name + website (logos auto-fetched on render)
--   • faqs with question/answer keys (NOT q/a — must match FaqItem type)
--   • target_company_sizes uses bar-matching labels (Small/Midsize/Enterprises)
--   • status='active', payment_status='completed' → live immediately
-- ═══════════════════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────────────────
-- 1) Salesforce — the original CRM giant
-- ───────────────────────────────────────────────────────────────────────────
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url, screenshots, demo_video,
  founded_year, team_size, funding,
  linkedin, twitter, facebook,
  pricing_model, pricing_tiers,
  features, integrations, faqs, header_tags,
  pros, cons, industries_served, use_cases, target_company_sizes,
  key_features, starting_price, starting_price_period,
  has_free_trial, has_free_version,
  support_channels, training_options, languages,
  has_ios_app, has_android_app, compliance, awards,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Salesforce', 'salesforce', 'Salesforce Team', 'info@salesforce.com',
  '+1', NULL, 'https://www.salesforce.com',
  (SELECT id FROM categories WHERE slug = 'all-in-one-crm-software' AND level = 3 LIMIT 1),
  (SELECT id FROM countries WHERE code = 'US' OR name = 'United States' LIMIT 1),
  'San Francisco', 'San Francisco, CA, United States',
  'The #1 AI CRM — unite teams around the customer with Einstein AI',
  'Salesforce is the world''s largest CRM platform, serving more than 150,000 companies including most of the Fortune 500. Founded in 1999, Salesforce pioneered the SaaS model and now spans Sales Cloud, Service Cloud, Marketing Cloud, Commerce Cloud, Data Cloud, and Slack — all unified by the Einstein 1 platform, Salesforce''s generative and agentic AI layer. Einstein Copilot delivers AI-powered conversational assistance to sales reps, service agents, and marketers, while Agentforce — Salesforce''s 2024 agentic AI platform — lets companies build autonomous AI agents that handle customer conversations, sales outreach, and service tickets end-to-end. Salesforce remains the most-extensible CRM on the market with over 7,000 apps on the AppExchange and the largest developer ecosystem in enterprise software.',
  'https://www.google.com/s2/favicons?domain=salesforce.com&sz=256',
  JSON_ARRAY(
    'https://image.thum.io/get/width/1600/crop/900/noanimate/https://www.salesforce.com/',
    'https://image.thum.io/get/width/1600/crop/900/noanimate/https://www.salesforce.com/sales/pricing/'
  ),
  'https://www.youtube.com/watch?v=OqaHdYhqLE0',
  1999, '1000+', 'public',
  'https://www.linkedin.com/company/salesforce', 'https://twitter.com/salesforce', 'https://www.facebook.com/salesforce',
  'subscription',
  JSON_ARRAY(
    JSON_OBJECT('name', 'Starter Suite', 'price', 25, 'period', 'user / month',
      'features', JSON_ARRAY('Simplified CRM for small teams', 'Email marketing + lead capture', 'Out-of-the-box dashboards', 'Mobile app')),
    JSON_OBJECT('name', 'Pro Suite', 'price', 100, 'period', 'user / month',
      'features', JSON_ARRAY('Forecast Management', 'Customizable reports & dashboards', 'Quoting and contracts', 'Process automation')),
    JSON_OBJECT('name', 'Enterprise', 'price', 165, 'period', 'user / month',
      'features', JSON_ARRAY('Advanced customization', 'Workflow & approval automation', 'Territory management', 'Salesforce Engage')),
    JSON_OBJECT('name', 'Unlimited', 'price', 330, 'period', 'user / month',
      'features', JSON_ARRAY('24/7 support', 'Unlimited sandboxes', 'Premier success plan', 'Salesforce Inbox')),
    JSON_OBJECT('name', 'Einstein 1 Sales', 'price', 500, 'period', 'user / month',
      'features', JSON_ARRAY('Everything in Unlimited', 'Einstein Copilot for Sales', 'Slack integration', 'Data Cloud included'))
  ),
  JSON_ARRAY(
    'Einstein 1 AI platform — generative + agentic',
    'Agentforce — build autonomous AI agents',
    'Sales Cloud — pipeline, forecasting, quotes',
    'Service Cloud — case management, knowledge base',
    'Marketing Cloud — email, journeys, mobile',
    'Data Cloud — unified customer data platform',
    'Slack — team collaboration native to Salesforce',
    '7,000+ AppExchange apps',
    'Mobile app for iOS and Android',
    'Lightning Platform — low-code app development'
  ),
  JSON_ARRAY(
    JSON_OBJECT('name', 'Slack', 'website', 'https://slack.com',
                'description', 'Salesforce-owned Slack is natively integrated with Sales Cloud, Service Cloud, and Marketing Cloud.'),
    JSON_OBJECT('name', 'Microsoft Outlook', 'website', 'https://outlook.live.com',
                'description', 'Sync emails, contacts, and calendar between Outlook and Salesforce.'),
    JSON_OBJECT('name', 'Gmail', 'website', 'https://gmail.com',
                'description', 'Salesforce for Gmail Chrome extension logs emails and shows CRM context.'),
    JSON_OBJECT('name', 'Zoom', 'website', 'https://zoom.us',
                'description', 'Schedule, launch, and log Zoom meetings inside Salesforce records.'),
    JSON_OBJECT('name', 'DocuSign', 'website', 'https://www.docusign.com',
                'description', 'Send and track signed contracts from Opportunity records.'),
    JSON_OBJECT('name', 'LinkedIn Sales Navigator', 'website', 'https://www.linkedin.com/sales',
                'description', 'Surface LinkedIn lead and account data inside Salesforce.'),
    JSON_OBJECT('name', 'MuleSoft', 'website', 'https://www.mulesoft.com',
                'description', 'Salesforce-owned integration platform for connecting any system.'),
    JSON_OBJECT('name', 'Tableau', 'website', 'https://www.tableau.com',
                'description', 'Embed Tableau dashboards inside Salesforce Lightning pages.'),
    JSON_OBJECT('name', 'HubSpot', 'website', 'https://www.hubspot.com',
                'description', 'Two-way sync between HubSpot Marketing and Salesforce records.'),
    JSON_OBJECT('name', 'Marketo', 'website', 'https://www.marketo.com',
                'description', 'Sync leads and campaigns between Marketo and Salesforce.'),
    JSON_OBJECT('name', 'Zapier', 'website', 'https://zapier.com',
                'description', 'Trigger Salesforce actions from 6,000+ apps via Zapier.')
  ),
  JSON_ARRAY(
    JSON_OBJECT('question', 'What is Salesforce?',
                'answer', 'Salesforce is the world''s #1 cloud-based CRM platform. It unifies sales, service, marketing, commerce, and data in one customer 360 platform, powered by Einstein AI and the Agentforce agentic AI layer.'),
    JSON_OBJECT('question', 'How much does Salesforce cost?',
                'answer', 'Sales Cloud pricing starts at $25/user/month (Starter Suite) and scales up to $500/user/month (Einstein 1 Sales). Most mid-market and enterprise customers use the Enterprise tier at $165/user/month.'),
    JSON_OBJECT('question', 'What is Agentforce?',
                'answer', 'Agentforce is Salesforce''s 2024 agentic AI platform that lets companies build autonomous AI agents to handle sales outreach, customer service, and marketing tasks end-to-end — not just chat suggestions.'),
    JSON_OBJECT('question', 'Is Salesforce hard to learn?',
                'answer', 'Salesforce has the largest learning resource in enterprise software — Trailhead — with thousands of free hands-on modules. Most admins certify in 3–6 months. Salesforce is more configurable (and complex) than newer CRMs like HubSpot or Pipedrive.'),
    JSON_OBJECT('question', 'Does Salesforce work with my existing tools?',
                'answer', 'Yes. Salesforce has the largest ecosystem in CRM — 7,000+ apps on the AppExchange, native integrations with Slack, Outlook, Gmail, Zoom, DocuSign, and MuleSoft for any custom integration.'),
    JSON_OBJECT('question', 'Is there a Salesforce free trial?',
                'answer', 'Yes — Salesforce offers a 30-day free trial of Sales Cloud Starter Suite with no credit card required. The trial gives you a working sandbox to evaluate the product.')
  ),
  JSON_ARRAY('CRM', 'Sales Cloud', 'AI-powered', 'Enterprise SaaS', 'Customer 360'),
  JSON_ARRAY(
    'World''s most extensible CRM — 7,000+ AppExchange apps',
    'Einstein AI + Agentforce — leading agentic CRM AI',
    'Best-in-class for complex enterprise workflows',
    'Largest learning ecosystem (Trailhead) and partner network',
    'Most-mature data and reporting capabilities',
    'Slack natively integrated since 2021 acquisition'
  ),
  JSON_ARRAY(
    'Expensive — among the priciest CRMs in market',
    'Steep learning curve and configuration overhead',
    'Implementation typically requires consulting partner',
    'Per-seat licensing adds up fast at scale'
  ),
  JSON_ARRAY('Software & SaaS', 'Financial Services', 'Healthcare', 'Manufacturing', 'Retail', 'Telecom', 'Government', 'Media & Publishing', 'Consulting'),
  JSON_ARRAY(
    'B2B and B2C sales pipeline management',
    'Customer service ticketing and case routing',
    'Marketing automation and campaign management',
    'Lead generation and lead scoring',
    'Forecasting and revenue intelligence',
    'Contract and quote management',
    'Customer data unification (Data Cloud)',
    'Custom app development on Lightning Platform'
  ),
  JSON_ARRAY('Small Businesses', 'Midsize Businesses', 'Enterprises'),
  JSON_ARRAY(
    JSON_OBJECT('name', 'Einstein Copilot', 'description', 'Conversational AI assistant built into every Salesforce app — drafts emails, summarizes accounts, predicts deal risk.'),
    JSON_OBJECT('name', 'Agentforce', 'description', 'Build autonomous AI agents that handle sales outreach, customer service, and marketing tasks end-to-end.'),
    JSON_OBJECT('name', 'Sales Cloud', 'description', 'Pipeline, forecasting, quotes, contracts, and territory management for sales teams.'),
    JSON_OBJECT('name', 'Service Cloud', 'description', 'Omni-channel case management, knowledge base, field service, and live agent chat.'),
    JSON_OBJECT('name', 'Marketing Cloud', 'description', 'Email marketing, customer journeys, mobile messaging, and audience segmentation.'),
    JSON_OBJECT('name', 'Data Cloud', 'description', 'Real-time customer data platform unifying every signal into a single Customer 360 profile.'),
    JSON_OBJECT('name', 'AppExchange', 'description', '7,000+ pre-built apps and integrations — the largest SaaS marketplace in the world.'),
    JSON_OBJECT('name', 'Lightning Platform', 'description', 'Low-code platform for building custom apps on top of the Salesforce data model.')
  ),
  25.00, 'user / month', 1, 0,
  JSON_ARRAY('24/7 Support (Premier)', 'Help Center', 'Trailblazer Community', 'Salesforce Status'),
  JSON_ARRAY('Trailhead — free hands-on learning', 'Salesforce Certification', 'Dreamforce conference', 'YouTube channel', 'Documentation'),
  JSON_ARRAY('English', 'Spanish', 'French', 'German', 'Portuguese', 'Italian', 'Japanese', 'Korean', 'Chinese (Simplified)', 'Dutch', 'Russian', 'Hebrew', 'Thai', 'Polish'),
  1, 1,
  JSON_ARRAY('SOC 1', 'SOC 2 Type II', 'SOC 3', 'ISO 27001', 'ISO 27017', 'ISO 27018', 'GDPR', 'HIPAA', 'FedRAMP High', 'PCI DSS'),
  JSON_ARRAY('Forrester Wave Leader — Sales Force Automation 2024', 'Gartner Magic Quadrant Leader (CRM) — 15+ years', 'Fortune Future 50'),
  'product', 'active', 'completed',
  (SELECT id FROM plans ORDER BY id ASC LIMIT 1),
  NOW(), NOW(), NOW(), NOW();


-- ───────────────────────────────────────────────────────────────────────────
-- 2) HubSpot — the inbound marketing CRM
-- ───────────────────────────────────────────────────────────────────────────
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url, screenshots, demo_video,
  founded_year, team_size, funding,
  linkedin, twitter, facebook,
  pricing_model, pricing_tiers,
  features, integrations, faqs, header_tags,
  pros, cons, industries_served, use_cases, target_company_sizes,
  key_features, starting_price, starting_price_period,
  has_free_trial, has_free_version,
  support_channels, training_options, languages,
  has_ios_app, has_android_app, compliance, awards,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'HubSpot', 'hubspot', 'HubSpot Team', 'support@hubspot.com',
  '+1', NULL, 'https://www.hubspot.com',
  (SELECT id FROM categories WHERE slug = 'all-in-one-crm-software' AND level = 3 LIMIT 1),
  (SELECT id FROM countries WHERE code = 'US' OR name = 'United States' LIMIT 1),
  'Cambridge', 'Cambridge, MA, United States',
  'Smart CRM platform — marketing, sales, service, and content on one connected engine',
  'HubSpot is the leading CRM platform for scaling businesses, serving over 230,000 customers in more than 135 countries. Founded in 2006 by Brian Halligan and Dharmesh Shah at MIT, HubSpot popularized "inbound marketing" and now offers a fully unified Smart CRM with five hubs — Marketing, Sales, Service, Content, and Operations — plus Commerce Hub launched in 2024. Breeze, HubSpot''s generative AI layer, powers content generation, lead scoring, prospecting agents, and the new Breeze Copilot conversational assistant. HubSpot is famous for its generous free tier (forever-free CRM with up to 1,000,000 contacts), polished UX, and being significantly easier to adopt than Salesforce while still scaling to enterprise needs. It is publicly traded on the NYSE and one of the most-loved SaaS brands in the world.',
  'https://www.google.com/s2/favicons?domain=hubspot.com&sz=256',
  JSON_ARRAY(
    'https://image.thum.io/get/width/1600/crop/900/noanimate/https://www.hubspot.com/',
    'https://image.thum.io/get/width/1600/crop/900/noanimate/https://www.hubspot.com/pricing/marketing'
  ),
  'https://www.youtube.com/watch?v=NRWaEbVlt9w',
  2006, '1000+', 'public',
  'https://www.linkedin.com/company/hubspot', 'https://twitter.com/HubSpot', 'https://www.facebook.com/hubspot',
  'freemium',
  JSON_ARRAY(
    JSON_OBJECT('name', 'Free Tools', 'price', 0, 'period', 'month',
      'features', JSON_ARRAY('Free CRM up to 1M contacts', 'Email marketing (2k sends/mo)', 'Forms and landing pages', 'Live chat and chatbot builder', 'Reporting dashboards')),
    JSON_OBJECT('name', 'Starter Customer Platform', 'price', 15, 'period', 'seat / month',
      'features', JSON_ARRAY('Simple automation', 'Goal tracking', 'Stripe integration', 'Conversation routing', 'Remove HubSpot branding')),
    JSON_OBJECT('name', 'Professional Customer Platform', 'price', 1170, 'period', 'month (3 seats)',
      'features', JSON_ARRAY('Marketing automation', 'Advanced reporting', 'Custom reports', 'A/B testing', 'Smart content')),
    JSON_OBJECT('name', 'Enterprise Customer Platform', 'price', 4300, 'period', 'month (5 seats)',
      'features', JSON_ARRAY('Custom objects', 'Advanced permissions', 'Hierarchical teams', 'Single sign-on', 'Sandbox accounts')),
    JSON_OBJECT('name', 'Custom Quote', 'price', NULL, 'period', 'custom',
      'features', JSON_ARRAY('Volume discounts', 'Custom contract terms', 'Dedicated success manager'))
  ),
  JSON_ARRAY(
    'Smart CRM with up to 1M free contacts',
    'Marketing Hub — email, automation, ABM',
    'Sales Hub — pipelines, sequences, quotes',
    'Service Hub — tickets, knowledge base, surveys',
    'Content Hub — CMS + AI content generation',
    'Operations Hub — data sync and quality',
    'Commerce Hub — invoices, payments, subscriptions',
    'Breeze AI — content, prospecting, copilot',
    'HubSpot Marketplace — 1,800+ integrations',
    'Mobile app for iOS and Android'
  ),
  JSON_ARRAY(
    JSON_OBJECT('name', 'Gmail', 'website', 'https://gmail.com',
                'description', 'HubSpot Sales extension for Gmail logs emails and shows CRM context inline.'),
    JSON_OBJECT('name', 'Microsoft Outlook', 'website', 'https://outlook.live.com',
                'description', 'Two-way sync of emails, contacts, calendar events with Outlook.'),
    JSON_OBJECT('name', 'Slack', 'website', 'https://slack.com',
                'description', 'Get HubSpot notifications, log emails, and reply to chats from Slack.'),
    JSON_OBJECT('name', 'Zoom', 'website', 'https://zoom.us',
                'description', 'Schedule, launch, and log Zoom meetings directly from HubSpot.'),
    JSON_OBJECT('name', 'Shopify', 'website', 'https://www.shopify.com',
                'description', 'Sync Shopify customers and orders into HubSpot CRM.'),
    JSON_OBJECT('name', 'WordPress', 'website', 'https://wordpress.org',
                'description', 'Embed forms, popups, and chat on any WordPress site.'),
    JSON_OBJECT('name', 'Salesforce', 'website', 'https://www.salesforce.com',
                'description', 'Two-way sync for companies using HubSpot Marketing + Salesforce Sales Cloud.'),
    JSON_OBJECT('name', 'Stripe', 'website', 'https://stripe.com',
                'description', 'Process payments and recurring subscriptions through HubSpot Commerce Hub.'),
    JSON_OBJECT('name', 'Calendly', 'website', 'https://calendly.com',
                'description', 'Capture Calendly bookings as HubSpot contacts and meetings.'),
    JSON_OBJECT('name', 'Zapier', 'website', 'https://zapier.com',
                'description', 'Connect HubSpot to 6,000+ apps via Zapier with no code.'),
    JSON_OBJECT('name', 'LinkedIn Sales Navigator', 'website', 'https://www.linkedin.com/sales',
                'description', 'Surface LinkedIn data on HubSpot contact and company records.')
  ),
  JSON_ARRAY(
    JSON_OBJECT('question', 'Is HubSpot really free?',
                'answer', 'Yes — HubSpot''s CRM is forever free for up to 1 million contacts, with no time limit. The free plan includes contact management, deal pipelines, email tracking, meeting scheduler, and basic email marketing. Paid hubs unlock automation, custom reporting, and advanced features.'),
    JSON_OBJECT('question', 'How is HubSpot different from Salesforce?',
                'answer', 'HubSpot is dramatically easier to set up and use, with a generous free tier and integrated marketing/sales/service hubs in one platform. Salesforce is more configurable and the standard for very large enterprises, but typically requires implementation partners. HubSpot wins on time-to-value; Salesforce wins on max customizability.'),
    JSON_OBJECT('question', 'What is Breeze?',
                'answer', 'Breeze is HubSpot''s 2024 AI layer — generative AI for content, prospecting agents that find and qualify leads automatically, lead scoring, and Breeze Copilot conversational assistant built into every hub.'),
    JSON_OBJECT('question', 'Which HubSpot Hub should I start with?',
                'answer', 'Most companies start with the free Smart CRM, then add Marketing Hub for inbound marketing. Sales teams often add Sales Hub for sequences and pipelines. The Customer Platform bundles all hubs at a discount.'),
    JSON_OBJECT('question', 'Can I migrate from Salesforce to HubSpot?',
                'answer', 'Yes — HubSpot offers migration services, and tools like Trujay automate the data transfer. Most companies migrate in 4–8 weeks. HubSpot is significantly less expensive on TCO than Salesforce for SMB and mid-market.'),
    JSON_OBJECT('question', 'Does HubSpot have a free trial of paid features?',
                'answer', 'Yes — every paid Hub offers a 14-day free trial with all features unlocked. No credit card required for the free CRM.')
  ),
  JSON_ARRAY('CRM', 'Inbound Marketing', 'All-in-One', 'Marketing Automation', 'Smart CRM'),
  JSON_ARRAY(
    'Forever-free CRM with 1M contacts is unmatched in the industry',
    'Marketing, Sales, Service, Content all natively integrated',
    'Famously polished UX — easiest enterprise CRM to learn',
    'Massive learning ecosystem (HubSpot Academy free certifications)',
    'Breeze AI is fully embedded across all hubs',
    'Predictable per-seat pricing without long contracts'
  ),
  JSON_ARRAY(
    'Per-contact pricing on Professional/Enterprise scales quickly',
    'Less customizable than Salesforce for complex enterprise workflows',
    'Enterprise features (CRMs custom objects) gated to highest tier',
    'Limited offline / disconnected mode in mobile app'
  ),
  JSON_ARRAY('Software & SaaS', 'E-commerce', 'Education', 'Marketing', 'Real Estate', 'Healthcare', 'Financial Services', 'Consulting'),
  JSON_ARRAY(
    'Inbound marketing campaigns and lead generation',
    'Sales pipeline management and deal tracking',
    'Customer service ticketing and knowledge base',
    'Content marketing and CMS with AI',
    'Email marketing and automation workflows',
    'Account-based marketing (ABM)',
    'Chat and chatbot for websites',
    'Reporting dashboards and revenue attribution'
  ),
  JSON_ARRAY('Small Businesses', 'Midsize Businesses', 'Enterprises'),
  JSON_ARRAY(
    JSON_OBJECT('name', 'Smart CRM', 'description', 'Forever-free CRM core with contact, company, deal, and ticket records up to 1M contacts.'),
    JSON_OBJECT('name', 'Marketing Hub', 'description', 'Email marketing, landing pages, forms, popups, automation workflows, and ABM.'),
    JSON_OBJECT('name', 'Sales Hub', 'description', 'Pipelines, sequences, meeting scheduler, quotes, and revenue forecasting.'),
    JSON_OBJECT('name', 'Service Hub', 'description', 'Tickets, knowledge base, customer portal, NPS surveys, and live chat.'),
    JSON_OBJECT('name', 'Content Hub', 'description', 'CMS + AI content generation, smart content, and SEO tools.'),
    JSON_OBJECT('name', 'Commerce Hub', 'description', 'Invoices, payments, and subscriptions natively in HubSpot CRM.'),
    JSON_OBJECT('name', 'Breeze AI', 'description', 'Generative AI for content, prospecting agents, lead scoring, and conversational copilot.'),
    JSON_OBJECT('name', 'App Marketplace', 'description', '1,800+ integrations spanning Gmail, Outlook, Slack, Shopify, WordPress, and more.')
  ),
  0.00, 'month', 1, 1,
  JSON_ARRAY('Email Support', 'Phone Support (paid)', 'In-app Chat', 'HubSpot Community'),
  JSON_ARRAY('HubSpot Academy — free certifications', 'INBOUND conference', 'YouTube channel', 'Documentation', 'Knowledge Base'),
  JSON_ARRAY('English', 'Spanish', 'French', 'German', 'Portuguese', 'Italian', 'Japanese', 'Dutch'),
  1, 1,
  JSON_ARRAY('SOC 2 Type II', 'ISO 27001', 'ISO 27018', 'GDPR', 'HIPAA-eligible (Enterprise)', 'PCI DSS'),
  JSON_ARRAY('Forrester Wave Leader — B2B Marketing Automation 2024', 'G2 Best Software 2024', 'Glassdoor Best Places to Work'),
  'product', 'active', 'completed',
  (SELECT id FROM plans ORDER BY id ASC LIMIT 1),
  NOW(), NOW(), NOW(), NOW();


-- ───────────────────────────────────────────────────────────────────────────
-- 3) Zoho CRM — affordable, customizable all-in-one
-- ───────────────────────────────────────────────────────────────────────────
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url, screenshots, demo_video,
  founded_year, team_size, funding,
  linkedin, twitter, facebook,
  pricing_model, pricing_tiers,
  features, integrations, faqs, header_tags,
  pros, cons, industries_served, use_cases, target_company_sizes,
  key_features, starting_price, starting_price_period,
  has_free_trial, has_free_version,
  support_channels, training_options, languages,
  has_ios_app, has_android_app, compliance, awards,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Zoho CRM', 'zoho-crm', 'Zoho Team', 'support@zohocorp.com',
  '+1', NULL, 'https://www.zoho.com/crm/',
  (SELECT id FROM categories WHERE slug = 'all-in-one-crm-software' AND level = 3 LIMIT 1),
  (SELECT id FROM countries WHERE code = 'US' OR name = 'United States' LIMIT 1),
  'Pleasanton', 'Pleasanton, CA, USA & Chennai, India',
  'Affordable, customizable CRM that grows with your business — backed by Zoho One',
  'Zoho CRM is the flagship CRM product from Zoho Corporation, a privately-held global SaaS company founded in 1996 by Sridhar Vembu. With more than 250,000 businesses using Zoho CRM in 180+ countries, it''s known for an exceptional price-to-feature ratio and as the centerpiece of Zoho One — a $37/user/month all-employee bundle that includes 45+ Zoho apps spanning sales, marketing, finance, HR, IT, and operations. Zia, Zoho''s AI assistant, provides lead scoring, deal predictions, anomaly detection, and email sentiment analysis. Zoho is fiercely independent (private, never took venture money, builds nearly everything in-house), runs its own global data centers, and is famous for not selling customer data or running ads. For small businesses and growing teams that want enterprise-grade CRM without enterprise pricing, Zoho CRM is one of the strongest values in the market.',
  'https://www.google.com/s2/favicons?domain=zoho.com&sz=256',
  JSON_ARRAY(
    'https://image.thum.io/get/width/1600/crop/900/noanimate/https://www.zoho.com/crm/',
    'https://image.thum.io/get/width/1600/crop/900/noanimate/https://www.zoho.com/crm/comparisons/index.html'
  ),
  'https://www.youtube.com/watch?v=oQyU8Jpu07U',
  1996, '1000+', 'private',
  'https://www.linkedin.com/company/zoho', 'https://twitter.com/zoho', 'https://www.facebook.com/zoho',
  'freemium',
  JSON_ARRAY(
    JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month',
      'features', JSON_ARRAY('Up to 3 users', 'Contact, lead, account management', 'Tasks and events', 'Document library', 'Mobile apps')),
    JSON_OBJECT('name', 'Standard', 'price', 14, 'period', 'user / month',
      'features', JSON_ARRAY('Scoring rules', 'Workflows', 'Custom views and fields', '10 email templates per module')),
    JSON_OBJECT('name', 'Professional', 'price', 23, 'period', 'user / month',
      'features', JSON_ARRAY('Sales forecasting', 'Email integration', 'Google Ads integration', 'Process management')),
    JSON_OBJECT('name', 'Enterprise', 'price', 40, 'period', 'user / month',
      'features', JSON_ARRAY('Zia AI assistant', 'Canvas — drag-and-drop UI', 'Multi-user portals', 'Advanced customization')),
    JSON_OBJECT('name', 'Ultimate', 'price', 52, 'period', 'user / month',
      'features', JSON_ARRAY('Enhanced Zia AI', 'Advanced BI', 'Audit logs and DLP', 'Enhanced storage'))
  ),
  JSON_ARRAY(
    'Zia AI — lead scoring, predictions, anomaly detection',
    'Canvas — drag-and-drop CRM UI customization',
    'Workflow automation and macros',
    'Sales forecasting with predictive AI',
    'Email marketing built-in',
    'Multi-channel: email, phone, chat, social',
    'Mobile apps for iOS and Android',
    'CommandCenter — process orchestration',
    'Zoho Marketplace — 1,000+ integrations',
    'Zoho One — 45+ apps bundle for $37/user/mo'
  ),
  JSON_ARRAY(
    JSON_OBJECT('name', 'Gmail', 'website', 'https://gmail.com',
                'description', 'Zoho CRM Chrome extension brings CRM context into Gmail.'),
    JSON_OBJECT('name', 'Microsoft Outlook', 'website', 'https://outlook.live.com',
                'description', 'Two-way sync between Outlook and Zoho CRM.'),
    JSON_OBJECT('name', 'Slack', 'website', 'https://slack.com',
                'description', 'Get CRM updates and act on records from Slack.'),
    JSON_OBJECT('name', 'Microsoft Teams', 'website', 'https://www.microsoft.com/microsoft-teams',
                'description', 'Embed Zoho CRM records into Teams chats and channels.'),
    JSON_OBJECT('name', 'Google Workspace', 'website', 'https://workspace.google.com',
                'description', 'Single sign-on, Gmail sync, Drive integration, and Calendar.'),
    JSON_OBJECT('name', 'QuickBooks', 'website', 'https://quickbooks.intuit.com',
                'description', 'Sync customers, invoices, and payments between Zoho CRM and QuickBooks.'),
    JSON_OBJECT('name', 'Mailchimp', 'website', 'https://mailchimp.com',
                'description', 'Push CRM contacts into Mailchimp audiences and sync engagement.'),
    JSON_OBJECT('name', 'Shopify', 'website', 'https://www.shopify.com',
                'description', 'Sync Shopify customers and orders into Zoho CRM.'),
    JSON_OBJECT('name', 'Zoom', 'website', 'https://zoom.us',
                'description', 'Schedule, launch, and log Zoom meetings from records.'),
    JSON_OBJECT('name', 'Zapier', 'website', 'https://zapier.com',
                'description', 'Trigger CRM actions from 6,000+ apps via Zapier.'),
    JSON_OBJECT('name', 'Zoho One', 'website', 'https://www.zoho.com/one/',
                'description', 'Bundle Zoho CRM with 45+ Zoho apps for $37/user/mo.')
  ),
  JSON_ARRAY(
    JSON_OBJECT('question', 'What is Zoho CRM?',
                'answer', 'Zoho CRM is an all-in-one customer relationship management platform from Zoho Corporation. It manages leads, contacts, accounts, deals, and customer interactions across email, phone, chat, and social — at one of the lowest price points in the market.'),
    JSON_OBJECT('question', 'How much does Zoho CRM cost?',
                'answer', 'Zoho CRM has a free plan for up to 3 users. Paid plans start at $14/user/month (Standard) and go up to $52/user/month (Ultimate). All plans are dramatically less expensive than Salesforce or HubSpot.'),
    JSON_OBJECT('question', 'What is Zoho One?',
                'answer', 'Zoho One is the bundle of 45+ Zoho apps — including Zoho CRM, Books (accounting), Desk (helpdesk), Mail, Projects, Recruit, and many more — for $37/user/month. It''s designed to be your entire operating system.'),
    JSON_OBJECT('question', 'Is Zoho CRM better than Salesforce?',
                'answer', '"Better" depends on use case. Zoho CRM is dramatically cheaper, easier to set up, and includes more features in lower tiers. Salesforce has a larger ecosystem and is the standard for very large enterprises. Most SMB and mid-market customers find Zoho a better fit.'),
    JSON_OBJECT('question', 'What is Zia?',
                'answer', 'Zia is Zoho''s AI assistant. It provides lead and deal scoring, sales forecasting, email sentiment analysis, anomaly detection, and a conversational interface that lets you query CRM data in natural language.'),
    JSON_OBJECT('question', 'Does Zoho train AI on my data?',
                'answer', 'Zoho is famous for its privacy-first stance. It does not sell customer data, does not run third-party ads in its products, and trains AI only on first-party data within your account.')
  ),
  JSON_ARRAY('CRM', 'Affordable', 'All-in-One', 'Zoho One', 'Zia AI'),
  JSON_ARRAY(
    'Best price-to-features ratio in the market',
    'Zoho One bundles 45+ apps for $37/user/mo — unmatched value',
    'Forever-free plan for up to 3 users',
    'Zia AI included from Enterprise tier upward',
    'Strong customization via Canvas without code',
    'Privacy-first — no data sale, no third-party ads'
  ),
  JSON_ARRAY(
    'UI feels less polished than HubSpot or Salesforce',
    'Documentation can be inconsistent across Zoho apps',
    'Support response times slower than premium competitors',
    'Mobile apps less mature than CRMs that prioritize them'
  ),
  JSON_ARRAY('Software & SaaS', 'Retail', 'Education', 'Real Estate', 'Manufacturing', 'Healthcare', 'Financial Services', 'Cross-Industry'),
  JSON_ARRAY(
    'Sales pipeline and deal management',
    'Lead capture and lead scoring',
    'Email marketing and campaigns',
    'Customer support ticketing (via Zoho Desk)',
    'Sales forecasting',
    'Phone, chat, social omnichannel',
    'Custom app extensions via Zoho Creator',
    'All-business operating system via Zoho One'
  ),
  JSON_ARRAY('Small Businesses', 'Midsize Businesses', 'Enterprises'),
  JSON_ARRAY(
    JSON_OBJECT('name', 'Zia AI assistant', 'description', 'Lead and deal scoring, forecasting, email sentiment, anomaly alerts, and natural-language queries.'),
    JSON_OBJECT('name', 'Canvas designer', 'description', 'Drag-and-drop CRM UI customization — design layouts without code.'),
    JSON_OBJECT('name', 'Workflow automation', 'description', 'Build rule-based workflows, macros, and approval flows.'),
    JSON_OBJECT('name', 'CommandCenter', 'description', 'Process orchestration across deal stages, departments, and external systems.'),
    JSON_OBJECT('name', 'Multi-channel engagement', 'description', 'Engage leads across email, phone, chat, social, web forms, and webinars.'),
    JSON_OBJECT('name', 'Sales forecasting', 'description', 'Predictive forecasting powered by Zia, with multi-currency and territory support.'),
    JSON_OBJECT('name', 'Mobile CRM', 'description', 'Native iOS and Android apps with offline support and Zia voice queries.'),
    JSON_OBJECT('name', 'Zoho One bundle', 'description', '45+ Zoho apps — CRM, Books, Desk, Mail, Projects, Recruit, Survey, Forms — for $37/user/mo.')
  ),
  0.00, 'month', 1, 1,
  JSON_ARRAY('Email Support', 'Live Chat (paid)', 'Phone Support', 'Zoho Community', 'Help Center'),
  JSON_ARRAY('Zoho Academy', 'Zoholics conference', 'YouTube channel', 'Documentation', 'Webinars'),
  JSON_ARRAY('English', 'Spanish', 'French', 'German', 'Portuguese', 'Italian', 'Japanese', 'Chinese (Simplified)', 'Russian', 'Arabic', 'Hindi', 'Turkish', 'Dutch'),
  1, 1,
  JSON_ARRAY('SOC 2 Type II', 'ISO 27001', 'GDPR', 'HIPAA-eligible', 'CCPA'),
  JSON_ARRAY('Gartner Magic Quadrant Visionary — Sales Force Automation', 'G2 Best Software Award 2024', 'Capterra Top Performer'),
  'product', 'active', 'completed',
  (SELECT id FROM plans ORDER BY id ASC LIMIT 1),
  NOW(), NOW(), NOW(), NOW();


-- ───────────────────────────────────────────────────────────────────────────
-- 4) Pipedrive — sales-focused, easy CRM
-- ───────────────────────────────────────────────────────────────────────────
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url, screenshots, demo_video,
  founded_year, team_size, funding,
  linkedin, twitter, facebook,
  pricing_model, pricing_tiers,
  features, integrations, faqs, header_tags,
  pros, cons, industries_served, use_cases, target_company_sizes,
  key_features, starting_price, starting_price_period,
  has_free_trial, has_free_version,
  support_channels, training_options, languages,
  has_ios_app, has_android_app, compliance, awards,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Pipedrive', 'pipedrive', 'Pipedrive Team', 'support@pipedrive.com',
  '+1', NULL, 'https://www.pipedrive.com',
  (SELECT id FROM categories WHERE slug = 'all-in-one-crm-software' AND level = 3 LIMIT 1),
  (SELECT id FROM countries WHERE code = 'US' OR name = 'United States' LIMIT 1),
  'New York', 'New York, NY, USA & Tallinn, Estonia',
  'Easy-to-use sales CRM built by salespeople, for salespeople',
  'Pipedrive is a sales-focused CRM used by 100,000+ companies in 179 countries. Founded in 2010 in Tallinn, Estonia, Pipedrive was built by salespeople frustrated with bloated, overly-engineered enterprise CRMs. The result is the most pipeline-centric CRM on the market — a visual, drag-and-drop kanban-style view that makes "what deal needs attention next?" instantly obvious. Pipedrive has been profitable nearly since launch, was acquired by Vista Equity Partners in 2020, and now powers sales teams at SMB through mid-market. Recent additions include Pipedrive AI (deal summaries, lead scoring, email drafting), Smart Docs (proposals/contracts), Campaigns (email marketing), and Projects (post-sale delivery tracking). For sales teams that want a CRM the team will actually use, Pipedrive is consistently ranked as the easiest-to-adopt option.',
  'https://www.google.com/s2/favicons?domain=pipedrive.com&sz=256',
  JSON_ARRAY(
    'https://image.thum.io/get/width/1600/crop/900/noanimate/https://www.pipedrive.com/',
    'https://image.thum.io/get/width/1600/crop/900/noanimate/https://www.pipedrive.com/en/pricing'
  ),
  'https://www.youtube.com/watch?v=jvKBVWiEpAM',
  2010, '501-1000', 'private',
  'https://www.linkedin.com/company/pipedrive', 'https://twitter.com/pipedrive', 'https://www.facebook.com/pipedrive',
  'subscription',
  JSON_ARRAY(
    JSON_OBJECT('name', 'Essential', 'price', 14, 'period', 'user / month',
      'features', JSON_ARRAY('Pipeline management', 'Email integration', 'Contact and deal management', 'Mobile apps', '24/7 chat support')),
    JSON_OBJECT('name', 'Advanced', 'price', 29, 'period', 'user / month',
      'features', JSON_ARRAY('Email sync and tracking', 'Workflow automation', 'Meeting and email scheduler', 'Open APIs')),
    JSON_OBJECT('name', 'Professional', 'price', 59, 'period', 'user / month',
      'features', JSON_ARRAY('AI Sales Assistant', 'Forecast reports', 'eSignature with Smart Docs', 'Lead routing', 'Custom dashboards')),
    JSON_OBJECT('name', 'Power', 'price', 69, 'period', 'user / month',
      'features', JSON_ARRAY('Project planning + delivery tracking', 'Phone support', 'Higher API limits', 'Enhanced permissions')),
    JSON_OBJECT('name', 'Enterprise', 'price', 99, 'period', 'user / month',
      'features', JSON_ARRAY('Unlimited reports and customization', 'Granular permissions', 'Security alerts', 'SSO', 'Dedicated implementation manager'))
  ),
  JSON_ARRAY(
    'Visual sales pipeline (kanban deals view)',
    'Pipedrive AI — deal summaries + email drafting',
    'Email sync with Gmail and Outlook',
    'Meeting scheduler and email templates',
    'Workflow automation',
    'Smart Docs — proposals, quotes, eSign',
    'Campaigns — email marketing add-on',
    'Projects — post-sale delivery tracking',
    'Web forms and chatbot (LeadBooster)',
    'Mobile app for iOS and Android'
  ),
  JSON_ARRAY(
    JSON_OBJECT('name', 'Gmail', 'website', 'https://gmail.com',
                'description', 'Native Gmail sidebar showing deal context, with auto-logging.'),
    JSON_OBJECT('name', 'Microsoft Outlook', 'website', 'https://outlook.live.com',
                'description', 'Two-way email sync with Outlook calendars and contacts.'),
    JSON_OBJECT('name', 'Slack', 'website', 'https://slack.com',
                'description', 'Get deal updates and notifications in Slack channels.'),
    JSON_OBJECT('name', 'Microsoft Teams', 'website', 'https://www.microsoft.com/microsoft-teams',
                'description', 'Pipedrive notifications and quick deal lookup inside Teams.'),
    JSON_OBJECT('name', 'Zoom', 'website', 'https://zoom.us',
                'description', 'Schedule, launch, and log Zoom meetings from deal records.'),
    JSON_OBJECT('name', 'QuickBooks', 'website', 'https://quickbooks.intuit.com',
                'description', 'Sync invoices and payments between Pipedrive and QuickBooks.'),
    JSON_OBJECT('name', 'Trello', 'website', 'https://trello.com',
                'description', 'Mirror deals to Trello boards for cross-team visibility.'),
    JSON_OBJECT('name', 'Asana', 'website', 'https://asana.com',
                'description', 'Push won deals into Asana as projects for delivery teams.'),
    JSON_OBJECT('name', 'Mailchimp', 'website', 'https://mailchimp.com',
                'description', 'Sync contacts to Mailchimp audiences for email campaigns.'),
    JSON_OBJECT('name', 'Zapier', 'website', 'https://zapier.com',
                'description', 'Connect Pipedrive to 6,000+ apps via Zapier.'),
    JSON_OBJECT('name', 'LinkedIn Sales Navigator', 'website', 'https://www.linkedin.com/sales',
                'description', 'Bring LinkedIn lead context into Pipedrive contact records.')
  ),
  JSON_ARRAY(
    JSON_OBJECT('question', 'What is Pipedrive?',
                'answer', 'Pipedrive is a sales-focused CRM built around a visual, kanban-style pipeline view. It''s designed to be the CRM your sales team actually wants to use — fast to set up, intuitive, and laser-focused on moving deals through stages.'),
    JSON_OBJECT('question', 'How much does Pipedrive cost?',
                'answer', 'Pipedrive starts at $14/user/month (Essential) and goes up to $99/user/month (Enterprise). Most teams choose Professional ($59/user/month) for AI Sales Assistant, forecasts, and Smart Docs.'),
    JSON_OBJECT('question', 'Is Pipedrive better for SMB or enterprise?',
                'answer', 'Pipedrive is strongest for SMB and mid-market sales teams (2–500 reps). For very large enterprises with complex multi-product, multi-team needs, Salesforce or HubSpot Enterprise typically scale better.'),
    JSON_OBJECT('question', 'Does Pipedrive have AI features?',
                'answer', 'Yes — Pipedrive AI (Sales Assistant) generates deal summaries, drafts emails, scores leads, and recommends next best actions. AI features are included from the Professional tier upward.'),
    JSON_OBJECT('question', 'Is there a free trial?',
                'answer', 'Yes — every Pipedrive plan offers a 14-day free trial with all features unlocked. No credit card required.'),
    JSON_OBJECT('question', 'Can Pipedrive handle email marketing?',
                'answer', 'Yes — via the Campaigns add-on, which adds email marketing alongside the CRM. Campaigns is priced separately from the core plans.')
  ),
  JSON_ARRAY('Sales CRM', 'Pipeline Management', 'SMB', 'Visual CRM', 'Easy Setup'),
  JSON_ARRAY(
    'Easiest CRM to adopt — minimal training required',
    'Visual pipeline view makes deal status instantly obvious',
    'Strong AI Sales Assistant included from Professional tier',
    'Smart Docs adds proposals + eSign without leaving the CRM',
    'Excellent mobile experience for field reps',
    'Affordable starting tier ($14/user/mo)'
  ),
  JSON_ARRAY(
    'Sales-focused — weaker on marketing and service workflows',
    'Per-feature add-ons (Campaigns, LeadBooster, Web Visitors) stack up',
    'Less customizable for complex enterprise data models',
    'Reporting is good but less powerful than Salesforce or HubSpot Enterprise'
  ),
  JSON_ARRAY('Software & SaaS', 'Real Estate', 'Consulting', 'Marketing', 'Manufacturing', 'Construction', 'Retail', 'Education'),
  JSON_ARRAY(
    'B2B sales pipeline management',
    'Inside sales and SDR teams',
    'Field sales with mobile-first reps',
    'Quote and proposal management',
    'Deal forecasting',
    'Email outreach sequences',
    'Project delivery handoff post-sale',
    'Multi-pipeline (sales / partnerships / renewals)'
  ),
  JSON_ARRAY('Small Businesses', 'Midsize Businesses'),
  JSON_ARRAY(
    JSON_OBJECT('name', 'Visual sales pipeline', 'description', 'Drag-and-drop kanban view of every deal — the feature Pipedrive is famous for.'),
    JSON_OBJECT('name', 'AI Sales Assistant', 'description', 'Generates deal summaries, drafts personalized emails, scores leads, and recommends next actions.'),
    JSON_OBJECT('name', 'Smart Docs', 'description', 'Create proposals, quotes, and contracts with eSign — no separate tool needed.'),
    JSON_OBJECT('name', 'Workflow automation', 'description', 'Trigger emails, tasks, and stage updates based on deal events.'),
    JSON_OBJECT('name', 'Email sync', 'description', 'Two-way Gmail and Outlook sync logs every conversation automatically.'),
    JSON_OBJECT('name', 'Forecast reports', 'description', 'Weighted and rolling forecasts with quota tracking.'),
    JSON_OBJECT('name', 'LeadBooster', 'description', 'Add-on bundle with chatbot, live chat, web forms, and prospector tool.'),
    JSON_OBJECT('name', 'Projects', 'description', 'Track post-sale delivery and onboarding inside the same CRM.')
  ),
  14.00, 'user / month', 1, 0,
  JSON_ARRAY('24/7 Chat Support', 'Phone Support (Power+)', 'Help Center', 'Pipedrive Community'),
  JSON_ARRAY('Pipedrive Academy', 'YouTube channel', 'Webinars', 'Documentation', 'Knowledge Base'),
  JSON_ARRAY('English', 'Spanish', 'French', 'German', 'Portuguese', 'Italian', 'Dutch', 'Russian', 'Polish', 'Japanese', 'Korean', 'Czech', 'Norwegian', 'Estonian', 'Turkish'),
  1, 1,
  JSON_ARRAY('SOC 2 Type II', 'ISO 27001', 'GDPR', 'CCPA'),
  JSON_ARRAY('G2 Best CRM Software 2024', 'Capterra Best Value', 'GetApp Category Leader'),
  'product', 'active', 'completed',
  (SELECT id FROM plans ORDER BY id ASC LIMIT 1),
  NOW(), NOW(), NOW(), NOW();


-- ───────────────────────────────────────────────────────────────────────────
-- 5) Freshsales — AI-powered CRM by Freshworks
-- ───────────────────────────────────────────────────────────────────────────
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url, screenshots, demo_video,
  founded_year, team_size, funding,
  linkedin, twitter, facebook,
  pricing_model, pricing_tiers,
  features, integrations, faqs, header_tags,
  pros, cons, industries_served, use_cases, target_company_sizes,
  key_features, starting_price, starting_price_period,
  has_free_trial, has_free_version,
  support_channels, training_options, languages,
  has_ios_app, has_android_app, compliance, awards,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Freshsales', 'freshsales', 'Freshworks Team', 'support@freshworks.com',
  '+1', NULL, 'https://www.freshworks.com/crm/sales/',
  (SELECT id FROM categories WHERE slug = 'all-in-one-crm-software' AND level = 3 LIMIT 1),
  (SELECT id FROM countries WHERE code = 'US' OR name = 'United States' LIMIT 1),
  'San Mateo', 'San Mateo, CA, United States',
  'AI-powered sales CRM by Freshworks — built for high-velocity sales teams',
  'Freshsales is the sales CRM from Freshworks (NASDAQ: FRSH), the publicly-traded SaaS company behind Freshdesk, Freshchat, Freshservice, and Freshcaller. Founded in 2010 by Girish Mathrubootham and headquartered in San Mateo, California, Freshworks serves 73,000+ businesses globally. Freshsales pairs an intuitive sales pipeline with Freddy AI — generative AI for email drafting, deal predictions, and conversational chat — and integrates natively with the rest of the Freshworks suite (helpdesk, marketing, telephony) for companies that want a unified customer engagement stack without Salesforce-level complexity. Freshsales is particularly strong for high-velocity inside sales teams that need a CRM with built-in phone (Freshcaller), chat, and email under one license.',
  'https://www.google.com/s2/favicons?domain=freshworks.com&sz=256',
  JSON_ARRAY(
    'https://image.thum.io/get/width/1600/crop/900/noanimate/https://www.freshworks.com/crm/sales/',
    'https://image.thum.io/get/width/1600/crop/900/noanimate/https://www.freshworks.com/crm/sales/pricing/'
  ),
  'https://www.youtube.com/watch?v=DDNiFXg-Eqg',
  2010, '1000+', 'public',
  'https://www.linkedin.com/company/freshworks-inc', 'https://twitter.com/freshworks', 'https://www.facebook.com/freshworksinc',
  'freemium',
  JSON_ARRAY(
    JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month',
      'features', JSON_ARRAY('Up to 3 users', 'Contact lifecycle stages', 'Built-in email and phone', 'Kanban view', 'Mobile apps')),
    JSON_OBJECT('name', 'Growth', 'price', 9, 'period', 'user / month',
      'features', JSON_ARRAY('Sales sequences', 'Custom sales activities', '2,000 bot sessions/mo', 'Visual sales pipeline', 'Workflow automation')),
    JSON_OBJECT('name', 'Pro', 'price', 39, 'period', 'user / month',
      'features', JSON_ARRAY('Multiple pipelines', 'Freddy AI deal insights', 'Time-based workflows', 'Sales sequences', 'Custom dashboards')),
    JSON_OBJECT('name', 'Enterprise', 'price', 59, 'period', 'user / month',
      'features', JSON_ARRAY('Custom modules', 'Audit logs', 'Sandbox', 'Dedicated account manager', 'Field-level permissions')),
    JSON_OBJECT('name', 'Custom', 'price', NULL, 'period', 'custom',
      'features', JSON_ARRAY('Volume discounts', 'Implementation services', 'Custom SLA'))
  ),
  JSON_ARRAY(
    'Freddy AI — deal insights and email drafting',
    'Built-in phone (Freshcaller) and email',
    'Sales sequences and cadences',
    'Kanban and forecast views',
    'Workflow automation',
    'Web forms and chat (Freshchat)',
    'Mobile apps for iOS and Android',
    'Native integration with Freshdesk and Freshservice',
    '180+ third-party integrations',
    'Multi-currency and multi-language'
  ),
  JSON_ARRAY(
    JSON_OBJECT('name', 'Freshdesk', 'website', 'https://www.freshworks.com/freshdesk/',
                'description', 'Freshworks helpdesk — natively integrated with Freshsales for full customer 360.'),
    JSON_OBJECT('name', 'Freshchat', 'website', 'https://www.freshworks.com/live-chat-software/',
                'description', 'Conversational engagement and chatbot included in Freshworks bundles.'),
    JSON_OBJECT('name', 'Gmail', 'website', 'https://gmail.com',
                'description', 'Two-way Gmail sync with email tracking and auto-logging.'),
    JSON_OBJECT('name', 'Microsoft Outlook', 'website', 'https://outlook.live.com',
                'description', 'Outlook calendar and email sync.'),
    JSON_OBJECT('name', 'Slack', 'website', 'https://slack.com',
                'description', 'Get sales notifications and act on deals from Slack.'),
    JSON_OBJECT('name', 'Microsoft Teams', 'website', 'https://www.microsoft.com/microsoft-teams',
                'description', 'Freshsales notifications and deal lookup inside Teams.'),
    JSON_OBJECT('name', 'Zoom', 'website', 'https://zoom.us',
                'description', 'Schedule and log Zoom meetings from records.'),
    JSON_OBJECT('name', 'Calendly', 'website', 'https://calendly.com',
                'description', 'Sync Calendly bookings as activities and deals.'),
    JSON_OBJECT('name', 'Mailchimp', 'website', 'https://mailchimp.com',
                'description', 'Sync contacts to Mailchimp audiences for email marketing.'),
    JSON_OBJECT('name', 'Zapier', 'website', 'https://zapier.com',
                'description', 'Connect Freshsales to 6,000+ apps via Zapier.'),
    JSON_OBJECT('name', 'QuickBooks', 'website', 'https://quickbooks.intuit.com',
                'description', 'Sync customers and invoices with QuickBooks accounting.')
  ),
  JSON_ARRAY(
    JSON_OBJECT('question', 'What is Freshsales?',
                'answer', 'Freshsales is the sales CRM from Freshworks. It combines pipeline management, built-in phone, email, and chat with Freddy AI for high-velocity inside sales teams that want a unified customer engagement stack without Salesforce complexity.'),
    JSON_OBJECT('question', 'How much does Freshsales cost?',
                'answer', 'Freshsales has a free plan for up to 3 users. Paid plans start at $9/user/month (Growth) and go up to $59/user/month (Enterprise). All plans include 21-day free trial of higher tiers.'),
    JSON_OBJECT('question', 'How is Freshsales different from Pipedrive or HubSpot?',
                'answer', 'Freshsales bundles phone (Freshcaller) and chat (Freshchat) inside the CRM license — useful for inside sales teams that make many calls. Pipedrive and HubSpot require separate phone tools. HubSpot has a stronger marketing suite; Pipedrive is more pipeline-focused.'),
    JSON_OBJECT('question', 'What is Freddy AI?',
                'answer', 'Freddy is Freshworks'' AI layer. In Freshsales it provides deal predictions, lead scoring, email drafting, and conversational chat assistance. Freddy is included from the Pro tier upward.'),
    JSON_OBJECT('question', 'Can I bundle Freshsales with other Freshworks products?',
                'answer', 'Yes — Freshworks offers bundles like the Customer-for-Life Cloud that combine Freshsales (CRM), Freshdesk (helpdesk), and Freshchat (messaging) at a discount.'),
    JSON_OBJECT('question', 'Is Freshsales good for outbound sales?',
                'answer', 'Yes — Freshsales has strong sales sequences, cadences, and built-in phone (Freshcaller). It''s designed specifically for high-velocity outbound and inside sales teams.')
  ),
  JSON_ARRAY('CRM', 'Sales CRM', 'Freshworks', 'Freddy AI', 'Inside Sales'),
  JSON_ARRAY(
    'Built-in phone (Freshcaller) and chat in the CRM license',
    'Freddy AI deal predictions and email drafting',
    'Strong free plan for up to 3 users',
    'Native integration with Freshdesk for unified customer 360',
    'Modern, fast UI — less cluttered than older CRMs',
    'Affordable mid-market pricing'
  ),
  JSON_ARRAY(
    'Marketing automation weaker than HubSpot',
    'Smaller third-party app ecosystem than Salesforce or HubSpot',
    'Some advanced AI features gated to Enterprise tier',
    'Less brand recognition than Salesforce or HubSpot in enterprise sales'
  ),
  JSON_ARRAY('Software & SaaS', 'Education', 'Real Estate', 'Marketing', 'Healthcare', 'Financial Services', 'Manufacturing', 'Retail'),
  JSON_ARRAY(
    'Inside sales and SDR teams (high-velocity outbound)',
    'B2B sales pipeline management',
    'Multi-channel engagement (phone, email, chat)',
    'Lead capture and scoring',
    'Sales sequences and cadences',
    'Multi-pipeline (sales / partnerships / renewals)',
    'Customer 360 across CRM + helpdesk',
    'Multi-currency international sales'
  ),
  JSON_ARRAY('Small Businesses', 'Midsize Businesses', 'Enterprises'),
  JSON_ARRAY(
    JSON_OBJECT('name', 'Freddy AI', 'description', 'Generative AI for deal predictions, lead scoring, email drafting, and conversational chat.'),
    JSON_OBJECT('name', 'Built-in phone (Freshcaller)', 'description', 'Make and receive sales calls directly inside the CRM — included in every plan.'),
    JSON_OBJECT('name', 'Sales sequences', 'description', 'Automated multi-step email + call cadences for outbound teams.'),
    JSON_OBJECT('name', 'Visual sales pipeline', 'description', 'Kanban-style pipeline with drag-and-drop deal management.'),
    JSON_OBJECT('name', 'Workflow automation', 'description', 'Trigger emails, tasks, and stage updates based on deal events.'),
    JSON_OBJECT('name', 'Multi-currency', 'description', 'Manage deals across 100+ currencies with auto-conversion.'),
    JSON_OBJECT('name', 'Native Freshworks integration', 'description', 'Unified customer 360 across Freshdesk, Freshchat, and Freshservice.'),
    JSON_OBJECT('name', 'Mobile CRM', 'description', 'Native iOS and Android apps with offline support and Freddy voice queries.')
  ),
  0.00, 'month', 1, 1,
  JSON_ARRAY('24/5 Email Support', 'Phone Support (Pro+)', 'Live Chat', 'Freshworks Community'),
  JSON_ARRAY('Freshworks Academy', 'Refresh conference', 'YouTube channel', 'Documentation', 'Webinars'),
  JSON_ARRAY('English', 'Spanish', 'French', 'German', 'Portuguese', 'Italian', 'Dutch', 'Russian', 'Polish', 'Japanese', 'Chinese (Simplified)', 'Korean', 'Turkish', 'Arabic'),
  1, 1,
  JSON_ARRAY('SOC 2 Type II', 'ISO 27001', 'ISO 27017', 'ISO 27018', 'GDPR', 'HIPAA', 'CCPA'),
  JSON_ARRAY('G2 Best CRM 2024', 'Forbes Cloud 100', 'Gartner Magic Quadrant Visionary'),
  'product', 'active', 'completed',
  (SELECT id FROM plans ORDER BY id ASC LIMIT 1),
  NOW(), NOW(), NOW(), NOW();


-- ═══════════════════════════════════════════════════════════════════════════
-- DONE — verify with:
--   SELECT id, slug, status, payment_status, category_id
--     FROM submissions
--    WHERE slug IN ('salesforce','hubspot','zoho-crm','pipedrive','freshsales');
--
-- Then rebuild static page for each on /iww-hq/submissions OR push an empty
-- commit to trigger Vercel build that picks all up.
-- ═══════════════════════════════════════════════════════════════════════════
