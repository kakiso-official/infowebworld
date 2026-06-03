"""
Build database/seed-professional-services-100-listings.sql

100 real Professional Services firms, inserted straight into `submissions`
as live (status='active', payment_status='completed', user_id=NULL →
claimable) — the same approach as build-aiml-seed-100.py, but EVERY
renderable section is populated, not just identity:

  identity ....... name, slug, tagline, real 2-3 sentence description,
                   founded year, HQ city/country, team-size band, website,
                   favicon logo, LinkedIn
  category ....... real taxonomy slug (L3 for the 6 marquee verticals,
                   valid L2 for real estate / insurance / IB / architecture)
  key_features ... real service lines per firm/vertical  [{name,description}]
  features ....... flat services list                    [string]
  industries / use_cases / target_company_sizes ........ [string]
  pros / cons .... honest, per-vertical                  [string]
  support_channels / training_options / languages ...... [string]
  faqs ........... 4 answer-first Q&As, firm-interpolated [{question,answer}]
  header_tags .... 3 short descriptors                   [string]
  pricing_model .. "Custom quote" (these firms quote per engagement)

Left NULL on purpose (not applicable / not published — render as empty-state,
exactly like the AI/ML seed): pricing_tiers, starting_price, integrations,
compliance, awards, screenshots. Screenshots come from
scripts/capture-screenshots.mjs after this SQL is loaded.

Run:  python scripts/build-professional-services-seed-100.py
"""
import json
import re
import sys
import io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

ROOT = Path(__file__).resolve().parents[1]
SQL_OUT = ROOT / "database" / "seed-professional-services-100-listings.sql"


def sq(s):
    if s is None:
        return "NULL"
    return "'" + str(s).replace("\\", "\\\\").replace("'", "''") + "'"


def num(v):
    return "NULL" if v is None else str(v)


def jarr(items):
    """JSON array of strings (or NULL when empty)."""
    if not items:
        return "NULL"
    return sq(json.dumps(items, ensure_ascii=False))


def jobjs(items):
    """JSON array of objects (or NULL when empty)."""
    if not items:
        return "NULL"
    return sq(json.dumps(items, ensure_ascii=False))


def kf(*pairs):
    """key_features helper -> [{name, description}]"""
    return [{"name": n, "description": d} for n, d in pairs]


def faq(*pairs):
    """faqs helper -> [{question, answer}]"""
    return [{"question": q, "answer": a} for q, a in pairs]


# ─── Per-vertical content templates ────────────────────────────────────────
# Shared, credible section content for every firm in a vertical. {name} is
# interpolated per firm at build time. Service lines (key_features) are the
# real offerings these firms are known for.
VERT = {
    "accounting": dict(
        header_tags=["Accounting", "Tax", "Advisory"],
        key_features=kf(
            ("Audit & Assurance", "Independent financial statement audits, internal controls, and assurance over financial reporting."),
            ("Tax", "Corporate, international, indirect, and personal tax planning, compliance, and advisory."),
            ("Advisory", "Transaction, risk, and management advisory across the business lifecycle."),
            ("Accounting & Bookkeeping", "Day-to-day accounting, financial close, and managed bookkeeping services."),
            ("Outsourced Finance", "Outsourced controller and CFO services for growing organizations."),
        ),
        features=["Financial statement audits", "Corporate tax", "International tax", "Bookkeeping", "Payroll", "Risk advisory", "Transaction services", "Forensic accounting"],
        industries=["Financial services", "Technology", "Healthcare", "Manufacturing", "Real estate", "Nonprofit", "Retail & consumer", "Public sector"],
        use_cases=["Annual financial statement audit", "Corporate tax return preparation", "Outsourced bookkeeping & close", "M&A financial due diligence", "Internal controls & SOX readiness"],
        sizes=["Small businesses", "Midsize", "Enterprises"],
        support=["Dedicated engagement team", "Email", "Phone", "Client portal"],
        training=["Webinars", "Industry insights & guides", "Client onboarding"],
        pros=["Deep regulatory and industry expertise", "Established reputation and credentials", "Broad service coverage under one roof", "Global delivery capability"],
        cons=["Pricing is engagement-based, not transparent upfront", "Best suited to mid-market and enterprise budgets"],
        pricing_model="Custom quote",
        languages=["English"],
    ),
    "consulting": dict(
        header_tags=["Management Consulting", "Strategy", "Advisory"],
        key_features=kf(
            ("Strategy", "Corporate, growth, and business-unit strategy development and execution."),
            ("Operations", "Operating-model design, cost transformation, and performance improvement."),
            ("Organization & People", "Org design, change management, and leadership effectiveness."),
            ("Digital & Technology", "Digital transformation, data & analytics, and technology strategy."),
            ("M&A / Transactions", "Commercial due diligence, integration, and value creation."),
        ),
        features=["Corporate strategy", "Operations improvement", "Digital transformation", "Org & change", "M&A due diligence", "Cost reduction", "Data & analytics", "Restructuring"],
        industries=["Financial services", "Healthcare & life sciences", "Technology", "Consumer & retail", "Energy", "Industrials", "Public sector"],
        use_cases=["Define corporate growth strategy", "Reduce cost & improve margins", "Run a digital transformation", "Commercial due diligence on an acquisition", "Redesign the operating model"],
        sizes=["Midsize", "Enterprises"],
        support=["Dedicated engagement team", "Executive sponsor", "Email", "Phone"],
        training=["Thought leadership & reports", "Executive workshops", "Webinars"],
        pros=["Senior, experienced engagement teams", "Rigorous, data-driven methodology", "Strong track record with large organizations", "Global reach"],
        cons=["Premium pricing", "Typically scoped for larger transformation budgets"],
        pricing_model="Custom quote",
        languages=["English"],
    ),
    "financial": dict(
        header_tags=["Financial Advisory", "Wealth", "Planning"],
        key_features=kf(
            ("Financial Planning", "Goals-based planning across cash flow, retirement, education, and estate."),
            ("Investment Management", "Portfolio construction, asset allocation, and ongoing management."),
            ("Retirement Planning", "Retirement income, rollovers, and tax-efficient withdrawal strategies."),
            ("Wealth Management", "Integrated wealth, tax, and estate planning for high-net-worth clients."),
            ("Advisory Access", "Access to credentialed advisors and fiduciary guidance."),
        ),
        features=["Financial planning", "Investment management", "Retirement planning", "Wealth management", "Estate planning", "Tax-efficient investing", "Education funding"],
        industries=["Individuals & families", "High-net-worth", "Small business owners", "Executives", "Retirees"],
        use_cases=["Build a long-term financial plan", "Manage and grow investments", "Plan for retirement income", "Roll over a 401(k)", "Coordinate estate & tax planning"],
        sizes=["Individuals", "Families", "Small business owners"],
        support=["Dedicated advisor", "Phone", "Email", "Online portal & app"],
        training=["Planning guides", "Webinars", "Market commentary"],
        pros=["Credentialed, often fiduciary advisors", "Goals-based, personalized planning", "Long-term relationship model"],
        cons=["Fees vary by assets or plan", "Minimums may apply for full-service advice"],
        pricing_model="Custom quote",
        languages=["English"],
    ),
    "hr": dict(
        header_tags=["Staffing", "Recruiting", "Talent"],
        key_features=kf(
            ("Permanent Placement", "Direct-hire recruiting across professional functions and levels."),
            ("Contract & Temp Staffing", "Flexible contract, temp, and temp-to-hire talent on demand."),
            ("Executive Search", "Retained search for senior leadership and board roles."),
            ("Talent Advisory", "Workforce planning, compensation benchmarking, and market insight."),
            ("Managed Solutions", "RPO, project teams, and managed staffing programs."),
        ),
        features=["Permanent placement", "Contract staffing", "Executive search", "Temp-to-hire", "RPO", "Workforce consulting", "Salary benchmarking"],
        industries=["Technology", "Finance & accounting", "Legal", "Healthcare", "Administrative", "Engineering", "Marketing & creative"],
        use_cases=["Hire for a hard-to-fill role", "Scale a team with contract talent", "Run a confidential executive search", "Benchmark salaries", "Stand up an RPO program"],
        sizes=["Small businesses", "Midsize", "Enterprises"],
        support=["Dedicated recruiter", "Phone", "Email", "Account manager"],
        training=["Hiring & salary guides", "Market reports", "Webinars"],
        pros=["Large vetted talent network", "Speed to qualified candidates", "Specialized by function and industry"],
        cons=["Placement fees apply", "Quality varies by local market and recruiter"],
        pricing_model="Custom quote",
        languages=["English"],
    ),
    "marketing": dict(
        header_tags=["Marketing", "Advertising", "Brand"],
        key_features=kf(
            ("Brand Strategy", "Positioning, brand architecture, and identity systems."),
            ("Advertising & Creative", "Integrated campaigns across film, digital, social, and OOH."),
            ("Media Planning & Buying", "Audience strategy, planning, and programmatic buying."),
            ("Digital & Performance", "Performance marketing, SEO/SEM, and CRM."),
            ("PR & Communications", "Earned media, reputation, and corporate communications."),
        ),
        features=["Brand strategy", "Creative & advertising", "Media planning & buying", "Digital marketing", "Performance marketing", "Public relations", "Social media", "Market research"],
        industries=["Consumer & retail", "Technology", "Financial services", "Healthcare", "Automotive", "Travel & hospitality", "B2B"],
        use_cases=["Launch a brand or rebrand", "Run an integrated ad campaign", "Plan and buy media at scale", "Grow performance marketing", "Manage PR and reputation"],
        sizes=["Midsize", "Enterprises"],
        support=["Dedicated account team", "Email", "Phone", "Strategy reviews"],
        training=["Industry reports", "Trend insights", "Workshops"],
        pros=["Award-winning creative talent", "Integrated services across channels", "Global scale and reach"],
        cons=["Retainer/project pricing skews premium", "Best fit for established marketing budgets"],
        pricing_model="Custom quote",
        languages=["English"],
    ),
    "legal": dict(
        header_tags=["Law Firm", "Legal", "Advisory"],
        key_features=kf(
            ("Corporate & M&A", "Mergers, acquisitions, financings, and general corporate counsel."),
            ("Litigation & Disputes", "Complex commercial litigation, arbitration, and dispute resolution."),
            ("Capital Markets", "Equity and debt offerings and securities regulation."),
            ("Regulatory & Compliance", "Antitrust, regulatory, and compliance counsel."),
            ("Specialty Practices", "IP, tax, employment, and industry-specific counsel."),
        ),
        features=["Mergers & acquisitions", "Corporate counsel", "Commercial litigation", "Capital markets", "Private equity & VC", "Regulatory & antitrust", "Intellectual property", "Employment law"],
        industries=["Technology", "Financial services", "Private equity & VC", "Healthcare & life sciences", "Energy", "Media", "Real estate"],
        use_cases=["Close a merger or acquisition", "Raise venture or growth capital", "Defend complex litigation", "Navigate a regulatory matter", "Protect intellectual property"],
        sizes=["Startups", "Midsize", "Enterprises"],
        support=["Dedicated partner & associates", "Phone", "Email", "Secure client portal"],
        training=["Legal alerts & client memos", "Webinars & CLEs", "Industry guides"],
        pros=["Top-tier, specialized attorneys", "Deep bench across practice areas", "Strong track record on major matters"],
        cons=["Premium hourly rates", "Oriented to complex, higher-value matters"],
        pricing_model="Custom quote",
        languages=["English"],
    ),
    "realestate": dict(
        header_tags=["Commercial Real Estate", "Brokerage", "Advisory"],
        key_features=kf(
            ("Leasing", "Tenant and landlord representation across office, industrial, and retail."),
            ("Capital Markets", "Investment sales, debt, and equity advisory."),
            ("Property Management", "Operations, facilities, and asset management."),
            ("Valuation & Advisory", "Appraisal, valuation, and strategic real estate advisory."),
            ("Project & Workplace", "Project management and workplace strategy."),
        ),
        features=["Tenant representation", "Landlord representation", "Investment sales", "Debt & structured finance", "Property management", "Valuation & appraisal", "Project management", "Workplace strategy"],
        industries=["Office", "Industrial & logistics", "Retail", "Multifamily", "Healthcare", "Data centers", "Hospitality"],
        use_cases=["Lease or sublease office space", "Buy or sell an investment property", "Manage a real estate portfolio", "Get a property valuation", "Plan a workplace fit-out"],
        sizes=["Midsize", "Enterprises", "Investors"],
        support=["Dedicated broker/advisor", "Phone", "Email", "Account team"],
        training=["Market research & outlooks", "Webinars", "Investor reports"],
        pros=["Global market coverage and data", "Full-service across the property lifecycle", "Deep capital-markets relationships"],
        cons=["Commission/fee-based engagements", "Service depth varies by local market"],
        pricing_model="Custom quote",
        languages=["English"],
    ),
    "insurance": dict(
        header_tags=["Insurance Broker", "Risk", "Benefits"],
        key_features=kf(
            ("Risk & Insurance Brokerage", "Property, casualty, and specialty insurance placement."),
            ("Employee Benefits", "Health, retirement, and benefits program design and administration."),
            ("Risk Management", "Risk assessment, mitigation, and total-cost-of-risk advisory."),
            ("Claims Advocacy", "Claims management and advocacy on the client's behalf."),
            ("Specialty Programs", "Industry- and exposure-specific insurance programs."),
        ),
        features=["Commercial insurance", "Employee benefits", "Risk management", "Claims advocacy", "Captives & alternative risk", "Cyber insurance", "Surety & bonds"],
        industries=["Technology & startups", "Construction", "Healthcare", "Manufacturing", "Financial services", "Real estate", "Nonprofit"],
        use_cases=["Place commercial insurance coverage", "Design an employee benefits program", "Reduce total cost of risk", "Advocate a complex claim", "Secure cyber liability cover"],
        sizes=["Small businesses", "Midsize", "Enterprises"],
        support=["Dedicated account team", "Phone", "Email", "Claims support"],
        training=["Risk insights & alerts", "Webinars", "Benchmarking reports"],
        pros=["Broad carrier relationships and market access", "Specialized risk and benefits expertise", "Claims advocacy on your side"],
        cons=["Commission/fee structures vary", "Enterprise-grade service tiers cost more"],
        pricing_model="Custom quote",
        languages=["English"],
    ),
    "ib": dict(
        header_tags=["Investment Banking", "M&A", "Capital Markets"],
        key_features=kf(
            ("M&A Advisory", "Buy-side and sell-side mergers and acquisitions advisory."),
            ("Capital Raising", "Equity and debt capital raising and private placements."),
            ("Restructuring", "Financial restructuring, recapitalization, and distressed advisory."),
            ("Strategic Advisory", "Board-level strategic, fairness, and valuation advisory."),
            ("Industry Coverage", "Sector-specialized coverage and deal execution."),
        ),
        features=["Mergers & acquisitions", "Equity capital markets", "Debt capital markets", "Restructuring", "Private placements", "Fairness opinions", "Valuation"],
        industries=["Technology", "Healthcare", "Financial institutions", "Industrials", "Consumer & retail", "Energy", "Real estate"],
        use_cases=["Sell a company", "Acquire a target", "Raise growth or debt capital", "Restructure a balance sheet", "Get a fairness opinion"],
        sizes=["Midsize", "Enterprises"],
        support=["Dedicated deal team", "Senior banker coverage", "Phone", "Email"],
        training=["Market & sector reports", "Deal commentary"],
        pros=["Senior banker attention on every deal", "Deep sector and transaction expertise", "Strong investor and buyer networks"],
        cons=["Success-fee and retainer based", "Focused on meaningful transaction sizes"],
        pricing_model="Custom quote",
        languages=["English"],
    ),
    "architecture": dict(
        header_tags=["Architecture", "Engineering", "Design"],
        key_features=kf(
            ("Architecture", "Architectural design across commercial, civic, and mixed-use projects."),
            ("Engineering", "Structural, MEP, and civil engineering services."),
            ("Interior Design", "Workplace and interior design and space planning."),
            ("Planning & Urban Design", "Master planning, urban design, and feasibility."),
            ("Sustainability", "Sustainable design, decarbonization, and green certification."),
        ),
        features=["Architectural design", "Structural engineering", "MEP engineering", "Interior design", "Master planning", "Sustainability consulting", "Project management"],
        industries=["Commercial", "Workplace", "Healthcare", "Education", "Government & civic", "Transportation", "Mixed-use"],
        use_cases=["Design a new building", "Plan a workplace or interior fit-out", "Engineer a complex structure", "Master-plan a development", "Achieve green-building certification"],
        sizes=["Midsize", "Enterprises", "Public sector"],
        support=["Dedicated project team", "Phone", "Email", "Design reviews"],
        training=["Design research & insights", "Webinars"],
        pros=["Award-winning, multidisciplinary teams", "Global project experience", "Strong sustainability capability"],
        cons=["Fees scoped per project", "Geared to medium-to-large capital projects"],
        pricing_model="Custom quote",
        languages=["English"],
    ),
}


def faqs_for(name, v):
    """Four answer-first FAQs, firm-interpolated, per vertical flavour."""
    feats = ", ".join(f["name"].lower() for f in VERT[v]["key_features"][:3])
    return faq(
        (f"What services does {name} offer?",
         f"{name} provides {feats}, and related professional services. Browse the service list and full profile above for details."),
        (f"How much does {name} cost?",
         f"{name} prices engagements on a custom-quote basis — fees depend on scope, complexity, and the services you need. Contact the firm through its profile for a tailored quote."),
        (f"Who does {name} work with?",
         f"{name} serves clients ranging from {VERT[v]['sizes'][0].lower()} to {VERT[v]['sizes'][-1].lower()} across industries such as {', '.join(VERT[v]['industries'][:3]).lower()}."),
        (f"How do I get started with {name}?",
         f"Reach out via {name}'s website or this InfoWebWorld profile to scope your needs and request a proposal; a dedicated team is typically assigned to your engagement."),
    )


# ─── 100 firms ──────────────────────────────────────────────────────────────
# Fields: name, domain, cat (real taxonomy slug), vert (template key),
#         tagline, description, founded, city, country, team_size, linkedin
L = []
def add(name, domain, cat, vert, tagline, description, founded, city, country, team, linkedin=None):
    L.append(dict(name=name, domain=domain, cat=cat, vert=vert, tagline=tagline,
                  description=description, founded=founded, city=city, country=country,
                  team=team, linkedin=linkedin))

# ── Accounting & Tax (13) ──
add("Deloitte", "deloitte.com", "audit-assurance", "accounting",
    "The world's largest professional services firm — audit, consulting, tax, and advisory",
    "Deloitte is the largest of the Big Four professional services networks, delivering audit & assurance, consulting, tax, risk, and financial advisory to a majority of the world's largest companies across 150+ countries.",
    1845, "London", "GB", "1000+", "https://www.linkedin.com/company/deloitte")
add("PwC", "pwc.com", "audit-assurance", "accounting",
    "Big Four assurance, tax, and advisory built on trust",
    "PwC (PricewaterhouseCoopers) is a Big Four firm providing assurance, tax, and advisory services to clients in 150+ countries, with deep industry specialization and a focus on building trust in society.",
    1998, "London", "GB", "1000+", "https://www.linkedin.com/company/pwc")
add("EY", "ey.com", "audit-assurance", "accounting",
    "Building a better working world — assurance, tax, consulting, strategy",
    "EY (Ernst & Young) is a Big Four global leader in assurance, tax, consulting, and strategy & transactions, serving clients across every major industry from offices in more than 150 countries.",
    1989, "London", "GB", "1000+", "https://www.linkedin.com/company/ernstandyoung")
add("KPMG", "kpmg.com", "audit-assurance", "accounting",
    "Big Four audit, tax, and advisory",
    "KPMG is a Big Four professional services network delivering audit, tax, and advisory services, known for deep sector expertise and a global presence spanning 140+ countries.",
    1987, "Amstelveen", "NL", "1000+", "https://www.linkedin.com/company/kpmg")
add("RSM US", "rsmus.com", "cpa-accounting-firms", "accounting",
    "The leading provider of audit, tax, and consulting to the middle market",
    "RSM US is the largest US accounting and advisory firm focused on the middle market, offering audit, tax, and consulting services and part of the global RSM network.",
    1926, "Chicago", "US", "1000+", "https://www.linkedin.com/company/rsm-us-llp")
add("Grant Thornton", "grantthornton.com", "cpa-accounting-firms", "accounting",
    "Audit, tax, and advisory for dynamic organizations",
    "Grant Thornton is a leading audit, tax, and advisory firm serving dynamic mid-market and large organizations, part of one of the world's largest professional services networks.",
    1924, "Chicago", "US", "1000+", "https://www.linkedin.com/company/grant-thornton-llp")
add("BDO USA", "bdo.com", "cpa-accounting-firms", "accounting",
    "Assurance, tax, and advisory with a people-first approach",
    "BDO USA is a leading accounting and advisory firm providing assurance, tax, and advisory services to clients nationwide, part of the global BDO network across 160+ countries.",
    1910, "Chicago", "US", "1000+", "https://www.linkedin.com/company/bdo-usa-llp")
add("Crowe", "crowe.com", "cpa-accounting-firms", "accounting",
    "Audit, tax, advisory, and consulting with deep specialization",
    "Crowe is a public accounting, consulting, and technology firm that combines deep industry expertise with innovative solutions across audit, tax, advisory, and consulting.",
    1942, "Chicago", "US", "1000+", "https://www.linkedin.com/company/crowe")
add("Baker Tilly", "bakertilly.com", "cpa-accounting-firms", "accounting",
    "Advisory, tax, and assurance built around client industries",
    "Baker Tilly is a leading advisory, tax, and assurance firm serving the middle market, part of the global Baker Tilly network operating in 140+ territories.",
    1931, "Chicago", "US", "1000+", "https://www.linkedin.com/company/baker-tilly")
add("Moss Adams", "mossadams.com", "cpa-accounting-firms", "accounting",
    "West-coast-rooted assurance, tax, and consulting",
    "Moss Adams is one of the largest US public accounting firms, delivering assurance, tax, and consulting services with deep specialization across technology, healthcare, and other industries.",
    1913, "Seattle", "US", "1000+", "https://www.linkedin.com/company/moss-adams-llp")
add("CohnReznick", "cohnreznick.com", "cpa-accounting-firms", "accounting",
    "Advisory, assurance, and tax for forward-thinking organizations",
    "CohnReznick is a leading advisory, assurance, and tax firm serving the middle market and beyond, with industry-focused teams across the United States.",
    1919, "New York", "US", "1000+", "https://www.linkedin.com/company/cohnreznick-llp")
add("Bench", "bench.co", "bookkeeping", "accounting",
    "Online bookkeeping for small businesses, done for you",
    "Bench pairs intuitive software with real human bookkeepers to deliver done-for-you monthly bookkeeping and year-end financials for small businesses and startups.",
    2012, "Vancouver", "CA", "201-500", "https://www.linkedin.com/company/bench-accounting")
add("Pilot", "pilot.com", "bookkeeping", "accounting",
    "Bookkeeping, tax, and CFO services for startups and growing businesses",
    "Pilot provides bookkeeping, tax, and CFO services built for startups and high-growth companies, combining expert finance teams with modern software.",
    2017, "San Francisco", "US", "201-500", "https://www.linkedin.com/company/pilot-com")

# ── Business Consulting (13) ──
add("McKinsey & Company", "mckinsey.com", "management-consulting", "consulting",
    "The global leader in management consulting",
    "McKinsey & Company is the world's most prestigious management consulting firm, advising the leading businesses, governments, and institutions on their most important strategic and operational challenges.",
    1926, "New York", "US", "1000+", "https://www.linkedin.com/company/mckinsey")
add("Boston Consulting Group", "bcg.com", "management-consulting", "consulting",
    "Unlocking the potential of those who advance the world",
    "Boston Consulting Group (BCG) is a leading global strategy consulting firm partnering with clients across the private, public, and social sectors to drive transformation and competitive advantage.",
    1963, "Boston", "US", "1000+", "https://www.linkedin.com/company/boston-consulting-group")
add("Bain & Company", "bain.com", "management-consulting", "consulting",
    "Results, not reports — global strategy and management consulting",
    "Bain & Company is a top-tier global management consultancy known for a results-oriented approach, advising executives on strategy, operations, M&A, and transformation.",
    1973, "Boston", "US", "1000+", "https://www.linkedin.com/company/bain-and-company")
add("Accenture", "accenture.com", "management-consulting", "consulting",
    "Strategy, consulting, technology, and operations at global scale",
    "Accenture is a global professional services leader spanning strategy & consulting, technology, and operations, helping the world's largest organizations transform and run their businesses.",
    1989, "Dublin", "IE", "1000+", "https://www.linkedin.com/company/accenture")
add("Oliver Wyman", "oliverwyman.com", "management-consulting", "consulting",
    "Specialist strategy and risk consulting with deep industry expertise",
    "Oliver Wyman is a global management consulting firm combining deep industry knowledge with specialized expertise in strategy, operations, risk management, and organizational transformation.",
    1984, "New York", "US", "1000+", "https://www.linkedin.com/company/oliver-wyman")
add("Kearney", "kearney.com", "management-consulting", "consulting",
    "Global management consulting partners in strategy and operations",
    "Kearney is a leading global management consulting firm advising the majority of the Fortune 500 on strategy, operations, transformation, and analytics.",
    1926, "Chicago", "US", "1000+", "https://www.linkedin.com/company/kearney")
add("L.E.K. Consulting", "lek.com", "management-consulting", "consulting",
    "Strategy consulting with a sharp analytical edge",
    "L.E.K. Consulting is a global strategy consultancy advising clients on growth strategy, M&A, and performance improvement, with particular depth in life sciences and consumer sectors.",
    1983, "Boston", "US", "1000+", "https://www.linkedin.com/company/l-e-k--consulting")
add("West Monroe", "westmonroe.com", "management-consulting", "consulting",
    "Digital-first management and technology consulting",
    "West Monroe is a digital services firm that blends management consulting with deep technology expertise to help companies transform operations and accelerate growth.",
    2002, "Chicago", "US", "1000+", "https://www.linkedin.com/company/west-monroe")
add("Simon-Kucher", "simon-kucher.com", "management-consulting", "consulting",
    "The world's leading pricing and growth consultancy",
    "Simon-Kucher is a global consultancy specializing in pricing, monetization, sales, and growth strategy, helping companies unlock better commercial performance.",
    1985, "Bonn", "DE", "1000+", "https://www.linkedin.com/company/simon-kucher-&-partners")
add("ZS Associates", "zs.com", "industry-specific", "consulting",
    "Management consulting and analytics powering commercial performance",
    "ZS is a management consulting and professional services firm focused on transforming go-to-market and commercial strategy through analytics, technology, and deep industry expertise.",
    1983, "Evanston", "US", "1000+", "https://www.linkedin.com/company/zs-associates")
add("FTI Consulting", "fticonsulting.com", "financial-m-a-advisory", "consulting",
    "Business advisory for critical, complex, and high-stakes situations",
    "FTI Consulting is a global business advisory firm helping organizations manage change, mitigate risk, and resolve disputes across finance, restructuring, economics, and forensic matters.",
    1982, "Washington", "US", "1000+", "https://www.linkedin.com/company/fti-consulting")
add("AlixPartners", "alixpartners.com", "financial-m-a-advisory", "consulting",
    "When it really matters — performance improvement and turnaround",
    "AlixPartners is a results-driven global consulting firm specializing in turnaround and restructuring, performance improvement, and high-impact situations where outcomes matter most.",
    1981, "New York", "US", "1000+", "https://www.linkedin.com/company/alixpartners")
add("Alvarez & Marsal", "alvarezandmarsal.com", "financial-m-a-advisory", "consulting",
    "Leadership, action, results — restructuring and performance advisory",
    "Alvarez & Marsal is a global professional services firm known for turnaround and restructuring, performance improvement, disputes, taxation, and corporate transformation.",
    1983, "New York", "US", "1000+", "https://www.linkedin.com/company/alvarez-&-marsal")

# ── Financial Advisory & Planning (9) ──
add("Fisher Investments", "fisherinvestments.com", "wealth-management", "financial",
    "Fee-only investment management and wealth planning",
    "Fisher Investments is a fee-only investment adviser serving individuals and institutions worldwide with personalized portfolio management and comprehensive financial planning.",
    1979, "Camas", "US", "1000+", "https://www.linkedin.com/company/fisher-investments")
add("Edward Jones", "edwardjones.com", "financial-planning", "financial",
    "Personalized financial advice from local advisors",
    "Edward Jones is a financial services firm built around local financial advisors who provide personalized investment and planning advice to millions of individual clients.",
    1922, "St. Louis", "US", "1000+", "https://www.linkedin.com/company/edward-jones")
add("Charles Schwab", "schwab.com", "investment-advisory", "financial",
    "Investing, advice, and wealth management for everyone",
    "Charles Schwab is a leading brokerage and wealth management firm offering investing, advice, banking, and financial planning to individual investors and advisors.",
    1971, "Westlake", "US", "1000+", "https://www.linkedin.com/company/charles-schwab")
add("Fidelity Investments", "fidelity.com", "investment-advisory", "financial",
    "Investing, retirement, and wealth management",
    "Fidelity Investments is one of the largest financial services firms in the world, providing investment management, retirement planning, brokerage, and wealth management services.",
    1946, "Boston", "US", "1000+", "https://www.linkedin.com/company/fidelity-investments")
add("Vanguard", "vanguard.com", "investment-advisory", "financial",
    "Low-cost investing owned by its investors",
    "Vanguard is a leading investment management company known for low-cost index funds and ETFs, advice, and retirement services, structured to be owned by its fund shareholders.",
    1975, "Malvern", "US", "1000+", "https://www.linkedin.com/company/vanguard")
add("Mercer", "mercer.com", "retirement-planning", "financial",
    "Health, wealth, and retirement advisory",
    "Mercer is a global leader in redefining the world of work, reshaping retirement and investment outcomes, and unlocking health and wellbeing for employees and organizations.",
    1945, "New York", "US", "1000+", "https://www.linkedin.com/company/mercer")
add("Wealthfront", "wealthfront.com", "wealth-management", "financial",
    "Automated investing and high-yield cash, built for the long term",
    "Wealthfront is a leading automated investment service (robo-advisor) offering diversified portfolios, high-yield cash, and financial planning through software with low fees.",
    2008, "Palo Alto", "US", "201-500", "https://www.linkedin.com/company/wealthfront")
add("Betterment", "betterment.com", "wealth-management", "financial",
    "Smart money management — automated investing and advice",
    "Betterment is a pioneering robo-advisor that delivers automated, goals-based investing, retirement accounts, and access to human advice with low, transparent fees.",
    2008, "New York", "US", "201-500", "https://www.linkedin.com/company/betterment")
add("Empower", "empower.com", "wealth-management", "financial",
    "Retirement, wealth management, and financial planning",
    "Empower is a leading retirement and wealth management provider, offering planning tools, advisory services, and one of the largest retirement plan platforms in the US.",
    2014, "Greenwood Village", "US", "1000+", "https://www.linkedin.com/company/empower-retirement")

# ── HR, Staffing & Recruiting (11) ──
add("Robert Half", "roberthalf.com", "staffing-agencies-pro", "hr",
    "The world's first and largest specialized talent solutions firm",
    "Robert Half is the world's first and largest specialized talent solutions firm, placing skilled professionals in finance, accounting, technology, legal, and administrative roles, and parent of consultancy Protiviti.",
    1948, "Menlo Park", "US", "1000+", "https://www.linkedin.com/company/robert-half-international")
add("Randstad", "randstad.com", "staffing-agencies-pro", "hr",
    "Partner for talent — global staffing and HR services",
    "Randstad is one of the world's largest talent and HR services providers, connecting people with work across staffing, recruitment, and workforce solutions in dozens of countries.",
    1960, "Diemen", "NL", "1000+", "https://www.linkedin.com/company/randstad")
add("Adecco", "adecco.com", "staffing-agencies-pro", "hr",
    "Making the future work for everyone — global staffing",
    "Adecco is a leading global staffing and workforce solutions provider, part of the Adecco Group, placing temporary and permanent talent across industries worldwide.",
    1996, "Zurich", "CH", "1000+", "https://www.linkedin.com/company/adecco")
add("ManpowerGroup", "manpowergroup.com", "staffing-agencies-pro", "hr",
    "Workforce solutions and staffing at global scale",
    "ManpowerGroup is a world leader in workforce solutions, providing staffing, recruitment, and talent management through its Manpower, Experis, and Talent Solutions brands.",
    1948, "Milwaukee", "US", "1000+", "https://www.linkedin.com/company/manpowergroup")
add("Hays", "hays.com", "staffing-agencies-pro", "hr",
    "Specialist recruitment across professional sectors",
    "Hays is a leading global specialist recruitment firm, placing qualified professionals into permanent, contract, and temporary roles across technology, finance, and other sectors.",
    1968, "London", "GB", "1000+", "https://www.linkedin.com/company/hays")
add("Michael Page", "michaelpage.com", "staffing-agencies-pro", "hr",
    "Specialist recruitment for permanent, contract, and temporary roles",
    "Michael Page, part of PageGroup, is a global specialist recruitment consultancy connecting qualified candidates with employers across finance, technology, engineering, and more.",
    1976, "London", "GB", "1000+", "https://www.linkedin.com/company/michael-page")
add("Korn Ferry", "kornferry.com", "executive-search", "hr",
    "Organizational consulting and executive search",
    "Korn Ferry is a global organizational consulting firm best known for executive search, leadership development, and talent and rewards advisory.",
    1969, "Los Angeles", "US", "1000+", "https://www.linkedin.com/company/korn-ferry")
add("Heidrick & Struggles", "heidrick.com", "executive-search", "hr",
    "Executive search and leadership advisory",
    "Heidrick & Struggles is a premier executive search and leadership advisory firm helping organizations build winning leadership teams and cultures.",
    1953, "Chicago", "US", "1000+", "https://www.linkedin.com/company/heidrick-&-struggles")
add("Spencer Stuart", "spencerstuart.com", "executive-search", "hr",
    "Senior leadership and board advisory and search",
    "Spencer Stuart is a leading global executive search and leadership advisory firm specializing in senior-level appointments, board services, and leadership consulting.",
    1956, "Chicago", "US", "1000+", "https://www.linkedin.com/company/spencer-stuart")
add("Egon Zehnder", "egonzehnder.com", "executive-search", "hr",
    "Leadership advisory and executive search, partnership-owned",
    "Egon Zehnder is a global leadership advisory and executive search firm, privately partnership-owned, advising the world's most respected organizations on leadership.",
    1964, "Zurich", "CH", "1000+", "https://www.linkedin.com/company/egon-zehnder")
add("Russell Reynolds", "russellreynolds.com", "executive-search", "hr",
    "Leadership advisory and senior executive search",
    "Russell Reynolds Associates is a global leadership advisory firm specializing in executive search, board and CEO succession, and leadership assessment.",
    1969, "New York", "US", "1000+", "https://www.linkedin.com/company/russell-reynolds-associates")

# ── Marketing, Advertising & Communications (13) ──
add("Ogilvy", "ogilvy.com", "advertising-agencies-pro", "marketing",
    "Borderless creativity — advertising, PR, and brand",
    "Ogilvy is one of the world's most celebrated creative networks, delivering advertising, brand strategy, PR, and experience design for global brands.",
    1948, "New York", "US", "1000+", "https://www.linkedin.com/company/ogilvy")
add("WPP", "wpp.com", "full-service-marketing", "marketing",
    "The world's largest marketing and communications group",
    "WPP is the world's largest advertising and marketing services group, home to leading agencies across creative, media, PR, and data-driven marketing.",
    1985, "London", "GB", "1000+", "https://www.linkedin.com/company/wpp")
add("Publicis Groupe", "publicisgroupe.com", "full-service-marketing", "marketing",
    "Marketing, media, and data transformation at scale",
    "Publicis Groupe is one of the world's largest communications groups, combining creative, media, data, and technology to drive marketing transformation for global clients.",
    1926, "Paris", "FR", "1000+", "https://www.linkedin.com/company/publicis-groupe")
add("Omnicom Group", "omnicomgroup.com", "full-service-marketing", "marketing",
    "Global advertising, marketing, and corporate communications",
    "Omnicom Group is a leading global marketing and corporate communications holding company, home to advertising, media, PR, and specialty agencies worldwide.",
    1986, "New York", "US", "1000+", "https://www.linkedin.com/company/omnicom-group")
add("Dentsu", "dentsu.com", "full-service-marketing", "marketing",
    "Integrated creative, media, and CXM",
    "Dentsu is a global marketing and advertising network spanning media, creative, and customer experience management, helping brands grow across markets.",
    1901, "Tokyo", "JP", "1000+", "https://www.linkedin.com/company/dentsu")
add("BBDO", "bbdo.com", "advertising-agencies-pro", "marketing",
    "The work, the work, the work — creative advertising",
    "BBDO is one of the world's most awarded advertising agency networks, known for powerful creative ideas and integrated campaigns for the world's biggest brands.",
    1891, "New York", "US", "1000+", "https://www.linkedin.com/company/bbdo")
add("Edelman", "edelman.com", "public-relations-pro", "marketing",
    "The global communications and PR leader built on trust",
    "Edelman is the world's largest independent public relations and communications firm, advising organizations on reputation, brand, and stakeholder trust.",
    1952, "Chicago", "US", "1000+", "https://www.linkedin.com/company/edelman")
add("Weber Shandwick", "webershandwick.com", "public-relations-pro", "marketing",
    "Earned-first communications and reputation",
    "Weber Shandwick is a leading global communications and PR firm specializing in reputation, brand, and earned-media-led campaigns.",
    2001, "New York", "US", "1000+", "https://www.linkedin.com/company/weber-shandwick")
add("Interbrand", "interbrand.com", "branding-design", "marketing",
    "The world's leading brand consultancy",
    "Interbrand is a pioneering global brand consultancy, known for Best Global Brands, helping organizations build and grow valuable, iconic brands.",
    1974, "New York", "US", "501-1000", "https://www.linkedin.com/company/interbrand")
add("Landor", "landor.com", "branding-design", "marketing",
    "Brand transformation, identity, and design",
    "Landor is a world-leading brand and design consultancy helping clients create distinctive brand identities, strategies, and experiences.",
    1941, "London", "GB", "1000+", "https://www.linkedin.com/company/landor")
add("Nielsen", "nielsen.com", "market-research", "marketing",
    "The global standard for audience measurement",
    "Nielsen is a global leader in audience measurement, data, and analytics, shaping how media and marketers understand what people watch and buy.",
    1923, "New York", "US", "1000+", "https://www.linkedin.com/company/nielsen")
add("Ipsos", "ipsos.com", "market-research", "marketing",
    "Game changers in market research and insight",
    "Ipsos is one of the world's largest market research and insights firms, delivering data and analysis on markets, brands, society, and people across the globe.",
    1975, "Paris", "FR", "1000+", "https://www.linkedin.com/company/ipsos")
add("Kantar", "kantar.com", "market-research", "marketing",
    "The world's leading marketing data and analytics company",
    "Kantar is a global leader in marketing data, brand, and consumer insights, helping clients understand audiences and grow their brands.",
    1992, "London", "GB", "1000+", "https://www.linkedin.com/company/kantar")

# ── Legal Services (15) ──
add("Latham & Watkins", "lw.com", "business-law", "legal",
    "A leading global law firm across corporate, finance, and litigation",
    "Latham & Watkins is one of the world's largest and most prestigious law firms, advising on landmark M&A, capital markets, finance, and litigation matters globally.",
    1934, "Los Angeles", "US", "1000+", "https://www.linkedin.com/company/latham-&-watkins")
add("Kirkland & Ellis", "kirkland.com", "business-law", "legal",
    "Global leader in private equity, M&A, and disputes",
    "Kirkland & Ellis is one of the world's largest law firms by revenue, renowned for private equity, M&A, restructuring, and high-stakes litigation.",
    1909, "Chicago", "US", "1000+", "https://www.linkedin.com/company/kirkland-&-ellis-llp")
add("Skadden", "skadden.com", "business-law", "legal",
    "Elite counsel for M&A, litigation, and regulatory matters",
    "Skadden, Arps is a premier global law firm advising on many of the world's most significant M&A transactions, litigations, and regulatory matters.",
    1948, "New York", "US", "1000+", "https://www.linkedin.com/company/skadden")
add("Paul, Weiss", "paulweiss.com", "business-law", "legal",
    "Leading litigation, corporate, and restructuring counsel",
    "Paul, Weiss is a top-tier law firm known for high-profile litigation, M&A, private equity, and restructuring work for the world's leading companies and institutions.",
    1875, "New York", "US", "1000+", "https://www.linkedin.com/company/paul-weiss")
add("Davis Polk", "davispolk.com", "business-law", "legal",
    "Premier corporate, finance, and litigation counsel",
    "Davis Polk & Wardwell is an elite global law firm advising on the most complex capital markets, M&A, finance, and litigation matters.",
    1849, "New York", "US", "1000+", "https://www.linkedin.com/company/davis-polk-&-wardwell-llp")
add("Cravath", "cravath.com", "business-law", "legal",
    "One of the most prestigious firms in corporate law",
    "Cravath, Swaine & Moore is one of the most prestigious US law firms, advising leading businesses on M&A, capital markets, and bet-the-company litigation.",
    1819, "New York", "US", "501-1000", "https://www.linkedin.com/company/cravath-swaine-&-moore-llp")
add("Sullivan & Cromwell", "sullcrom.com", "business-law", "legal",
    "Global corporate, finance, and litigation counsel",
    "Sullivan & Cromwell is a leading global law firm advising on major M&A, capital markets, financing, and litigation matters across industries and borders.",
    1879, "New York", "US", "1000+", "https://www.linkedin.com/company/sullivan-&-cromwell-llp")
add("Cooley", "cooley.com", "business-law", "legal",
    "The law firm for the tech and life sciences economy",
    "Cooley is a leading law firm for high-growth technology and life sciences companies, advising on venture financings, IPOs, M&A, and IP.",
    1920, "Palo Alto", "US", "1000+", "https://www.linkedin.com/company/cooley-llp")
add("Wilson Sonsini", "wsgr.com", "business-law", "legal",
    "The premier legal advisor to technology and growth companies",
    "Wilson Sonsini Goodrich & Rosati is the premier law firm for technology, life sciences, and growth enterprises, advising on financings, M&A, and IPOs.",
    1961, "Palo Alto", "US", "1000+", "https://www.linkedin.com/company/wilson-sonsini-goodrich-&-rosati")
add("DLA Piper", "dlapiper.com", "business-law", "legal",
    "A global law firm spanning 40+ countries",
    "DLA Piper is one of the world's largest law firms, providing corporate, finance, litigation, IP, and regulatory services across the Americas, Europe, Asia, and the Middle East.",
    2005, "London", "GB", "1000+", "https://www.linkedin.com/company/dla-piper")
add("Baker McKenzie", "bakermckenzie.com", "business-law", "legal",
    "A truly global law firm born to be borderless",
    "Baker McKenzie is one of the world's largest law firms by headcount and footprint, advising multinational clients across corporate, tax, disputes, and regulatory matters.",
    1949, "Chicago", "US", "1000+", "https://www.linkedin.com/company/baker-&-mckenzie")
add("Jones Day", "jonesday.com", "business-law", "legal",
    "One firm worldwide — corporate, disputes, and regulatory",
    "Jones Day is one of the world's largest law firms, known for a 'one firm' culture serving clients across M&A, litigation, and regulatory matters globally.",
    1893, "Cleveland", "US", "1000+", "https://www.linkedin.com/company/jones-day")
add("Morgan Lewis", "morganlewis.com", "employment-law", "legal",
    "Global counsel across labor, corporate, finance, and litigation",
    "Morgan, Lewis & Bockius is a leading global law firm with particular strength in labor & employment, corporate, finance, litigation, and regulatory matters.",
    1873, "Philadelphia", "US", "1000+", "https://www.linkedin.com/company/morgan-lewis-&-bockius-llp")
add("Fragomen", "fragomen.com", "immigration", "legal",
    "The world's leading immigration services firm",
    "Fragomen is the world's leading provider of immigration legal services, advising corporations and individuals on global mobility and immigration compliance.",
    1951, "New York", "US", "1000+", "https://www.linkedin.com/company/fragomen")
add("Fish & Richardson", "fr.com", "intellectual-property", "legal",
    "The #1 patent litigation and IP firm",
    "Fish & Richardson is a leading intellectual property law firm, consistently ranked at the top for patent litigation, patent prosecution, and IP strategy.",
    1878, "Boston", "US", "501-1000", "https://www.linkedin.com/company/fish-&-richardson")

# ── Real Estate Professional Services (6) ──
add("CBRE", "cbre.com", "real-estate-professional-services", "realestate",
    "The world's largest commercial real estate services firm",
    "CBRE is the world's largest commercial real estate services and investment firm, offering leasing, capital markets, property management, and advisory across the globe.",
    1906, "Dallas", "US", "1000+", "https://www.linkedin.com/company/cbre")
add("JLL", "jll.com", "real-estate-professional-services", "realestate",
    "Commercial real estate, investment management, and advisory",
    "JLL (Jones Lang LaSalle) is a leading global commercial real estate and investment management firm offering leasing, capital markets, and property services worldwide.",
    1999, "Chicago", "US", "1000+", "https://www.linkedin.com/company/jll")
add("Cushman & Wakefield", "cushmanwakefield.com", "real-estate-professional-services", "realestate",
    "Global commercial real estate services",
    "Cushman & Wakefield is a leading global commercial real estate services firm delivering leasing, capital markets, valuation, and property management.",
    1917, "Chicago", "US", "1000+", "https://www.linkedin.com/company/cushman-&-wakefield")
add("Colliers", "colliers.com", "real-estate-professional-services", "realestate",
    "Accelerating success in commercial real estate",
    "Colliers is a leading diversified professional services and investment management company specializing in commercial real estate advisory worldwide.",
    1976, "Toronto", "CA", "1000+", "https://www.linkedin.com/company/colliers")
add("Newmark", "nmrk.com", "real-estate-professional-services", "realestate",
    "Commercial real estate advisory and capital markets",
    "Newmark is a leading commercial real estate advisor and services firm, with deep capital markets, leasing, and advisory capabilities across the US and globally.",
    1929, "New York", "US", "1000+", "https://www.linkedin.com/company/newmark")
add("Savills", "savills.com", "real-estate-professional-services", "realestate",
    "Global real estate advisory with local expertise",
    "Savills is a global real estate services provider offering advisory, transactions, valuation, and property management across residential and commercial markets.",
    1855, "London", "GB", "1000+", "https://www.linkedin.com/company/savills")

# ── Insurance Professional Services (7) ──
add("Marsh", "marsh.com", "insurance-professional-services", "insurance",
    "The world's leading insurance broker and risk advisor",
    "Marsh is the world's leading insurance broker and risk advisor, helping clients manage risk, place insurance, and navigate complex exposures across industries.",
    1871, "New York", "US", "1000+", "https://www.linkedin.com/company/marsh")
add("Aon", "aon.com", "insurance-professional-services", "insurance",
    "Risk, retirement, and health solutions worldwide",
    "Aon is a leading global professional services firm providing risk, reinsurance, retirement, and health advisory and brokerage solutions.",
    1982, "London", "GB", "1000+", "https://www.linkedin.com/company/aon")
add("WTW", "wtwco.com", "insurance-professional-services", "insurance",
    "Risk, broking, and human capital advisory",
    "WTW (Willis Towers Watson) is a leading global advisory, broking, and solutions company in risk management, insurance broking, and human capital and benefits.",
    1828, "London", "GB", "1000+", "https://www.linkedin.com/company/willis-towers-watson")
add("Arthur J. Gallagher", "ajg.com", "insurance-professional-services", "insurance",
    "Insurance brokerage, risk management, and consulting",
    "Arthur J. Gallagher is a global insurance brokerage and risk management services firm helping clients manage risk and design benefits programs.",
    1927, "Rolling Meadows", "US", "1000+", "https://www.linkedin.com/company/gallagher")
add("Lockton", "lockton.com", "insurance-professional-services", "insurance",
    "The world's largest privately held insurance broker",
    "Lockton is the world's largest privately held independent insurance brokerage, delivering risk management, insurance, and employee benefits solutions.",
    1966, "Kansas City", "US", "1000+", "https://www.linkedin.com/company/lockton-companies")
add("HUB International", "hubinternational.com", "insurance-professional-services", "insurance",
    "Insurance brokerage and risk services across North America",
    "HUB International is a leading global insurance brokerage providing property & casualty, employee benefits, and personal insurance and risk services.",
    1998, "Chicago", "US", "1000+", "https://www.linkedin.com/company/hub-international")
add("Embroker", "embroker.com", "insurance-professional-services", "insurance",
    "Business insurance built for startups and modern companies",
    "Embroker is a digital business insurance platform that makes it easy for startups and growing companies to buy and manage tailored commercial insurance online.",
    2015, "San Francisco", "US", "201-500", "https://www.linkedin.com/company/embroker")

# ── Investment Banking & Capital Markets (8) ──
add("Goldman Sachs", "goldmansachs.com", "investment-banking-capital-markets", "ib",
    "A leading global investment bank and financial institution",
    "Goldman Sachs is a leading global investment banking, securities, and investment management firm advising on M&A, capital raising, and markets worldwide.",
    1869, "New York", "US", "1000+", "https://www.linkedin.com/company/goldman-sachs")
add("Morgan Stanley", "morganstanley.com", "investment-banking-capital-markets", "ib",
    "Global investment banking, wealth, and investment management",
    "Morgan Stanley is a leading global financial services firm providing investment banking, securities, wealth management, and investment management.",
    1935, "New York", "US", "1000+", "https://www.linkedin.com/company/morgan-stanley")
add("Lazard", "lazard.com", "investment-banking-capital-markets", "ib",
    "Premier independent financial and asset management advisory",
    "Lazard is one of the world's preeminent independent financial advisory and asset management firms, advising on M&A, restructuring, and capital markets.",
    1848, "New York", "US", "1000+", "https://www.linkedin.com/company/lazard")
add("Evercore", "evercore.com", "investment-banking-capital-markets", "ib",
    "Independent advisory-led investment banking",
    "Evercore is a leading independent investment banking advisory firm, advising clients on M&A, strategic matters, restructuring, and capital markets.",
    1995, "New York", "US", "1000+", "https://www.linkedin.com/company/evercore")
add("Moelis & Company", "moelis.com", "investment-banking-capital-markets", "ib",
    "Global independent investment bank",
    "Moelis & Company is a leading global independent investment bank providing M&A, recapitalization, restructuring, and other strategic advisory services.",
    2007, "New York", "US", "1000+", "https://www.linkedin.com/company/moelis-&-company")
add("Houlihan Lokey", "hl.com", "investment-banking-capital-markets", "ib",
    "Global leader in M&A, restructuring, and valuations",
    "Houlihan Lokey is a global investment bank and the leading advisor on restructuring and financial valuations, with deep M&A and capital markets expertise.",
    1972, "Los Angeles", "US", "1000+", "https://www.linkedin.com/company/houlihan-lokey")
add("Jefferies", "jefferies.com", "investment-banking-capital-markets", "ib",
    "A leading global full-service investment bank",
    "Jefferies is a leading global, full-service investment banking and capital markets firm providing advisory, underwriting, and markets services.",
    1962, "New York", "US", "1000+", "https://www.linkedin.com/company/jefferies")
add("Rothschild & Co", "rothschildandco.com", "investment-banking-capital-markets", "ib",
    "Global financial advisory and wealth management",
    "Rothschild & Co is a global financial advisory group providing M&A, strategic, and financing advice alongside wealth and asset management.",
    1838, "Paris", "FR", "1000+", "https://www.linkedin.com/company/rothschild-&-co")

# ── Architecture, Engineering & Design (5) ──
add("Gensler", "gensler.com", "architecture-engineering-design", "architecture",
    "The world's largest architecture and design firm",
    "Gensler is the world's largest architecture, design, and planning firm, shaping workplaces, cities, and experiences across more than 30 practice areas.",
    1965, "San Francisco", "US", "1000+", "https://www.linkedin.com/company/gensler")
add("AECOM", "aecom.com", "architecture-engineering-design", "architecture",
    "Global infrastructure consulting — design and engineering",
    "AECOM is a global infrastructure consulting firm delivering professional services across architecture, engineering, planning, and program management.",
    1990, "Dallas", "US", "1000+", "https://www.linkedin.com/company/aecom")
add("Jacobs", "jacobs.com", "architecture-engineering-design", "architecture",
    "Challenging today, reinventing tomorrow — engineering and design",
    "Jacobs is a leading global professional services firm providing engineering, design, consulting, and technical solutions for infrastructure and advanced facilities.",
    1947, "Dallas", "US", "1000+", "https://www.linkedin.com/company/jacobs")
add("Perkins&Will", "perkinswill.com", "architecture-engineering-design", "architecture",
    "Architecture and design with a focus on sustainability",
    "Perkins&Will is a leading global architecture and design firm known for sustainable, human-centered design across workplace, healthcare, and education.",
    1935, "Chicago", "US", "1000+", "https://www.linkedin.com/company/perkins&will")
add("Arup", "arup.com", "architecture-engineering-design", "architecture",
    "The creative force at the heart of the built environment",
    "Arup is a global firm of designers, engineers, and consultants delivering engineering, design, planning, and advisory for the built environment.",
    1946, "London", "GB", "1000+", "https://www.linkedin.com/company/arup")


def slugify(name):
    s = name.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return s


PHONE = {"US": "+1", "CA": "+1", "GB": "+44", "DE": "+49", "FR": "+33", "AU": "+61",
         "IN": "+91", "JP": "+81", "NL": "+31", "CH": "+41", "IE": "+353"}

# ─── Build SQL ────────────────────────────────────────────────────────────────
slugs = [slugify(r["name"]) for r in L]
assert len(slugs) == len(set(slugs)), "duplicate slug detected"

out = []
out.append("-- ============================================================")
out.append("-- InfoWebWorld — Professional Services 100-listing seed batch")
out.append("--")
out.append(f"-- {len(L)} real Professional Services firms, every renderable section")
out.append("-- populated (services/key features, industries, use cases, company")
out.append("-- sizes, pros, cons, support, training, FAQs, header tags, pricing")
out.append("-- model, languages). Pricing tiers / starting price / integrations /")
out.append("-- compliance / awards are left NULL (not published / not applicable")
out.append("-- for these firms) and render as empty-state, same as the AI/ML seed.")
out.append("--")
out.append("-- Logo = Google favicon API. Screenshots come from")
out.append("-- scripts/capture-screenshots.mjs after this SQL is loaded.")
out.append("-- All rows: status='active', payment_status='completed', user_id=NULL")
out.append("-- (live + claimable). Re-runnable: deletes its own slugs first.")
out.append("-- Run in phpMyAdmin → SQL tab.")
out.append("-- ============================================================")
out.append("")
out.append("SET @free_plan := (SELECT id FROM plans WHERE is_active = 1 ORDER BY price ASC LIMIT 1);")
out.append("SET @fallback_country := (SELECT id FROM countries WHERE code = 'US' LIMIT 1);")
out.append("")
out.append("DELETE FROM submissions WHERE slug IN (")
quoted = ["'" + s + "'" for s in slugs]
for i in range(0, len(quoted), 6):
    chunk = ", ".join(quoted[i:i + 6])
    suffix = "" if i + 6 >= len(quoted) else ","
    out.append("  " + chunk + suffix)
out.append(");")
out.append("")

for i, r in enumerate(L, 1):
    name = r["name"]
    domain = r["domain"]
    slug = slugify(name)
    v = r["vert"]
    t = VERT[v]
    contact = f"{name} Team"
    email = f"info@{domain}"
    website = f"https://www.{domain}"
    country = r["country"]
    city = r["city"]
    hq = f"{city}, {country}"
    phone_code = PHONE.get(country, "+1")
    logo = f"https://www.google.com/s2/favicons?domain={domain}&sz=256"

    out.append(f"-- {i}/{len(L)}  {name}")
    out.append("INSERT INTO submissions (")
    out.append("  uuid, company_name, slug, contact_name, email, phone_code, website,")
    out.append("  category_id, country_id, city, hq_location,")
    out.append("  tagline, description, logo_url, founded_year, team_size,")
    out.append("  linkedin, listing_mode, pricing_model,")
    out.append("  key_features, features, header_tags, pros, cons,")
    out.append("  industries_served, use_cases, target_company_sizes,")
    out.append("  support_channels, training_options, languages, faqs,")
    out.append("  has_free_trial, has_free_version, has_ios_app, has_android_app,")
    out.append("  status, payment_status, plan_id,")
    out.append("  activated_at, approved_at, created_at, updated_at")
    out.append(")")
    out.append("SELECT")
    out.append(f"  UUID(), {sq(name)}, {sq(slug)}, {sq(contact)}, {sq(email)}, {sq(phone_code)}, {sq(website)},")
    out.append(f"  (SELECT id FROM categories WHERE slug = {sq(r['cat'])} LIMIT 1),")
    out.append(f"  COALESCE((SELECT id FROM countries WHERE code = {sq(country)} LIMIT 1), @fallback_country),")
    out.append(f"  {sq(city)}, {sq(hq)},")
    out.append(f"  {sq(r['tagline'])},")
    out.append(f"  {sq(r['description'])},")
    out.append(f"  {sq(logo)}, {num(r['founded'])}, {sq(r['team'])},")
    out.append(f"  {sq(r['linkedin'])}, 'product', {sq(t['pricing_model'])},")
    out.append(f"  {jobjs(t['key_features'])},")
    out.append(f"  {jarr(t['features'])},")
    out.append(f"  {jarr(t['header_tags'])},")
    out.append(f"  {jarr(t['pros'])},")
    out.append(f"  {jarr(t['cons'])},")
    out.append(f"  {jarr(t['industries'])},")
    out.append(f"  {jarr(t['use_cases'])},")
    out.append(f"  {jarr(t['sizes'])},")
    out.append(f"  {jarr(t['support'])},")
    out.append(f"  {jarr(t['training'])},")
    out.append(f"  {jarr(t['languages'])},")
    out.append(f"  {jobjs(faqs_for(name, v))},")
    out.append("  0, 0, 0, 0,")
    out.append("  'active', 'completed', @free_plan,")
    out.append("  NOW(), NOW(), NOW(), NOW();")
    out.append("")

out.append("-- ============================================================")
out.append(f"-- {len(L)} listings inserted.")
out.append("-- Next: run  node scripts/capture-screenshots.mjs  to populate")
out.append("-- the screenshots column for each new listing.")
out.append("-- ============================================================")

SQL_OUT.parent.mkdir(parents=True, exist_ok=True)
SQL_OUT.write_text("\n".join(out), encoding="utf-8")
print(f"Wrote {SQL_OUT}  ({SQL_OUT.stat().st_size:,} bytes, {len(L)} listings)")
