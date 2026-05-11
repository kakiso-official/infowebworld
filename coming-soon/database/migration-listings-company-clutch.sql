-- ═══════════════════════════════════════════════════════════════════════════
--  Migration: Clutch.co-style fields for company listings
--  Created  : 2026-05-11 (Session 37)
--  Adds 9 optional columns to `submissions` for the new /profile/[slug] UI.
--  All DEFAULT NULL — safe to run live, no data loss, no row rewrites.
--
--  Run each ALTER TABLE in phpMyAdmin one at a time. If a column already
--  exists you'll get "Duplicate column name" — just skip that line.
--
--  After this migration, listing_mode='company' rows render the new
--  Clutch-style UI on /profile/[slug] with stat cards, pie charts,
--  awards row, and Pricing Snapshot section. Old company rows that
--  haven't been re-edited keep rendering — every new field is optional
--  and falls back gracefully when blank.
--
--  Product listings (listing_mode='product') are NOT affected — these
--  columns stay NULL on product rows, and the page never reads them.
-- ═══════════════════════════════════════════════════════════════════════════

-- "Min project size" stat card. Free text so "$10,000+" / "Contact us" both work.
ALTER TABLE submissions
  ADD COLUMN min_project_size VARCHAR(40) DEFAULT NULL
  COMMENT 'Pricing snapshot: min project size, e.g. "$10,000+"';

-- "Hourly rate" stat card. Free text for ranges + custom values.
ALTER TABLE submissions
  ADD COLUMN hourly_rate VARCHAR(60) DEFAULT NULL
  COMMENT 'Pricing snapshot: hourly rate, e.g. "$150 - $199 / hr"';

-- "Most Common Project Size" — drives the segmented range bar.
ALTER TABLE submissions
  ADD COLUMN common_project_size VARCHAR(60) DEFAULT NULL
  COMMENT 'Pricing snapshot: most common project size, e.g. "$50,000 - $199,999"';

-- "Watch our Video" inline link (YouTube / Vimeo / Loom URL).
ALTER TABLE submissions
  ADD COLUMN intro_video_url VARCHAR(500) DEFAULT NULL
  COMMENT 'Hero "Watch our Video" link';

-- Timezones the team operates in. JSON array of strings.
ALTER TABLE submissions
  ADD COLUMN timezones JSON DEFAULT NULL
  COMMENT 'Array of timezone strings (e.g. ["GMT-05:00 (Eastern)"])';

-- Service Lines pie chart input. Each row: {name, percentage}; sum = 100.
ALTER TABLE submissions
  ADD COLUMN service_lines JSON DEFAULT NULL
  COMMENT '[{name, percentage}] for the Services tab pie chart';

-- Focus tab pie chart input — segments by client size / vertical / etc.
ALTER TABLE submissions
  ADD COLUMN focus_breakdown JSON DEFAULT NULL
  COMMENT '[{name, percentage}] for the Focus tab pie chart';

-- Clients tab logo grid input.
ALTER TABLE submissions
  ADD COLUMN client_logos JSON DEFAULT NULL
  COMMENT '[{name, logoUrl?, url?}] for the Clients tab logo grid';

-- "What Clients Have Said" editorial paragraph (Pricing Snapshot block).
ALTER TABLE submissions
  ADD COLUMN clients_summary TEXT DEFAULT NULL
  COMMENT 'Editorial paragraph for the Pricing Snapshot block';

-- ═══════════════════════════════════════════════════════════════════════════
-- DONE. Verify with:
--   SELECT id, slug, min_project_size, hourly_rate, service_lines
--     FROM submissions WHERE listing_mode = 'company' LIMIT 5;
-- ═══════════════════════════════════════════════════════════════════════════
