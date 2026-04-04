-- Migration: Add category_seo_content table for Gemini-generated SEO content
-- Run each statement one at a time in phpMyAdmin

CREATE TABLE IF NOT EXISTS category_seo_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id SMALLINT(5) UNSIGNED NOT NULL,
  rich_description TEXT DEFAULT NULL COMMENT '500-800 word unique description',
  buyers_guide JSON DEFAULT NULL COMMENT '{ features: [], questions: [], pitfalls: [], pricing_info: "" }',
  use_cases JSON DEFAULT NULL COMMENT '[{ title, description, icon }]',
  comparisons JSON DEFAULT NULL COMMENT '[{ vs_name, vs_slug, summary, differences: [] }]',
  long_tail_keywords JSON DEFAULT NULL COMMENT '{ by_industry: [], by_size: [], by_need: [] }',
  complementary_categories JSON DEFAULT NULL COMMENT '[category_slug, ...]',
  extended_faq JSON DEFAULT NULL COMMENT '[{ q, a }, ...] 10-15 questions',
  generated_at DATETIME DEFAULT NULL,
  model_version VARCHAR(50) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_category (category_id),
  CONSTRAINT fk_seo_content_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index for fast lookups
CREATE INDEX idx_seo_content_category ON category_seo_content(category_id);
