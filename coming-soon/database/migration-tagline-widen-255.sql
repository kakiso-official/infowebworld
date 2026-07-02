-- migration-tagline-widen-255.sql
-- Widen submissions.tagline from VARCHAR(100) to VARCHAR(255).
--
-- WHY: the company + product listing forms allow up to 255 characters in the
-- tagline input, and the Gemini scraper emits longer value-prop lines, but the
-- column was VARCHAR(100). On cPanel's non-strict MySQL the surplus was
-- SILENTLY truncated on insert — e.g. the AWS company tagline was chopped
-- mid-word at exactly 100 chars: "...most comprehensive cloud p". Widening the
-- column stops the data loss for every future save / re-scrape.
--
-- NOTE: rows stored BEFORE this migration keep their already-truncated value;
-- the lost tail cannot be recovered here. Re-save (dashboard/admin edit) or
-- re-scrape those listings afterwards to repopulate the full tagline, then
-- redeploy (or hit the admin "Rebuild static page" button) so the static
-- /profile + /listing pages pick up the change.
--
-- Run once in phpMyAdmin.

ALTER TABLE `submissions` MODIFY `tagline` VARCHAR(255) NOT NULL;
    