-- ============================================================
-- InfoWebWorld — Professional Services Taxonomy v2 Migration
-- Rebuilds the Professional Services sector with 2474 hierarchical
-- categories across 3 nested levels (DB L2..L4 under 'professional-services' L1).
-- Source: Professional Services_Unified_Taxonomy v1.xlsx
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ═══ Section B: Disconnect existing professional-services submissions ═══
UPDATE submissions
   SET category_id = NULL, listing_type_id = NULL
 WHERE category_id IN (
   SELECT id FROM (
     SELECT c.id FROM categories c
      LEFT JOIN categories p   ON p.id   = c.parent_id
      LEFT JOIN categories gp  ON gp.id  = p.parent_id
      LEFT JOIN categories ggp ON ggp.id = gp.parent_id
      WHERE c.parent_id  = (SELECT id FROM categories WHERE slug='professional-services' AND level=1)
         OR p.parent_id  = (SELECT id FROM categories WHERE slug='professional-services' AND level=1)
         OR gp.parent_id = (SELECT id FROM categories WHERE slug='professional-services' AND level=1)
         OR ggp.parent_id = (SELECT id FROM categories WHERE slug='professional-services' AND level=1)
   ) AS ps_ids
 );

-- ═══ Section C: Delete old dependents + categories ═══════════
DELETE sc FROM category_seo_content sc
  JOIN categories c ON c.id = sc.category_id
  LEFT JOIN categories p  ON p.id  = c.parent_id
  LEFT JOIN categories gp ON gp.id = p.parent_id
 WHERE c.parent_id  = (SELECT id FROM categories WHERE slug='professional-services' AND level=1)
    OR p.parent_id  = (SELECT id FROM categories WHERE slug='professional-services' AND level=1)
    OR gp.parent_id = (SELECT id FROM categories WHERE slug='professional-services' AND level=1);

DELETE lt FROM listing_types lt
  JOIN categories c ON c.id = lt.category_id
  LEFT JOIN categories p ON p.id = c.parent_id
 WHERE c.parent_id = (SELECT id FROM categories WHERE slug='professional-services' AND level=1)
    OR p.parent_id = (SELECT id FROM categories WHERE slug='professional-services' AND level=1);

DELETE c FROM categories c
  JOIN categories p  ON p.id  = c.parent_id
  JOIN categories gp ON gp.id = p.parent_id
 WHERE c.level = 3 AND gp.slug = 'professional-services' AND gp.level = 1;

DELETE c FROM categories c
  JOIN categories p ON p.id = c.parent_id
 WHERE c.level = 2 AND p.slug = 'professional-services' AND p.level = 1;

-- ═══ Section D.1: Insert 19 new L2 categories ═══
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Accounting & Tax Services', 'accounting-tax-services', 2, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'professional-services' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Architecture, Engineering & Design', 'architecture-engineering-design', 2, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'professional-services' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Consulting', 'business-consulting-pro', 2, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'professional-services' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Coaching & Professional Development', 'coaching-professional-development', 2, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'professional-services' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Corporate Event Planning & Production', 'corporate-event-planning-production', 2, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'professional-services' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Corporate Training & Learning', 'corporate-training-learning', 2, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'professional-services' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Financial Advisory & Planning', 'financial-advisory-planning', 2, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'professional-services' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HR, Staffing & Recruiting', 'hr-staffing-recruiting', 2, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'professional-services' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Insurance Professional Services', 'insurance-professional-services', 2, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'professional-services' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Investigative & Forensic Services', 'investigative-forensic-services', 2, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'professional-services' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Investment Banking & Capital Markets', 'investment-banking-capital-markets', 2, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'professional-services' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Legal Services', 'legal-services-pro', 2, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'professional-services' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketing, Advertising & Communications', 'marketing-advertising-communications', 2, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'professional-services' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Professional Services', 'real-estate-professional-services', 2, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'professional-services' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Risk, Compliance & Audit', 'risk-compliance-audit', 2, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'professional-services' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sustainability, ESG & Environmental Consulting', 'sustainability-esg-environmental-consulting', 2, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'professional-services' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Technology Advisory Services', 'technology-advisory-services', 2, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'professional-services' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Translation & Language Services', 'translation-language-services', 2, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'professional-services' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Writing, Editing & Research Services', 'writing-editing-research-services', 2, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'professional-services' AND level = 1 LIMIT 1;

-- ═══ Section D.2: Insert 140 new L3 categories ═══
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Audit & Assurance', 'audit-assurance', 3, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'accounting-tax-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bookkeeping', 'bookkeeping', 3, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'accounting-tax-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Tax', 'business-tax', 3, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'accounting-tax-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CPA & Accounting Firms', 'cpa-accounting-firms', 3, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'accounting-tax-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Estate & Trust', 'estate-trust', 3, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'accounting-tax-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Other Accounting & Tax Services Specialties', 'other-accounting-tax-services-specialties', 3, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'accounting-tax-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Payroll', 'payroll', 3, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'accounting-tax-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Personal Tax', 'personal-tax', 3, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'accounting-tax-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Specialty Accounting', 'specialty-accounting', 3, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'accounting-tax-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tax Resolution', 'tax-resolution', 3, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'accounting-tax-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Architects', 'architects', 3, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'architecture-engineering-design' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Civil Engineering', 'civil-engineering', 3, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'architecture-engineering-design' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Drafting & Surveying', 'drafting-surveying', 3, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'architecture-engineering-design' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Interior Design', 'interior-design', 3, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'architecture-engineering-design' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mechanical & Electrical', 'mechanical-electrical', 3, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'architecture-engineering-design' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Other Architecture, Engineering & Design Specialties', 'other-architecture-engineering-design-specialties', 3, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'architecture-engineering-design' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Specialty Engineering', 'specialty-engineering', 3, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'architecture-engineering-design' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Urban Planning', 'urban-planning', 3, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'architecture-engineering-design' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Financial & M&A Advisory', 'financial-m-a-advisory', 3, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'business-consulting-pro' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HR & People Consulting', 'hr-people-consulting', 3, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'business-consulting-pro' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Industry Specific', 'industry-specific', 3, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'business-consulting-pro' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Management Consulting', 'management-consulting', 3, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'business-consulting-pro' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Operations Consulting', 'operations-consulting', 3, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'business-consulting-pro' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Other Business Consulting Specialties', 'other-business-consulting-specialties', 3, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'business-consulting-pro' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Risk & Compliance', 'risk-compliance', 3, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'business-consulting-pro' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Small Business', 'small-business', 3, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'business-consulting-pro' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business & Performance Coaching', 'business-performance-coaching', 3, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'coaching-professional-development' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Career & Professional Coaching', 'career-professional-coaching', 3, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'coaching-professional-development' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Executive & Leadership Coaching', 'executive-leadership-coaching', 3, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'coaching-professional-development' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Life, Wellness & Personal Coaching', 'life-wellness-personal-coaching', 3, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'coaching-professional-development' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales, Communication & Skills Coaching', 'sales-communication-skills-coaching', 3, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'coaching-professional-development' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Specialty Coaching', 'specialty-coaching', 3, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'coaching-professional-development' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Awards & Gala Event Planning', 'awards-gala-event-planning', 3, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'corporate-event-planning-production' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Conference & Convention Management', 'conference-convention-management', 3, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'corporate-event-planning-production' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Corporate Meetings & Retreats', 'corporate-meetings-retreats', 3, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'corporate-event-planning-production' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Event Production & Technical Services', 'event-production-technical-services', 3, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'corporate-event-planning-production' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Specialty Corporate Events', 'specialty-corporate-events', 3, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'corporate-event-planning-production' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trade Show & Exhibition Services', 'trade-show-exhibition-services', 3, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'corporate-event-planning-production' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Virtual & Hybrid Event Production', 'virtual-hybrid-event-production', 3, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'corporate-event-planning-production' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Compliance & Mandatory Training', 'compliance-mandatory-training', 3, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'corporate-training-learning' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Leadership & Management Training', 'leadership-management-training', 3, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'corporate-training-learning' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Onboarding & Employee Development', 'onboarding-employee-development', 3, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'corporate-training-learning' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales & Customer Service Training', 'sales-customer-service-training', 3, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'corporate-training-learning' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Soft Skills & Communication Training', 'soft-skills-communication-training', 3, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'corporate-training-learning' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Specialty Training Providers', 'specialty-training-providers', 3, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'corporate-training-learning' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Technical & Professional Skills Training', 'technical-professional-skills-training', 3, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'corporate-training-learning' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'College & Education', 'college-education', 3, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'financial-advisory-planning' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Debt & Credit', 'debt-credit', 3, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'financial-advisory-planning' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Estate Financial Planning', 'estate-financial-planning', 3, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'financial-advisory-planning' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Financial Planning', 'financial-planning', 3, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'financial-advisory-planning' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Insurance Planning', 'insurance-planning', 3, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'financial-advisory-planning' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Investment Advisory', 'investment-advisory', 3, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'financial-advisory-planning' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Other Financial Advisory & Planning Specialties', 'other-financial-advisory-planning-specialties', 3, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'financial-advisory-planning' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Retirement Planning', 'retirement-planning', 3, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'financial-advisory-planning' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Specialty Advisors', 'specialty-advisors', 3, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'financial-advisory-planning' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wealth Management', 'wealth-management', 3, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'financial-advisory-planning' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Career Services', 'career-services', 3, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'hr-staffing-recruiting' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Compensation & Benefits', 'compensation-benefits', 3, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'hr-staffing-recruiting' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Executive Search', 'executive-search', 3, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'hr-staffing-recruiting' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HR Consulting', 'hr-consulting', 3, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'hr-staffing-recruiting' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Other HR, Staffing & Recruiting Specialties', 'other-hr-staffing-recruiting-specialties', 3, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'hr-staffing-recruiting' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pre-Employment Services', 'pre-employment-services', 3, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'hr-staffing-recruiting' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Recruiting', 'recruiting', 3, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'hr-staffing-recruiting' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Staffing Agencies', 'staffing-agencies-pro', 3, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'hr-staffing-recruiting' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Claims & Adjusting', 'claims-adjusting', 3, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'insurance-professional-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Insurance Brokers & Agents', 'insurance-brokers-agents', 3, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'insurance-professional-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Risk & Actuarial', 'risk-actuarial', 3, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'insurance-professional-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Specialty Lines', 'specialty-lines', 3, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'insurance-professional-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Digital Forensics & Cyber Investigation', 'digital-forensics-cyber-investigation', 3, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'investigative-forensic-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Forensic Accounting & Fraud', 'forensic-accounting-fraud', 3, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'investigative-forensic-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Legal & Litigation Support Investigation', 'legal-litigation-support-investigation', 3, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'investigative-forensic-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Private Investigators', 'private-investigators', 3, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'investigative-forensic-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Specialty Investigation Services', 'specialty-investigation-services', 3, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'investigative-forensic-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Surveillance & Background Checks', 'surveillance-background-checks', 3, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'investigative-forensic-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Capital Markets & Underwriting', 'capital-markets-underwriting', 3, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'investment-banking-capital-markets' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Investment Banking Boutiques', 'investment-banking-boutiques', 3, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'investment-banking-capital-markets' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'M&A Advisory', 'm-a-advisory', 3, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'investment-banking-capital-markets' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Private Equity & Venture Capital', 'private-equity-venture-capital', 3, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'investment-banking-capital-markets' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Restructuring & Distressed', 'restructuring-distressed', 3, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'investment-banking-capital-markets' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Specialty Banking & Advisory', 'specialty-banking-advisory', 3, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'investment-banking-capital-markets' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bankruptcy & Debt', 'bankruptcy-debt', 3, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'legal-services-pro' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Law', 'business-law', 3, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'legal-services-pro' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Civil Rights & Specialty', 'civil-rights-specialty', 3, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'legal-services-pro' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Criminal Defense', 'criminal-defense', 3, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'legal-services-pro' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Employment Law', 'employment-law', 3, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'legal-services-pro' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Estate Planning & Probate', 'estate-planning-probate', 3, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'legal-services-pro' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Family & Personal Law', 'family-personal-law', 3, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'legal-services-pro' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Immigration', 'immigration', 3, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'legal-services-pro' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Intellectual Property', 'intellectual-property', 3, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'legal-services-pro' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Legal Support Services', 'legal-support-services', 3, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'legal-services-pro' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Other Legal Services Specialties', 'other-legal-services-specialties', 3, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'legal-services-pro' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Personal Injury & Accidents', 'personal-injury-accidents', 3, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'legal-services-pro' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Law', 'real-estate-law', 3, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'legal-services-pro' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tax Law', 'tax-law', 3, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'legal-services-pro' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Advertising Agencies', 'advertising-agencies-pro', 3, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'marketing-advertising-communications' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Branding & Design', 'branding-design', 3, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'marketing-advertising-communications' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Digital Marketing', 'digital-marketing', 3, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'marketing-advertising-communications' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Event & Experiential', 'event-experiential', 3, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'marketing-advertising-communications' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Full-Service Marketing', 'full-service-marketing', 3, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'marketing-advertising-communications' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Market Research', 'market-research', 3, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'marketing-advertising-communications' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Media Planning & Buying', 'media-planning-buying', 3, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'marketing-advertising-communications' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Other Marketing, Advertising & Communications Specialties', 'other-marketing-advertising-communications-specialties', 3, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'marketing-advertising-communications' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Public Relations', 'public-relations-pro', 3, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'marketing-advertising-communications' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Appraisal & Valuation', 'appraisal-valuation', 3, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'real-estate-professional-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Consulting & Advisory', 'consulting-advisory', 3, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'real-estate-professional-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Other Real Estate Professional Services Specialties', 'other-real-estate-professional-services-specialties', 3, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'real-estate-professional-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Specialty Services', 'specialty-services', 3, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'real-estate-professional-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Survey & Inspection', 'survey-inspection', 3, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'real-estate-professional-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Title & Escrow', 'title-escrow', 3, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'real-estate-professional-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Anti-Money Laundering & Financial Crime', 'anti-money-laundering-financial-crime', 3, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'risk-compliance-audit' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Enterprise Risk Management Consulting', 'enterprise-risk-management-consulting', 3, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'risk-compliance-audit' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Healthcare & Industry-Specific Compliance', 'healthcare-industry-specific-compliance', 3, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'risk-compliance-audit' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Internal Audit Services', 'internal-audit-services', 3, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'risk-compliance-audit' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Regulatory Compliance Consulting', 'regulatory-compliance-consulting', 3, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'risk-compliance-audit' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Specialty Risk & Compliance', 'specialty-risk-compliance', 3, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'risk-compliance-audit' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Carbon, Climate & Net Zero Consulting', 'carbon-climate-net-zero-consulting', 3, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'sustainability-esg-environmental-consulting' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ESG Strategy & Reporting', 'esg-strategy-reporting', 3, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'sustainability-esg-environmental-consulting' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Environmental Compliance & Permitting', 'environmental-compliance-permitting', 3, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'sustainability-esg-environmental-consulting' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Renewable Energy & Green Building Consulting', 'renewable-energy-green-building-consulting', 3, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'sustainability-esg-environmental-consulting' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Specialty Sustainability Consulting', 'specialty-sustainability-consulting', 3, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'sustainability-esg-environmental-consulting' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sustainable Supply Chain Consulting', 'sustainable-supply-chain-consulting', 3, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'sustainability-esg-environmental-consulting' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Water, Waste & Resource Consulting', 'water-waste-resource-consulting', 3, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'sustainability-esg-environmental-consulting' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cloud & Infrastructure Advisory', 'cloud-infrastructure-advisory', 3, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'technology-advisory-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cybersecurity Advisory', 'cybersecurity-advisory', 3, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'technology-advisory-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data, Analytics & BI Consulting', 'data-analytics-bi-consulting', 3, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'technology-advisory-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Enterprise Systems & ERP Consulting', 'enterprise-systems-erp-consulting', 3, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'technology-advisory-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Specialty Technology Advisory', 'specialty-technology-advisory', 3, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'technology-advisory-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Technology Strategy & Digital Transformation', 'technology-strategy-digital-transformation', 3, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'technology-advisory-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Interpretation Services', 'interpretation-services', 3, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'translation-language-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Localization', 'localization', 3, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'translation-language-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Other Translation & Language Services Specialties', 'other-translation-language-services-specialties', 3, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'translation-language-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Transcription', 'transcription-pro', 3, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'translation-language-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Translation Services', 'translation-services', 3, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'translation-language-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Academic & Scientific Writing', 'academic-scientific-writing', 3, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'writing-editing-research-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Content Writing & Copywriting', 'content-writing-copywriting', 3, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'writing-editing-research-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Editing & Proofreading', 'editing-proofreading', 3, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'writing-editing-research-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Grant & Proposal Writing', 'grant-proposal-writing', 3, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'writing-editing-research-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Research Services', 'research-services', 3, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'writing-editing-research-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Specialty Writing Services', 'specialty-writing-services', 3, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'writing-editing-research-services' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Technical & Business Writing', 'technical-business-writing', 3, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'writing-editing-research-services' AND level = 2 LIMIT 1;

-- ═══ Section D.3: Insert 2315 new L4 categories ═══
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Audit Firms', 'audit-firms', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'audit-assurance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Compliance Audit Services', 'compliance-audit-services', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'audit-assurance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'External Auditors', 'external-auditors', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'audit-assurance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Financial Statement Audits', 'financial-statement-audits', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'audit-assurance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Internal Audit Services', 'internal-audit-services-2', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'audit-assurance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bookkeepers', 'bookkeepers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'bookkeeping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Catch-Up Bookkeeping Services', 'catch-up-bookkeeping-services', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'bookkeeping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Small Business Bookkeeping', 'small-business-bookkeeping', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'bookkeeping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Virtual Bookkeeping Services', 'virtual-bookkeeping-services', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'bookkeeping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Tax Preparation', 'business-tax-preparation', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'business-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Corporate Tax Services', 'corporate-tax-services', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'business-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Part-Time CFO Services', 'part-time-cfo-services', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'business-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Partnership Tax Services', 'partnership-tax-services', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'business-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pre-IPO CFO Services', 'pre-ipo-cfo-services', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'business-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'S-Corp Tax Services', 's-corp-tax-services', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'business-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales Tax Consultants', 'sales-tax-consultants', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'business-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Small Business CPAs', 'small-business-cpas', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'business-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Small Business Tax Services', 'small-business-tax-services', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'business-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Startup CFO Services', 'startup-cfo-services', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'business-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Accounting Firms', 'accounting-firms', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'cpa-accounting-firms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Back Office Accounting Services', 'back-office-accounting-services', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'cpa-accounting-firms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Certified Public Accountants', 'certified-public-accountants', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'cpa-accounting-firms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Forensic Accountants', 'forensic-accountants', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'cpa-accounting-firms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Management Accountants', 'management-accountants', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'cpa-accounting-firms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Outsourced Accounting Services', 'outsourced-accounting-services', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'cpa-accounting-firms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Estate Tax Accountants', 'estate-tax-accountants', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'estate-trust' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fiduciary Tax Services', 'fiduciary-tax-services', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'estate-trust' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Inheritance Tax Advisors', 'inheritance-tax-advisors', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'estate-trust' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trust Tax Services', 'trust-tax-services', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'estate-trust' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '1031 Exchange Intermediaries', '1031-exchange-intermediaries', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Asset Tracing Specialists', 'asset-tracing-specialists', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Valuation Experts', 'business-valuation-experts', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cannabis Tax Specialists', 'cannabis-tax-specialists', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cost Segregation Studies Providers', 'cost-segregation-studies-providers', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cross-Border Tax CPAs', 'cross-border-tax-cpas', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Currently Not Collectible Specialists', 'currently-not-collectible-specialists', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Day Trader Tax Specialists', 'day-trader-tax-specialists', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dental Practice CPAs', 'dental-practice-cpas', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Embezzlement Investigators', 'embezzlement-investigators', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Employee Retention Credit Specialists', 'employee-retention-credit-specialists', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Excise Tax Specialists', 'excise-tax-specialists', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Expatriate Tax CPAs', 'expatriate-tax-cpas', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Family Office CPAs', 'family-office-cpas', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'FedRAMP Auditors', 'fedramp-auditors', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Foreign Earned Income Specialists', 'foreign-earned-income-specialists', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Foreign Tax Credit Specialists', 'foreign-tax-credit-specialists', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fractional CFO Services', 'fractional-cfo-services', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fraud Examiners', 'fraud-examiners', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'FreshBooks Specialists', 'freshbooks-specialists', 4, id, '#E8553D', 1, 1, 1, 200
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Generation-Skipping Tax Specialists', 'generation-skipping-tax-specialists', 4, id, '#E8553D', 1, 1, 1, 210
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Gig Worker Tax Specialists', 'gig-worker-tax-specialists', 4, id, '#E8553D', 1, 1, 1, 220
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Government CPAs', 'government-cpas', 4, id, '#E8553D', 1, 1, 1, 230
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HIPAA Auditors', 'hipaa-auditors', 4, id, '#E8553D', 1, 1, 1, 240
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HITRUST Assessors', 'hitrust-assessors', 4, id, '#E8553D', 1, 1, 1, 250
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Healthcare CPAs', 'healthcare-cpas', 4, id, '#E8553D', 1, 1, 1, 260
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ISO 27001 Auditors', 'iso-27001-auditors', 4, id, '#E8553D', 1, 1, 1, 270
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IT Auditors', 'it-auditors', 4, id, '#E8553D', 1, 1, 1, 280
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Installment Agreement Specialists', 'installment-agreement-specialists', 4, id, '#E8553D', 1, 1, 1, 290
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Interim CFO Services', 'interim-cfo-services', 4, id, '#E8553D', 1, 1, 1, 300
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Law Firm CPAs', 'law-firm-cpas', 4, id, '#E8553D', 1, 1, 1, 310
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Manufacturing CPAs', 'manufacturing-cpas', 4, id, '#E8553D', 1, 1, 1, 320
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Money Laundering Investigators', 'money-laundering-investigators', 4, id, '#E8553D', 1, 1, 1, 330
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'OnlyFans Tax Specialists', 'onlyfans-tax-specialists', 4, id, '#E8553D', 1, 1, 1, 340
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Operational Auditors', 'operational-auditors', 4, id, '#E8553D', 1, 1, 1, 350
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Outsourced CFO Services', 'outsourced-cfo-services', 4, id, '#E8553D', 1, 1, 1, 360
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'PCI DSS Auditors', 'pci-dss-auditors', 4, id, '#E8553D', 1, 1, 1, 370
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Penalty Abatement Specialists', 'penalty-abatement-specialists', 4, id, '#E8553D', 1, 1, 1, 380
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Qualified Opportunity Zone Specialists', 'qualified-opportunity-zone-specialists', 4, id, '#E8553D', 1, 1, 1, 390
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'QuickBooks ProAdvisors', 'quickbooks-proadvisors', 4, id, '#E8553D', 1, 1, 1, 400
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Religious Organization CPAs', 'religious-organization-cpas', 4, id, '#E8553D', 1, 1, 1, 410
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Rental Property Tax Specialists', 'rental-property-tax-specialists', 4, id, '#E8553D', 1, 1, 1, 420
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SBA Loan Tax Specialists', 'sba-loan-tax-specialists', 4, id, '#E8553D', 1, 1, 1, 430
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SOC 1 Auditors', 'soc-1-auditors', 4, id, '#E8553D', 1, 1, 1, 440
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SaaS Sales Tax Specialists', 'saas-sales-tax-specialists', 4, id, '#E8553D', 1, 1, 1, 450
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales Tax Compliance Firms', 'sales-tax-compliance-firms', 4, id, '#E8553D', 1, 1, 1, 460
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'School District CPAs', 'school-district-cpas', 4, id, '#E8553D', 1, 1, 1, 470
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Section 179 Tax Specialists', 'section-179-tax-specialists', 4, id, '#E8553D', 1, 1, 1, 480
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Startup CPAs', 'startup-cpas', 4, id, '#E8553D', 1, 1, 1, 490
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'State Tax Specialists', 'state-tax-specialists', 4, id, '#E8553D', 1, 1, 1, 500
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Streamlined Disclosure Specialists', 'streamlined-disclosure-specialists', 4, id, '#E8553D', 1, 1, 1, 510
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tobacco Tax Specialists', 'tobacco-tax-specialists', 4, id, '#E8553D', 1, 1, 1, 520
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tribal CPAs', 'tribal-cpas', 4, id, '#E8553D', 1, 1, 1, 530
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Veterinary Practice CPAs', 'veterinary-practice-cpas', 4, id, '#E8553D', 1, 1, 1, 540
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wage Garnishment Help', 'wage-garnishment-help', 4, id, '#E8553D', 1, 1, 1, 550
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Xero Certified Advisors', 'xero-certified-advisors', 4, id, '#E8553D', 1, 1, 1, 560
  FROM categories WHERE slug = 'other-accounting-tax-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Contractor Payment Services', 'contractor-payment-services', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'payroll' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Payroll Services', 'payroll-services', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'payroll' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Payroll Tax Filing', 'payroll-tax-filing', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'payroll' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Personal CPA Services', 'personal-cpa-services', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'payroll' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Small Business Payroll', 'small-business-payroll', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'payroll' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Airbnb Host Tax Services', 'airbnb-host-tax-services', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'personal-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Creator Tax Services', 'creator-tax-services', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'personal-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Crypto Tax Preparers', 'crypto-tax-preparers', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'personal-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Estate Tax Preparers', 'estate-tax-preparers', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'personal-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Expat Tax Services', 'expat-tax-services', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'personal-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Family Tax Preparers', 'family-tax-preparers', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'personal-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Federal Tax Lien Removal Services', 'federal-tax-lien-removal-services', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'personal-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Freelancer Tax Services', 'freelancer-tax-services', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'personal-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Individual Tax Filing Services', 'individual-tax-filing-services', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'personal-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Individual Tax Preparers', 'individual-tax-preparers', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'personal-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Influencer Tax Services', 'influencer-tax-services', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'personal-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketplace Sales Tax Services', 'marketplace-sales-tax-services', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'personal-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Property Tax Appeal Services', 'property-tax-appeal-services', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'personal-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Investor Tax Services', 'real-estate-investor-tax-services', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'personal-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Self-Employed Tax Preparers', 'self-employed-tax-preparers', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'personal-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Short-Term Rental Tax Services', 'short-term-rental-tax-services', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'personal-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Stock Trader Tax Services', 'stock-trader-tax-services', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'personal-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tax Planning Advisors', 'tax-planning-advisors', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'personal-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tax Preparation Firms', 'tax-preparation-firms', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'personal-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tax Preparation Services', 'tax-preparation-services', 4, id, '#E8553D', 1, 1, 1, 200
  FROM categories WHERE slug = 'personal-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Twitch Streamer Tax Services', 'twitch-streamer-tax-services', 4, id, '#E8553D', 1, 1, 1, 210
  FROM categories WHERE slug = 'personal-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'YouTuber Tax Services', 'youtuber-tax-services', 4, id, '#E8553D', 1, 1, 1, 220
  FROM categories WHERE slug = 'personal-tax' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Construction Accountants', 'construction-accountants', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'specialty-accounting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Construction CPAs', 'construction-cpas', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'specialty-accounting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cost Accountants', 'cost-accountants', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'specialty-accounting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'E-Commerce CPAs', 'e-commerce-cpas', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'specialty-accounting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'E-commerce Accountants', 'e-commerce-accountants', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'specialty-accounting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ERTC Consultants', 'ertc-consultants', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'specialty-accounting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Enrolled Agents', 'enrolled-agents', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'specialty-accounting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'International CPAs', 'international-cpas', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'specialty-accounting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'International Tax Services', 'international-tax-services', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'specialty-accounting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Medical Practice Accountants', 'medical-practice-accountants', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'specialty-accounting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Nonprofit Accountants', 'nonprofit-accountants', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'specialty-accounting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Nonprofit CPAs', 'nonprofit-cpas', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'specialty-accounting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'PPP Loan Forgiveness Consultants', 'ppp-loan-forgiveness-consultants', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'specialty-accounting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Accountants', 'real-estate-accountants', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'specialty-accounting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate CPAs', 'real-estate-cpas', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'specialty-accounting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Restaurant Accountants', 'restaurant-accountants', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'specialty-accounting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Restaurant CPAs', 'restaurant-cpas', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'specialty-accounting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tax Consultants', 'tax-consultants', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'specialty-accounting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Back Taxes Help', 'back-taxes-help', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'tax-resolution' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bank Levy Help', 'bank-levy-help', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'tax-resolution' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IRS Audit Representation', 'irs-audit-representation', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'tax-resolution' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Innocent Spouse Relief Services', 'innocent-spouse-relief-services', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'tax-resolution' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Offer in Compromise Services', 'offer-in-compromise-services', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'tax-resolution' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Offer in Compromise Specialists', 'offer-in-compromise-specialists', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'tax-resolution' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tax Debt Relief Services', 'tax-debt-relief-services', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'tax-resolution' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tax Lien & Levy Help', 'tax-lien-levy-help', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'tax-resolution' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tax Resolution Firms', 'tax-resolution-firms', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'tax-resolution' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tax Resolution Services', 'tax-resolution-services', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'tax-resolution' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Architects', 'architects-2', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'architects' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Architectural Designers', 'architectural-designers', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'architects' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Architecture Firms', 'architecture-firms', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'architects' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Park Designers', 'park-designers', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'architects' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pop-Up Designers', 'pop-up-designers', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'architects' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Set Designers', 'set-designers', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'architects' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Urban Designers', 'urban-designers', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'architects' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Civil Engineering Firms', 'civil-engineering-firms', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'civil-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Civil Engineers', 'civil-engineers', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'civil-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Geophysical Engineers', 'geophysical-engineers', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'civil-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Geotechnical Engineers', 'geotechnical-engineers', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'civil-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hydraulic Engineers', 'hydraulic-engineers', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'civil-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ITS Engineers', 'its-engineers', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'civil-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Soil Engineers', 'soil-engineers', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'civil-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Structural Engineers', 'structural-engineers', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'civil-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Traffic Engineers', 'traffic-engineers', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'civil-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Transit Engineers', 'transit-engineers', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'civil-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Transportation Engineers', 'transportation-engineers', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'civil-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'UAV Engineers', 'uav-engineers', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'civil-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Boundary Surveyors', 'boundary-surveyors', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'drafting-surveying' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Drafting Services', 'drafting-services', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'drafting-surveying' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Land Surveyors', 'land-surveyors', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'drafting-surveying' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Topographic Surveyors', 'topographic-surveyors', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'drafting-surveying' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cemetery Designers', 'cemetery-designers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'interior-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Interior Designers', 'interior-designers-pro', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'interior-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Kitchen & Bath Designers', 'kitchen-bath-designers', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'interior-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Memorial Designers', 'memorial-designers', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'interior-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Airport Engineers', 'airport-engineers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Asset Integrity Engineers', 'asset-integrity-engineers', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Audio Visual Engineers', 'audio-visual-engineers', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Avionics Engineers', 'avionics-engineers', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Battery Storage Engineers', 'battery-storage-engineers', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Beverage Engineers', 'beverage-engineers', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Biotech Process Engineers', 'biotech-process-engineers', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brewery Engineers', 'brewery-engineers', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bridge Engineers', 'bridge-engineers', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brownfield Engineers', 'brownfield-engineers', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Building Envelope Engineers', 'building-envelope-engineers', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bus Rapid Transit Engineers', 'bus-rapid-transit-engineers', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cannabis Process Engineers', 'cannabis-process-engineers', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Carbon Capture Engineers', 'carbon-capture-engineers', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Carbon Sequestration Engineers', 'carbon-sequestration-engineers', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Climate Adaptation Engineers', 'climate-adaptation-engineers', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cold-Formed Steel Engineers', 'cold-formed-steel-engineers', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Complete Streets Engineers', 'complete-streets-engineers', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Concrete Engineers', 'concrete-engineers', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Control Systems Engineers', 'control-systems-engineers', 4, id, '#E8553D', 1, 1, 1, 200
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dam Engineers', 'dam-engineers', 4, id, '#E8553D', 1, 1, 1, 210
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Demand Response Engineers', 'demand-response-engineers', 4, id, '#E8553D', 1, 1, 1, 220
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Desalination Engineers', 'desalination-engineers', 4, id, '#E8553D', 1, 1, 1, 230
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Direct Air Capture Engineers', 'direct-air-capture-engineers', 4, id, '#E8553D', 1, 1, 1, 240
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Disaster Recovery Engineers', 'disaster-recovery-engineers', 4, id, '#E8553D', 1, 1, 1, 250
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Distillery Engineers', 'distillery-engineers', 4, id, '#E8553D', 1, 1, 1, 260
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Drone Design Engineers', 'drone-design-engineers', 4, id, '#E8553D', 1, 1, 1, 270
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Earthquake Engineers', 'earthquake-engineers', 4, id, '#E8553D', 1, 1, 1, 280
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Earthwork Engineers', 'earthwork-engineers', 4, id, '#E8553D', 1, 1, 1, 290
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Egress Engineers', 'egress-engineers', 4, id, '#E8553D', 1, 1, 1, 300
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Electrical Engineers', 'electrical-engineers', 4, id, '#E8553D', 1, 1, 1, 310
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Energy Audit Engineers', 'energy-audit-engineers', 4, id, '#E8553D', 1, 1, 1, 320
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Energy Efficiency Engineers', 'energy-efficiency-engineers', 4, id, '#E8553D', 1, 1, 1, 330
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Energy Modeling Engineers', 'energy-modeling-engineers', 4, id, '#E8553D', 1, 1, 1, 340
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Erosion Control Engineers', 'erosion-control-engineers', 4, id, '#E8553D', 1, 1, 1, 350
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Facade Engineers', 'facade-engineers', 4, id, '#E8553D', 1, 1, 1, 360
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Failure Analysis Engineers', 'failure-analysis-engineers', 4, id, '#E8553D', 1, 1, 1, 370
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fiber Optic Engineers', 'fiber-optic-engineers', 4, id, '#E8553D', 1, 1, 1, 380
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Floodplain Engineers', 'floodplain-engineers', 4, id, '#E8553D', 1, 1, 1, 390
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Food Processing Engineers', 'food-processing-engineers', 4, id, '#E8553D', 1, 1, 1, 400
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Foundation Engineers', 'foundation-engineers', 4, id, '#E8553D', 1, 1, 1, 410
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Garage Engineers', 'garage-engineers', 4, id, '#E8553D', 1, 1, 1, 420
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Geological Engineers', 'geological-engineers', 4, id, '#E8553D', 1, 1, 1, 430
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Grading Engineers', 'grading-engineers', 4, id, '#E8553D', 1, 1, 1, 440
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Green Infrastructure Engineers', 'green-infrastructure-engineers', 4, id, '#E8553D', 1, 1, 1, 450
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Groundwater Engineers', 'groundwater-engineers', 4, id, '#E8553D', 1, 1, 1, 460
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HVAC Engineers', 'hvac-engineers', 4, id, '#E8553D', 1, 1, 1, 470
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Harbor Engineers', 'harbor-engineers', 4, id, '#E8553D', 1, 1, 1, 480
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hazardous Waste Engineers', 'hazardous-waste-engineers', 4, id, '#E8553D', 1, 1, 1, 490
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Healing Garden Designers', 'healing-garden-designers', 4, id, '#E8553D', 1, 1, 1, 500
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Highway Engineers', 'highway-engineers', 4, id, '#E8553D', 1, 1, 1, 510
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hurricane Engineers', 'hurricane-engineers', 4, id, '#E8553D', 1, 1, 1, 520
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hydrology Engineers', 'hydrology-engineers', 4, id, '#E8553D', 1, 1, 1, 530
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Inspection Engineers', 'inspection-engineers', 4, id, '#E8553D', 1, 1, 1, 540
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Instrumentation Engineers', 'instrumentation-engineers', 4, id, '#E8553D', 1, 1, 1, 550
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Intersection Design Engineers', 'intersection-design-engineers', 4, id, '#E8553D', 1, 1, 1, 560
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Land Development Engineers', 'land-development-engineers', 4, id, '#E8553D', 1, 1, 1, 570
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Levee Engineers', 'levee-engineers', 4, id, '#E8553D', 1, 1, 1, 580
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Light Rail Engineers', 'light-rail-engineers', 4, id, '#E8553D', 1, 1, 1, 590
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lighting Designers', 'lighting-designers', 4, id, '#E8553D', 1, 1, 1, 600
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lighting Engineers', 'lighting-engineers', 4, id, '#E8553D', 1, 1, 1, 610
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Living Wall Designers', 'living-wall-designers', 4, id, '#E8553D', 1, 1, 1, 620
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Low Voltage Engineers', 'low-voltage-engineers', 4, id, '#E8553D', 1, 1, 1, 630
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'MEP Engineers', 'mep-engineers', 4, id, '#E8553D', 1, 1, 1, 640
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Masonry Engineers', 'masonry-engineers', 4, id, '#E8553D', 1, 1, 1, 650
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Materials Engineers', 'materials-engineers', 4, id, '#E8553D', 1, 1, 1, 660
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mechanical Engineers', 'mechanical-engineers', 4, id, '#E8553D', 1, 1, 1, 670
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Metallurgical Engineers', 'metallurgical-engineers', 4, id, '#E8553D', 1, 1, 1, 680
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Microgrid Engineers', 'microgrid-engineers', 4, id, '#E8553D', 1, 1, 1, 690
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Net Zero Engineers', 'net-zero-engineers', 4, id, '#E8553D', 1, 1, 1, 700
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Oil & Gas Engineers', 'oil-gas-engineers', 4, id, '#E8553D', 1, 1, 1, 710
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'PLC Engineers', 'plc-engineers', 4, id, '#E8553D', 1, 1, 1, 720
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pavement Engineers', 'pavement-engineers', 4, id, '#E8553D', 1, 1, 1, 730
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pedestrian Engineers', 'pedestrian-engineers', 4, id, '#E8553D', 1, 1, 1, 740
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pharmaceutical Process Engineers', 'pharmaceutical-process-engineers', 4, id, '#E8553D', 1, 1, 1, 750
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pipeline Engineers', 'pipeline-engineers', 4, id, '#E8553D', 1, 1, 1, 760
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Plumbing Engineers', 'plumbing-engineers', 4, id, '#E8553D', 1, 1, 1, 770
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Polymer Engineers', 'polymer-engineers', 4, id, '#E8553D', 1, 1, 1, 780
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Post-Tensioned Engineers', 'post-tensioned-engineers', 4, id, '#E8553D', 1, 1, 1, 790
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Power Quality Engineers', 'power-quality-engineers', 4, id, '#E8553D', 1, 1, 1, 800
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pre-Engineered Building Engineers', 'pre-engineered-building-engineers', 4, id, '#E8553D', 1, 1, 1, 810
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Process Control Engineers', 'process-control-engineers', 4, id, '#E8553D', 1, 1, 1, 820
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Propulsion Engineers', 'propulsion-engineers', 4, id, '#E8553D', 1, 1, 1, 830
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Remediation Engineers', 'remediation-engineers', 4, id, '#E8553D', 1, 1, 1, 840
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Renewable Energy Engineers', 'renewable-energy-engineers', 4, id, '#E8553D', 1, 1, 1, 850
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Reservoir Engineers', 'reservoir-engineers', 4, id, '#E8553D', 1, 1, 1, 860
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Resilience Engineers', 'resilience-engineers', 4, id, '#E8553D', 1, 1, 1, 870
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Retaining Wall Engineers', 'retaining-wall-engineers', 4, id, '#E8553D', 1, 1, 1, 880
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Roadway Engineers', 'roadway-engineers', 4, id, '#E8553D', 1, 1, 1, 890
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Robotics Engineers', 'robotics-engineers', 4, id, '#E8553D', 1, 1, 1, 900
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Rocket Engineers', 'rocket-engineers', 4, id, '#E8553D', 1, 1, 1, 910
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Roundabout Design Engineers', 'roundabout-design-engineers', 4, id, '#E8553D', 1, 1, 1, 920
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Runway Engineers', 'runway-engineers', 4, id, '#E8553D', 1, 1, 1, 930
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Satellite Engineers', 'satellite-engineers', 4, id, '#E8553D', 1, 1, 1, 940
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Seismic Engineers', 'seismic-engineers', 4, id, '#E8553D', 1, 1, 1, 950
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sewer System Engineers', 'sewer-system-engineers', 4, id, '#E8553D', 1, 1, 1, 960
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Signal Timing Engineers', 'signal-timing-engineers', 4, id, '#E8553D', 1, 1, 1, 970
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Slope Stability Engineers', 'slope-stability-engineers', 4, id, '#E8553D', 1, 1, 1, 980
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Smart Grid Engineers', 'smart-grid-engineers', 4, id, '#E8553D', 1, 1, 1, 990
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Solar PV Engineers', 'solar-pv-engineers', 4, id, '#E8553D', 1, 1, 1, 1000
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Spacecraft Engineers', 'spacecraft-engineers', 4, id, '#E8553D', 1, 1, 1, 1010
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sprinkler Design Engineers', 'sprinkler-design-engineers', 4, id, '#E8553D', 1, 1, 1, 1020
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Stormwater Engineers', 'stormwater-engineers', 4, id, '#E8553D', 1, 1, 1, 1030
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Subsea Engineers', 'subsea-engineers', 4, id, '#E8553D', 1, 1, 1, 1040
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Substation Engineers', 'substation-engineers', 4, id, '#E8553D', 1, 1, 1, 1050
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sustainability Engineers', 'sustainability-engineers', 4, id, '#E8553D', 1, 1, 1, 1060
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Telecom Engineers', 'telecom-engineers', 4, id, '#E8553D', 1, 1, 1, 1070
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tilt-Up Engineers', 'tilt-up-engineers', 4, id, '#E8553D', 1, 1, 1, 1080
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tornado Resistant Engineers', 'tornado-resistant-engineers', 4, id, '#E8553D', 1, 1, 1, 1090
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Transmission Line Engineers', 'transmission-line-engineers', 4, id, '#E8553D', 1, 1, 1, 1100
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tunnel Engineers', 'tunnel-engineers', 4, id, '#E8553D', 1, 1, 1, 1110
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vibration Engineers', 'vibration-engineers', 4, id, '#E8553D', 1, 1, 1, 1120
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Water Distribution Engineers', 'water-distribution-engineers', 4, id, '#E8553D', 1, 1, 1, 1130
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Water Supply Engineers', 'water-supply-engineers', 4, id, '#E8553D', 1, 1, 1, 1140
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Water Treatment Engineers', 'water-treatment-engineers', 4, id, '#E8553D', 1, 1, 1, 1150
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Waterproofing Engineers', 'waterproofing-engineers', 4, id, '#E8553D', 1, 1, 1, 1160
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Watershed Engineers', 'watershed-engineers', 4, id, '#E8553D', 1, 1, 1, 1170
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Welding Engineers', 'welding-engineers', 4, id, '#E8553D', 1, 1, 1, 1180
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Well Engineers', 'well-engineers', 4, id, '#E8553D', 1, 1, 1, 1190
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wind Engineers', 'wind-engineers', 4, id, '#E8553D', 1, 1, 1, 1200
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wood Frame Engineers', 'wood-frame-engineers', 4, id, '#E8553D', 1, 1, 1, 1210
  FROM categories WHERE slug = 'mechanical-electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Accessibility Code Consultants', 'accessibility-code-consultants', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'other-architecture-engineering-design-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Acoustical Consultants', 'acoustical-consultants', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'other-architecture-engineering-design-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Botanical Garden Designers', 'botanical-garden-designers', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'other-architecture-engineering-design-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Building Envelope Consultants', 'building-envelope-consultants', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'other-architecture-engineering-design-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Edible Landscape Designers', 'edible-landscape-designers', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'other-architecture-engineering-design-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Exhibit Designers', 'exhibit-designers', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'other-architecture-engineering-design-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Garden Designers Licensed', 'garden-designers-licensed', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'other-architecture-engineering-design-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Green Roof Designers', 'green-roof-designers', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'other-architecture-engineering-design-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hydrogeologists', 'hydrogeologists', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'other-architecture-engineering-design-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Infrared Thermography Firms', 'infrared-thermography-firms', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'other-architecture-engineering-design-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Magnetic Particle Testing Firms', 'magnetic-particle-testing-firms', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'other-architecture-engineering-design-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Master Plan Designers', 'master-plan-designers', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'other-architecture-engineering-design-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'NDT Inspection Firms', 'ndt-inspection-firms', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'other-architecture-engineering-design-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Native Landscape Designers', 'native-landscape-designers', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'other-architecture-engineering-design-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Non-Destructive Testing Firms', 'non-destructive-testing-firms', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'other-architecture-engineering-design-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Passive House Consultants', 'passive-house-consultants', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'other-architecture-engineering-design-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Penetrant Testing Firms', 'penetrant-testing-firms', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'other-architecture-engineering-design-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Radiographic Testing Firms', 'radiographic-testing-firms', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'other-architecture-engineering-design-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ship Design Firms', 'ship-design-firms', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'other-architecture-engineering-design-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Streetscape Designers', 'streetscape-designers', 4, id, '#E8553D', 1, 1, 1, 200
  FROM categories WHERE slug = 'other-architecture-engineering-design-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Therapeutic Garden Designers', 'therapeutic-garden-designers', 4, id, '#E8553D', 1, 1, 1, 210
  FROM categories WHERE slug = 'other-architecture-engineering-design-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trade Show Booth Designers', 'trade-show-booth-designers', 4, id, '#E8553D', 1, 1, 1, 220
  FROM categories WHERE slug = 'other-architecture-engineering-design-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ultrasonic Testing Firms', 'ultrasonic-testing-firms', 4, id, '#E8553D', 1, 1, 1, 230
  FROM categories WHERE slug = 'other-architecture-engineering-design-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Urban Plaza Designers', 'urban-plaza-designers', 4, id, '#E8553D', 1, 1, 1, 240
  FROM categories WHERE slug = 'other-architecture-engineering-design-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Visual Testing Firms', 'visual-testing-firms', 4, id, '#E8553D', 1, 1, 1, 250
  FROM categories WHERE slug = 'other-architecture-engineering-design-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Yacht Design Firms', 'yacht-design-firms', 4, id, '#E8553D', 1, 1, 1, 260
  FROM categories WHERE slug = 'other-architecture-engineering-design-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Acoustical Engineers', 'acoustical-engineers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'specialty-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Aerospace Engineers', 'aerospace-engineers', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'specialty-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Chemical Engineers', 'chemical-engineers', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'specialty-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Coating Engineers', 'coating-engineers', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'specialty-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cost Engineers', 'cost-engineers', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'specialty-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Drainage Engineers', 'drainage-engineers', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'specialty-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Drilling Engineers', 'drilling-engineers', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'specialty-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Environmental Engineers', 'environmental-engineers', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'specialty-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fire Protection Engineers', 'fire-protection-engineers', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'specialty-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Forensic Engineers', 'forensic-engineers', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'specialty-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Industrial Engineers', 'industrial-engineers', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'specialty-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marine Engineers', 'marine-engineers', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'specialty-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mining Engineers', 'mining-engineers', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'specialty-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Parking Engineers', 'parking-engineers', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'specialty-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Petroleum Engineers', 'petroleum-engineers', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'specialty-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Refinery Engineers', 'refinery-engineers', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'specialty-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Steel Engineers', 'steel-engineers', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'specialty-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ADA Consultants', 'ada-consultants', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'urban-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'City Planners', 'city-planners', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'urban-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Code Consultants', 'code-consultants', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'urban-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Color Consultants', 'color-consultants', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'urban-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Feng Shui Consultants', 'feng-shui-consultants', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'urban-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'LEED Consultants', 'leed-consultants', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'urban-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Land Use Planners', 'land-use-planners', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'urban-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mixed-Use Planners', 'mixed-use-planners', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'urban-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Site Planning Consultants', 'site-planning-consultants', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'urban-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Town Planners', 'town-planners', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'urban-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Urban Planners', 'urban-planners', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'urban-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vastu Consultants', 'vastu-consultants', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'urban-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'WELL Consultants', 'well-consultants', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'urban-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Brokers', 'business-brokers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'financial-m-a-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Valuation Consultants', 'business-valuation-consultants', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'financial-m-a-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Corporate Finance Consultants', 'corporate-finance-consultants', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'financial-m-a-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mergers & Acquisitions Consultants', 'mergers-acquisitions-consultants', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'financial-m-a-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Restructuring Consultants', 'restructuring-consultants', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'financial-m-a-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Turnaround Consultants', 'turnaround-consultants', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'financial-m-a-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HR Consultants', 'hr-consultants', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'hr-people-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cannabis Consultants', 'cannabis-consultants', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'industry-specific' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Education Consultants', 'education-consultants', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'industry-specific' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Energy Consultants', 'energy-consultants', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'industry-specific' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Healthcare Consultants', 'healthcare-consultants', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'industry-specific' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hospitality Consultants', 'hospitality-consultants', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'industry-specific' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Manufacturing Consultants', 'manufacturing-consultants', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'industry-specific' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Consultants', 'real-estate-consultants', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'industry-specific' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Restaurant Consultants', 'restaurant-consultants', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'industry-specific' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Strategy Advisors', 'business-strategy-advisors', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'management-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Transformation Consultants', 'business-transformation-consultants', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'management-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Executive Coaches', 'executive-coaches', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'management-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Leadership Development Consultants', 'leadership-development-consultants', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'management-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Management Consultants', 'management-consultants', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'management-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Organizational Development Consultants', 'organizational-development-consultants', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'management-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Strategy Consultants', 'strategy-consultants', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'management-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lean Six Sigma Consultants', 'lean-six-sigma-consultants', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'operations-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Logistics Consultants', 'logistics-consultants', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'operations-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Operations Consultants', 'operations-consultants', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'operations-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Process Improvement Consultants', 'process-improvement-consultants', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'operations-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Quality Management Consultants', 'quality-management-consultants', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'operations-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Supply Chain Consultants', 'supply-chain-consultants', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'operations-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Analyst Relations Firms', 'analyst-relations-firms', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'other-business-consulting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brand Tracking Firms', 'brand-tracking-firms', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'other-business-consulting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Competitive Intelligence Firms', 'competitive-intelligence-firms', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'other-business-consulting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Concept Testing Firms', 'concept-testing-firms', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'other-business-consulting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Conjoint Analysis Firms', 'conjoint-analysis-firms', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'other-business-consulting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Consumer Insights Firms', 'consumer-insights-firms', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'other-business-consulting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ethnographic Research Firms', 'ethnographic-research-firms', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'other-business-consulting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Focus Group Facilitators', 'focus-group-facilitators', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'other-business-consulting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Go-to-Market Strategy Firms', 'go-to-market-strategy-firms', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'other-business-consulting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Healthcare M&A Advisory', 'healthcare-m-a-advisory', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'other-business-consulting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Industry Research Firms', 'industry-research-firms', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'other-business-consulting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Influencer Relations Firms', 'influencer-relations-firms', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'other-business-consulting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Market Research Firms', 'market-research-firms', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'other-business-consulting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pricing Research Firms', 'pricing-research-firms', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'other-business-consulting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Quantitative Research Firms', 'quantitative-research-firms', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'other-business-consulting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Syndicated Research Providers', 'syndicated-research-providers', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'other-business-consulting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Anti-Money Laundering Consultants', 'anti-money-laundering-consultants', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Compliance Consultants', 'compliance-consultants', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Internal Controls Consultants', 'internal-controls-consultants', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Regulatory Consultants', 'regulatory-consultants', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Risk Management Consultants', 'risk-management-consultants', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Plan Writers', 'business-plan-writers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'small-business' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Franchise Consultants', 'franchise-consultants', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'small-business' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fundraising Consultants', 'fundraising-consultants', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'small-business' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Grant Writers', 'grant-writers', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'small-business' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Small Business Consultants', 'small-business-consultants', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'small-business' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Coaching Business Coaches', 'coaching-business-coaches', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'business-performance-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Consulting Business Coaches', 'consulting-business-coaches', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'business-performance-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Course Business Coaches', 'course-business-coaches', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'business-performance-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Membership Business Coaches', 'membership-business-coaches', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'business-performance-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Online Business Coaches', 'online-business-coaches', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'business-performance-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Productivity Coaches', 'productivity-coaches', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'business-performance-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Service Business Coaches', 'service-business-coaches', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'business-performance-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Career Change Coaches', 'career-change-coaches', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'career-professional-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Career Transition Coaches', 'career-transition-coaches', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'career-professional-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Empty Nester Career Coaches', 'empty-nester-career-coaches', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'career-professional-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Encore Career Coaches', 'encore-career-coaches', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'career-professional-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Job Interview Coaches', 'job-interview-coaches', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'career-professional-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mid-Life Career Coaches', 'mid-life-career-coaches', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'career-professional-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Veteran Career Coaches', 'veteran-career-coaches', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'career-professional-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'C-Suite Coaches', 'c-suite-coaches', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'executive-leadership-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CEO Coaches', 'ceo-coaches', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'executive-leadership-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CEO Peer Groups', 'ceo-peer-groups', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'executive-leadership-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Diversity Leadership Coaches', 'diversity-leadership-coaches', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'executive-leadership-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Executive Coaches', 'executive-coaches-2', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'executive-leadership-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Inclusive Leadership Coaches', 'inclusive-leadership-coaches', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'executive-leadership-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Leadership Training Providers', 'leadership-training-providers', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'executive-leadership-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mid-Career Leadership Coaches', 'mid-career-leadership-coaches', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'executive-leadership-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales Leader Coaches', 'sales-leader-coaches', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'executive-leadership-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Senior Leadership Coaches', 'senior-leadership-coaches', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'executive-leadership-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Women in Leadership Coaches', 'women-in-leadership-coaches', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'executive-leadership-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Life Coaches', 'life-coaches', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'life-wellness-personal-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mindset Coaches', 'mindset-coaches', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'life-wellness-personal-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Relationship Coaches', 'relationship-coaches', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'life-wellness-personal-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Spiritual Coaches', 'spiritual-coaches', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'life-wellness-personal-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wellness Coaches', 'wellness-coaches', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'life-wellness-personal-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Communication Skills Training', 'communication-skills-training', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'sales-communication-skills-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Crisis Communication Coaches', 'crisis-communication-coaches', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'sales-communication-skills-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Negotiation Coaches', 'negotiation-coaches', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'sales-communication-skills-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Presentation Coaches', 'presentation-coaches', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'sales-communication-skills-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Public Speaking Coaches', 'public-speaking-coaches', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'sales-communication-skills-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales Coaches', 'sales-coaches', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'sales-communication-skills-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Agency Owner Coaches', 'agency-owner-coaches', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Agile Coaches', 'agile-coaches', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Anti-Harassment Training Providers', 'anti-harassment-training-providers', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Anxiety Coaches', 'anxiety-coaches', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Atomic Habits Coaches', 'atomic-habits-coaches', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Blended Family Coaches', 'blended-family-coaches', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Board Director Coaches', 'board-director-coaches', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Board Effectiveness Consultants', 'board-effectiveness-consultants', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Body Image Coaches', 'body-image-coaches', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bootstrapper Coaches', 'bootstrapper-coaches', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Breathwork Coaches', 'breathwork-coaches', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Buddhist Coaches', 'buddhist-coaches', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Burnout Recovery Coaches', 'burnout-recovery-coaches', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CFO Coaches', 'cfo-coaches', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Calendar Optimization Coaches', 'calendar-optimization-coaches', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Co-Parenting Coaches', 'co-parenting-coaches', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cohort Course Coaches', 'cohort-course-coaches', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cold Call Coaches', 'cold-call-coaches', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Conference Speaker Coaches', 'conference-speaker-coaches', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Confidence Coaches', 'confidence-coaches', 4, id, '#E8553D', 1, 1, 1, 200
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Conflict Resolution Coaches', 'conflict-resolution-coaches', 4, id, '#E8553D', 1, 1, 1, 210
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Consulting Case Coaches', 'consulting-case-coaches', 4, id, '#E8553D', 1, 1, 1, 220
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Corporate Training Providers', 'corporate-training-providers', 4, id, '#E8553D', 1, 1, 1, 230
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Couples Coaches', 'couples-coaches', 4, id, '#E8553D', 1, 1, 1, 240
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Course Creator Coaches', 'course-creator-coaches', 4, id, '#E8553D', 1, 1, 1, 250
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cross-Cultural Coaches', 'cross-cultural-coaches', 4, id, '#E8553D', 1, 1, 1, 260
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dating Coaches', 'dating-coaches', 4, id, '#E8553D', 1, 1, 1, 270
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Design Thinking Facilitators', 'design-thinking-facilitators', 4, id, '#E8553D', 1, 1, 1, 280
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Difficult Conversation Coaches', 'difficult-conversation-coaches', 4, id, '#E8553D', 1, 1, 1, 290
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Digital Product Coaches', 'digital-product-coaches', 4, id, '#E8553D', 1, 1, 1, 300
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Diversity Training Providers', 'diversity-training-providers', 4, id, '#E8553D', 1, 1, 1, 310
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Divorce Recovery Coaches', 'divorce-recovery-coaches', 4, id, '#E8553D', 1, 1, 1, 320
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Eating Disorder Recovery Coaches', 'eating-disorder-recovery-coaches', 4, id, '#E8553D', 1, 1, 1, 330
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Emotional Intelligence Training', 'emotional-intelligence-training', 4, id, '#E8553D', 1, 1, 1, 340
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Faith-Based Coaches', 'faith-based-coaches', 4, id, '#E8553D', 1, 1, 1, 350
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'First-Time Manager Coaches', 'first-time-manager-coaches', 4, id, '#E8553D', 1, 1, 1, 360
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Focus Coaches', 'focus-coaches', 4, id, '#E8553D', 1, 1, 1, 370
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Freelancer Coaches', 'freelancer-coaches', 4, id, '#E8553D', 1, 1, 1, 380
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Functional Medicine Coaches', 'functional-medicine-coaches', 4, id, '#E8553D', 1, 1, 1, 390
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Goal Setting Coaches', 'goal-setting-coaches', 4, id, '#E8553D', 1, 1, 1, 400
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Group Coaching Programs', 'group-coaching-programs', 4, id, '#E8553D', 1, 1, 1, 410
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Habit Coaches', 'habit-coaches', 4, id, '#E8553D', 1, 1, 1, 420
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Health Coaches', 'health-coaches', 4, id, '#E8553D', 1, 1, 1, 430
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Imposter Syndrome Coaches', 'imposter-syndrome-coaches', 4, id, '#E8553D', 1, 1, 1, 440
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Inbox Zero Coaches', 'inbox-zero-coaches', 4, id, '#E8553D', 1, 1, 1, 450
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Indie Hacker Coaches', 'indie-hacker-coaches', 4, id, '#E8553D', 1, 1, 1, 460
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Insomnia Coaches', 'insomnia-coaches', 4, id, '#E8553D', 1, 1, 1, 470
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Instagram Coaches', 'instagram-coaches', 4, id, '#E8553D', 1, 1, 1, 480
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Intermittent Fasting Coaches', 'intermittent-fasting-coaches', 4, id, '#E8553D', 1, 1, 1, 490
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Kanban Coaches', 'kanban-coaches', 4, id, '#E8553D', 1, 1, 1, 500
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Keto Coaches', 'keto-coaches', 4, id, '#E8553D', 1, 1, 1, 510
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Keynote Coaches', 'keynote-coaches', 4, id, '#E8553D', 1, 1, 1, 520
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lean Coaches', 'lean-coaches', 4, id, '#E8553D', 1, 1, 1, 530
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Limiting Beliefs Coaches', 'limiting-beliefs-coaches', 4, id, '#E8553D', 1, 1, 1, 540
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'LinkedIn Coaches', 'linkedin-coaches', 4, id, '#E8553D', 1, 1, 1, 550
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Manager Training Providers', 'manager-training-providers', 4, id, '#E8553D', 1, 1, 1, 560
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Manifestation Coaches', 'manifestation-coaches', 4, id, '#E8553D', 1, 1, 1, 570
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketing Coaches', 'marketing-coaches', 4, id, '#E8553D', 1, 1, 1, 580
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marriage Coaches', 'marriage-coaches', 4, id, '#E8553D', 1, 1, 1, 590
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mastermind Programs', 'mastermind-programs', 4, id, '#E8553D', 1, 1, 1, 600
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Media Training Coaches', 'media-training-coaches', 4, id, '#E8553D', 1, 1, 1, 610
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Meditation Coaches', 'meditation-coaches', 4, id, '#E8553D', 1, 1, 1, 620
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Membership Site Coaches', 'membership-site-coaches', 4, id, '#E8553D', 1, 1, 1, 630
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mindfulness Coaches', 'mindfulness-coaches', 4, id, '#E8553D', 1, 1, 1, 640
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Newsletter Coaches', 'newsletter-coaches', 4, id, '#E8553D', 1, 1, 1, 650
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Nutrition Coaches', 'nutrition-coaches', 4, id, '#E8553D', 1, 1, 1, 660
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'OKR Coaches', 'okr-coaches', 4, id, '#E8553D', 1, 1, 1, 670
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Offsite Facilitators', 'offsite-facilitators', 4, id, '#E8553D', 1, 1, 1, 680
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Online Course Coaches', 'online-course-coaches', 4, id, '#E8553D', 1, 1, 1, 690
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Panel Moderation Coaches', 'panel-moderation-coaches', 4, id, '#E8553D', 1, 1, 1, 700
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Peer Advisory Groups', 'peer-advisory-groups', 4, id, '#E8553D', 1, 1, 1, 710
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Personal Brand Coaches', 'personal-brand-coaches', 4, id, '#E8553D', 1, 1, 1, 720
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Personal Development Coaches', 'personal-development-coaches', 4, id, '#E8553D', 1, 1, 1, 730
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pitch Coaches', 'pitch-coaches', 4, id, '#E8553D', 1, 1, 1, 740
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Plant Medicine Integration Coaches', 'plant-medicine-integration-coaches', 4, id, '#E8553D', 1, 1, 1, 750
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Podcast Coaches', 'podcast-coaches', 4, id, '#E8553D', 1, 1, 1, 760
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Premarital Coaches', 'premarital-coaches', 4, id, '#E8553D', 1, 1, 1, 770
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Psychedelic Integration Coaches', 'psychedelic-integration-coaches', 4, id, '#E8553D', 1, 1, 1, 780
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Reentry Coaches', 'reentry-coaches', 4, id, '#E8553D', 1, 1, 1, 790
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Resilience Coaches', 'resilience-coaches', 4, id, '#E8553D', 1, 1, 1, 800
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Retirement Coaches', 'retirement-coaches', 4, id, '#E8553D', 1, 1, 1, 810
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Retreat Facilitators', 'retreat-facilitators', 4, id, '#E8553D', 1, 1, 1, 820
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Returnship Coaches', 'returnship-coaches', 4, id, '#E8553D', 1, 1, 1, 830
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SAFe Coaches', 'safe-coaches', 4, id, '#E8553D', 1, 1, 1, 840
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sabbatical Planning Coaches', 'sabbatical-planning-coaches', 4, id, '#E8553D', 1, 1, 1, 850
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales Enablement Coaches', 'sales-enablement-coaches', 4, id, '#E8553D', 1, 1, 1, 860
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales Manager Coaches', 'sales-manager-coaches', 4, id, '#E8553D', 1, 1, 1, 870
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Scrum Masters for Hire', 'scrum-masters-for-hire', 4, id, '#E8553D', 1, 1, 1, 880
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Self-Esteem Coaches', 'self-esteem-coaches', 4, id, '#E8553D', 1, 1, 1, 890
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Self-Improvement Coaches', 'self-improvement-coaches', 4, id, '#E8553D', 1, 1, 1, 900
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Single Parent Coaches', 'single-parent-coaches', 4, id, '#E8553D', 1, 1, 1, 910
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Six Sigma Black Belts', 'six-sigma-black-belts', 4, id, '#E8553D', 1, 1, 1, 920
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sleep Coaches', 'sleep-coaches', 4, id, '#E8553D', 1, 1, 1, 930
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sobriety Coaches', 'sobriety-coaches', 4, id, '#E8553D', 1, 1, 1, 940
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Soft Skills Training Providers', 'soft-skills-training-providers', 4, id, '#E8553D', 1, 1, 1, 950
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Solopreneur Coaches', 'solopreneur-coaches', 4, id, '#E8553D', 1, 1, 1, 960
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Storytelling Coaches', 'storytelling-coaches', 4, id, '#E8553D', 1, 1, 1, 970
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Strategic Planning Facilitators', 'strategic-planning-facilitators', 4, id, '#E8553D', 1, 1, 1, 980
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Substack Coaches', 'substack-coaches', 4, id, '#E8553D', 1, 1, 1, 990
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'TED Talk Coaches', 'ted-talk-coaches', 4, id, '#E8553D', 1, 1, 1, 1000
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Team Building Facilitators', 'team-building-facilitators', 4, id, '#E8553D', 1, 1, 1, 1010
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'TikTok Coaches', 'tiktok-coaches', 4, id, '#E8553D', 1, 1, 1, 1020
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Time Management Coaches', 'time-management-coaches', 4, id, '#E8553D', 1, 1, 1, 1030
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Transformation Coaches', 'transformation-coaches', 4, id, '#E8553D', 1, 1, 1, 1040
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Twitter Growth Coaches', 'twitter-growth-coaches', 4, id, '#E8553D', 1, 1, 1, 1050
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Unconscious Bias Training', 'unconscious-bias-training', 4, id, '#E8553D', 1, 1, 1, 1060
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vision Board Coaches', 'vision-board-coaches', 4, id, '#E8553D', 1, 1, 1, 1070
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vistage-Style Groups', 'vistage-style-groups', 4, id, '#E8553D', 1, 1, 1, 1080
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Workshop Facilitators', 'workshop-facilitators', 4, id, '#E8553D', 1, 1, 1, 1090
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'YouTube Coaches', 'youtube-coaches', 4, id, '#E8553D', 1, 1, 1, 1100
  FROM categories WHERE slug = 'specialty-coaching' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Awards Ceremony Photographers', 'awards-ceremony-photographers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'awards-gala-event-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Awards Ceremony Producers', 'awards-ceremony-producers', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'awards-gala-event-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Charity Gala Planners', 'charity-gala-planners', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'awards-gala-event-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Gala Producers', 'gala-producers', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'awards-gala-event-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Galas and Fundraiser Planners', 'galas-and-fundraiser-planners', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'awards-gala-event-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Conference Photographers', 'conference-photographers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'conference-convention-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Conference Planners', 'conference-planners', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'conference-convention-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Conference Recording Services', 'conference-recording-services', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'conference-convention-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Convention Planners', 'convention-planners', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'conference-convention-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Headshot Stations for Conferences', 'headshot-stations-for-conferences', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'conference-convention-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'All-Hands Meeting Planners', 'all-hands-meeting-planners', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'corporate-meetings-retreats' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Annual Meeting Planners', 'annual-meeting-planners', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'corporate-meetings-retreats' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Board Meeting Planners', 'board-meeting-planners', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'corporate-meetings-retreats' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Executive Retreat Planners', 'executive-retreat-planners', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'corporate-meetings-retreats' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Leadership Retreat Planners', 'leadership-retreat-planners', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'corporate-meetings-retreats' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Event Lighting Designers', 'event-lighting-designers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'event-production-technical-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Multi-Camera Event Production', 'multi-camera-event-production', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'event-production-technical-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Speakers', 'ai-speakers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Acrobat Bookers', 'acrobat-bookers', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Adventure Speakers', 'adventure-speakers', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Analyst Day Planners', 'analyst-day-planners', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Astronaut Speakers', 'astronaut-speakers', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Athlete Speakers', 'athlete-speakers', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Auction Producers', 'auction-producers', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brand Activation Agencies', 'brand-activation-agencies', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brand Ambassadors', 'brand-ambassadors', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brand Tour Producers', 'brand-tour-producers', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Broadcast-Quality Event Producers', 'broadcast-quality-event-producers', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Speakers', 'business-speakers', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Capital Campaign Event Producers', 'capital-campaign-event-producers', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Capital Markets Day Planners', 'capital-markets-day-planners', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Charity Team Building', 'charity-team-building', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Client Appreciation Event Planners', 'client-appreciation-event-planners', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Climate Speakers', 'climate-speakers', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Comedian Entertainers for Corporate', 'comedian-entertainers-for-corporate', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cooking Class Team Building', 'cooking-class-team-building', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Corporate AV Companies', 'corporate-av-companies', 4, id, '#E8553D', 1, 1, 1, 200
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Corporate Event Planners', 'corporate-event-planners', 4, id, '#E8553D', 1, 1, 1, 210
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Custom Exhibit Builders', 'custom-exhibit-builders', 4, id, '#E8553D', 1, 1, 1, 220
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cybersecurity Speakers', 'cybersecurity-speakers', 4, id, '#E8553D', 1, 1, 1, 230
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'DJ Booking Services for Corporate', 'dj-booking-services-for-corporate', 4, id, '#E8553D', 1, 1, 1, 240
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Diversity Speakers', 'diversity-speakers', 4, id, '#E8553D', 1, 1, 1, 250
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Donor Cultivation Event Producers', 'donor-cultivation-event-producers', 4, id, '#E8553D', 1, 1, 1, 260
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Earnings Day Planners', 'earnings-day-planners', 4, id, '#E8553D', 1, 1, 1, 270
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Escape Room Team Building', 'escape-room-team-building', 4, id, '#E8553D', 1, 1, 1, 280
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Event Photography Companies', 'event-photography-companies', 4, id, '#E8553D', 1, 1, 1, 290
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Event Sound Engineers', 'event-sound-engineers', 4, id, '#E8553D', 1, 1, 1, 300
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Experiential Marketing Agencies', 'experiential-marketing-agencies', 4, id, '#E8553D', 1, 1, 1, 310
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Flow Artist Bookers', 'flow-artist-bookers', 4, id, '#E8553D', 1, 1, 1, 320
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fundraising Event Producers', 'fundraising-event-producers', 4, id, '#E8553D', 1, 1, 1, 330
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Future of Work Speakers', 'future-of-work-speakers', 4, id, '#E8553D', 1, 1, 1, 340
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Guerilla Marketing Agencies', 'guerilla-marketing-agencies', 4, id, '#E8553D', 1, 1, 1, 350
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Holiday Party Planners', 'holiday-party-planners', 4, id, '#E8553D', 1, 1, 1, 360
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hypnotist Entertainers', 'hypnotist-entertainers', 4, id, '#E8553D', 1, 1, 1, 370
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Improv Team Building', 'improv-team-building', 4, id, '#E8553D', 1, 1, 1, 380
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Influencer Event Producers', 'influencer-event-producers', 4, id, '#E8553D', 1, 1, 1, 390
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Innovation Offsite Facilitators', 'innovation-offsite-facilitators', 4, id, '#E8553D', 1, 1, 1, 400
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Innovation Speakers', 'innovation-speakers', 4, id, '#E8553D', 1, 1, 1, 410
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Investor Day Planners', 'investor-day-planners', 4, id, '#E8553D', 1, 1, 1, 420
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Leadership Speakers', 'leadership-speakers', 4, id, '#E8553D', 1, 1, 1, 430
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Live Auction Services', 'live-auction-services', 4, id, '#E8553D', 1, 1, 1, 440
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Live Band Booking Services', 'live-band-booking-services', 4, id, '#E8553D', 1, 1, 1, 450
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Live Event Streaming Services', 'live-event-streaming-services', 4, id, '#E8553D', 1, 1, 1, 460
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Live Stream Production Companies', 'live-stream-production-companies', 4, id, '#E8553D', 1, 1, 1, 470
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mental Health Speakers', 'mental-health-speakers', 4, id, '#E8553D', 1, 1, 1, 480
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mentalist Entertainers', 'mentalist-entertainers', 4, id, '#E8553D', 1, 1, 1, 490
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mixology Team Building', 'mixology-team-building', 4, id, '#E8553D', 1, 1, 1, 500
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile Tour Producers', 'mobile-tour-producers', 4, id, '#E8553D', 1, 1, 1, 510
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Modular Exhibit Builders', 'modular-exhibit-builders', 4, id, '#E8553D', 1, 1, 1, 520
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Motivational Speakers', 'motivational-speakers', 4, id, '#E8553D', 1, 1, 1, 530
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Offsite Planners', 'offsite-planners', 4, id, '#E8553D', 1, 1, 1, 540
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Outdoor Team Building', 'outdoor-team-building', 4, id, '#E8553D', 1, 1, 1, 550
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Painting Team Building', 'painting-team-building', 4, id, '#E8553D', 1, 1, 1, 560
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pop-Up Event Producers', 'pop-up-event-producers', 4, id, '#E8553D', 1, 1, 1, 570
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Press Event Producers', 'press-event-producers', 4, id, '#E8553D', 1, 1, 1, 580
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Product Launch Event Producers', 'product-launch-event-producers', 4, id, '#E8553D', 1, 1, 1, 590
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Promotional Models', 'promotional-models', 4, id, '#E8553D', 1, 1, 1, 600
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Quarterly Business Review Planners', 'quarterly-business-review-planners', 4, id, '#E8553D', 1, 1, 1, 610
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Remote Team Building', 'remote-team-building', 4, id, '#E8553D', 1, 1, 1, 620
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Roadshow Producers', 'roadshow-producers', 4, id, '#E8553D', 1, 1, 1, 630
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales Kick-Off Planners', 'sales-kick-off-planners', 4, id, '#E8553D', 1, 1, 1, 640
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sampling Campaign Agencies', 'sampling-campaign-agencies', 4, id, '#E8553D', 1, 1, 1, 650
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Speakers Bureau', 'speakers-bureau', 4, id, '#E8553D', 1, 1, 1, 660
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Specialty Performer Bookers', 'specialty-performer-bookers', 4, id, '#E8553D', 1, 1, 1, 670
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Spokesmodels', 'spokesmodels', 4, id, '#E8553D', 1, 1, 1, 680
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sports Team Building', 'sports-team-building', 4, id, '#E8553D', 1, 1, 1, 690
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Stage Design Companies', 'stage-design-companies', 4, id, '#E8553D', 1, 1, 1, 700
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Stewardship Event Producers', 'stewardship-event-producers', 4, id, '#E8553D', 1, 1, 1, 710
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Stilt Walker Bookers', 'stilt-walker-bookers', 4, id, '#E8553D', 1, 1, 1, 720
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Strategic Planning Offsite Facilitators', 'strategic-planning-offsite-facilitators', 4, id, '#E8553D', 1, 1, 1, 730
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Street Team Marketing Agencies', 'street-team-marketing-agencies', 4, id, '#E8553D', 1, 1, 1, 740
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Team Building Companies', 'team-building-companies', 4, id, '#E8553D', 1, 1, 1, 750
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Town Hall Planners', 'town-hall-planners', 4, id, '#E8553D', 1, 1, 1, 760
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Virtual Team Building', 'virtual-team-building', 4, id, '#E8553D', 1, 1, 1, 770
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Virtual Town Hall Producers', 'virtual-town-hall-producers', 4, id, '#E8553D', 1, 1, 1, 780
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Visioning Offsite Facilitators', 'visioning-offsite-facilitators', 4, id, '#E8553D', 1, 1, 1, 790
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Volunteer Team Building', 'volunteer-team-building', 4, id, '#E8553D', 1, 1, 1, 800
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Webinar Producers', 'webinar-producers', 4, id, '#E8553D', 1, 1, 1, 810
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wedding Band Bookers', 'wedding-band-bookers', 4, id, '#E8553D', 1, 1, 1, 820
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wellness Speakers', 'wellness-speakers', 4, id, '#E8553D', 1, 1, 1, 830
  FROM categories WHERE slug = 'specialty-corporate-events' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Booth Staff Services', 'booth-staff-services', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'trade-show-exhibition-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Decorating Services for Trade Shows', 'decorating-services-for-trade-shows', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'trade-show-exhibition-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trade Show Booth Builders', 'trade-show-booth-builders', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'trade-show-exhibition-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trade Show Drayage Companies', 'trade-show-drayage-companies', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'trade-show-exhibition-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trade Show Lead Capture Services', 'trade-show-lead-capture-services', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'trade-show-exhibition-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trade Show Logistics Firms', 'trade-show-logistics-firms', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'trade-show-exhibition-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trade Show Models', 'trade-show-models', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'trade-show-exhibition-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trade Show Planners', 'trade-show-planners', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'trade-show-exhibition-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hybrid Event Producers', 'hybrid-event-producers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'virtual-hybrid-event-production' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Anti-Harassment Training', 'anti-harassment-training', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'compliance-mandatory-training' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Compliance Training Providers', 'compliance-training-providers', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'compliance-mandatory-training' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Diversity Training', 'diversity-training', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'compliance-mandatory-training' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ethics Training', 'ethics-training', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'compliance-mandatory-training' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'First Time Manager Training', 'first-time-manager-training', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'leadership-management-training' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Frontline Manager Training', 'frontline-manager-training', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'leadership-management-training' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Leadership Training Companies', 'leadership-training-companies', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'leadership-management-training' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Management Training Companies', 'management-training-companies', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'leadership-management-training' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mid-Level Manager Training', 'mid-level-manager-training', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'leadership-management-training' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales Manager Training', 'sales-manager-training', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'leadership-management-training' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales Onboarding Programs', 'sales-onboarding-programs', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'onboarding-employee-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Channel Sales Training', 'channel-sales-training', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'sales-customer-service-training' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Consultative Selling Training', 'consultative-selling-training', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'sales-customer-service-training' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Customer Service Training', 'customer-service-training', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'sales-customer-service-training' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Enterprise Sales Training', 'enterprise-sales-training', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'sales-customer-service-training' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Inside Sales Training', 'inside-sales-training', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'sales-customer-service-training' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SaaS Sales Training', 'saas-sales-training', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'sales-customer-service-training' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales Training Companies', 'sales-training-companies', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'sales-customer-service-training' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Solution Selling Training', 'solution-selling-training', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'sales-customer-service-training' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Soft Skills Training Companies', 'soft-skills-training-companies', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'soft-skills-communication-training' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Active Listening Training', 'active-listening-training', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Active Shooter Training', 'active-shooter-training', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Aerial Lift Training', 'aerial-lift-training', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Agile Training Companies', 'agile-training-companies', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Allergen Training', 'allergen-training', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Allyship Training', 'allyship-training', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Anti-Bribery Training', 'anti-bribery-training', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Anti-Corruption Training', 'anti-corruption-training', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Anti-Money Laundering Training', 'anti-money-laundering-training', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Anti-Racism Training', 'anti-racism-training', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bloodborne Pathogen Training', 'bloodborne-pathogen-training', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Burnout Prevention Training', 'burnout-prevention-training', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Acumen Training', 'business-acumen-training', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cloud Training Providers', 'cloud-training-providers', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Coaching Skills Training', 'coaching-skills-training', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Code of Conduct Training', 'code-of-conduct-training', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Confined Space Training', 'confined-space-training', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Conflict Resolution Training', 'conflict-resolution-training', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Corporate Training Companies', 'corporate-training-companies', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Creative Thinking Training', 'creative-thinking-training', 4, id, '#E8553D', 1, 1, 1, 200
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Critical Thinking Training', 'critical-thinking-training', 4, id, '#E8553D', 1, 1, 1, 210
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cross-Functional Collaboration Training', 'cross-functional-collaboration-training', 4, id, '#E8553D', 1, 1, 1, 220
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cultural Competence Training', 'cultural-competence-training', 4, id, '#E8553D', 1, 1, 1, 230
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Curriculum Developers', 'curriculum-developers', 4, id, '#E8553D', 1, 1, 1, 240
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Customer Experience Training', 'customer-experience-training', 4, id, '#E8553D', 1, 1, 1, 250
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'DAX Training', 'dax-training', 4, id, '#E8553D', 1, 1, 1, 260
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'DMAIC Training', 'dmaic-training', 4, id, '#E8553D', 1, 1, 1, 270
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Science Training', 'data-science-training', 4, id, '#E8553D', 1, 1, 1, 280
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'De-Escalation Training', 'de-escalation-training', 4, id, '#E8553D', 1, 1, 1, 290
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Decision Making Training', 'decision-making-training', 4, id, '#E8553D', 1, 1, 1, 300
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Design Thinking Training', 'design-thinking-training', 4, id, '#E8553D', 1, 1, 1, 310
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Difficult Conversations Training', 'difficult-conversations-training', 4, id, '#E8553D', 1, 1, 1, 320
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'E-Learning Developers', 'e-learning-developers', 4, id, '#E8553D', 1, 1, 1, 330
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Empathy Training', 'empathy-training', 4, id, '#E8553D', 1, 1, 1, 340
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Excel Training', 'excel-training', 4, id, '#E8553D', 1, 1, 1, 350
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Executive Development Programs', 'executive-development-programs', 4, id, '#E8553D', 1, 1, 1, 360
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fall Protection Training', 'fall-protection-training', 4, id, '#E8553D', 1, 1, 1, 370
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Feedback Training', 'feedback-training', 4, id, '#E8553D', 1, 1, 1, 380
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Finance for Non-Finance Training', 'finance-for-non-finance-training', 4, id, '#E8553D', 1, 1, 1, 390
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Financial Acumen Training', 'financial-acumen-training', 4, id, '#E8553D', 1, 1, 1, 400
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'First Aid Training', 'first-aid-training', 4, id, '#E8553D', 1, 1, 1, 410
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Forklift Operator Training', 'forklift-operator-training', 4, id, '#E8553D', 1, 1, 1, 420
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'G Suite Training', 'g-suite-training', 4, id, '#E8553D', 1, 1, 1, 430
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'GDPR Training', 'gdpr-training', 4, id, '#E8553D', 1, 1, 1, 440
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Generational Differences Training', 'generational-differences-training', 4, id, '#E8553D', 1, 1, 1, 450
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HACCP Training', 'haccp-training', 4, id, '#E8553D', 1, 1, 1, 460
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HIPAA Training', 'hipaa-training', 4, id, '#E8553D', 1, 1, 1, 470
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hazmat Training', 'hazmat-training', 4, id, '#E8553D', 1, 1, 1, 480
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Influence Training', 'influence-training', 4, id, '#E8553D', 1, 1, 1, 490
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Information Security Training', 'information-security-training', 4, id, '#E8553D', 1, 1, 1, 500
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Innovation Training', 'innovation-training', 4, id, '#E8553D', 1, 1, 1, 510
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Insider Trading Training', 'insider-trading-training', 4, id, '#E8553D', 1, 1, 1, 520
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Instructional Designers', 'instructional-designers', 4, id, '#E8553D', 1, 1, 1, 530
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'LGBTQ+ Inclusion Training', 'lgbtq-inclusion-training', 4, id, '#E8553D', 1, 1, 1, 540
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'LMS Implementation Consultants', 'lms-implementation-consultants', 4, id, '#E8553D', 1, 1, 1, 550
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lean Training', 'lean-training', 4, id, '#E8553D', 1, 1, 1, 560
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Learning Strategy Consultants', 'learning-strategy-consultants', 4, id, '#E8553D', 1, 1, 1, 570
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lockout Tagout Training', 'lockout-tagout-training', 4, id, '#E8553D', 1, 1, 1, 580
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'MEDDIC Training', 'meddic-training', 4, id, '#E8553D', 1, 1, 1, 590
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Machine Learning Training', 'machine-learning-training', 4, id, '#E8553D', 1, 1, 1, 600
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mentoring Skills Training', 'mentoring-skills-training', 4, id, '#E8553D', 1, 1, 1, 610
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Microaggressions Training', 'microaggressions-training', 4, id, '#E8553D', 1, 1, 1, 620
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Microsoft Office Training', 'microsoft-office-training', 4, id, '#E8553D', 1, 1, 1, 630
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mindfulness at Work Training', 'mindfulness-at-work-training', 4, id, '#E8553D', 1, 1, 1, 640
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Negotiation Training Companies', 'negotiation-training-companies', 4, id, '#E8553D', 1, 1, 1, 650
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'OSHA Training', 'osha-training', 4, id, '#E8553D', 1, 1, 1, 660
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Persuasion Training', 'persuasion-training', 4, id, '#E8553D', 1, 1, 1, 670
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Phishing Simulation Training', 'phishing-simulation-training', 4, id, '#E8553D', 1, 1, 1, 680
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Power BI Training', 'power-bi-training', 4, id, '#E8553D', 1, 1, 1, 690
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Presentation Skills Training', 'presentation-skills-training', 4, id, '#E8553D', 1, 1, 1, 700
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Privacy Training', 'privacy-training', 4, id, '#E8553D', 1, 1, 1, 710
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Problem Solving Training', 'problem-solving-training', 4, id, '#E8553D', 1, 1, 1, 720
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Product Owner Training', 'product-owner-training', 4, id, '#E8553D', 1, 1, 1, 730
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Productivity Training', 'productivity-training', 4, id, '#E8553D', 1, 1, 1, 740
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Prosci Training', 'prosci-training', 4, id, '#E8553D', 1, 1, 1, 750
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Public Speaking Training', 'public-speaking-training', 4, id, '#E8553D', 1, 1, 1, 760
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Python Training', 'python-training', 4, id, '#E8553D', 1, 1, 1, 770
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Resilience Training', 'resilience-training', 4, id, '#E8553D', 1, 1, 1, 780
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SAFe Training', 'safe-training', 4, id, '#E8553D', 1, 1, 1, 790
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SCORM Developers', 'scorm-developers', 4, id, '#E8553D', 1, 1, 1, 800
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SQL Training', 'sql-training', 4, id, '#E8553D', 1, 1, 1, 810
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sandler Training', 'sandler-training', 4, id, '#E8553D', 1, 1, 1, 820
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Scrum Master Training', 'scrum-master-training', 4, id, '#E8553D', 1, 1, 1, 830
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Self-Awareness Training', 'self-awareness-training', 4, id, '#E8553D', 1, 1, 1, 840
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Service Recovery Training', 'service-recovery-training', 4, id, '#E8553D', 1, 1, 1, 850
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Site Reliability Engineering Training', 'site-reliability-engineering-training', 4, id, '#E8553D', 1, 1, 1, 860
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Six Sigma Training', 'six-sigma-training', 4, id, '#E8553D', 1, 1, 1, 870
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Skills Mapping Consultants', 'skills-mapping-consultants', 4, id, '#E8553D', 1, 1, 1, 880
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Slack Training', 'slack-training', 4, id, '#E8553D', 1, 1, 1, 890
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Storytelling Training Companies', 'storytelling-training-companies', 4, id, '#E8553D', 1, 1, 1, 900
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Strategic Thinking Training', 'strategic-thinking-training', 4, id, '#E8553D', 1, 1, 1, 910
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Systems Thinking Training', 'systems-thinking-training', 4, id, '#E8553D', 1, 1, 1, 920
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tableau Training', 'tableau-training', 4, id, '#E8553D', 1, 1, 1, 930
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Train the Trainer Programs', 'train-the-trainer-programs', 4, id, '#E8553D', 1, 1, 1, 940
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Whistleblower Training', 'whistleblower-training', 4, id, '#E8553D', 1, 1, 1, 950
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Workplace Safety Training', 'workplace-safety-training', 4, id, '#E8553D', 1, 1, 1, 960
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Workplace Violence Training', 'workplace-violence-training', 4, id, '#E8553D', 1, 1, 1, 970
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'xAPI Developers', 'xapi-developers', 4, id, '#E8553D', 1, 1, 1, 980
  FROM categories WHERE slug = 'specialty-training-providers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'PMP Certification Prep', 'pmp-certification-prep', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'technical-professional-skills-training' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '529 Plan Advisors', '529-plan-advisors', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'college-education' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'College Funding Advisors', 'college-funding-advisors', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'college-education' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'College Savings Advisors', 'college-savings-advisors', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'college-education' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Student Loan Advisors', 'student-loan-advisors', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'college-education' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Credit Counselors', 'credit-counselors', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'debt-credit' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Credit Repair Services', 'credit-repair-services', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'debt-credit' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Debt Consolidation Services', 'debt-consolidation-services', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'debt-credit' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Debt Settlement Services', 'debt-settlement-services', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'debt-credit' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Family Wealth Counselors', 'family-wealth-counselors', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'debt-credit' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Premarital Financial Counselors', 'premarital-financial-counselors', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'debt-credit' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Charitable Giving Advisors', 'charitable-giving-advisors', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'estate-financial-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Estate Planners', 'estate-planners', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'estate-financial-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Legacy Planners', 'legacy-planners', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'estate-financial-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Legacy Planning Services', 'legacy-planning-services', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'estate-financial-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trust Advisors', 'trust-advisors', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'estate-financial-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Asian American Financial Advisors', 'asian-american-financial-advisors', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'financial-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Athlete Financial Advisors', 'athlete-financial-advisors', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'financial-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Comprehensive Financial Planning', 'comprehensive-financial-planning', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'financial-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Creator Financial Advisors', 'creator-financial-advisors', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'financial-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dentist Financial Advisors', 'dentist-financial-advisors', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'financial-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Engineer Financial Advisors', 'engineer-financial-advisors', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'financial-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fee-Only Financial Advisors', 'fee-only-financial-advisors', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'financial-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fiduciary Financial Advisors', 'fiduciary-financial-advisors', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'financial-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Financial Planners', 'financial-planners', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'financial-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'First Responder Financial Advisors', 'first-responder-financial-advisors', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'financial-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hispanic Financial Advisors', 'hispanic-financial-advisors', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'financial-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Independent Financial Advisors', 'independent-financial-advisors', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'financial-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Latinx Financial Advisors', 'latinx-financial-advisors', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'financial-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lawyer Financial Advisors', 'lawyer-financial-advisors', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'financial-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Physician Financial Advisors', 'physician-financial-advisors', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'financial-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Single Mother Financial Advisors', 'single-mother-financial-advisors', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'financial-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Startup Founder Financial Advisors', 'startup-founder-financial-advisors', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'financial-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tech Worker Financial Advisors', 'tech-worker-financial-advisors', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'financial-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Veteran Financial Advisors', 'veteran-financial-advisors', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'financial-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Disability Insurance Advisors', 'disability-insurance-advisors', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'insurance-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Disability Insurance Brokers', 'disability-insurance-brokers', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'insurance-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Insurance Planning Advisors', 'insurance-planning-advisors', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'insurance-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Long-Term Care Advisors', 'long-term-care-advisors', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'insurance-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Long-Term Care Insurance Specialists', 'long-term-care-insurance-specialists', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'insurance-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ACA Marketplace Brokers', 'aca-marketplace-brokers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'investment-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bond Brokers', 'bond-brokers', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'investment-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Group Health Brokers', 'group-health-brokers', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'investment-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Indexed Universal Life Brokers', 'indexed-universal-life-brokers', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'investment-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Insurance Brokers', 'insurance-brokers', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'investment-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Investment Advisors', 'investment-advisors', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'investment-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Medicare Brokers', 'medicare-brokers', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'investment-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Robo-Advisors', 'robo-advisors', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'investment-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Stock Brokers', 'stock-brokers', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'investment-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Variable Universal Life Brokers', 'variable-universal-life-brokers', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'investment-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Annuity Specialists', 'annuity-specialists', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Asset Allocation Specialists', 'asset-allocation-specialists', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Backdoor Roth Specialists', 'backdoor-roth-specialists', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Behavioral Finance Coaches', 'behavioral-finance-coaches', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CFP Professionals', 'cfp-professionals', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Captive Insurance Agents', 'captive-insurance-agents', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Concentrated Stock Specialists', 'concentrated-stock-specialists', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Crypto IRA Specialists', 'crypto-ira-specialists', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Debt Payoff Coaches', 'debt-payoff-coaches', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Debt Reduction Coaches', 'debt-reduction-coaches', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Doctor Wealth Management', 'doctor-wealth-management', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Early Retirement Specialists', 'early-retirement-specialists', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Education Funding Specialists', 'education-funding-specialists', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Equity Compensation Specialists', 'equity-compensation-specialists', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Executive Bonus Plan Specialists', 'executive-bonus-plan-specialists', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Financial Literacy Coaches', 'financial-literacy-coaches', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Income-Driven Repayment Specialists', 'income-driven-repayment-specialists', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Independent Insurance Agents', 'independent-insurance-agents', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Kids Financial Education Services', 'kids-financial-education-services', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Long-Term Disability Specialists', 'long-term-disability-specialists', 4, id, '#E8553D', 1, 1, 1, 200
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Medicare Planning Specialists', 'medicare-planning-specialists', 4, id, '#E8553D', 1, 1, 1, 210
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Money Coaches', 'money-coaches', 4, id, '#E8553D', 1, 1, 1, 220
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pension Maximization Specialists', 'pension-maximization-specialists', 4, id, '#E8553D', 1, 1, 1, 230
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Personal CFOs', 'personal-cfos', 4, id, '#E8553D', 1, 1, 1, 240
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Portfolio Rebalancing Services', 'portfolio-rebalancing-services', 4, id, '#E8553D', 1, 1, 1, 250
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'QCD Specialists', 'qcd-specialists', 4, id, '#E8553D', 1, 1, 1, 260
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'RIA Firms', 'ria-firms', 4, id, '#E8553D', 1, 1, 1, 270
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'RSU Tax Planning Specialists', 'rsu-tax-planning-specialists', 4, id, '#E8553D', 1, 1, 1, 280
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate IRA Specialists', 'real-estate-ira-specialists', 4, id, '#E8553D', 1, 1, 1, 290
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Required Minimum Distribution Specialists', 'required-minimum-distribution-specialists', 4, id, '#E8553D', 1, 1, 1, 300
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Split-Dollar Insurance Specialists', 'split-dollar-insurance-specialists', 4, id, '#E8553D', 1, 1, 1, 310
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Stock Option Exercise Specialists', 'stock-option-exercise-specialists', 4, id, '#E8553D', 1, 1, 1, 320
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tax-Loss Harvesting Specialists', 'tax-loss-harvesting-specialists', 4, id, '#E8553D', 1, 1, 1, 330
  FROM categories WHERE slug = 'other-financial-advisory-planning-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '401(k) Advisors', '401-k-advisors', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'retirement-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Annuity Advisors', 'annuity-advisors', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'retirement-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cash Flow Management Advisors', 'cash-flow-management-advisors', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'retirement-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Coast FIRE Advisors', 'coast-fire-advisors', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'retirement-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Donor-Advised Fund Advisors', 'donor-advised-fund-advisors', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'retirement-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Endowment Advisors', 'endowment-advisors', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'retirement-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Executive Compensation Advisors', 'executive-compensation-advisors', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'retirement-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'FIRE Movement Advisors', 'fire-movement-advisors', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'retirement-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Faith-Based Investing Advisors', 'faith-based-investing-advisors', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'retirement-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Generational Wealth Advisors', 'generational-wealth-advisors', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'retirement-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hybrid Advisors', 'hybrid-advisors', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'retirement-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IRA Advisors', 'ira-advisors', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'retirement-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Impact Investing Advisors', 'impact-investing-advisors', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'retirement-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Inheritance Advisors', 'inheritance-advisors', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'retirement-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lean FIRE Advisors', 'lean-fire-advisors', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'retirement-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lottery Winner Advisors', 'lottery-winner-advisors', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'retirement-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Multi-Family Office Advisors', 'multi-family-office-advisors', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'retirement-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pension Consultants', 'pension-consultants', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'retirement-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Public Service Loan Forgiveness Advisors', 'public-service-loan-forgiveness-advisors', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'retirement-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Retirement Planners', 'retirement-planners', 4, id, '#E8553D', 1, 1, 1, 200
  FROM categories WHERE slug = 'retirement-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SRI Advisors', 'sri-advisors', 4, id, '#E8553D', 1, 1, 1, 210
  FROM categories WHERE slug = 'retirement-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Social Security Advisors', 'social-security-advisors', 4, id, '#E8553D', 1, 1, 1, 220
  FROM categories WHERE slug = 'retirement-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Social Security Optimization Specialists', 'social-security-optimization-specialists', 4, id, '#E8553D', 1, 1, 1, 230
  FROM categories WHERE slug = 'retirement-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sustainable Investing Advisors', 'sustainable-investing-advisors', 4, id, '#E8553D', 1, 1, 1, 240
  FROM categories WHERE slug = 'retirement-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Chartered Financial Analysts', 'chartered-financial-analysts', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'specialty-advisors' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cryptocurrency Financial Advisors', 'cryptocurrency-financial-advisors', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'specialty-advisors' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Divorce Financial Analysts', 'divorce-financial-analysts', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'specialty-advisors' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Investment Advisors', 'real-estate-investment-advisors', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'specialty-advisors' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Small Business Financial Advisors', 'small-business-financial-advisors', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'specialty-advisors' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tax-Efficient Investment Advisors', 'tax-efficient-investment-advisors', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'specialty-advisors' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Family Office Services', 'family-office-services', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'wealth-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'High Net Worth Advisors', 'high-net-worth-advisors', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'wealth-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Inherited Wealth Advisors', 'inherited-wealth-advisors', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'wealth-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Portfolio Managers', 'portfolio-managers', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'wealth-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Private Foundation Advisors', 'private-foundation-advisors', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'wealth-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Private Wealth Advisors', 'private-wealth-advisors', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'wealth-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sudden Wealth Advisors', 'sudden-wealth-advisors', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'wealth-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wealth Managers', 'wealth-managers', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'wealth-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wealth Transfer Advisors', 'wealth-transfer-advisors', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'wealth-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Career Coaches', 'career-coaches', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'career-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Career Counselors', 'career-counselors', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'career-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Interview Coaches', 'interview-coaches', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'career-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'LinkedIn Profile Writers', 'linkedin-profile-writers', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'career-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Outplacement Services', 'outplacement-services', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'career-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Resume Writers', 'resume-writers', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'career-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Belonging Consultants', 'belonging-consultants', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'compensation-benefits' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Burnout Prevention Consultants', 'burnout-prevention-consultants', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'compensation-benefits' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Compensation Consultants', 'compensation-consultants', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'compensation-benefits' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Employee Listening Consultants', 'employee-listening-consultants', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'compensation-benefits' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Equity Compensation Advisors', 'equity-compensation-advisors', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'compensation-benefits' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HR Operations Consultants', 'hr-operations-consultants', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'compensation-benefits' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HRIS Implementation Consultants', 'hris-implementation-consultants', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'compensation-benefits' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Inclusion Consulting', 'inclusion-consulting', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'compensation-benefits' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Job Evaluation Consultants', 'job-evaluation-consultants', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'compensation-benefits' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Stop-Loss Consultants', 'stop-loss-consultants', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'compensation-benefits' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Total Rewards Consultants', 'total-rewards-consultants', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'compensation-benefits' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Working Parent Consultants', 'working-parent-consultants', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'compensation-benefits' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '401(k) Consultants', '401-k-consultants', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Accounting Recruiters', 'accounting-recruiters', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Aerospace Recruiters', 'aerospace-recruiters', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Allied Health Recruiters', 'allied-health-recruiters', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Backend Developer Recruiters', 'backend-developer-recruiters', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Beauty Industry Recruiters', 'beauty-industry-recruiters', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Biotech Recruiters', 'biotech-recruiters', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Board Search Consultants', 'board-search-consultants', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Board Search Firms', 'board-search-firms', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'C-Suite Recruiters', 'c-suite-recruiters', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'C-Suite Search Firms', 'c-suite-search-firms', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CHRO Search Firms', 'chro-search-firms', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cleared Talent Recruiters', 'cleared-talent-recruiters', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Clinical Trial Recruiters', 'clinical-trial-recruiters', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Construction Recruiters', 'construction-recruiters', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Contingent Search Firms', 'contingent-search-firms', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Customer Success Recruiters', 'customer-success-recruiters', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Customer Support Recruiters', 'customer-support-recruiters', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Scientist Recruiters', 'data-scientist-recruiters', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Defense Recruiters', 'defense-recruiters', 4, id, '#E8553D', 1, 1, 1, 200
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Demand Gen Recruiters', 'demand-gen-recruiters', 4, id, '#E8553D', 1, 1, 1, 210
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'DevOps Recruiters', 'devops-recruiters', 4, id, '#E8553D', 1, 1, 1, 220
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ERG Consultants', 'erg-consultants', 4, id, '#E8553D', 1, 1, 1, 230
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ESOP Consultants', 'esop-consultants', 4, id, '#E8553D', 1, 1, 1, 240
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Education Recruiters', 'education-recruiters', 4, id, '#E8553D', 1, 1, 1, 250
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Embedded Recruiters', 'embedded-recruiters', 4, id, '#E8553D', 1, 1, 1, 260
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Energy Recruiters', 'energy-recruiters', 4, id, '#E8553D', 1, 1, 1, 270
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Engineering Recruiters', 'engineering-recruiters', 4, id, '#E8553D', 1, 1, 1, 280
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Enterprise Sales Recruiters', 'enterprise-sales-recruiters', 4, id, '#E8553D', 1, 1, 1, 290
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Executive Search Firms', 'executive-search-firms', 4, id, '#E8553D', 1, 1, 1, 300
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fashion Recruiters', 'fashion-recruiters', 4, id, '#E8553D', 1, 1, 1, 310
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Federal Recruiters', 'federal-recruiters', 4, id, '#E8553D', 1, 1, 1, 320
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Finance Recruiters', 'finance-recruiters', 4, id, '#E8553D', 1, 1, 1, 330
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Foundation Recruiters', 'foundation-recruiters', 4, id, '#E8553D', 1, 1, 1, 340
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Frontend Developer Recruiters', 'frontend-developer-recruiters', 4, id, '#E8553D', 1, 1, 1, 350
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Government Recruiters', 'government-recruiters', 4, id, '#E8553D', 1, 1, 1, 360
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HR Tech Stack Consultants', 'hr-tech-stack-consultants', 4, id, '#E8553D', 1, 1, 1, 370
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Healthcare Recruiters', 'healthcare-recruiters', 4, id, '#E8553D', 1, 1, 1, 380
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Higher Ed Recruiters', 'higher-ed-recruiters', 4, id, '#E8553D', 1, 1, 1, 390
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hospitality Recruiters', 'hospitality-recruiters', 4, id, '#E8553D', 1, 1, 1, 400
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hotel Recruiters', 'hotel-recruiters', 4, id, '#E8553D', 1, 1, 1, 410
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'K-12 Teacher Recruiters', 'k-12-teacher-recruiters', 4, id, '#E8553D', 1, 1, 1, 420
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Layoff Consulting', 'layoff-consulting', 4, id, '#E8553D', 1, 1, 1, 430
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Legal Recruiters', 'legal-recruiters', 4, id, '#E8553D', 1, 1, 1, 440
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketing Recruiters', 'marketing-recruiters', 4, id, '#E8553D', 1, 1, 1, 450
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'MedTech Recruiters', 'medtech-recruiters', 4, id, '#E8553D', 1, 1, 1, 460
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Nonprofit Recruiters', 'nonprofit-recruiters', 4, id, '#E8553D', 1, 1, 1, 470
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Nursing Recruiters', 'nursing-recruiters', 4, id, '#E8553D', 1, 1, 1, 480
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Oil & Gas Recruiters', 'oil-gas-recruiters', 4, id, '#E8553D', 1, 1, 1, 490
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Onboarding Consultants', 'onboarding-consultants', 4, id, '#E8553D', 1, 1, 1, 500
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Operations Recruiters', 'operations-recruiters', 4, id, '#E8553D', 1, 1, 1, 510
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Oracle Recruiters', 'oracle-recruiters', 4, id, '#E8553D', 1, 1, 1, 520
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'PBM Consultants', 'pbm-consultants', 4, id, '#E8553D', 1, 1, 1, 530
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pharma Recruiters', 'pharma-recruiters', 4, id, '#E8553D', 1, 1, 1, 540
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Physician Recruiters', 'physician-recruiters', 4, id, '#E8553D', 1, 1, 1, 550
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Product Designer Recruiters', 'product-designer-recruiters', 4, id, '#E8553D', 1, 1, 1, 560
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Product Manager Recruiters', 'product-manager-recruiters', 4, id, '#E8553D', 1, 1, 1, 570
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Property Management Recruiters', 'property-management-recruiters', 4, id, '#E8553D', 1, 1, 1, 580
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Recruiters', 'real-estate-recruiters', 4, id, '#E8553D', 1, 1, 1, 590
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Restaurant Recruiters', 'restaurant-recruiters', 4, id, '#E8553D', 1, 1, 1, 600
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Retail Recruiters', 'retail-recruiters', 4, id, '#E8553D', 1, 1, 1, 610
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Retained Search Firms', 'retained-search-firms', 4, id, '#E8553D', 1, 1, 1, 620
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SAP Recruiters', 'sap-recruiters', 4, id, '#E8553D', 1, 1, 1, 630
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Salesforce Recruiters', 'salesforce-recruiters', 4, id, '#E8553D', 1, 1, 1, 640
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Security Engineer Recruiters', 'security-engineer-recruiters', 4, id, '#E8553D', 1, 1, 1, 650
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Severance Consulting', 'severance-consulting', 4, id, '#E8553D', 1, 1, 1, 660
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Skilled Trades Recruiters', 'skilled-trades-recruiters', 4, id, '#E8553D', 1, 1, 1, 670
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Software Engineer Recruiters', 'software-engineer-recruiters', 4, id, '#E8553D', 1, 1, 1, 680
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'UX Researcher Recruiters', 'ux-researcher-recruiters', 4, id, '#E8553D', 1, 1, 1, 690
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'VP Engineering Search Firms', 'vp-engineering-search-firms', 4, id, '#E8553D', 1, 1, 1, 700
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'VP Product Search Firms', 'vp-product-search-firms', 4, id, '#E8553D', 1, 1, 1, 710
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'VP Sales Search Firms', 'vp-sales-search-firms', 4, id, '#E8553D', 1, 1, 1, 720
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Workday Recruiters', 'workday-recruiters', 4, id, '#E8553D', 1, 1, 1, 730
  FROM categories WHERE slug = 'executive-search' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Career Transition Services', 'career-transition-services', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'hr-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cash Balance Plan Consultants', 'cash-balance-plan-consultants', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'hr-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Employee Handbook Writers', 'employee-handbook-writers', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'hr-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Exit Interview Services', 'exit-interview-services', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'hr-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fractional HR Services', 'fractional-hr-services', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'hr-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HR Compliance Consultants', 'hr-compliance-consultants', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'hr-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HR Consulting Firms', 'hr-consulting-firms', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'hr-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HR Outsourcing Services', 'hr-outsourcing-services', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'hr-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'New Hire Experience Consultants', 'new-hire-experience-consultants', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'hr-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'PEO Services', 'peo-services', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'hr-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Strategic HR Consultants', 'strategic-hr-consultants', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'hr-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Talent Mapping Services', 'talent-mapping-services', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'hr-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Workplace Culture Consultants', 'workplace-culture-consultants', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'hr-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Workplace Investigations', 'workplace-investigations', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'hr-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Allyship Training Providers', 'allyship-training-providers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Anti-Racism Consultants', 'anti-racism-consultants', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Apprenticeship Programs', 'apprenticeship-programs', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bias Reduction Consultants', 'bias-reduction-consultants', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Career Site Designers', 'career-site-designers', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Caregiver Support Consultants', 'caregiver-support-consultants', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Caregiving Benefit Consultants', 'caregiving-benefit-consultants', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Competitive Intelligence for Talent', 'competitive-intelligence-for-talent', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Continuous Feedback Consultants', 'continuous-feedback-consultants', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Culture Assessment Firms', 'culture-assessment-firms', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Culture Audit Firms', 'culture-audit-firms', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'DEI Consulting Firms', 'dei-consulting-firms', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Defined Benefit Plan Consultants', 'defined-benefit-plan-consultants', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Employee Advocacy Consultants', 'employee-advocacy-consultants', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Employee Benefits Brokers', 'employee-benefits-brokers', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Employee Net Promoter Score Consultants', 'employee-net-promoter-score-consultants', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Employer Branding Consultants', 'employer-branding-consultants', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Engagement Survey Consultants', 'engagement-survey-consultants', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Equity Audit Firms', 'equity-audit-firms', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fertility Benefit Consultants', 'fertility-benefit-consultants', 4, id, '#E8553D', 1, 1, 1, 200
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Financial Wellness Benefit Consultants', 'financial-wellness-benefit-consultants', 4, id, '#E8553D', 1, 1, 1, 210
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'High-Potential Program Designers', 'high-potential-program-designers', 4, id, '#E8553D', 1, 1, 1, 220
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Job Architecture Consultants', 'job-architecture-consultants', 4, id, '#E8553D', 1, 1, 1, 230
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Job Description Writers', 'job-description-writers', 4, id, '#E8553D', 1, 1, 1, 240
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Job Leveling Consultants', 'job-leveling-consultants', 4, id, '#E8553D', 1, 1, 1, 250
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Leadership Pipeline Consultants', 'leadership-pipeline-consultants', 4, id, '#E8553D', 1, 1, 1, 260
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Long-Term Incentive Plan Consultants', 'long-term-incentive-plan-consultants', 4, id, '#E8553D', 1, 1, 1, 270
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mental Health at Work Consultants', 'mental-health-at-work-consultants', 4, id, '#E8553D', 1, 1, 1, 280
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mom Workforce Consultants', 'mom-workforce-consultants', 4, id, '#E8553D', 1, 1, 1, 290
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pay Equity Consultants', 'pay-equity-consultants', 4, id, '#E8553D', 1, 1, 1, 300
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pay Transparency Consultants', 'pay-transparency-consultants', 4, id, '#E8553D', 1, 1, 1, 310
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Performance Management Consultants', 'performance-management-consultants', 4, id, '#E8553D', 1, 1, 1, 320
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Performance Review Designers', 'performance-review-designers', 4, id, '#E8553D', 1, 1, 1, 330
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pet Insurance Benefit Consultants', 'pet-insurance-benefit-consultants', 4, id, '#E8553D', 1, 1, 1, 340
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'RPO Providers', 'rpo-providers', 4, id, '#E8553D', 1, 1, 1, 350
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Refugee Talent Programs', 'refugee-talent-programs', 4, id, '#E8553D', 1, 1, 1, 360
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Retirement Plan Consultants', 'retirement-plan-consultants', 4, id, '#E8553D', 1, 1, 1, 370
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Returnship Programs', 'returnship-programs-pro', 4, id, '#E8553D', 1, 1, 1, 380
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Salary Benchmarking Consultants', 'salary-benchmarking-consultants', 4, id, '#E8553D', 1, 1, 1, 390
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Self-Funded Health Plan Consultants', 'self-funded-health-plan-consultants', 4, id, '#E8553D', 1, 1, 1, 400
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Skills Gap Analysis Firms', 'skills-gap-analysis-firms', 4, id, '#E8553D', 1, 1, 1, 410
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Stock Plan Administrators', 'stock-plan-administrators', 4, id, '#E8553D', 1, 1, 1, 420
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Student Loan Benefit Consultants', 'student-loan-benefit-consultants', 4, id, '#E8553D', 1, 1, 1, 430
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Succession Planning Consultants', 'succession-planning-consultants', 4, id, '#E8553D', 1, 1, 1, 440
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Talent Review Facilitators', 'talent-review-facilitators', 4, id, '#E8553D', 1, 1, 1, 450
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Voluntary Benefits Consultants', 'voluntary-benefits-consultants', 4, id, '#E8553D', 1, 1, 1, 460
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Workplace Wellbeing Consultants', 'workplace-wellbeing-consultants', 4, id, '#E8553D', 1, 1, 1, 470
  FROM categories WHERE slug = 'other-hr-staffing-recruiting-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Background Check Services', 'background-check-services', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'pre-employment-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Drug Testing Services', 'drug-testing-services', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'pre-employment-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fingerprinting Services', 'fingerprinting-services', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'pre-employment-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pre-Employment Screening', 'pre-employment-screening', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'pre-employment-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Reference Check Services', 'reference-check-services', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'pre-employment-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Equity Plan Consultants', 'equity-plan-consultants', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'recruiting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Headhunters', 'headhunters', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'recruiting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Recruiting Firms', 'recruiting-firms', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'recruiting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Recruitment Process Outsourcing', 'recruitment-process-outsourcing', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'recruiting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sourcing Firms', 'sourcing-firms', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'recruiting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Talent Acquisition Consultants', 'talent-acquisition-consultants', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'recruiting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Construction Staffing', 'construction-staffing', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'staffing-agencies-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Finance & Accounting Staffing', 'finance-accounting-staffing', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'staffing-agencies-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hospitality Staffing', 'hospitality-staffing', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'staffing-agencies-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Light Industrial Staffing', 'light-industrial-staffing', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'staffing-agencies-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Locum Tenens Agencies', 'locum-tenens-agencies', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'staffing-agencies-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Manufacturing Recruiters', 'manufacturing-recruiters', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'staffing-agencies-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Manufacturing Staffing', 'manufacturing-staffing', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'staffing-agencies-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Per Diem Nursing Agencies', 'per-diem-nursing-agencies', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'staffing-agencies-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Permanent Placement Agencies', 'permanent-placement-agencies', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'staffing-agencies-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Recruitment Marketing Agencies', 'recruitment-marketing-agencies', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'staffing-agencies-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Staffing Agencies', 'staffing-agencies-2', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'staffing-agencies-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Temp Agencies', 'temp-agencies', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'staffing-agencies-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Travel Nurse Agencies', 'travel-nurse-agencies', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'staffing-agencies-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Claims Consultants', 'claims-consultants', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'claims-adjusting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Insurance Adjusters', 'insurance-adjusters', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'claims-adjusting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Insurance Loss Consultants', 'insurance-loss-consultants', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'claims-adjusting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Employee Benefits Consultants', 'employee-benefits-consultants', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'insurance-brokers-agents' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Group Benefits Brokers', 'group-benefits-brokers', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'insurance-brokers-agents' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Independent Insurance Agents', 'independent-insurance-agents-2', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'insurance-brokers-agents' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Insurance Brokers', 'insurance-brokers-2', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'insurance-brokers-agents' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Actuaries', 'actuaries', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'risk-actuarial' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Captive Insurance Consultants', 'captive-insurance-consultants', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'risk-actuarial' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Insurance Risk Advisors', 'insurance-risk-advisors', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'risk-actuarial' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Risk Management Consultants', 'risk-management-consultants-2', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'risk-actuarial' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Aviation Insurance Brokers', 'aviation-insurance-brokers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'specialty-lines' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bonds & Surety Brokers', 'bonds-surety-brokers', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'specialty-lines' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Entertainment Insurance Brokers', 'entertainment-insurance-brokers', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'specialty-lines' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marine Insurance Brokers', 'marine-insurance-brokers', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'specialty-lines' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Professional Liability Brokers', 'professional-liability-brokers', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'specialty-lines' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Workers Compensation Brokers', 'workers-compensation-brokers', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'specialty-lines' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cell Phone Data Recovery', 'cell-phone-data-recovery', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'digital-forensics-cyber-investigation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Computer Forensics Examiners', 'computer-forensics-examiners', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'digital-forensics-cyber-investigation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Digital Forensics Investigators', 'digital-forensics-investigators', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'digital-forensics-cyber-investigation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Disability Fraud Investigators', 'disability-fraud-investigators', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'forensic-accounting-fraud' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Insurance Fraud Investigators', 'insurance-fraud-investigators', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'forensic-accounting-fraud' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Workers Comp Fraud Investigators', 'workers-comp-fraud-investigators', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'forensic-accounting-fraud' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Deposition Reporters', 'deposition-reporters', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'legal-litigation-support-investigation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Expert Witnesses', 'expert-witnesses', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'legal-litigation-support-investigation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Licensed Private Investigators', 'licensed-private-investigators', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'private-investigators' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pre-Marital Background Investigators', 'pre-marital-background-investigators', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'private-investigators' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Accident Reconstruction Engineers', 'accident-reconstruction-engineers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Arbitration Reporters', 'arbitration-reporters', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Arson Investigators', 'arson-investigators', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Audio Transcription Services', 'audio-transcription-services', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Black Box Data Experts', 'black-box-data-experts', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brand Protection Investigators', 'brand-protection-investigators', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Interruption Experts', 'business-interruption-experts', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CVSA Examiners', 'cvsa-examiners', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Catfishing Investigators', 'catfishing-investigators', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cheating Spouse Investigators', 'cheating-spouse-investigators', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Child Custody Investigators', 'child-custody-investigators', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Construction Claims Experts', 'construction-claims-experts', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Corporate Espionage Investigators', 'corporate-espionage-investigators', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Counterfeit Investigators', 'counterfeit-investigators', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Court Reporters', 'court-reporters', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Crash Data Recorder Experts', 'crash-data-recorder-experts', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Credit Check Services', 'credit-check-services', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Criminal Records Search Services', 'criminal-records-search-services', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Damage Calculation Experts', 'damage-calculation-experts', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Delay Claims Experts', 'delay-claims-experts', 4, id, '#E8553D', 1, 1, 1, 200
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Domestic Investigators', 'domestic-investigators', 4, id, '#E8553D', 1, 1, 1, 210
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'E-Discovery Investigators', 'e-discovery-investigators', 4, id, '#E8553D', 1, 1, 1, 220
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Education Verification Services', 'education-verification-services', 4, id, '#E8553D', 1, 1, 1, 230
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Email Forensics Investigators', 'email-forensics-investigators', 4, id, '#E8553D', 1, 1, 1, 240
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Employment Verification Services', 'employment-verification-services', 4, id, '#E8553D', 1, 1, 1, 250
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Eviction Notice Servers', 'eviction-notice-servers', 4, id, '#E8553D', 1, 1, 1, 260
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fire Origin Investigators', 'fire-origin-investigators', 4, id, '#E8553D', 1, 1, 1, 270
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Forensic Auditors', 'forensic-auditors', 4, id, '#E8553D', 1, 1, 1, 280
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Forensic Engineers', 'forensic-engineers-2', 4, id, '#E8553D', 1, 1, 1, 290
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Forensic Examiners', 'forensic-examiners', 4, id, '#E8553D', 1, 1, 1, 300
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Forensic Valuation Experts', 'forensic-valuation-experts', 4, id, '#E8553D', 1, 1, 1, 310
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Forgery Examiners', 'forgery-examiners', 4, id, '#E8553D', 1, 1, 1, 320
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'GPS Tracking Investigators', 'gps-tracking-investigators', 4, id, '#E8553D', 1, 1, 1, 330
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Handwriting Examiners', 'handwriting-examiners', 4, id, '#E8553D', 1, 1, 1, 340
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hard-to-Serve Specialists', 'hard-to-serve-specialists', 4, id, '#E8553D', 1, 1, 1, 350
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hearing Reporters', 'hearing-reporters', 4, id, '#E8553D', 1, 1, 1, 360
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hidden Asset Investigators', 'hidden-asset-investigators', 4, id, '#E8553D', 1, 1, 1, 370
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Identity Verification Services', 'identity-verification-services', 4, id, '#E8553D', 1, 1, 1, 380
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Industrial Accident Investigators', 'industrial-accident-investigators', 4, id, '#E8553D', 1, 1, 1, 390
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Infidelity Investigators', 'infidelity-investigators', 4, id, '#E8553D', 1, 1, 1, 400
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Intellectual Property Investigators', 'intellectual-property-investigators', 4, id, '#E8553D', 1, 1, 1, 410
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'License Verification Services', 'license-verification-services', 4, id, '#E8553D', 1, 1, 1, 420
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lie Detector Test Services', 'lie-detector-test-services', 4, id, '#E8553D', 1, 1, 1, 430
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Life Care Plan Experts', 'life-care-plan-experts', 4, id, '#E8553D', 1, 1, 1, 440
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lost Profits Experts', 'lost-profits-experts', 4, id, '#E8553D', 1, 1, 1, 450
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mediation Reporters', 'mediation-reporters', 4, id, '#E8553D', 1, 1, 1, 460
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile Forensics Examiners', 'mobile-forensics-examiners', 4, id, '#E8553D', 1, 1, 1, 470
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Network Forensics Examiners', 'network-forensics-examiners', 4, id, '#E8553D', 1, 1, 1, 480
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Online Dating Verification Services', 'online-dating-verification-services', 4, id, '#E8553D', 1, 1, 1, 490
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Polygraph Examiners', 'polygraph-examiners', 4, id, '#E8553D', 1, 1, 1, 500
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Premises Liability Investigators', 'premises-liability-investigators', 4, id, '#E8553D', 1, 1, 1, 510
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Process Servers', 'process-servers', 4, id, '#E8553D', 1, 1, 1, 520
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Professional Verification Services', 'professional-verification-services', 4, id, '#E8553D', 1, 1, 1, 530
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Reference Check Services', 'reference-check-services-2', 4, id, '#E8553D', 1, 1, 1, 540
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Restraining Order Servers', 'restraining-order-servers', 4, id, '#E8553D', 1, 1, 1, 550
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Romance Scam Investigators', 'romance-scam-investigators', 4, id, '#E8553D', 1, 1, 1, 560
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sex Offender Registry Searches', 'sex-offender-registry-searches', 4, id, '#E8553D', 1, 1, 1, 570
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sexual Harassment Investigators', 'sexual-harassment-investigators', 4, id, '#E8553D', 1, 1, 1, 580
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Signature Verification Experts', 'signature-verification-experts', 4, id, '#E8553D', 1, 1, 1, 590
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Slip and Fall Investigators', 'slip-and-fall-investigators', 4, id, '#E8553D', 1, 1, 1, 600
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Stenographers', 'stenographers', 4, id, '#E8553D', 1, 1, 1, 610
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Subpoena Servers', 'subpoena-servers', 4, id, '#E8553D', 1, 1, 1, 620
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Title VII Investigators', 'title-vii-investigators', 4, id, '#E8553D', 1, 1, 1, 630
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trade Secret Theft Investigators', 'trade-secret-theft-investigators', 4, id, '#E8553D', 1, 1, 1, 640
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trademark Infringement Investigators', 'trademark-infringement-investigators', 4, id, '#E8553D', 1, 1, 1, 650
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trial Reporters', 'trial-reporters', 4, id, '#E8553D', 1, 1, 1, 660
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vehicle Accident Reconstructionists', 'vehicle-accident-reconstructionists', 4, id, '#E8553D', 1, 1, 1, 670
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Whistleblower Investigators', 'whistleblower-investigators', 4, id, '#E8553D', 1, 1, 1, 680
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Workplace Investigators', 'workplace-investigators', 4, id, '#E8553D', 1, 1, 1, 690
  FROM categories WHERE slug = 'specialty-investigation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Background Check Companies', 'background-check-companies', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'surveillance-background-checks' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Healthcare Background Check Services', 'healthcare-background-check-services', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'surveillance-background-checks' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile Surveillance Teams', 'mobile-surveillance-teams', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'surveillance-background-checks' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pre-Employment Background Check Services', 'pre-employment-background-check-services', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'surveillance-background-checks' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Surveillance Investigators', 'surveillance-investigators', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'surveillance-background-checks' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Volunteer Background Check Services', 'volunteer-background-check-services', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'surveillance-background-checks' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Equity Capital Markets Advisors', 'equity-capital-markets-advisors', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'capital-markets-underwriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Boutique Investment Banks', 'boutique-investment-banks', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'investment-banking-boutiques' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Middle Market Investment Banks', 'middle-market-investment-banks', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'investment-banking-boutiques' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Background Check for M&A', 'background-check-for-m-a', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'm-a-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cross-Border M&A Advisors', 'cross-border-m-a-advisors', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'm-a-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lower Middle Market M&A Advisors', 'lower-middle-market-m-a-advisors', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'm-a-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'M&A Advisory Firms', 'm-a-advisory-firms', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'm-a-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'M&A Brokers', 'm-a-brokers', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'm-a-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sell-Side M&A Advisors', 'sell-side-m-a-advisors', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'm-a-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Venture Debt Providers', 'venture-debt-providers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'private-equity-venture-capital' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bankruptcy Advisory Firms', 'bankruptcy-advisory-firms', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'restructuring-distressed' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Chief Restructuring Officers', 'chief-restructuring-officers', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'restructuring-distressed' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Distressed Debt Advisors', 'distressed-debt-advisors', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'restructuring-distressed' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Restructuring Advisors', 'restructuring-advisors', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'restructuring-distressed' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Turnaround Consultants', 'turnaround-consultants-2', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'restructuring-distressed' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ABL Lenders', 'abl-lenders', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Asset-Based Lenders', 'asset-based-lenders', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Brokers', 'business-brokers-2', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CMBS Brokers', 'cmbs-brokers', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Capital Raise Advisors', 'capital-raise-advisors', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cash-Out Refinance Specialists', 'cash-out-refinance-specialists', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Commercial Mortgage Brokers', 'commercial-mortgage-brokers', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Crisis Management Firms', 'crisis-management-firms', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'DSCR Loan Specialists', 'dscr-loan-specialists', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Debt Advisory Firms', 'debt-advisory-firms', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Down Payment Assistance Specialists', 'down-payment-assistance-specialists', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Equipment Finance Brokers', 'equipment-finance-brokers', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Equipment Leasing Companies', 'equipment-leasing-companies', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Factoring Companies', 'factoring-companies', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fairness Opinion Providers', 'fairness-opinion-providers', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Financial Due Diligence Firms', 'financial-due-diligence-firms', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'First-Time Buyer Mortgage Brokers', 'first-time-buyer-mortgage-brokers', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fix & Flip Lenders', 'fix-flip-lenders', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Foreign National Mortgage Brokers', 'foreign-national-mortgage-brokers', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HELOC Specialists', 'heloc-specialists', 4, id, '#E8553D', 1, 1, 1, 200
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hard Money Lenders', 'hard-money-lenders', 4, id, '#E8553D', 1, 1, 1, 210
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Independent Mortgage Brokers', 'independent-mortgage-brokers', 4, id, '#E8553D', 1, 1, 1, 220
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Independent Valuation Firms', 'independent-valuation-firms', 4, id, '#E8553D', 1, 1, 1, 230
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Interim Management Firms', 'interim-management-firms', 4, id, '#E8553D', 1, 1, 1, 240
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Inventory Financing', 'inventory-financing', 4, id, '#E8553D', 1, 1, 1, 250
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Investment Banking Firms', 'investment-banking-firms', 4, id, '#E8553D', 1, 1, 1, 260
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Invoice Factoring Services', 'invoice-factoring-services', 4, id, '#E8553D', 1, 1, 1, 270
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Merchant Cash Advance Brokers', 'merchant-cash-advance-brokers', 4, id, '#E8553D', 1, 1, 1, 280
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mortgage Refinance Specialists', 'mortgage-refinance-specialists', 4, id, '#E8553D', 1, 1, 1, 290
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Non-QM Mortgage Brokers', 'non-qm-mortgage-brokers', 4, id, '#E8553D', 1, 1, 1, 300
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Operational Due Diligence Firms', 'operational-due-diligence-firms', 4, id, '#E8553D', 1, 1, 1, 310
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Purchase Order Financing', 'purchase-order-financing', 4, id, '#E8553D', 1, 1, 1, 320
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Quality of Earnings Providers', 'quality-of-earnings-providers', 4, id, '#E8553D', 1, 1, 1, 330
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Recourse Factoring Services', 'recourse-factoring-services', 4, id, '#E8553D', 1, 1, 1, 340
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Revenue-Based Financing Lenders', 'revenue-based-financing-lenders-pro', 4, id, '#E8553D', 1, 1, 1, 350
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Reverse Mortgage Specialists', 'reverse-mortgage-specialists', 4, id, '#E8553D', 1, 1, 1, 360
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Royalty Financing Providers', 'royalty-financing-providers', 4, id, '#E8553D', 1, 1, 1, 370
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SBA Loan Brokers', 'sba-loan-brokers', 4, id, '#E8553D', 1, 1, 1, 380
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SBA Microloan Lenders', 'sba-microloan-lenders', 4, id, '#E8553D', 1, 1, 1, 390
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sanctions Screening Services', 'sanctions-screening-services', 4, id, '#E8553D', 1, 1, 1, 400
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Self-Employed Mortgage Brokers', 'self-employed-mortgage-brokers', 4, id, '#E8553D', 1, 1, 1, 410
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sell-Side QoE Providers', 'sell-side-qoe-providers', 4, id, '#E8553D', 1, 1, 1, 420
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trade Finance Providers', 'trade-finance-providers', 4, id, '#E8553D', 1, 1, 1, 430
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vendor Due Diligence Firms', 'vendor-due-diligence-firms', 4, id, '#E8553D', 1, 1, 1, 440
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wholesale Mortgage Brokers', 'wholesale-mortgage-brokers', 4, id, '#E8553D', 1, 1, 1, 450
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Workout Advisors', 'workout-advisors', 4, id, '#E8553D', 1, 1, 1, 460
  FROM categories WHERE slug = 'specialty-banking-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bankruptcy Attorneys', 'bankruptcy-attorneys', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'bankruptcy-debt' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Chapter 7 Lawyers', 'chapter-7-lawyers', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'bankruptcy-debt' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Collection Attorneys', 'collection-attorneys', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'bankruptcy-debt' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Condemnation Attorneys', 'condemnation-attorneys', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'bankruptcy-debt' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Debt Relief Attorneys', 'debt-relief-attorneys', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'bankruptcy-debt' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Innocent Spouse Relief Lawyers', 'innocent-spouse-relief-lawyers', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'bankruptcy-debt' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Post-Conviction Relief Attorneys', 'post-conviction-relief-attorneys', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'bankruptcy-debt' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Lawyers', 'business-lawyers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'business-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Commercial Arbitrators', 'commercial-arbitrators', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'business-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Commercial Litigation Lawyers', 'commercial-litigation-lawyers', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'business-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Commercial Tenant Lawyers', 'commercial-tenant-lawyers', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'business-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Contract Attorneys', 'contract-attorneys', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'business-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Corporate Law Attorneys', 'corporate-law-attorneys', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'business-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Franchise Lawyers', 'franchise-lawyers', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'business-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mergers & Acquisitions Lawyers', 'mergers-acquisitions-lawyers', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'business-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Nonprofit Lawyers', 'nonprofit-lawyers', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'business-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Partnership Lawyers', 'partnership-lawyers', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'business-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Securities Lawyers', 'securities-lawyers', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'business-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Variance Lawyers', 'variance-lawyers', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'business-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Agricultural Law Attorneys', 'agricultural-law-attorneys', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'civil-rights-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Appeals Lawyers', 'appeals-lawyers', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'civil-rights-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Appellate Attorneys', 'appellate-attorneys', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'civil-rights-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Arbitration & Mediation Lawyers', 'arbitration-mediation-lawyers', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'civil-rights-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Aviation Attorneys', 'aviation-attorneys', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'civil-rights-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cannabis Lawyers', 'cannabis-lawyers', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'civil-rights-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Civil Rights Attorneys', 'civil-rights-attorneys', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'civil-rights-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cryptocurrency Lawyers', 'cryptocurrency-lawyers', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'civil-rights-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Defamation Attorneys', 'defamation-attorneys', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'civil-rights-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Disability Discrimination Lawyers', 'disability-discrimination-lawyers', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'civil-rights-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Disability Rights Lawyers', 'disability-rights-lawyers', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'civil-rights-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Employee Benefits Lawyers', 'employee-benefits-lawyers', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'civil-rights-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Grandparents Rights Lawyers', 'grandparents-rights-lawyers', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'civil-rights-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Higher Education Lawyers', 'higher-education-lawyers', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'civil-rights-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Insurance Claim Lawyers', 'insurance-claim-lawyers', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'civil-rights-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Long Term Disability Lawyers', 'long-term-disability-lawyers', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'civil-rights-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Maritime & Admiralty Lawyers', 'maritime-admiralty-lawyers', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'civil-rights-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Maritime Injury Lawyers', 'maritime-injury-lawyers', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'civil-rights-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Naturalization Attorneys', 'naturalization-attorneys', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'civil-rights-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Reproductive Rights Lawyers', 'reproductive-rights-lawyers', 4, id, '#E8553D', 1, 1, 1, 200
  FROM categories WHERE slug = 'civil-rights-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Social Security Disability Lawyers', 'social-security-disability-lawyers', 4, id, '#E8553D', 1, 1, 1, 210
  FROM categories WHERE slug = 'civil-rights-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Special Education Attorneys', 'special-education-attorneys', 4, id, '#E8553D', 1, 1, 1, 220
  FROM categories WHERE slug = 'civil-rights-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tenant Rights Attorneys', 'tenant-rights-attorneys', 4, id, '#E8553D', 1, 1, 1, 230
  FROM categories WHERE slug = 'civil-rights-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Veterans Benefits Lawyers', 'veterans-benefits-lawyers', 4, id, '#E8553D', 1, 1, 1, 240
  FROM categories WHERE slug = 'civil-rights-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Visitation Rights Lawyers', 'visitation-rights-lawyers', 4, id, '#E8553D', 1, 1, 1, 250
  FROM categories WHERE slug = 'civil-rights-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Workers Comp Disability Lawyers', 'workers-comp-disability-lawyers', 4, id, '#E8553D', 1, 1, 1, 260
  FROM categories WHERE slug = 'civil-rights-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ADA Compliance Lawyers', 'ada-compliance-lawyers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Adult Industry Lawyers', 'adult-industry-lawyers', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Adverse Possession Lawyers', 'adverse-possession-lawyers', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Alimony Lawyers', 'alimony-lawyers', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Anti-Counterfeiting Attorneys', 'anti-counterfeiting-attorneys', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Anti-Kickback Lawyers', 'anti-kickback-lawyers', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Asbestos Mesothelioma Lawyers', 'asbestos-mesothelioma-lawyers', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Assault Defense Lawyers', 'assault-defense-lawyers', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Athlete Representation Lawyers', 'athlete-representation-lawyers', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Author & Publishing Attorneys', 'author-publishing-attorneys', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bank Fraud Defense Lawyers', 'bank-fraud-defense-lawyers', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Blockchain Attorneys', 'blockchain-attorneys', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Boundary Dispute Lawyers', 'boundary-dispute-lawyers', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Burglary Defense Lawyers', 'burglary-defense-lawyers', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Camp Lejeune Lawyers', 'camp-lejeune-lawyers', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Campaign Finance Attorneys', 'campaign-finance-attorneys', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Campus Sexual Misconduct Lawyers', 'campus-sexual-misconduct-lawyers', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Catastrophic Injury Lawyers', 'catastrophic-injury-lawyers', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Charitable Trust Lawyers', 'charitable-trust-lawyers', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Child Pornography Defense Lawyers', 'child-pornography-defense-lawyers', 4, id, '#E8553D', 1, 1, 1, 200
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Collective Bargaining Lawyers', 'collective-bargaining-lawyers', 4, id, '#E8553D', 1, 1, 1, 210
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Condo Association Attorneys', 'condo-association-attorneys', 4, id, '#E8553D', 1, 1, 1, 220
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Conservatorship Lawyers', 'conservatorship-lawyers', 4, id, '#E8553D', 1, 1, 1, 230
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Contractor Disputes Lawyers', 'contractor-disputes-lawyers', 4, id, '#E8553D', 1, 1, 1, 240
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Creator Lawyers', 'creator-lawyers', 4, id, '#E8553D', 1, 1, 1, 250
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Criminal Defense Lawyers', 'criminal-defense-lawyers', 4, id, '#E8553D', 1, 1, 1, 260
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cross-Border M&A Lawyers', 'cross-border-m-a-lawyers', 4, id, '#E8553D', 1, 1, 1, 270
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Crypto Legal Attorneys', 'crypto-legal-attorneys', 4, id, '#E8553D', 1, 1, 1, 280
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Customs Attorneys', 'customs-attorneys', 4, id, '#E8553D', 1, 1, 1, 290
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cybersecurity Lawyers', 'cybersecurity-lawyers', 4, id, '#E8553D', 1, 1, 1, 300
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'DACA Lawyers', 'daca-lawyers', 4, id, '#E8553D', 1, 1, 1, 310
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'DUI Lawyers', 'dui-lawyers', 4, id, '#E8553D', 1, 1, 1, 320
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Breach Attorneys', 'data-breach-attorneys', 4, id, '#E8553D', 1, 1, 1, 330
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Debt Settlement Lawyers', 'debt-settlement-lawyers', 4, id, '#E8553D', 1, 1, 1, 340
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Defective Product Lawyers', 'defective-product-lawyers', 4, id, '#E8553D', 1, 1, 1, 350
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Domain Name Dispute Lawyers', 'domain-name-dispute-lawyers', 4, id, '#E8553D', 1, 1, 1, 360
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Drug Crime Lawyers', 'drug-crime-lawyers', 4, id, '#E8553D', 1, 1, 1, 370
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Drug Trafficking Defense Attorneys', 'drug-trafficking-defense-attorneys', 4, id, '#E8553D', 1, 1, 1, 380
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Drunk Driving Lawyers', 'drunk-driving-lawyers', 4, id, '#E8553D', 1, 1, 1, 390
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'EB-2 NIW Lawyers', 'eb-2-niw-lawyers', 4, id, '#E8553D', 1, 1, 1, 400
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Easement Dispute Lawyers', 'easement-dispute-lawyers', 4, id, '#E8553D', 1, 1, 1, 410
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Embezzlement Defense Attorneys', 'embezzlement-defense-attorneys', 4, id, '#E8553D', 1, 1, 1, 420
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Eminent Domain Lawyers', 'eminent-domain-lawyers', 4, id, '#E8553D', 1, 1, 1, 430
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Equine Lawyers', 'equine-lawyers', 4, id, '#E8553D', 1, 1, 1, 440
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Export Control Lawyers', 'export-control-lawyers', 4, id, '#E8553D', 1, 1, 1, 450
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Expungement Attorneys', 'expungement-attorneys', 4, id, '#E8553D', 1, 1, 1, 460
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'FDA Regulatory Attorneys', 'fda-regulatory-attorneys', 4, id, '#E8553D', 1, 1, 1, 470
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'False Claims Act Attorneys', 'false-claims-act-attorneys', 4, id, '#E8553D', 1, 1, 1, 480
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'First Amendment Lawyers', 'first-amendment-lawyers', 4, id, '#E8553D', 1, 1, 1, 490
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fund Formation Lawyers', 'fund-formation-lawyers', 4, id, '#E8553D', 1, 1, 1, 500
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Going Public Lawyers', 'going-public-lawyers', 4, id, '#E8553D', 1, 1, 1, 510
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Government Relations Lawyers', 'government-relations-lawyers', 4, id, '#E8553D', 1, 1, 1, 520
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hair Relaxer Lawyers', 'hair-relaxer-lawyers', 4, id, '#E8553D', 1, 1, 1, 530
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Healthcare Lawyers', 'healthcare-lawyers', 4, id, '#E8553D', 1, 1, 1, 540
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hedge Fund Attorneys', 'hedge-fund-attorneys', 4, id, '#E8553D', 1, 1, 1, 550
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hemp & CBD Lawyers', 'hemp-cbd-lawyers', 4, id, '#E8553D', 1, 1, 1, 560
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IPO Attorneys', 'ipo-attorneys', 4, id, '#E8553D', 1, 1, 1, 570
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Inheritance Dispute Attorneys', 'inheritance-dispute-attorneys', 4, id, '#E8553D', 1, 1, 1, 580
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Investment Fund Lawyers', 'investment-fund-lawyers', 4, id, '#E8553D', 1, 1, 1, 590
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Joint Venture Attorneys', 'joint-venture-attorneys', 4, id, '#E8553D', 1, 1, 1, 600
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Jones Act Lawyers', 'jones-act-lawyers', 4, id, '#E8553D', 1, 1, 1, 610
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Juvenile Defense Attorneys', 'juvenile-defense-attorneys', 4, id, '#E8553D', 1, 1, 1, 620
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lease Drafting Attorneys', 'lease-drafting-attorneys', 4, id, '#E8553D', 1, 1, 1, 630
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Libel Lawyers', 'libel-lawyers', 4, id, '#E8553D', 1, 1, 1, 640
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Licensing Attorneys', 'licensing-attorneys', 4, id, '#E8553D', 1, 1, 1, 650
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Literary Agent Attorneys', 'literary-agent-attorneys', 4, id, '#E8553D', 1, 1, 1, 660
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Living Will Lawyers', 'living-will-lawyers', 4, id, '#E8553D', 1, 1, 1, 670
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Loan Modification Lawyers', 'loan-modification-lawyers', 4, id, '#E8553D', 1, 1, 1, 680
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lobbying Attorneys', 'lobbying-attorneys', 4, id, '#E8553D', 1, 1, 1, 690
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Longshore Act Lawyers', 'longshore-act-lawyers', 4, id, '#E8553D', 1, 1, 1, 700
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mechanics Lien Attorneys', 'mechanics-lien-attorneys', 4, id, '#E8553D', 1, 1, 1, 710
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Misdemeanor Defense Lawyers', 'misdemeanor-defense-lawyers', 4, id, '#E8553D', 1, 1, 1, 720
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Money Laundering Defense Lawyers', 'money-laundering-defense-lawyers', 4, id, '#E8553D', 1, 1, 1, 730
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Music Industry Lawyers', 'music-industry-lawyers', 4, id, '#E8553D', 1, 1, 1, 740
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'NLRB Attorneys', 'nlrb-attorneys', 4, id, '#E8553D', 1, 1, 1, 750
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Non-Disclosure Agreement Lawyers', 'non-disclosure-agreement-lawyers', 4, id, '#E8553D', 1, 1, 1, 760
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Nursing Home Abuse Lawyers', 'nursing-home-abuse-lawyers', 4, id, '#E8553D', 1, 1, 1, 770
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Order of Protection Attorneys', 'order-of-protection-attorneys', 4, id, '#E8553D', 1, 1, 1, 780
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Overtime Pay Attorneys', 'overtime-pay-attorneys', 4, id, '#E8553D', 1, 1, 1, 790
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pardon Application Lawyers', 'pardon-application-lawyers', 4, id, '#E8553D', 1, 1, 1, 800
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Privacy Lawyers', 'privacy-lawyers', 4, id, '#E8553D', 1, 1, 1, 810
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Private Equity Lawyers', 'private-equity-lawyers', 4, id, '#E8553D', 1, 1, 1, 820
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Public Company Lawyers', 'public-company-lawyers', 4, id, '#E8553D', 1, 1, 1, 830
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Public Policy Lawyers', 'public-policy-lawyers', 4, id, '#E8553D', 1, 1, 1, 840
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Quiet Title Lawyers', 'quiet-title-lawyers', 4, id, '#E8553D', 1, 1, 1, 850
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Reckless Driving Lawyers', 'reckless-driving-lawyers', 4, id, '#E8553D', 1, 1, 1, 860
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Record Sealing Lawyers', 'record-sealing-lawyers', 4, id, '#E8553D', 1, 1, 1, 870
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Refugee Lawyers', 'refugee-lawyers', 4, id, '#E8553D', 1, 1, 1, 880
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Restraining Order Lawyers', 'restraining-order-lawyers', 4, id, '#E8553D', 1, 1, 1, 890
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Restrictive Covenant Lawyers', 'restrictive-covenant-lawyers', 4, id, '#E8553D', 1, 1, 1, 900
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Revocable Trust Lawyers', 'revocable-trust-lawyers', 4, id, '#E8553D', 1, 1, 1, 910
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Robbery Defense Attorneys', 'robbery-defense-attorneys', 4, id, '#E8553D', 1, 1, 1, 920
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Roundup Lawyers', 'roundup-lawyers', 4, id, '#E8553D', 1, 1, 1, 930
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SEC Reporting Attorneys', 'sec-reporting-attorneys', 4, id, '#E8553D', 1, 1, 1, 940
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SSI Lawyers', 'ssi-lawyers', 4, id, '#E8553D', 1, 1, 1, 950
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'School Discipline Lawyers', 'school-discipline-lawyers', 4, id, '#E8553D', 1, 1, 1, 960
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Section 8 Eviction Lawyers', 'section-8-eviction-lawyers', 4, id, '#E8553D', 1, 1, 1, 970
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Severance Negotiation Lawyers', 'severance-negotiation-lawyers', 4, id, '#E8553D', 1, 1, 1, 980
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sex Crime Defense Lawyers', 'sex-crime-defense-lawyers', 4, id, '#E8553D', 1, 1, 1, 990
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Shareholder Dispute Attorneys', 'shareholder-dispute-attorneys', 4, id, '#E8553D', 1, 1, 1, 1000
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Slander Attorneys', 'slander-attorneys', 4, id, '#E8553D', 1, 1, 1, 1010
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Speeding Ticket Lawyers', 'speeding-ticket-lawyers', 4, id, '#E8553D', 1, 1, 1, 1020
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Startup Attorneys', 'startup-attorneys', 4, id, '#E8553D', 1, 1, 1, 1030
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Strategic Alliance Lawyers', 'strategic-alliance-lawyers', 4, id, '#E8553D', 1, 1, 1, 1040
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Subrogation Lawyers', 'subrogation-lawyers', 4, id, '#E8553D', 1, 1, 1, 1050
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Surrogacy Attorneys', 'surrogacy-attorneys', 4, id, '#E8553D', 1, 1, 1, 1060
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Talcum Powder Lawyers', 'talcum-powder-lawyers', 4, id, '#E8553D', 1, 1, 1, 1070
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Telehealth Lawyers', 'telehealth-lawyers', 4, id, '#E8553D', 1, 1, 1, 1080
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Television Industry Lawyers', 'television-industry-lawyers', 4, id, '#E8553D', 1, 1, 1, 1090
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Theft Defense Lawyers', 'theft-defense-lawyers', 4, id, '#E8553D', 1, 1, 1, 1100
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Title IX Defense Attorneys', 'title-ix-defense-attorneys', 4, id, '#E8553D', 1, 1, 1, 1110
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trade Secret Attorneys', 'trade-secret-attorneys', 4, id, '#E8553D', 1, 1, 1, 1120
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Traffic Ticket Lawyers', 'traffic-ticket-lawyers', 4, id, '#E8553D', 1, 1, 1, 1130
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trust Dispute Lawyers', 'trust-dispute-lawyers', 4, id, '#E8553D', 1, 1, 1, 1140
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Unpaid Wages Lawyers', 'unpaid-wages-lawyers', 4, id, '#E8553D', 1, 1, 1, 1150
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Venture Capital Lawyers', 'venture-capital-lawyers', 4, id, '#E8553D', 1, 1, 1, 1160
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Web3 Lawyers', 'web3-lawyers', 4, id, '#E8553D', 1, 1, 1, 1170
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Whistleblower Attorneys', 'whistleblower-attorneys', 4, id, '#E8553D', 1, 1, 1, 1180
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'White Collar Crime Lawyers', 'white-collar-crime-lawyers', 4, id, '#E8553D', 1, 1, 1, 1190
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Will Contest Attorneys', 'will-contest-attorneys', 4, id, '#E8553D', 1, 1, 1, 1200
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'iGaming Lawyers', 'igaming-lawyers', 4, id, '#E8553D', 1, 1, 1, 1210
  FROM categories WHERE slug = 'criminal-defense' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Employment Lawyers', 'employment-lawyers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'employment-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Labor Law Attorneys', 'labor-law-attorneys', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'employment-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Non-Compete Lawyers', 'non-compete-lawyers', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'employment-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pregnancy Discrimination Attorneys', 'pregnancy-discrimination-attorneys', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'employment-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Religious Discrimination Lawyers', 'religious-discrimination-lawyers', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'employment-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sexual Harassment Lawyers', 'sexual-harassment-lawyers', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'employment-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Stark Law Attorneys', 'stark-law-attorneys', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'employment-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wage & Hour Lawyers', 'wage-hour-lawyers', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'employment-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Workplace Discrimination Lawyers', 'workplace-discrimination-lawyers', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'employment-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Workplace Injury Lawyers', 'workplace-injury-lawyers', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'employment-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wrongful Termination Lawyers', 'wrongful-termination-lawyers', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'employment-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Antitrust Attorneys', 'antitrust-attorneys', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'estate-planning-probate' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Competition Law Lawyers', 'competition-law-lawyers', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'estate-planning-probate' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Constitutional Law Attorneys', 'constitutional-law-attorneys', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'estate-planning-probate' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Elder Law Attorneys', 'elder-law-attorneys', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'estate-planning-probate' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Election Law Lawyers', 'election-law-lawyers', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'estate-planning-probate' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Estate Planning Attorneys', 'estate-planning-attorneys', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'estate-planning-probate' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Long-Term Care Planning Attorneys', 'long-term-care-planning-attorneys', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'estate-planning-probate' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Medicaid Planning Attorneys', 'medicaid-planning-attorneys', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'estate-planning-probate' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Planning & Zoning Attorneys', 'planning-zoning-attorneys', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'estate-planning-probate' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Probate Attorneys', 'probate-attorneys', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'estate-planning-probate' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Special Needs Trust Attorneys', 'special-needs-trust-attorneys', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'estate-planning-probate' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trust Administration Attorneys', 'trust-administration-attorneys', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'estate-planning-probate' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trust Litigation Lawyers', 'trust-litigation-lawyers', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'estate-planning-probate' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Veterinary Law Attorneys', 'veterinary-law-attorneys', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'estate-planning-probate' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wills & Trusts Lawyers', 'wills-trusts-lawyers', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'estate-planning-probate' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Adoption Attorneys', 'adoption-attorneys', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'family-personal-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Animal Law Attorneys', 'animal-law-attorneys', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'family-personal-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Child Custody Lawyers', 'child-custody-lawyers', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'family-personal-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Child Support Lawyers', 'child-support-lawyers', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'family-personal-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Divorce Lawyers', 'divorce-lawyers', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'family-personal-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Domestic Violence Attorneys', 'domestic-violence-attorneys', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'family-personal-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'FMLA Attorneys', 'fmla-attorneys', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'family-personal-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Family Law Attorneys', 'family-law-attorneys', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'family-personal-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Family Law Mediators', 'family-law-mediators', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'family-personal-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Gambling Law Attorneys', 'gambling-law-attorneys', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'family-personal-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Guardianship Lawyers', 'guardianship-lawyers', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'family-personal-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Paternity Lawyers', 'paternity-lawyers', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'family-personal-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pharmacy Law Attorneys', 'pharmacy-law-attorneys', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'family-personal-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Prenuptial Agreement Lawyers', 'prenuptial-agreement-lawyers', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'family-personal-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Spousal Support Lawyers', 'spousal-support-lawyers', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'family-personal-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Asylum Lawyers', 'asylum-lawyers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'immigration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Citizenship Attorneys', 'citizenship-attorneys', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'immigration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Deportation Defense Lawyers', 'deportation-defense-lawyers', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'immigration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Green Card Attorneys', 'green-card-attorneys', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'immigration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hostile Work Environment Lawyers', 'hostile-work-environment-lawyers', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'immigration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Immigration Lawyers', 'immigration-lawyers', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'immigration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SPAC Attorneys', 'spac-attorneys', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'immigration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Visa Attorneys', 'visa-attorneys', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'immigration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Copyright Lawyers', 'copyright-lawyers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'intellectual-property' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Entertainment Lawyers', 'entertainment-lawyers', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'intellectual-property' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IP Litigation Attorneys', 'ip-litigation-attorneys', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'intellectual-property' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Patent Attorneys', 'patent-attorneys', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'intellectual-property' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sports Lawyers', 'sports-lawyers', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'intellectual-property' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trademark Attorneys', 'trademark-attorneys', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'intellectual-property' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Apostille Services', 'apostille-services', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'legal-support-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Court Reporters & Stenographers', 'court-reporters-stenographers', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'legal-support-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Legal Document Preparation', 'legal-document-preparation', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'legal-support-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Legal Translation Services', 'legal-translation-services', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'legal-support-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Notary Public Services', 'notary-public-services', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'legal-support-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Paralegal Services', 'paralegal-services', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'legal-support-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Process Servers', 'process-servers-2', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'legal-support-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Arbitrators', 'arbitrators', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'other-legal-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Civil Mediators', 'civil-mediators', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'other-legal-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Divorce Mediation Services', 'divorce-mediation-services', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'other-legal-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Divorce Mediators', 'divorce-mediators', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'other-legal-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hospital Counsel', 'hospital-counsel', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'other-legal-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Online Dispute Resolution Services', 'online-dispute-resolution-services', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'other-legal-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Workplace Mediators', 'workplace-mediators', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'other-legal-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '9/11 Victim Compensation Lawyers', '9-11-victim-compensation-lawyers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'personal-injury-accidents' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brain Injury Lawyers', 'brain-injury-lawyers', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'personal-injury-accidents' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Car Accident Lawyers', 'car-accident-lawyers', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'personal-injury-accidents' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Class Action Lawyers', 'class-action-lawyers', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'personal-injury-accidents' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dog Bite Lawyers', 'dog-bite-lawyers', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'personal-injury-accidents' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Executive Compensation Attorneys', 'executive-compensation-attorneys', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'personal-injury-accidents' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mass Tort Lawyers', 'mass-tort-lawyers', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'personal-injury-accidents' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Medical Device Lawyers', 'medical-device-lawyers', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'personal-injury-accidents' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Medical Malpractice Lawyers', 'medical-malpractice-lawyers', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'personal-injury-accidents' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Personal Injury Lawyers', 'personal-injury-lawyers', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'personal-injury-accidents' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pharmaceutical Liability Lawyers', 'pharmaceutical-liability-lawyers', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'personal-injury-accidents' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Premises Liability Lawyers', 'premises-liability-lawyers', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'personal-injury-accidents' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Product Liability Lawyers', 'product-liability-lawyers', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'personal-injury-accidents' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sanctions Lawyers', 'sanctions-lawyers', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'personal-injury-accidents' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Slip & Fall Lawyers', 'slip-fall-lawyers', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'personal-injury-accidents' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Spinal Cord Injury Lawyers', 'spinal-cord-injury-lawyers', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'personal-injury-accidents' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Toxic Tort Lawyers', 'toxic-tort-lawyers', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'personal-injury-accidents' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Workers Compensation Lawyers', 'workers-compensation-lawyers', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'personal-injury-accidents' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wrongful Death Lawyers', 'wrongful-death-lawyers', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'personal-injury-accidents' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Commercial Landlord Lawyers', 'commercial-landlord-lawyers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'real-estate-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Construction Arbitrators', 'construction-arbitrators', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'real-estate-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Construction Lawyers', 'construction-lawyers', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'real-estate-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Distribution Attorneys', 'distribution-attorneys', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'real-estate-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Estate Administration Lawyers', 'estate-administration-lawyers', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'real-estate-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Felony Defense Lawyers', 'felony-defense-lawyers', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'real-estate-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Foreclosure Defense Lawyers', 'foreclosure-defense-lawyers', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'real-estate-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Landlord Tenant Lawyers', 'landlord-tenant-lawyers', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'real-estate-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Property Lawyers', 'property-lawyers', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'real-estate-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Lawyers', 'real-estate-lawyers', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'real-estate-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wire Fraud Defense Attorneys', 'wire-fraud-defense-attorneys', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'real-estate-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Zoning & Land Use Attorneys', 'zoning-land-use-attorneys', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'real-estate-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HOA Lawyers', 'hoa-lawyers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'tax-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'NFT Attorneys', 'nft-attorneys', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'tax-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Qui Tam Lawyers', 'qui-tam-lawyers', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'tax-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'TPS Lawyers', 'tps-lawyers', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'tax-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tax Attorneys', 'tax-attorneys', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'tax-law' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Advertising Agencies', 'advertising-agencies-2', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'advertising-agencies-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Creative Agencies', 'creative-agencies-pro', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'advertising-agencies-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Direct Mail Advertising', 'direct-mail-advertising', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'advertising-agencies-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Magazine Advertising', 'magazine-advertising', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'advertising-agencies-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Native Advertising Studios', 'native-advertising-studios', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'advertising-agencies-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Newspaper Advertising', 'newspaper-advertising', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'advertising-agencies-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Radio Advertising', 'radio-advertising', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'advertising-agencies-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Television Advertising', 'television-advertising', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'advertising-agencies-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brand Strategy Consultants', 'brand-strategy-consultants', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'branding-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brand Strategy Firms', 'brand-strategy-firms', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'branding-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Branding Agencies', 'branding-agencies-pro', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'branding-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Graphic Designers', 'graphic-designers', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'branding-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Identity Design Firms', 'identity-design-firms', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'branding-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Industrial Designers', 'industrial-designers', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'branding-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Logo Design Firms', 'logo-design-firms', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'branding-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Logo Design Services', 'logo-design-services', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'branding-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Packaging Design Agencies', 'packaging-design-agencies', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'branding-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Packaging Design Firms', 'packaging-design-firms', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'branding-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Visual Identity Designers', 'visual-identity-designers', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'branding-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Visual Identity Firms', 'visual-identity-firms', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'branding-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Affiliate Marketing Agencies', 'affiliate-marketing-agencies-pro', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'digital-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Content Marketing Agencies', 'content-marketing-agencies-pro', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'digital-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Custom Publishing Agencies', 'custom-publishing-agencies', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'digital-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Digital Marketing Agencies', 'digital-marketing-agencies-pro', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'digital-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Influencer Marketing Agencies', 'influencer-marketing-agencies-pro', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'digital-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'PPC Advertising Agencies', 'ppc-advertising-agencies', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'digital-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SEO Agencies', 'seo-agencies-pro', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'digital-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Social Media Marketing Agencies', 'social-media-marketing-agencies', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'digital-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sponsored Content Agencies', 'sponsored-content-agencies', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'digital-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Event Marketing Agencies', 'event-marketing-agencies-pro', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'event-experiential' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trade Show Marketing', 'trade-show-marketing', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'event-experiential' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Foresight Consultants', 'foresight-consultants', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'full-service-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketing Agencies', 'marketing-agencies', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'full-service-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketing Consultants', 'marketing-consultants', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'full-service-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Consumer Insights Agencies', 'consumer-insights-agencies', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'market-research' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Focus Group Facilities', 'focus-group-facilities', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'market-research' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Market Research Firms', 'market-research-firms-2', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'market-research' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Survey Research Companies', 'survey-research-companies', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'market-research' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Media Buying Agencies', 'media-buying-agencies-pro', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'media-planning-buying' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Media Planning Agencies', 'media-planning-agencies', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'media-planning-buying' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Programmatic Advertising Agencies', 'programmatic-advertising-agencies-pro', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'media-planning-buying' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Annual Letter Writers', 'annual-letter-writers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Author PR Firms', 'author-pr-firms', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Awareness Tracking Firms', 'awareness-tracking-firms', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'B2B PR Firms', 'b2b-pr-firms', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Beauty PR Firms', 'beauty-pr-firms', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Book Publicists', 'book-publicists', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brand Architecture Firms', 'brand-architecture-firms', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brand Audit Firms', 'brand-audit-firms', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brand Film Studios', 'brand-film-studios', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brand Journalism Firms', 'brand-journalism-firms', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brand Voice Development Firms', 'brand-voice-development-firms', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Branded Content Studios', 'branded-content-studios', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Campaign Communications Firms', 'campaign-communications-firms', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cannabis PR Firms', 'cannabis-pr-firms', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Celebrity Publicists', 'celebrity-publicists', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Coalition Building Firms', 'coalition-building-firms', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Consumer PR Firms', 'consumer-pr-firms', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Content Calendar Services', 'content-calendar-services', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Crisis Drill Facilitators', 'crisis-drill-facilitators', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Crypto PR Firms', 'crypto-pr-firms', 4, id, '#E8553D', 1, 1, 1, 200
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cultural Insights Firms', 'cultural-insights-firms', 4, id, '#E8553D', 1, 1, 1, 210
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Design Strategy Firms', 'design-strategy-firms', 4, id, '#E8553D', 1, 1, 1, 220
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Direct Mail Political Firms', 'direct-mail-political-firms', 4, id, '#E8553D', 1, 1, 1, 230
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Documentary Production for Brands', 'documentary-production-for-brands', 4, id, '#E8553D', 1, 1, 1, 240
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Earnings Call Script Writers', 'earnings-call-script-writers', 4, id, '#E8553D', 1, 1, 1, 250
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Editorial Calendar Services', 'editorial-calendar-services', 4, id, '#E8553D', 1, 1, 1, 260
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Election Campaign Firms', 'election-campaign-firms', 4, id, '#E8553D', 1, 1, 1, 270
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Employee Communications Firms', 'employee-communications-firms', 4, id, '#E8553D', 1, 1, 1, 280
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Executive PR Firms', 'executive-pr-firms', 4, id, '#E8553D', 1, 1, 1, 290
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Executive Speechwriters', 'executive-speechwriters', 4, id, '#E8553D', 1, 1, 1, 300
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fashion PR Firms', 'fashion-pr-firms', 4, id, '#E8553D', 1, 1, 1, 310
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Federal Lobbying Firms', 'federal-lobbying-firms', 4, id, '#E8553D', 1, 1, 1, 320
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Film Publicists', 'film-publicists', 4, id, '#E8553D', 1, 1, 1, 330
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Financial Communications Firms', 'financial-communications-firms', 4, id, '#E8553D', 1, 1, 1, 340
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Food and Beverage PR Firms', 'food-and-beverage-pr-firms', 4, id, '#E8553D', 1, 1, 1, 350
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Founder PR Firms', 'founder-pr-firms', 4, id, '#E8553D', 1, 1, 1, 360
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Government Affairs Firms', 'government-affairs-firms', 4, id, '#E8553D', 1, 1, 1, 370
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Grassroots Campaign Firms', 'grassroots-campaign-firms', 4, id, '#E8553D', 1, 1, 1, 380
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Grasstops Outreach Firms', 'grasstops-outreach-firms', 4, id, '#E8553D', 1, 1, 1, 390
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Healthcare PR Firms', 'healthcare-pr-firms', 4, id, '#E8553D', 1, 1, 1, 400
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hospitality PR Firms', 'hospitality-pr-firms', 4, id, '#E8553D', 1, 1, 1, 410
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Influencer PR Firms', 'influencer-pr-firms', 4, id, '#E8553D', 1, 1, 1, 420
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Innovation Studios', 'innovation-studios', 4, id, '#E8553D', 1, 1, 1, 430
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Issue Advocacy Firms', 'issue-advocacy-firms', 4, id, '#E8553D', 1, 1, 1, 440
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Journalist Database Services', 'journalist-database-services', 4, id, '#E8553D', 1, 1, 1, 450
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lifestyle PR Firms', 'lifestyle-pr-firms', 4, id, '#E8553D', 1, 1, 1, 460
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Local Lobbying Firms', 'local-lobbying-firms', 4, id, '#E8553D', 1, 1, 1, 470
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Luxury PR Firms', 'luxury-pr-firms', 4, id, '#E8553D', 1, 1, 1, 480
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Magazine Publishers for Brands', 'magazine-publishers-for-brands', 4, id, '#E8553D', 1, 1, 1, 490
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Media List Building Services', 'media-list-building-services', 4, id, '#E8553D', 1, 1, 1, 500
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Media Training Firms', 'media-training-firms', 4, id, '#E8553D', 1, 1, 1, 510
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Music PR Firms', 'music-pr-firms', 4, id, '#E8553D', 1, 1, 1, 520
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Naming Firms', 'naming-firms', 4, id, '#E8553D', 1, 1, 1, 530
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Negative Review Removal Services', 'negative-review-removal-services', 4, id, '#E8553D', 1, 1, 1, 540
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Newswire Services', 'newswire-services', 4, id, '#E8553D', 1, 1, 1, 550
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'On-Camera Training Firms', 'on-camera-training-firms', 4, id, '#E8553D', 1, 1, 1, 560
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Personal Brand PR Firms', 'personal-brand-pr-firms', 4, id, '#E8553D', 1, 1, 1, 570
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pitch List Builders', 'pitch-list-builders', 4, id, '#E8553D', 1, 1, 1, 580
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Podcast Production for Brands', 'podcast-production-for-brands', 4, id, '#E8553D', 1, 1, 1, 590
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Political Communications Firms', 'political-communications-firms', 4, id, '#E8553D', 1, 1, 1, 600
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Polling Firms', 'polling-firms', 4, id, '#E8553D', 1, 1, 1, 610
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Press Release Distribution Services', 'press-release-distribution-services', 4, id, '#E8553D', 1, 1, 1, 620
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Public Affairs Firms', 'public-affairs-firms', 4, id, '#E8553D', 1, 1, 1, 630
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Restaurant PR Firms', 'restaurant-pr-firms', 4, id, '#E8553D', 1, 1, 1, 640
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Shareholder Letter Writers', 'shareholder-letter-writers', 4, id, '#E8553D', 1, 1, 1, 650
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Speculative Design Studios', 'speculative-design-studios', 4, id, '#E8553D', 1, 1, 1, 660
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Speechwriting Firms', 'speechwriting-firms', 4, id, '#E8553D', 1, 1, 1, 670
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Spokesperson Training Firms', 'spokesperson-training-firms', 4, id, '#E8553D', 1, 1, 1, 680
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Startup PR Firms', 'startup-pr-firms', 4, id, '#E8553D', 1, 1, 1, 690
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'State Lobbying Firms', 'state-lobbying-firms', 4, id, '#E8553D', 1, 1, 1, 700
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Strategic Communications Firms', 'strategic-communications-firms', 4, id, '#E8553D', 1, 1, 1, 710
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Streaming Show Publicists', 'streaming-show-publicists', 4, id, '#E8553D', 1, 1, 1, 720
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sustainability Communications Firms', 'sustainability-communications-firms', 4, id, '#E8553D', 1, 1, 1, 730
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'TV Interview Coaches', 'tv-interview-coaches', 4, id, '#E8553D', 1, 1, 1, 740
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tabletop Exercise Firms', 'tabletop-exercise-firms', 4, id, '#E8553D', 1, 1, 1, 750
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tagline Development Firms', 'tagline-development-firms', 4, id, '#E8553D', 1, 1, 1, 760
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tech PR Firms', 'tech-pr-firms', 4, id, '#E8553D', 1, 1, 1, 770
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tone of Voice Consultants', 'tone-of-voice-consultants', 4, id, '#E8553D', 1, 1, 1, 780
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Travel PR Firms', 'travel-pr-firms', 4, id, '#E8553D', 1, 1, 1, 790
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trend Forecasting Firms', 'trend-forecasting-firms', 4, id, '#E8553D', 1, 1, 1, 800
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Verbal Identity Firms', 'verbal-identity-firms', 4, id, '#E8553D', 1, 1, 1, 810
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wikipedia Editing Services', 'wikipedia-editing-services', 4, id, '#E8553D', 1, 1, 1, 820
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wine and Spirits PR Firms', 'wine-and-spirits-pr-firms', 4, id, '#E8553D', 1, 1, 1, 830
  FROM categories WHERE slug = 'other-marketing-advertising-communications-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Crisis Communications Consultants', 'crisis-communications-consultants', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'public-relations-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ESG Communications Firms', 'esg-communications-firms', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'public-relations-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Government Relations Consultants', 'government-relations-consultants', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'public-relations-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Investor Relations Consultants', 'investor-relations-consultants', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'public-relations-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Online Reputation Management Firms', 'online-reputation-management-firms', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'public-relations-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Public Relations Agencies', 'public-relations-agencies', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'public-relations-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Public Relations Firms', 'public-relations-firms', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'public-relations-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Reputation Management Services', 'reputation-management-services', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'public-relations-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Agricultural Appraisers', 'agricultural-appraisers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'appraisal-valuation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Antique & Personal Property Appraisers', 'antique-personal-property-appraisers', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'appraisal-valuation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Art Appraisers', 'art-appraisers', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'appraisal-valuation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Appraisers', 'business-appraisers', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'appraisal-valuation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Commercial Property Appraisers', 'commercial-property-appraisers', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'appraisal-valuation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Commercial Property Inspectors', 'commercial-property-inspectors', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'appraisal-valuation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Divorce Appraisers', 'divorce-appraisers', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'appraisal-valuation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Equipment Appraisers', 'equipment-appraisers', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'appraisal-valuation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Estate Sale Real Estate Specialists', 'estate-sale-real-estate-specialists', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'appraisal-valuation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hotel Appraisers', 'hotel-appraisers', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'appraisal-valuation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Industrial Appraisers', 'industrial-appraisers', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'appraisal-valuation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Insurance Appraisers', 'insurance-appraisers', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'appraisal-valuation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Jewelry Appraisers', 'jewelry-appraisers', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'appraisal-valuation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Land Appraisers', 'land-appraisers', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'appraisal-valuation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Appraisers', 'real-estate-appraisers', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'appraisal-valuation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Copywriters', 'real-estate-copywriters', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'appraisal-valuation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Investors', 'real-estate-investors', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'appraisal-valuation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Photographers', 'real-estate-photographers-pro', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'appraisal-valuation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Videographers', 'real-estate-videographers', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'appraisal-valuation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Wholesalers', 'real-estate-wholesalers', 4, id, '#E8553D', 1, 1, 1, 200
  FROM categories WHERE slug = 'appraisal-valuation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Residential Property Appraisers', 'residential-property-appraisers', 4, id, '#E8553D', 1, 1, 1, 210
  FROM categories WHERE slug = 'appraisal-valuation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Special Purpose Property Appraisers', 'special-purpose-property-appraisers', 4, id, '#E8553D', 1, 1, 1, 220
  FROM categories WHERE slug = 'appraisal-valuation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Commercial Real Estate Advisors', 'commercial-real-estate-advisors', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'consulting-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Divorce Real Estate Specialists', 'divorce-real-estate-specialists', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'consulting-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Property Investment Advisors', 'property-investment-advisors', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'consulting-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Property Tax Consultants', 'property-tax-consultants', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'consulting-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Coaches', 'real-estate-coaches', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'consulting-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Consultants', 'real-estate-consultants-2', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'consulting-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Tax Strategists', 'real-estate-tax-strategists', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'consulting-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Veterans Real Estate Agents', 'veterans-real-estate-agents', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'consulting-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '11 Month Warranty Inspectors', '11-month-warranty-inspectors', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '3D Tour Photographers', '3d-tour-photographers', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '55+ Community Specialists', '55-community-specialists', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Abstract Services', 'abstract-services', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Airbnb Co-Hosts', 'airbnb-co-hosts', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Apartment Appraisers', 'apartment-appraisers', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Apartment Building Brokers', 'apartment-building-brokers', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Asbestos Inspectors', 'asbestos-inspectors', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'BRRRR Strategy Specialists', 'brrrr-strategy-specialists', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bank Statement Loan Officers', 'bank-statement-loan-officers', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bank-Owned Property Specialists', 'bank-owned-property-specialists', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Beachfront Specialists', 'beachfront-specialists', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CAM Audit Firms', 'cam-audit-firms', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Car Wash Brokers', 'car-wash-brokers', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Closing Coordinators', 'closing-coordinators', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Collectibles Appraisers', 'collectibles-appraisers', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Condo Association Managers', 'condo-association-managers', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Condo Specialists', 'condo-specialists', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Construction Loan Officers', 'construction-loan-officers', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cost Segregation Specialists', 'cost-segregation-specialists', 4, id, '#E8553D', 1, 1, 1, 200
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Country Club Specialists', 'country-club-specialists', 4, id, '#E8553D', 1, 1, 1, 210
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Crawl Space Inspectors', 'crawl-space-inspectors', 4, id, '#E8553D', 1, 1, 1, 220
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Custom Build Specialists', 'custom-build-specialists', 4, id, '#E8553D', 1, 1, 1, 230
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'DST Sponsors', 'dst-sponsors', 4, id, '#E8553D', 1, 1, 1, 240
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Daycare Real Estate Brokers', 'daycare-real-estate-brokers', 4, id, '#E8553D', 1, 1, 1, 250
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Downsizing Specialists', 'downsizing-specialists', 4, id, '#E8553D', 1, 1, 1, 260
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Drone Real Estate Photographers', 'drone-real-estate-photographers', 4, id, '#E8553D', 1, 1, 1, 270
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Drone Roof Inspectors', 'drone-roof-inspectors', 4, id, '#E8553D', 1, 1, 1, 280
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dual Agents', 'dual-agents', 4, id, '#E8553D', 1, 1, 1, 290
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Empty Nester Specialists', 'empty-nester-specialists', 4, id, '#E8553D', 1, 1, 1, 300
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Environmental Site Assessors', 'environmental-site-assessors', 4, id, '#E8553D', 1, 1, 1, 310
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Equestrian Property Specialists', 'equestrian-property-specialists', 4, id, '#E8553D', 1, 1, 1, 320
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Exclusive Buyer Agents', 'exclusive-buyer-agents', 4, id, '#E8553D', 1, 1, 1, 330
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Final Walkthrough Inspectors', 'final-walkthrough-inspectors', 4, id, '#E8553D', 1, 1, 1, 340
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'First-Time Buyer Specialists', 'first-time-buyer-specialists', 4, id, '#E8553D', 1, 1, 1, 350
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fix and Flip Specialists', 'fix-and-flip-specialists', 4, id, '#E8553D', 1, 1, 1, 360
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Flex Space Brokers', 'flex-space-brokers', 4, id, '#E8553D', 1, 1, 1, 370
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Foreclosure Specialists', 'foreclosure-specialists', 4, id, '#E8553D', 1, 1, 1, 380
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Foreign Buyer Specialists', 'foreign-buyer-specialists', 4, id, '#E8553D', 1, 1, 1, 390
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Foreign National Loan Officers', 'foreign-national-loan-officers', 4, id, '#E8553D', 1, 1, 1, 400
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Gas Station Brokers', 'gas-station-brokers', 4, id, '#E8553D', 1, 1, 1, 410
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Golf Course Property Specialists', 'golf-course-property-specialists', 4, id, '#E8553D', 1, 1, 1, 420
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hard Money Loan Officers', 'hard-money-loan-officers', 4, id, '#E8553D', 1, 1, 1, 430
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hobby Farm Specialists', 'hobby-farm-specialists', 4, id, '#E8553D', 1, 1, 1, 440
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Home Stagers', 'home-stagers', 4, id, '#E8553D', 1, 1, 1, 450
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hospitality Real Estate Brokers', 'hospitality-real-estate-brokers', 4, id, '#E8553D', 1, 1, 1, 460
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hotel Brokers', 'hotel-brokers', 4, id, '#E8553D', 1, 1, 1, 470
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Industrial Brokers', 'industrial-brokers', 4, id, '#E8553D', 1, 1, 1, 480
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Infrared Thermal Inspectors', 'infrared-thermal-inspectors', 4, id, '#E8553D', 1, 1, 1, 490
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'International Real Estate Agents', 'international-real-estate-agents', 4, id, '#E8553D', 1, 1, 1, 500
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Jumbo Loan Officers', 'jumbo-loan-officers', 4, id, '#E8553D', 1, 1, 1, 510
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lakefront Specialists', 'lakefront-specialists', 4, id, '#E8553D', 1, 1, 1, 520
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Land Brokers', 'land-brokers', 4, id, '#E8553D', 1, 1, 1, 530
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Landlord Representation Firms', 'landlord-representation-firms', 4, id, '#E8553D', 1, 1, 1, 540
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lease Administration Firms', 'lease-administration-firms', 4, id, '#E8553D', 1, 1, 1, 550
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Listing Agents', 'listing-agents', 4, id, '#E8553D', 1, 1, 1, 560
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Litigation Appraisers', 'litigation-appraisers', 4, id, '#E8553D', 1, 1, 1, 570
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Loan Signing Agents', 'loan-signing-agents', 4, id, '#E8553D', 1, 1, 1, 580
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Luxury Home Specialists', 'luxury-home-specialists', 4, id, '#E8553D', 1, 1, 1, 590
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Machinery and Equipment Appraisers', 'machinery-and-equipment-appraisers', 4, id, '#E8553D', 1, 1, 1, 600
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Manufactured Home Specialists', 'manufactured-home-specialists', 4, id, '#E8553D', 1, 1, 1, 610
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marina Brokers', 'marina-brokers', 4, id, '#E8553D', 1, 1, 1, 620
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Matterport Service Providers', 'matterport-service-providers', 4, id, '#E8553D', 1, 1, 1, 630
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Military Relocation Specialists', 'military-relocation-specialists', 4, id, '#E8553D', 1, 1, 1, 640
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mixed-Use Property Brokers', 'mixed-use-property-brokers', 4, id, '#E8553D', 1, 1, 1, 650
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile Home Park Brokers', 'mobile-home-park-brokers', 4, id, '#E8553D', 1, 1, 1, 660
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile Home Park Managers', 'mobile-home-park-managers', 4, id, '#E8553D', 1, 1, 1, 670
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile Home Specialists', 'mobile-home-specialists', 4, id, '#E8553D', 1, 1, 1, 680
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile Notaries for Closings', 'mobile-notaries-for-closings', 4, id, '#E8553D', 1, 1, 1, 690
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mortgage Loan Officers', 'mortgage-loan-officers', 4, id, '#E8553D', 1, 1, 1, 700
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mortgage Originators', 'mortgage-originators', 4, id, '#E8553D', 1, 1, 1, 710
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mountain Property Specialists', 'mountain-property-specialists', 4, id, '#E8553D', 1, 1, 1, 720
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Move-Up Buyer Specialists', 'move-up-buyer-specialists', 4, id, '#E8553D', 1, 1, 1, 730
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Multifamily Investment Specialists', 'multifamily-investment-specialists', 4, id, '#E8553D', 1, 1, 1, 740
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'New Construction Inspectors', 'new-construction-inspectors', 4, id, '#E8553D', 1, 1, 1, 750
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Office Brokers', 'office-brokers', 4, id, '#E8553D', 1, 1, 1, 760
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Office Building Managers', 'office-building-managers', 4, id, '#E8553D', 1, 1, 1, 770
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Opportunity Zone Sponsors', 'opportunity-zone-sponsors', 4, id, '#E8553D', 1, 1, 1, 780
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'PCA Providers', 'pca-providers', 4, id, '#E8553D', 1, 1, 1, 790
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Phase I ESA Providers', 'phase-i-esa-providers', 4, id, '#E8553D', 1, 1, 1, 800
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pool & Spa Inspectors', 'pool-spa-inspectors', 4, id, '#E8553D', 1, 1, 1, 810
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pre-Construction Specialists', 'pre-construction-specialists', 4, id, '#E8553D', 1, 1, 1, 820
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pre-Drywall Inspectors', 'pre-drywall-inspectors', 4, id, '#E8553D', 1, 1, 1, 830
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pre-Purchase Inspectors', 'pre-purchase-inspectors', 4, id, '#E8553D', 1, 1, 1, 840
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Property Condition Assessors', 'property-condition-assessors', 4, id, '#E8553D', 1, 1, 1, 850
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Property Managers', 'property-managers', 4, id, '#E8553D', 1, 1, 1, 860
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'REO Specialists', 'reo-specialists', 4, id, '#E8553D', 1, 1, 1, 870
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Agent Coaches', 'real-estate-agent-coaches', 4, id, '#E8553D', 1, 1, 1, 880
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Attorneys for Closings', 'real-estate-attorneys-for-closings', 4, id, '#E8553D', 1, 1, 1, 890
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Crowdfunding Sponsors', 'real-estate-crowdfunding-sponsors', 4, id, '#E8553D', 1, 1, 1, 900
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Syndicators', 'real-estate-syndicators', 4, id, '#E8553D', 1, 1, 1, 910
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Residential Real Estate Agents', 'residential-real-estate-agents', 4, id, '#E8553D', 1, 1, 1, 920
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Restaurant Real Estate Brokers', 'restaurant-real-estate-brokers', 4, id, '#E8553D', 1, 1, 1, 930
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Retail Brokers', 'retail-brokers', 4, id, '#E8553D', 1, 1, 1, 940
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Riverfront Specialists', 'riverfront-specialists', 4, id, '#E8553D', 1, 1, 1, 950
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SRS Designation Agents', 'srs-designation-agents', 4, id, '#E8553D', 1, 1, 1, 960
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Self-Storage Brokers', 'self-storage-brokers', 4, id, '#E8553D', 1, 1, 1, 970
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Self-Storage Managers', 'self-storage-managers', 4, id, '#E8553D', 1, 1, 1, 980
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Senior Housing Brokers', 'senior-housing-brokers', 4, id, '#E8553D', 1, 1, 1, 990
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Senior Housing Managers', 'senior-housing-managers', 4, id, '#E8553D', 1, 1, 1, 1000
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Senior Real Estate Specialists', 'senior-real-estate-specialists', 4, id, '#E8553D', 1, 1, 1, 1010
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sewer Scope Inspectors', 'sewer-scope-inspectors', 4, id, '#E8553D', 1, 1, 1, 1020
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Shopping Center Managers', 'shopping-center-managers', 4, id, '#E8553D', 1, 1, 1, 1030
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Short Sale Specialists', 'short-sale-specialists', 4, id, '#E8553D', 1, 1, 1, 1040
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Short-Term Rental Managers', 'short-term-rental-managers', 4, id, '#E8553D', 1, 1, 1, 1050
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Single Agency Brokers', 'single-agency-brokers', 4, id, '#E8553D', 1, 1, 1, 1060
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Single-Family Rental Specialists', 'single-family-rental-specialists', 4, id, '#E8553D', 1, 1, 1, 1070
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ski-In Ski-Out Specialists', 'ski-in-ski-out-specialists', 4, id, '#E8553D', 1, 1, 1, 1080
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Student Housing Brokers', 'student-housing-brokers', 4, id, '#E8553D', 1, 1, 1, 1090
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'TIC Sponsors', 'tic-sponsors', 4, id, '#E8553D', 1, 1, 1, 1100
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Timberland Brokers', 'timberland-brokers', 4, id, '#E8553D', 1, 1, 1, 1110
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Title Search Services', 'title-search-services', 4, id, '#E8553D', 1, 1, 1, 1120
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Townhome Specialists', 'townhome-specialists', 4, id, '#E8553D', 1, 1, 1, 1130
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Transaction Coordinators', 'transaction-coordinators', 4, id, '#E8553D', 1, 1, 1, 1140
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'USDA Loan Officers', 'usda-loan-officers', 4, id, '#E8553D', 1, 1, 1, 1150
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vacation Rental Managers', 'vacation-rental-managers', 4, id, '#E8553D', 1, 1, 1, 1160
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vineyard Property Specialists', 'vineyard-property-specialists', 4, id, '#E8553D', 1, 1, 1, 1170
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Virtual Staging Services', 'virtual-staging-services', 4, id, '#E8553D', 1, 1, 1, 1180
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Warehouse Brokers', 'warehouse-brokers', 4, id, '#E8553D', 1, 1, 1, 1190
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Waterfront Property Specialists', 'waterfront-property-specialists', 4, id, '#E8553D', 1, 1, 1, 1200
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Well Water Inspectors', 'well-water-inspectors', 4, id, '#E8553D', 1, 1, 1, 1210
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wholesale Real Estate Brokers', 'wholesale-real-estate-brokers', 4, id, '#E8553D', 1, 1, 1, 1220
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wholesaler Coaches', 'wholesaler-coaches', 4, id, '#E8553D', 1, 1, 1, 1230
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wine Collection Appraisers', 'wine-collection-appraisers', 4, id, '#E8553D', 1, 1, 1, 1240
  FROM categories WHERE slug = 'other-real-estate-professional-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '1031 Exchange Intermediaries', '1031-exchange-intermediaries-2', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'specialty-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lease Negotiation Consultants', 'lease-negotiation-consultants', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'specialty-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lease Negotiation Specialists', 'lease-negotiation-specialists', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'specialty-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Site Selection Consultants', 'site-selection-consultants', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'specialty-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Site Selection Specialists', 'site-selection-specialists', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'specialty-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tenant Representation Consultants', 'tenant-representation-consultants', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'specialty-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Attic Inspectors', 'attic-inspectors', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'survey-inspection' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Builder Warranty Inspectors', 'builder-warranty-inspectors', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'survey-inspection' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Building Inspectors', 'building-inspectors', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'survey-inspection' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Chimney Inspectors', 'chimney-inspectors', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'survey-inspection' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Construction Cost Estimators', 'construction-cost-estimators', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'survey-inspection' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'EIFS Inspectors', 'eifs-inspectors', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'survey-inspection' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Energy Audit Inspectors', 'energy-audit-inspectors', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'survey-inspection' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Foundation Inspectors', 'foundation-inspectors', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'survey-inspection' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Home Inspectors', 'home-inspectors', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'survey-inspection' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lead Paint Inspectors', 'lead-paint-inspectors', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'survey-inspection' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mold Inspectors', 'mold-inspectors', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'survey-inspection' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Phase Inspectors', 'phase-inspectors', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'survey-inspection' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pre-Listing Inspectors', 'pre-listing-inspectors', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'survey-inspection' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Property Stagers', 'property-stagers', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'survey-inspection' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Property Surveyors', 'property-surveyors', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'survey-inspection' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Quantity Surveyors', 'quantity-surveyors', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'survey-inspection' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Radon Inspectors', 'radon-inspectors', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'survey-inspection' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Roof Inspectors', 'roof-inspectors', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'survey-inspection' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Septic Inspectors', 'septic-inspectors', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'survey-inspection' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Stucco Inspectors', 'stucco-inspectors', 4, id, '#E8553D', 1, 1, 1, 200
  FROM categories WHERE slug = 'survey-inspection' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Termite Inspectors', 'termite-inspectors', 4, id, '#E8553D', 1, 1, 1, 210
  FROM categories WHERE slug = 'survey-inspection' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'WDI Inspectors', 'wdi-inspectors', 4, id, '#E8553D', 1, 1, 1, 220
  FROM categories WHERE slug = 'survey-inspection' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Closing Services', 'closing-services', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'title-escrow' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Escrow Companies', 'escrow-companies', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'title-escrow' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Escrow Officers', 'escrow-officers', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'title-escrow' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lease Audit Firms', 'lease-audit-firms', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'title-escrow' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Settlement Services', 'real-estate-settlement-services', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'title-escrow' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Title Companies', 'title-companies', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'title-escrow' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Title Insurance Agencies', 'title-insurance-agencies', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'title-escrow' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Anti-Money Laundering Consultants', 'anti-money-laundering-consultants-2', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'anti-money-laundering-financial-crime' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'EU Sanctions Consultants', 'eu-sanctions-consultants', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'anti-money-laundering-financial-crime' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'KYC Consultants', 'kyc-consultants', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'anti-money-laundering-financial-crime' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Country Risk Advisors', 'country-risk-advisors', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'enterprise-risk-management-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ERM Implementation Consultants', 'erm-implementation-consultants', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'enterprise-risk-management-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Enterprise Risk Management Consulting Firms', 'enterprise-risk-management-consulting-firms', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'enterprise-risk-management-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Executive Protection Risk Advisors', 'executive-protection-risk-advisors', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'enterprise-risk-management-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Foreign Investment Risk Advisors', 'foreign-investment-risk-advisors', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'enterprise-risk-management-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Geopolitical Risk Advisory Firms', 'geopolitical-risk-advisory-firms', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'enterprise-risk-management-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Political Risk Advisors', 'political-risk-advisors', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'enterprise-risk-management-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sovereign Risk Advisors', 'sovereign-risk-advisors', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'enterprise-risk-management-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'GMP Consultants', 'gmp-consultants', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'healthcare-industry-specific-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Internal Audit Co-Sourcing', 'internal-audit-co-sourcing', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'internal-audit-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Internal Audit Firms', 'internal-audit-firms', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'internal-audit-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'FCPA Compliance Consultants', 'fcpa-compliance-consultants', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'regulatory-compliance-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'FDA Regulatory Consultants', 'fda-regulatory-consultants', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'regulatory-compliance-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Affirmative Action Plan Consultants', 'affirmative-action-plan-consultants', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Anti-Bribery Consulting Firms', 'anti-bribery-consulting-firms', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Anti-Dumping Consultants', 'anti-dumping-consultants', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Anti-Kickback Statute Consultants', 'anti-kickback-statute-consultants', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Continuity Consultants', 'business-continuity-consultants', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'COPPA Consultants', 'coppa-consultants', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Code of Conduct Consultants', 'code-of-conduct-consultants', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Compliance Hotline Providers', 'compliance-hotline-providers', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Compliance Program Consultants', 'compliance-program-consultants', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Conflicts of Interest Program Consultants', 'conflicts-of-interest-program-consultants', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Consent Management Consultants', 'consent-management-consultants', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Construction Safety Consultants', 'construction-safety-consultants', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Control Testing Firms', 'control-testing-firms', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Countervailing Duty Consultants', 'countervailing-duty-consultants', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Country of Origin Consultants', 'country-of-origin-consultants', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Crisis Drill Firms', 'crisis-drill-firms', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Crisis Response Consultants', 'crisis-response-consultants', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cross-Border Data Transfer Consultants', 'cross-border-data-transfer-consultants', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Customer Due Diligence Consultants', 'customer-due-diligence-consultants', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Mapping Consultants', 'data-mapping-consultants', 4, id, '#E8553D', 1, 1, 1, 200
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Protection Officers for Hire', 'data-protection-officers-for-hire', 4, id, '#E8553D', 1, 1, 1, 210
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Disaster Recovery Consultants', 'disaster-recovery-consultants', 4, id, '#E8553D', 1, 1, 1, 220
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dual-Use Goods Consultants', 'dual-use-goods-consultants', 4, id, '#E8553D', 1, 1, 1, 230
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Duty of Care Consulting Firms', 'duty-of-care-consulting-firms', 4, id, '#E8553D', 1, 1, 1, 240
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'EAR Consultants', 'ear-consultants', 4, id, '#E8553D', 1, 1, 1, 250
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Enhanced Due Diligence Firms', 'enhanced-due-diligence-firms', 4, id, '#E8553D', 1, 1, 1, 260
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Environmental Management System Consultants', 'environmental-management-system-consultants', 4, id, '#E8553D', 1, 1, 1, 270
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ergonomic Consultants', 'ergonomic-consultants', 4, id, '#E8553D', 1, 1, 1, 280
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Export Control Consultants', 'export-control-consultants', 4, id, '#E8553D', 1, 1, 1, 290
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'FDA 510(k) Consultants', 'fda-510-k-consultants', 4, id, '#E8553D', 1, 1, 1, 300
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'FDA Premarket Approval Consultants', 'fda-premarket-approval-consultants', 4, id, '#E8553D', 1, 1, 1, 310
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'FDA Quality System Consultants', 'fda-quality-system-consultants', 4, id, '#E8553D', 1, 1, 1, 320
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'False Claims Act Consultants', 'false-claims-act-consultants', 4, id, '#E8553D', 1, 1, 1, 330
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Free Trade Agreement Consultants', 'free-trade-agreement-consultants', 4, id, '#E8553D', 1, 1, 1, 340
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'GDPR DPO Services', 'gdpr-dpo-services', 4, id, '#E8553D', 1, 1, 1, 350
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'GLP Consultants', 'glp-consultants', 4, id, '#E8553D', 1, 1, 1, 360
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'GRC Software Implementation Firms', 'grc-software-implementation-firms', 4, id, '#E8553D', 1, 1, 1, 370
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Global Anti-Corruption Consultants', 'global-anti-corruption-consultants', 4, id, '#E8553D', 1, 1, 1, 380
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HITECH Consultants', 'hitech-consultants', 4, id, '#E8553D', 1, 1, 1, 390
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Healthcare RAC Consultants', 'healthcare-rac-consultants', 4, id, '#E8553D', 1, 1, 1, 400
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ICFR Consultants', 'icfr-consultants', 4, id, '#E8553D', 1, 1, 1, 410
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ISO 9001 Consultants', 'iso-9001-consultants', 4, id, '#E8553D', 1, 1, 1, 420
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Industrial Hygiene Consultants', 'industrial-hygiene-consultants', 4, id, '#E8553D', 1, 1, 1, 430
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Insider Threat Consultants', 'insider-threat-consultants', 4, id, '#E8553D', 1, 1, 1, 440
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Internal Controls Consultants', 'internal-controls-consultants-2', 4, id, '#E8553D', 1, 1, 1, 450
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'OFAC Consultants', 'ofac-consultants', 4, id, '#E8553D', 1, 1, 1, 460
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Occupational Health Consultants', 'occupational-health-consultants', 4, id, '#E8553D', 1, 1, 1, 470
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Operational Risk Consultants', 'operational-risk-consultants', 4, id, '#E8553D', 1, 1, 1, 480
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Privacy Impact Assessment Consultants', 'privacy-impact-assessment-consultants', 4, id, '#E8553D', 1, 1, 1, 490
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Privacy Shield Consultants', 'privacy-shield-consultants', 4, id, '#E8553D', 1, 1, 1, 500
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Process Walkthroughs Consultants', 'process-walkthroughs-consultants', 4, id, '#E8553D', 1, 1, 1, 510
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Records of Processing Consultants', 'records-of-processing-consultants', 4, id, '#E8553D', 1, 1, 1, 520
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Risk Appetite Consultants', 'risk-appetite-consultants', 4, id, '#E8553D', 1, 1, 1, 530
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Risk Assessment Firms', 'risk-assessment-firms', 4, id, '#E8553D', 1, 1, 1, 540
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SOX Compliance Firms', 'sox-compliance-firms', 4, id, '#E8553D', 1, 1, 1, 550
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SOX Consulting', 'sox-consulting', 4, id, '#E8553D', 1, 1, 1, 560
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Section 232 Consultants', 'section-232-consultants', 4, id, '#E8553D', 1, 1, 1, 570
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Standard Contractual Clauses Consultants', 'standard-contractual-clauses-consultants', 4, id, '#E8553D', 1, 1, 1, 580
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Stark Law Consultants', 'stark-law-consultants', 4, id, '#E8553D', 1, 1, 1, 590
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Strategic Risk Consultants', 'strategic-risk-consultants', 4, id, '#E8553D', 1, 1, 1, 600
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tabletop Exercise Facilitators', 'tabletop-exercise-facilitators', 4, id, '#E8553D', 1, 1, 1, 610
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tariff Classification Consultants', 'tariff-classification-consultants', 4, id, '#E8553D', 1, 1, 1, 620
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Travel Risk Management Firms', 'travel-risk-management-firms', 4, id, '#E8553D', 1, 1, 1, 630
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'UK Bribery Act Consultants', 'uk-bribery-act-consultants', 4, id, '#E8553D', 1, 1, 1, 640
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Whistleblower Hotline Providers', 'whistleblower-hotline-providers', 4, id, '#E8553D', 1, 1, 1, 650
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Workers Comp Loss Control Consultants', 'workers-comp-loss-control-consultants', 4, id, '#E8553D', 1, 1, 1, 660
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Workplace Safety Consultants', 'workplace-safety-consultants', 4, id, '#E8553D', 1, 1, 1, 670
  FROM categories WHERE slug = 'specialty-risk-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Carbon Accounting Firms', 'carbon-accounting-firms', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'carbon-climate-net-zero-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Carbon Credit Brokers', 'carbon-credit-brokers', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'carbon-climate-net-zero-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Carbon Footprint Consultants', 'carbon-footprint-consultants', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'carbon-climate-net-zero-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Carbon Offset Brokers', 'carbon-offset-brokers', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'carbon-climate-net-zero-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Carbon Verification Firms', 'carbon-verification-firms', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'carbon-climate-net-zero-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Climate Neutral Certified Consultants', 'climate-neutral-certified-consultants', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'carbon-climate-net-zero-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Climate Resilience Firms', 'climate-resilience-firms', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'carbon-climate-net-zero-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Climate Risk Consulting Firms', 'climate-risk-consulting-firms', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'carbon-climate-net-zero-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Climate Scenario Analysis Firms', 'climate-scenario-analysis-firms', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'carbon-climate-net-zero-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Compliance Carbon Market Consultants', 'compliance-carbon-market-consultants', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'carbon-climate-net-zero-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Decarbonization Consulting Firms', 'decarbonization-consulting-firms', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'carbon-climate-net-zero-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Embodied Carbon Consulting', 'embodied-carbon-consulting', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'carbon-climate-net-zero-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Net Zero Energy Consulting', 'net-zero-energy-consulting', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'carbon-climate-net-zero-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Net Zero Strategy Firms', 'net-zero-strategy-firms', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'carbon-climate-net-zero-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Physical Climate Risk Firms', 'physical-climate-risk-firms', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'carbon-climate-net-zero-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Product Carbon Footprint Firms', 'product-carbon-footprint-firms', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'carbon-climate-net-zero-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Scope 1 Emissions Consultants', 'scope-1-emissions-consultants', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'carbon-climate-net-zero-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Voluntary Carbon Market Consultants', 'voluntary-carbon-market-consultants', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'carbon-climate-net-zero-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Zero Carbon Building Consulting', 'zero-carbon-building-consulting', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'carbon-climate-net-zero-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ESG Reporting Consultants', 'esg-reporting-consultants', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'esg-strategy-reporting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ESG Software Implementation Partners', 'esg-software-implementation-partners', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'esg-strategy-reporting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ESG Strategy Firms', 'esg-strategy-firms', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'esg-strategy-reporting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Stakeholder Capitalism Consultants', 'stakeholder-capitalism-consultants', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'esg-strategy-reporting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Stakeholder Engagement Consultants', 'stakeholder-engagement-consultants', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'esg-strategy-reporting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Supply Chain ESG Auditors', 'supply-chain-esg-auditors', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'esg-strategy-reporting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Air Permitting Consultants', 'air-permitting-consultants', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'environmental-compliance-permitting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Disaster Preparedness Consulting', 'disaster-preparedness-consulting', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'environmental-compliance-permitting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Environmental Compliance Consulting', 'environmental-compliance-consulting', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'environmental-compliance-permitting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'NEPA Consultants', 'nepa-consultants', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'environmental-compliance-permitting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'NEPA Tribal Consultation Specialists', 'nepa-tribal-consultation-specialists', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'environmental-compliance-permitting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'LEED Consulting Firms', 'leed-consulting-firms', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'renewable-energy-green-building-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Renewable Energy Consultants', 'renewable-energy-consultants', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'renewable-energy-green-building-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '1% for the Planet Consultants', '1-for-the-planet-consultants', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Archaeology Consultants', 'archaeology-consultants', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Asbestos Consultants', 'asbestos-consultants', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'B Corp Application Consultants', 'b-corp-application-consultants', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'BREEAM Consulting Firms', 'breeam-consulting-firms', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brownfield Consultants', 'brownfield-consultants', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Building Energy Audits', 'building-energy-audits', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CERCLA Consultants', 'cercla-consultants', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Clean Air Act Consultants', 'clean-air-act-consultants', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Commercial Energy Audits', 'commercial-energy-audits', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Compostable Packaging Consultants', 'compostable-packaging-consultants', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Conflict Minerals Consultants', 'conflict-minerals-consultants', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cradle to Cradle Consultants', 'cradle-to-cradle-consultants', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Demand Response Consultants', 'demand-response-consultants', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Disaster Risk Consulting', 'disaster-risk-consulting', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Double Materiality Consultants', 'double-materiality-consultants', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'EPD Consultants', 'epd-consultants', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'EU Taxonomy Consultants', 'eu-taxonomy-consultants', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Endangered Species Consultants', 'endangered-species-consultants', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Energy Attribute Certificate Consultants', 'energy-attribute-certificate-consultants', 4, id, '#E8553D', 1, 1, 1, 200
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Energy Efficiency Consultants', 'energy-efficiency-consultants', 4, id, '#E8553D', 1, 1, 1, 210
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Energy Hedging Consultants', 'energy-hedging-consultants', 4, id, '#E8553D', 1, 1, 1, 220
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Energy Procurement Consultants', 'energy-procurement-consultants', 4, id, '#E8553D', 1, 1, 1, 230
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Environmental Justice Consultants', 'environmental-justice-consultants', 4, id, '#E8553D', 1, 1, 1, 240
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ethical Sourcing Consultants', 'ethical-sourcing-consultants', 4, id, '#E8553D', 1, 1, 1, 250
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'FSC Certification Consultants', 'fsc-certification-consultants', 4, id, '#E8553D', 1, 1, 1, 260
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fair Trade Consultants', 'fair-trade-consultants', 4, id, '#E8553D', 1, 1, 1, 270
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fitwel Consulting', 'fitwel-consulting', 4, id, '#E8553D', 1, 1, 1, 280
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Forced Labor Compliance Consultants', 'forced-labor-compliance-consultants', 4, id, '#E8553D', 1, 1, 1, 290
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Forest Stewardship Council Consultants', 'forest-stewardship-council-consultants', 4, id, '#E8553D', 1, 1, 1, 300
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'GRI Reporting Consultants', 'gri-reporting-consultants', 4, id, '#E8553D', 1, 1, 1, 310
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Green Globes Consulting', 'green-globes-consulting', 4, id, '#E8553D', 1, 1, 1, 320
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Green Tariff Consultants', 'green-tariff-consultants', 4, id, '#E8553D', 1, 1, 1, 330
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HERS Raters', 'hers-raters', 4, id, '#E8553D', 1, 1, 1, 340
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Habitat Restoration Firms', 'habitat-restoration-firms', 4, id, '#E8553D', 1, 1, 1, 350
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hazmat Consultants', 'hazmat-consultants', 4, id, '#E8553D', 1, 1, 1, 360
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Historic Preservation Consultants', 'historic-preservation-consultants', 4, id, '#E8553D', 1, 1, 1, 370
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Human Rights Due Diligence Firms', 'human-rights-due-diligence-firms', 4, id, '#E8553D', 1, 1, 1, 380
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Impact Investing Consultants', 'impact-investing-consultants', 4, id, '#E8553D', 1, 1, 1, 390
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Impact Measurement Firms', 'impact-measurement-firms', 4, id, '#E8553D', 1, 1, 1, 400
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Indoor Air Quality Consultants', 'indoor-air-quality-consultants', 4, id, '#E8553D', 1, 1, 1, 410
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Industrial Energy Audits', 'industrial-energy-audits', 4, id, '#E8553D', 1, 1, 1, 420
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Just Transition Consultants', 'just-transition-consultants', 4, id, '#E8553D', 1, 1, 1, 430
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lead Paint Consultants', 'lead-paint-consultants', 4, id, '#E8553D', 1, 1, 1, 440
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lifecycle Assessment Firms', 'lifecycle-assessment-firms', 4, id, '#E8553D', 1, 1, 1, 450
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Living Building Challenge Consultants', 'living-building-challenge-consultants', 4, id, '#E8553D', 1, 1, 1, 460
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Logic Model Consultants', 'logic-model-consultants', 4, id, '#E8553D', 1, 1, 1, 470
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Materiality Assessment Firms', 'materiality-assessment-firms', 4, id, '#E8553D', 1, 1, 1, 480
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Modern Slavery Consultants', 'modern-slavery-consultants', 4, id, '#E8553D', 1, 1, 1, 490
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mold Assessment Consultants', 'mold-assessment-consultants', 4, id, '#E8553D', 1, 1, 1, 500
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Outcomes Measurement Firms', 'outcomes-measurement-firms', 4, id, '#E8553D', 1, 1, 1, 510
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Passive House Consulting Firms', 'passive-house-consulting-firms', 4, id, '#E8553D', 1, 1, 1, 520
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Phase I Environmental Site Assessors', 'phase-i-environmental-site-assessors', 4, id, '#E8553D', 1, 1, 1, 530
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Plastic Reduction Consultants', 'plastic-reduction-consultants', 4, id, '#E8553D', 1, 1, 1, 540
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'RCRA Generator Consultants', 'rcra-generator-consultants', 4, id, '#E8553D', 1, 1, 1, 550
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'RECs Consultants', 'recs-consultants', 4, id, '#E8553D', 1, 1, 1, 560
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Radon Consultants', 'radon-consultants', 4, id, '#E8553D', 1, 1, 1, 570
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Rainforest Alliance Consultants', 'rainforest-alliance-consultants', 4, id, '#E8553D', 1, 1, 1, 580
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Residential Energy Audits', 'residential-energy-audits', 4, id, '#E8553D', 1, 1, 1, 590
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Responsible Sourcing Consultants', 'responsible-sourcing-consultants', 4, id, '#E8553D', 1, 1, 1, 600
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SBTi Consultants', 'sbti-consultants', 4, id, '#E8553D', 1, 1, 1, 610
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SPCC Plan Consultants', 'spcc-plan-consultants', 4, id, '#E8553D', 1, 1, 1, 620
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SWPPP Consultants', 'swppp-consultants', 4, id, '#E8553D', 1, 1, 1, 630
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Science-Based Targets Consultants', 'science-based-targets-consultants', 4, id, '#E8553D', 1, 1, 1, 640
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Section 7 Consultants', 'section-7-consultants', 4, id, '#E8553D', 1, 1, 1, 650
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Solar PPA Consultants', 'solar-ppa-consultants', 4, id, '#E8553D', 1, 1, 1, 660
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Stream Restoration Consultants', 'stream-restoration-consultants', 4, id, '#E8553D', 1, 1, 1, 670
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Supplier Code of Conduct Consultants', 'supplier-code-of-conduct-consultants', 4, id, '#E8553D', 1, 1, 1, 680
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sustainability Consulting Firms', 'sustainability-consulting-firms', 4, id, '#E8553D', 1, 1, 1, 690
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sustainable Packaging Consultants', 'sustainable-packaging-consultants', 4, id, '#E8553D', 1, 1, 1, 700
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'TSCA Consultants', 'tsca-consultants', 4, id, '#E8553D', 1, 1, 1, 710
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Theory of Change Consultants', 'theory-of-change-consultants', 4, id, '#E8553D', 1, 1, 1, 720
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Transition Risk Firms', 'transition-risk-firms', 4, id, '#E8553D', 1, 1, 1, 730
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tribal Consultation Specialists', 'tribal-consultation-specialists', 4, id, '#E8553D', 1, 1, 1, 740
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Used Oil Compliance Consultants', 'used-oil-compliance-consultants', 4, id, '#E8553D', 1, 1, 1, 750
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vapor Intrusion Consultants', 'vapor-intrusion-consultants', 4, id, '#E8553D', 1, 1, 1, 760
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Virtual PPA Consultants', 'virtual-ppa-consultants', 4, id, '#E8553D', 1, 1, 1, 770
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wetland Mitigation Consultants', 'wetland-mitigation-consultants', 4, id, '#E8553D', 1, 1, 1, 780
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wetlands Delineators', 'wetlands-delineators', 4, id, '#E8553D', 1, 1, 1, 790
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wildlife Biologists', 'wildlife-biologists', 4, id, '#E8553D', 1, 1, 1, 800
  FROM categories WHERE slug = 'specialty-sustainability-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Circular Economy Consultants', 'circular-economy-consultants', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'sustainable-supply-chain-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sustainable Sourcing Consultants', 'sustainable-sourcing-consultants', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'sustainable-supply-chain-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Clean Water Act Consultants', 'clean-water-act-consultants', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'water-waste-resource-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cultural Resources Consultants', 'cultural-resources-consultants', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'water-waste-resource-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Zero Waste Consultants', 'zero-waste-consultants', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'water-waste-resource-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cloud Architecture Consultants', 'cloud-architecture-consultants', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'cloud-infrastructure-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cloud Cost Advisors', 'cloud-cost-advisors', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'cloud-infrastructure-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cloud Migration Advisors', 'cloud-migration-advisors', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'cloud-infrastructure-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Multi-Cloud Strategy Advisors', 'multi-cloud-strategy-advisors', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'cloud-infrastructure-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CISO Advisory Firms', 'ciso-advisory-firms', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'cybersecurity-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cybersecurity Strategy Advisors', 'cybersecurity-strategy-advisors', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'cybersecurity-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fractional CISO Services', 'fractional-ciso-services', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'cybersecurity-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Virtual CISO Providers', 'virtual-ciso-providers', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'cybersecurity-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Strategy Consultants', 'data-strategy-consultants', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'data-analytics-bi-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Enterprise Architecture Consultants', 'enterprise-architecture-consultants', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'enterprise-systems-erp-consulting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Governance Advisors', 'ai-governance-advisors', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Risk Advisors', 'ai-risk-advisors', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Use Case Discovery Consultants', 'ai-use-case-discovery-consultants', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'API Strategy Consultants', 'api-strategy-consultants', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Application Modernization Advisors', 'application-modernization-advisors', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Application Portfolio Rationalization', 'application-portfolio-rationalization', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Blockchain Audit Firms', 'blockchain-audit-firms', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CIO Advisory Firms', 'cio-advisory-firms', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Chatbot Implementation Firms', 'chatbot-implementation-firms', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Computer Vision Consultants', 'computer-vision-consultants', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Custom GPT Builders', 'custom-gpt-builders', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Architecture Consultants', 'data-architecture-consultants', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Catalog Consultants', 'data-catalog-consultants', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Governance Consultants', 'data-governance-consultants', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Lineage Consultants', 'data-lineage-consultants', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Protection Strategy Advisors', 'data-protection-strategy-advisors', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Quality Consultants', 'data-quality-consultants', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'FinOps Advisors', 'finops-advisors', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fractional CIO Services', 'fractional-cio-services', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Generative AI Advisors', 'generative-ai-advisors', 4, id, '#E8553D', 1, 1, 1, 200
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hyperautomation Consulting', 'hyperautomation-consulting', 4, id, '#E8553D', 1, 1, 1, 210
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IT Due Diligence for M&A', 'it-due-diligence-for-m-a', 4, id, '#E8553D', 1, 1, 1, 220
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IT Roadmap Consultants', 'it-roadmap-consultants', 4, id, '#E8553D', 1, 1, 1, 230
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Identity Strategy Advisors', 'identity-strategy-advisors', 4, id, '#E8553D', 1, 1, 1, 240
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Independent Technology Advisors', 'independent-technology-advisors', 4, id, '#E8553D', 1, 1, 1, 250
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Integration Architects', 'integration-architects', 4, id, '#E8553D', 1, 1, 1, 260
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Intelligent Automation Consulting', 'intelligent-automation-consulting', 4, id, '#E8553D', 1, 1, 1, 270
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Legacy System Modernization Advisors', 'legacy-system-modernization-advisors', 4, id, '#E8553D', 1, 1, 1, 280
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Low-Code Implementation Partners', 'low-code-implementation-partners', 4, id, '#E8553D', 1, 1, 1, 290
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ML Engineering Consultants', 'ml-engineering-consultants', 4, id, '#E8553D', 1, 1, 1, 300
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mainframe Modernization Advisors', 'mainframe-modernization-advisors', 4, id, '#E8553D', 1, 1, 1, 310
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Master Data Management Consultants', 'master-data-management-consultants', 4, id, '#E8553D', 1, 1, 1, 320
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Microservices Consultants', 'microservices-consultants', 4, id, '#E8553D', 1, 1, 1, 330
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Modern Data Stack Consultants', 'modern-data-stack-consultants', 4, id, '#E8553D', 1, 1, 1, 340
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'NLP Consulting Firms', 'nlp-consulting-firms', 4, id, '#E8553D', 1, 1, 1, 350
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Open Source Compliance Audits', 'open-source-compliance-audits', 4, id, '#E8553D', 1, 1, 1, 360
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Privacy Strategy Advisors', 'privacy-strategy-advisors', 4, id, '#E8553D', 1, 1, 1, 370
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Process Discovery Consultants', 'process-discovery-consultants', 4, id, '#E8553D', 1, 1, 1, 380
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Process Mining Consultants', 'process-mining-consultants', 4, id, '#E8553D', 1, 1, 1, 390
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'RPA Consulting', 'rpa-consulting', 4, id, '#E8553D', 1, 1, 1, 400
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real-Time Streaming Consultants', 'real-time-streaming-consultants', 4, id, '#E8553D', 1, 1, 1, 410
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Responsible AI Consultants', 'responsible-ai-consultants', 4, id, '#E8553D', 1, 1, 1, 420
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SaaS Optimization Advisors', 'saas-optimization-advisors', 4, id, '#E8553D', 1, 1, 1, 430
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SaaS Spend Management Advisors', 'saas-spend-management-advisors', 4, id, '#E8553D', 1, 1, 1, 440
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Security Code Audit Firms', 'security-code-audit-firms', 4, id, '#E8553D', 1, 1, 1, 450
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Service Mesh Consultants', 'service-mesh-consultants', 4, id, '#E8553D', 1, 1, 1, 460
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Smart Contract Audit Firms', 'smart-contract-audit-firms-pro', 4, id, '#E8553D', 1, 1, 1, 470
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Software Asset Management Advisors', 'software-asset-management-advisors', 4, id, '#E8553D', 1, 1, 1, 480
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Software License Compliance Audits', 'software-license-compliance-audits', 4, id, '#E8553D', 1, 1, 1, 490
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Solution Architecture Firms', 'solution-architecture-firms', 4, id, '#E8553D', 1, 1, 1, 500
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Source Code Audit Firms', 'source-code-audit-firms', 4, id, '#E8553D', 1, 1, 1, 510
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Supplier Cyber Risk Assessors', 'supplier-cyber-risk-assessors', 4, id, '#E8553D', 1, 1, 1, 520
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Technical Architecture Firms', 'technical-architecture-firms', 4, id, '#E8553D', 1, 1, 1, 530
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Technology Due Diligence Firms', 'technology-due-diligence-firms', 4, id, '#E8553D', 1, 1, 1, 540
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vector Search Consultants', 'vector-search-consultants', 4, id, '#E8553D', 1, 1, 1, 550
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vendor Risk Management Firms', 'vendor-risk-management-firms', 4, id, '#E8553D', 1, 1, 1, 560
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Virtual CIO Providers', 'virtual-cio-providers', 4, id, '#E8553D', 1, 1, 1, 570
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Voice Bot Implementation Firms', 'voice-bot-implementation-firms', 4, id, '#E8553D', 1, 1, 1, 580
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Workflow Automation Consultants', 'workflow-automation-consultants', 4, id, '#E8553D', 1, 1, 1, 590
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Zero Trust Strategy Advisors', 'zero-trust-strategy-advisors', 4, id, '#E8553D', 1, 1, 1, 600
  FROM categories WHERE slug = 'specialty-technology-advisory' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Technology Strategy Advisors', 'technology-strategy-advisors', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'technology-strategy-digital-transformation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Interpreters', 'interpreters', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'interpretation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Phone Interpretation Services', 'phone-interpretation-services', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'interpretation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video Remote Interpretation', 'video-remote-interpretation', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'interpretation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Localization Services', 'localization-services-pro', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'localization' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Afrikaans Translators', 'afrikaans-translators', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'other-translation-language-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Austrian German Translators', 'austrian-german-translators', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'other-translation-language-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Canadian French Translators', 'canadian-french-translators', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'other-translation-language-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Castilian Spanish Translators', 'castilian-spanish-translators', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'other-translation-language-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cultural Adaptation Services', 'cultural-adaptation-services', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'other-translation-language-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dubbing Services', 'dubbing-services', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'other-translation-language-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Egyptian Arabic Translators', 'egyptian-arabic-translators', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'other-translation-language-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Endangered Language Specialists', 'endangered-language-specialists', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'other-translation-language-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'European French Translators', 'european-french-translators', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'other-translation-language-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Haitian Creole Translators', 'haitian-creole-translators', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'other-translation-language-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hungarian Translators', 'hungarian-translators', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'other-translation-language-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Indonesian Translators', 'indonesian-translators', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'other-translation-language-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Levantine Arabic Translators', 'levantine-arabic-translators', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'other-translation-language-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Malayalam Translators', 'malayalam-translators', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'other-translation-language-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mandarin Chinese Translators', 'mandarin-chinese-translators', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'other-translation-language-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mayan Language Translators', 'mayan-language-translators', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'other-translation-language-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mexican Spanish Translators', 'mexican-spanish-translators', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'other-translation-language-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Modern Standard Arabic Translators', 'modern-standard-arabic-translators', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'other-translation-language-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Moroccan Arabic Translators', 'moroccan-arabic-translators', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'other-translation-language-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Multilingual Content Creation Agencies', 'multilingual-content-creation-agencies', 4, id, '#E8553D', 1, 1, 1, 200
  FROM categories WHERE slug = 'other-translation-language-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Multilingual Customer Support Services', 'multilingual-customer-support-services', 4, id, '#E8553D', 1, 1, 1, 210
  FROM categories WHERE slug = 'other-translation-language-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Multilingual Voice Talent Agencies', 'multilingual-voice-talent-agencies', 4, id, '#E8553D', 1, 1, 1, 220
  FROM categories WHERE slug = 'other-translation-language-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Portuguese Translators', 'portuguese-translators', 4, id, '#E8553D', 1, 1, 1, 230
  FROM categories WHERE slug = 'other-translation-language-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Slovenian Translators', 'slovenian-translators', 4, id, '#E8553D', 1, 1, 1, 240
  FROM categories WHERE slug = 'other-translation-language-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Traditional Chinese Translators', 'traditional-chinese-translators', 4, id, '#E8553D', 1, 1, 1, 250
  FROM categories WHERE slug = 'other-translation-language-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vietnamese Translators', 'vietnamese-translators', 4, id, '#E8553D', 1, 1, 1, 260
  FROM categories WHERE slug = 'other-translation-language-services-specialties' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Closed Captioning Services', 'closed-captioning-services', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'transcription-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Multilingual SEO Services', 'multilingual-seo-services', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'transcription-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real-Time Captioning Services', 'real-time-captioning-services', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'transcription-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SDH Caption Services', 'sdh-caption-services', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'transcription-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Transcription Services', 'transcription-services', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'transcription-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video Subtitling Services', 'video-subtitling-services', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'transcription-pro' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Academic Records Translation', 'academic-records-translation', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bengali Translators', 'bengali-translators', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bosnian Translators', 'bosnian-translators', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Burmese Translators', 'burmese-translators', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cantonese Translators', 'cantonese-translators', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Certified Translation Companies', 'certified-translation-companies', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Certified Translators', 'certified-translators', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Croatian Translators', 'croatian-translators', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dari Translators', 'dari-translators', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dutch Translators', 'dutch-translators', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Filipino Translators', 'filipino-translators', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Flemish Translators', 'flemish-translators', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'French Translators', 'french-translators', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'German Translators', 'german-translators', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Greek Translators', 'greek-translators', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Gujarati Translators', 'gujarati-translators', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hausa Translators', 'hausa-translators', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hindi Translators', 'hindi-translators', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Igbo Translators', 'igbo-translators', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Italian Translators', 'italian-translators', 4, id, '#E8553D', 1, 1, 1, 200
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Japanese Translators', 'japanese-translators', 4, id, '#E8553D', 1, 1, 1, 210
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Kannada Translators', 'kannada-translators', 4, id, '#E8553D', 1, 1, 1, 220
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Khmer Translators', 'khmer-translators', 4, id, '#E8553D', 1, 1, 1, 230
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Korean Translators', 'korean-translators', 4, id, '#E8553D', 1, 1, 1, 240
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Legal Document Translation', 'legal-document-translation', 4, id, '#E8553D', 1, 1, 1, 250
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Malay Translators', 'malay-translators', 4, id, '#E8553D', 1, 1, 1, 260
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Oromo Translators', 'oromo-translators', 4, id, '#E8553D', 1, 1, 1, 270
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Punjabi Translators', 'punjabi-translators', 4, id, '#E8553D', 1, 1, 1, 280
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Quechua Translators', 'quechua-translators', 4, id, '#E8553D', 1, 1, 1, 290
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Russian Translators', 'russian-translators', 4, id, '#E8553D', 1, 1, 1, 300
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Simplified Chinese Translators', 'simplified-chinese-translators', 4, id, '#E8553D', 1, 1, 1, 310
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Slovak Translators', 'slovak-translators', 4, id, '#E8553D', 1, 1, 1, 320
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Spanish Translators', 'spanish-translators', 4, id, '#E8553D', 1, 1, 1, 330
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Swahili Translators', 'swahili-translators', 4, id, '#E8553D', 1, 1, 1, 340
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sworn Translator Services', 'sworn-translator-services', 4, id, '#E8553D', 1, 1, 1, 350
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tagalog Translators', 'tagalog-translators', 4, id, '#E8553D', 1, 1, 1, 360
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tamil Translators', 'tamil-translators', 4, id, '#E8553D', 1, 1, 1, 370
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Telugu Translators', 'telugu-translators', 4, id, '#E8553D', 1, 1, 1, 380
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tigrinya Translators', 'tigrinya-translators', 4, id, '#E8553D', 1, 1, 1, 390
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Translation Agencies', 'translation-agencies', 4, id, '#E8553D', 1, 1, 1, 400
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Translation Services', 'translation-services-2', 4, id, '#E8553D', 1, 1, 1, 410
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Turkish Translators', 'turkish-translators', 4, id, '#E8553D', 1, 1, 1, 420
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ukrainian Translators', 'ukrainian-translators', 4, id, '#E8553D', 1, 1, 1, 430
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Urdu Translators', 'urdu-translators', 4, id, '#E8553D', 1, 1, 1, 440
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Yiddish Translators', 'yiddish-translators', 4, id, '#E8553D', 1, 1, 1, 450
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Yoruba Translators', 'yoruba-translators', 4, id, '#E8553D', 1, 1, 1, 460
  FROM categories WHERE slug = 'translation-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Academic Researchers', 'academic-researchers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'academic-scientific-writing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Affiliate Content Writers', 'affiliate-content-writers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'content-writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Amazon Listing Copywriters', 'amazon-listing-copywriters', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'content-writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Branding Copywriters', 'branding-copywriters', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'content-writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Comparison Article Writers', 'comparison-article-writers', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'content-writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Course Content Writers', 'course-content-writers', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'content-writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Direct Response Copywriters', 'direct-response-copywriters', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'content-writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'E-Learning Content Writers', 'e-learning-content-writers', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'content-writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ghostwriters', 'ghostwriters', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'content-writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'How-To Article Writers', 'how-to-article-writers', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'content-writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Magazine Article Writers', 'magazine-article-writers', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'content-writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pillar Content Writers', 'pillar-content-writers', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'content-writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pitch Deck Copywriters', 'pitch-deck-copywriters', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'content-writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Review Content Writers', 'review-content-writers', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'content-writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SEO Blog Writers', 'seo-blog-writers', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'content-writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Website Copywriters', 'website-copywriters', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'content-writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Editorial Writers', 'editorial-writers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'editing-proofreading' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Editors', 'editors', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'editing-proofreading' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Proofreaders', 'proofreaders', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'editing-proofreading' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Grant Writers', 'grant-writers-2', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'grant-proposal-writing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Background Researchers', 'background-researchers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'research-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cemetery Researchers', 'cemetery-researchers', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'research-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Court Records Researchers', 'court-records-researchers', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'research-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Due Diligence Researchers', 'due-diligence-researchers', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'research-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Genealogy Researchers', 'genealogy-researchers', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'research-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Historical Researchers', 'historical-researchers', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'research-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Investigative Researchers', 'investigative-researchers', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'research-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Legal Researchers', 'legal-researchers', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'research-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Library Researchers', 'library-researchers', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'research-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Market Researchers for Hire', 'market-researchers-for-hire', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'research-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Open Source Intelligence Researchers', 'open-source-intelligence-researchers', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'research-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Patent Researchers', 'patent-researchers', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'research-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Research Assistants', 'research-assistants', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'research-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Title Researchers', 'title-researchers', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'research-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'About Page Writers', 'about-page-writers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Annual Report Writers', 'annual-report-writers', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Assessment Writers', 'assessment-writers', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Asset Locators', 'asset-locators', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Award Acceptance Speech Writers', 'award-acceptance-speech-writers', 4, id, '#E8553D', 1, 1, 1, 50
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Best Man Speech Writers', 'best-man-speech-writers', 4, id, '#E8553D', 1, 1, 1, 60
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Beta Readers', 'beta-readers', 4, id, '#E8553D', 1, 1, 1, 70
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bio Writers', 'bio-writers', 4, id, '#E8553D', 1, 1, 1, 80
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Case Study Writers', 'case-study-writers', 4, id, '#E8553D', 1, 1, 1, 90
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cohort Course Writers', 'cohort-course-writers', 4, id, '#E8553D', 1, 1, 1, 100
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cold Email Writers', 'cold-email-writers', 4, id, '#E8553D', 1, 1, 1, 110
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'College Application Essay Writers', 'college-application-essay-writers', 4, id, '#E8553D', 1, 1, 1, 120
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Comic Book Writers', 'comic-book-writers', 4, id, '#E8553D', 1, 1, 1, 130
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Commencement Speech Writers', 'commencement-speech-writers', 4, id, '#E8553D', 1, 1, 1, 140
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Commercial Writers', 'commercial-writers', 4, id, '#E8553D', 1, 1, 1, 150
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Corporate Communications Writers', 'corporate-communications-writers', 4, id, '#E8553D', 1, 1, 1, 160
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Corporate Video Script Writers', 'corporate-video-script-writers', 4, id, '#E8553D', 1, 1, 1, 170
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cover Letter Writers', 'cover-letter-writers', 4, id, '#E8553D', 1, 1, 1, 180
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Curriculum Writers', 'curriculum-writers', 4, id, '#E8553D', 1, 1, 1, 190
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Customer Story Writers', 'customer-story-writers', 4, id, '#E8553D', 1, 1, 1, 200
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Documentary Writers', 'documentary-writers', 4, id, '#E8553D', 1, 1, 1, 210
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Drama Writers', 'drama-writers', 4, id, '#E8553D', 1, 1, 1, 220
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Email Sequence Writers', 'email-sequence-writers', 4, id, '#E8553D', 1, 1, 1, 230
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Erotica Writers', 'erotica-writers', 4, id, '#E8553D', 1, 1, 1, 240
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Etsy Listing Writers', 'etsy-listing-writers', 4, id, '#E8553D', 1, 1, 1, 250
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Eulogy Writers', 'eulogy-writers', 4, id, '#E8553D', 1, 1, 1, 260
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Explainer Video Script Writers', 'explainer-video-script-writers', 4, id, '#E8553D', 1, 1, 1, 270
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fact Checkers', 'fact-checkers', 4, id, '#E8553D', 1, 1, 1, 280
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fantasy Writers', 'fantasy-writers', 4, id, '#E8553D', 1, 1, 1, 290
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Founder Story Writers', 'founder-story-writers', 4, id, '#E8553D', 1, 1, 1, 300
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Freelance Writers', 'freelance-writers', 4, id, '#E8553D', 1, 1, 1, 310
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Graphic Novel Writers', 'graphic-novel-writers', 4, id, '#E8553D', 1, 1, 1, 320
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hallmark Movie Writers', 'hallmark-movie-writers', 4, id, '#E8553D', 1, 1, 1, 330
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Help Center Writers', 'help-center-writers', 4, id, '#E8553D', 1, 1, 1, 340
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Historical Fiction Writers', 'historical-fiction-writers', 4, id, '#E8553D', 1, 1, 1, 350
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Horror Writers', 'horror-writers', 4, id, '#E8553D', 1, 1, 1, 360
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IPO Prospectus Writers', 'ipo-prospectus-writers', 4, id, '#E8553D', 1, 1, 1, 370
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Industry Magazine Writers', 'industry-magazine-writers', 4, id, '#E8553D', 1, 1, 1, 380
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Investigative Journalists', 'investigative-journalists', 4, id, '#E8553D', 1, 1, 1, 390
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Investor Communications Writers', 'investor-communications-writers', 4, id, '#E8553D', 1, 1, 1, 400
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Knowledge Base Writers', 'knowledge-base-writers', 4, id, '#E8553D', 1, 1, 1, 410
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lesson Plan Writers', 'lesson-plan-writers', 4, id, '#E8553D', 1, 1, 1, 420
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lifetime Movie Writers', 'lifetime-movie-writers', 4, id, '#E8553D', 1, 1, 1, 430
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'LinkedIn Profile Writers', 'linkedin-profile-writers-2', 4, id, '#E8553D', 1, 1, 1, 440
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Listicle Writers', 'listicle-writers', 4, id, '#E8553D', 1, 1, 1, 450
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Literary Fiction Writers', 'literary-fiction-writers', 4, id, '#E8553D', 1, 1, 1, 460
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Long-Form Journalists', 'long-form-journalists', 4, id, '#E8553D', 1, 1, 1, 470
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Long-Form Sales Letter Writers', 'long-form-sales-letter-writers', 4, id, '#E8553D', 1, 1, 1, 480
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Maid of Honor Speech Writers', 'maid-of-honor-speech-writers', 4, id, '#E8553D', 1, 1, 1, 490
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Manga Script Writers', 'manga-script-writers', 4, id, '#E8553D', 1, 1, 1, 500
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Med School Application Writers', 'med-school-application-writers', 4, id, '#E8553D', 1, 1, 1, 510
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Media Pitch Writers', 'media-pitch-writers', 4, id, '#E8553D', 1, 1, 1, 520
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Middle Grade Writers', 'middle-grade-writers', 4, id, '#E8553D', 1, 1, 1, 530
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mystery Writers', 'mystery-writers', 4, id, '#E8553D', 1, 1, 1, 540
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Newsletter Writers', 'newsletter-writers', 4, id, '#E8553D', 1, 1, 1, 550
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Niche Site Writers', 'niche-site-writers', 4, id, '#E8553D', 1, 1, 1, 560
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'OSINT Investigators', 'osint-investigators', 4, id, '#E8553D', 1, 1, 1, 570
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Online Course Writers', 'online-course-writers', 4, id, '#E8553D', 1, 1, 1, 580
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Op-Ed Writers', 'op-ed-writers', 4, id, '#E8553D', 1, 1, 1, 590
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'People Locators', 'people-locators', 4, id, '#E8553D', 1, 1, 1, 600
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Personal Brand Writers', 'personal-brand-writers', 4, id, '#E8553D', 1, 1, 1, 610
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Personal Essay Writers', 'personal-essay-writers', 4, id, '#E8553D', 1, 1, 1, 620
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Personal Statement Writers', 'personal-statement-writers', 4, id, '#E8553D', 1, 1, 1, 630
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Picture Book Writers', 'picture-book-writers', 4, id, '#E8553D', 1, 1, 1, 640
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pitch Deck Writers', 'pitch-deck-writers', 4, id, '#E8553D', 1, 1, 1, 650
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pitch Document Writers', 'pitch-document-writers', 4, id, '#E8553D', 1, 1, 1, 660
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Plagiarism Checkers', 'plagiarism-checkers', 4, id, '#E8553D', 1, 1, 1, 670
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Press Release Writers', 'press-release-writers', 4, id, '#E8553D', 1, 1, 1, 680
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Product Description Writers', 'product-description-writers', 4, id, '#E8553D', 1, 1, 1, 690
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Programmatic SEO Writers', 'programmatic-seo-writers', 4, id, '#E8553D', 1, 1, 1, 700
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Resume Writers', 'resume-writers-2', 4, id, '#E8553D', 1, 1, 1, 710
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Romance Writers', 'romance-writers', 4, id, '#E8553D', 1, 1, 1, 720
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Roundup Writers', 'roundup-writers', 4, id, '#E8553D', 1, 1, 1, 730
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales Page Writers', 'sales-page-writers', 4, id, '#E8553D', 1, 1, 1, 740
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Scholarship Essay Writers', 'scholarship-essay-writers', 4, id, '#E8553D', 1, 1, 1, 750
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sci-Fi Writers', 'sci-fi-writers', 4, id, '#E8553D', 1, 1, 1, 760
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Screenplay Writers', 'screenplay-writers', 4, id, '#E8553D', 1, 1, 1, 770
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sensitivity Readers', 'sensitivity-readers', 4, id, '#E8553D', 1, 1, 1, 780
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Service Page Writers', 'service-page-writers', 4, id, '#E8553D', 1, 1, 1, 790
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Show Runner Consultants', 'show-runner-consultants', 4, id, '#E8553D', 1, 1, 1, 800
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sitcom Writers', 'sitcom-writers', 4, id, '#E8553D', 1, 1, 1, 810
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Skip Tracers', 'skip-tracers', 4, id, '#E8553D', 1, 1, 1, 820
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Spec Script Writers', 'spec-script-writers', 4, id, '#E8553D', 1, 1, 1, 830
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Standard Operating Procedure Writers', 'standard-operating-procedure-writers', 4, id, '#E8553D', 1, 1, 1, 840
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sustainability Report Writers', 'sustainability-report-writers', 4, id, '#E8553D', 1, 1, 1, 850
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'TV Bible Writers', 'tv-bible-writers', 4, id, '#E8553D', 1, 1, 1, 860
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'TV Pilot Writers', 'tv-pilot-writers', 4, id, '#E8553D', 1, 1, 1, 870
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Test Item Writers', 'test-item-writers', 4, id, '#E8553D', 1, 1, 1, 880
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Textbook Writers', 'textbook-writers', 4, id, '#E8553D', 1, 1, 1, 890
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Thought Leadership Writers', 'thought-leadership-writers', 4, id, '#E8553D', 1, 1, 1, 900
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Thriller Writers', 'thriller-writers', 4, id, '#E8553D', 1, 1, 1, 910
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Toast Writers', 'toast-writers', 4, id, '#E8553D', 1, 1, 1, 920
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trade Magazine Writers', 'trade-magazine-writers', 4, id, '#E8553D', 1, 1, 1, 930
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Training Manual Writers', 'training-manual-writers', 4, id, '#E8553D', 1, 1, 1, 940
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Treatment Writers', 'treatment-writers', 4, id, '#E8553D', 1, 1, 1, 950
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Webinar Script Writers', 'webinar-script-writers', 4, id, '#E8553D', 1, 1, 1, 960
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wedding Speech Writers', 'wedding-speech-writers', 4, id, '#E8553D', 1, 1, 1, 970
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wire Distribution Services', 'wire-distribution-services', 4, id, '#E8553D', 1, 1, 1, 980
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Worksheet Writers', 'worksheet-writers', 4, id, '#E8553D', 1, 1, 1, 990
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'YA Writers', 'ya-writers', 4, id, '#E8553D', 1, 1, 1, 1000
  FROM categories WHERE slug = 'specialty-writing-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'API Documentation Writers', 'api-documentation-writers', 4, id, '#E8553D', 1, 1, 1, 10
  FROM categories WHERE slug = 'technical-business-writing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Technical Writers', 'technical-writers', 4, id, '#E8553D', 1, 1, 1, 20
  FROM categories WHERE slug = 'technical-business-writing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'User Manual Writers', 'user-manual-writers', 4, id, '#E8553D', 1, 1, 1, 30
  FROM categories WHERE slug = 'technical-business-writing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'White Paper Writers', 'white-paper-writers', 4, id, '#E8553D', 1, 1, 1, 40
  FROM categories WHERE slug = 'technical-business-writing' AND level = 3 LIMIT 1;

SET FOREIGN_KEY_CHECKS = 1;

-- ═══ Section F: Re-attach existing professional-services submission ═══
-- 1 live listing: AZB & Partners (id=22) — Indian M&A/corporate law firm.
-- Old category: Lawyers & Law Firms by Specialty > Corporate Law Attorneys
-- Old listing_type: "Corporate Law: Mergers & Acquisitions"
-- New mapping: Legal Services > Business Law > Mergers & Acquisitions Lawyers
-- See exports/professional-services-listing-mapping-notes.md for reasoning.
UPDATE submissions
   SET category_id = (SELECT id FROM categories WHERE slug = 'mergers-acquisitions-lawyers' AND level = 4 LIMIT 1)
 WHERE id = 22;

-- Verification (read-only):
-- SELECT s.id, s.company_name, s.category_id, c.slug AS new_slug, c.level
--   FROM submissions s LEFT JOIN categories c ON c.id = s.category_id
--  WHERE s.id = 22;
