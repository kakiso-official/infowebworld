-- ═══════════════════════════════════════════════════════════════════════════
-- AI/ML Top 5 listings — same category as Claude (all-purpose-ai-chat-companions)
-- 1) ChatGPT (OpenAI)   2) Gemini (Google)   3) Microsoft Copilot
-- 4) Perplexity         5) DeepSeek
--
-- All listings mirror Claude's schema:
--   • Logo from Google s2 favicon (matches rest-of-site convention)
--   • 2 live screenshots via image.thum.io (no API key needed)
--   • pricing_tiers with proper free=0, custom=null handling
--   • pros / cons arrays
--   • integrations with name + website (logos auto-fetched on render)
--   • faqs with question/answer keys (NOT q/a — must match FaqItem type)
--   • target_company_sizes uses bar-matching labels (Small/Midsize/Enterprises)
--   • status='active', payment_status='completed' → live immediately
--
-- After running, click "Rebuild static page" on each in /iww-hq/submissions
-- OR push an empty commit to trigger Vercel build that picks all up.
-- ═══════════════════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────────────────
-- 1) ChatGPT — by OpenAI
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
  UUID(), 'ChatGPT', 'chatgpt', 'OpenAI Team', 'support@openai.com',
  '+1', NULL, 'https://chat.openai.com',
  (SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1),
  (SELECT id FROM countries WHERE code = 'US' OR name = 'United States' LIMIT 1),
  'San Francisco', 'San Francisco, CA, United States',
  'The world''s most-used AI assistant — chat, search, code, and create with GPT',
  'ChatGPT is OpenAI''s flagship conversational AI, the product that brought generative AI to over 200 million weekly active users. Powered by the GPT family of models, ChatGPT handles everything from quick answers and brainstorming to complex reasoning, code generation, agentic tasks, image generation via DALL·E, voice conversations, and live web browsing. The free tier gives access to GPT-5 with limited usage; ChatGPT Plus ($20/mo) unlocks higher limits and advanced features; ChatGPT Pro ($200/mo) gives near-unlimited access plus o1-pro reasoning; Team ($25/user/mo) and Enterprise plans add SSO, admin controls, and zero data-retention. ChatGPT is available on web, native iOS and Android apps, macOS and Windows desktops, and via the OpenAI API for developers. It is the most installed AI assistant on the App Store and continues to set the pace for the entire industry on capability, ecosystem, and product polish.',
  'https://www.google.com/s2/favicons?domain=openai.com&sz=256',
  JSON_ARRAY(
    'https://image.thum.io/get/width/1600/crop/900/noanimate/https://chat.openai.com/',
    'https://image.thum.io/get/width/1600/crop/900/noanimate/https://openai.com/chatgpt/pricing/'
  ),
  'https://www.youtube.com/watch?v=outcGtbnMuQ',
  2022, '1000+', 'series-e',
  'https://www.linkedin.com/company/openai', 'https://twitter.com/OpenAI', NULL,
  'freemium',
  JSON_ARRAY(
    JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month',
      'features', JSON_ARRAY('Access to GPT-5 with limited usage', 'Web search, voice mode, image generation', 'Mobile and desktop apps')),
    JSON_OBJECT('name', 'Plus', 'price', 20, 'period', 'month',
      'features', JSON_ARRAY('Higher usage limits on GPT-5', 'Advanced voice mode + Sora video', 'DALL·E image generation', 'Custom GPTs and GPT Store')),
    JSON_OBJECT('name', 'Pro', 'price', 200, 'period', 'month',
      'features', JSON_ARRAY('Near-unlimited GPT-5 usage', 'Access to o1-pro reasoning model', 'Pro voice + extended thinking', 'Priority access to new features')),
    JSON_OBJECT('name', 'Team', 'price', 25, 'period', 'user / month (annual)',
      'features', JSON_ARRAY('Everything in Plus for each member', 'Shared workspace and admin console', 'Higher usage caps', 'No training on team data')),
    JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom',
      'features', JSON_ARRAY('SSO, SCIM, audit logs', 'Domain verification', 'Unlimited GPT-5', 'Data residency and zero retention'))
  ),
  JSON_ARRAY('GPT-5 access', 'Voice mode (iOS, Android)', 'Web search with citations',
             'DALL·E image generation', 'Sora video (Plus+)', 'Custom GPTs and GPT Store',
             'Code Interpreter / Advanced Data Analysis', 'Canvas — collaborative editing',
             'Memory across conversations', 'Native desktop apps (Mac, Windows)'),
  JSON_ARRAY(
    JSON_OBJECT('name', 'Slack',     'website', 'https://slack.com',
                'description', 'Use ChatGPT inside Slack channels and DMs via the official integration.'),
    JSON_OBJECT('name', 'Microsoft Teams', 'website', 'https://www.microsoft.com/microsoft-teams',
                'description', 'ChatGPT for Teams adds GPT-powered chat to the Microsoft Teams workspace.'),
    JSON_OBJECT('name', 'Zapier',    'website', 'https://zapier.com',
                'description', 'Trigger ChatGPT actions from 6,000+ apps with no code.'),
    JSON_OBJECT('name', 'Google Drive', 'website', 'https://drive.google.com',
                'description', 'Attach Drive files directly into a chat for grounded Q&A.'),
    JSON_OBJECT('name', 'OneDrive',  'website', 'https://onedrive.live.com',
                'description', 'Native OneDrive connector for Microsoft 365 customers.'),
    JSON_OBJECT('name', 'GitHub',    'website', 'https://github.com',
                'description', 'Browse and reason about repos via the GitHub connector.'),
    JSON_OBJECT('name', 'Salesforce','website', 'https://salesforce.com',
                'description', 'Connect Salesforce records into ChatGPT for CRM workflows.'),
    JSON_OBJECT('name', 'Notion',    'website', 'https://notion.so',
                'description', 'Query Notion pages and databases from within ChatGPT.'),
    JSON_OBJECT('name', 'Gmail',     'website', 'https://gmail.com',
                'description', 'Draft, summarize, and analyze inbox content with Gmail connector.'),
    JSON_OBJECT('name', 'Stripe',    'website', 'https://stripe.com',
                'description', 'Process payments and subscriptions for ChatGPT business plans.'),
    JSON_OBJECT('name', 'Azure OpenAI Service', 'website', 'https://azure.microsoft.com/products/ai-services/openai-service',
                'description', 'Enterprise GPT access via Microsoft Azure cloud.')
  ),
  JSON_ARRAY(
    JSON_OBJECT('question', 'Is ChatGPT free?',
                'answer', 'Yes. The free plan gives access to GPT-5 with usage limits, voice mode, image generation, and web search. Paid plans (Plus, Pro, Team, Enterprise) unlock higher limits and advanced features.'),
    JSON_OBJECT('question', 'How is ChatGPT different from the OpenAI API?',
                'answer', 'ChatGPT is the consumer/team product with a chat UI, custom GPTs, and built-in tools. The OpenAI API is for developers building their own applications on top of GPT models, with pay-per-token billing.'),
    JSON_OBJECT('question', 'Does OpenAI train on my conversations?',
                'answer', 'On free and Plus plans you can opt out in settings. Team, Enterprise, and API-by-default do not train on your data.'),
    JSON_OBJECT('question', 'Which model does ChatGPT use?',
                'answer', 'ChatGPT runs on the GPT-5 family by default. Pro users also get access to o1-pro for advanced reasoning. The active model is shown in the message header.'),
    JSON_OBJECT('question', 'Can ChatGPT browse the web?',
                'answer', 'Yes. ChatGPT can search the web in real time and cite sources. The free plan has limited searches; paid plans have higher quotas.'),
    JSON_OBJECT('question', 'Is there an enterprise version?',
                'answer', 'Yes. ChatGPT Enterprise adds SSO, SCIM provisioning, audit logs, unlimited GPT-5 usage, zero data retention, and dedicated support.')
  ),
  JSON_ARRAY('AI Assistant', 'LLM', 'Chatbot', 'GPT-5', 'OpenAI'),
  JSON_ARRAY(
    'Largest user base and most mature ecosystem in consumer AI',
    'GPT Store + custom GPTs make domain-specific tools trivial to build',
    'Best-in-class voice mode and native multimodal (image, voice, video)',
    'Strong code generation and Advanced Data Analysis sandbox',
    'Available everywhere — web, iOS, Android, macOS, Windows',
    'Tightly integrated with Microsoft 365 via Azure OpenAI'
  ),
  JSON_ARRAY(
    'Free-tier limits get hit quickly during heavy usage',
    'Pro plan is expensive vs competitors ($200/mo)',
    'Hallucinations still occur on niche or recent topics',
    'Custom GPT discovery in the store can be hit-or-miss'
  ),
  JSON_ARRAY('Software & SaaS', 'Education', 'Financial Services', 'Marketing', 'Media & Publishing', 'Healthcare', 'Legal', 'Consulting'),
  JSON_ARRAY(
    'Long-form writing and drafting',
    'Code generation and debugging',
    'Research summarization across documents',
    'Customer support draft assistance',
    'Brainstorming and ideation',
    'Image and video generation',
    'Voice-mode hands-free assistance',
    'Multilingual translation and analysis'
  ),
  JSON_ARRAY('Small Businesses', 'Midsize Businesses', 'Enterprises'),
  JSON_ARRAY(
    JSON_OBJECT('name', 'GPT-5 reasoning', 'description', 'OpenAI''s flagship multimodal model with advanced reasoning, math, and coding.'),
    JSON_OBJECT('name', 'Voice mode', 'description', 'Natural, low-latency voice conversations with interruption support on iOS, Android, and web.'),
    JSON_OBJECT('name', 'DALL·E image generation', 'description', 'Generate, edit, and iterate on images directly inside the chat.'),
    JSON_OBJECT('name', 'Sora video', 'description', 'Text-to-video generation for Plus and Pro members.'),
    JSON_OBJECT('name', 'Custom GPTs', 'description', 'Build domain-specific assistants without code and share via the GPT Store.'),
    JSON_OBJECT('name', 'Canvas', 'description', 'Side-by-side document editor that lets you co-write and refactor with ChatGPT.'),
    JSON_OBJECT('name', 'Memory', 'description', 'Persistent memory across conversations so ChatGPT remembers your preferences.'),
    JSON_OBJECT('name', 'Advanced Data Analysis', 'description', 'Upload CSVs, PDFs, or images — ChatGPT analyzes and visualizes them in a sandbox.')
  ),
  0.00, 'month', 1, 1,
  JSON_ARRAY('Help Center', 'Email Support', 'Status Page', 'Community Forum'),
  JSON_ARRAY('Documentation', 'Cookbook & Examples', 'API Reference', 'YouTube channel', 'OpenAI Academy'),
  JSON_ARRAY('English', 'Spanish', 'French', 'German', 'Portuguese', 'Italian', 'Japanese', 'Korean', 'Chinese (Simplified)', 'Russian', 'Arabic', 'Hindi'),
  1, 1,
  JSON_ARRAY('SOC 2 Type II', 'CCPA', 'GDPR', 'HIPAA-eligible (Enterprise)', 'ISO 27001'),
  JSON_ARRAY('TIME 100 AI 2023 & 2024', 'Fast Company Most Innovative 2024', 'Forbes AI 50'),
  'product', 'active', 'completed',
  (SELECT id FROM plans ORDER BY id ASC LIMIT 1),
  NOW(), NOW(), NOW(), NOW();


-- ───────────────────────────────────────────────────────────────────────────
-- 2) Gemini — by Google
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
  UUID(), 'Gemini', 'gemini', 'Google Team', 'gemini-support@google.com',
  '+1', NULL, 'https://gemini.google.com',
  (SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1),
  (SELECT id FROM countries WHERE code = 'US' OR name = 'United States' LIMIT 1),
  'Mountain View', 'Mountain View, CA, United States',
  'Google''s most capable AI — multimodal, agentic, and built into everything you already use',
  'Gemini is Google''s flagship AI assistant, powered by the Gemini model family (Ultra, Pro, Flash, and Nano) and built natively into Google Search, Workspace, Android, Chrome, and the Gemini app. Originally launched as Bard in early 2023, Gemini was relaunched with the Gemini 1.0 model in late 2023 and has since shipped 1.5 (massive 2M-token context), 2.0 (agentic), and 2.5 (deep think) generations. Gemini 2.5 Pro is one of the highest-scoring publicly available models on reasoning, code, and math benchmarks. The free Gemini app gets access to Flash and is generous with usage; Google AI Pro ($19.99/mo) unlocks Gemini 2.5 Pro, Deep Research, Veo video generation, 2TB of Drive storage, and Gemini in Gmail/Docs; Google AI Ultra ($249.99/mo) adds higher caps, Veo 3, and early access. Enterprise customers run Gemini on Google Workspace and via Vertex AI on Google Cloud.',
  'https://www.google.com/s2/favicons?domain=gemini.google.com&sz=256',
  JSON_ARRAY(
    'https://image.thum.io/get/width/1600/crop/900/noanimate/https://gemini.google.com/',
    'https://image.thum.io/get/width/1600/crop/900/noanimate/https://one.google.com/about/google-ai-plans/'
  ),
  'https://www.youtube.com/watch?v=UIZAiXYceBI',
  2023, '1000+', 'public',
  'https://www.linkedin.com/company/google', 'https://twitter.com/GoogleDeepMind', NULL,
  'freemium',
  JSON_ARRAY(
    JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month',
      'features', JSON_ARRAY('Gemini 2.5 Flash on web and mobile', 'Generous daily limits', 'Imagen image generation (limited)', 'Voice and live conversation')),
    JSON_OBJECT('name', 'Google AI Pro', 'price', 19.99, 'period', 'month',
      'features', JSON_ARRAY('Gemini 2.5 Pro access', 'Deep Research mode', 'Veo video generation', 'Gemini in Gmail, Docs, Sheets, Meet', '2TB Google Drive storage')),
    JSON_OBJECT('name', 'Google AI Ultra', 'price', 249.99, 'period', 'month',
      'features', JSON_ARRAY('Highest Gemini 2.5 Pro caps', 'Veo 3 video generation', 'Early access to new features', '30TB storage')),
    JSON_OBJECT('name', 'Workspace Business', 'price', 14, 'period', 'user / month',
      'features', JSON_ARRAY('Gemini for Workspace add-on', 'Side panel in Gmail/Docs/Sheets', 'Help me write, organize, visualize')),
    JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom',
      'features', JSON_ARRAY('Vertex AI Gemini API', 'Data residency and VPC controls', 'SLA + dedicated support'))
  ),
  JSON_ARRAY(
    '2-million-token context window (1.5 Pro)',
    'Gemini 2.5 Pro reasoning model',
    'Deep Research multi-step web report',
    'Veo + Imagen for video and image generation',
    'Live voice conversation with screen + camera share',
    'Native integration into Gmail, Docs, Sheets, Slides, Meet, and Calendar',
    'Gemini in Android, Chrome, and Pixel',
    'Custom Gems (custom assistants like GPTs)',
    'Code execution and data analysis',
    'Multimodal input — text, image, audio, video, PDF'
  ),
  JSON_ARRAY(
    JSON_OBJECT('name', 'Gmail',             'website', 'https://gmail.com',
                'description', 'Native Gemini side panel in Gmail for summarizing threads and drafting replies.'),
    JSON_OBJECT('name', 'Google Docs',       'website', 'https://docs.google.com',
                'description', 'Help me write, refine, and refactor documents directly inside Docs.'),
    JSON_OBJECT('name', 'Google Sheets',     'website', 'https://sheets.google.com',
                'description', 'Generate formulas, summarize ranges, and create charts via Gemini.'),
    JSON_OBJECT('name', 'Google Slides',     'website', 'https://slides.google.com',
                'description', 'Generate slide content and Imagen-powered images inside presentations.'),
    JSON_OBJECT('name', 'Google Meet',       'website', 'https://meet.google.com',
                'description', 'Live captioning, summaries, and "take notes for me" inside Meet.'),
    JSON_OBJECT('name', 'Google Calendar',   'website', 'https://calendar.google.com',
                'description', 'Schedule events and reason about your calendar via Gemini.'),
    JSON_OBJECT('name', 'Google Drive',      'website', 'https://drive.google.com',
                'description', 'Ground Gemini in your Drive files for personalized answers.'),
    JSON_OBJECT('name', 'Chrome',            'website', 'https://www.google.com/chrome/',
                'description', 'Gemini side panel for any tab; ask questions about the page you''re on.'),
    JSON_OBJECT('name', 'Android',           'website', 'https://www.android.com',
                'description', 'System-wide Gemini assistant replacing Google Assistant on Android.'),
    JSON_OBJECT('name', 'Google Vertex AI',  'website', 'https://cloud.google.com/vertex-ai',
                'description', 'Enterprise Gemini API with VPC, IAM, and data residency.'),
    JSON_OBJECT('name', 'Pixel',             'website', 'https://store.google.com/category/phones',
                'description', 'Deep Gemini integration on Pixel phones for on-device AI features.')
  ),
  JSON_ARRAY(
    JSON_OBJECT('question', 'Is Gemini free?',
                'answer', 'Yes. The Gemini app (web, iOS, Android) offers Gemini 2.5 Flash free with generous daily limits. Google AI Pro ($19.99/mo) and Google AI Ultra ($249.99/mo) unlock Pro and Ultra model tiers.'),
    JSON_OBJECT('question', 'What is the difference between Gemini and Google Assistant?',
                'answer', 'Gemini is the next-generation AI assistant that replaces Google Assistant on Android. It can have longer conversations, reason over multiple documents, generate images and video, and use your apps directly.'),
    JSON_OBJECT('question', 'Can Gemini work with my Gmail and Docs?',
                'answer', 'Yes. Google AI Pro and Workspace plans give Gemini access to your Gmail threads, Docs, Sheets, Drive files, and Calendar — so it can summarize, draft, and reason over your own data.'),
    JSON_OBJECT('question', 'What is the Gemini context window?',
                'answer', 'Gemini 1.5 Pro and 2.5 Pro support up to 2 million tokens of context — roughly 1,500 pages of text — far larger than most competitors.'),
    JSON_OBJECT('question', 'Can I use Gemini via API?',
                'answer', 'Yes. The Gemini API is available directly from Google AI Studio and through Google Cloud Vertex AI for enterprise customers.'),
    JSON_OBJECT('question', 'Does Google train on my Gemini conversations?',
                'answer', 'Free Gemini conversations may be reviewed by humans for product improvement (you can disable activity tracking). Workspace and Vertex AI enterprise plans do NOT train on your data.')
  ),
  JSON_ARRAY('AI Assistant', 'LLM', 'Multimodal', 'Google', 'Gemini 2.5'),
  JSON_ARRAY(
    '2-million-token context window — best-in-class for long documents',
    'Native integration with Gmail, Docs, Sheets, Drive, Calendar, Meet',
    'Strong multimodal capabilities — text, image, audio, video, PDF',
    'Deep Research mode generates structured reports with citations',
    'Free tier is genuinely useful with high daily limits',
    'Veo + Imagen unlock state-of-the-art video and image generation'
  ),
  JSON_ARRAY(
    'Gemini app UX is still catching up to ChatGPT in polish',
    'Some features rolled out unevenly across regions',
    'Workspace add-on pricing can stack quickly for large orgs',
    'Strong inside the Google ecosystem; weaker outside it'
  ),
  JSON_ARRAY('Software & SaaS', 'Education', 'Marketing', 'Media & Publishing', 'Healthcare', 'Legal', 'Retail', 'Government'),
  JSON_ARRAY(
    'Long-context document analysis (up to 1,500 pages)',
    'Gmail and Docs drafting inside Google Workspace',
    'Deep Research — multi-step structured reports',
    'Image and video generation via Imagen + Veo',
    'Live voice + screen-share conversations',
    'Coding and data analysis via the Gemini API',
    'Multilingual search and writing',
    'Pixel and Android on-device assistant tasks'
  ),
  JSON_ARRAY('Small Businesses', 'Midsize Businesses', 'Enterprises'),
  JSON_ARRAY(
    JSON_OBJECT('name', '2M-token context window', 'description', 'Reason across the equivalent of 1,500 pages of text in a single prompt — best-in-class.'),
    JSON_OBJECT('name', 'Deep Research', 'description', 'Multi-step browsing agent that compiles a structured, cited report on any topic.'),
    JSON_OBJECT('name', 'Gemini Live', 'description', 'Natural voice conversation with camera + screen share for hands-on help.'),
    JSON_OBJECT('name', 'Imagen image generation', 'description', 'High-quality image generation built into Gemini and Workspace apps.'),
    JSON_OBJECT('name', 'Veo video generation', 'description', 'Text-to-video for Pro and Ultra subscribers.'),
    JSON_OBJECT('name', 'Workspace integration', 'description', 'Side panel inside Gmail, Docs, Sheets, Slides, and Meet.'),
    JSON_OBJECT('name', 'Gems', 'description', 'Custom assistants pre-configured with instructions and files — Google''s answer to custom GPTs.'),
    JSON_OBJECT('name', 'Multimodal input', 'description', 'Drop in images, PDFs, audio, and video — Gemini reads them natively.')
  ),
  0.00, 'month', 1, 1,
  JSON_ARRAY('Help Center', 'Community Forum', 'Workspace Support (paid)', 'Status Page'),
  JSON_ARRAY('Documentation', 'Workspace Learning Center', 'YouTube channel', 'Google AI Studio'),
  JSON_ARRAY('English', 'Spanish', 'French', 'German', 'Portuguese', 'Italian', 'Japanese', 'Korean', 'Chinese (Simplified)', 'Hindi', 'Arabic', 'Russian', 'Turkish'),
  1, 1,
  JSON_ARRAY('SOC 2 Type II', 'ISO 27001', 'GDPR', 'HIPAA (Workspace)', 'FedRAMP High (Workspace)'),
  JSON_ARRAY('Google I/O 2024 announcement', 'LMSys leaderboard top-3', 'Forbes AI 50'),
  'product', 'active', 'completed',
  (SELECT id FROM plans ORDER BY id ASC LIMIT 1),
  NOW(), NOW(), NOW(), NOW();


-- ───────────────────────────────────────────────────────────────────────────
-- 3) Microsoft Copilot
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
  UUID(), 'Microsoft Copilot', 'microsoft-copilot', 'Microsoft Team', 'support@microsoft.com',
  '+1', NULL, 'https://copilot.microsoft.com',
  (SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1),
  (SELECT id FROM countries WHERE code = 'US' OR name = 'United States' LIMIT 1),
  'Redmond', 'Redmond, WA, United States',
  'Your everyday AI companion — built into Windows, Edge, and Microsoft 365',
  'Microsoft Copilot is Microsoft''s AI assistant brand, powered primarily by OpenAI''s GPT models (with growing investment in Microsoft''s own MAI-series). It''s the unifying AI surface across Microsoft''s product portfolio: the free Copilot consumer app (web, Windows, iOS, Android, macOS), the Edge browser side panel, the Windows + key launcher, and the paid Microsoft 365 Copilot that embeds AI inside Word, Excel, PowerPoint, Outlook, Teams, and OneDrive. Microsoft sells multiple tiers: Free Copilot for individuals; Copilot Pro at $20/mo for advanced features and priority access; Microsoft 365 Copilot at $30/user/mo for businesses that want Copilot in their Office apps; and Copilot for Sales/Service/Studio for vertical agentic workflows. Microsoft 365 Copilot is one of the fastest-growing enterprise software products in history, with broad adoption across Fortune 500 companies.',
  'https://www.google.com/s2/favicons?domain=copilot.microsoft.com&sz=256',
  JSON_ARRAY(
    'https://image.thum.io/get/width/1600/crop/900/noanimate/https://copilot.microsoft.com/',
    'https://image.thum.io/get/width/1600/crop/900/noanimate/https://www.microsoft.com/en-us/microsoft-365/copilot/business'
  ),
  'https://www.youtube.com/watch?v=ebls5x-gb0s',
  2023, '1000+', 'public',
  'https://www.linkedin.com/company/microsoft', 'https://twitter.com/MSFTCopilot', NULL,
  'freemium',
  JSON_ARRAY(
    JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month',
      'features', JSON_ARRAY('Copilot on web, Windows, iOS, Android', 'GPT-powered chat with Bing search', 'Voice mode', 'Image generation (limited)')),
    JSON_OBJECT('name', 'Copilot Pro', 'price', 20, 'period', 'month',
      'features', JSON_ARRAY('Priority access to GPT-5', 'Faster image generation', 'Copilot in personal Microsoft 365 apps', 'Higher daily limits')),
    JSON_OBJECT('name', 'Microsoft 365 Copilot', 'price', 30, 'period', 'user / month',
      'features', JSON_ARRAY('Copilot in Word, Excel, PowerPoint, Outlook, Teams, OneDrive', 'Business Chat across your tenant', 'Enterprise data protection', 'Admin controls and audit logs')),
    JSON_OBJECT('name', 'Copilot Studio', 'price', 200, 'period', 'month',
      'features', JSON_ARRAY('Build custom Copilots and agents', 'Connect to your data with native connectors', 'Publish to Teams, web, or any channel')),
    JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom',
      'features', JSON_ARRAY('Volume licensing', 'Dedicated tenant', 'Custom SLA + premium support', 'On-prem and sovereign cloud options'))
  ),
  JSON_ARRAY(
    'Native integration with Microsoft 365 apps',
    'Copilot in Word — draft, summarize, rewrite',
    'Copilot in Excel — formulas, analysis, charts',
    'Copilot in PowerPoint — slide generation from prompts',
    'Copilot in Teams — meeting summaries and action items',
    'Copilot in Outlook — email drafting and triage',
    'GitHub Copilot integration for developers',
    'Image generation with DALL·E',
    'Voice mode and natural conversation',
    'Copilot Studio for building custom agents'
  ),
  JSON_ARRAY(
    JSON_OBJECT('name', 'Microsoft Word',      'website', 'https://www.microsoft.com/microsoft-365/word',
                'description', 'Draft, summarize, refactor, and translate documents inside Word.'),
    JSON_OBJECT('name', 'Microsoft Excel',     'website', 'https://www.microsoft.com/microsoft-365/excel',
                'description', 'Generate formulas, analyze data, and create charts from natural-language prompts.'),
    JSON_OBJECT('name', 'Microsoft PowerPoint','website', 'https://www.microsoft.com/microsoft-365/powerpoint',
                'description', 'Generate full slide decks from a prompt or Word doc.'),
    JSON_OBJECT('name', 'Microsoft Outlook',   'website', 'https://outlook.live.com',
                'description', 'Triage your inbox, draft replies, and summarize threads.'),
    JSON_OBJECT('name', 'Microsoft Teams',     'website', 'https://www.microsoft.com/microsoft-teams',
                'description', 'Meeting summaries, action items, and chat assistance inside Teams.'),
    JSON_OBJECT('name', 'Microsoft OneDrive',  'website', 'https://onedrive.live.com',
                'description', 'Ground Copilot in your OneDrive files.'),
    JSON_OBJECT('name', 'GitHub Copilot',      'website', 'https://github.com/features/copilot',
                'description', 'In-IDE AI coding assistant from the same Copilot brand.'),
    JSON_OBJECT('name', 'Microsoft Edge',      'website', 'https://www.microsoft.com/edge',
                'description', 'Copilot side panel for any web page; ask, summarize, translate.'),
    JSON_OBJECT('name', 'Windows 11',          'website', 'https://www.microsoft.com/windows/windows-11',
                'description', 'System-wide Copilot launcher accessible from anywhere on Windows.'),
    JSON_OBJECT('name', 'Microsoft Loop',      'website', 'https://www.microsoft.com/microsoft-loop',
                'description', 'Co-create live, AI-assisted documents that sync across apps.'),
    JSON_OBJECT('name', 'Dynamics 365',        'website', 'https://www.microsoft.com/dynamics-365',
                'description', 'Copilot for Sales, Service, and Finance — agentic vertical workflows.'),
    JSON_OBJECT('name', 'Azure',               'website', 'https://azure.microsoft.com',
                'description', 'Run Copilot on your Azure tenant with private endpoints and governance.')
  ),
  JSON_ARRAY(
    JSON_OBJECT('question', 'Is Microsoft Copilot free?',
                'answer', 'Yes — the consumer Copilot app on web, Windows, iOS, and Android is free. Copilot Pro ($20/mo) adds priority access and Copilot in personal Microsoft 365 apps. Microsoft 365 Copilot ($30/user/mo) is the business plan that embeds Copilot in Word, Excel, PowerPoint, Outlook, and Teams.'),
    JSON_OBJECT('question', 'Is Microsoft Copilot the same as ChatGPT?',
                'answer', 'Microsoft Copilot is powered primarily by OpenAI models (including GPT-5) but is a separate product. It''s designed around Microsoft 365 workflows, with deep integration into Word, Excel, Teams, and Windows that ChatGPT does not have.'),
    JSON_OBJECT('question', 'What is Microsoft 365 Copilot?',
                'answer', 'Microsoft 365 Copilot ($30/user/mo) is the business add-on that adds AI to Word, Excel, PowerPoint, Outlook, Teams, and OneDrive. It can reference your tenant''s files and emails for grounded, personalized answers.'),
    JSON_OBJECT('question', 'How does Copilot protect business data?',
                'answer', 'Microsoft 365 Copilot inherits your tenant''s data protection. It does not train on your data, respects existing Microsoft 365 permissions, and includes audit logs, DLP, and SSO.'),
    JSON_OBJECT('question', 'What is Copilot Studio?',
                'answer', 'Copilot Studio is a low-code platform for building custom Copilots and agents that connect to your business data and can be deployed to Teams, web, or any other channel.'),
    JSON_OBJECT('question', 'Can Copilot use my company files?',
                'answer', 'Yes — Microsoft 365 Copilot grounds answers in your tenant''s SharePoint, OneDrive, Outlook, and Teams content while respecting existing permissions.')
  ),
  JSON_ARRAY('AI Assistant', 'Microsoft 365', 'Enterprise AI', 'GPT-Powered', 'Productivity'),
  JSON_ARRAY(
    'Deepest integration with Microsoft 365 and Windows',
    'Strong enterprise governance, compliance, and admin tooling',
    'Same enterprise-grade security as the rest of Microsoft 365',
    'Copilot Studio enables low-code custom agents',
    'Massive enterprise sales motion — easy procurement for existing Microsoft customers',
    'Free consumer tier is genuinely useful'
  ),
  JSON_ARRAY(
    'Microsoft 365 Copilot pricing ($30/user/mo) is steep on top of existing M365 costs',
    'Quality varies across the Office apps — Excel/PowerPoint inconsistent',
    'Best value only if you''re already locked into Microsoft 365',
    'Roadmap and rebrands have been confusing (Copilot vs Bing Chat vs M365 Chat)'
  ),
  JSON_ARRAY('Software & SaaS', 'Financial Services', 'Government', 'Healthcare', 'Manufacturing', 'Consulting', 'Education', 'Legal'),
  JSON_ARRAY(
    'Drafting and rewriting Word documents',
    'Excel formula generation and data analysis',
    'PowerPoint slide deck generation',
    'Outlook email triage and drafting',
    'Teams meeting summaries and action items',
    'Custom Copilot agents via Copilot Studio',
    'Tenant-wide enterprise chat with grounding',
    'Coding via GitHub Copilot integration'
  ),
  JSON_ARRAY('Small Businesses', 'Midsize Businesses', 'Enterprises'),
  JSON_ARRAY(
    JSON_OBJECT('name', 'Copilot in Microsoft 365', 'description', 'AI side panel across Word, Excel, PowerPoint, Outlook, Teams, and OneDrive.'),
    JSON_OBJECT('name', 'Business Chat', 'description', 'Chat with Copilot grounded in your tenant''s SharePoint, OneDrive, Outlook, and Teams.'),
    JSON_OBJECT('name', 'Copilot in Windows', 'description', 'System-wide AI launcher built into Windows 11.'),
    JSON_OBJECT('name', 'Copilot Studio', 'description', 'Low-code platform for building custom agents that connect to your data.'),
    JSON_OBJECT('name', 'Image generation', 'description', 'DALL·E-powered image creation directly in chat and Designer.'),
    JSON_OBJECT('name', 'Voice mode', 'description', 'Natural voice conversations across web, Windows, and mobile.'),
    JSON_OBJECT('name', 'Enterprise data protection', 'description', 'No data training, audit logs, tenant boundary, SSO, and admin controls.'),
    JSON_OBJECT('name', 'GitHub Copilot', 'description', 'World''s most-used AI coding assistant — same brand, separate purchase.')
  ),
  0.00, 'month', 1, 1,
  JSON_ARRAY('Help Center', 'FastTrack (Enterprise)', 'Premier Support', 'Microsoft Q&A community'),
  JSON_ARRAY('Documentation', 'Microsoft Learn', 'YouTube — Microsoft Mechanics', 'Adoption Center'),
  JSON_ARRAY('English', 'Spanish', 'French', 'German', 'Portuguese', 'Italian', 'Japanese', 'Korean', 'Chinese (Simplified)', 'Russian', 'Arabic', 'Dutch', 'Hindi', 'Polish'),
  1, 1,
  JSON_ARRAY('SOC 1', 'SOC 2 Type II', 'ISO 27001', 'ISO 27018', 'GDPR', 'HIPAA', 'FedRAMP High'),
  JSON_ARRAY('Forrester Wave Leader — AI Foundation Models 2024', 'Gartner Magic Quadrant Leader'),
  'product', 'active', 'completed',
  (SELECT id FROM plans ORDER BY id ASC LIMIT 1),
  NOW(), NOW(), NOW(), NOW();


-- ───────────────────────────────────────────────────────────────────────────
-- 4) Perplexity
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
  UUID(), 'Perplexity', 'perplexity', 'Perplexity Team', 'support@perplexity.ai',
  '+1', NULL, 'https://www.perplexity.ai',
  (SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1),
  (SELECT id FROM countries WHERE code = 'US' OR name = 'United States' LIMIT 1),
  'San Francisco', 'San Francisco, CA, United States',
  'The answer engine — AI search with real-time citations you can verify',
  'Perplexity is an AI-powered answer engine that combines real-time web search with large language models to return cited, source-linked answers instead of a list of blue links. Every Perplexity response includes the URLs it used, so you can verify and dig deeper. Founded in 2022 by ex-OpenAI and Meta researchers, Perplexity has raised over $500M from Jeff Bezos, NVIDIA, IVP, NEA, and others, reaching a $14B+ valuation. The free tier offers unlimited Quick Search; Perplexity Pro ($20/mo) unlocks unlimited Pro Search (deeper, multi-step research), access to the best model of your choice (GPT-5, Claude Opus, Sonar Large, Gemini 2.5 Pro), image generation, and file analysis. Perplexity Enterprise Pro ($40/user/mo) adds SOC 2, SAML SSO, and admin controls. Perplexity is also building Comet, an AI-first web browser that integrates the answer engine throughout the browsing experience.',
  'https://www.google.com/s2/favicons?domain=perplexity.ai&sz=256',
  JSON_ARRAY(
    'https://image.thum.io/get/width/1600/crop/900/noanimate/https://www.perplexity.ai/',
    'https://image.thum.io/get/width/1600/crop/900/noanimate/https://www.perplexity.ai/pro'
  ),
  'https://www.youtube.com/watch?v=4VK2NQjMzbo',
  2022, '201-500', 'series-c',
  'https://www.linkedin.com/company/perplexity-ai', 'https://twitter.com/perplexity_ai', NULL,
  'freemium',
  JSON_ARRAY(
    JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month',
      'features', JSON_ARRAY('Unlimited Quick Search', '5 Pro Searches per day', 'Standard model access', 'Sources cited in every answer')),
    JSON_OBJECT('name', 'Pro', 'price', 20, 'period', 'month',
      'features', JSON_ARRAY('Unlimited Pro Search', 'Pick your model — GPT-5, Claude Opus, Sonar Large, Gemini 2.5 Pro', 'Image generation (Flux + DALL·E)', 'File and image upload + analysis', '$5/mo API credits', 'Spaces for collaborative research')),
    JSON_OBJECT('name', 'Enterprise Pro', 'price', 40, 'period', 'user / month',
      'features', JSON_ARRAY('Everything in Pro for each member', 'SAML SSO + SCIM', 'Admin console and usage analytics', 'SOC 2 + zero-data-retention guarantee', 'Centralized billing')),
    JSON_OBJECT('name', 'API', 'price', NULL, 'period', 'pay-as-you-go',
      'features', JSON_ARRAY('Sonar online + offline models', 'Cited search-grounded responses via API', 'No subscription minimum')),
    JSON_OBJECT('name', 'Comet', 'price', 0, 'period', 'browser',
      'features', JSON_ARRAY('Built-in Perplexity throughout the browsing experience', 'Free download', 'Bundled with Pro for power features'))
  ),
  JSON_ARRAY(
    'Real-time web search with cited sources',
    'Pro Search — multi-step deep research',
    'Pick your model (GPT-5, Claude Opus, Sonar, Gemini Pro)',
    'File + image upload analysis',
    'Image generation with Flux and DALL·E',
    'Spaces — shared, collaborative research threads',
    'Mobile apps (iOS, Android) and macOS app',
    'Comet — Perplexity''s AI-first browser',
    'API for grounded search responses',
    'Voice mode'
  ),
  JSON_ARRAY(
    JSON_OBJECT('name', 'Comet',          'website', 'https://www.perplexity.ai/comet',
                'description', 'Perplexity''s AI-first browser with the answer engine baked in everywhere.'),
    JSON_OBJECT('name', 'Slack',          'website', 'https://slack.com',
                'description', 'Bring Perplexity-grounded answers into Slack channels.'),
    JSON_OBJECT('name', 'Notion',         'website', 'https://notion.so',
                'description', 'Use Perplexity to research and write inside Notion docs.'),
    JSON_OBJECT('name', 'Zapier',         'website', 'https://zapier.com',
                'description', 'Pipe Perplexity answers into 6,000+ apps via Zapier.'),
    JSON_OBJECT('name', 'Chrome',         'website', 'https://www.google.com/chrome/',
                'description', 'Perplexity browser extension that replaces the new-tab page.'),
    JSON_OBJECT('name', 'Arc Browser',    'website', 'https://arc.net',
                'description', 'Set Perplexity as Arc''s default search engine for cited answers.'),
    JSON_OBJECT('name', 'iOS Shortcuts',  'website', 'https://apps.apple.com/us/app/shortcuts',
                'description', 'Trigger Perplexity searches from anywhere on iOS via Shortcuts.'),
    JSON_OBJECT('name', 'Raycast',        'website', 'https://raycast.com',
                'description', 'Launch Perplexity from your macOS Raycast launcher.'),
    JSON_OBJECT('name', 'Discord',        'website', 'https://discord.com',
                'description', 'Perplexity Discord bot for community Q&A.'),
    JSON_OBJECT('name', 'WhatsApp',       'website', 'https://whatsapp.com',
                'description', 'Ask Perplexity questions directly via WhatsApp.')
  ),
  JSON_ARRAY(
    JSON_OBJECT('question', 'What is Perplexity?',
                'answer', 'Perplexity is an AI-powered answer engine. Instead of returning a list of blue links like a traditional search engine, it reads sources in real time and writes a direct, cited answer to your question.'),
    JSON_OBJECT('question', 'How is Perplexity different from ChatGPT?',
                'answer', 'Perplexity always searches the live web and shows sources for every answer. ChatGPT has web search too, but Perplexity is purpose-built around real-time, cited responses, which makes it preferred for research and fact-finding workflows.'),
    JSON_OBJECT('question', 'Is Perplexity free?',
                'answer', 'Yes. The free plan gives unlimited Quick Search and 5 Pro Searches per day. Pro ($20/mo) gives unlimited Pro Search, model choice, image generation, and file uploads.'),
    JSON_OBJECT('question', 'Which AI models does Perplexity use?',
                'answer', 'Perplexity lets you choose between GPT-5, Claude Opus, Gemini 2.5 Pro, Sonar Large (Perplexity''s own model), and others. Different models excel at different tasks.'),
    JSON_OBJECT('question', 'What is Comet?',
                'answer', 'Comet is Perplexity''s AI-first web browser. It uses the Perplexity answer engine throughout the browsing experience — for navigation, summaries, and contextual research.'),
    JSON_OBJECT('question', 'Can businesses use Perplexity?',
                'answer', 'Yes. Enterprise Pro ($40/user/mo) adds SOC 2, SAML SSO, admin controls, and a zero-data-retention guarantee for sensitive workflows.')
  ),
  JSON_ARRAY('AI Search', 'Answer Engine', 'Cited Sources', 'Research', 'Real-time AI'),
  JSON_ARRAY(
    'Every answer ships with verifiable, clickable sources',
    'Lets you pick the best model per task (GPT-5, Claude, Sonar, Gemini)',
    'Pro Search produces deeper, multi-step research reports',
    'Genuinely changes how research and fact-checking is done',
    'Excellent free tier with unlimited Quick Search',
    'Built-in image generation and file/PDF analysis'
  ),
  JSON_ARRAY(
    'Best for fact-finding — weaker than ChatGPT for creative open-ended chat',
    'Source quality varies; can still surface low-quality blogs',
    'Pro Search is slower than Quick Search (deeper but heavier)',
    'Spaces collaboration features still less mature than Notion/Slack'
  ),
  JSON_ARRAY('Software & SaaS', 'Education', 'Financial Services', 'Media & Publishing', 'Legal', 'Consulting', 'Healthcare', 'Cross-Industry'),
  JSON_ARRAY(
    'Real-time fact-finding with citations',
    'Multi-step research reports (Pro Search)',
    'Investor and market research',
    'Academic literature review',
    'News synthesis and current events',
    'Comparison shopping and product research',
    'Legal and policy lookups',
    'Travel planning with current info'
  ),
  JSON_ARRAY('Small Businesses', 'Midsize Businesses', 'Enterprises'),
  JSON_ARRAY(
    JSON_OBJECT('name', 'Cited answer engine', 'description', 'Every answer includes the URLs it consulted, so users can verify and dig deeper.'),
    JSON_OBJECT('name', 'Pro Search', 'description', 'Multi-step research mode that browses, reads, and synthesizes a structured report.'),
    JSON_OBJECT('name', 'Model picker', 'description', 'Choose GPT-5, Claude Opus, Sonar Large, Gemini 2.5 Pro, or other frontier models per query.'),
    JSON_OBJECT('name', 'Image generation', 'description', 'Built-in Flux and DALL·E image generation for Pro users.'),
    JSON_OBJECT('name', 'File and image analysis', 'description', 'Upload PDFs, spreadsheets, screenshots — Perplexity reads them with cited context.'),
    JSON_OBJECT('name', 'Spaces', 'description', 'Shared research threads where teams collaborate on long-running topics with persistent files and instructions.'),
    JSON_OBJECT('name', 'Comet browser', 'description', 'AI-first web browser with Perplexity baked into navigation, search, and reading.'),
    JSON_OBJECT('name', 'Sonar API', 'description', 'Developer API that returns cited, web-grounded responses — for building your own answer-engine features.')
  ),
  0.00, 'month', 1, 1,
  JSON_ARRAY('Email Support', 'Help Center', 'Discord Community', 'Status Page'),
  JSON_ARRAY('Documentation', 'YouTube channel', 'Blog and Changelog', 'API Reference'),
  JSON_ARRAY('English', 'Spanish', 'French', 'German', 'Portuguese', 'Italian', 'Japanese', 'Korean', 'Chinese (Simplified)', 'Hindi', 'Arabic'),
  1, 1,
  JSON_ARRAY('SOC 2 Type II', 'GDPR', 'CCPA'),
  JSON_ARRAY('Forbes AI 50 (2024, 2025)', 'TIME 100 AI 2024', 'Fast Company Most Innovative 2024'),
  'product', 'active', 'completed',
  (SELECT id FROM plans ORDER BY id ASC LIMIT 1),
  NOW(), NOW(), NOW(), NOW();


-- ───────────────────────────────────────────────────────────────────────────
-- 5) DeepSeek
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
  UUID(), 'DeepSeek', 'deepseek', 'DeepSeek Team', 'service@deepseek.com',
  '+86', NULL, 'https://chat.deepseek.com',
  (SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1),
  (SELECT id FROM countries WHERE code = 'CN' OR name = 'China' LIMIT 1),
  'Hangzhou', 'Hangzhou, Zhejiang, China',
  'Open-source AI built for reasoning and code — efficient, transparent, free',
  'DeepSeek is the Chinese AI lab whose open-weight models — DeepSeek-V3 and DeepSeek-R1 — shocked the industry in late 2024 / early 2025 by matching frontier closed-model performance at a fraction of the training cost and inference price. DeepSeek-R1 introduced a strong open reasoning model competitive with OpenAI''s o1 family, and DeepSeek-V3 became a benchmark-leading general-purpose chat and code model. The DeepSeek Chat app (web, iOS, Android) is free for individuals, and the DeepSeek API is famously cheap — often 10–30x less expensive than equivalents from OpenAI or Anthropic. Because the weights are open, developers can also self-host DeepSeek on their own infrastructure or via cloud providers like Together AI, Groq, and OpenRouter. DeepSeek is rapidly becoming the default open-weight foundation model for builders who need frontier reasoning without frontier pricing.',
  'https://www.google.com/s2/favicons?domain=deepseek.com&sz=256',
  JSON_ARRAY(
    'https://image.thum.io/get/width/1600/crop/900/noanimate/https://chat.deepseek.com/',
    'https://image.thum.io/get/width/1600/crop/900/noanimate/https://api-docs.deepseek.com/'
  ),
  'https://www.youtube.com/watch?v=PWvPSPRT3sQ',
  2023, '51-200', 'private',
  NULL, 'https://twitter.com/deepseek_ai', NULL,
  'freemium',
  JSON_ARRAY(
    JSON_OBJECT('name', 'Free Chat', 'price', 0, 'period', 'month',
      'features', JSON_ARRAY('Unlimited DeepSeek-V3 chat on web and mobile', 'DeepThink (R1) reasoning mode', 'Web search', 'File upload and analysis')),
    JSON_OBJECT('name', 'API — DeepSeek-V3', 'price', 0.27, 'period', '1M input tokens',
      'features', JSON_ARRAY('General-purpose chat and code', 'Up to 64K context window', 'Function calling and JSON mode', 'Pay-per-token, no minimum')),
    JSON_OBJECT('name', 'API — DeepSeek-R1', 'price', 0.55, 'period', '1M input tokens',
      'features', JSON_ARRAY('Open reasoning model on par with o1', 'Up to 64K context window', 'Chain-of-thought visible in output', 'Cheap for the reasoning tier')),
    JSON_OBJECT('name', 'Open weights', 'price', 0, 'period', 'self-host',
      'features', JSON_ARRAY('MIT/permissive licensed weights for V3 and R1', 'Run on Together AI, Groq, OpenRouter, or your own GPUs', 'No usage caps, no data sent off-prem')),
    JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom',
      'features', JSON_ARRAY('Private deployment', 'Dedicated SLA', 'Volume discounts'))
  ),
  JSON_ARRAY(
    'Free DeepSeek-V3 chat for individuals',
    'DeepThink (R1) — open reasoning model competitive with o1',
    'Open-source weights (MIT-style license)',
    'API pricing 10–30× cheaper than US frontier models',
    'Web search built into chat',
    '64K-token context window',
    'File upload + image understanding',
    'Function calling and structured JSON output',
    'Available on Together AI, Groq, OpenRouter for self-host',
    'Strong on math, code, and reasoning benchmarks'
  ),
  JSON_ARRAY(
    JSON_OBJECT('name', 'Together AI',  'website', 'https://www.together.ai',
                'description', 'Run DeepSeek-V3 and R1 on Together''s hosted inference platform.'),
    JSON_OBJECT('name', 'Groq',         'website', 'https://groq.com',
                'description', 'Ultra-fast inference for DeepSeek models on Groq''s LPU hardware.'),
    JSON_OBJECT('name', 'OpenRouter',   'website', 'https://openrouter.ai',
                'description', 'Use DeepSeek through OpenRouter''s unified multi-model API.'),
    JSON_OBJECT('name', 'Hugging Face', 'website', 'https://huggingface.co',
                'description', 'Open-weight DeepSeek models hosted on the Hugging Face Hub.'),
    JSON_OBJECT('name', 'Ollama',       'website', 'https://ollama.com',
                'description', 'Run quantized DeepSeek models locally on your own machine.'),
    JSON_OBJECT('name', 'LM Studio',    'website', 'https://lmstudio.ai',
                'description', 'Desktop app for running DeepSeek and other open models locally.'),
    JSON_OBJECT('name', 'vLLM',         'website', 'https://github.com/vllm-project/vllm',
                'description', 'Production-grade self-hosted inference server for DeepSeek.'),
    JSON_OBJECT('name', 'Cursor',       'website', 'https://cursor.com',
                'description', 'Use DeepSeek as a model option inside the Cursor code editor.'),
    JSON_OBJECT('name', 'Continue.dev', 'website', 'https://continue.dev',
                'description', 'Open-source coding assistant that supports DeepSeek as a backend.'),
    JSON_OBJECT('name', 'LangChain',    'website', 'https://www.langchain.com',
                'description', 'First-class DeepSeek integration for agent and RAG pipelines.')
  ),
  JSON_ARRAY(
    JSON_OBJECT('question', 'What is DeepSeek?',
                'answer', 'DeepSeek is a Chinese AI lab known for releasing high-quality open-weight large language models — DeepSeek-V3 (general chat) and DeepSeek-R1 (reasoning) — that match frontier closed-source performance at a fraction of the cost.'),
    JSON_OBJECT('question', 'Is DeepSeek free?',
                'answer', 'Yes. The DeepSeek Chat app is free on web, iOS, and Android. The API has the cheapest frontier-model pricing in the industry. Open weights let you self-host with no usage fees.'),
    JSON_OBJECT('question', 'How is DeepSeek different from ChatGPT?',
                'answer', 'DeepSeek''s weights are openly released and the API is 10–30× cheaper than ChatGPT''s. Performance on reasoning, code, and math is competitive with GPT-5 and Claude. The trade-off is less mature consumer features (e.g. image generation, voice).'),
    JSON_OBJECT('question', 'Can I self-host DeepSeek?',
                'answer', 'Yes — both DeepSeek-V3 and DeepSeek-R1 are available with open weights on Hugging Face. You can run them on Together AI, Groq, OpenRouter, vLLM, Ollama, or your own GPUs.'),
    JSON_OBJECT('question', 'What is DeepSeek-R1?',
                'answer', 'DeepSeek-R1 is DeepSeek''s open reasoning model, designed for hard math, code, and logic problems. It produces visible chain-of-thought reasoning and is competitive with OpenAI''s o1 family.'),
    JSON_OBJECT('question', 'Is DeepSeek safe to use for business?',
                'answer', 'For sensitive data, run DeepSeek''s open weights on your own infrastructure or via a trusted cloud (Together AI, Groq) so nothing leaves your environment. The hosted DeepSeek Chat app sends data to DeepSeek''s servers in China.')
  ),
  JSON_ARRAY('Open-source AI', 'Reasoning Model', 'Cheap API', 'Self-hostable', 'DeepSeek-R1'),
  JSON_ARRAY(
    'Open weights — full transparency and self-hostable',
    'API pricing 10–30× cheaper than US frontier models',
    'DeepSeek-R1 reasoning competitive with OpenAI o1',
    'Free chat app on web, iOS, and Android',
    'Strong on math, code, and logic benchmarks',
    'Available on every major inference platform (Together, Groq, OpenRouter)'
  ),
  JSON_ARRAY(
    'Hosted chat app sends data to servers in China — sensitive workloads should self-host',
    'Consumer features (voice, image gen, custom assistants) are less mature than ChatGPT/Gemini',
    'Smaller ecosystem of third-party plugins',
    'English-language support and docs less polished than US peers'
  ),
  JSON_ARRAY('Software & SaaS', 'Education', 'Research & Academia', 'Cross-Industry', 'Open-source community', 'Startups'),
  JSON_ARRAY(
    'Self-hosted enterprise AI deployments',
    'Cost-sensitive AI API workloads',
    'Hard reasoning problems via DeepSeek-R1',
    'Coding assistant backends (Cursor, Continue.dev)',
    'Academic research and open-science work',
    'On-prem privacy-sensitive deployments',
    'Multilingual chat (especially Chinese)',
    'High-volume inference with open weights'
  ),
  JSON_ARRAY('Small Businesses', 'Midsize Businesses', 'Enterprises'),
  JSON_ARRAY(
    JSON_OBJECT('name', 'DeepSeek-V3', 'description', 'Flagship general-purpose chat and code model, frontier-level performance.'),
    JSON_OBJECT('name', 'DeepSeek-R1', 'description', 'Open reasoning model with visible chain-of-thought, competitive with OpenAI o1.'),
    JSON_OBJECT('name', 'Open weights', 'description', 'Models released under a permissive license — full freedom to self-host, fine-tune, and modify.'),
    JSON_OBJECT('name', 'Ultra-cheap API', 'description', '10–30× cheaper than equivalent OpenAI / Anthropic APIs — democratizes frontier inference.'),
    JSON_OBJECT('name', '64K context window', 'description', 'Handles long documents, code repos, and multi-document analysis.'),
    JSON_OBJECT('name', 'Function calling + JSON', 'description', 'Structured tool use for building reliable agents and pipelines.'),
    JSON_OBJECT('name', 'Web search', 'description', 'Live web search built into the DeepSeek Chat app.'),
    JSON_OBJECT('name', 'Self-host friendly', 'description', 'First-class support on Together AI, Groq, OpenRouter, Ollama, LM Studio, and vLLM.')
  ),
  0.00, 'month', 1, 1,
  JSON_ARRAY('Email Support', 'API Docs', 'Discord / WeChat community'),
  JSON_ARRAY('API Documentation', 'GitHub repos', 'Hugging Face model cards', 'Research papers'),
  JSON_ARRAY('Chinese (Simplified)', 'English', 'Spanish', 'French', 'German', 'Japanese', 'Korean'),
  1, 1,
  JSON_ARRAY('GDPR (self-hosted only)', 'Open-source MIT-style license'),
  JSON_ARRAY('Frontier-tier benchmark wins on math, code, reasoning', 'GitHub Stars >10K on DeepSeek-V3 / R1 repos'),
  'product', 'active', 'completed',
  (SELECT id FROM plans ORDER BY id ASC LIMIT 1),
  NOW(), NOW(), NOW(), NOW();


-- ═══════════════════════════════════════════════════════════════════════════
-- DONE — verify with:
--   SELECT id, slug, status, payment_status, category_id
--     FROM submissions
--    WHERE slug IN ('chatgpt','gemini','microsoft-copilot','perplexity','deepseek');
--
-- Then for each: /iww-hq/submissions → Active → click "Rebuild static page"
-- ═══════════════════════════════════════════════════════════════════════════
