-- ═══════════════════════════════════════════════════════════════════════════
-- Claude (by Anthropic) — full listing seed
-- ═══════════════════════════════════════════════════════════════════════════
-- Run this in phpMyAdmin AFTER the AI&ML taxonomy migration is in place
-- (so the L3 slug `all-purpose-ai-chat-companions` exists in `categories`).
--
-- This creates ONE listing with rich fields populated:
--   - logo via Clearbit
--   - 4 live screenshots via image.thum.io
--   - tagline, description, FAQs, pros/cons, features, integrations, pricing
--   - listing_mode='product', verified=1, status='active', payment_status='completed'
--
-- The category, country and plan are looked up by slug/code/key, so this is
-- portable across environments. Adjust if your codes differ.
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO submissions (
  uuid,
  company_name, slug,
  contact_name, email,
  phone_code, phone,
  website,
  category_id,
  country_id,
  city, hq_location,
  tagline,
  description,
  logo_url,
  screenshots,
  demo_video,
  founded_year,
  team_size,
  funding,
  linkedin, twitter, facebook,
  pricing_model,
  pricing_tiers,
  features, integrations,
  faqs,
  header_tags,
  pros, cons,
  industries_served, use_cases, target_company_sizes,
  key_features,
  starting_price, starting_price_period,
  has_free_trial, has_free_version,
  support_channels, training_options, languages,
  has_ios_app, has_android_app,
  compliance, awards,
  listing_mode,
  status, payment_status,
  plan_id,
  activated_at, approved_at,
  created_at, updated_at
)
SELECT
  UUID(),
  'Claude', 'claude',
  'Anthropic Team', 'hello@anthropic.com',
  '+1', NULL,
  'https://claude.ai',
  (SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1),
  (SELECT id FROM countries WHERE code = 'US' OR name = 'United States' LIMIT 1),
  'San Francisco',
  'San Francisco, CA, United States',

  -- Tagline (<=100 chars)
  'A next-generation AI assistant for safe, accurate, secure work',

  -- Long description (markdown not required)
  'Claude is a family of large language models built by Anthropic to be safe, accurate, and steerable. It excels at long-context reasoning over multi-document inputs, careful instruction-following, software engineering with whole-repo awareness, agentic tool use, and faithful summarization. Claude is available through claude.ai (chat product), the Anthropic API, Claude Code (terminal coding agent), and via cloud partners including Amazon Bedrock and Google Vertex AI. Anthropic''s Responsible Scaling Policy and Constitutional AI training approach make Claude a preferred choice for enterprise teams that need a high-quality, well-aligned model with strong refusal behavior and predictable outputs.',

  -- Logo (Clearbit, matches your existing pattern across the app)
  'https://logo.clearbit.com/anthropic.com',

  -- Screenshots: 4 live captures via image.thum.io (no API key needed)
  JSON_ARRAY(
    'https://image.thum.io/get/width/1600/crop/900/noanimate/https://claude.ai/',
    'https://image.thum.io/get/width/1600/crop/900/noanimate/https://www.anthropic.com/claude',
    'https://image.thum.io/get/width/1600/crop/900/noanimate/https://www.anthropic.com/api',
    'https://image.thum.io/get/width/1600/crop/900/noanimate/https://www.anthropic.com/pricing'
  ),

  -- Demo video (Anthropic''s YouTube channel intro to Claude)
  'https://www.youtube.com/watch?v=ZbnyB0pwL3w',

  2021,                     -- founded_year (Anthropic founded 2021)
  '501-1000',               -- team_size (Anthropic crossed 1000 in 2025; keep conservative)
  'series-e',               -- funding stage
  'https://www.linkedin.com/company/anthropicresearch',
  'https://twitter.com/AnthropicAI',
  NULL,

  -- pricing_model
  'freemium',

  -- pricing_tiers — JSON array of {name, price, period, features[]}
  JSON_ARRAY(
    JSON_OBJECT(
      'name', 'Free',
      'price', 0,
      'period', 'month',
      'features', JSON_ARRAY(
        'Access to Claude on web, iOS, and Android',
        'Ask about images, PDFs, and documents',
        'Generate code and visualize data'
      )
    ),
    JSON_OBJECT(
      'name', 'Pro',
      'price', 20,
      'period', 'month',
      'features', JSON_ARRAY(
        'Everything in Free',
        '5x more usage than Free',
        'Access to Projects to organize chats and documents',
        'Use more Claude models, including Opus',
        'Extended thinking for complex problems'
      )
    ),
    JSON_OBJECT(
      'name', 'Max',
      'price', 100,
      'period', 'month',
      'features', JSON_ARRAY(
        'Everything in Pro',
        '5x–20x more usage than Pro',
        'Higher output limits for all tasks',
        'Early access to advanced features',
        'Priority access during high-traffic times'
      )
    ),
    JSON_OBJECT(
      'name', 'Team',
      'price', 30,
      'period', 'user/month',
      'features', JSON_ARRAY(
        'Everything in Pro for every member',
        'Central billing and administration',
        'Increased usage vs Pro',
        'Early access to collaboration features'
      )
    ),
    JSON_OBJECT(
      'name', 'Enterprise',
      'price', NULL,
      'period', 'custom',
      'features', JSON_ARRAY(
        'Single sign-on (SSO) and domain capture',
        'Role-based access and audit logs',
        'Data source integrations',
        'Expanded usage and security controls'
      )
    )
  ),

  -- features (legacy/general feature list)
  JSON_ARRAY(
    'Long-context reasoning up to 200K tokens',
    'Constitutional AI alignment and safety training',
    'Native PDF, image, and document understanding',
    'Artifacts for live previews of code, docs, and diagrams',
    'Projects to ground Claude in your own files',
    'Computer use API (browser + desktop control)',
    'Tool use / function calling with structured outputs',
    'Web search built into chat',
    'Voice mode on iOS and Android',
    'Claude Code — terminal coding agent for whole-repo work'
  ),

  -- integrations
  JSON_ARRAY(
    'Slack', 'Notion', 'Zapier', 'Google Workspace', 'GitHub',
    'Microsoft 365', 'Amazon Bedrock', 'Google Vertex AI',
    'Cursor', 'Zed', 'Raycast', 'Asana', 'Linear'
  ),

  -- FAQs
  JSON_ARRAY(
    JSON_OBJECT(
      'question','What is Claude?',
      'answer','Claude is an AI assistant developed by Anthropic. It is designed to be safe, accurate, and helpful for a wide range of tasks including writing, analysis, coding, and answering questions.'
    ),
    JSON_OBJECT(
      'question','Is Claude free to use?',
      'answer','Yes. Claude offers a free tier on claude.ai and on mobile, with daily usage limits. Paid plans (Pro, Max, Team, Enterprise) unlock higher limits, additional models, and collaboration features.'
    ),
    JSON_OBJECT(
      'question','What is the difference between Claude and ChatGPT?',
      'answer','Both are large language model assistants. Claude is built by Anthropic with a focus on safety, long-context reasoning, and faithful, well-reasoned outputs. ChatGPT is built by OpenAI. Many teams use both depending on the task; Claude is often preferred for long documents, code refactors, and policy-sensitive workflows.'
    ),
    JSON_OBJECT(
      'question','Can I use Claude via API?',
      'answer','Yes. Anthropic offers a developer API with multiple model variants (Opus, Sonnet, Haiku). You can also access Claude through Amazon Bedrock and Google Vertex AI.'
    ),
    JSON_OBJECT(
      'question','Does Claude train on my conversations?',
      'answer','By default, Anthropic does not train its models on user conversations from claude.ai. Enterprise customers get additional data-handling guarantees. Always review the latest privacy policy at anthropic.com/legal/privacy.'
    ),
    JSON_OBJECT(
      'question','What is Claude Code?',
      'answer','Claude Code is Anthropic''s terminal-based coding agent that can read, write, and run code across a whole repository. It is available as a CLI and as IDE extensions for VS Code and JetBrains.'
    )
  ),

  -- header tags (free-form tag chips shown in the sticky head)
  JSON_ARRAY('AI Assistant', 'LLM', 'Chatbot', 'Coding Copilot', 'Long Context'),

  -- pros / cons
  JSON_ARRAY(
    'Industry-leading long-context comprehension (200K+ tokens)',
    'Strong, faithful reasoning on multi-step tasks',
    'Excellent coding model — especially for whole-repo refactors',
    'Artifacts give live previews of generated work',
    'Strong safety + refusal behavior, predictable for enterprise',
    'Available on web, mobile, API, AWS Bedrock, and GCP Vertex'
  ),
  JSON_ARRAY(
    'Heavier daily caps on the Free tier than some competitors',
    'No native image generation (text-and-analysis only)',
    'API pricing skews higher than commodity models at top tier',
    'Voice features arrived later than at OpenAI and Google'
  ),

  -- industries / use cases / company sizes
  JSON_ARRAY('Software & SaaS', 'Financial Services', 'Healthcare', 'Legal', 'Education', 'Media & Publishing', 'Consulting', 'Government'),
  JSON_ARRAY(
    'Long-document summarization and Q&A',
    'Codebase refactoring and code review',
    'Customer support drafting and triage',
    'Research synthesis across PDFs',
    'Contract and policy analysis',
    'Internal knowledge assistants over private docs',
    'Data analysis and CSV/spreadsheet Q&A',
    'Multilingual writing and translation'
  ),
  JSON_ARRAY('Self-employed', '2-10', '11-50', '51-200', '201-500', '501-1000', '1000+'),

  -- key_features (richer per-feature blocks; structure depends on UI — use {name, description})
  JSON_ARRAY(
    JSON_OBJECT('name', '200K context window', 'description', 'Reason across the equivalent of ~500 pages of text in a single conversation.'),
    JSON_OBJECT('name', 'Artifacts', 'description', 'Live previews of generated code, documents, diagrams, and React components alongside the chat.'),
    JSON_OBJECT('name', 'Projects', 'description', 'Bring your own files, docs, and instructions for grounded, persistent context across chats.'),
    JSON_OBJECT('name', 'Computer use', 'description', 'API capability that lets Claude move a cursor, click buttons, and operate a real desktop.'),
    JSON_OBJECT('name', 'Claude Code', 'description', 'Agentic CLI that reads, edits, and runs code across an entire repository with safety prompts.'),
    JSON_OBJECT('name', 'Tool use / function calling', 'description', 'Structured outputs and tool routing for building reliable AI agents.'),
    JSON_OBJECT('name', 'Constitutional AI', 'description', 'Training approach that aligns Claude to a written set of principles for safer responses.'),
    JSON_OBJECT('name', 'Multimodal input', 'description', 'Drop in images, PDFs, code files, and screenshots — Claude reads them natively.')
  ),

  0.00, 'month',           -- starting_price = 0 (free tier exists), period 'month'
  1, 1,                    -- has_free_trial, has_free_version

  -- support / training / languages
  JSON_ARRAY('Email', 'Help Center', 'Status Page', 'Enterprise Slack channel'),
  JSON_ARRAY('Documentation', 'Cookbook & Examples', 'API Reference', 'YouTube tutorials', 'Anthropic Academy'),
  JSON_ARRAY('English', 'Spanish', 'French', 'German', 'Portuguese', 'Italian', 'Japanese', 'Korean', 'Chinese (Simplified)', 'Chinese (Traditional)', 'Hindi', 'Arabic'),

  1, 1,                    -- has_ios_app, has_android_app

  JSON_ARRAY('SOC 2 Type II', 'HIPAA-eligible (Enterprise)', 'GDPR', 'ISO 27001'),
  JSON_ARRAY('TIME 100 AI 2024', 'Fortune Future 50', 'Forbes AI 50 (multi-year)'),

  'product',
  'active', 'completed',
  (SELECT id FROM plans ORDER BY id ASC LIMIT 1),  -- first/lowest plan (usually free)
  NOW(), NOW(),
  NOW(), NOW();

-- ═══════════════════════════════════════════════════════════════════════════
-- DONE. Verify with:
--   SELECT id, slug, status, category_id, country_id FROM submissions
--    WHERE slug = 'claude';
-- ═══════════════════════════════════════════════════════════════════════════
