-- ============================================================
-- InfoWebWorld — AI & ML Taxonomy v3 Migration
-- Rebuilds the AI & ML sector with 1,392 hierarchical categories
-- across 4 nested levels (DB L2..L5 under existing 'ai-ml' L1).
-- Drops the flat listing_types rows for AI&ML.
--
-- Source: AI ML - hierarchy v7 Clau  final.xlsx
-- Run each section IN ORDER in phpMyAdmin.
-- ============================================================

-- ═══ Section A: Safety ═════════════════════════════════════════
SET FOREIGN_KEY_CHECKS = 0;

-- ═══ Section B: Disconnect existing AI&ML submissions ═════════
-- Listings are PRESERVED. We null out category_id + listing_type_id
-- here, then re-attach them in Section F (appended at the bottom).
UPDATE submissions
   SET category_id = NULL, listing_type_id = NULL
 WHERE category_id IN (
   SELECT id FROM (
     SELECT c.id FROM categories c
      LEFT JOIN categories p   ON p.id = c.parent_id
      LEFT JOIN categories gp  ON gp.id = p.parent_id
      LEFT JOIN categories ggp ON ggp.id = gp.parent_id
      WHERE c.parent_id   = (SELECT id FROM categories WHERE slug='ai-ml' AND level=1)
         OR p.parent_id  = (SELECT id FROM categories WHERE slug='ai-ml' AND level=1)
         OR gp.parent_id = (SELECT id FROM categories WHERE slug='ai-ml' AND level=1)
         OR ggp.parent_id = (SELECT id FROM categories WHERE slug='ai-ml' AND level=1)
   ) AS aiml_ids
 );

-- ═══ Section C: Delete old AI&ML dependents + categories ══════
-- Order: SEO content → listing_types → child cats → parent cats.

-- C.1: delete category_seo_content for old AI&ML categories
DELETE sc FROM category_seo_content sc
  JOIN categories c ON c.id = sc.category_id
  LEFT JOIN categories p  ON p.id = c.parent_id
  LEFT JOIN categories gp ON gp.id = p.parent_id
 WHERE c.parent_id  = (SELECT id FROM categories WHERE slug='ai-ml' AND level=1)
    OR p.parent_id  = (SELECT id FROM categories WHERE slug='ai-ml' AND level=1)
    OR gp.parent_id = (SELECT id FROM categories WHERE slug='ai-ml' AND level=1);

-- C.2: delete listing_types tied to old AI&ML categories
DELETE lt FROM listing_types lt
  JOIN categories c ON c.id = lt.category_id
  LEFT JOIN categories p ON p.id = c.parent_id
 WHERE c.parent_id = (SELECT id FROM categories WHERE slug='ai-ml' AND level=1)
    OR p.parent_id = (SELECT id FROM categories WHERE slug='ai-ml' AND level=1);

-- C.3: delete L3 categories under AI&ML (JOIN-based to dodge MySQL #1093)
DELETE c FROM categories c
  JOIN categories p  ON p.id  = c.parent_id
  JOIN categories gp ON gp.id = p.parent_id
 WHERE c.level = 3 AND gp.slug = 'ai-ml' AND gp.level = 1;

-- C.4: delete L2 categories under AI&ML — root 'ai-ml' L1 stays. JOIN-based.
DELETE c FROM categories c
  JOIN categories p ON p.id = c.parent_id
 WHERE c.level = 2 AND p.slug = 'ai-ml' AND p.level = 1;

-- ═══ Section D.1: Insert 11 new L2 categories ═══
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Core & Models', 'ai-core-models', 2, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-ml' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business & Marketing', 'business-marketing', 2, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-ml' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Content & Creative', 'content-creative', 2, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-ml' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Customer & Support', 'customer-support', 2, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-ml' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Development & Technical', 'development-technical', 2, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-ml' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Education & Research', 'education-research', 2, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ai-ml' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Life & Personal', 'life-personal', 2, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'ai-ml' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Personal', 'personal', 2, id, '#8B5CF6', 1, 1, 1, 80
  FROM categories WHERE slug = 'ai-ml' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Productivity & Workflow', 'productivity-workflow', 2, id, '#8B5CF6', 1, 1, 1, 90
  FROM categories WHERE slug = 'ai-ml' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Random', 'random', 2, id, '#8B5CF6', 1, 1, 1, 100
  FROM categories WHERE slug = 'ai-ml' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Work', 'work', 2, id, '#8B5CF6', 1, 1, 1, 110
  FROM categories WHERE slug = 'ai-ml' AND level = 1 LIMIT 1;

-- ═══ Section D.2: Insert 110 new L3 categories ═══
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Agents', 'ai-agents', 3, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-core-models' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Detection & Anti-Detection', 'ai-detection-anti-detection', 3, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-core-models' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Image & Video Models', 'image-video-models', 3, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-core-models' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'LLMs & Chat Assistants', 'llms-chat-assistants', 3, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-core-models' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Model Training & Fine-tuning', 'model-training-fine-tuning', 3, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-core-models' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Prompts & GPTs', 'prompts-gpts', 3, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ai-core-models' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Analytics & BI', 'analytics-bi', 3, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'business-marketing' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'E-commerce', 'e-commerce', 3, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'business-marketing' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Finance & Accounting', 'finance-accounting', 3, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'business-marketing' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HR & Recruiting', 'hr-recruiting', 3, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'business-marketing' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Legal & Compliance', 'legal-compliance', 3, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'business-marketing' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketing & Advertising', 'marketing-advertising', 3, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'business-marketing' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'News & Media Tools', 'news-media-tools', 3, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'business-marketing' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate & Property', 'real-estate-property', 3, id, '#8B5CF6', 1, 1, 1, 80
  FROM categories WHERE slug = 'business-marketing' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales & CRM', 'sales-crm', 3, id, '#8B5CF6', 1, 1, 1, 90
  FROM categories WHERE slug = 'business-marketing' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SEO & Growth', 'seo-growth', 3, id, '#8B5CF6', 1, 1, 1, 100
  FROM categories WHERE slug = 'business-marketing' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Social Media', 'social-media', 3, id, '#8B5CF6', 1, 1, 1, 110
  FROM categories WHERE slug = 'business-marketing' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Art', 'art', 3, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'content-creative' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Audio & Music', 'audio-music', 3, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'content-creative' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brainstorming', 'brainstorming', 3, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'content-creative' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Design & 3D', 'design-3d', 3, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'content-creative' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Image Editing & Enhancement', 'image-editing-enhancement', 3, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'content-creative' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Image Generation', 'image-generation', 3, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'content-creative' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Images', 'images', 3, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'content-creative' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Multimedia', 'multimedia', 3, id, '#8B5CF6', 1, 1, 1, 80
  FROM categories WHERE slug = 'content-creative' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Software', 'software', 3, id, '#8B5CF6', 1, 1, 1, 90
  FROM categories WHERE slug = 'content-creative' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Text', 'text', 3, id, '#8B5CF6', 1, 1, 1, 100
  FROM categories WHERE slug = 'content-creative' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video Editing & Post', 'video-editing-post', 3, id, '#8B5CF6', 1, 1, 1, 110
  FROM categories WHERE slug = 'content-creative' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video Generation', 'video-generation', 3, id, '#8B5CF6', 1, 1, 1, 120
  FROM categories WHERE slug = 'content-creative' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Writing & Copywriting', 'writing-copywriting', 3, id, '#8B5CF6', 1, 1, 1, 130
  FROM categories WHERE slug = 'content-creative' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Avatars & Characters', 'ai-avatars-characters', 3, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'customer-support' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Chatbots & Conversational', 'chatbots-conversational', 3, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'customer-support' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'APIs & Infrastructure', 'apis-infrastructure', 3, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'development-technical' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'App & Site Builders', 'app-site-builders', 3, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'development-technical' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Coding Assistants', 'coding-assistants', 3, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'development-technical' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cybersecurity', 'cybersecurity', 3, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'development-technical' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data & ML', 'data-ml', 3, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'development-technical' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Course Creation', 'course-creation', 3, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'education-research' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Language Learning', 'language-learning', 3, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'education-research' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Learning & Study Tools', 'learning-study-tools', 3, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'education-research' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Research & Academic', 'research-academic', 3, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'education-research' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Accessibility & Assistive Tech', 'accessibility-assistive-tech', 3, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'life-personal' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Astrology & Spiritual', 'astrology-spiritual', 3, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'life-personal' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dating & Relationships', 'dating-relationships', 3, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'life-personal' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fashion & Beauty', 'fashion-beauty', 3, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'life-personal' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Games & Entertainment', 'games-entertainment', 3, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'life-personal' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Health & Wellness', 'health-wellness', 3, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'life-personal' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Home & Lifestyle', 'home-lifestyle', 3, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'life-personal' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Travel & Hospitality', 'travel-hospitality', 3, id, '#8B5CF6', 1, 1, 1, 80
  FROM categories WHERE slug = 'life-personal' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Divination', 'divination', 3, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'personal' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Meditation', 'meditation', 3, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'personal' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Religion', 'religion', 3, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'personal' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Religious images', 'religious-images', 3, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'personal' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Spiritual guidance', 'spiritual-guidance', 3, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'personal' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Yoga guidance', 'yoga-guidance', 3, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'personal' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Community', 'community', 3, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'personal' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Food', 'food', 3, id, '#8B5CF6', 1, 1, 1, 80
  FROM categories WHERE slug = 'personal' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Learning', 'learning', 3, id, '#8B5CF6', 1, 1, 1, 90
  FROM categories WHERE slug = 'personal' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Life coaching', 'life-coaching', 3, id, '#8B5CF6', 1, 1, 1, 100
  FROM categories WHERE slug = 'personal' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Personal branding', 'personal-branding', 3, id, '#8B5CF6', 1, 1, 1, 110
  FROM categories WHERE slug = 'personal' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Personal development', 'personal-development', 3, id, '#8B5CF6', 1, 1, 1, 120
  FROM categories WHERE slug = 'personal' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pets', 'pets', 3, id, '#8B5CF6', 1, 1, 1, 130
  FROM categories WHERE slug = 'personal' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Shopping', 'shopping', 3, id, '#8B5CF6', 1, 1, 1, 140
  FROM categories WHERE slug = 'personal' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sports', 'sports', 3, id, '#8B5CF6', 1, 1, 1, 150
  FROM categories WHERE slug = 'personal' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wealth', 'wealth', 3, id, '#8B5CF6', 1, 1, 1, 160
  FROM categories WHERE slug = 'personal' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Automation & Integration', 'automation-integration', 3, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'productivity-workflow' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Documents & Files', 'documents-files', 3, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'productivity-workflow' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Knowledge Management', 'knowledge-management', 3, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'productivity-workflow' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Personal Productivity', 'personal-productivity', 3, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'productivity-workflow' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Remote Work & Team', 'remote-work-team', 3, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'productivity-workflow' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Search & Discovery', 'search-discovery', 3, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'productivity-workflow' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Artistic guidance', 'artistic-guidance', 3, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'random' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Conversation support', 'conversation-support', 3, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'random' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Conversational management', 'conversational-management', 3, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'random' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'DIY', 'diy', 3, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'random' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'English communication improvement', 'english-communication-improvement', 3, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'random' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Game strategies', 'game-strategies', 3, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'random' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Gaming coach', 'gaming-coach', 3, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'random' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Gardening', 'gardening', 3, id, '#8B5CF6', 1, 1, 1, 80
  FROM categories WHERE slug = 'random' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Horror images', 'horror-images', 3, id, '#8B5CF6', 1, 1, 1, 90
  FROM categories WHERE slug = 'random' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Immigration advice', 'immigration-advice', 3, id, '#8B5CF6', 1, 1, 1, 100
  FROM categories WHERE slug = 'random' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Philosophical conversations', 'philosophical-conversations', 3, id, '#8B5CF6', 1, 1, 1, 110
  FROM categories WHERE slug = 'random' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Questions generation', 'questions-generation', 3, id, '#8B5CF6', 1, 1, 1, 120
  FROM categories WHERE slug = 'random' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Speeches', 'speeches', 3, id, '#8B5CF6', 1, 1, 1, 130
  FROM categories WHERE slug = 'random' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Stoic advice', 'stoic-advice', 3, id, '#8B5CF6', 1, 1, 1, 140
  FROM categories WHERE slug = 'random' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Storytelling game', 'storytelling-game', 3, id, '#8B5CF6', 1, 1, 1, 150
  FROM categories WHERE slug = 'random' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Strategic advice', 'strategic-advice', 3, id, '#8B5CF6', 1, 1, 1, 160
  FROM categories WHERE slug = 'random' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tech insights', 'tech-insights', 3, id, '#8B5CF6', 1, 1, 1, 170
  FROM categories WHERE slug = 'random' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vehicle diagnosis', 'vehicle-diagnosis', 3, id, '#8B5CF6', 1, 1, 1, 180
  FROM categories WHERE slug = 'random' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Workout planning', 'workout-planning', 3, id, '#8B5CF6', 1, 1, 1, 190
  FROM categories WHERE slug = 'random' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business innovation', 'business-innovation', 3, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'work' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business strategy', 'business-strategy', 3, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'work' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Calls', 'calls', 3, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'work' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data', 'data', 3, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'work' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Enterprise', 'enterprise', 3, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'work' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Finance', 'finance', 3, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'work' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HR', 'hr', 3, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'work' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Industries', 'industries', 3, id, '#8B5CF6', 1, 1, 1, 80
  FROM categories WHERE slug = 'work' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Legal', 'legal', 3, id, '#8B5CF6', 1, 1, 1, 90
  FROM categories WHERE slug = 'work' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Management', 'management', 3, id, '#8B5CF6', 1, 1, 1, 100
  FROM categories WHERE slug = 'work' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketing', 'marketing', 3, id, '#8B5CF6', 1, 1, 1, 110
  FROM categories WHERE slug = 'work' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Meetings', 'meetings', 3, id, '#8B5CF6', 1, 1, 1, 120
  FROM categories WHERE slug = 'work' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Networking', 'networking', 3, id, '#8B5CF6', 1, 1, 1, 130
  FROM categories WHERE slug = 'work' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Product management', 'product-management', 3, id, '#8B5CF6', 1, 1, 1, 140
  FROM categories WHERE slug = 'work' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales', 'sales', 3, id, '#8B5CF6', 1, 1, 1, 150
  FROM categories WHERE slug = 'work' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Startups', 'startups', 3, id, '#8B5CF6', 1, 1, 1, 160
  FROM categories WHERE slug = 'work' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tech support', 'tech-support', 3, id, '#8B5CF6', 1, 1, 1, 170
  FROM categories WHERE slug = 'work' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Virtual employees', 'virtual-employees', 3, id, '#8B5CF6', 1, 1, 1, 180
  FROM categories WHERE slug = 'work' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Career', 'career', 3, id, '#8B5CF6', 1, 1, 1, 190
  FROM categories WHERE slug = 'work' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Productivity', 'productivity', 3, id, '#8B5CF6', 1, 1, 1, 200
  FROM categories WHERE slug = 'work' AND level = 2 LIMIT 1;

-- ═══ Section D.3: Insert 429 new L4 categories ═══
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Autonomous Agents', 'autonomous-agents', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-agents' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Personal Life Agents', 'personal-life-agents', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-agents' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Research Agents', 'research-agents', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-agents' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sales & Marketing Agents', 'sales-marketing-agents', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-agents' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Humanizers', 'ai-humanizers', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-detection-anti-detection' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Image & Deepfake Detection', 'ai-image-deepfake-detection', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-detection-anti-detection' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Text Detection', 'ai-text-detection', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-detection-anti-detection' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Image Model Playgrounds', 'image-model-playgrounds', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'image-video-models' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video Model Playgrounds', 'video-model-playgrounds', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'image-video-models' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'General Chat Assistants', 'general-chat-assistants', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'llms-chat-assistants' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Large Language Models', 'large-language-models', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'llms-chat-assistants' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Reasoning Models', 'reasoning-models', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'llms-chat-assistants' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Uncensored / Open Models', 'uncensored-open-models', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'llms-chat-assistants' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fine-tuning Platforms', 'fine-tuning-platforms', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'model-training-fine-tuning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Training Data Tools', 'training-data-tools', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'model-training-fine-tuning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'GPTs & Custom Assistants', 'gpts-custom-assistants', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'prompts-gpts' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Prompt Libraries', 'prompt-libraries', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'prompts-gpts' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Prompt Optimization', 'prompt-optimization', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'prompts-gpts' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Business Intelligence', 'ai-business-intelligence', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'analytics-bi' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Data Visualization', 'ai-data-visualization', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'analytics-bi' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Deep Learning Platforms', 'ai-deep-learning-platforms', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'analytics-bi' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Predictive Analytics', 'ai-predictive-analytics', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'analytics-bi' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Inventory & Ops', 'ai-inventory-ops', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'e-commerce' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Product Optimization', 'ai-product-optimization', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'e-commerce' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Store Builders', 'ai-store-builders', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'e-commerce' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Tools for Shopify', 'ai-tools-for-shopify', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'e-commerce' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Tools for WooCommerce & WordPress', 'ai-tools-for-woocommerce-wordpress', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'e-commerce' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Accounting & Bookkeeping', 'ai-accounting-bookkeeping', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'finance-accounting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Crypto & Blockchain', 'ai-crypto-blockchain', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'finance-accounting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Financial Planning', 'ai-financial-planning', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'finance-accounting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Investing & Trading', 'ai-investing-trading', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'finance-accounting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Tax & Compliance', 'ai-tax-compliance', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'finance-accounting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Employee Experience', 'ai-employee-experience', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'hr-recruiting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Interview Tools', 'ai-interview-tools', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'hr-recruiting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Job Search Tools', 'ai-job-search-tools', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'hr-recruiting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Recruiting & ATS', 'ai-recruiting-ats', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'hr-recruiting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Compliance & Privacy', 'ai-compliance-privacy', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'legal-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Contract Tools', 'ai-contract-tools', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'legal-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Legal Research', 'ai-legal-research', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'legal-compliance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Ad Generators', 'ai-ad-generators', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'marketing-advertising' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Brainstorming & Ideas', 'ai-brainstorming-ideas', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'marketing-advertising' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Content Marketing', 'ai-content-marketing', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'marketing-advertising' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Email Marketing', 'ai-email-marketing', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'marketing-advertising' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Influencer & PR', 'ai-influencer-pr', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'marketing-advertising' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Market Research', 'ai-market-research', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'marketing-advertising' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Newsrooms', 'ai-newsrooms', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'news-media-tools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Publishing', 'ai-publishing', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'news-media-tools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Property Visuals', 'ai-property-visuals', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'real-estate-property' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Real Estate Agents', 'ai-real-estate-agents', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'real-estate-property' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI CRM Tools', 'ai-crm-tools', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'sales-crm' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Lead Generation', 'ai-lead-generation', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'sales-crm' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Sales Intelligence', 'ai-sales-intelligence', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'sales-crm' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Sales Outreach', 'ai-sales-outreach', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'sales-crm' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Testimonials & Feedback', 'ai-testimonials-feedback', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'sales-crm' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Voice Sales Agents', 'ai-voice-sales-agents', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'sales-crm' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI GEO / Answer Engine Optimization', 'ai-geo-answer-engine-optimization', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'seo-growth' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Landing Pages', 'ai-landing-pages', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'seo-growth' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI SEO Tools', 'ai-seo-tools', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'seo-growth' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Social Analytics', 'ai-social-analytics', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'social-media' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Social Content Creation', 'ai-social-content-creation', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'social-media' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Social Media Management', 'ai-social-media-management', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'social-media' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Tools for Instagram', 'ai-tools-for-instagram', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'social-media' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Tools for LinkedIn', 'ai-tools-for-linkedin', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'social-media' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Tools for TikTok', 'ai-tools-for-tiktok', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'social-media' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Tools for X (Twitter)', 'ai-tools-for-x-twitter', 4, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'social-media' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Tools for YouTube', 'ai-tools-for-youtube', 4, id, '#8B5CF6', 1, 1, 1, 80
  FROM categories WHERE slug = 'social-media' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Anime', 'anime', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'art' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Architecture', 'architecture', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'art' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Artwork', 'artwork', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'art' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Paintings', 'paintings', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'art' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Photography', 'photography', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'art' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sculptures', 'sculptures', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'art' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Audio Editing', 'ai-audio-editing', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'audio-music' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Music Generators', 'ai-music-generators', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'audio-music' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Podcasting', 'ai-podcasting', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'audio-music' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Transcription & STT', 'ai-transcription-stt', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'audio-music' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Voice & TTS', 'ai-voice-tts', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'audio-music' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Voice Cloning', 'ai-voice-cloning', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'audio-music' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Audio enhancement', 'audio-enhancement', 4, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'audio-music' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Audio guides', 'audio-guides', 4, id, '#8B5CF6', 1, 1, 1, 80
  FROM categories WHERE slug = 'audio-music' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sound effects', 'sound-effects', 4, id, '#8B5CF6', 1, 1, 1, 90
  FROM categories WHERE slug = 'audio-music' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Voice', 'voice', 4, id, '#8B5CF6', 1, 1, 1, 100
  FROM categories WHERE slug = 'audio-music' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brainstorming facilitation', 'brainstorming-facilitation', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'brainstorming' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brainstorming guidance', 'brainstorming-guidance', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'brainstorming' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Content brainstorming', 'content-brainstorming', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'brainstorming' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Idea enhancement', 'idea-enhancement', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'brainstorming' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Interactive brainstorming', 'interactive-brainstorming', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'brainstorming' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Names', 'names', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'brainstorming' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Project brainstorming', 'project-brainstorming', 4, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'brainstorming' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Visual brainstorming', 'visual-brainstorming', 4, id, '#8B5CF6', 1, 1, 1, 80
  FROM categories WHERE slug = 'brainstorming' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '2D to 3D image conversion', '2d-to-3d-image-conversion', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'design-3d' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '3D characters', '3d-characters', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'design-3d' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '3D images', '3d-images', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'design-3d' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '3D objects', '3d-objects', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'design-3d' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '3D printing', '3d-printing', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'design-3d' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI 3D Model Generators', 'ai-3d-model-generators', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'design-3d' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI 3D Worlds & Simulation', 'ai-3d-worlds-simulation', 4, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'design-3d' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Graphic Design', 'ai-graphic-design', 4, id, '#8B5CF6', 1, 1, 1, 80
  FROM categories WHERE slug = 'design-3d' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Presentations', 'ai-presentations', 4, id, '#8B5CF6', 1, 1, 1, 90
  FROM categories WHERE slug = 'design-3d' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI UI/UX Design', 'ai-ui-ux-design', 4, id, '#8B5CF6', 1, 1, 1, 100
  FROM categories WHERE slug = 'design-3d' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Circuit design', 'circuit-design', 4, id, '#8B5CF6', 1, 1, 1, 110
  FROM categories WHERE slug = 'design-3d' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Design ideas', 'design-ideas', 4, id, '#8B5CF6', 1, 1, 1, 120
  FROM categories WHERE slug = 'design-3d' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Design thinking', 'design-thinking', 4, id, '#8B5CF6', 1, 1, 1, 130
  FROM categories WHERE slug = 'design-3d' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fashion design', 'fashion-design', 4, id, '#8B5CF6', 1, 1, 1, 140
  FROM categories WHERE slug = 'design-3d' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Product design', 'product-design', 4, id, '#8B5CF6', 1, 1, 1, 150
  FROM categories WHERE slug = 'design-3d' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'UI design', 'ui-design', 4, id, '#8B5CF6', 1, 1, 1, 160
  FROM categories WHERE slug = 'design-3d' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'UX design', 'ux-design', 4, id, '#8B5CF6', 1, 1, 1, 170
  FROM categories WHERE slug = 'design-3d' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI background remover', 'ai-background-remover', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'image-editing-enhancement' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI background replacer', 'ai-background-replacer', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'image-editing-enhancement' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI blur background tool', 'ai-blur-background-tool', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'image-editing-enhancement' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI transparent background maker', 'ai-transparent-background-maker', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'image-editing-enhancement' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Face Swap & Deepfake', 'ai-face-swap-deepfake', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'image-editing-enhancement' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Image Analysis & Recognition', 'ai-image-analysis-recognition', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'image-editing-enhancement' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Image Manipulation', 'ai-image-manipulation', 4, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'image-editing-enhancement' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Image Upscalers', 'ai-image-upscalers', 4, id, '#8B5CF6', 1, 1, 1, 80
  FROM categories WHERE slug = 'image-editing-enhancement' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Object & Face Tools', 'ai-object-face-tools', 4, id, '#8B5CF6', 1, 1, 1, 90
  FROM categories WHERE slug = 'image-editing-enhancement' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Photo Editors', 'ai-photo-editors', 4, id, '#8B5CF6', 1, 1, 1, 100
  FROM categories WHERE slug = 'image-editing-enhancement' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Background Generators', 'ai-background-generators', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'image-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Fashion & Apparel', 'ai-fashion-apparel', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'image-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Headshot & Avatar', 'ai-headshot-avatar', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'image-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Icon & Font Generators', 'ai-icon-font-generators', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'image-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Interior & Architecture', 'ai-interior-architecture', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'image-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Logo & Brand Design', 'ai-logo-brand-design', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'image-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Marketing Visuals', 'ai-marketing-visuals', 4, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'image-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Meme & Fun Generators', 'ai-meme-fun-generators', 4, id, '#8B5CF6', 1, 1, 1, 80
  FROM categories WHERE slug = 'image-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Product Photography', 'ai-product-photography', 4, id, '#8B5CF6', 1, 1, 1, 90
  FROM categories WHERE slug = 'image-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI QR Code & Visual Codes', 'ai-qr-code-visual-codes', 4, id, '#8B5CF6', 1, 1, 1, 100
  FROM categories WHERE slug = 'image-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI SVG & Vector Graphics', 'ai-svg-vector-graphics', 4, id, '#8B5CF6', 1, 1, 1, 110
  FROM categories WHERE slug = 'image-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Text-to-Image Generators', 'text-to-image-generators', 4, id, '#8B5CF6', 1, 1, 1, 120
  FROM categories WHERE slug = 'image-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Abstract art', 'abstract-art', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Avatars', 'avatars', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bulk images', 'bulk-images', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Car images', 'car-images', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Character images', 'character-images', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Coloring pages', 'coloring-pages', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cyberpunk images', 'cyberpunk-images', 4, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fantasy images', 'fantasy-images', 4, id, '#8B5CF6', 1, 1, 1, 80
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Flags', 'flags', 4, id, '#8B5CF6', 1, 1, 1, 90
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Food images', 'food-images', 4, id, '#8B5CF6', 1, 1, 1, 100
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Funny images', 'funny-images', 4, id, '#8B5CF6', 1, 1, 1, 110
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Futuristic images', 'futuristic-images', 4, id, '#8B5CF6', 1, 1, 1, 120
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Glass art', 'glass-art', 4, id, '#8B5CF6', 1, 1, 1, 130
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Graffiti images', 'graffiti-images', 4, id, '#8B5CF6', 1, 1, 1, 140
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Historical images', 'historical-images', 4, id, '#8B5CF6', 1, 1, 1, 150
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Icons', 'icons', 4, id, '#8B5CF6', 1, 1, 1, 160
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Illustrations', 'illustrations', 4, id, '#8B5CF6', 1, 1, 1, 170
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Image analysis', 'image-analysis', 4, id, '#8B5CF6', 1, 1, 1, 180
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Image editing', 'image-editing', 4, id, '#8B5CF6', 1, 1, 1, 190
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Image organization', 'image-organization', 4, id, '#8B5CF6', 1, 1, 1, 200
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Image prompts', 'image-prompts', 4, id, '#8B5CF6', 1, 1, 1, 210
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Line art', 'line-art', 4, id, '#8B5CF6', 1, 1, 1, 220
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Miniature art', 'miniature-art', 4, id, '#8B5CF6', 1, 1, 1, 230
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Nature images', 'nature-images', 4, id, '#8B5CF6', 1, 1, 1, 240
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Panoramic images', 'panoramic-images', 4, id, '#8B5CF6', 1, 1, 1, 250
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Paper art', 'paper-art', 4, id, '#8B5CF6', 1, 1, 1, 260
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pattern images', 'pattern-images', 4, id, '#8B5CF6', 1, 1, 1, 270
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'People images', 'people-images', 4, id, '#8B5CF6', 1, 1, 1, 280
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Photo sharing', 'photo-sharing', 4, id, '#8B5CF6', 1, 1, 1, 290
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Photorealistic images', 'photorealistic-images', 4, id, '#8B5CF6', 1, 1, 1, 300
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pokemon images', 'pokemon-images', 4, id, '#8B5CF6', 1, 1, 1, 310
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Portraits', 'portraits', 4, id, '#8B5CF6', 1, 1, 1, 320
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Posters', 'posters', 4, id, '#8B5CF6', 1, 1, 1, 330
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Product images', 'product-images', 4, id, '#8B5CF6', 1, 1, 1, 340
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Retro images', 'retro-images', 4, id, '#8B5CF6', 1, 1, 1, 350
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Romantic images', 'romantic-images', 4, id, '#8B5CF6', 1, 1, 1, 360
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sketch to image', 'sketch-to-image', 4, id, '#8B5CF6', 1, 1, 1, 370
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sketches', 'sketches', 4, id, '#8B5CF6', 1, 1, 1, 380
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Space images', 'space-images', 4, id, '#8B5CF6', 1, 1, 1, 390
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Spooky images', 'spooky-images', 4, id, '#8B5CF6', 1, 1, 1, 400
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Stickers', 'stickers', 4, id, '#8B5CF6', 1, 1, 1, 410
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Surreal art', 'surreal-art', 4, id, '#8B5CF6', 1, 1, 1, 420
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vector graphics', 'vector-graphics', 4, id, '#8B5CF6', 1, 1, 1, 430
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wallpapers', 'wallpapers', 4, id, '#8B5CF6', 1, 1, 1, 440
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Watercolor images', 'watercolor-images', 4, id, '#8B5CF6', 1, 1, 1, 450
  FROM categories WHERE slug = 'images' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Apps', 'apps', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Software cost estimation', 'software-cost-estimation', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Software testing', 'software-testing', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'software' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Predictive typing', 'predictive-typing', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'text' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Proofreading', 'proofreading', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'text' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Summaries', 'summaries', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'text' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Text editing', 'text-editing', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'text' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Text enhancement', 'text-enhancement', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'text' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Text explanations', 'text-explanations', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'text' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Text humanization', 'text-humanization', 4, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'text' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Text rewriting', 'text-rewriting', 4, id, '#8B5CF6', 1, 1, 1, 80
  FROM categories WHERE slug = 'text' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Transcription', 'transcription', 4, id, '#8B5CF6', 1, 1, 1, 90
  FROM categories WHERE slug = 'text' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Translations', 'translations', 4, id, '#8B5CF6', 1, 1, 1, 100
  FROM categories WHERE slug = 'text' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Typography', 'typography', 4, id, '#8B5CF6', 1, 1, 1, 110
  FROM categories WHERE slug = 'text' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Writing', 'writing', 4, id, '#8B5CF6', 1, 1, 1, 120
  FROM categories WHERE slug = 'text' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Dubbing & Localization', 'ai-dubbing-localization', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'video-editing-post' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Subtitles & Captions', 'ai-subtitles-captions', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'video-editing-post' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Video Editors', 'ai-video-editors', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'video-editing-post' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Video Effects', 'ai-video-effects', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'video-editing-post' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Video Enhancement', 'ai-video-enhancement', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'video-editing-post' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Video Repurposing', 'ai-video-repurposing', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'video-editing-post' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Animation & Motion', 'ai-animation-motion', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'video-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Avatar & Spokesperson Videos', 'ai-avatar-spokesperson-videos', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'video-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Image-to-Video', 'ai-image-to-video', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'video-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Marketing & UGC Video', 'ai-marketing-ugc-video', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'video-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Music & Lyric Videos', 'ai-music-lyric-videos', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'video-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Short-form & Clips', 'ai-short-form-clips', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'video-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Text-to-Video', 'ai-text-to-video', 4, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'video-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Animations', 'animations', 4, id, '#8B5CF6', 1, 1, 1, 80
  FROM categories WHERE slug = 'video-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Audio to video', 'audio-to-video', 4, id, '#8B5CF6', 1, 1, 1, 90
  FROM categories WHERE slug = 'video-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Faceless videos', 'faceless-videos', 4, id, '#8B5CF6', 1, 1, 1, 100
  FROM categories WHERE slug = 'video-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Interactive videos', 'interactive-videos', 4, id, '#8B5CF6', 1, 1, 1, 110
  FROM categories WHERE slug = 'video-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lip sync videos', 'lip-sync-videos', 4, id, '#8B5CF6', 1, 1, 1, 120
  FROM categories WHERE slug = 'video-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Movies', 'movies', 4, id, '#8B5CF6', 1, 1, 1, 130
  FROM categories WHERE slug = 'video-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'PDF to videos', 'pdf-to-videos', 4, id, '#8B5CF6', 1, 1, 1, 140
  FROM categories WHERE slug = 'video-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Personalized videos', 'personalized-videos', 4, id, '#8B5CF6', 1, 1, 1, 150
  FROM categories WHERE slug = 'video-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Product videos', 'product-videos', 4, id, '#8B5CF6', 1, 1, 1, 160
  FROM categories WHERE slug = 'video-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Short videos', 'short-videos', 4, id, '#8B5CF6', 1, 1, 1, 170
  FROM categories WHERE slug = 'video-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video analysis', 'video-analysis', 4, id, '#8B5CF6', 1, 1, 1, 180
  FROM categories WHERE slug = 'video-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video avatars', 'video-avatars', 4, id, '#8B5CF6', 1, 1, 1, 190
  FROM categories WHERE slug = 'video-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video captions', 'video-captions', 4, id, '#8B5CF6', 1, 1, 1, 200
  FROM categories WHERE slug = 'video-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video dubbing', 'video-dubbing', 4, id, '#8B5CF6', 1, 1, 1, 210
  FROM categories WHERE slug = 'video-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video editing', 'video-editing', 4, id, '#8B5CF6', 1, 1, 1, 220
  FROM categories WHERE slug = 'video-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video ideas', 'video-ideas', 4, id, '#8B5CF6', 1, 1, 1, 230
  FROM categories WHERE slug = 'video-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video localization', 'video-localization', 4, id, '#8B5CF6', 1, 1, 1, 240
  FROM categories WHERE slug = 'video-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video scripts', 'video-scripts', 4, id, '#8B5CF6', 1, 1, 1, 250
  FROM categories WHERE slug = 'video-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video thumbnails', 'video-thumbnails', 4, id, '#8B5CF6', 1, 1, 1, 260
  FROM categories WHERE slug = 'video-generation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Blog Writers', 'ai-blog-writers', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Book & Author Tools', 'ai-book-author-tools', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Copywriting Tools', 'ai-copywriting-tools', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Email Writers', 'ai-email-writers', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Essay & Academic Writers', 'ai-essay-academic-writers', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Grammar & Editing', 'ai-grammar-editing', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Humanizers & Anti-Detection', 'ai-humanizers-anti-detection', 4, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Resume & CV Tools', 'ai-resume-cv-tools', 4, id, '#8B5CF6', 1, 1, 1, 80
  FROM categories WHERE slug = 'writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Rewriters & Paraphrasing', 'ai-rewriters-paraphrasing', 4, id, '#8B5CF6', 1, 1, 1, 90
  FROM categories WHERE slug = 'writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Social Media Writers', 'ai-social-media-writers', 4, id, '#8B5CF6', 1, 1, 1, 100
  FROM categories WHERE slug = 'writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Story & Fiction Writers', 'ai-story-fiction-writers', 4, id, '#8B5CF6', 1, 1, 1, 110
  FROM categories WHERE slug = 'writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Summarizers', 'ai-summarizers', 4, id, '#8B5CF6', 1, 1, 1, 120
  FROM categories WHERE slug = 'writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Translation', 'ai-translation', 4, id, '#8B5CF6', 1, 1, 1, 130
  FROM categories WHERE slug = 'writing-copywriting' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Avatars & Digital Humans', 'ai-avatars-digital-humans', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-avatars-characters' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Characters & Companions', 'ai-characters-companions', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-avatars-characters' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Companionship & Emotional Support', 'ai-companionship-emotional-support', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-avatars-characters' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Chatbot Builders', 'ai-chatbot-builders', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'chatbots-conversational' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Chatbots for Websites', 'ai-chatbots-for-websites', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'chatbots-conversational' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Conversational Agents', 'ai-conversational-agents', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'chatbots-conversational' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI WhatsApp Bots', 'ai-whatsapp-bots', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'chatbots-conversational' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Feedback & Reviews', 'ai-feedback-reviews', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'chatbots-conversational' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Helpdesk & Ticketing', 'ai-helpdesk-ticketing', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'chatbots-conversational' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Support Training', 'ai-support-training', 4, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'chatbots-conversational' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Voice Support', 'ai-voice-support', 4, id, '#8B5CF6', 1, 1, 1, 80
  FROM categories WHERE slug = 'chatbots-conversational' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI APIs & SDKs', 'ai-apis-sdks', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'apis-infrastructure' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI DevOps & MLOps', 'ai-devops-mlops', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'apis-infrastructure' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Domain & Infrastructure Tools', 'ai-domain-infrastructure-tools', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'apis-infrastructure' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Hosting & Inference', 'ai-hosting-inference', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'apis-infrastructure' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Vector DBs & RAG', 'ai-vector-dbs-rag', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'apis-infrastructure' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI App Builders', 'ai-app-builders', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'app-site-builders' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Game Builders', 'ai-game-builders', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'app-site-builders' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Mobile App Publishing', 'ai-mobile-app-publishing', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'app-site-builders' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI No-code / Low-code Platforms', 'ai-no-code-low-code-platforms', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'app-site-builders' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI SaaS Generators', 'ai-saas-generators', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'app-site-builders' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Website Builders', 'ai-website-builders', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'app-site-builders' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Code Completion', 'ai-code-completion', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'coding-assistants' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Code Converters', 'ai-code-converters', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'coding-assistants' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Code Explanation & Docs', 'ai-code-explanation-docs', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'coding-assistants' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Code Optimization & Testing', 'ai-code-optimization-testing', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'coding-assistants' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Code Review & Debug', 'ai-code-review-debug', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'coding-assistants' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Coding Agents', 'ai-coding-agents', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'coding-assistants' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI IDEs & Editors', 'ai-ides-editors', 4, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'coding-assistants' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Regex & Git Assistants', 'ai-regex-git-assistants', 4, id, '#8B5CF6', 1, 1, 1, 80
  FROM categories WHERE slug = 'coding-assistants' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI SQL Assistants', 'ai-sql-assistants', 4, id, '#8B5CF6', 1, 1, 1, 90
  FROM categories WHERE slug = 'coding-assistants' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Vibe Coding Platforms', 'ai-vibe-coding-platforms', 4, id, '#8B5CF6', 1, 1, 1, 100
  FROM categories WHERE slug = 'coding-assistants' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Identity & Auth', 'ai-identity-auth', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'cybersecurity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Privacy & Encryption', 'ai-privacy-encryption', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'cybersecurity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Security Tools', 'ai-security-tools', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'cybersecurity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Data Analytics', 'ai-data-analytics', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'data-ml' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Data Cleaning & Prep', 'ai-data-cleaning-prep', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'data-ml' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Data Extraction & Scraping', 'ai-data-extraction-scraping', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'data-ml' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Data Science Tools', 'ai-data-science-tools', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'data-ml' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Course Builders', 'ai-course-builders', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'course-creation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Educational Content', 'ai-educational-content', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'course-creation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Tools for Educators', 'ai-tools-for-educators', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'course-creation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Language Tutors', 'ai-language-tutors', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'language-learning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Sign Language & Accessibility Learning', 'ai-sign-language-accessibility-learning', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'language-learning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Note Tools for Students', 'ai-note-tools-for-students', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'learning-study-tools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Quiz & Assessment', 'ai-quiz-assessment', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'learning-study-tools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Study Aids', 'ai-study-aids', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'learning-study-tools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Tutors', 'ai-tutors', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'learning-study-tools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Citation & Plagiarism', 'ai-citation-plagiarism', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'research-academic' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Research Assistants', 'ai-research-assistants', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'research-academic' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Science Tools', 'ai-science-tools', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'research-academic' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Accessibility', 'ai-for-accessibility', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'accessibility-assistive-tech' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Disabilities', 'ai-for-disabilities', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'accessibility-assistive-tech' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Astrology', 'ai-astrology', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'astrology-spiritual' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Religious & Spiritual', 'ai-religious-spiritual', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'astrology-spiritual' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Tarot & Divination', 'ai-tarot-divination', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'astrology-spiritual' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Dating Assistants', 'ai-dating-assistants', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'dating-relationships' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Beauty & Grooming', 'ai-beauty-grooming', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'fashion-beauty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Styling', 'ai-styling', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'fashion-beauty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Creative Fun', 'ai-creative-fun', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'games-entertainment' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Gaming Assistants', 'ai-gaming-assistants', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'games-entertainment' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Sports & Fantasy', 'ai-sports-fantasy', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'games-entertainment' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Fitness', 'ai-fitness', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'health-wellness' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Medical Assistants', 'ai-medical-assistants', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'health-wellness' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Mental Wellness', 'ai-mental-wellness', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'health-wellness' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Nutrition', 'ai-nutrition', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'health-wellness' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cooking & Recipes', 'ai-cooking-recipes', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'home-lifestyle' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Gardening & Plants', 'ai-gardening-plants', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'home-lifestyle' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Gift Ideas', 'ai-gift-ideas', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'home-lifestyle' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Home Design', 'ai-home-design', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'home-lifestyle' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Parenting & Kids', 'ai-parenting-kids', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'home-lifestyle' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Career Coaches', 'ai-career-coaches', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'home-lifestyle' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Travel Experience', 'ai-travel-experience', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'travel-hospitality' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Travel Planners', 'ai-travel-planners', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'travel-hospitality' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Debates', 'debates', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'community' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'School', 'school', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'community' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Studying', 'studying', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'community' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Teaching', 'teaching', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'community' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'University', 'university', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'community' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Attractiveness rating', 'attractiveness-rating', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'community' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Beauty advice', 'beauty-advice', 4, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'community' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Beauty scores', 'beauty-scores', 4, id, '#8B5CF6', 1, 1, 1, 80
  FROM categories WHERE slug = 'community' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Eye shape analysis', 'eye-shape-analysis', 4, id, '#8B5CF6', 1, 1, 1, 90
  FROM categories WHERE slug = 'community' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fashion advice', 'fashion-advice', 4, id, '#8B5CF6', 1, 1, 1, 100
  FROM categories WHERE slug = 'community' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fashion images', 'fashion-images', 4, id, '#8B5CF6', 1, 1, 1, 110
  FROM categories WHERE slug = 'community' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fashion models', 'fashion-models', 4, id, '#8B5CF6', 1, 1, 1, 120
  FROM categories WHERE slug = 'community' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fashion search', 'fashion-search', 4, id, '#8B5CF6', 1, 1, 1, 130
  FROM categories WHERE slug = 'community' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hairstyles', 'hairstyles', 4, id, '#8B5CF6', 1, 1, 1, 140
  FROM categories WHERE slug = 'community' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Makeup', 'makeup', 4, id, '#8B5CF6', 1, 1, 1, 150
  FROM categories WHERE slug = 'community' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Men''s fashion design', 'men-s-fashion-design', 4, id, '#8B5CF6', 1, 1, 1, 160
  FROM categories WHERE slug = 'community' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Outfits', 'outfits', 4, id, '#8B5CF6', 1, 1, 1, 170
  FROM categories WHERE slug = 'community' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Phone case designs', 'phone-case-designs', 4, id, '#8B5CF6', 1, 1, 1, 180
  FROM categories WHERE slug = 'community' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Skincare', 'skincare', 4, id, '#8B5CF6', 1, 1, 1, 190
  FROM categories WHERE slug = 'community' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sneaker design', 'sneaker-design', 4, id, '#8B5CF6', 1, 1, 1, 200
  FROM categories WHERE slug = 'community' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'T-shirt designs', 't-shirt-designs', 4, id, '#8B5CF6', 1, 1, 1, 210
  FROM categories WHERE slug = 'community' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tattoos', 'tattoos', 4, id, '#8B5CF6', 1, 1, 1, 220
  FROM categories WHERE slug = 'community' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Virtual try-ons', 'virtual-try-ons', 4, id, '#8B5CF6', 1, 1, 1, 230
  FROM categories WHERE slug = 'community' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Health conditions', 'health-conditions', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'food' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Medical advice', 'medical-advice', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'food' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mental health', 'mental-health', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'food' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Physiotherapy', 'physiotherapy', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'food' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sleep', 'sleep', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'food' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Weight loss', 'weight-loss', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'food' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wellness', 'wellness', 4, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'food' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Critical thinking', 'critical-thinking', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'learning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Curiosity exploration', 'curiosity-exploration', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'learning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Educational videos', 'educational-videos', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'learning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fact checking', 'fact-checking', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'learning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Interactive learning', 'interactive-learning', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'learning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Reading', 'reading', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'learning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tech learning', 'tech-learning', 4, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'learning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Topic simplification', 'topic-simplification', 4, id, '#8B5CF6', 1, 1, 1, 80
  FROM categories WHERE slug = 'learning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tutorials', 'tutorials', 4, id, '#8B5CF6', 1, 1, 1, 90
  FROM categories WHERE slug = 'learning' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cats', 'cats', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'pets' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dogs', 'dogs', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'pets' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pet care', 'pet-care', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'pets' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pet fashion', 'pet-fashion', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'pets' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pet health', 'pet-health', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'pets' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pet mood analysis', 'pet-mood-analysis', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'pets' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pet names', 'pet-names', 4, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'pets' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Athletic performance', 'athletic-performance', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'sports' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Baseball', 'baseball', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'sports' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Basketball', 'basketball', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'sports' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cricket', 'cricket', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'sports' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Football', 'football', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'sports' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Golf', 'golf', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'sports' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Skiing', 'skiing', 4, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'sports' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sports coaching', 'sports-coaching', 4, id, '#8B5CF6', 1, 1, 1, 80
  FROM categories WHERE slug = 'sports' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Surfing', 'surfing', 4, id, '#8B5CF6', 1, 1, 1, 90
  FROM categories WHERE slug = 'sports' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tennis', 'tennis', 4, id, '#8B5CF6', 1, 1, 1, 100
  FROM categories WHERE slug = 'sports' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Browser Automation', 'ai-browser-automation', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'automation-integration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Email & Communication Automation', 'ai-email-communication-automation', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'automation-integration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Scripting & Macros', 'ai-scripting-macros', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'automation-integration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Workflow Automation', 'ai-workflow-automation', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'automation-integration' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Document Editing', 'ai-document-editing', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'documents-files' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Document Generators', 'ai-document-generators', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'documents-files' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI File Management', 'ai-file-management', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'documents-files' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Forms & Surveys', 'ai-forms-surveys', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'documents-files' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Password & Security', 'ai-password-security', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'documents-files' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI PDF Tools', 'ai-pdf-tools', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'documents-files' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Spreadsheets & Data Entry', 'ai-spreadsheets-data-entry', 4, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'documents-files' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Knowledge Bases & Wikis', 'ai-knowledge-bases-wikis', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'knowledge-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Memory & Recall', 'ai-memory-recall', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'knowledge-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Mind Mapping', 'ai-mind-mapping', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'knowledge-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI PKM & Second Brain', 'ai-pkm-second-brain', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'knowledge-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Whiteboard & Collaboration', 'ai-whiteboard-collaboration', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'knowledge-management' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Calendar & Time', 'ai-calendar-time', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'personal-productivity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Focus & Deep Work', 'ai-focus-deep-work', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'personal-productivity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Habit Tracking', 'ai-habit-tracking', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'personal-productivity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Journaling', 'ai-journaling', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'personal-productivity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Meeting Assistants', 'ai-meeting-assistants', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'personal-productivity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Meeting Scheduling', 'ai-meeting-scheduling', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'personal-productivity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Mindfulness & Wellbeing', 'ai-mindfulness-wellbeing', 4, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'personal-productivity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Note-taking', 'ai-note-taking', 4, id, '#8B5CF6', 1, 1, 1, 80
  FROM categories WHERE slug = 'personal-productivity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Task & Project Management', 'ai-task-project-management', 4, id, '#8B5CF6', 1, 1, 1, 90
  FROM categories WHERE slug = 'personal-productivity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Time Tracking', 'ai-time-tracking', 4, id, '#8B5CF6', 1, 1, 1, 100
  FROM categories WHERE slug = 'personal-productivity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Freelancer Tools', 'ai-freelancer-tools', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'remote-work-team' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Remote Work Tools', 'ai-remote-work-tools', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'remote-work-team' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Shared Inbox', 'ai-shared-inbox', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'remote-work-team' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Team Communication', 'ai-team-communication', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'remote-work-team' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Chrome Extensions', 'ai-chrome-extensions', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'search-discovery' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Search Engines', 'ai-search-engines', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'search-discovery' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business analysis', 'business-analysis', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'data' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data analysis', 'data-analysis', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'data' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data anonymization', 'data-anonymization', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'data' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data entry', 'data-entry', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'data' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data management', 'data-management', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'data' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Data modeling', 'data-modeling', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'data' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Files', 'files', 4, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'data' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI', 'ai', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'industries' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Construction', 'construction', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'industries' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Healthcare', 'healthcare', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'industries' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hospitality', 'hospitality', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'industries' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Branding', 'branding', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Business growth', 'business-growth', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketing analysis', 'marketing-analysis', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketing assistance', 'marketing-assistance', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketing campaigns', 'marketing-campaigns', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketing channels', 'marketing-channels', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketing optimization', 'marketing-optimization', 4, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marketing strategies', 'marketing-strategies', 4, id, '#8B5CF6', 1, 1, 1, 80
  FROM categories WHERE slug = 'marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Public relations', 'public-relations', 4, id, '#8B5CF6', 1, 1, 1, 90
  FROM categories WHERE slug = 'marketing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Email', 'email', 4, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'productivity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Form filling', 'form-filling', 4, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'productivity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Goals', 'goals', 4, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'productivity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Knowledge', 'knowledge', 4, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'productivity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Notes', 'notes', 4, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'productivity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Operating systems', 'operating-systems', 4, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'productivity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Problem solving', 'problem-solving', 4, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'productivity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Productivity advice', 'productivity-advice', 4, id, '#8B5CF6', 1, 1, 1, 80
  FROM categories WHERE slug = 'productivity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Task automation', 'task-automation', 4, id, '#8B5CF6', 1, 1, 1, 90
  FROM categories WHERE slug = 'productivity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Task management', 'task-management', 4, id, '#8B5CF6', 1, 1, 1, 100
  FROM categories WHERE slug = 'productivity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Time management', 'time-management', 4, id, '#8B5CF6', 1, 1, 1, 110
  FROM categories WHERE slug = 'productivity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Web browsing', 'web-browsing', 4, id, '#8B5CF6', 1, 1, 1, 120
  FROM categories WHERE slug = 'productivity' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Workspace organization', 'workspace-organization', 4, id, '#8B5CF6', 1, 1, 1, 130
  FROM categories WHERE slug = 'productivity' AND level = 3 LIMIT 1;

-- ═══ Section D.4: Insert 842 new L5 categories ═══
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI computer use agent', 'ai-computer-use-agent', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'autonomous-agents' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI task agent', 'ai-task-agent', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'autonomous-agents' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI concierge agent', 'ai-concierge-agent', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'personal-life-agents' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI daily errands agent', 'ai-daily-errands-agent', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'personal-life-agents' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI competitive intel agent', 'ai-competitive-intel-agent', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'research-agents' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI deep research tool', 'ai-deep-research-tool', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'research-agents' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI literature agent', 'ai-literature-agent', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'research-agents' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI marketing agent', 'ai-marketing-agent', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'sales-marketing-agents' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI ops agent', 'ai-ops-agent', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'sales-marketing-agents' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI sales agent', 'ai-sales-agent', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'sales-marketing-agents' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI bypass detection', 'ai-bypass-detection', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-humanizers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI text naturalizer', 'ai-text-naturalizer', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-humanizers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI image detection tool', 'ai-image-detection-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-image-deepfake-detection' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI watermark detector', 'ai-watermark-detector', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-image-deepfake-detection' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI content detector', 'ai-content-detector', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-text-detection' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI plagiarism + AI detector', 'ai-plagiarism-ai-detector', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-text-detection' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI text detector', 'ai-text-detector', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-text-detection' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI image API marketplace', 'ai-image-api-marketplace', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'image-model-playgrounds' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI multi-model image generator', 'ai-multi-model-image-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'image-model-playgrounds' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI multi-model video generator', 'ai-multi-model-video-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'video-model-playgrounds' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI video API', 'ai-video-api', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'video-model-playgrounds' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI chat assistant', 'ai-chat-assistant', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'general-chat-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI general purpose chatbot', 'ai-general-purpose-chatbot', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'general-chat-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Q&A assistant', 'ai-q-a-assistant', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'general-chat-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ChatGPT alternative', 'chatgpt-alternative', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'general-chat-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Frontier LLM', 'frontier-llm', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'large-language-models' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Multimodal LLM', 'multimodal-llm', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'large-language-models' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Open source LLM', 'open-source-llm', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'large-language-models' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI chain-of-thought assistant', 'ai-chain-of-thought-assistant', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'reasoning-models' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI logic solver', 'ai-logic-solver', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'reasoning-models' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI math assistant', 'ai-math-assistant', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'reasoning-models' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Local LLM runner', 'local-llm-runner', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'uncensored-open-models' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Open source chat assistant', 'open-source-chat-assistant', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'uncensored-open-models' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Uncensored AI chat', 'uncensored-ai-chat', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'uncensored-open-models' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI LoRA training tool', 'ai-lora-training-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'fine-tuning-platforms' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI RLHF platform', 'ai-rlhf-platform', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'fine-tuning-platforms' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI annotation tool', 'ai-annotation-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'training-data-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI data labeling', 'ai-data-labeling', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'training-data-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI synthetic data generator', 'ai-synthetic-data-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'training-data-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI custom assistant marketplace', 'ai-custom-assistant-marketplace', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'gpts-custom-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI GPT store alternative', 'ai-gpt-store-alternative', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'gpts-custom-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Custom GPT directory', 'custom-gpt-directory', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'gpts-custom-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI prompt engineering tool', 'ai-prompt-engineering-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'prompt-libraries' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI prompt library', 'ai-prompt-library', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'prompt-libraries' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI prompt marketplace', 'ai-prompt-marketplace', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'prompt-libraries' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI prompt evaluator', 'ai-prompt-evaluator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'prompt-optimization' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI prompt optimizer', 'ai-prompt-optimizer', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'prompt-optimization' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI prompt tester', 'ai-prompt-tester', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'prompt-optimization' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI analytics platform', 'ai-analytics-platform', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-business-intelligence' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI BI tool', 'ai-bi-tool', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-business-intelligence' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI dashboard generator', 'ai-dashboard-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-business-intelligence' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI no-code data tool', 'ai-no-code-data-tool', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-business-intelligence' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI chart generator', 'ai-chart-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-data-visualization' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI infographic from data', 'ai-infographic-from-data', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-data-visualization' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI custom model trainer', 'ai-custom-model-trainer', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-deep-learning-platforms' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI model playground', 'ai-model-playground', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-deep-learning-platforms' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI neural network builder', 'ai-neural-network-builder', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-deep-learning-platforms' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI churn prediction', 'ai-churn-prediction', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-predictive-analytics' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI forecasting tool', 'ai-forecasting-tool', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-predictive-analytics' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI sales prediction', 'ai-sales-prediction', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-predictive-analytics' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI demand planner', 'ai-demand-planner', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-inventory-ops' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI inventory forecasting', 'ai-inventory-forecasting', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-inventory-ops' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI logistics optimizer', 'ai-logistics-optimizer', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-inventory-ops' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI supply chain tool', 'ai-supply-chain-tool', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-inventory-ops' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI pricing optimizer', 'ai-pricing-optimizer', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-product-optimization' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI product description generator', 'ai-product-description-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-product-optimization' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI review analyzer', 'ai-review-analyzer', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-product-optimization' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI product catalog generator', 'ai-product-catalog-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-store-builders' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI storefront designer', 'ai-storefront-designer', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-store-builders' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Shopify ad creator', 'ai-shopify-ad-creator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-tools-for-shopify' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Shopify product description', 'ai-shopify-product-description', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-tools-for-shopify' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Shopify store optimizer', 'ai-shopify-store-optimizer', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-tools-for-shopify' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI WooCommerce plugin', 'ai-woocommerce-plugin', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-tools-for-woocommerce-wordpress' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI WooCommerce product tool', 'ai-woocommerce-product-tool', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-tools-for-woocommerce-wordpress' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI WordPress AI assistant', 'ai-wordpress-ai-assistant', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-tools-for-woocommerce-wordpress' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI WordPress SEO plugin', 'ai-wordpress-seo-plugin', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-tools-for-woocommerce-wordpress' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI personal shopper', 'ai-personal-shopper', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-tools-for-woocommerce-wordpress' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI product finder', 'ai-product-finder', 5, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ai-tools-for-woocommerce-wordpress' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI recommendation engine', 'ai-recommendation-engine', 5, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'ai-tools-for-woocommerce-wordpress' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI accounting tool', 'ai-accounting-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-accounting-bookkeeping' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI bookkeeping software', 'ai-bookkeeping-software', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-accounting-bookkeeping' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI expense tracker', 'ai-expense-tracker', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-accounting-bookkeeping' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI invoicing tool', 'ai-invoicing-tool', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-accounting-bookkeeping' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI blockchain analytics', 'ai-blockchain-analytics', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-crypto-blockchain' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI crypto assistant', 'ai-crypto-assistant', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-crypto-blockchain' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI NFT generator', 'ai-nft-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-crypto-blockchain' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI on-chain AI tool', 'ai-on-chain-ai-tool', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-crypto-blockchain' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI token research', 'ai-token-research', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-crypto-blockchain' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI budget assistant', 'ai-budget-assistant', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-financial-planning' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI cash flow forecaster', 'ai-cash-flow-forecaster', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-financial-planning' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI personal finance AI', 'ai-personal-finance-ai', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-financial-planning' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI crypto trading', 'ai-crypto-trading', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-investing-trading' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI investment research', 'ai-investment-research', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-investing-trading' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI portfolio manager', 'ai-portfolio-manager', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-investing-trading' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI stock analysis', 'ai-stock-analysis', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-investing-trading' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI trading bot', 'ai-trading-bot', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-investing-trading' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI audit assistant', 'ai-audit-assistant', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-tax-compliance' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI compliance automation', 'ai-compliance-automation', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-tax-compliance' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI tax assistant', 'ai-tax-assistant', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-tax-compliance' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI tax filing tool', 'ai-tax-filing-tool', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-tax-compliance' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI employee onboarding', 'ai-employee-onboarding', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-employee-experience' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI employee training', 'ai-employee-training', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-employee-experience' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI engagement survey', 'ai-engagement-survey', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-employee-experience' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI performance review tool', 'ai-performance-review-tool', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-employee-experience' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI interview practice', 'ai-interview-practice', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-interview-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI interview question generator', 'ai-interview-question-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-interview-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI mock interview', 'ai-mock-interview', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-interview-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI video interviewing', 'ai-video-interviewing', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-interview-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI job matcher', 'ai-job-matcher', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-job-search-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI job tracker', 'ai-job-tracker', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-job-search-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI ATS', 'ai-ats', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-recruiting-ats' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI candidate sourcing', 'ai-candidate-sourcing', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-recruiting-ats' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI interview scheduler', 'ai-interview-scheduler', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-recruiting-ats' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI recruiter', 'ai-recruiter', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-recruiting-ats' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI resume screener', 'ai-resume-screener', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-recruiting-ats' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI compliance tool', 'ai-compliance-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-compliance-privacy' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI GDPR tool', 'ai-gdpr-tool', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-compliance-privacy' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI privacy policy generator', 'ai-privacy-policy-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-compliance-privacy' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI terms of service generator', 'ai-terms-of-service-generator', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-compliance-privacy' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI contract analysis', 'ai-contract-analysis', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-contract-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI contract redlining', 'ai-contract-redlining', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-contract-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI contract review', 'ai-contract-review', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-contract-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI case law assistant', 'ai-case-law-assistant', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-legal-research' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Facebook ads generator', 'ai-facebook-ads-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-ad-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Google ads generator', 'ai-google-ads-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-ad-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Meta ads creator', 'ai-meta-ads-creator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-ad-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI performance ads tool', 'ai-performance-ads-tool', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-ad-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI brand name generator', 'ai-brand-name-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-brainstorming-ideas' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI business idea generator', 'ai-business-idea-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-brainstorming-ideas' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI business name generator', 'ai-business-name-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-brainstorming-ideas' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI domain name generator', 'ai-domain-name-generator', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-brainstorming-ideas' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI startup idea tool', 'ai-startup-idea-tool', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-brainstorming-ideas' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI content calendar', 'ai-content-calendar', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-content-marketing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI content planner', 'ai-content-planner', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-content-marketing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI content strategy tool', 'ai-content-strategy-tool', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-content-marketing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI cold outreach tool', 'ai-cold-outreach-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-email-marketing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI email drip campaign', 'ai-email-drip-campaign', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-email-marketing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI newsletter generator', 'ai-newsletter-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-email-marketing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI brand monitoring', 'ai-brand-monitoring', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-influencer-pr' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI influencer marketing tool', 'ai-influencer-marketing-tool', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-influencer-pr' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI PR tool', 'ai-pr-tool', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-influencer-pr' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI press release generator', 'ai-press-release-generator', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-influencer-pr' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI customer insight tool', 'ai-customer-insight-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-market-research' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI trend analysis', 'ai-trend-analysis', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-market-research' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI editorial assistant', 'ai-editorial-assistant', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-newsrooms' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI news aggregator', 'ai-news-aggregator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-newsrooms' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI news summarizer', 'ai-news-summarizer', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-newsrooms' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI press room tool', 'ai-press-room-tool', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-newsrooms' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI media kit generator', 'ai-media-kit-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-publishing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI publication platform', 'ai-publication-platform', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-publishing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI property photo enhancer', 'ai-property-photo-enhancer', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-property-visuals' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI virtual staging', 'ai-virtual-staging', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-property-visuals' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI listing description generator', 'ai-listing-description-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-real-estate-agents' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI property matching tool', 'ai-property-matching-tool', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-real-estate-agents' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI real estate assistant', 'ai-real-estate-assistant', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-real-estate-agents' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI customer 360', 'ai-customer-360', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-crm-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI deal tracker', 'ai-deal-tracker', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-crm-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI pipeline manager', 'ai-pipeline-manager', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-crm-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI sales forecasting', 'ai-sales-forecasting', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-crm-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI email finder', 'ai-email-finder', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-lead-generation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI email verifier', 'ai-email-verifier', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-lead-generation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI lead enrichment', 'ai-lead-enrichment', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-lead-generation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI lead finder', 'ai-lead-finder', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-lead-generation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI prospecting tool', 'ai-prospecting-tool', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-lead-generation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI buyer signal tool', 'ai-buyer-signal-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-sales-intelligence' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI call analysis', 'ai-call-analysis', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-sales-intelligence' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI revenue intelligence', 'ai-revenue-intelligence', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-sales-intelligence' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI cold email platform', 'ai-cold-email-platform', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-sales-outreach' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI follow-up automation', 'ai-follow-up-automation', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-sales-outreach' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI feedback widget', 'ai-feedback-widget', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-testimonials-feedback' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI review collector', 'ai-review-collector', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-testimonials-feedback' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI testimonial collection', 'ai-testimonial-collection', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-testimonials-feedback' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI video testimonials', 'ai-video-testimonials', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-testimonials-feedback' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI cold calling bot', 'ai-cold-calling-bot', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-voice-sales-agents' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI inbound voice agent', 'ai-inbound-voice-agent', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-voice-sales-agents' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI SDR agent', 'ai-sdr-agent', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-voice-sales-agents' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI AEO tool', 'ai-aeo-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-geo-answer-engine-optimization' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI answer engine optimization', 'ai-answer-engine-optimization', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-geo-answer-engine-optimization' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI brand visibility in LLMs', 'ai-brand-visibility-in-llms', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-geo-answer-engine-optimization' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI ChatGPT ranking tool', 'ai-chatgpt-ranking-tool', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-geo-answer-engine-optimization' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI GEO tool', 'ai-geo-tool', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-geo-answer-engine-optimization' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI CRO tool', 'ai-cro-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-landing-pages' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI landing page optimizer', 'ai-landing-page-optimizer', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-landing-pages' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI backlink tool', 'ai-backlink-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-seo-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI keyword research', 'ai-keyword-research', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-seo-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI SEO content optimizer', 'ai-seo-content-optimizer', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-seo-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI SERP analyzer', 'ai-serp-analyzer', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-seo-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI competitor analysis', 'ai-competitor-analysis', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-social-analytics' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI engagement analyzer', 'ai-engagement-analyzer', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-social-analytics' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI social listening', 'ai-social-listening', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-social-analytics' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI carousel generator', 'ai-carousel-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-social-content-creation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI social post generator', 'ai-social-post-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-social-content-creation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI social video generator', 'ai-social-video-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-social-content-creation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI multi-platform publisher', 'ai-multi-platform-publisher', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-social-media-management' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI social inbox', 'ai-social-inbox', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-social-media-management' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI social scheduler', 'ai-social-scheduler', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-social-media-management' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Instagram bio generator', 'ai-instagram-bio-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-tools-for-instagram' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Instagram post planner', 'ai-instagram-post-planner', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-tools-for-instagram' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Instagram reels tool', 'ai-instagram-reels-tool', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-tools-for-instagram' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI LinkedIn outreach', 'ai-linkedin-outreach', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-tools-for-linkedin' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI LinkedIn post generator', 'ai-linkedin-post-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-tools-for-linkedin' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI LinkedIn profile optimizer', 'ai-linkedin-profile-optimizer', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-tools-for-linkedin' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI faceless TikTok generator', 'ai-faceless-tiktok-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-tools-for-tiktok' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI TikTok trending sounds', 'ai-tiktok-trending-sounds', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-tools-for-tiktok' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI tweet scheduler', 'ai-tweet-scheduler', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-tools-for-x-twitter' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Twitter analytics', 'ai-twitter-analytics', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-tools-for-x-twitter' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Twitter post generator', 'ai-twitter-post-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-tools-for-x-twitter' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI X thread writer', 'ai-x-thread-writer', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-tools-for-x-twitter' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI YouTube description writer', 'ai-youtube-description-writer', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-tools-for-youtube' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI YouTube SEO tool', 'ai-youtube-seo-tool', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-tools-for-youtube' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI YouTube tag generator', 'ai-youtube-tag-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-tools-for-youtube' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI audio editor', 'ai-audio-editor', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-audio-editing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI audio enhancer', 'ai-audio-enhancer', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-audio-editing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI audio mastering', 'ai-audio-mastering', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-audio-editing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI noise remover', 'ai-noise-remover', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-audio-editing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI podcast editor', 'ai-podcast-editor', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-audio-editing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI vocal remover', 'ai-vocal-remover', 5, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ai-audio-editing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI beat maker', 'ai-beat-maker', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-music-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI instrumental generator', 'ai-instrumental-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-music-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI royalty-free music generator', 'ai-royalty-free-music-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-music-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI song generator', 'ai-song-generator', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-music-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI podcast audiogram maker', 'ai-podcast-audiogram-maker', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-podcasting' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI podcast producer', 'ai-podcast-producer', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-podcasting' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI show notes generator', 'ai-show-notes-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-podcasting' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI audio-to-text', 'ai-audio-to-text', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-transcription-stt' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI interview transcription', 'ai-interview-transcription', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-transcription-stt' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI meeting transcription', 'ai-meeting-transcription', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-transcription-stt' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI podcast transcription', 'ai-podcast-transcription', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-transcription-stt' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI character voice generator', 'ai-character-voice-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-voice-tts' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI multilingual TTS', 'ai-multilingual-tts', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-voice-tts' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI realistic voice', 'ai-realistic-voice', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-voice-tts' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI text-to-speech', 'ai-text-to-speech', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-voice-tts' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI celebrity voice', 'ai-celebrity-voice', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-voice-cloning' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI custom voice creator', 'ai-custom-voice-creator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-voice-cloning' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI voice changer', 'ai-voice-changer', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-voice-cloning' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI voice replica', 'ai-voice-replica', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-voice-cloning' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI 3D asset generator', 'ai-3d-asset-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-3d-model-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI game asset generator', 'ai-game-asset-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-3d-model-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI text-to-3D', 'ai-text-to-3d', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-3d-model-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI 3D world generator', 'ai-3d-world-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-3d-worlds-simulation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI metaverse asset tool', 'ai-metaverse-asset-tool', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-3d-worlds-simulation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI simulation environment', 'ai-simulation-environment', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-3d-worlds-simulation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI virtual world builder', 'ai-virtual-world-builder', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-3d-worlds-simulation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI infographic generator', 'ai-infographic-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-graphic-design' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI template customizer', 'ai-template-customizer', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-graphic-design' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Google Slides generator', 'ai-google-slides-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-presentations' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI pitch deck generator', 'ai-pitch-deck-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-presentations' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI PPT maker', 'ai-ppt-maker', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-presentations' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI presentation generator', 'ai-presentation-generator', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-presentations' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI slide generator', 'ai-slide-generator', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-presentations' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Figma plugin', 'ai-figma-plugin', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-ui-ux-design' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI mockup generator', 'ai-mockup-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-ui-ux-design' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI wireframe generator', 'ai-wireframe-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-ui-ux-design' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI deepfake generator', 'ai-deepfake-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-face-swap-deepfake' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI digital double creator', 'ai-digital-double-creator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-face-swap-deepfake' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI face reenactment', 'ai-face-reenactment', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-face-swap-deepfake' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI image recognition', 'ai-image-recognition', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-image-analysis-recognition' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI object detection', 'ai-object-detection', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-image-analysis-recognition' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI OCR tool', 'ai-ocr-tool', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-image-analysis-recognition' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI reverse image search', 'ai-reverse-image-search', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-image-analysis-recognition' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI visual Q&A', 'ai-visual-q-a', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-image-analysis-recognition' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI image relighting', 'ai-image-relighting', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-image-manipulation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI image-to-image editor', 'ai-image-to-image-editor', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-image-manipulation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI inpainting tool', 'ai-inpainting-tool', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-image-manipulation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI outpainting tool', 'ai-outpainting-tool', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-image-manipulation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI image enlarger', 'ai-image-enlarger', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-image-upscalers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI image super-resolution', 'ai-image-super-resolution', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-image-upscalers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI resolution enhancer', 'ai-resolution-enhancer', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-image-upscalers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI age progression', 'ai-age-progression', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-object-face-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI face editor', 'ai-face-editor', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-object-face-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI face enhancer', 'ai-face-enhancer', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-object-face-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI face swap', 'ai-face-swap', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-object-face-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI object remover', 'ai-object-remover', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-object-face-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI smile generator', 'ai-smile-generator', 5, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ai-object-face-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI photo colorizer', 'ai-photo-colorizer', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-photo-editors' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI photo enhancer', 'ai-photo-enhancer', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-photo-editors' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI photo filter', 'ai-photo-filter', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-photo-editors' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI photo restoration', 'ai-photo-restoration', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-photo-editors' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI photo retouching', 'ai-photo-retouching', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-photo-editors' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI desktop wallpaper', 'ai-desktop-wallpaper', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-background-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI phone wallpaper', 'ai-phone-wallpaper', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-background-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI scene generator', 'ai-scene-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-background-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI clothing design tool', 'ai-clothing-design-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-fashion-apparel' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI headshot generator', 'ai-headshot-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-headshot-avatar' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI LinkedIn headshot generator', 'ai-linkedin-headshot-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-headshot-avatar' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI passport photo generator', 'ai-passport-photo-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-headshot-avatar' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI profile picture generator', 'ai-profile-picture-generator', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-headshot-avatar' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI custom typeface creator', 'ai-custom-typeface-creator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-icon-font-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI emoji generator', 'ai-emoji-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-icon-font-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI font generator', 'ai-font-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-icon-font-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI architecture renderer', 'ai-architecture-renderer', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-interior-architecture' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI floor plan generator', 'ai-floor-plan-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-interior-architecture' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI home staging tool', 'ai-home-staging-tool', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-interior-architecture' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI interior design generator', 'ai-interior-design-generator', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-interior-architecture' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI landscape design tool', 'ai-landscape-design-tool', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-interior-architecture' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI room designer', 'ai-room-designer', 5, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ai-interior-architecture' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI brand color palette generator', 'ai-brand-color-palette-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-logo-brand-design' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI brand identity generator', 'ai-brand-identity-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-logo-brand-design' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI favicon generator', 'ai-favicon-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-logo-brand-design' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI logo maker', 'ai-logo-maker', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-logo-brand-design' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI ad creative generator', 'ai-ad-creative-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-marketing-visuals' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI banner generator', 'ai-banner-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-marketing-visuals' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI thumbnail generator', 'ai-thumbnail-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-marketing-visuals' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI YouTube thumbnail maker', 'ai-youtube-thumbnail-maker', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-marketing-visuals' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI caption meme maker', 'ai-caption-meme-maker', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-meme-fun-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI emoji sticker maker', 'ai-emoji-sticker-maker', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-meme-fun-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI gif generator', 'ai-gif-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-meme-fun-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI meme generator', 'ai-meme-generator', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-meme-fun-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI ecommerce photo tool', 'ai-ecommerce-photo-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-product-photography' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI lifestyle shot generator', 'ai-lifestyle-shot-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-product-photography' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI product mockup generator', 'ai-product-mockup-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-product-photography' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI product photo generator', 'ai-product-photo-generator', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-product-photography' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI artistic QR code', 'ai-artistic-qr-code', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-qr-code-visual-codes' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI barcode generator', 'ai-barcode-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-qr-code-visual-codes' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI custom QR code maker', 'ai-custom-qr-code-maker', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-qr-code-visual-codes' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI QR code generator', 'ai-qr-code-generator', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-qr-code-visual-codes' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI scalable graphics tool', 'ai-scalable-graphics-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-svg-vector-graphics' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI SVG generator', 'ai-svg-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-svg-vector-graphics' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI vector art generator', 'ai-vector-art-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-svg-vector-graphics' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI vector illustration', 'ai-vector-illustration', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-svg-vector-graphics' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI cartoon generator', 'ai-cartoon-generator', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-svg-vector-graphics' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI digital art tool', 'ai-digital-art-tool', 5, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ai-svg-vector-graphics' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI illustration generator', 'ai-illustration-generator', 5, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'ai-svg-vector-graphics' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI painting generator', 'ai-painting-generator', 5, id, '#8B5CF6', 1, 1, 1, 80
  FROM categories WHERE slug = 'ai-svg-vector-graphics' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI style transfer', 'ai-style-transfer', 5, id, '#8B5CF6', 1, 1, 1, 90
  FROM categories WHERE slug = 'ai-svg-vector-graphics' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI anime image generator', 'ai-anime-image-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'text-to-image-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI art style generator', 'ai-art-style-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'text-to-image-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI photo-realistic image generator', 'ai-photo-realistic-image-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'text-to-image-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI stable diffusion alternative', 'ai-stable-diffusion-alternative', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'text-to-image-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI lip-sync translation', 'ai-lip-sync-translation', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-dubbing-localization' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI multilingual video', 'ai-multilingual-video', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-dubbing-localization' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI voice dubbing', 'ai-voice-dubbing', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-dubbing-localization' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI auto captions', 'ai-auto-captions', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-subtitles-captions' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI multilingual subtitle tool', 'ai-multilingual-subtitle-tool', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-subtitles-captions' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI subtitle generator', 'ai-subtitle-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-subtitles-captions' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI auto-cut editor', 'ai-auto-cut-editor', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-video-editors' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI highlight extractor', 'ai-highlight-extractor', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-video-editors' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI video montage maker', 'ai-video-montage-maker', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-video-editors' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI video trimmer', 'ai-video-trimmer', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-video-editors' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI face swap video', 'ai-face-swap-video', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-video-effects' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI green screen tool', 'ai-green-screen-tool', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-video-effects' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI lip sync tool', 'ai-lip-sync-tool', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-video-effects' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI video filter', 'ai-video-filter', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-video-effects' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI video style transfer', 'ai-video-style-transfer', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-video-effects' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI video colorization', 'ai-video-colorization', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-video-enhancement' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI video denoiser', 'ai-video-denoiser', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-video-enhancement' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI video enhancer', 'ai-video-enhancer', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-video-enhancement' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI video stabilizer', 'ai-video-stabilizer', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-video-enhancement' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI video upscaler', 'ai-video-upscaler', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-video-enhancement' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI clip finder', 'ai-clip-finder', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-video-repurposing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI long-to-short video tool', 'ai-long-to-short-video-tool', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-video-repurposing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI podcast-to-video', 'ai-podcast-to-video', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-video-repurposing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI video chapter generator', 'ai-video-chapter-generator', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-video-repurposing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI 2D animation tool', 'ai-2d-animation-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-animation-motion' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI animated explainer', 'ai-animated-explainer', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-animation-motion' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI animation generator', 'ai-animation-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-animation-motion' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI cartoon video generator', 'ai-cartoon-video-generator', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-animation-motion' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI motion graphics generator', 'ai-motion-graphics-generator', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-animation-motion' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI digital human video', 'ai-digital-human-video', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-avatar-spokesperson-videos' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI presenter video', 'ai-presenter-video', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-avatar-spokesperson-videos' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI spokesperson video', 'ai-spokesperson-video', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-avatar-spokesperson-videos' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI talking head video', 'ai-talking-head-video', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-avatar-spokesperson-videos' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI animated portrait tool', 'ai-animated-portrait-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-image-to-video' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI photo animator', 'ai-photo-animator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-image-to-video' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI still-to-motion', 'ai-still-to-motion', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-image-to-video' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI ad video generator', 'ai-ad-video-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-marketing-ugc-video' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI explainer video maker', 'ai-explainer-video-maker', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-marketing-ugc-video' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI promo video tool', 'ai-promo-video-tool', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-marketing-ugc-video' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI UGC video generator', 'ai-ugc-video-generator', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-marketing-ugc-video' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI lyric video generator', 'ai-lyric-video-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-music-lyric-videos' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI music video generator', 'ai-music-video-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-music-lyric-videos' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI visualizer generator', 'ai-visualizer-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-music-lyric-videos' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI faceless YouTube tool', 'ai-faceless-youtube-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-short-form-clips' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Reels generator', 'ai-reels-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-short-form-clips' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI short video clips maker', 'ai-short-video-clips-maker', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-short-form-clips' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI TikTok video generator', 'ai-tiktok-video-generator', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-short-form-clips' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI viral video generator', 'ai-viral-video-generator', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-short-form-clips' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI YouTube Shorts generator', 'ai-youtube-shorts-generator', 5, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ai-short-form-clips' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI cinematic video generator', 'ai-cinematic-video-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-text-to-video' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI prompt-to-video', 'ai-prompt-to-video', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-text-to-video' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI blog intro generator', 'ai-blog-intro-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-blog-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI blog outline generator', 'ai-blog-outline-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-blog-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI blog post generator', 'ai-blog-post-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-blog-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI long-form article writer', 'ai-long-form-article-writer', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-blog-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI SEO blog writer', 'ai-seo-blog-writer', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-blog-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bulk AI blog writer', 'bulk-ai-blog-writer', 5, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ai-blog-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI book cover generator', 'ai-book-cover-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-book-author-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI book summarizer', 'ai-book-summarizer', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-book-author-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI book writer', 'ai-book-writer', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-book-author-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI chapter outline generator', 'ai-chapter-outline-generator', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-book-author-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI children''s book writer', 'ai-children-s-book-writer', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-book-author-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI ebook generator', 'ai-ebook-generator', 5, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ai-book-author-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI ad copy generator', 'ai-ad-copy-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-copywriting-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI landing page copywriter', 'ai-landing-page-copywriter', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-copywriting-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI product description writer', 'ai-product-description-writer', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-copywriting-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI sales copy generator', 'ai-sales-copy-generator', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-copywriting-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI slogan generator', 'ai-slogan-generator', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-copywriting-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI tagline generator', 'ai-tagline-generator', 5, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ai-copywriting-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI cold email writer', 'ai-cold-email-writer', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-email-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI email reply generator', 'ai-email-reply-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-email-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI email subject line generator', 'ai-email-subject-line-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-email-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI newsletter writer', 'ai-newsletter-writer', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-email-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI sales email generator', 'ai-sales-email-generator', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-email-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI citation generator', 'ai-citation-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-essay-academic-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI essay writer', 'ai-essay-writer', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-essay-academic-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI literature review generator', 'ai-literature-review-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-essay-academic-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI research paper writer', 'ai-research-paper-writer', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-essay-academic-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI thesis writer', 'ai-thesis-writer', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-essay-academic-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI grammar checker', 'ai-grammar-checker', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-grammar-editing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI proofreader', 'ai-proofreader', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-grammar-editing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI readability enhancer', 'ai-readability-enhancer', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-grammar-editing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI spell checker', 'ai-spell-checker', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-grammar-editing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI style editor', 'ai-style-editor', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-grammar-editing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI bypass tool', 'ai-bypass-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-humanizers-anti-detection' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI stealth writer', 'ai-stealth-writer', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-humanizers-anti-detection' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI text humanizer', 'ai-text-humanizer', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-humanizers-anti-detection' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Undetectable AI writer', 'undetectable-ai-writer', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-humanizers-anti-detection' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI cover letter writer', 'ai-cover-letter-writer', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-resume-cv-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI CV generator', 'ai-cv-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-resume-cv-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI job application assistant', 'ai-job-application-assistant', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-resume-cv-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI LinkedIn summary generator', 'ai-linkedin-summary-generator', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-resume-cv-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI resume builder', 'ai-resume-builder', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-resume-cv-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI content spinner', 'ai-content-spinner', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-rewriters-paraphrasing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI paraphrasing tool', 'ai-paraphrasing-tool', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-rewriters-paraphrasing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI rewriter', 'ai-rewriter', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-rewriters-paraphrasing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI sentence rephraser', 'ai-sentence-rephraser', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-rewriters-paraphrasing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Facebook post generator', 'ai-facebook-post-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-social-media-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI hashtag generator', 'ai-hashtag-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-social-media-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Instagram caption generator', 'ai-instagram-caption-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-social-media-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI LinkedIn post writer', 'ai-linkedin-post-writer', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-social-media-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI TikTok script writer', 'ai-tiktok-script-writer', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-social-media-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI tweet generator', 'ai-tweet-generator', 5, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ai-social-media-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI character generator for writing', 'ai-character-generator-for-writing', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-story-fiction-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI fiction writer', 'ai-fiction-writer', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-story-fiction-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI novel writer', 'ai-novel-writer', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-story-fiction-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI screenplay writer', 'ai-screenplay-writer', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-story-fiction-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI script writer', 'ai-script-writer', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-story-fiction-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI story generator', 'ai-story-generator', 5, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ai-story-fiction-writers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI article summarizer', 'ai-article-summarizer', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-summarizers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI document summarizer', 'ai-document-summarizer', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-summarizers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI meeting summarizer', 'ai-meeting-summarizer', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-summarizers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI PDF summarizer', 'ai-pdf-summarizer', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-summarizers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI video summarizer', 'ai-video-summarizer', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-summarizers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI YouTube summarizer', 'ai-youtube-summarizer', 5, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ai-summarizers' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI document translator', 'ai-document-translator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-translation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI dubbing tool', 'ai-dubbing-tool', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-translation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI image translator', 'ai-image-translator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-translation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI multilingual content writer', 'ai-multilingual-content-writer', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-translation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI translator', 'ai-translator', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-translation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI video translator', 'ai-video-translator', 5, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ai-translation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI 3D avatar tool', 'ai-3d-avatar-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-avatars-digital-humans' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI digital twin', 'ai-digital-twin', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-avatars-digital-humans' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI virtual influencer', 'ai-virtual-influencer', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-avatars-digital-humans' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI character chat', 'ai-character-chat', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-characters-companions' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI companion app', 'ai-companion-app', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-characters-companions' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI roleplay chatbot', 'ai-roleplay-chatbot', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-characters-companions' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI virtual friend', 'ai-virtual-friend', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-characters-companions' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI companion for loneliness', 'ai-companion-for-loneliness', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-companionship-emotional-support' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI emotional support chatbot', 'ai-emotional-support-chatbot', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-companionship-emotional-support' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI venting companion', 'ai-venting-companion', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-companionship-emotional-support' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI assistant builder', 'ai-assistant-builder', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-chatbot-builders' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI custom GPT builder', 'ai-custom-gpt-builder', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-chatbot-builders' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI no-code chatbot platform', 'ai-no-code-chatbot-platform', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-chatbot-builders' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI chat widget', 'ai-chat-widget', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-chatbots-for-websites' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI customer FAQ bot', 'ai-customer-faq-bot', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-chatbots-for-websites' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI knowledge base chatbot', 'ai-knowledge-base-chatbot', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-chatbots-for-websites' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI companion chatbot', 'ai-companion-chatbot', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-conversational-agents' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI conversational AI', 'ai-conversational-ai', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-conversational-agents' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI digital employee', 'ai-digital-employee', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-conversational-agents' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI virtual agent', 'ai-virtual-agent', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-conversational-agents' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI WhatsApp assistant', 'ai-whatsapp-assistant', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-whatsapp-bots' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI WhatsApp automation', 'ai-whatsapp-automation', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-whatsapp-bots' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI WhatsApp chatbot', 'ai-whatsapp-chatbot', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-whatsapp-bots' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI WhatsApp marketing bot', 'ai-whatsapp-marketing-bot', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-whatsapp-bots' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI feedback analyzer', 'ai-feedback-analyzer', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-feedback-reviews' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI NPS analyzer', 'ai-nps-analyzer', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-feedback-reviews' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI review aggregator', 'ai-review-aggregator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-feedback-reviews' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI review response generator', 'ai-review-response-generator', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-feedback-reviews' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI email support tool', 'ai-email-support-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-helpdesk-ticketing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI helpdesk software', 'ai-helpdesk-software', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-helpdesk-ticketing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI support automation', 'ai-support-automation', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-helpdesk-ticketing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI ticket deflection', 'ai-ticket-deflection', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-helpdesk-ticketing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI agent coach', 'ai-agent-coach', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-support-training' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI call quality assurance', 'ai-call-quality-assurance', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-support-training' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI customer support trainer', 'ai-customer-support-trainer', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-support-training' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI call center automation', 'ai-call-center-automation', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-voice-support' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI inbound voice bot', 'ai-inbound-voice-bot', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-voice-support' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI IVR alternative', 'ai-ivr-alternative', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-voice-support' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI voice support agent', 'ai-voice-support-agent', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-voice-support' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI API', 'ai-api', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-apis-sdks' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI API aggregator', 'ai-api-aggregator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-apis-sdks' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI API gateway', 'ai-api-gateway', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-apis-sdks' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI inference endpoint', 'ai-inference-endpoint', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-apis-sdks' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI model API', 'ai-model-api', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-apis-sdks' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI MLOps platform', 'ai-mlops-platform', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-devops-mlops' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI model versioning', 'ai-model-versioning', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-devops-mlops' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI monitoring', 'ai-monitoring', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-devops-mlops' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI observability', 'ai-observability', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-devops-mlops' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI DNS assistant', 'ai-dns-assistant', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-domain-infrastructure-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI domain availability checker', 'ai-domain-availability-checker', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-domain-infrastructure-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI domain name finder', 'ai-domain-name-finder', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-domain-infrastructure-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI hosting assistant', 'ai-hosting-assistant', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-domain-infrastructure-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI GPU cloud', 'ai-gpu-cloud', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-hosting-inference' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI inference platform', 'ai-inference-platform', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-hosting-inference' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI model hosting', 'ai-model-hosting', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-hosting-inference' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI serverless AI', 'ai-serverless-ai', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-hosting-inference' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI embedding tool', 'ai-embedding-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-vector-dbs-rag' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI RAG framework', 'ai-rag-framework', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-vector-dbs-rag' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI retrieval system', 'ai-retrieval-system', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-vector-dbs-rag' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI vector database', 'ai-vector-database', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-vector-dbs-rag' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI app builder', 'ai-app-builder', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-app-builders' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI internal tool builder', 'ai-internal-tool-builder', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-app-builders' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI mobile app builder', 'ai-mobile-app-builder', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-app-builders' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI no-code app generator', 'ai-no-code-app-generator', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-app-builders' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI 2D game maker', 'ai-2d-game-maker', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-game-builders' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI story-driven game builder', 'ai-story-driven-game-builder', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-game-builders' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Android app tool', 'ai-android-app-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-mobile-app-publishing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Flutter assistant', 'ai-flutter-assistant', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-mobile-app-publishing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI iOS app tool', 'ai-ios-app-tool', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-mobile-app-publishing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI React Native assistant', 'ai-react-native-assistant', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-mobile-app-publishing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI low-code builder', 'ai-low-code-builder', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-no-code-low-code-platforms' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI visual development tool', 'ai-visual-development-tool', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-no-code-low-code-platforms' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI full-stack app generator', 'ai-full-stack-app-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-saas-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI MVP builder', 'ai-mvp-builder', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-saas-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI no-code website', 'ai-no-code-website', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-website-builders' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI web designer', 'ai-web-designer', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-website-builders' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI autocomplete for code', 'ai-autocomplete-for-code', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-code-completion' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Copilot alternative', 'ai-copilot-alternative', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-code-completion' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI inline coding tool', 'ai-inline-coding-tool', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-code-completion' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI framework converter', 'ai-framework-converter', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-code-converters' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI language-to-language translator', 'ai-language-to-language-translator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-code-converters' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI legacy code migrator', 'ai-legacy-code-migrator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-code-converters' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI changelog generator', 'ai-changelog-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-code-explanation-docs' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI code documentation generator', 'ai-code-documentation-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-code-explanation-docs' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI code explainer', 'ai-code-explainer', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-code-explanation-docs' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI commit message writer', 'ai-commit-message-writer', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-code-explanation-docs' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI code formatter', 'ai-code-formatter', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-code-optimization-testing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI code optimizer', 'ai-code-optimizer', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-code-optimization-testing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI code snippet finder', 'ai-code-snippet-finder', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-code-optimization-testing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI unit test generator', 'ai-unit-test-generator', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-code-optimization-testing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI bug finder', 'ai-bug-finder', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-code-review-debug' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI code review tool', 'ai-code-review-tool', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-code-review-debug' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI debugger', 'ai-debugger', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-code-review-debug' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI pull request reviewer', 'ai-pull-request-reviewer', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-code-review-debug' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI autonomous developer', 'ai-autonomous-developer', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-coding-agents' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI multi-file editor', 'ai-multi-file-editor', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-coding-agents' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI pair programmer', 'ai-pair-programmer', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-coding-agents' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI coding environment', 'ai-coding-environment', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-ides-editors' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI IDE', 'ai-ide', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-ides-editors' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI terminal assistant', 'ai-terminal-assistant', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-ides-editors' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI-native code editor', 'ai-native-code-editor', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-ides-editors' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI git commit message generator', 'ai-git-commit-message-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-regex-git-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI git diff explainer', 'ai-git-diff-explainer', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-regex-git-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI merge conflict resolver', 'ai-merge-conflict-resolver', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-regex-git-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI regex explainer', 'ai-regex-explainer', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-regex-git-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI regex generator', 'ai-regex-generator', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-regex-git-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI database Q&A', 'ai-database-q-a', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-sql-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI natural language to SQL', 'ai-natural-language-to-sql', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-sql-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI query builder', 'ai-query-builder', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-sql-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI conversational coding', 'ai-conversational-coding', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-vibe-coding-platforms' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI English-to-code platform', 'ai-english-to-code-platform', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-vibe-coding-platforms' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI generative app builder', 'ai-generative-app-builder', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-vibe-coding-platforms' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI prompt-to-app tool', 'ai-prompt-to-app-tool', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-vibe-coding-platforms' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI deepfake detector', 'ai-deepfake-detector', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-identity-auth' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI fraud detection', 'ai-fraud-detection', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-identity-auth' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI identity verification', 'ai-identity-verification', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-identity-auth' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI KYC tool', 'ai-kyc-tool', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-identity-auth' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI data redaction tool', 'ai-data-redaction-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-privacy-encryption' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI encrypted messaging', 'ai-encrypted-messaging', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-privacy-encryption' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI privacy scanner', 'ai-privacy-scanner', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-privacy-encryption' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI phishing detector', 'ai-phishing-detector', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-security-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI threat detection', 'ai-threat-detection', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-security-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI vulnerability scanner', 'ai-vulnerability-scanner', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-security-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI chat with data', 'ai-chat-with-data', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-data-analytics' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI data exploration tool', 'ai-data-exploration-tool', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-data-analytics' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI data cleaning', 'ai-data-cleaning', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-data-cleaning-prep' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI data preparation', 'ai-data-preparation', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-data-cleaning-prep' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI data wrangling', 'ai-data-wrangling', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-data-cleaning-prep' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI ETL tool', 'ai-etl-tool', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-data-cleaning-prep' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI data extraction', 'ai-data-extraction', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-data-extraction-scraping' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI document parser', 'ai-document-parser', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-data-extraction-scraping' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI PDF data extractor', 'ai-pdf-data-extractor', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-data-extraction-scraping' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI AutoML', 'ai-automl', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-data-science-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI model training tool', 'ai-model-training-tool', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-data-science-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI no-code ML', 'ai-no-code-ml', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-data-science-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI curriculum builder', 'ai-curriculum-builder', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-course-builders' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI lesson generator', 'ai-lesson-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-course-builders' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI assessment generator', 'ai-assessment-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-educational-content' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI workbook generator', 'ai-workbook-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-educational-content' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI worksheet generator', 'ai-worksheet-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-educational-content' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI classroom management', 'ai-classroom-management', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-tools-for-educators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI lesson planner', 'ai-lesson-planner', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-tools-for-educators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI rubric generator', 'ai-rubric-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-tools-for-educators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI teacher assistant', 'ai-teacher-assistant', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-tools-for-educators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI English tutor', 'ai-english-tutor', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-language-tutors' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Mandarin tutor', 'ai-mandarin-tutor', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-language-tutors' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI multilingual AI tutor', 'ai-multilingual-ai-tutor', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-language-tutors' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Spanish tutor', 'ai-spanish-tutor', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-language-tutors' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI accessibility tutor', 'ai-accessibility-tutor', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-sign-language-accessibility-learning' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI sign language learning', 'ai-sign-language-learning', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-sign-language-accessibility-learning' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI sign language translator', 'ai-sign-language-translator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-sign-language-accessibility-learning' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI accent training', 'ai-accent-training', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-sign-language-accessibility-learning' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI conversation practice', 'ai-conversation-practice', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-sign-language-accessibility-learning' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI pronunciation coach', 'ai-pronunciation-coach', 5, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ai-sign-language-accessibility-learning' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI class assistant', 'ai-class-assistant', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-note-tools-for-students' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI lecture note taker', 'ai-lecture-note-taker', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-note-tools-for-students' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI lecture summarizer', 'ai-lecture-summarizer', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-note-tools-for-students' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI study notes generator', 'ai-study-notes-generator', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-note-tools-for-students' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI grading assistant', 'ai-grading-assistant', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-quiz-assessment' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI exam prep tool', 'ai-exam-prep-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-study-aids' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI flashcard generator', 'ai-flashcard-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-study-aids' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI quiz generator', 'ai-quiz-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-study-aids' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI study plan maker', 'ai-study-plan-maker', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-study-aids' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI coding tutor', 'ai-coding-tutor', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-tutors' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI homework helper', 'ai-homework-helper', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-tutors' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI math tutor', 'ai-math-tutor', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-tutors' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI plagiarism checker', 'ai-plagiarism-checker', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-citation-plagiarism' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI reference manager', 'ai-reference-manager', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-citation-plagiarism' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI academic writing assistant', 'ai-academic-writing-assistant', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-research-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI literature search', 'ai-literature-search', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-research-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI paper summarizer', 'ai-paper-summarizer', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-research-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI biology assistant', 'ai-biology-assistant', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-science-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI chemistry assistant', 'ai-chemistry-assistant', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-science-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI scientific computing', 'ai-scientific-computing', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-science-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI closed-caption tool', 'ai-closed-caption-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-for-accessibility' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI screen reader', 'ai-screen-reader', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-for-accessibility' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI visual description tool', 'ai-visual-description-tool', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-for-accessibility' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI assistive communication', 'ai-assistive-communication', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-for-disabilities' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI lip-reading tool', 'ai-lip-reading-tool', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-for-disabilities' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI astrology reader', 'ai-astrology-reader', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-astrology' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI birth chart analysis', 'ai-birth-chart-analysis', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-astrology' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI horoscope generator', 'ai-horoscope-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-astrology' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Bible assistant', 'ai-bible-assistant', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-religious-spiritual' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI prayer generator', 'ai-prayer-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-religious-spiritual' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI religious Q&A', 'ai-religious-q-a', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-religious-spiritual' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI spiritual coach', 'ai-spiritual-coach', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-religious-spiritual' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI dream interpreter', 'ai-dream-interpreter', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-tarot-divination' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI oracle card AI', 'ai-oracle-card-ai', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-tarot-divination' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI tarot card AI', 'ai-tarot-card-ai', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-tarot-divination' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI tarot reader', 'ai-tarot-reader', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-tarot-divination' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI dating app photo tool', 'ai-dating-app-photo-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-dating-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI dating profile writer', 'ai-dating-profile-writer', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-dating-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI first-message generator', 'ai-first-message-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-dating-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI flirt coach', 'ai-flirt-coach', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-dating-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI communication coach', 'ai-communication-coach', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-dating-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI couples therapy chatbot', 'ai-couples-therapy-chatbot', 5, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ai-dating-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI relationship coach', 'ai-relationship-coach', 5, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'ai-dating-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI beauty advisor', 'ai-beauty-advisor', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-beauty-grooming' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI facial analysis', 'ai-facial-analysis', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-beauty-grooming' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI makeup try-on', 'ai-makeup-try-on', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-beauty-grooming' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI skincare analyzer', 'ai-skincare-analyzer', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-beauty-grooming' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI personal stylist', 'ai-personal-stylist', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-styling' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI wardrobe assistant', 'ai-wardrobe-assistant', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-styling' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI joke generator', 'ai-joke-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-creative-fun' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI personality quiz', 'ai-personality-quiz', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-creative-fun' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI this-does-not-exist', 'ai-this-does-not-exist', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-creative-fun' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI trivia generator', 'ai-trivia-generator', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-creative-fun' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI DnD assistant', 'ai-dnd-assistant', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-gaming-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI game coach', 'ai-game-coach', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-gaming-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI game companion', 'ai-game-companion', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-gaming-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI NPC generator', 'ai-npc-generator', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-gaming-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI betting analysis', 'ai-betting-analysis', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-sports-fantasy' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI game prediction', 'ai-game-prediction', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-sports-fantasy' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI sports analytics', 'ai-sports-analytics', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-sports-fantasy' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI choose-your-own-adventure', 'ai-choose-your-own-adventure', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-sports-fantasy' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI improv partner', 'ai-improv-partner', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-sports-fantasy' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI philosophical chat companion', 'ai-philosophical-chat-companion', 5, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ai-sports-fantasy' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI tabletop RPG game master', 'ai-tabletop-rpg-game-master', 5, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'ai-sports-fantasy' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI text adventure generator', 'ai-text-adventure-generator', 5, id, '#8B5CF6', 1, 1, 1, 80
  FROM categories WHERE slug = 'ai-sports-fantasy' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI fitness coach', 'ai-fitness-coach', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-fitness' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI gym plan generator', 'ai-gym-plan-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-fitness' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI personal trainer', 'ai-personal-trainer', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-fitness' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI workout generator', 'ai-workout-generator', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-fitness' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI medication reminder', 'ai-medication-reminder', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-medical-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI symptom checker', 'ai-symptom-checker', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-medical-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI mental health chatbot', 'ai-mental-health-chatbot', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-mental-wellness' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI mood tracker', 'ai-mood-tracker', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-mental-wellness' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI therapist', 'ai-therapist', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-mental-wellness' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI calorie tracker', 'ai-calorie-tracker', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-nutrition' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI diet coach', 'ai-diet-coach', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-nutrition' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI meal planner', 'ai-meal-planner', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-nutrition' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI nutrition tracker', 'ai-nutrition-tracker', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-nutrition' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI recipe generator', 'ai-recipe-generator', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-nutrition' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI cooking assistant', 'ai-cooking-assistant', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-cooking-recipes' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI fridge-to-recipe', 'ai-fridge-to-recipe', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-cooking-recipes' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI grocery list maker', 'ai-grocery-list-maker', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-cooking-recipes' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI garden planner', 'ai-garden-planner', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-gardening-plants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI plant care tool', 'ai-plant-care-tool', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-gardening-plants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI plant identifier', 'ai-plant-identifier', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-gardening-plants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI personalized gift finder', 'ai-personalized-gift-finder', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-gift-ideas' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI wedding gift ideas', 'ai-wedding-gift-ideas', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-gift-ideas' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI home renovation planner', 'ai-home-renovation-planner', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-home-design' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI homework helper for parents', 'ai-homework-helper-for-parents', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-parenting-kids' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI kids story generator', 'ai-kids-story-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-parenting-kids' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI parenting assistant', 'ai-parenting-assistant', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-parenting-kids' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI safe AI for kids', 'ai-safe-ai-for-kids', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-parenting-kids' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI dog breed identifier', 'ai-dog-breed-identifier', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-parenting-kids' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI pet health checker', 'ai-pet-health-checker', 5, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ai-parenting-kids' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI pet training assistant', 'ai-pet-training-assistant', 5, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'ai-parenting-kids' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI job advice AI', 'ai-job-advice-ai', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-career-coaches' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI mentorship chatbot', 'ai-mentorship-chatbot', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-career-coaches' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI self-improvement assistant', 'ai-self-improvement-assistant', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-career-coaches' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI local recommendation', 'ai-local-recommendation', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-travel-experience' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI translator for travel', 'ai-translator-for-travel', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-travel-experience' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI travel guide', 'ai-travel-guide', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-travel-experience' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI travel photo tool', 'ai-travel-photo-tool', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-travel-experience' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI hotel finder', 'ai-hotel-finder', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-travel-planners' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI itinerary generator', 'ai-itinerary-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-travel-planners' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI trip assistant', 'ai-trip-assistant', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-travel-planners' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI auto-fill tool', 'ai-auto-fill-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-browser-automation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI browser agent', 'ai-browser-agent', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-browser-automation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI form filler', 'ai-form-filler', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-browser-automation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI web scraping tool', 'ai-web-scraping-tool', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-browser-automation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI auto-responder', 'ai-auto-responder', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-email-communication-automation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI email automation', 'ai-email-automation', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-email-communication-automation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI email classifier', 'ai-email-classifier', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-email-communication-automation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI email triage tool', 'ai-email-triage-tool', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-email-communication-automation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI bash generator', 'ai-bash-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-scripting-macros' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI macro generator', 'ai-macro-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-scripting-macros' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI script writer for automation', 'ai-script-writer-for-automation', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-scripting-macros' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI SOP generator', 'ai-sop-generator', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-scripting-macros' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI internal workflow builder', 'ai-internal-workflow-builder', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-workflow-automation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Make alternative', 'ai-make-alternative', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-workflow-automation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI no-code automation', 'ai-no-code-automation', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-workflow-automation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Zapier alternative', 'ai-zapier-alternative', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-workflow-automation' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI collaborative doc editor', 'ai-collaborative-doc-editor', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-document-editing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI document editor', 'ai-document-editor', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-document-editing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI markdown editor', 'ai-markdown-editor', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-document-editing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI real-time editor', 'ai-real-time-editor', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-document-editing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI policy writer', 'ai-policy-writer', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-document-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI proposal generator', 'ai-proposal-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-document-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI report generator', 'ai-report-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-document-generators' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI content tagger', 'ai-content-tagger', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-file-management' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI document classifier', 'ai-document-classifier', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-file-management' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI file organizer', 'ai-file-organizer', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-file-management' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI file renamer', 'ai-file-renamer', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-file-management' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI file search', 'ai-file-search', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-file-management' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI feedback form maker', 'ai-feedback-form-maker', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-forms-surveys' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI form builder', 'ai-form-builder', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-forms-surveys' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI questionnaire builder', 'ai-questionnaire-builder', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-forms-surveys' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI survey generator', 'ai-survey-generator', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-forms-surveys' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI web form generator', 'ai-web-form-generator', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-forms-surveys' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI 2FA assistant', 'ai-2fa-assistant', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-password-security' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI encrypted notes', 'ai-encrypted-notes', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-password-security' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI password manager', 'ai-password-manager', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-password-security' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI secure vault', 'ai-secure-vault', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-password-security' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI PDF chat', 'ai-pdf-chat', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-pdf-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI PDF editor', 'ai-pdf-editor', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-pdf-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI PDF extractor', 'ai-pdf-extractor', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-pdf-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI PDF scraper', 'ai-pdf-scraper', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-pdf-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI PDF translator', 'ai-pdf-translator', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-pdf-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI data cleanup tool', 'ai-data-cleanup-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-spreadsheets-data-entry' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Excel formula generator', 'ai-excel-formula-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-spreadsheets-data-entry' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Google Sheets AI', 'ai-google-sheets-ai', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-spreadsheets-data-entry' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI spreadsheet assistant', 'ai-spreadsheet-assistant', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-spreadsheets-data-entry' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI spreadsheet automation', 'ai-spreadsheet-automation', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-spreadsheets-data-entry' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI FAQ generator', 'ai-faq-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-knowledge-bases-wikis' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI internal documentation tool', 'ai-internal-documentation-tool', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-knowledge-bases-wikis' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI knowledge base builder', 'ai-knowledge-base-builder', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-knowledge-bases-wikis' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI team wiki', 'ai-team-wiki', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-knowledge-bases-wikis' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI wiki generator', 'ai-wiki-generator', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-knowledge-bases-wikis' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI desktop activity recall', 'ai-desktop-activity-recall', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-memory-recall' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI history search', 'ai-history-search', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-memory-recall' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI memory assistant', 'ai-memory-assistant', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-memory-recall' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI recall tool', 'ai-recall-tool', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-memory-recall' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI brainstorming canvas', 'ai-brainstorming-canvas', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-mind-mapping' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI concept map tool', 'ai-concept-map-tool', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-mind-mapping' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI diagram generator', 'ai-diagram-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-mind-mapping' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI mind map generator', 'ai-mind-map-generator', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-mind-mapping' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI idea connector', 'ai-idea-connector', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-pkm-second-brain' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI note linking tool', 'ai-note-linking-tool', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-pkm-second-brain' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI personal knowledge management', 'ai-personal-knowledge-management', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-pkm-second-brain' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI second brain app', 'ai-second-brain-app', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-pkm-second-brain' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Zettelkasten app', 'ai-zettelkasten-app', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-pkm-second-brain' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI collaborative sketchpad', 'ai-collaborative-sketchpad', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-whiteboard-collaboration' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI infinite canvas', 'ai-infinite-canvas', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-whiteboard-collaboration' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI visual collaboration', 'ai-visual-collaboration', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-whiteboard-collaboration' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI whiteboard app', 'ai-whiteboard-app', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-whiteboard-collaboration' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI calendar assistant', 'ai-calendar-assistant', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-calendar-time' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI daily planner', 'ai-daily-planner', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-calendar-time' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI reminder app', 'ai-reminder-app', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-calendar-time' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI time blocking tool', 'ai-time-blocking-tool', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-calendar-time' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI ambient sound app', 'ai-ambient-sound-app', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-focus-deep-work' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI deep work assistant', 'ai-deep-work-assistant', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-focus-deep-work' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI distraction blocker', 'ai-distraction-blocker', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-focus-deep-work' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI focus app', 'ai-focus-app', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-focus-deep-work' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI pomodoro timer', 'ai-pomodoro-timer', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-focus-deep-work' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI goal tracker', 'ai-goal-tracker', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-habit-tracking' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI habit tracker', 'ai-habit-tracker', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-habit-tracking' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI routine builder', 'ai-routine-builder', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-habit-tracking' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI streak tracker', 'ai-streak-tracker', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-habit-tracking' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI daily prompts generator', 'ai-daily-prompts-generator', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-journaling' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI mood journal', 'ai-mood-journal', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-journaling' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI reflection assistant', 'ai-reflection-assistant', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-journaling' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI call recorder', 'ai-call-recorder', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-meeting-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Google Meet notetaker', 'ai-google-meet-notetaker', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-meeting-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI meeting notes generator', 'ai-meeting-notes-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-meeting-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI meeting summary', 'ai-meeting-summary', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-meeting-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Zoom transcriber', 'ai-zoom-transcriber', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-meeting-assistants' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI appointment booker', 'ai-appointment-booker', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-meeting-scheduling' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI availability finder', 'ai-availability-finder', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-meeting-scheduling' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Calendly alternative', 'ai-calendly-alternative', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-meeting-scheduling' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI meeting scheduler', 'ai-meeting-scheduler', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-meeting-scheduling' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI breathing coach', 'ai-breathing-coach', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-mindfulness-wellbeing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI burnout prevention tool', 'ai-burnout-prevention-tool', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-mindfulness-wellbeing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI mindful productivity app', 'ai-mindful-productivity-app', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-mindfulness-wellbeing' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI knowledge capture', 'ai-knowledge-capture', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-note-taking' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI lecture note generator', 'ai-lecture-note-generator', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-note-taking' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI note taker', 'ai-note-taker', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-note-taking' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Notion AI alternative', 'ai-notion-ai-alternative', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-note-taking' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI voice notes', 'ai-voice-notes', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-note-taking' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI agile/scrum tool', 'ai-agile-scrum-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-task-project-management' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Gantt chart tool', 'ai-gantt-chart-tool', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-task-project-management' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI kanban tool', 'ai-kanban-tool', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-task-project-management' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI project manager', 'ai-project-manager', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-task-project-management' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI sprint planner', 'ai-sprint-planner', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-task-project-management' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI task scheduler', 'ai-task-scheduler', 5, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ai-task-project-management' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI to-do list', 'ai-to-do-list', 5, id, '#8B5CF6', 1, 1, 1, 70
  FROM categories WHERE slug = 'ai-task-project-management' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI automatic time logger', 'ai-automatic-time-logger', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-time-tracking' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI freelancer time billing', 'ai-freelancer-time-billing', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-time-tracking' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI time tracker', 'ai-time-tracker', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-time-tracking' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI work hours tracker', 'ai-work-hours-tracker', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-time-tracking' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI all-in-one workspace', 'ai-all-in-one-workspace', 5, id, '#8B5CF6', 1, 1, 1, 50
  FROM categories WHERE slug = 'ai-time-tracking' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI task organizer', 'ai-task-organizer', 5, id, '#8B5CF6', 1, 1, 1, 60
  FROM categories WHERE slug = 'ai-time-tracking' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI client management for freelancers', 'ai-client-management-for-freelancers', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-freelancer-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI freelancer invoicing', 'ai-freelancer-invoicing', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-freelancer-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI freelancer productivity', 'ai-freelancer-productivity', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-freelancer-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI async collaboration tool', 'ai-async-collaboration-tool', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-remote-work-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI distributed team software', 'ai-distributed-team-software', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-remote-work-tools' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI collaborative email', 'ai-collaborative-email', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-shared-inbox' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI team email tool', 'ai-team-email-tool', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-shared-inbox' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI async messaging', 'ai-async-messaging', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-team-communication' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Slack alternative', 'ai-slack-alternative', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-team-communication' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI status update generator', 'ai-status-update-generator', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-team-communication' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI team chat', 'ai-team-chat', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-team-communication' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI browser extension', 'ai-browser-extension', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-chrome-extensions' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Chrome extension', 'ai-chrome-extension', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-chrome-extensions' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Edge extension', 'ai-edge-extension', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-chrome-extensions' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Firefox extension', 'ai-firefox-extension', 5, id, '#8B5CF6', 1, 1, 1, 40
  FROM categories WHERE slug = 'ai-chrome-extensions' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI answer engine', 'ai-answer-engine', 5, id, '#8B5CF6', 1, 1, 1, 10
  FROM categories WHERE slug = 'ai-search-engines' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI enterprise search', 'ai-enterprise-search', 5, id, '#8B5CF6', 1, 1, 1, 20
  FROM categories WHERE slug = 'ai-search-engines' AND level = 4 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI research search tool', 'ai-research-search-tool', 5, id, '#8B5CF6', 1, 1, 1, 30
  FROM categories WHERE slug = 'ai-search-engines' AND level = 4 LIMIT 1;

-- ═══ Section E: Re-enable FKs ═════════════════════════════════
SET FOREIGN_KEY_CHECKS = 1;

-- ═══ Section F: Re-attach existing AI&ML submissions ══════════
-- 6 live AI&ML listings, all previously under
--   "All-Purpose AI Chat Companions" (old slug)
-- See exports/aiml-listing-mapping-notes.md for the reasoning.
-- Each UPDATE re-binds one submission to a new DB L5 category by slug.

-- id=24 Claude
UPDATE submissions
   SET category_id = (SELECT id FROM categories WHERE slug = 'ai-chat-assistant' AND level = 5 LIMIT 1)
 WHERE id = 24;

-- id=25 ChatGPT
UPDATE submissions
   SET category_id = (SELECT id FROM categories WHERE slug = 'ai-general-purpose-chatbot' AND level = 5 LIMIT 1)
 WHERE id = 25;

-- id=26 Gemini
UPDATE submissions
   SET category_id = (SELECT id FROM categories WHERE slug = 'multimodal-llm' AND level = 5 LIMIT 1)
 WHERE id = 26;

-- id=27 Microsoft Copilot
UPDATE submissions
   SET category_id = (SELECT id FROM categories WHERE slug = 'ai-chat-assistant' AND level = 5 LIMIT 1)
 WHERE id = 27;

-- id=28 Perplexity
UPDATE submissions
   SET category_id = (SELECT id FROM categories WHERE slug = 'ai-answer-engine' AND level = 5 LIMIT 1)
 WHERE id = 28;

-- id=31 DeepSeek
UPDATE submissions
   SET category_id = (SELECT id FROM categories WHERE slug = 'open-source-llm' AND level = 5 LIMIT 1)
 WHERE id = 31;

-- Verification (read-only) — should return 6 rows, no NULLs in category_id:
-- SELECT s.id, s.company_name, s.category_id, c.slug AS new_slug, c.level
--   FROM submissions s
--   LEFT JOIN categories c ON c.id = s.category_id
--  WHERE s.id IN (24, 25, 26, 27, 28, 31);
