-- ──────────────────────────────────────────────────────────────────────────
-- Migration: listing verification subsystem.
--
-- Adds an audit-trail table for verification applications + resolved
-- "verified" state directly on submissions for fast read-path access (so
-- /company/[slug] and the dashboard listings query don't need a join).
--
-- Type alignment (verified against actual prod schema):
--   submissions.id      = BIGINT UNSIGNED   (per database/schema.sql)
--   business_users.id   = INT(10) UNSIGNED  (per S35 verification)
--   admins.id           = INT UNSIGNED      (no FK — admin row may be soft-deleted)
--
-- Run this in phpMyAdmin against cdbrisgy_infowebworld BEFORE the verify
-- feature ships. The user-facing form + admin queue both read/write rows
-- in listing_verification_requests; the resolved flags on submissions are
-- what /company/[slug] reads.
-- ──────────────────────────────────────────────────────────────────────────

-- ─── 1. listing_verification_requests ───────────────────────────────────
-- One row per application. A listing can have many rows over time
-- (re-apply after rejection); the most recent row by created_at is
-- the "current" state. submissions.verification_request_id points to
-- whichever row triggered the current verified=1 state, for audit.
CREATE TABLE IF NOT EXISTS listing_verification_requests (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id            BIGINT UNSIGNED NOT NULL,
  user_id               INT UNSIGNED NOT NULL,
  status                ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',

  -- Evidence the applicant submits. All optional (admins are humans and
  -- can chase missing pieces); a richer application is more likely to be
  -- approved on first pass.
  legal_name            VARCHAR(255) NULL,         -- legal/registered company name
  business_email        VARCHAR(255) NULL,         -- e.g. founder@company.com (must match website domain ideally)
  business_phone        VARCHAR(40)  NULL,
  registration_number   VARCHAR(120) NULL,         -- company registration / EIN / VAT etc
  owner_role            VARCHAR(120) NULL,         -- e.g. "Founder", "Director of Marketing"
  document_url          VARCHAR(500) NULL,         -- proof-of-ownership doc (uploaded asset URL)
  social_proof          JSON         NULL,         -- {linkedin?, twitter?, github?, other?} owner profile URLs
  applicant_notes       TEXT         NULL,         -- free-form context from the applicant

  -- Admin response. admin_id is an FK-less pointer because admin rows can
  -- be deactivated without deleting; preserving the original reviewer id
  -- here is enough audit even if the admin row goes away.
  admin_notes           TEXT          NULL,
  reviewed_by_admin_id  INT UNSIGNED  NULL,
  reviewed_at           DATETIME      NULL,

  -- Timestamps. updated_at lets us tell at-a-glance how long a request has
  -- been sitting in pending without joining anything.
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  KEY idx_listing_status (listing_id, status, created_at),
  KEY idx_user           (user_id),
  KEY idx_status_created (status, created_at),
  CONSTRAINT fk_lvr_listing FOREIGN KEY (listing_id) REFERENCES submissions(id)    ON DELETE CASCADE,
  CONSTRAINT fk_lvr_user    FOREIGN KEY (user_id)    REFERENCES business_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 2. submissions: resolved verification state ────────────────────────
-- These three columns are the "fast read" surface. /company/[slug] is
-- statically rebuilt — it should never join verification_requests just to
-- decide whether to render the badge. Approving a request flips these;
-- rejecting one does not touch them.
--
-- verification_request_id is the request that drove the current verified
-- state — kept so the admin UI can show "verified on May 12 by Aadil based
-- on request #47" without scanning the requests table.
ALTER TABLE submissions
  ADD COLUMN verified                TINYINT(1)      NOT NULL DEFAULT 0,
  ADD COLUMN verified_at             DATETIME        NULL,
  ADD COLUMN verification_request_id BIGINT UNSIGNED NULL,
  ADD KEY idx_verified (verified);
