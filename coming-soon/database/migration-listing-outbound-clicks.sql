-- ──────────────────────────────────────────────────────────────────────────
-- Migration: per-listing outbound website-click tracking.
--
-- Records every time a visitor clicks "Visit website" on:
--   - /company/[slug] product page  (campaign: 'listing')
--   - /profile/[slug] company page  (campaign: 'profile')
--   - L1/L2/L3 category cards       (campaign: 'category-card')
--   - /compare side-by-side cards   (campaign: 'compare')
--   - Integration cross-links       (campaign: 'integrations')
--
-- This is the missing piece for "how many people did we send to the
-- listing owner's website?" — the most valuable metric a directory can
-- report back. The withInfoWebWorldUtm() helper tags the outbound URL
-- so the owner sees us as the referrer in their own analytics; this
-- table is OUR independent count, served back to the owner via the
-- dashboard home analytics view.
--
-- Type alignment:
--   submissions.id    = BIGINT UNSIGNED  (per database/schema.sql:138)
--   business_users.id = INT(10) UNSIGNED
--
-- Idempotent — safe to re-run.
-- ──────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS listing_outbound_clicks (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id    BIGINT UNSIGNED NOT NULL,
  visitor_hash  VARCHAR(64)  DEFAULT NULL,
  user_id       INT UNSIGNED DEFAULT NULL,
  campaign      VARCHAR(64)  DEFAULT NULL,
  referrer      VARCHAR(500) DEFAULT NULL,
  country       VARCHAR(2)   DEFAULT NULL,
  device_type   ENUM('desktop','mobile','tablet') DEFAULT NULL,
  user_agent    VARCHAR(500) DEFAULT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_loc_listing_time (listing_id, created_at),
  KEY idx_loc_visitor (visitor_hash),
  KEY idx_loc_campaign (campaign),
  CONSTRAINT fk_loc_listing FOREIGN KEY (listing_id)
    REFERENCES submissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
