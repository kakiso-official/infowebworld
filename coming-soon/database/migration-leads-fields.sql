-- ─── Lead form fields on listing_inbox_emails ───────────────────────────
-- Extends the existing single-email "Send me info" capture so the
-- richer "Get a Quote" lead form can store name, phone, message and the
-- form source. All new columns are nullable / defaulted so existing rows
-- and the email-only form continue to work unchanged.

ALTER TABLE listing_inbox_emails
  ADD COLUMN name        VARCHAR(120)  NULL AFTER email,
  ADD COLUMN phone       VARCHAR(40)   NULL AFTER name,
  ADD COLUMN message     TEXT          NULL AFTER phone,
  ADD COLUMN source      VARCHAR(32)   NOT NULL DEFAULT 'send_info' AFTER message,
  ADD COLUMN user_id     INT UNSIGNED  NULL AFTER source,
  ADD COLUMN user_agent  VARCHAR(500)  NULL AFTER user_id;

ALTER TABLE listing_inbox_emails
  ADD KEY idx_listing_source (listing_id, source, created_at);
