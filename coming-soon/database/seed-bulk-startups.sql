-- ============================================================================
-- Seed: Startups — ~210 real companies (mid-stage, claim-likely) for the
-- scraper queue. Mix of YC alumni, recently-funded Series A-C, and indie
-- products. Companies likely to respond to outreach (small team, active
-- marketing function, founder-led).
--
-- ON DUPLICATE KEY UPDATE id=id makes this re-runnable / idempotent.
-- Run in phpMyAdmin → SQL tab.
-- ============================================================================

INSERT INTO scrape_jobs (slug, company_name, website, category_l1, category_slug, status)
VALUES

-- ─── Fintech startups ─────────────────────────────────────────────────────
('plaid',              'Plaid',              'https://plaid.com',                  'startups', 'fintech', 'queued'),
('robinhood',          'Robinhood',          'https://robinhood.com',              'startups', 'fintech', 'queued'),
('chime',              'Chime',              'https://www.chime.com',              'startups', 'neobank', 'queued'),
('current',            'Current',            'https://current.com',                'startups', 'neobank', 'queued'),
('varo-bank',          'Varo Bank',          'https://www.varomoney.com',          'startups', 'neobank', 'queued'),
('revolut',            'Revolut',            'https://www.revolut.com',            'startups', 'neobank', 'queued'),
('n26',                'N26',                'https://n26.com',                    'startups', 'neobank', 'queued'),
('monzo',              'Monzo',              'https://monzo.com',                  'startups', 'neobank', 'queued'),
('starling-bank',      'Starling Bank',      'https://www.starlingbank.com',       'startups', 'neobank', 'queued'),
('wise',               'Wise',               'https://wise.com',                   'startups', 'fintech', 'queued'),
('affirm',             'Affirm',             'https://www.affirm.com',             'startups', 'bnpl', 'queued'),
('klarna',             'Klarna',             'https://www.klarna.com',             'startups', 'bnpl', 'queued'),
('afterpay',           'Afterpay',           'https://www.afterpay.com',           'startups', 'bnpl', 'queued'),
('marqeta',            'Marqeta',            'https://www.marqeta.com',            'startups', 'fintech', 'queued'),
('rapyd',              'Rapyd',              'https://www.rapyd.net',              'startups', 'fintech', 'queued'),
('airwallex',          'Airwallex',          'https://www.airwallex.com',          'startups', 'fintech', 'queued'),
('mercury-banking',    'Mercury',            'https://mercury.com',                'startups', 'business-banking', 'queued'),
('nubank',             'Nubank',             'https://nubank.com.br',              'startups', 'neobank', 'queued'),

-- ─── Crypto / Web3 ────────────────────────────────────────────────────────
('coinbase',           'Coinbase',           'https://www.coinbase.com',           'startups', 'crypto-exchange', 'queued'),
('binance',            'Binance',            'https://www.binance.com',            'startups', 'crypto-exchange', 'queued'),
('kraken',             'Kraken',             'https://www.kraken.com',             'startups', 'crypto-exchange', 'queued'),
('opensea',            'OpenSea',            'https://opensea.io',                 'startups', 'nft-marketplace', 'queued'),
('alchemy',            'Alchemy',            'https://www.alchemy.com',            'startups', 'web3-infrastructure', 'queued'),
('chainalysis',        'Chainalysis',        'https://www.chainalysis.com',        'startups', 'crypto-compliance', 'queued'),
('fireblocks',         'Fireblocks',         'https://fireblocks.com',             'startups', 'crypto-custody', 'queued'),
('paxos',              'Paxos',              'https://www.paxos.com',              'startups', 'crypto-infrastructure', 'queued'),

-- ─── Health / wellness ────────────────────────────────────────────────────
('hims-hers',          'Hims & Hers',        'https://www.forhims.com',            'startups', 'telehealth', 'queued'),
('ro',                 'Ro',                 'https://ro.co',                      'startups', 'telehealth', 'queued'),
('cerebral',           'Cerebral',           'https://cerebral.com',               'startups', 'telehealth', 'queued'),
('teladoc-livongo',    'Teladoc Health',     'https://www.teladochealth.com',      'startups', 'telehealth', 'queued'),
('one-medical',        'One Medical',        'https://www.onemedical.com',         'startups', 'primary-care', 'queued'),
('forward-health',     'Forward',            'https://goforward.com',              'startups', 'primary-care', 'queued'),
('eleven-therapeutics','Eleven Therapeutics', 'https://eleventherapeutics.com',    'startups', 'biotech', 'queued'),
('headspace-health',   'Headspace',          'https://www.headspace.com',          'startups', 'mental-wellness', 'queued'),
('calm',               'Calm',               'https://www.calm.com',               'startups', 'mental-wellness', 'queued'),
('thrive-global',      'Thrive Global',      'https://thriveglobal.com',           'startups', 'wellness', 'queued'),
('whoop',              'WHOOP',              'https://www.whoop.com',              'startups', 'wearable-fitness', 'queued'),
('oura-ring',          'Oura',               'https://ouraring.com',               'startups', 'wearable-fitness', 'queued'),
('eight-sleep',        'Eight Sleep',        'https://www.eightsleep.com',         'startups', 'consumer-hardware', 'queued'),

-- ─── E-commerce / DTC ─────────────────────────────────────────────────────
('warby-parker',       'Warby Parker',       'https://www.warbyparker.com',        'startups', 'dtc-eyewear', 'queued'),
('allbirds',           'Allbirds',           'https://www.allbirds.com',           'startups', 'dtc-footwear', 'queued'),
('casper',             'Casper',             'https://casper.com',                 'startups', 'dtc-mattress', 'queued'),
('away-travel',        'Away',               'https://www.awaytravel.com',         'startups', 'dtc-travel', 'queued'),
('glossier',           'Glossier',           'https://www.glossier.com',           'startups', 'dtc-beauty', 'queued'),
('harry-s',            'Harry''s',           'https://www.harrys.com',             'startups', 'dtc-personal-care', 'queued'),
('dollar-shave-club',  'Dollar Shave Club',  'https://www.dollarshaveclub.com',    'startups', 'dtc-personal-care', 'queued'),
('faire',              'Faire',              'https://www.faire.com',              'startups', 'b2b-marketplace', 'queued'),
('thrasio',            'Thrasio',            'https://www.thrasio.com',            'startups', 'aggregator', 'queued'),
('mansa-finance',      'Mansa',              'https://mansafinance.co',            'startups', 'fintech', 'queued'),

-- ─── Travel / hospitality ─────────────────────────────────────────────────
('airbnb',             'Airbnb',             'https://www.airbnb.com',             'startups', 'travel-marketplace', 'queued'),
('vrbo',               'Vrbo',               'https://www.vrbo.com',               'startups', 'travel-marketplace', 'queued'),
('hopper',             'Hopper',             'https://www.hopper.com',             'startups', 'travel-booking', 'queued'),
('lemonade',           'Lemonade',           'https://www.lemonade.com',           'startups', 'insurtech', 'queued'),
('next-insurance',     'Next Insurance',     'https://www.nextinsurance.com',      'startups', 'insurtech', 'queued'),
('hippo',              'Hippo Insurance',    'https://www.hippo.com',              'startups', 'insurtech', 'queued'),
('root-insurance',     'Root Insurance',     'https://www.joinroot.com',           'startups', 'insurtech', 'queued'),

-- ─── Food / delivery ──────────────────────────────────────────────────────
('doordash',           'DoorDash',           'https://www.doordash.com',           'startups', 'food-delivery', 'queued'),
('instacart',          'Instacart',          'https://www.instacart.com',          'startups', 'grocery-delivery', 'queued'),
('gopuff',             'Gopuff',             'https://gopuff.com',                 'startups', 'instant-delivery', 'queued'),
('getir',              'Getir',              'https://getir.com',                  'startups', 'instant-delivery', 'queued'),
('gorillas',           'Gorillas',           'https://gorillas.io',                'startups', 'instant-delivery', 'queued'),
('blue-apron',         'Blue Apron',         'https://www.blueapron.com',          'startups', 'meal-kit', 'queued'),
('hello-fresh',        'HelloFresh',         'https://www.hellofresh.com',         'startups', 'meal-kit', 'queued'),
('factor',             'Factor',             'https://www.factor75.com',           'startups', 'meal-delivery', 'queued'),

-- ─── Mobility / transportation ────────────────────────────────────────────
('uber',               'Uber',               'https://www.uber.com',               'startups', 'rideshare', 'queued'),
('lyft',               'Lyft',               'https://www.lyft.com',               'startups', 'rideshare', 'queued'),
('bird-rides',         'Bird',               'https://www.bird.co',                'startups', 'micro-mobility', 'queued'),
('lime',               'Lime',               'https://www.li.me',                  'startups', 'micro-mobility', 'queued'),
('rivian',             'Rivian',             'https://rivian.com',                 'startups', 'electric-vehicles', 'queued'),
('lucid-motors',       'Lucid Motors',       'https://www.lucidmotors.com',        'startups', 'electric-vehicles', 'queued'),
('cruise',             'Cruise',             'https://www.getcruise.com',          'startups', 'autonomous-driving', 'queued'),
('waymo',              'Waymo',              'https://waymo.com',                  'startups', 'autonomous-driving', 'queued'),

-- ─── Creator / community / social ─────────────────────────────────────────
('patreon',            'Patreon',            'https://www.patreon.com',            'startups', 'creator-platform', 'queued'),
('discord',            'Discord',            'https://discord.com',                'startups', 'community-platform', 'queued'),
('clubhouse',          'Clubhouse',          'https://www.clubhouse.com',          'startups', 'audio-social', 'queued'),
('bereal',             'BeReal',             'https://bereal.com',                 'startups', 'social-app', 'queued'),
('mastodon',           'Mastodon',           'https://joinmastodon.org',           'startups', 'social-platform', 'queued'),
('bluesky',            'Bluesky',            'https://bsky.app',                   'startups', 'social-platform', 'queued'),
('threads',            'Threads',            'https://www.threads.net',            'startups', 'social-platform', 'queued'),
('lemon8',             'Lemon8',             'https://www.lemon8-app.com',         'startups', 'social-platform', 'queued'),

-- ─── Edtech ───────────────────────────────────────────────────────────────
('duolingo',           'Duolingo',           'https://www.duolingo.com',           'startups', 'language-learning', 'queued'),
('coursera',           'Coursera',           'https://www.coursera.org',           'startups', 'online-education', 'queued'),
('udemy',              'Udemy',              'https://www.udemy.com',              'startups', 'online-education', 'queued'),
('masterclass',        'MasterClass',        'https://www.masterclass.com',        'startups', 'online-education', 'queued'),
('outschool',          'Outschool',          'https://outschool.com',              'startups', 'kids-education', 'queued'),
('lambda-school',      'BloomTech',          'https://www.bloomtech.com',          'startups', 'coding-bootcamp', 'queued'),
('codecademy',         'Codecademy',         'https://www.codecademy.com',         'startups', 'coding-education', 'queued'),
('treehouse',          'Treehouse',          'https://teamtreehouse.com',          'startups', 'coding-education', 'queued'),
('skillshare',         'Skillshare',         'https://www.skillshare.com',         'startups', 'online-education', 'queued'),
('brilliant',          'Brilliant',          'https://brilliant.org',              'startups', 'online-education', 'queued'),
('outlier-org',        'Outlier.org',        'https://www.outlier.org',            'startups', 'online-education', 'queued'),
('superhi',            'SuperHi',            'https://www.superhi.com',            'startups', 'creative-education', 'queued'),

-- ─── Climate / sustainability ─────────────────────────────────────────────
('watershed',          'Watershed',          'https://watershed.com',              'startups', 'climate-tech', 'queued'),
('persefoni',          'Persefoni',          'https://www.persefoni.com',          'startups', 'climate-tech', 'queued'),
('climeworks',         'Climeworks',         'https://climeworks.com',             'startups', 'carbon-capture', 'queued'),
('charm-industrial',   'Charm Industrial',   'https://charmindustrial.com',        'startups', 'carbon-capture', 'queued'),
('pachama',            'Pachama',            'https://pachama.com',                'startups', 'carbon-markets', 'queued'),
('patch-io',           'Patch',              'https://www.patch.io',               'startups', 'carbon-markets', 'queued'),
('arcadia',            'Arcadia',            'https://www.arcadia.com',            'startups', 'clean-energy', 'queued'),
('cleartrace',         'ClearTrace',         'https://cleartrace.io',              'startups', 'climate-tech', 'queued'),
('terabase-energy',    'Terabase Energy',    'https://www.terabase.energy',        'startups', 'clean-energy', 'queued'),

-- ─── Productivity / B2B SaaS startups ─────────────────────────────────────
('superhuman',         'Superhuman',         'https://superhuman.com',             'startups', 'email-client', 'queued'),
('linear-app',         'Linear',             'https://linear.app',                 'startups', 'project-management', 'queued'),
('craft-do',           'Craft',              'https://www.craft.do',               'startups', 'note-taking', 'queued'),
('roam-research',      'Roam Research',      'https://roamresearch.com',           'startups', 'knowledge-management', 'queued'),
('obsidian-md',        'Obsidian',           'https://obsidian.md',                'startups', 'note-taking', 'queued'),
('logseq',             'Logseq',             'https://logseq.com',                 'startups', 'knowledge-management', 'queued'),
('arc-browser',        'The Browser Company','https://arc.net',                    'startups', 'web-browser', 'queued'),
('raycast',            'Raycast',            'https://www.raycast.com',            'startups', 'productivity-launcher', 'queued'),
('alfred-app',         'Alfred',             'https://www.alfredapp.com',          'startups', 'productivity-launcher', 'queued'),
('arc-search',         'Arc Search',         'https://arc.net/search',             'startups', 'mobile-browser', 'queued'),
('warp-terminal',      'Warp',               'https://www.warp.dev',               'startups', 'terminal-app', 'queued'),
('linear-pages',       'Linear Pages',       'https://linear.app/pages',           'startups', 'document-collaboration', 'queued'),

-- ─── Notable YC alumni / recent batches ──────────────────────────────────
('rilla',              'Rilla',              'https://rilla.com',                  'startups', 'sales-ai', 'queued'),
('hatch-app',          'Hatch',              'https://usehatch.ai',                'startups', 'sales-ai', 'queued'),
('clay-app',           'Clay',               'https://clay.com',                   'startups', 'personal-crm', 'queued'),
('cron',               'Cron',               'https://cron.com',                   'startups', 'calendar-app', 'queued'),
('amie',               'Amie',               'https://www.amie.so',                'startups', 'calendar-app', 'queued'),
('akiflow',            'Akiflow',            'https://akiflow.com',                'startups', 'calendar-app', 'queued'),
('superlist',          'Superlist',          'https://www.superlist.com',          'startups', 'task-management', 'queued'),
('numeric',            'Numeric',            'https://www.numeric.io',             'startups', 'finance-ops', 'queued'),
('puzzle-io',          'Puzzle',             'https://puzzle.io',                  'startups', 'accounting-software', 'queued'),
('rho-business',       'Rho',                'https://www.rho.co',                 'startups', 'business-banking', 'queued'),
('navan',              'Navan',              'https://navan.com',                  'startups', 'business-travel', 'queued'),
('ramp-fin',           'Ramp',               'https://ramp.com',                   'startups', 'corporate-card', 'queued'),

-- ─── Notable startups in dev / engineering tools ──────────────────────────
('warp-dev',           'Warp',               'https://www.warp.dev',               'startups', 'developer-tools', 'queued'),
('fig-io',             'Fig',                'https://fig.io',                     'startups', 'developer-tools', 'queued'),
('windmill-dev',       'Windmill',           'https://www.windmill.dev',           'startups', 'workflow-platform', 'queued'),
('temporal',           'Temporal',           'https://temporal.io',                'startups', 'workflow-platform', 'queued'),
('inngest',            'Inngest',            'https://www.inngest.com',            'startups', 'workflow-platform', 'queued'),
('trigger-dev',        'Trigger.dev',        'https://trigger.dev',                'startups', 'workflow-platform', 'queued'),
('hookdeck',           'Hookdeck',           'https://hookdeck.com',               'startups', 'webhook-platform', 'queued'),
('svix',               'Svix',               'https://www.svix.com',               'startups', 'webhook-platform', 'queued'),
('liveblocks',         'Liveblocks',         'https://liveblocks.io',              'startups', 'collaboration-api', 'queued'),
('xata',               'Xata',               'https://xata.io',                    'startups', 'serverless-database', 'queued'),
('encore-dev',         'Encore',             'https://encore.dev',                 'startups', 'backend-framework', 'queued'),
('val-town',           'Val Town',           'https://www.val.town',               'startups', 'developer-tools', 'queued'),

-- ─── Notable startups in design / creator ─────────────────────────────────
('figma-config',       'Figma',              'https://www.figma.com',              'startups', 'design-platform', 'queued'),
('beautiful-ai',       'Beautiful.ai',       'https://www.beautiful.ai',           'startups', 'presentation-software', 'queued'),
('pitch-com',          'Pitch',              'https://pitch.com',                  'startups', 'presentation-software', 'queued'),
('tome-app',           'Tome',               'https://tome.app',                   'startups', 'presentation-software', 'queued'),
('gamma-app',          'Gamma',              'https://gamma.app',                  'startups', 'presentation-software', 'queued'),
('flowwo',             'Flow',               'https://flowapp.info',               'startups', 'design-software', 'queued'),
('rive-app',           'Rive',               'https://rive.app',                   'startups', 'animation-tool', 'queued'),
('lottiefiles',        'LottieFiles',        'https://lottiefiles.com',            'startups', 'animation-platform', 'queued'),
('spline',             'Spline',             'https://spline.design',              'startups', '3d-design', 'queued'),

-- ─── Notable startups in security ────────────────────────────────────────
('wiz-io',             'Wiz',                'https://www.wiz.io',                 'startups', 'cloud-security', 'queued'),
('orca-security',      'Orca Security',      'https://orca.security',              'startups', 'cloud-security', 'queued'),
('lacework',           'Lacework',           'https://www.lacework.com',           'startups', 'cloud-security', 'queued'),
('aqua-security',      'Aqua Security',      'https://www.aquasec.com',            'startups', 'cloud-security', 'queued'),
('semgrep',            'Semgrep',            'https://semgrep.dev',                'startups', 'code-security', 'queued'),
('socket-dev',         'Socket',             'https://socket.dev',                 'startups', 'supply-chain-security', 'queued'),
('snyk-com',           'Snyk',               'https://snyk.io',                    'startups', 'developer-security', 'queued'),
('teleport',           'Teleport',           'https://goteleport.com',             'startups', 'identity-security', 'queued'),

-- ─── Notable B2B startups ────────────────────────────────────────────────
('retool',             'Retool',             'https://retool.com',                 'startups', 'internal-tools', 'queued'),
('budibase',           'Budibase',           'https://budibase.com',               'startups', 'internal-tools', 'queued'),
('appsmith',           'Appsmith',           'https://www.appsmith.com',           'startups', 'internal-tools', 'queued'),
('toolio',             'Tooljet',            'https://tooljet.com',                'startups', 'internal-tools', 'queued'),
('grouparoo',          'Grouparoo',          'https://www.grouparoo.com',          'startups', 'data-integration', 'queued'),
('hightouch',          'Hightouch',          'https://hightouch.com',              'startups', 'reverse-etl', 'queued'),
('census-co',          'Census',             'https://www.getcensus.com',          'startups', 'reverse-etl', 'queued'),
('rudderstack',        'RudderStack',        'https://rudderstack.com',            'startups', 'cdp', 'queued'),
('segment',            'Twilio Segment',     'https://segment.com',                'startups', 'cdp', 'queued'),
('mparticle',          'mParticle',          'https://www.mparticle.com',          'startups', 'cdp', 'queued'),

-- ─── Notable startups in growth / marketing ──────────────────────────────
('reform-app',         'Reform',             'https://reform.app',                 'startups', 'form-builder', 'queued'),
('feathery',           'Feathery',           'https://www.feathery.io',            'startups', 'form-builder', 'queued'),
('formaloo',           'Formaloo',           'https://formaloo.com',               'startups', 'form-builder', 'queued'),
('common-room',        'Common Room',        'https://www.commonroom.io',          'startups', 'community-platform', 'queued'),
('bevy',               'Bevy',               'https://bevy.com',                   'startups', 'community-platform', 'queued'),
('mighty-networks',    'Mighty Networks',    'https://www.mightynetworks.com',     'startups', 'community-platform', 'queued'),
('circle-so',          'Circle',             'https://circle.so',                  'startups', 'community-platform', 'queued'),

-- ─── Notable startups in HR / hiring ─────────────────────────────────────
('ashby-app',          'Ashby',              'https://ashbyhq.com',                'startups', 'recruiting-software', 'queued'),
('rippling-startups',  'Rippling',           'https://rippling.com',               'startups', 'hr-platform', 'queued'),
('justworks',          'Justworks',          'https://www.justworks.com',          'startups', 'peo', 'queued'),
('trinet',             'TriNet',             'https://www.trinet.com',             'startups', 'peo', 'queued'),
('papayaaglobal',      'Papaya Global',      'https://www.papayaglobal.com',       'startups', 'global-payroll', 'queued'),
('lattice-com',        'Lattice',            'https://lattice.com',                'startups', 'performance-management', 'queued'),
('15five',             '15Five',             'https://www.15five.com',             'startups', 'performance-management', 'queued'),
('officevibe',         'Officevibe',         'https://officevibe.com',             'startups', 'employee-engagement', 'queued'),
('culture-amp',        'Culture Amp',        'https://www.cultureamp.com',         'startups', 'employee-engagement', 'queued'),

-- ─── Notable consumer apps ────────────────────────────────────────────────
('notion-mail',        'Notion Mail',        'https://www.notion.so/product/mail', 'startups', 'email-client', 'queued'),
('hey-com',            'HEY',                'https://www.hey.com',                'startups', 'email-client', 'queued'),
('substack-startups',  'Substack',           'https://substack.com',               'startups', 'creator-platform', 'queued'),
('beehiiv-startups',   'Beehiiv',            'https://www.beehiiv.com',            'startups', 'creator-platform', 'queued'),
('memberstack',        'Memberstack',        'https://www.memberstack.com',        'startups', 'membership-platform', 'queued'),
('outseta',            'Outseta',            'https://www.outseta.com',            'startups', 'all-in-one-saas', 'queued'),
('sendowl',            'SendOwl',            'https://www.sendowl.com',            'startups', 'digital-products', 'queued'),
('gumroad',            'Gumroad',            'https://gumroad.com',                'startups', 'digital-products', 'queued'),

-- ─── Notable scale-ups ────────────────────────────────────────────────────
('zapier-startup',     'Zapier',             'https://zapier.com',                 'startups', 'workflow-automation', 'queued'),
('asana-startup',      'Asana',              'https://asana.com',                  'startups', 'project-management', 'queued'),
('canva-startup',      'Canva',              'https://www.canva.com',              'startups', 'design-software', 'queued'),
('intercom-startup',   'Intercom',           'https://www.intercom.com',           'startups', 'customer-support', 'queued'),
('hubspot-startup',    'HubSpot',            'https://www.hubspot.com',            'startups', 'crm-platform', 'queued'),

-- ─── Notable Indian unicorns / startups ──────────────────────────────────
('zomato',             'Zomato',             'https://www.zomato.com',             'startups', 'food-delivery', 'queued'),
('swiggy',             'Swiggy',             'https://www.swiggy.com',             'startups', 'food-delivery', 'queued'),
('paytm',              'Paytm',              'https://paytm.com',                  'startups', 'fintech', 'queued'),
('razorpay-startup',   'Razorpay',           'https://razorpay.com',               'startups', 'fintech', 'queued'),
('cred',               'CRED',               'https://cred.club',                  'startups', 'fintech', 'queued'),
('groww',              'Groww',              'https://groww.in',                   'startups', 'fintech', 'queued'),
('zerodha',            'Zerodha',            'https://zerodha.com',                'startups', 'fintech', 'queued'),
('upstox',             'Upstox',             'https://upstox.com',                 'startups', 'fintech', 'queued'),
('phonepe',            'PhonePe',            'https://www.phonepe.com',            'startups', 'fintech', 'queued'),
('byjus',              'BYJU''S',            'https://byjus.com',                  'startups', 'edtech', 'queued'),
('unacademy',          'Unacademy',          'https://unacademy.com',              'startups', 'edtech', 'queued'),
('vedantu',            'Vedantu',            'https://www.vedantu.com',            'startups', 'edtech', 'queued'),
('cure-fit',           'cult.fit',           'https://www.cult.fit',               'startups', 'wellness', 'queued'),
('practo',             'Practo',             'https://www.practo.com',             'startups', 'healthtech', 'queued'),
('meesho',             'Meesho',             'https://www.meesho.com',             'startups', 'social-commerce', 'queued'),
('udaan',              'Udaan',              'https://udaan.com',                  'startups', 'b2b-marketplace', 'queued'),
('blinkit',            'Blinkit',            'https://blinkit.com',                'startups', 'quick-commerce', 'queued'),
('zepto',              'Zepto',              'https://www.zeptonow.com',           'startups', 'quick-commerce', 'queued'),
('boat',               'boAt',               'https://www.boat-lifestyle.com',     'startups', 'consumer-electronics', 'queued'),
('mamaearth',          'Mamaearth',          'https://mamaearth.in',               'startups', 'dtc-personal-care', 'queued'),
('lenskart',           'Lenskart',           'https://www.lenskart.com',           'startups', 'dtc-eyewear', 'queued'),
('nykaa',              'Nykaa',              'https://www.nykaa.com',              'startups', 'beauty-marketplace', 'queued'),
('urban-company',      'Urban Company',      'https://www.urbancompany.com',       'startups', 'services-marketplace', 'queued'),
('inshorts',           'Inshorts',           'https://www.inshorts.com',           'startups', 'news-app', 'queued'),

-- ─── European unicorns / startups ─────────────────────────────────────────
('spotify',            'Spotify',            'https://www.spotify.com',            'startups', 'music-streaming', 'queued'),
('deliveroo',          'Deliveroo',          'https://deliveroo.com',              'startups', 'food-delivery', 'queued'),
('bolt-eu',            'Bolt',               'https://bolt.eu',                    'startups', 'rideshare', 'queued'),
('miro-startup',       'Miro',               'https://miro.com',                   'startups', 'whiteboard-software', 'queued'),
('personio',           'Personio',           'https://www.personio.com',           'startups', 'hr-platform', 'queued'),
('contentful',         'Contentful',         'https://www.contentful.com',         'startups', 'headless-cms', 'queued'),
('sanity-io',          'Sanity',             'https://www.sanity.io',              'startups', 'headless-cms', 'queued'),
('strapi',             'Strapi',             'https://strapi.io',                  'startups', 'headless-cms', 'queued'),
('hygraph',            'Hygraph',            'https://hygraph.com',                'startups', 'headless-cms', 'queued'),
('storyblok',          'Storyblok',          'https://www.storyblok.com',          'startups', 'headless-cms', 'queued'),
('contentstack',       'Contentstack',       'https://www.contentstack.com',       'startups', 'headless-cms', 'queued'),
('directus',           'Directus',           'https://directus.io',                'startups', 'headless-cms', 'queued'),
('payhawk',            'Payhawk',            'https://payhawk.com',                'startups', 'corporate-card', 'queued'),
('pleo',               'Pleo',               'https://www.pleo.io',                'startups', 'corporate-card', 'queued'),
('spendesk',           'Spendesk',           'https://www.spendesk.com',           'startups', 'spend-management', 'queued'),
('qonto',              'Qonto',              'https://qonto.com',                  'startups', 'business-banking', 'queued'),

-- ─── Notable indie / bootstrapped startups ────────────────────────────────
('basecamp-indie',     'Basecamp',           'https://basecamp.com',               'startups', 'project-management', 'queued'),
('ghost-org',          'Ghost',              'https://ghost.org',                  'startups', 'publishing-platform', 'queued'),
('craft-cms',          'Craft CMS',          'https://craftcms.com',               'startups', 'cms', 'queued'),
('paperform',          'Paperform',          'https://paperform.co',               'startups', 'form-builder', 'queued'),
('tutorial-io',        'Tuturial.io',        'https://tuturial.io',                'startups', 'edtech', 'queued'),
('savvycal-indie',     'SavvyCal',           'https://savvycal.com',               'startups', 'scheduling-software', 'queued'),
('plausible-indie',    'Plausible',          'https://plausible.io',               'startups', 'web-analytics', 'queued'),
('fathom-indie',       'Fathom Analytics',   'https://usefathom.com',              'startups', 'web-analytics', 'queued'),
('imagekit',           'ImageKit',           'https://imagekit.io',                'startups', 'image-cdn', 'queued'),
('uploadcare',         'Uploadcare',         'https://uploadcare.com',             'startups', 'image-cdn', 'queued'),
('cloudinary',         'Cloudinary',         'https://cloudinary.com',             'startups', 'image-cdn', 'queued')

ON DUPLICATE KEY UPDATE id = id;
