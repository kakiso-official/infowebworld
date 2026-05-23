"""
Enrich the 94 new AI/ML seeded listings with the rich JSON fields the
listing page renders ("Who uses X", Key Features, All Features, Pricing,
Integrations, Customer Support, FAQs, Pros & Cons, header tags, app
flags, starting price).

Generates database/enrich-aiml-listings.sql — one UPDATE per listing
keyed by slug. Safe to re-run; only overwrites the targeted columns.

Structure:
  CATEGORY_DEFAULTS  — per-category defaults for industries, use cases,
                       company sizes, support channels, training options,
                       generic FAQs, and pros/cons templates.
  LISTINGS           — per-slug specifics: category key + header_tags +
                       key_features + pricing tiers + integrations +
                       starting_price + free-trial / free-version /
                       mobile-app booleans + extra FAQs.

Each row in LISTINGS is intentionally tight: tuples where possible,
arrays of plain strings where the data is one-dimensional. The generator
merges the per-category defaults + per-listing specifics and emits SQL.

Run:  python scripts/enrich-aiml-listings.py
"""
import json
import sys
import io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

ROOT = Path(__file__).resolve().parents[1]
SQL_OUT = ROOT / "database" / "enrich-aiml-listings.sql"


def sq(s):
    return "'" + (s or "").replace("\\", "\\\\").replace("'", "''") + "'"


def js_str(s):
    """JSON_OBJECT/JSON_ARRAY-safe string literal."""
    return sq(s)


def js_arr(items):
    """JSON_ARRAY of plain string items."""
    if not items:
        return "JSON_ARRAY()"
    inside = ", ".join(js_str(i) for i in items)
    return f"JSON_ARRAY({inside})"


def js_obj_pairs(*pairs):
    """JSON_OBJECT('k1', v1, 'k2', v2, ...). Values must already be SQL literals."""
    args = []
    for k, v in pairs:
        args.append(sq(k))
        args.append(v)
    return f"JSON_OBJECT({', '.join(args)})"


def js_tiers(tiers):
    """tiers = [(name, price_int_or_None, period, [features_list]), ...]"""
    parts = []
    for t in tiers:
        name, price, period, feats = t
        price_sql = "NULL" if price is None else str(price)
        parts.append(js_obj_pairs(
            ("name", sq(name)),
            ("price", price_sql),
            ("period", sq(period)),
            ("features", js_arr(feats)),
        ))
    if not parts:
        return "JSON_ARRAY()"
    return f"JSON_ARRAY(\n        {','.join(chr(10) + '        ' + p for p in parts)}\n      )"


def js_ints(items):
    """items = [(name, website, description), ...]"""
    parts = []
    for i in items:
        name, web, desc = i
        parts.append(js_obj_pairs(
            ("name", sq(name)),
            ("website", sq(web)),
            ("description", sq(desc)),
        ))
    if not parts:
        return "JSON_ARRAY()"
    return f"JSON_ARRAY(\n        {','.join(chr(10) + '        ' + p for p in parts)}\n      )"


def js_faqs(faqs):
    """faqs = [(question, answer), ...]"""
    parts = []
    for q, a in faqs:
        parts.append(js_obj_pairs(("question", sq(q)), ("answer", sq(a))))
    if not parts:
        return "JSON_ARRAY()"
    return f"JSON_ARRAY(\n        {','.join(chr(10) + '        ' + p for p in parts)}\n      )"


# ─── Category defaults ────────────────────────────────────────────────────────
# Each category dict carries reusable data shared by every listing in that
# category. Per-listing overrides fill in the rest.
CATEGORY_DEFAULTS = {
    'image-gen': {
        'industries': ['Marketing & Advertising', 'Design Agencies', 'Film & Production', 'Game Development', 'Publishing & Editorial', 'Creator Economy', 'E-commerce', 'Education'],
        'use_cases': ['Concept art', 'Marketing visuals', 'Mood boards', 'Editorial illustration', 'Character design', 'Style exploration', 'Storyboarding', 'Product mockups'],
        'company_sizes': ['Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'],
        'support_channels': ['Email support', 'Help center', 'Community forum', 'Discord community'],
        'training_options': ['Documentation', 'Video tutorials', 'Community examples', 'Prompt library'],
        'languages': ['English'],
        'compliance': [],
        'pros_extra': ['Frequent model updates', 'Active creator community', 'Browser-based — no install needed'],
        'cons_extra': ['Subscription required for serious use', 'Some content limits / safety filters'],
        'faqs_generic': lambda name: [
            (f'Can I use {name} images commercially?', f'Yes — paid plans on {name} grant commercial usage rights. Verify the latest license terms before enterprise use.'),
            (f'Does {name} support image-to-image?', f'Most modern {name} workflows support image-to-image, style references, and prompt-based remixing.'),
            ('What aspect ratios are supported?', 'Standard square, portrait, landscape, and cinematic widescreen ratios; high-res upscale options on most plans.'),
            ('Is there an API?', 'Yes — programmatic access is available on developer plans for batch generation and integrations.'),
        ],
    },
    'video-gen': {
        'industries': ['Marketing & Advertising', 'Film & Production', 'Education', 'Corporate Training', 'Creator Economy', 'Gaming', 'Real Estate'],
        'use_cases': ['Marketing reels', 'Storyboard previs', 'Product demos', 'Training videos', 'Social content', 'Concept films', 'Music videos'],
        'company_sizes': ['Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'],
        'support_channels': ['Email support', 'Help center', 'Live chat', 'Knowledge base'],
        'training_options': ['Tutorials', 'Documentation', 'Sample prompts', 'Workshops'],
        'languages': ['English'],
        'compliance': [],
        'pros_extra': ['Saves studio time and cost', 'Fast iteration on edits', 'No camera or crew required'],
        'cons_extra': ['Clip length limits', 'Compute-time / queue waits on high-tier requests'],
        'faqs_generic': lambda name: [
            (f'How long can {name} clips be?', f'Per-clip length varies by plan — typically 5-10 seconds per generation, with extend / continuation features on higher tiers.'),
            ('Can I upload a reference image?', 'Yes — image-to-video is a standard input alongside text prompts.'),
            ('Are generated videos royalty-free for commercial use?', 'Paid plans grant commercial-use rights. Check the latest terms for distribution and exclusivity.'),
            ('Is there an API?', 'Yes — most modern video generators expose an API for batch jobs and product integrations.'),
        ],
    },
    'voice-audio': {
        'industries': ['Publishing & Audiobooks', 'E-learning', 'Gaming', 'Film & Production', 'Podcasting', 'Customer Support', 'Marketing & Advertising'],
        'use_cases': ['Voiceover production', 'Audiobook narration', 'Dubbing & localisation', 'IVR & voice agents', 'Podcast intros', 'Game character voices'],
        'company_sizes': ['Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'],
        'support_channels': ['Email support', 'Live chat', 'Help center', 'Developer forum'],
        'training_options': ['Documentation', 'Voice library', 'API guide', 'Tutorials'],
        'languages': ['English', '20+ languages on most tiers'],
        'compliance': ['SOC 2'],
        'pros_extra': ['Studio-quality output', 'Pay-as-you-go usage', 'Voice cloning available'],
        'cons_extra': ['Per-character usage costs add up at scale', 'Voice consent + ethical use policies required'],
        'faqs_generic': lambda name: [
            (f'Does {name} support voice cloning?', f'{name} offers voice cloning on Professional and Enterprise plans, with consent verification required.'),
            ('How many languages are supported?', 'Most modern AI voice tools support 20-30+ languages, with growing coverage for regional dialects.'),
            ('Is the output royalty-free?', 'Paid plans grant commercial usage rights for the generated audio.'),
            ('Is there an API?', 'Yes — both streaming and batch APIs are available for developers on paid plans.'),
        ],
    },
    'code-dev': {
        'industries': ['Software Development', 'Startups', 'Enterprise IT', 'Education', 'Consulting Firms'],
        'use_cases': ['Autocomplete & code review', 'Refactoring legacy code', 'Generating tests', 'Boilerplate elimination', 'Learning new languages', 'Documentation drafting'],
        'company_sizes': ['Individual developers', 'Small teams', 'Midsize engineering orgs', 'Enterprises'],
        'support_channels': ['Email support', 'Slack / Discord community', 'GitHub issues', 'Help center'],
        'training_options': ['Documentation', 'In-editor onboarding', 'Video tutorials', 'Community recipes'],
        'languages': ['Most major programming languages', 'Multi-IDE support'],
        'compliance': ['SOC 2'],
        'pros_extra': ['Real productivity gains for repetitive code', 'Works in your existing IDE', 'Improving rapidly with new models'],
        'cons_extra': ['Generated code still needs review', 'Privacy / IP considerations on enterprise codebases'],
        'faqs_generic': lambda name: [
            (f'Which languages does {name} support?', f'{name} supports the major programming languages — JavaScript/TypeScript, Python, Go, Rust, Java, C#, C++ — plus most popular frameworks.'),
            ('Can I use it on private code?', 'Yes — enterprise tiers offer zero-retention guarantees, on-prem deployment, and SSO.'),
            ('Does it work offline?', 'Most options require an internet connection; some local-model options exist for air-gapped teams.'),
            ('Does it train on my code?', 'On business / enterprise tiers, your code is never used for training without explicit opt-in.'),
        ],
    },
    'llm-chat': {
        'industries': ['Software Development', 'Education', 'Marketing & Media', 'Customer Support', 'Financial Services', 'Healthcare', 'Legal', 'Consulting'],
        'use_cases': ['Research & summarisation', 'Drafting & writing', 'Code generation', 'Brainstorming', 'Customer-facing chat', 'Internal Q&A', 'Translation'],
        'company_sizes': ['Individual users', 'Small businesses', 'Midsize companies', 'Enterprises'],
        'support_channels': ['Email support', 'Help center', 'Developer docs', 'Community forum'],
        'training_options': ['Documentation', 'API quickstarts', 'Prompt library', 'Cookbook examples'],
        'languages': ['English', '20+ supported languages'],
        'compliance': ['SOC 2', 'GDPR'],
        'pros_extra': ['Frontier model performance', 'Fast iteration on new capabilities', 'Strong developer ecosystem'],
        'cons_extra': ['Hallucination risk on factual queries', 'Cost scales with usage on API'],
        'faqs_generic': lambda name: [
            (f'Does {name} train on my data?', f'Business and Enterprise tiers of {name} typically guarantee no training on user data; verify the latest data-use policy.'),
            (f'Does {name} have an API?', f'Yes — {name} exposes a developer API for programmatic access on most plans.'),
            ('Which context window is supported?', 'Modern frontier models support 128K-1M token contexts depending on the tier.'),
            ('Is there a free tier?', 'Most major chat assistants offer a free tier with daily usage limits.'),
        ],
    },
    'agents': {
        'industries': ['Sales', 'Operations', 'Customer Support', 'Research', 'Engineering', 'Marketing', 'Recruiting'],
        'use_cases': ['Multi-step task automation', 'Browser-based actions', 'Sales outreach', 'Lead research', 'Internal workflows', 'Data extraction', 'Booking & scheduling'],
        'company_sizes': ['Solo operators', 'Small teams', 'Midsize companies', 'Enterprises'],
        'support_channels': ['Email support', 'Slack / Discord community', 'Help center', 'Onboarding calls'],
        'training_options': ['Templates library', 'Documentation', 'Webinars', 'Community recipes'],
        'languages': ['English'],
        'compliance': ['SOC 2'],
        'pros_extra': ['Hands-off task completion', 'Composable across tools', 'No-code or low-code setup'],
        'cons_extra': ['Reliability still maturing for complex flows', 'Human review recommended for high-stakes tasks'],
        'faqs_generic': lambda name: [
            (f'Can {name} use my existing tools?', f'Yes — {name} agents connect to common SaaS apps (Gmail, Slack, Notion, HubSpot, CRMs) via native integrations or APIs.'),
            ('How do I review what the agent did?', 'All agents log every step, tool call, and output for transparent review.'),
            ('Is human approval required?', 'Most platforms support optional human-in-the-loop approval gates for high-impact actions.'),
            ('How is data handled?', 'Enterprise tiers offer SSO, audit logs, and data-residency guarantees.'),
        ],
    },
    'writing': {
        'industries': ['Marketing & Advertising', 'E-commerce', 'Publishing', 'Education', 'Agencies', 'Solo Creators'],
        'use_cases': ['Blog posts & articles', 'Email & social copy', 'Product descriptions', 'Ad copy', 'SEO content', 'Brainstorming', 'First-draft outlines'],
        'company_sizes': ['Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'],
        'support_channels': ['Email support', 'Live chat', 'Help center', 'Community forum'],
        'training_options': ['Tutorials', 'Templates', 'Prompt library', 'Documentation'],
        'languages': ['English', '20+ languages on most tiers'],
        'compliance': ['SOC 2'],
        'pros_extra': ['Beats blank-page paralysis', 'Brand-voice consistency at scale', 'Strong template libraries'],
        'cons_extra': ['Output needs editorial review', 'Best for first drafts — not final copy'],
        'faqs_generic': lambda name: [
            (f'Can {name} match my brand voice?', f'Yes — {name} supports brand-voice training where you upload examples and the tool generates copy in your tone.'),
            ('Is the output plagiarism-free?', 'Modern AI writing tools produce original output; running through a plagiarism checker is still recommended for SEO content.'),
            ('Are there templates?', 'Yes — every major AI writing tool ships with 40-90+ templates across blog, ads, email, social, product copy.'),
            ('Will it rank in search?', 'Output quality affects ranking — use AI for drafting, then refine for accuracy, EEAT, and search intent.'),
        ],
    },
    'research-search': {
        'industries': ['Academia', 'Healthcare', 'Legal', 'Consulting', 'Journalism', 'Policy', 'Pharma & Biotech'],
        'use_cases': ['Literature reviews', 'Systematic reviews', 'Quick fact-checking', 'Citation discovery', 'Topic exploration', 'Researcher Q&A'],
        'company_sizes': ['Individual researchers', 'Academic departments', 'Research firms', 'Enterprises'],
        'support_channels': ['Email support', 'Help center', 'Documentation', 'Researcher community'],
        'training_options': ['Tutorials', 'Webinars', 'Documentation', 'Academic guides'],
        'languages': ['English'],
        'compliance': ['GDPR'],
        'pros_extra': ['Sources every answer', 'Cuts literature review from days to minutes', 'Trusted by academics'],
        'cons_extra': ['Coverage limited to indexed papers', 'Subscriptions can be steep for individuals'],
        'faqs_generic': lambda name: [
            (f'How many papers does {name} cover?', f'{name} indexes the major open-access and licensed academic corpora — typically 100M-300M papers across STEM, social sciences, and humanities.'),
            ('Are sources cited?', 'Yes — every answer ties back to specific papers with DOI, journal, and quote-level citation.'),
            ('Can I export citations?', 'Yes — BibTeX, RIS, and direct-to-Zotero/Mendeley exports are standard.'),
            ('Is there a student discount?', 'Most platforms offer free or discounted tiers for verified students and researchers.'),
        ],
    },
    'productivity-meetings': {
        'industries': ['Tech', 'Sales', 'Consulting', 'Customer Success', 'Recruiting', 'Education', 'Media'],
        'use_cases': ['Meeting notes & summaries', 'Action item tracking', 'Transcripts', 'Coaching reviews', 'Searchable archive', 'Smart replies'],
        'company_sizes': ['Solo professionals', 'Small teams', 'Midsize companies', 'Enterprises'],
        'support_channels': ['Email support', 'Live chat', 'Help center', 'Onboarding calls'],
        'training_options': ['Documentation', 'Video tutorials', 'Templates', 'Best-practice guides'],
        'languages': ['English', '30+ supported languages'],
        'compliance': ['SOC 2', 'GDPR', 'HIPAA available'],
        'pros_extra': ['Hands-free meeting capture', 'Searchable institutional memory', 'Cuts post-meeting admin'],
        'cons_extra': ['Privacy / consent considerations', 'Accuracy varies on accented speech'],
        'faqs_generic': lambda name: [
            (f'Which call platforms does {name} support?', f'{name} integrates with Zoom, Microsoft Teams, Google Meet, and Webex out of the box.'),
            ('Do attendees know it is recording?', 'A meeting-bot joins visibly; most platforms also support consent prompts and recording disclosures.'),
            ('Are transcripts editable?', 'Yes — transcripts are fully editable, exportable, and shareable.'),
            ('Is HIPAA-compliant deployment available?', 'Enterprise plans on most major tools offer HIPAA, SOC 2, and on-prem options.'),
        ],
    },
    'sales-marketing': {
        'industries': ['B2B SaaS', 'Tech', 'Professional Services', 'Manufacturing', 'Financial Services', 'Agencies'],
        'use_cases': ['Outbound sequencing', 'Lead enrichment & scoring', 'Personalised outreach', 'Conversation intelligence', 'Pipeline forecasting', 'Account research'],
        'company_sizes': ['SDR teams', 'Small businesses', 'Midsize companies', 'Enterprises'],
        'support_channels': ['Email support', 'Live chat', 'Customer success manager', 'Help center'],
        'training_options': ['Onboarding sessions', 'Documentation', 'Sales academy', 'Templates'],
        'languages': ['English', 'Multilingual outbound on enterprise tiers'],
        'compliance': ['SOC 2', 'GDPR'],
        'pros_extra': ['Multiplies SDR output', 'Cuts manual research time', 'Coaching insights from real calls'],
        'cons_extra': ['Deliverability depends on sender hygiene', 'Most powerful features gated on enterprise tier'],
        'faqs_generic': lambda name: [
            (f'Does {name} integrate with Salesforce?', f'Yes — {name} offers two-way Salesforce sync on Professional and Enterprise plans.'),
            ('Will it work with HubSpot?', 'Yes — HubSpot CRM integration is standard across all major AI sales tools.'),
            ('Is the email AI deliverability-aware?', 'Yes — modern AI sales tools include warm-up, sending limits, and reputation monitoring.'),
            ('Are there contracts?', 'Pricing typically scales by seat with annual commitment options.'),
        ],
    },
    'customer-support': {
        'industries': ['SaaS', 'E-commerce', 'Financial Services', 'Telecom', 'Travel & Hospitality', 'Healthcare'],
        'use_cases': ['Ticket deflection', 'Conversational FAQ', 'Email triage', 'Voice-bot phone support', 'Internal agent assist', 'Self-serve knowledge base'],
        'company_sizes': ['Small businesses', 'Midsize companies', 'Large enterprises'],
        'support_channels': ['Email support', 'Live chat', 'Phone support', 'Customer success manager', 'Help center'],
        'training_options': ['Onboarding', 'Documentation', 'Best-practice library', 'Video tutorials'],
        'languages': ['English', '30+ supported languages'],
        'compliance': ['SOC 2', 'GDPR', 'HIPAA available', 'PCI'],
        'pros_extra': ['Resolves common tickets instantly', 'Frees agents for complex cases', '24/7 coverage'],
        'cons_extra': ['Quality depends on knowledge base hygiene', 'Edge cases still need human review'],
        'faqs_generic': lambda name: [
            (f'How is {name} trained on my content?', f'{name} ingests your help docs, product pages, and past tickets — no model fine-tuning required.'),
            ('What is the deflection rate?', 'Well-tuned AI support agents typically resolve 40-70% of incoming tickets with no human handoff.'),
            ('Can it take actions?', 'Yes — modern AI agents trigger refunds, account updates, status checks via API.'),
            ('Does it support voice?', 'Several platforms now offer voice/IVR AI in addition to chat and email channels.'),
        ],
    },
    'image-edit': {
        'industries': ['E-commerce', 'Marketing & Advertising', 'Real Estate', 'Photography Studios', 'Publishing', 'Creator Economy'],
        'use_cases': ['Background removal', 'Object removal / cleanup', 'Upscaling / restoration', 'Batch product photo edits', 'Retouching', 'Generative fill'],
        'company_sizes': ['Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'],
        'support_channels': ['Email support', 'Help center', 'Live chat', 'Community forum'],
        'training_options': ['Tutorials', 'Documentation', 'Sample workflows', 'In-app onboarding'],
        'languages': ['English'],
        'compliance': [],
        'pros_extra': ['Saves hours of manual Photoshop work', 'Batch-friendly for e-commerce', 'No design skill required'],
        'cons_extra': ['Complex edits still need a designer', 'Output quality varies by source image'],
        'faqs_generic': lambda name: [
            (f'Does {name} have a batch mode?', f'Yes — {name} supports batch processing for editing dozens or hundreds of images at once.'),
            ('Is there an API?', 'Yes — most modern image-editing AI tools expose a REST API for product integrations.'),
            ('Can I edit transparency / PNG masks?', 'Yes — alpha-channel and transparent-background output is standard.'),
            ('Is commercial use allowed?', 'Paid plans grant commercial usage rights.'),
        ],
    },
    'music-gen': {
        'industries': ['Content Creation', 'Gaming', 'Film & TV', 'Marketing & Advertising', 'Podcasting', 'Apps & Software'],
        'use_cases': ['Background music', 'Royalty-free soundtracks', 'Game music', 'Ad jingles', 'Podcast intros', 'Original songs'],
        'company_sizes': ['Solo creators', 'Small businesses', 'Midsize companies', 'Enterprises'],
        'support_channels': ['Email support', 'Help center', 'Community Discord', 'Knowledge base'],
        'training_options': ['Documentation', 'Tutorials', 'Sample prompts', 'Community examples'],
        'languages': ['English (lyrics)', 'Instrumental output universal'],
        'compliance': [],
        'pros_extra': ['Royalty-free output', 'Generates in seconds', 'No music theory required'],
        'cons_extra': ['Output quality varies by genre', 'Less control vs traditional DAWs'],
        'faqs_generic': lambda name: [
            (f'Can I use {name} music commercially?', f'Yes — paid plans grant commercial usage rights with no additional royalty obligations.'),
            ('How long can a track be?', 'Per-track length depends on plan — most modern tools generate 2-4 minute songs.'),
            ('Can I extend or remix a track?', 'Yes — extend, remix, and section-edit features are common across modern AI music tools.'),
            ('Is there an API?', 'Yes — most platforms offer API access on Pro or Business tiers.'),
        ],
    },
}


# Per-listing specifics. Each entry:
#   key:    slug (matches submissions.slug)
#   value:  dict with category + header_tags + key_features + pricing_tiers
#           + integrations + starting_price + booleans + faqs_extra
LISTINGS = {}

# ─── Batch 1: Image generation (10) ───────────────────────────────────────────
LISTINGS['midjourney'] = dict(
    category='image-gen',
    tags=['Image generation', 'Generative art', 'Discord'],
    key_features=[
        'V6 photorealism', 'V6 artistic stylization', 'Vary Region (inpainting)',
        'Pan and Zoom Out', 'Style references (--sref)', 'Character references (--cref)',
        'Personalisation profiles', '2x and 4x upscale', 'Niji 6 anime model', 'Browser web alpha',
    ],
    tiers=[
        ('Basic', 10, 'month', ['~200 generations/mo', '3 concurrent fast jobs', 'Commercial usage rights']),
        ('Standard', 30, 'month', ['~900 generations/mo + 15 fast hours', 'Unlimited Relax mode', 'Commercial usage rights']),
        ('Pro', 60, 'month', ['~30 fast hours', 'Stealth mode (private images)', '12 concurrent fast jobs']),
        ('Mega', 120, 'month', ['~60 fast hours', 'Stealth + max concurrency', 'Priority queue']),
    ],
    integrations=[
        ('Discord', 'https://discord.com', 'The primary interface for Midjourney prompts and community sharing.'),
        ('Web alpha', 'https://www.midjourney.com', 'Browser-based prompt + gallery for any subscriber.'),
    ],
    price=10, period='month', free_trial=False, free_version=False, ios=False, android=False,
    pros=['Best-in-class painterly + photoreal output', 'Distinctive recognisable aesthetic', 'Vary tools enable rapid iteration'],
    cons=['Discord-first interface still in transition', 'No free tier', 'Strict community policies'],
    faqs_extra=[
        ('Does Midjourney have a free trial?', 'Midjourney does not currently offer a free trial — the Basic plan starts at $10/month.'),
        ('What is Stealth Mode?', 'Stealth Mode keeps generated images private; available on Pro and Mega plans only.'),
    ],
)

LISTINGS['stability-ai'] = dict(
    category='image-gen',
    tags=['Open weights', 'Stable Diffusion', 'Foundation models'],
    key_features=[
        'Stable Diffusion 3 / 3.5 models', 'Stable Video Diffusion', 'Stable Audio',
        'Open weights for self-hosting', 'Stable Image Ultra API', 'Stable Image Core API',
        'Inpaint + outpaint endpoints', 'Image-to-video API', 'Commercial licensing tiers', 'Hugging Face distribution',
    ],
    tiers=[
        ('Self-host (open)', 0, 'one-time', ['Free for research and non-commercial use', 'Community licence', 'Run on your own GPUs']),
        ('API credits', 10, 'one-time', ['Pay-as-you-go API credits', 'Image, video, audio endpoints']),
        ('Enterprise', None, 'custom', ['Volume API pricing', 'Custom model licensing', 'Dedicated support and SLAs']),
    ],
    integrations=[
        ('Hugging Face', 'https://huggingface.co', 'Primary distribution channel for Stable Diffusion weights and demos.'),
        ('Stability API', 'https://platform.stability.ai', 'Direct REST API for image, video, and audio generation.'),
        ('ComfyUI', 'https://www.comfy.org', 'Popular open-source node graph editor used with Stable Diffusion.'),
    ],
    price=0, period='one-time', free_trial=True, free_version=True, ios=False, android=False,
    pros=['Truly open weights — self-host anywhere', 'Foundation of a huge ecosystem', 'Generous research licence'],
    cons=['Commercial licence required at scale', 'No polished consumer app — devs assemble it'],
    faqs_extra=[
        ('Is Stable Diffusion really free?', 'Yes — the open weights are free under the Stability AI Community Licence for research and non-commercial use.'),
        ('Do I need a licence for commercial use?', 'Stability offers a tiered commercial licence based on company revenue and use case.'),
    ],
)

LISTINGS['adobe-firefly'] = dict(
    category='image-gen',
    tags=['Commercially safe', 'Creative Cloud', 'Generative AI'],
    key_features=[
        'Text-to-image (Firefly Image 3)', 'Generative Fill (Photoshop)', 'Generative Recolor (Illustrator)',
        'Generative Expand', 'Text-to-vector', 'Firefly Video', 'Trained on Adobe Stock + public domain',
        'Commercial-safe output', 'Native Creative Cloud integration', 'Style and structure references',
    ],
    tiers=[
        ('Free', 0, 'month', ['25 generative credits/mo', 'Watermarked in some flows', 'Trial of premium features']),
        ('Firefly Standard', 9.99, 'month', ['2,000 credits/mo', 'Premium features', 'Commercial usage']),
        ('Firefly Pro', 29.99, 'month', ['7,000 credits/mo', 'Priority access', 'Premium features']),
        ('Creative Cloud All Apps', 59.99, 'month', ['Firefly included', 'All Adobe creative apps', 'Cloud storage']),
    ],
    integrations=[
        ('Adobe Photoshop', 'https://www.adobe.com/products/photoshop.html', 'Generative Fill, Expand, Remove powered by Firefly.'),
        ('Adobe Illustrator', 'https://www.adobe.com/products/illustrator.html', 'Generative Recolor and text-to-vector workflows.'),
        ('Adobe Express', 'https://www.adobe.com/express/', 'Quick consumer-grade generative templates.'),
        ('Adobe Stock', 'https://stock.adobe.com', 'Licensed training data plus generated-asset library.'),
    ],
    price=9.99, period='month', free_trial=True, free_version=True, ios=True, android=True,
    pros=['Commercially safe — licensed training data', 'Deep Creative Cloud integration', 'Familiar Adobe UX'],
    cons=['Subscription stack can get expensive', 'Output quality still behind Midjourney for some styles'],
    faqs_extra=[
        ('Is Firefly safe for commercial use?', 'Yes — Firefly is trained exclusively on Adobe Stock + public-domain content, with IP indemnification on enterprise plans.'),
        ('Is Firefly included in Creative Cloud?', 'Creative Cloud All Apps includes Firefly credits; standalone Firefly subscriptions are also available.'),
    ],
)

LISTINGS['dall-e'] = dict(
    category='image-gen',
    tags=['OpenAI', 'ChatGPT-native', 'Multimodal'],
    key_features=[
        'DALL-E 3 model', 'Native ChatGPT integration', 'Instruction-following prompts',
        'Iterate via chat replies', 'Aspect ratio control', 'High-fidelity text rendering',
        'API for developers', 'Safety guardrails', 'Image variations', 'In-painting tools',
    ],
    tiers=[
        ('Free (ChatGPT)', 0, 'month', ['Limited DALL-E 3 generations via free ChatGPT', 'Standard quality']),
        ('ChatGPT Plus', 20, 'month', ['Higher DALL-E 3 usage', 'Voice mode + advanced features']),
        ('API pay-as-you-go', None, 'usage', ['~$0.04 per 1024x1024 standard image', '~$0.08 per 1024x1024 HD image']),
    ],
    integrations=[
        ('ChatGPT', 'https://chat.openai.com', 'Native DALL-E 3 integration — prompt in plain chat.'),
        ('OpenAI API', 'https://platform.openai.com', 'Direct image generation endpoint for developers.'),
        ('Microsoft Designer', 'https://designer.microsoft.com', 'Embeds DALL-E for image generation.'),
        ('Bing Image Creator', 'https://www.bing.com/images/create', 'Free public DALL-E access via Microsoft.'),
    ],
    price=20, period='month', free_trial=True, free_version=True, ios=True, android=True,
    pros=['Tightly integrated with ChatGPT', 'Excellent instruction-following', 'Best-in-class for accurate text rendering'],
    cons=['Stricter safety filters than competitors', 'Less stylistic range than Midjourney'],
    faqs_extra=[
        ('How do I access DALL-E?', 'Use ChatGPT (free or Plus), Microsoft Designer/Bing Image Creator, or call the OpenAI API directly.'),
        ('Is commercial use allowed?', 'Yes — images generated via ChatGPT or the OpenAI API can be used commercially per OpenAI Terms.'),
    ],
)

LISTINGS['leonardo-ai'] = dict(
    category='image-gen',
    tags=['Game assets', 'Fine-tuned models', 'Creator suite'],
    key_features=[
        'Phoenix 1.0 model', 'Realtime Canvas', 'Image Guidance / Image-to-Image', 'Custom model training',
        'Marketing-image presets', 'Photoshoot mode for products', 'Motion (image-to-video)', '3D texture generator',
        'Universal Upscaler', 'AI generation API',
    ],
    tiers=[
        ('Free', 0, 'month', ['~150 fast tokens/day', 'Public generations', 'Standard models']),
        ('Apprentice', 12, 'month', ['8,500 fast tokens/mo', 'Private generations', 'No daily reset gap']),
        ('Artisan', 30, 'month', ['25,000 fast tokens/mo', 'Private + Universal Upscaler', 'Higher concurrency']),
        ('Maestro', 60, 'month', ['60,000 fast tokens/mo', 'Premium model access', 'Highest concurrency']),
    ],
    integrations=[
        ('Canva', 'https://www.canva.com', 'Leonardo joined the Canva family — integrations expanding into the Canva suite.'),
        ('API', 'https://leonardo.ai/api', 'REST API for image, video, and 3D texture generation.'),
    ],
    price=12, period='month', free_trial=True, free_version=True, ios=False, android=False,
    pros=['Tailored fine-tuned models per niche', 'Strong free tier', 'Realtime canvas is excellent'],
    cons=['Cluttered UI for beginners', 'Some advanced features gated behind higher tiers'],
    faqs_extra=[
        ('Is Leonardo good for game assets?', 'Yes — Leonardo is widely used by indie game studios for concept art, tilesets, and character variations.'),
        ('Can I train my own model?', 'Yes — Apprentice tier and above support uploading reference sets to train a custom fine-tuned model.'),
    ],
)

LISTINGS['ideogram'] = dict(
    category='image-gen',
    tags=['In-image text', 'Posters', 'Typography'],
    key_features=[
        'Best-in-class in-image text', 'Ideogram 2.0 / 3.0 models', 'Magic Prompt enhancement',
        'Style references', 'Image-to-image', 'High-resolution output', 'Negative prompts',
        'Multiple aspect ratios', 'Brand kit (Pro+)', 'Mobile app',
    ],
    tiers=[
        ('Free', 0, 'month', ['25 prompts/day', 'Standard quality', 'Public-only generations']),
        ('Basic', 8, 'month', ['400 priority generations/mo', 'Unlimited slow generations', 'Private generations']),
        ('Plus', 20, 'month', ['1,000 priority gens/mo', 'Brand styles', 'Higher resolution']),
        ('Pro', 60, 'month', ['3,000 priority gens/mo', 'Full brand kit', 'API access']),
    ],
    integrations=[
        ('API', 'https://ideogram.ai/api', 'Programmatic image generation with full Ideogram parameters.'),
        ('iOS app', 'https://apps.apple.com', 'Generate on the go from iPhone.'),
    ],
    price=8, period='month', free_trial=True, free_version=True, ios=True, android=False,
    pros=['Best in-image text rendering in the category', 'Generous free tier', 'Clean UI'],
    cons=['Smaller community than Midjourney', 'Style range narrower than top players'],
    faqs_extra=[
        ('Why is Ideogram good for posters?', 'Ideogram is uniquely strong at rendering legible, on-prompt text inside images — perfect for posters, ads, and mockups.'),
        ('Does Ideogram have an API?', 'Yes — full API access is available on the Pro tier.'),
    ],
)

LISTINGS['krea-ai'] = dict(
    category='image-gen',
    tags=['Realtime canvas', 'Live generation', 'Design'],
    key_features=[
        'Realtime image generation', 'Enhance (real-time upscale)', 'Video generation',
        'Train custom styles', 'Image-to-image', '3D reference workflow', 'Lottie / vector export',
        'Flux + Stable Diffusion engines', 'API access', 'Krea Chat',
    ],
    tiers=[
        ('Free', 0, 'month', ['Limited daily generations', 'Standard speed', 'Public generations']),
        ('Basic', 10, 'month', ['1,000 monthly generations', 'Realtime priority', 'Private generations']),
        ('Pro', 35, 'month', ['10,000 monthly generations', 'Highest priority', 'API access']),
    ],
    integrations=[
        ('API', 'https://www.krea.ai/api', 'Programmatic access to Krea generation endpoints.'),
        ('Figma', 'https://www.figma.com', 'Plugin embeds Krea generation in Figma designs.'),
    ],
    price=10, period='month', free_trial=True, free_version=True, ios=False, android=False,
    pros=['Real-time canvas changes how you prototype', 'Pleasant designer-focused UI', 'Fast iteration loop'],
    cons=['Limited free tier', 'Requires modern GPU for best realtime experience'],
    faqs_extra=[
        ('What is Realtime mode?', 'Realtime mode regenerates the image as you sketch or edit prompts — sub-second feedback for design exploration.'),
        ('Can Krea train custom styles?', 'Yes — upload reference images to fine-tune a personal style.'),
    ],
)

LISTINGS['recraft'] = dict(
    category='image-gen',
    tags=['Vector output', 'Brand kits', 'Design'],
    key_features=[
        'Recraft V3 model', 'Vector (SVG) output', 'Consistent style sets', 'Accurate in-image text',
        'Brand kit and style locking', 'Icon set generation', 'Mockup generation', 'Image upscaler',
        'Background generation', 'API access',
    ],
    tiers=[
        ('Free', 0, 'month', ['100 credits/day', 'Public projects', 'Standard speed']),
        ('Basic', 12, 'month', ['1,000 credits/mo', 'Private projects', 'Vector exports']),
        ('Advanced', 33, 'month', ['7,500 credits/mo', 'Style training', 'Higher resolution']),
        ('Pro', 60, 'month', ['Higher monthly credits', 'API access', 'Priority support']),
    ],
    integrations=[
        ('API', 'https://www.recraft.ai/api', 'Generate vector and raster images via REST API.'),
        ('Figma', 'https://www.figma.com', 'Recraft plugin for in-canvas generation.'),
    ],
    price=12, period='month', free_trial=True, free_version=True, ios=False, android=False,
    pros=['Native vector output — rare in this category', 'Consistent brand styles', 'Designer-first workflow'],
    cons=['Smaller community vs Midjourney', 'Limited photoreal range vs other tools'],
    faqs_extra=[
        ('Can Recraft really output vectors?', 'Yes — Recraft is one of the few generative tools that exports clean SVGs ready for design tools.'),
        ('Is Recraft good for brand work?', 'Yes — it specialises in consistent styles, brand kits, and icon sets for design teams.'),
    ],
)

LISTINGS['playground-ai'] = dict(
    category='image-gen',
    tags=['Free image gen', 'Open models', 'Hobbyist-friendly'],
    key_features=[
        'Playground v2.5 + v3 models', 'Stable Diffusion + Flux engines', 'Free generous tier',
        'Mixed Image Editor', 'Filter and style presets', 'Aspect ratio control',
        'Image-to-image', 'Inpainting', 'Prompt remixing', 'API access',
    ],
    tiers=[
        ('Free', 0, 'month', ['500 images/day free', 'All community models', 'Standard speed']),
        ('Pro', 12, 'month', ['Higher daily quotas', 'Premium models', 'Faster generation']),
        ('Pro Annual', 102, 'year', ['Same as Pro at ~$8.50/mo', 'Best value']),
    ],
    integrations=[
        ('API', 'https://playground.com/api', 'Programmatic access for developers.'),
    ],
    price=12, period='month', free_trial=True, free_version=True, ios=False, android=False,
    pros=['Generous free tier', 'Multiple model engines in one UI', 'Active hobbyist community'],
    cons=['Quality varies by model', 'UI can feel overwhelming for beginners'],
    faqs_extra=[
        ('Is Playground really free?', 'Yes — Playground offers up to 500 free images per day on standard speed, no credit card.'),
        ('What models can I use?', 'Playground v2.5/v3, Stable Diffusion variants, and Flux models are all available.'),
    ],
)

LISTINGS['flux-black-forest-labs'] = dict(
    category='image-gen',
    tags=['Open weights', 'Frontier model', 'Flux'],
    key_features=[
        'Flux.1 schnell (free, open)', 'Flux.1 dev (open research)', 'Flux.1 pro (commercial)',
        'Flux.1.1 pro state-of-the-art', 'Photoreal output quality', 'Text rendering competence',
        'Hugging Face distribution', 'API via Replicate / fal / Together', 'Self-host on 24GB+ GPU', 'Frequent model updates',
    ],
    tiers=[
        ('Schnell (open)', 0, 'one-time', ['Apache 2.0 — free for commercial use', 'Self-host or via partner APIs']),
        ('Dev (open research)', 0, 'one-time', ['Free for non-commercial use', 'Best open-weight image model']),
        ('Pro (commercial API)', None, 'usage', ['Pay-as-you-go via partner APIs (~$0.025-$0.05 per image)', 'Flux.1.1 pro for highest quality']),
    ],
    integrations=[
        ('Hugging Face', 'https://huggingface.co/black-forest-labs', 'Primary distribution channel for Flux model weights.'),
        ('Replicate', 'https://replicate.com', 'Hosted Flux endpoints for production use.'),
        ('fal.ai', 'https://fal.ai', 'Fast Flux inference for developers.'),
        ('Together AI', 'https://www.together.ai', 'Hosted Flux pro / dev / schnell inference.'),
    ],
    price=0, period='one-time', free_trial=True, free_version=True, ios=False, android=False,
    pros=['Frontier-grade quality from the original Stable Diffusion team', 'Open weights for free tiers', 'Strong ecosystem of hosting partners'],
    cons=['No consumer-facing app — devs use partner APIs', 'Pro variant requires commercial licence at scale'],
    faqs_extra=[
        ('Who made Flux?', 'Black Forest Labs — the original Stable Diffusion research team led by Robin Rombach, founded after they left Stability AI in 2024.'),
        ('Is Flux better than Stable Diffusion?', 'Flux models are widely considered the best open-weight image generators available, surpassing SDXL on most benchmarks.'),
    ],
)


# ─── Batch 2: Video generation (8) ────────────────────────────────────────────
LISTINGS['runway'] = dict(
    category='video-gen',
    tags=['Text-to-video', 'Image-to-video', 'VFX'],
    key_features=[
        'Gen-3 Alpha model', 'Gen-3 Alpha Turbo', 'Image-to-video', 'Text-to-video',
        'Motion brush — paint motion paths', 'Lip-sync (Act-One)', 'Performance-to-character (Act-One)',
        'Inpainting & remove tools', 'Camera control', 'API access',
    ],
    tiers=[
        ('Free', 0, 'month', ['125 one-time credits', 'Watermarked exports', 'Standard quality']),
        ('Standard', 15, 'month', ['625 credits/mo', 'Watermark removed', 'Unlimited Gen-3 Alpha Turbo']),
        ('Pro', 35, 'month', ['2250 credits/mo', '4K upscale', 'Custom voices']),
        ('Unlimited', 95, 'month', ['Unlimited Gen-3 Alpha Turbo in Relaxed', 'Pro features included']),
        ('Enterprise', None, 'custom', ['Custom credits', 'SSO', 'Dedicated support']),
    ],
    integrations=[
        ('API', 'https://docs.dev.runwayml.com', 'Gen-3 Alpha / Alpha Turbo via REST API for production use.'),
        ('Webhooks', 'https://docs.dev.runwayml.com', 'Async job notifications for long-running generations.'),
    ],
    price=15, period='month', free_trial=True, free_version=True, ios=False, android=False,
    pros=['Hollywood-grade output quality', 'Best VFX feature suite in the category', 'Active product velocity'],
    cons=['Credit consumption can spike on complex jobs', 'Steeper learning curve than consumer tools'],
    faqs_extra=[
        ('What is Act-One?', 'Act-One transfers a performance from a reference video onto a generated character — facial expressions, head movements, and lip-sync.'),
        ('Can I use Runway for client work?', 'Yes — all paid plans grant commercial usage rights.'),
    ],
)

LISTINGS['pika-labs'] = dict(
    category='video-gen',
    tags=['Text-to-video', 'Discord', 'Consumer-friendly'],
    key_features=[
        'Pika 2.0 model', 'Scene Ingredients (multi-image reference)', 'Pikaffects (visual effects)',
        'Lip-sync', 'Sound effects integration', 'Image-to-video', 'Extend clips',
        'Camera controls', 'Aspect ratio control', 'Discord and web app',
    ],
    tiers=[
        ('Free', 0, 'month', ['80 credits + 30 monthly', 'Watermarked', 'Standard speed']),
        ('Standard', 8, 'month', ['700 credits/mo', 'No watermark', 'Standard speed']),
        ('Pro', 28, 'month', ['2,300 credits/mo', 'Fast generation', 'Pikaffects access']),
        ('Fancy', 76, 'month', ['6,000 credits/mo', 'Priority queue', 'All Pro features']),
    ],
    integrations=[
        ('Discord', 'https://discord.com', 'Original interface for Pika prompts and community.'),
        ('Web app', 'https://pika.art', 'Full-feature browser interface.'),
    ],
    price=8, period='month', free_trial=True, free_version=True, ios=False, android=False,
    pros=['Fun, playful Pikaffects', 'Strong consumer UX', 'Active iteration on the model'],
    cons=['Shorter clip lengths than enterprise tools', 'No dedicated API yet'],
    faqs_extra=[
        ('What are Pikaffects?', 'Pikaffects are one-click visual effects (e.g. "explode it", "melt it", "crush it") applied to any clip.'),
        ('How do credits work?', 'Each video uses ~10-30 credits depending on length and quality settings.'),
    ],
)

LISTINGS['synthesia'] = dict(
    category='video-gen',
    tags=['AI avatars', 'Corporate training', 'Multilingual'],
    key_features=[
        '230+ AI avatars', '140+ languages', 'Voice cloning', 'Custom avatar creation',
        'Screen recording with AI presenter', 'PDF & PPT import', 'Brand kit',
        'Translation of existing videos', 'API for programmatic generation', 'SSO + enterprise security',
    ],
    tiers=[
        ('Starter', 18, 'month', ['10 minutes of video/mo', '70+ avatars', '140+ languages']),
        ('Creator', 64, 'month', ['30 min/mo', '230+ avatars', 'Brand kit & custom voice']),
        ('Enterprise', None, 'custom', ['Unlimited videos', 'Custom avatars', 'SSO + SCIM + audit logs']),
    ],
    integrations=[
        ('SCORM export', 'https://www.synthesia.io', 'LMS-ready export for corporate training systems.'),
        ('API', 'https://docs.synthesia.io', 'Programmatic video generation for product integrations.'),
        ('Zapier', 'https://zapier.com', 'Trigger Synthesia videos from 6,000+ apps.'),
        ('Microsoft Teams', 'https://www.microsoft.com/microsoft-teams', 'Embed and share Synthesia videos in Teams.'),
    ],
    price=18, period='month', free_trial=True, free_version=False, ios=False, android=False,
    pros=['Best-in-class for corporate training & comms', '140+ languages out of the box', 'Enterprise-grade security'],
    cons=['Avatar-only — not for VFX or cinematic generation', 'Custom avatar requires studio recording'],
    faqs_extra=[
        ('Can I clone my own voice?', 'Yes — voice cloning is available on Creator and Enterprise plans with consent verification.'),
        ('Does Synthesia support SCORM for our LMS?', 'Yes — SCORM 1.2 / 2004 exports are supported for corporate training systems.'),
    ],
)

LISTINGS['heygen'] = dict(
    category='video-gen',
    tags=['AI avatars', 'Video translation', 'Lip-sync'],
    key_features=[
        '300+ AI avatars', 'Instant avatar from selfie video', 'Voice cloning', 'Real-time avatar (Interactive)',
        'Video translation with lip-sync', '175+ languages', 'Photo-to-video', 'Talking photo',
        'Streaming avatar API', 'Brand kit',
    ],
    tiers=[
        ('Free', 0, 'month', ['3 videos/month, up to 3 min', 'Watermarked', 'Limited avatars']),
        ('Creator', 24, 'month', ['Unlimited videos', 'Up to 30 min/video', '15 instant avatars']),
        ('Team', 69, 'month', ['Pro features + brand kit', 'Voice cloning', 'Priority support']),
        ('Enterprise', None, 'custom', ['Custom avatars', 'SSO', 'API access']),
    ],
    integrations=[
        ('Streaming Avatar API', 'https://docs.heygen.com', 'Real-time interactive avatars for live experiences.'),
        ('Zapier', 'https://zapier.com', 'Automate HeyGen video creation from 6,000+ apps.'),
        ('API', 'https://docs.heygen.com', 'Programmatic avatar + video generation.'),
    ],
    price=24, period='month', free_trial=True, free_version=True, ios=False, android=False,
    pros=['Best video translation + lip-sync', 'Instant avatars from a phone recording', 'Strong API for product builders'],
    cons=['Expensive at enterprise scale', 'Voice clone needs careful prompt engineering'],
    faqs_extra=[
        ('What is the video translation feature?', 'HeyGen re-dubs and re-lip-syncs an existing video into 175+ languages — the speaker appears to fluently speak the target language.'),
        ('How long does avatar creation take?', 'Instant avatars from a 2-minute selfie video are ready in ~5 minutes.'),
    ],
)

LISTINGS['d-id'] = dict(
    category='video-gen',
    tags=['Talking avatars', 'Image-to-video', 'AI presenters'],
    key_features=[
        'Creative Reality Studio', 'Talking photos from a single image', 'Live Portrait',
        'Real-time API for streaming avatars', 'Pre-built presenters', 'Custom presenter from selfie',
        '120+ languages', 'Voice cloning', 'Express Mode (faster generation)', 'SDK for embed',
    ],
    tiers=[
        ('Trial', 0, 'one-time', ['5 minutes of free generation', 'Standard quality']),
        ('Lite', 5.99, 'month', ['10 minutes/mo', 'D-ID watermark', 'Standard avatars']),
        ('Pro', 29, 'month', ['15 min/mo', 'No watermark', 'Premium voices']),
        ('Advanced', 196, 'month', ['100 min/mo', 'Live Portrait', 'API access']),
        ('Enterprise', None, 'custom', ['Custom rates', 'SLAs', 'On-prem available']),
    ],
    integrations=[
        ('API', 'https://docs.d-id.com', 'Real-time and async talking-avatar generation.'),
        ('Microsoft Teams', 'https://www.microsoft.com/microsoft-teams', 'Embed D-ID avatars in Teams meetings.'),
        ('Zapier', 'https://zapier.com', 'Automate D-ID video creation from 6,000+ apps.'),
    ],
    price=5.99, period='month', free_trial=True, free_version=True, ios=False, android=False,
    pros=['Pioneer of photo-to-talking-video', 'Real-time avatar streaming for agents', 'Enterprise security'],
    cons=['Per-minute pricing adds up', 'Output range narrower than consumer video tools'],
    faqs_extra=[
        ('Can I make an avatar from one photo?', 'Yes — D-ID generates a talking avatar from a single still image.'),
        ('Is there a real-time mode?', 'Yes — the Live Portrait API powers streaming interactive avatars for chat agents and live experiences.'),
    ],
)

LISTINGS['luma-ai'] = dict(
    category='video-gen',
    tags=['Dream Machine', 'NeRF', '3D capture'],
    key_features=[
        'Dream Machine 1.6 model', 'Text-to-video', 'Image-to-video',
        'Camera path control (Brainstorm + Brush)', 'Extend / loop clips', 'Genie 3D capture from phone',
        'NeRF reconstruction', 'API for video generation', 'Mobile capture app', 'Web app',
    ],
    tiers=[
        ('Free', 0, 'month', ['30 generations/mo', '720p resolution', 'Watermarked']),
        ('Standard', 9.99, 'month', ['150 generations/mo', '1080p', 'No watermark']),
        ('Pro', 29.99, 'month', ['700 generations/mo', 'Priority queue', 'Extended commercial rights']),
        ('Premier', 94.99, 'month', ['~2,500 generations/mo', 'Highest priority', 'Top tier features']),
    ],
    integrations=[
        ('Dream Machine API', 'https://lumalabs.ai/dream-machine/api', 'Programmatic video generation.'),
        ('iOS app', 'https://apps.apple.com', 'Genie 3D capture from phone.'),
    ],
    price=9.99, period='month', free_trial=True, free_version=True, ios=True, android=True,
    pros=['Consumer-friendly Dream Machine UX', 'Unique 3D / NeRF capture pipeline', 'Used by Hollywood VFX'],
    cons=['Smaller video clip lengths', 'Resolution limited on free tier'],
    faqs_extra=[
        ('What is Genie?', 'Genie turns phone-captured footage into navigable 3D scenes using NeRF — used for VFX previs and AR.'),
        ('How long are Dream Machine clips?', 'Each generation is 5 seconds at 720p / 1080p, extendable in 5-second increments.'),
    ],
)

LISTINGS['kling-ai'] = dict(
    category='video-gen',
    tags=['Long-form video', 'Frontier model', 'Kuaishou'],
    key_features=[
        'KLING 2.0 frontier model', 'Up to 10s clips per generation', 'Text-to-video',
        'Image-to-video', 'Motion brush', 'Lip-sync', 'Camera path control',
        'Multi-image reference (up to 4 inputs)', 'Extend mode', 'API for developers',
    ],
    tiers=[
        ('Free', 0, 'month', ['66 credits on signup', 'Standard speed', 'Watermarked']),
        ('Standard', 6.99, 'month', ['660 credits/mo', 'Faster generation', 'Higher resolution']),
        ('Pro', 39.99, 'month', ['3,000 credits/mo', 'Priority queue', 'Pro features']),
        ('Premier', 64.99, 'month', ['~6,000 credits/mo', 'Highest tier', 'All Pro features']),
    ],
    integrations=[
        ('Kling API', 'https://klingai.com', 'Programmatic video generation.'),
        ('fal.ai', 'https://fal.ai', 'Hosted Kling inference for developers.'),
        ('Pollo AI', 'https://pollo.ai', 'Multi-model platform with Kling support.'),
    ],
    price=6.99, period='month', free_trial=True, free_version=True, ios=False, android=False,
    pros=['Top-tier physics and motion realism', 'Affordable vs Western competitors', 'Longer clips per generation'],
    cons=['UI primarily in Chinese on native site', 'Some prompts blocked by content policy'],
    faqs_extra=[
        ('Who makes Kling?', 'Kling is built by Kuaishou, the Chinese short-video platform that competes with Douyin/TikTok.'),
        ('How does Kling compare to Sora?', 'Kling is widely considered the closest competitor to OpenAI Sora and is generally available — Sora has been gated.'),
    ],
)

LISTINGS['hailuo-ai-minimax'] = dict(
    category='video-gen',
    tags=['Text-to-video', 'MiniMax', 'High-detail'],
    key_features=[
        'Hailuo I-01 model', 'T2V-01 text-to-video', 'High-detail output', 'Strong prompt adherence',
        'Subject reference', 'Camera control via prompt', 'Image-to-video',
        'Audio sync (lip + sound)', 'Multilingual prompt support', 'API access',
    ],
    tiers=[
        ('Free', 0, 'month', ['Daily free credits', 'Standard quality', 'Watermarked']),
        ('Standard', 14.9, 'month', ['~1,000 credits/mo', 'No watermark', 'Higher priority']),
        ('Unlimited', 94.9, 'month', ['Unlimited generations', 'Highest priority', 'All Pro features']),
    ],
    integrations=[
        ('Hailuo API', 'https://hailuoai.video', 'Programmatic video generation endpoints.'),
        ('MiniMax abab API', 'https://www.minimax.io', 'LLM and other MiniMax model APIs.'),
        ('fal.ai', 'https://fal.ai', 'Hosted Hailuo inference for developers.'),
    ],
    price=14.9, period='month', free_trial=True, free_version=True, ios=False, android=False,
    pros=['Highest detail output of the current Chinese video models', 'Excellent prompt adherence', 'Strong motion realism'],
    cons=['Some content restrictions', 'UI translation incomplete in some flows'],
    faqs_extra=[
        ('Who is MiniMax?', 'MiniMax is a Shanghai-based AI lab — they also publish the abab LLM family and the Talkie character-chat app.'),
        ('Is Hailuo open source?', 'No — Hailuo is a commercial product, used via the web app or API.'),
    ],
)


# ─── Batch 3: Voice / audio (8) ───────────────────────────────────────────────
LISTINGS['elevenlabs'] = dict(
    category='voice-audio',
    tags=['Text-to-speech', 'Voice cloning', 'Conversational AI'],
    key_features=[
        '5,000+ stock voices', 'Voice cloning from 1-minute sample',
        'Multilingual model (32 languages)', 'Studio long-form workflow',
        'Conversational AI agents', 'Dubbing studio with lip-sync',
        'Speech-to-Speech style transfer', 'Sound effects generation',
        'Voice library marketplace', 'Streaming + batch API',
    ],
    tiers=[
        ('Free', 0, 'month', ['10K characters/mo', '3 custom voices', 'Watermark in API']),
        ('Starter', 5, 'month', ['30K characters/mo', '10 custom voices', 'Professional voice cloning']),
        ('Creator', 22, 'month', ['100K characters/mo', '30 custom voices', '192kbps audio']),
        ('Pro', 99, 'month', ['500K characters/mo', 'Higher concurrency', 'API priority']),
        ('Scale', 330, 'month', ['2M characters/mo', 'Production-grade API', 'PCI-aware']),
        ('Enterprise', None, 'custom', ['Unlimited usage', 'SSO + audit logs', 'Volume pricing']),
    ],
    integrations=[
        ('Conversational AI', 'https://elevenlabs.io/conversational-ai', 'Build voice agents with sub-500ms latency.'),
        ('API', 'https://elevenlabs.io/docs', 'Full text-to-speech, voice cloning, and dubbing endpoints.'),
        ('Zapier', 'https://zapier.com', 'Generate ElevenLabs audio from 6,000+ apps.'),
        ('Make', 'https://www.make.com', 'No-code automation with ElevenLabs voice generation.'),
    ],
    price=5, period='month', free_trial=True, free_version=True, ios=True, android=True,
    pros=['Best-in-class voice realism', 'Strong multilingual support', 'Voice cloning that actually works'],
    cons=['Per-character pricing adds up at scale', 'Voice cloning needs careful consent practices'],
    faqs_extra=[
        ('How accurate is voice cloning?', 'Professional Voice Cloning produces near-indistinguishable voices from a 30-min training sample.'),
        ('What is the latency for streaming?', 'Real-time text-to-speech via the Conversational AI API delivers sub-500ms first-token latency.'),
    ],
)

LISTINGS['suno'] = dict(
    category='music-gen',
    tags=['AI music', 'Song generation', 'Lyrics'],
    key_features=[
        'Full-song generation (vocals + lyrics + instrumental)', 'V4 model (current generation)',
        'Persona feature for consistent artist voice', 'Cover song mode', 'Stems separation',
        'Extend / remix existing tracks', 'Genre + style prompts', 'Custom lyrics or auto-generated',
        '2 minutes per generation, extendable to 8+', 'API for developers (waitlist)',
    ],
    tiers=[
        ('Free', 0, 'month', ['50 credits/day (10 songs)', 'Non-commercial use only', 'Public songs']),
        ('Pro', 10, 'month', ['2,500 credits/mo (500 songs)', 'Commercial usage rights', 'Priority queue']),
        ('Premier', 30, 'month', ['10,000 credits/mo (2,000 songs)', 'Commercial use', 'Highest priority']),
    ],
    integrations=[
        ('Web app', 'https://suno.com', 'Primary interface for song creation and library.'),
        ('Mobile app', 'https://apps.apple.com', 'iOS app for on-the-go song generation.'),
    ],
    price=10, period='month', free_trial=True, free_version=True, ios=True, android=True,
    pros=['Generates complete radio-quality songs', 'Strong vocal generation', 'Pro tier covers commercial use'],
    cons=['Free tier non-commercial only', 'Style range narrower than Udio for some genres'],
    faqs_extra=[
        ('Can I use Suno songs commercially?', 'Yes — Pro and Premier plans grant full commercial rights to generated songs.'),
        ('How long can a song be?', 'Each generation is up to 2 minutes; the Extend feature stretches songs to 8+ minutes.'),
    ],
)

LISTINGS['udio'] = dict(
    category='music-gen',
    tags=['AI music', 'Vocal generation', 'Long prompts'],
    key_features=[
        'Long-prompt sculpting (up to 600 chars)', 'V1.5 model', 'High-quality vocal output',
        'Extend feature (intro/outro/section)', 'Inpaint song sections', 'Remix existing audio',
        'Genre + style + mood controls', 'Lyric editing', 'Stems separation', 'Cover song mode',
    ],
    tiers=[
        ('Free', 0, 'month', ['10 songs/day', 'Watermark on free tier', 'Non-commercial use']),
        ('Standard', 10, 'month', ['1,200 songs/mo', 'Commercial usage', 'No watermark']),
        ('Pro', 30, 'month', ['4,800 songs/mo', 'Priority queue', 'Higher-quality outputs']),
    ],
    integrations=[
        ('Web app', 'https://www.udio.com', 'Primary interface for song creation.'),
    ],
    price=10, period='month', free_trial=True, free_version=True, ios=False, android=False,
    pros=['Best vocal quality in the category for many genres', 'Strong long-prompt control', 'Active community'],
    cons=['Web-only — no mobile app yet', 'Lyric editing requires extra finesse'],
    faqs_extra=[
        ('Who founded Udio?', 'Udio was founded in 2023 by ex-DeepMind researchers including David Ding.'),
        ('How does Udio compare to Suno?', 'Both are top-tier; Udio is often preferred for vocal quality and long-prompt control, Suno for ease of use.'),
    ],
)

LISTINGS['murf-ai'] = dict(
    category='voice-audio',
    tags=['Voiceover', 'Text-to-speech', 'E-learning'],
    key_features=[
        '120+ studio-quality voices', '20+ languages', 'Voice cloning (Murf Voice Studio)',
        'Voice changer (one voice to another)', 'AI translation with voice match',
        'Time-synced media library (video, music, images)', 'Pitch / pace / emphasis controls',
        'Pronunciation library', 'API for developers', 'Team collaboration',
    ],
    tiers=[
        ('Free', 0, 'month', ['10 min voice generation', '120+ voices', 'No download — preview only']),
        ('Creator', 29, 'month', ['2 hours voice generation', 'Download MP3/WAV', 'Commercial usage']),
        ('Business', 99, 'month', ['Unlimited downloads', 'Team workspace', 'API access']),
        ('Enterprise', None, 'custom', ['Custom voice cloning', 'SSO', 'Dedicated support']),
    ],
    integrations=[
        ('Google Slides', 'https://slides.google.com', 'Add Murf voiceover to slides via add-on.'),
        ('API', 'https://murf.ai/api', 'Programmatic voiceover generation for products.'),
        ('Adobe Audition', 'https://www.adobe.com/products/audition.html', 'Export-ready audio for post-production.'),
    ],
    price=29, period='month', free_trial=True, free_version=True, ios=False, android=False,
    pros=['Studio-quality voices for e-learning', 'Strong time-sync video tools', 'Affordable per-minute pricing'],
    cons=['Editor UI feels dated', 'Voice cloning gated to Enterprise'],
    faqs_extra=[
        ('Is Murf good for e-learning?', 'Yes — Murf is heavily used by L&D teams for narration thanks to its time-sync tools and pronunciation library.'),
        ('Can I clone a voice?', 'Voice cloning is available on the Enterprise tier with consent verification.'),
    ],
)

LISTINGS['resemble-ai'] = dict(
    category='voice-audio',
    tags=['Voice cloning', 'Deepfake detection', 'Enterprise'],
    key_features=[
        'Voice cloning from 5+ languages', 'Cross-language voice transfer',
        'Resemble Detect (deepfake detection API)', 'Real-time streaming TTS',
        'Voice marketplace', 'Emotion + style controls', 'On-prem deployment',
        'API for developers', 'PCI / HIPAA compliance options', 'SSO + audit logs',
    ],
    tiers=[
        ('Free', 0, 'month', ['10 min generation', 'Basic voices', 'Watermarked']),
        ('Creator', 29, 'month', ['1 voice clone', 'Higher-quality output', 'No watermark']),
        ('Pro', 99, 'month', ['5 voice clones', 'API access', 'Commercial usage']),
        ('Enterprise', None, 'custom', ['Custom voice cloning', 'On-prem', 'PCI / HIPAA']),
    ],
    integrations=[
        ('Resemble Detect API', 'https://www.resemble.ai/detect', 'Deepfake detection for audio.'),
        ('Resemble API', 'https://docs.resemble.ai', 'Voice cloning, TTS, and dubbing endpoints.'),
        ('Twilio', 'https://www.twilio.com', 'Integrate Resemble voices in voice agents.'),
    ],
    price=29, period='month', free_trial=True, free_version=True, ios=False, android=False,
    pros=['Best deepfake detection in the industry', 'Enterprise-grade security', 'Cross-language transfer is impressive'],
    cons=['Smaller stock voice library than ElevenLabs', 'Pricing oriented to enterprise'],
    faqs_extra=[
        ('What is Resemble Detect?', 'Resemble Detect is an API that identifies AI-generated speech in audio recordings — used by media, banking, and government.'),
        ('Is on-prem available?', 'Yes — Enterprise tier supports on-prem and VPC deployment for regulated industries.'),
    ],
)

LISTINGS['play-ht'] = dict(
    category='voice-audio',
    tags=['Text-to-speech', 'Conversational AI', 'Voice cloning'],
    key_features=[
        '800+ voices in 100+ languages', 'PlayDialog model (natural 2-voice dialogues)',
        'PlayHT 2.0 ultra-realistic model', 'Voice cloning from 30s sample',
        'Streaming API (~75ms TTFB)', 'Conversational voice AI', 'Pronunciation library',
        'SSML support', 'WebSocket + REST APIs', 'Volume discounts',
    ],
    tiers=[
        ('Free', 0, 'month', ['12,500 characters/mo', '90+ voices', 'No commercial use']),
        ('Creator', 39, 'month', ['Unlimited characters', 'Commercial usage', 'Voice cloning']),
        ('Unlimited', 99, 'month', ['No usage limits', 'Higher priority', 'API access']),
        ('Enterprise', None, 'custom', ['Volume pricing', 'SLA', 'Dedicated infra']),
    ],
    integrations=[
        ('API', 'https://docs.play.ht', 'TTS + voice cloning + Conversational AI endpoints.'),
        ('Twilio', 'https://www.twilio.com', 'Use PlayHT voices in Twilio voice agents.'),
        ('Vapi', 'https://vapi.ai', 'PlayHT voices in voice-AI agent builder.'),
    ],
    price=39, period='month', free_trial=True, free_version=True, ios=False, android=False,
    pros=['Sub-100ms latency for conversational AI', 'PlayDialog excels at 2-voice scripts', '100+ languages'],
    cons=['Free tier is small', 'Voice library overwhelming to navigate'],
    faqs_extra=[
        ('What is PlayDialog?', 'PlayDialog is a 2-voice dialogue model that generates natural conversational audio between two speakers in a single pass.'),
        ('Is the streaming latency real?', 'Yes — TTFB averages ~75ms, suitable for production voice-AI agents.'),
    ],
)

LISTINGS['speechify'] = dict(
    category='voice-audio',
    tags=['Read-aloud', 'Accessibility', 'Celebrity voices'],
    key_features=[
        '200+ voices in 30+ languages', 'Celebrity-licensed voices (Snoop Dogg, MrBeast, etc.)',
        'Browser extension (read any webpage)', 'PDF / DOC / EPUB import',
        'iOS / Android apps', 'Speed up to 9x', 'OCR for scanned documents',
        'Offline listening', 'Note-taking + highlighting', 'Audiobook narration',
    ],
    tiers=[
        ('Free', 0, 'month', ['Limited reads', 'Basic voices', 'No offline listening']),
        ('Premium', 11.58, 'month', ['Unlimited reads', '200+ HD voices', 'Offline + celebrity voices']),
        ('Studio', 24, 'month', ['Full Speechify Studio for AI voiceover creation']),
        ('Enterprise', None, 'custom', ['API access', 'Audiobook publisher rates', 'Team licences']),
    ],
    integrations=[
        ('Chrome', 'https://chromewebstore.google.com', 'Browser extension reads any webpage.'),
        ('Safari', 'https://apps.apple.com', 'Native Safari extension on Mac and iOS.'),
        ('Google Docs', 'https://docs.google.com', 'Read Docs files aloud.'),
        ('Speechify Studio API', 'https://speechify.com/api', 'Programmatic voiceover for publishers.'),
    ],
    price=11.58, period='month', free_trial=True, free_version=True, ios=True, android=True,
    pros=['Best reading-assistance app for accessibility', 'Celebrity voices are a hit', 'Cross-platform'],
    cons=['Annual pricing only on Premium', 'Some studio features locked to higher tier'],
    faqs_extra=[
        ('How does Speechify help with dyslexia?', 'Reading aloud with synced highlighting is proven to improve comprehension — Speechify was founded specifically for dyslexia support.'),
        ('What celebrity voices are available?', 'Snoop Dogg, Gwyneth Paltrow, MrBeast, and several others — full list rotates.'),
    ],
)

LISTINGS['krisp'] = dict(
    category='voice-audio',
    tags=['Noise cancellation', 'Meeting transcription', 'Voice productivity'],
    key_features=[
        'Background noise cancellation (any app)', 'Voice cancellation (filter others out)',
        'Echo cancellation', 'Meeting transcription', 'AI meeting notes + summaries',
        'Live translation', 'Accent localization', 'Voice biometric authentication',
        'Cross-platform desktop apps', 'SDK for product builders',
    ],
    tiers=[
        ('Free', 0, 'month', ['60 min/day noise cancellation', 'Basic features']),
        ('Pro', 8, 'month', ['Unlimited noise cancellation', 'Full transcription', 'Meeting notes']),
        ('Business', 16, 'month', ['Team admin', 'Calendar integration', 'Pro features']),
        ('Enterprise', None, 'custom', ['SSO', 'Custom retention', 'Dedicated support']),
    ],
    integrations=[
        ('Zoom', 'https://zoom.us', 'Krisp runs as an audio source in Zoom.'),
        ('Microsoft Teams', 'https://www.microsoft.com/microsoft-teams', 'Native Teams audio compatibility.'),
        ('Google Meet', 'https://meet.google.com', 'Krisp filters audio for Meet calls.'),
        ('SDK', 'https://krisp.ai/developers', 'Embed Krisp noise cancellation in any product.'),
    ],
    price=8, period='month', free_trial=True, free_version=True, ios=False, android=False,
    pros=['Industry-best noise + voice cancellation', 'Works with every meeting platform', 'Strong B2B SDK ecosystem'],
    cons=['Desktop only — no mobile app', 'Some features gated to Business tier'],
    faqs_extra=[
        ('Does Krisp work with my call platform?', 'Yes — Krisp registers as a virtual audio device, so it works in every app: Zoom, Teams, Meet, Webex, Slack, Discord.'),
        ('Does it run on-device?', 'Yes — Krisp processes audio entirely on your device for privacy; no audio leaves your machine.'),
    ],
)


# ─── Generator ────────────────────────────────────────────────────────────────
def render_update(slug, data):
    cat = CATEGORY_DEFAULTS[data["category"]]
    industries = cat["industries"]
    use_cases = cat["use_cases"]
    sizes = cat["company_sizes"]
    support = cat["support_channels"]
    training = cat["training_options"]
    languages = cat["languages"]
    compliance = cat["compliance"]
    pros = (data.get("pros") or []) + cat["pros_extra"]
    cons = (data.get("cons") or []) + cat["cons_extra"]
    # FAQs: listing-specific first, then category-generic
    name_for_faq = slug.replace("-", " ").title()
    # Use the actual name from the listing if available — fallback to slug
    listing_name = data.get("name", name_for_faq)
    faqs = list(data.get("faqs_extra", [])) + cat["faqs_generic"](listing_name)

    sql = f"""-- {slug}
UPDATE submissions SET
  header_tags         = {js_arr(data["tags"])},
  industries_served   = {js_arr(industries)},
  use_cases           = {js_arr(use_cases)},
  target_company_sizes = {js_arr(sizes)},
  key_features        = {js_arr(data["key_features"])},
  features            = {js_arr(data["key_features"])},
  pricing_model       = 'subscription',
  pricing_tiers       = {js_tiers(data["tiers"])},
  integrations        = {js_ints(data["integrations"])},
  support_channels    = {js_arr(support)},
  training_options    = {js_arr(training)},
  languages           = {js_arr(languages)},
  compliance          = {js_arr(compliance)},
  faqs                = {js_faqs(faqs)},
  pros                = {js_arr(pros)},
  cons                = {js_arr(cons)},
  starting_price      = {('NULL' if data.get('price') is None else str(data['price']))},
  starting_price_period = {sq(data.get('period') or 'month')},
  has_free_trial      = {1 if data.get('free_trial') else 0},
  has_free_version    = {1 if data.get('free_version') else 0},
  has_ios_app         = {1 if data.get('ios') else 0},
  has_android_app     = {1 if data.get('android') else 0}
WHERE slug = {sq(slug)};
"""
    return sql


def main():
    out = []
    out.append("-- ============================================================")
    out.append("-- Enrich AI/ML seeded listings — rich JSON fields for the")
    out.append("-- 'Who Uses', Key Features, Pricing, Integrations, Support,")
    out.append("-- FAQs, and Pros & Cons sections on /company/<slug> pages.")
    out.append("--")
    out.append("-- Re-runnable: every UPDATE targets a single slug and overwrites")
    out.append("-- only the rich columns. Listings without overrides here keep")
    out.append("-- their NULL JSON fields and render the empty-state UI.")
    out.append("-- ============================================================")
    out.append("")
    for slug, data in LISTINGS.items():
        out.append(render_update(slug, data))
    SQL_OUT.parent.mkdir(parents=True, exist_ok=True)
    SQL_OUT.write_text("\n".join(out), encoding="utf-8")
    print(f"Wrote {SQL_OUT}  ({SQL_OUT.stat().st_size:,} bytes, {len(LISTINGS)} listings)")


if __name__ == "__main__":
    main()
