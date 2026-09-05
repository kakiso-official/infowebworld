-- ═══════════════════════════════════════════════════════════════════════
-- How many company profiles will become indexable?
-- ═══════════════════════════════════════════════════════════════════════
--
-- Until Sep 2026 all 5,655 /profile pages served `noindex, nofollow` while
-- sitemap-listings.xml simultaneously submitted 5,723 of them to Google.
-- They are now gated on real content instead: a profile is indexed if it
-- has a genuine written bio, OR at least three independent proof points.
--
-- This predicate is the SQL twin of hasSubstantiveProfile() in
-- app/profile/[slug]/page.tsx and the filter in
-- app/sitemap-listings.xml/route.ts. Run it to see the split BEFORE
-- deploying, and to decide whether the threshold should move.
--
-- To loosen the gate: lower `>= 3` to `>= 2`.
-- To tighten it:     raise to `>= 4`, or raise the 150-char bio floor.
-- Keep all three places in step if you change it.
-- ═══════════════════════════════════════════════════════════════════════

SELECT
  COUNT(*) AS total_live_companies,
  SUM(CASE WHEN indexable THEN 1 ELSE 0 END) AS will_be_indexed,
  SUM(CASE WHEN indexable THEN 0 ELSE 1 END) AS will_stay_noindex,
  ROUND(100.0 * SUM(CASE WHEN indexable THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_indexed
FROM (
  SELECT
    CASE WHEN
         (CHAR_LENGTH(COALESCE(description, '')) >= 150 AND (CHAR_LENGTH(COALESCE(description, '')) >= 25
          AND description NOT REGEXP '(?i)(verification failed|bot[- ]gated|requires? javascript|security (checkpoint|challenge|service|measures)|browser verification|access (denied|forbidden)|(unable|failed) +(to +)?(extract|verify|access)|no (content|business information) (available|accessible)|content (not available|unavailable)|(limited|no) information available|homepage returned empty)'))
      OR (
           (CASE WHEN CHAR_LENGTH(COALESCE(description, '')) >= 60 AND (CHAR_LENGTH(COALESCE(description, '')) >= 25
          AND description NOT REGEXP '(?i)(verification failed|bot[- ]gated|requires? javascript|security (checkpoint|challenge|service|measures)|browser verification|access (denied|forbidden)|(unable|failed) +(to +)?(extract|verify|access)|no (content|business information) (available|accessible)|content (not available|unavailable)|(limited|no) information available|homepage returned empty)') THEN 1 ELSE 0 END)
         + (CASE WHEN JSON_VALID(awards)            AND JSON_LENGTH(awards) > 0            THEN 1 ELSE 0 END)
         + (CASE WHEN JSON_VALID(client_logos)      AND JSON_LENGTH(client_logos) > 0      THEN 1 ELSE 0 END)
         + (CASE WHEN JSON_VALID(service_lines)     AND JSON_LENGTH(service_lines) > 0     THEN 1 ELSE 0 END)
         + (CASE WHEN JSON_VALID(industries_served) AND JSON_LENGTH(industries_served) > 0 THEN 1 ELSE 0 END)
         + (CASE WHEN COALESCE(intro_video_url, '') <> ''                   THEN 1 ELSE 0 END)
         + (CASE WHEN CHAR_LENGTH(COALESCE(clients_summary, '')) >= 60      THEN 1 ELSE 0 END)
         + (CASE WHEN COALESCE(founded_year,'') <> '' AND COALESCE(team_size,'') <> ''
                                                      AND COALESCE(hq_location,'') <> ''  THEN 1 ELSE 0 END)
         ) >= 3
    THEN 1 ELSE 0 END AS indexable
    FROM submissions
   WHERE COALESCE(listing_mode,'product') = 'company'
     AND status IN ('active','paid')
) t;


-- Same split, broken down by sector, so you can see whether one seed wave
-- is dragging the average down.
SELECT
  COALESCE(sector.slug, '(unknown)') AS sector,
  COUNT(*)                           AS live_companies,
  SUM(CASE WHEN CHAR_LENGTH(COALESCE(s.description,'')) >= 150 THEN 1 ELSE 0 END) AS has_real_bio,
  SUM(CASE WHEN CHAR_LENGTH(COALESCE(s.description,'')) <  25  THEN 1 ELSE 0 END) AS broken_or_empty_desc
  FROM submissions s
  LEFT JOIN categories c    ON c.id = s.category_id
  LEFT JOIN categories p    ON p.id = c.parent_id
  LEFT JOIN categories gp   ON gp.id = p.parent_id
  LEFT JOIN categories ggp  ON ggp.id = gp.parent_id
  LEFT JOIN categories sector
         ON sector.id = COALESCE(
              CASE WHEN c.level = 1 THEN c.id END,
              CASE WHEN c.level = 2 THEN p.id END,
              CASE WHEN c.level = 3 THEN gp.id END,
              CASE WHEN c.level = 4 THEN ggp.id END)
 WHERE COALESCE(s.listing_mode,'product') = 'company'
   AND s.status IN ('active','paid')
 GROUP BY sector.slug
 ORDER BY live_companies DESC;
