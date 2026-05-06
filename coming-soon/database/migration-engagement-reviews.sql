-- ──────────────────────────────────────────────────────────────────────────
-- Migration: engagement + reviews + inbox subsystem for /company/[slug] pages.
-- All tables idempotent. Run in phpMyAdmin against cdbrisgy_infowebworld.
-- Type alignment (verified against actual prod schema):
--   submissions.id    = BIGINT UNSIGNED   (per database/schema.sql:138)
--   business_users.id = INT(10) UNSIGNED  (verified in S35)
-- ──────────────────────────────────────────────────────────────────────────

-- ─── 1. listing_follows ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS listing_follows (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id   BIGINT UNSIGNED NOT NULL,
  user_id      INT UNSIGNED NOT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_follow (listing_id, user_id),
  KEY idx_user (user_id),
  CONSTRAINT fk_lfollow_listing FOREIGN KEY (listing_id) REFERENCES submissions(id) ON DELETE CASCADE,
  CONSTRAINT fk_lfollow_user    FOREIGN KEY (user_id)    REFERENCES business_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 2. listing_reactions ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS listing_reactions (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id   BIGINT UNSIGNED NOT NULL,
  user_id      INT UNSIGNED NOT NULL,
  kind         ENUM('like','dislike') NOT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_react (listing_id, user_id),
  KEY idx_listing_kind (listing_id, kind),
  CONSTRAINT fk_lreact_listing FOREIGN KEY (listing_id) REFERENCES submissions(id) ON DELETE CASCADE,
  CONSTRAINT fk_lreact_user    FOREIGN KEY (user_id)    REFERENCES business_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 3. listing_bookmarks ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS listing_bookmarks (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id   BIGINT UNSIGNED NOT NULL,
  user_id      INT UNSIGNED NOT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_bookmark (listing_id, user_id),
  KEY idx_user (user_id),
  CONSTRAINT fk_lbm_listing FOREIGN KEY (listing_id) REFERENCES submissions(id) ON DELETE CASCADE,
  CONSTRAINT fk_lbm_user    FOREIGN KEY (user_id)    REFERENCES business_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 4. reviews ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id    BIGINT UNSIGNED NOT NULL,
  user_id       INT UNSIGNED NOT NULL,
  rating        TINYINT UNSIGNED NOT NULL,
  title         VARCHAR(120) NOT NULL,
  body          TEXT NOT NULL,
  status        ENUM('pending','approved','rejected') NOT NULL DEFAULT 'approved',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_review (listing_id, user_id),
  KEY idx_listing_status (listing_id, status),
  CONSTRAINT fk_review_listing FOREIGN KEY (listing_id) REFERENCES submissions(id) ON DELETE CASCADE,
  CONSTRAINT fk_review_user    FOREIGN KEY (user_id)    REFERENCES business_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 5. listing_inbox_emails ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS listing_inbox_emails (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id   BIGINT UNSIGNED NOT NULL,
  email        VARCHAR(255) NOT NULL,
  ip_address   VARCHAR(45),
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_listing_created (listing_id, created_at),
  CONSTRAINT fk_inbox_listing FOREIGN KEY (listing_id) REFERENCES submissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
