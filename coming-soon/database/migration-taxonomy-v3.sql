-- ============================================================
-- InfoWebWorld — Taxonomy V3 Migration
-- 5-level tree → 3-level navigation + faceted tags
-- Run each statement one at a time in phpMyAdmin
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ═══ 1. Add is_navigation flag to categories ═══

ALTER TABLE `categories`
  ADD COLUMN `is_navigation` TINYINT(1) NOT NULL DEFAULT 1 AFTER `is_featured`;

-- Mark old L4/L5 as non-navigable
UPDATE `categories` SET `is_navigation` = 0 WHERE `level` IN (4, 5);

-- ═══ 2. Tag Groups table (6 faceted dimensions) ═══

CREATE TABLE `tag_groups` (
  `id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(80) NOT NULL,
  `slug` VARCHAR(80) NOT NULL,
  `description` VARCHAR(300) DEFAULT NULL,
  `icon` VARCHAR(60) DEFAULT NULL,
  `color` VARCHAR(7) NOT NULL DEFAULT '#6B7280',
  `sort_order` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tag_groups_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══ 3. Tags table (values within each group) ═══

CREATE TABLE `tags` (
  `id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `tag_group_id` SMALLINT UNSIGNED NOT NULL,
  `name` VARCHAR(80) NOT NULL,
  `slug` VARCHAR(80) NOT NULL,
  `sort_order` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tags_group_slug` (`tag_group_id`, `slug`),
  KEY `idx_tags_group` (`tag_group_id`),
  CONSTRAINT `fk_tags_group` FOREIGN KEY (`tag_group_id`) REFERENCES `tag_groups` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══ 4. Listing Types table (flat labels, was L4+L5) ═══

CREATE TABLE `listing_types` (
  `id` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` SMALLINT UNSIGNED NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) NOT NULL,
  `sort_order` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_listing_types_category` (`category_id`),
  CONSTRAINT `fk_listing_types_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══ 5. Submission Tags junction table ═══

CREATE TABLE `submission_tags` (
  `submission_id` BIGINT UNSIGNED NOT NULL,
  `tag_id` SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (`submission_id`, `tag_id`),
  KEY `idx_submission_tags_tag` (`tag_id`),
  CONSTRAINT `fk_subtags_submission` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_subtags_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══ 6. Add listing_type_id to submissions ═══

ALTER TABLE `submissions`
  ADD COLUMN `listing_type_id` MEDIUMINT UNSIGNED DEFAULT NULL AFTER `category_id`;

ALTER TABLE `submissions`
  ADD KEY `idx_submissions_listing_type` (`listing_type_id`);

SET FOREIGN_KEY_CHECKS = 1;
