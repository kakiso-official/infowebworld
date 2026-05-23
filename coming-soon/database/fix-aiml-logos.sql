-- ─────────────────────────────────────────────────────────────────────────
-- Swap broken Clearbit logo URLs → Google s2 favicon URLs for every
-- already-seeded AI/ML listing. Idempotent — only affects rows where
-- logo_url currently points at logo.clearbit.com.
-- ─────────────────────────────────────────────────────────────────────────
UPDATE submissions
   SET logo_url = CONCAT(
         'https://www.google.com/s2/favicons?domain=',
         SUBSTRING_INDEX(logo_url, '/', -1),
         '&sz=256'
       )
 WHERE logo_url LIKE 'https://logo.clearbit.com/%';

-- Verify (read-only). Expect 0 rows with Clearbit and N rows with s2:
-- SELECT
--   SUM(logo_url LIKE 'https://logo.clearbit.com/%')   AS still_clearbit,
--   SUM(logo_url LIKE 'https://www.google.com/s2/favicons%') AS now_s2,
--   COUNT(*) AS total
-- FROM submissions;
