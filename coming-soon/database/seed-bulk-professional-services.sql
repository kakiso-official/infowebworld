-- ============================================================================
-- Seed: Professional Services — 100 real firms for the scraper queue.
-- Mirrors seed-bulk-aiml.sql: feeds scrape_jobs so the Gemini worker crawls
-- each site and extracts full listing info (tagline, description, services,
-- pricing where published, FAQs, pros/cons, etc.).
--
-- category_l1   = 'professional-services'  (the worker L1 filter value)
-- category_slug = a REAL taxonomy slug — an L3 for the six marquee verticals
--                 (accounting / consulting / financial advisory / HR / legal /
--                 marketing), or the valid L2 slug for the niche verticals
--                 (real estate / insurance / investment banking / architecture).
--
-- NOTE: this replaces an earlier draft that used placeholder slugs
-- (law-firm, accounting-firm, staffing-agency, insurance-broker,
-- commercial-real-estate, investment-bank, …) which do NOT exist in
-- app/config/categories-data.ts and would mis-file every listing at apply
-- time. If that earlier draft was already run, also run the UPDATE remap in
-- the accompanying DB-queries note to fix the rows already in scrape_jobs.
--
-- ON DUPLICATE KEY UPDATE id=id makes this re-runnable / idempotent — any
-- slug already in scrape_jobs is skipped. Run in phpMyAdmin → SQL tab.
-- ============================================================================

INSERT INTO scrape_jobs (slug, company_name, website, category_l1, category_slug, status)
VALUES

-- ─── Accounting & Tax Services (13) ─────────────────────────────────────────
('deloitte',            'Deloitte',            'https://www.deloitte.com',            'professional-services', 'audit-assurance',      'queued'),
('pwc',                 'PwC',                 'https://www.pwc.com',                 'professional-services', 'audit-assurance',      'queued'),
('ey',                  'EY',                  'https://www.ey.com',                  'professional-services', 'audit-assurance',      'queued'),
('kpmg',                'KPMG',                'https://www.kpmg.com',                'professional-services', 'audit-assurance',      'queued'),
('rsm-us',              'RSM US',              'https://www.rsmus.com',               'professional-services', 'cpa-accounting-firms', 'queued'),
('grant-thornton',      'Grant Thornton',      'https://www.grantthornton.com',       'professional-services', 'cpa-accounting-firms', 'queued'),
('bdo-usa',             'BDO USA',             'https://www.bdo.com',                 'professional-services', 'cpa-accounting-firms', 'queued'),
('crowe',               'Crowe',               'https://www.crowe.com',               'professional-services', 'cpa-accounting-firms', 'queued'),
('baker-tilly',         'Baker Tilly',         'https://www.bakertilly.com',          'professional-services', 'cpa-accounting-firms', 'queued'),
('moss-adams',          'Moss Adams',          'https://www.mossadams.com',           'professional-services', 'cpa-accounting-firms', 'queued'),
('cohnreznick',         'CohnReznick',         'https://www.cohnreznick.com',         'professional-services', 'cpa-accounting-firms', 'queued'),
('bench-accounting',    'Bench Accounting',    'https://www.bench.co',                'professional-services', 'bookkeeping',          'queued'),
('pilot-com',           'Pilot',               'https://www.pilot.com',               'professional-services', 'bookkeeping',          'queued'),

-- ─── Business Consulting (13) ───────────────────────────────────────────────
('mckinsey',            'McKinsey & Company',     'https://www.mckinsey.com',         'professional-services', 'management-consulting', 'queued'),
('bcg',                 'Boston Consulting Group','https://www.bcg.com',              'professional-services', 'management-consulting', 'queued'),
('bain-company',        'Bain & Company',         'https://www.bain.com',             'professional-services', 'management-consulting', 'queued'),
('accenture',           'Accenture',              'https://www.accenture.com',        'professional-services', 'management-consulting', 'queued'),
('oliver-wyman',        'Oliver Wyman',           'https://www.oliverwyman.com',      'professional-services', 'management-consulting', 'queued'),
('kearney',             'Kearney',                'https://www.kearney.com',          'professional-services', 'management-consulting', 'queued'),
('lek-consulting',      'L.E.K. Consulting',      'https://www.lek.com',              'professional-services', 'management-consulting', 'queued'),
('west-monroe',         'West Monroe',            'https://www.westmonroe.com',       'professional-services', 'management-consulting', 'queued'),
('simon-kucher',        'Simon-Kucher',           'https://www.simon-kucher.com',     'professional-services', 'management-consulting', 'queued'),
('zs-associates',       'ZS Associates',          'https://www.zs.com',               'professional-services', 'industry-specific',     'queued'),
('fti-consulting',      'FTI Consulting',         'https://www.fticonsulting.com',    'professional-services', 'financial-m-a-advisory','queued'),
('alixpartners',        'AlixPartners',           'https://www.alixpartners.com',     'professional-services', 'financial-m-a-advisory','queued'),
('alvarez-marsal',      'Alvarez & Marsal',       'https://www.alvarezandmarsal.com', 'professional-services', 'financial-m-a-advisory','queued'),

-- ─── Financial Advisory & Planning (9) ──────────────────────────────────────
('fisher-investments',  'Fisher Investments',     'https://www.fisherinvestments.com','professional-services', 'wealth-management',   'queued'),
('edward-jones',        'Edward Jones',           'https://www.edwardjones.com',      'professional-services', 'financial-planning',  'queued'),
('charles-schwab',      'Charles Schwab',         'https://www.schwab.com',           'professional-services', 'investment-advisory', 'queued'),
('fidelity',            'Fidelity Investments',   'https://www.fidelity.com',         'professional-services', 'investment-advisory', 'queued'),
('vanguard',            'Vanguard',               'https://www.vanguard.com',         'professional-services', 'investment-advisory', 'queued'),
('mercer',              'Mercer',                 'https://www.mercer.com',           'professional-services', 'retirement-planning', 'queued'),
('wealthfront',         'Wealthfront',            'https://www.wealthfront.com',      'professional-services', 'wealth-management',   'queued'),
('betterment',          'Betterment',             'https://www.betterment.com',       'professional-services', 'wealth-management',   'queued'),
('empower',             'Empower',                'https://www.empower.com',          'professional-services', 'wealth-management',   'queued'),

-- ─── HR, Staffing & Recruiting (11) ─────────────────────────────────────────
('robert-half',         'Robert Half',            'https://www.roberthalf.com',       'professional-services', 'staffing-agencies-pro', 'queued'),
('randstad',            'Randstad',               'https://www.randstad.com',         'professional-services', 'staffing-agencies-pro', 'queued'),
('adecco',              'Adecco',                 'https://www.adecco.com',           'professional-services', 'staffing-agencies-pro', 'queued'),
('manpowergroup',       'ManpowerGroup',          'https://www.manpowergroup.com',    'professional-services', 'staffing-agencies-pro', 'queued'),
('hays',                'Hays',                   'https://www.hays.com',             'professional-services', 'staffing-agencies-pro', 'queued'),
('michael-page',        'Michael Page',           'https://www.michaelpage.com',      'professional-services', 'staffing-agencies-pro', 'queued'),
('korn-ferry',          'Korn Ferry',             'https://www.kornferry.com',        'professional-services', 'executive-search',      'queued'),
('heidrick-struggles',  'Heidrick & Struggles',   'https://www.heidrick.com',         'professional-services', 'executive-search',      'queued'),
('spencer-stuart',      'Spencer Stuart',         'https://www.spencerstuart.com',    'professional-services', 'executive-search',      'queued'),
('egon-zehnder',        'Egon Zehnder',           'https://www.egonzehnder.com',      'professional-services', 'executive-search',      'queued'),
('russell-reynolds',    'Russell Reynolds',       'https://www.russellreynolds.com',  'professional-services', 'executive-search',      'queued'),

-- ─── Marketing, Advertising & Communications (13) ───────────────────────────
('ogilvy',              'Ogilvy',                 'https://www.ogilvy.com',           'professional-services', 'advertising-agencies-pro', 'queued'),
('wpp',                 'WPP',                    'https://www.wpp.com',              'professional-services', 'full-service-marketing',   'queued'),
('publicis-groupe',     'Publicis Groupe',        'https://www.publicisgroupe.com',   'professional-services', 'full-service-marketing',   'queued'),
('omnicom-group',       'Omnicom Group',          'https://www.omnicomgroup.com',     'professional-services', 'full-service-marketing',   'queued'),
('dentsu',              'Dentsu',                 'https://www.dentsu.com',           'professional-services', 'full-service-marketing',   'queued'),
('bbdo',                'BBDO',                   'https://www.bbdo.com',             'professional-services', 'advertising-agencies-pro', 'queued'),
('edelman',             'Edelman',                'https://www.edelman.com',          'professional-services', 'public-relations-pro',     'queued'),
('weber-shandwick',     'Weber Shandwick',        'https://www.webershandwick.com',   'professional-services', 'public-relations-pro',     'queued'),
('interbrand',          'Interbrand',             'https://www.interbrand.com',       'professional-services', 'branding-design',          'queued'),
('landor',              'Landor',                 'https://www.landor.com',           'professional-services', 'branding-design',          'queued'),
('nielsen',             'Nielsen',                'https://www.nielsen.com',          'professional-services', 'market-research',          'queued'),
('ipsos',               'Ipsos',                  'https://www.ipsos.com',            'professional-services', 'market-research',          'queued'),
('kantar',              'Kantar',                 'https://www.kantar.com',           'professional-services', 'market-research',          'queued'),

-- ─── Legal Services (15) ────────────────────────────────────────────────────
('latham-watkins',      'Latham & Watkins',       'https://www.lw.com',               'professional-services', 'business-law',         'queued'),
('kirkland-ellis',      'Kirkland & Ellis',       'https://www.kirkland.com',         'professional-services', 'business-law',         'queued'),
('skadden',             'Skadden',                'https://www.skadden.com',          'professional-services', 'business-law',         'queued'),
('paul-weiss',          'Paul, Weiss',            'https://www.paulweiss.com',        'professional-services', 'business-law',         'queued'),
('davis-polk',          'Davis Polk',             'https://www.davispolk.com',        'professional-services', 'business-law',         'queued'),
('cravath',             'Cravath, Swaine & Moore','https://www.cravath.com',          'professional-services', 'business-law',         'queued'),
('sullivan-cromwell',   'Sullivan & Cromwell',    'https://www.sullcrom.com',         'professional-services', 'business-law',         'queued'),
('cooley',              'Cooley',                 'https://www.cooley.com',           'professional-services', 'business-law',         'queued'),
('wilson-sonsini',      'Wilson Sonsini',         'https://www.wsgr.com',             'professional-services', 'business-law',         'queued'),
('dla-piper',           'DLA Piper',              'https://www.dlapiper.com',         'professional-services', 'business-law',         'queued'),
('baker-mckenzie',      'Baker McKenzie',         'https://www.bakermckenzie.com',    'professional-services', 'business-law',         'queued'),
('jones-day',           'Jones Day',              'https://www.jonesday.com',         'professional-services', 'business-law',         'queued'),
('morgan-lewis',        'Morgan Lewis',           'https://www.morganlewis.com',      'professional-services', 'employment-law',       'queued'),
('fragomen',            'Fragomen',               'https://www.fragomen.com',         'professional-services', 'immigration',          'queued'),
('fish-richardson',     'Fish & Richardson',      'https://www.fr.com',               'professional-services', 'intellectual-property','queued'),

-- ─── Real Estate Professional Services (6) ──────────────────────────────────
('cbre',                'CBRE',                   'https://www.cbre.com',             'professional-services', 'real-estate-professional-services', 'queued'),
('jll',                 'JLL',                    'https://www.jll.com',              'professional-services', 'real-estate-professional-services', 'queued'),
('cushman-wakefield',   'Cushman & Wakefield',    'https://www.cushmanwakefield.com', 'professional-services', 'real-estate-professional-services', 'queued'),
('colliers',            'Colliers',               'https://www.colliers.com',         'professional-services', 'real-estate-professional-services', 'queued'),
('newmark',             'Newmark',                'https://www.nmrk.com',             'professional-services', 'real-estate-professional-services', 'queued'),
('savills',             'Savills',                'https://www.savills.com',          'professional-services', 'real-estate-professional-services', 'queued'),

-- ─── Insurance Professional Services (7) ────────────────────────────────────
('marsh',               'Marsh',                  'https://www.marsh.com',            'professional-services', 'insurance-professional-services', 'queued'),
('aon',                 'Aon',                    'https://www.aon.com',              'professional-services', 'insurance-professional-services', 'queued'),
('wtw',                 'WTW',                    'https://www.wtwco.com',            'professional-services', 'insurance-professional-services', 'queued'),
('gallagher',           'Arthur J. Gallagher',    'https://www.ajg.com',              'professional-services', 'insurance-professional-services', 'queued'),
('lockton',             'Lockton',                'https://www.lockton.com',          'professional-services', 'insurance-professional-services', 'queued'),
('hub-international',    'HUB International',       'https://www.hubinternational.com', 'professional-services', 'insurance-professional-services', 'queued'),
('embroker',            'Embroker',               'https://www.embroker.com',         'professional-services', 'insurance-professional-services', 'queued'),

-- ─── Investment Banking & Capital Markets (8) ───────────────────────────────
('goldman-sachs',       'Goldman Sachs',          'https://www.goldmansachs.com',     'professional-services', 'investment-banking-capital-markets', 'queued'),
('morgan-stanley',      'Morgan Stanley',         'https://www.morganstanley.com',    'professional-services', 'investment-banking-capital-markets', 'queued'),
('lazard',              'Lazard',                 'https://www.lazard.com',           'professional-services', 'investment-banking-capital-markets', 'queued'),
('evercore',            'Evercore',               'https://www.evercore.com',         'professional-services', 'investment-banking-capital-markets', 'queued'),
('moelis',              'Moelis & Company',       'https://www.moelis.com',           'professional-services', 'investment-banking-capital-markets', 'queued'),
('houlihan-lokey',      'Houlihan Lokey',         'https://www.hl.com',               'professional-services', 'investment-banking-capital-markets', 'queued'),
('jefferies',           'Jefferies',              'https://www.jefferies.com',        'professional-services', 'investment-banking-capital-markets', 'queued'),
('rothschild',          'Rothschild & Co',        'https://www.rothschildandco.com',  'professional-services', 'investment-banking-capital-markets', 'queued'),

-- ─── Architecture, Engineering & Design (5) ─────────────────────────────────
('gensler',             'Gensler',                'https://www.gensler.com',          'professional-services', 'architecture-engineering-design', 'queued'),
('aecom',               'AECOM',                  'https://www.aecom.com',            'professional-services', 'architecture-engineering-design', 'queued'),
('jacobs',              'Jacobs',                 'https://www.jacobs.com',           'professional-services', 'architecture-engineering-design', 'queued'),
('perkins-will',        'Perkins&Will',           'https://www.perkinswill.com',      'professional-services', 'architecture-engineering-design', 'queued'),
('arup',                'Arup',                   'https://www.arup.com',             'professional-services', 'architecture-engineering-design', 'queued')

ON DUPLICATE KEY UPDATE id = id;
