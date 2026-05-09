-- ──────────────────────────────────────────────────────────────────────────
-- Hotfix: add `updated_at` column to the `reviews` table.
--
-- The original migration-engagement-reviews.sql created the table without
-- updated_at, but the admin moderation routes (added later in 2542389)
-- reference it:
--   GET  /api/admin/reviews            → SELECT r.updated_at, …
--   POST /api/admin/reviews/[id]/approve → UPDATE reviews SET … updated_at=NOW()
--   POST /api/admin/reviews/[id]/reject  → UPDATE reviews SET … updated_at=NOW()
--
-- Without this column, /iww-hq/reviews errors out and approve/reject calls
-- fail with "Unknown column 'updated_at'".
--
-- Run once in phpMyAdmin against cdbrisgy_infowebworld.
-- ──────────────────────────────────────────────────────────────────────────

ALTER TABLE reviews
  ADD COLUMN updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
              ON UPDATE CURRENT_TIMESTAMP
  AFTER created_at;
