-- Add ai_summary column to category_seo_content
-- Run in phpMyAdmin one statement at a time

ALTER TABLE category_seo_content
  ADD COLUMN ai_summary TEXT DEFAULT NULL AFTER rich_description;
