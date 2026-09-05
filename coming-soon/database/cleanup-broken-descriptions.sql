-- ═══════════════════════════════════════════════════════════════════════
-- Clean the corrupt descriptions/taglines left by the bulk-enrichment waves
-- ═══════════════════════════════════════════════════════════════════════
--
-- Found by the 2026-08-25 Screaming Frog crawl: 157 live company profiles
-- serve garbage as their description, both on the page and as the meta
-- description. Two distinct causes:
--
--   PATTERN A (93 rows) — the enrichment agent's own ERROR MESSAGE was
--   stored as the company description. Real live examples:
--     /profile/6sense        "Page verification failed - bot-gated site
--                             preventing content access"
--     /profile/alten         "Page blocked by browser verification -
--                             unable to extract content."
--     /profile/big-leap      "Website is blocked by Cloudflare security
--                             measures; no business information accessible."
--
--   PATTERN B (64 rows) — a naive first-sentence splitter cut the text at
--   an abbreviation's period. Real live examples:
--     /profile/ch-robinson               "C.H."
--     /profile/arthur-j-gallagher-and-co "Arthur J."
--     /profile/chuck-e-cheese            "Chuck E."
--     /profile/baird                     "Robert W."
--
-- The code bug behind Pattern B is fixed in all 10 seed generators
-- (scripts/gen-*.mjs firstSentence), and both patterns are now blocked at
-- render time by isJunkText() in lib/seo.ts. This file repairs the rows
-- that are ALREADY in the database.
--
-- We NULL the bad values rather than invent replacements — never fabricate
-- company copy. A NULL description renders the page's honest empty state,
-- and the profile simply won't qualify for indexing until it has real
-- content (see hasSubstantiveProfile in app/profile/[slug]/page.tsx).
--
-- HOW TO RUN (phpMyAdmin):
--   1. Run STEP 1 and STEP 2 and eyeball the rows. They are SELECTs only.
--   2. If the list looks right, run STEP 3 and STEP 4.
--   3. Re-run STEP 1/2 to confirm zero rows remain.
--   4. Redeploy (profiles are ISR/SSG, so the pages refresh on rebuild).
-- ═══════════════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────────────
-- STEP 1 — PREVIEW: descriptions that are scraper-error text (Pattern A)
-- ─────────────────────────────────────────────────────────────────────
SELECT id, slug, company_name, CHAR_LENGTH(description) AS len, description
  FROM submissions
 WHERE COALESCE(listing_mode, 'product') = 'company'
   AND description IS NOT NULL AND description <> ''
   AND (
        description REGEXP '(?i)(unable|failed|could ?n.?t|cannot) +(to +)?(extract|verify|access|retrieve|read|determine)'
     OR description REGEXP '(?i)(page|site|website|homepage|content) +(is +)?(blocked|unavailable|inaccessible|not available|empty)'
     OR description REGEXP '(?i)verification failed'
     OR description REGEXP '(?i)bot[- ]gated'
     OR description REGEXP '(?i)(security (checkpoint|challenge|service|measures)|browser verification|captcha)'
     OR description REGEXP '(?i)requires? javascript'
     OR description REGEXP '(?i)no (content|business information|text|information) (available|accessible)'
     OR description REGEXP '(?i)content (not available|unavailable)'
     OR description REGEXP '(?i)access (denied|forbidden)'
     OR description REGEXP '(?i)(limited|no) information available'
     OR description REGEXP '(?i)homepage returned empty'
   )
 ORDER BY company_name;


-- ─────────────────────────────────────────────────────────────────────
-- STEP 2 — PREVIEW: truncated-at-an-abbreviation fragments (Pattern B)
--
-- Detected generically, not by hardcoded slug: anything too short to be
-- prose, or a short string ending on a bare initial / known abbreviation.
-- ─────────────────────────────────────────────────────────────────────
SELECT id, slug, company_name, CHAR_LENGTH(description) AS len, description
  FROM submissions
 WHERE COALESCE(listing_mode, 'product') = 'company'
   AND description IS NOT NULL AND description <> ''
   AND (
        CHAR_LENGTH(description) < 25
     OR (CHAR_LENGTH(description) < 60
         AND description REGEXP '(^| )([A-Za-z]\\.)+$')
     OR (CHAR_LENGTH(description) < 60
         AND description REGEXP '(?i)(^| )(mr|mrs|ms|dr|prof|st|jr|sr|inc|llc|llp|ltd|plc|co|corp|gmbh|pty|pte)\\.$')
   )
 ORDER BY CHAR_LENGTH(description), company_name;


-- ─────────────────────────────────────────────────────────────────────
-- STEP 3 — FIX Pattern A. Clears description; keeps everything else.
-- ─────────────────────────────────────────────────────────────────────
UPDATE submissions
   SET description = NULL,
       updated_at  = NOW()
 WHERE COALESCE(listing_mode, 'product') = 'company'
   AND description IS NOT NULL AND description <> ''
   AND (
        description REGEXP '(?i)(unable|failed|could ?n.?t|cannot) +(to +)?(extract|verify|access|retrieve|read|determine)'
     OR description REGEXP '(?i)(page|site|website|homepage|content) +(is +)?(blocked|unavailable|inaccessible|not available|empty)'
     OR description REGEXP '(?i)verification failed'
     OR description REGEXP '(?i)bot[- ]gated'
     OR description REGEXP '(?i)(security (checkpoint|challenge|service|measures)|browser verification|captcha)'
     OR description REGEXP '(?i)requires? javascript'
     OR description REGEXP '(?i)no (content|business information|text|information) (available|accessible)'
     OR description REGEXP '(?i)content (not available|unavailable)'
     OR description REGEXP '(?i)access (denied|forbidden)'
     OR description REGEXP '(?i)(limited|no) information available'
     OR description REGEXP '(?i)homepage returned empty'
   );


-- ─────────────────────────────────────────────────────────────────────
-- STEP 4 — FIX Pattern B.
-- ─────────────────────────────────────────────────────────────────────
UPDATE submissions
   SET description = NULL,
       updated_at  = NOW()
 WHERE COALESCE(listing_mode, 'product') = 'company'
   AND description IS NOT NULL AND description <> ''
   AND (
        CHAR_LENGTH(description) < 25
     OR (CHAR_LENGTH(description) < 60
         AND description REGEXP '(^| )([A-Za-z]\\.)+$')
     OR (CHAR_LENGTH(description) < 60
         AND description REGEXP '(?i)(^| )(mr|mrs|ms|dr|prof|st|jr|sr|inc|llc|llp|ltd|plc|co|corp|gmbh|pty|pte)\\.$')
   );


-- ─────────────────────────────────────────────────────────────────────
-- STEP 5 — the SAME two patterns in the `tagline` column.
--
-- Taglines are derived from the description by the same buggy splitter, so
-- they carry the same damage. PREVIEW first, then uncomment the UPDATE.
-- The threshold is lower here because a real tagline is legitimately short.
-- ─────────────────────────────────────────────────────────────────────
SELECT id, slug, company_name, CHAR_LENGTH(tagline) AS len, tagline
  FROM submissions
 WHERE COALESCE(listing_mode, 'product') = 'company'
   AND tagline IS NOT NULL AND tagline <> ''
   AND (
        CHAR_LENGTH(tagline) < 15
     OR tagline REGEXP '(^| )([A-Za-z]\\.)+$'
     OR tagline REGEXP '(?i)(unable|failed) +(to +)?(extract|verify|access)'
     OR tagline REGEXP '(?i)(verification failed|bot[- ]gated|requires? javascript|no content available)'
   )
 ORDER BY CHAR_LENGTH(tagline), company_name;

-- UPDATE submissions
--    SET tagline = '', updated_at = NOW()
--  WHERE COALESCE(listing_mode, 'product') = 'company'
--    AND tagline IS NOT NULL AND tagline <> ''
--    AND (
--         CHAR_LENGTH(tagline) < 15
--      OR tagline REGEXP '(^| )([A-Za-z]\\.)+$'
--      OR tagline REGEXP '(?i)(unable|failed) +(to +)?(extract|verify|access)'
--      OR tagline REGEXP '(?i)(verification failed|bot[- ]gated|requires? javascript|no content available)'
--    );


-- ─────────────────────────────────────────────────────────────────────
-- STEP 6 — VERIFY. Both counts should be 0 after STEP 3 and STEP 4.
-- ─────────────────────────────────────────────────────────────────────
SELECT
  SUM(CASE WHEN description REGEXP '(?i)(verification failed|bot[- ]gated|requires? javascript|unable to (extract|verify|access))'
           THEN 1 ELSE 0 END) AS pattern_a_remaining,
  SUM(CASE WHEN CHAR_LENGTH(description) < 25 THEN 1 ELSE 0 END) AS pattern_b_remaining
  FROM submissions
 WHERE COALESCE(listing_mode, 'product') = 'company'
   AND description IS NOT NULL AND description <> '';
