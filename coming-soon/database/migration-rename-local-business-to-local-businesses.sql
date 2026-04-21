-- ============================================================
-- Rename L1 sector: local-business → local-businesses
-- ============================================================
-- This migration updates the L1 sector row in `categories` to
-- match the new URL slug and display name. Code references have
-- already been updated to the new slug/name, so the app will
-- expect `local-businesses` starting from this deploy.
--
-- Run AFTER deploying the code changes.
-- Idempotent — safe to run multiple times.
--
-- Verification queries at the bottom.
-- ============================================================

-- 1. Show current state (for sanity)
SELECT id, name, slug, level FROM categories
 WHERE (slug = 'local-business' OR slug = 'local-businesses') AND level = 1;

-- 2. Rename the L1 sector (only if still named 'local-business')
UPDATE categories
   SET slug = 'local-businesses',
       name = 'Local Businesses'
 WHERE slug = 'local-business'
   AND level = 1;

-- 3. Verify post-update
SELECT id, name, slug, level FROM categories
 WHERE slug = 'local-businesses' AND level = 1;

-- 4. Verify L2 children still correctly attached
SELECT COUNT(*) AS l2_children
  FROM categories
 WHERE level = 2
   AND parent_id = (SELECT id FROM (SELECT id FROM categories WHERE slug = 'local-businesses' AND level = 1) AS t1);

-- 5. Verify L3 grandchildren
SELECT COUNT(*) AS l3_grandchildren
  FROM categories
 WHERE level = 3
   AND parent_id IN (
     SELECT id FROM categories
      WHERE level = 2
        AND parent_id = (SELECT id FROM (SELECT id FROM categories WHERE slug = 'local-businesses' AND level = 1) AS t1)
   );
