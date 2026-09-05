-- ═══════════════════════════════════════════════════════════════════════
-- Find companies that are listed more than once
-- ═══════════════════════════════════════════════════════════════════════
--
-- The 2026-08-25 crawl surfaced duplicate pages competing with each other:
--
--   Same company, two company-mode rows under two slugs:
--     /profile/effectual              +  /profile/effectual-effectual
--     /profile/innovative-solutions   +  /profile/innovative-solutions-innovative
--     /profile/randstad-randstadusa   +  /profile/randstad-usa
--
--   Same company as BOTH a product and a company:
--     /listing/adecco            +  /profile/adecco-adeccousa
--     /listing/randstad          +  /profile/randstad-randstadusa
--     /listing/marcus-millichap  +  /profile/marcus-and-millichap
--
-- ROOT CAUSE (fixed in code, Sep 2026):
--   1. scripts/gen-companies-all.mjs and gen-aiml-products.mjs built their
--      cross-wave exclude list from 'research-it-275/input.json' resolved
--      against scripts/research-full-xlsx/ — a path that does not exist —
--      and a bare `catch {}` swallowed the error. 698 already-seeded
--      companies (275 IT + 423 PS) were therefore NEVER excluded.
--   2. On a slug collision the generators MUTATED the slug
--      (slug + '-' + domain) instead of skipping the row, minting a second
--      public URL for a company that was already listed. That is literally
--      where "effectual-effectual" and "randstad-randstadusa" came from.
--   Both are fixed; this file cleans up what already shipped.
--
-- These are SELECTs. Nothing is modified. YOU choose which row survives —
-- prefer the one with the better slug, more content, and any real owner.
--
-- HOW TO RUN (phpMyAdmin): run each query, export the results, decide the
-- keepers, then use the template at the bottom.
-- ═══════════════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────────────
-- QUERY 1 — same normalised company name, more than one live row.
--
-- Normalisation strips punctuation AND the country/suffix qualifiers that
-- hid pairs like "Randstad" vs "Randstad USA" from earlier audits.
-- ─────────────────────────────────────────────────────────────────────
SELECT
  norm_name,
  COUNT(*)                                        AS copies,
  GROUP_CONCAT(id ORDER BY id)                    AS ids,
  GROUP_CONCAT(CONCAT(listing_mode, ':', slug) ORDER BY id SEPARATOR '  |  ') AS pages,
  GROUP_CONCAT(DISTINCT status)                   AS statuses
FROM (
  SELECT
    id, slug, company_name, status, website, user_id,
    COALESCE(listing_mode, 'product') AS listing_mode,
    TRIM(REGEXP_REPLACE(
      REGEXP_REPLACE(LOWER(company_name),
        '( usa| u\\.s\\.a\\.| us| uk| inc| inc\\.| llc| ltd| limited| corp| corporation| co| group| holdings| plc| gmbh| pty| pte| sa| ag)+$', ''),
      '[^a-z0-9]+', ' ')) AS norm_name
    FROM submissions
   WHERE status IN ('active','paid') AND slug IS NOT NULL AND slug <> ''
) t
GROUP BY norm_name
HAVING COUNT(*) > 1
ORDER BY copies DESC, norm_name;


-- ─────────────────────────────────────────────────────────────────────
-- QUERY 2 — same website domain on more than one live row.
--
-- Catches duplicates whose names differ but which are the same business.
-- ─────────────────────────────────────────────────────────────────────
SELECT
  domain,
  COUNT(*)                     AS copies,
  GROUP_CONCAT(id ORDER BY id) AS ids,
  GROUP_CONCAT(CONCAT(listing_mode, ':', slug) ORDER BY id SEPARATOR '  |  ') AS pages
FROM (
  SELECT
    id, slug, COALESCE(listing_mode, 'product') AS listing_mode,
    LOWER(TRIM(TRAILING '/' FROM
      SUBSTRING_INDEX(
        REGEXP_REPLACE(REGEXP_REPLACE(website, '^https?://', ''), '^www\\.', ''),
        '/', 1))) AS domain
    FROM submissions
   WHERE status IN ('active','paid')
     AND website IS NOT NULL AND website <> ''
) t
WHERE domain <> ''
GROUP BY domain
HAVING COUNT(*) > 1
ORDER BY copies DESC, domain;


-- ─────────────────────────────────────────────────────────────────────
-- QUERY 3 — the specific "generator mutated the slug" fingerprint:
-- a slug that is another live slug plus a trailing suffix.
-- ─────────────────────────────────────────────────────────────────────
SELECT
  a.id AS dup_id,   a.slug AS dup_slug,   a.company_name AS dup_name,
  b.id AS base_id,  b.slug AS base_slug,  b.company_name AS base_name,
  COALESCE(a.listing_mode,'product') AS dup_mode,
  COALESCE(b.listing_mode,'product') AS base_mode
  FROM submissions a
  JOIN submissions b
    ON a.id <> b.id
   AND a.slug LIKE CONCAT(b.slug, '-%')
   AND CHAR_LENGTH(b.slug) >= 6
 WHERE a.status IN ('active','paid')
   AND b.status IN ('active','paid')
 ORDER BY b.slug;


-- ─────────────────────────────────────────────────────────────────────
-- QUERY 4 — same company appearing as BOTH a product and a company.
-- These produce a /listing/<slug> and a /profile/<slug> with the same H1.
-- ─────────────────────────────────────────────────────────────────────
SELECT
  p.id AS product_id, p.slug AS product_slug,
  c.id AS company_id, c.slug AS company_slug,
  p.company_name, p.website AS product_site, c.website AS company_site
  FROM submissions p
  JOIN submissions c
    ON TRIM(REGEXP_REPLACE(LOWER(p.company_name), '[^a-z0-9]+', ' '))
     = TRIM(REGEXP_REPLACE(LOWER(c.company_name), '[^a-z0-9]+', ' '))
   AND COALESCE(p.listing_mode,'product') = 'product'
   AND COALESCE(c.listing_mode,'product') = 'company'
 WHERE p.status IN ('active','paid') AND c.status IN ('active','paid')
 ORDER BY p.company_name;


-- ═══════════════════════════════════════════════════════════════════════
-- RETIRING A DUPLICATE — fill in the ids YOU chose, then run.
--
-- 'rejected' takes the page out of the public site: only status IN
-- ('active','paid') renders, is listed in generateStaticParams, and appears
-- in sitemap-listings.xml. The row is kept so nothing is lost and the
-- decision is reversible.
--
-- Prefer keeping the row that has: the cleaner slug, a real owner
-- (user_id IS NOT NULL), more filled-in content, and more inbound history.
-- NEVER retire a row with user_id set without checking with that owner.
--
-- Redeploy afterwards — profiles and listings are statically generated.
-- ═══════════════════════════════════════════════════════════════════════

-- UPDATE submissions
--    SET status = 'rejected', updated_at = NOW()
--  WHERE id IN ( /* ids of the rows to retire */ )
--    AND user_id IS NULL;      -- safety: never retire a claimed listing
