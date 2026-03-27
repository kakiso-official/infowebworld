-- ============================================================
-- InfoWebWorld — Tracking V3 Migration
-- Adds composite indexes for 30-min dedup queries
-- Safe to run multiple times (IF NOT EXISTS)
-- ============================================================

-- Composite index for pageview dedup: WHERE visitor_hash = ? AND page = ? AND created_at > ?
-- This makes the 30-min dedup check a fast index lookup instead of a table scan
ALTER TABLE page_views
  ADD INDEX idx_pv_dedup (visitor_hash, page(50), created_at);

-- Composite index for blog view dedup: WHERE visitor_hash = ? AND post_id = ? AND created_at > ?
ALTER TABLE blog_views
  ADD INDEX idx_bv_dedup (visitor_hash, post_id, created_at);
