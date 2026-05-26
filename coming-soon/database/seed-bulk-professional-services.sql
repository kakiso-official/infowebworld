-- ============================================================================
-- Seed: Professional Services — ~160 real firms for the scraper queue.
-- ON DUPLICATE KEY UPDATE id=id makes this re-runnable / idempotent.
-- Run in phpMyAdmin → SQL tab.
-- ============================================================================

INSERT INTO scrape_jobs (slug, company_name, website, category_l1, category_slug, status)
VALUES

-- ─── Big 4 + global consulting ────────────────────────────────────────────
('deloitte',           'Deloitte',           'https://www2.deloitte.com',          'professional-services', 'management-consulting', 'queued'),
('pwc',                'PwC',                'https://www.pwc.com',                'professional-services', 'management-consulting', 'queued'),
('ey',                 'EY',                 'https://www.ey.com',                 'professional-services', 'management-consulting', 'queued'),
('kpmg',               'KPMG',               'https://kpmg.com',                   'professional-services', 'management-consulting', 'queued'),
('mckinsey',           'McKinsey & Company', 'https://www.mckinsey.com',           'professional-services', 'management-consulting', 'queued'),
('bcg',                'Boston Consulting Group', 'https://www.bcg.com',           'professional-services', 'management-consulting', 'queued'),
('bain',               'Bain & Company',     'https://www.bain.com',               'professional-services', 'management-consulting', 'queued'),
('strategy-and',       'Strategy&',          'https://www.strategyand.pwc.com',    'professional-services', 'management-consulting', 'queued'),
('oliver-wyman',       'Oliver Wyman',       'https://www.oliverwyman.com',        'professional-services', 'management-consulting', 'queued'),
('roland-berger',      'Roland Berger',      'https://www.rolandberger.com',       'professional-services', 'management-consulting', 'queued'),
('at-kearney',         'Kearney',            'https://www.kearney.com',            'professional-services', 'management-consulting', 'queued'),
('lek-consulting',     'L.E.K. Consulting',  'https://www.lek.com',                'professional-services', 'management-consulting', 'queued'),
('zs-associates',      'ZS Associates',      'https://www.zs.com',                 'professional-services', 'management-consulting', 'queued'),
('parthenon-group',    'EY-Parthenon',       'https://www.ey.com/en_us/parthenon', 'professional-services', 'management-consulting', 'queued'),
('alixpartners',       'AlixPartners',       'https://www.alixpartners.com',       'professional-services', 'management-consulting', 'queued'),
('alvarez-marsal',     'Alvarez & Marsal',   'https://www.alvarezandmarsal.com',   'professional-services', 'management-consulting', 'queued'),
('ftj-consulting',     'FTI Consulting',     'https://www.fticonsulting.com',      'professional-services', 'management-consulting', 'queued'),

-- ─── Tech-focused law firms (Silicon Valley) ──────────────────────────────
('cooley',             'Cooley',             'https://www.cooley.com',             'professional-services', 'law-firm', 'queued'),
('wsgr',                'Wilson Sonsini Goodrich & Rosati', 'https://www.wsgr.com', 'professional-services', 'law-firm', 'queued'),
('fenwick-west',       'Fenwick & West',     'https://www.fenwick.com',            'professional-services', 'law-firm', 'queued'),
('gunderson',          'Gunderson Dettmer',  'https://www.gunder.com',             'professional-services', 'law-firm', 'queued'),
('orrick',             'Orrick',             'https://www.orrick.com',             'professional-services', 'law-firm', 'queued'),
('latham-watkins',     'Latham & Watkins',   'https://www.lw.com',                 'professional-services', 'law-firm', 'queued'),
('kirkland-ellis',     'Kirkland & Ellis',   'https://www.kirkland.com',           'professional-services', 'law-firm', 'queued'),
('skadden',            'Skadden, Arps, Slate, Meagher & Flom', 'https://www.skadden.com', 'professional-services', 'law-firm', 'queued'),
('paul-weiss',         'Paul, Weiss',        'https://www.paulweiss.com',          'professional-services', 'law-firm', 'queued'),
('davis-polk',         'Davis Polk',         'https://www.davispolk.com',          'professional-services', 'law-firm', 'queued'),
('cravath',            'Cravath, Swaine & Moore', 'https://www.cravath.com',       'professional-services', 'law-firm', 'queued'),
('debevoise',          'Debevoise & Plimpton', 'https://www.debevoise.com',        'professional-services', 'law-firm', 'queued'),
('sullivan-cromwell',  'Sullivan & Cromwell','https://www.sullcrom.com',           'professional-services', 'law-firm', 'queued'),
('weil-gotshal',       'Weil, Gotshal & Manges', 'https://www.weil.com',           'professional-services', 'law-firm', 'queued'),
('mayer-brown',        'Mayer Brown',        'https://www.mayerbrown.com',         'professional-services', 'law-firm', 'queued'),
('white-case',         'White & Case',       'https://www.whitecase.com',          'professional-services', 'law-firm', 'queued'),
('morgan-lewis',       'Morgan Lewis',       'https://www.morganlewis.com',        'professional-services', 'law-firm', 'queued'),
('dla-piper',          'DLA Piper',          'https://www.dlapiper.com',           'professional-services', 'law-firm', 'queued'),
('baker-mckenzie',     'Baker McKenzie',     'https://www.bakermckenzie.com',      'professional-services', 'law-firm', 'queued'),
('hogan-lovells',      'Hogan Lovells',      'https://www.hoganlovells.com',       'professional-services', 'law-firm', 'queued'),
('norton-rose',        'Norton Rose Fulbright', 'https://www.nortonrosefulbright.com', 'professional-services', 'law-firm', 'queued'),
('clifford-chance',    'Clifford Chance',    'https://www.cliffordchance.com',     'professional-services', 'law-firm', 'queued'),
('allen-overy',        'A&O Shearman',       'https://www.aoshearman.com',         'professional-services', 'law-firm', 'queued'),
('freshfields',        'Freshfields',        'https://www.freshfields.com',        'professional-services', 'law-firm', 'queued'),
('linklaters',         'Linklaters',         'https://www.linklaters.com',         'professional-services', 'law-firm', 'queued'),

-- ─── Boutique tech / startup law firms ────────────────────────────────────
('atrium-law',         'Atrium',             'https://www.atrium.co',              'professional-services', 'law-firm', 'queued'),
('latacora',           'Latacora',           'https://latacora.com',               'professional-services', 'security-consulting', 'queued'),
('ironclad-app',       'Ironclad',           'https://ironcladapp.com',            'professional-services', 'legal-tech', 'queued'),
('lawmatics',          'Lawmatics',          'https://www.lawmatics.com',          'professional-services', 'legal-tech', 'queued'),
('clio',               'Clio',               'https://www.clio.com',               'professional-services', 'legal-tech', 'queued'),

-- ─── Accounting / bookkeeping firms ───────────────────────────────────────
('rsm-us',             'RSM US',             'https://rsmus.com',                  'professional-services', 'accounting-firm', 'queued'),
('grant-thornton',     'Grant Thornton',     'https://www.grantthornton.com',      'professional-services', 'accounting-firm', 'queued'),
('bdo',                'BDO',                'https://www.bdo.com',                'professional-services', 'accounting-firm', 'queued'),
('crowe',              'Crowe',              'https://www.crowe.com',              'professional-services', 'accounting-firm', 'queued'),
('mazars',             'Mazars',             'https://www.mazars.com',             'professional-services', 'accounting-firm', 'queued'),
('moss-adams',         'Moss Adams',         'https://www.mossadams.com',          'professional-services', 'accounting-firm', 'queued'),
('plante-moran',       'Plante Moran',       'https://www.plantemoran.com',        'professional-services', 'accounting-firm', 'queued'),
('cherry-bekaert',     'Cherry Bekaert',     'https://www.cbh.com',                'professional-services', 'accounting-firm', 'queued'),
('eisneramper',        'EisnerAmper',        'https://www.eisneramper.com',        'professional-services', 'accounting-firm', 'queued'),
('cohnreznick',        'CohnReznick',        'https://www.cohnreznick.com',        'professional-services', 'accounting-firm', 'queued'),
('marcum',             'Marcum',             'https://www.marcumllp.com',          'professional-services', 'accounting-firm', 'queued'),
('cbiz',               'CBIZ',               'https://www.cbiz.com',               'professional-services', 'accounting-firm', 'queued'),
('aprio',              'Aprio',              'https://www.aprio.com',              'professional-services', 'accounting-firm', 'queued'),
('withum',             'Withum',             'https://www.withum.com',             'professional-services', 'accounting-firm', 'queued'),
('dixon-hughes',       'FORVIS',             'https://www.forvis.com',             'professional-services', 'accounting-firm', 'queued'),
('amper-politziner',   'EisnerAmper',        'https://www.eisneramper.com',        'professional-services', 'accounting-firm', 'queued'),

-- ─── HR / executive search ────────────────────────────────────────────────
('mercer',             'Mercer',             'https://www.mercer.com',             'professional-services', 'hr-consulting', 'queued'),
('aon',                'Aon',                'https://www.aon.com',                'professional-services', 'hr-consulting', 'queued'),
('willis-towers',      'WTW',                'https://www.wtwco.com',              'professional-services', 'hr-consulting', 'queued'),
('korn-ferry',         'Korn Ferry',         'https://www.kornferry.com',          'professional-services', 'executive-search', 'queued'),
('spencer-stuart',     'Spencer Stuart',     'https://www.spencerstuart.com',      'professional-services', 'executive-search', 'queued'),
('heidrick-struggles', 'Heidrick & Struggles', 'https://www.heidrick.com',         'professional-services', 'executive-search', 'queued'),
('egon-zehnder',       'Egon Zehnder',       'https://www.egonzehnder.com',        'professional-services', 'executive-search', 'queued'),
('russell-reynolds',   'Russell Reynolds',   'https://www.russellreynolds.com',    'professional-services', 'executive-search', 'queued'),
('odgers-berndtson',   'Odgers Berndtson',   'https://www.odgersberndtson.com',    'professional-services', 'executive-search', 'queued'),
('robert-half',        'Robert Half',        'https://www.roberthalf.com',         'professional-services', 'staffing-agency', 'queued'),
('hays',               'Hays',               'https://www.hays.com',               'professional-services', 'staffing-agency', 'queued'),
('michael-page',       'Michael Page',       'https://www.michaelpage.com',        'professional-services', 'staffing-agency', 'queued'),
('manpower',           'ManpowerGroup',      'https://www.manpowergroup.com',      'professional-services', 'staffing-agency', 'queued'),
('adecco',             'Adecco',             'https://www.adecco.com',             'professional-services', 'staffing-agency', 'queued'),
('kelly-services',     'Kelly Services',     'https://www.kellyservices.com',      'professional-services', 'staffing-agency', 'queued'),
('randstad',           'Randstad',           'https://www.randstad.com',           'professional-services', 'staffing-agency', 'queued'),

-- ─── Specialty / boutique consulting ─────────────────────────────────────
('dalberg',            'Dalberg',            'https://dalberg.com',                'professional-services', 'social-impact-consulting', 'queued'),
('jurosolutions',      'Juro',               'https://juro.com',                   'professional-services', 'legal-tech', 'queued'),
('north-highland',     'North Highland',     'https://www.northhighland.com',      'professional-services', 'management-consulting', 'queued'),
('point-b',            'Point B',            'https://www.pointb.com',             'professional-services', 'management-consulting', 'queued'),
('west-monroe',        'West Monroe',        'https://www.westmonroe.com',         'professional-services', 'management-consulting', 'queued'),
('grant-thornton-uk',  'Grant Thornton UK',  'https://www.grantthornton.co.uk',    'professional-services', 'accounting-firm', 'queued'),
('accenture-strategy', 'Accenture Strategy', 'https://www.accenture.com/us-en/about/strategy-index', 'professional-services', 'strategy-consulting', 'queued'),
('avenue-code',        'Avenue Code',        'https://www.avenuecode.com',         'professional-services', 'it-consulting', 'queued'),

-- ─── Insurance / risk ─────────────────────────────────────────────────────
('marsh',              'Marsh',              'https://www.marsh.com',              'professional-services', 'insurance-broker', 'queued'),
('aon-risk',           'Aon Risk Solutions', 'https://www.aon.com',                'professional-services', 'insurance-broker', 'queued'),
('gallagher',          'Gallagher',          'https://www.ajg.com',                'professional-services', 'insurance-broker', 'queued'),
('brown-brown',        'Brown & Brown',      'https://www.bbinsurance.com',        'professional-services', 'insurance-broker', 'queued'),
('hub-international',  'HUB International',  'https://www.hubinternational.com',   'professional-services', 'insurance-broker', 'queued'),
('lockton',            'Lockton',            'https://www.lockton.com',            'professional-services', 'insurance-broker', 'queued'),
('hire-purchase',      'Vouch',              'https://www.vouch.us',               'professional-services', 'startup-insurance', 'queued'),
('embroker',           'Embroker',           'https://www.embroker.com',           'professional-services', 'startup-insurance', 'queued'),
('newfront',           'Newfront',           'https://www.newfront.com',           'professional-services', 'insurance-broker', 'queued'),

-- ─── Real estate / commercial brokerage ───────────────────────────────────
('cbre',               'CBRE',               'https://www.cbre.com',               'professional-services', 'commercial-real-estate', 'queued'),
('jll',                'JLL',                'https://www.jll.com',                'professional-services', 'commercial-real-estate', 'queued'),
('cushman-wakefield',  'Cushman & Wakefield','https://www.cushmanwakefield.com',   'professional-services', 'commercial-real-estate', 'queued'),
('colliers',           'Colliers',           'https://www.colliers.com',           'professional-services', 'commercial-real-estate', 'queued'),
('newmark',            'Newmark',            'https://www.nmrk.com',               'professional-services', 'commercial-real-estate', 'queued'),
('savills',            'Savills',            'https://www.savills.com',            'professional-services', 'commercial-real-estate', 'queued'),
('avison-young',       'Avison Young',       'https://www.avisonyoung.com',        'professional-services', 'commercial-real-estate', 'queued'),
('marcus-millichap',   'Marcus & Millichap', 'https://www.marcusmillichap.com',    'professional-services', 'commercial-real-estate', 'queued'),

-- ─── Financial advisory / wealth management ───────────────────────────────
('lazard',             'Lazard',             'https://www.lazard.com',             'professional-services', 'investment-bank', 'queued'),
('evercore',           'Evercore',           'https://www.evercore.com',           'professional-services', 'investment-bank', 'queued'),
('houlihan-lokey',     'Houlihan Lokey',     'https://hl.com',                     'professional-services', 'investment-bank', 'queued'),
('moelis',             'Moelis & Company',   'https://www.moelis.com',             'professional-services', 'investment-bank', 'queued'),
('rothschild',         'Rothschild & Co',    'https://www.rothschildandco.com',    'professional-services', 'investment-bank', 'queued'),
('greenhill',          'Greenhill & Co',     'https://www.greenhill.com',          'professional-services', 'investment-bank', 'queued'),
('perella-weinberg',   'Perella Weinberg Partners', 'https://www.pwpartners.com',  'professional-services', 'investment-bank', 'queued'),
('financial-services-cohen','Cohen & Steers','https://www.cohenandsteers.com',     'professional-services', 'investment-management', 'queued'),

-- ─── Marketing / brand strategy boutiques ─────────────────────────────────
('siegel-gale',        'Siegel+Gale',        'https://www.siegelgale.com',         'professional-services', 'brand-consulting', 'queued'),
('lippincott',          'Lippincott',         'https://lippincott.com',             'professional-services', 'brand-consulting', 'queued'),
('interbrand',         'Interbrand',         'https://interbrand.com',             'professional-services', 'brand-consulting', 'queued'),
('prophet',            'Prophet',            'https://prophet.com',                'professional-services', 'brand-consulting', 'queued'),
('brandwidth',         'Brandwidth',         'https://www.brandwidth.com',         'professional-services', 'brand-consulting', 'queued'),
('superunion',         'Superunion',         'https://www.superunion.com',         'professional-services', 'brand-consulting', 'queued'),
('vsa-partners',       'VSA Partners',       'https://www.vsapartners.com',        'professional-services', 'brand-consulting', 'queued'),

-- ─── Strategy / boutique firms ────────────────────────────────────────────
('innosight',          'Innosight',          'https://www.innosight.com',          'professional-services', 'innovation-consulting', 'queued'),
('what-if-innovation', 'What If Innovation', 'https://www.whatifinnovation.com',   'professional-services', 'innovation-consulting', 'queued'),
('the-cambridge-group', 'The Cambridge Group','https://www.thecambridgegroup.com', 'professional-services', 'management-consulting', 'queued'),
('partners-in-performance', 'Partners in Performance', 'https://www.pip.global', 'professional-services', 'management-consulting', 'queued'),
('analysis-group',     'Analysis Group',     'https://www.analysisgroup.com',      'professional-services', 'economic-consulting', 'queued'),
('nera-economic',      'NERA',               'https://www.nera.com',               'professional-services', 'economic-consulting', 'queued'),
('cornerstone-research','Cornerstone Research','https://www.cornerstone.com',      'professional-services', 'economic-consulting', 'queued'),
('charles-river',      'Charles River Associates', 'https://www.crai.com',         'professional-services', 'economic-consulting', 'queued'),
('compass-lexecon',    'Compass Lexecon',    'https://www.compasslexecon.com',     'professional-services', 'economic-consulting', 'queued'),

-- ─── Sales consulting / RevOps ────────────────────────────────────────────
('winning-by-design',  'Winning by Design',  'https://winningbydesign.com',        'professional-services', 'sales-consulting', 'queued'),
('challenger-inc',     'Challenger',         'https://www.challengerinc.com',      'professional-services', 'sales-consulting', 'queued'),
('miller-heiman',      'Korn Ferry Miller Heiman', 'https://www.millerheimangroup.com', 'professional-services', 'sales-training', 'queued'),
('sandler',            'Sandler Training',   'https://www.sandler.com',            'professional-services', 'sales-training', 'queued'),
('huthwaite',          'Huthwaite International', 'https://www.huthwaiteinternational.com', 'professional-services', 'sales-training', 'queued'),
('go-nimbly',          'Go Nimbly',          'https://gonimbly.com',               'professional-services', 'revops-consulting', 'queued'),

-- ─── Procurement / supply chain consulting ────────────────────────────────
('atkearney',          'Kearney',            'https://www.kearney.com',            'professional-services', 'supply-chain-consulting', 'queued'),
('exiger',             'Exiger',             'https://www.exiger.com',             'professional-services', 'risk-consulting', 'queued'),
('the-hackett-group',  'The Hackett Group',  'https://www.thehackettgroup.com',    'professional-services', 'management-consulting', 'queued'),
('huron-consulting',   'Huron Consulting Group', 'https://www.huronconsultinggroup.com', 'professional-services', 'management-consulting', 'queued'),
('navigant',           'Guidehouse',         'https://guidehouse.com',             'professional-services', 'management-consulting', 'queued'),
('boozAllen',          'Booz Allen Hamilton', 'https://www.boozallen.com',         'professional-services', 'management-consulting', 'queued'),

-- ─── Healthcare consulting ────────────────────────────────────────────────
('zs-healthcare',      'ZS Associates',      'https://www.zs.com',                 'professional-services', 'healthcare-consulting', 'queued'),
('healthadvances',     'Health Advances',    'https://www.healthadvances.com',     'professional-services', 'healthcare-consulting', 'queued'),
('advisory-board',     'Advisory Board',     'https://www.advisory.com',           'professional-services', 'healthcare-consulting', 'queued'),
('huron-healthcare',   'Huron Healthcare',   'https://www.huronconsultinggroup.com', 'professional-services', 'healthcare-consulting', 'queued'),
('chartis-group',      'The Chartis Group',  'https://www.chartis.com',            'professional-services', 'healthcare-consulting', 'queued'),

-- ─── Pricing / specialty ──────────────────────────────────────────────────
('simon-kucher',       'Simon-Kucher',       'https://www.simon-kucher.com',       'professional-services', 'pricing-consulting', 'queued'),
('mcdermott',          'McDermott Will & Emery', 'https://www.mwe.com',            'professional-services', 'law-firm', 'queued'),
('ropes-gray',         'Ropes & Gray',       'https://www.ropesgray.com',          'professional-services', 'law-firm', 'queued'),

-- ─── Notable boutique tech/startup CFO services ───────────────────────────
('argentlabs',         'Argent Labs',        'https://www.argentlabs.com',         'professional-services', 'finance-consulting', 'queued'),
('initialized-cfo',    'Initialized Capital','https://initialized.com',            'professional-services', 'finance-consulting', 'queued'),
('paro',               'Paro',               'https://paro.ai',                    'professional-services', 'finance-consulting', 'queued'),
('back-office',        'Back Office',        'https://www.backofficeaccounting.com', 'professional-services', 'bookkeeping-service', 'queued'),
('xendoo',             'Xendoo',             'https://xendoo.com',                 'professional-services', 'bookkeeping-service', 'queued'),
('1800accountant',     '1-800Accountant',    'https://1800accountant.com',         'professional-services', 'accounting-firm', 'queued')

ON DUPLICATE KEY UPDATE id = id;
