-- ============================================================
-- InfoWebWorld - Reciprocal badge backlink tracking
--
-- Adds backlink_* columns to `submissions`. A listing becomes an
-- InfoWebWorld "Partner" when it displays our badge (a link back to us)
-- on its OWN website, verified by crawling the homepage.
--
-- This does NOT change the dofollow/nofollow policy on links we give them
-- (that stays plan-based). It only powers the Partner mark + future boost.
--
-- Run ONCE in phpMyAdmin -> SQL tab. If you re-run it, MySQL reports
-- "Duplicate column name" -- that is harmless, it just means it's applied.
-- ============================================================

ALTER TABLE `submissions`
  ADD COLUMN `backlink_status`      ENUM('none','pending','verified','lost') NOT NULL DEFAULT 'none',
  ADD COLUMN `backlink_method`      ENUM('crawl','script','manual') NULL,
  ADD COLUMN `backlink_url`         VARCHAR(500) NULL,
  ADD COLUMN `backlink_verified_at` DATETIME NULL,
  ADD COLUMN `backlink_checked_at`  DATETIME NULL,
  ADD COLUMN `backlink_fail_count`  SMALLINT UNSIGNED NOT NULL DEFAULT 0;

-- Optional: speeds up the future weekly re-check cron (uncomment if desired).
-- ALTER TABLE `submissions` ADD INDEX `idx_backlink` (`backlink_status`, `backlink_checked_at`);
