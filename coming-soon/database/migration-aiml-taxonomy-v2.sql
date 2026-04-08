-- AI & ML Taxonomy Migration V2: 43 L2 + 1298 L3
-- Run in phpMyAdmin ONE SECTION AT A TIME
-- Back up the categories table before running!

-- ═══ STEP 1: Delete orphaned SEO content for old AI&ML L2/L3 ═══

DELETE sc FROM category_seo_content sc
JOIN categories c ON c.id = sc.category_id
WHERE c.level IN (2, 3)
AND c.id IN (
  SELECT id FROM (
    SELECT c2.id FROM categories c2 WHERE c2.level = 2 AND c2.parent_id = (SELECT id FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1)
    UNION
    SELECT c3.id FROM categories c3 JOIN categories c2 ON c3.parent_id = c2.id WHERE c2.level = 2 AND c2.parent_id = (SELECT id FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1)
  ) AS ids
);

-- ═══ STEP 2: Nullify submission category_id for AI&ML (preserves listings) ═══

UPDATE submissions SET category_id = NULL
WHERE category_id IN (
  SELECT id FROM (
    SELECT c3.id FROM categories c3 JOIN categories c2 ON c3.parent_id = c2.id WHERE c2.parent_id = (SELECT id FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1)
    UNION
    SELECT c2.id FROM categories c2 WHERE c2.parent_id = (SELECT id FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1)
  ) AS ids
);

-- ═══ STEP 3: Delete listing types for old AI&ML L3s ═══

DELETE lt FROM listing_types lt
JOIN categories c3 ON lt.category_id = c3.id
JOIN categories c2 ON c3.parent_id = c2.id
WHERE c2.parent_id = (SELECT id FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1);

-- ═══ STEP 4: Delete old L3 categories ═══

DELETE FROM categories WHERE level = 3 AND parent_id IN (
  SELECT id FROM (SELECT c2.id FROM categories c2 WHERE c2.level = 2 AND c2.parent_id = (SELECT id FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1)) AS ids
);

-- ═══ STEP 5: Delete old L2 categories ═══

DELETE FROM categories WHERE level = 2 AND parent_id = (SELECT id FROM (SELECT id FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1) AS tmp);

-- ═══ STEP 6: Insert 43 new L2 categories ═══

INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Assistants & Chatbots', 'ai-assistants-chatbots', 2, id, 1, 1, 1, 10
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Writing & Long-Form Text', 'ai-writing-long-form-text', 2, id, 1, 1, 1, 20
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Paraphrasing, Summarization & Translation', 'ai-paraphrasing-summarization-translation', 2, id, 1, 1, 1, 30
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Image Generation', 'ai-image-generation', 2, id, 1, 1, 1, 40
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Photo Editing & Enhancement', 'ai-photo-editing-enhancement', 2, id, 1, 1, 1, 50
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Video Generation', 'ai-video-generation', 2, id, 1, 1, 1, 60
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Video Editing & Post-Production', 'ai-video-editing-post-production', 2, id, 1, 1, 1, 70
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Audio Generation & Music', 'ai-audio-generation-music', 2, id, 1, 1, 1, 80
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Voice & Speech', 'ai-voice-speech', 2, id, 1, 1, 1, 90
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Code & Developer Tools', 'ai-code-developer-tools', 2, id, 1, 1, 1, 100
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Agent Frameworks & Infrastructure', 'ai-agent-frameworks-infrastructure', 2, id, 1, 1, 1, 110
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI No-Code & App Builders', 'ai-no-code-app-builders', 2, id, 1, 1, 1, 120
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Productivity & Personal Workflow', 'ai-productivity-personal-workflow', 2, id, 1, 1, 1, 130
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Meeting & Collaboration', 'ai-meeting-collaboration', 2, id, 1, 1, 1, 140
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Email & Inbox', 'ai-email-inbox', 2, id, 1, 1, 1, 150
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Search, Research & Knowledge', 'ai-search-research-knowledge', 2, id, 1, 1, 1, 160
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Data Analysis & BI', 'ai-data-analysis-bi', 2, id, 1, 1, 1, 170
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Marketing & Growth', 'ai-marketing-growth', 2, id, 1, 1, 1, 180
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI SEO & Discoverability', 'ai-seo-discoverability', 2, id, 1, 1, 1, 190
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Social Media', 'ai-social-media', 2, id, 1, 1, 1, 200
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Sales & Outreach', 'ai-sales-outreach', 2, id, 1, 1, 1, 210
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Customer Support', 'ai-customer-support', 2, id, 1, 1, 1, 220
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Finance & Accounting', 'ai-finance-accounting', 2, id, 1, 1, 1, 230
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Legal & Contracts', 'ai-legal-contracts', 2, id, 1, 1, 1, 240
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI HR, Recruiting & Careers', 'ai-hr-recruiting-careers', 2, id, 1, 1, 1, 250
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Education & Tutoring', 'ai-education-tutoring', 2, id, 1, 1, 1, 260
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Healthcare & Medical', 'ai-healthcare-medical', 2, id, 1, 1, 1, 270
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Fitness, Nutrition & Wellness', 'ai-fitness-nutrition-wellness', 2, id, 1, 1, 1, 280
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Lifestyle, Relationships & Personal', 'ai-lifestyle-relationships-personal', 2, id, 1, 1, 1, 290
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Travel & Local Discovery', 'ai-travel-local-discovery', 2, id, 1, 1, 1, 300
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Real Estate & Property', 'ai-real-estate-property', 2, id, 1, 1, 1, 310
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI eCommerce & Retail', 'ai-ecommerce-retail', 2, id, 1, 1, 1, 320
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Gaming & Game Dev', 'ai-gaming-game-dev', 2, id, 1, 1, 1, 330
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI 3D, AR & Spatial Computing', 'ai-3d-ar-spatial-computing', 2, id, 1, 1, 1, 340
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Design, Branding & Creative', 'ai-design-branding-creative', 2, id, 1, 1, 1, 350
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Document, PDF & Forms', 'ai-document-pdf-forms', 2, id, 1, 1, 1, 360
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cybersecurity & Privacy', 'ai-cybersecurity-privacy', 2, id, 1, 1, 1, 370
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Safety, Ethics & Trust', 'ai-safety-ethics-trust', 2, id, 1, 1, 1, 380
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Agents & Autonomous Systems', 'ai-agents-autonomous-systems', 2, id, 1, 1, 1, 390
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Hardware, Robotics & Embedded', 'ai-hardware-robotics-embedded', 2, id, 1, 1, 1, 400
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Vertical Industries', 'ai-for-vertical-industries', 2, id, 1, 1, 1, 410
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Accessibility & Inclusion', 'ai-accessibility-inclusion', 2, id, 1, 1, 1, 420
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Fun, Novelty & Entertainment', 'ai-fun-novelty-entertainment', 2, id, 1, 1, 1, 430
FROM categories WHERE slug = 'artificial-intelligence-ml' AND level = 1;

-- ═══ STEP 7: Insert 1298 new L3 subcategories ═══

-- AI Assistants & Chatbots (40 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'All-Purpose AI Chat Companions', 'all-purpose-ai-chat-companions', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Reasoning-Heavy Chat Models', 'reasoning-heavy-chat-models', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Multimodal Chat Interfaces', 'multimodal-chat-interfaces', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Free Open-Access Chatbots', 'free-open-access-chatbots', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Privacy-First Chat Apps', 'privacy-first-chat-apps', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'On-Device Chat Assistants', 'on-device-chat-assistants', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Multilingual Chat Interfaces', 'multilingual-chat-interfaces', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Children-Safe Chat Apps', 'children-safe-chat-apps', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Senior-Friendly Chat Apps', 'senior-friendly-chat-apps', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Chatbots for WhatsApp Business', 'chatbots-for-whatsapp-business', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Chatbots for Telegram Channels', 'chatbots-for-telegram-channels', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Chatbots for Discord Servers', 'chatbots-for-discord-servers', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Chatbots for Slack Workspaces', 'chatbots-for-slack-workspaces', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Chatbots for Microsoft Teams', 'chatbots-for-microsoft-teams', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Chatbots for SMS Texting', 'chatbots-for-sms-texting', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Chatbots for iMessage', 'chatbots-for-imessage', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Chatbots for Email Threads', 'chatbots-for-email-threads', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Chatbots for Website Embeds', 'chatbots-for-website-embeds', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Drag-and-Drop Bot Builders', 'drag-and-drop-bot-builders', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Visual Flow Bot Designers', 'visual-flow-bot-designers', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Knowledge-Grounded Q&A Bots', 'knowledge-grounded-qa-bots', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'FAQ Auto-Reply Bots', 'faq-auto-reply-bots', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lead-Capture Web Bots', 'lead-capture-web-bots', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Appointment-Booking Bots', 'appointment-booking-bots', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Order-Taking Bots for Restaurants', 'order-taking-bots-for-restaurants', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Healthcare Intake Bots', 'healthcare-intake-bots', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Insurance Quote Bots', 'insurance-quote-bots', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Banking Inquiry Bots', 'banking-inquiry-bots', 3, id, 1, 1, 1, 280
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Inquiry Bots', 'real-estate-inquiry-bots', 3, id, 1, 1, 1, 290
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Education Q&A Bots', 'education-qa-bots', 3, id, 1, 1, 1, 300
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Voice-First Phone Agents', 'voice-first-phone-agents', 3, id, 1, 1, 1, 310
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Inbound Call Handling Agents', 'inbound-call-handling-agents', 3, id, 1, 1, 1, 320
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Outbound Cold-Call Agents', 'outbound-cold-call-agents', 3, id, 1, 1, 1, 330
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Receptionist Voice Agents', 'receptionist-voice-agents', 3, id, 1, 1, 1, 340
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Drive-Thru Voice Agents', 'drive-thru-voice-agents', 3, id, 1, 1, 1, 350
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'IVR Replacement Agents', 'ivr-replacement-agents', 3, id, 1, 1, 1, 360
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Virtual Front-Desk Agents', 'virtual-front-desk-agents', 3, id, 1, 1, 1, 370
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Smart Speaker Skills (Category)', 'smart-speaker-skills-category', 3, id, 1, 1, 1, 380
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'In-Car Voice Assistants', 'in-car-voice-assistants', 3, id, 1, 1, 1, 390
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wearable Voice Assistants', 'wearable-voice-assistants', 3, id, 1, 1, 1, 400
FROM categories WHERE slug = 'ai-assistants-chatbots' AND level = 2;

-- AI Writing & Long-Form Text (54 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'All-In-One Writing Suites', 'all-in-one-writing-suites', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Distraction-Free AI Editors', 'distraction-free-ai-editors', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Browser-Based Writing Pads', 'browser-based-writing-pads', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile Writing Apps with AI', 'mobile-writing-apps-with-ai', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Google Docs', 'ai-for-google-docs', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Microsoft Word', 'ai-for-microsoft-word', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Notion Pages', 'ai-for-notion-pages', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Obsidian Vaults', 'ai-for-obsidian-vaults', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Long-Form Article Drafting', 'long-form-article-drafting', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'SEO Blog Post Drafting', 'seo-blog-post-drafting', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Listicle Generators', 'listicle-generators', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'How-To Guide Generators', 'how-to-guide-generators', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tutorial Article Builders', 'tutorial-article-builders', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Roundup Post Generators', 'roundup-post-generators', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Comparison Post Builders', 'comparison-post-builders', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Case Study Drafting', 'case-study-drafting', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'White Paper Drafting', 'white-paper-drafting', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'eBook Outlining & Drafting', 'ebook-outlining-drafting', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Newsletter Issue Drafting', 'newsletter-issue-drafting', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Email Course Drafting', 'email-course-drafting', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Memoir & Life-Story Drafting', 'memoir-life-story-drafting', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wedding Speech Generators', 'wedding-speech-generators', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Eulogy Drafting Helpers', 'eulogy-drafting-helpers', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Best-Man Speech Helpers', 'best-man-speech-helpers', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Toast & Roast Writers', 'toast-roast-writers', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cover Letter Drafting', 'cover-letter-drafting', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Personal Statement Writers', 'personal-statement-writers', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'College Application Essay Helpers', 'college-application-essay-helpers', 3, id, 1, 1, 1, 280
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Scholarship Essay Helpers', 'scholarship-essay-helpers', 3, id, 1, 1, 1, 290
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Statement of Purpose Drafting', 'statement-of-purpose-drafting', 3, id, 1, 1, 1, 300
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'LinkedIn Headline Writers', 'linkedin-headline-writers', 3, id, 1, 1, 1, 310
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'LinkedIn About-Section Writers', 'linkedin-about-section-writers', 3, id, 1, 1, 1, 320
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bio Drafting for Bios & Press Kits', 'bio-drafting-for-bios-press-kits', 3, id, 1, 1, 1, 330
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Author Bio Generators', 'author-bio-generators', 3, id, 1, 1, 1, 340
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Twitter Bio Generators', 'twitter-bio-generators', 3, id, 1, 1, 1, 350
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Instagram Bio Generators', 'instagram-bio-generators', 3, id, 1, 1, 1, 360
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dating Profile Writers', 'dating-profile-writers', 3, id, 1, 1, 1, 370
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Apology Letter Writers', 'apology-letter-writers', 3, id, 1, 1, 1, 380
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Thank-You Note Writers', 'thank-you-note-writers', 3, id, 1, 1, 1, 390
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Complaint Letter Writers', 'complaint-letter-writers', 3, id, 1, 1, 1, 400
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Recommendation Letter Drafting', 'recommendation-letter-drafting', 3, id, 1, 1, 1, 410
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Reference Letter Drafting', 'reference-letter-drafting', 3, id, 1, 1, 1, 420
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Resignation Letter Writers', 'resignation-letter-writers', 3, id, 1, 1, 1, 430
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Negotiation Email Drafting', 'negotiation-email-drafting', 3, id, 1, 1, 1, 440
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Difficult Conversation Scripts', 'difficult-conversation-scripts', 3, id, 1, 1, 1, 450
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Press Release Drafting', 'press-release-drafting', 3, id, 1, 1, 1, 460
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Crisis Statement Writers', 'crisis-statement-writers', 3, id, 1, 1, 1, 470
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Internal Memo Drafting', 'internal-memo-drafting', 3, id, 1, 1, 1, 480
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Meeting Agenda Drafting', 'meeting-agenda-drafting', 3, id, 1, 1, 1, 490
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Meeting Minutes Drafting', 'meeting-minutes-drafting', 3, id, 1, 1, 1, 500
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Standard Operating Procedure Writers', 'standard-operating-procedure-writers', 3, id, 1, 1, 1, 510
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Policy Document Drafting', 'policy-document-drafting', 3, id, 1, 1, 1, 520
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Job Description Drafting', 'job-description-drafting', 3, id, 1, 1, 1, 530
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Employee Handbook Drafting', 'employee-handbook-drafting', 3, id, 1, 1, 1, 540
FROM categories WHERE slug = 'ai-writing-long-form-text' AND level = 2;

-- AI Paraphrasing, Summarization & Translation (31 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sentence Rephrasers', 'sentence-rephrasers', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Paragraph Rewriters', 'paragraph-rewriters', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tone Shifters', 'tone-shifters', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Formality Converters', 'formality-converters', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Active-to-Passive Converters', 'active-to-passive-converters', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Reading Level Adjusters', 'reading-level-adjusters', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Text Simplifiers', 'ai-text-simplifiers', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Plain Language Rewriters', 'plain-language-rewriters', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'ELI5 Explainers', 'eli5-explainers', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'TL;DR Generators', 'tldr-generators', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bullet-Point Summarizers', 'bullet-point-summarizers', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Executive Summary Writers', 'executive-summary-writers', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Long Article Condensers', 'long-article-condensers', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'YouTube Video Summarizers', 'youtube-video-summarizers', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Podcast Episode Summarizers', 'podcast-episode-summarizers', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lecture Recording Summarizers', 'lecture-recording-summarizers', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Book Chapter Summarizers', 'book-chapter-summarizers', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Research Paper Summarizers', 'research-paper-summarizers', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'News Digest Summarizers', 'news-digest-summarizers', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Email Thread Summarizers', 'email-thread-summarizers', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Slack Thread Summarizers', 'slack-thread-summarizers', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real-Time Conversation Translators', 'real-time-conversation-translators', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Document Translators', 'document-translators', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Subtitle Translators', 'subtitle-translators', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Website Localization Tools', 'website-localization-tools', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Code Comment Translators', 'code-comment-translators', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Game Localization Tools', 'game-localization-tools', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Manga & Comic Translators', 'manga-comic-translators', 3, id, 1, 1, 1, 280
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sign Translation Tools', 'sign-translation-tools', 3, id, 1, 1, 1, 290
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dialect-Specific Translators', 'dialect-specific-translators', 3, id, 1, 1, 1, 300
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cultural Adaptation Tools', 'cultural-adaptation-tools', 3, id, 1, 1, 1, 310
FROM categories WHERE slug = 'ai-paraphrasing-summarization-translation' AND level = 2;

-- AI Image Generation (51 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hyperrealistic Photo Generators', 'hyperrealistic-photo-generators', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cinematic Still Generators', 'cinematic-still-generators', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Studio Portrait Generators', 'studio-portrait-generators', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Editorial Fashion Photo Generators', 'editorial-fashion-photo-generators', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pinterest-Style Image Generators', 'pinterest-style-image-generators', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mood Board Image Generators', 'mood-board-image-generators', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lifestyle Stock Image Generators', 'lifestyle-stock-image-generators', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Flat Illustration Generators', 'flat-illustration-generators', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vector Art Generators', 'vector-art-generators', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Children''s Book Illustration Generators', 'childrens-book-illustration-generators', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Watercolor Style Generators', 'watercolor-style-generators', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Oil Painting Style Generators', 'oil-painting-style-generators', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pencil Sketch Generators', 'pencil-sketch-generators', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ink Drawing Generators', 'ink-drawing-generators', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Charcoal Drawing Generators', 'charcoal-drawing-generators', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Anime Character Generators', 'anime-character-generators', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Manga Panel Generators', 'manga-panel-generators', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Webtoon Style Generators', 'webtoon-style-generators', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pixel Art Sprite Generators', 'pixel-art-sprite-generators', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Isometric Scene Generators', 'isometric-scene-generators', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Low-Poly Art Generators', 'low-poly-art-generators', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cyberpunk Art Generators', 'cyberpunk-art-generators', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Steampunk Art Generators', 'steampunk-art-generators', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fantasy Art Generators', 'fantasy-art-generators', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sci-Fi Concept Art Generators', 'sci-fi-concept-art-generators', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Horror Art Generators', 'horror-art-generators', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Surrealism Art Generators', 'surrealism-art-generators', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pop Art Generators', 'pop-art-generators', 3, id, 1, 1, 1, 280
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Minimalist Poster Generators', 'minimalist-poster-generators', 3, id, 1, 1, 1, 290
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Retro Vintage Image Generators', 'retro-vintage-image-generators', 3, id, 1, 1, 1, 300
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Y2K Aesthetic Image Generators', 'y2k-aesthetic-image-generators', 3, id, 1, 1, 1, 310
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cottagecore Image Generators', 'cottagecore-image-generators', 3, id, 1, 1, 1, 320
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vaporwave Image Generators', 'vaporwave-image-generators', 3, id, 1, 1, 1, 330
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Architectural Render Generators', 'architectural-render-generators', 3, id, 1, 1, 1, 340
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Product Mockup Generators', 'product-mockup-generators', 3, id, 1, 1, 1, 350
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Packaging Mockup Generators', 'packaging-mockup-generators', 3, id, 1, 1, 1, 360
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Apparel Mockup Generators', 'apparel-mockup-generators', 3, id, 1, 1, 1, 370
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Book Cover Image Generators', 'book-cover-image-generators', 3, id, 1, 1, 1, 380
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Album Cover Image Generators', 'album-cover-image-generators', 3, id, 1, 1, 1, 390
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Movie Poster Generators', 'movie-poster-generators', 3, id, 1, 1, 1, 400
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Event Poster Generators', 'event-poster-generators', 3, id, 1, 1, 1, 410
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Magazine Cover Generators', 'magazine-cover-generators', 3, id, 1, 1, 1, 420
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Greeting Card Image Generators', 'greeting-card-image-generators', 3, id, 1, 1, 1, 430
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sticker Sheet Generators', 'sticker-sheet-generators', 3, id, 1, 1, 1, 440
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Coloring Page Generators', 'coloring-page-generators', 3, id, 1, 1, 1, 450
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tattoo Flash Generators', 'tattoo-flash-generators', 3, id, 1, 1, 1, 460
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Henna Pattern Generators', 'henna-pattern-generators', 3, id, 1, 1, 1, 470
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mandala Generators', 'mandala-generators', 3, id, 1, 1, 1, 480
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Halftone & Comic Generators', 'halftone-comic-generators', 3, id, 1, 1, 1, 490
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Glitch Art Generators', 'glitch-art-generators', 3, id, 1, 1, 1, 500
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Generative Pattern Makers', 'generative-pattern-makers', 3, id, 1, 1, 1, 510
FROM categories WHERE slug = 'ai-image-generation' AND level = 2;

-- AI Photo Editing & Enhancement (32 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'One-Click Photo Enhancers', 'one-click-photo-enhancers', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Old Photo Restorers', 'old-photo-restorers', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Black-and-White Colorizers', 'black-and-white-colorizers', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Damaged Photo Repairers', 'damaged-photo-repairers', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Photo Denoisers', 'photo-denoisers', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Photo Sharpeners', 'photo-sharpeners', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Photo Resolution Upscalers', 'photo-resolution-upscalers', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Face Retouchers', 'face-retouchers', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Skin Smoothing Tools', 'skin-smoothing-tools', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Acne & Blemish Removers', 'acne-blemish-removers', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Teeth Whitening Tools', 'teeth-whitening-tools', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Eye Brighteners', 'eye-brighteners', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hair Color Changers', 'hair-color-changers', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Virtual Makeup Tools', 'virtual-makeup-tools', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Body Reshape Tools', 'body-reshape-tools', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Outfit Swap Tools', 'outfit-swap-tools', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Background Replacers', 'background-replacers', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Background Blur Tools', 'background-blur-tools', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Object Removal Tools', 'object-removal-tools', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'People Removal Tools', 'people-removal-tools', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Reflection & Glare Removal', 'reflection-glare-removal', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Photo Style Transfer', 'photo-style-transfer', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Photo Cartoonifiers', 'photo-cartoonifiers', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Anime-ify Photo Tools', 'anime-ify-photo-tools', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Headshot Enhancement Tools', 'headshot-enhancement-tools', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'ID Photo Generators', 'id-photo-generators', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Passport Photo Tools', 'passport-photo-tools', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Photo Enhancers', 'real-estate-photo-enhancers', 3, id, 1, 1, 1, 280
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sky Replacement Tools', 'sky-replacement-tools', 3, id, 1, 1, 1, 290
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'HDR Merge Tools', 'hdr-merge-tools', 3, id, 1, 1, 1, 300
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Photo Aspect-Ratio Fixers', 'photo-aspect-ratio-fixers', 3, id, 1, 1, 1, 310
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Photo Compression Tools', 'photo-compression-tools', 3, id, 1, 1, 1, 320
FROM categories WHERE slug = 'ai-photo-editing-enhancement' AND level = 2;

-- AI Video Generation (27 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Text-to-Cinematic-Video', 'text-to-cinematic-video', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-video-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Image-to-Video Animators', 'image-to-video-animators', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-video-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Storyboard-to-Video Tools', 'storyboard-to-video-tools', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-video-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Script-to-Video Pipelines', 'script-to-video-pipelines', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-video-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Faceless YouTube Video Builders', 'ai-faceless-youtube-video-builders', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-video-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Auto B-Roll Generators', 'auto-b-roll-generators', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-video-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI UGC-Style Ad Generators', 'ai-ugc-style-ad-generators', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-video-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Talking Avatar Video Builders', 'ai-talking-avatar-video-builders', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-video-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Realistic Spokesperson Videos', 'ai-realistic-spokesperson-videos', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-video-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Multi-Avatar Conversation Videos', 'multi-avatar-conversation-videos', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-video-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cartoon Character Video Generators', 'cartoon-character-video-generators', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-video-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Anime Video Generators', 'anime-video-generators', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-video-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Whiteboard Animation Generators', 'whiteboard-animation-generators', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-video-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Explainer Video Generators', 'explainer-video-generators', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-video-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Product Demo Video Builders', 'product-demo-video-builders', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-video-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tutorial Video Generators', 'tutorial-video-generators', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-video-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Course Lesson Video Generators', 'course-lesson-video-generators', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-video-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'News Anchor Video Generators', 'news-anchor-video-generators', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-video-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Music Video Visualizers', 'music-video-visualizers', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-video-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lyric Video Generators', 'lyric-video-generators', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-video-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Dance Video Generators', 'ai-dance-video-generators', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-video-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Live Wallpaper Video Generators', 'ai-live-wallpaper-video-generators', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-video-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Loop Video Generators', 'ai-loop-video-generators', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-video-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI GIF Generators', 'ai-gif-generators', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-video-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cinemagraph Generators', 'ai-cinemagraph-generators', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-video-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Video Story Generators', 'ai-video-story-generators', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-video-generation' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Movie Trailer Generators', 'ai-movie-trailer-generators', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-video-generation' AND level = 2;

-- AI Video Editing & Post-Production (30 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Auto-Cut Editors', 'ai-auto-cut-editors', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Silence Removers', 'ai-silence-removers', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Filler-Word Removers', 'ai-filler-word-removers', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Jump-Cut Smoothers', 'ai-jump-cut-smoothers', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Long-to-Short Repurposers', 'ai-long-to-short-repurposers', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Auto-Reframe Vertical Tools', 'auto-reframe-vertical-tools', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Highlight Reel Makers', 'ai-highlight-reel-makers', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Sports Highlight Editors', 'ai-sports-highlight-editors', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Wedding Video Editors', 'ai-wedding-video-editors', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Gameplay Highlight Editors', 'ai-gameplay-highlight-editors', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Podcast-to-Clips Tools', 'ai-podcast-to-clips-tools', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Webinar-to-Clips Tools', 'ai-webinar-to-clips-tools', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Auto-Caption Burn-In', 'ai-auto-caption-burn-in', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Multilingual Subtitle Burn-In', 'ai-multilingual-subtitle-burn-in', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Speaker Tracking Editors', 'ai-speaker-tracking-editors', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Eye Contact Correction', 'ai-eye-contact-correction', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Look-to-Camera Fixers', 'ai-look-to-camera-fixers', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Color Correction Tools', 'ai-color-correction-tools', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cinematic Color Grading', 'ai-cinematic-color-grading', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Frame Interpolation', 'ai-frame-interpolation', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Video Stabilization', 'ai-video-stabilization', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Slow-Motion Generators', 'ai-slow-motion-generators', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Video Restoration', 'ai-video-restoration', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Old Film Restorer', 'ai-old-film-restorer', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Video Object Removal', 'ai-video-object-removal', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Video Background Replacement', 'ai-video-background-replacement', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Video Green-Screen Tools', 'ai-video-green-screen-tools', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Watermark Remover for Video', 'ai-watermark-remover-for-video', 3, id, 1, 1, 1, 280
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Video Compression', 'ai-video-compression', 3, id, 1, 1, 1, 290
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Video Format Conversion', 'ai-video-format-conversion', 3, id, 1, 1, 1, 300
FROM categories WHERE slug = 'ai-video-editing-post-production' AND level = 2;

-- AI Audio Generation & Music (39 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Lyric-to-Song Tools', 'ai-lyric-to-song-tools', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Instrumental Beat Generators', 'ai-instrumental-beat-generators', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Vocal Track Generators', 'ai-vocal-track-generators', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Royalty-Free Music Libraries', 'ai-royalty-free-music-libraries', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cinematic Score Generators', 'ai-cinematic-score-generators', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Lo-Fi Beat Generators', 'ai-lo-fi-beat-generators', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Classical Music Composers', 'ai-classical-music-composers', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Jazz Improvisation Tools', 'ai-jazz-improvisation-tools', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Electronic Dance Music Generators', 'ai-electronic-dance-music-generators', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Hip-Hop Beat Generators', 'ai-hip-hop-beat-generators', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Country Music Generators', 'ai-country-music-generators', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Ambient Music Generators', 'ai-ambient-music-generators', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Game Music Generators', 'ai-game-music-generators', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Workout Playlist Generators', 'ai-workout-playlist-generators', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Meditation Music Generators', 'ai-meditation-music-generators', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Sleep Sound Generators', 'ai-sleep-sound-generators', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI White Noise Generators', 'ai-white-noise-generators', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Nature Sound Generators', 'ai-nature-sound-generators', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Sound Effect Libraries', 'ai-sound-effect-libraries', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Foley Sound Generators', 'ai-foley-sound-generators', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Drum Pattern Generators', 'ai-drum-pattern-generators', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Bass Line Generators', 'ai-bass-line-generators', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Chord Progression Helpers', 'ai-chord-progression-helpers', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Melody Suggesters', 'ai-melody-suggesters', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Song Lyric Writers', 'ai-song-lyric-writers', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Rap Lyric Generators', 'ai-rap-lyric-generators', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Karaoke Track Makers', 'ai-karaoke-track-makers', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Song Cover Generators', 'ai-song-cover-generators', 3, id, 1, 1, 1, 280
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Voice-to-Instrument Tools', 'ai-voice-to-instrument-tools', 3, id, 1, 1, 1, 290
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Humming-to-Melody Tools', 'ai-humming-to-melody-tools', 3, id, 1, 1, 1, 300
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI MIDI Generators', 'ai-midi-generators', 3, id, 1, 1, 1, 310
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Music Mastering Suites', 'ai-music-mastering-suites', 3, id, 1, 1, 1, 320
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Music Mixing Assistants', 'ai-music-mixing-assistants', 3, id, 1, 1, 1, 330
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Stem Separators', 'ai-stem-separators', 3, id, 1, 1, 1, 340
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Vocal Isolation Tools', 'ai-vocal-isolation-tools', 3, id, 1, 1, 1, 350
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Audio Cleanup & Restoration', 'ai-audio-cleanup-restoration', 3, id, 1, 1, 1, 360
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Pitch Correction', 'ai-pitch-correction', 3, id, 1, 1, 1, 370
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Auto-Tune Plugins', 'ai-auto-tune-plugins', 3, id, 1, 1, 1, 380
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Tempo Detection', 'ai-tempo-detection', 3, id, 1, 1, 1, 390
FROM categories WHERE slug = 'ai-audio-generation-music' AND level = 2;

-- AI Voice & Speech (26 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Realistic Neural Voice Synthesizers', 'realistic-neural-voice-synthesizers', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-voice-speech' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Celebrity Voice Tools', 'celebrity-voice-tools', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-voice-speech' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Custom Voice Cloning', 'custom-voice-cloning', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-voice-speech' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real-Time Voice Changers', 'real-time-voice-changers', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-voice-speech' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Live Stream Voice Modifiers', 'live-stream-voice-modifiers', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-voice-speech' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Anonymizing Voice Disguisers', 'anonymizing-voice-disguisers', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-voice-speech' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Multilingual Voice Synthesizers', 'multilingual-voice-synthesizers', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-voice-speech' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Emotion-Aware Voice Generators', 'emotion-aware-voice-generators', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-voice-speech' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Whisper-Style Voice Generators', 'whisper-style-voice-generators', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-voice-speech' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Audiobook Narration Generators', 'audiobook-narration-generators', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-voice-speech' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'E-Learning Narration Tools', 'e-learning-narration-tools', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-voice-speech' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'IVR Voice Generators', 'ivr-voice-generators', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-voice-speech' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Game Character Voice Generators', 'game-character-voice-generators', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-voice-speech' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cartoon Voice Generators', 'cartoon-voice-generators', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-voice-speech' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Singing Voice Synthesizers', 'singing-voice-synthesizers', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-voice-speech' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Voice-to-Voice Conversion', 'voice-to-voice-conversion', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-voice-speech' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Accent Conversion Tools', 'accent-conversion-tools', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-voice-speech' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pronunciation Correction Tools', 'pronunciation-correction-tools', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-voice-speech' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Live Meeting Transcribers', 'live-meeting-transcribers', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-voice-speech' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Podcast Auto-Transcribers', 'podcast-auto-transcribers', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-voice-speech' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lecture Transcription Tools', 'lecture-transcription-tools', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-voice-speech' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Court & Legal Transcription', 'court-legal-transcription', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-voice-speech' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Medical Dictation Transcription', 'medical-dictation-transcription', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-voice-speech' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Interview Transcription Tools', 'interview-transcription-tools', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-voice-speech' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Multi-Speaker Diarization Tools', 'multi-speaker-diarization-tools', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-voice-speech' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Voice Search Builders', 'voice-search-builders', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-voice-speech' AND level = 2;

-- AI Code & Developer Tools (62 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'In-IDE Inline Coding Copilots', 'in-ide-inline-coding-copilots', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Terminal-Based Coding Agents', 'terminal-based-coding-agents', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Browser-Based Coding Copilots', 'browser-based-coding-copilots', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'JetBrains AI Plugins', 'jetbrains-ai-plugins', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'VSCode AI Extensions', 'vscode-ai-extensions', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vim & Neovim AI Plugins', 'vim-neovim-ai-plugins', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Emacs AI Plugins', 'emacs-ai-plugins', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cursor-Style AI Editors', 'cursor-style-ai-editors', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Whole-Repo Refactoring Agents', 'whole-repo-refactoring-agents', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Migration Assistants (e.g. Java → Kotlin)', 'ai-migration-assistants-eg-java-kotlin', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Framework Upgraders', 'ai-framework-upgraders', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Dependency Updaters', 'ai-dependency-updaters', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Linter Auto-Fixers', 'ai-linter-auto-fixers', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Test-Coverage Boosters', 'ai-test-coverage-boosters', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Snapshot-Test Generators', 'ai-snapshot-test-generators', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Property-Based Test Generators', 'ai-property-based-test-generators', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Mock Data Generators', 'ai-mock-data-generators', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Test Data Synthesis', 'ai-test-data-synthesis', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI API Spec Generators', 'ai-api-spec-generators', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI OpenAPI Builders', 'ai-openapi-builders', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI gRPC Schema Designers', 'ai-grpc-schema-designers', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI GraphQL Schema Builders', 'ai-graphql-schema-builders', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Database Schema Designers', 'ai-database-schema-designers', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Migration File Writers', 'ai-migration-file-writers', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI ORM Query Helpers', 'ai-orm-query-helpers', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI SQL Query Builders', 'ai-sql-query-builders', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI NoSQL Query Helpers', 'ai-nosql-query-helpers', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Dockerfile Generators', 'ai-dockerfile-generators', 3, id, 1, 1, 1, 280
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Kubernetes Manifest Generators', 'ai-kubernetes-manifest-generators', 3, id, 1, 1, 1, 290
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Terraform Generators', 'ai-terraform-generators', 3, id, 1, 1, 1, 300
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Helm Chart Generators', 'ai-helm-chart-generators', 3, id, 1, 1, 1, 310
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI GitHub Actions Generators', 'ai-github-actions-generators', 3, id, 1, 1, 1, 320
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI CI Pipeline Generators', 'ai-ci-pipeline-generators', 3, id, 1, 1, 1, 330
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Build Error Diagnosers', 'ai-build-error-diagnosers', 3, id, 1, 1, 1, 340
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Stack Trace Explainers', 'ai-stack-trace-explainers', 3, id, 1, 1, 1, 350
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Crash Report Analyzers', 'ai-crash-report-analyzers', 3, id, 1, 1, 1, 360
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Performance Profilers', 'ai-performance-profilers', 3, id, 1, 1, 1, 370
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Memory Leak Hunters', 'ai-memory-leak-hunters', 3, id, 1, 1, 1, 380
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Code Smell Detectors', 'ai-code-smell-detectors', 3, id, 1, 1, 1, 390
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Security Vulnerability Scanners', 'ai-security-vulnerability-scanners', 3, id, 1, 1, 1, 400
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Dependency Vulnerability Scanners', 'ai-dependency-vulnerability-scanners', 3, id, 1, 1, 1, 410
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI License Compliance Checkers', 'ai-license-compliance-checkers', 3, id, 1, 1, 1, 420
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Codebase Q&A Tools', 'ai-codebase-qa-tools', 3, id, 1, 1, 1, 430
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Codebase Search Tools', 'ai-codebase-search-tools', 3, id, 1, 1, 1, 440
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Onboarding Doc Generators', 'ai-onboarding-doc-generators', 3, id, 1, 1, 1, 450
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Architecture Diagram Generators', 'ai-architecture-diagram-generators', 3, id, 1, 1, 1, 460
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI System Design Assistants', 'ai-system-design-assistants', 3, id, 1, 1, 1, 470
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Whiteboarding Coding Helpers', 'ai-whiteboarding-coding-helpers', 3, id, 1, 1, 1, 480
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Pseudocode-to-Code Converters', 'ai-pseudocode-to-code-converters', 3, id, 1, 1, 1, 490
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Algorithm Explainers', 'ai-algorithm-explainers', 3, id, 1, 1, 1, 500
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI LeetCode Practice Tutors', 'ai-leetcode-practice-tutors', 3, id, 1, 1, 1, 510
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Interview Coding Coaches', 'ai-interview-coding-coaches', 3, id, 1, 1, 1, 520
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Bash Script Generators', 'ai-bash-script-generators', 3, id, 1, 1, 1, 530
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI PowerShell Script Generators', 'ai-powershell-script-generators', 3, id, 1, 1, 1, 540
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Regex Builders', 'ai-regex-builders', 3, id, 1, 1, 1, 550
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cron Expression Builders', 'ai-cron-expression-builders', 3, id, 1, 1, 1, 560
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI JSON Schema Generators', 'ai-json-schema-generators', 3, id, 1, 1, 1, 570
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI YAML Validators', 'ai-yaml-validators', 3, id, 1, 1, 1, 580
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Web Component Builders', 'ai-web-component-builders', 3, id, 1, 1, 1, 590
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Tailwind Class Helpers', 'ai-tailwind-class-helpers', 3, id, 1, 1, 1, 600
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI CSS Animation Generators', 'ai-css-animation-generators', 3, id, 1, 1, 1, 610
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI SVG Generators', 'ai-svg-generators', 3, id, 1, 1, 1, 620
FROM categories WHERE slug = 'ai-code-developer-tools' AND level = 2;

-- AI Agent Frameworks & Infrastructure (27 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Open-Source Agent Frameworks', 'open-source-agent-frameworks', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-agent-frameworks-infrastructure' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Multi-Agent Orchestration Platforms', 'multi-agent-orchestration-platforms', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-agent-frameworks-infrastructure' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Workflow Graph Builders', 'workflow-graph-builders', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-agent-frameworks-infrastructure' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tool-Use Routing Systems', 'tool-use-routing-systems', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-agent-frameworks-infrastructure' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Memory Management Libraries', 'memory-management-libraries', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-agent-frameworks-infrastructure' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Long-Term Memory Stores', 'long-term-memory-stores', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-agent-frameworks-infrastructure' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Episodic Memory Systems', 'episodic-memory-systems', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-agent-frameworks-infrastructure' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Embedding Database Tools', 'embedding-database-tools', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-agent-frameworks-infrastructure' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hybrid Search Retrieval Tools', 'hybrid-search-retrieval-tools', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-agent-frameworks-infrastructure' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'RAG Pipeline Builders', 'rag-pipeline-builders', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-agent-frameworks-infrastructure' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Document Ingestion Pipelines', 'document-ingestion-pipelines', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-agent-frameworks-infrastructure' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Chunking & Splitter Libraries', 'chunking-splitter-libraries', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-agent-frameworks-infrastructure' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Reranker Model Tools', 'reranker-model-tools', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-agent-frameworks-infrastructure' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Evaluation Harnesses for Agents', 'evaluation-harnesses-for-agents', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-agent-frameworks-infrastructure' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trace Visualization Tools', 'trace-visualization-tools', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-agent-frameworks-infrastructure' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Prompt Versioning Systems', 'prompt-versioning-systems', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-agent-frameworks-infrastructure' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Prompt A/B Testing Tools', 'prompt-ab-testing-tools', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-agent-frameworks-infrastructure' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Prompt Cost Analyzers', 'prompt-cost-analyzers', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-agent-frameworks-infrastructure' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'LLM Gateway Routers', 'llm-gateway-routers', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-agent-frameworks-infrastructure' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Multi-Provider LLM Switchers', 'multi-provider-llm-switchers', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-agent-frameworks-infrastructure' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Model Cost Optimizers', 'model-cost-optimizers', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-agent-frameworks-infrastructure' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Token Counting Tools', 'token-counting-tools', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-agent-frameworks-infrastructure' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Local Inference Runtimes', 'local-inference-runtimes', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-agent-frameworks-infrastructure' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Quantized Model Tools', 'quantized-model-tools', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-agent-frameworks-infrastructure' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'GPU Inference Schedulers', 'gpu-inference-schedulers', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-agent-frameworks-infrastructure' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Edge AI Deployment Tools', 'edge-ai-deployment-tools', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-agent-frameworks-infrastructure' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'Serverless LLM Platforms', 'serverless-llm-platforms', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-agent-frameworks-infrastructure' AND level = 2;

-- AI No-Code & App Builders (32 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Web App Builders', 'ai-web-app-builders', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Internal Tool Builders', 'ai-internal-tool-builders', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Admin Panel Builders', 'ai-admin-panel-builders', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Dashboard Builders', 'ai-dashboard-builders', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Form Builders with Logic', 'ai-form-builders-with-logic', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Survey Builders', 'ai-survey-builders', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Quiz Builders', 'ai-quiz-builders', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Calculator Widget Builders', 'ai-calculator-widget-builders', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Landing Page Builders', 'ai-landing-page-builders', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Portfolio Site Builders', 'ai-portfolio-site-builders', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Resume Site Builders', 'ai-resume-site-builders', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Wedding Site Builders', 'ai-wedding-site-builders', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Event Site Builders', 'ai-event-site-builders', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Restaurant Site Builders', 'ai-restaurant-site-builders', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI E-Commerce Store Builders', 'ai-e-commerce-store-builders', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Marketplace Builders', 'ai-marketplace-builders', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Membership Site Builders', 'ai-membership-site-builders', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Course Platform Builders', 'ai-course-platform-builders', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Booking Site Builders', 'ai-booking-site-builders', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Directory Site Builders', 'ai-directory-site-builders', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Blog Site Builders', 'ai-blog-site-builders', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Newsletter Site Builders', 'ai-newsletter-site-builders', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Mobile App Prototypers', 'ai-mobile-app-prototypers', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI iOS App Generators', 'ai-ios-app-generators', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Android App Generators', 'ai-android-app-generators', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cross-Platform App Builders', 'ai-cross-platform-app-builders', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Game Prototypers', 'ai-game-prototypers', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Telegram Mini-App Builders', 'ai-telegram-mini-app-builders', 3, id, 1, 1, 1, 280
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Slack App Builders', 'ai-slack-app-builders', 3, id, 1, 1, 1, 290
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Discord Bot Builders', 'ai-discord-bot-builders', 3, id, 1, 1, 1, 300
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Chrome Extension Builders', 'ai-chrome-extension-builders', 3, id, 1, 1, 1, 310
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI MCP Server Builders', 'ai-mcp-server-builders', 3, id, 1, 1, 1, 320
FROM categories WHERE slug = 'ai-no-code-app-builders' AND level = 2;

-- AI Productivity & Personal Workflow (28 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Daily Stand-Up Helpers', 'ai-daily-stand-up-helpers', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Daily Journal Prompts', 'ai-daily-journal-prompts', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Reflection Coaches', 'ai-reflection-coaches', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Goal-Setting Coaches', 'ai-goal-setting-coaches', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI OKR Builders', 'ai-okr-builders', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Quarterly Planning Tools', 'ai-quarterly-planning-tools', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Weekly Review Tools', 'ai-weekly-review-tools', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI To-Do List Prioritizers', 'ai-to-do-list-prioritizers', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Eisenhower Matrix Tools', 'ai-eisenhower-matrix-tools', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Time-Blocking Assistants', 'ai-time-blocking-assistants', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Calendar Optimizers', 'ai-calendar-optimizers', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Schedule Defragmenters', 'ai-schedule-defragmenters', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Distraction Blockers', 'ai-distraction-blockers', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Focus Music Curators', 'ai-focus-music-curators', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Reading List Curators', 'ai-reading-list-curators', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Article Save-for-Later Tools', 'ai-article-save-for-later-tools', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Read-It-Later Summarizers', 'ai-read-it-later-summarizers', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Bookmark Organizers', 'ai-bookmark-organizers', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Tab Management Tools', 'ai-tab-management-tools', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Window Layout Managers', 'ai-window-layout-managers', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Clipboard Managers', 'ai-clipboard-managers', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Snippet Expansion Tools', 'ai-snippet-expansion-tools', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Text Replacement Tools', 'ai-text-replacement-tools', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Quick-Capture Inboxes', 'ai-quick-capture-inboxes', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Voice-to-Note Tools', 'ai-voice-to-note-tools', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Photo-to-Note Tools', 'ai-photo-to-note-tools', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Whiteboard-to-Note Tools', 'ai-whiteboard-to-note-tools', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Handwritten Note Digitizers', 'ai-handwritten-note-digitizers', 3, id, 1, 1, 1, 280
FROM categories WHERE slug = 'ai-productivity-personal-workflow' AND level = 2;

-- AI Meeting & Collaboration (19 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Meeting Recorders', 'ai-meeting-recorders', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-meeting-collaboration' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Meeting Bots for Zoom', 'ai-meeting-bots-for-zoom', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-meeting-collaboration' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Meeting Bots for Google Meet', 'ai-meeting-bots-for-google-meet', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-meeting-collaboration' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Meeting Bots for Microsoft Teams', 'ai-meeting-bots-for-microsoft-teams', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-meeting-collaboration' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Meeting Bots for Webex', 'ai-meeting-bots-for-webex', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-meeting-collaboration' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI In-Person Meeting Recorders', 'ai-in-person-meeting-recorders', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-meeting-collaboration' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Action Item Extractors', 'ai-action-item-extractors', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-meeting-collaboration' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Decision Loggers', 'ai-decision-loggers', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-meeting-collaboration' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Follow-Up Email Drafters', 'ai-follow-up-email-drafters', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-meeting-collaboration' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Meeting Highlight Reels', 'ai-meeting-highlight-reels', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-meeting-collaboration' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Meeting Sentiment Analysis', 'ai-meeting-sentiment-analysis', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-meeting-collaboration' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Speaker Talk-Time Analytics', 'ai-speaker-talk-time-analytics', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-meeting-collaboration' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI 1:1 Meeting Coaches', 'ai-11-meeting-coaches', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-meeting-collaboration' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Sales Call Coaches', 'ai-sales-call-coaches', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-meeting-collaboration' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Interview Coaches', 'ai-interview-coaches', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-meeting-collaboration' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Standup Note Aggregators', 'ai-standup-note-aggregators', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-meeting-collaboration' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Async Video Update Tools', 'ai-async-video-update-tools', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-meeting-collaboration' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Loom-Style Video Memos', 'ai-loom-style-video-memos', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-meeting-collaboration' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Whiteboard Collaboration Tools', 'ai-whiteboard-collaboration-tools', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-meeting-collaboration' AND level = 2;

-- AI Email & Inbox (14 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Inbox Triage Assistants', 'ai-inbox-triage-assistants', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-email-inbox' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Email Classifiers', 'ai-email-classifiers', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-email-inbox' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Auto-Reply Drafters', 'ai-auto-reply-drafters', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-email-inbox' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Smart Send-Time Optimizers', 'ai-smart-send-time-optimizers', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-email-inbox' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Email Tone Analyzers', 'ai-email-tone-analyzers', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-email-inbox' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Polite-Reply Drafters', 'ai-polite-reply-drafters', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-email-inbox' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Decline-Politely Helpers', 'ai-decline-politely-helpers', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-email-inbox' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Out-of-Office Drafters', 'ai-out-of-office-drafters', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-email-inbox' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Inbox Zero Coaches', 'ai-inbox-zero-coaches', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-email-inbox' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Newsletter Digesters', 'ai-newsletter-digesters', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-email-inbox' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Subscription Cleaners', 'ai-subscription-cleaners', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-email-inbox' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Phishing Email Detectors', 'ai-phishing-email-detectors', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-email-inbox' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Email Search Assistants', 'ai-email-search-assistants', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-email-inbox' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Threaded Conversation Summarizers', 'ai-threaded-conversation-summarizers', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-email-inbox' AND level = 2;

-- AI Search, Research & Knowledge (29 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Conversational Search Engines', 'ai-conversational-search-engines', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Answer Engines with Citations', 'ai-answer-engines-with-citations', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Visual Search Engines', 'ai-visual-search-engines', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Reverse Image Search', 'ai-reverse-image-search', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Reverse Video Search', 'ai-reverse-video-search', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Reverse Audio Search', 'ai-reverse-audio-search', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Personal Knowledge Search', 'ai-personal-knowledge-search', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Enterprise Search Engines', 'ai-enterprise-search-engines', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Federated Workplace Search', 'ai-federated-workplace-search', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Note Vault Search', 'ai-note-vault-search', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Email Archive Search', 'ai-email-archive-search', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Code Search Engines', 'ai-code-search-engines', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Academic Paper Search', 'ai-academic-paper-search', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Patent Discovery Tools', 'ai-patent-discovery-tools', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Clinical Trial Search', 'ai-clinical-trial-search', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Legal Case Search', 'ai-legal-case-search', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Government Document Search', 'ai-government-document-search', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Investor Filing Search', 'ai-investor-filing-search', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Earnings Call Search', 'ai-earnings-call-search', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI News Archive Search', 'ai-news-archive-search', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Multi-Source Research Agents', 'ai-multi-source-research-agents', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Long-Horizon Research Agents', 'ai-long-horizon-research-agents', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Competitive Intelligence Agents', 'ai-competitive-intelligence-agents', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Industry Trend Trackers', 'ai-industry-trend-trackers', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Topic Monitoring Tools', 'ai-topic-monitoring-tools', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Source-Tracking Tools', 'ai-source-tracking-tools', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Reference Manager Helpers', 'ai-reference-manager-helpers', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Bibliography Builders', 'ai-bibliography-builders', 3, id, 1, 1, 1, 280
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Citation Style Converters', 'ai-citation-style-converters', 3, id, 1, 1, 1, 290
FROM categories WHERE slug = 'ai-search-research-knowledge' AND level = 2;

-- AI Data Analysis & BI (31 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Spreadsheet Analysts', 'ai-spreadsheet-analysts', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI CSV Q&A Tools', 'ai-csv-qa-tools', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Excel Formula Explainers', 'ai-excel-formula-explainers', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Pivot Table Builders', 'ai-pivot-table-builders', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Google Sheets Add-Ons', 'ai-google-sheets-add-ons', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Database Q&A Tools', 'ai-database-qa-tools', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Natural Language SQL Tools', 'ai-natural-language-sql-tools', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Dashboard Generators', 'ai-dashboard-generators', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Self-Serve BI Tools', 'ai-self-serve-bi-tools', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI KPI Trackers', 'ai-kpi-trackers', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cohort Analysis Tools', 'ai-cohort-analysis-tools', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Funnel Analysis Tools', 'ai-funnel-analysis-tools', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Attribution Modeling Tools', 'ai-attribution-modeling-tools', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Forecasting Models', 'ai-forecasting-models', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Demand Forecasting', 'ai-demand-forecasting', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Inventory Forecasting', 'ai-inventory-forecasting', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cash Flow Forecasting', 'ai-cash-flow-forecasting', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Headcount Forecasting', 'ai-headcount-forecasting', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Anomaly Alerting', 'ai-anomaly-alerting', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Outlier Detection', 'ai-outlier-detection', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Root Cause Analysis', 'ai-root-cause-analysis', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Survey Analysis', 'ai-survey-analysis', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Open-Ended Response Coding', 'ai-open-ended-response-coding', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Customer Interview Synthesis', 'ai-customer-interview-synthesis', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Topic Modeling Tools', 'ai-topic-modeling-tools', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Theme Extraction', 'ai-theme-extraction', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Voice-of-Customer Analytics', 'ai-voice-of-customer-analytics', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Sentiment Trend Analysis', 'ai-sentiment-trend-analysis', 3, id, 1, 1, 1, 280
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Web Analytics Copilots', 'ai-web-analytics-copilots', 3, id, 1, 1, 1, 290
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Marketing Mix Modeling', 'ai-marketing-mix-modeling', 3, id, 1, 1, 1, 300
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI A/B Test Analyzers', 'ai-ab-test-analyzers', 3, id, 1, 1, 1, 310
FROM categories WHERE slug = 'ai-data-analysis-bi' AND level = 2;

-- AI Marketing & Growth (39 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Brand Voice Trainers', 'ai-brand-voice-trainers', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Brand Style Guides', 'ai-brand-style-guides', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Marketing Persona Builders', 'ai-marketing-persona-builders', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI ICP Builders', 'ai-icp-builders', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Positioning Helpers', 'ai-positioning-helpers', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Messaging Framework Builders', 'ai-messaging-framework-builders', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Tagline Generators', 'ai-tagline-generators', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Slogan Generators', 'ai-slogan-generators', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Headline Testers', 'ai-headline-testers', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Subject Line Optimizers', 'ai-subject-line-optimizers', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI CTA Generators', 'ai-cta-generators', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Ad Headline Generators', 'ai-ad-headline-generators', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Google Ads Copywriters', 'ai-google-ads-copywriters', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Meta Ads Copywriters', 'ai-meta-ads-copywriters', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI TikTok Ads Copywriters', 'ai-tiktok-ads-copywriters', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI LinkedIn Ads Copywriters', 'ai-linkedin-ads-copywriters', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Programmatic Ad Creative Tools', 'ai-programmatic-ad-creative-tools', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Display Banner Generators', 'ai-display-banner-generators', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Video Ad Generators', 'ai-video-ad-generators', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI UGC Ad Script Writers', 'ai-ugc-ad-script-writers', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Ad Performance Predictors', 'ai-ad-performance-predictors', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Creative Fatigue Detectors', 'ai-creative-fatigue-detectors', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Landing Page Optimizers', 'ai-landing-page-optimizers', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Heatmap Insight Tools', 'ai-heatmap-insight-tools', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI CRO Recommenders', 'ai-cro-recommenders', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Funnel Builders', 'ai-funnel-builders', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Email Sequence Builders', 'ai-email-sequence-builders', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Drip Campaign Builders', 'ai-drip-campaign-builders', 3, id, 1, 1, 1, 280
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI SMS Campaign Builders', 'ai-sms-campaign-builders', 3, id, 1, 1, 1, 290
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Push Notification Writers', 'ai-push-notification-writers', 3, id, 1, 1, 1, 300
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Lead Magnet Generators', 'ai-lead-magnet-generators', 3, id, 1, 1, 1, 310
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Lead Magnet Designers', 'ai-lead-magnet-designers', 3, id, 1, 1, 1, 320
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Webinar Funnel Builders', 'ai-webinar-funnel-builders', 3, id, 1, 1, 1, 330
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Affiliate Content Builders', 'ai-affiliate-content-builders', 3, id, 1, 1, 1, 340
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Influencer Brief Generators', 'ai-influencer-brief-generators', 3, id, 1, 1, 1, 350
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Influencer Discovery Tools', 'ai-influencer-discovery-tools', 3, id, 1, 1, 1, 360
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI UGC Brief Generators', 'ai-ugc-brief-generators', 3, id, 1, 1, 1, 370
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Content Repurposing Engines', 'ai-content-repurposing-engines', 3, id, 1, 1, 1, 380
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cross-Channel Publishers', 'ai-cross-channel-publishers', 3, id, 1, 1, 1, 390
FROM categories WHERE slug = 'ai-marketing-growth' AND level = 2;

-- AI SEO & Discoverability (24 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Keyword Cluster Tools', 'ai-keyword-cluster-tools', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-seo-discoverability' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Topic Map Builders', 'ai-topic-map-builders', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-seo-discoverability' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Search Intent Analyzers', 'ai-search-intent-analyzers', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-seo-discoverability' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI SERP Snapshot Tools', 'ai-serp-snapshot-tools', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-seo-discoverability' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Content Brief Generators', 'ai-content-brief-generators', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-seo-discoverability' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI On-Page SEO Auditors', 'ai-on-page-seo-auditors', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-seo-discoverability' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Internal Linking Tools', 'ai-internal-linking-tools', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-seo-discoverability' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Schema Markup Generators', 'ai-schema-markup-generators', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-seo-discoverability' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI FAQ Schema Generators', 'ai-faq-schema-generators', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-seo-discoverability' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Featured Snippet Optimizers', 'ai-featured-snippet-optimizers', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-seo-discoverability' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI E-E-A-T Auditors', 'ai-e-e-a-t-auditors', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-seo-discoverability' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Content Refresh Suggesters', 'ai-content-refresh-suggesters', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-seo-discoverability' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cannibalization Detectors', 'ai-cannibalization-detectors', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-seo-discoverability' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Backlink Prospecting Tools', 'ai-backlink-prospecting-tools', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-seo-discoverability' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Outreach Email Builders', 'ai-outreach-email-builders', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-seo-discoverability' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Local Listing Optimizers', 'ai-local-listing-optimizers', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-seo-discoverability' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Google Business Profile Tools', 'ai-google-business-profile-tools', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-seo-discoverability' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Review Response Generators', 'ai-review-response-generators', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-seo-discoverability' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Multilingual SEO Tools', 'ai-multilingual-seo-tools', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-seo-discoverability' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Programmatic SEO Builders', 'ai-programmatic-seo-builders', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-seo-discoverability' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI AI-Search Visibility Tools', 'ai-ai-search-visibility-tools', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-seo-discoverability' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI ChatGPT Citation Trackers', 'ai-chatgpt-citation-trackers', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-seo-discoverability' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Perplexity Visibility Tools', 'ai-perplexity-visibility-tools', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-seo-discoverability' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Gemini Visibility Tools', 'ai-gemini-visibility-tools', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-seo-discoverability' AND level = 2;

-- AI Social Media (36 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI X / Twitter Thread Writers', 'ai-x-twitter-thread-writers', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI X Reply Bots', 'ai-x-reply-bots', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI X Growth Tools', 'ai-x-growth-tools', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI LinkedIn Post Writers', 'ai-linkedin-post-writers', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI LinkedIn Comment Helpers', 'ai-linkedin-comment-helpers', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI LinkedIn Carousel Builders', 'ai-linkedin-carousel-builders', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Instagram Post Writers', 'ai-instagram-post-writers', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Instagram Carousel Builders', 'ai-instagram-carousel-builders', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Instagram Reels Scripters', 'ai-instagram-reels-scripters', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Instagram Story Templates', 'ai-instagram-story-templates', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI TikTok Script Writers', 'ai-tiktok-script-writers', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI TikTok Hook Generators', 'ai-tiktok-hook-generators', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI TikTok Hashtag Tools', 'ai-tiktok-hashtag-tools', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI YouTube Title Optimizers', 'ai-youtube-title-optimizers', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI YouTube Thumbnail Generators', 'ai-youtube-thumbnail-generators', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI YouTube Description Writers', 'ai-youtube-description-writers', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI YouTube Tag Tools', 'ai-youtube-tag-tools', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI YouTube Shorts Scripters', 'ai-youtube-shorts-scripters', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Pinterest Pin Designers', 'ai-pinterest-pin-designers', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Pinterest Board Planners', 'ai-pinterest-board-planners', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Facebook Post Writers', 'ai-facebook-post-writers', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Facebook Group Engagement Tools', 'ai-facebook-group-engagement-tools', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Reddit Reply Helpers', 'ai-reddit-reply-helpers', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Threads Post Writers', 'ai-threads-post-writers', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Bluesky Post Writers', 'ai-bluesky-post-writers', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Mastodon Post Writers', 'ai-mastodon-post-writers', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Quora Answer Drafters', 'ai-quora-answer-drafters', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Substack Note Writers', 'ai-substack-note-writers', 3, id, 1, 1, 1, 280
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Multi-Account Schedulers', 'ai-multi-account-schedulers', 3, id, 1, 1, 1, 290
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Best-Time-to-Post Predictors', 'ai-best-time-to-post-predictors', 3, id, 1, 1, 1, 300
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Comment Moderation Bots', 'ai-comment-moderation-bots', 3, id, 1, 1, 1, 310
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI DM Auto-Responders', 'ai-dm-auto-responders', 3, id, 1, 1, 1, 320
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI UGC Aggregators', 'ai-ugc-aggregators', 3, id, 1, 1, 1, 330
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Viral Trend Spotters', 'ai-viral-trend-spotters', 3, id, 1, 1, 1, 340
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Audio-to-Reels Tools', 'ai-audio-to-reels-tools', 3, id, 1, 1, 1, 350
FROM categories WHERE slug = 'ai-social-media' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Tweet-to-Carousel Tools', 'ai-tweet-to-carousel-tools', 3, id, 1, 1, 1, 360
FROM categories WHERE slug = 'ai-social-media' AND level = 2;

-- AI Sales & Outreach (24 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI SDR Agents', 'ai-sdr-agents', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-sales-outreach' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cold Email Personalizers', 'ai-cold-email-personalizers', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-sales-outreach' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cold Call Script Builders', 'ai-cold-call-script-builders', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-sales-outreach' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Voicemail Drop Generators', 'ai-voicemail-drop-generators', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-sales-outreach' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI LinkedIn Outreach Tools', 'ai-linkedin-outreach-tools', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-sales-outreach' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Sales Sequence Builders', 'ai-sales-sequence-builders', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-sales-outreach' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Reply Handlers', 'ai-reply-handlers', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-sales-outreach' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Objection Handling Trainers', 'ai-objection-handling-trainers', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-sales-outreach' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Discovery Call Coaches', 'ai-discovery-call-coaches', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-sales-outreach' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Demo Coaches', 'ai-demo-coaches', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-sales-outreach' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Negotiation Coaches', 'ai-negotiation-coaches', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-sales-outreach' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Quote-to-Close Tools', 'ai-quote-to-close-tools', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-sales-outreach' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Proposal Builders', 'ai-proposal-builders', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-sales-outreach' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI RFP Response Tools', 'ai-rfp-response-tools', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-sales-outreach' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Contract Redlining Tools', 'ai-contract-redlining-tools', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-sales-outreach' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Pricing Page Generators', 'ai-pricing-page-generators', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-sales-outreach' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Sales Battle Card Builders', 'ai-sales-battle-card-builders', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-sales-outreach' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Win-Loss Analysis Tools', 'ai-win-loss-analysis-tools', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-sales-outreach' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Account Research Tools', 'ai-account-research-tools', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-sales-outreach' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Buyer Intent Signal Tools', 'ai-buyer-intent-signal-tools', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-sales-outreach' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Sales Forecasting Copilots', 'ai-sales-forecasting-copilots', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-sales-outreach' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Pipeline Hygiene Bots', 'ai-pipeline-hygiene-bots', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-sales-outreach' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Deal Risk Predictors', 'ai-deal-risk-predictors', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-sales-outreach' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Renewal & Expansion Tools', 'ai-renewal-expansion-tools', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-sales-outreach' AND level = 2;

-- AI Customer Support (16 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Help Center Authoring', 'ai-help-center-authoring', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-customer-support' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Macros & Canned Reply Tools', 'ai-macros-canned-reply-tools', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-customer-support' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Tier-1 Deflection Bots', 'ai-tier-1-deflection-bots', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-customer-support' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Multilingual Support Bots', 'ai-multilingual-support-bots', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-customer-support' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Voice Support Agents', 'ai-voice-support-agents', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-customer-support' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Email Support Agents', 'ai-email-support-agents', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-customer-support' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Live Chat Copilots', 'ai-live-chat-copilots', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-customer-support' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Conversation Quality Scorers', 'ai-conversation-quality-scorers', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-customer-support' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Agent Coaching Tools', 'ai-agent-coaching-tools', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-customer-support' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Escalation Predictors', 'ai-escalation-predictors', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-customer-support' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Customer Health Score Tools', 'ai-customer-health-score-tools', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-customer-support' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Churn Prediction Tools', 'ai-churn-prediction-tools', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-customer-support' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Renewal Risk Tools', 'ai-renewal-risk-tools', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-customer-support' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI VOC Synthesis', 'ai-voc-synthesis', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-customer-support' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Bug Report Triage Tools', 'ai-bug-report-triage-tools', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-customer-support' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Feature Request Clustering', 'ai-feature-request-clustering', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-customer-support' AND level = 2;

-- AI Finance & Accounting (35 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Personal Budgeting Coaches', 'ai-personal-budgeting-coaches', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Bill Negotiation Tools', 'ai-bill-negotiation-tools', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Subscription Trackers', 'ai-subscription-trackers', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Receipt Capture Tools', 'ai-receipt-capture-tools', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Expense Categorization', 'ai-expense-categorization', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Mileage Trackers', 'ai-mileage-trackers', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Per Diem Calculators', 'ai-per-diem-calculators', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Freelancer Bookkeeping', 'ai-freelancer-bookkeeping', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Small-Business Bookkeeping', 'ai-small-business-bookkeeping', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Sales Tax Compliance', 'ai-sales-tax-compliance', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI VAT Compliance', 'ai-vat-compliance', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Tax Filing Helpers', 'ai-tax-filing-helpers', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Crypto Tax Calculators', 'ai-crypto-tax-calculators', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI W-9 / 1099 Helpers', 'ai-w-9-1099-helpers', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Payroll Helpers', 'ai-payroll-helpers', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cap Table Tools', 'ai-cap-table-tools', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Startup Financial Models', 'ai-startup-financial-models', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Investor Update Generators', 'ai-investor-update-generators', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Pitch Deck Financial Slides', 'ai-pitch-deck-financial-slides', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Unit Economics Calculators', 'ai-unit-economics-calculators', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI ROI Calculators', 'ai-roi-calculators', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Mortgage Calculators', 'ai-mortgage-calculators', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Loan Comparison Tools', 'ai-loan-comparison-tools', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Insurance Comparison Tools', 'ai-insurance-comparison-tools', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Stock Idea Generators', 'ai-stock-idea-generators', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Earnings Report Summarizers', 'ai-earnings-report-summarizers', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Stock Screener Copilots', 'ai-stock-screener-copilots', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Crypto Market Analyzers', 'ai-crypto-market-analyzers', 3, id, 1, 1, 1, 280
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI On-Chain Analytics', 'ai-on-chain-analytics', 3, id, 1, 1, 1, 290
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI DeFi Yield Trackers', 'ai-defi-yield-trackers', 3, id, 1, 1, 1, 300
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Trading Strategy Backtesters', 'ai-trading-strategy-backtesters', 3, id, 1, 1, 1, 310
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Risk Scoring Tools', 'ai-risk-scoring-tools', 3, id, 1, 1, 1, 320
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Credit Decisioning Tools', 'ai-credit-decisioning-tools', 3, id, 1, 1, 1, 330
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI AML Transaction Monitoring', 'ai-aml-transaction-monitoring', 3, id, 1, 1, 1, 340
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI KYC Document Verifiers', 'ai-kyc-document-verifiers', 3, id, 1, 1, 1, 350
FROM categories WHERE slug = 'ai-finance-accounting' AND level = 2;

-- AI Legal & Contracts (24 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Lease Reviewers', 'ai-lease-reviewers', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-legal-contracts' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI NDA Reviewers', 'ai-nda-reviewers', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-legal-contracts' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Employment Contract Reviewers', 'ai-employment-contract-reviewers', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-legal-contracts' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Vendor Contract Reviewers', 'ai-vendor-contract-reviewers', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-legal-contracts' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Privacy Policy Reviewers', 'ai-privacy-policy-reviewers', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-legal-contracts' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Terms of Service Reviewers', 'ai-terms-of-service-reviewers', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-legal-contracts' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Freelance Contract Builders', 'ai-freelance-contract-builders', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-legal-contracts' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cease & Desist Drafters', 'ai-cease-desist-drafters', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-legal-contracts' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Demand Letter Drafters', 'ai-demand-letter-drafters', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-legal-contracts' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Will & Trust Drafters', 'ai-will-trust-drafters', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-legal-contracts' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Power of Attorney Generators', 'ai-power-of-attorney-generators', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-legal-contracts' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Small Claims Helpers', 'ai-small-claims-helpers', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-legal-contracts' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Tenant Rights Helpers', 'ai-tenant-rights-helpers', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-legal-contracts' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Immigration Form Helpers', 'ai-immigration-form-helpers', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-legal-contracts' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Visa Application Helpers', 'ai-visa-application-helpers', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-legal-contracts' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Trademark Filing Helpers', 'ai-trademark-filing-helpers', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-legal-contracts' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Copyright Registration Helpers', 'ai-copyright-registration-helpers', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-legal-contracts' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Patent Claim Drafters', 'ai-patent-claim-drafters', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-legal-contracts' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Legal Hold Tools', 'ai-legal-hold-tools', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-legal-contracts' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI eDiscovery Reviewers', 'ai-ediscovery-reviewers', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-legal-contracts' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Privilege Log Generators', 'ai-privilege-log-generators', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-legal-contracts' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Court Filing Drafters', 'ai-court-filing-drafters', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-legal-contracts' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Deposition Prep Tools', 'ai-deposition-prep-tools', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-legal-contracts' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Legal Memo Drafters', 'ai-legal-memo-drafters', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-legal-contracts' AND level = 2;

-- AI HR, Recruiting & Careers (28 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Resume Parsers', 'ai-resume-parsers', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Resume Optimizers for ATS', 'ai-resume-optimizers-for-ats', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Resume Keyword Matchers', 'ai-resume-keyword-matchers', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cover Letter Tailoring', 'ai-cover-letter-tailoring', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI LinkedIn Profile Optimizers', 'ai-linkedin-profile-optimizers', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Job Search Agents', 'ai-job-search-agents', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Job Match Engines', 'ai-job-match-engines', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Career Path Planners', 'ai-career-path-planners', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Salary Negotiation Coaches', 'ai-salary-negotiation-coaches', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Mock Behavioral Interviewers', 'ai-mock-behavioral-interviewers', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Mock Technical Interviewers', 'ai-mock-technical-interviewers', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Mock Case Interviewers', 'ai-mock-case-interviewers', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Pitch Practice Tools', 'ai-pitch-practice-tools', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Recruiter Sourcing Tools', 'ai-recruiter-sourcing-tools', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Boolean Search Builders', 'ai-boolean-search-builders', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Candidate Outreach Tools', 'ai-candidate-outreach-tools', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Interview Scheduling Bots', 'ai-interview-scheduling-bots', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Reference Checking Bots', 'ai-reference-checking-bots', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Skills Assessment Builders', 'ai-skills-assessment-builders', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Coding Test Generators', 'ai-coding-test-generators', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Personality Assessment Tools', 'ai-personality-assessment-tools', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Onboarding Buddy Bots', 'ai-onboarding-buddy-bots', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Employee Handbook Q&A', 'ai-employee-handbook-qa', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Internal Mobility Tools', 'ai-internal-mobility-tools', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Performance Review Drafters', 'ai-performance-review-drafters', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI 360 Feedback Synthesizers', 'ai-360-feedback-synthesizers', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Engagement Pulse Tools', 'ai-engagement-pulse-tools', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Compensation Benchmarking', 'ai-compensation-benchmarking', 3, id, 1, 1, 1, 280
FROM categories WHERE slug = 'ai-hr-recruiting-careers' AND level = 2;

-- AI Education & Tutoring (43 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI K-12 Math Tutors', 'ai-k-12-math-tutors', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI K-12 Reading Tutors', 'ai-k-12-reading-tutors', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI K-12 Science Tutors', 'ai-k-12-science-tutors', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI College Math Tutors', 'ai-college-math-tutors', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI College Writing Tutors', 'ai-college-writing-tutors', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Programming Tutors', 'ai-programming-tutors', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Statistics Tutors', 'ai-statistics-tutors', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Physics Tutors', 'ai-physics-tutors', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Chemistry Tutors', 'ai-chemistry-tutors', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Biology Tutors', 'ai-biology-tutors', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI History Tutors', 'ai-history-tutors', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Geography Tutors', 'ai-geography-tutors', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI SAT Prep Tutors', 'ai-sat-prep-tutors', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI ACT Prep Tutors', 'ai-act-prep-tutors', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI GRE Prep Tutors', 'ai-gre-prep-tutors', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI GMAT Prep Tutors', 'ai-gmat-prep-tutors', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI LSAT Prep Tutors', 'ai-lsat-prep-tutors', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI MCAT Prep Tutors', 'ai-mcat-prep-tutors', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI IELTS Prep Tutors', 'ai-ielts-prep-tutors', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI TOEFL Prep Tutors', 'ai-toefl-prep-tutors', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Bar Exam Prep Tutors', 'ai-bar-exam-prep-tutors', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI USMLE Prep Tutors', 'ai-usmle-prep-tutors', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI CFA Prep Tutors', 'ai-cfa-prep-tutors', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI AWS Cert Prep Tools', 'ai-aws-cert-prep-tools', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Language Conversation Partners', 'ai-language-conversation-partners', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Pronunciation Coaches', 'ai-pronunciation-coaches', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Vocabulary Drill Apps', 'ai-vocabulary-drill-apps', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Reading Comprehension Helpers', 'ai-reading-comprehension-helpers', 3, id, 1, 1, 1, 280
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Spaced-Repetition Tools', 'ai-spaced-repetition-tools', 3, id, 1, 1, 1, 290
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Flashcard Generators', 'ai-flashcard-generators', 3, id, 1, 1, 1, 300
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cheat-Sheet Generators', 'ai-cheat-sheet-generators', 3, id, 1, 1, 1, 310
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Study Plan Builders', 'ai-study-plan-builders', 3, id, 1, 1, 1, 320
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Lecture Note Organizers', 'ai-lecture-note-organizers', 3, id, 1, 1, 1, 330
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Lab Report Helpers', 'ai-lab-report-helpers', 3, id, 1, 1, 1, 340
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Citation Helpers', 'ai-citation-helpers', 3, id, 1, 1, 1, 350
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Plagiarism Risk Checkers', 'ai-plagiarism-risk-checkers', 3, id, 1, 1, 1, 360
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Lesson Plan Builders for Teachers', 'ai-lesson-plan-builders-for-teachers', 3, id, 1, 1, 1, 370
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Worksheet Generators', 'ai-worksheet-generators', 3, id, 1, 1, 1, 380
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Rubric Generators', 'ai-rubric-generators', 3, id, 1, 1, 1, 390
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Auto-Grading Tools', 'ai-auto-grading-tools', 3, id, 1, 1, 1, 400
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Differentiated Instruction Tools', 'ai-differentiated-instruction-tools', 3, id, 1, 1, 1, 410
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI IEP Drafting Tools', 'ai-iep-drafting-tools', 3, id, 1, 1, 1, 420
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Parent-Teacher Communication Tools', 'ai-parent-teacher-communication-tools', 3, id, 1, 1, 1, 430
FROM categories WHERE slug = 'ai-education-tutoring' AND level = 2;

-- AI Healthcare & Medical (39 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Symptom Triage Tools', 'ai-symptom-triage-tools', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Medical Knowledge Q&A', 'ai-medical-knowledge-qa', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Drug Interaction Checkers', 'ai-drug-interaction-checkers', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Medication Reminder Bots', 'ai-medication-reminder-bots', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Chronic Condition Coaches', 'ai-chronic-condition-coaches', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Diabetes Coaches', 'ai-diabetes-coaches', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Hypertension Coaches', 'ai-hypertension-coaches', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cancer Support Companions', 'ai-cancer-support-companions', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Pregnancy Tracking Bots', 'ai-pregnancy-tracking-bots', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Postpartum Support Bots', 'ai-postpartum-support-bots', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Pediatric Symptom Tools', 'ai-pediatric-symptom-tools', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Elder Care Companions', 'ai-elder-care-companions', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Mental Health Chatbots', 'ai-mental-health-chatbots', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI CBT Self-Help Tools', 'ai-cbt-self-help-tools', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Anxiety Coaches', 'ai-anxiety-coaches', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Sleep Therapy Bots', 'ai-sleep-therapy-bots', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Addiction Recovery Bots', 'ai-addiction-recovery-bots', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Grief Support Bots', 'ai-grief-support-bots', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Crisis Hotline Support Tools', 'ai-crisis-hotline-support-tools', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Therapy Note Drafting', 'ai-therapy-note-drafting', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI SOAP Note Drafting', 'ai-soap-note-drafting', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Clinical Coding Assistants', 'ai-clinical-coding-assistants', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Prior Authorization Assistants', 'ai-prior-authorization-assistants', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Medical Billing Helpers', 'ai-medical-billing-helpers', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Patient Intake Bots', 'ai-patient-intake-bots', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Appointment Reminder Bots', 'ai-appointment-reminder-bots', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Radiology Reading Assistants', 'ai-radiology-reading-assistants', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Pathology Slide Analysis', 'ai-pathology-slide-analysis', 3, id, 1, 1, 1, 280
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Dermatology Image Triage', 'ai-dermatology-image-triage', 3, id, 1, 1, 1, 290
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Ophthalmology Screening', 'ai-ophthalmology-screening', 3, id, 1, 1, 1, 300
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI ECG Analysis', 'ai-ecg-analysis', 3, id, 1, 1, 1, 310
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Wearable Health Insights', 'ai-wearable-health-insights', 3, id, 1, 1, 1, 320
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Fitness Tracker Insights', 'ai-fitness-tracker-insights', 3, id, 1, 1, 1, 330
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Genetic Test Interpretation', 'ai-genetic-test-interpretation', 3, id, 1, 1, 1, 340
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Drug Discovery Assistants', 'ai-drug-discovery-assistants', 3, id, 1, 1, 1, 350
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Protein Structure Tools', 'ai-protein-structure-tools', 3, id, 1, 1, 1, 360
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Clinical Trial Matching', 'ai-clinical-trial-matching', 3, id, 1, 1, 1, 370
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Medical Literature Review', 'ai-medical-literature-review', 3, id, 1, 1, 1, 380
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Veterinary Symptom Tools', 'ai-veterinary-symptom-tools', 3, id, 1, 1, 1, 390
FROM categories WHERE slug = 'ai-healthcare-medical' AND level = 2;

-- AI Fitness, Nutrition & Wellness (27 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Strength Training Coaches', 'ai-strength-training-coaches', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-fitness-nutrition-wellness' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Running Plan Coaches', 'ai-running-plan-coaches', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-fitness-nutrition-wellness' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Triathlon Coaches', 'ai-triathlon-coaches', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-fitness-nutrition-wellness' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Yoga Sequence Builders', 'ai-yoga-sequence-builders', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-fitness-nutrition-wellness' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Pilates Routine Builders', 'ai-pilates-routine-builders', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-fitness-nutrition-wellness' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Stretching Routine Builders', 'ai-stretching-routine-builders', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-fitness-nutrition-wellness' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Mobility Coaches', 'ai-mobility-coaches', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-fitness-nutrition-wellness' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Posture Correction Coaches', 'ai-posture-correction-coaches', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-fitness-nutrition-wellness' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Bodyweight Workout Builders', 'ai-bodyweight-workout-builders', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-fitness-nutrition-wellness' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Home Gym Workout Builders', 'ai-home-gym-workout-builders', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-fitness-nutrition-wellness' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Macro Tracking Coaches', 'ai-macro-tracking-coaches', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-fitness-nutrition-wellness' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Vegan Meal Planners', 'ai-vegan-meal-planners', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-fitness-nutrition-wellness' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Keto Meal Planners', 'ai-keto-meal-planners', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-fitness-nutrition-wellness' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Mediterranean Meal Planners', 'ai-mediterranean-meal-planners', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-fitness-nutrition-wellness' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Diabetic-Friendly Meal Planners', 'ai-diabetic-friendly-meal-planners', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-fitness-nutrition-wellness' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Allergy-Aware Meal Planners', 'ai-allergy-aware-meal-planners', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-fitness-nutrition-wellness' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Grocery List Generators', 'ai-grocery-list-generators', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-fitness-nutrition-wellness' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Pantry-Based Recipe Tools', 'ai-pantry-based-recipe-tools', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-fitness-nutrition-wellness' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Hydration Coaches', 'ai-hydration-coaches', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-fitness-nutrition-wellness' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Fasting Coaches', 'ai-fasting-coaches', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-fitness-nutrition-wellness' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Sleep Quality Coaches', 'ai-sleep-quality-coaches', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-fitness-nutrition-wellness' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Stress Management Coaches', 'ai-stress-management-coaches', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-fitness-nutrition-wellness' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Breathwork Guides', 'ai-breathwork-guides', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-fitness-nutrition-wellness' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cold Plunge Coaches', 'ai-cold-plunge-coaches', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-fitness-nutrition-wellness' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Sauna Routine Coaches', 'ai-sauna-routine-coaches', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-fitness-nutrition-wellness' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Habit Streak Coaches', 'ai-habit-streak-coaches', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-fitness-nutrition-wellness' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Recovery & Soreness Coaches', 'ai-recovery-soreness-coaches', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-fitness-nutrition-wellness' AND level = 2;

-- AI Lifestyle, Relationships & Personal (33 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Dating Profile Coaches', 'ai-dating-profile-coaches', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Dating Photo Selectors', 'ai-dating-photo-selectors', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Dating App Reply Helpers', 'ai-dating-app-reply-helpers', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Relationship Communication Coaches', 'ai-relationship-communication-coaches', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Couples Therapy Helpers', 'ai-couples-therapy-helpers', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Conflict Resolution Coaches', 'ai-conflict-resolution-coaches', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Long-Distance Relationship Helpers', 'ai-long-distance-relationship-helpers', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Parenting Advice Bots', 'ai-parenting-advice-bots', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI New Parent Support Bots', 'ai-new-parent-support-bots', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Toddler Activity Generators', 'ai-toddler-activity-generators', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Bedtime Story Generators', 'ai-bedtime-story-generators', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Kids Adventure Story Builders', 'ai-kids-adventure-story-builders', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Sibling Conflict Mediators', 'ai-sibling-conflict-mediators', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Family Calendar Helpers', 'ai-family-calendar-helpers', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Household Chore Allocators', 'ai-household-chore-allocators', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Roommate Bill Splitters', 'ai-roommate-bill-splitters', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Friendship Building Coaches', 'ai-friendship-building-coaches', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Small Talk Helpers', 'ai-small-talk-helpers', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Birthday Reminder Bots', 'ai-birthday-reminder-bots', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Gift Idea Generators', 'ai-gift-idea-generators', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Anniversary Helpers', 'ai-anniversary-helpers', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Apology Drafters', 'ai-apology-drafters', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Compliment Generators', 'ai-compliment-generators', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Love Letter Drafters', 'ai-love-letter-drafters', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Astrology Compatibility Tools', 'ai-astrology-compatibility-tools', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Numerology Tools', 'ai-numerology-tools', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Horoscope Generators', 'ai-horoscope-generators', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Tarot Reading Apps', 'ai-tarot-reading-apps', 3, id, 1, 1, 1, 280
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Dream Journal Interpreters', 'ai-dream-journal-interpreters', 3, id, 1, 1, 1, 290
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Manifestation Coaches', 'ai-manifestation-coaches', 3, id, 1, 1, 1, 300
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Life Coaching Bots', 'ai-life-coaching-bots', 3, id, 1, 1, 1, 310
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Confidence Coaches', 'ai-confidence-coaches', 3, id, 1, 1, 1, 320
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Self-Esteem Coaches', 'ai-self-esteem-coaches', 3, id, 1, 1, 1, 330
FROM categories WHERE slug = 'ai-lifestyle-relationships-personal' AND level = 2;

-- AI Travel & Local Discovery (29 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Personalized Trip Planners', 'ai-personalized-trip-planners', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Multi-City Itinerary Builders', 'ai-multi-city-itinerary-builders', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Family Trip Planners', 'ai-family-trip-planners', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Solo Travel Planners', 'ai-solo-travel-planners', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Honeymoon Planners', 'ai-honeymoon-planners', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Backpacker Route Planners', 'ai-backpacker-route-planners', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Road Trip Planners', 'ai-road-trip-planners', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI RV Trip Planners', 'ai-rv-trip-planners', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cruise Itinerary Builders', 'ai-cruise-itinerary-builders', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI National Park Trip Planners', 'ai-national-park-trip-planners', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Hiking Trail Recommenders', 'ai-hiking-trail-recommenders', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Camping Spot Finders', 'ai-camping-spot-finders', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Foodie Travel Planners', 'ai-foodie-travel-planners', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Hidden-Gem Recommenders', 'ai-hidden-gem-recommenders', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Local Event Finders', 'ai-local-event-finders', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Nightlife Recommenders', 'ai-nightlife-recommenders', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Day-Trip Planners', 'ai-day-trip-planners', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Weekend Getaway Builders', 'ai-weekend-getaway-builders', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Budget Travel Planners', 'ai-budget-travel-planners', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Luxury Travel Planners', 'ai-luxury-travel-planners', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Business Travel Planners', 'ai-business-travel-planners', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Visa Requirement Lookup Tools', 'ai-visa-requirement-lookup-tools', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Travel Document Helpers', 'ai-travel-document-helpers', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Currency Conversion Helpers', 'ai-currency-conversion-helpers', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Flight Deal Trackers', 'ai-flight-deal-trackers', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Hotel Deal Finders', 'ai-hotel-deal-finders', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Airbnb Listing Optimizers', 'ai-airbnb-listing-optimizers', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Travel Translation Earpieces (Apps)', 'ai-travel-translation-earpieces-apps', 3, id, 1, 1, 1, 280
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Tour Guide Apps', 'ai-tour-guide-apps', 3, id, 1, 1, 1, 290
FROM categories WHERE slug = 'ai-travel-local-discovery' AND level = 2;

-- AI Real Estate & Property (21 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Buyer Match Engines', 'ai-buyer-match-engines', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-real-estate-property' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Home Search Agents', 'ai-home-search-agents', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-real-estate-property' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Neighborhood Insight Tools', 'ai-neighborhood-insight-tools', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-real-estate-property' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI School District Lookup Tools', 'ai-school-district-lookup-tools', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-real-estate-property' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Commute Time Analyzers', 'ai-commute-time-analyzers', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-real-estate-property' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Walkability Score Tools', 'ai-walkability-score-tools', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-real-estate-property' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Home Value Estimators', 'ai-home-value-estimators', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-real-estate-property' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Rent Estimators', 'ai-rent-estimators', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-real-estate-property' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Listing Description Writers', 'ai-listing-description-writers', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-real-estate-property' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Listing Photo Enhancers', 'ai-listing-photo-enhancers', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-real-estate-property' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Virtual Staging Tools', 'ai-virtual-staging-tools', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-real-estate-property' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Floorplan Generators', 'ai-floorplan-generators', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-real-estate-property' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI 3D Walkthrough Generators', 'ai-3d-walkthrough-generators', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-real-estate-property' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Home Renovation Planners', 'ai-home-renovation-planners', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-real-estate-property' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Mortgage Affordability Tools', 'ai-mortgage-affordability-tools', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-real-estate-property' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Refinance Analysis Tools', 'ai-refinance-analysis-tools', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-real-estate-property' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Landlord Screening Tools', 'ai-landlord-screening-tools', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-real-estate-property' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Lease Drafting Tools', 'ai-lease-drafting-tools', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-real-estate-property' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Move-In Inspection Tools', 'ai-move-in-inspection-tools', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-real-estate-property' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Property Maintenance Bots', 'ai-property-maintenance-bots', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-real-estate-property' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI HOA Document Q&A', 'ai-hoa-document-qa', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-real-estate-property' AND level = 2;

-- AI eCommerce & Retail (27 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Shopify Storefront Builders', 'ai-shopify-storefront-builders', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-ecommerce-retail' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Amazon FBA Tools', 'ai-amazon-fba-tools', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-ecommerce-retail' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Etsy Listing Optimizers', 'ai-etsy-listing-optimizers', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-ecommerce-retail' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI eBay Listing Helpers', 'ai-ebay-listing-helpers', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-ecommerce-retail' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Walmart Marketplace Tools', 'ai-walmart-marketplace-tools', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-ecommerce-retail' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI TikTok Shop Tools', 'ai-tiktok-shop-tools', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-ecommerce-retail' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Product Title Optimizers', 'ai-product-title-optimizers', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-ecommerce-retail' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Bullet-Point Writers for Listings', 'ai-bullet-point-writers-for-listings', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-ecommerce-retail' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Product Tag Generators', 'ai-product-tag-generators', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-ecommerce-retail' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Storefront Banner Generators', 'ai-storefront-banner-generators', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-ecommerce-retail' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Ghost Mannequin Photo Tools', 'ai-ghost-mannequin-photo-tools', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-ecommerce-retail' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Model Try-On Tools', 'ai-model-try-on-tools', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-ecommerce-retail' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Virtual Fitting Rooms', 'ai-virtual-fitting-rooms', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-ecommerce-retail' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Size Recommenders', 'ai-size-recommenders', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-ecommerce-retail' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Color Variation Generators', 'ai-color-variation-generators', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-ecommerce-retail' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Bundle Suggesters', 'ai-bundle-suggesters', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-ecommerce-retail' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Upsell Recommenders', 'ai-upsell-recommenders', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-ecommerce-retail' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cart Abandonment Recovery Tools', 'ai-cart-abandonment-recovery-tools', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-ecommerce-retail' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Discount Strategy Tools', 'ai-discount-strategy-tools', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-ecommerce-retail' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Coupon Code Generators', 'ai-coupon-code-generators', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-ecommerce-retail' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Loyalty Program Builders', 'ai-loyalty-program-builders', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-ecommerce-retail' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Customer Review Summarizers', 'ai-customer-review-summarizers', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-ecommerce-retail' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Review Request Bots', 'ai-review-request-bots', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-ecommerce-retail' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Influencer Gifting Tools', 'ai-influencer-gifting-tools', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-ecommerce-retail' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Returns Insight Tools', 'ai-returns-insight-tools', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-ecommerce-retail' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Inventory Reorder Tools', 'ai-inventory-reorder-tools', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-ecommerce-retail' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Dropshipping Product Researchers', 'ai-dropshipping-product-researchers', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-ecommerce-retail' AND level = 2;

-- AI Gaming & Game Dev (26 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI NPC Dialogue Engines', 'ai-npc-dialogue-engines', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-gaming-game-dev' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Quest Generators', 'ai-quest-generators', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-gaming-game-dev' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Lore & World Builders', 'ai-lore-world-builders', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-gaming-game-dev' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Game Map Generators', 'ai-game-map-generators', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-gaming-game-dev' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Dungeon Generators', 'ai-dungeon-generators', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-gaming-game-dev' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Loot Table Generators', 'ai-loot-table-generators', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-gaming-game-dev' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Character Backstory Generators', 'ai-character-backstory-generators', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-gaming-game-dev' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Voice Lines for Games', 'ai-voice-lines-for-games', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-gaming-game-dev' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Game Soundtrack Generators', 'ai-game-soundtrack-generators', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-gaming-game-dev' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Sound Effect Packs for Games', 'ai-sound-effect-packs-for-games', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-gaming-game-dev' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI 2D Sprite Generators', 'ai-2d-sprite-generators', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-gaming-game-dev' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Tilemap Generators', 'ai-tilemap-generators', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-gaming-game-dev' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Texture Generators', 'ai-texture-generators', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-gaming-game-dev' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Normal Map Generators', 'ai-normal-map-generators', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-gaming-game-dev' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI 3D Asset Generators for Games', 'ai-3d-asset-generators-for-games', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-gaming-game-dev' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Rigging & Animation Helpers', 'ai-rigging-animation-helpers', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-gaming-game-dev' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Motion Capture Cleanup Tools', 'ai-motion-capture-cleanup-tools', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-gaming-game-dev' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Playtesting Bots', 'ai-playtesting-bots', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-gaming-game-dev' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Game Balancing Tools', 'ai-game-balancing-tools', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-gaming-game-dev' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cheat Detection Tools', 'ai-cheat-detection-tools', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-gaming-game-dev' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Game Coaching for Players', 'ai-game-coaching-for-players', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-gaming-game-dev' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Esports Stat Trackers', 'ai-esports-stat-trackers', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-gaming-game-dev' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Game Highlight Compilers', 'ai-game-highlight-compilers', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-gaming-game-dev' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI TTRPG Dungeon Master Tools', 'ai-ttrpg-dungeon-master-tools', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-gaming-game-dev' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI TTRPG Character Sheet Builders', 'ai-ttrpg-character-sheet-builders', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-gaming-game-dev' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI TTRPG Battle Map Generators', 'ai-ttrpg-battle-map-generators', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-gaming-game-dev' AND level = 2;

-- AI 3D, AR & Spatial Computing (15 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Text-to-3D Object Tools', 'ai-text-to-3d-object-tools', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-3d-ar-spatial-computing' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Image-to-3D Object Tools', 'ai-image-to-3d-object-tools', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-3d-ar-spatial-computing' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Photogrammetry Helpers', 'ai-photogrammetry-helpers', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-3d-ar-spatial-computing' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI 3D Avatar Generators', 'ai-3d-avatar-generators', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-3d-ar-spatial-computing' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI 3D Scene Composers', 'ai-3d-scene-composers', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-3d-ar-spatial-computing' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI USDZ & GLB Converters', 'ai-usdz-glb-converters', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-3d-ar-spatial-computing' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Vision Pro App Helpers', 'ai-vision-pro-app-helpers', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-3d-ar-spatial-computing' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Quest App Helpers', 'ai-quest-app-helpers', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-3d-ar-spatial-computing' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI AR Filter Builders', 'ai-ar-filter-builders', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-3d-ar-spatial-computing' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Snap Lens Builders', 'ai-snap-lens-builders', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-3d-ar-spatial-computing' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Instagram AR Effect Builders', 'ai-instagram-ar-effect-builders', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-3d-ar-spatial-computing' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Virtual Try-On for Glasses', 'ai-virtual-try-on-for-glasses', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-3d-ar-spatial-computing' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Virtual Try-On for Jewelry', 'ai-virtual-try-on-for-jewelry', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-3d-ar-spatial-computing' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI 3D Floorplan Walkthroughs', 'ai-3d-floorplan-walkthroughs', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-3d-ar-spatial-computing' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Spatial Audio Tools', 'ai-spatial-audio-tools', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-3d-ar-spatial-computing' AND level = 2;

-- AI Design, Branding & Creative (34 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Brand Color Palette Builders', 'ai-brand-color-palette-builders', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Brand Font Pairing Tools', 'ai-brand-font-pairing-tools', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Brand Voice Generators', 'ai-brand-voice-generators', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Brand Style Guide Builders', 'ai-brand-style-guide-builders', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Logo Concept Explorers', 'ai-logo-concept-explorers', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Logo Variation Tools', 'ai-logo-variation-tools', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Logo Animation Tools', 'ai-logo-animation-tools', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Business Card Designers', 'ai-business-card-designers', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Letterhead Designers', 'ai-letterhead-designers', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Pitch Deck Designers', 'ai-pitch-deck-designers', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Investor Deck Designers', 'ai-investor-deck-designers', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Sales Deck Designers', 'ai-sales-deck-designers', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Onboarding Deck Builders', 'ai-onboarding-deck-builders', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Resume Designers', 'ai-resume-designers', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Wedding Invitation Designers', 'ai-wedding-invitation-designers', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Birthday Invitation Designers', 'ai-birthday-invitation-designers', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Save-the-Date Designers', 'ai-save-the-date-designers', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Thank-You Card Designers', 'ai-thank-you-card-designers', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Holiday Card Designers', 'ai-holiday-card-designers', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Menu Designers', 'ai-menu-designers', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Flyer Designers', 'ai-flyer-designers', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Brochure Designers', 'ai-brochure-designers', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Trifold Designers', 'ai-trifold-designers', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Magazine Layout Designers', 'ai-magazine-layout-designers', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Newspaper Layout Designers', 'ai-newspaper-layout-designers', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Comic Layout Tools', 'ai-comic-layout-tools', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Manga Layout Tools', 'ai-manga-layout-tools', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Zine Builders', 'ai-zine-builders', 3, id, 1, 1, 1, 280
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Print-on-Demand Mockup Tools', 'ai-print-on-demand-mockup-tools', 3, id, 1, 1, 1, 290
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Sublimation Design Tools', 'ai-sublimation-design-tools', 3, id, 1, 1, 1, 300
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Embroidery Pattern Designers', 'ai-embroidery-pattern-designers', 3, id, 1, 1, 1, 310
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cricut Design Tools', 'ai-cricut-design-tools', 3, id, 1, 1, 1, 320
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Vinyl Cut File Tools', 'ai-vinyl-cut-file-tools', 3, id, 1, 1, 1, 330
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI 3D Printing STL Generators', 'ai-3d-printing-stl-generators', 3, id, 1, 1, 1, 340
FROM categories WHERE slug = 'ai-design-branding-creative' AND level = 2;

-- AI Document, PDF & Forms (24 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI PDF Q&A Chat', 'ai-pdf-qa-chat', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-document-pdf-forms' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI PDF Highlighter & Note Tools', 'ai-pdf-highlighter-note-tools', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-document-pdf-forms' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI PDF Translator', 'ai-pdf-translator', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-document-pdf-forms' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Multi-Document Comparison', 'ai-multi-document-comparison', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-document-pdf-forms' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Contract Clause Extractors', 'ai-contract-clause-extractors', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-document-pdf-forms' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Lease Clause Extractors', 'ai-lease-clause-extractors', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-document-pdf-forms' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Bank Statement Parsers', 'ai-bank-statement-parsers', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-document-pdf-forms' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Pay Stub Parsers', 'ai-pay-stub-parsers', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-document-pdf-forms' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Utility Bill Parsers', 'ai-utility-bill-parsers', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-document-pdf-forms' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Tax Form Parsers', 'ai-tax-form-parsers', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-document-pdf-forms' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Medical Record Parsers', 'ai-medical-record-parsers', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-document-pdf-forms' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Insurance Claim Form Parsers', 'ai-insurance-claim-form-parsers', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-document-pdf-forms' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Shipping Label Extractors', 'ai-shipping-label-extractors', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-document-pdf-forms' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Business Card Scanners', 'ai-business-card-scanners', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-document-pdf-forms' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Handwritten Form Digitizers', 'ai-handwritten-form-digitizers', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-document-pdf-forms' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Whiteboard Photo Digitizers', 'ai-whiteboard-photo-digitizers', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-document-pdf-forms' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Slide Photo Digitizers', 'ai-slide-photo-digitizers', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-document-pdf-forms' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Receipt to Spreadsheet Tools', 'ai-receipt-to-spreadsheet-tools', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-document-pdf-forms' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Invoice to Accounting Tools', 'ai-invoice-to-accounting-tools', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-document-pdf-forms' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Form Auto-Fillers', 'ai-form-auto-fillers', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-document-pdf-forms' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Government Form Helpers', 'ai-government-form-helpers', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-document-pdf-forms' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Visa & Immigration Form Helpers', 'ai-visa-immigration-form-helpers', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-document-pdf-forms' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Loan Application Form Helpers', 'ai-loan-application-form-helpers', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-document-pdf-forms' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Insurance Claim Form Helpers', 'ai-insurance-claim-form-helpers', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-document-pdf-forms' AND level = 2;

-- AI Cybersecurity & Privacy (29 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Smishing SMS Detectors', 'ai-smishing-sms-detectors', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Vishing Voice Scam Detectors', 'ai-vishing-voice-scam-detectors', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Deepfake Audio Detectors', 'ai-deepfake-audio-detectors', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Deepfake Video Detectors', 'ai-deepfake-video-detectors', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Synthetic Identity Detectors', 'ai-synthetic-identity-detectors', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Fraud Pattern Detectors', 'ai-fraud-pattern-detectors', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Bot Traffic Detectors', 'ai-bot-traffic-detectors', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Account Takeover Detectors', 'ai-account-takeover-detectors', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Anomaly-Based Intrusion Detection', 'ai-anomaly-based-intrusion-detection', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI SOC Triage Copilots', 'ai-soc-triage-copilots', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Threat Intelligence Synthesizers', 'ai-threat-intelligence-synthesizers', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Vulnerability Prioritization', 'ai-vulnerability-prioritization', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Patch Management Copilots', 'ai-patch-management-copilots', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cloud Misconfiguration Scanners', 'ai-cloud-misconfiguration-scanners', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Container Security Scanners', 'ai-container-security-scanners', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Code Secret Scanners', 'ai-code-secret-scanners', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Source Code Backdoor Detectors', 'ai-source-code-backdoor-detectors', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Penetration Testing Helpers', 'ai-penetration-testing-helpers', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Red Team Simulation Tools', 'ai-red-team-simulation-tools', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Phishing Simulation Builders', 'ai-phishing-simulation-builders', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Security Awareness Training', 'ai-security-awareness-training', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Privacy Risk Assessors', 'ai-privacy-risk-assessors', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Data Anonymization Tools', 'ai-data-anonymization-tools', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI PII Redaction Tools', 'ai-pii-redaction-tools', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI GDPR Compliance Helpers', 'ai-gdpr-compliance-helpers', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI HIPAA Compliance Helpers', 'ai-hipaa-compliance-helpers', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI SOC2 Audit Helpers', 'ai-soc2-audit-helpers', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI ISO 27001 Helpers', 'ai-iso-27001-helpers', 3, id, 1, 1, 1, 280
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Zero-Trust Policy Generators', 'ai-zero-trust-policy-generators', 3, id, 1, 1, 1, 290
FROM categories WHERE slug = 'ai-cybersecurity-privacy' AND level = 2;

-- AI Safety, Ethics & Trust (18 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Output Watermarking Tools', 'ai-output-watermarking-tools', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-safety-ethics-trust' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Provenance Tracking (C2PA)', 'ai-provenance-tracking-c2pa', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-safety-ethics-trust' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Image-Origin Detectors', 'ai-image-origin-detectors', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-safety-ethics-trust' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Text-Origin Detectors', 'ai-text-origin-detectors', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-safety-ethics-trust' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Model Card Generators', 'ai-model-card-generators', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-safety-ethics-trust' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Datasheet Generators for Datasets', 'ai-datasheet-generators-for-datasets', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-safety-ethics-trust' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Bias Auditing Tools', 'ai-bias-auditing-tools', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-safety-ethics-trust' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Fairness Metric Tools', 'ai-fairness-metric-tools', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-safety-ethics-trust' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Explainability Toolkits', 'ai-explainability-toolkits', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-safety-ethics-trust' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Hallucination Detectors', 'ai-hallucination-detectors', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-safety-ethics-trust' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Jailbreak Testing Tools', 'ai-jailbreak-testing-tools', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-safety-ethics-trust' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Prompt Injection Defenses', 'ai-prompt-injection-defenses', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-safety-ethics-trust' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Content Moderation APIs', 'ai-content-moderation-apis', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-safety-ethics-trust' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI CSAM Detection Tools', 'ai-csam-detection-tools', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-safety-ethics-trust' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Toxicity Classifiers', 'ai-toxicity-classifiers', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-safety-ethics-trust' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Misinformation Detection', 'ai-misinformation-detection', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-safety-ethics-trust' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Election Integrity Tools', 'ai-election-integrity-tools', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-safety-ethics-trust' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Age Verification Tools', 'ai-age-verification-tools', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-safety-ethics-trust' AND level = 2;

-- AI Agents & Autonomous Systems (20 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Computer-Use Browser Agents', 'ai-computer-use-browser-agents', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-agents-autonomous-systems' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Web Form-Filling Agents', 'ai-web-form-filling-agents', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-agents-autonomous-systems' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Data Entry Agents', 'ai-data-entry-agents', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-agents-autonomous-systems' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Travel Booking Agents', 'ai-travel-booking-agents', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-agents-autonomous-systems' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Restaurant Reservation Agents', 'ai-restaurant-reservation-agents', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-agents-autonomous-systems' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Shopping Comparison Agents', 'ai-shopping-comparison-agents', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-agents-autonomous-systems' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Price Drop Watcher Agents', 'ai-price-drop-watcher-agents', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-agents-autonomous-systems' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Job Application Agents', 'ai-job-application-agents', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-agents-autonomous-systems' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cold Outreach Agents', 'ai-cold-outreach-agents', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-agents-autonomous-systems' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Social Media Engagement Agents', 'ai-social-media-engagement-agents', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-agents-autonomous-systems' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Inbox Triage Agents', 'ai-inbox-triage-agents', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-agents-autonomous-systems' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Calendar Scheduling Agents', 'ai-calendar-scheduling-agents', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-agents-autonomous-systems' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Personal Concierge Agents', 'ai-personal-concierge-agents', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-agents-autonomous-systems' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Research-and-Report Agents', 'ai-research-and-report-agents', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-agents-autonomous-systems' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Spreadsheet Update Agents', 'ai-spreadsheet-update-agents', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-agents-autonomous-systems' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI File Organization Agents', 'ai-file-organization-agents', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-agents-autonomous-systems' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Photo Library Cleanup Agents', 'ai-photo-library-cleanup-agents', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-agents-autonomous-systems' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cloud Cost Cutter Agents', 'ai-cloud-cost-cutter-agents', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-agents-autonomous-systems' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Continuous Monitoring Agents', 'ai-continuous-monitoring-agents', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-agents-autonomous-systems' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI On-Call Triage Agents', 'ai-on-call-triage-agents', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-agents-autonomous-systems' AND level = 2;

-- AI Hardware, Robotics & Embedded (14 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Robot Vision Tools', 'ai-robot-vision-tools', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-hardware-robotics-embedded' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Robot Navigation Stacks', 'ai-robot-navigation-stacks', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-hardware-robotics-embedded' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI SLAM Tools', 'ai-slam-tools', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-hardware-robotics-embedded' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Drone Flight Planners', 'ai-drone-flight-planners', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-hardware-robotics-embedded' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Drone Inspection Tools', 'ai-drone-inspection-tools', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-hardware-robotics-embedded' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Self-Driving Simulation Tools', 'ai-self-driving-simulation-tools', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-hardware-robotics-embedded' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Warehouse Robotics Tools', 'ai-warehouse-robotics-tools', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-hardware-robotics-embedded' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cobot Programming Tools', 'ai-cobot-programming-tools', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-hardware-robotics-embedded' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Edge Vision SDKs', 'ai-edge-vision-sdks', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-hardware-robotics-embedded' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Embedded ML Toolchains', 'ai-embedded-ml-toolchains', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-hardware-robotics-embedded' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Microcontroller Inference', 'ai-microcontroller-inference', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-hardware-robotics-embedded' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Smart Camera Tools', 'ai-smart-camera-tools', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-hardware-robotics-embedded' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Smart Doorbell AI', 'ai-smart-doorbell-ai', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-hardware-robotics-embedded' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Smart Home Automation', 'ai-smart-home-automation', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-hardware-robotics-embedded' AND level = 2;

-- AI for Vertical Industries (57 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Agriculture Crop Monitoring', 'ai-for-agriculture-crop-monitoring', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Livestock Monitoring', 'ai-for-livestock-monitoring', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Greenhouse Automation', 'ai-for-greenhouse-automation', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Soil Analysis', 'ai-for-soil-analysis', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Pest & Disease Detection', 'ai-for-pest-disease-detection', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Construction Site Monitoring', 'ai-for-construction-site-monitoring', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Construction Bid Estimating', 'ai-for-construction-bid-estimating', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Construction Safety Monitoring', 'ai-for-construction-safety-monitoring', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Manufacturing Defect Detection', 'ai-for-manufacturing-defect-detection', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Predictive Maintenance', 'ai-for-predictive-maintenance', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Factory Floor Optimization', 'ai-for-factory-floor-optimization', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Logistics Route Optimization', 'ai-for-logistics-route-optimization', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Last-Mile Delivery', 'ai-for-last-mile-delivery', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Warehouse Slotting', 'ai-for-warehouse-slotting', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Fleet Telematics', 'ai-for-fleet-telematics', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Trucking Compliance', 'ai-for-trucking-compliance', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Maritime Shipping', 'ai-for-maritime-shipping', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Aviation Operations', 'ai-for-aviation-operations', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Energy Grid Optimization', 'ai-for-energy-grid-optimization', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Solar Yield Prediction', 'ai-for-solar-yield-prediction', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Wind Farm Optimization', 'ai-for-wind-farm-optimization', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Oil & Gas Exploration', 'ai-for-oil-gas-exploration', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Mining Safety', 'ai-for-mining-safety', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Mining Exploration', 'ai-for-mining-exploration', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Telecom Network Optimization', 'ai-for-telecom-network-optimization', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Insurance Claims Triage', 'ai-for-insurance-claims-triage', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Insurance Underwriting', 'ai-for-insurance-underwriting', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Government Citizen Services', 'ai-for-government-citizen-services', 3, id, 1, 1, 1, 280
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Public Benefits Eligibility', 'ai-for-public-benefits-eligibility', 3, id, 1, 1, 1, 290
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Permit Processing', 'ai-for-permit-processing', 3, id, 1, 1, 1, 300
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Court Backlog Triage', 'ai-for-court-backlog-triage', 3, id, 1, 1, 1, 310
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Nonprofit Donor Engagement', 'ai-for-nonprofit-donor-engagement', 3, id, 1, 1, 1, 320
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Grant Writing', 'ai-for-grant-writing', 3, id, 1, 1, 1, 330
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Hospitality Concierge', 'ai-for-hospitality-concierge', 3, id, 1, 1, 1, 340
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Restaurant Order Forecasting', 'ai-for-restaurant-order-forecasting', 3, id, 1, 1, 1, 350
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Food Service Inventory', 'ai-for-food-service-inventory', 3, id, 1, 1, 1, 360
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Pharma R&D', 'ai-for-pharma-rd', 3, id, 1, 1, 1, 370
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Pharma Sales Enablement', 'ai-for-pharma-sales-enablement', 3, id, 1, 1, 1, 380
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Biotech Lab Automation', 'ai-for-biotech-lab-automation', 3, id, 1, 1, 1, 390
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Sports Performance Analytics', 'ai-for-sports-performance-analytics', 3, id, 1, 1, 1, 400
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Sports Scouting', 'ai-for-sports-scouting', 3, id, 1, 1, 1, 410
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Sports Broadcasting', 'ai-for-sports-broadcasting', 3, id, 1, 1, 1, 420
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Music Royalty Management', 'ai-for-music-royalty-management', 3, id, 1, 1, 1, 430
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Music A&R', 'ai-for-music-ar', 3, id, 1, 1, 1, 440
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Film Pre-Production', 'ai-for-film-pre-production', 3, id, 1, 1, 1, 450
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Film Post-Production', 'ai-for-film-post-production', 3, id, 1, 1, 1, 460
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Journalism Newsroom Tools', 'ai-for-journalism-newsroom-tools', 3, id, 1, 1, 1, 470
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Investigative Journalism', 'ai-for-investigative-journalism', 3, id, 1, 1, 1, 480
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Publishing Editorial Tools', 'ai-for-publishing-editorial-tools', 3, id, 1, 1, 1, 490
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Architecture Concept Visualization', 'ai-for-architecture-concept-visualization', 3, id, 1, 1, 1, 500
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Architecture BIM Tools', 'ai-for-architecture-bim-tools', 3, id, 1, 1, 1, 510
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Fashion Trend Forecasting', 'ai-for-fashion-trend-forecasting', 3, id, 1, 1, 1, 520
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Fashion Pattern Making', 'ai-for-fashion-pattern-making', 3, id, 1, 1, 1, 530
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Beauty Skin Analysis', 'ai-for-beauty-skin-analysis', 3, id, 1, 1, 1, 540
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Hair Salon Booking', 'ai-for-hair-salon-booking', 3, id, 1, 1, 1, 550
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Funeral Memorial Tributes', 'ai-for-funeral-memorial-tributes', 3, id, 1, 1, 1, 560
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI for Religious Education', 'ai-for-religious-education', 3, id, 1, 1, 1, 570
FROM categories WHERE slug = 'ai-for-vertical-industries' AND level = 2;

-- AI Accessibility & Inclusion (14 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Live Captioning for Events', 'ai-live-captioning-for-events', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-accessibility-inclusion' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Sign Language Avatar Tools', 'ai-sign-language-avatar-tools', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-accessibility-inclusion' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Sign Language Recognition', 'ai-sign-language-recognition', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-accessibility-inclusion' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Screen Reader Image Descriptions', 'ai-screen-reader-image-descriptions', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-accessibility-inclusion' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Alt Text Generators', 'ai-alt-text-generators', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-accessibility-inclusion' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Document Accessibility Checkers', 'ai-document-accessibility-checkers', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-accessibility-inclusion' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Web Accessibility Auditors', 'ai-web-accessibility-auditors', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-accessibility-inclusion' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Dyslexia-Friendly Reading Tools', 'ai-dyslexia-friendly-reading-tools', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-accessibility-inclusion' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Color-Blind Accessibility Tools', 'ai-color-blind-accessibility-tools', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-accessibility-inclusion' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Speech-Generating Devices', 'ai-speech-generating-devices', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-accessibility-inclusion' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI AAC Communication Boards', 'ai-aac-communication-boards', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-accessibility-inclusion' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Assistive Writing for Aphasia', 'ai-assistive-writing-for-aphasia', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-accessibility-inclusion' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Cognitive Load Reduction Tools', 'ai-cognitive-load-reduction-tools', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-accessibility-inclusion' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Sensory-Friendly Mode Tools', 'ai-sensory-friendly-mode-tools', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-accessibility-inclusion' AND level = 2;

-- AI Fun, Novelty & Entertainment (30 L3s)
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Joke Generators', 'ai-joke-generators', 3, id, 1, 1, 1, 10
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Pun Generators', 'ai-pun-generators', 3, id, 1, 1, 1, 20
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Pickup Line Generators', 'ai-pickup-line-generators', 3, id, 1, 1, 1, 30
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Insult Generators', 'ai-insult-generators', 3, id, 1, 1, 1, 40
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Fortune Cookie Generators', 'ai-fortune-cookie-generators', 3, id, 1, 1, 1, 50
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Magic 8-Ball Bots', 'ai-magic-8-ball-bots', 3, id, 1, 1, 1, 60
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Trivia Question Generators', 'ai-trivia-question-generators', 3, id, 1, 1, 1, 70
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Pub Quiz Generators', 'ai-pub-quiz-generators', 3, id, 1, 1, 1, 80
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Personality Quiz Generators', 'ai-personality-quiz-generators', 3, id, 1, 1, 1, 90
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Buzzfeed-Style Quiz Builders', 'ai-buzzfeed-style-quiz-builders', 3, id, 1, 1, 1, 100
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Riddle Generators', 'ai-riddle-generators', 3, id, 1, 1, 1, 110
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Dad Joke Bots', 'ai-dad-joke-bots', 3, id, 1, 1, 1, 120
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Roast Generators', 'ai-roast-generators', 3, id, 1, 1, 1, 130
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Pet Name Generators', 'ai-pet-name-generators', 3, id, 1, 1, 1, 140
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Baby Name Generators', 'ai-baby-name-generators', 3, id, 1, 1, 1, 150
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Character Name Generators', 'ai-character-name-generators', 3, id, 1, 1, 1, 160
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Band Name Generators', 'ai-band-name-generators', 3, id, 1, 1, 1, 170
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Username Generators', 'ai-username-generators', 3, id, 1, 1, 1, 180
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Domain Name Generators', 'ai-domain-name-generators', 3, id, 1, 1, 1, 190
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Startup Name Generators', 'ai-startup-name-generators', 3, id, 1, 1, 1, 200
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Fantasy Sports Team Name Generators', 'ai-fantasy-sports-team-name-generators', 3, id, 1, 1, 1, 210
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI D&D Character Generators', 'ai-dd-character-generators', 3, id, 1, 1, 1, 220
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Random Story Generators', 'ai-random-story-generators', 3, id, 1, 1, 1, 230
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Choose-Your-Own-Adventure Generators', 'ai-choose-your-own-adventure-generators', 3, id, 1, 1, 1, 240
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Yes-Or-No Decision Bots', 'ai-yes-or-no-decision-bots', 3, id, 1, 1, 1, 250
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Coin Flip Wisdom Bots', 'ai-coin-flip-wisdom-bots', 3, id, 1, 1, 1, 260
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI April Fool''s Joke Generators', 'ai-april-fools-joke-generators', 3, id, 1, 1, 1, 270
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Halloween Costume Idea Generators', 'ai-halloween-costume-idea-generators', 3, id, 1, 1, 1, 280
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Christmas Wish List Generators', 'ai-christmas-wish-list-generators', 3, id, 1, 1, 1, 290
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;
INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)
SELECT 'AI Valentine''s Day Card Generators', 'ai-valentines-day-card-generators', 3, id, 1, 1, 1, 300
FROM categories WHERE slug = 'ai-fun-novelty-entertainment' AND level = 2;

-- ═══ STEP 8: Reassign AI chatbot submissions to new L3 ═══

UPDATE submissions SET category_id = (SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1)
WHERE category_id IS NULL AND company_name IN ('ChatGPT by OpenAI', 'Intercom', 'Tidio', 'Ada', 'Botpress');

-- ═══ VERIFY ═══
-- SELECT level, COUNT(*) FROM categories
-- WHERE parent_id = (SELECT id FROM categories WHERE slug = 'artificial-intelligence-ml')
-- OR parent_id IN (SELECT id FROM categories WHERE parent_id = (SELECT id FROM categories WHERE slug = 'artificial-intelligence-ml'))
-- GROUP BY level;
-- Expected: level 2 = 43, level 3 = 1298