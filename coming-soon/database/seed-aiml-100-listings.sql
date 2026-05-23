-- ============================================================
-- InfoWebWorld — AI/ML 94-listing seed batch
--
-- 94 real AI/ML products curated for outreach + claim.
-- Combined with the 6 already-seeded rows (Claude, ChatGPT, Gemini,
-- Microsoft Copilot, Perplexity, DeepSeek) this brings the AI/ML
-- sector to 100 live listings.
--
-- Each row carries the credible-claim minimum: name, slug, tagline,
-- 2-3 sentence description, founded year, HQ city/country, team-size
-- band, real website + socials, category (v3 taxonomy slug), and a
-- Clearbit logo URL. JSON fields (pricing tiers, integrations, FAQs,
-- pros/cons, key features) are left NULL — the owner fills those on
-- claim. Screenshots are populated by scripts/capture-screenshots.mjs
-- after this SQL is loaded.
--
-- All listings: status='active', payment_status='completed' →
-- live immediately. user_id=NULL → claimable.
-- ============================================================

SET @free_plan := (SELECT id FROM plans WHERE is_active = 1 ORDER BY price ASC LIMIT 1);
SET @fallback_country := (SELECT id FROM countries WHERE code = 'US' LIMIT 1);

-- ─── Cleanup: wipe any rows from a prior partial run so this script ─
-- can be re-run safely (slug list is exactly the 94 new listings).
DELETE FROM submissions WHERE slug IN (
  'mistral-ai', 'cohere', 'xai-grok', 'character-ai', 'inflection-ai', 'you-com', 'poe',
  'huggingchat', 'midjourney', 'stability-ai', 'adobe-firefly', 'dall-e', 'leonardo-ai',
  'ideogram', 'krea-ai', 'recraft', 'playground-ai', 'flux-black-forest-labs', 'runway',
  'pika-labs', 'synthesia', 'heygen', 'd-id', 'luma-ai', 'kling-ai', 'hailuo-ai-minimax',
  'elevenlabs', 'suno', 'udio', 'murf-ai', 'resemble-ai', 'play-ht', 'speechify', 'krisp',
  'github-copilot', 'cursor', 'codeium-windsurf', 'tabnine', 'replit', 'v0-by-vercel',
  'devin-cognition-labs', 'bolt-new-stackblitz', 'lovable', 'aider', 'autogpt', 'multion',
  'adept', 'lindy-ai', 'relevance-ai', 'crewai', 'jasper', 'copy-ai', 'writesonic', 'rytr',
  'notion-ai', 'sudowrite', 'wordtune-ai21-labs', 'grammarly', 'consensus', 'elicit',
  'scispace', 'andi', 'researchrabbit', 'chatpdf', 'otter-ai', 'fireflies-ai', 'read-ai',
  'granola', 'reflect-notes', 'mem', 'tana', 'lex', 'lavender', 'apollo-io', 'clay',
  'salesforce-einstein', 'hubspot-breeze', 'gong', 'drift-salesloft', 'outreach',
  'intercom-fin', 'ada', 'forethought', 'tidio-lyro', 'photoroom', 'topaz-labs',
  'remove-bg-kaleido-ai', 'picsart', 'cleanup-pictures', 'lensa-ai', 'aiva', 'soundraw',
  'boomy', 'mubert'
);

-- 1/94  Mistral AI
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Mistral AI', 'mistral-ai', 'Mistral AI Team', 'support@mistral.ai',
  '+33', NULL, 'https://mistral.ai',
  (SELECT id FROM categories WHERE slug = 'large-language-models' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'FR' LIMIT 1), @fallback_country),
  'Paris', 'Paris, FR',
  'Open-weight European frontier models — Mistral Large, Codestral, and Le Chat',
  'Mistral AI is a French AI lab founded in 2023 by ex-Meta and ex-DeepMind researchers, headquartered in Paris. Mistral develops some of the strongest open-weight large language models — Mistral Large, Mixtral, and Codestral — and runs Le Chat, a consumer-facing chat assistant. The company has raised over €1B from a16z, Lightspeed, Nvidia, Microsoft, and others and is the most prominent European AI lab competing with OpenAI and Anthropic.',
  'https://www.google.com/s2/favicons?domain=mistral.ai&sz=256',
  2023, '51-200',
  'https://www.linkedin.com/company/mistralai', 'https://twitter.com/mistralai',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 2/94  Cohere
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Cohere', 'cohere', 'Cohere Team', 'support@cohere.com',
  '+1', NULL, 'https://cohere.com',
  (SELECT id FROM categories WHERE slug = 'large-language-models' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'CA' LIMIT 1), @fallback_country),
  'Toronto', 'Toronto, CA',
  'Enterprise LLMs and retrieval-augmented generation — built for production',
  'Cohere is a Toronto-based AI lab founded in 2019 by Aidan Gomez (a co-author of the ''Attention Is All You Need'' transformer paper) and Nick Frosst. Cohere builds enterprise-focused large language models including Command R/R+ and Embed/Rerank, optimised for retrieval-augmented generation (RAG) and on-prem deployment. The company is backed by Nvidia, Oracle, Salesforce Ventures, Cisco, and others.',
  'https://www.google.com/s2/favicons?domain=cohere.com&sz=256',
  2019, '201-500',
  'https://www.linkedin.com/company/cohere-ai', 'https://twitter.com/cohere',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 3/94  xAI (Grok)
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'xAI (Grok)', 'xai-grok', 'xAI Team', 'support@x.ai',
  '+1', NULL, 'https://x.ai',
  (SELECT id FROM categories WHERE slug = 'general-chat-assistants' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'Palo Alto', 'Palo Alto, US',
  'Elon Musk''s AI lab and the Grok assistant built into X',
  'xAI is the AI company founded by Elon Musk in 2023 and the maker of Grok, the AI assistant integrated into X (formerly Twitter). Grok offers real-time access to X data, image generation via Aurora, voice mode, and the high-end Grok-3 model. xAI raised a $6B Series B at a $24B valuation in 2024 and operates the Memphis ''Colossus'' supercluster — one of the world''s largest GPU training facilities.',
  'https://www.google.com/s2/favicons?domain=x.ai&sz=256',
  2023, '201-500',
  'https://www.linkedin.com/company/x-ai', 'https://twitter.com/xai',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 4/94  Character.AI
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Character.AI', 'character-ai', 'Character.AI Team', 'support@character.ai',
  '+1', NULL, 'https://character.ai',
  (SELECT id FROM categories WHERE slug = 'general-chat-assistants' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'Menlo Park', 'Menlo Park, US',
  'Talk to millions of user-created AI characters — gaming, learning, roleplay',
  'Character.AI is a consumer AI platform founded in 2021 by ex-Google Brain researchers Noam Shazeer and Daniel De Freitas, the team behind LaMDA. Users can chat with millions of community-created AI characters — from historical figures to fictional companions to language tutors — or create their own. The company licensed its core technology to Google in a 2024 deal valued at $2.7B and remains a top-5 consumer AI app by usage.',
  'https://www.google.com/s2/favicons?domain=character.ai&sz=256',
  2021, '51-200',
  'https://www.linkedin.com/company/character-ai', 'https://twitter.com/character_ai',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 5/94  Inflection AI
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Inflection AI', 'inflection-ai', 'Inflection AI Team', 'support@inflection.ai',
  '+1', NULL, 'https://inflection.ai',
  (SELECT id FROM categories WHERE slug = 'general-chat-assistants' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'Palo Alto', 'Palo Alto, US',
  'Pi — the empathetic AI assistant from the makers of LaMDA',
  'Inflection AI was founded in 2022 by Mustafa Suleyman (DeepMind co-founder), Reid Hoffman, and Karen Simonyan. The company built Pi, an empathetic conversational AI assistant designed for emotional intelligence rather than task completion. In 2024 Microsoft licensed Inflection''s technology and hired most of the team; Pi continues to operate, and the company now licenses LLMs and AI studio tools to enterprises.',
  'https://www.google.com/s2/favicons?domain=inflection.ai&sz=256',
  2022, '11-50',
  'https://www.linkedin.com/company/inflection-ai', 'https://twitter.com/inflectionAI',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 6/94  You.com
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'You.com', 'you-com', 'You.com Team', 'support@you.com',
  '+1', NULL, 'https://you.com',
  (SELECT id FROM categories WHERE slug = 'ai-answer-engine' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'Palo Alto', 'Palo Alto, US',
  'AI search engine for productivity — multimodal, with citations',
  'You.com is an AI-first search engine founded in 2020 by Richard Socher (former chief scientist at Salesforce) and Bryan McCann. You.com combines real-time web search with multiple LLMs (GPT-4o, Claude, custom models) to deliver cited answers, write code, research, and analyse documents. The company is backed by Salesforce Ventures, Nvidia, Day One, and Marc Benioff and competes with Perplexity in the answer-engine category.',
  'https://www.google.com/s2/favicons?domain=you.com&sz=256',
  2020, '51-200',
  'https://www.linkedin.com/company/you-com', 'https://twitter.com/YouSearchEngine',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 7/94  Poe
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Poe', 'poe', 'Poe Team', 'support@poe.com',
  '+1', NULL, 'https://poe.com',
  (SELECT id FROM categories WHERE slug = 'general-chat-assistants' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Francisco', 'San Francisco, US',
  'One subscription, every major AI model — Claude, GPT, Gemini, image, video',
  'Poe is Quora''s AI assistant aggregator, launched in 2022. A single Poe subscription gives access to dozens of frontier and specialist AI models — Claude, GPT-4, Gemini, Llama, Mistral, plus image (DALL-E, Stable Diffusion) and video (Runway, Hailuo) generators — through one chat interface. Poe also lets anyone build and publish custom bots that other users can subscribe to, sharing creator revenue.',
  'https://www.google.com/s2/favicons?domain=poe.com&sz=256',
  2022, '51-200',
  'https://www.linkedin.com/company/quora', 'https://twitter.com/poe_platform',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 8/94  HuggingChat
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'HuggingChat', 'huggingchat', 'HuggingChat Team', 'support@huggingface.co',
  '+1', NULL, 'https://huggingface.co',
  (SELECT id FROM categories WHERE slug = 'open-source-chat-assistant' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'New York', 'New York, US',
  'Open-source chat assistant from Hugging Face — pick your own model',
  'HuggingChat is a free, open-source chat assistant operated by Hugging Face, the central hub of the open-source AI community. Users can pick from many community models — Llama 3, Mistral, Qwen, DeepSeek, Cohere Command R+ — and chat for free with web search and tools. The underlying chat-ui project is open source, so the same stack can be self-hosted.',
  'https://www.google.com/s2/favicons?domain=huggingface.co&sz=256',
  2016, '201-500',
  'https://www.linkedin.com/company/huggingface', 'https://twitter.com/huggingface',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 9/94  Midjourney
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Midjourney', 'midjourney', 'Midjourney Team', 'support@midjourney.com',
  '+1', NULL, 'https://midjourney.com',
  (SELECT id FROM categories WHERE slug = 'image-model-playgrounds' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Francisco', 'San Francisco, US',
  'AI image generation that turned Discord into the world''s biggest creative community',
  'Midjourney is an independent research lab founded in 2021 by David Holz (co-founder of Leap Motion). Its text-to-image model became culturally famous through its Discord-first interface, where millions of users prompt and remix each other''s work. The v6 and v7 model series push photorealism, painterly styles, and consistent characters. Midjourney is profitable, fully bootstrapped, and one of the most-used generative-image services in the world.',
  'https://www.google.com/s2/favicons?domain=midjourney.com&sz=256',
  2021, '11-50',
  'https://www.linkedin.com/company/midjourney', 'https://twitter.com/midjourney',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 10/94  Stability AI
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Stability AI', 'stability-ai', 'Stability AI Team', 'support@stability.ai',
  '+44', NULL, 'https://stability.ai',
  (SELECT id FROM categories WHERE slug = 'image-model-playgrounds' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'GB' LIMIT 1), @fallback_country),
  'London', 'London, GB',
  'The lab behind Stable Diffusion — open models for image, video, audio, and 3D',
  'Stability AI, founded in 2019 and headquartered in London, is the open-source AI lab behind the Stable Diffusion family of image models — the most widely deployed open-weight image generation system in the world. It also publishes Stable Video, Stable Audio, Stable LM, and Stable Diffusion 3, used by millions of developers and the creators of tools like Leonardo, NightCafe, and Recraft.',
  'https://www.google.com/s2/favicons?domain=stability.ai&sz=256',
  2019, '51-200',
  'https://www.linkedin.com/company/stability-ai', 'https://twitter.com/StabilityAI',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 11/94  Adobe Firefly
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Adobe Firefly', 'adobe-firefly', 'Adobe Firefly Team', 'support@firefly.adobe.com',
  '+1', NULL, 'https://firefly.adobe.com',
  (SELECT id FROM categories WHERE slug = 'image-model-playgrounds' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Jose', 'San Jose, US',
  'Adobe''s commercially-safe generative AI built into Photoshop, Illustrator, and Express',
  'Firefly is Adobe''s family of generative AI models, launched in 2023 and trained exclusively on Adobe Stock plus public-domain content — so output is licensed for commercial use. Firefly powers Generative Fill in Photoshop, Generative Recolor in Illustrator, text-to-template in Express, and Firefly Video. Tightly integrated with the Creative Cloud subscription and used by tens of millions of designers.',
  'https://www.google.com/s2/favicons?domain=firefly.adobe.com&sz=256',
  1982, '1000+',
  'https://www.linkedin.com/company/adobe', 'https://twitter.com/Adobe',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 12/94  DALL-E
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'DALL-E', 'dall-e', 'DALL-E Team', 'support@openai.com',
  '+1', NULL, 'https://openai.com',
  (SELECT id FROM categories WHERE slug = 'image-model-playgrounds' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Francisco', 'San Francisco, US',
  'OpenAI''s image generation model — built into ChatGPT and the API',
  'DALL-E is OpenAI''s text-to-image model series, launched in 2021 and now in its third generation. DALL-E 3 is tightly integrated with ChatGPT — users can prompt it in plain language and iterate by replying — and is also available via the OpenAI API for developers. It''s a benchmark for high-fidelity, instruction-following image generation.',
  'https://www.google.com/s2/favicons?domain=openai.com&sz=256',
  2015, '1000+',
  'https://www.linkedin.com/company/openai', 'https://twitter.com/OpenAI',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 13/94  Leonardo.AI
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Leonardo.AI', 'leonardo-ai', 'Leonardo.AI Team', 'support@leonardo.ai',
  '+61', NULL, 'https://leonardo.ai',
  (SELECT id FROM categories WHERE slug = 'image-model-playgrounds' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'AU' LIMIT 1), @fallback_country),
  'Sydney', 'Sydney, AU',
  'AI image and video for creators — game assets, marketing visuals, and more',
  'Leonardo.AI is an Australian generative-image platform launched in 2022, acquired by Canva in 2024. Leonardo specialises in fine-tuned models for distinct creative use cases — game assets, character design, photography, marketing visuals — plus a real-time canvas, video generation, and an enterprise API. It''s a go-to for creators who want control beyond the consumer-grade tools.',
  'https://www.google.com/s2/favicons?domain=leonardo.ai&sz=256',
  2022, '51-200',
  'https://www.linkedin.com/company/leonardo-ai', 'https://twitter.com/LeonardoAi_',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 14/94  Ideogram
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Ideogram', 'ideogram', 'Ideogram Team', 'support@ideogram.ai',
  '+1', NULL, 'https://ideogram.ai',
  (SELECT id FROM categories WHERE slug = 'image-model-playgrounds' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'CA' LIMIT 1), @fallback_country),
  'Toronto', 'Toronto, CA',
  'AI images with the best in-image text — posters, logos, mockups',
  'Ideogram was founded in 2023 by ex-Google Brain researchers, notably Mohammad Norouzi and other authors of Imagen. The Ideogram 2.0 and 3.0 models are best known for accurately rendering text inside images — making it the go-to tool for posters, ads, social graphics, and logo mockups. The product is available on the web and via API, with a generous free tier.',
  'https://www.google.com/s2/favicons?domain=ideogram.ai&sz=256',
  2023, '11-50',
  'https://www.linkedin.com/company/ideogram-ai', 'https://twitter.com/ideogram_ai',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 15/94  Krea AI
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Krea AI', 'krea-ai', 'Krea AI Team', 'support@krea.ai',
  '+1', NULL, 'https://krea.ai',
  (SELECT id FROM categories WHERE slug = 'image-model-playgrounds' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Francisco', 'San Francisco, US',
  'Real-time AI canvas — paint with prompts, in real time',
  'Krea AI launched in 2023 with a real-time generative canvas that updates as the user paints or types, popularising the live diffusion workflow. The product spans image generation, real-time enhance, video, training custom styles, and a 3D-aware reference workflow. Krea is a favourite among designers and creative directors prototyping mood boards and pitch visuals.',
  'https://www.google.com/s2/favicons?domain=krea.ai&sz=256',
  2023, '11-50',
  'https://www.linkedin.com/company/kreaai', 'https://twitter.com/krea_ai',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 16/94  Recraft
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Recraft', 'recraft', 'Recraft Team', 'support@recraft.ai',
  '+44', NULL, 'https://recraft.ai',
  (SELECT id FROM categories WHERE slug = 'image-model-playgrounds' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'GB' LIMIT 1), @fallback_country),
  'London', 'London, GB',
  'The designer''s AI tool — vector, consistent style, real text',
  'Recraft is a UK-based generative image tool founded in 2022, built specifically for designers. Its custom v3 model excels at vector output (SVG), generating consistent style sets, and accurate text — features that make it more useful than general-purpose generators for icon sets, brand kits, illustrations, and merch mockups.',
  'https://www.google.com/s2/favicons?domain=recraft.ai&sz=256',
  2022, '11-50',
  'https://www.linkedin.com/company/recraft-ai', 'https://twitter.com/recraftai',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 17/94  Playground AI
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Playground AI', 'playground-ai', 'Playground AI Team', 'support@playground.com',
  '+1', NULL, 'https://playground.com',
  (SELECT id FROM categories WHERE slug = 'image-model-playgrounds' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Francisco', 'San Francisco, US',
  'Free AI image generation — Stable Diffusion plus Playground''s own models',
  'Playground is a free-tier-heavy text-to-image platform popular with hobbyists and indie creators. It serves multiple model backends (Playground v2.5/v3, Stable Diffusion, Flux), with strong free quotas and a familiar web canvas. Founded in 2022 in San Francisco by Suhail Doshi (Mixpanel co-founder), it''s profitable and growing organically.',
  'https://www.google.com/s2/favicons?domain=playground.com&sz=256',
  2022, '11-50',
  'https://www.linkedin.com/company/playground-ai', 'https://twitter.com/playground_ai',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 18/94  Flux (Black Forest Labs)
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Flux (Black Forest Labs)', 'flux-black-forest-labs', 'Flux Team', 'support@blackforestlabs.ai',
  '+49', NULL, 'https://blackforestlabs.ai',
  (SELECT id FROM categories WHERE slug = 'image-model-playgrounds' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'DE' LIMIT 1), @fallback_country),
  'Freiburg', 'Freiburg, DE',
  'The Flux image models from the original Stable Diffusion team',
  'Black Forest Labs was founded in 2024 by Robin Rombach and the original Stable Diffusion team after leaving Stability AI. Their Flux series (Flux.1 dev, schnell, pro, and Flux.1.1 pro) sets the state of the art for open-weight image generation and powers high-end use across many third-party tools. Based in Freiburg, Germany.',
  'https://www.google.com/s2/favicons?domain=blackforestlabs.ai&sz=256',
  2024, '11-50',
  'https://www.linkedin.com/company/black-forest-labs', 'https://twitter.com/bfl_ml',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 19/94  Runway
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Runway', 'runway', 'Runway Team', 'support@runwayml.com',
  '+1', NULL, 'https://runwayml.com',
  (SELECT id FROM categories WHERE slug = 'video-model-playgrounds' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'New York', 'New York, US',
  'AI video generation and editing — Gen-3 Alpha and the Act-One pipeline',
  'Runway is a generative-video company founded in 2018 in New York. Its Gen-1, Gen-2, and Gen-3 Alpha models established text-to-video and image-to-video as a real product category, used by Hollywood VFX teams and indie creators. Runway also publishes professional video editing tools, including motion brush, lip-sync, and Act-One (performance-to-character motion transfer).',
  'https://www.google.com/s2/favicons?domain=runwayml.com&sz=256',
  2018, '51-200',
  'https://www.linkedin.com/company/runwayml', 'https://twitter.com/runwayml',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 20/94  Pika Labs
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Pika Labs', 'pika-labs', 'Pika Labs Team', 'support@pika.art',
  '+1', NULL, 'https://pika.art',
  (SELECT id FROM categories WHERE slug = 'video-model-playgrounds' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'Palo Alto', 'Palo Alto, US',
  'Text-to-video on a Discord-first interface — playful, fast, social',
  'Pika is a generative-video startup founded in 2023 by Demi Guo and Chenlin Meng. Pika 1.5 and 2.0 brought consumer-friendly video gen via a Discord and web interface with strong control over motion, lip-sync, and visual effects (''Pikaffects''). It has raised over $100M from Lightspeed, Spark Capital, and Nat Friedman among others.',
  'https://www.google.com/s2/favicons?domain=pika.art&sz=256',
  2023, '11-50',
  'https://www.linkedin.com/company/pika-labs', 'https://twitter.com/pika_labs',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 21/94  Synthesia
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Synthesia', 'synthesia', 'Synthesia Team', 'support@synthesia.io',
  '+44', NULL, 'https://synthesia.io',
  (SELECT id FROM categories WHERE slug = 'video-model-playgrounds' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'GB' LIMIT 1), @fallback_country),
  'London', 'London, GB',
  'Studio-grade AI avatar videos — corporate training, marketing, multilingual',
  'Synthesia is the leader in AI avatar video generation, founded in 2017 in London. Users type a script and Synthesia produces a finished video with a realistic AI presenter in 140+ languages. Used by 60%+ of Fortune 100 companies for training, communications, and customer support content. Valued at over $2B following its 2024 Series D from NEA, Accel, and Nvidia.',
  'https://www.google.com/s2/favicons?domain=synthesia.io&sz=256',
  2017, '201-500',
  'https://www.linkedin.com/company/synthesia-technologies', 'https://twitter.com/synthesiaIO',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 22/94  HeyGen
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'HeyGen', 'heygen', 'HeyGen Team', 'support@heygen.com',
  '+1', NULL, 'https://heygen.com',
  (SELECT id FROM categories WHERE slug = 'video-model-playgrounds' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'Los Angeles', 'Los Angeles, US',
  'AI video and avatar studio — viral translation, lip-sync, and live avatars',
  'HeyGen is an AI video generation platform founded in 2020 by Joshua Xu, headquartered in Los Angeles. The product produces avatar videos, custom voice clones, and the viral ''video translation'' feature that re-dubs and re-lip-syncs a person speaking in another language. HeyGen is reportedly the fastest-growing avatar video startup, used by global enterprises for marketing and training.',
  'https://www.google.com/s2/favicons?domain=heygen.com&sz=256',
  2020, '51-200',
  'https://www.linkedin.com/company/heygen-com', 'https://twitter.com/HeyGen_Official',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 23/94  D-ID
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'D-ID', 'd-id', 'D-ID Team', 'support@d-id.com',
  '+972', NULL, 'https://d-id.com',
  (SELECT id FROM categories WHERE slug = 'video-model-playgrounds' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'IL' LIMIT 1), @fallback_country),
  'Tel Aviv', 'Tel Aviv, IL',
  'Photoreal talking avatars for video, customer service, and creative use',
  'D-ID is an Israeli AI company founded in 2017 that pioneered photorealistic talking-head video from a single still image. Its Creative Reality Studio is used for corporate training, customer-service avatars, language learning, and the famous MyHeritage ''Deep Nostalgia'' feature. D-ID also licenses real-time avatars for video calls and agents.',
  'https://www.google.com/s2/favicons?domain=d-id.com&sz=256',
  2017, '51-200',
  'https://www.linkedin.com/company/d-id', 'https://twitter.com/D_ID_',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 24/94  Luma AI
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Luma AI', 'luma-ai', 'Luma AI Team', 'support@lumalabs.ai',
  '+1', NULL, 'https://lumalabs.ai',
  (SELECT id FROM categories WHERE slug = 'video-model-playgrounds' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'Palo Alto', 'Palo Alto, US',
  'Dream Machine — text-to-video plus Genie 3D capture',
  'Luma AI is a generative 3D and video lab founded in 2021 in Palo Alto. Its Dream Machine video model is one of the consumer-friendliest text-to-video systems, and Genie/NeRF capture turns phone footage into navigable 3D scenes used by Hollywood VFX. Backed by a16z, Amplify, and Nvidia.',
  'https://www.google.com/s2/favicons?domain=lumalabs.ai&sz=256',
  2021, '11-50',
  'https://www.linkedin.com/company/lumalabs-ai', 'https://twitter.com/LumaLabsAI',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 25/94  KLING AI
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'KLING AI', 'kling-ai', 'KLING AI Team', 'support@klingai.com',
  '+86', NULL, 'https://klingai.com',
  (SELECT id FROM categories WHERE slug = 'video-model-playgrounds' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'CN' LIMIT 1), @fallback_country),
  'Beijing', 'Beijing, CN',
  'Kuaishou''s frontier text-to-video model — long-clip, motion-rich generation',
  'KLING AI is the consumer text-to-video product from Kuaishou, the Chinese short-video platform. KLING 1.5/1.6/2.0 produces longer, motion-rich clips with strong physics and is widely considered the closest open competitor to OpenAI''s Sora. Used worldwide via a web app and API.',
  'https://www.google.com/s2/favicons?domain=klingai.com&sz=256',
  2024, '201-500',
  NULL, 'https://twitter.com/Kling_ai',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 26/94  Hailuo AI (MiniMax)
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Hailuo AI (MiniMax)', 'hailuo-ai-minimax', 'Hailuo AI Team', 'support@hailuoai.video',
  '+86', NULL, 'https://hailuoai.video',
  (SELECT id FROM categories WHERE slug = 'video-model-playgrounds' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'CN' LIMIT 1), @fallback_country),
  'Shanghai', 'Shanghai, CN',
  'MiniMax''s Hailuo — high-detail text-to-video and image-to-video',
  'Hailuo AI is the consumer video app from MiniMax, the Shanghai-based AI lab. Hailuo''s video models (i-01 and t2v-01) produce highly detailed clips with realistic motion and strong prompt adherence — a top-tier alternative to Runway, Kling, and Sora. MiniMax also publishes the abab LLM series and Talkie character chat app.',
  'https://www.google.com/s2/favicons?domain=hailuoai.video&sz=256',
  2021, '201-500',
  'https://www.linkedin.com/company/minimax-ai', 'https://twitter.com/Hailuo_AI',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 27/94  ElevenLabs
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'ElevenLabs', 'elevenlabs', 'ElevenLabs Team', 'support@elevenlabs.io',
  '+44', NULL, 'https://elevenlabs.io',
  (SELECT id FROM categories WHERE slug = 'ai-voice-tts' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'GB' LIMIT 1), @fallback_country),
  'London', 'London, GB',
  'The most realistic AI voice — text-to-speech, voice cloning, dubbing',
  'ElevenLabs is a London-based generative-voice company founded in 2022 by ex-Palantir Piotr Dabkowski and ex-Google Mati Staniszewski. The platform powers studio-grade text-to-speech, voice cloning, multilingual dubbing, and Conversational AI agents in 32 languages. Used by global publishers, gaming studios, and audiobook houses. Valued at over $3B following its 2024 Series C from a16z, ICONIQ, NEA, and Sequoia.',
  'https://www.google.com/s2/favicons?domain=elevenlabs.io&sz=256',
  2022, '201-500',
  'https://www.linkedin.com/company/elevenlabsio', 'https://twitter.com/elevenlabsio',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 28/94  Suno
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Suno', 'suno', 'Suno Team', 'support@suno.com',
  '+1', NULL, 'https://suno.com',
  (SELECT id FROM categories WHERE slug = 'ai-song-generator' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'Cambridge', 'Cambridge, US',
  'AI-generated music — a full song from a prompt, lyrics included',
  'Suno is an AI music platform founded in 2022 in Cambridge, MA. The product generates full songs — vocals, lyrics, instrumental — from a short text prompt, with style presets across genres and the option to upload audio for continuation. Suno raised a $125M Series B from Lightspeed and remains a category leader against Udio.',
  'https://www.google.com/s2/favicons?domain=suno.com&sz=256',
  2022, '11-50',
  'https://www.linkedin.com/company/suno-music', 'https://twitter.com/sunomusic',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 29/94  Udio
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Udio', 'udio', 'Udio Team', 'support@udio.com',
  '+1', NULL, 'https://udio.com',
  (SELECT id FROM categories WHERE slug = 'ai-song-generator' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'New York', 'New York, US',
  'Generative music with vocal-quality lead — by ex-DeepMind founders',
  'Udio is a generative music platform launched in 2024 by ex-DeepMind researchers including David Ding. Udio is widely regarded for its vocal generation quality and prompt fidelity across genres, with a long-prompt control system that lets users sculpt arrangements and styles. Backed by a16z and Will.i.am.',
  'https://www.google.com/s2/favicons?domain=udio.com&sz=256',
  2023, '11-50',
  'https://www.linkedin.com/company/udio-ai', 'https://twitter.com/udiomusic',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 30/94  Murf AI
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Murf AI', 'murf-ai', 'Murf AI Team', 'support@murf.ai',
  '+91', NULL, 'https://murf.ai',
  (SELECT id FROM categories WHERE slug = 'ai-voice-tts' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'IN' LIMIT 1), @fallback_country),
  'Bengaluru', 'Bengaluru, IN',
  'Studio-grade AI voiceover for marketing, e-learning, and product demos',
  'Murf is an AI voice generator founded in 2020 in Salt Lake City and Bengaluru. The platform offers 120+ studio-quality voices in 20+ languages, voice cloning, time-synced media library, and an API. Widely used by L&D teams, video creators, and marketing teams for narration that doesn''t need a studio booking.',
  'https://www.google.com/s2/favicons?domain=murf.ai&sz=256',
  2020, '51-200',
  'https://www.linkedin.com/company/murf-ai', 'https://twitter.com/murfai',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 31/94  Resemble AI
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Resemble AI', 'resemble-ai', 'Resemble AI Team', 'support@resemble.ai',
  '+1', NULL, 'https://resemble.ai',
  (SELECT id FROM categories WHERE slug = 'ai-voice-tts' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'CA' LIMIT 1), @fallback_country),
  'Toronto', 'Toronto, CA',
  'Custom AI voice cloning with deepfake detection — enterprise-grade',
  'Resemble AI is a Toronto-based AI voice company founded in 2019. The product pairs high-quality voice cloning (5+ languages from a single recording) with enterprise security: deepfake detection via the Resemble Detect API, voice provenance audit logs, and on-prem deployment. Used by media, contact centres, and government clients.',
  'https://www.google.com/s2/favicons?domain=resemble.ai&sz=256',
  2019, '11-50',
  'https://www.linkedin.com/company/resemble-ai', 'https://twitter.com/resembleai',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 32/94  Play.ht
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Play.ht', 'play-ht', 'Play.ht Team', 'support@play.ht',
  '+1', NULL, 'https://play.ht',
  (SELECT id FROM categories WHERE slug = 'ai-voice-tts' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Francisco', 'San Francisco, US',
  'Generative voice for content, podcasts, and Conversational AI agents',
  'PlayHT (Play.ht) is a US-based text-to-speech company founded in 2016. The platform offers 800+ AI voices in 100+ languages plus its own PlayDialog model for natural-sounding 2-voice dialogues — heavily used by podcasters, audiobook creators, and developers building Voice AI agents.',
  'https://www.google.com/s2/favicons?domain=play.ht&sz=256',
  2016, '11-50',
  'https://www.linkedin.com/company/playht', 'https://twitter.com/play_ht',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 33/94  Speechify
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Speechify', 'speechify', 'Speechify Team', 'support@speechify.com',
  '+1', NULL, 'https://speechify.com',
  (SELECT id FROM categories WHERE slug = 'ai-voice-tts' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'Miami', 'Miami, US',
  'Read anything aloud — articles, PDFs, books, docs — with celebrity voices',
  'Speechify is a US text-to-speech consumer app founded in 2017 by Cliff Weitzman to help people with dyslexia. The product reads any text — webpages, PDFs, docs, books — aloud, with high-quality AI voices including celebrity-licensed voices (Snoop Dogg, Gwyneth Paltrow, MrBeast). Top-grossing iOS productivity app with over 30M users.',
  'https://www.google.com/s2/favicons?domain=speechify.com&sz=256',
  2017, '201-500',
  'https://www.linkedin.com/company/getspeechify', 'https://twitter.com/speechify',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 34/94  Krisp
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Krisp', 'krisp', 'Krisp Team', 'support@krisp.ai',
  '+1', NULL, 'https://krisp.ai',
  (SELECT id FROM categories WHERE slug = 'ai-noise-remover' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'Berkeley', 'Berkeley, US',
  'AI noise cancellation, transcription, and meeting notes — built into every call',
  'Krisp is an AI voice productivity company founded in 2017 by Davit Baghdasaryan and Artavazd Minasyan. Krisp''s core product cancels background noise from microphone input across any app (Zoom, Teams, Meet) and is bundled with most major call platforms. The app now also handles meeting transcription, summaries, and live translation.',
  'https://www.google.com/s2/favicons?domain=krisp.ai&sz=256',
  2017, '51-200',
  'https://www.linkedin.com/company/krisp-technologies', 'https://twitter.com/krispHQ',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 35/94  GitHub Copilot
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'GitHub Copilot', 'github-copilot', 'GitHub Copilot Team', 'support@github.com',
  '+1', NULL, 'https://github.com',
  (SELECT id FROM categories WHERE slug = 'ai-code-completion' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Francisco', 'San Francisco, US',
  'The pair-programmer-in-your-editor — autocomplete and chat for code',
  'GitHub Copilot is GitHub''s AI pair-programmer, built on OpenAI models, launched in 2021. Copilot offers inline code completion, chat, code explanation, test generation, and PR review across every major IDE. With over 1.8M paid subscribers (and free for verified students/teachers/OSS maintainers), it remains the most-used AI coding assistant in the world.',
  'https://www.google.com/s2/favicons?domain=github.com&sz=256',
  2008, '1000+',
  'https://www.linkedin.com/company/github', 'https://twitter.com/github',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 36/94  Cursor
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Cursor', 'cursor', 'Cursor Team', 'support@cursor.com',
  '+1', NULL, 'https://cursor.com',
  (SELECT id FROM categories WHERE slug = 'ai-code-completion' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Francisco', 'San Francisco, US',
  'The AI-first code editor — Composer, agent mode, and instant codebase search',
  'Cursor is the AI-first code editor from Anysphere, founded in 2022 in San Francisco. A fork of VS Code, Cursor adds agentic features like Composer (multi-file edits), background agents, codebase indexing, and tight integration with Claude/GPT/Gemini. It became the fastest-growing developer tool in 2024 and one of the most beloved IDEs by AI-native engineers.',
  'https://www.google.com/s2/favicons?domain=cursor.com&sz=256',
  2022, '11-50',
  'https://www.linkedin.com/company/anysphere', 'https://twitter.com/cursor_ai',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 37/94  Codeium / Windsurf
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Codeium / Windsurf', 'codeium-windsurf', 'Codeium / Windsurf Team', 'support@codeium.com',
  '+1', NULL, 'https://codeium.com',
  (SELECT id FROM categories WHERE slug = 'ai-code-completion' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'Mountain View', 'Mountain View, US',
  'Free AI autocomplete for every IDE, plus the Windsurf agentic editor',
  'Codeium, founded in 2021 by ex-Quora and ex-Nuro engineers, ships a free AI coding extension for 40+ IDEs and Windsurf — its own AI-first editor that introduced ''Cascade'' agentic edits. Codeium serves over 1M developers free and serves the enterprise tier under SSO + on-prem options.',
  'https://www.google.com/s2/favicons?domain=codeium.com&sz=256',
  2021, '51-200',
  'https://www.linkedin.com/company/codeium', 'https://twitter.com/codeiumdev',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 38/94  Tabnine
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Tabnine', 'tabnine', 'Tabnine Team', 'support@tabnine.com',
  '+972', NULL, 'https://tabnine.com',
  (SELECT id FROM categories WHERE slug = 'ai-code-completion' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'IL' LIMIT 1), @fallback_country),
  'Tel Aviv', 'Tel Aviv, IL',
  'Enterprise-grade AI code assistant — on-prem, privacy-first, your code never leaves',
  'Tabnine is one of the original AI code-completion companies, founded in 2013 (then called Codota). Tabnine''s enterprise tier is on-prem or VPC-deployed, trained only on permissively-licensed code, with full provenance and zero data retention — a key choice for regulated industries that can''t use Copilot or Cursor.',
  'https://www.google.com/s2/favicons?domain=tabnine.com&sz=256',
  2013, '51-200',
  'https://www.linkedin.com/company/tabnine', 'https://twitter.com/tabnine',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 39/94  Replit
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Replit', 'replit', 'Replit Team', 'support@replit.com',
  '+1', NULL, 'https://replit.com',
  (SELECT id FROM categories WHERE slug = 'ai-code-completion' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Francisco', 'San Francisco, US',
  'Build, deploy, and host apps in the browser — with Replit Agent doing the work',
  'Replit is a browser-based development platform founded in 2016 by Amjad Masad and Faris Masad. Replit AI (originally Ghostwriter) and the 2024 Replit Agent let users build full-stack web apps with natural-language prompts — the agent writes, runs, deploys, and iterates on the code. Used in classrooms worldwide and by indie hackers who ship in hours.',
  'https://www.google.com/s2/favicons?domain=replit.com&sz=256',
  2016, '201-500',
  'https://www.linkedin.com/company/replit', 'https://twitter.com/replit',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 40/94  v0 by Vercel
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'v0 by Vercel', 'v0-by-vercel', 'v0 by Vercel Team', 'support@v0.dev',
  '+1', NULL, 'https://v0.dev',
  (SELECT id FROM categories WHERE slug = 'ai-code-completion' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Francisco', 'San Francisco, US',
  'Generative UI for React + shadcn — from prompt to production',
  'v0 is Vercel''s generative-UI tool, launched in 2023. Users describe an interface in plain English (or attach a screenshot) and v0 produces production-quality React/Next.js components styled with shadcn/ui and Tailwind. Each generation can be opened in a forkable workspace, deployed to Vercel, or pulled into an existing codebase via the v0 CLI.',
  'https://www.google.com/s2/favicons?domain=v0.dev&sz=256',
  2015, '201-500',
  'https://www.linkedin.com/company/vercel', 'https://twitter.com/vercel',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 41/94  Devin (Cognition Labs)
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Devin (Cognition Labs)', 'devin-cognition-labs', 'Devin Team', 'support@cognition.ai',
  '+1', NULL, 'https://cognition.ai',
  (SELECT id FROM categories WHERE slug = 'ai-coding-agents' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Francisco', 'San Francisco, US',
  'The first autonomous AI software engineer — plans, codes, debugs, ships',
  'Cognition Labs, founded in 2023 in San Francisco, builds Devin — the first widely-publicised autonomous AI software engineer. Devin is given a task and a sandboxed environment, then plans, writes code, runs tests, and submits PRs end-to-end. Used by engineering teams at Nubank, Goldman Sachs, and others as a teammate that handles tickets autonomously.',
  'https://www.google.com/s2/favicons?domain=cognition.ai&sz=256',
  2023, '11-50',
  'https://www.linkedin.com/company/cognition-ai', 'https://twitter.com/cognition_labs',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 42/94  Bolt.new (StackBlitz)
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Bolt.new (StackBlitz)', 'bolt-new-stackblitz', 'Bolt.new Team', 'support@bolt.new',
  '+1', NULL, 'https://bolt.new',
  (SELECT id FROM categories WHERE slug = 'ai-code-completion' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'Boise', 'Boise, US',
  'Prompt-to-app web IDE — full-stack apps that run instantly in the browser',
  'Bolt.new is StackBlitz''s prompt-to-app web IDE, launched in 2024. Users describe an app, Bolt builds it in seconds — Vite/Next/Astro/Vue — running entirely in a WebContainer in the browser, with live preview, package management, and one-click deploy to Netlify. StackBlitz reported 5M+ users in the first 60 days.',
  'https://www.google.com/s2/favicons?domain=bolt.new&sz=256',
  2017, '51-200',
  'https://www.linkedin.com/company/stackblitz', 'https://twitter.com/stackblitz',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 43/94  Lovable
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Lovable', 'lovable', 'Lovable Team', 'support@lovable.dev',
  '+46', NULL, 'https://lovable.dev',
  (SELECT id FROM categories WHERE slug = 'ai-code-completion' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'SE' LIMIT 1), @fallback_country),
  'Stockholm', 'Stockholm, SE',
  'Build full-stack apps from a chat — by the GPT-Engineer team',
  'Lovable, founded in 2023 in Stockholm by Anton Osika (creator of GPT-Engineer), is a prompt-to-app builder for full-stack web apps. The chat UI generates real React + Supabase code, lets the user iterate in natural language, and one-click deploys. It''s one of the fastest-growing European AI startups.',
  'https://www.google.com/s2/favicons?domain=lovable.dev&sz=256',
  2023, '11-50',
  'https://www.linkedin.com/company/lovable-dev', 'https://twitter.com/lovable_dev',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 44/94  Aider
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Aider', 'aider', 'Aider Team', 'support@aider.chat',
  '+1', NULL, 'https://aider.chat',
  (SELECT id FROM categories WHERE slug = 'ai-coding-agents' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Francisco', 'San Francisco, US',
  'Open-source AI pair-programmer in the terminal — git-aware, model-agnostic',
  'Aider is an open-source AI coding assistant that runs in the terminal alongside a git repo. Aider edits files in place, commits intermediate changes, and works with any LLM (Claude, GPT, Gemini, Llama, DeepSeek). It''s a favourite of engineers who want full control and prefer the CLI over a hosted editor.',
  'https://www.google.com/s2/favicons?domain=aider.chat&sz=256',
  2023, '1-10',
  NULL, 'https://twitter.com/paulgauthier',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 45/94  AutoGPT
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'AutoGPT', 'autogpt', 'AutoGPT Team', 'support@agpt.co',
  '+44', NULL, 'https://agpt.co',
  (SELECT id FROM categories WHERE slug = 'autonomous-agents' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'GB' LIMIT 1), @fallback_country),
  'London', 'London, GB',
  'The viral open-source autonomous AI agent — give it a goal, it does the rest',
  'AutoGPT, created by Toran Bruce Richards (Significant Gravitas) in 2023, became the canonical example of an autonomous AI agent — a loop that breaks down a goal, takes web/file actions, and self-corrects. The hosted platform (AutoGPT.co) lets non-developers build no-code agents on top of the same engine. 170k+ GitHub stars.',
  'https://www.google.com/s2/favicons?domain=agpt.co&sz=256',
  2023, '11-50',
  'https://www.linkedin.com/company/significant-gravitas', 'https://twitter.com/Auto_GPT',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 46/94  MultiOn
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'MultiOn', 'multion', 'MultiOn Team', 'support@multion.ai',
  '+1', NULL, 'https://multion.ai',
  (SELECT id FROM categories WHERE slug = 'ai-computer-use-agent' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'Palo Alto', 'Palo Alto, US',
  'An AI agent that uses the web like a human — for you',
  'MultiOn, founded in 2023 by Div Garg in Palo Alto, is a personal AI agent that operates a real browser on your behalf — orders takeout, books flights, files expense reports, scrapes a list of contacts. The agent works on natural-language instructions and is one of the longest-running web-agent products outside the big labs.',
  'https://www.google.com/s2/favicons?domain=multion.ai&sz=256',
  2023, '11-50',
  'https://www.linkedin.com/company/multion-ai', 'https://twitter.com/multion_ai',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 47/94  Adept
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Adept', 'adept', 'Adept Team', 'support@adept.ai',
  '+1', NULL, 'https://adept.ai',
  (SELECT id FROM categories WHERE slug = 'ai-computer-use-agent' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Francisco', 'San Francisco, US',
  'The AI teammate for knowledge work — Fuyu and ACT-1 action models',
  'Adept is an AI lab founded in 2022 by ex-Google/OpenAI researchers including David Luan and Niki Parmar (a transformer paper author). Adept builds ''action models'' that take goals and execute multi-step work across web apps. The team partly joined Amazon in 2024, but Adept''s models continue to ship.',
  'https://www.google.com/s2/favicons?domain=adept.ai&sz=256',
  2022, '51-200',
  'https://www.linkedin.com/company/adept-ai-labs', 'https://twitter.com/AdeptAILabs',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 48/94  Lindy AI
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Lindy AI', 'lindy-ai', 'Lindy AI Team', 'support@lindy.ai',
  '+1', NULL, 'https://lindy.ai',
  (SELECT id FROM categories WHERE slug = 'ai-task-agent' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Francisco', 'San Francisco, US',
  'No-code AI agents for sales, support, and ops — build a Lindy that does the work',
  'Lindy AI is a no-code platform for building AI agents that automate sales outreach, customer support, recruiting workflows, and personal admin. Founded in 2023 by Flo Crivello in San Francisco. Users describe a workflow in plain English and Lindy generates an agent that connects to Gmail, Slack, calendars, CRMs, and the web.',
  'https://www.google.com/s2/favicons?domain=lindy.ai&sz=256',
  2023, '11-50',
  'https://www.linkedin.com/company/lindy-ai', 'https://twitter.com/lindyai',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 49/94  Relevance AI
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Relevance AI', 'relevance-ai', 'Relevance AI Team', 'support@relevanceai.com',
  '+61', NULL, 'https://relevanceai.com',
  (SELECT id FROM categories WHERE slug = 'ai-task-agent' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'AU' LIMIT 1), @fallback_country),
  'Sydney', 'Sydney, AU',
  'No-code AI workforce — build agents and tools that run business processes',
  'Relevance AI is an Australian platform for building AI agents and tools without code. Customers compose multi-step workflows that combine LLMs, tool calling, and data — used by sales teams, customer service, and BPOs as an ''AI workforce''. Backed by Insight Partners and Peak XV.',
  'https://www.google.com/s2/favicons?domain=relevanceai.com&sz=256',
  2020, '51-200',
  'https://www.linkedin.com/company/relevance-ai', 'https://twitter.com/relevanceai_',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 50/94  CrewAI
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'CrewAI', 'crewai', 'CrewAI Team', 'support@crewai.com',
  '+1', NULL, 'https://crewai.com',
  (SELECT id FROM categories WHERE slug = 'ai-task-agent' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Francisco', 'San Francisco, US',
  'Open-source framework + cloud for orchestrating teams of AI agents',
  'CrewAI is an open-source Python framework for orchestrating role-playing, autonomous AI agents — first released in 2024 by João Moura. The CrewAI Enterprise cloud lets companies deploy ''crews'' (multiple specialised agents collaborating) into production, with observability and human-in-the-loop control. Used inside Fortune 500 ops teams.',
  'https://www.google.com/s2/favicons?domain=crewai.com&sz=256',
  2023, '11-50',
  'https://www.linkedin.com/company/crewai-inc', 'https://twitter.com/crewAIInc',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 51/94  Jasper
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Jasper', 'jasper', 'Jasper Team', 'support@jasper.ai',
  '+1', NULL, 'https://jasper.ai',
  (SELECT id FROM categories WHERE slug = 'ai-copywriting-tools' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'Austin', 'Austin, US',
  'AI for marketing teams — campaigns, brand voice, and content at scale',
  'Jasper is one of the original marketing-AI suites, founded in 2021 by Dave Rogenmoser in Austin. The product helps marketing teams produce campaign briefs, blog posts, ads, social copy, and emails tuned to a ''brand voice'' style, with integrations to Google Docs, Webflow, Surfer SEO, and HubSpot. Used by Cisco, Anthropic, and other large brands.',
  'https://www.google.com/s2/favicons?domain=jasper.ai&sz=256',
  2021, '201-500',
  'https://www.linkedin.com/company/heyjasperai', 'https://twitter.com/heyjasperai',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 52/94  Copy.ai
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Copy.ai', 'copy-ai', 'Copy.ai Team', 'support@copy.ai',
  '+1', NULL, 'https://copy.ai',
  (SELECT id FROM categories WHERE slug = 'ai-copywriting-tools' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'Memphis', 'Memphis, US',
  'GTM AI platform — workflows that run sales and marketing on autopilot',
  'Copy.ai started in 2020 as an AI copywriting tool and has since pivoted into a ''GTM AI'' workflow platform. Users assemble multi-step automations that combine LLMs, CRM data, and the web to power outbound sequences, content production, and lead enrichment. Founded by Paul Yacoubian and Chris Lu.',
  'https://www.google.com/s2/favicons?domain=copy.ai&sz=256',
  2020, '51-200',
  'https://www.linkedin.com/company/copy-ai', 'https://twitter.com/copy_ai',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 53/94  Writesonic
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Writesonic', 'writesonic', 'Writesonic Team', 'support@writesonic.com',
  '+91', NULL, 'https://writesonic.com',
  (SELECT id FROM categories WHERE slug = 'ai-copywriting-tools' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'IN' LIMIT 1), @fallback_country),
  'Bengaluru', 'Bengaluru, IN',
  'AI content + Chatsonic + Botsonic — write, chat, and deploy AI agents',
  'Writesonic is an Indian-American AI content platform founded in 2020 by Samanyou Garg. The suite includes long-form article writing (with SEO scoring), Chatsonic (a chat assistant with internet access), and Botsonic (a no-code chatbot builder used by SMBs for support and lead capture). Y Combinator W21.',
  'https://www.google.com/s2/favicons?domain=writesonic.com&sz=256',
  2020, '51-200',
  'https://www.linkedin.com/company/writesonic', 'https://twitter.com/writesonic',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 54/94  Rytr
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Rytr', 'rytr', 'Rytr Team', 'support@rytr.com',
  '+91', NULL, 'https://rytr.com',
  (SELECT id FROM categories WHERE slug = 'ai-copywriting-tools' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'IN' LIMIT 1), @fallback_country),
  'Delhi', 'Delhi, IN',
  'Budget-friendly AI writing assistant for everyday content',
  'Rytr is a low-cost AI writing tool founded in 2021 by Abhi Godara in Delhi. With 40+ use cases (blog ideas, emails, ad copy, product descriptions, video scripts) and 30+ languages, Rytr targets solopreneurs and small teams — its ''Saver'' plan ($9/mo) made it one of the most affordable AI writing tools in the market.',
  'https://www.google.com/s2/favicons?domain=rytr.com&sz=256',
  2021, '11-50',
  'https://www.linkedin.com/company/rytr-me', 'https://twitter.com/rytrhq',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 55/94  Notion AI
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Notion AI', 'notion-ai', 'Notion AI Team', 'support@notion.so',
  '+1', NULL, 'https://notion.so',
  (SELECT id FROM categories WHERE slug = 'ai-collaborative-doc-editor' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Francisco', 'San Francisco, US',
  'AI features built into the Notion workspace — summarise, write, draft, Q&A',
  'Notion AI is Notion''s set of AI features for its workspace product, launched in 2023. Users can summarise pages, generate first drafts, translate, brainstorm, and Q&A their entire workspace. Notion AI is included in the Business and Enterprise plans and serves Notion''s 100M+ users.',
  'https://www.google.com/s2/favicons?domain=notion.so&sz=256',
  2013, '201-500',
  'https://www.linkedin.com/company/notionhq', 'https://twitter.com/NotionHQ',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 56/94  Sudowrite
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Sudowrite', 'sudowrite', 'Sudowrite Team', 'support@sudowrite.com',
  '+1', NULL, 'https://sudowrite.com',
  (SELECT id FROM categories WHERE slug = 'ai-novel-writer' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Francisco', 'San Francisco, US',
  'AI for fiction writers — beats, scenes, character voice, world-building',
  'Sudowrite is the leading AI writing assistant specifically for novelists and screenwriters. Founded in 2020 by Amit Gupta and James Yu in San Francisco, it offers a ''Story Engine'' that helps plot a novel, scene-by-scene writing, brainstorming, character voice and style emulation, and a community of fiction writers. Used by published authors and Hollywood screenwriters.',
  'https://www.google.com/s2/favicons?domain=sudowrite.com&sz=256',
  2020, '1-10',
  'https://www.linkedin.com/company/sudowrite', 'https://twitter.com/sudowrite',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 57/94  Wordtune (AI21 Labs)
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Wordtune (AI21 Labs)', 'wordtune-ai21-labs', 'Wordtune Team', 'support@wordtune.com',
  '+972', NULL, 'https://wordtune.com',
  (SELECT id FROM categories WHERE slug = 'ai-copywriting-tools' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'IL' LIMIT 1), @fallback_country),
  'Tel Aviv', 'Tel Aviv, IL',
  'AI writing assistant — rewrite, summarise, and improve clarity in any browser',
  'Wordtune is the consumer product of AI21 Labs, an Israeli AI research company founded in 2017. The product is a browser extension that rewrites, shortens, expands, and tone-shifts text in any web app — Gmail, LinkedIn, Docs, Slack — and powers the AI21 Spaces document workspace. Used by 10M+ professionals.',
  'https://www.google.com/s2/favicons?domain=wordtune.com&sz=256',
  2017, '201-500',
  'https://www.linkedin.com/company/ai21', 'https://twitter.com/wordtune',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 58/94  Grammarly
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Grammarly', 'grammarly', 'Grammarly Team', 'support@grammarly.com',
  '+1', NULL, 'https://grammarly.com',
  (SELECT id FROM categories WHERE slug = 'ai-copywriting-tools' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Francisco', 'San Francisco, US',
  'AI writing assistance for grammar, style, tone, and clarity — across every app',
  'Grammarly, founded in 2009 in Kyiv by Alex Shevchenko and Max Lytvyn (now headquartered in San Francisco), is the most widely-used AI writing assistant in the world with over 30M daily users and 50,000+ enterprise customers. The product spans real-time corrections, generative AI drafting, brand-voice enforcement, and now agentic communication assistance.',
  'https://www.google.com/s2/favicons?domain=grammarly.com&sz=256',
  2009, '1000+',
  'https://www.linkedin.com/company/grammarly', 'https://twitter.com/Grammarly',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 59/94  Consensus
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Consensus', 'consensus', 'Consensus Team', 'support@consensus.app',
  '+1', NULL, 'https://consensus.app',
  (SELECT id FROM categories WHERE slug = 'ai-research-assistants' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'Boston', 'Boston, US',
  'Search 200M scientific papers — get evidence-based answers, not hot takes',
  'Consensus is an academic-search AI that answers research questions using over 200M peer-reviewed papers. Founded in 2022 in Boston, the product surfaces consensus across studies (yes/no/mixed), with citations and quality indicators. Used by clinicians, journalists, researchers, and policymakers as an alternative to citing whatever ChatGPT remembers.',
  'https://www.google.com/s2/favicons?domain=consensus.app&sz=256',
  2022, '11-50',
  'https://www.linkedin.com/company/consensus-ai', 'https://twitter.com/consensus_app',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 60/94  Elicit
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Elicit', 'elicit', 'Elicit Team', 'support@elicit.com',
  '+1', NULL, 'https://elicit.com',
  (SELECT id FROM categories WHERE slug = 'ai-research-assistants' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Francisco', 'San Francisco, US',
  'AI research assistant for systematic reviews — find, extract, synthesize',
  'Elicit is an AI research tool for systematic reviews and literature search, spun out of Ought in 2022. Researchers describe a question and Elicit finds relevant papers from a 125M-paper corpus, then extracts results into structured tables and synthesises findings. Used by academic and policy researchers worldwide.',
  'https://www.google.com/s2/favicons?domain=elicit.com&sz=256',
  2018, '11-50',
  'https://www.linkedin.com/company/elicit', 'https://twitter.com/elicitorg',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 61/94  SciSpace
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'SciSpace', 'scispace', 'SciSpace Team', 'support@scispace.com',
  '+91', NULL, 'https://scispace.com',
  (SELECT id FROM categories WHERE slug = 'ai-research-assistants' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'IN' LIMIT 1), @fallback_country),
  'Bengaluru', 'Bengaluru, IN',
  'Read, write, and discover research papers — AI copilot for academics',
  'SciSpace (formerly Typeset) is an AI research workspace founded in 2015 in Bengaluru. It pairs an LLM-powered PDF copilot with a 290M-paper search index, a literature-review tool, citation generator, and an LaTeX-compatible writing tool. Used by 1M+ researchers worldwide.',
  'https://www.google.com/s2/favicons?domain=scispace.com&sz=256',
  2015, '51-200',
  'https://www.linkedin.com/company/scispace', 'https://twitter.com/scispace',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 62/94  Andi
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Andi', 'andi', 'Andi Team', 'support@andisearch.com',
  '+1', NULL, 'https://andisearch.com',
  (SELECT id FROM categories WHERE slug = 'ai-answer-engine' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'Miami', 'Miami, US',
  'Ad-free AI search that gives answers, not blue links',
  'Andi is a small, scrappy ad-free AI search engine founded in 2021 by Angela Hoover and Jed White. Andi gives a direct answer to the user''s question with sourced citations, no ads, no SEO spam, and a friendly chat interface. A favourite of privacy-minded and SEO-allergic users.',
  'https://www.google.com/s2/favicons?domain=andisearch.com&sz=256',
  2021, '1-10',
  'https://www.linkedin.com/company/andi-search', 'https://twitter.com/andisearch',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 63/94  ResearchRabbit
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'ResearchRabbit', 'researchrabbit', 'ResearchRabbit Team', 'support@researchrabbitapp.com',
  '+1', NULL, 'https://researchrabbitapp.com',
  (SELECT id FROM categories WHERE slug = 'ai-research-assistants' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'New York', 'New York, US',
  'The Spotify of papers — discover related research visually',
  'ResearchRabbit is a free academic discovery tool launched in 2021 by Michael Liu and Hong Zhu. Users build collections of seed papers and the app surfaces visually-mapped graphs of related work, citing/cited-by papers, and similar authors. Genuinely changes how PhD students do literature reviews.',
  'https://www.google.com/s2/favicons?domain=researchrabbitapp.com&sz=256',
  2021, '1-10',
  'https://www.linkedin.com/company/researchrabbit', 'https://twitter.com/researchrabbit',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 64/94  ChatPDF
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'ChatPDF', 'chatpdf', 'ChatPDF Team', 'support@chatpdf.com',
  '+49', NULL, 'https://chatpdf.com',
  (SELECT id FROM categories WHERE slug = 'ai-research-assistants' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'DE' LIMIT 1), @fallback_country),
  'Berlin', 'Berlin, DE',
  'Chat with any PDF — research papers, contracts, manuals, textbooks',
  'ChatPDF is a viral consumer tool launched in 2023 by Mathis Lichtenberger that lets users upload any PDF and chat with it — Q&A, summaries, page-cited answers. Free for occasional use; paid tier for longer documents and Pro features. Tens of millions of PDFs processed.',
  'https://www.google.com/s2/favicons?domain=chatpdf.com&sz=256',
  2023, '1-10',
  NULL, 'https://twitter.com/chatpdf',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 65/94  Otter.ai
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Otter.ai', 'otter-ai', 'Otter.ai Team', 'support@otter.ai',
  '+1', NULL, 'https://otter.ai',
  (SELECT id FROM categories WHERE slug = 'ai-meeting-assistants' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'Mountain View', 'Mountain View, US',
  'AI meeting notes, transcripts, and action items — live and post-call',
  'Otter.ai is one of the original AI meeting assistants, founded in 2016 in Mountain View. The product transcribes meetings (Zoom/Teams/Meet/in-person), summarises them, captures action items, and is used as a ''second-brain'' by sales teams, journalists, and academics. Tens of millions of meetings transcribed.',
  'https://www.google.com/s2/favicons?domain=otter.ai&sz=256',
  2016, '51-200',
  'https://www.linkedin.com/company/otter-ai', 'https://twitter.com/otter_ai',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 66/94  Fireflies.ai
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Fireflies.ai', 'fireflies-ai', 'Fireflies.ai Team', 'support@fireflies.ai',
  '+1', NULL, 'https://fireflies.ai',
  (SELECT id FROM categories WHERE slug = 'ai-meeting-assistants' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Francisco', 'San Francisco, US',
  'AI notetaker that joins your meetings, records, transcribes, and analyses',
  'Fireflies is an AI meeting assistant founded in 2016 in San Francisco. Its Fred bot joins meetings across Zoom/Teams/Meet/Webex, records and transcribes, generates summaries and action items, and produces conversation analytics — sentiment, talk-listen ratios, topic tracking. Used by 200,000+ companies.',
  'https://www.google.com/s2/favicons?domain=fireflies.ai&sz=256',
  2016, '51-200',
  'https://www.linkedin.com/company/fireflies-ai', 'https://twitter.com/firefliesai',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 67/94  Read AI
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Read AI', 'read-ai', 'Read AI Team', 'support@read.ai',
  '+1', NULL, 'https://read.ai',
  (SELECT id FROM categories WHERE slug = 'ai-meeting-assistants' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'Seattle', 'Seattle, US',
  'AI for meetings, messages, and email — across Zoom, Slack, Outlook, Gmail',
  'Read AI is an AI workplace productivity company founded in 2021 by ex-Foursquare CEO David Shim. The product spans meetings (transcript, summary, sentiment), messaging (Slack/Teams summaries), and inbox (Gmail/Outlook prioritisation) — all unified by a ''Smart Composer'' that drafts replies in the user''s voice.',
  'https://www.google.com/s2/favicons?domain=read.ai&sz=256',
  2021, '51-200',
  'https://www.linkedin.com/company/read-ai', 'https://twitter.com/readai_',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 68/94  Granola
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Granola', 'granola', 'Granola Team', 'support@granola.ai',
  '+44', NULL, 'https://granola.ai',
  (SELECT id FROM categories WHERE slug = 'ai-meeting-assistants' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'GB' LIMIT 1), @fallback_country),
  'London', 'London, GB',
  'The AI notepad for back-to-back meetings — by ex-Riffle, ex-Memrise',
  'Granola is a Mac AI notepad designed for back-to-back meeting days. The user types light notes during a call; Granola records and post-processes a full transcript and structured summary, then re-formats the notes into shareable docs. Founded in 2023 in London by Chris Pedregal (Socratic) and Sam Stephenson. Backed by Lightspeed.',
  'https://www.google.com/s2/favicons?domain=granola.ai&sz=256',
  2023, '11-50',
  'https://www.linkedin.com/company/granola-ai', 'https://twitter.com/meetgranola',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 69/94  Reflect Notes
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Reflect Notes', 'reflect-notes', 'Reflect Notes Team', 'support@reflect.app',
  '+1', NULL, 'https://reflect.app',
  (SELECT id FROM categories WHERE slug = 'ai-collaborative-doc-editor' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'New York', 'New York, US',
  'A note-taking app that thinks for you — AI-powered, end-to-end encrypted',
  'Reflect is a private, AI-powered note-taking app founded in 2021 by Alex MacCaw (ex-Clearbit CEO). Notes are end-to-end encrypted, the AI suggests connections to past notes, drafts summaries, and writes voice-to-text — with a fast desktop and mobile app. A favourite of operators and researchers.',
  'https://www.google.com/s2/favicons?domain=reflect.app&sz=256',
  2021, '1-10',
  'https://www.linkedin.com/company/reflect-app', 'https://twitter.com/reflectnotes',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 70/94  Mem
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Mem', 'mem', 'Mem Team', 'support@mem.ai',
  '+1', NULL, 'https://mem.ai',
  (SELECT id FROM categories WHERE slug = 'ai-collaborative-doc-editor' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Francisco', 'San Francisco, US',
  'The AI workspace that organises itself — surfaces what matters when',
  'Mem (Mem Labs) is an AI-native notes app founded in 2019 by Kevin Moody and Dennis Xu, backed by OpenAI Startup Fund. The product blends Apple-Notes-style fast capture with AI auto-tagging, full-workspace search, summaries, and Mem Spotlight — surfacing relevant notes as the user types in other apps.',
  'https://www.google.com/s2/favicons?domain=mem.ai&sz=256',
  2019, '11-50',
  'https://www.linkedin.com/company/mem-labs', 'https://twitter.com/mem',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 71/94  Tana
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Tana', 'tana', 'Tana Team', 'support@tana.inc',
  '+47', NULL, 'https://tana.inc',
  (SELECT id FROM categories WHERE slug = 'ai-collaborative-doc-editor' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'NO' LIMIT 1), @fallback_country),
  'Oslo', 'Oslo, NO',
  'Outliner + database + AI — power-user note-taking and knowledge work',
  'Tana is a Norwegian outliner-database hybrid for power users, with deep AI features. Co-founded in 2020 by ex-Confrere and ex-Microsoft engineers. Users build ''supertags'' that turn notes into typed objects (meetings, tasks, projects) and use AI commands to summarise, extract, and synthesise. A cult favourite of researchers and operators.',
  'https://www.google.com/s2/favicons?domain=tana.inc&sz=256',
  2020, '11-50',
  'https://www.linkedin.com/company/tana-inc', 'https://twitter.com/tana_inc',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 72/94  Lex
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Lex', 'lex', 'Lex Team', 'support@lex.page',
  '+1', NULL, 'https://lex.page',
  (SELECT id FROM categories WHERE slug = 'ai-collaborative-doc-editor' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'New York', 'New York, US',
  'AI for serious writing — Google Docs meets ChatGPT for long-form',
  'Lex is an AI writing tool for long-form, founded in 2022 by Nathan Baschez (ex-Substack, ex-Every). The product looks like Google Docs but the AI ''continue'' command, citation-finder, and editor-style ''AI feedback'' assistant make it a favourite for journalists, essayists, and writers who care about voice.',
  'https://www.google.com/s2/favicons?domain=lex.page&sz=256',
  2022, '1-10',
  'https://www.linkedin.com/company/everyinc', 'https://twitter.com/lex_page',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 73/94  Lavender
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Lavender', 'lavender', 'Lavender Team', 'support@lavender.ai',
  '+1', NULL, 'https://lavender.ai',
  (SELECT id FROM categories WHERE slug = 'ai-sales-outreach' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'New York', 'New York, US',
  'AI email coach for sellers — write better outbound, faster, with data',
  'Lavender is an AI sales-email coach founded in 2020 in New York by Will Allred. The product scores draft emails as the rep writes, suggests rewrites based on what''s worked in similar contexts, and pulls in personalised insights about the prospect. Used by sales teams at Twilio, Clari, MongoDB, and others.',
  'https://www.google.com/s2/favicons?domain=lavender.ai&sz=256',
  2020, '11-50',
  'https://www.linkedin.com/company/lavender-ai', 'https://twitter.com/getlavender',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 74/94  Apollo.io
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Apollo.io', 'apollo-io', 'Apollo.io Team', 'support@apollo.io',
  '+1', NULL, 'https://apollo.io',
  (SELECT id FROM categories WHERE slug = 'ai-sales-intelligence' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Francisco', 'San Francisco, US',
  'B2B sales intelligence — 275M contacts, AI workflows, full outbound stack',
  'Apollo.io is a B2B sales intelligence and engagement platform founded in 2015 in San Francisco. It pairs a 275M-contact database with AI-driven email sequencing, lead scoring, conversation intelligence, and pipeline management. Apollo serves 1M+ companies and is one of the fastest-growing sales tools in the world.',
  'https://www.google.com/s2/favicons?domain=apollo.io&sz=256',
  2015, '1000+',
  'https://www.linkedin.com/company/apolloio', 'https://twitter.com/MeetApollo',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 75/94  Clay
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Clay', 'clay', 'Clay Team', 'support@clay.com',
  '+1', NULL, 'https://clay.com',
  (SELECT id FROM categories WHERE slug = 'ai-sales-intelligence' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'New York', 'New York, US',
  'GTM data + AI workflows — enrich, prospect, and personalise outbound at scale',
  'Clay is a GTM data platform founded in 2017 in New York. Users build spreadsheet-style workflows that combine 100+ data providers, web scraping, and LLM steps to enrich, qualify, and personalise outbound. Clay''s 2024 momentum made it a category-defining tool for modern outbound sales and recruiting teams.',
  'https://www.google.com/s2/favicons?domain=clay.com&sz=256',
  2017, '201-500',
  'https://www.linkedin.com/company/clay-run', 'https://twitter.com/claydotrun',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 76/94  Salesforce Einstein
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Salesforce Einstein', 'salesforce-einstein', 'Salesforce Einstein Team', 'support@salesforce.com',
  '+1', NULL, 'https://salesforce.com',
  (SELECT id FROM categories WHERE slug = 'ai-crm-tools' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Francisco', 'San Francisco, US',
  'Salesforce''s AI layer across Sales, Service, Marketing, and Commerce Cloud',
  'Einstein is Salesforce''s AI layer, launched in 2016 and significantly expanded in 2024 with the Einstein 1 platform and Agentforce. Einstein provides predictive scoring, conversational AI, generative content, and autonomous agents inside every Salesforce cloud — Sales, Service, Marketing, Commerce, and Data Cloud.',
  'https://www.google.com/s2/favicons?domain=salesforce.com&sz=256',
  1999, '1000+',
  'https://www.linkedin.com/company/salesforce', 'https://twitter.com/salesforce',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 77/94  HubSpot Breeze
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'HubSpot Breeze', 'hubspot-breeze', 'HubSpot Breeze Team', 'support@hubspot.com',
  '+1', NULL, 'https://hubspot.com',
  (SELECT id FROM categories WHERE slug = 'ai-crm-tools' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'Cambridge', 'Cambridge, US',
  'The AI built into HubSpot — Copilot, Agents, and Breeze Intelligence',
  'Breeze is HubSpot''s AI layer for its Smart CRM, launched in 2024. Breeze includes Copilot (AI assistant across the platform), Breeze Agents (autonomous agents for content, social, prospecting, and customer service), and Breeze Intelligence (250M+ B2B records enriching HubSpot CRM data).',
  'https://www.google.com/s2/favicons?domain=hubspot.com&sz=256',
  2006, '1000+',
  'https://www.linkedin.com/company/hubspot', 'https://twitter.com/HubSpot',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 78/94  Gong
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Gong', 'gong', 'Gong Team', 'support@gong.io',
  '+1', NULL, 'https://gong.io',
  (SELECT id FROM categories WHERE slug = 'ai-sales-intelligence' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Francisco', 'San Francisco, US',
  'Revenue intelligence — every call, email, and meeting analysed by AI',
  'Gong is the leading revenue intelligence platform, founded in 2015 by Amit Bendov and Eilon Reshef. Gong records and analyses every customer interaction with AI — coaching reps, flagging deal risk, and surfacing buyer signals. Used by 4,000+ companies including LinkedIn, Snowflake, and Twilio. Last valued at over $7B.',
  'https://www.google.com/s2/favicons?domain=gong.io&sz=256',
  2015, '1000+',
  'https://www.linkedin.com/company/gong-io', 'https://twitter.com/Gong_io',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 79/94  Drift (Salesloft)
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Drift (Salesloft)', 'drift-salesloft', 'Drift Team', 'support@drift.com',
  '+1', NULL, 'https://drift.com',
  (SELECT id FROM categories WHERE slug = 'ai-chat-assistant' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'Boston', 'Boston, US',
  'Conversational marketing and AI chat for B2B websites',
  'Drift is a conversational marketing and B2B chat platform founded in 2015 by David Cancel and Elias Torres. Drift''s AI chatbots qualify visitors, book meetings on the sales team''s calendar, and surface high-intent buyers. Acquired by Salesloft in 2024 and integrated into its revenue orchestration platform.',
  'https://www.google.com/s2/favicons?domain=drift.com&sz=256',
  2015, '201-500',
  'https://www.linkedin.com/company/drift', 'https://twitter.com/Drift',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 80/94  Outreach
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Outreach', 'outreach', 'Outreach Team', 'support@outreach.io',
  '+1', NULL, 'https://outreach.io',
  (SELECT id FROM categories WHERE slug = 'ai-sales-outreach' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'Seattle', 'Seattle, US',
  'Sales execution platform — sequencing, AI assistant, deal forecasting',
  'Outreach is one of the original sales engagement platforms, founded in 2014 in Seattle. The product unifies multi-channel sequences, AI-drafted emails, conversation intelligence, and deal/pipeline forecasting in one place. Used by 6,000+ companies including Adobe, Cisco, and Okta.',
  'https://www.google.com/s2/favicons?domain=outreach.io&sz=256',
  2014, '1000+',
  'https://www.linkedin.com/company/outreachio', 'https://twitter.com/outreach_io',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 81/94  Intercom Fin
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Intercom Fin', 'intercom-fin', 'Intercom Fin Team', 'support@intercom.com',
  '+1', NULL, 'https://intercom.com',
  (SELECT id FROM categories WHERE slug = 'ai-chat-assistant' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Francisco', 'San Francisco, US',
  'Fin — the AI agent that resolves 50%+ of customer questions automatically',
  'Intercom is a customer support platform founded in 2011 in Dublin and San Francisco. In 2023 it launched Fin, an AI customer service agent built on GPT-4 (and later Claude). Fin resolves a majority of support questions autonomously, with guardrails, and is deployed at companies like Anthropic, Lightspeed, and Monzo.',
  'https://www.google.com/s2/favicons?domain=intercom.com&sz=256',
  2011, '1000+',
  'https://www.linkedin.com/company/intercom', 'https://twitter.com/intercom',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 82/94  Ada
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Ada', 'ada', 'Ada Team', 'support@ada.cx',
  '+1', NULL, 'https://ada.cx',
  (SELECT id FROM categories WHERE slug = 'ai-chat-assistant' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'CA' LIMIT 1), @fallback_country),
  'Toronto', 'Toronto, CA',
  'AI customer service automation — resolving complex inquiries with confidence',
  'Ada is a Canadian AI customer-service company founded in 2016 in Toronto. The Ada platform deploys an AI agent across chat, voice, and email channels, with brand controls, action-taking (refunds, account updates), and an analytics layer. Customers include Verizon, Square, Indigo, and AirAsia.',
  'https://www.google.com/s2/favicons?domain=ada.cx&sz=256',
  2016, '201-500',
  'https://www.linkedin.com/company/ada-support', 'https://twitter.com/ada_cx',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 83/94  Forethought
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Forethought', 'forethought', 'Forethought Team', 'support@forethought.ai',
  '+1', NULL, 'https://forethought.ai',
  (SELECT id FROM categories WHERE slug = 'ai-chat-assistant' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Francisco', 'San Francisco, US',
  'Generative AI for customer support — Solve, Triage, Discover',
  'Forethought is a US generative-AI customer-support platform founded in 2017 by Deon Nicholas. Its Solve agent deflects tickets across email and chat, Triage routes incoming requests, and Discover analyses tickets to surface workflow improvements. Used by Upwork, Carta, and ASOS.',
  'https://www.google.com/s2/favicons?domain=forethought.ai&sz=256',
  2017, '51-200',
  'https://www.linkedin.com/company/forethought-ai', 'https://twitter.com/forethought_ai',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 84/94  Tidio Lyro
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Tidio Lyro', 'tidio-lyro', 'Tidio Lyro Team', 'support@tidio.com',
  '+48', NULL, 'https://tidio.com',
  (SELECT id FROM categories WHERE slug = 'ai-chat-assistant' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'PL' LIMIT 1), @fallback_country),
  'Szczecin', 'Szczecin, PL',
  'AI live chat for SMBs — Lyro automates customer questions in minutes',
  'Tidio is a Polish live chat + chatbot platform founded in 2013, focused on SMBs and e-commerce stores. Tidio Lyro is its AI agent, trained on the merchant''s knowledge base, that handles routine questions across email, chat, and Messenger out of the box. Used by 300,000+ businesses worldwide.',
  'https://www.google.com/s2/favicons?domain=tidio.com&sz=256',
  2013, '201-500',
  'https://www.linkedin.com/company/tidio', 'https://twitter.com/tidiolive',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 85/94  Photoroom
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Photoroom', 'photoroom', 'Photoroom Team', 'support@photoroom.com',
  '+33', NULL, 'https://photoroom.com',
  (SELECT id FROM categories WHERE slug = 'ai-background-remover' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'FR' LIMIT 1), @fallback_country),
  'Paris', 'Paris, FR',
  'AI photo editor — backgrounds, retouching, batch shoots, brand kits',
  'Photoroom is a French AI photo editor founded in 2019 by Matthieu Rouif and Eliot Andres. Originally a background remover, it now covers retouching, batch editing, generative backgrounds, AI shoots, and brand-kit asset production — used by 25M+ creators and small e-commerce stores. Most-downloaded photo editor on iOS in many markets.',
  'https://www.google.com/s2/favicons?domain=photoroom.com&sz=256',
  2019, '51-200',
  'https://www.linkedin.com/company/photoroom', 'https://twitter.com/Photoroom_app',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 86/94  Topaz Labs
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Topaz Labs', 'topaz-labs', 'Topaz Labs Team', 'support@topazlabs.com',
  '+1', NULL, 'https://topazlabs.com',
  (SELECT id FROM categories WHERE slug = 'ai-image-upscalers' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'Dallas', 'Dallas, US',
  'AI photo and video enhancement — upscale, denoise, sharpen at studio quality',
  'Topaz Labs is a Dallas-based AI image and video enhancement company founded in 2005. Its Photo AI, Gigapixel AI, Sharpen AI, and Video AI products are the industry default for upscaling, denoising, deinterlacing, and motion enhancement — used by professional photographers, archivists, and Hollywood VFX teams.',
  'https://www.google.com/s2/favicons?domain=topazlabs.com&sz=256',
  2005, '51-200',
  'https://www.linkedin.com/company/topaz-labs', 'https://twitter.com/topazlabs',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 87/94  remove.bg (Kaleido AI)
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'remove.bg (Kaleido AI)', 'remove-bg-kaleido-ai', 'remove.bg Team', 'support@remove.bg',
  '+43', NULL, 'https://remove.bg',
  (SELECT id FROM categories WHERE slug = 'ai-background-remover' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'AT' LIMIT 1), @fallback_country),
  'Vienna', 'Vienna, AT',
  'One-click background removal — the original AI cutout service',
  'remove.bg, launched in 2018 by Kaleido AI in Vienna, popularised one-click AI background removal. The free web tool processes images in seconds with a paid API for high volume. Acquired by Canva in 2021 and now embedded across the Canva creative suite.',
  'https://www.google.com/s2/favicons?domain=remove.bg&sz=256',
  2018, '51-200',
  'https://www.linkedin.com/company/remove-bg', 'https://twitter.com/remove_bg',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 88/94  Picsart
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Picsart', 'picsart', 'Picsart Team', 'support@picsart.com',
  '+1', NULL, 'https://picsart.com',
  (SELECT id FROM categories WHERE slug = 'ai-photo-editors' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'San Francisco', 'San Francisco, US',
  'AI photo and video editor for creators — replace, restyle, expand, and design',
  'Picsart is a consumer creative app founded in 2011 in Yerevan and now headquartered in San Francisco. With over 150M monthly active users, Picsart has built deep AI features — AI replace, expand, restyle, sketch-to-image, AI avatars, AI photo, and an AI design studio — across mobile and web.',
  'https://www.google.com/s2/favicons?domain=picsart.com&sz=256',
  2011, '1000+',
  'https://www.linkedin.com/company/picsart', 'https://twitter.com/picsart',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 89/94  Cleanup.pictures
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Cleanup.pictures', 'cleanup-pictures', 'Cleanup.pictures Team', 'support@cleanup.pictures',
  '+33', NULL, 'https://cleanup.pictures',
  (SELECT id FROM categories WHERE slug = 'ai-photo-editors' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'FR' LIMIT 1), @fallback_country),
  'Paris', 'Paris, FR',
  'Erase anything from a photo — free, no login, in seconds',
  'Cleanup.pictures, made by ClipDrop (acquired by Stability AI), is a free web app that uses inpainting to erase unwanted objects, people, watermarks, or backgrounds from any photo in seconds. Beloved by realtors, e-commerce sellers, and casual users for its simplicity and zero-login experience.',
  'https://www.google.com/s2/favicons?domain=cleanup.pictures&sz=256',
  2019, '11-50',
  'https://www.linkedin.com/company/clipdrop', 'https://twitter.com/cleanup_pic',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 90/94  Lensa AI
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Lensa AI', 'lensa-ai', 'Lensa AI Team', 'support@prisma-ai.com',
  '+1', NULL, 'https://prisma-ai.com',
  (SELECT id FROM categories WHERE slug = 'portraits' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'Sunnyvale', 'Sunnyvale, US',
  'AI photo editing and the viral ''Magic Avatars'' from Prisma Labs',
  'Lensa AI is the consumer photo editor from Prisma Labs, founded in 2016 in Sunnyvale. Lensa added the viral ''Magic Avatars'' feature in late 2022 — AI-generated artistic portraits from a few selfies — driving over 100M downloads. The app also handles retouching, background blur, and AI photo styles.',
  'https://www.google.com/s2/favicons?domain=prisma-ai.com&sz=256',
  2016, '51-200',
  'https://www.linkedin.com/company/prisma-labs-inc', 'https://twitter.com/lensa_ai',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 91/94  AIVA
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'AIVA', 'aiva', 'AIVA Team', 'support@aiva.ai',
  '+352', NULL, 'https://aiva.ai',
  (SELECT id FROM categories WHERE slug = 'ai-song-generator' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'LU' LIMIT 1), @fallback_country),
  'Luxembourg City', 'Luxembourg City, LU',
  'AI-composed soundtracks for games, film, and content — by the original AI composer',
  'AIVA (Artificial Intelligence Virtual Artist) is a Luxembourg-based AI music composition company founded in 2016. AIVA composes original soundtracks across film, gaming, and content genres, and was the first AI to be officially recognised as a composer by SACEM. Used by indie game studios and YouTube creators.',
  'https://www.google.com/s2/favicons?domain=aiva.ai&sz=256',
  2016, '11-50',
  'https://www.linkedin.com/company/aiva', 'https://twitter.com/aivatech',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 92/94  Soundraw
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Soundraw', 'soundraw', 'Soundraw Team', 'support@soundraw.io',
  '+81', NULL, 'https://soundraw.io',
  (SELECT id FROM categories WHERE slug = 'ai-song-generator' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'JP' LIMIT 1), @fallback_country),
  'Tokyo', 'Tokyo, JP',
  'Royalty-free AI music for videos — generate, customise, and own the rights',
  'Soundraw is a Tokyo-based AI music generator founded in 2020. Users pick mood, genre, and length, and Soundraw composes a customisable track — every section''s energy, instrument mix, and tempo can be edited. All tracks are licensed for commercial use, making it popular with YouTubers, marketing teams, and podcasters.',
  'https://www.google.com/s2/favicons?domain=soundraw.io&sz=256',
  2020, '11-50',
  'https://www.linkedin.com/company/soundraw', 'https://twitter.com/soundraw_io',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 93/94  Boomy
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Boomy', 'boomy', 'Boomy Team', 'support@boomy.com',
  '+1', NULL, 'https://boomy.com',
  (SELECT id FROM categories WHERE slug = 'ai-song-generator' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'US' LIMIT 1), @fallback_country),
  'Berkeley', 'Berkeley, US',
  'Make and release AI-generated songs to Spotify, Apple Music, TikTok',
  'Boomy is a US AI music app founded in 2018 that lets anyone — musician or not — create original songs in seconds and release them to Spotify, Apple Music, and TikTok. Users have created over 20M songs to date. Boomy''s distribution layer pays a share of streaming royalties back to creators.',
  'https://www.google.com/s2/favicons?domain=boomy.com&sz=256',
  2018, '11-50',
  'https://www.linkedin.com/company/boomy', 'https://twitter.com/boomy',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- 94/94  Mubert
INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, hq_location,
  tagline, description, logo_url,
  founded_year, team_size,
  linkedin, twitter,
  listing_mode, status, payment_status, plan_id,
  activated_at, approved_at, created_at, updated_at
)
SELECT
  UUID(), 'Mubert', 'mubert', 'Mubert Team', 'support@mubert.com',
  '+44', NULL, 'https://mubert.com',
  (SELECT id FROM categories WHERE slug = 'ai-song-generator' LIMIT 1),
  COALESCE((SELECT id FROM countries WHERE code = 'GB' LIMIT 1), @fallback_country),
  'London', 'London, GB',
  'AI-generated royalty-free music — for content, livestreams, and apps',
  'Mubert is a real-time AI music generation service founded in 2016. Users can generate royalty-free background music from prompts (mood, genre, duration), license tracks for content and apps, or stream endless AI-composed music. Used by 100,000+ creators and integrated into apps like Notion and Yandex.',
  'https://www.google.com/s2/favicons?domain=mubert.com&sz=256',
  2016, '11-50',
  'https://www.linkedin.com/company/mubert', 'https://twitter.com/mubertapp',
  'product', 'active', 'completed', @free_plan,
  NOW(), NOW(), NOW(), NOW();

-- ============================================================
-- 94 listings inserted.
-- Next step: run scripts/capture-screenshots.mjs to populate
-- the screenshots column for each new listing.
-- ============================================================