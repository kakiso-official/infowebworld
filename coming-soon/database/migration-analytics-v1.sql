-- ============================================================================
-- InfoWebWorld Analytics v1 - first-party visitor tracking (Oct 2026)
--
-- Creates the 5 tables behind /iww-hq/analytics. Additive and idempotent:
-- safe to re-run. Does NOT touch or drop the old page_views /
-- page_analytics_daily tables (they stay as history; drop them later by hand
-- if wanted).
--
-- Run once in phpMyAdmin on the production database, before or right after
-- the deploy. Until it runs, tracking silently does nothing and the admin
-- Analytics page shows a "run the migration" notice.
--
-- Every timestamp is UTC, DATETIME(3) (millisecond precision).
-- No raw IP addresses are stored anywhere.
-- ============================================================================

SET NAMES utf8mb4;

-- One row per browser (anonymous visitor id from the iww_vid cookie).
CREATE TABLE IF NOT EXISTS an_visitors (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  vid              CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  user_id          INT UNSIGNED NULL,
  first_seen_at    DATETIME(3) NOT NULL,
  last_seen_at     DATETIME(3) NOT NULL,
  sessions         INT UNSIGNED NOT NULL DEFAULT 0,
  pageviews        INT UNSIGNED NOT NULL DEFAULT 0,
  events           INT UNSIGNED NOT NULL DEFAULT 0,
  engaged_ms       BIGINT UNSIGNED NOT NULL DEFAULT 0,
  first_session_id BIGINT UNSIGNED NULL,
  first_channel    VARCHAR(24) NULL,
  first_source     VARCHAR(100) NULL,
  first_medium     VARCHAR(100) NULL,
  first_campaign   VARCHAR(150) NULL,
  first_referrer   VARCHAR(1000) NULL,
  first_landing    VARCHAR(500) NULL,
  country          CHAR(2) NULL,
  device_type      VARCHAR(10) NULL,
  signed_up_at     DATETIME(3) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_an_visitors_vid (vid),
  KEY idx_an_visitors_user (user_id),
  KEY idx_an_visitors_first_seen (first_seen_at),
  KEY idx_an_visitors_last_seen (last_seen_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- One row per visit (30 minutes of inactivity ends a session).
CREATE TABLE IF NOT EXISTS an_sessions (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  visitor_id      BIGINT UNSIGNED NOT NULL,
  user_id         INT UNSIGNED NULL,
  started_at      DATETIME(3) NOT NULL,
  last_seen_at    DATETIME(3) NOT NULL,
  duration_ms     INT UNSIGNED NOT NULL DEFAULT 0,
  engaged_ms      INT UNSIGNED NOT NULL DEFAULT 0,
  pageviews       SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  events          SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  key_events      SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  is_new          TINYINT(1) NOT NULL DEFAULT 0,
  is_engaged      TINYINT(1) NOT NULL DEFAULT 0,
  entry_path      VARCHAR(500) NOT NULL,
  entry_type      VARCHAR(24) NOT NULL,
  exit_path       VARCHAR(500) NOT NULL,
  exit_type       VARCHAR(24) NOT NULL,
  referrer        VARCHAR(1000) NULL,
  referrer_host   VARCHAR(255) NULL,
  channel         VARCHAR(24) NOT NULL,
  source          VARCHAR(100) NOT NULL,
  medium          VARCHAR(100) NULL,
  campaign        VARCHAR(150) NULL,
  term            VARCHAR(150) NULL,
  content         VARCHAR(150) NULL,
  click_id        VARCHAR(10) NULL,
  country         CHAR(2) NULL,
  region          VARCHAR(100) NULL,
  city            VARCHAR(100) NULL,
  timezone        VARCHAR(64) NULL,
  language        VARCHAR(16) NULL,
  device_type     VARCHAR(10) NOT NULL,
  os              VARCHAR(32) NULL,
  os_version      VARCHAR(16) NULL,
  browser         VARCHAR(32) NULL,
  browser_version VARCHAR(16) NULL,
  screen_w        SMALLINT UNSIGNED NULL,
  screen_h        SMALLINT UNSIGNED NULL,
  did_signup      TINYINT(1) NOT NULL DEFAULT 0,
  did_login       TINYINT(1) NOT NULL DEFAULT 0,
  did_listing     TINYINT(1) NOT NULL DEFAULT 0,
  did_lead        TINYINT(1) NOT NULL DEFAULT 0,
  did_outbound    TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_an_sessions_started (started_at),
  KEY idx_an_sessions_visitor (visitor_id, started_at),
  KEY idx_an_sessions_last_seen (last_seen_at),
  KEY idx_an_sessions_user (user_id),
  KEY idx_an_sessions_channel (channel, started_at),
  KEY idx_an_sessions_source (source, started_at),
  KEY idx_an_sessions_country (country, started_at),
  KEY idx_an_sessions_entry (entry_path(150), started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- One row per page viewed (hard loads and in-app navigations).
CREATE TABLE IF NOT EXISTS an_pageviews (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  pvid        CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  session_id  BIGINT UNSIGNED NOT NULL,
  visitor_id  BIGINT UNSIGNED NOT NULL,
  seq         SMALLINT UNSIGNED NOT NULL,
  ts          DATETIME(3) NOT NULL,
  path        VARCHAR(500) NOT NULL,
  query       VARCHAR(500) NULL,
  title       VARCHAR(300) NULL,
  page_type   VARCHAR(24) NOT NULL,
  entity      VARCHAR(200) NULL,
  prev_path   VARCHAR(500) NULL,
  is_exit     TINYINT(1) NOT NULL DEFAULT 1,
  engaged_ms  INT UNSIGNED NOT NULL DEFAULT 0,
  scroll_pct  TINYINT UNSIGNED NOT NULL DEFAULT 0,
  status      SMALLINT UNSIGNED NOT NULL DEFAULT 200,
  nav_type    VARCHAR(12) NULL,
  lcp_ms      INT UNSIGNED NULL,
  fcp_ms      INT UNSIGNED NULL,
  ttfb_ms     INT UNSIGNED NULL,
  inp_ms      INT UNSIGNED NULL,
  cls         DECIMAL(8,4) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_an_pv_pvid (pvid),
  KEY idx_an_pv_ts (ts),
  KEY idx_an_pv_session (session_id, seq),
  KEY idx_an_pv_path (path(150), ts),
  KEY idx_an_pv_type (page_type, ts),
  KEY idx_an_pv_prev (prev_path(150), ts)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Clicks, searches, signups, listings, leads, errors... (client + server).
CREATE TABLE IF NOT EXISTS an_events (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ts          DATETIME(3) NOT NULL,
  name        VARCHAR(48) NOT NULL,
  category    VARCHAR(16) NOT NULL,
  is_key      TINYINT(1) NOT NULL DEFAULT 0,
  origin      VARCHAR(6) NOT NULL,
  session_id  BIGINT UNSIGNED NULL,
  visitor_id  BIGINT UNSIGNED NULL,
  user_id     INT UNSIGNED NULL,
  pageview_id BIGINT UNSIGNED NULL,
  path        VARCHAR(500) NULL,
  target      VARCHAR(1000) NULL,
  label       VARCHAR(300) NULL,
  value       DECIMAL(12,2) NULL,
  props       JSON NULL,
  PRIMARY KEY (id),
  KEY idx_an_ev_ts (ts),
  KEY idx_an_ev_name (name, ts),
  KEY idx_an_ev_session (session_id),
  KEY idx_an_ev_visitor (visitor_id, ts),
  KEY idx_an_ev_user (user_id, ts)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Daily count of hits we dropped on purpose (bots, rate limits, internal
-- traffic), so the admin can see how much was filtered.
CREATE TABLE IF NOT EXISTS an_filtered_daily (
  day     DATE NOT NULL,
  reason  VARCHAR(24) NOT NULL,
  hits    INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (day, reason)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
