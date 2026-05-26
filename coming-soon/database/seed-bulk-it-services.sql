-- ============================================================================
-- Seed: IT Services & Agencies — ~170 real companies for the scraper queue.
-- ON DUPLICATE KEY UPDATE id=id makes this re-runnable / idempotent.
-- Run in phpMyAdmin → SQL tab.
-- ============================================================================

INSERT INTO scrape_jobs (slug, company_name, website, category_l1, category_slug, status)
VALUES

-- ─── Major IT services / outsourcing ──────────────────────────────────────
('accenture',          'Accenture',          'https://www.accenture.com',          'it-services-and-agencies', 'it-consulting', 'queued'),
('infosys',            'Infosys',            'https://www.infosys.com',            'it-services-and-agencies', 'it-consulting', 'queued'),
('tcs',                'Tata Consultancy Services', 'https://www.tcs.com',         'it-services-and-agencies', 'it-consulting', 'queued'),
('wipro',              'Wipro',              'https://www.wipro.com',              'it-services-and-agencies', 'it-consulting', 'queued'),
('cognizant',          'Cognizant',          'https://www.cognizant.com',          'it-services-and-agencies', 'it-consulting', 'queued'),
('capgemini',          'Capgemini',          'https://www.capgemini.com',          'it-services-and-agencies', 'it-consulting', 'queued'),
('hcltech',            'HCLTech',            'https://www.hcltech.com',            'it-services-and-agencies', 'it-consulting', 'queued'),
('tech-mahindra',      'Tech Mahindra',      'https://www.techmahindra.com',       'it-services-and-agencies', 'it-consulting', 'queued'),
('mindtree',           'Mindtree',           'https://www.ltimindtree.com',        'it-services-and-agencies', 'it-consulting', 'queued'),
('mphasis',            'Mphasis',            'https://www.mphasis.com',            'it-services-and-agencies', 'it-consulting', 'queued'),
('hexaware',           'Hexaware Technologies', 'https://hexaware.com',            'it-services-and-agencies', 'it-consulting', 'queued'),
('persistent-systems', 'Persistent Systems', 'https://www.persistent.com',         'it-services-and-agencies', 'it-consulting', 'queued'),
('coforge',            'Coforge',            'https://www.coforge.com',            'it-services-and-agencies', 'it-consulting', 'queued'),
('zensar',             'Zensar Technologies','https://www.zensar.com',             'it-services-and-agencies', 'it-consulting', 'queued'),
('birlasoft',          'Birlasoft',          'https://www.birlasoft.com',          'it-services-and-agencies', 'it-consulting', 'queued'),

-- ─── Premium / digital transformation consultancies ──────────────────────
('epam',               'EPAM Systems',       'https://www.epam.com',               'it-services-and-agencies', 'digital-transformation', 'queued'),
('globant',            'Globant',            'https://www.globant.com',            'it-services-and-agencies', 'digital-transformation', 'queued'),
('endava',             'Endava',             'https://www.endava.com',             'it-services-and-agencies', 'digital-transformation', 'queued'),
('luxoft',             'Luxoft',             'https://www.luxoft.com',             'it-services-and-agencies', 'digital-transformation', 'queued'),
('globallogic',        'GlobalLogic',        'https://www.globallogic.com',        'it-services-and-agencies', 'digital-transformation', 'queued'),
('thoughtworks',       'ThoughtWorks',       'https://www.thoughtworks.com',       'it-services-and-agencies', 'digital-transformation', 'queued'),
('publicis-sapient',   'Publicis Sapient',   'https://www.publicissapient.com',    'it-services-and-agencies', 'digital-transformation', 'queued'),
('iqvia',              'IQVIA',              'https://www.iqvia.com',              'it-services-and-agencies', 'it-consulting', 'queued'),
('virtusa',            'Virtusa',            'https://www.virtusa.com',            'it-services-and-agencies', 'it-consulting', 'queued'),
('softserve',          'SoftServe',          'https://www.softserveinc.com',       'it-services-and-agencies', 'software-development', 'queued'),
('mobomo',             'Mobomo',             'https://www.mobomo.com',             'it-services-and-agencies', 'software-development', 'queued'),
('itransition',        'Itransition',        'https://www.itransition.com',        'it-services-and-agencies', 'software-development', 'queued'),
('exadel',             'Exadel',             'https://exadel.com',                 'it-services-and-agencies', 'software-development', 'queued'),
('andersen-lab',       'Andersen',           'https://andersenlab.com',            'it-services-and-agencies', 'software-development', 'queued'),
('bairesdev',          'BairesDev',          'https://www.bairesdev.com',          'it-services-and-agencies', 'software-development', 'queued'),

-- ─── Dev talent platforms / staffing ──────────────────────────────────────
('toptal',             'Toptal',             'https://www.toptal.com',             'it-services-and-agencies', 'dev-talent-platform', 'queued'),
('andela',             'Andela',             'https://andela.com',                 'it-services-and-agencies', 'dev-talent-platform', 'queued'),
('turing-com',         'Turing',             'https://www.turing.com',             'it-services-and-agencies', 'dev-talent-platform', 'queued'),
('upwork',             'Upwork',             'https://www.upwork.com',             'it-services-and-agencies', 'freelance-platform', 'queued'),
('fiverr',             'Fiverr',             'https://www.fiverr.com',             'it-services-and-agencies', 'freelance-platform', 'queued'),
('arc-dev',            'Arc',                'https://arc.dev',                    'it-services-and-agencies', 'dev-talent-platform', 'queued'),
('lemon-io',           'Lemon.io',           'https://lemon.io',                   'it-services-and-agencies', 'dev-talent-platform', 'queued'),
('hired',              'Hired',              'https://hired.com',                  'it-services-and-agencies', 'dev-talent-platform', 'queued'),
('triplebyte',         'Triplebyte',         'https://triplebyte.com',             'it-services-and-agencies', 'dev-talent-platform', 'queued'),
('codementor',         'Codementor',         'https://www.codementor.io',          'it-services-and-agencies', 'dev-talent-platform', 'queued'),
('codeable',           'Codeable',           'https://www.codeable.io',            'it-services-and-agencies', 'wordpress-experts', 'queued'),
('crossover',          'Crossover',          'https://www.crossover.com',          'it-services-and-agencies', 'dev-talent-platform', 'queued'),

-- ─── Custom software dev shops ────────────────────────────────────────────
('intellectsoft',      'Intellectsoft',      'https://www.intellectsoft.net',      'it-services-and-agencies', 'software-development', 'queued'),
('innovecs',           'Innovecs',           'https://innovecs.com',               'it-services-and-agencies', 'software-development', 'queued'),
('eleks',              'ELEKS',              'https://eleks.com',                  'it-services-and-agencies', 'software-development', 'queued'),
('ciklum',             'Ciklum',             'https://www.ciklum.com',             'it-services-and-agencies', 'software-development', 'queued'),
('clevertech',         'Clevertech',         'https://www.clevertech.biz',         'it-services-and-agencies', 'software-development', 'queued'),
('saritasa',           'Saritasa',           'https://saritasa.com',               'it-services-and-agencies', 'software-development', 'queued'),
('ssa-group',          'SSA Group',          'https://www.ssa.group',              'it-services-and-agencies', 'software-development', 'queued'),
('intersog',           'Intersog',           'https://intersog.com',               'it-services-and-agencies', 'software-development', 'queued'),
('cleveroad',          'Cleveroad',          'https://www.cleveroad.com',          'it-services-and-agencies', 'software-development', 'queued'),
('uptech',             'Uptech',             'https://www.uptech.team',            'it-services-and-agencies', 'software-development', 'queued'),
('netguru',            'Netguru',            'https://www.netguru.com',            'it-services-and-agencies', 'software-development', 'queued'),
('stxnext',            'STX Next',           'https://www.stxnext.com',            'it-services-and-agencies', 'software-development', 'queued'),
('sumatosoft',         'SumatoSoft',         'https://sumatosoft.com',             'it-services-and-agencies', 'software-development', 'queued'),
('miquido',            'Miquido',            'https://www.miquido.com',            'it-services-and-agencies', 'mobile-app-development', 'queued'),
('netsolutions',       'Net Solutions',      'https://www.netsolutions.com',       'it-services-and-agencies', 'software-development', 'queued'),
('iflexion',           'Iflexion',           'https://www.iflexion.com',           'it-services-and-agencies', 'software-development', 'queued'),
('algoworks',          'Algoworks',          'https://www.algoworks.com',          'it-services-and-agencies', 'software-development', 'queued'),
('konstant-info',      'Konstant Infosolutions', 'https://www.konstantinfo.com',   'it-services-and-agencies', 'mobile-app-development', 'queued'),
('hyperlink-infosystem','Hyperlink InfoSystem', 'https://www.hyperlinkinfosystem.com', 'it-services-and-agencies', 'mobile-app-development', 'queued'),
('valuecoders',        'ValueCoders',        'https://www.valuecoders.com',        'it-services-and-agencies', 'software-development', 'queued'),

-- ─── Mobile app development specialists ───────────────────────────────────
('appinventiv',        'Appinventiv',        'https://appinventiv.com',            'it-services-and-agencies', 'mobile-app-development', 'queued'),
('willowtree-apps',    'WillowTree',         'https://willowtreeapps.com',         'it-services-and-agencies', 'mobile-app-development', 'queued'),
('mlsdev',             'MLSDev',             'https://mlsdev.com',                 'it-services-and-agencies', 'mobile-app-development', 'queued'),
('intellectsoft-mobile','Intellectsoft',     'https://www.intellectsoft.net',      'it-services-and-agencies', 'mobile-app-development', 'queued'),
('purrweb',            'Purrweb',            'https://www.purrweb.com',            'it-services-and-agencies', 'mobile-app-development', 'queued'),
('rootstrap',          'Rootstrap',          'https://www.rootstrap.com',          'it-services-and-agencies', 'mobile-app-development', 'queued'),
('zco-corp',           'Zco Corporation',    'https://www.zco.com',                'it-services-and-agencies', 'mobile-app-development', 'queued'),
('mercury-development','Mercury Development','https://www.mercurydevelopment.com', 'it-services-and-agencies', 'mobile-app-development', 'queued'),
('konstant',           'Konstant',           'https://www.konstantinfo.com',       'it-services-and-agencies', 'mobile-app-development', 'queued'),
('blue-label-labs',    'Blue Label Labs',    'https://www.bluelabellabs.com',      'it-services-and-agencies', 'mobile-app-development', 'queued'),

-- ─── Cloud / DevOps consultancies ─────────────────────────────────────────
('xebia',              'Xebia',              'https://xebia.com',                  'it-services-and-agencies', 'cloud-consulting', 'queued'),
('rackspace',          'Rackspace',          'https://www.rackspace.com',          'it-services-and-agencies', 'cloud-services', 'queued'),
('trianz',             'Trianz',             'https://www.trianz.com',             'it-services-and-agencies', 'cloud-consulting', 'queued'),
('nuvalence',          'Nuvalence',          'https://nuvalence.io',               'it-services-and-agencies', 'cloud-consulting', 'queued'),
('caylent',            'Caylent',            'https://caylent.com',                'it-services-and-agencies', 'cloud-consulting', 'queued'),
('mission-cloud',      'Mission Cloud',      'https://www.missioncloud.com',       'it-services-and-agencies', 'cloud-consulting', 'queued'),
('logicalis',          'Logicalis',          'https://www.logicalis.com',          'it-services-and-agencies', 'it-consulting', 'queued'),

-- ─── Digital marketing agencies ───────────────────────────────────────────
('webfx',              'WebFX',              'https://www.webfx.com',              'it-services-and-agencies', 'digital-marketing-agency', 'queued'),
('nogood',             'NoGood',             'https://nogood.io',                  'it-services-and-agencies', 'growth-marketing-agency', 'queued'),
('single-grain',       'Single Grain',       'https://www.singlegrain.com',        'it-services-and-agencies', 'digital-marketing-agency', 'queued'),
('ignite-visibility',  'Ignite Visibility',  'https://ignitevisibility.com',       'it-services-and-agencies', 'digital-marketing-agency', 'queued'),
('disruptive-advertising','Disruptive Advertising','https://disruptiveadvertising.com', 'it-services-and-agencies', 'digital-marketing-agency', 'queued'),
('thrive-agency',      'Thrive Internet Marketing', 'https://thriveagency.com',    'it-services-and-agencies', 'digital-marketing-agency', 'queued'),
('directive-consulting','Directive',         'https://directiveconsulting.com',    'it-services-and-agencies', 'digital-marketing-agency', 'queued'),
('victorious-seo',     'Victorious',         'https://victorious.com',             'it-services-and-agencies', 'seo-agency', 'queued'),
('searchpilot',        'SearchPilot',        'https://www.searchpilot.com',        'it-services-and-agencies', 'seo-agency', 'queued'),
('siege-media',        'Siege Media',        'https://www.siegemedia.com',         'it-services-and-agencies', 'content-marketing-agency', 'queued'),
('omniscient-digital', 'Omniscient Digital', 'https://beomniscient.com',           'it-services-and-agencies', 'content-marketing-agency', 'queued'),
('grow-and-convert',   'Grow and Convert',   'https://growandconvert.com',         'it-services-and-agencies', 'content-marketing-agency', 'queued'),
('animalz',            'Animalz',            'https://www.animalz.co',             'it-services-and-agencies', 'content-marketing-agency', 'queued'),
('foundation-marketing','Foundation Marketing','https://foundationinc.co',         'it-services-and-agencies', 'content-marketing-agency', 'queued'),
('demandcurve',        'Demand Curve',       'https://www.demandcurve.com',        'it-services-and-agencies', 'growth-marketing-agency', 'queued'),
('king-kong',          'King Kong',          'https://kingkong.co',                'it-services-and-agencies', 'digital-marketing-agency', 'queued'),
('major-tom',          'Major Tom',          'https://www.majortom.com',           'it-services-and-agencies', 'digital-marketing-agency', 'queued'),
('rise-interactive',   'Rise Interactive',   'https://www.riseinteractive.com',    'it-services-and-agencies', 'digital-marketing-agency', 'queued'),

-- ─── Design / branding agencies ───────────────────────────────────────────
('ideo',               'IDEO',               'https://www.ideo.com',               'it-services-and-agencies', 'design-agency', 'queued'),
('frog-design',        'Frog',               'https://www.frog.co',                'it-services-and-agencies', 'design-agency', 'queued'),
('huge-inc',           'Huge',               'https://www.hugeinc.com',            'it-services-and-agencies', 'design-agency', 'queued'),
('pentagram',          'Pentagram',          'https://www.pentagram.com',          'it-services-and-agencies', 'design-agency', 'queued'),
('landor',             'Landor',             'https://landor.com',                 'it-services-and-agencies', 'branding-agency', 'queued'),
('wolff-olins',        'Wolff Olins',        'https://www.wolffolins.com',         'it-services-and-agencies', 'branding-agency', 'queued'),
('ramotion',           'Ramotion',           'https://www.ramotion.com',           'it-services-and-agencies', 'design-agency', 'queued'),
('clay-global',        'Clay',               'https://clay.global',                'it-services-and-agencies', 'design-agency', 'queued'),
('koto-studio',        'Koto',               'https://koto.studio',                'it-services-and-agencies', 'branding-agency', 'queued'),
('manual-creative',    'Manual',             'https://manualcreative.com',         'it-services-and-agencies', 'branding-agency', 'queued'),
('focus-lab',          'Focus Lab',          'https://focuslabllc.com',            'it-services-and-agencies', 'branding-agency', 'queued'),
('ueno',               'Ueno',               'https://ueno.co',                    'it-services-and-agencies', 'design-agency', 'queued'),
('instrument',         'Instrument',         'https://instrument.com',             'it-services-and-agencies', 'design-agency', 'queued'),
('work-and-co',        'Work & Co',          'https://work.co',                    'it-services-and-agencies', 'design-agency', 'queued'),
('fantasy',            'Fantasy',            'https://fantasy.co',                 'it-services-and-agencies', 'design-agency', 'queued'),
('design-studio',      'DesignStudio',       'https://design.studio',              'it-services-and-agencies', 'branding-agency', 'queued'),

-- ─── Cybersecurity / managed services ────────────────────────────────────
('crowdstrike',        'CrowdStrike',        'https://www.crowdstrike.com',        'it-services-and-agencies', 'cybersecurity', 'queued'),
('palo-alto-networks', 'Palo Alto Networks', 'https://www.paloaltonetworks.com',   'it-services-and-agencies', 'cybersecurity', 'queued'),
('cloudflare',         'Cloudflare',         'https://www.cloudflare.com',         'it-services-and-agencies', 'cybersecurity', 'queued'),
('arctic-wolf',        'Arctic Wolf',        'https://arcticwolf.com',             'it-services-and-agencies', 'managed-security', 'queued'),
('rapid7',             'Rapid7',             'https://www.rapid7.com',             'it-services-and-agencies', 'cybersecurity', 'queued'),
('proofpoint',         'Proofpoint',         'https://www.proofpoint.com',         'it-services-and-agencies', 'cybersecurity', 'queued'),
('huntress',           'Huntress',           'https://www.huntress.com',           'it-services-and-agencies', 'managed-security', 'queued'),
('sentinelone',        'SentinelOne',        'https://www.sentinelone.com',        'it-services-and-agencies', 'cybersecurity', 'queued'),
('darktrace',          'Darktrace',          'https://darktrace.com',              'it-services-and-agencies', 'cybersecurity', 'queued'),

-- ─── Data engineering / BI consultancies ──────────────────────────────────
('slalom',             'Slalom',             'https://www.slalom.com',             'it-services-and-agencies', 'data-consulting', 'queued'),
('aimpoint-digital',   'Aimpoint Digital',   'https://www.aimpointdigital.com',    'it-services-and-agencies', 'data-consulting', 'queued'),
('phdata',             'phData',             'https://www.phdata.io',              'it-services-and-agencies', 'data-consulting', 'queued'),
('clearpeaks',         'ClearPeaks',         'https://www.clearpeaks.com',         'it-services-and-agencies', 'data-consulting', 'queued'),
('hashedin',           'HashedIn',           'https://hashedin.com',               'it-services-and-agencies', 'software-development', 'queued'),
('avocet-software',    'Avocet',             'https://www.avocetsoftware.com',     'it-services-and-agencies', 'software-development', 'queued'),

-- ─── Web dev / WordPress agencies ─────────────────────────────────────────
('automattic',         'Automattic',         'https://automattic.com',             'it-services-and-agencies', 'wordpress-services', 'queued'),
('wp-engine',          'WP Engine',          'https://wpengine.com',               'it-services-and-agencies', 'wordpress-hosting', 'queued'),
('kinsta',             'Kinsta',             'https://kinsta.com',                 'it-services-and-agencies', 'wordpress-hosting', 'queued'),
('flywheel',           'Flywheel',           'https://getflywheel.com',            'it-services-and-agencies', 'wordpress-hosting', 'queued'),
('10up',               '10up',               'https://10up.com',                   'it-services-and-agencies', 'wordpress-agency', 'queued'),
('human-made',         'Human Made',         'https://humanmade.com',              'it-services-and-agencies', 'wordpress-agency', 'queued'),
('xwp',                'XWP',                'https://xwp.co',                     'it-services-and-agencies', 'wordpress-agency', 'queued'),

-- ─── Shopify / e-commerce agencies ────────────────────────────────────────
('lounge-lizard',      'Lounge Lizard',      'https://www.loungelizard.com',       'it-services-and-agencies', 'ecommerce-agency', 'queued'),
('big-drop',           'Big Drop',           'https://www.bigdropinc.com',         'it-services-and-agencies', 'ecommerce-agency', 'queued'),
('eastside-co',        'Eastside Co',        'https://eastsideco.com',             'it-services-and-agencies', 'shopify-agency', 'queued'),
('underwaterpistol',   'Underwaterpistol',   'https://underwaterpistol.com',       'it-services-and-agencies', 'shopify-agency', 'queued'),
('blend-commerce',     'Blend Commerce',     'https://www.blendcommerce.com',      'it-services-and-agencies', 'shopify-agency', 'queued'),
('absolute-web',       'Absolute Web',       'https://www.absoluteweb.com',        'it-services-and-agencies', 'ecommerce-agency', 'queued'),
('genovesi',           'Genovesi',           'https://www.genovesi.com',           'it-services-and-agencies', 'ecommerce-agency', 'queued'),
('barrel-ny',          'Barrel',             'https://barrelny.com',               'it-services-and-agencies', 'ecommerce-agency', 'queued'),
('hardgoods',          'Hardgoods',          'https://hardgoods.com',              'it-services-and-agencies', 'shopify-agency', 'queued'),

-- ─── Performance marketing / paid ads ─────────────────────────────────────
('common-thread-collective','Common Thread Collective','https://commonthreadco.com', 'it-services-and-agencies', 'paid-ads-agency', 'queued'),
('tinuiti',            'Tinuiti',            'https://tinuiti.com',                'it-services-and-agencies', 'performance-marketing', 'queued'),
('jellyfish',          'Jellyfish',          'https://www.jellyfish.com',          'it-services-and-agencies', 'performance-marketing', 'queued'),
('360i',               '360i',               'https://www.360i.com',               'it-services-and-agencies', 'performance-marketing', 'queued'),
('iprospect',          'iProspect',          'https://www.iprospect.com',          'it-services-and-agencies', 'performance-marketing', 'queued'),
('wpromote',           'Wpromote',           'https://www.wpromote.com',           'it-services-and-agencies', 'digital-marketing-agency', 'queued'),
('power-digital',      'Power Digital',      'https://powerdigitalmarketing.com',  'it-services-and-agencies', 'digital-marketing-agency', 'queued'),
('nogood-ny',          'NoGood',             'https://nogood.io',                  'it-services-and-agencies', 'growth-marketing-agency', 'queued'),

-- ─── PR / influencer agencies ─────────────────────────────────────────────
('edelman',            'Edelman',            'https://www.edelman.com',            'it-services-and-agencies', 'public-relations', 'queued'),
('weber-shandwick',    'Weber Shandwick',    'https://www.webershandwick.com',     'it-services-and-agencies', 'public-relations', 'queued'),
('ogilvy',             'Ogilvy',             'https://www.ogilvy.com',             'it-services-and-agencies', 'advertising-agency', 'queued'),
('publicis',           'Publicis',           'https://www.publicis.com',           'it-services-and-agencies', 'advertising-agency', 'queued'),
('viral-nation',       'Viral Nation',       'https://www.viralnation.com',        'it-services-and-agencies', 'influencer-marketing', 'queued'),
('the-shelf',          'The Shelf',          'https://www.theshelf.com',           'it-services-and-agencies', 'influencer-marketing', 'queued'),

-- ─── Notable niche IT services ────────────────────────────────────────────
('atomic-object',      'Atomic Object',      'https://atomicobject.com',           'it-services-and-agencies', 'software-development', 'queued'),
('truss-works',        'Truss',              'https://truss.works',                'it-services-and-agencies', 'software-development', 'queued'),
('thoughtbot',         'thoughtbot',         'https://thoughtbot.com',             'it-services-and-agencies', 'software-development', 'queued'),
('test-double',        'Test Double',        'https://testdouble.com',             'it-services-and-agencies', 'software-development', 'queued'),
('carbon-five',        'Carbon Five',        'https://www.carbonfive.com',         'it-services-and-agencies', 'software-development', 'queued'),
('8th-light',          '8th Light',          'https://8thlight.com',               'it-services-and-agencies', 'software-development', 'queued'),
('pivotal-labs',       'VMware Tanzu Labs',  'https://tanzu.vmware.com/labs',      'it-services-and-agencies', 'software-development', 'queued'),
('initpix',            'Initpix',            'https://initpix.com',                'it-services-and-agencies', 'software-development', 'queued'),
('chromatic',          'Chromatic',          'https://www.chromatic.com',          'it-services-and-agencies', 'design-systems', 'queued'),
('formidable',         'Formidable',         'https://formidable.com',             'it-services-and-agencies', 'software-development', 'queued'),

-- ─── Top-tier creative shops ──────────────────────────────────────────────
('rga',                'R/GA',               'https://www.rga.com',                'it-services-and-agencies', 'creative-agency', 'queued'),
('akqa',               'AKQA',               'https://www.akqa.com',               'it-services-and-agencies', 'creative-agency', 'queued'),
('mediamonks',         'Media.Monks',        'https://www.media.monks.com',        'it-services-and-agencies', 'creative-agency', 'queued'),
('jam3',               'Jam3',               'https://www.jam3.com',               'it-services-and-agencies', 'creative-agency', 'queued'),
('active-theory',      'Active Theory',      'https://activetheory.net',           'it-services-and-agencies', 'creative-agency', 'queued'),
('mschf',              'MSCHF',              'https://mschf.com',                  'it-services-and-agencies', 'creative-agency', 'queued'),
('locomotive',         'Locomotive',         'https://locomotive.ca',              'it-services-and-agencies', 'creative-agency', 'queued'),

-- ─── Smaller boutique dev shops ───────────────────────────────────────────
('snappy-kraken',      'Snappy Kraken',      'https://snappykraken.com',           'it-services-and-agencies', 'software-development', 'queued'),
('reddo-solutions',    'Reddo Solutions',    'https://www.reddosolutions.com',     'it-services-and-agencies', 'software-development', 'queued'),
('arounda',            'Arounda',            'https://arounda.agency',             'it-services-and-agencies', 'design-agency', 'queued'),
('savas-labs',         'Savas Labs',         'https://savaslabs.com',              'it-services-and-agencies', 'software-development', 'queued'),
('lullabot',           'Lullabot',           'https://www.lullabot.com',           'it-services-and-agencies', 'drupal-agency', 'queued'),
('mediacurrent',       'Mediacurrent',       'https://www.mediacurrent.com',       'it-services-and-agencies', 'drupal-agency', 'queued'),
('axelerant',          'Axelerant',          'https://www.axelerant.com',          'it-services-and-agencies', 'drupal-agency', 'queued')

ON DUPLICATE KEY UPDATE id = id;
