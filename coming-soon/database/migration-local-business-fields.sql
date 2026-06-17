-- ============================================================
-- InfoWebWorld - Local-business profile fields
--
-- Adds the Yelp-style data the local-business /profile page needs. EVERY
-- column is NULLable and only ever populated for listing_mode='company' rows
-- in the local-businesses sector — they stay NULL for every other sector, so
-- this is completely inert for IT/agencies/AI/etc. Run once in phpMyAdmin.
--
--   lb_price_range  '$'..'$$$$'
--   lb_hours        JSON [{ "day":"Mon", "time":"8:00 AM - 10:00 PM", "closed":false }]
--   lb_amenities    JSON ["takeout","delivery","credit_cards", ...] (slugs)
--   lb_menu         JSON [{ "name", "price", "description", "photo" }]
--   lb_photos       JSON ["https://...", ...] (gallery)
--   lb_videos       JSON [{ "url", "title" }]
--   lb_lat / lb_lng map coords (optional, geocoded later)
-- ============================================================

ALTER TABLE `submissions`
  ADD COLUMN `lb_price_range` VARCHAR(8)    NULL,
  ADD COLUMN `lb_hours`       JSON          NULL,
  ADD COLUMN `lb_amenities`   JSON          NULL,
  ADD COLUMN `lb_menu`        JSON          NULL,
  ADD COLUMN `lb_photos`      JSON          NULL,
  ADD COLUMN `lb_videos`      JSON          NULL,
  ADD COLUMN `lb_lat`         DECIMAL(10,7) NULL,
  ADD COLUMN `lb_lng`         DECIMAL(10,7) NULL;
