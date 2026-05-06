-- ──────────────────────────────────────────────────────────────────────────
-- Migration: business_user_plan_purchases
-- Purpose:   Track every successful PayPal capture against a paid plan tier.
--            Acts as the source of truth for "has this user paid for X plan?".
--            Read by /api/submissions to gate paid-tier listing creation.
-- Idempotent-ish: re-running ALTER will throw "duplicate" if the table exists.
-- ──────────────────────────────────────────────────────────────────────────

-- user_id is INT UNSIGNED to match the business_users.id PK type convention.
-- If your business_users.id is signed INT, change `user_id INT UNSIGNED` to
-- `user_id INT` to satisfy the FK. Run this query first to verify:
--   SHOW CREATE TABLE business_users;
CREATE TABLE IF NOT EXISTS business_user_plan_purchases (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id         INT UNSIGNED NOT NULL,
  plan_slug       VARCHAR(20) NOT NULL,
  amount          DECIMAL(10,2) NOT NULL,
  currency        VARCHAR(3) NOT NULL DEFAULT 'USD',
  paypal_order_id VARCHAR(64) NOT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_paypal_order (paypal_order_id),
  KEY idx_user_plan (user_id, plan_slug),
  CONSTRAINT fk_bupp_user FOREIGN KEY (user_id) REFERENCES business_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
