-- ============================================================
-- Migration: Listings V3 — capture every datum the live listing page renders
-- ============================================================
-- Run each ALTER TABLE statement ONE AT A TIME in phpMyAdmin.
-- If a column already exists, MySQL will error with "Duplicate column name" —
-- just skip that line and continue. All columns are optional (DEFAULT NULL or 0).
-- Date: 2026-05-05
-- ============================================================

-- 1. Sticky-head category pills (3-5 short labels under the company name)
ALTER TABLE submissions ADD COLUMN header_tags JSON DEFAULT NULL AFTER faqs;

-- 2-3. Pros & Cons (3 short labels each, shown in the overview side card)
ALTER TABLE submissions ADD COLUMN pros JSON DEFAULT NULL AFTER header_tags;
ALTER TABLE submissions ADD COLUMN cons JSON DEFAULT NULL AFTER pros;

-- 4. Industries served (donut chart input — array of industry names)
ALTER TABLE submissions ADD COLUMN industries_served JSON DEFAULT NULL AFTER cons;

-- 5. Use cases (diamond cluster — array of use case names)
ALTER TABLE submissions ADD COLUMN use_cases JSON DEFAULT NULL AFTER industries_served;

-- 6. Target company sizes (multi-select: small / mid / enterprise)
ALTER TABLE submissions ADD COLUMN target_company_sizes JSON DEFAULT NULL AFTER use_cases;

-- 7. Key features with rich descriptions (top 3-6 features w/ name + description)
--    Replaces the listing page's hardcoded KEY_FEATURES paragraphs.
ALTER TABLE submissions ADD COLUMN key_features JSON DEFAULT NULL AFTER target_company_sizes;

-- 8-11. Starting price (overview side card "From $X / month")
ALTER TABLE submissions ADD COLUMN starting_price DECIMAL(10,2) DEFAULT NULL AFTER key_features;
ALTER TABLE submissions ADD COLUMN starting_price_period VARCHAR(20) DEFAULT NULL AFTER starting_price;
ALTER TABLE submissions ADD COLUMN has_free_trial TINYINT(1) NOT NULL DEFAULT 0 AFTER starting_price_period;
ALTER TABLE submissions ADD COLUMN has_free_version TINYINT(1) NOT NULL DEFAULT 0 AFTER has_free_trial;

-- 12. Support channels (multi-select: email, chat, knowledge_base, faqs, 24_7, phone)
ALTER TABLE submissions ADD COLUMN support_channels JSON DEFAULT NULL AFTER has_free_version;

-- 13. Training options (multi-select: live, videos, webinars, documentation)
ALTER TABLE submissions ADD COLUMN training_options JSON DEFAULT NULL AFTER support_channels;

-- 14. Languages supported (multi-select array of language names)
ALTER TABLE submissions ADD COLUMN languages JSON DEFAULT NULL AFTER training_options;

-- 15-16. Mobile app availability flags
ALTER TABLE submissions ADD COLUMN has_ios_app TINYINT(1) NOT NULL DEFAULT 0 AFTER languages;
ALTER TABLE submissions ADD COLUMN has_android_app TINYINT(1) NOT NULL DEFAULT 0 AFTER has_ios_app;

-- 17. Compliance / certifications (GDPR, CAN-SPAM, SOC2, HIPAA, ISO 27001, etc.)
ALTER TABLE submissions ADD COLUMN compliance JSON DEFAULT NULL AFTER has_android_app;

-- 18. Awards / press mentions (array of {name, year})
ALTER TABLE submissions ADD COLUMN awards JSON DEFAULT NULL AFTER compliance;

-- ============================================================
-- Verification: after running, this query should show 18 new columns
-- SELECT COLUMN_NAME FROM information_schema.COLUMNS
-- WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'submissions'
--   AND COLUMN_NAME IN (
--     'header_tags','pros','cons','industries_served','use_cases',
--     'target_company_sizes','key_features','starting_price',
--     'starting_price_period','has_free_trial','has_free_version',
--     'support_channels','training_options','languages',
--     'has_ios_app','has_android_app','compliance','awards'
--   );
-- ============================================================
