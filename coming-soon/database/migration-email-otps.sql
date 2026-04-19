-- Email OTP storage for email/password signup verification.
-- One row per pending email. On signup-request we UPSERT; on successful
-- signup-verify the row is deleted.

CREATE TABLE IF NOT EXISTS email_otps (
  email           VARCHAR(255) NOT NULL PRIMARY KEY,
  code_hash       VARCHAR(255) NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  name            VARCHAR(120) DEFAULT NULL,
  expires_at      DATETIME NOT NULL,
  attempts        TINYINT UNSIGNED NOT NULL DEFAULT 0,
  resends         TINYINT UNSIGNED NOT NULL DEFAULT 0,
  last_sent_at    DATETIME NOT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email_otps_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
