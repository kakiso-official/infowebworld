# xlsx-60 seed — run order & notes

60 companies from `InfoWebWorld-Companies-by-Category.xlsx`, seeded with **real, web-verified data**.
- **10 AI/ML** → `listing_mode='product'`, fully enriched (pricing, features, integrations, FAQs, pros/cons) + website screenshots → render at `/company/[slug]`.
- **40** (Software & SaaS, IT Services, Startups, Pro Services) → `listing_mode='company'` (Clutch-style) → `/profile/[slug]`.
- **10 Local Businesses** → `listing_mode='company'` + `lb_*` fields (Yelp design) → `/profile/[slug]`.

All seeded **`status='pending'`, `user_id=NULL`, `payment_status='unpaid'`** (unclaimed + claimable). Nothing is live until you run the go-live step.

No new migration is required — every column used already exists (S34/S35 product fields, the company "Clutch" fields, and the `lb_*` fields are all in `submissions`).

## Files
| File | What it does |
|---|---|
| `seed-xlsx-aiml-products.sql` | INSERT 10 AI/ML products (pending) |
| `seed-xlsx-companies.sql` | INSERT 40 company listings (pending) |
| `seed-xlsx-local-businesses.sql` | INSERT 10 local businesses + `lb_*` (pending) |
| `screenshots-xlsx-aiml.sql` | UPDATE the 10 products with 2 real website screenshots each (already captured + uploaded to the file store) |
| `golive-xlsx.sql` | Flip all 60 `pending → active` (scoped to these slugs + `user_id IS NULL`) |

Every file is **re-runnable** (the seeds `DELETE` their own unclaimed slugs first; go-live/screenshots are idempotent).

## Run order (phpMyAdmin → SQL tab)
1. *(Optional pre-check — see below)* confirm none of these 60 slugs already exist.
2. Run **`seed-xlsx-aiml-products.sql`**, **`seed-xlsx-companies.sql`**, **`seed-xlsx-local-businesses.sql`** (any order).
3. Run **`screenshots-xlsx-aiml.sql`** (attaches the AI/ML screenshots; works while pending).
4. **Review** in `/iww-hq/submissions` — all 60 are `pending`. ✨ Gemini-fill / edit / re-category any as you like.
5. Run **`golive-xlsx.sql`** to publish.
6. **Redeploy on Vercel.** The 50 `/profile/[slug]` pages are SSG (`dynamicParams=false`), so they only appear after a build. (The 10 AI/ML `/company/[slug]` pages are dynamic and appear immediately, but redeploy covers everything.)

## Verification queries
```sql
-- After step 2 (expect 60 pending: 10 product + 50 company):
SELECT listing_mode, status, COUNT(*) FROM submissions
 WHERE slug IN (/* see golive-xlsx.sql slug list */) GROUP BY listing_mode, status;

-- After step 3 (expect 2 screenshots on each of the 10 products):
SELECT slug, JSON_LENGTH(screenshots) AS shots FROM submissions
 WHERE listing_mode='product' AND slug IN ('quillbot','bardeen','thoughtspot','teachable','be-my-eyes','tidio','botpress','flutterflow','lindy','magicschool');

-- After step 5 (expect 60 active):
SELECT listing_mode, COUNT(*) FROM submissions
 WHERE status='active' AND slug IN (/* see golive-xlsx.sql slug list */) GROUP BY listing_mode;
```

## Optional pre-check (generic slugs)
A few slugs are short/generic (`gap`, `trio`, `maven`, `midas`). The seeds only delete **unclaimed** rows, so they can't clobber a real user's listing — but if one of these already exists you'd get two rows with the same slug. Quick check before seeding:
```sql
SELECT slug, listing_mode, status, user_id FROM submissions
 WHERE slug IN ('gap','trio','maven','midas','first','pendo','aptos','watershed');
-- Expect 0 rows. If any return, tell me and I'll re-slug that one.
```

## Honesty notes (verified during research — flagged, not hidden)
- **Acquired / rebranded** (data reflects the brand; their site may now redirect to the acquirer — the "Visit website" link will follow):
  - **Mutual Mobile** → acquired by Grid Dynamics (2022); **Pachama** → acquired by Carbon Direct (Nov 2025); **Marcum** → merged into CBIZ (Nov 2024); **Bill.com** now brands as **BILL**.
- **Maven** is filed under `k-12-edtech-startups` (per the spreadsheet) but is actually an **adult cohort-course** platform — its description says so accurately.
- **Headcount bands** for a few large/private firms (Sisense, Sage Intacct, WSP, Watershed) are best-available 2026 estimates mapped to the nearest band.
- **Be My Eyes** enterprise pricing is contact-only (no public tiers); **Lindy** has no free plan (7-day trial).
- Awards/clients were included **only where verified**; otherwise left empty (they render as graceful empty-states).

## Regenerating (if you want changes)
- Edit the research JSON in `scripts/research-xlsx/*.json`, then: `node scripts/gen-xlsx-seeds.mjs` (re-emits the 4 SQL files).
- Re-validate: `node scripts/research-xlsx/_validate.mjs` and `node scripts/research-xlsx/_check-sql.mjs`.
- Re-capture screenshots: `node scripts/capture-xlsx-aiml-screenshots.mjs`.
