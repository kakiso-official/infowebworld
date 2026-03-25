-- ============================================================
-- Migration: Enhanced Listings V2
-- Run each statement ONE AT A TIME in phpMyAdmin
-- ============================================================

-- 1. Add slug for clean listing URLs
ALTER TABLE submissions ADD COLUMN slug VARCHAR(200) DEFAULT NULL AFTER description;
ALTER TABLE submissions ADD UNIQUE KEY uk_submissions_slug (slug);

-- 2. Add media fields
ALTER TABLE submissions ADD COLUMN logo_url VARCHAR(500) DEFAULT NULL AFTER slug;
ALTER TABLE submissions ADD COLUMN screenshots JSON DEFAULT NULL AFTER logo_url;
ALTER TABLE submissions ADD COLUMN demo_video VARCHAR(500) DEFAULT NULL AFTER screenshots;

-- 3. Add product detail fields
ALTER TABLE submissions ADD COLUMN features JSON DEFAULT NULL AFTER demo_video;
ALTER TABLE submissions ADD COLUMN integrations JSON DEFAULT NULL AFTER features;
ALTER TABLE submissions ADD COLUMN pricing_model VARCHAR(30) DEFAULT 'contact' AFTER integrations;
ALTER TABLE submissions ADD COLUMN pricing_tiers JSON DEFAULT NULL AFTER pricing_model;


-- 4. Add company detail fields
ALTER TABLE submissions ADD COLUMN funding VARCHAR(30) DEFAULT NULL AFTER team_size;
ALTER TABLE submissions ADD COLUMN hq_location VARCHAR(200) DEFAULT NULL AFTER funding;
ALTER TABLE submissions ADD COLUMN linkedin VARCHAR(500) DEFAULT NULL AFTER hq_location;
ALTER TABLE submissions ADD COLUMN twitter VARCHAR(500) DEFAULT NULL AFTER linkedin;
ALTER TABLE submissions ADD COLUMN facebook VARCHAR(500) DEFAULT NULL AFTER twitter;

-- 5. Add approval tracking
ALTER TABLE submissions ADD COLUMN approved_at DATETIME DEFAULT NULL AFTER activated_at;
