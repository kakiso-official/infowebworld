-- ============================================================
-- InfoWebWorld — IT Services & Agencies Taxonomy v2 Migration
-- Rebuilds the IT Services & Agencies sector with 485
-- hierarchical categories across 3 nested levels (DB L2..L4 under
-- existing 'it-services-agencies' L1).
--
-- Source: IT_Services_Agencies_Structure v1.xlsx
-- Run each section IN ORDER in phpMyAdmin.
-- ============================================================

-- ═══ Section A: Safety ═════════════════════════════════════════
SET FOREIGN_KEY_CHECKS = 0;

-- ═══ Section B: Disconnect existing it-services-agencies submissions ═══
-- (No-op when there are no live listings — kept for parity / future-proofing.)
UPDATE submissions
   SET category_id = NULL, listing_type_id = NULL
 WHERE category_id IN (
   SELECT id FROM (
     SELECT c.id FROM categories c
      LEFT JOIN categories p   ON p.id   = c.parent_id
      LEFT JOIN categories gp  ON gp.id  = p.parent_id
      LEFT JOIN categories ggp ON ggp.id = gp.parent_id
      WHERE c.parent_id  = (SELECT id FROM categories WHERE slug='it-services-agencies' AND level=1)
         OR p.parent_id  = (SELECT id FROM categories WHERE slug='it-services-agencies' AND level=1)
         OR gp.parent_id = (SELECT id FROM categories WHERE slug='it-services-agencies' AND level=1)
         OR ggp.parent_id = (SELECT id FROM categories WHERE slug='it-services-agencies' AND level=1)
   ) AS it_ids
 );

-- ═══ Section C: Delete old it-services-agencies dependents + categories ═══

-- C.1: delete category_seo_content
DELETE sc FROM category_seo_content sc
  JOIN categories c ON c.id = sc.category_id
  LEFT JOIN categories p  ON p.id  = c.parent_id
  LEFT JOIN categories gp ON gp.id = p.parent_id
 WHERE c.parent_id  = (SELECT id FROM categories WHERE slug='it-services-agencies' AND level=1)
    OR p.parent_id  = (SELECT id FROM categories WHERE slug='it-services-agencies' AND level=1)
    OR gp.parent_id = (SELECT id FROM categories WHERE slug='it-services-agencies' AND level=1);

-- C.2: delete listing_types
DELETE lt FROM listing_types lt
  JOIN categories c ON c.id = lt.category_id
  LEFT JOIN categories p ON p.id = c.parent_id
 WHERE c.parent_id = (SELECT id FROM categories WHERE slug='it-services-agencies' AND level=1)
    OR p.parent_id = (SELECT id FROM categories WHERE slug='it-services-agencies' AND level=1);

-- C.3: delete L3 categories (JOIN-based, dodges MySQL #1093)
DELETE c FROM categories c
  JOIN categories p  ON p.id  = c.parent_id
  JOIN categories gp ON gp.id = p.parent_id
 WHERE c.level = 3 AND gp.slug = 'it-services-agencies' AND gp.level = 1;

-- C.4: delete L2 categories
DELETE c FROM categories c
  JOIN categories p ON p.id = c.parent_id
 WHERE c.level = 2 AND p.slug = 'it-services-agencies' AND p.level = 1;

-- ═══ Section D.1: Insert 10 new L2 categories ═══
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Web Development Services', 'web-development-services', 2, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'it-services-agencies' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile App Development Services', 'mobile-app-development-services', 2, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'it-services-agencies' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Software Development Services', 'software-development-services', 2, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'it-services-agencies' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'eCommerce Development Services', 'ecommerce-development-services', 2, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'it-services-agencies' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Design & UX Services', 'design-ux-services', 2, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'it-services-agencies' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Digital Marketing & SEO Services', 'digital-marketing-seo-services', 2, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'it-services-agencies' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI & Emerging Tech Services', 'ai-emerging-tech-services', 2, id, '#14B8A6', 1, 1, 1, 70
  FROM categories WHERE slug = 'it-services-agencies' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IT Services & Consulting', 'it-services-consulting', 2, id, '#14B8A6', 1, 1, 1, 80
  FROM categories WHERE slug = 'it-services-agencies' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Creative & Production Services', 'creative-production-services', 2, id, '#14B8A6', 1, 1, 1, 90
  FROM categories WHERE slug = 'it-services-agencies' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Services & BPO', 'business-services-bpo', 2, id, '#14B8A6', 1, 1, 1, 100
  FROM categories WHERE slug = 'it-services-agencies' AND level = 1 LIMIT 1;

-- ═══ Section D.2: Insert 69 new L3 categories ═══
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Custom Web Development', 'custom-web-development', 3, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'web-development-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'JavaScript Frameworks', 'javascript-frameworks', 3, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'web-development-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'PHP Frameworks', 'php-frameworks', 3, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'web-development-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Python Frameworks', 'python-frameworks', 3, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'web-development-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ruby on Rails', 'ruby-on-rails', 3, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'web-development-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Microsoft .NET', 'microsoft-net', 3, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'web-development-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '.NET', 'net', 3, id, '#14B8A6', 1, 1, 1, 70
  FROM categories WHERE slug = 'web-development-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Java', 'java', 3, id, '#14B8A6', 1, 1, 1, 80
  FROM categories WHERE slug = 'web-development-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CMS Development', 'cms-development', 3, id, '#14B8A6', 1, 1, 1, 90
  FROM categories WHERE slug = 'web-development-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Web Hosting & DevOps', 'web-hosting-devops', 3, id, '#14B8A6', 1, 1, 1, 100
  FROM categories WHERE slug = 'web-development-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Native iOS Development', 'native-ios-development', 3, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'mobile-app-development-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Native Android Development', 'native-android-development', 3, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'mobile-app-development-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cross-Platform Development', 'cross-platform-development', 3, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'mobile-app-development-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Specialized Mobile', 'specialized-mobile', 3, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'mobile-app-development-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Game Development', 'game-development-services', 3, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'mobile-app-development-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Custom Software Development', 'custom-software-development', 3, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'software-development-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Outsourced & Offshore', 'outsourced-offshore', 3, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'software-development-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Quality Assurance & Testing', 'quality-assurance-testing', 3, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'software-development-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'DevOps & SRE', 'devops-sre', 3, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'software-development-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Salesforce & CRM', 'salesforce-crm', 3, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'software-development-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ERP Implementation', 'erp-implementation', 3, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'software-development-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'eCommerce Platforms', 'ecommerce-platforms-services', 3, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ecommerce-development-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'eCommerce Specializations', 'ecommerce-specializations', 3, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ecommerce-development-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Subscription & Recurring Commerce', 'subscription-recurring-commerce', 3, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ecommerce-development-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Web Design', 'web-design', 3, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'design-ux-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'UI/UX Design', 'ui-ux-design', 3, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'design-ux-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Branding & Identity', 'branding-identity', 3, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'design-ux-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Graphic & Print Design', 'graphic-print-design', 3, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'design-ux-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Product Design', 'product-design-services', 3, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'design-ux-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Digital & Creative', 'digital-creative', 3, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'design-ux-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Search Engine Optimization (SEO)', 'search-engine-optimization-seo', 3, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'digital-marketing-seo-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Paid Advertising (PPC)', 'paid-advertising-ppc', 3, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'digital-marketing-seo-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Social Media Marketing', 'social-media-marketing-services', 3, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'digital-marketing-seo-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Content Marketing', 'content-marketing-services', 3, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'digital-marketing-seo-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Email & Marketing Automation', 'email-marketing-automation', 3, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'digital-marketing-seo-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Conversion & Growth', 'conversion-growth', 3, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'digital-marketing-seo-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile App Marketing', 'mobile-app-marketing', 3, id, '#14B8A6', 1, 1, 1, 70
  FROM categories WHERE slug = 'digital-marketing-seo-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Full Service Digital', 'full-service-digital', 3, id, '#14B8A6', 1, 1, 1, 80
  FROM categories WHERE slug = 'digital-marketing-seo-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Specialized Marketing', 'specialized-marketing', 3, id, '#14B8A6', 1, 1, 1, 90
  FROM categories WHERE slug = 'digital-marketing-seo-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Artificial Intelligence', 'artificial-intelligence', 3, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-emerging-tech-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Machine Learning & Data Science', 'machine-learning-data-science', 3, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-emerging-tech-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Chatbots & Conversational AI', 'chatbots-conversational-ai', 3, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-emerging-tech-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Blockchain', 'blockchain', 3, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-emerging-tech-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AR / VR / Metaverse', 'ar-vr-metaverse', 3, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-emerging-tech-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Internet of Things (IoT)', 'internet-of-things-iot', 3, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ai-emerging-tech-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'RPA & Automation', 'rpa-automation', 3, id, '#14B8A6', 1, 1, 1, 70
  FROM categories WHERE slug = 'ai-emerging-tech-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Low-Code / No-Code', 'low-code-no-code', 3, id, '#14B8A6', 1, 1, 1, 80
  FROM categories WHERE slug = 'ai-emerging-tech-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Managed IT Services', 'managed-it-services', 3, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'it-services-consulting' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cloud Consulting', 'cloud-consulting', 3, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'it-services-consulting' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cybersecurity', 'cybersecurity-services', 3, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'it-services-consulting' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data & Analytics', 'data-analytics', 3, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'it-services-consulting' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IT Consulting & Strategy', 'it-consulting-strategy', 3, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'it-services-consulting' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'System & Database', 'system-database', 3, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'it-services-consulting' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'VoIP & Telecom', 'voip-telecom', 3, id, '#14B8A6', 1, 1, 1, 70
  FROM categories WHERE slug = 'it-services-consulting' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Microsoft Ecosystem', 'microsoft-ecosystem', 3, id, '#14B8A6', 1, 1, 1, 80
  FROM categories WHERE slug = 'it-services-consulting' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video Production', 'video-production', 3, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'creative-production-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Animation & Motion Graphics', 'animation-motion-graphics', 3, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'creative-production-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Audio & Podcast Production', 'audio-podcast-production', 3, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'creative-production-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Photography', 'photography-services', 3, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'creative-production-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Writing & Translation', 'writing-translation', 3, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'creative-production-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Call Centers & Customer Support', 'call-centers-customer-support', 3, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'business-services-bpo' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Process Outsourcing', 'business-process-outsourcing', 3, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'business-services-bpo' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Human Resources', 'human-resources', 3, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'business-services-bpo' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Accounting & Finance', 'accounting-finance', 3, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'business-services-bpo' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Consulting', 'business-consulting', 3, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'business-services-bpo' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Legal Services', 'legal-services', 3, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'business-services-bpo' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Logistics & Supply Chain', 'logistics-supply-chain', 3, id, '#14B8A6', 1, 1, 1, 70
  FROM categories WHERE slug = 'business-services-bpo' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Services', 'real-estate-services', 3, id, '#14B8A6', 1, 1, 1, 80
  FROM categories WHERE slug = 'business-services-bpo' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Engineering & Manufacturing', 'engineering-manufacturing', 3, id, '#14B8A6', 1, 1, 1, 90
  FROM categories WHERE slug = 'business-services-bpo' AND level = 2 LIMIT 1;

-- ═══ Section D.3: Insert 406 new L4 categories ═══
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Custom Web Development Companies', 'custom-web-development-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'custom-web-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Full-Stack Development Companies', 'full-stack-development-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'custom-web-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Front-End Development Companies', 'front-end-development-companies', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'custom-web-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Back-End Development Companies', 'back-end-development-companies', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'custom-web-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'API Development & Integration Companies', 'api-development-integration-companies', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'custom-web-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Progressive Web App (PWA) Development', 'progressive-web-app-pwa-development', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'custom-web-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Web Application Development Companies', 'web-application-development-companies', 4, id, '#14B8A6', 1, 1, 1, 70
  FROM categories WHERE slug = 'custom-web-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Web Portal Development Companies', 'web-portal-development-companies', 4, id, '#14B8A6', 1, 1, 1, 80
  FROM categories WHERE slug = 'custom-web-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SaaS Development Companies', 'saas-development-companies', 4, id, '#14B8A6', 1, 1, 1, 90
  FROM categories WHERE slug = 'custom-web-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ReactJS Development Companies', 'reactjs-development-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'javascript-frameworks' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Angular Development Companies', 'angular-development-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'javascript-frameworks' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vue.js Development Companies', 'vue-js-development-companies', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'javascript-frameworks' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Next.js Development Companies', 'next-js-development-companies', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'javascript-frameworks' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Node.js Development Companies', 'node-js-development-companies', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'javascript-frameworks' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Svelte Development Companies', 'svelte-development-companies', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'javascript-frameworks' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Laravel Development Companies', 'laravel-development-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'php-frameworks' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CodeIgniter Development Companies', 'codeigniter-development-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'php-frameworks' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Symfony Development Companies', 'symfony-development-companies', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'php-frameworks' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CakePHP Development Companies', 'cakephp-development-companies', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'php-frameworks' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Yii Development Companies', 'yii-development-companies', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'php-frameworks' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'PHP Development Companies', 'php-development-companies', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'php-frameworks' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Python Development Companies', 'python-development-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'python-frameworks' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Django Development Companies', 'django-development-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'python-frameworks' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Flask Development Companies', 'flask-development-companies', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'python-frameworks' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'FastAPI Development Companies', 'fastapi-development-companies', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'python-frameworks' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ruby on Rails Development Companies', 'ruby-on-rails-development-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ruby-on-rails' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ASP.NET Development Companies', 'asp-net-development-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'microsoft-net' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'C# Development Companies', 'c-development-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'microsoft-net' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '.NET Development Companies', 'net-development-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'net' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Java Development Companies', 'java-development-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'java' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Spring Boot Development Companies', 'spring-boot-development-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'java' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'WordPress Development Companies', 'wordpress-development-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'cms-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Drupal Development Companies', 'drupal-development-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'cms-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Joomla Development Companies', 'joomla-development-companies', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'cms-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Webflow Development Companies', 'webflow-development-companies', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'cms-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sitecore Development Companies', 'sitecore-development-companies', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'cms-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Contentful Development Companies', 'contentful-development-companies', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'cms-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Headless CMS Development', 'headless-cms-development', 4, id, '#14B8A6', 1, 1, 1, 70
  FROM categories WHERE slug = 'cms-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Strapi Development Companies', 'strapi-development-companies', 4, id, '#14B8A6', 1, 1, 1, 80
  FROM categories WHERE slug = 'cms-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Web Hosting Services', 'web-hosting-services-services', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'web-hosting-devops' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Web Maintenance & Support', 'web-maintenance-support', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'web-hosting-devops' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Website Migration Services', 'website-migration-services', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'web-hosting-devops' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Performance Optimization Services', 'performance-optimization-services', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'web-hosting-devops' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Web Scraping Services', 'web-scraping-services', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'web-hosting-devops' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Web Development Consulting', 'web-development-consulting', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'web-hosting-devops' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'iPhone App Development Companies', 'iphone-app-development-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'native-ios-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'iPad App Development Companies', 'ipad-app-development-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'native-ios-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Swift App Development Companies', 'swift-app-development-companies', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'native-ios-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Objective-C Development Companies', 'objective-c-development-companies', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'native-ios-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Apple Watch App Development', 'apple-watch-app-development', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'native-ios-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Android App Development Companies', 'android-app-development-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'native-android-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Kotlin Development Companies', 'kotlin-development-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'native-android-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Android TV App Development', 'android-tv-app-development', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'native-android-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'React Native App Development Companies', 'react-native-app-development-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'cross-platform-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Flutter App Development Companies', 'flutter-app-development-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'cross-platform-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Xamarin App Development Companies', 'xamarin-app-development-companies', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'cross-platform-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ionic App Development Companies', 'ionic-app-development-companies', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'cross-platform-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cordova App Development Companies', 'cordova-app-development-companies', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'cross-platform-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wearable App Development Companies', 'wearable-app-development-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'specialized-mobile' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Enterprise Mobile App Development', 'enterprise-mobile-app-development', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'specialized-mobile' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hybrid App Development Companies', 'hybrid-app-development-companies', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'specialized-mobile' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile App Design Services', 'mobile-app-design-services', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'specialized-mobile' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'App Modernization Services', 'app-modernization-services', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'specialized-mobile' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile App Consulting', 'mobile-app-consulting', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'specialized-mobile' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile Game Development Companies', 'mobile-game-development-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'game-development-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Unity Game Development Companies', 'unity-game-development-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'game-development-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Unreal Engine Game Development', 'unreal-engine-game-development', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'game-development-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '2D Game Development Companies', '2d-game-development-companies', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'game-development-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '3D Game Development Companies', '3d-game-development-companies', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'game-development-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Console Game Development', 'console-game-development', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'game-development-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'VR Game Development Companies', 'vr-game-development-companies', 4, id, '#14B8A6', 1, 1, 1, 70
  FROM categories WHERE slug = 'game-development-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Custom Software Development Companies', 'custom-software-development-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'custom-software-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Enterprise Software Development', 'enterprise-software-development', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'custom-software-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Product Engineering Services', 'product-engineering-services', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'custom-software-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'MVP Development Companies', 'mvp-development-companies', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'custom-software-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Startup Software Development', 'startup-software-development', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'custom-software-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Legacy Software Modernization', 'legacy-software-modernization', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'custom-software-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Offshore Software Development Companies', 'offshore-software-development-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'outsourced-offshore' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Nearshore Software Development', 'nearshore-software-development', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'outsourced-offshore' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Outsourcing Software Development', 'outsourcing-software-development', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'outsourced-offshore' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dedicated Development Teams', 'dedicated-development-teams', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'outsourced-offshore' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IT Staff Augmentation Services', 'it-staff-augmentation-services', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'outsourced-offshore' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Software Testing Companies', 'software-testing-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'quality-assurance-testing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'QA Outsourcing Services', 'qa-outsourcing-services', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'quality-assurance-testing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Test Automation Services', 'test-automation-services', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'quality-assurance-testing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Performance Testing Services', 'performance-testing-services', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'quality-assurance-testing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Security Testing Services', 'security-testing-services', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'quality-assurance-testing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile App Testing Services', 'mobile-app-testing-services', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'quality-assurance-testing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'QA Consulting Services', 'qa-consulting-services', 4, id, '#14B8A6', 1, 1, 1, 70
  FROM categories WHERE slug = 'quality-assurance-testing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'DevOps Consulting Companies', 'devops-consulting-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'devops-sre' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'DevOps Services & Solutions', 'devops-services-solutions', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'devops-sre' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CI/CD Implementation Services', 'ci-cd-implementation-services', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'devops-sre' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Container & Kubernetes Services', 'container-kubernetes-services', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'devops-sre' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Site Reliability Engineering (SRE)', 'site-reliability-engineering-sre', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'devops-sre' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Salesforce Consulting Companies', 'salesforce-consulting-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'salesforce-crm' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Salesforce Development Companies', 'salesforce-development-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'salesforce-crm' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Salesforce Lightning Development', 'salesforce-lightning-development', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'salesforce-crm' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HubSpot Implementation Partners', 'hubspot-implementation-partners', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'salesforce-crm' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Microsoft Dynamics Partners', 'microsoft-dynamics-partners', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'salesforce-crm' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Zoho Implementation Partners', 'zoho-implementation-partners', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'salesforce-crm' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SAP Consulting Companies', 'sap-consulting-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'erp-implementation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Oracle Consulting Companies', 'oracle-consulting-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'erp-implementation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'NetSuite Implementation Partners', 'netsuite-implementation-partners', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'erp-implementation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Odoo Development Companies', 'odoo-development-companies', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'erp-implementation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ERPNext Development Companies', 'erpnext-development-companies', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'erp-implementation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Microsoft Dynamics 365 Consulting', 'microsoft-dynamics-365-consulting', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'erp-implementation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Shopify Development Companies', 'shopify-development-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ecommerce-platforms-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Shopify Plus Development', 'shopify-plus-development', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ecommerce-platforms-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Magento Development Companies', 'magento-development-companies', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ecommerce-platforms-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Adobe Commerce Development', 'adobe-commerce-development', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ecommerce-platforms-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'WooCommerce Development Companies', 'woocommerce-development-companies', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ecommerce-platforms-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'BigCommerce Development Companies', 'bigcommerce-development-companies', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ecommerce-platforms-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'PrestaShop Development Companies', 'prestashop-development-companies', 4, id, '#14B8A6', 1, 1, 1, 70
  FROM categories WHERE slug = 'ecommerce-platforms-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'OpenCart Development Companies', 'opencart-development-companies', 4, id, '#14B8A6', 1, 1, 1, 80
  FROM categories WHERE slug = 'ecommerce-platforms-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'VTEX Development Companies', 'vtex-development-companies', 4, id, '#14B8A6', 1, 1, 1, 90
  FROM categories WHERE slug = 'ecommerce-platforms-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Shopware Development Companies', 'shopware-development-companies', 4, id, '#14B8A6', 1, 1, 1, 100
  FROM categories WHERE slug = 'ecommerce-platforms-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Commercetools Development Companies', 'commercetools-development-companies', 4, id, '#14B8A6', 1, 1, 1, 110
  FROM categories WHERE slug = 'ecommerce-platforms-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Salesforce Commerce Cloud Partners', 'salesforce-commerce-cloud-partners', 4, id, '#14B8A6', 1, 1, 1, 120
  FROM categories WHERE slug = 'ecommerce-platforms-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'OroCommerce Development', 'orocommerce-development', 4, id, '#14B8A6', 1, 1, 1, 130
  FROM categories WHERE slug = 'ecommerce-platforms-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'NetSuite Commerce Development', 'netsuite-commerce-development', 4, id, '#14B8A6', 1, 1, 1, 140
  FROM categories WHERE slug = 'ecommerce-platforms-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'B2B eCommerce Development', 'b2b-ecommerce-development', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ecommerce-specializations' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'D2C eCommerce Development', 'd2c-ecommerce-development', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ecommerce-specializations' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Headless Commerce Development', 'headless-commerce-development', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ecommerce-specializations' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketplace Development Companies', 'marketplace-development-companies', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ecommerce-specializations' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'eCommerce App Development', 'ecommerce-app-development', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ecommerce-specializations' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Small Business eCommerce Development', 'small-business-ecommerce-development', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ecommerce-specializations' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'eCommerce Consulting Companies', 'ecommerce-consulting-companies', 4, id, '#14B8A6', 1, 1, 1, 70
  FROM categories WHERE slug = 'ecommerce-specializations' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'eCommerce Replatforming Services', 'ecommerce-replatforming-services', 4, id, '#14B8A6', 1, 1, 1, 80
  FROM categories WHERE slug = 'ecommerce-specializations' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Subscription Commerce Development', 'subscription-commerce-development', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'subscription-recurring-commerce' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Recharge & Bold Subscriptions Implementation', 'recharge-bold-subscriptions-implementation', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'subscription-recurring-commerce' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Web Design Companies', 'web-design-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'web-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Responsive Web Design Companies', 'responsive-web-design-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'web-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'B2B Website Design Companies', 'b2b-website-design-companies', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'web-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Small Business Web Design', 'small-business-web-design', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'web-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'eCommerce Web Design Companies', 'ecommerce-web-design-companies', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'web-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Landing Page Design Services', 'landing-page-design-services', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'web-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Website Redesign Services', 'website-redesign-services', 4, id, '#14B8A6', 1, 1, 1, 70
  FROM categories WHERE slug = 'web-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'UI/UX Design Agencies', 'ui-ux-design-agencies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ui-ux-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'User Experience Research Companies', 'user-experience-research-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ui-ux-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Design Systems Services', 'design-systems-services', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ui-ux-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile App UX Design', 'mobile-app-ux-design', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ui-ux-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Figma Design Services', 'figma-design-services', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ui-ux-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wireframing & Prototyping', 'wireframing-prototyping', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ui-ux-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Branding Agencies', 'branding-agencies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'branding-identity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Logo Design Companies', 'logo-design-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'branding-identity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brand Identity Design', 'brand-identity-design', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'branding-identity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Naming & Tagline Agencies', 'naming-tagline-agencies', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'branding-identity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brand Strategy Consultants', 'brand-strategy-consultants-services', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'branding-identity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Rebranding Agencies', 'rebranding-agencies', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'branding-identity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Graphic Design Companies', 'graphic-design-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'graphic-print-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Print Design Companies', 'print-design-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'graphic-print-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Packaging Design Companies', 'packaging-design-companies', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'graphic-print-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Illustration Services', 'illustration-services', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'graphic-print-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Infographic Design Services', 'infographic-design-services', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'graphic-print-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Presentation Design Services', 'presentation-design-services', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'graphic-print-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Product Design Companies', 'product-design-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'product-design-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Industrial Design Companies', 'industrial-design-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'product-design-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Digital Product Design', 'digital-product-design', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'product-design-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Digital Design Companies', 'digital-design-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'digital-creative' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Creative Agencies', 'creative-agencies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'digital-creative' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Full Service Design Agencies', 'full-service-design-agencies', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'digital-creative' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Interior Design Companies', 'interior-design-companies', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'digital-creative' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SEO Agencies', 'seo-agencies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'search-engine-optimization-seo' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Local SEO Companies', 'local-seo-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'search-engine-optimization-seo' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'eCommerce SEO Agencies', 'ecommerce-seo-agencies', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'search-engine-optimization-seo' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Small Business SEO Companies', 'small-business-seo-companies', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'search-engine-optimization-seo' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Enterprise SEO Agencies', 'enterprise-seo-agencies', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'search-engine-optimization-seo' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Technical SEO Services', 'technical-seo-services', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'search-engine-optimization-seo' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Link Building Services', 'link-building-services', 4, id, '#14B8A6', 1, 1, 1, 70
  FROM categories WHERE slug = 'search-engine-optimization-seo' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SaaS SEO Agencies', 'saas-seo-agencies', 4, id, '#14B8A6', 1, 1, 1, 80
  FROM categories WHERE slug = 'search-engine-optimization-seo' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Search Optimization (GEO/AEO)', 'ai-search-optimization-geo-aeo', 4, id, '#14B8A6', 1, 1, 1, 90
  FROM categories WHERE slug = 'search-engine-optimization-seo' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'PPC Agencies', 'ppc-agencies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'paid-advertising-ppc' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Google Ads Agencies', 'google-ads-agencies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'paid-advertising-ppc' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Facebook Ads Agencies', 'facebook-ads-agencies', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'paid-advertising-ppc' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Amazon Advertising Agencies', 'amazon-advertising-agencies', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'paid-advertising-ppc' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Search Engine Marketing (SEM)', 'search-engine-marketing-sem', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'paid-advertising-ppc' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Display Advertising Agencies', 'display-advertising-agencies', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'paid-advertising-ppc' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Programmatic Advertising Agencies', 'programmatic-advertising-agencies', 4, id, '#14B8A6', 1, 1, 1, 70
  FROM categories WHERE slug = 'paid-advertising-ppc' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Media Buying Agencies', 'media-buying-agencies', 4, id, '#14B8A6', 1, 1, 1, 80
  FROM categories WHERE slug = 'paid-advertising-ppc' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Affiliate Marketing Agencies', 'affiliate-marketing-agencies', 4, id, '#14B8A6', 1, 1, 1, 90
  FROM categories WHERE slug = 'paid-advertising-ppc' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Social Media Marketing Companies', 'social-media-marketing-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'social-media-marketing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Instagram Marketing Agencies', 'instagram-marketing-agencies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'social-media-marketing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'TikTok Marketing Agencies', 'tiktok-marketing-agencies', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'social-media-marketing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'LinkedIn Marketing Agencies', 'linkedin-marketing-agencies', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'social-media-marketing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Influencer Marketing Agencies', 'influencer-marketing-agencies', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'social-media-marketing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Community Management Services', 'community-management-services', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'social-media-marketing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Content Marketing Agencies', 'content-marketing-agencies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'content-marketing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Blog Writing Services', 'blog-writing-services', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'content-marketing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Copywriting Services', 'copywriting-services', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'content-marketing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Technical Writing Services', 'technical-writing-services', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'content-marketing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Content Strategy Agencies', 'content-strategy-agencies', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'content-marketing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Inbound Marketing Agencies', 'inbound-marketing-agencies', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'content-marketing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Email Marketing Agencies', 'email-marketing-agencies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'email-marketing-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketing Automation Agencies', 'marketing-automation-agencies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'email-marketing-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HubSpot Marketing Agencies', 'hubspot-marketing-agencies', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'email-marketing-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Klaviyo Email Marketing Agencies', 'klaviyo-email-marketing-agencies', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'email-marketing-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mailchimp Marketing Agencies', 'mailchimp-marketing-agencies', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'email-marketing-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SMS Marketing Agencies', 'sms-marketing-agencies', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'email-marketing-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Conversion Rate Optimization (CRO)', 'conversion-rate-optimization-cro-services', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'conversion-growth' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Growth Marketing Agencies', 'growth-marketing-agencies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'conversion-growth' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lead Generation Companies', 'lead-generation-companies', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'conversion-growth' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Demand Generation Agencies', 'demand-generation-agencies', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'conversion-growth' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'A/B Testing Services', 'a-b-testing-services', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'conversion-growth' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'App Store Optimization (ASO)', 'app-store-optimization-aso-services', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'mobile-app-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile App Marketing Agencies', 'mobile-app-marketing-agencies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'mobile-app-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile User Acquisition', 'mobile-user-acquisition', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'mobile-app-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Digital Marketing Agencies', 'digital-marketing-agencies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'full-service-digital' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Full Service Digital Agencies', 'full-service-digital-agencies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'full-service-digital' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Digital Strategy Agencies', 'digital-strategy-agencies', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'full-service-digital' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Performance Marketing Agencies', 'performance-marketing-agencies', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'full-service-digital' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Small Business Marketing Agencies', 'small-business-marketing-agencies', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'full-service-digital' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Direct Marketing Agencies', 'direct-marketing-agencies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'specialized-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Event Marketing Agencies', 'event-marketing-agencies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'specialized-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Experiential Marketing Agencies', 'experiential-marketing-agencies-services', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'specialized-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Public Relations (PR) Firms', 'public-relations-pr-firms', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'specialized-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Reputation Management Companies', 'reputation-management-companies', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'specialized-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Crisis Communications Firms', 'crisis-communications-firms', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'specialized-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Market Research Companies', 'market-research-companies', 4, id, '#14B8A6', 1, 1, 1, 70
  FROM categories WHERE slug = 'specialized-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Advertising Agencies', 'advertising-agencies', 4, id, '#14B8A6', 1, 1, 1, 80
  FROM categories WHERE slug = 'specialized-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Development Companies', 'ai-development-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'artificial-intelligence' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Consulting Companies', 'ai-consulting-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'artificial-intelligence' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Generative AI Development', 'generative-ai-development', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'artificial-intelligence' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Custom GPT Development', 'custom-gpt-development', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'artificial-intelligence' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Agent Development', 'ai-agent-development', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'artificial-intelligence' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Prompt Engineering Services', 'prompt-engineering-services', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'artificial-intelligence' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Integration Services', 'ai-integration-services', 4, id, '#14B8A6', 1, 1, 1, 70
  FROM categories WHERE slug = 'artificial-intelligence' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Machine Learning Companies', 'machine-learning-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'machine-learning-data-science' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Deep Learning Companies', 'deep-learning-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'machine-learning-data-science' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Computer Vision Development', 'computer-vision-development', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'machine-learning-data-science' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Natural Language Processing (NLP)', 'natural-language-processing-nlp', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'machine-learning-data-science' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Predictive Analytics Services', 'predictive-analytics-services', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'machine-learning-data-science' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'MLOps Consulting Services', 'mlops-consulting-services', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'machine-learning-data-science' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Chatbot Development Companies', 'chatbot-development-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'chatbots-conversational-ai' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Conversational AI Development', 'conversational-ai-development', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'chatbots-conversational-ai' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Voice Assistant Development', 'voice-assistant-development', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'chatbots-conversational-ai' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Blockchain Development Companies', 'blockchain-development-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'blockchain' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Smart Contract Development', 'smart-contract-development', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'blockchain' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'NFT Development Companies', 'nft-development-companies', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'blockchain' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'DeFi Development Companies', 'defi-development-companies', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'blockchain' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Web3 Development Companies', 'web3-development-companies', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'blockchain' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cryptocurrency Exchange Development', 'cryptocurrency-exchange-development', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'blockchain' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Solana Development Companies', 'solana-development-companies', 4, id, '#14B8A6', 1, 1, 1, 70
  FROM categories WHERE slug = 'blockchain' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ethereum Development Companies', 'ethereum-development-companies', 4, id, '#14B8A6', 1, 1, 1, 80
  FROM categories WHERE slug = 'blockchain' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hyperledger Development Companies', 'hyperledger-development-companies', 4, id, '#14B8A6', 1, 1, 1, 90
  FROM categories WHERE slug = 'blockchain' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AR/VR Development Companies', 'ar-vr-development-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ar-vr-metaverse' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Augmented Reality (AR) Companies', 'augmented-reality-ar-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ar-vr-metaverse' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Virtual Reality (VR) Companies', 'virtual-reality-vr-companies', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ar-vr-metaverse' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mixed Reality (MR) Companies', 'mixed-reality-mr-companies', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ar-vr-metaverse' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Metaverse Development Companies', 'metaverse-development-companies', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ar-vr-metaverse' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '3D Modeling Services', '3d-modeling-services', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ar-vr-metaverse' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IoT Development Companies', 'iot-development-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'internet-of-things-iot' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Industrial IoT (IIoT) Services', 'industrial-iot-iiot-services', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'internet-of-things-iot' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Smart Home App Development', 'smart-home-app-development', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'internet-of-things-iot' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wearable IoT Development', 'wearable-iot-development', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'internet-of-things-iot' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IoT Consulting Companies', 'iot-consulting-companies', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'internet-of-things-iot' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Robotic Process Automation Companies', 'robotic-process-automation-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'rpa-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'UiPath Implementation Partners', 'uipath-implementation-partners', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'rpa-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Automation Anywhere Partners', 'automation-anywhere-partners', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'rpa-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Blue Prism Development Companies', 'blue-prism-development-companies', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'rpa-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Workflow Automation Services', 'workflow-automation-services', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'rpa-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Process Automation Companies', 'business-process-automation-companies', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'rpa-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Low-Code Development Companies', 'low-code-development-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'low-code-no-code' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'No-Code Development Companies', 'no-code-development-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'low-code-no-code' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bubble Development Companies', 'bubble-development-companies', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'low-code-no-code' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mendix Development Partners', 'mendix-development-partners', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'low-code-no-code' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'OutSystems Development Partners', 'outsystems-development-partners', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'low-code-no-code' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'PowerApps Development Companies', 'powerapps-development-companies', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'low-code-no-code' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Managed IT Services Providers (MSP)', 'managed-it-services-providers-msp', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'managed-it-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IT Support & Help Desk Services', 'it-support-help-desk-services', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'managed-it-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Remote IT Support Services', 'remote-it-support-services', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'managed-it-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Network Management Services', 'network-management-services', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'managed-it-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IT Infrastructure Services', 'it-infrastructure-services', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'managed-it-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Co-Managed IT Services', 'co-managed-it-services', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'managed-it-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cloud Consulting Companies', 'cloud-consulting-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'cloud-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AWS Consulting Partners', 'aws-consulting-partners', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'cloud-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Microsoft Azure Consulting', 'microsoft-azure-consulting', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'cloud-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Google Cloud Consulting', 'google-cloud-consulting', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'cloud-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cloud Migration Services', 'cloud-migration-services', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'cloud-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cloud Cost Optimization Services', 'cloud-cost-optimization-services', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'cloud-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Multi-Cloud & Hybrid Cloud Consulting', 'multi-cloud-hybrid-cloud-consulting', 4, id, '#14B8A6', 1, 1, 1, 70
  FROM categories WHERE slug = 'cloud-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cloud Computing Services', 'cloud-computing-services', 4, id, '#14B8A6', 1, 1, 1, 80
  FROM categories WHERE slug = 'cloud-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cybersecurity Companies', 'cybersecurity-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'cybersecurity-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Penetration Testing Services', 'penetration-testing-services', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'cybersecurity-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vulnerability Assessment Services', 'vulnerability-assessment-services', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'cybersecurity-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Managed Security Service Providers (MSSP)', 'managed-security-service-providers-mssp', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'cybersecurity-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SOC as a Service', 'soc-as-a-service', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'cybersecurity-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Compliance & GRC Consulting', 'compliance-grc-consulting', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'cybersecurity-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Identity & Access Management (IAM)', 'identity-access-management-iam', 4, id, '#14B8A6', 1, 1, 1, 70
  FROM categories WHERE slug = 'cybersecurity-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cybersecurity Consulting', 'cybersecurity-consulting-services', 4, id, '#14B8A6', 1, 1, 1, 80
  FROM categories WHERE slug = 'cybersecurity-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Incident Response Services', 'incident-response-services', 4, id, '#14B8A6', 1, 1, 1, 90
  FROM categories WHERE slug = 'cybersecurity-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Big Data Analytics Companies', 'big-data-analytics-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'data-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Intelligence (BI) Companies', 'business-intelligence-bi-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'data-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Science Consulting', 'data-science-consulting', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'data-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Engineering Services', 'data-engineering-services', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'data-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Warehouse Development', 'data-warehouse-development', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'data-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tableau Consulting Companies', 'tableau-consulting-companies', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'data-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Power BI Consulting Companies', 'power-bi-consulting-companies', 4, id, '#14B8A6', 1, 1, 1, 70
  FROM categories WHERE slug = 'data-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Snowflake Consulting Partners', 'snowflake-consulting-partners', 4, id, '#14B8A6', 1, 1, 1, 80
  FROM categories WHERE slug = 'data-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Visualization Services', 'data-visualization-services', 4, id, '#14B8A6', 1, 1, 1, 90
  FROM categories WHERE slug = 'data-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Recovery Services', 'data-recovery-services', 4, id, '#14B8A6', 1, 1, 1, 100
  FROM categories WHERE slug = 'data-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IT Consulting Companies', 'it-consulting-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'it-consulting-strategy' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IT Strategy Consulting', 'it-strategy-consulting', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'it-consulting-strategy' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Digital Transformation Consulting', 'digital-transformation-consulting', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'it-consulting-strategy' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IT Outsourcing Companies', 'it-outsourcing-companies', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'it-consulting-strategy' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Technology Audit Services', 'technology-audit-services', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'it-consulting-strategy' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Enterprise Architecture Consulting', 'enterprise-architecture-consulting', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'it-consulting-strategy' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Database Administration Services', 'database-administration-services', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'system-database' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'System Administration Services', 'system-administration-services', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'system-database' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Server Management Services', 'server-management-services', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'system-database' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Database Migration Services', 'database-migration-services', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'system-database' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'VoIP Services Providers', 'voip-services-providers', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'voip-telecom' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cloud PBX Providers', 'cloud-pbx-providers', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'voip-telecom' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Unified Communications (UC)', 'unified-communications-uc', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'voip-telecom' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SharePoint Consulting Companies', 'sharepoint-consulting-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'microsoft-ecosystem' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Microsoft 365 Consulting', 'microsoft-365-consulting', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'microsoft-ecosystem' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Power Platform Consulting', 'power-platform-consulting', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'microsoft-ecosystem' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Microsoft Teams Consulting', 'microsoft-teams-consulting', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'microsoft-ecosystem' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video Production Companies', 'video-production-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'video-production' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Corporate Video Production', 'corporate-video-production', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'video-production' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Explainer Video Companies', 'explainer-video-companies', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'video-production' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Commercial Production Companies', 'commercial-production-companies', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'video-production' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video Editing Services', 'video-editing-services', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'video-production' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Live Streaming Production', 'live-streaming-production', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'video-production' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video Marketing Services', 'video-marketing-services', 4, id, '#14B8A6', 1, 1, 1, 70
  FROM categories WHERE slug = 'video-production' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Animation Companies', 'animation-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'animation-motion-graphics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Motion Graphics Companies', 'motion-graphics-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'animation-motion-graphics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '2D Animation Studios', '2d-animation-studios', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'animation-motion-graphics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '3D Animation Studios', '3d-animation-studios', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'animation-motion-graphics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Whiteboard Animation Services', 'whiteboard-animation-services', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'animation-motion-graphics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Character Animation Services', 'character-animation-services', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'animation-motion-graphics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'VFX Studios', 'vfx-studios', 4, id, '#14B8A6', 1, 1, 1, 70
  FROM categories WHERE slug = 'animation-motion-graphics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Audio Production Companies', 'audio-production-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'audio-podcast-production' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Podcast Production Services', 'podcast-production-services', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'audio-podcast-production' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Voice Over Services', 'voice-over-services', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'audio-podcast-production' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Audio Editing Services', 'audio-editing-services', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'audio-podcast-production' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Music Composition Services', 'music-composition-services', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'audio-podcast-production' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sound Design Services', 'sound-design-services', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'audio-podcast-production' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Commercial Photography Services', 'commercial-photography-services', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'photography-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Product Photography Services', 'product-photography-services', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'photography-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Photography', 'real-estate-photography', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'photography-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Drone Photography Services', 'drone-photography-services', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'photography-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Event Photography Services', 'event-photography-services', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'photography-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Translation Services Companies', 'translation-services-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'writing-translation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Transcription Services Companies', 'transcription-services-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'writing-translation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Localization Services', 'localization-services', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'writing-translation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Subtitling & Captioning Services', 'subtitling-captioning-services', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'writing-translation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Proofreading & Editing Services', 'proofreading-editing-services', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'writing-translation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Academic Writing Services', 'academic-writing-services', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'writing-translation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Call Center Companies', 'call-center-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'call-centers-customer-support' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Inbound Call Center Services', 'inbound-call-center-services', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'call-centers-customer-support' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Outbound Call Center Services', 'outbound-call-center-services', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'call-centers-customer-support' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Phone Answering Services', 'phone-answering-services', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'call-centers-customer-support' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Telemarketing Services', 'telemarketing-services', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'call-centers-customer-support' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Appointment Setting Services', 'appointment-setting-services', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'call-centers-customer-support' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Outsourced Customer Support', 'outsourced-customer-support', 4, id, '#14B8A6', 1, 1, 1, 70
  FROM categories WHERE slug = 'call-centers-customer-support' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Live Chat Support Services', 'live-chat-support-services', 4, id, '#14B8A6', 1, 1, 1, 80
  FROM categories WHERE slug = 'call-centers-customer-support' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Email Support Services', 'email-support-services', 4, id, '#14B8A6', 1, 1, 1, 90
  FROM categories WHERE slug = 'call-centers-customer-support' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Help Desk Outsourcing', 'help-desk-outsourcing', 4, id, '#14B8A6', 1, 1, 1, 100
  FROM categories WHERE slug = 'call-centers-customer-support' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'BPO Companies', 'bpo-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'business-process-outsourcing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Back Office Support Services', 'back-office-support-services', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'business-process-outsourcing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Entry Services', 'data-entry-services', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'business-process-outsourcing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Document Processing Services', 'document-processing-services', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'business-process-outsourcing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Knowledge Process Outsourcing (KPO)', 'knowledge-process-outsourcing-kpo', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'business-process-outsourcing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Virtual Assistant Services', 'virtual-assistant-services', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'business-process-outsourcing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Admin Outsourcing Services', 'admin-outsourcing-services', 4, id, '#14B8A6', 1, 1, 1, 70
  FROM categories WHERE slug = 'business-process-outsourcing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HR Consulting Companies', 'hr-consulting-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'human-resources' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HR Outsourcing Companies', 'hr-outsourcing-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'human-resources' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Recruitment Agencies', 'recruitment-agencies', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'human-resources' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Executive Search Firms', 'executive-search-firms-services', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'human-resources' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Staffing Agencies', 'staffing-agencies', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'human-resources' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Professional Employer Organizations (PEO)', 'professional-employer-organizations-peo', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'human-resources' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Payroll Processing Companies', 'payroll-processing-companies', 4, id, '#14B8A6', 1, 1, 1, 70
  FROM categories WHERE slug = 'human-resources' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Background Check Services', 'background-check-services-services', 4, id, '#14B8A6', 1, 1, 1, 80
  FROM categories WHERE slug = 'human-resources' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Accounting Firms', 'accounting-firms-services', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'accounting-finance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bookkeeping Services', 'bookkeeping-services-services', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'accounting-finance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tax Preparation Services', 'tax-preparation-services-services', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'accounting-finance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CFO Outsourcing Services', 'cfo-outsourcing-services', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'accounting-finance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Financial Planning & Analysis (FP&A)', 'financial-planning-analysis-fp-a-services', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'accounting-finance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Audit Support Services', 'audit-support-services', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'accounting-finance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Consulting Firms', 'business-consulting-firms', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'business-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Management Consulting Firms', 'management-consulting-firms', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'business-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Strategy Consulting Firms', 'strategy-consulting-firms-services', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'business-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Operations Consulting Firms', 'operations-consulting-firms', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'business-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Growth Consulting Firms', 'growth-consulting-firms', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'business-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Law Firms', 'law-firms', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'legal-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Patent & IP Law Firms', 'patent-ip-law-firms', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'legal-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Corporate Law Firms', 'corporate-law-firms', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'legal-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Legal Process Outsourcing (LPO)', 'legal-process-outsourcing-lpo', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'legal-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Contract Drafting Services', 'contract-drafting-services', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'legal-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Logistics & Supply Chain Consulting', 'logistics-supply-chain-consulting', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'logistics-supply-chain' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '3PL Logistics Companies', '3pl-logistics-companies', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'logistics-supply-chain' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fulfillment Services', 'fulfillment-services', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'logistics-supply-chain' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Warehousing & Distribution Companies', 'warehousing-distribution-companies', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'logistics-supply-chain' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Freight Forwarding Companies', 'freight-forwarding-companies', 4, id, '#14B8A6', 1, 1, 1, 50
  FROM categories WHERE slug = 'logistics-supply-chain' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trucking Companies', 'trucking-companies', 4, id, '#14B8A6', 1, 1, 1, 60
  FROM categories WHERE slug = 'logistics-supply-chain' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ocean Freight Companies', 'ocean-freight-companies', 4, id, '#14B8A6', 1, 1, 1, 70
  FROM categories WHERE slug = 'logistics-supply-chain' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Air Freight Companies', 'air-freight-companies', 4, id, '#14B8A6', 1, 1, 1, 80
  FROM categories WHERE slug = 'logistics-supply-chain' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Customs Brokerage Services', 'customs-brokerage-services', 4, id, '#14B8A6', 1, 1, 1, 90
  FROM categories WHERE slug = 'logistics-supply-chain' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Contract Manufacturing Companies', 'contract-manufacturing-companies', 4, id, '#14B8A6', 1, 1, 1, 100
  FROM categories WHERE slug = 'logistics-supply-chain' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Commercial Real Estate Firms', 'commercial-real-estate-firms', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'real-estate-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Consulting Firms', 'real-estate-consulting-firms-services', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'real-estate-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Property Management Companies', 'property-management-companies', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'real-estate-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Engineering Services Companies', 'engineering-services-companies', 4, id, '#14B8A6', 1, 1, 1, 10
  FROM categories WHERE slug = 'engineering-manufacturing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mechanical Engineering Services', 'mechanical-engineering-services', 4, id, '#14B8A6', 1, 1, 1, 20
  FROM categories WHERE slug = 'engineering-manufacturing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CAD Drafting Services', 'cad-drafting-services', 4, id, '#14B8A6', 1, 1, 1, 30
  FROM categories WHERE slug = 'engineering-manufacturing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Civil Engineering Consulting', 'civil-engineering-consulting', 4, id, '#14B8A6', 1, 1, 1, 40
  FROM categories WHERE slug = 'engineering-manufacturing' AND level = 3 LIMIT 1;

-- ═══ Section E: Re-enable FKs ═════════════════════════════════
SET FOREIGN_KEY_CHECKS = 1;

-- ═══ Section F: (no live listings to re-attach) ═══════════════
-- The inspect script found 0 submissions under it-services-agencies,
-- so there are no UPDATE statements to run here.
