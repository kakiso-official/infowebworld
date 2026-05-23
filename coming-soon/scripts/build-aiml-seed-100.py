"""
Build database/seed-aiml-100-listings.sql from the curated list below.

94 new AI/ML listings (in addition to the 6 already seeded: Claude, ChatGPT,
Gemini, Microsoft Copilot, Perplexity, DeepSeek) — chosen as the most-known
real products across the new AI/ML v3 taxonomy.

Each row carries the *credible-claim minimum*: name, real tagline, real 2–3
sentence description, founded year, HQ city/country, team-size band, real
website + socials, category mapping to a v3 L4 slug, and a Clearbit logo
URL. JSON fields that the owner should fill themselves on claim (pricing
tiers, integrations, FAQs, pros/cons, key features) are left NULL on
purpose — the listing page renders empty-state cards for those sections.

Screenshots are populated by a separate Playwright run
(scripts/capture-screenshots.mjs) after the SQL is loaded.

Run:  python scripts/build-aiml-seed-100.py
"""
import json
import re
import sys
import io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

ROOT = Path(__file__).resolve().parents[1]
SQL_OUT = ROOT / "database" / "seed-aiml-100-listings.sql"


def sq(s):
    if s is None:
        return "NULL"
    return "'" + str(s).replace("\\", "\\\\").replace("'", "''") + "'"


def num(v):
    return "NULL" if v is None else str(v)


# ─── 94 AI/ML listings ────────────────────────────────────────────────────────
# Fields:
#   name, domain, l4_slug, tagline, description,
#   founded, city, country (ISO-2), team_size,
#   linkedin (or None), twitter (or None)
LISTINGS = [
    # ── LLMs & Chat Assistants (extra to the 6 seeded) ────────────────────────
    dict(name="Mistral AI", domain="mistral.ai", l4_slug="large-language-models",
         tagline="Open-weight European frontier models — Mistral Large, Codestral, and Le Chat",
         description="Mistral AI is a French AI lab founded in 2023 by ex-Meta and ex-DeepMind researchers, headquartered in Paris. Mistral develops some of the strongest open-weight large language models — Mistral Large, Mixtral, and Codestral — and runs Le Chat, a consumer-facing chat assistant. The company has raised over €1B from a16z, Lightspeed, Nvidia, Microsoft, and others and is the most prominent European AI lab competing with OpenAI and Anthropic.",
         founded=2023, city="Paris", country="FR", team_size="51-200",
         linkedin="https://www.linkedin.com/company/mistralai", twitter="https://twitter.com/mistralai"),

    dict(name="Cohere", domain="cohere.com", l4_slug="large-language-models",
         tagline="Enterprise LLMs and retrieval-augmented generation — built for production",
         description="Cohere is a Toronto-based AI lab founded in 2019 by Aidan Gomez (a co-author of the 'Attention Is All You Need' transformer paper) and Nick Frosst. Cohere builds enterprise-focused large language models including Command R/R+ and Embed/Rerank, optimised for retrieval-augmented generation (RAG) and on-prem deployment. The company is backed by Nvidia, Oracle, Salesforce Ventures, Cisco, and others.",
         founded=2019, city="Toronto", country="CA", team_size="201-500",
         linkedin="https://www.linkedin.com/company/cohere-ai", twitter="https://twitter.com/cohere"),

    dict(name="xAI (Grok)", domain="x.ai", l4_slug="general-chat-assistants",
         tagline="Elon Musk's AI lab and the Grok assistant built into X",
         description="xAI is the AI company founded by Elon Musk in 2023 and the maker of Grok, the AI assistant integrated into X (formerly Twitter). Grok offers real-time access to X data, image generation via Aurora, voice mode, and the high-end Grok-3 model. xAI raised a $6B Series B at a $24B valuation in 2024 and operates the Memphis 'Colossus' supercluster — one of the world's largest GPU training facilities.",
         founded=2023, city="Palo Alto", country="US", team_size="201-500",
         linkedin="https://www.linkedin.com/company/x-ai", twitter="https://twitter.com/xai"),

    dict(name="Character.AI", domain="character.ai", l4_slug="general-chat-assistants",
         tagline="Talk to millions of user-created AI characters — gaming, learning, roleplay",
         description="Character.AI is a consumer AI platform founded in 2021 by ex-Google Brain researchers Noam Shazeer and Daniel De Freitas, the team behind LaMDA. Users can chat with millions of community-created AI characters — from historical figures to fictional companions to language tutors — or create their own. The company licensed its core technology to Google in a 2024 deal valued at $2.7B and remains a top-5 consumer AI app by usage.",
         founded=2021, city="Menlo Park", country="US", team_size="51-200",
         linkedin="https://www.linkedin.com/company/character-ai", twitter="https://twitter.com/character_ai"),

    dict(name="Inflection AI", domain="inflection.ai", l4_slug="general-chat-assistants",
         tagline="Pi — the empathetic AI assistant from the makers of LaMDA",
         description="Inflection AI was founded in 2022 by Mustafa Suleyman (DeepMind co-founder), Reid Hoffman, and Karen Simonyan. The company built Pi, an empathetic conversational AI assistant designed for emotional intelligence rather than task completion. In 2024 Microsoft licensed Inflection's technology and hired most of the team; Pi continues to operate, and the company now licenses LLMs and AI studio tools to enterprises.",
         founded=2022, city="Palo Alto", country="US", team_size="11-50",
         linkedin="https://www.linkedin.com/company/inflection-ai", twitter="https://twitter.com/inflectionAI"),

    dict(name="You.com", domain="you.com", l4_slug="ai-answer-engine",
         tagline="AI search engine for productivity — multimodal, with citations",
         description="You.com is an AI-first search engine founded in 2020 by Richard Socher (former chief scientist at Salesforce) and Bryan McCann. You.com combines real-time web search with multiple LLMs (GPT-4o, Claude, custom models) to deliver cited answers, write code, research, and analyse documents. The company is backed by Salesforce Ventures, Nvidia, Day One, and Marc Benioff and competes with Perplexity in the answer-engine category.",
         founded=2020, city="Palo Alto", country="US", team_size="51-200",
         linkedin="https://www.linkedin.com/company/you-com", twitter="https://twitter.com/YouSearchEngine"),

    dict(name="Poe", domain="poe.com", l4_slug="general-chat-assistants",
         tagline="One subscription, every major AI model — Claude, GPT, Gemini, image, video",
         description="Poe is Quora's AI assistant aggregator, launched in 2022. A single Poe subscription gives access to dozens of frontier and specialist AI models — Claude, GPT-4, Gemini, Llama, Mistral, plus image (DALL-E, Stable Diffusion) and video (Runway, Hailuo) generators — through one chat interface. Poe also lets anyone build and publish custom bots that other users can subscribe to, sharing creator revenue.",
         founded=2022, city="San Francisco", country="US", team_size="51-200",
         linkedin="https://www.linkedin.com/company/quora", twitter="https://twitter.com/poe_platform"),

    dict(name="HuggingChat", domain="huggingface.co", l4_slug="open-source-chat-assistant",
         tagline="Open-source chat assistant from Hugging Face — pick your own model",
         description="HuggingChat is a free, open-source chat assistant operated by Hugging Face, the central hub of the open-source AI community. Users can pick from many community models — Llama 3, Mistral, Qwen, DeepSeek, Cohere Command R+ — and chat for free with web search and tools. The underlying chat-ui project is open source, so the same stack can be self-hosted.",
         founded=2016, city="New York", country="US", team_size="201-500",
         linkedin="https://www.linkedin.com/company/huggingface", twitter="https://twitter.com/huggingface"),

    # ── Image Generation (10) ─────────────────────────────────────────────────
    dict(name="Midjourney", domain="midjourney.com", l4_slug="image-model-playgrounds",
         tagline="AI image generation that turned Discord into the world's biggest creative community",
         description="Midjourney is an independent research lab founded in 2021 by David Holz (co-founder of Leap Motion). Its text-to-image model became culturally famous through its Discord-first interface, where millions of users prompt and remix each other's work. The v6 and v7 model series push photorealism, painterly styles, and consistent characters. Midjourney is profitable, fully bootstrapped, and one of the most-used generative-image services in the world.",
         founded=2021, city="San Francisco", country="US", team_size="11-50",
         linkedin="https://www.linkedin.com/company/midjourney", twitter="https://twitter.com/midjourney"),

    dict(name="Stability AI", domain="stability.ai", l4_slug="image-model-playgrounds",
         tagline="The lab behind Stable Diffusion — open models for image, video, audio, and 3D",
         description="Stability AI, founded in 2019 and headquartered in London, is the open-source AI lab behind the Stable Diffusion family of image models — the most widely deployed open-weight image generation system in the world. It also publishes Stable Video, Stable Audio, Stable LM, and Stable Diffusion 3, used by millions of developers and the creators of tools like Leonardo, NightCafe, and Recraft.",
         founded=2019, city="London", country="GB", team_size="51-200",
         linkedin="https://www.linkedin.com/company/stability-ai", twitter="https://twitter.com/StabilityAI"),

    dict(name="Adobe Firefly", domain="firefly.adobe.com", l4_slug="image-model-playgrounds",
         tagline="Adobe's commercially-safe generative AI built into Photoshop, Illustrator, and Express",
         description="Firefly is Adobe's family of generative AI models, launched in 2023 and trained exclusively on Adobe Stock plus public-domain content — so output is licensed for commercial use. Firefly powers Generative Fill in Photoshop, Generative Recolor in Illustrator, text-to-template in Express, and Firefly Video. Tightly integrated with the Creative Cloud subscription and used by tens of millions of designers.",
         founded=1982, city="San Jose", country="US", team_size="1000+",
         linkedin="https://www.linkedin.com/company/adobe", twitter="https://twitter.com/Adobe"),

    dict(name="DALL-E", domain="openai.com", l4_slug="image-model-playgrounds",
         tagline="OpenAI's image generation model — built into ChatGPT and the API",
         description="DALL-E is OpenAI's text-to-image model series, launched in 2021 and now in its third generation. DALL-E 3 is tightly integrated with ChatGPT — users can prompt it in plain language and iterate by replying — and is also available via the OpenAI API for developers. It's a benchmark for high-fidelity, instruction-following image generation.",
         founded=2015, city="San Francisco", country="US", team_size="1000+",
         linkedin="https://www.linkedin.com/company/openai", twitter="https://twitter.com/OpenAI"),

    dict(name="Leonardo.AI", domain="leonardo.ai", l4_slug="image-model-playgrounds",
         tagline="AI image and video for creators — game assets, marketing visuals, and more",
         description="Leonardo.AI is an Australian generative-image platform launched in 2022, acquired by Canva in 2024. Leonardo specialises in fine-tuned models for distinct creative use cases — game assets, character design, photography, marketing visuals — plus a real-time canvas, video generation, and an enterprise API. It's a go-to for creators who want control beyond the consumer-grade tools.",
         founded=2022, city="Sydney", country="AU", team_size="51-200",
         linkedin="https://www.linkedin.com/company/leonardo-ai", twitter="https://twitter.com/LeonardoAi_"),

    dict(name="Ideogram", domain="ideogram.ai", l4_slug="image-model-playgrounds",
         tagline="AI images with the best in-image text — posters, logos, mockups",
         description="Ideogram was founded in 2023 by ex-Google Brain researchers, notably Mohammad Norouzi and other authors of Imagen. The Ideogram 2.0 and 3.0 models are best known for accurately rendering text inside images — making it the go-to tool for posters, ads, social graphics, and logo mockups. The product is available on the web and via API, with a generous free tier.",
         founded=2023, city="Toronto", country="CA", team_size="11-50",
         linkedin="https://www.linkedin.com/company/ideogram-ai", twitter="https://twitter.com/ideogram_ai"),

    dict(name="Krea AI", domain="krea.ai", l4_slug="image-model-playgrounds",
         tagline="Real-time AI canvas — paint with prompts, in real time",
         description="Krea AI launched in 2023 with a real-time generative canvas that updates as the user paints or types, popularising the live diffusion workflow. The product spans image generation, real-time enhance, video, training custom styles, and a 3D-aware reference workflow. Krea is a favourite among designers and creative directors prototyping mood boards and pitch visuals.",
         founded=2023, city="San Francisco", country="US", team_size="11-50",
         linkedin="https://www.linkedin.com/company/kreaai", twitter="https://twitter.com/krea_ai"),

    dict(name="Recraft", domain="recraft.ai", l4_slug="image-model-playgrounds",
         tagline="The designer's AI tool — vector, consistent style, real text",
         description="Recraft is a UK-based generative image tool founded in 2022, built specifically for designers. Its custom v3 model excels at vector output (SVG), generating consistent style sets, and accurate text — features that make it more useful than general-purpose generators for icon sets, brand kits, illustrations, and merch mockups.",
         founded=2022, city="London", country="GB", team_size="11-50",
         linkedin="https://www.linkedin.com/company/recraft-ai", twitter="https://twitter.com/recraftai"),

    dict(name="Playground AI", domain="playground.com", l4_slug="image-model-playgrounds",
         tagline="Free AI image generation — Stable Diffusion plus Playground's own models",
         description="Playground is a free-tier-heavy text-to-image platform popular with hobbyists and indie creators. It serves multiple model backends (Playground v2.5/v3, Stable Diffusion, Flux), with strong free quotas and a familiar web canvas. Founded in 2022 in San Francisco by Suhail Doshi (Mixpanel co-founder), it's profitable and growing organically.",
         founded=2022, city="San Francisco", country="US", team_size="11-50",
         linkedin="https://www.linkedin.com/company/playground-ai", twitter="https://twitter.com/playground_ai"),

    dict(name="Flux (Black Forest Labs)", domain="blackforestlabs.ai", l4_slug="image-model-playgrounds",
         tagline="The Flux image models from the original Stable Diffusion team",
         description="Black Forest Labs was founded in 2024 by Robin Rombach and the original Stable Diffusion team after leaving Stability AI. Their Flux series (Flux.1 dev, schnell, pro, and Flux.1.1 pro) sets the state of the art for open-weight image generation and powers high-end use across many third-party tools. Based in Freiburg, Germany.",
         founded=2024, city="Freiburg", country="DE", team_size="11-50",
         linkedin="https://www.linkedin.com/company/black-forest-labs", twitter="https://twitter.com/bfl_ml"),

    # ── Video Generation (8) ──────────────────────────────────────────────────
    dict(name="Runway", domain="runwayml.com", l4_slug="video-model-playgrounds",
         tagline="AI video generation and editing — Gen-3 Alpha and the Act-One pipeline",
         description="Runway is a generative-video company founded in 2018 in New York. Its Gen-1, Gen-2, and Gen-3 Alpha models established text-to-video and image-to-video as a real product category, used by Hollywood VFX teams and indie creators. Runway also publishes professional video editing tools, including motion brush, lip-sync, and Act-One (performance-to-character motion transfer).",
         founded=2018, city="New York", country="US", team_size="51-200",
         linkedin="https://www.linkedin.com/company/runwayml", twitter="https://twitter.com/runwayml"),

    dict(name="Pika Labs", domain="pika.art", l4_slug="video-model-playgrounds",
         tagline="Text-to-video on a Discord-first interface — playful, fast, social",
         description="Pika is a generative-video startup founded in 2023 by Demi Guo and Chenlin Meng. Pika 1.5 and 2.0 brought consumer-friendly video gen via a Discord and web interface with strong control over motion, lip-sync, and visual effects ('Pikaffects'). It has raised over $100M from Lightspeed, Spark Capital, and Nat Friedman among others.",
         founded=2023, city="Palo Alto", country="US", team_size="11-50",
         linkedin="https://www.linkedin.com/company/pika-labs", twitter="https://twitter.com/pika_labs"),

    dict(name="Synthesia", domain="synthesia.io", l4_slug="video-model-playgrounds",
         tagline="Studio-grade AI avatar videos — corporate training, marketing, multilingual",
         description="Synthesia is the leader in AI avatar video generation, founded in 2017 in London. Users type a script and Synthesia produces a finished video with a realistic AI presenter in 140+ languages. Used by 60%+ of Fortune 100 companies for training, communications, and customer support content. Valued at over $2B following its 2024 Series D from NEA, Accel, and Nvidia.",
         founded=2017, city="London", country="GB", team_size="201-500",
         linkedin="https://www.linkedin.com/company/synthesia-technologies", twitter="https://twitter.com/synthesiaIO"),

    dict(name="HeyGen", domain="heygen.com", l4_slug="video-model-playgrounds",
         tagline="AI video and avatar studio — viral translation, lip-sync, and live avatars",
         description="HeyGen is an AI video generation platform founded in 2020 by Joshua Xu, headquartered in Los Angeles. The product produces avatar videos, custom voice clones, and the viral 'video translation' feature that re-dubs and re-lip-syncs a person speaking in another language. HeyGen is reportedly the fastest-growing avatar video startup, used by global enterprises for marketing and training.",
         founded=2020, city="Los Angeles", country="US", team_size="51-200",
         linkedin="https://www.linkedin.com/company/heygen-com", twitter="https://twitter.com/HeyGen_Official"),

    dict(name="D-ID", domain="d-id.com", l4_slug="video-model-playgrounds",
         tagline="Photoreal talking avatars for video, customer service, and creative use",
         description="D-ID is an Israeli AI company founded in 2017 that pioneered photorealistic talking-head video from a single still image. Its Creative Reality Studio is used for corporate training, customer-service avatars, language learning, and the famous MyHeritage 'Deep Nostalgia' feature. D-ID also licenses real-time avatars for video calls and agents.",
         founded=2017, city="Tel Aviv", country="IL", team_size="51-200",
         linkedin="https://www.linkedin.com/company/d-id", twitter="https://twitter.com/D_ID_"),

    dict(name="Luma AI", domain="lumalabs.ai", l4_slug="video-model-playgrounds",
         tagline="Dream Machine — text-to-video plus Genie 3D capture",
         description="Luma AI is a generative 3D and video lab founded in 2021 in Palo Alto. Its Dream Machine video model is one of the consumer-friendliest text-to-video systems, and Genie/NeRF capture turns phone footage into navigable 3D scenes used by Hollywood VFX. Backed by a16z, Amplify, and Nvidia.",
         founded=2021, city="Palo Alto", country="US", team_size="11-50",
         linkedin="https://www.linkedin.com/company/lumalabs-ai", twitter="https://twitter.com/LumaLabsAI"),

    dict(name="KLING AI", domain="klingai.com", l4_slug="video-model-playgrounds",
         tagline="Kuaishou's frontier text-to-video model — long-clip, motion-rich generation",
         description="KLING AI is the consumer text-to-video product from Kuaishou, the Chinese short-video platform. KLING 1.5/1.6/2.0 produces longer, motion-rich clips with strong physics and is widely considered the closest open competitor to OpenAI's Sora. Used worldwide via a web app and API.",
         founded=2024, city="Beijing", country="CN", team_size="201-500",
         linkedin=None, twitter="https://twitter.com/Kling_ai"),

    dict(name="Hailuo AI (MiniMax)", domain="hailuoai.video", l4_slug="video-model-playgrounds",
         tagline="MiniMax's Hailuo — high-detail text-to-video and image-to-video",
         description="Hailuo AI is the consumer video app from MiniMax, the Shanghai-based AI lab. Hailuo's video models (i-01 and t2v-01) produce highly detailed clips with realistic motion and strong prompt adherence — a top-tier alternative to Runway, Kling, and Sora. MiniMax also publishes the abab LLM series and Talkie character chat app.",
         founded=2021, city="Shanghai", country="CN", team_size="201-500",
         linkedin="https://www.linkedin.com/company/minimax-ai", twitter="https://twitter.com/Hailuo_AI"),

    # ── Voice / Audio (8) ─────────────────────────────────────────────────────
    dict(name="ElevenLabs", domain="elevenlabs.io", l4_slug="ai-voice-tts",
         tagline="The most realistic AI voice — text-to-speech, voice cloning, dubbing",
         description="ElevenLabs is a London-based generative-voice company founded in 2022 by ex-Palantir Piotr Dabkowski and ex-Google Mati Staniszewski. The platform powers studio-grade text-to-speech, voice cloning, multilingual dubbing, and Conversational AI agents in 32 languages. Used by global publishers, gaming studios, and audiobook houses. Valued at over $3B following its 2024 Series C from a16z, ICONIQ, NEA, and Sequoia.",
         founded=2022, city="London", country="GB", team_size="201-500",
         linkedin="https://www.linkedin.com/company/elevenlabsio", twitter="https://twitter.com/elevenlabsio"),

    dict(name="Suno", domain="suno.com", l4_slug="ai-song-generator",
         tagline="AI-generated music — a full song from a prompt, lyrics included",
         description="Suno is an AI music platform founded in 2022 in Cambridge, MA. The product generates full songs — vocals, lyrics, instrumental — from a short text prompt, with style presets across genres and the option to upload audio for continuation. Suno raised a $125M Series B from Lightspeed and remains a category leader against Udio.",
         founded=2022, city="Cambridge", country="US", team_size="11-50",
         linkedin="https://www.linkedin.com/company/suno-music", twitter="https://twitter.com/sunomusic"),

    dict(name="Udio", domain="udio.com", l4_slug="ai-song-generator",
         tagline="Generative music with vocal-quality lead — by ex-DeepMind founders",
         description="Udio is a generative music platform launched in 2024 by ex-DeepMind researchers including David Ding. Udio is widely regarded for its vocal generation quality and prompt fidelity across genres, with a long-prompt control system that lets users sculpt arrangements and styles. Backed by a16z and Will.i.am.",
         founded=2023, city="New York", country="US", team_size="11-50",
         linkedin="https://www.linkedin.com/company/udio-ai", twitter="https://twitter.com/udiomusic"),

    dict(name="Murf AI", domain="murf.ai", l4_slug="ai-voice-tts",
         tagline="Studio-grade AI voiceover for marketing, e-learning, and product demos",
         description="Murf is an AI voice generator founded in 2020 in Salt Lake City and Bengaluru. The platform offers 120+ studio-quality voices in 20+ languages, voice cloning, time-synced media library, and an API. Widely used by L&D teams, video creators, and marketing teams for narration that doesn't need a studio booking.",
         founded=2020, city="Bengaluru", country="IN", team_size="51-200",
         linkedin="https://www.linkedin.com/company/murf-ai", twitter="https://twitter.com/murfai"),

    dict(name="Resemble AI", domain="resemble.ai", l4_slug="ai-voice-tts",
         tagline="Custom AI voice cloning with deepfake detection — enterprise-grade",
         description="Resemble AI is a Toronto-based AI voice company founded in 2019. The product pairs high-quality voice cloning (5+ languages from a single recording) with enterprise security: deepfake detection via the Resemble Detect API, voice provenance audit logs, and on-prem deployment. Used by media, contact centres, and government clients.",
         founded=2019, city="Toronto", country="CA", team_size="11-50",
         linkedin="https://www.linkedin.com/company/resemble-ai", twitter="https://twitter.com/resembleai"),

    dict(name="Play.ht", domain="play.ht", l4_slug="ai-voice-tts",
         tagline="Generative voice for content, podcasts, and Conversational AI agents",
         description="PlayHT (Play.ht) is a US-based text-to-speech company founded in 2016. The platform offers 800+ AI voices in 100+ languages plus its own PlayDialog model for natural-sounding 2-voice dialogues — heavily used by podcasters, audiobook creators, and developers building Voice AI agents.",
         founded=2016, city="San Francisco", country="US", team_size="11-50",
         linkedin="https://www.linkedin.com/company/playht", twitter="https://twitter.com/play_ht"),

    dict(name="Speechify", domain="speechify.com", l4_slug="ai-voice-tts",
         tagline="Read anything aloud — articles, PDFs, books, docs — with celebrity voices",
         description="Speechify is a US text-to-speech consumer app founded in 2017 by Cliff Weitzman to help people with dyslexia. The product reads any text — webpages, PDFs, docs, books — aloud, with high-quality AI voices including celebrity-licensed voices (Snoop Dogg, Gwyneth Paltrow, MrBeast). Top-grossing iOS productivity app with over 30M users.",
         founded=2017, city="Miami", country="US", team_size="201-500",
         linkedin="https://www.linkedin.com/company/getspeechify", twitter="https://twitter.com/speechify"),

    dict(name="Krisp", domain="krisp.ai", l4_slug="ai-noise-remover",
         tagline="AI noise cancellation, transcription, and meeting notes — built into every call",
         description="Krisp is an AI voice productivity company founded in 2017 by Davit Baghdasaryan and Artavazd Minasyan. Krisp's core product cancels background noise from microphone input across any app (Zoom, Teams, Meet) and is bundled with most major call platforms. The app now also handles meeting transcription, summaries, and live translation.",
         founded=2017, city="Berkeley", country="US", team_size="51-200",
         linkedin="https://www.linkedin.com/company/krisp-technologies", twitter="https://twitter.com/krispHQ"),

    # ── Code / Developer Tools (10) ───────────────────────────────────────────
    dict(name="GitHub Copilot", domain="github.com", l4_slug="ai-code-completion",
         tagline="The pair-programmer-in-your-editor — autocomplete and chat for code",
         description="GitHub Copilot is GitHub's AI pair-programmer, built on OpenAI models, launched in 2021. Copilot offers inline code completion, chat, code explanation, test generation, and PR review across every major IDE. With over 1.8M paid subscribers (and free for verified students/teachers/OSS maintainers), it remains the most-used AI coding assistant in the world.",
         founded=2008, city="San Francisco", country="US", team_size="1000+",
         linkedin="https://www.linkedin.com/company/github", twitter="https://twitter.com/github"),

    dict(name="Cursor", domain="cursor.com", l4_slug="ai-code-completion",
         tagline="The AI-first code editor — Composer, agent mode, and instant codebase search",
         description="Cursor is the AI-first code editor from Anysphere, founded in 2022 in San Francisco. A fork of VS Code, Cursor adds agentic features like Composer (multi-file edits), background agents, codebase indexing, and tight integration with Claude/GPT/Gemini. It became the fastest-growing developer tool in 2024 and one of the most beloved IDEs by AI-native engineers.",
         founded=2022, city="San Francisco", country="US", team_size="11-50",
         linkedin="https://www.linkedin.com/company/anysphere", twitter="https://twitter.com/cursor_ai"),

    dict(name="Codeium / Windsurf", domain="codeium.com", l4_slug="ai-code-completion",
         tagline="Free AI autocomplete for every IDE, plus the Windsurf agentic editor",
         description="Codeium, founded in 2021 by ex-Quora and ex-Nuro engineers, ships a free AI coding extension for 40+ IDEs and Windsurf — its own AI-first editor that introduced 'Cascade' agentic edits. Codeium serves over 1M developers free and serves the enterprise tier under SSO + on-prem options.",
         founded=2021, city="Mountain View", country="US", team_size="51-200",
         linkedin="https://www.linkedin.com/company/codeium", twitter="https://twitter.com/codeiumdev"),

    dict(name="Tabnine", domain="tabnine.com", l4_slug="ai-code-completion",
         tagline="Enterprise-grade AI code assistant — on-prem, privacy-first, your code never leaves",
         description="Tabnine is one of the original AI code-completion companies, founded in 2013 (then called Codota). Tabnine's enterprise tier is on-prem or VPC-deployed, trained only on permissively-licensed code, with full provenance and zero data retention — a key choice for regulated industries that can't use Copilot or Cursor.",
         founded=2013, city="Tel Aviv", country="IL", team_size="51-200",
         linkedin="https://www.linkedin.com/company/tabnine", twitter="https://twitter.com/tabnine"),

    dict(name="Replit", domain="replit.com", l4_slug="ai-code-completion",
         tagline="Build, deploy, and host apps in the browser — with Replit Agent doing the work",
         description="Replit is a browser-based development platform founded in 2016 by Amjad Masad and Faris Masad. Replit AI (originally Ghostwriter) and the 2024 Replit Agent let users build full-stack web apps with natural-language prompts — the agent writes, runs, deploys, and iterates on the code. Used in classrooms worldwide and by indie hackers who ship in hours.",
         founded=2016, city="San Francisco", country="US", team_size="201-500",
         linkedin="https://www.linkedin.com/company/replit", twitter="https://twitter.com/replit"),

    dict(name="v0 by Vercel", domain="v0.dev", l4_slug="ai-code-completion",
         tagline="Generative UI for React + shadcn — from prompt to production",
         description="v0 is Vercel's generative-UI tool, launched in 2023. Users describe an interface in plain English (or attach a screenshot) and v0 produces production-quality React/Next.js components styled with shadcn/ui and Tailwind. Each generation can be opened in a forkable workspace, deployed to Vercel, or pulled into an existing codebase via the v0 CLI.",
         founded=2015, city="San Francisco", country="US", team_size="201-500",
         linkedin="https://www.linkedin.com/company/vercel", twitter="https://twitter.com/vercel"),

    dict(name="Devin (Cognition Labs)", domain="cognition.ai", l4_slug="ai-coding-agents",
         tagline="The first autonomous AI software engineer — plans, codes, debugs, ships",
         description="Cognition Labs, founded in 2023 in San Francisco, builds Devin — the first widely-publicised autonomous AI software engineer. Devin is given a task and a sandboxed environment, then plans, writes code, runs tests, and submits PRs end-to-end. Used by engineering teams at Nubank, Goldman Sachs, and others as a teammate that handles tickets autonomously.",
         founded=2023, city="San Francisco", country="US", team_size="11-50",
         linkedin="https://www.linkedin.com/company/cognition-ai", twitter="https://twitter.com/cognition_labs"),

    dict(name="Bolt.new (StackBlitz)", domain="bolt.new", l4_slug="ai-code-completion",
         tagline="Prompt-to-app web IDE — full-stack apps that run instantly in the browser",
         description="Bolt.new is StackBlitz's prompt-to-app web IDE, launched in 2024. Users describe an app, Bolt builds it in seconds — Vite/Next/Astro/Vue — running entirely in a WebContainer in the browser, with live preview, package management, and one-click deploy to Netlify. StackBlitz reported 5M+ users in the first 60 days.",
         founded=2017, city="Boise", country="US", team_size="51-200",
         linkedin="https://www.linkedin.com/company/stackblitz", twitter="https://twitter.com/stackblitz"),

    dict(name="Lovable", domain="lovable.dev", l4_slug="ai-code-completion",
         tagline="Build full-stack apps from a chat — by the GPT-Engineer team",
         description="Lovable, founded in 2023 in Stockholm by Anton Osika (creator of GPT-Engineer), is a prompt-to-app builder for full-stack web apps. The chat UI generates real React + Supabase code, lets the user iterate in natural language, and one-click deploys. It's one of the fastest-growing European AI startups.",
         founded=2023, city="Stockholm", country="SE", team_size="11-50",
         linkedin="https://www.linkedin.com/company/lovable-dev", twitter="https://twitter.com/lovable_dev"),

    dict(name="Aider", domain="aider.chat", l4_slug="ai-coding-agents",
         tagline="Open-source AI pair-programmer in the terminal — git-aware, model-agnostic",
         description="Aider is an open-source AI coding assistant that runs in the terminal alongside a git repo. Aider edits files in place, commits intermediate changes, and works with any LLM (Claude, GPT, Gemini, Llama, DeepSeek). It's a favourite of engineers who want full control and prefer the CLI over a hosted editor.",
         founded=2023, city="San Francisco", country="US", team_size="1-10",
         linkedin=None, twitter="https://twitter.com/paulgauthier"),

    # ── AI Agents (6) ─────────────────────────────────────────────────────────
    dict(name="AutoGPT", domain="agpt.co", l4_slug="autonomous-agents",
         tagline="The viral open-source autonomous AI agent — give it a goal, it does the rest",
         description="AutoGPT, created by Toran Bruce Richards (Significant Gravitas) in 2023, became the canonical example of an autonomous AI agent — a loop that breaks down a goal, takes web/file actions, and self-corrects. The hosted platform (AutoGPT.co) lets non-developers build no-code agents on top of the same engine. 170k+ GitHub stars.",
         founded=2023, city="London", country="GB", team_size="11-50",
         linkedin="https://www.linkedin.com/company/significant-gravitas", twitter="https://twitter.com/Auto_GPT"),

    dict(name="MultiOn", domain="multion.ai", l4_slug="ai-computer-use-agent",
         tagline="An AI agent that uses the web like a human — for you",
         description="MultiOn, founded in 2023 by Div Garg in Palo Alto, is a personal AI agent that operates a real browser on your behalf — orders takeout, books flights, files expense reports, scrapes a list of contacts. The agent works on natural-language instructions and is one of the longest-running web-agent products outside the big labs.",
         founded=2023, city="Palo Alto", country="US", team_size="11-50",
         linkedin="https://www.linkedin.com/company/multion-ai", twitter="https://twitter.com/multion_ai"),

    dict(name="Adept", domain="adept.ai", l4_slug="ai-computer-use-agent",
         tagline="The AI teammate for knowledge work — Fuyu and ACT-1 action models",
         description="Adept is an AI lab founded in 2022 by ex-Google/OpenAI researchers including David Luan and Niki Parmar (a transformer paper author). Adept builds 'action models' that take goals and execute multi-step work across web apps. The team partly joined Amazon in 2024, but Adept's models continue to ship.",
         founded=2022, city="San Francisco", country="US", team_size="51-200",
         linkedin="https://www.linkedin.com/company/adept-ai-labs", twitter="https://twitter.com/AdeptAILabs"),

    dict(name="Lindy AI", domain="lindy.ai", l4_slug="ai-task-agent",
         tagline="No-code AI agents for sales, support, and ops — build a Lindy that does the work",
         description="Lindy AI is a no-code platform for building AI agents that automate sales outreach, customer support, recruiting workflows, and personal admin. Founded in 2023 by Flo Crivello in San Francisco. Users describe a workflow in plain English and Lindy generates an agent that connects to Gmail, Slack, calendars, CRMs, and the web.",
         founded=2023, city="San Francisco", country="US", team_size="11-50",
         linkedin="https://www.linkedin.com/company/lindy-ai", twitter="https://twitter.com/lindyai"),

    dict(name="Relevance AI", domain="relevanceai.com", l4_slug="ai-task-agent",
         tagline="No-code AI workforce — build agents and tools that run business processes",
         description="Relevance AI is an Australian platform for building AI agents and tools without code. Customers compose multi-step workflows that combine LLMs, tool calling, and data — used by sales teams, customer service, and BPOs as an 'AI workforce'. Backed by Insight Partners and Peak XV.",
         founded=2020, city="Sydney", country="AU", team_size="51-200",
         linkedin="https://www.linkedin.com/company/relevance-ai", twitter="https://twitter.com/relevanceai_"),

    dict(name="CrewAI", domain="crewai.com", l4_slug="ai-task-agent",
         tagline="Open-source framework + cloud for orchestrating teams of AI agents",
         description="CrewAI is an open-source Python framework for orchestrating role-playing, autonomous AI agents — first released in 2024 by João Moura. The CrewAI Enterprise cloud lets companies deploy 'crews' (multiple specialised agents collaborating) into production, with observability and human-in-the-loop control. Used inside Fortune 500 ops teams.",
         founded=2023, city="San Francisco", country="US", team_size="11-50",
         linkedin="https://www.linkedin.com/company/crewai-inc", twitter="https://twitter.com/crewAIInc"),

    # ── AI Writing (8) ────────────────────────────────────────────────────────
    dict(name="Jasper", domain="jasper.ai", l4_slug="ai-copywriting-tools",
         tagline="AI for marketing teams — campaigns, brand voice, and content at scale",
         description="Jasper is one of the original marketing-AI suites, founded in 2021 by Dave Rogenmoser in Austin. The product helps marketing teams produce campaign briefs, blog posts, ads, social copy, and emails tuned to a 'brand voice' style, with integrations to Google Docs, Webflow, Surfer SEO, and HubSpot. Used by Cisco, Anthropic, and other large brands.",
         founded=2021, city="Austin", country="US", team_size="201-500",
         linkedin="https://www.linkedin.com/company/heyjasperai", twitter="https://twitter.com/heyjasperai"),

    dict(name="Copy.ai", domain="copy.ai", l4_slug="ai-copywriting-tools",
         tagline="GTM AI platform — workflows that run sales and marketing on autopilot",
         description="Copy.ai started in 2020 as an AI copywriting tool and has since pivoted into a 'GTM AI' workflow platform. Users assemble multi-step automations that combine LLMs, CRM data, and the web to power outbound sequences, content production, and lead enrichment. Founded by Paul Yacoubian and Chris Lu.",
         founded=2020, city="Memphis", country="US", team_size="51-200",
         linkedin="https://www.linkedin.com/company/copy-ai", twitter="https://twitter.com/copy_ai"),

    dict(name="Writesonic", domain="writesonic.com", l4_slug="ai-copywriting-tools",
         tagline="AI content + Chatsonic + Botsonic — write, chat, and deploy AI agents",
         description="Writesonic is an Indian-American AI content platform founded in 2020 by Samanyou Garg. The suite includes long-form article writing (with SEO scoring), Chatsonic (a chat assistant with internet access), and Botsonic (a no-code chatbot builder used by SMBs for support and lead capture). Y Combinator W21.",
         founded=2020, city="Bengaluru", country="IN", team_size="51-200",
         linkedin="https://www.linkedin.com/company/writesonic", twitter="https://twitter.com/writesonic"),

    dict(name="Rytr", domain="rytr.com", l4_slug="ai-copywriting-tools",
         tagline="Budget-friendly AI writing assistant for everyday content",
         description="Rytr is a low-cost AI writing tool founded in 2021 by Abhi Godara in Delhi. With 40+ use cases (blog ideas, emails, ad copy, product descriptions, video scripts) and 30+ languages, Rytr targets solopreneurs and small teams — its 'Saver' plan ($9/mo) made it one of the most affordable AI writing tools in the market.",
         founded=2021, city="Delhi", country="IN", team_size="11-50",
         linkedin="https://www.linkedin.com/company/rytr-me", twitter="https://twitter.com/rytrhq"),

    dict(name="Notion AI", domain="notion.so", l4_slug="ai-collaborative-doc-editor",
         tagline="AI features built into the Notion workspace — summarise, write, draft, Q&A",
         description="Notion AI is Notion's set of AI features for its workspace product, launched in 2023. Users can summarise pages, generate first drafts, translate, brainstorm, and Q&A their entire workspace. Notion AI is included in the Business and Enterprise plans and serves Notion's 100M+ users.",
         founded=2013, city="San Francisco", country="US", team_size="201-500",
         linkedin="https://www.linkedin.com/company/notionhq", twitter="https://twitter.com/NotionHQ"),

    dict(name="Sudowrite", domain="sudowrite.com", l4_slug="ai-novel-writer",
         tagline="AI for fiction writers — beats, scenes, character voice, world-building",
         description="Sudowrite is the leading AI writing assistant specifically for novelists and screenwriters. Founded in 2020 by Amit Gupta and James Yu in San Francisco, it offers a 'Story Engine' that helps plot a novel, scene-by-scene writing, brainstorming, character voice and style emulation, and a community of fiction writers. Used by published authors and Hollywood screenwriters.",
         founded=2020, city="San Francisco", country="US", team_size="1-10",
         linkedin="https://www.linkedin.com/company/sudowrite", twitter="https://twitter.com/sudowrite"),

    dict(name="Wordtune (AI21 Labs)", domain="wordtune.com", l4_slug="ai-copywriting-tools",
         tagline="AI writing assistant — rewrite, summarise, and improve clarity in any browser",
         description="Wordtune is the consumer product of AI21 Labs, an Israeli AI research company founded in 2017. The product is a browser extension that rewrites, shortens, expands, and tone-shifts text in any web app — Gmail, LinkedIn, Docs, Slack — and powers the AI21 Spaces document workspace. Used by 10M+ professionals.",
         founded=2017, city="Tel Aviv", country="IL", team_size="201-500",
         linkedin="https://www.linkedin.com/company/ai21", twitter="https://twitter.com/wordtune"),

    dict(name="Grammarly", domain="grammarly.com", l4_slug="ai-copywriting-tools",
         tagline="AI writing assistance for grammar, style, tone, and clarity — across every app",
         description="Grammarly, founded in 2009 in Kyiv by Alex Shevchenko and Max Lytvyn (now headquartered in San Francisco), is the most widely-used AI writing assistant in the world with over 30M daily users and 50,000+ enterprise customers. The product spans real-time corrections, generative AI drafting, brand-voice enforcement, and now agentic communication assistance.",
         founded=2009, city="San Francisco", country="US", team_size="1000+",
         linkedin="https://www.linkedin.com/company/grammarly", twitter="https://twitter.com/Grammarly"),

    # ── Research & Search (6) ─────────────────────────────────────────────────
    dict(name="Consensus", domain="consensus.app", l4_slug="ai-research-assistants",
         tagline="Search 200M scientific papers — get evidence-based answers, not hot takes",
         description="Consensus is an academic-search AI that answers research questions using over 200M peer-reviewed papers. Founded in 2022 in Boston, the product surfaces consensus across studies (yes/no/mixed), with citations and quality indicators. Used by clinicians, journalists, researchers, and policymakers as an alternative to citing whatever ChatGPT remembers.",
         founded=2022, city="Boston", country="US", team_size="11-50",
         linkedin="https://www.linkedin.com/company/consensus-ai", twitter="https://twitter.com/consensus_app"),

    dict(name="Elicit", domain="elicit.com", l4_slug="ai-research-assistants",
         tagline="AI research assistant for systematic reviews — find, extract, synthesize",
         description="Elicit is an AI research tool for systematic reviews and literature search, spun out of Ought in 2022. Researchers describe a question and Elicit finds relevant papers from a 125M-paper corpus, then extracts results into structured tables and synthesises findings. Used by academic and policy researchers worldwide.",
         founded=2018, city="San Francisco", country="US", team_size="11-50",
         linkedin="https://www.linkedin.com/company/elicit", twitter="https://twitter.com/elicitorg"),

    dict(name="SciSpace", domain="scispace.com", l4_slug="ai-research-assistants",
         tagline="Read, write, and discover research papers — AI copilot for academics",
         description="SciSpace (formerly Typeset) is an AI research workspace founded in 2015 in Bengaluru. It pairs an LLM-powered PDF copilot with a 290M-paper search index, a literature-review tool, citation generator, and an LaTeX-compatible writing tool. Used by 1M+ researchers worldwide.",
         founded=2015, city="Bengaluru", country="IN", team_size="51-200",
         linkedin="https://www.linkedin.com/company/scispace", twitter="https://twitter.com/scispace"),

    dict(name="Andi", domain="andisearch.com", l4_slug="ai-answer-engine",
         tagline="Ad-free AI search that gives answers, not blue links",
         description="Andi is a small, scrappy ad-free AI search engine founded in 2021 by Angela Hoover and Jed White. Andi gives a direct answer to the user's question with sourced citations, no ads, no SEO spam, and a friendly chat interface. A favourite of privacy-minded and SEO-allergic users.",
         founded=2021, city="Miami", country="US", team_size="1-10",
         linkedin="https://www.linkedin.com/company/andi-search", twitter="https://twitter.com/andisearch"),

    dict(name="ResearchRabbit", domain="researchrabbitapp.com", l4_slug="ai-research-assistants",
         tagline="The Spotify of papers — discover related research visually",
         description="ResearchRabbit is a free academic discovery tool launched in 2021 by Michael Liu and Hong Zhu. Users build collections of seed papers and the app surfaces visually-mapped graphs of related work, citing/cited-by papers, and similar authors. Genuinely changes how PhD students do literature reviews.",
         founded=2021, city="New York", country="US", team_size="1-10",
         linkedin="https://www.linkedin.com/company/researchrabbit", twitter="https://twitter.com/researchrabbit"),

    dict(name="ChatPDF", domain="chatpdf.com", l4_slug="ai-research-assistants",
         tagline="Chat with any PDF — research papers, contracts, manuals, textbooks",
         description="ChatPDF is a viral consumer tool launched in 2023 by Mathis Lichtenberger that lets users upload any PDF and chat with it — Q&A, summaries, page-cited answers. Free for occasional use; paid tier for longer documents and Pro features. Tens of millions of PDFs processed.",
         founded=2023, city="Berlin", country="DE", team_size="1-10",
         linkedin=None, twitter="https://twitter.com/chatpdf"),

    # ── Productivity / Meeting (8) ────────────────────────────────────────────
    dict(name="Otter.ai", domain="otter.ai", l4_slug="ai-meeting-assistants",
         tagline="AI meeting notes, transcripts, and action items — live and post-call",
         description="Otter.ai is one of the original AI meeting assistants, founded in 2016 in Mountain View. The product transcribes meetings (Zoom/Teams/Meet/in-person), summarises them, captures action items, and is used as a 'second-brain' by sales teams, journalists, and academics. Tens of millions of meetings transcribed.",
         founded=2016, city="Mountain View", country="US", team_size="51-200",
         linkedin="https://www.linkedin.com/company/otter-ai", twitter="https://twitter.com/otter_ai"),

    dict(name="Fireflies.ai", domain="fireflies.ai", l4_slug="ai-meeting-assistants",
         tagline="AI notetaker that joins your meetings, records, transcribes, and analyses",
         description="Fireflies is an AI meeting assistant founded in 2016 in San Francisco. Its Fred bot joins meetings across Zoom/Teams/Meet/Webex, records and transcribes, generates summaries and action items, and produces conversation analytics — sentiment, talk-listen ratios, topic tracking. Used by 200,000+ companies.",
         founded=2016, city="San Francisco", country="US", team_size="51-200",
         linkedin="https://www.linkedin.com/company/fireflies-ai", twitter="https://twitter.com/firefliesai"),

    dict(name="Read AI", domain="read.ai", l4_slug="ai-meeting-assistants",
         tagline="AI for meetings, messages, and email — across Zoom, Slack, Outlook, Gmail",
         description="Read AI is an AI workplace productivity company founded in 2021 by ex-Foursquare CEO David Shim. The product spans meetings (transcript, summary, sentiment), messaging (Slack/Teams summaries), and inbox (Gmail/Outlook prioritisation) — all unified by a 'Smart Composer' that drafts replies in the user's voice.",
         founded=2021, city="Seattle", country="US", team_size="51-200",
         linkedin="https://www.linkedin.com/company/read-ai", twitter="https://twitter.com/readai_"),

    dict(name="Granola", domain="granola.ai", l4_slug="ai-meeting-assistants",
         tagline="The AI notepad for back-to-back meetings — by ex-Riffle, ex-Memrise",
         description="Granola is a Mac AI notepad designed for back-to-back meeting days. The user types light notes during a call; Granola records and post-processes a full transcript and structured summary, then re-formats the notes into shareable docs. Founded in 2023 in London by Chris Pedregal (Socratic) and Sam Stephenson. Backed by Lightspeed.",
         founded=2023, city="London", country="GB", team_size="11-50",
         linkedin="https://www.linkedin.com/company/granola-ai", twitter="https://twitter.com/meetgranola"),

    dict(name="Reflect Notes", domain="reflect.app", l4_slug="ai-collaborative-doc-editor",
         tagline="A note-taking app that thinks for you — AI-powered, end-to-end encrypted",
         description="Reflect is a private, AI-powered note-taking app founded in 2021 by Alex MacCaw (ex-Clearbit CEO). Notes are end-to-end encrypted, the AI suggests connections to past notes, drafts summaries, and writes voice-to-text — with a fast desktop and mobile app. A favourite of operators and researchers.",
         founded=2021, city="New York", country="US", team_size="1-10",
         linkedin="https://www.linkedin.com/company/reflect-app", twitter="https://twitter.com/reflectnotes"),

    dict(name="Mem", domain="mem.ai", l4_slug="ai-collaborative-doc-editor",
         tagline="The AI workspace that organises itself — surfaces what matters when",
         description="Mem (Mem Labs) is an AI-native notes app founded in 2019 by Kevin Moody and Dennis Xu, backed by OpenAI Startup Fund. The product blends Apple-Notes-style fast capture with AI auto-tagging, full-workspace search, summaries, and Mem Spotlight — surfacing relevant notes as the user types in other apps.",
         founded=2019, city="San Francisco", country="US", team_size="11-50",
         linkedin="https://www.linkedin.com/company/mem-labs", twitter="https://twitter.com/mem"),

    dict(name="Tana", domain="tana.inc", l4_slug="ai-collaborative-doc-editor",
         tagline="Outliner + database + AI — power-user note-taking and knowledge work",
         description="Tana is a Norwegian outliner-database hybrid for power users, with deep AI features. Co-founded in 2020 by ex-Confrere and ex-Microsoft engineers. Users build 'supertags' that turn notes into typed objects (meetings, tasks, projects) and use AI commands to summarise, extract, and synthesise. A cult favourite of researchers and operators.",
         founded=2020, city="Oslo", country="NO", team_size="11-50",
         linkedin="https://www.linkedin.com/company/tana-inc", twitter="https://twitter.com/tana_inc"),

    dict(name="Lex", domain="lex.page", l4_slug="ai-collaborative-doc-editor",
         tagline="AI for serious writing — Google Docs meets ChatGPT for long-form",
         description="Lex is an AI writing tool for long-form, founded in 2022 by Nathan Baschez (ex-Substack, ex-Every). The product looks like Google Docs but the AI 'continue' command, citation-finder, and editor-style 'AI feedback' assistant make it a favourite for journalists, essayists, and writers who care about voice.",
         founded=2022, city="New York", country="US", team_size="1-10",
         linkedin="https://www.linkedin.com/company/everyinc", twitter="https://twitter.com/lex_page"),

    # ── Sales / Marketing AI (8) ──────────────────────────────────────────────
    dict(name="Lavender", domain="lavender.ai", l4_slug="ai-sales-outreach",
         tagline="AI email coach for sellers — write better outbound, faster, with data",
         description="Lavender is an AI sales-email coach founded in 2020 in New York by Will Allred. The product scores draft emails as the rep writes, suggests rewrites based on what's worked in similar contexts, and pulls in personalised insights about the prospect. Used by sales teams at Twilio, Clari, MongoDB, and others.",
         founded=2020, city="New York", country="US", team_size="11-50",
         linkedin="https://www.linkedin.com/company/lavender-ai", twitter="https://twitter.com/getlavender"),

    dict(name="Apollo.io", domain="apollo.io", l4_slug="ai-sales-intelligence",
         tagline="B2B sales intelligence — 275M contacts, AI workflows, full outbound stack",
         description="Apollo.io is a B2B sales intelligence and engagement platform founded in 2015 in San Francisco. It pairs a 275M-contact database with AI-driven email sequencing, lead scoring, conversation intelligence, and pipeline management. Apollo serves 1M+ companies and is one of the fastest-growing sales tools in the world.",
         founded=2015, city="San Francisco", country="US", team_size="1000+",
         linkedin="https://www.linkedin.com/company/apolloio", twitter="https://twitter.com/MeetApollo"),

    dict(name="Clay", domain="clay.com", l4_slug="ai-sales-intelligence",
         tagline="GTM data + AI workflows — enrich, prospect, and personalise outbound at scale",
         description="Clay is a GTM data platform founded in 2017 in New York. Users build spreadsheet-style workflows that combine 100+ data providers, web scraping, and LLM steps to enrich, qualify, and personalise outbound. Clay's 2024 momentum made it a category-defining tool for modern outbound sales and recruiting teams.",
         founded=2017, city="New York", country="US", team_size="201-500",
         linkedin="https://www.linkedin.com/company/clay-run", twitter="https://twitter.com/claydotrun"),

    dict(name="Salesforce Einstein", domain="salesforce.com", l4_slug="ai-crm-tools",
         tagline="Salesforce's AI layer across Sales, Service, Marketing, and Commerce Cloud",
         description="Einstein is Salesforce's AI layer, launched in 2016 and significantly expanded in 2024 with the Einstein 1 platform and Agentforce. Einstein provides predictive scoring, conversational AI, generative content, and autonomous agents inside every Salesforce cloud — Sales, Service, Marketing, Commerce, and Data Cloud.",
         founded=1999, city="San Francisco", country="US", team_size="1000+",
         linkedin="https://www.linkedin.com/company/salesforce", twitter="https://twitter.com/salesforce"),

    dict(name="HubSpot Breeze", domain="hubspot.com", l4_slug="ai-crm-tools",
         tagline="The AI built into HubSpot — Copilot, Agents, and Breeze Intelligence",
         description="Breeze is HubSpot's AI layer for its Smart CRM, launched in 2024. Breeze includes Copilot (AI assistant across the platform), Breeze Agents (autonomous agents for content, social, prospecting, and customer service), and Breeze Intelligence (250M+ B2B records enriching HubSpot CRM data).",
         founded=2006, city="Cambridge", country="US", team_size="1000+",
         linkedin="https://www.linkedin.com/company/hubspot", twitter="https://twitter.com/HubSpot"),

    dict(name="Gong", domain="gong.io", l4_slug="ai-sales-intelligence",
         tagline="Revenue intelligence — every call, email, and meeting analysed by AI",
         description="Gong is the leading revenue intelligence platform, founded in 2015 by Amit Bendov and Eilon Reshef. Gong records and analyses every customer interaction with AI — coaching reps, flagging deal risk, and surfacing buyer signals. Used by 4,000+ companies including LinkedIn, Snowflake, and Twilio. Last valued at over $7B.",
         founded=2015, city="San Francisco", country="US", team_size="1000+",
         linkedin="https://www.linkedin.com/company/gong-io", twitter="https://twitter.com/Gong_io"),

    dict(name="Drift (Salesloft)", domain="drift.com", l4_slug="ai-chat-assistant",
         tagline="Conversational marketing and AI chat for B2B websites",
         description="Drift is a conversational marketing and B2B chat platform founded in 2015 by David Cancel and Elias Torres. Drift's AI chatbots qualify visitors, book meetings on the sales team's calendar, and surface high-intent buyers. Acquired by Salesloft in 2024 and integrated into its revenue orchestration platform.",
         founded=2015, city="Boston", country="US", team_size="201-500",
         linkedin="https://www.linkedin.com/company/drift", twitter="https://twitter.com/Drift"),

    dict(name="Outreach", domain="outreach.io", l4_slug="ai-sales-outreach",
         tagline="Sales execution platform — sequencing, AI assistant, deal forecasting",
         description="Outreach is one of the original sales engagement platforms, founded in 2014 in Seattle. The product unifies multi-channel sequences, AI-drafted emails, conversation intelligence, and deal/pipeline forecasting in one place. Used by 6,000+ companies including Adobe, Cisco, and Okta.",
         founded=2014, city="Seattle", country="US", team_size="1000+",
         linkedin="https://www.linkedin.com/company/outreachio", twitter="https://twitter.com/outreach_io"),

    # ── Customer Support AI (4) ───────────────────────────────────────────────
    dict(name="Intercom Fin", domain="intercom.com", l4_slug="ai-chat-assistant",
         tagline="Fin — the AI agent that resolves 50%+ of customer questions automatically",
         description="Intercom is a customer support platform founded in 2011 in Dublin and San Francisco. In 2023 it launched Fin, an AI customer service agent built on GPT-4 (and later Claude). Fin resolves a majority of support questions autonomously, with guardrails, and is deployed at companies like Anthropic, Lightspeed, and Monzo.",
         founded=2011, city="San Francisco", country="US", team_size="1000+",
         linkedin="https://www.linkedin.com/company/intercom", twitter="https://twitter.com/intercom"),

    dict(name="Ada", domain="ada.cx", l4_slug="ai-chat-assistant",
         tagline="AI customer service automation — resolving complex inquiries with confidence",
         description="Ada is a Canadian AI customer-service company founded in 2016 in Toronto. The Ada platform deploys an AI agent across chat, voice, and email channels, with brand controls, action-taking (refunds, account updates), and an analytics layer. Customers include Verizon, Square, Indigo, and AirAsia.",
         founded=2016, city="Toronto", country="CA", team_size="201-500",
         linkedin="https://www.linkedin.com/company/ada-support", twitter="https://twitter.com/ada_cx"),

    dict(name="Forethought", domain="forethought.ai", l4_slug="ai-chat-assistant",
         tagline="Generative AI for customer support — Solve, Triage, Discover",
         description="Forethought is a US generative-AI customer-support platform founded in 2017 by Deon Nicholas. Its Solve agent deflects tickets across email and chat, Triage routes incoming requests, and Discover analyses tickets to surface workflow improvements. Used by Upwork, Carta, and ASOS.",
         founded=2017, city="San Francisco", country="US", team_size="51-200",
         linkedin="https://www.linkedin.com/company/forethought-ai", twitter="https://twitter.com/forethought_ai"),

    dict(name="Tidio Lyro", domain="tidio.com", l4_slug="ai-chat-assistant",
         tagline="AI live chat for SMBs — Lyro automates customer questions in minutes",
         description="Tidio is a Polish live chat + chatbot platform founded in 2013, focused on SMBs and e-commerce stores. Tidio Lyro is its AI agent, trained on the merchant's knowledge base, that handles routine questions across email, chat, and Messenger out of the box. Used by 300,000+ businesses worldwide.",
         founded=2013, city="Szczecin", country="PL", team_size="201-500",
         linkedin="https://www.linkedin.com/company/tidio", twitter="https://twitter.com/tidiolive"),

    # ── Image editing (6) ─────────────────────────────────────────────────────
    dict(name="Photoroom", domain="photoroom.com", l4_slug="ai-background-remover",
         tagline="AI photo editor — backgrounds, retouching, batch shoots, brand kits",
         description="Photoroom is a French AI photo editor founded in 2019 by Matthieu Rouif and Eliot Andres. Originally a background remover, it now covers retouching, batch editing, generative backgrounds, AI shoots, and brand-kit asset production — used by 25M+ creators and small e-commerce stores. Most-downloaded photo editor on iOS in many markets.",
         founded=2019, city="Paris", country="FR", team_size="51-200",
         linkedin="https://www.linkedin.com/company/photoroom", twitter="https://twitter.com/Photoroom_app"),

    dict(name="Topaz Labs", domain="topazlabs.com", l4_slug="ai-image-upscalers",
         tagline="AI photo and video enhancement — upscale, denoise, sharpen at studio quality",
         description="Topaz Labs is a Dallas-based AI image and video enhancement company founded in 2005. Its Photo AI, Gigapixel AI, Sharpen AI, and Video AI products are the industry default for upscaling, denoising, deinterlacing, and motion enhancement — used by professional photographers, archivists, and Hollywood VFX teams.",
         founded=2005, city="Dallas", country="US", team_size="51-200",
         linkedin="https://www.linkedin.com/company/topaz-labs", twitter="https://twitter.com/topazlabs"),

    dict(name="remove.bg (Kaleido AI)", domain="remove.bg", l4_slug="ai-background-remover",
         tagline="One-click background removal — the original AI cutout service",
         description="remove.bg, launched in 2018 by Kaleido AI in Vienna, popularised one-click AI background removal. The free web tool processes images in seconds with a paid API for high volume. Acquired by Canva in 2021 and now embedded across the Canva creative suite.",
         founded=2018, city="Vienna", country="AT", team_size="51-200",
         linkedin="https://www.linkedin.com/company/remove-bg", twitter="https://twitter.com/remove_bg"),

    dict(name="Picsart", domain="picsart.com", l4_slug="ai-photo-editors",
         tagline="AI photo and video editor for creators — replace, restyle, expand, and design",
         description="Picsart is a consumer creative app founded in 2011 in Yerevan and now headquartered in San Francisco. With over 150M monthly active users, Picsart has built deep AI features — AI replace, expand, restyle, sketch-to-image, AI avatars, AI photo, and an AI design studio — across mobile and web.",
         founded=2011, city="San Francisco", country="US", team_size="1000+",
         linkedin="https://www.linkedin.com/company/picsart", twitter="https://twitter.com/picsart"),

    dict(name="Cleanup.pictures", domain="cleanup.pictures", l4_slug="ai-photo-editors",
         tagline="Erase anything from a photo — free, no login, in seconds",
         description="Cleanup.pictures, made by ClipDrop (acquired by Stability AI), is a free web app that uses inpainting to erase unwanted objects, people, watermarks, or backgrounds from any photo in seconds. Beloved by realtors, e-commerce sellers, and casual users for its simplicity and zero-login experience.",
         founded=2019, city="Paris", country="FR", team_size="11-50",
         linkedin="https://www.linkedin.com/company/clipdrop", twitter="https://twitter.com/cleanup_pic"),

    dict(name="Lensa AI", domain="prisma-ai.com", l4_slug="portraits",
         tagline="AI photo editing and the viral 'Magic Avatars' from Prisma Labs",
         description="Lensa AI is the consumer photo editor from Prisma Labs, founded in 2016 in Sunnyvale. Lensa added the viral 'Magic Avatars' feature in late 2022 — AI-generated artistic portraits from a few selfies — driving over 100M downloads. The app also handles retouching, background blur, and AI photo styles.",
         founded=2016, city="Sunnyvale", country="US", team_size="51-200",
         linkedin="https://www.linkedin.com/company/prisma-labs-inc", twitter="https://twitter.com/lensa_ai"),

    # ── Music gen (4) ─────────────────────────────────────────────────────────
    dict(name="AIVA", domain="aiva.ai", l4_slug="ai-song-generator",
         tagline="AI-composed soundtracks for games, film, and content — by the original AI composer",
         description="AIVA (Artificial Intelligence Virtual Artist) is a Luxembourg-based AI music composition company founded in 2016. AIVA composes original soundtracks across film, gaming, and content genres, and was the first AI to be officially recognised as a composer by SACEM. Used by indie game studios and YouTube creators.",
         founded=2016, city="Luxembourg City", country="LU", team_size="11-50",
         linkedin="https://www.linkedin.com/company/aiva", twitter="https://twitter.com/aivatech"),

    dict(name="Soundraw", domain="soundraw.io", l4_slug="ai-song-generator",
         tagline="Royalty-free AI music for videos — generate, customise, and own the rights",
         description="Soundraw is a Tokyo-based AI music generator founded in 2020. Users pick mood, genre, and length, and Soundraw composes a customisable track — every section's energy, instrument mix, and tempo can be edited. All tracks are licensed for commercial use, making it popular with YouTubers, marketing teams, and podcasters.",
         founded=2020, city="Tokyo", country="JP", team_size="11-50",
         linkedin="https://www.linkedin.com/company/soundraw", twitter="https://twitter.com/soundraw_io"),

    dict(name="Boomy", domain="boomy.com", l4_slug="ai-song-generator",
         tagline="Make and release AI-generated songs to Spotify, Apple Music, TikTok",
         description="Boomy is a US AI music app founded in 2018 that lets anyone — musician or not — create original songs in seconds and release them to Spotify, Apple Music, and TikTok. Users have created over 20M songs to date. Boomy's distribution layer pays a share of streaming royalties back to creators.",
         founded=2018, city="Berkeley", country="US", team_size="11-50",
         linkedin="https://www.linkedin.com/company/boomy", twitter="https://twitter.com/boomy"),

    dict(name="Mubert", domain="mubert.com", l4_slug="ai-song-generator",
         tagline="AI-generated royalty-free music — for content, livestreams, and apps",
         description="Mubert is a real-time AI music generation service founded in 2016. Users can generate royalty-free background music from prompts (mood, genre, duration), license tracks for content and apps, or stream endless AI-composed music. Used by 100,000+ creators and integrated into apps like Notion and Yandex.",
         founded=2016, city="London", country="GB", team_size="11-50",
         linkedin="https://www.linkedin.com/company/mubert", twitter="https://twitter.com/mubertapp"),
]


def slugify(name):
    s = name.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return s


# ─── Build SQL ────────────────────────────────────────────────────────────────
lines = []
lines.append("-- ============================================================")
lines.append("-- InfoWebWorld — AI/ML 94-listing seed batch")
lines.append("--")
lines.append(f"-- {len(LISTINGS)} real AI/ML products curated for outreach + claim.")
lines.append("-- Combined with the 6 already-seeded rows (Claude, ChatGPT, Gemini,")
lines.append("-- Microsoft Copilot, Perplexity, DeepSeek) this brings the AI/ML")
lines.append("-- sector to 100 live listings.")
lines.append("--")
lines.append("-- Each row carries the credible-claim minimum: name, slug, tagline,")
lines.append("-- 2-3 sentence description, founded year, HQ city/country, team-size")
lines.append("-- band, real website + socials, category (v3 taxonomy slug), and a")
lines.append("-- Clearbit logo URL. JSON fields (pricing tiers, integrations, FAQs,")
lines.append("-- pros/cons, key features) are left NULL — the owner fills those on")
lines.append("-- claim. Screenshots are populated by scripts/capture-screenshots.mjs")
lines.append("-- after this SQL is loaded.")
lines.append("--")
lines.append("-- All listings: status='active', payment_status='completed' →")
lines.append("-- live immediately. user_id=NULL → claimable.")
lines.append("-- ============================================================")
lines.append("")
lines.append("SET @free_plan := (SELECT id FROM plans WHERE is_active = 1 ORDER BY price ASC LIMIT 1);")
lines.append("SET @fallback_country := (SELECT id FROM countries WHERE code = 'US' LIMIT 1);")
lines.append("")
lines.append("-- ─── Cleanup: wipe any rows from a prior partial run so this script ─")
lines.append("-- can be re-run safely (slug list is exactly the 94 new listings).")
lines.append("DELETE FROM submissions WHERE slug IN (")
# Build slug list
slugs = [slugify(r["name"]) for r in LISTINGS]
quoted = ", ".join("'" + s + "'" for s in slugs)
# Wrap at 100 chars
chunks = []
buf = []
ln = 0
for q in quoted.split(", "):
    if ln + len(q) + 2 > 90 and buf:
        chunks.append(", ".join(buf))
        buf = []
        ln = 0
    buf.append(q)
    ln += len(q) + 2
if buf: chunks.append(", ".join(buf))
for i, ch in enumerate(chunks):
    suffix = "" if i == len(chunks) - 1 else ","
    lines.append("  " + ch + suffix)
lines.append(");")
lines.append("")

count_inserts = 0
unmapped_categories = set()

for r in LISTINGS:
    name = r["name"]
    domain = r["domain"]
    slug = slugify(name)
    contact = f"{name.split(' (')[0]} Team"
    email = f"support@{domain}"
    website = f"https://{domain}" if not domain.startswith("http") else domain
    l4_slug = r["l4_slug"]
    tagline = r["tagline"]
    description = r["description"]
    founded = r.get("founded")
    city = r.get("city")
    country = r.get("country") or "US"
    team_size = r.get("team_size")
    linkedin = r.get("linkedin")
    twitter = r.get("twitter")
    hq_location = f"{city}, {country}" if city else None

    # Phone code by common country mapping (rough)
    phone_code_map = {"US": "+1", "CA": "+1", "GB": "+44", "DE": "+49", "FR": "+33",
                      "AU": "+61", "IN": "+91", "CN": "+86", "JP": "+81", "KR": "+82",
                      "IL": "+972", "SE": "+46", "NO": "+47", "AT": "+43", "PL": "+48",
                      "LU": "+352", "CH": "+41", "ES": "+34", "IT": "+39", "NL": "+31"}
    phone_code = phone_code_map.get(country, "+1")

    # Google's s2 favicon API — same convention as the existing 6 seeded
    # listings (Claude, ChatGPT, Gemini, Copilot, Perplexity, DeepSeek).
    # Reliable + free + returns 256x256 when the site has a high-res favicon.
    logo = f"https://www.google.com/s2/favicons?domain={domain}&sz=256"

    lines.append(f"-- {count_inserts + 1}/{len(LISTINGS)}  {name}")
    lines.append("INSERT INTO submissions (")
    lines.append("  uuid, company_name, slug, contact_name, email, phone_code, phone, website,")
    lines.append("  category_id, country_id, city, hq_location,")
    lines.append("  tagline, description, logo_url,")
    lines.append("  founded_year, team_size,")
    lines.append("  linkedin, twitter,")
    lines.append("  listing_mode, status, payment_status, plan_id,")
    lines.append("  activated_at, approved_at, created_at, updated_at")
    lines.append(")")
    lines.append("SELECT")
    lines.append(f"  UUID(), {sq(name)}, {sq(slug)}, {sq(contact)}, {sq(email)},")
    lines.append(f"  {sq(phone_code)}, NULL, {sq(website)},")
    lines.append(f"  (SELECT id FROM categories WHERE slug = {sq(l4_slug)} LIMIT 1),")
    lines.append(f"  COALESCE((SELECT id FROM countries WHERE code = {sq(country)} LIMIT 1), @fallback_country),")
    lines.append(f"  {sq(city)}, {sq(hq_location)},")
    lines.append(f"  {sq(tagline)},")
    lines.append(f"  {sq(description)},")
    lines.append(f"  {sq(logo)},")
    lines.append(f"  {num(founded)}, {sq(team_size)},")
    lines.append(f"  {sq(linkedin)}, {sq(twitter)},")
    lines.append("  'product', 'active', 'completed', @free_plan,")
    lines.append("  NOW(), NOW(), NOW(), NOW();")
    lines.append("")
    count_inserts += 1

lines.append("-- ============================================================")
lines.append(f"-- {count_inserts} listings inserted.")
lines.append("-- Next step: run scripts/capture-screenshots.mjs to populate")
lines.append("-- the screenshots column for each new listing.")
lines.append("-- ============================================================")

SQL_OUT.parent.mkdir(parents=True, exist_ok=True)
SQL_OUT.write_text("\n".join(lines), encoding="utf-8")
print(f"Wrote {SQL_OUT}  ({SQL_OUT.stat().st_size:,} bytes, {count_inserts} listings)")
if unmapped_categories:
    print("Unmapped categories (none found in v3 taxonomy):")
    for c in sorted(unmapped_categories):
        print(f"  - {c}")
