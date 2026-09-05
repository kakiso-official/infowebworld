-- ═══════════════════════════════════════════════════════════════════════
-- Duplicate categories INSIDE the same sector
-- ═══════════════════════════════════════════════════════════════════════
--
-- After the Sep 2026 metadata fix, cross-sector title collisions are gone
-- (a category name reused by another sector now carries a sector
-- qualifier). What remains is 38 groups / 76 category rows where the SAME
-- sector contains the SAME category name twice, e.g.
--
--   local-businesses:   hair-salons              +  hair-salons-2
--   local-businesses:   barbershops              +  barbershops-2
--   local-businesses:   nail-salons              +  nail-salons-2
--   software-saas:      ecommerce-platforms      +  ecommerce-platforms-2
--   software-saas:      project-management-software + project-management-software-2
--   professional-services: architects            +  architects-2
--   professional-services: insurance-brokers     +  insurance-brokers-2
--
-- No metadata rule can separate these — they are the same category listed
-- twice. Two URLs, the same H1, the same title, splitting whatever
-- listings and link equity each one has. The fix is to merge them in the
-- taxonomy, which is a data decision only you can make.
--
-- These are SELECTs. Nothing is modified.
--
-- AFTER merging, you MUST re-export the static taxonomy or the live site
-- keeps serving the old tree:
--     node scripts/export-categories.mjs
--     git commit -m "chore: refresh categories export" && git push
-- (Re-running it also regenerates app/config/category-name-collisions.ts.)
-- ═══════════════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────────────
-- QUERY 1 — the duplicate groups, with listing counts so you can see
-- which copy is actually being used.
-- ─────────────────────────────────────────────────────────────────────
SELECT
  c.name,
  c.level,
  COUNT(*)                                     AS copies,
  GROUP_CONCAT(c.id ORDER BY c.id)             AS category_ids,
  GROUP_CONCAT(c.slug ORDER BY c.id SEPARATOR '  |  ') AS slugs,
  GROUP_CONCAT(
    (SELECT COUNT(*) FROM submissions s
      WHERE s.category_id = c.id AND s.status IN ('active','paid'))
    ORDER BY c.id SEPARATOR '  |  ')           AS live_listings_each
  FROM categories c
 WHERE c.is_active = 1
   AND c.level >= 2
 GROUP BY c.name, c.level, c.parent_id
HAVING COUNT(*) > 1
 ORDER BY copies DESC, c.name;


-- ─────────────────────────────────────────────────────────────────────
-- QUERY 2 — the "-2" fingerprint specifically: a slug that is another
-- live slug with a numeric suffix. This is how the duplicates were minted.
-- ─────────────────────────────────────────────────────────────────────
SELECT
  dup.id   AS dup_id,   dup.slug   AS dup_slug,
  base.id  AS base_id,  base.slug  AS base_slug,
  dup.name,
  dup.level,
  (SELECT COUNT(*) FROM submissions s WHERE s.category_id = dup.id  AND s.status IN ('active','paid')) AS dup_listings,
  (SELECT COUNT(*) FROM submissions s WHERE s.category_id = base.id AND s.status IN ('active','paid')) AS base_listings
  FROM categories dup
  JOIN categories base
    ON base.slug = REGEXP_REPLACE(dup.slug, '-[0-9]+$', '')
   AND base.id <> dup.id
 WHERE dup.slug REGEXP '-[0-9]+$'
   AND dup.is_active = 1
   AND base.is_active = 1
 ORDER BY dup.name;


-- ─────────────────────────────────────────────────────────────────────
-- QUERY 3 — anything that would be orphaned by a merge: child categories
-- hanging off a duplicate you might retire. Check this BEFORE merging.
-- ─────────────────────────────────────────────────────────────────────
SELECT
  parent.id AS parent_id, parent.slug AS parent_slug, parent.name AS parent_name,
  COUNT(child.id)                                    AS child_categories
  FROM categories parent
  LEFT JOIN categories child ON child.parent_id = parent.id AND child.is_active = 1
 WHERE parent.slug REGEXP '-[0-9]+$'
   AND parent.is_active = 1
 GROUP BY parent.id, parent.slug, parent.name
HAVING child_categories > 0
 ORDER BY child_categories DESC;


-- ═══════════════════════════════════════════════════════════════════════
-- MERGE TEMPLATE — fill in the ids YOU chose, then run as one transaction.
--
--   @keep = the id of the category that survives (better slug, more
--           listings, has children)
--   @drop = the id of the duplicate being retired
--
-- Order matters: move the listings and children BEFORE deactivating, or
-- they end up pointing at a hidden category.
-- ═══════════════════════════════════════════════════════════════════════

-- START TRANSACTION;
--
-- SET @keep = 0;   -- <- surviving category id
-- SET @drop = 0;   -- <- duplicate category id
--
-- -- 1. move live listings across
-- UPDATE submissions  SET category_id = @keep WHERE category_id = @drop;
--
-- -- 2. re-parent any child categories
-- UPDATE categories   SET parent_id   = @keep WHERE parent_id   = @drop;
--
-- -- 3. move listing types across
-- UPDATE listing_types SET category_id = @keep WHERE category_id = @drop;
--
-- -- 4. retire the duplicate (kept, not deleted — reversible)
-- UPDATE categories
--    SET is_active = 0, is_navigation = 0, is_launched = 0
--  WHERE id = @drop;
--
-- -- 5. refresh the surviving category's cached count
-- UPDATE categories c
--    SET c.listing_count = (
--          SELECT COUNT(*) FROM submissions s
--           WHERE s.category_id = c.id AND s.status IN ('active','paid'))
--  WHERE c.id = @keep;
--
-- COMMIT;

-- NOTE: the retired URL (/sector/<dup-slug>) will 404 afterwards. If it
-- had any traffic or backlinks, add a 301 to the surviving slug in
-- next.config.ts redirects() rather than letting it 404 — the domain is a
-- 2004-registered asset and existing equity is worth preserving.
