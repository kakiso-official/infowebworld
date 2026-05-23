-- ============================================================
-- InfoWebWorld — Software & SaaS Taxonomy v2 Migration
-- Rebuilds the Software & SaaS sector with 1081 hierarchical
-- categories across 3 nested levels (DB L2..L4 under existing
-- 'software-saas' L1).
--
-- Source: Software-saas-taxonomy-full v1 final.xlsx
-- Run each section IN ORDER in phpMyAdmin.
-- ============================================================

-- ═══ Section A: Safety ═════════════════════════════════════════
SET FOREIGN_KEY_CHECKS = 0;

-- ═══ Section B: Disconnect existing software-saas submissions ═
-- Listings are PRESERVED. We null out category_id + listing_type_id
-- here, then re-attach them in Section F (appended at the bottom).
UPDATE submissions
   SET category_id = NULL, listing_type_id = NULL
 WHERE category_id IN (
   SELECT id FROM (
     SELECT c.id FROM categories c
      LEFT JOIN categories p   ON p.id   = c.parent_id
      LEFT JOIN categories gp  ON gp.id  = p.parent_id
      LEFT JOIN categories ggp ON ggp.id = gp.parent_id
      WHERE c.parent_id  = (SELECT id FROM categories WHERE slug='software-saas' AND level=1)
         OR p.parent_id  = (SELECT id FROM categories WHERE slug='software-saas' AND level=1)
         OR gp.parent_id = (SELECT id FROM categories WHERE slug='software-saas' AND level=1)
         OR ggp.parent_id = (SELECT id FROM categories WHERE slug='software-saas' AND level=1)
   ) AS saas_ids
 );

-- ═══ Section C: Delete old software-saas dependents + categories ═══
-- Order: SEO content → listing_types → child cats → parent cats.
-- JOIN-based (no scalar subquery on same table) to dodge MySQL #1093.

-- C.1: delete category_seo_content for old software-saas categories
DELETE sc FROM category_seo_content sc
  JOIN categories c ON c.id = sc.category_id
  LEFT JOIN categories p  ON p.id  = c.parent_id
  LEFT JOIN categories gp ON gp.id = p.parent_id
 WHERE c.parent_id  = (SELECT id FROM categories WHERE slug='software-saas' AND level=1)
    OR p.parent_id  = (SELECT id FROM categories WHERE slug='software-saas' AND level=1)
    OR gp.parent_id = (SELECT id FROM categories WHERE slug='software-saas' AND level=1);

-- C.2: delete listing_types tied to old software-saas categories
DELETE lt FROM listing_types lt
  JOIN categories c ON c.id = lt.category_id
  LEFT JOIN categories p ON p.id = c.parent_id
 WHERE c.parent_id = (SELECT id FROM categories WHERE slug='software-saas' AND level=1)
    OR p.parent_id = (SELECT id FROM categories WHERE slug='software-saas' AND level=1);

-- C.3: delete L3 categories under software-saas (JOIN-based)
DELETE c FROM categories c
  JOIN categories p  ON p.id  = c.parent_id
  JOIN categories gp ON gp.id = p.parent_id
 WHERE c.level = 3 AND gp.slug = 'software-saas' AND gp.level = 1;

-- C.4: delete L2 categories under software-saas. JOIN-based.
DELETE c FROM categories c
  JOIN categories p ON p.id = c.parent_id
 WHERE c.level = 2 AND p.slug = 'software-saas' AND p.level = 1;

-- ═══ Section D.1: Insert 20 new L2 categories ═══
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CRM & Sales Software', 'crm-sales-software', 2, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'software-saas' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketing Software', 'marketing-software', 2, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'software-saas' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Customer Service & Support Software', 'customer-service-support-software', 2, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'software-saas' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HR & People Management Software', 'hr-people-management-software', 2, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'software-saas' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Accounting & Finance Software', 'accounting-finance-software', 2, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'software-saas' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ERP & Operations Software', 'erp-operations-software', 2, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'software-saas' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Project Management Software', 'project-management-software', 2, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'software-saas' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Collaboration & Productivity Software', 'collaboration-productivity-software', 2, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'software-saas' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Communication Software', 'communication-software', 2, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'software-saas' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IT Management Software', 'it-management-software', 2, id, '#3B82F6', 1, 1, 1, 100
  FROM categories WHERE slug = 'software-saas' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cybersecurity Software', 'cybersecurity-software', 2, id, '#3B82F6', 1, 1, 1, 110
  FROM categories WHERE slug = 'software-saas' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data & Analytics Software', 'data-analytics-software', 2, id, '#3B82F6', 1, 1, 1, 120
  FROM categories WHERE slug = 'software-saas' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Development & DevOps Software', 'development-devops-software', 2, id, '#3B82F6', 1, 1, 1, 130
  FROM categories WHERE slug = 'software-saas' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'eCommerce Software', 'ecommerce-software', 2, id, '#3B82F6', 1, 1, 1, 140
  FROM categories WHERE slug = 'software-saas' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Content Management Software', 'content-management-software', 2, id, '#3B82F6', 1, 1, 1, 150
  FROM categories WHERE slug = 'software-saas' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Design & Creative Software', 'design-creative-software', 2, id, '#3B82F6', 1, 1, 1, 160
  FROM categories WHERE slug = 'software-saas' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video & Audio Software', 'video-audio-software', 2, id, '#3B82F6', 1, 1, 1, 170
  FROM categories WHERE slug = 'software-saas' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Digital Advertising Software', 'digital-advertising-software', 2, id, '#3B82F6', 1, 1, 1, 180
  FROM categories WHERE slug = 'software-saas' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Industry-Specific Software', 'industry-specific-software', 2, id, '#3B82F6', 1, 1, 1, 190
  FROM categories WHERE slug = 'software-saas' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Emerging Technology', 'emerging-technology', 2, id, '#3B82F6', 1, 1, 1, 200
  FROM categories WHERE slug = 'software-saas' AND level = 1 LIMIT 1;

-- ═══ Section D.2: Insert 145 new L3 categories ═══
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CRM Platforms', 'crm-platforms', 3, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'crm-sales-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales Engagement & Automation', 'sales-engagement-automation', 3, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'crm-sales-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lead Management', 'lead-management', 3, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'crm-sales-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CPQ & Quoting', 'cpq-quoting', 3, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'crm-sales-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales Intelligence & Analytics', 'sales-intelligence-analytics', 3, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'crm-sales-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Contracts & E-Signature', 'contracts-e-signature', 3, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'crm-sales-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Partnerships & Channel Sales', 'partnerships-channel-sales', 3, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'crm-sales-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketing Automation', 'marketing-automation', 3, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'marketing-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Email Marketing', 'email-marketing', 3, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'marketing-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SEO Software', 'seo-software', 3, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'marketing-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Social Media Marketing', 'social-media-marketing', 3, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'marketing-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Content Marketing', 'content-marketing', 3, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'marketing-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Account-Based Marketing (ABM)', 'account-based-marketing-abm', 3, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'marketing-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Conversion Optimization', 'conversion-optimization', 3, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'marketing-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketing Analytics & Attribution', 'marketing-analytics-attribution', 3, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'marketing-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SMS & Mobile Marketing', 'sms-mobile-marketing', 3, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'marketing-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brand & Reputation', 'brand-reputation', 3, id, '#3B82F6', 1, 1, 1, 100
  FROM categories WHERE slug = 'marketing-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Event Marketing', 'event-marketing', 3, id, '#3B82F6', 1, 1, 1, 110
  FROM categories WHERE slug = 'marketing-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Customer Data Platforms', 'customer-data-platforms', 3, id, '#3B82F6', 1, 1, 1, 120
  FROM categories WHERE slug = 'marketing-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Other Marketing', 'other-marketing', 3, id, '#3B82F6', 1, 1, 1, 130
  FROM categories WHERE slug = 'marketing-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Help Desk & Ticketing', 'help-desk-ticketing', 3, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'customer-service-support-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Live Chat & Messaging', 'live-chat-messaging', 3, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'customer-service-support-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Call & Contact Center', 'call-contact-center', 3, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'customer-service-support-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Customer Experience (CX)', 'customer-experience-cx', 3, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'customer-service-support-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Customer Success', 'customer-success', 3, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'customer-service-support-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Field Service & Appointments', 'field-service-appointments', 3, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'customer-service-support-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Core HR & HRIS', 'core-hr-hris', 3, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'hr-people-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Recruiting & ATS', 'recruiting-ats', 3, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'hr-people-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Onboarding & Offboarding', 'onboarding-offboarding', 3, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'hr-people-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Payroll & Benefits', 'payroll-benefits', 3, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'hr-people-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Talent & Performance', 'talent-performance', 3, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'hr-people-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Time & Attendance', 'time-attendance', 3, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'hr-people-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Learning & Development', 'learning-development', 3, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'hr-people-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Employee Communication', 'employee-communication', 3, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'hr-people-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Employee Monitoring & Productivity', 'employee-monitoring-productivity', 3, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'hr-people-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Accounting & Bookkeeping', 'accounting-bookkeeping', 3, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'accounting-finance-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AP & AR Automation', 'ap-ar-automation', 3, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'accounting-finance-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Payments & Processing', 'payments-processing', 3, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'accounting-finance-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Financial Planning & Analysis (FP&A)', 'financial-planning-analysis-fp-a', 3, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'accounting-finance-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tax Management', 'tax-management', 3, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'accounting-finance-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Treasury & Risk', 'treasury-risk', 3, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'accounting-finance-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Spend & Expense Management', 'spend-expense-management', 3, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'accounting-finance-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Banking & Lending', 'banking-lending', 3, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'accounting-finance-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Investment & Wealth', 'investment-wealth', 3, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'accounting-finance-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Enterprise Resource Planning', 'enterprise-resource-planning', 3, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'erp-operations-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Procurement & Sourcing', 'procurement-sourcing', 3, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'erp-operations-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Inventory & Order Management', 'inventory-order-management', 3, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'erp-operations-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Supply Chain & Warehouse', 'supply-chain-warehouse', 3, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'erp-operations-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Manufacturing', 'manufacturing', 3, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'erp-operations-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Asset & Maintenance Management', 'asset-maintenance-management', 3, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'erp-operations-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Process Management', 'business-process-management', 3, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'erp-operations-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Field Operations', 'field-operations', 3, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'erp-operations-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'General Project Management', 'general-project-management', 3, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'project-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Agile & Scrum Tools', 'agile-scrum-tools', 3, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'project-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Resource & Capacity Planning', 'resource-capacity-planning', 3, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'project-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Strategic Planning', 'strategic-planning', 3, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'project-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Product Management', 'product-management-saas', 3, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'project-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Team Collaboration', 'team-collaboration', 3, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'collaboration-productivity-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Visual Collaboration', 'visual-collaboration', 3, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'collaboration-productivity-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Document & File Collaboration', 'document-file-collaboration', 3, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'collaboration-productivity-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Meetings & Scheduling', 'meetings-scheduling', 3, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'collaboration-productivity-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Productivity Tools', 'productivity-tools', 3, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'collaboration-productivity-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Knowledge Management', 'knowledge-management-saas', 3, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'collaboration-productivity-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Phone & VoIP', 'business-phone-voip', 3, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'communication-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Email & Messaging', 'email-messaging', 3, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'communication-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Notifications & Alerts', 'notifications-alerts', 3, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'communication-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IT Service Management (ITSM)', 'it-service-management-itsm', 3, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'it-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cloud Infrastructure & PaaS', 'cloud-infrastructure-paas', 3, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'it-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Network Monitoring', 'network-monitoring', 3, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'it-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Endpoint & Device Management', 'endpoint-device-management', 3, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'it-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Backup & Disaster Recovery', 'backup-disaster-recovery', 3, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'it-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Database Management', 'database-management', 3, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'it-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Integration & APIs', 'integration-apis', 3, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'it-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Endpoint Security', 'endpoint-security', 3, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'cybersecurity-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Identity & Access Management', 'identity-access-management', 3, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'cybersecurity-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cloud Security', 'cloud-security', 3, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'cybersecurity-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Network Security', 'network-security', 3, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'cybersecurity-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Email Security', 'email-security', 3, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'cybersecurity-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Web Security', 'web-security', 3, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'cybersecurity-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Security & Privacy', 'data-security-privacy', 3, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'cybersecurity-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SIEM, SOAR & Threat Intelligence', 'siem-soar-threat-intelligence', 3, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'cybersecurity-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vulnerability Management', 'vulnerability-management', 3, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'cybersecurity-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Compliance & GRC', 'compliance-grc', 3, id, '#3B82F6', 1, 1, 1, 100
  FROM categories WHERE slug = 'cybersecurity-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Intelligence (BI)', 'business-intelligence-bi', 3, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'data-analytics-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Analysis & Visualization', 'data-analysis-visualization', 3, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'data-analytics-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Big Data & Data Engineering', 'big-data-data-engineering', 3, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'data-analytics-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Governance & Quality', 'data-governance-quality', 3, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'data-analytics-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Specialized Analytics', 'specialized-analytics', 3, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'data-analytics-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Application Development', 'application-development', 3, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'development-devops-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IDEs & Code Editors', 'ides-code-editors', 3, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'development-devops-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Low-Code & No-Code Platforms', 'low-code-no-code-platforms', 3, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'development-devops-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'DevOps & CI/CD', 'devops-ci-cd', 3, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'development-devops-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Containerization', 'containerization', 3, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'development-devops-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Software Testing', 'software-testing-saas', 3, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'development-devops-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'DevSecOps', 'devsecops', 3, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'development-devops-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ecommerce Platforms', 'ecommerce-platforms', 3, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ecommerce-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Storefront & Catalog', 'storefront-catalog', 3, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ecommerce-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Subscription Management', 'subscription-management', 3, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ecommerce-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketplace & Social Commerce', 'marketplace-social-commerce', 3, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ecommerce-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Point of Sale (POS)', 'point-of-sale-pos', 3, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ecommerce-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ecommerce Marketing & Analytics', 'ecommerce-marketing-analytics', 3, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ecommerce-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CMS Platforms', 'cms-platforms', 3, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'content-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Digital Asset Management', 'digital-asset-management', 3, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'content-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Document & Content Workflow', 'document-content-workflow', 3, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'content-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Web Publishing & Building', 'web-publishing-building', 3, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'content-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Localization & Translation', 'localization-translation', 3, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'content-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Graphic Design', 'graphic-design', 3, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'design-creative-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'UX/UI Design', 'ux-ui-design', 3, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'design-creative-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Photography & Imaging', 'photography-imaging', 3, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'design-creative-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '3D & CAD', '3d-cad', 3, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'design-creative-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AR & VR', 'ar-vr', 3, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'design-creative-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video Editing & Production', 'video-editing-production', 3, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'video-audio-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video Hosting & Streaming', 'video-hosting-streaming', 3, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'video-audio-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video Marketing', 'video-marketing', 3, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'video-audio-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Audio Production', 'audio-production', 3, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'video-audio-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ad Tech Platforms', 'ad-tech-platforms', 3, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'digital-advertising-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'PPC & Search Advertising', 'ppc-search-advertising', 3, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'digital-advertising-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Display & Video Advertising', 'display-video-advertising', 3, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'digital-advertising-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile & Cross-Channel Advertising', 'mobile-cross-channel-advertising', 3, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'digital-advertising-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Healthcare Software', 'healthcare-software', 3, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'industry-specific-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Legal Software', 'legal-software', 3, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'industry-specific-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Software', 'real-estate-software', 3, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'industry-specific-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Construction Software', 'construction-software', 3, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'industry-specific-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hospitality & Travel Software', 'hospitality-travel-software', 3, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'industry-specific-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Education & eLearning', 'education-elearning', 3, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'industry-specific-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Nonprofit Software', 'nonprofit-software', 3, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'industry-specific-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Transportation & Logistics', 'transportation-logistics', 3, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'industry-specific-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Government & Public Sector', 'government-public-sector', 3, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'industry-specific-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Retail & Consumer Services', 'retail-consumer-services', 3, id, '#3B82F6', 1, 1, 1, 100
  FROM categories WHERE slug = 'industry-specific-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Recreation & Wellness', 'recreation-wellness', 3, id, '#3B82F6', 1, 1, 1, 110
  FROM categories WHERE slug = 'industry-specific-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Field Services & Trades', 'field-services-trades', 3, id, '#3B82F6', 1, 1, 1, 120
  FROM categories WHERE slug = 'industry-specific-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Agriculture & Natural Resources', 'agriculture-natural-resources', 3, id, '#3B82F6', 1, 1, 1, 130
  FROM categories WHERE slug = 'industry-specific-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Insurance Software', 'insurance-software', 3, id, '#3B82F6', 1, 1, 1, 140
  FROM categories WHERE slug = 'industry-specific-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IoT (Internet of Things)', 'iot-internet-of-things', 3, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'emerging-technology' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Blockchain & Web3', 'blockchain-web3', 3, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'emerging-technology' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Edge Computing & 5G', 'edge-computing-5g', 3, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'emerging-technology' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Engineering & Scientific', 'engineering-scientific', 3, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'design-creative-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trading & Brokerage', 'trading-brokerage', 3, id, '#3B82F6', 1, 1, 1, 100
  FROM categories WHERE slug = 'accounting-finance-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Web Hosting & Domain Services', 'web-hosting-domain-services', 3, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'it-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'System Utilities', 'system-utilities', 3, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'it-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hardware & Asset Management', 'hardware-asset-management', 3, id, '#3B82F6', 1, 1, 1, 100
  FROM categories WHERE slug = 'it-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Game Development', 'game-development', 3, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'development-devops-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Developer Utilities', 'developer-utilities', 3, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'development-devops-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Print & Publishing Tools', 'print-publishing-tools', 3, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'content-management-software' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Religious & Faith Organizations', 'religious-faith-organizations', 3, id, '#3B82F6', 1, 1, 1, 150
  FROM categories WHERE slug = 'industry-specific-software' AND level = 2 LIMIT 1;

-- ═══ Section D.3: Insert 916 new L4 categories ═══
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CRM Software', 'crm-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'crm-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Small Business CRM', 'small-business-crm', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'crm-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate CRM', 'real-estate-crm', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'crm-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Healthcare CRM', 'healthcare-crm', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'crm-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Financial Services CRM', 'financial-services-crm', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'crm-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Insurance CRM', 'insurance-crm', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'crm-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Construction CRM', 'construction-crm', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'crm-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Nonprofit CRM', 'nonprofit-crm', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'crm-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Social CRM Tools', 'social-crm-tools', 4, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'crm-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mac CRM', 'mac-crm', 4, id, '#3B82F6', 1, 1, 1, 100
  FROM categories WHERE slug = 'crm-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales Engagement Platforms', 'sales-engagement-platforms', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'sales-engagement-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales Force Automation', 'sales-force-automation', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'sales-engagement-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales Enablement Software', 'sales-enablement-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'sales-engagement-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales Coaching Software', 'sales-coaching-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'sales-engagement-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales Content Management', 'sales-content-management', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'sales-engagement-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Conversation Intelligence', 'conversation-intelligence', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'sales-engagement-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Email Tracking Software', 'email-tracking-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'sales-engagement-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Outbound Call Tracking', 'outbound-call-tracking', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'sales-engagement-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Digital Sales Rooms', 'digital-sales-rooms', 4, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'sales-engagement-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lead Generation Software', 'lead-generation-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'lead-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lead Capture Software', 'lead-capture-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'lead-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lead Management Software', 'lead-management-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'lead-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lead Nurturing Software', 'lead-nurturing-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'lead-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lead Scoring Software', 'lead-scoring-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'lead-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Predictive Lead Scoring', 'predictive-lead-scoring', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'lead-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Visitor Identification Software', 'visitor-identification-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'lead-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Buyer Intent Data', 'buyer-intent-data', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'lead-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CPQ Software', 'cpq-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'cpq-quoting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Quoting Software', 'quoting-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'cpq-quoting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Proposal Software', 'proposal-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'cpq-quoting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pricing Software', 'pricing-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'cpq-quoting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pricing Optimization Software', 'pricing-optimization-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'cpq-quoting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Product Configurator Software', 'product-configurator-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'cpq-quoting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'RFP Software', 'rfp-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'cpq-quoting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales Intelligence Software', 'sales-intelligence-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'sales-intelligence-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales Analytics Software', 'sales-analytics-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'sales-intelligence-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales Forecasting Software', 'sales-forecasting-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'sales-intelligence-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Revenue Operations (RevOps)', 'revenue-operations-revops', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'sales-intelligence-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales Performance Management', 'sales-performance-management', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'sales-intelligence-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales Commission Software', 'sales-commission-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'sales-intelligence-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales Compensation Software', 'sales-compensation-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'sales-intelligence-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales Gamification', 'sales-gamification', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'sales-intelligence-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'E-Signature Software', 'e-signature-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'contracts-e-signature' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Digital Signature Software', 'digital-signature-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'contracts-e-signature' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Contract Management Software', 'contract-management-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'contracts-e-signature' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Contract Lifecycle Management (CLM)', 'contract-lifecycle-management-clm', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'contracts-e-signature' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Contract Analytics Software', 'contract-analytics-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'contracts-e-signature' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Partner Relationship Management (PRM)', 'partner-relationship-management-prm', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'partnerships-channel-sales' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Affiliate Marketing Software', 'affiliate-marketing-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'partnerships-channel-sales' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Channel Management Software', 'channel-management-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'partnerships-channel-sales' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Channel Incentives Management', 'channel-incentives-management', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'partnerships-channel-sales' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketing Automation Software', 'marketing-automation-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'marketing-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'All-in-One Marketing Platforms', 'all-in-one-marketing-platforms', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'marketing-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Campaign Management Software', 'campaign-management-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'marketing-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketing Resource Management', 'marketing-resource-management', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'marketing-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketing Calendar Software', 'marketing-calendar-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'marketing-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketing Planning Software', 'marketing-planning-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'marketing-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Email Marketing Software', 'email-marketing-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'email-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Email Template Builders', 'email-template-builders', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'email-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Email Deliverability Tools', 'email-deliverability-tools', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'email-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Email Verification Tools', 'email-verification-tools', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'email-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Transactional Email Software', 'transactional-email-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'email-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SEO Tools', 'seo-tools', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'seo-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Local SEO Tools', 'local-seo-tools', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'seo-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Answer Engine Optimization (AEO)', 'answer-engine-optimization-aeo', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'seo-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Search Visibility Tools', 'ai-search-visibility-tools', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'seo-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'App Store Optimization (ASO)', 'app-store-optimization-aso', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'seo-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Social Media Management Tools', 'social-media-management-tools', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'social-media-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Social Media Analytics', 'social-media-analytics', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'social-media-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Social Media Monitoring', 'social-media-monitoring', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'social-media-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Social Listening Tools', 'social-listening-tools', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'social-media-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Influencer Marketing Platforms', 'influencer-marketing-platforms', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'social-media-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Social Media Advertising', 'social-media-advertising', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'social-media-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Content Marketing Software', 'content-marketing-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'content-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Content Creation Software', 'content-creation-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'content-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Content Curation Tools', 'content-curation-tools', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'content-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Content Distribution Software', 'content-distribution-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'content-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Content Analytics Software', 'content-analytics-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'content-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Account-Based Marketing Platforms', 'account-based-marketing-platforms', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'account-based-marketing-abm' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Account-Based Advertising', 'account-based-advertising', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'account-based-marketing-abm' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Account-Based Analytics', 'account-based-analytics', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'account-based-marketing-abm' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'A/B Testing Tools', 'a-b-testing-tools', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'conversion-optimization' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Conversion Rate Optimization (CRO)', 'conversion-rate-optimization-cro', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'conversion-optimization' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Landing Page Builders', 'landing-page-builders', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'conversion-optimization' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Heatmap Tools', 'heatmap-tools', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'conversion-optimization' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Session Replay Software', 'session-replay-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'conversion-optimization' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Personalization Software', 'personalization-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'conversion-optimization' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pop-Up Builder Software', 'pop-up-builder-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'conversion-optimization' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketing Analytics Software', 'marketing-analytics-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'marketing-analytics-attribution' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketing Attribution Software', 'marketing-attribution-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'marketing-analytics-attribution' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile Attribution Platforms', 'mobile-attribution-platforms', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'marketing-analytics-attribution' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Customer Journey Analytics', 'customer-journey-analytics', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'marketing-analytics-attribution' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Customer Journey Mapping Tools', 'customer-journey-mapping-tools', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'marketing-analytics-attribution' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Digital Analytics Software', 'digital-analytics-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'marketing-analytics-attribution' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SMS Marketing Software', 'sms-marketing-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'sms-mobile-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile Marketing Software', 'mobile-marketing-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'sms-mobile-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Push Notification Software', 'push-notification-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'sms-mobile-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'WhatsApp Marketing Software', 'whatsapp-marketing-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'sms-mobile-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'RCS Business Messaging', 'rcs-business-messaging', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'sms-mobile-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brand Management Software', 'brand-management-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'brand-reputation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Online Reputation Management', 'online-reputation-management', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'brand-reputation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Review Management Software', 'review-management-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'brand-reputation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brand Protection Software', 'brand-protection-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'brand-reputation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brand Intelligence', 'brand-intelligence', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'brand-reputation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Public Relations (PR) Software', 'public-relations-pr-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'brand-reputation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Press Release Distribution', 'press-release-distribution', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'brand-reputation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Media Monitoring Software', 'media-monitoring-software', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'brand-reputation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Event Management Software', 'event-management-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'event-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Event Marketing Software', 'event-marketing-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'event-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Virtual Event Platforms', 'virtual-event-platforms', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'event-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Webinar Platforms', 'webinar-platforms', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'event-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Event Registration & Ticketing', 'event-registration-ticketing', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'event-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hybrid Events Software', 'hybrid-events-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'event-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Customer Data Platforms (CDP)', 'customer-data-platforms-cdp', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'customer-data-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Management Platforms (DMP)', 'data-management-platforms-dmp', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'customer-data-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Audience Intelligence Platforms', 'audience-intelligence-platforms', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'customer-data-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Identity Resolution Software', 'identity-resolution-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'customer-data-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketplace Optimization Tools', 'marketplace-optimization-tools', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'other-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Loyalty Program Software', 'loyalty-program-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'other-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Referral Marketing Software', 'referral-marketing-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'other-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Survey Software', 'survey-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'other-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Online Form Builders', 'online-form-builders', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'other-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'QR Code Generators', 'qr-code-generators', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'other-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'URL Shorteners', 'url-shorteners', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'other-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Help Desk Software', 'help-desk-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'help-desk-ticketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IT Ticketing Systems', 'it-ticketing-systems', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'help-desk-ticketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Service Desk Software', 'service-desk-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'help-desk-ticketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Shared Inbox Software', 'shared-inbox-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'help-desk-ticketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Live Chat Software', 'live-chat-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'live-chat-messaging' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Conversational Support Software', 'conversational-support-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'live-chat-messaging' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Co-Browsing Software', 'co-browsing-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'live-chat-messaging' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Chatbot Software', 'chatbot-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'live-chat-messaging' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Contact Center Software', 'contact-center-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'call-contact-center' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Call Center Software', 'call-center-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'call-contact-center' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Contact Center Quality Assurance', 'contact-center-quality-assurance', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'call-contact-center' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Call Recording Software', 'call-recording-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'call-contact-center' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Call Tracking Software', 'call-tracking-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'call-contact-center' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Predictive Dialer', 'predictive-dialer', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'call-contact-center' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Auto Dialer Software', 'auto-dialer-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'call-contact-center' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IVR Software', 'ivr-software', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'call-contact-center' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Speech Analytics Software', 'speech-analytics-software', 4, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'call-contact-center' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Contact Center Workforce Management', 'contact-center-workforce-management', 4, id, '#3B82F6', 1, 1, 1, 100
  FROM categories WHERE slug = 'call-contact-center' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Customer Experience Software', 'customer-experience-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'customer-experience-cx' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Customer Engagement Software', 'customer-engagement-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'customer-experience-cx' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Experience Management Software', 'experience-management-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'customer-experience-cx' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Customer Satisfaction Software', 'customer-satisfaction-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'customer-experience-cx' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Net Promoter Score (NPS) Software', 'net-promoter-score-nps-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'customer-experience-cx' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Customer Feedback Software', 'customer-feedback-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'customer-experience-cx' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Customer Success Software', 'customer-success-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'customer-success' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Customer Self-Service Software', 'customer-self-service-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'customer-success' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Customer Education Software', 'customer-education-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'customer-success' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Customer Retention Software', 'customer-retention-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'customer-success' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Customer Loyalty Software', 'customer-loyalty-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'customer-success' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Customer Onboarding Software', 'customer-onboarding-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'customer-success' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Field Service Management', 'field-service-management', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'field-service-appointments' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Appointment Scheduling Software', 'appointment-scheduling-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'field-service-appointments' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Appointment Reminder Software', 'appointment-reminder-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'field-service-appointments' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Service Dispatch Software', 'service-dispatch-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'field-service-appointments' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HR Software (HRIS)', 'hr-software-hris', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'core-hr-hris' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HR Analytics Software', 'hr-analytics-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'core-hr-hris' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Employer of Record (EOR)', 'employer-of-record-eor', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'core-hr-hris' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'PEO Software', 'peo-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'core-hr-hris' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'DEI Software', 'dei-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'core-hr-hris' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Applicant Tracking Systems (ATS)', 'applicant-tracking-systems-ats', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'recruiting-ats' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Recruiting Software', 'recruiting-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'recruiting-ats' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Recruitment Marketing Platforms', 'recruitment-marketing-platforms', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'recruiting-ats' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video Interviewing Software', 'video-interviewing-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'recruiting-ats' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pre-Employment Testing', 'pre-employment-testing', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'recruiting-ats' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Background Check Software', 'background-check-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'recruiting-ats' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Reference Check Software', 'reference-check-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'recruiting-ats' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Staffing Agency Software', 'staffing-agency-software', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'recruiting-ats' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Employee Onboarding Software', 'employee-onboarding-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'onboarding-offboarding' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'I-9 Compliance Software', 'i-9-compliance-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'onboarding-offboarding' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Payroll Software', 'payroll-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'payroll-benefits' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Multi-Country Payroll', 'multi-country-payroll', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'payroll-benefits' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Benefits Administration', 'benefits-administration', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'payroll-benefits' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Compensation Management', 'compensation-management', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'payroll-benefits' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Direct Deposit Payroll', 'direct-deposit-payroll', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'payroll-benefits' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Performance Management Software', 'performance-management-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'talent-performance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Talent Management Software', 'talent-management-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'talent-performance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '360 Degree Feedback Software', '360-degree-feedback-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'talent-performance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Succession Planning Software', 'succession-planning-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'talent-performance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Employee Engagement Software', 'employee-engagement-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'talent-performance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Employee Recognition Software', 'employee-recognition-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'talent-performance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mentoring Software', 'mentoring-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'talent-performance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Coaching Software', 'coaching-software', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'talent-performance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Time Tracking Software', 'time-tracking-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'time-attendance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Time Clock Software', 'time-clock-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'time-attendance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Attendance Tracking Software', 'attendance-tracking-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'time-attendance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Employee Scheduling Software', 'employee-scheduling-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'time-attendance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Leave Management Software', 'leave-management-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'time-attendance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Absence Management Software', 'absence-management-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'time-attendance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Workforce Management Software', 'workforce-management-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'time-attendance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Learning Management Systems (LMS)', 'learning-management-systems-lms', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'learning-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Learning Experience Platforms (LXP)', 'learning-experience-platforms-lxp', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'learning-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'eLearning Authoring Tools', 'elearning-authoring-tools', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'learning-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Course Authoring Software', 'course-authoring-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'learning-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Microlearning Software', 'microlearning-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'learning-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile Learning Software', 'mobile-learning-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'learning-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales Training Software', 'sales-training-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'learning-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Security Awareness Training', 'security-awareness-training-saas', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'learning-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Employee Engagement Surveys', 'employee-engagement-surveys', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'employee-communication' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Employee Communication Tools', 'employee-communication-tools', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'employee-communication' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Frontline Worker Communication', 'frontline-worker-communication', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'employee-communication' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Whistleblowing Software', 'whistleblowing-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'employee-communication' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Employee Monitoring Software', 'employee-monitoring-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'employee-monitoring-productivity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'OKR Software', 'okr-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'employee-monitoring-productivity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Accounting Software', 'accounting-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'accounting-bookkeeping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bookkeeping Software', 'bookkeeping-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'accounting-bookkeeping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Accounting Practice Management', 'accounting-practice-management', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'accounting-bookkeeping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Nonprofit Accounting', 'nonprofit-accounting', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'accounting-bookkeeping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Church Accounting', 'church-accounting', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'accounting-bookkeeping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Construction Accounting', 'construction-accounting', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'accounting-bookkeeping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Legal Accounting', 'legal-accounting', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'accounting-bookkeeping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trust Accounting', 'trust-accounting', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'accounting-bookkeeping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fund Accounting', 'fund-accounting', 4, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'accounting-bookkeeping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Accounting', 'real-estate-accounting', 4, id, '#3B82F6', 1, 1, 1, 100
  FROM categories WHERE slug = 'accounting-bookkeeping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Accounts Payable Software', 'accounts-payable-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ap-ar-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Accounts Receivable Software', 'accounts-receivable-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ap-ar-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AP Automation Software', 'ap-automation-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ap-ar-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Billing & Invoicing Software', 'billing-invoicing-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ap-ar-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Recurring Billing Software', 'recurring-billing-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ap-ar-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Subscription Billing', 'subscription-billing', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ap-ar-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Usage-Based Billing', 'usage-based-billing', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'ap-ar-automation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Payment Processing Software', 'payment-processing-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'payments-processing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Payment Gateways', 'payment-gateways', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'payments-processing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile Credit Card Processing', 'mobile-credit-card-processing', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'payments-processing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Embedded Payments Software', 'embedded-payments-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'payments-processing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'BNPL & Installment Payments', 'bnpl-installment-payments', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'payments-processing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Chargeback Management', 'chargeback-management', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'payments-processing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Budgeting Software', 'budgeting-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'financial-planning-analysis-fp-a' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Budgeting & Forecasting Software', 'budgeting-forecasting-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'financial-planning-analysis-fp-a' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cash Flow Management', 'cash-flow-management', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'financial-planning-analysis-fp-a' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Financial Close Software', 'financial-close-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'financial-planning-analysis-fp-a' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Financial Reporting Software', 'financial-reporting-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'financial-planning-analysis-fp-a' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Revenue Recognition Software', 'revenue-recognition-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'financial-planning-analysis-fp-a' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tax Preparation Software', 'tax-preparation-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'tax-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Corporate Tax Software', 'corporate-tax-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'tax-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales Tax Software', 'sales-tax-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'tax-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tax Practice Management', 'tax-practice-management', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'tax-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Treasury Management Software', 'treasury-management-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'treasury-risk' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Financial Risk Management', 'financial-risk-management', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'treasury-risk' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Financial Fraud Detection', 'financial-fraud-detection', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'treasury-risk' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AML Software', 'aml-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'treasury-risk' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'KYC Software', 'kyc-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'treasury-risk' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Expense Management Software', 'expense-management-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'spend-expense-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Spend Management Software', 'spend-management-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'spend-expense-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mileage Tracking', 'mileage-tracking', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'spend-expense-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Travel Management Software', 'travel-management-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'spend-expense-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Banking Systems', 'banking-systems', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'banking-lending' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Online Banking Software', 'online-banking-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'banking-lending' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile Banking Software', 'mobile-banking-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'banking-lending' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Loan Origination Software', 'loan-origination-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'banking-lending' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Loan Servicing Software', 'loan-servicing-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'banking-lending' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mortgage Software', 'mortgage-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'banking-lending' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Debt Collection Software', 'debt-collection-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'banking-lending' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Investment Management Software', 'investment-management-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'investment-wealth' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hedge Fund Software', 'hedge-fund-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'investment-wealth' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Stock Portfolio Management', 'stock-portfolio-management', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'investment-wealth' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Equity Management Software', 'equity-management-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'investment-wealth' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cryptocurrency Exchange Software', 'cryptocurrency-exchange-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'investment-wealth' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cryptocurrency Wallets', 'cryptocurrency-wallets', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'investment-wealth' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ERP Systems', 'erp-systems', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'enterprise-resource-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Discrete ERP', 'discrete-erp', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'enterprise-resource-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Process ERP', 'process-erp', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'enterprise-resource-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Food Manufacturing ERP', 'food-manufacturing-erp', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'enterprise-resource-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Distribution ERP', 'distribution-erp', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'enterprise-resource-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Procurement Software', 'procurement-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'procurement-sourcing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Strategic Sourcing Software', 'strategic-sourcing-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'procurement-sourcing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Purchasing Software', 'purchasing-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'procurement-sourcing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Procure-to-Pay Software', 'procure-to-pay-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'procurement-sourcing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vendor Management Software', 'vendor-management-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'procurement-sourcing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Inventory Management Software', 'inventory-management-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'inventory-order-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Inventory Control Software', 'inventory-control-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'inventory-order-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Order Management Software', 'order-management-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'inventory-order-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Order Fulfillment Software', 'order-fulfillment-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'inventory-order-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Returns Management (RMS)', 'returns-management-rms', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'inventory-order-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Barcoding Software', 'barcoding-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'inventory-order-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Supply Chain Management (SCM)', 'supply-chain-management-scm', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'supply-chain-warehouse' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Warehouse Management (WMS)', 'warehouse-management-wms', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'supply-chain-warehouse' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Warehouse Automation Software', 'warehouse-automation-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'supply-chain-warehouse' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Demand Planning Software', 'demand-planning-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'supply-chain-warehouse' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Distribution Software', 'distribution-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'supply-chain-warehouse' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Manufacturing Software', 'manufacturing-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'manufacturing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Manufacturing Execution Systems (MES)', 'manufacturing-execution-systems-mes', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'manufacturing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'MRP Software', 'mrp-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'manufacturing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bill of Materials (BOM)', 'bill-of-materials-bom', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'manufacturing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Production Scheduling', 'production-scheduling', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'manufacturing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Advanced Planning and Scheduling (APS)', 'advanced-planning-and-scheduling-aps', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'manufacturing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Quality Management Software', 'quality-management-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'manufacturing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Statistical Process Control (SPC)', 'statistical-process-control-spc', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'manufacturing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'OEE Software', 'oee-software', 4, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'manufacturing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Additive Manufacturing Software', 'additive-manufacturing-software', 4, id, '#3B82F6', 1, 1, 1, 100
  FROM categories WHERE slug = 'manufacturing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CMMS Software', 'cmms-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'asset-maintenance-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Enterprise Asset Management (EAM)', 'enterprise-asset-management-eam', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'asset-maintenance-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Asset Tracking Software', 'asset-tracking-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'asset-maintenance-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fixed Asset Management', 'fixed-asset-management', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'asset-maintenance-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Maintenance Management Software', 'maintenance-management-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'asset-maintenance-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Preventive Maintenance Software', 'preventive-maintenance-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'asset-maintenance-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Equipment Maintenance Software', 'equipment-maintenance-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'asset-maintenance-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Facility Management Software', 'facility-management-software', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'asset-maintenance-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IWMS Software', 'iwms-software', 4, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'asset-maintenance-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Process Management (BPM)', 'business-process-management-bpm', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'business-process-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Workflow Management Software', 'workflow-management-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'business-process-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Robotic Process Automation (RPA)', 'robotic-process-automation-rpa', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'business-process-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Performance Management', 'business-performance-management', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'business-process-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Management Software', 'business-management-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'business-process-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Decision Support Software', 'decision-support-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'business-process-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Field Activity Management', 'field-activity-management', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'field-operations' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Inspection Software', 'inspection-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'field-operations' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Safety Management Software', 'safety-management-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'field-operations' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'EHS Management Software', 'ehs-management-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'field-operations' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Incident Management Software', 'incident-management-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'field-operations' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Work Order Software', 'work-order-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'field-operations' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Project Management Software', 'project-management-software-2', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'general-project-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Project Planning Software', 'project-planning-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'general-project-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Project Portfolio Management (PPM)', 'project-portfolio-management-ppm', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'general-project-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Project Tracking Software', 'project-tracking-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'general-project-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Task Management Software', 'task-management-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'general-project-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Agile Project Management', 'agile-project-management', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'agile-scrum-tools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Scrum Software', 'scrum-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'agile-scrum-tools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Kanban Tools', 'kanban-tools', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'agile-scrum-tools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bug Tracking Software', 'bug-tracking-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'agile-scrum-tools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Issue Tracking Software', 'issue-tracking-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'agile-scrum-tools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Resource Management Software', 'resource-management-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'resource-capacity-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Capacity Planning Software', 'capacity-planning-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'resource-capacity-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Professional Services Automation (PSA)', 'professional-services-automation-psa', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'resource-capacity-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Gantt Chart Software', 'gantt-chart-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'resource-capacity-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Strategic Planning Software', 'strategic-planning-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'strategic-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Idea Management Software', 'idea-management-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'strategic-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Innovation Management Software', 'innovation-management-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'strategic-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Change Management Software', 'change-management-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'strategic-planning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Product Management Software', 'product-management-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'product-management-saas' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Product Roadmap Software', 'product-roadmap-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'product-management-saas' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Requirements Management', 'requirements-management', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'product-management-saas' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Product Analytics', 'product-analytics', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'product-management-saas' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Feature Management Software', 'feature-management-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'product-management-saas' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Team Collaboration Software', 'team-collaboration-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'team-collaboration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Team Communication Software', 'team-communication-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'team-collaboration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Internal Communications', 'internal-communications', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'team-collaboration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Instant Messaging', 'business-instant-messaging', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'team-collaboration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Employee Intranet Software', 'employee-intranet-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'team-collaboration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Enterprise Social Networking', 'enterprise-social-networking', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'team-collaboration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Digital Workplace Software', 'digital-workplace-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'team-collaboration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Remote Work Software', 'remote-work-software', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'team-collaboration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Collaborative Whiteboard Software', 'collaborative-whiteboard-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'visual-collaboration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mind Mapping Software', 'mind-mapping-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'visual-collaboration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Diagramming Software', 'diagramming-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'visual-collaboration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Flowchart Software', 'flowchart-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'visual-collaboration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Visual Collaboration Platforms', 'visual-collaboration-platforms', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'visual-collaboration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Document Management Software', 'document-management-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'document-file-collaboration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cloud Content Collaboration', 'cloud-content-collaboration', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'document-file-collaboration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'File Sharing Software', 'file-sharing-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'document-file-collaboration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'File Sync Software', 'file-sync-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'document-file-collaboration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cloud Storage Software', 'cloud-storage-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'document-file-collaboration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Document Generation Software', 'document-generation-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'document-file-collaboration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Document Version Control', 'document-version-control', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'document-file-collaboration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'PDF Editor Software', 'pdf-editor-software', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'document-file-collaboration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Virtual Data Room (VDR)', 'virtual-data-room-vdr', 4, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'document-file-collaboration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video Conferencing Software', 'video-conferencing-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'meetings-scheduling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Web Conferencing Software', 'web-conferencing-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'meetings-scheduling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Audio Conferencing Software', 'audio-conferencing-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'meetings-scheduling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Online Meeting Software', 'online-meeting-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'meetings-scheduling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Meeting Assistants', 'ai-meeting-assistants-saas', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'meetings-scheduling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Meeting Management Software', 'meeting-management-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'meetings-scheduling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Meeting Room Booking Systems', 'meeting-room-booking-systems', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'meetings-scheduling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Calendar Software', 'calendar-software', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'meetings-scheduling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Scheduling Software', 'business-scheduling-software', 4, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'meetings-scheduling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Desk Booking Software', 'desk-booking-software', 4, id, '#3B82F6', 1, 1, 1, 100
  FROM categories WHERE slug = 'meetings-scheduling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Note-Taking Software', 'note-taking-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'productivity-tools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Note-Taking Software', 'ai-note-taking-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'productivity-tools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Office Suites Software', 'office-suites-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'productivity-tools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Spreadsheet Software', 'spreadsheet-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'productivity-tools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Presentation Software', 'presentation-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'productivity-tools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Screen Recording Software', 'screen-recording-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'productivity-tools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Screen Sharing Software', 'screen-sharing-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'productivity-tools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Transcription Software', 'transcription-software', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'productivity-tools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Translation Management Software', 'translation-management-software', 4, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'productivity-tools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Proofreading Software', 'proofreading-software', 4, id, '#3B82F6', 1, 1, 1, 100
  FROM categories WHERE slug = 'productivity-tools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Plagiarism Checker Software', 'plagiarism-checker-software', 4, id, '#3B82F6', 1, 1, 1, 110
  FROM categories WHERE slug = 'productivity-tools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Knowledge Management Software', 'knowledge-management-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'knowledge-management-saas' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Knowledge Base Software', 'knowledge-base-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'knowledge-management-saas' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IT Documentation Software', 'it-documentation-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'knowledge-management-saas' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Standard Operating Procedures (SOP)', 'standard-operating-procedures-sop', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'knowledge-management-saas' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wiki Software', 'wiki-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'knowledge-management-saas' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'VoIP Software', 'voip-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'business-phone-voip' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Phone Systems', 'business-phone-systems', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'business-phone-voip' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cloud PBX Software', 'cloud-pbx-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'business-phone-voip' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Softphone Software', 'softphone-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'business-phone-voip' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Telephony Software', 'telephony-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'business-phone-voip' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Unified Communications', 'unified-communications', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'business-phone-voip' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'UCaaS Platforms', 'ucaas-platforms', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'business-phone-voip' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cloud Communication Platform', 'cloud-communication-platform', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'business-phone-voip' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Push-To-Talk (PTT) Software', 'push-to-talk-ptt-software', 4, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'business-phone-voip' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Email Software', 'email-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'email-messaging' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Email Client Software', 'email-client-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'email-messaging' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Email Management Software', 'email-management-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'email-messaging' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Email Signature Software', 'email-signature-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'email-messaging' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Email Archiving Software', 'email-archiving-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'email-messaging' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Emergency Notification Software', 'emergency-notification-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'notifications-alerts' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Proactive Notification Software', 'proactive-notification-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'notifications-alerts' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Notification Infrastructure Software', 'notification-infrastructure-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'notifications-alerts' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Online Fax Software', 'online-fax-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'notifications-alerts' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fax Server Software', 'fax-server-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'notifications-alerts' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ITSM Software', 'itsm-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'it-service-management-itsm' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IT Service Management', 'it-service-management', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'it-service-management-itsm' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IT Asset Management', 'it-asset-management', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'it-service-management-itsm' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IT Documentation', 'it-documentation', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'it-service-management-itsm' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CMDB Software', 'cmdb-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'it-service-management-itsm' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Configuration Management Tools', 'configuration-management-tools', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'it-service-management-itsm' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IT Management Software', 'it-management-software-2', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'it-service-management-itsm' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Managed Service Providers (MSP)', 'managed-service-providers-msp', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'it-service-management-itsm' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Infrastructure as a Service (IaaS)', 'infrastructure-as-a-service-iaas', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'cloud-infrastructure-paas' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Platform as a Service (PaaS)', 'platform-as-a-service-paas', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'cloud-infrastructure-paas' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Desktop as a Service (DaaS)', 'desktop-as-a-service-daas', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'cloud-infrastructure-paas' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cloud Management Software', 'cloud-management-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'cloud-infrastructure-paas' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cloud Infrastructure Automation', 'cloud-infrastructure-automation', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'cloud-infrastructure-paas' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SaaS Management Software', 'saas-management-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'cloud-infrastructure-paas' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Virtualization Software', 'virtualization-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'cloud-infrastructure-paas' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Virtual Machine Software', 'virtual-machine-software', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'cloud-infrastructure-paas' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'VDI Software', 'vdi-software', 4, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'cloud-infrastructure-paas' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Network Monitoring Software', 'network-monitoring-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'network-monitoring' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Network Management Software', 'network-management-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'network-monitoring' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Network Mapping Software', 'network-mapping-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'network-monitoring' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Server Monitoring Software', 'server-monitoring-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'network-monitoring' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Website Monitoring Software', 'website-monitoring-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'network-monitoring' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Application Performance Monitoring (APM)', 'application-performance-monitoring-apm', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'network-monitoring' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Observability Software', 'observability-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'network-monitoring' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AIOps Platforms', 'aiops-platforms', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'network-monitoring' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Log Management Software', 'log-management-software', 4, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'network-monitoring' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Log Analysis Software', 'log-analysis-software', 4, id, '#3B82F6', 1, 1, 1, 100
  FROM categories WHERE slug = 'network-monitoring' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile Device Management (MDM)', 'mobile-device-management-mdm', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'endpoint-device-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Unified Endpoint Management (UEM)', 'unified-endpoint-management-uem', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'endpoint-device-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Remote Monitoring & Management (RMM)', 'remote-monitoring-management-rmm', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'endpoint-device-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Endpoint Management Software', 'endpoint-management-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'endpoint-device-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Remote Desktop Software', 'remote-desktop-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'endpoint-device-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Remote Support Software', 'remote-support-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'endpoint-device-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Backup Software', 'backup-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'backup-disaster-recovery' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Online Backup Software', 'online-backup-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'backup-disaster-recovery' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Server Backup Software', 'server-backup-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'backup-disaster-recovery' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Disaster Recovery Software', 'disaster-recovery-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'backup-disaster-recovery' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Continuity Software', 'business-continuity-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'backup-disaster-recovery' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Archiving Software', 'archiving-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'backup-disaster-recovery' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Database Management Software', 'database-management-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'database-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'NoSQL Databases', 'nosql-databases', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'database-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Relational Databases', 'relational-databases', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'database-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Database Monitoring', 'database-monitoring', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'database-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Database Security Software', 'database-security-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'database-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Integration Software (iPaaS)', 'integration-software-ipaas', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'integration-apis' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'API Management Software', 'api-management-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'integration-apis' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'API Development Tools', 'api-development-tools', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'integration-apis' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'API Documentation Software', 'api-documentation-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'integration-apis' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Enterprise Service Bus (ESB)', 'enterprise-service-bus-esb', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'integration-apis' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'EDI Software', 'edi-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'integration-apis' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Webhooks & Middleware', 'webhooks-middleware', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'integration-apis' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Antivirus Software', 'antivirus-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'endpoint-security' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Endpoint Protection Software', 'endpoint-protection-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'endpoint-security' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Endpoint Detection & Response (EDR)', 'endpoint-detection-response-edr', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'endpoint-security' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Extended Detection & Response (XDR)', 'extended-detection-response-xdr', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'endpoint-security' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Identity Management Software (IAM)', 'identity-management-software-iam', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'identity-access-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Multi-Factor Authentication (MFA)', 'multi-factor-authentication-mfa', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'identity-access-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Single Sign-On (SSO)', 'single-sign-on-sso', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'identity-access-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Password Management Software', 'password-management-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'identity-access-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Passwordless Authentication', 'passwordless-authentication', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'identity-access-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Biometric Authentication', 'biometric-authentication', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'identity-access-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Privileged Access Management (PAM)', 'privileged-access-management-pam', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'identity-access-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Customer Identity & Access Management (CIAM)', 'customer-identity-access-management-ciam', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'identity-access-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Self-Service Password Reset (SSPR)', 'self-service-password-reset-sspr', 4, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'identity-access-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Access Governance Software', 'access-governance-software', 4, id, '#3B82F6', 1, 1, 1, 100
  FROM categories WHERE slug = 'identity-access-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cloud Security Software', 'cloud-security-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'cloud-security' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cloud Access Security Broker (CASB)', 'cloud-access-security-broker-casb', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'cloud-security' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cloud Security Posture Management (CSPM)', 'cloud-security-posture-management-cspm', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'cloud-security' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cloud-Native Application Protection (CNAPP)', 'cloud-native-application-protection-cnapp', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'cloud-security' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SaaS Security Posture Management (SSPM)', 'saas-security-posture-management-sspm', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'cloud-security' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Secure Access Service Edge (SASE)', 'secure-access-service-edge-sase', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'cloud-security' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Network Security Software', 'network-security-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'network-security' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Firewall Software', 'firewall-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'network-security' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'VPN Software', 'vpn-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'network-security' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Network Access Control (NAC)', 'network-access-control-nac', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'network-security' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'DDoS Protection Software', 'ddos-protection-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'network-security' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Intrusion Detection & Prevention (IDPS)', 'intrusion-detection-prevention-idps', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'network-security' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Email Security Software', 'email-security-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'email-security' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Anti-Spam Software', 'anti-spam-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'email-security' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Secure Email Gateway', 'secure-email-gateway', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'email-security' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Email Encryption Software', 'email-encryption-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'email-security' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Web Security Software', 'web-security-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'web-security' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Website Security Software', 'website-security-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'web-security' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Web Application Firewall (WAF)', 'web-application-firewall-waf', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'web-security' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bot Detection & Mitigation', 'bot-detection-mitigation', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'web-security' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dark Web Monitoring', 'dark-web-monitoring', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'web-security' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Security Software', 'data-security-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'data-security-privacy' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Loss Prevention (DLP)', 'data-loss-prevention-dlp', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'data-security-privacy' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Privacy Management', 'data-privacy-management', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'data-security-privacy' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Encryption Software', 'encryption-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'data-security-privacy' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Masking Software', 'data-masking-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'data-security-privacy' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Consent Management Platforms', 'consent-management-platforms', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'data-security-privacy' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'GDPR Compliance Software', 'gdpr-compliance-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'data-security-privacy' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HIPAA Compliance Software', 'hipaa-compliance-software', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'data-security-privacy' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'PCI Compliance Software', 'pci-compliance-software', 4, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'data-security-privacy' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Identity Verification Software', 'identity-verification-software', 4, id, '#3B82F6', 1, 1, 1, 100
  FROM categories WHERE slug = 'data-security-privacy' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SIEM Software', 'siem-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'siem-soar-threat-intelligence' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SOAR Software', 'soar-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'siem-soar-threat-intelligence' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Threat Intelligence Software', 'threat-intelligence-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'siem-soar-threat-intelligence' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Incident Response Software', 'incident-response-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'siem-soar-threat-intelligence' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Managed Detection & Response (MDR)', 'managed-detection-response-mdr', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'siem-soar-threat-intelligence' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Digital Forensics Software', 'digital-forensics-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'siem-soar-threat-intelligence' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vulnerability Management Software', 'vulnerability-management-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'vulnerability-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vulnerability Scanner Software', 'vulnerability-scanner-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'vulnerability-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Penetration Testing Tools', 'penetration-testing-tools', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'vulnerability-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Patch Management Software', 'patch-management-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'vulnerability-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Attack Surface Management', 'attack-surface-management', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'vulnerability-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Governance, Risk & Compliance (GRC)', 'governance-risk-compliance-grc', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'compliance-grc' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Compliance Software', 'compliance-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'compliance-grc' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Audit Software', 'audit-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'compliance-grc' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Policy Management Software', 'policy-management-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'compliance-grc' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Risk Management Software', 'risk-management-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'compliance-grc' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IT Risk Management', 'it-risk-management', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'compliance-grc' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Integrated Risk Management', 'integrated-risk-management', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'compliance-grc' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Enterprise Risk Management (ERM)', 'enterprise-risk-management-erm', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'compliance-grc' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business Intelligence Software', 'business-intelligence-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'business-intelligence-bi' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Embedded Analytics Software', 'embedded-analytics-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'business-intelligence-bi' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dashboard Software', 'dashboard-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'business-intelligence-bi' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'KPI Software', 'kpi-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'business-intelligence-bi' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Reporting Software', 'reporting-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'business-intelligence-bi' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Analysis Software', 'data-analysis-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'data-analysis-visualization' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Visualization Tools', 'data-visualization-tools', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'data-analysis-visualization' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Statistical Analysis Software', 'statistical-analysis-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'data-analysis-visualization' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Qualitative Data Analysis', 'qualitative-data-analysis', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'data-analysis-visualization' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Predictive Analytics', 'predictive-analytics', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'data-analysis-visualization' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Web Analytics Software', 'web-analytics-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'data-analysis-visualization' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile Analytics Software', 'mobile-analytics-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'data-analysis-visualization' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Big Data Software', 'big-data-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'big-data-data-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Warehouse Software', 'data-warehouse-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'big-data-data-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Lake Platforms', 'data-lake-platforms', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'big-data-data-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ETL Software', 'etl-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'big-data-data-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Mining Software', 'data-mining-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'big-data-data-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Preparation Software', 'data-preparation-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'big-data-data-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Extraction Software', 'data-extraction-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'big-data-data-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Web Scraping Software', 'web-scraping-software', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'big-data-data-engineering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Governance Software', 'data-governance-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'data-governance-quality' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Quality Software', 'data-quality-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'data-governance-quality' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Master Data Management (MDM)', 'master-data-management-mdm', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'data-governance-quality' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Catalog Software', 'data-catalog-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'data-governance-quality' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Metadata Management', 'metadata-management', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'data-governance-quality' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data Discovery Software', 'data-discovery-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'data-governance-quality' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Location Intelligence', 'location-intelligence', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'specialized-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'GIS Software', 'gis-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'specialized-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Text Mining Software', 'text-mining-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'specialized-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Heatmap Software', 'heatmap-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'specialized-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Insight Engines', 'insight-engines', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'specialized-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Enterprise Search Software', 'enterprise-search-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'specialized-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Site Search Software', 'site-search-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'specialized-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IoT Analytics Software', 'iot-analytics-software', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'specialized-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Application Development Software', 'application-development-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'application-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'App Building Software', 'app-building-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'application-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile Development Software', 'mobile-development-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'application-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile Backend as a Service (mBaaS)', 'mobile-backend-as-a-service-mbaas', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'application-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Game Development Software', 'game-development-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'application-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Application Lifecycle Management (ALM)', 'application-lifecycle-management-alm', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'application-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Integrated Development Environments (IDE)', 'integrated-development-environments-ide', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ides-code-editors' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Text Editor Software', 'text-editor-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ides-code-editors' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Source Code Management', 'source-code-management', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ides-code-editors' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Version Control Software', 'version-control-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ides-code-editors' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Low-Code Development Platforms', 'low-code-development-platforms', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'low-code-no-code-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'No-Code Development Platforms', 'no-code-development-platforms', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'low-code-no-code-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Rapid Application Development (RAD)', 'rapid-application-development-rad', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'low-code-no-code-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Drag & Drop App Builders', 'drag-drop-app-builders', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'low-code-no-code-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'DevOps Platforms', 'devops-platforms', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'devops-ci-cd' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Continuous Integration (CI/CD)', 'continuous-integration-ci-cd', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'devops-ci-cd' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Build Automation Software', 'build-automation-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'devops-ci-cd' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Release Management', 'release-management', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'devops-ci-cd' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Internal Developer Platforms (IDP)', 'internal-developer-platforms-idp', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'devops-ci-cd' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Container Engine Software', 'container-engine-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'containerization' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Container Management', 'container-management', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'containerization' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Container Orchestration (Kubernetes)', 'container-orchestration-kubernetes', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'containerization' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Container Security', 'container-security', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'containerization' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Enterprise Kubernetes Management', 'enterprise-kubernetes-management', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'containerization' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Software Testing Tools', 'software-testing-tools', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'software-testing-saas' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Automated Testing Software', 'automated-testing-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'software-testing-saas' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Load Testing Tools', 'load-testing-tools', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'software-testing-saas' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Performance Testing Software', 'performance-testing-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'software-testing-saas' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile App Testing', 'mobile-app-testing', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'software-testing-saas' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Test Management Tools', 'test-management-tools', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'software-testing-saas' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Static Application Security Testing (SAST)', 'static-application-security-testing-sast', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'software-testing-saas' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dynamic Application Security Testing (DAST)', 'dynamic-application-security-testing-dast', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'software-testing-saas' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'DevSecOps Software', 'devsecops-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'devsecops' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Software Composition Analysis (SCA)', 'software-composition-analysis-sca', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'devsecops' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Software Bill of Materials (SBOM)', 'software-bill-of-materials-sbom', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'devsecops' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Software Supply Chain Security', 'software-supply-chain-security', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'devsecops' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ecommerce Platforms', 'ecommerce-platforms-2', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ecommerce-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'B2B Ecommerce Platforms', 'b2b-ecommerce-platforms', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ecommerce-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Headless Ecommerce Platforms', 'headless-ecommerce-platforms', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ecommerce-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Multi-Channel Ecommerce', 'multi-channel-ecommerce', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ecommerce-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Omnichannel Commerce', 'omnichannel-commerce', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ecommerce-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Small Business Ecommerce', 'small-business-ecommerce', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ecommerce-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Shopping Cart Software', 'shopping-cart-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'storefront-catalog' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Catalog Management Software', 'catalog-management-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'storefront-catalog' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Product Information Management (PIM)', 'product-information-management-pim', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'storefront-catalog' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ecommerce Search Software', 'ecommerce-search-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'storefront-catalog' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'E-Merchandising Software', 'e-merchandising-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'storefront-catalog' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ecommerce Personalization', 'ecommerce-personalization', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'storefront-catalog' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Subscription Management Software', 'subscription-management-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'subscription-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Subscription Analytics', 'subscription-analytics', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'subscription-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Subscription Revenue Management', 'subscription-revenue-management', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'subscription-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketplace Software', 'marketplace-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'marketplace-social-commerce' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Social Commerce Platforms', 'social-commerce-platforms', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'marketplace-social-commerce' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Live Commerce Software', 'live-commerce-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'marketplace-social-commerce' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Conversational Commerce', 'conversational-commerce', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'marketplace-social-commerce' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dropshipping Software', 'dropshipping-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'marketplace-social-commerce' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Print on Demand Software', 'print-on-demand-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'marketplace-social-commerce' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Point of Sale (POS)', 'point-of-sale-pos-2', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'point-of-sale-pos' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Retail POS Systems', 'retail-pos-systems', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'point-of-sale-pos' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Restaurant POS Systems', 'restaurant-pos-systems', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'point-of-sale-pos' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'iPad POS Software', 'ipad-pos-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'point-of-sale-pos' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bar POS Software', 'bar-pos-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'point-of-sale-pos' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Liquor Store POS', 'liquor-store-pos', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'point-of-sale-pos' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Food Truck POS Systems', 'food-truck-pos-systems', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'point-of-sale-pos' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ecommerce Analytics Software', 'ecommerce-analytics-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ecommerce-marketing-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Online Ordering Software', 'online-ordering-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ecommerce-marketing-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ecommerce Fraud Protection', 'ecommerce-fraud-protection', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ecommerce-marketing-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Competitor Price Monitoring', 'competitor-price-monitoring', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ecommerce-marketing-analytics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Content Management System (CMS)', 'content-management-system-cms', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'cms-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Headless CMS', 'headless-cms', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'cms-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Web Content Management', 'web-content-management', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'cms-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Digital Experience Platforms (DXP)', 'digital-experience-platforms-dxp', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'cms-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile CMS Software', 'mobile-cms-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'cms-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Java CMS', 'java-cms', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'cms-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'WordPress Management Tools', 'wordpress-management-tools', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'cms-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Digital Asset Management (DAM)', 'digital-asset-management-dam', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'digital-asset-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brand Asset Management', 'brand-asset-management', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'digital-asset-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Creative Portfolio Management', 'creative-portfolio-management', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'digital-asset-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Media & Entertainment Software', 'media-entertainment-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'digital-asset-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Enterprise Content Management (ECM)', 'enterprise-content-management-ecm', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'document-content-workflow' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Content Collaboration Software', 'content-collaboration-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'document-content-workflow' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Document Control Software', 'document-control-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'document-content-workflow' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Online Proofing Software', 'online-proofing-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'document-content-workflow' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Website Builder Software', 'website-builder-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'web-publishing-building' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Blog Software', 'blog-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'web-publishing-building' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Online Community Software', 'online-community-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'web-publishing-building' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Forum Software', 'forum-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'web-publishing-building' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Q&A Platforms', 'q-a-platforms', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'web-publishing-building' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Web Accessibility Software', 'web-accessibility-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'web-publishing-building' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Localization Software', 'localization-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'localization-translation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Machine Translation Software', 'machine-translation-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'localization-translation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Website Translation Tools', 'website-translation-tools', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'localization-translation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Computer-Assisted Translation (CAT)', 'computer-assisted-translation-cat', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'localization-translation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Graphic Design Software', 'graphic-design-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'graphic-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vector Graphics Software', 'vector-graphics-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'graphic-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Drawing Software', 'drawing-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'graphic-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sketching Software', 'sketching-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'graphic-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Desktop Publishing Software', 'desktop-publishing-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'graphic-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Logo Design Software', 'logo-design-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'graphic-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Font Management Software', 'font-management-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'graphic-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'UX Design Software', 'ux-design-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ux-ui-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Prototyping Software', 'prototyping-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ux-ui-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wireframing Software', 'wireframing-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ux-ui-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Web Design Software', 'web-design-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ux-ui-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'App Design Software', 'app-design-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ux-ui-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'User Testing Software', 'user-testing-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ux-ui-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'User Research Tools', 'user-research-tools', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'ux-ui-design' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Photo Editing Software', 'photo-editing-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'photography-imaging' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Photo Management Software', 'photo-management-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'photography-imaging' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Image Optimization Software', 'image-optimization-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'photography-imaging' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Stock Photos Websites', 'stock-photos-websites', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'photography-imaging' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '3D Modeling Software', '3d-modeling-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = '3d-cad' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '3D Rendering Software', '3d-rendering-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = '3d-cad' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '3D Painting Software', '3d-painting-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = '3d-cad' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CAD Software', 'cad-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = '3d-cad' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '3D CAD Software', '3d-cad-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = '3d-cad' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Architectural CAD', 'architectural-cad', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = '3d-cad' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Engineering CAD', 'engineering-cad', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = '3d-cad' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'BIM Software', 'bim-software', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = '3d-cad' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Computer-Aided Manufacturing (CAM)', 'computer-aided-manufacturing-cam', 4, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = '3d-cad' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Product Lifecycle Management (PLM)', 'product-lifecycle-management-plm', 4, id, '#3B82F6', 1, 1, 1, 100
  FROM categories WHERE slug = '3d-cad' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Product Data Management (PDM)', 'product-data-management-pdm', 4, id, '#3B82F6', 1, 1, 1, 110
  FROM categories WHERE slug = '3d-cad' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Simulation Software', 'simulation-software', 4, id, '#3B82F6', 1, 1, 1, 120
  FROM categories WHERE slug = '3d-cad' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Augmented Reality (AR) Software', 'augmented-reality-ar-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ar-vr' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Virtual Reality (VR) Software', 'virtual-reality-vr-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ar-vr' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AR Development Software', 'ar-development-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ar-vr' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'VR Development Software', 'vr-development-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ar-vr' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Virtual Tour Software', 'virtual-tour-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ar-vr' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video Editing Software', 'video-editing-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'video-editing-production' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video Making Software', 'video-making-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'video-editing-production' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video Content Creation', 'video-content-creation', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'video-editing-production' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Animation Software', 'animation-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'video-editing-production' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video Effects Software', 'video-effects-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'video-editing-production' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Screen and Video Capture', 'screen-and-video-capture', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'video-editing-production' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video Hosting Platforms', 'video-hosting-platforms', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'video-hosting-streaming' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Live Streaming Software', 'live-streaming-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'video-hosting-streaming' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'OTT Platforms', 'ott-platforms', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'video-hosting-streaming' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video CMS Software', 'video-cms-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'video-hosting-streaming' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video Management Software', 'video-management-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'video-hosting-streaming' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video Marketing Software', 'video-marketing-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'video-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video Email Software', 'video-email-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'video-marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Audio Editing Software', 'audio-editing-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'audio-production' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Podcast Hosting Platforms', 'podcast-hosting-platforms', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'audio-production' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Music Production Software', 'music-production-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'audio-production' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Noise Cancellation Software', 'noise-cancellation-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'audio-production' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Closed Captioning Software', 'closed-captioning-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'audio-production' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Demand Side Platforms (DSP)', 'demand-side-platforms-dsp', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ad-tech-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Supply Side Platforms (SSP)', 'supply-side-platforms-ssp', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ad-tech-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ad Networks', 'ad-networks', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ad-tech-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ad Server Software', 'ad-server-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ad-tech-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Publisher Ad Server', 'publisher-ad-server', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ad-tech-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Demand Side Platform (DSP)', 'demand-side-platform-dsp', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ad-tech-platforms' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'PPC Software', 'ppc-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ppc-search-advertising' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Paid Search Advertising', 'paid-search-advertising', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ppc-search-advertising' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Paid Search Intelligence', 'paid-search-intelligence', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ppc-search-advertising' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Click Fraud Protection', 'click-fraud-protection', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ppc-search-advertising' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Display Advertising Software', 'display-advertising-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'display-video-advertising' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video Advertising Software', 'video-advertising-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'display-video-advertising' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Display Ad Design Software', 'display-ad-design-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'display-video-advertising' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Creative Management Platforms', 'creative-management-platforms', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'display-video-advertising' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Connected TV (CTV) Advertising', 'connected-tv-ctv-advertising', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'display-video-advertising' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Digital Audio Advertising', 'digital-audio-advertising', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'display-video-advertising' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Native Advertising Software', 'native-advertising-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'display-video-advertising' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile Advertising Software', 'mobile-advertising-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'mobile-cross-channel-advertising' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cross-Channel Advertising', 'cross-channel-advertising', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'mobile-cross-channel-advertising' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Retargeting Software', 'retargeting-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'mobile-cross-channel-advertising' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'App Monetization Platforms', 'app-monetization-platforms', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'mobile-cross-channel-advertising' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Retail Media Advertising', 'retail-media-advertising', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'mobile-cross-channel-advertising' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Digital Advertising Intelligence', 'digital-advertising-intelligence', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'mobile-cross-channel-advertising' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Electronic Medical Records (EMR/EHR)', 'electronic-medical-records-emr-ehr', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'healthcare-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Medical Practice Management', 'medical-practice-management', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'healthcare-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Medical Billing Software', 'medical-billing-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'healthcare-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Telemedicine Software', 'telemedicine-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'healthcare-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hospital Management Software', 'hospital-management-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'healthcare-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Patient Engagement Software', 'patient-engagement-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'healthcare-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Patient Portal Software', 'patient-portal-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'healthcare-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mental Health Software', 'mental-health-software', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'healthcare-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dental Software', 'dental-software', 4, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'healthcare-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Chiropractic Software', 'chiropractic-software', 4, id, '#3B82F6', 1, 1, 1, 100
  FROM categories WHERE slug = 'healthcare-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Physical Therapy Software', 'physical-therapy-software', 4, id, '#3B82F6', 1, 1, 1, 110
  FROM categories WHERE slug = 'healthcare-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Home Health Care Software', 'home-health-care-software', 4, id, '#3B82F6', 1, 1, 1, 120
  FROM categories WHERE slug = 'healthcare-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Long Term Care Software', 'long-term-care-software', 4, id, '#3B82F6', 1, 1, 1, 130
  FROM categories WHERE slug = 'healthcare-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Assisted Living Software', 'assisted-living-software', 4, id, '#3B82F6', 1, 1, 1, 140
  FROM categories WHERE slug = 'healthcare-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pharmacy Software', 'pharmacy-software', 4, id, '#3B82F6', 1, 1, 1, 150
  FROM categories WHERE slug = 'healthcare-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Clinical Trial Management', 'clinical-trial-management', 4, id, '#3B82F6', 1, 1, 1, 160
  FROM categories WHERE slug = 'healthcare-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Veterinary Software', 'veterinary-software', 4, id, '#3B82F6', 1, 1, 1, 170
  FROM categories WHERE slug = 'healthcare-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Law Practice Management', 'law-practice-management', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'legal-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Legal Case Management', 'legal-case-management', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'legal-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Legal Document Management', 'legal-document-management', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'legal-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Legal Billing Software', 'legal-billing-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'legal-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Electronic Discovery (eDiscovery)', 'electronic-discovery-ediscovery', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'legal-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Intellectual Property Management', 'intellectual-property-management', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'legal-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Court Management Software', 'court-management-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'legal-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Enterprise Legal Management', 'enterprise-legal-management', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'legal-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Property Management', 'real-estate-property-management', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'real-estate-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Agency Software', 'real-estate-agency-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'real-estate-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Commercial Real Estate Software', 'commercial-real-estate-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'real-estate-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Transaction Management', 'real-estate-transaction-management', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'real-estate-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HOA Software', 'hoa-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'real-estate-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lease Management Software', 'lease-management-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'real-estate-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vacation Rental Software', 'vacation-rental-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'real-estate-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Construction Management Software', 'construction-management-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'construction-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Construction Estimating Software', 'construction-estimating-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'construction-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Construction Scheduling', 'construction-scheduling', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'construction-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Construction Bid Management', 'construction-bid-management', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'construction-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Takeoff Software', 'takeoff-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'construction-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Building Information Modeling (BIM)', 'building-information-modeling-bim', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'construction-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Home Builder Software', 'home-builder-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'construction-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Roofing Software', 'roofing-software', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'construction-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hotel Management Software', 'hotel-management-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'hospitality-travel-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hospitality Property Management', 'hospitality-property-management', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'hospitality-travel-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hotel Channel Management', 'hotel-channel-management', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'hospitality-travel-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Restaurant Management Software', 'restaurant-management-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'hospitality-travel-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Catering Software', 'catering-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'hospitality-travel-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Travel Agency Software', 'travel-agency-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'hospitality-travel-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tour Operator Software', 'tour-operator-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'hospitality-travel-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Reservations Software', 'reservations-software', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'hospitality-travel-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'School Management Software', 'school-management-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'education-elearning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Student Information Systems (SIS)', 'student-information-systems-sis', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'education-elearning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Higher Education Software', 'higher-education-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'education-elearning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'K-12 Software', 'k-12-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'education-elearning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Virtual Classroom Software', 'virtual-classroom-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'education-elearning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tutoring Software', 'tutoring-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'education-elearning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Daycare Software', 'daycare-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'education-elearning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Admissions Software', 'admissions-software', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'education-elearning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Donation Management Software', 'donation-management-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'nonprofit-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fundraising Software', 'fundraising-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'nonprofit-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Grant Management Software', 'grant-management-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'nonprofit-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Church Management Software', 'church-management-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'nonprofit-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Volunteer Management Software', 'volunteer-management-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'nonprofit-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Membership Management Software', 'membership-management-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'nonprofit-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Transportation Management (TMS)', 'transportation-management-tms', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'transportation-logistics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fleet Management Software', 'fleet-management-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'transportation-logistics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fleet Maintenance Software', 'fleet-maintenance-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'transportation-logistics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trucking Software', 'trucking-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'transportation-logistics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Logistics Software', 'logistics-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'transportation-logistics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Shipping Software', 'shipping-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'transportation-logistics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Route Planning Software', 'route-planning-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'transportation-logistics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'GPS Tracking Software', 'gps-tracking-software', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'transportation-logistics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Delivery Management Software', 'delivery-management-software', 4, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'transportation-logistics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Third Party Logistics (3PL)', 'third-party-logistics-3pl', 4, id, '#3B82F6', 1, 1, 1, 100
  FROM categories WHERE slug = 'transportation-logistics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Government Software', 'government-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'government-public-sector' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Municipal Software', 'municipal-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'government-public-sector' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Public Works Software', 'public-works-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'government-public-sector' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Law Enforcement Software', 'law-enforcement-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'government-public-sector' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fire Department Software', 'fire-department-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'government-public-sector' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Permit Software', 'permit-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'government-public-sector' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Retail Management Systems', 'retail-management-systems', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'retail-consumer-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Salon Software', 'salon-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'retail-consumer-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Spa Software', 'spa-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'retail-consumer-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Barbershop Software', 'barbershop-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'retail-consumer-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pet Grooming Software', 'pet-grooming-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'retail-consumer-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Auto Dealer Software', 'auto-dealer-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'retail-consumer-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Auto Repair Software', 'auto-repair-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'retail-consumer-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Gym Management Software', 'gym-management-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'recreation-wellness' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fitness Software', 'fitness-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'recreation-wellness' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Yoga Studio Software', 'yoga-studio-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'recreation-wellness' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pilates Studio Software', 'pilates-studio-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'recreation-wellness' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Personal Trainer Software', 'personal-trainer-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'recreation-wellness' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dance Studio Software', 'dance-studio-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'recreation-wellness' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sports League Software', 'sports-league-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'recreation-wellness' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Massage Therapy Software', 'massage-therapy-software', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'recreation-wellness' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HVAC Software', 'hvac-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'field-services-trades' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Plumbing Software', 'plumbing-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'field-services-trades' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Electrical Contractor Software', 'electrical-contractor-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'field-services-trades' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Landscape Software', 'landscape-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'field-services-trades' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pest Control Software', 'pest-control-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'field-services-trades' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lawn Care Software', 'lawn-care-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'field-services-trades' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cleaning Services Software', 'cleaning-services-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'field-services-trades' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pool Service Software', 'pool-service-software', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'field-services-trades' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Farm Management Software', 'farm-management-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'agriculture-natural-resources' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Forestry Software', 'forestry-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'agriculture-natural-resources' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mining Software', 'mining-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'agriculture-natural-resources' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Oil and Gas Software', 'oil-and-gas-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'agriculture-natural-resources' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Insurance Agency Software', 'insurance-agency-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'insurance-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Insurance Policy Software', 'insurance-policy-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'insurance-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Insurance Rating Software', 'insurance-rating-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'insurance-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Claims Processing Software', 'claims-processing-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'insurance-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'P&C Insurance Software', 'p-c-insurance-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'insurance-software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IoT Platforms', 'iot-platforms', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'iot-internet-of-things' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IoT Security Solutions', 'iot-security-solutions', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'iot-internet-of-things' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Retail IoT Software', 'retail-iot-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'iot-internet-of-things' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Blockchain Platforms', 'blockchain-platforms', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'blockchain-web3' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'NFT Creation Software', 'nft-creation-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'blockchain-web3' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Edge Computing Platforms', 'edge-computing-platforms', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'edge-computing-5g' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '5G Network Software', '5g-network-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'edge-computing-5g' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CAE (Computer-Aided Engineering)', 'cae-computer-aided-engineering', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'engineering-scientific' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CAM (Computer-Aided Manufacturing)', 'cam-computer-aided-manufacturing', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'engineering-scientific' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'EDA (Electronic Design Automation)', 'eda-electronic-design-automation', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'engineering-scientific' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'FEA (Finite Element Analysis)', 'fea-finite-element-analysis', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'engineering-scientific' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'PCB Design Software', 'pcb-design-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'engineering-scientific' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'MCAD Software', 'mcad-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'engineering-scientific' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Engineering Simulation Software', 'engineering-simulation-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'engineering-scientific' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Scientific Computing Software', 'scientific-computing-software', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'engineering-scientific' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Statistical Analysis Software', 'statistical-analysis-software-2', 4, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'engineering-scientific' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Laboratory Information Management (LIMS)', 'laboratory-information-management-lims', 4, id, '#3B82F6', 1, 1, 1, 100
  FROM categories WHERE slug = 'engineering-scientific' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ELN (Electronic Lab Notebook)', 'eln-electronic-lab-notebook', 4, id, '#3B82F6', 1, 1, 1, 110
  FROM categories WHERE slug = 'engineering-scientific' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'GIS Software', 'gis-software-2', 4, id, '#3B82F6', 1, 1, 1, 120
  FROM categories WHERE slug = 'engineering-scientific' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mathematical Software', 'mathematical-software', 4, id, '#3B82F6', 1, 1, 1, 130
  FROM categories WHERE slug = 'engineering-scientific' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Stock Trading Software', 'stock-trading-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'trading-brokerage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Online Brokerage Platforms', 'online-brokerage-platforms', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'trading-brokerage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Forex Trading Platforms', 'forex-trading-platforms', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'trading-brokerage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Algorithmic Trading Software', 'algorithmic-trading-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'trading-brokerage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Options Trading Software', 'options-trading-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'trading-brokerage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Robo-Advisor Platforms', 'robo-advisor-platforms', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'trading-brokerage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Day Trading Software', 'day-trading-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'trading-brokerage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Technical Analysis Software', 'technical-analysis-software', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'trading-brokerage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trading Signal Software', 'trading-signal-software', 4, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'trading-brokerage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'DeFi Platforms', 'defi-platforms', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'blockchain-web3' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'NFT Marketplaces', 'nft-marketplaces', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'blockchain-web3' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Crypto Tax Software', 'crypto-tax-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'blockchain-web3' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Crypto Portfolio Tracker', 'crypto-portfolio-tracker', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'blockchain-web3' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Crypto Mining Software', 'crypto-mining-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'blockchain-web3' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Smart Contract Platforms', 'smart-contract-platforms', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'blockchain-web3' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Crypto Payment Gateways', 'crypto-payment-gateways', 4, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'blockchain-web3' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Web Hosting Services', 'web-hosting-services', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'web-hosting-domain-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'VPS Hosting', 'vps-hosting', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'web-hosting-domain-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dedicated Server Hosting', 'dedicated-server-hosting', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'web-hosting-domain-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Managed WordPress Hosting', 'managed-wordpress-hosting', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'web-hosting-domain-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cloud Hosting Services', 'cloud-hosting-services', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'web-hosting-domain-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Reseller Hosting', 'reseller-hosting', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'web-hosting-domain-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'DNS Management Software', 'dns-management-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'web-hosting-domain-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CDN (Content Delivery Network)', 'cdn-content-delivery-network', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'web-hosting-domain-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Domain Registrars', 'domain-registrars', 4, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'web-hosting-domain-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SSL Certificate Management', 'ssl-certificate-management', 4, id, '#3B82F6', 1, 1, 1, 100
  FROM categories WHERE slug = 'web-hosting-domain-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Email Hosting Services', 'email-hosting-services', 4, id, '#3B82F6', 1, 1, 1, 110
  FROM categories WHERE slug = 'web-hosting-domain-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Disk Utility Software', 'disk-utility-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'system-utilities' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'File Manager Software', 'file-manager-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'system-utilities' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Archive / Compression Software', 'archive-compression-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'system-utilities' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'System Optimization Software', 'system-optimization-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'system-utilities' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Clipboard Manager Software', 'clipboard-manager-software', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'system-utilities' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Screen Capture Software', 'screen-capture-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'system-utilities' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Font Management Software', 'font-management-software-2', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'system-utilities' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Partition Manager Software', 'partition-manager-software', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'system-utilities' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Boot / USB Creator Software', 'boot-usb-creator-software', 4, id, '#3B82F6', 1, 1, 1, 90
  FROM categories WHERE slug = 'system-utilities' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hardware Asset Management', 'hardware-asset-management-2', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'hardware-asset-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'IT Hardware Inventory Software', 'it-hardware-inventory-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'hardware-asset-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hardware Monitoring Software', 'hardware-monitoring-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'hardware-asset-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Server Hardware Management', 'server-hardware-management', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'hardware-asset-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Equipment Maintenance Software', 'equipment-maintenance-software-2', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'hardware-asset-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Game Engines', 'game-engines', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'game-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '3D Game Development Tools', '3d-game-development-tools', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'game-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '2D Game Development Tools', '2d-game-development-tools', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'game-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Game Asset Creation Software', 'game-asset-creation-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'game-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Multiplayer Game Hosting', 'multiplayer-game-hosting', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'game-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Game Analytics Software', 'game-analytics-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'game-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Game Testing Tools', 'game-testing-tools', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'game-development' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Terminal Emulator Software', 'terminal-emulator-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'developer-utilities' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SSH Client Software', 'ssh-client-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'developer-utilities' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'FTP / SFTP Client Software', 'ftp-sftp-client-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'developer-utilities' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hex Editor Software', 'hex-editor-software', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'developer-utilities' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Regex Tools', 'regex-tools', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'developer-utilities' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Markdown Editor Software', 'markdown-editor-software', 4, id, '#3B82F6', 1, 1, 1, 60
  FROM categories WHERE slug = 'developer-utilities' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Disk Image Software', 'disk-image-software', 4, id, '#3B82F6', 1, 1, 1, 70
  FROM categories WHERE slug = 'developer-utilities' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Virtualization Software (Desktop)', 'virtualization-software-desktop', 4, id, '#3B82F6', 1, 1, 1, 80
  FROM categories WHERE slug = 'developer-utilities' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Print Management Software', 'print-management-software', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'print-publishing-tools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Label Printing Software', 'label-printing-software', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'print-publishing-tools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Barcode Software', 'barcode-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'print-publishing-tools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Print Shop Management', 'print-shop-management', 4, id, '#3B82F6', 1, 1, 1, 40
  FROM categories WHERE slug = 'print-publishing-tools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Variable Data Printing', 'variable-data-printing', 4, id, '#3B82F6', 1, 1, 1, 50
  FROM categories WHERE slug = 'print-publishing-tools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Church Management Software', 'church-management-software-2', 4, id, '#3B82F6', 1, 1, 1, 10
  FROM categories WHERE slug = 'religious-faith-organizations' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Donation Management Software', 'donation-management-software-2', 4, id, '#3B82F6', 1, 1, 1, 20
  FROM categories WHERE slug = 'religious-faith-organizations' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Religious Education Software', 'religious-education-software', 4, id, '#3B82F6', 1, 1, 1, 30
  FROM categories WHERE slug = 'religious-faith-organizations' AND level = 3 LIMIT 1;

-- ═══ Section E: Re-enable FKs ═════════════════════════════════
SET FOREIGN_KEY_CHECKS = 1;

-- ═══ Section F: Re-attach existing software-saas submissions ═══
-- 5 live software-saas listings, all previously under
--   "Sales & CRM Software" → "All-in-One CRM Software"
-- All map to "CRM & Sales Software" → "CRM Platforms" → "CRM Software"
-- (the general CRM L4 in the new taxonomy).
-- See exports/software-saas-listing-mapping-notes.md for the reasoning.

-- id=32 Salesforce
UPDATE submissions
   SET category_id = (SELECT id FROM categories WHERE slug = 'crm-software' AND level = 4 LIMIT 1)
 WHERE id = 32;

-- id=33 HubSpot
UPDATE submissions
   SET category_id = (SELECT id FROM categories WHERE slug = 'crm-software' AND level = 4 LIMIT 1)
 WHERE id = 33;

-- id=34 Zoho CRM
UPDATE submissions
   SET category_id = (SELECT id FROM categories WHERE slug = 'crm-software' AND level = 4 LIMIT 1)
 WHERE id = 34;

-- id=35 Pipedrive
UPDATE submissions
   SET category_id = (SELECT id FROM categories WHERE slug = 'crm-software' AND level = 4 LIMIT 1)
 WHERE id = 35;

-- id=36 Freshsales
UPDATE submissions
   SET category_id = (SELECT id FROM categories WHERE slug = 'crm-software' AND level = 4 LIMIT 1)
 WHERE id = 36;

-- Verification (read-only) — should return 5 rows, no NULLs in category_id:
-- SELECT s.id, s.company_name, s.category_id, c.slug AS new_slug, c.level
--   FROM submissions s
--   LEFT JOIN categories c ON c.id = s.category_id
--  WHERE s.id IN (32, 33, 34, 35, 36);
