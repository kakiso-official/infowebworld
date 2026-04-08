-- Set AI & ML sector color (#8B5CF6 purple) on all L2 and L3 categories
-- Run in phpMyAdmin

-- L2 categories under AI & ML
UPDATE categories SET color = '#8B5CF6'
WHERE level = 2
AND parent_id = (SELECT id FROM (SELECT id FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1) AS tmp);

-- L3 categories under AI & ML
UPDATE categories SET color = '#8B5CF6'
WHERE level = 3
AND parent_id IN (
  SELECT id FROM (
    SELECT c2.id FROM categories c2
    WHERE c2.level = 2
    AND c2.parent_id = (SELECT id FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1)
  ) AS ids
);

-- Also set all other sectors' children colors while we're at it

-- Software & SaaS (#3B82F6)
UPDATE categories SET color = '#3B82F6' WHERE level IN (2,3) AND color IS NULL AND (
  parent_id = (SELECT id FROM (SELECT id FROM categories WHERE slug = 'software-saas' AND level = 1) AS t1)
  OR parent_id IN (SELECT id FROM (SELECT id FROM categories WHERE level = 2 AND parent_id = (SELECT id FROM categories WHERE slug = 'software-saas' AND level = 1)) AS t2)
);

-- IT Services & Agencies (#14B8A6)
UPDATE categories SET color = '#14B8A6' WHERE level IN (2,3) AND color IS NULL AND (
  parent_id = (SELECT id FROM (SELECT id FROM categories WHERE slug = 'it-services-agencies' AND level = 1) AS t1)
  OR parent_id IN (SELECT id FROM (SELECT id FROM categories WHERE level = 2 AND parent_id = (SELECT id FROM categories WHERE slug = 'it-services-agencies' AND level = 1)) AS t2)
);

-- Startups & Innovation (#E8553D)
UPDATE categories SET color = '#E8553D' WHERE level IN (2,3) AND color IS NULL AND (
  parent_id = (SELECT id FROM (SELECT id FROM categories WHERE slug = 'startups-innovation' AND level = 1) AS t1)
  OR parent_id IN (SELECT id FROM (SELECT id FROM categories WHERE level = 2 AND parent_id = (SELECT id FROM categories WHERE slug = 'startups-innovation' AND level = 1)) AS t2)
);

-- Local Business (#F59E0B)
UPDATE categories SET color = '#F59E0B' WHERE level IN (2,3) AND color IS NULL AND (
  parent_id = (SELECT id FROM (SELECT id FROM categories WHERE slug = 'local-business' AND level = 1) AS t1)
  OR parent_id IN (SELECT id FROM (SELECT id FROM categories WHERE level = 2 AND parent_id = (SELECT id FROM categories WHERE slug = 'local-business' AND level = 1)) AS t2)
);

-- Professional Services (#2FAE6A)
UPDATE categories SET color = '#2FAE6A' WHERE level IN (2,3) AND color IS NULL AND (
  parent_id = (SELECT id FROM (SELECT id FROM categories WHERE slug = 'professional-services' AND level = 1) AS t1)
  OR parent_id IN (SELECT id FROM (SELECT id FROM categories WHERE level = 2 AND parent_id = (SELECT id FROM categories WHERE slug = 'professional-services' AND level = 1)) AS t2)
);

-- Verify
SELECT
  (SELECT COUNT(*) FROM categories WHERE level IN (2,3) AND color IS NULL) as null_colors,
  (SELECT COUNT(*) FROM categories WHERE level IN (2,3) AND color = '#8B5CF6') as ai_purple,
  (SELECT COUNT(*) FROM categories WHERE level IN (2,3) AND color = '#3B82F6') as software_blue,
  (SELECT COUNT(*) FROM categories WHERE level IN (2,3) AND color = '#14B8A6') as it_teal,
  (SELECT COUNT(*) FROM categories WHERE level IN (2,3) AND color = '#E8553D') as startup_coral,
  (SELECT COUNT(*) FROM categories WHERE level IN (2,3) AND color = '#F59E0B') as local_amber,
  (SELECT COUNT(*) FROM categories WHERE level IN (2,3) AND color = '#2FAE6A') as pro_green;
