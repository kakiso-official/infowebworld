-- ============================================================
-- InfoWebWorld — Tracking V2 Migration
-- Run this ONCE on your cPanel MySQL via phpMyAdmin
-- Adds: UTM tracking, visitor hash (dedup), is_unique flag
-- ============================================================

-- Add UTM + visitor hash columns to page_views
ALTER TABLE `page_views`
  ADD COLUMN `utm_source` VARCHAR(100) DEFAULT NULL AFTER `referrer`,
  ADD COLUMN `utm_medium` VARCHAR(100) DEFAULT NULL AFTER `utm_source`,
  ADD COLUMN `utm_campaign` VARCHAR(100) DEFAULT NULL AFTER `utm_medium`,
  ADD COLUMN `utm_content` VARCHAR(200) DEFAULT NULL AFTER `utm_campaign`,
  ADD COLUMN `visitor_hash` VARCHAR(64) DEFAULT NULL AFTER `device_type`,
  ADD COLUMN `is_unique` TINYINT(1) NOT NULL DEFAULT 1 AFTER `visitor_hash`,
  ADD KEY `idx_pageviews_visitor` (`visitor_hash`),
  ADD KEY `idx_pageviews_utm` (`utm_source`),
  ADD KEY `idx_pageviews_unique` (`is_unique`, `created_at`);

-- Add UTM + visitor hash columns to blog_views
ALTER TABLE `blog_views`
  ADD COLUMN `utm_source` VARCHAR(100) DEFAULT NULL AFTER `referrer`,
  ADD COLUMN `utm_medium` VARCHAR(100) DEFAULT NULL AFTER `utm_source`,
  ADD COLUMN `utm_campaign` VARCHAR(100) DEFAULT NULL AFTER `utm_medium`,
  ADD COLUMN `visitor_hash` VARCHAR(64) DEFAULT NULL AFTER `device_type`,
  ADD COLUMN `is_unique` TINYINT(1) NOT NULL DEFAULT 1 AFTER `visitor_hash`,
  ADD KEY `idx_blogviews_visitor` (`visitor_hash`),
  ADD KEY `idx_blogviews_unique` (`is_unique`, `created_at`);

-- Add UTM breakdown to page_analytics_daily
ALTER TABLE `page_analytics_daily`
  ADD COLUMN `utm_source` VARCHAR(100) DEFAULT NULL AFTER `unique_views`,
  ADD COLUMN `desktop_views` INT UNSIGNED NOT NULL DEFAULT 0 AFTER `utm_source`,
  ADD COLUMN `mobile_views` INT UNSIGNED NOT NULL DEFAULT 0 AFTER `desktop_views`,
  ADD COLUMN `tablet_views` INT UNSIGNED NOT NULL DEFAULT 0 AFTER `mobile_views`;

-- Drop old unique key and add new one that includes utm_source
ALTER TABLE `page_analytics_daily`
  DROP INDEX `uk_page_analytics`,
  ADD UNIQUE KEY `uk_page_analytics` (`page`(100), `date`, `utm_source`);
