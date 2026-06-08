-- ──────────────────────────────────────────────────────────────────────────
-- Migration: listing CLAIM subsystem  (self-bootstrapping + idempotent).
--
-- "Claiming" lets a business owner take ownership of an UNOWNED listing
-- (submissions.user_id IS NULL — the scraped/seeded majority). It rides on the
-- verification subsystem, so this script also creates that base if it's missing
-- (some DBs never ran migration-listing-verification.sql). Safe to re-run: every
-- step checks existence first, so running it twice changes nothing.
--
-- What it sets up:
--   1. listing_verification_requests  (audit trail; created if missing)
--      + request_type ENUM('verify','claim')  — 'claim' rows assign ownership
--        on approval, 'verify' rows don't.
--   2. submissions.verified / verified_at / verification_request_id  (resolved
--      fast-read state the listing page reads).
--   3. listing_claim_otps  (domain-email OTP backing the INSTANT claim path).
--
-- Run in phpMyAdmin against the target DB.
-- ──────────────────────────────────────────────────────────────────────────

-- ─── 1. Base verification requests table (no-op if it already exists) ───────
CREATE TABLE IF NOT EXISTS listing_verification_requests (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id            BIGINT UNSIGNED NOT NULL,
  user_id               INT UNSIGNED NOT NULL,
  status                ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  request_type          ENUM('verify','claim') NOT NULL DEFAULT 'verify',
  legal_name            VARCHAR(255) NULL,
  business_email        VARCHAR(255) NULL,
  business_phone        VARCHAR(40)  NULL,
  registration_number   VARCHAR(120) NULL,
  owner_role            VARCHAR(120) NULL,
  document_url          VARCHAR(500) NULL,
  social_proof          JSON         NULL,
  applicant_notes       TEXT         NULL,
  admin_notes           TEXT         NULL,
  reviewed_by_admin_id  INT UNSIGNED NULL,
  reviewed_at           DATETIME     NULL,
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_listing_status (listing_id, status, created_at),
  KEY idx_user           (user_id),
  KEY idx_status_created (status, created_at),
  KEY idx_lvr_type_status (request_type, status, created_at),
  CONSTRAINT fk_lvr_listing FOREIGN KEY (listing_id) REFERENCES submissions(id)    ON DELETE CASCADE,
  CONSTRAINT fk_lvr_user    FOREIGN KEY (user_id)    REFERENCES business_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 2. request_type column (only if the table pre-existed without it) ──────
SET @needs := (SELECT COUNT(*) = 0 FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'listing_verification_requests' AND COLUMN_NAME = 'request_type');
SET @ddl := IF(@needs,
  "ALTER TABLE listing_verification_requests ADD COLUMN request_type ENUM('verify','claim') NOT NULL DEFAULT 'verify' AFTER status, ADD KEY idx_lvr_type_status (request_type, status, created_at)",
  'SELECT 1');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

-- ─── 3. submissions.user_id — the owner link (usually already exists; the
--        seed files set user_id=NULL. Added only if somehow missing). ────────
SET @needs := (SELECT COUNT(*) = 0 FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'submissions' AND COLUMN_NAME = 'user_id');
SET @ddl := IF(@needs, 'ALTER TABLE submissions ADD COLUMN user_id INT UNSIGNED NULL', 'SELECT 1');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

-- ─── 4. submissions resolved verification columns (added only if missing) ───
SET @needs := (SELECT COUNT(*) = 0 FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'submissions' AND COLUMN_NAME = 'verified');
SET @ddl := IF(@needs, 'ALTER TABLE submissions ADD COLUMN verified TINYINT(1) NOT NULL DEFAULT 0', 'SELECT 1');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

SET @needs := (SELECT COUNT(*) = 0 FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'submissions' AND COLUMN_NAME = 'verified_at');
SET @ddl := IF(@needs, 'ALTER TABLE submissions ADD COLUMN verified_at DATETIME NULL', 'SELECT 1');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

SET @needs := (SELECT COUNT(*) = 0 FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'submissions' AND COLUMN_NAME = 'verification_request_id');
SET @ddl := IF(@needs, 'ALTER TABLE submissions ADD COLUMN verification_request_id BIGINT UNSIGNED NULL', 'SELECT 1');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

SET @needs := (SELECT COUNT(*) = 0 FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'submissions' AND INDEX_NAME = 'idx_verified');
SET @ddl := IF(@needs, 'ALTER TABLE submissions ADD KEY idx_verified (verified)', 'SELECT 1');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

-- ─── 5. listing_claim_otps — domain-email OTP for the instant claim path ────
CREATE TABLE IF NOT EXISTS listing_claim_otps (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id    BIGINT UNSIGNED NOT NULL,
  user_id       INT UNSIGNED    NOT NULL,
  email         VARCHAR(255)    NOT NULL,   -- the domain-matching business email the code was sent to
  code_hash     VARCHAR(255)    NOT NULL,
  expires_at    DATETIME        NOT NULL,
  attempts      TINYINT UNSIGNED NOT NULL DEFAULT 0,
  resends       TINYINT UNSIGNED NOT NULL DEFAULT 0,
  last_sent_at  DATETIME        NOT NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_claim_otp (listing_id, user_id),
  KEY idx_claim_otp_expires (expires_at),
  CONSTRAINT fk_claim_otp_listing FOREIGN KEY (listing_id) REFERENCES submissions(id)    ON DELETE CASCADE,
  CONSTRAINT fk_claim_otp_user    FOREIGN KEY (user_id)    REFERENCES business_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
