-- ============================================================================
-- Seed: AI & ML — ~200 real companies for the scraper queue.
-- Excludes the 94 already enriched (those are status='applied' in scrape_jobs).
-- ON DUPLICATE KEY UPDATE id=id makes this re-runnable / idempotent.
-- Run in phpMyAdmin → SQL tab.
-- ============================================================================

INSERT INTO scrape_jobs (slug, company_name, website, category_l1, category_slug, status)
VALUES

-- ─── AI Research Labs / Foundation models ──────────────────────────────────
('anthropic',          'Anthropic',          'https://www.anthropic.com',          'ai-and-ml', 'ai-research-lab', 'queued'),
('openai',             'OpenAI',             'https://openai.com',                 'ai-and-ml', 'ai-research-lab', 'queued'),
('hugging-face',       'Hugging Face',       'https://huggingface.co',             'ai-and-ml', 'ai-research-lab', 'queued'),
('eleutherai',         'EleutherAI',         'https://www.eleuther.ai',            'ai-and-ml', 'ai-research-lab', 'queued'),
('allen-ai',           'Allen Institute for AI', 'https://allenai.org',            'ai-and-ml', 'ai-research-lab', 'queued'),
('reka',               'Reka',               'https://www.reka.ai',                'ai-and-ml', 'ai-research-lab', 'queued'),
('liquid-ai',          'Liquid AI',          'https://www.liquid.ai',              'ai-and-ml', 'ai-research-lab', 'queued'),
('contextual-ai',      'Contextual AI',      'https://contextual.ai',              'ai-and-ml', 'ai-research-lab', 'queued'),
('writer',             'Writer',             'https://writer.com',                 'ai-and-ml', 'ai-writing-assistant', 'queued'),
('adept-ai',           'Adept AI',           'https://www.adept.ai',               'ai-and-ml', 'ai-agent-platform', 'queued'),

-- ─── LLM hosting / inference ──────────────────────────────────────────────
('together-ai',        'Together AI',        'https://www.together.ai',            'ai-and-ml', 'llm-inference', 'queued'),
('fireworks-ai',       'Fireworks AI',       'https://fireworks.ai',               'ai-and-ml', 'llm-inference', 'queued'),
('anyscale',           'Anyscale',           'https://www.anyscale.com',           'ai-and-ml', 'llm-inference', 'queued'),
('modal',              'Modal',              'https://modal.com',                  'ai-and-ml', 'llm-inference', 'queued'),
('replicate',          'Replicate',          'https://replicate.com',              'ai-and-ml', 'llm-inference', 'queued'),
('runpod',             'RunPod',             'https://www.runpod.io',              'ai-and-ml', 'llm-inference', 'queued'),
('octo-ai',            'OctoAI',             'https://octo.ai',                    'ai-and-ml', 'llm-inference', 'queued'),
('lepton-ai',          'Lepton AI',          'https://www.lepton.ai',              'ai-and-ml', 'llm-inference', 'queued'),
('groq',               'Groq',               'https://groq.com',                   'ai-and-ml', 'llm-inference', 'queued'),
('sambanova',          'SambaNova Systems',  'https://sambanova.ai',               'ai-and-ml', 'llm-inference', 'queued'),
('cerebras',           'Cerebras',           'https://cerebras.ai',                'ai-and-ml', 'llm-inference', 'queued'),
('baseten',            'Baseten',            'https://www.baseten.co',             'ai-and-ml', 'llm-inference', 'queued'),

-- ─── LLM dev frameworks / tooling ─────────────────────────────────────────
('langchain',          'LangChain',          'https://www.langchain.com',          'ai-and-ml', 'llm-framework', 'queued'),
('llamaindex',         'LlamaIndex',         'https://www.llamaindex.ai',          'ai-and-ml', 'llm-framework', 'queued'),
('langfuse',           'Langfuse',           'https://langfuse.com',               'ai-and-ml', 'llm-observability', 'queued'),
('helicone',           'Helicone',           'https://www.helicone.ai',            'ai-and-ml', 'llm-observability', 'queued'),
('arize',              'Arize AI',           'https://arize.com',                  'ai-and-ml', 'llm-observability', 'queued'),
('langsmith',          'LangSmith',          'https://www.langchain.com/langsmith','ai-and-ml', 'llm-observability', 'queued'),
('weights-and-biases', 'Weights & Biases',   'https://wandb.ai',                   'ai-and-ml', 'mlops', 'queued'),
('comet-ml',           'Comet',              'https://www.comet.com',              'ai-and-ml', 'mlops', 'queued'),
('mlflow',             'MLflow',             'https://mlflow.org',                 'ai-and-ml', 'mlops', 'queued'),
('clearml',            'ClearML',            'https://clear.ml',                   'ai-and-ml', 'mlops', 'queued'),
('domino',             'Domino Data Lab',    'https://www.dominodatalab.com',      'ai-and-ml', 'mlops', 'queued'),
('dataiku',            'Dataiku',            'https://www.dataiku.com',            'ai-and-ml', 'mlops', 'queued'),
('valohai',            'Valohai',            'https://valohai.com',                'ai-and-ml', 'mlops', 'queued'),

-- ─── Vector databases / RAG ───────────────────────────────────────────────
('pinecone',           'Pinecone',           'https://www.pinecone.io',            'ai-and-ml', 'vector-database', 'queued'),
('weaviate',           'Weaviate',           'https://weaviate.io',                'ai-and-ml', 'vector-database', 'queued'),
('chroma',             'Chroma',             'https://www.trychroma.com',          'ai-and-ml', 'vector-database', 'queued'),
('qdrant',             'Qdrant',             'https://qdrant.tech',                'ai-and-ml', 'vector-database', 'queued'),
('milvus',             'Milvus',             'https://milvus.io',                  'ai-and-ml', 'vector-database', 'queued'),
('vespa',              'Vespa',              'https://vespa.ai',                   'ai-and-ml', 'vector-database', 'queued'),
('marqo',              'Marqo',              'https://www.marqo.ai',               'ai-and-ml', 'vector-database', 'queued'),
('vectara',            'Vectara',            'https://vectara.com',                'ai-and-ml', 'rag-platform', 'queued'),

-- ─── Enterprise AI search / knowledge ─────────────────────────────────────
('glean',              'Glean',              'https://www.glean.com',              'ai-and-ml', 'ai-enterprise-search', 'queued'),
('hebbia',             'Hebbia',             'https://www.hebbia.com',             'ai-and-ml', 'ai-enterprise-search', 'queued'),
('moveworks',          'Moveworks',          'https://www.moveworks.com',          'ai-and-ml', 'ai-enterprise-search', 'queued'),
('coveo',              'Coveo',              'https://www.coveo.com',              'ai-and-ml', 'ai-enterprise-search', 'queued'),
('algolia',            'Algolia',            'https://www.algolia.com',            'ai-and-ml', 'ai-enterprise-search', 'queued'),
('mendable',           'Mendable',           'https://www.mendable.ai',            'ai-and-ml', 'ai-enterprise-search', 'queued'),

-- ─── Legal AI ─────────────────────────────────────────────────────────────
('harvey-ai',          'Harvey',             'https://www.harvey.ai',              'ai-and-ml', 'legal-ai', 'queued'),
('casetext',           'Casetext',           'https://casetext.com',               'ai-and-ml', 'legal-ai', 'queued'),
('spellbook',          'Spellbook',          'https://www.spellbook.legal',        'ai-and-ml', 'legal-ai', 'queued'),
('robin-ai',           'Robin AI',           'https://www.robinai.com',            'ai-and-ml', 'legal-ai', 'queued'),
('lexion',             'Lexion',             'https://www.lexion.ai',              'ai-and-ml', 'legal-ai', 'queued'),
('eve-legal',          'Eve',                'https://www.eve.legal',              'ai-and-ml', 'legal-ai', 'queued'),
('paxton-ai',          'Paxton AI',          'https://www.paxton.ai',              'ai-and-ml', 'legal-ai', 'queued'),

-- ─── Healthcare AI ────────────────────────────────────────────────────────
('hippocratic-ai',     'Hippocratic AI',     'https://www.hippocraticai.com',      'ai-and-ml', 'healthcare-ai', 'queued'),
('abridge',            'Abridge',            'https://www.abridge.com',            'ai-and-ml', 'healthcare-ai', 'queued'),
('nuance',             'Nuance',             'https://www.nuance.com',             'ai-and-ml', 'healthcare-ai', 'queued'),
('suki-ai',            'Suki AI',            'https://www.suki.ai',                'ai-and-ml', 'healthcare-ai', 'queued'),
('augmedix',           'Augmedix',           'https://www.augmedix.com',           'ai-and-ml', 'healthcare-ai', 'queued'),
('iodine-software',    'Iodine Software',    'https://iodinesoftware.com',         'ai-and-ml', 'healthcare-ai', 'queued'),
('paige-ai',           'Paige',              'https://www.paige.ai',               'ai-and-ml', 'healthcare-ai', 'queued'),

-- ─── Sales AI / conversation intelligence ─────────────────────────────────
('cresta',             'Cresta',             'https://cresta.com',                 'ai-and-ml', 'sales-ai', 'queued'),
('sybill',             'Sybill',             'https://www.sybill.ai',              'ai-and-ml', 'sales-ai', 'queued'),
('chorus-ai',          'Chorus',             'https://www.chorus.ai',              'ai-and-ml', 'sales-ai', 'queued'),
('avoma',              'Avoma',              'https://www.avoma.com',              'ai-and-ml', 'sales-ai', 'queued'),
('momentum-io',        'Momentum',           'https://www.momentum.io',            'ai-and-ml', 'sales-ai', 'queued'),
('regie-ai',           'Regie.ai',           'https://www.regie.ai',               'ai-and-ml', 'sales-ai', 'queued'),
('clari',              'Clari',              'https://www.clari.com',              'ai-and-ml', 'sales-ai', 'queued'),
('pipedrive',          'Pipedrive',          'https://www.pipedrive.com',          'ai-and-ml', 'sales-ai', 'queued'),
('humantic-ai',        'Humantic AI',        'https://humantic.ai',                'ai-and-ml', 'sales-ai', 'queued'),
('attention',          'Attention',          'https://attention.tech',             'ai-and-ml', 'sales-ai', 'queued'),

-- ─── AI agents / browser automation ───────────────────────────────────────
('browse-ai',          'Browse AI',          'https://www.browse.ai',              'ai-and-ml', 'ai-agent-platform', 'queued'),
('agentops-ai',        'AgentOps',           'https://www.agentops.ai',            'ai-and-ml', 'ai-agent-platform', 'queued'),
('e2b-dev',            'E2B',                'https://e2b.dev',                    'ai-and-ml', 'ai-agent-platform', 'queued'),
('crew-ai',            'crewAI',             'https://www.crewai.com',             'ai-and-ml', 'ai-agent-platform', 'queued'),
('superagi',           'SuperAGI',           'https://superagi.com',               'ai-and-ml', 'ai-agent-platform', 'queued'),
('llamaindex-agents',  'LlamaIndex Agents',  'https://www.llamaindex.ai/agents',   'ai-and-ml', 'ai-agent-platform', 'queued'),
('vapi-ai',            'Vapi',               'https://vapi.ai',                    'ai-and-ml', 'voice-ai-agent', 'queued'),
('retell-ai',          'Retell AI',          'https://www.retellai.com',           'ai-and-ml', 'voice-ai-agent', 'queued'),
('bland-ai',           'Bland AI',           'https://www.bland.ai',               'ai-and-ml', 'voice-ai-agent', 'queued'),
('synthflow',          'Synthflow AI',       'https://synthflow.ai',               'ai-and-ml', 'voice-ai-agent', 'queued'),
('sierra-ai',          'Sierra',             'https://sierra.ai',                  'ai-and-ml', 'voice-ai-agent', 'queued'),
('parloa',             'Parloa',             'https://www.parloa.com',             'ai-and-ml', 'voice-ai-agent', 'queued'),

-- ─── Image generation (additional to the 10 already enriched) ─────────────
('lexica-art',         'Lexica',             'https://lexica.art',                 'ai-and-ml', 'ai-image-generator', 'queued'),
('nightcafe',          'NightCafe',          'https://creator.nightcafe.studio',   'ai-and-ml', 'ai-image-generator', 'queued'),
('artbreeder',         'Artbreeder',         'https://www.artbreeder.com',         'ai-and-ml', 'ai-image-generator', 'queued'),
('dreamstudio',        'DreamStudio',        'https://dreamstudio.ai',             'ai-and-ml', 'ai-image-generator', 'queued'),
('starryai',           'starryai',           'https://starryai.com',               'ai-and-ml', 'ai-image-generator', 'queued'),
('craiyon',            'Craiyon',            'https://www.craiyon.com',            'ai-and-ml', 'ai-image-generator', 'queued'),
('deepai',             'DeepAI',             'https://deepai.org',                 'ai-and-ml', 'ai-image-generator', 'queued'),
('dreamup',            'DreamUp',            'https://www.dreamup.com',            'ai-and-ml', 'ai-image-generator', 'queued'),
('clipdrop',           'ClipDrop',           'https://clipdrop.co',                'ai-and-ml', 'ai-image-editor', 'queued'),
('flair-ai',           'Flair AI',           'https://flair.ai',                   'ai-and-ml', 'ai-image-editor', 'queued'),
('booth-ai',           'Booth AI',           'https://www.booth.ai',               'ai-and-ml', 'ai-image-editor', 'queued'),
('artgrid',            'Artgrid AI',         'https://www.artgrid.ai',             'ai-and-ml', 'ai-image-editor', 'queued'),

-- ─── Video generation ────────────────────────────────────────────────────
('genmo-ai',           'Genmo',              'https://www.genmo.ai',               'ai-and-ml', 'ai-video-generator', 'queued'),
('decohere',           'Decohere',           'https://www.decohere.ai',            'ai-and-ml', 'ai-video-generator', 'queued'),
('sora-openai',        'Sora',               'https://openai.com/sora',            'ai-and-ml', 'ai-video-generator', 'queued'),
('haiper-ai',          'Haiper',             'https://haiper.ai',                  'ai-and-ml', 'ai-video-generator', 'queued'),
('viggle-ai',          'Viggle',             'https://viggle.ai',                  'ai-and-ml', 'ai-video-generator', 'queued'),
('colossyan',          'Colossyan',          'https://www.colossyan.com',          'ai-and-ml', 'ai-avatar-video', 'queued'),
('synthesys',          'Synthesys',          'https://synthesys.io',               'ai-and-ml', 'ai-avatar-video', 'queued'),
('hour-one',           'Hour One',           'https://hourone.ai',                 'ai-and-ml', 'ai-avatar-video', 'queued'),
('elai-io',            'Elai.io',            'https://elai.io',                    'ai-and-ml', 'ai-avatar-video', 'queued'),
('descript',           'Descript',           'https://www.descript.com',           'ai-and-ml', 'ai-video-editor', 'queued'),
('opus-clip',          'Opus Clip',          'https://www.opus.pro',               'ai-and-ml', 'ai-video-editor', 'queued'),
('captions-ai',        'Captions',           'https://www.captions.ai',            'ai-and-ml', 'ai-video-editor', 'queued'),
('vmake',              'Vmake',              'https://vmake.ai',                   'ai-and-ml', 'ai-video-editor', 'queued'),
('topview-ai',         'TopView',            'https://www.topview.ai',             'ai-and-ml', 'ai-video-editor', 'queued'),
('flikiai',            'Fliki',              'https://fliki.ai',                   'ai-and-ml', 'ai-video-editor', 'queued'),

-- ─── Audio / voice ────────────────────────────────────────────────────────
('stable-audio',       'Stable Audio',       'https://stableaudio.com',            'ai-and-ml', 'ai-music-generator', 'queued'),
('lalal-ai',           'LALAL.AI',           'https://www.lalal.ai',               'ai-and-ml', 'ai-audio-separator', 'queued'),
('podcastle',          'Podcastle',          'https://podcastle.ai',               'ai-and-ml', 'ai-podcast-editor', 'queued'),
('cleanvoice',         'Cleanvoice',         'https://cleanvoice.ai',              'ai-and-ml', 'ai-podcast-editor', 'queued'),
('adobe-podcast',      'Adobe Podcast',      'https://podcast.adobe.com',          'ai-and-ml', 'ai-podcast-editor', 'queued'),
('sonix',              'Sonix',              'https://sonix.ai',                   'ai-and-ml', 'ai-transcription', 'queued'),
('rev-ai',             'Rev',                'https://www.rev.com',                'ai-and-ml', 'ai-transcription', 'queued'),
('deepgram',           'Deepgram',           'https://deepgram.com',               'ai-and-ml', 'ai-transcription', 'queued'),
('assembly-ai',        'AssemblyAI',         'https://www.assemblyai.com',         'ai-and-ml', 'ai-transcription', 'queued'),
('happyscribe',        'Happy Scribe',       'https://www.happyscribe.com',        'ai-and-ml', 'ai-transcription', 'queued'),

-- ─── Coding tools (additional to 10 already enriched) ────────────────────
('continue-dev',       'Continue',           'https://www.continue.dev',           'ai-and-ml', 'ai-coding-assistant', 'queued'),
('zed-industries',     'Zed',                'https://zed.dev',                    'ai-and-ml', 'ai-coding-assistant', 'queued'),
('cody-sourcegraph',   'Cody by Sourcegraph','https://sourcegraph.com/cody',       'ai-and-ml', 'ai-coding-assistant', 'queued'),
('sourcegraph',        'Sourcegraph',        'https://sourcegraph.com',            'ai-and-ml', 'code-search', 'queued'),
('mintlify',           'Mintlify',           'https://mintlify.com',               'ai-and-ml', 'ai-doc-generator', 'queued'),
('greptile',           'Greptile',           'https://www.greptile.com',           'ai-and-ml', 'code-search', 'queued'),
('warp',               'Warp',               'https://www.warp.dev',               'ai-and-ml', 'ai-terminal', 'queued'),
('cursor-ai-shell',    'Wave',               'https://www.waveterm.dev',           'ai-and-ml', 'ai-terminal', 'queued'),
('phind',              'Phind',              'https://www.phind.com',              'ai-and-ml', 'ai-coding-search', 'queued'),
('codium',             'CodiumAI',           'https://www.codium.ai',              'ai-and-ml', 'ai-test-generator', 'queued'),

-- ─── Productivity / writing additions ────────────────────────────────────
('reflect-ai',         'Reflect',            'https://reflect.app',                'ai-and-ml', 'ai-note-taking', 'queued'),
('mem-ai',             'Mem',                'https://mem.ai',                     'ai-and-ml', 'ai-note-taking', 'queued'),
('anything-llm',       'AnythingLLM',        'https://anythingllm.com',            'ai-and-ml', 'ai-chatbot-builder', 'queued'),
('typebot',            'Typebot',            'https://typebot.io',                 'ai-and-ml', 'ai-chatbot-builder', 'queued'),
('chatbase',           'Chatbase',           'https://www.chatbase.co',            'ai-and-ml', 'ai-chatbot-builder', 'queued'),
('voiceflow',          'Voiceflow',          'https://www.voiceflow.com',          'ai-and-ml', 'ai-chatbot-builder', 'queued'),
('landbot',            'Landbot',            'https://landbot.io',                 'ai-and-ml', 'ai-chatbot-builder', 'queued'),
('many-chat',          'ManyChat',           'https://manychat.com',               'ai-and-ml', 'ai-chatbot-builder', 'queued'),
('flowise-ai',         'Flowise',            'https://flowiseai.com',              'ai-and-ml', 'ai-chatbot-builder', 'queued'),

-- ─── Data labeling / ML training data ─────────────────────────────────────
('scale-ai',           'Scale AI',           'https://scale.com',                  'ai-and-ml', 'ai-data-labeling', 'queued'),
('labelbox',           'Labelbox',           'https://labelbox.com',               'ai-and-ml', 'ai-data-labeling', 'queued'),
('snorkel-ai',         'Snorkel AI',         'https://snorkel.ai',                 'ai-and-ml', 'ai-data-labeling', 'queued'),
('cleanlab',           'Cleanlab',           'https://cleanlab.ai',                'ai-and-ml', 'ai-data-quality', 'queued'),
('supervisely',        'Supervisely',        'https://supervisely.com',            'ai-and-ml', 'ai-data-labeling', 'queued'),
('encord',             'Encord',             'https://encord.com',                 'ai-and-ml', 'ai-data-labeling', 'queued'),
('v7-labs',            'V7',                 'https://www.v7labs.com',             'ai-and-ml', 'ai-data-labeling', 'queued'),
('superannotate',      'SuperAnnotate',      'https://www.superannotate.com',      'ai-and-ml', 'ai-data-labeling', 'queued'),
('roboflow',           'Roboflow',           'https://roboflow.com',               'ai-and-ml', 'ai-data-labeling', 'queued'),

-- ─── Computer vision specialists ──────────────────────────────────────────
('clarifai',           'Clarifai',           'https://www.clarifai.com',           'ai-and-ml', 'computer-vision', 'queued'),
('landing-ai',         'Landing AI',         'https://landing.ai',                 'ai-and-ml', 'computer-vision', 'queued'),
('viso-ai',            'viso.ai',            'https://viso.ai',                    'ai-and-ml', 'computer-vision', 'queued'),
('eden-ai',            'Eden AI',            'https://www.edenai.co',              'ai-and-ml', 'ai-api-aggregator', 'queued'),

-- ─── Marketing AI / SEO ──────────────────────────────────────────────────
('surfer-seo',         'Surfer SEO',         'https://surferseo.com',              'ai-and-ml', 'ai-seo', 'queued'),
('frase-io',           'Frase',              'https://www.frase.io',               'ai-and-ml', 'ai-seo', 'queued'),
('marketmuse',         'MarketMuse',         'https://www.marketmuse.com',         'ai-and-ml', 'ai-seo', 'queued'),
('semrush-contentshake','ContentShake AI',   'https://www.semrush.com/contentshake-ai/', 'ai-and-ml', 'ai-seo', 'queued'),
('clearscope',         'Clearscope',         'https://www.clearscope.io',          'ai-and-ml', 'ai-seo', 'queued'),
('seo-ai',             'SEO.ai',             'https://seo.ai',                     'ai-and-ml', 'ai-seo', 'queued'),
('outranking',         'Outranking',         'https://www.outranking.io',          'ai-and-ml', 'ai-seo', 'queued'),
('neuraltext',         'NeuralText',         'https://www.neuraltext.com',         'ai-and-ml', 'ai-seo', 'queued'),
('seo-writing-ai',     'SEO Writing AI',     'https://seowriting.ai',              'ai-and-ml', 'ai-seo', 'queued'),

-- ─── Specialized AI tools ─────────────────────────────────────────────────
('typeface-ai',        'Typeface',           'https://www.typeface.ai',            'ai-and-ml', 'ai-brand-content', 'queued'),
('hocoos',             'Hocoos',             'https://hocoos.com',                 'ai-and-ml', 'ai-website-builder', 'queued'),
('durable',            'Durable',            'https://durable.co',                 'ai-and-ml', 'ai-website-builder', 'queued'),
('framer-ai',          'Framer AI',          'https://www.framer.com/ai',          'ai-and-ml', 'ai-website-builder', 'queued'),
('wix-ai',             'Wix AI',             'https://www.wix.com/wix-ai',         'ai-and-ml', 'ai-website-builder', 'queued'),
('relume-io',          'Relume',             'https://www.relume.io',              'ai-and-ml', 'ai-website-builder', 'queued'),
('uizard',             'Uizard',             'https://uizard.io',                  'ai-and-ml', 'ai-ui-designer', 'queued'),
('galileo-ai',         'Galileo AI',         'https://www.usegalileo.ai',          'ai-and-ml', 'ai-ui-designer', 'queued'),
('motiff',             'Motiff',             'https://www.motiff.com',             'ai-and-ml', 'ai-ui-designer', 'queued'),
('penpot',             'Penpot AI',          'https://penpot.app',                 'ai-and-ml', 'ai-ui-designer', 'queued'),

-- ─── AI for education / learning ──────────────────────────────────────────
('quizlet-ai',         'Quizlet',            'https://quizlet.com',                'ai-and-ml', 'ai-learning', 'queued'),
('khanmigo',           'Khanmigo',           'https://www.khanmigo.ai',            'ai-and-ml', 'ai-learning', 'queued'),
('socratic',           'Socratic by Google', 'https://socratic.org',               'ai-and-ml', 'ai-learning', 'queued'),
('photomath',          'Photomath',          'https://photomath.com',              'ai-and-ml', 'ai-learning', 'queued'),
('coursera-coach',     'Coursera Coach',     'https://www.coursera.org',           'ai-and-ml', 'ai-learning', 'queued'),
('duolingo-max',       'Duolingo Max',       'https://www.duolingo.com',           'ai-and-ml', 'ai-language-learning', 'queued'),
('langotalk',          'Langotalk',          'https://langotalk.ai',               'ai-and-ml', 'ai-language-learning', 'queued'),

-- ─── AI shopping / e-commerce ─────────────────────────────────────────────
('shopify-magic',      'Shopify Magic',      'https://www.shopify.com/magic',      'ai-and-ml', 'ai-ecommerce', 'queued'),
('rep-ai',             'Rep AI',             'https://www.hellorep.ai',            'ai-and-ml', 'ai-ecommerce', 'queued'),
('bloomreach',         'Bloomreach',         'https://www.bloomreach.com',         'ai-and-ml', 'ai-ecommerce', 'queued'),
('octane-ai',          'Octane AI',          'https://www.octaneai.com',           'ai-and-ml', 'ai-ecommerce', 'queued'),
('relewise',           'Relewise',           'https://www.relewise.com',           'ai-and-ml', 'ai-ecommerce', 'queued'),
('nosto',              'Nosto',              'https://www.nosto.com',              'ai-and-ml', 'ai-ecommerce', 'queued'),

-- ─── Recruiting AI ────────────────────────────────────────────────────────
('mercor',             'Mercor',             'https://mercor.com',                 'ai-and-ml', 'ai-recruiting', 'queued'),
('hirevue',            'HireVue',            'https://www.hirevue.com',            'ai-and-ml', 'ai-recruiting', 'queued'),
('paradox-ai',         'Paradox',            'https://www.paradox.ai',             'ai-and-ml', 'ai-recruiting', 'queued'),
('eightfold-ai',       'Eightfold',          'https://eightfold.ai',               'ai-and-ml', 'ai-recruiting', 'queued'),
('seekout',            'SeekOut',            'https://seekout.com',                'ai-and-ml', 'ai-recruiting', 'queued'),
('fetcher-ai',         'Fetcher',            'https://fetcher.ai',                 'ai-and-ml', 'ai-recruiting', 'queued'),

-- ─── Niche / cool AI products ────────────────────────────────────────────
('rewind-ai',          'Rewind',             'https://www.rewind.ai',              'ai-and-ml', 'ai-personal-assistant', 'queued'),
('limitless-ai',       'Limitless',          'https://www.limitless.ai',           'ai-and-ml', 'ai-personal-assistant', 'queued'),
('mymind',             'mymind',             'https://mymind.com',                 'ai-and-ml', 'ai-bookmark-manager', 'queued'),
('superhuman-ai',      'Superhuman AI',      'https://superhuman.com',             'ai-and-ml', 'ai-email-assistant', 'queued'),
('shortwave',          'Shortwave',          'https://www.shortwave.com',          'ai-and-ml', 'ai-email-assistant', 'queued'),
('mailgo',             'Mailgo',             'https://mailgo.com',                 'ai-and-ml', 'ai-email-assistant', 'queued'),
('fyxer-ai',           'Fyxer AI',           'https://www.fyxer.com',              'ai-and-ml', 'ai-email-assistant', 'queued'),
('motion-app',         'Motion',             'https://www.usemotion.com',          'ai-and-ml', 'ai-scheduler', 'queued'),
('reclaim-ai',         'Reclaim AI',         'https://reclaim.ai',                 'ai-and-ml', 'ai-scheduler', 'queued'),
('clockwise',          'Clockwise',          'https://www.getclockwise.com',       'ai-and-ml', 'ai-scheduler', 'queued')

ON DUPLICATE KEY UPDATE id = id;
