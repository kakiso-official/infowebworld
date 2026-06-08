-- ──────────────────────────────────────────────────────────────────────────
-- Migration: email-marketing subsystem (admin templates + send history).
--
--   email_templates  — reusable subject + HTML body the admin composes.
--   email_campaigns   — one row per broadcast actually sent (audience snapshot
--                       + sent/failed counts) for an audit/history trail.
--
-- No foreign keys (kept decoupled, like the scraper tables) — the app layer
-- enforces integrity. Idempotent; safe to re-run. Run in phpMyAdmin.
-- ──────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS email_templates (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name        VARCHAR(160)  NOT NULL,
  subject     VARCHAR(255)  NOT NULL,
  body_html   MEDIUMTEXT    NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_email_templates_updated (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS email_campaigns (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  subject           VARCHAR(255) NOT NULL,
  body_html         MEDIUMTEXT   NOT NULL,
  audience          VARCHAR(40)  NOT NULL,   -- all_users | verified_users | waitlist
  recipient_count   INT UNSIGNED NOT NULL DEFAULT 0,
  sent_count        INT UNSIGNED NOT NULL DEFAULT 0,
  failed_count      INT UNSIGNED NOT NULL DEFAULT 0,
  status            VARCHAR(20)  NOT NULL DEFAULT 'sent',  -- sent | partial | failed
  sent_by_admin_id  INT UNSIGNED NULL,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_email_campaigns_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
