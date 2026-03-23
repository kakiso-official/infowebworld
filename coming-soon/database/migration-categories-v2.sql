-- ============================================================
-- InfoWebWorld — Categories V2 Migration
-- Run this ONCE on your cPanel MySQL via phpMyAdmin
-- Adds: hierarchy (sectors/subcategories), SEO fields,
--        launch tracking, icons, descriptions, cover images
-- ============================================================
-- NOTE: Each ALTER is a separate statement because cPanel
--       phpMyAdmin chokes on large combined ALTERs.
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ── Hierarchy columns ──

ALTER TABLE `categories`
  ADD COLUMN `parent_id` SMALLINT UNSIGNED DEFAULT NULL AFTER `id`;

ALTER TABLE `categories`
  ADD COLUMN `level` TINYINT UNSIGNED NOT NULL DEFAULT 2 AFTER `parent_id`;

-- ── Display & content columns ──

ALTER TABLE `categories`
  ADD COLUMN `icon` VARCHAR(60) DEFAULT NULL AFTER `color`;

ALTER TABLE `categories`
  ADD COLUMN `description` VARCHAR(500) DEFAULT NULL AFTER `icon`;

ALTER TABLE `categories`
  ADD COLUMN `cover_image` VARCHAR(500) DEFAULT NULL AFTER `description`;

-- ── Counters & flags ──

ALTER TABLE `categories`
  ADD COLUMN `listing_count` INT UNSIGNED NOT NULL DEFAULT 0 AFTER `cover_image`;

ALTER TABLE `categories`
  ADD COLUMN `is_launched` TINYINT(1) NOT NULL DEFAULT 0 AFTER `listing_count`;

ALTER TABLE `categories`
  ADD COLUMN `is_featured` TINYINT(1) NOT NULL DEFAULT 0 AFTER `is_launched`;

-- ── SEO columns (mirrors blog_posts SEO pattern) ──

ALTER TABLE `categories`
  ADD COLUMN `seo_title` VARCHAR(70) DEFAULT NULL AFTER `is_featured`;

ALTER TABLE `categories`
  ADD COLUMN `seo_description` VARCHAR(170) DEFAULT NULL AFTER `seo_title`;

ALTER TABLE `categories`
  ADD COLUMN `seo_keywords` JSON DEFAULT NULL AFTER `seo_description`;

ALTER TABLE `categories`
  ADD COLUMN `seo_og_image` VARCHAR(500) DEFAULT NULL AFTER `seo_keywords`;

ALTER TABLE `categories`
  ADD COLUMN `seo_canonical` VARCHAR(500) DEFAULT NULL AFTER `seo_og_image`;

ALTER TABLE `categories`
  ADD COLUMN `seo_no_index` TINYINT(1) NOT NULL DEFAULT 0 AFTER `seo_canonical`;

-- ── Timestamps ──

ALTER TABLE `categories`
  ADD COLUMN `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`;

-- ── Indexes ──

ALTER TABLE `categories`
  ADD KEY `idx_categories_parent` (`parent_id`);

ALTER TABLE `categories`
  ADD KEY `idx_categories_level` (`level`);

ALTER TABLE `categories`
  ADD KEY `idx_categories_launched` (`is_launched`);

-- ── Foreign key: parent_id -> categories(id) ──

ALTER TABLE `categories`
  ADD CONSTRAINT `fk_categories_parent`
  FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

SET FOREIGN_KEY_CHECKS = 1;
