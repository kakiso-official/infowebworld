-- ============================================================
-- InfoWebWorld — Categories V2 Seed Data
-- Run AFTER migration-categories-v2.sql
-- Sets existing 16 rows to L2, inserts 6 L1 sectors + 44 L2 categories
-- ============================================================

-- ============================================================
-- STEP 1: Mark existing 16 categories as level=2
-- ============================================================

UPDATE `categories` SET `level` = 2 WHERE `level` != 2 OR `level` IS NULL;


-- ============================================================
-- STEP 2: Insert 6 L1 Sectors
-- ============================================================

INSERT IGNORE INTO `categories`
  (`name`, `slug`, `color`, `level`, `parent_id`, `is_active`, `is_launched`, `sort_order`, `description`)
VALUES
  ('Artificial Intelligence & ML', 'artificial-intelligence-ml', '#4361EE', 1, NULL, 1, 0, 100,
   'AI-powered tools, platforms, and services spanning machine learning, NLP, computer vision, and intelligent automation.'),

  ('Software & SaaS', 'software-saas', '#3B82F6', 1, NULL, 1, 0, 200,
   'Cloud-based software products and SaaS platforms for every business function from CRM to DevOps.'),

  ('IT Services & Agencies', 'it-services-agencies', '#14B8A6', 1, NULL, 1, 0, 300,
   'Professional technology service providers, digital agencies, and IT consulting firms.'),

  ('Startups & Innovation', 'startups-innovation', '#8B5CF6', 1, NULL, 1, 0, 400,
   'Early-stage startups, accelerators, and innovation-driven companies disrupting traditional industries.'),

  ('Local & Professional Services', 'local-professional-services', '#F59E0B', 1, NULL, 1, 0, 500,
   'Local businesses and professional service providers serving communities and individual clients.'),

  ('Industry-Specific Software', 'industry-specific-software', '#2FAE6A', 1, NULL, 1, 0, 600,
   'Vertical software solutions purpose-built for specific industries like healthcare, real estate, and construction.');


-- ============================================================
-- STEP 3: Insert 44 L2 Categories (grouped by sector)
-- Uses INSERT IGNORE to skip any slug conflicts with existing rows.
-- parent_id set via subquery on the sector slug.
-- ============================================================

-- ── Artificial Intelligence & ML (7) ──

INSERT IGNORE INTO `categories`
  (`name`, `slug`, `color`, `level`, `parent_id`, `is_active`, `is_launched`, `sort_order`, `description`)
VALUES
  ('AI Assistants & Chatbots', 'ai-assistants-chatbots', '#6C72F1', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'artificial-intelligence-ml'), 1, 0, 101,
   'Conversational AI, virtual assistants, and chatbot platforms for customer engagement and productivity.'),

  ('AI Content Creation', 'ai-content-creation', '#EC4899', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'artificial-intelligence-ml'), 1, 0, 102,
   'AI-powered writing, image generation, video creation, and multimedia content tools.'),

  ('AI Developer Tools', 'ai-developer-tools', '#14B8A6', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'artificial-intelligence-ml'), 1, 0, 103,
   'Machine learning frameworks, model training platforms, and AI development infrastructure.'),

  ('AI Data & Analytics', 'ai-data-analytics', '#3B82F6', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'artificial-intelligence-ml'), 1, 0, 104,
   'AI-driven data analysis, business intelligence, and predictive analytics platforms.'),

  ('AI for Business', 'ai-for-business', '#E8553D', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'artificial-intelligence-ml'), 1, 0, 105,
   'Enterprise AI solutions for workflow automation, decision-making, and operational efficiency.'),

  ('AI for Industry', 'ai-for-industry', '#F59E0B', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'artificial-intelligence-ml'), 1, 0, 106,
   'Vertical AI applications for healthcare, finance, manufacturing, and other specialized sectors.'),

  ('AI Safety & Ethics', 'ai-safety-ethics', '#2FAE6A', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'artificial-intelligence-ml'), 1, 0, 107,
   'Tools and platforms focused on responsible AI, bias detection, model governance, and compliance.');


-- ── Software & SaaS (11) ──

INSERT IGNORE INTO `categories`
  (`name`, `slug`, `color`, `level`, `parent_id`, `is_active`, `is_launched`, `sort_order`, `description`)
VALUES
  ('Project Management', 'project-management', '#4361EE', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'software-saas'), 1, 0, 201,
   'Task tracking, team collaboration, and project planning software for teams of all sizes.'),

  ('Communication & Collaboration', 'communication-collaboration', '#3B82F6', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'software-saas'), 1, 0, 202,
   'Messaging, video conferencing, and team communication platforms for remote and hybrid work.'),

  ('CRM & Sales', 'crm-sales', '#E8553D', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'software-saas'), 1, 0, 203,
   'Customer relationship management, sales pipelines, and lead tracking solutions.'),

  ('Marketing', 'marketing-software', '#EC4899', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'software-saas'), 1, 0, 204,
   'Email marketing, SEO, social media management, and marketing automation platforms.'),

  ('Customer Support', 'customer-support', '#14B8A6', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'software-saas'), 1, 0, 205,
   'Help desk, ticketing, live chat, and customer service management software.'),

  ('Finance & Accounting', 'finance-accounting', '#F59E0B', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'software-saas'), 1, 0, 206,
   'Invoicing, bookkeeping, expense tracking, and financial management platforms.'),

  ('HR & People', 'hr-people', '#8B5CF6', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'software-saas'), 1, 0, 207,
   'Human resources management, payroll, recruiting, and employee engagement tools.'),

  ('Development & IT', 'development-it', '#2FAE6A', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'software-saas'), 1, 0, 208,
   'Code editors, CI/CD pipelines, monitoring, and developer productivity tools.'),

  ('Design & Creative', 'design-creative', '#D4729A', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'software-saas'), 1, 0, 209,
   'Graphic design, UI/UX, prototyping, and creative suite software for designers.'),

  ('eCommerce', 'ecommerce-software', '#EF6B4A', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'software-saas'), 1, 0, 210,
   'Online store builders, shopping cart platforms, and eCommerce management solutions.'),

  ('Legal & Compliance', 'legal-compliance', '#6B7280', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'software-saas'), 1, 0, 211,
   'Contract management, compliance tracking, and legal operations software.');


-- ── IT Services & Agencies (5) ──

INSERT IGNORE INTO `categories`
  (`name`, `slug`, `color`, `level`, `parent_id`, `is_active`, `is_launched`, `sort_order`, `description`)
VALUES
  ('Software Development', 'software-development-services', '#4361EE', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'it-services-agencies'), 1, 0, 301,
   'Custom software development firms, app development studios, and offshore engineering teams.'),

  ('Digital Marketing Agencies', 'digital-marketing-agencies', '#EC4899', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'it-services-agencies'), 1, 0, 302,
   'Full-service digital marketing agencies offering SEO, PPC, content, and growth services.'),

  ('Design Agencies', 'design-agencies', '#D4729A', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'it-services-agencies'), 1, 0, 303,
   'Branding, web design, and UX/UI design agencies delivering creative solutions.'),

  ('IT Consulting', 'it-consulting', '#14B8A6', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'it-services-agencies'), 1, 0, 304,
   'Technology advisory, digital transformation, and IT strategy consulting firms.'),

  ('Managed Services', 'managed-services', '#3B82F6', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'it-services-agencies'), 1, 0, 305,
   'Managed IT infrastructure, cloud hosting, cybersecurity, and ongoing support providers.');


-- ── Startups & Innovation (2) ──

INSERT IGNORE INTO `categories`
  (`name`, `slug`, `color`, `level`, `parent_id`, `is_active`, `is_launched`, `sort_order`, `description`)
VALUES
  ('Startup Stage', 'startup-stage', '#E8553D', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'startups-innovation'), 1, 0, 401,
   'Startups organized by funding stage from pre-seed and bootstrapped to Series A and beyond.'),

  ('Startup Sector', 'startup-sector', '#8B5CF6', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'startups-innovation'), 1, 0, 402,
   'Startups grouped by industry vertical including fintech, healthtech, edtech, and more.');


-- ── Local & Professional Services (7) ──

INSERT IGNORE INTO `categories`
  (`name`, `slug`, `color`, `level`, `parent_id`, `is_active`, `is_launched`, `sort_order`, `description`)
VALUES
  ('Home Services', 'home-services-local', '#F59E0B', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'local-professional-services'), 1, 0, 501,
   'Plumbing, electrical, cleaning, landscaping, and other home maintenance service providers.'),

  ('Auto Services', 'auto-services', '#6B7280', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'local-professional-services'), 1, 0, 502,
   'Auto repair shops, detailing services, dealerships, and automotive care providers.'),

  ('Professional Services', 'professional-services', '#4361EE', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'local-professional-services'), 1, 0, 503,
   'Accountants, lawyers, consultants, and other licensed professional service firms.'),

  ('Health & Wellness', 'health-wellness', '#2FAE6A', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'local-professional-services'), 1, 0, 504,
   'Clinics, therapists, nutritionists, and wellness practitioners serving local communities.'),

  ('Food & Dining', 'food-dining', '#EF6B4A', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'local-professional-services'), 1, 0, 505,
   'Restaurants, cafes, catering services, and food delivery businesses.'),

  ('Education & Tutoring', 'education-tutoring', '#14B8A6', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'local-professional-services'), 1, 0, 506,
   'Tutoring centers, coaching institutes, online learning, and educational service providers.'),

  ('Events & Entertainment', 'events-entertainment', '#EC4899', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'local-professional-services'), 1, 0, 507,
   'Event planners, DJs, photographers, venues, and entertainment service providers.');


-- ── Industry-Specific Software (12) ──

INSERT IGNORE INTO `categories`
  (`name`, `slug`, `color`, `level`, `parent_id`, `is_active`, `is_launched`, `sort_order`, `description`)
VALUES
  ('Healthcare Software', 'healthcare-software', '#2FAE6A', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'industry-specific-software'), 1, 0, 601,
   'EHR, telemedicine, patient management, and clinical workflow software for healthcare providers.'),

  ('Real Estate Software', 'real-estate-software', '#3B82F6', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'industry-specific-software'), 1, 0, 602,
   'Property management, listing platforms, CRM, and transaction tools for real estate professionals.'),

  ('Construction Software', 'construction-software', '#F59E0B', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'industry-specific-software'), 1, 0, 603,
   'Project estimation, job costing, scheduling, and field management tools for construction firms.'),

  ('Hospitality Software', 'hospitality-software', '#EF6B4A', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'industry-specific-software'), 1, 0, 604,
   'Hotel PMS, reservation systems, guest experience, and restaurant management platforms.'),

  ('Education Software', 'education-software', '#14B8A6', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'industry-specific-software'), 1, 0, 605,
   'LMS, student information systems, virtual classrooms, and edtech platforms for institutions.'),

  ('Manufacturing Software', 'manufacturing-software', '#6B7280', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'industry-specific-software'), 1, 0, 606,
   'MES, ERP, production planning, and supply chain management for manufacturing operations.'),

  ('Logistics & Transportation', 'logistics-transportation', '#4361EE', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'industry-specific-software'), 1, 0, 607,
   'Fleet management, route optimization, warehouse management, and freight tracking solutions.'),

  ('Nonprofit Software', 'nonprofit-software', '#8B5CF6', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'industry-specific-software'), 1, 0, 608,
   'Donor management, fundraising, volunteer coordination, and grant tracking for nonprofits.'),

  ('Retail Software', 'retail-software', '#EC4899', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'industry-specific-software'), 1, 0, 609,
   'POS systems, inventory management, and omnichannel retail platforms for stores and chains.'),

  ('Agriculture Software', 'agriculture-software', '#2FAE6A', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'industry-specific-software'), 1, 0, 610,
   'Farm management, precision agriculture, crop monitoring, and agribusiness platforms.'),

  ('Fitness & Wellness Software', 'fitness-wellness-software', '#E8553D', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'industry-specific-software'), 1, 0, 611,
   'Gym management, class scheduling, member billing, and fitness tracking platforms.'),

  ('Salon & Spa Software', 'salon-spa-software', '#D4729A', 2,
   (SELECT `id` FROM `categories` WHERE `slug` = 'industry-specific-software'), 1, 0, 612,
   'Appointment booking, client management, POS, and marketing tools for salons and spas.');
