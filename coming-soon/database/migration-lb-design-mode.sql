-- ════════════════════════════════════════════════════════════════════════
-- Per-listing design mode for LOCAL-BUSINESS listings.
--
--   'yelp'    = Yelp-style LocalBusinessCard (category pages) +
--               LocalBusinessProfilePage (/profile)   ← DEFAULT
--   'classic' = the standard listing card + the existing /profile
--               CompanyDetailPage that every other listing already uses
--
-- Read ONLY for listings in the `local-businesses` sector; every other
-- sector ignores this column entirely. New + existing rows default to
-- 'yelp', so current behavior is 100% unchanged until an admin flips a
-- listing from the Submissions console.
--
-- Safe + additive: a single nullable-with-default column. Run once in
-- phpMyAdmin.
-- ════════════════════════════════════════════════════════════════════════

ALTER TABLE `submissions`
  ADD COLUMN `lb_design_mode` VARCHAR(16) NOT NULL DEFAULT 'yelp';
