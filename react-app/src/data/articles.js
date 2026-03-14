/* Shared article data — used by NewsGrid, NewsArticlePage, SearchPage */

export const allArticles = [
  {
    id: 'cloud-security-trends',
    tag: 'Technology', tagClass: 'nws-tag--coral', color: 'var(--coral)',
    title: 'Cloud Security Spending Surges 35% as Enterprises Prioritize Zero-Trust Architecture',
    excerpt: 'Organizations worldwide are doubling down on cloud security investments, with zero-trust frameworks becoming the gold standard for enterprise protection strategies.',
    body: `<p>The cloud security market has witnessed an unprecedented surge in spending, with enterprises allocating 35% more budget to protecting their cloud infrastructure in 2026 compared to the previous year. This dramatic increase reflects a fundamental shift in how organizations approach cybersecurity in an increasingly distributed computing environment.</p>
<h2>The Rise of Zero-Trust</h2>
<p>Zero-trust architecture has emerged as the dominant security paradigm, moving beyond the traditional perimeter-based approach. Under this model, every user, device, and network flow is treated as potentially hostile, requiring continuous verification before granting access to resources.</p>
<p>"We're seeing a complete transformation in enterprise security thinking," says Dr. Amanda Chen, Chief Security Officer at CloudGuard Technologies. "Organizations have realized that the traditional castle-and-moat approach simply doesn't work in a world where data flows freely between cloud services, remote workers, and partner networks."</p>
<h2>Key Investment Areas</h2>
<p>The spending increase is concentrated in several key areas:</p>
<ul>
<li><strong>Identity and Access Management (IAM)</strong> — Companies are investing heavily in advanced IAM solutions that incorporate biometric authentication, behavioral analytics, and continuous session monitoring.</li>
<li><strong>Cloud-Native Application Protection Platforms (CNAPP)</strong> — These integrated platforms provide security across the entire application lifecycle, from code to cloud runtime.</li>
<li><strong>Security Service Edge (SSE)</strong> — The convergence of network security services delivered from the cloud, including secure web gateways, cloud access security brokers, and zero-trust network access.</li>
<li><strong>Data Loss Prevention (DLP)</strong> — Enhanced DLP tools that understand context and can protect sensitive data across hybrid and multi-cloud environments.</li>
</ul>
<h2>Market Impact</h2>
<p>Industry analysts predict the cloud security market will reach $68 billion by the end of 2026, driven by regulatory requirements, increasing sophistication of cyber threats, and the accelerating pace of digital transformation.</p>
<p>Mid-size enterprises, in particular, are leading the spending growth. Many of these organizations are migrating legacy applications to the cloud for the first time and recognizing the need for purpose-built security solutions rather than retrofitting on-premises tools.</p>
<h2>Looking Ahead</h2>
<p>As AI-powered threats become more sophisticated, security teams are increasingly turning to AI-driven defense mechanisms. Machine learning models that can detect anomalous behavior in real-time and automatically respond to threats are becoming essential components of the modern security stack.</p>
<p>The trend toward zero-trust is expected to accelerate further in 2027, with Gartner predicting that 70% of new remote access deployments will be served by zero-trust network access solutions, up from less than 10% at the end of 2021.</p>`,
    author: 'James Wu', initials: 'JW', avatarBg: 'linear-gradient(135deg,var(--coral),var(--amber))',
    date: 'Mar 10, 2026', readTime: '5 min', category: 'technology',
    authorRole: 'Senior Technology Editor',
    authorBio: 'James covers enterprise technology, cybersecurity, and cloud computing. Previously at TechCrunch and Wired.',
  },
  {
    id: 'restaurant-ai-ordering',
    tag: 'Food & Dining', tagClass: 'nws-tag--amber', color: 'var(--amber)',
    title: 'AI-Powered Ordering Systems Increase Restaurant Revenue by 25%, Study Finds',
    excerpt: 'New research from the National Restaurant Association shows that AI-driven ordering platforms are transforming the dining experience and boosting bottom lines.',
    body: `<p>A comprehensive study conducted by the National Restaurant Association in partnership with MIT's Food Innovation Lab reveals that restaurants implementing AI-powered ordering systems have seen an average revenue increase of 25% within the first year of deployment.</p>
<h2>How AI Ordering Works</h2>
<p>Modern AI ordering platforms go far beyond simple digital menus. These systems use machine learning algorithms to analyze customer preferences, weather patterns, local events, and historical ordering data to provide personalized menu recommendations that increase average ticket sizes.</p>
<p>"The AI doesn't just take orders — it understands dining patterns," explains Maria Santos, lead researcher on the study. "It knows that a rainy Tuesday evening calls for comfort food suggestions, while a sunny weekend brunch should highlight fresh, seasonal items."</p>
<h2>Key Findings</h2>
<p>The study surveyed over 2,500 restaurants across the United States and found:</p>
<ul>
<li><strong>25% average revenue increase</strong> — driven by personalized upselling and optimized menu presentation</li>
<li><strong>40% reduction in order errors</strong> — AI systems virtually eliminate miscommunication between customers and kitchen staff</li>
<li><strong>18% improvement in customer satisfaction scores</strong> — faster service and more personalized experiences lead to happier diners</li>
<li><strong>30% decrease in food waste</strong> — predictive analytics help restaurants better forecast demand and manage inventory</li>
</ul>
<h2>Small Business Impact</h2>
<p>Perhaps most significantly, the study found that small independent restaurants benefited more than large chains. Single-location restaurants saw an average revenue increase of 32%, compared to 21% for chain restaurants with more than 50 locations.</p>
<p>This suggests that AI ordering technology is helping level the playing field, giving small restaurants access to the kind of data-driven optimization previously available only to large corporate dining establishments.</p>`,
    author: 'Maria Santos', initials: 'MS', avatarBg: 'linear-gradient(135deg,var(--amber),var(--coral))',
    date: 'Mar 9, 2026', readTime: '4 min', category: 'food',
    authorRole: 'Food & Dining Reporter',
    authorBio: 'Maria specializes in food industry technology and restaurant business trends.',
  },
  {
    id: 'legal-tech-automation',
    tag: 'Legal', tagClass: 'nws-tag--plum', color: 'var(--plum)',
    title: 'Legal Tech Automation Reduces Contract Review Time by 80% for Mid-Size Firms',
    excerpt: 'AI-powered contract analysis tools are enabling mid-size law firms to compete with larger practices, processing thousands of documents in hours instead of weeks.',
    body: `<p>The legal industry is experiencing a technological revolution, with AI-powered contract review tools dramatically reducing the time and cost associated with one of the profession's most labor-intensive tasks. Mid-size law firms are leading this transformation, leveraging automation to compete more effectively with larger practices.</p>
<h2>The Contract Review Challenge</h2>
<p>Contract review has long been one of the most time-consuming aspects of legal practice. A typical M&A due diligence process might involve reviewing thousands of contracts, leases, and agreements — work that traditionally required teams of junior associates spending weeks or even months on document review.</p>
<h2>AI Changes the Game</h2>
<p>Modern AI contract analysis platforms use natural language processing and machine learning to understand legal language, identify key provisions, flag potential risks, and extract relevant data points from contracts at a fraction of the time it would take human reviewers.</p>
<p>"What used to take our team three weeks now takes half a day," says David Mitchell, managing partner at a 50-attorney firm in Chicago. "And the accuracy is actually better because the AI doesn't get fatigued or miss subtle clause variations."</p>
<h2>Industry Adoption</h2>
<p>The adoption rate among mid-size firms (25-200 attorneys) has more than doubled in the past year, with 67% now using some form of AI-assisted contract review, up from 31% in 2025. Large firms have been slower to adopt, partly due to the complexity of integrating new tools with established workflows.</p>`,
    author: 'David Mitchell', initials: 'DM', avatarBg: 'linear-gradient(135deg,var(--plum),var(--rose))',
    date: 'Mar 9, 2026', readTime: '6 min', category: 'legal',
    authorRole: 'Legal Industry Analyst',
    authorBio: 'David covers legal technology, compliance, and the intersection of law and AI.',
  },
  {
    id: 'edtech-corporate-training',
    tag: 'Education', tagClass: 'nws-tag--azure', color: 'var(--azure)',
    title: 'Corporate Training Platforms See Record Enrollment as Upskilling Becomes Priority',
    excerpt: 'Fortune 500 companies are investing heavily in digital learning platforms, with employee enrollment in professional development courses rising 150% year-over-year.',
    body: `<p>Corporate training is experiencing a renaissance, with Fortune 500 companies dramatically increasing their investment in digital learning platforms. Employee enrollment in professional development courses has risen 150% year-over-year, reflecting the growing urgency of upskilling in a rapidly evolving business landscape.</p>
<h2>The Upskilling Imperative</h2>
<p>As artificial intelligence and automation reshape industries, companies are recognizing that their most valuable asset — their workforce — needs continuous investment. The World Economic Forum estimates that 50% of all employees will need reskilling by 2027, a timeline that has accelerated the adoption of digital learning solutions.</p>
<h2>Platform Innovation</h2>
<p>Today's corporate training platforms bear little resemblance to the dry, compliance-focused e-learning of the past. Modern platforms incorporate adaptive learning paths, gamification, social learning features, and AI-powered content recommendations that keep employees engaged and motivated.</p>
<p>"We've moved beyond one-size-fits-all training," explains Nina Kapoor, Chief Learning Officer at a Fortune 100 technology company. "Our platform creates personalized learning journeys based on each employee's current skills, career goals, and the company's strategic priorities."</p>`,
    author: 'Nina Kapoor', initials: 'NK', avatarBg: 'linear-gradient(135deg,var(--azure),var(--accent))',
    date: 'Mar 8, 2026', readTime: '4 min', category: 'education',
    authorRole: 'Education & Workforce Correspondent',
    authorBio: 'Nina reports on education technology, workforce development, and the future of learning.',
  },
  {
    id: 'real-estate-proptech',
    tag: 'Real Estate', tagClass: 'nws-tag--emerald', color: 'var(--emerald)',
    title: 'PropTech Startups Raise $12B in Q1 2026, Signaling Market Confidence',
    excerpt: 'Venture capital flows into property technology continue to accelerate, with AI-powered valuation tools and virtual staging platforms leading the charge.',
    body: `<p>The property technology sector is booming, with startups raising a record $12 billion in venture capital during the first quarter of 2026 alone. This surge in funding signals growing market confidence in technology's ability to transform every aspect of the real estate industry.</p>
<h2>Where the Money Is Going</h2>
<p>Investment is concentrated in several key areas that are reshaping how properties are bought, sold, and managed:</p>
<ul>
<li><strong>AI-Powered Valuation Tools</strong> — Platforms that use machine learning to provide instant, accurate property valuations by analyzing comparable sales, neighborhood trends, and property condition data.</li>
<li><strong>Virtual Staging & Tours</strong> — Technology that allows buyers to experience properties remotely through photorealistic virtual staging and immersive 3D tours.</li>
<li><strong>Property Management Automation</strong> — Solutions that streamline tenant communications, maintenance requests, and financial reporting for property managers.</li>
<li><strong>Construction Technology</strong> — Platforms that bring efficiency to the building process through better project management, supply chain optimization, and modular construction planning.</li>
</ul>
<h2>Market Dynamics</h2>
<p>The PropTech funding surge comes despite a challenging broader real estate market, with elevated interest rates continuing to dampen transaction volumes. Investors see this as an opportunity rather than a challenge, betting that technology can help the industry adapt to the new normal.</p>`,
    author: 'Sarah Chen', initials: 'SC', avatarBg: 'linear-gradient(135deg,var(--emerald),var(--teal))',
    date: 'Mar 8, 2026', readTime: '5 min', category: 'realestate',
    authorRole: 'Real Estate & PropTech Writer',
    authorBio: 'Sarah covers real estate technology, property markets, and urban development trends.',
  },
  {
    id: 'home-services-marketplace',
    tag: 'Home Services', tagClass: 'nws-tag--teal', color: 'var(--teal)',
    title: 'Home Services Marketplaces Disrupt Traditional Contractor Referral Networks',
    excerpt: 'Digital platforms connecting homeowners with verified contractors are growing 60% annually, reshaping how consumers find and hire service professionals.',
    body: `<p>The home services industry is undergoing a digital transformation, with online marketplaces that connect homeowners directly with verified contractors growing at 60% annually. These platforms are fundamentally changing how consumers find, evaluate, and hire service professionals for everything from plumbing repairs to full home renovations.</p>
<h2>The Trust Factor</h2>
<p>At the heart of these platforms' success is their ability to solve the trust problem that has long plagued the home services industry. By combining verified reviews, background checks, license verification, and insurance confirmation, these marketplaces give homeowners confidence that they're hiring qualified professionals.</p>
<h2>Impact on Traditional Networks</h2>
<p>Word-of-mouth referrals and local advertising, which have been the backbone of contractor marketing for decades, are seeing declining effectiveness as consumers increasingly turn to digital platforms for service provider discovery.</p>`,
    author: 'Alex Rivera', initials: 'AR', avatarBg: 'linear-gradient(135deg,var(--teal),var(--emerald))',
    date: 'Mar 7, 2026', readTime: '4 min', category: 'home',
    authorRole: 'Home Services Industry Reporter',
    authorBio: 'Alex covers home improvement, contractor marketplaces, and the gig economy.',
  },
  {
    id: 'marketing-attribution-ai',
    tag: 'Marketing', tagClass: 'nws-tag--rose', color: 'var(--rose)',
    title: 'AI Attribution Models Finally Solve the Multi-Touch Marketing Puzzle',
    excerpt: 'New machine learning approaches to marketing attribution are giving CMOs unprecedented clarity on which channels actually drive conversions and revenue.',
    body: `<p>Marketing attribution — the process of determining which marketing touchpoints contribute to a sale — has long been one of the most challenging problems in business. Now, AI-powered attribution models are finally delivering the clarity that marketers have sought for decades.</p>
<h2>Beyond Last-Click Attribution</h2>
<p>Traditional attribution models like last-click or first-click gave credit to a single touchpoint, ignoring the complex customer journey that typically involves multiple interactions across various channels. AI models can now analyze the entire customer journey and assign appropriate credit to each touchpoint based on its actual contribution to the conversion.</p>
<h2>Real Business Impact</h2>
<p>Companies implementing AI attribution are seeing dramatic improvements in marketing efficiency. On average, organizations report being able to reduce their marketing spend by 15-20% while maintaining the same conversion rates, simply by reallocating budget based on AI-generated insights.</p>`,
    author: 'Lisa Tran', initials: 'LT', avatarBg: 'linear-gradient(135deg,var(--rose),var(--plum))',
    date: 'Mar 7, 2026', readTime: '7 min', category: 'marketing',
    authorRole: 'Marketing & AdTech Analyst',
    authorBio: 'Lisa covers digital marketing technology, advertising platforms, and growth strategies.',
  },
  {
    id: 'healthcare-wearables-data',
    tag: 'Healthcare', tagClass: 'nws-tag--emerald', color: 'var(--emerald)',
    title: 'Wearable Health Data Integration Creates New Opportunities for Clinics',
    excerpt: 'Healthcare providers that integrate wearable device data into patient records report 40% better outcomes for chronic disease management programs.',
    body: `<p>The integration of wearable health device data into clinical workflows is transforming chronic disease management, with healthcare providers reporting significantly improved patient outcomes. A new study from Johns Hopkins Medicine found that clinics using integrated wearable data saw a 40% improvement in chronic disease management outcomes.</p>
<h2>The Data Revolution</h2>
<p>Modern wearable devices generate a wealth of health data — from continuous heart rate and blood oxygen monitoring to sleep patterns, activity levels, and even early signs of atrial fibrillation. The challenge has been integrating this data stream into the clinical workflow in a way that's useful rather than overwhelming.</p>
<h2>Clinical Integration Success</h2>
<p>Leading health systems have developed AI-powered triage systems that filter wearable data, surfacing only clinically relevant insights to healthcare providers. This approach gives doctors actionable information without creating alert fatigue.</p>`,
    author: 'Sara Lopez', initials: 'SL', avatarBg: 'linear-gradient(135deg,var(--emerald),var(--azure))',
    date: 'Mar 6, 2026', readTime: '5 min', category: 'healthcare',
    authorRole: 'Healthcare & MedTech Writer',
    authorBio: 'Sara covers healthcare technology, digital health, and medical device innovation.',
  },
  {
    id: 'fintech-embedded-finance',
    tag: 'Finance', tagClass: 'nws-tag--accent', color: 'var(--accent)',
    title: 'Embedded Finance Revolution: Every SaaS Company Is Becoming a Fintech',
    excerpt: 'From invoicing tools to project management platforms, software companies are embedding financial services to unlock new revenue streams and customer stickiness.',
    body: `<p>The boundaries between software and financial services continue to blur as an increasing number of SaaS companies embed banking, lending, and payment capabilities directly into their platforms. This trend, known as embedded finance, is creating a new paradigm where financial services are delivered contextually within the tools businesses already use.</p>
<h2>The Embedded Finance Opportunity</h2>
<p>McKinsey estimates that embedded finance will generate $230 billion in revenue by 2028, up from approximately $43 billion in 2024. This explosive growth is being driven by the convergence of open banking APIs, banking-as-a-service platforms, and the increasing sophistication of SaaS business models.</p>
<h2>How It Works</h2>
<p>Rather than requiring businesses to switch between their operational software and separate banking or financial tools, embedded finance integrates these services seamlessly. An invoicing platform might offer instant factoring, a project management tool might provide contractor payments, or an e-commerce platform might embed merchant lending.</p>`,
    author: 'Michael Torres', initials: 'MT', avatarBg: 'linear-gradient(135deg,var(--accent),var(--plum))',
    date: 'Mar 6, 2026', readTime: '6 min', category: 'finance',
    authorRole: 'Fintech & Banking Correspondent',
    authorBio: 'Michael covers financial technology, digital banking, and the intersection of finance and software.',
  },
  {
    id: 'sustainability-business-directories',
    tag: 'Business', tagClass: 'nws-tag--teal', color: 'var(--teal)',
    title: 'Green Business Directories See 300% Traffic Growth as Consumers Prioritize Sustainability',
    excerpt: 'Eco-conscious consumers are increasingly using sustainability-focused business directories to find environmentally responsible service providers.',
    body: `<p>Consumer interest in sustainability has reached a tipping point, with business directories focused on environmentally responsible companies seeing traffic growth of 300% over the past year. This surge reflects a fundamental shift in consumer behavior, as people increasingly align their purchasing decisions with their environmental values.</p>
<h2>The Green Directory Movement</h2>
<p>Sustainability-focused business directories help consumers find companies that meet verified environmental standards. These platforms go beyond simple business listings by requiring sustainability certifications, carbon footprint disclosures, and verifiable environmental practices from listed businesses.</p>
<h2>Consumer Behavior Shift</h2>
<p>Research from Nielsen indicates that 78% of consumers now consider a company's environmental practices when making purchasing decisions, up from 52% just three years ago. This shift is particularly pronounced among Gen Z and Millennial consumers, who are willing to pay a premium for sustainable products and services.</p>`,
    author: 'Emma Collins', initials: 'EC', avatarBg: 'linear-gradient(135deg,var(--teal),var(--emerald))',
    date: 'Mar 5, 2026', readTime: '4 min', category: 'business',
    authorRole: 'Business & Sustainability Editor',
    authorBio: 'Emma covers sustainable business practices, ESG trends, and the green economy.',
  },
  {
    id: 'cybersecurity-smb-threats',
    tag: 'Technology', tagClass: 'nws-tag--coral', color: 'var(--coral)',
    title: 'Cyberattacks on Small Businesses Spike 70%: What Directory Listings Can Do to Help',
    excerpt: 'Security experts recommend verified business directories as a trust signal that helps customers distinguish legitimate businesses from fraudulent ones.',
    body: `<p>Small businesses are facing an unprecedented wave of cyberattacks, with incidents rising 70% year-over-year according to a new report from the Cybersecurity and Infrastructure Security Agency (CISA). As threat actors increasingly target smaller organizations with fewer resources to defend themselves, the business directory industry is emerging as an unexpected ally in the fight against fraud.</p>
<h2>The SMB Security Crisis</h2>
<p>Unlike large enterprises with dedicated security teams and substantial budgets, small businesses often lack the resources to implement comprehensive cybersecurity programs. The average cost of a data breach for a small business now exceeds $150,000 — a devastating amount for many small companies.</p>
<h2>How Directories Help</h2>
<p>Verified business directories serve as a trust layer that helps consumers identify legitimate businesses. By requiring identity verification, business license confirmation, and ongoing monitoring, these platforms create a digital trust signal that's increasingly important in an environment rife with fraud.</p>`,
    author: 'James Wu', initials: 'JW', avatarBg: 'linear-gradient(135deg,var(--coral),var(--amber))',
    date: 'Mar 5, 2026', readTime: '5 min', category: 'technology',
    authorRole: 'Senior Technology Editor',
    authorBio: 'James covers enterprise technology, cybersecurity, and cloud computing. Previously at TechCrunch and Wired.',
  },
  {
    id: 'remote-work-tools-ranking',
    tag: 'Workplace', tagClass: 'nws-tag--azure', color: 'var(--azure)',
    title: 'The Definitive Ranking: Top 20 Remote Work Tools for 2026',
    excerpt: 'Our annual analysis of remote work platforms reveals the tools that are actually making distributed teams more productive, based on user reviews and satisfaction data.',
    body: `<p>As remote and hybrid work becomes the permanent reality for millions of professionals worldwide, the tools that enable distributed collaboration have never been more important. Our annual analysis, based on over 50,000 user reviews and satisfaction surveys, identifies the platforms that are truly making a difference for distributed teams.</p>
<h2>Methodology</h2>
<p>Our ranking evaluates remote work tools across five dimensions: ease of use, reliability, feature depth, integration capabilities, and value for money. We weighted user satisfaction data from verified business directory reviews alongside expert analysis to produce our final rankings.</p>
<h2>Top Trends in 2026</h2>
<p>This year's analysis reveals several clear trends: AI-powered meeting assistants have become table stakes, async-first communication tools are gaining ground over real-time chat, and all-in-one platforms are being preferred over best-of-breed point solutions as teams experience "tool fatigue."</p>
<p>The biggest shift from last year is the emergence of AI copilots integrated directly into productivity suites. Tools that can summarize meetings, draft follow-up emails, and automatically update project boards based on conversation context have seen the highest user satisfaction scores.</p>`,
    author: 'Nina Kapoor', initials: 'NK', avatarBg: 'linear-gradient(135deg,var(--azure),var(--accent))',
    date: 'Mar 4, 2026', readTime: '10 min', category: 'technology',
    authorRole: 'Education & Workforce Correspondent',
    authorBio: 'Nina reports on education technology, workforce development, and the future of learning.',
  },
]

export const categoryMeta = {
  technology: { label: 'Technology', gradient: 'linear-gradient(135deg,var(--coral),var(--amber))' },
  food: { label: 'Food & Dining', gradient: 'linear-gradient(135deg,var(--amber),var(--coral))' },
  legal: { label: 'Legal', gradient: 'linear-gradient(135deg,var(--plum),var(--rose))' },
  education: { label: 'Education', gradient: 'linear-gradient(135deg,var(--azure),var(--accent))' },
  realestate: { label: 'Real Estate', gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))' },
  home: { label: 'Home Services', gradient: 'linear-gradient(135deg,var(--teal),var(--emerald))' },
  marketing: { label: 'Marketing', gradient: 'linear-gradient(135deg,var(--rose),var(--plum))' },
  healthcare: { label: 'Healthcare', gradient: 'linear-gradient(135deg,var(--emerald),var(--azure))' },
  finance: { label: 'Finance', gradient: 'linear-gradient(135deg,var(--accent),var(--plum))' },
  business: { label: 'Business', gradient: 'linear-gradient(135deg,var(--teal),var(--emerald))' },
}
