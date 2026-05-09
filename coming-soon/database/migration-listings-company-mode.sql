-- ──────────────────────────────────────────────────────────────────────────
-- Migration: company-mode listings.
--
-- The submissions table holds BOTH product listings (existing) and company
-- listings (new). One unified table keeps the admin moderation queue, the
-- approval flow, and the deploy hook all working without a parallel
-- "companies" table to maintain.
--
--   listing_mode        product | company  (default: product, so all
--                       existing rows are unchanged)
--   parent_company_id   FK to submissions.id of the company that makes
--                       this product. NULL for company rows themselves
--                       and for product rows whose owner skipped the
--                       linkage. Self-referential nullable FK.
--   is_hiring           Optional flag rendered as a "We're hiring"
--                       badge on /profile/[slug]. Skipped on product
--                       pages.
--
-- One-company-per-user is enforced at the API layer (POST /api/submissions
-- rejects when listing_mode='company' and the user already has an
-- existing company row), not via a partial UNIQUE index — partial
-- indexes aren't portable across MySQL versions and the API check is
-- the right place for that rule anyway.
--
-- Slug uniqueness was already enforced on `submissions.slug`. The new
-- code path just slugifies the user-provided name and rejects on
-- collision; no schema change needed for that.
--
-- Run once in phpMyAdmin against cdbrisgy_infowebworld.
-- ──────────────────────────────────────────────────────────────────────────

ALTER TABLE submissions
  ADD COLUMN listing_mode      ENUM('product','company') NOT NULL DEFAULT 'product',
  ADD COLUMN parent_company_id BIGINT UNSIGNED NULL,
  ADD COLUMN is_hiring         TINYINT(1) NOT NULL DEFAULT 0,
  ADD KEY idx_listing_mode    (listing_mode),
  ADD KEY idx_parent_company  (parent_company_id),
  ADD CONSTRAINT fk_parent_company
      FOREIGN KEY (parent_company_id)
      REFERENCES submissions(id)
      ON DELETE SET NULL;
