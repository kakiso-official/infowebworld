/* ── Sector-specific demo listings for L1 landing pages ── */

export type SectorDemo = {
  id: number
  name: string
  tagline: string
  icon: string
  color: string
  score: number
  reviews: number
  category: string
  type: string
  badges: string[]
}

type Tuple = [string, string, string, string, number, number, string, string, string]

function build(rows: Tuple[]): SectorDemo[] {
  return rows.map((r, i) => ({
    id: i + 1, name: r[0], tagline: r[1], icon: r[2], color: r[3],
    score: r[4], reviews: r[5], category: r[6], type: r[7],
    badges: r[8].split(',').filter(Boolean),
  }))
}

/* ── Sector metadata ── */
export type SectorMeta = {
  color: string
  pastel: string
  pastelLight: string
  tagline: string
  description: string
  icon: string
  heroImage: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string[]
}

const META: Record<string, SectorMeta> = {
  'ai-ml': {
    color: '#8B5CF6', pastel: '#DDD6FE', pastelLight: '#F3F0FF',
    icon: 'code',
    heroImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=80&auto=format',
    tagline: 'Discover the best AI & Machine Learning tools, platforms and services',
    description: 'Explore cutting-edge artificial intelligence and machine learning solutions — from deep learning frameworks and NLP APIs to computer vision platforms and MLOps tools.',
    seoTitle: 'Best AI & ML Tools, Platforms & Services',
    seoDescription: 'Compare top-rated artificial intelligence and machine learning tools. Deep learning frameworks, NLP APIs, computer vision, MLOps and more. Verified reviews and real results.',
    seoKeywords: ['AI tools', 'machine learning platforms', 'deep learning', 'NLP', 'computer vision', 'MLOps', 'AI software', 'ML frameworks', 'artificial intelligence services'],
  },
  'software-saas': {
    color: '#3B82F6', pastel: '#BFDBFE', pastelLight: '#EFF6FF',
    icon: 'code',
    heroImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=80&auto=format',
    tagline: 'Find the right software and SaaS tools to power your business',
    description: 'Browse top-rated CRM, project management, marketing, analytics and developer tools. Compare features, read reviews and find the perfect software stack.',
    seoTitle: 'Best Software & SaaS Tools for Business',
    seoDescription: 'Find and compare the best SaaS tools, CRM, project management, marketing automation, analytics and developer platforms. Verified reviews from real users.',
    seoKeywords: ['SaaS tools', 'business software', 'CRM', 'project management', 'marketing software', 'analytics tools', 'developer tools', 'cloud software'],
  },
  'it-services-agencies': {
    color: '#14B8A6', pastel: '#99F6E4', pastelLight: '#F0FDFA',
    icon: 'globe',
    heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=80&auto=format',
    tagline: 'Connect with top IT service providers and digital agencies',
    description: 'Find trusted IT consulting firms, managed service providers, cybersecurity agencies and cloud experts. Verified reviews from real clients.',
    seoTitle: 'Best IT Services, Consulting & Digital Agencies',
    seoDescription: 'Find trusted IT consulting firms, managed service providers, cybersecurity agencies and cloud experts. Compare services, read verified reviews from real clients.',
    seoKeywords: ['IT services', 'IT consulting', 'managed services', 'cybersecurity agencies', 'cloud consulting', 'digital agencies', 'IT outsourcing', 'tech support'],
  },
  'startups-innovation': {
    color: '#E8553D', pastel: '#FECACA', pastelLight: '#FFF5F5',
    icon: 'rocket',
    heroImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1600&q=80&auto=format',
    tagline: 'Discover emerging startups and innovation platforms',
    description: 'Explore the most promising startups, accelerators, innovation labs and venture tools. From MVP builders to growth platforms — find what fuels your next breakthrough.',
    seoTitle: 'Best Startups, Accelerators & Innovation Platforms',
    seoDescription: 'Discover emerging startups, accelerators, innovation labs and venture tools. MVP builders, growth platforms, funding tools and startup communities. Verified listings.',
    seoKeywords: ['startups', 'accelerators', 'innovation platforms', 'startup tools', 'venture capital', 'MVP builders', 'growth hacking', 'startup community'],
  },
  'local-business': {
    color: '#F59E0B', pastel: '#FDE68A', pastelLight: '#FFFBEB',
    icon: 'home',
    heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80&auto=format',
    tagline: 'Support and discover local businesses near you',
    description: 'Find the best local services, shops, restaurants and professionals in your area. Real reviews from your community to help you choose with confidence.',
    seoTitle: 'Best Local Businesses, Services & Shops Near You',
    seoDescription: 'Discover top-rated local businesses, services, restaurants and shops in your area. Community reviews, verified listings and local business directory.',
    seoKeywords: ['local business', 'local services', 'shops near me', 'local directory', 'business listing', 'local restaurants', 'service providers', 'community business'],
  },
  'professional-services': {
    color: '#2FAE6A', pastel: '#BBF7D0', pastelLight: '#F0FDF4',
    icon: 'building',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80&auto=format',
    tagline: 'Find trusted professional service providers for your business',
    description: 'Connect with top-rated legal firms, accounting practices, consultants and HR specialists. Verified credentials and honest reviews to guide your decision.',
    seoTitle: 'Best Professional Services — Legal, Accounting, HR & Consulting',
    seoDescription: 'Find top-rated legal firms, accounting practices, HR consultants and business advisors. Verified credentials, honest reviews and trusted professional service providers.',
    seoKeywords: ['professional services', 'legal services', 'accounting firms', 'HR consulting', 'business consulting', 'tax services', 'audit firms', 'recruitment agencies'],
  },
}

export function getSectorMeta(slug: string): SectorMeta {
  return META[slug] || META['ai-ml']
}

/* ── Demo data per sector ── */

const AI_ML: Tuple[] = [
  ['DeepMind Studio', 'Enterprise AI research and model development platform', 'code', '#8B5CF6', 4.9, 487, 'AI Research', 'Research Platform', 'featured,enterprise,verified'],
  ['NeuralFlow AI', 'End-to-end deep learning framework with GPU optimization', 'layers', '#3B82F6', 4.8, 356, 'Deep Learning', 'Framework', 'new,verified'],
  ['SynthAI Pro', 'Generative AI for content creation and creative workflows', 'zap', '#EC4899', 4.7, 289, 'Generative AI', 'SaaS Platform', 'trending,verified'],
  ['CogniVerse', 'Conversational AI with multi-modal understanding', 'messageCircle', '#14B8A6', 4.6, 234, 'Conversational AI', 'SaaS Platform', 'new,startup,verified'],
  ['TensorForge', 'ML model training infrastructure at any scale', 'barChart', '#F59E0B', 4.8, 412, 'MLOps', 'Developer Tool', 'featured,enterprise,verified'],
  ['DataMind AI', 'AI-powered business intelligence and data storytelling', 'pieChart', '#2FAE6A', 4.5, 178, 'Data Analytics', 'Enterprise Solution', 'trending,enterprise,verified'],
  ['VisionAI Pro', 'Computer vision APIs for detection, recognition and analysis', 'eye', '#6366F1', 4.7, 298, 'Computer Vision', 'API Service', 'new,verified'],
  ['NLPCloud', 'Production-ready NLP models via simple REST APIs', 'globe', '#0EA5E9', 4.4, 156, 'NLP', 'API Service', 'startup,verified'],
  ['AutoML Hub', 'No-code automated machine learning for data teams', 'rocket', '#E8553D', 4.6, 201, 'AutoML', 'SaaS Platform', 'new,startup,verified'],
  ['AI Guard Pro', 'AI safety monitoring, bias detection and compliance', 'shield', '#2FAE6A', 4.8, 367, 'AI Ethics', 'Enterprise Solution', 'featured,enterprise,verified'],
  ['GenStudio AI', 'Text-to-image and text-to-video generation suite', 'monitor', '#EC4899', 4.5, 245, 'Generative AI', 'SaaS Platform', 'trending,verified'],
  ['PredictIQ', 'Predictive analytics with explainable AI insights', 'trendingUp', '#F59E0B', 4.7, 312, 'Predictive Analytics', 'SaaS Platform', 'featured,verified'],
  ['RoboFlow Labs', 'Industrial robotics and automation intelligence', 'building', '#3B82F6', 4.3, 145, 'Robotics', 'Enterprise Solution', 'enterprise,verified'],
  ['SpeechLab AI', 'Voice recognition, synthesis and real-time transcription', 'star', '#8B5CF6', 4.6, 189, 'Voice AI', 'API Service', 'new,verified'],
  ['GraphNeural', 'Graph neural network platform for knowledge discovery', 'grid', '#14B8A6', 4.4, 134, 'Graph Analytics', 'Developer Tool', 'startup,verified'],
  ['MLOps360', 'End-to-end ML lifecycle management and monitoring', 'cloud', '#0EA5E9', 4.8, 398, 'MLOps', 'Enterprise Solution', 'trending,enterprise,verified'],
  ['FedLearn Pro', 'Privacy-preserving federated learning infrastructure', 'shield', '#6366F1', 4.5, 167, 'Privacy AI', 'Research Platform', 'new,verified'],
  ['AIBenchmark', 'Model evaluation, testing and performance benchmarking', 'barChart', '#E8553D', 4.7, 278, 'AI Testing', 'Developer Tool', 'featured,trending,verified'],
]

const SOFTWARE_SAAS: Tuple[] = [
  ['FlowStack CRM', 'Modern CRM with AI lead scoring and pipeline automation', 'trendingUp', '#EC4899', 4.8, 456, 'CRM', 'SaaS Platform', 'featured,enterprise,verified'],
  ['TaskFlow Pro', 'Project management with Gantt charts and resource planning', 'grid', '#3B82F6', 4.7, 389, 'Project Management', 'SaaS Platform', 'new,verified'],
  ['PixelBoard', 'Collaborative design platform for product teams', 'monitor', '#F59E0B', 4.9, 521, 'Design Tools', 'SaaS Platform', 'featured,verified'],
  ['DataPipe', 'ETL and data pipeline orchestration for analytics teams', 'layers', '#14B8A6', 4.6, 234, 'Data Engineering', 'Developer Tool', 'new,startup,verified'],
  ['FormCraft', 'Drag-and-drop form builder with conditional logic', 'code', '#8B5CF6', 4.5, 178, 'Form Builder', 'SaaS Platform', 'trending,startup,verified'],
  ['SecureVault', 'Enterprise password management and secrets rotation', 'shield', '#2FAE6A', 4.8, 412, 'Security', 'Enterprise Solution', 'featured,enterprise,verified'],
  ['CloudSync Pro', 'Real-time file sync and team collaboration storage', 'cloud', '#3B82F6', 4.6, 287, 'Cloud Storage', 'SaaS Platform', 'new,verified'],
  ['APIConnect', 'API management, documentation and developer portal', 'globe', '#0EA5E9', 4.4, 156, 'API Management', 'Developer Tool', 'startup,verified'],
  ['LogicGate', 'Visual workflow automation for business processes', 'zap', '#E8553D', 4.7, 345, 'Automation', 'SaaS Platform', 'trending,enterprise,verified'],
  ['DocuFlow', 'Document management with AI-powered search and OCR', 'eye', '#6366F1', 4.5, 198, 'Document Management', 'Enterprise Solution', 'enterprise,verified'],
  ['ChatBase Pro', 'AI customer support with live chat and knowledge base', 'messageCircle', '#14B8A6', 4.6, 267, 'Customer Support', 'SaaS Platform', 'new,verified'],
  ['PaymentHub', 'Unified payment processing with multi-currency support', 'barChart', '#F59E0B', 4.8, 478, 'Payments', 'SaaS Platform', 'featured,verified'],
  ['MailForge', 'Email marketing automation with AI subject lines', 'star', '#EC4899', 4.3, 145, 'Email Marketing', 'SaaS Platform', 'startup,verified'],
  ['TestPilot', 'Automated QA testing with visual regression detection', 'shield', '#2FAE6A', 4.7, 312, 'Testing', 'Developer Tool', 'trending,verified'],
  ['MetricsHQ', 'Product analytics with session replay and heatmaps', 'pieChart', '#8B5CF6', 4.5, 189, 'Analytics', 'SaaS Platform', 'new,verified'],
  ['CloudDeploy', 'CI/CD pipeline management with one-click deployments', 'rocket', '#0EA5E9', 4.8, 398, 'DevOps', 'Developer Tool', 'featured,trending,verified'],
  ['StreamLine', 'Video streaming infrastructure for live and on-demand', 'monitor', '#3B82F6', 4.4, 167, 'Video', 'API Service', 'new,verified'],
  ['InventoryIQ', 'Smart inventory management with demand forecasting', 'building', '#F59E0B', 4.6, 234, 'Inventory', 'SaaS Platform', 'enterprise,trending,verified'],
]

const IT_SERVICES: Tuple[] = [
  ['TechBridge Solutions', 'Strategic IT consulting for digital transformation', 'globe', '#14B8A6', 4.8, 378, 'IT Consulting', 'Consulting Firm', 'featured,enterprise,verified'],
  ['CyberShield', 'Managed cybersecurity services and SOC operations', 'shield', '#E8553D', 4.9, 445, 'Cybersecurity', 'Managed Service', 'featured,enterprise,verified'],
  ['CloudOps Pro', 'Cloud infrastructure management and optimization', 'cloud', '#3B82F6', 4.7, 312, 'Cloud Services', 'Managed Service', 'new,verified'],
  ['InfraScale', 'Data center and infrastructure scaling solutions', 'building', '#8B5CF6', 4.5, 189, 'Infrastructure', 'Enterprise Solution', 'enterprise,verified'],
  ['DevTeam Plus', 'Dedicated development team staffing and augmentation', 'users', '#2FAE6A', 4.6, 256, 'Staff Augmentation', 'Agency', 'new,startup,verified'],
  ['QA Masters', 'End-to-end quality assurance and testing services', 'eye', '#F59E0B', 4.4, 167, 'QA Testing', 'Agency', 'trending,verified'],
  ['NetGuard Pro', 'Enterprise network security and monitoring', 'shield', '#6366F1', 4.7, 298, 'Network Security', 'Managed Service', 'enterprise,verified'],
  ['DigitalForge', 'Full-service digital transformation agency', 'zap', '#EC4899', 4.8, 389, 'Digital Agency', 'Agency', 'featured,verified'],
  ['ManagedCloud', 'Fully managed hosting with 99.99% uptime SLA', 'cloud', '#0EA5E9', 4.6, 234, 'Managed Hosting', 'Managed Service', 'trending,enterprise,verified'],
  ['CompliancePro', 'IT compliance and regulatory consulting services', 'code', '#14B8A6', 4.5, 178, 'Compliance', 'Consulting Firm', 'enterprise,verified'],
  ['MigrationPro', 'Seamless cloud migration with zero-downtime guarantee', 'rocket', '#3B82F6', 4.7, 345, 'Cloud Migration', 'Consulting Firm', 'new,verified'],
  ['PenTest Labs', 'Penetration testing and vulnerability assessment', 'shield', '#E8553D', 4.8, 312, 'Security Testing', 'Agency', 'featured,trending,verified'],
  ['DataCenter Pro', 'Colocation and hybrid data center services', 'building', '#8B5CF6', 4.3, 145, 'Data Center', 'Enterprise Solution', 'enterprise,verified'],
  ['VirtualDesk', 'Virtual desktop infrastructure and remote workspace', 'monitor', '#2FAE6A', 4.5, 198, 'VDI', 'Managed Service', 'startup,verified'],
  ['ITSupportHub', 'White-label IT help desk and support services', 'messageCircle', '#F59E0B', 4.6, 267, 'IT Support', 'Managed Service', 'new,verified'],
  ['AppDev Studio', 'Custom application development and modernization', 'code', '#0EA5E9', 4.7, 356, 'App Development', 'Agency', 'new,startup,verified'],
  ['BackupVault', 'Disaster recovery and business continuity solutions', 'shield', '#6366F1', 4.4, 156, 'Disaster Recovery', 'Managed Service', 'trending,verified'],
  ['TelecomPro', 'Enterprise telecom and unified communications', 'globe', '#14B8A6', 4.6, 223, 'Telecom', 'Enterprise Solution', 'trending,enterprise,verified'],
]

const STARTUPS: Tuple[] = [
  ['LaunchPad Pro', 'All-in-one startup launcher with mentorship network', 'rocket', '#E8553D', 4.8, 378, 'Accelerators', 'Platform', 'featured,startup,verified'],
  ['InnoVenture', 'Innovation management and idea-to-product pipeline', 'zap', '#8B5CF6', 4.7, 289, 'Innovation', 'SaaS Platform', 'new,verified'],
  ['DisruptTech', 'Emerging technology radar and disruption analysis', 'trendingUp', '#3B82F6', 4.6, 234, 'Tech Analysis', 'SaaS Platform', 'trending,verified'],
  ['FounderHub', 'Community platform for founders with peer matching', 'users', '#2FAE6A', 4.9, 456, 'Community', 'Platform', 'featured,startup,verified'],
  ['ScaleUp AI', 'AI-driven growth hacking and market expansion tools', 'barChart', '#F59E0B', 4.5, 178, 'Growth Tools', 'SaaS Platform', 'new,startup,verified'],
  ['PitchDeck Pro', 'Investor-ready pitch deck templates and analytics', 'monitor', '#EC4899', 4.7, 345, 'Pitch Tools', 'SaaS Platform', 'trending,startup,verified'],
  ['GrowthEngine', 'Acquisition funnels, A/B testing and retention tools', 'trendingUp', '#14B8A6', 4.8, 398, 'Growth', 'SaaS Platform', 'featured,verified'],
  ['MVPStudio', 'Rapid MVP development with no-code prototyping', 'code', '#0EA5E9', 4.4, 156, 'MVP Builder', 'Agency', 'new,startup,verified'],
  ['StartupMetrics', 'KPI dashboard with investor reporting templates', 'pieChart', '#8B5CF6', 4.6, 267, 'Analytics', 'SaaS Platform', 'startup,verified'],
  ['VCConnect', 'Venture capital marketplace connecting startups and VCs', 'globe', '#E8553D', 4.7, 312, 'Funding', 'Marketplace', 'featured,verified'],
  ['AccelerateNow', 'Virtual accelerator program with expert mentorship', 'rocket', '#3B82F6', 4.5, 198, 'Accelerators', 'Platform', 'trending,startup,verified'],
  ['InnoLab', 'Corporate innovation lab setup and management', 'building', '#2FAE6A', 4.3, 134, 'Innovation', 'Consulting Firm', 'enterprise,verified'],
  ['ProductHunt Pro', 'Product launch strategy and community amplification', 'star', '#F59E0B', 4.8, 445, 'Launch Tools', 'SaaS Platform', 'new,trending,verified'],
  ['HackathonHub', 'Hackathon hosting, judging and talent discovery', 'zap', '#EC4899', 4.6, 189, 'Events', 'Platform', 'startup,verified'],
  ['BetaTester', 'Beta testing orchestration with user feedback loops', 'eye', '#6366F1', 4.5, 178, 'Testing', 'SaaS Platform', 'new,startup,verified'],
  ['CrowdFundIt', 'Equity crowdfunding with compliance automation', 'users', '#14B8A6', 4.4, 167, 'Funding', 'Platform', 'trending,verified'],
  ['CoFounder.io', 'Co-founder matching with skills and values alignment', 'users', '#0EA5E9', 4.7, 289, 'Community', 'Marketplace', 'new,startup,verified'],
  ['StartupLegal', 'Legal templates and compliance for early-stage startups', 'shield', '#8B5CF6', 4.6, 234, 'Legal', 'SaaS Platform', 'featured,startup,verified'],
]

const LOCAL_BIZ: Tuple[] = [
  ['LocalBiz Pro', 'All-in-one platform for local business management', 'home', '#F59E0B', 4.8, 467, 'Business Tools', 'SaaS Platform', 'featured,verified'],
  ['CityConnect', 'City-wide business directory with verified listings', 'globe', '#3B82F6', 4.7, 356, 'Directory', 'Platform', 'new,verified'],
  ['NeighborHub', 'Neighborhood community app with local marketplace', 'users', '#2FAE6A', 4.6, 234, 'Community', 'Platform', 'trending,startup,verified'],
  ['MainStreet App', 'Local commerce platform connecting shops and shoppers', 'building', '#E8553D', 4.5, 189, 'Commerce', 'Marketplace', 'new,verified'],
  ['BookingPro', 'Appointment scheduling and online booking for services', 'barChart', '#8B5CF6', 4.8, 412, 'Scheduling', 'SaaS Platform', 'featured,verified'],
  ['ReviewHub', 'Review management and reputation monitoring for locals', 'star', '#14B8A6', 4.4, 167, 'Reviews', 'SaaS Platform', 'startup,verified'],
  ['ShopLocal Now', 'Shop local marketplace with same-day delivery', 'home', '#F59E0B', 4.7, 298, 'Shopping', 'Marketplace', 'trending,verified'],
  ['DirectoryPlus', 'Premium local business directory with SEO features', 'grid', '#0EA5E9', 4.6, 256, 'Directory', 'SaaS Platform', 'new,verified'],
  ['LocalAds Pro', 'Hyper-local advertising with geo-targeting', 'eye', '#EC4899', 4.5, 178, 'Advertising', 'SaaS Platform', 'enterprise,verified'],
  ['CommunityHub', 'Local community engagement and events platform', 'users', '#6366F1', 4.3, 145, 'Community', 'Platform', 'startup,verified'],
  ['DeliveryLocal', 'Local delivery logistics and order management', 'rocket', '#2FAE6A', 4.7, 334, 'Delivery', 'SaaS Platform', 'featured,trending,verified'],
  ['EventsNearby', 'Local event discovery, ticketing and promotion', 'star', '#3B82F6', 4.6, 223, 'Events', 'Platform', 'new,verified'],
  ['LocalSEO Pro', 'Local search optimization and Google Business management', 'search', '#E8553D', 4.8, 389, 'SEO', 'SaaS Platform', 'featured,enterprise,verified'],
  ['StoreFront', 'Digital storefront builder for local retail shops', 'monitor', '#8B5CF6', 4.5, 198, 'E-Commerce', 'SaaS Platform', 'trending,verified'],
  ['ServicePro', 'Service marketplace connecting pros with local customers', 'shield', '#F59E0B', 4.4, 156, 'Services', 'Marketplace', 'new,startup,verified'],
  ['LocalPay', 'Local payment processing with loyalty rewards', 'barChart', '#14B8A6', 4.7, 278, 'Payments', 'SaaS Platform', 'enterprise,verified'],
  ['MemberHub', 'Membership and loyalty program management for locals', 'users', '#0EA5E9', 4.6, 234, 'Loyalty', 'SaaS Platform', 'new,verified'],
  ['LocalInsights', 'Foot traffic analytics and local market intelligence', 'pieChart', '#EC4899', 4.5, 178, 'Analytics', 'SaaS Platform', 'trending,startup,verified'],
]

const PROFESSIONAL: Tuple[] = [
  ['LegalEase', 'AI-powered legal document automation and review', 'shield', '#2FAE6A', 4.8, 389, 'Legal Tech', 'SaaS Platform', 'featured,enterprise,verified'],
  ['AccountPro', 'Cloud accounting with automated reconciliation', 'barChart', '#3B82F6', 4.7, 345, 'Accounting', 'SaaS Platform', 'new,verified'],
  ['ConsultHub', 'Consulting marketplace with vetted experts', 'users', '#8B5CF6', 4.6, 267, 'Consulting', 'Marketplace', 'trending,verified'],
  ['HRConnect', 'HR management with recruiting and onboarding', 'users', '#14B8A6', 4.9, 478, 'HR Tech', 'SaaS Platform', 'featured,enterprise,verified'],
  ['FinanceFlow', 'Financial planning and analysis for enterprises', 'trendingUp', '#F59E0B', 4.5, 189, 'Finance', 'Enterprise Solution', 'new,enterprise,verified'],
  ['AuditMaster', 'Audit management with risk scoring and workflow', 'eye', '#E8553D', 4.4, 156, 'Audit', 'SaaS Platform', 'startup,verified'],
  ['TaxPro Suite', 'Tax preparation and compliance automation', 'code', '#6366F1', 4.7, 312, 'Tax', 'SaaS Platform', 'trending,enterprise,verified'],
  ['ComplianceHub', 'Regulatory compliance tracking across industries', 'shield', '#2FAE6A', 4.8, 398, 'Compliance', 'Enterprise Solution', 'featured,enterprise,verified'],
  ['AdvisoryPro', 'Business advisory matching with industry specialists', 'globe', '#0EA5E9', 4.5, 198, 'Advisory', 'Marketplace', 'new,verified'],
  ['BizStrategy', 'Strategic planning tools with market analysis', 'pieChart', '#EC4899', 4.6, 234, 'Strategy', 'SaaS Platform', 'startup,verified'],
  ['RiskGuard', 'Enterprise risk management and mitigation platform', 'shield', '#3B82F6', 4.7, 289, 'Risk Management', 'Enterprise Solution', 'featured,trending,verified'],
  ['WealthPlan', 'Wealth management and portfolio advisory tools', 'trendingUp', '#F59E0B', 4.3, 134, 'Wealth', 'SaaS Platform', 'enterprise,verified'],
  ['RecruitPro', 'AI-driven recruitment with skills-based matching', 'users', '#8B5CF6', 4.8, 412, 'Recruiting', 'SaaS Platform', 'new,trending,verified'],
  ['PayrollHub', 'Multi-country payroll processing and tax filing', 'barChart', '#14B8A6', 4.6, 256, 'Payroll', 'SaaS Platform', 'enterprise,verified'],
  ['ContractPro', 'Contract lifecycle management with e-signatures', 'code', '#E8553D', 4.5, 178, 'Contracts', 'SaaS Platform', 'new,startup,verified'],
  ['ForensicAcct', 'Forensic accounting and fraud detection services', 'eye', '#6366F1', 4.7, 312, 'Forensics', 'Consulting Firm', 'featured,verified'],
  ['ValuationPro', 'Business valuation and financial modeling', 'barChart', '#2FAE6A', 4.4, 167, 'Valuation', 'SaaS Platform', 'startup,verified'],
  ['InsurTech AI', 'Insurance technology with AI underwriting', 'shield', '#0EA5E9', 4.8, 356, 'Insurance', 'SaaS Platform', 'new,trending,enterprise,verified'],
]

/* ── Lookup ── */
const DATA: Record<string, Tuple[]> = {
  'ai-ml': AI_ML,
  'software-saas': SOFTWARE_SAAS,
  'it-services-agencies': IT_SERVICES,
  'startups-innovation': STARTUPS,
  'local-business': LOCAL_BIZ,
  'professional-services': PROFESSIONAL,
}

export function getSectorDemos(slug: string): SectorDemo[] {
  return build(DATA[slug] || AI_ML)
}

/* ── Section filters ── */
export function pickJustLanded(d: SectorDemo[]): SectorDemo[] {
  return d.filter(x => x.badges.includes('new')).slice(0, 6)
}
export function pickTopRated(d: SectorDemo[]): SectorDemo[] {
  return [...d].sort((a, b) => b.score - a.score || b.reviews - a.reviews).slice(0, 6)
}
export function pickEditorsChoice(d: SectorDemo[]): SectorDemo[] {
  return d.filter(x => x.badges.includes('featured')).slice(0, 6)
}
export function pickRisingStars(d: SectorDemo[]): SectorDemo[] {
  return d.filter(x => x.badges.includes('new') || x.badges.includes('startup'))
    .sort((a, b) => b.score - a.score).slice(0, 6)
}
export function pickMostReviewed(d: SectorDemo[]): SectorDemo[] {
  return [...d].sort((a, b) => b.reviews - a.reviews).slice(0, 6)
}
export function pickEnterprise(d: SectorDemo[]): SectorDemo[] {
  return d.filter(x => x.badges.includes('enterprise')).slice(0, 6)
}
export function pickStartups(d: SectorDemo[]): SectorDemo[] {
  return d.filter(x => x.badges.includes('startup') || x.badges.includes('trending'))
    .sort((a, b) => b.score - a.score).slice(0, 6)
}
export function pickTrending(d: SectorDemo[]): SectorDemo[] {
  return d.filter(x => x.badges.includes('trending')).slice(0, 6)
}
export function pickCompare(d: SectorDemo[]): SectorDemo[] {
  const seen = new Set<string>()
  const res: SectorDemo[] = []
  for (const x of [...d].sort((a, b) => b.score - a.score)) {
    if (!seen.has(x.category)) { seen.add(x.category); res.push(x) }
    if (res.length >= 6) break
  }
  return res.length >= 6 ? res : [...d].sort((a, b) => b.score - a.score).slice(0, 6)
}
