-- ──────────────────────────────────────────────────────────────────────────
-- Migration: admin controls for the scraper.
--
-- Two minimal additions:
--   1. Add 'cancelled' to scrape_jobs.status enum so admin-cancelled jobs
--      are distinct from worker-failed jobs in the funnel pills.
--   2. New scraper_runtime_config table — single row holding the L1 filter
--      the admin UI dropdown writes to. The worker polls this row each
--      iteration so the focus category can change without a restart.
--
-- Both idempotent. Run in phpMyAdmin against cdbrisgy_infowebworld.
-- ──────────────────────────────────────────────────────────────────────────


-- ─── 1. Extend scrape_jobs.status enum ────────────────────────────────────
-- Online schema change in MySQL when only adding enum values at the end.
-- Existing rows untouched. Apply route + UI need 'cancelled' to render
-- correctly (status pill + filter pill).
ALTER TABLE scrape_jobs
  MODIFY COLUMN status
  ENUM('queued','running','review','applied','failed','skipped','cancelled')
  NOT NULL DEFAULT 'queued';


-- ─── 2. scraper_runtime_config ────────────────────────────────────────────
-- Single-row table (always id=1). The admin UI writes l1_filter to focus
-- the worker on one category; NULL means "claim from any L1". The worker
-- reads this on every poll iteration — switching takes effect within
-- one poll interval, no terminal needed.
CREATE TABLE IF NOT EXISTS scraper_runtime_config (
  id          TINYINT UNSIGNED NOT NULL DEFAULT 1,
  l1_filter   VARCHAR(50) DEFAULT NULL,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by  VARCHAR(191) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO scraper_runtime_config (id, l1_filter)
VALUES (1, NULL);
