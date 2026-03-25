-- Migration: Ensure ALL required columns exist on submissions table
-- Run each statement ONE AT A TIME in phpMyAdmin
-- If a column already exists, the ALTER will error — just skip that line
-- Date: 2026-03-25

-- slug (may already exist from migration-listings-v2)
ALTER TABLE submissions ADD COLUMN slug VARCHAR(200) DEFAULT NULL AFTER uuid;

-- logo_url, screenshots, demo_video (may already exist)
ALTER TABLE submissions ADD COLUMN logo_url VARCHAR(500) DEFAULT NULL AFTER description;
ALTER TABLE submissions ADD COLUMN screenshots JSON DEFAULT NULL AFTER logo_url;
ALTER TABLE submissions ADD COLUMN demo_video VARCHAR(500) DEFAULT NULL AFTER screenshots;

-- features, integrations, pricing_model, pricing_tiers (may already exist)
ALTER TABLE submissions ADD COLUMN features JSON DEFAULT NULL AFTER demo_video;
ALTER TABLE submissions ADD COLUMN integrations JSON DEFAULT NULL AFTER features;
ALTER TABLE submissions ADD COLUMN pricing_model VARCHAR(30) DEFAULT 'contact' AFTER integrations;
ALTER TABLE submissions ADD COLUMN pricing_tiers JSON DEFAULT NULL AFTER pricing_model;

-- funding, hq_location, social links (may already exist)
ALTER TABLE submissions ADD COLUMN funding VARCHAR(30) DEFAULT NULL AFTER team_size;
ALTER TABLE submissions ADD COLUMN hq_location VARCHAR(200) DEFAULT NULL AFTER funding;
ALTER TABLE submissions ADD COLUMN linkedin VARCHAR(500) DEFAULT NULL AFTER hq_location;
ALTER TABLE submissions ADD COLUMN twitter VARCHAR(500) DEFAULT NULL AFTER linkedin;
ALTER TABLE submissions ADD COLUMN facebook VARCHAR(500) DEFAULT NULL AFTER twitter;

-- faqs (may already exist from migration-faqs)
ALTER TABLE submissions ADD COLUMN faqs JSON DEFAULT NULL AFTER facebook;

-- state (may already exist from migration-state)
ALTER TABLE submissions ADD COLUMN state VARCHAR(100) DEFAULT NULL AFTER city;

-- paypal_order_id (THIS IS LIKELY MISSING — critical for payment)
ALTER TABLE submissions ADD COLUMN paypal_order_id VARCHAR(100) DEFAULT NULL AFTER faqs;

-- slug unique key (may already exist)
ALTER TABLE submissions ADD UNIQUE KEY uk_submissions_slug (slug);

-- approved_at (may already exist)
ALTER TABLE submissions ADD COLUMN approved_at DATETIME DEFAULT NULL AFTER activated_at;
