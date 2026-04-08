-- Remap AI & ML listing types to new L3 categories
-- 2,050 listing types → new L3 category IDs
-- Run AFTER migration-aiml-taxonomy-v2.sql

-- AI 360 Feedback Synthesizers (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-360-feedback-synthesizers' AND level = 3 LIMIT 1), 'Seller Tools AI: Seller Feedback AI', 'seller-tools-ai-seller-feedback-ai', 10);

-- AI 3D Asset Generators for Games (9 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-3d-asset-generators-for-games' AND level = 3 LIMIT 1), '3D Generation: Game Asset 3D', '3d-generation-game-asset-3d', 10),
((SELECT id FROM categories WHERE slug = 'ai-3d-asset-generators-for-games' AND level = 3 LIMIT 1), 'Game Asset AI: Game Environment AI', 'game-asset-ai-game-environment-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-3d-asset-generators-for-games' AND level = 3 LIMIT 1), 'Game Asset AI: Game Item Designer', 'game-asset-ai-game-item-designer', 30),
((SELECT id FROM categories WHERE slug = 'ai-3d-asset-generators-for-games' AND level = 3 LIMIT 1), 'Game Asset AI: Game UI Generator', 'game-asset-ai-game-ui-generator', 40),
((SELECT id FROM categories WHERE slug = 'ai-3d-asset-generators-for-games' AND level = 3 LIMIT 1), 'Game Asset AI: Pixel Art AI', 'game-asset-ai-pixel-art-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-3d-asset-generators-for-games' AND level = 3 LIMIT 1), 'Game Asset AI: Sprite Generator', 'game-asset-ai-sprite-generator', 60),
((SELECT id FROM categories WHERE slug = 'ai-3d-asset-generators-for-games' AND level = 3 LIMIT 1), 'Game Asset AI: Tilemap AI', 'game-asset-ai-tilemap-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-3d-asset-generators-for-games' AND level = 3 LIMIT 1), 'Game Asset AI: Game Sound Effect AI', 'game-asset-ai-game-sound-effect-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-3d-asset-generators-for-games' AND level = 3 LIMIT 1), 'Game Asset AI: Game Dialogue Writer AI', 'game-asset-ai-game-dialogue-writer-ai', 90);

-- AI 3D Walkthrough Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-3d-walkthrough-generators' AND level = 3 LIMIT 1), '3D Generation: 3D Model Generators', '3d-generation-3d-model-generators', 10);

-- AI Academic Paper Search (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-academic-paper-search' AND level = 3 LIMIT 1), 'Academic Writing: Research Paper AI', 'academic-writing-research-paper-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-academic-paper-search' AND level = 3 LIMIT 1), 'AI Research Tools: Academic Paper Finder', 'ai-research-tools-academic-paper-finder', 20);

-- AI Action Item Extractors (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-action-item-extractors' AND level = 3 LIMIT 1), 'Meeting AI Tools: Action Item Extractor', 'meeting-ai-tools-action-item-extractor', 10);

-- AI Ad Headline Generators (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-ad-headline-generators' AND level = 3 LIMIT 1), 'Advertising AI: Ad Copy AI', 'advertising-ai-ad-copy-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-ad-headline-generators' AND level = 3 LIMIT 1), 'Advertising AI: Ad Spend Optimizer', 'advertising-ai-ad-spend-optimizer', 20);

-- AI Ad Performance Predictors (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-ad-performance-predictors' AND level = 3 LIMIT 1), 'Advertising AI: Ad Performance Prediction', 'advertising-ai-ad-performance-prediction', 10);

-- AI Affiliate Content Builders (17 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-affiliate-content-builders' AND level = 3 LIMIT 1), 'Content Marketing AI: Blog Strategy AI', 'content-marketing-ai-blog-strategy-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-affiliate-content-builders' AND level = 3 LIMIT 1), 'Content Marketing AI: Content Calendar AI', 'content-marketing-ai-content-calendar-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-affiliate-content-builders' AND level = 3 LIMIT 1), 'Content Marketing AI: Content Gap Finder', 'content-marketing-ai-content-gap-finder', 30),
((SELECT id FROM categories WHERE slug = 'ai-affiliate-content-builders' AND level = 3 LIMIT 1), 'Content Marketing AI: Trending Topic AI', 'content-marketing-ai-trending-topic-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-affiliate-content-builders' AND level = 3 LIMIT 1), 'Content Marketing AI: User Generated Content AI', 'content-marketing-ai-user-generated-content-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-affiliate-content-builders' AND level = 3 LIMIT 1), 'Content Marketing AI: Content Performance AI', 'content-marketing-ai-content-performance-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-affiliate-content-builders' AND level = 3 LIMIT 1), 'Content Marketing AI: Editorial AI', 'content-marketing-ai-editorial-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-affiliate-content-builders' AND level = 3 LIMIT 1), 'Content Marketing AI: Brand Voice AI', 'content-marketing-ai-brand-voice-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-affiliate-content-builders' AND level = 3 LIMIT 1), 'Content AI: Content Recommendation', 'content-ai-content-recommendation', 90),
((SELECT id FROM categories WHERE slug = 'ai-affiliate-content-builders' AND level = 3 LIMIT 1), 'Content AI: Streaming Analytics AI', 'content-ai-streaming-analytics-ai', 100),
((SELECT id FROM categories WHERE slug = 'ai-affiliate-content-builders' AND level = 3 LIMIT 1), 'Content AI: Music Discovery AI', 'content-ai-music-discovery-ai', 110),
((SELECT id FROM categories WHERE slug = 'ai-affiliate-content-builders' AND level = 3 LIMIT 1), 'Content AI: Game AI', 'content-ai-game-ai', 120),
((SELECT id FROM categories WHERE slug = 'ai-affiliate-content-builders' AND level = 3 LIMIT 1), 'Content AI: Sports Analytics AI', 'content-ai-sports-analytics-ai', 130),
((SELECT id FROM categories WHERE slug = 'ai-affiliate-content-builders' AND level = 3 LIMIT 1), 'Content AI: News Curation AI', 'content-ai-news-curation-ai', 140),
((SELECT id FROM categories WHERE slug = 'ai-affiliate-content-builders' AND level = 3 LIMIT 1), 'Content AI: Ad Insertion AI', 'content-ai-ad-insertion-ai', 150),
((SELECT id FROM categories WHERE slug = 'ai-affiliate-content-builders' AND level = 3 LIMIT 1), 'Content AI: Audience Analytics', 'content-ai-audience-analytics', 160),
((SELECT id FROM categories WHERE slug = 'ai-affiliate-content-builders' AND level = 3 LIMIT 1), 'Content AI: Rights Management AI', 'content-ai-rights-management-ai', 170);

-- AI Amazon FBA Tools (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-amazon-fba-tools' AND level = 3 LIMIT 1), 'Seller Tools AI: FBA Fee Calculator', 'seller-tools-ai-fba-fee-calculator', 10);

-- AI AR Filter Builders (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-ar-filter-builders' AND level = 3 LIMIT 1), 'AR Mobile AI: AR Pet Filter', 'ar-mobile-ai-ar-pet-filter', 10);

-- AI Astrology Compatibility Tools (6 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-astrology-compatibility-tools' AND level = 3 LIMIT 1), 'Esoteric AI: Compatibility AI Astrology', 'esoteric-ai-compatibility-ai-astrology', 10),
((SELECT id FROM categories WHERE slug = 'ai-astrology-compatibility-tools' AND level = 3 LIMIT 1), 'Esoteric AI: Chakra Balancing AI', 'esoteric-ai-chakra-balancing-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-astrology-compatibility-tools' AND level = 3 LIMIT 1), 'Esoteric AI: Tarot Spread AI', 'esoteric-ai-tarot-spread-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-astrology-compatibility-tools' AND level = 3 LIMIT 1), 'Esoteric AI: I-Ching Reader AI', 'esoteric-ai-i-ching-reader-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-astrology-compatibility-tools' AND level = 3 LIMIT 1), 'Esoteric AI: Angel Number AI', 'esoteric-ai-angel-number-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-astrology-compatibility-tools' AND level = 3 LIMIT 1), 'Esoteric AI: Manifestation Coach AI', 'esoteric-ai-manifestation-coach-ai', 60);

-- AI Async Video Update Tools (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-async-video-update-tools' AND level = 3 LIMIT 1), 'Async Communication AI: Video Message AI (Loom-style)', 'async-communication-ai-video-message-ai-loom-style', 10),
((SELECT id FROM categories WHERE slug = 'ai-async-video-update-tools' AND level = 3 LIMIT 1), 'Async Communication AI: Audio Message AI', 'async-communication-ai-audio-message-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-async-video-update-tools' AND level = 3 LIMIT 1), 'Async Communication AI: Screen Record AI', 'async-communication-ai-screen-record-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-async-video-update-tools' AND level = 3 LIMIT 1), 'Async Communication AI: Async Standup', 'async-communication-ai-async-standup', 40),
((SELECT id FROM categories WHERE slug = 'ai-async-video-update-tools' AND level = 3 LIMIT 1), 'Async Communication AI: Status Update AI', 'async-communication-ai-status-update-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-async-video-update-tools' AND level = 3 LIMIT 1), 'Async Communication AI: Weekly Digest AI', 'async-communication-ai-weekly-digest-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-async-video-update-tools' AND level = 3 LIMIT 1), 'Async Communication AI: Decision Documentation AI', 'async-communication-ai-decision-documentation-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-async-video-update-tools' AND level = 3 LIMIT 1), 'Async Communication AI: Feedback Request AI', 'async-communication-ai-feedback-request-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-async-video-update-tools' AND level = 3 LIMIT 1), 'Async Communication AI: Proposal Comment AI', 'async-communication-ai-proposal-comment-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-async-video-update-tools' AND level = 3 LIMIT 1), 'Async Communication AI: Knowledge Share AI', 'async-communication-ai-knowledge-share-ai', 100);

-- AI Audio Cleanup & Restoration (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-audio-cleanup-restoration' AND level = 3 LIMIT 1), 'Audio Processing AI: Audio Stem Splitter', 'audio-processing-ai-audio-stem-splitter', 10),
((SELECT id FROM categories WHERE slug = 'ai-audio-cleanup-restoration' AND level = 3 LIMIT 1), 'Audio Processing AI: Vocal Remover AI', 'audio-processing-ai-vocal-remover-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-audio-cleanup-restoration' AND level = 3 LIMIT 1), 'Audio Processing AI: Noise Reduction AI', 'audio-processing-ai-noise-reduction-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-audio-cleanup-restoration' AND level = 3 LIMIT 1), 'Audio Processing AI: Audio Upscaler', 'audio-processing-ai-audio-upscaler', 40),
((SELECT id FROM categories WHERE slug = 'ai-audio-cleanup-restoration' AND level = 3 LIMIT 1), 'Audio Processing AI: Room Echo Remover', 'audio-processing-ai-room-echo-remover', 50),
((SELECT id FROM categories WHERE slug = 'ai-audio-cleanup-restoration' AND level = 3 LIMIT 1), 'Audio Processing AI: Wind Noise Filter', 'audio-processing-ai-wind-noise-filter', 60),
((SELECT id FROM categories WHERE slug = 'ai-audio-cleanup-restoration' AND level = 3 LIMIT 1), 'Audio Processing AI: Audio Equalizer AI', 'audio-processing-ai-audio-equalizer-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-audio-cleanup-restoration' AND level = 3 LIMIT 1), 'Audio Processing AI: Audio Normalization', 'audio-processing-ai-audio-normalization', 80),
((SELECT id FROM categories WHERE slug = 'ai-audio-cleanup-restoration' AND level = 3 LIMIT 1), 'Audio Processing AI: Audio Speed Changer', 'audio-processing-ai-audio-speed-changer', 90),
((SELECT id FROM categories WHERE slug = 'ai-audio-cleanup-restoration' AND level = 3 LIMIT 1), 'Audio Processing AI: Audio Pitch Shifter', 'audio-processing-ai-audio-pitch-shifter', 100);

-- AI Audio-to-Reels Tools (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-audio-to-reels-tools' AND level = 3 LIMIT 1), 'Audio Fun & Social: AI Karaoke', 'audio-fun-social-ai-karaoke', 10),
((SELECT id FROM categories WHERE slug = 'ai-audio-to-reels-tools' AND level = 3 LIMIT 1), 'Audio Fun & Social: AI Beatbox', 'audio-fun-social-ai-beatbox', 20),
((SELECT id FROM categories WHERE slug = 'ai-audio-to-reels-tools' AND level = 3 LIMIT 1), 'Audio Fun & Social: AI Rap Generator', 'audio-fun-social-ai-rap-generator', 30),
((SELECT id FROM categories WHERE slug = 'ai-audio-to-reels-tools' AND level = 3 LIMIT 1), 'Audio Fun & Social: AI DJ Mixer', 'audio-fun-social-ai-dj-mixer', 40),
((SELECT id FROM categories WHERE slug = 'ai-audio-to-reels-tools' AND level = 3 LIMIT 1), 'Audio Fun & Social: AI Remix Tool', 'audio-fun-social-ai-remix-tool', 50),
((SELECT id FROM categories WHERE slug = 'ai-audio-to-reels-tools' AND level = 3 LIMIT 1), 'Audio Fun & Social: AI Sing-Along', 'audio-fun-social-ai-sing-along', 60),
((SELECT id FROM categories WHERE slug = 'ai-audio-to-reels-tools' AND level = 3 LIMIT 1), 'Audio Fun & Social: AI Duet Creator', 'audio-fun-social-ai-duet-creator', 70),
((SELECT id FROM categories WHERE slug = 'ai-audio-to-reels-tools' AND level = 3 LIMIT 1), 'Audio Fun & Social: AI Audio Meme', 'audio-fun-social-ai-audio-meme', 80),
((SELECT id FROM categories WHERE slug = 'ai-audio-to-reels-tools' AND level = 3 LIMIT 1), 'Audio Fun & Social: AI Soundboard', 'audio-fun-social-ai-soundboard', 90),
((SELECT id FROM categories WHERE slug = 'ai-audio-to-reels-tools' AND level = 3 LIMIT 1), 'Audio Fun & Social: AI Voice Changer Fun', 'audio-fun-social-ai-voice-changer-fun', 100);

-- AI Auto-Caption Burn-In (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-auto-caption-burn-in' AND level = 3 LIMIT 1), 'Meme Creation AI: Caption Generator Meme', 'meme-creation-ai-caption-generator-meme', 10);

-- AI Auto-Cut Editors (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-auto-cut-editors' AND level = 3 LIMIT 1), 'AI Video Editing: Auto-Cut & Trim', 'ai-video-editing-auto-cut-trim', 10);

-- AI Auto-Grading Tools (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-auto-grading-tools' AND level = 3 LIMIT 1), 'Teaching AI: Grading & Assessment AI', 'teaching-ai-grading-assessment-ai', 10);

-- AI Auto-Tune Plugins (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-auto-tune-plugins' AND level = 3 LIMIT 1), 'UI/UX AI: Figma AI Plugins', 'ui-ux-ai-figma-ai-plugins', 10);

-- AI Baby Name Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-baby-name-generators' AND level = 3 LIMIT 1), 'Personal Name AI: Baby Name Generator AI', 'personal-name-ai-baby-name-generator-ai', 10);

-- AI Bias Auditing Tools (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-bias-auditing-tools' AND level = 3 LIMIT 1), 'AI Governance: AI Bias Detection', 'ai-governance-ai-bias-detection', 10);

-- AI Booking Site Builders (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-booking-site-builders' AND level = 3 LIMIT 1), 'No-Code Chatbot Platforms: Booking Bots', 'no-code-chatbot-platforms-booking-bots', 10);

-- AI Brand Color Palette Builders (14 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-brand-color-palette-builders' AND level = 3 LIMIT 1), 'AI Logo & Brand: Packaging Design AI', 'ai-logo-brand-packaging-design-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-brand-color-palette-builders' AND level = 3 LIMIT 1), 'AI Logo & Brand: Merchandise Design AI', 'ai-logo-brand-merchandise-design-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-brand-color-palette-builders' AND level = 3 LIMIT 1), 'AI Logo & Brand: Brand Color Palette AI', 'ai-logo-brand-brand-color-palette-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-brand-color-palette-builders' AND level = 3 LIMIT 1), 'UI/UX AI: Color Palette AI', 'ui-ux-ai-color-palette-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-brand-color-palette-builders' AND level = 3 LIMIT 1), 'Brand Content AI: Slogan Generator AI', 'brand-content-ai-slogan-generator-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-brand-color-palette-builders' AND level = 3 LIMIT 1), 'Brand Content AI: Mission Statement AI', 'brand-content-ai-mission-statement-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-brand-color-palette-builders' AND level = 3 LIMIT 1), 'Brand Content AI: Value Proposition AI', 'brand-content-ai-value-proposition-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-brand-color-palette-builders' AND level = 3 LIMIT 1), 'Brand Content AI: Elevator Pitch AI', 'brand-content-ai-elevator-pitch-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-brand-color-palette-builders' AND level = 3 LIMIT 1), 'Brand Content AI: Brand Story AI', 'brand-content-ai-brand-story-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-brand-color-palette-builders' AND level = 3 LIMIT 1), 'Brand Content AI: Testimonial AI', 'brand-content-ai-testimonial-ai', 100),
((SELECT id FROM categories WHERE slug = 'ai-brand-color-palette-builders' AND level = 3 LIMIT 1), 'Brand Content AI: Case Study AI', 'brand-content-ai-case-study-ai', 110),
((SELECT id FROM categories WHERE slug = 'ai-brand-color-palette-builders' AND level = 3 LIMIT 1), 'Brand Content AI: Press Kit AI', 'brand-content-ai-press-kit-ai', 120),
((SELECT id FROM categories WHERE slug = 'ai-brand-color-palette-builders' AND level = 3 LIMIT 1), 'Brand Content AI: Media Pitch AI', 'brand-content-ai-media-pitch-ai', 130),
((SELECT id FROM categories WHERE slug = 'ai-brand-color-palette-builders' AND level = 3 LIMIT 1), 'Brand Content AI: Award Application AI', 'brand-content-ai-award-application-ai', 140);

-- AI Brand Font Pairing Tools (3 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-brand-font-pairing-tools' AND level = 3 LIMIT 1), 'AI Logo & Brand: Typography Pairing AI', 'ai-logo-brand-typography-pairing-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-brand-font-pairing-tools' AND level = 3 LIMIT 1), 'UI/UX AI: Font Pairing AI', 'ui-ux-ai-font-pairing-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-brand-font-pairing-tools' AND level = 3 LIMIT 1), 'Type Design AI: Font Pairing Suggester', 'type-design-ai-font-pairing-suggester', 30);

-- AI Brand Voice Generators (4 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-brand-voice-generators' AND level = 3 LIMIT 1), 'AI Logo & Brand: Logo Generators', 'ai-logo-brand-logo-generators', 10),
((SELECT id FROM categories WHERE slug = 'ai-brand-voice-generators' AND level = 3 LIMIT 1), 'AI Logo & Brand: Favicon Generators', 'ai-logo-brand-favicon-generators', 20),
((SELECT id FROM categories WHERE slug = 'ai-brand-voice-generators' AND level = 3 LIMIT 1), 'AI Logo & Brand: Letterhead Generators', 'ai-logo-brand-letterhead-generators', 30),
((SELECT id FROM categories WHERE slug = 'ai-brand-voice-generators' AND level = 3 LIMIT 1), 'Naming AI: Brand Name AI', 'naming-ai-brand-name-ai', 40);

-- AI Brand Voice Trainers (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-brand-voice-trainers' AND level = 3 LIMIT 1), 'AI Logo & Brand: Brand Kit Creators', 'ai-logo-brand-brand-kit-creators', 10),
((SELECT id FROM categories WHERE slug = 'ai-brand-voice-trainers' AND level = 3 LIMIT 1), 'AI Logo & Brand: Social Media Kit AI', 'ai-logo-brand-social-media-kit-ai', 20);

-- AI Business Card Scanners (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-business-card-scanners' AND level = 3 LIMIT 1), 'Business Writing: Policy Document Writers', 'business-writing-policy-document-writers', 10);

-- AI Buyer Intent Signal Tools (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-buyer-intent-signal-tools' AND level = 3 LIMIT 1), 'Sales Intelligence: Buyer Intent Detection', 'sales-intelligence-buyer-intent-detection', 10);

-- AI Calculator Widget Builders (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-calculator-widget-builders' AND level = 3 LIMIT 1), 'Mystical & Spiritual AI: Numerology Calculator AI', 'mystical-spiritual-ai-numerology-calculator-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-calculator-widget-builders' AND level = 3 LIMIT 1), 'Seller Tools AI: Profit Calculator AI', 'seller-tools-ai-profit-calculator-ai', 20);

-- AI Calendar Optimizers (11 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-calendar-optimizers' AND level = 3 LIMIT 1), 'Content Calendar AI: Editorial Calendar AI', 'content-calendar-ai-editorial-calendar-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-calendar-optimizers' AND level = 3 LIMIT 1), 'Content Calendar AI: Social Calendar AI', 'content-calendar-ai-social-calendar-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-calendar-optimizers' AND level = 3 LIMIT 1), 'Content Calendar AI: Blog Calendar AI', 'content-calendar-ai-blog-calendar-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-calendar-optimizers' AND level = 3 LIMIT 1), 'Content Calendar AI: Video Calendar AI', 'content-calendar-ai-video-calendar-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-calendar-optimizers' AND level = 3 LIMIT 1), 'Content Calendar AI: Podcast Calendar AI', 'content-calendar-ai-podcast-calendar-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-calendar-optimizers' AND level = 3 LIMIT 1), 'Content Calendar AI: Email Calendar AI', 'content-calendar-ai-email-calendar-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-calendar-optimizers' AND level = 3 LIMIT 1), 'Content Calendar AI: Campaign Calendar AI', 'content-calendar-ai-campaign-calendar-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-calendar-optimizers' AND level = 3 LIMIT 1), 'Content Calendar AI: Seasonal Content AI', 'content-calendar-ai-seasonal-content-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-calendar-optimizers' AND level = 3 LIMIT 1), 'Content Calendar AI: Content Recycling AI', 'content-calendar-ai-content-recycling-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-calendar-optimizers' AND level = 3 LIMIT 1), 'Content Calendar AI: Trending Content AI', 'content-calendar-ai-trending-content-ai', 100),
((SELECT id FROM categories WHERE slug = 'ai-calendar-optimizers' AND level = 3 LIMIT 1), 'Personal Productivity AI: Calendar Optimization AI', 'personal-productivity-ai-calendar-optimization-ai', 110);

-- AI Calendar Scheduling Agents (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-calendar-scheduling-agents' AND level = 3 LIMIT 1), 'Task-Specific Agents: Calendar Scheduling Agents', 'task-specific-agents-calendar-scheduling-agents', 10);

-- AI Candidate Outreach Tools (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-candidate-outreach-tools' AND level = 3 LIMIT 1), 'Recruiting AI: Candidate Matching AI', 'recruiting-ai-candidate-matching-ai', 10);

-- AI Character Name Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-character-name-generators' AND level = 3 LIMIT 1), 'Personal Name AI: Character Name Generator', 'personal-name-ai-character-name-generator', 10);

-- AI Chord Progression Helpers (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-chord-progression-helpers' AND level = 3 LIMIT 1), 'Music Education AI: Chord Progression AI', 'music-education-ai-chord-progression-ai', 10);

-- AI Churn Prediction Tools (4 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-churn-prediction-tools' AND level = 3 LIMIT 1), 'Farming AI: Weather Prediction', 'farming-ai-weather-prediction', 10),
((SELECT id FROM categories WHERE slug = 'ai-churn-prediction-tools' AND level = 3 LIMIT 1), 'Farming AI: Market Price Prediction', 'farming-ai-market-price-prediction', 20),
((SELECT id FROM categories WHERE slug = 'ai-churn-prediction-tools' AND level = 3 LIMIT 1), 'Vehicle AI: Traffic Prediction', 'vehicle-ai-traffic-prediction', 30),
((SELECT id FROM categories WHERE slug = 'ai-churn-prediction-tools' AND level = 3 LIMIT 1), 'DevOps AI: Incident Prediction AI', 'devops-ai-incident-prediction-ai', 40);

-- AI CI Pipeline Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-ci-pipeline-generators' AND level = 3 LIMIT 1), 'DevOps AI: CI/CD AI', 'devops-ai-ci-cd-ai', 10);

-- AI Cinematic Color Grading (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-cinematic-color-grading' AND level = 3 LIMIT 1), 'AI Video Editing: Color Grading AI', 'ai-video-editing-color-grading-ai', 10);

-- AI Cinematic Score Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-cinematic-score-generators' AND level = 3 LIMIT 1), 'Music Generation: Cinematic Score AI', 'music-generation-cinematic-score-ai', 10);

-- AI Clinical Coding Assistants (9 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-clinical-coding-assistants' AND level = 3 LIMIT 1), 'Clinical AI: Diagnostic AI', 'clinical-ai-diagnostic-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-clinical-coding-assistants' AND level = 3 LIMIT 1), 'Clinical AI: Drug Discovery AI', 'clinical-ai-drug-discovery-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-clinical-coding-assistants' AND level = 3 LIMIT 1), 'Clinical AI: Medical Imaging AI', 'clinical-ai-medical-imaging-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-clinical-coding-assistants' AND level = 3 LIMIT 1), 'Clinical AI: Pathology AI', 'clinical-ai-pathology-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-clinical-coding-assistants' AND level = 3 LIMIT 1), 'Clinical AI: Genomics AI', 'clinical-ai-genomics-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-clinical-coding-assistants' AND level = 3 LIMIT 1), 'Clinical AI: Patient Monitoring AI', 'clinical-ai-patient-monitoring-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-clinical-coding-assistants' AND level = 3 LIMIT 1), 'Clinical AI: Treatment Recommendation', 'clinical-ai-treatment-recommendation', 70),
((SELECT id FROM categories WHERE slug = 'ai-clinical-coding-assistants' AND level = 3 LIMIT 1), 'Clinical AI: Symptom Checker AI', 'clinical-ai-symptom-checker-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-clinical-coding-assistants' AND level = 3 LIMIT 1), 'Clinical AI: Mental Health AI', 'clinical-ai-mental-health-ai', 90);

-- AI Clinical Trial Matching (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-clinical-trial-matching' AND level = 3 LIMIT 1), 'Clinical AI: Clinical Trial AI', 'clinical-ai-clinical-trial-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-clinical-trial-matching' AND level = 3 LIMIT 1), 'Pharmaceutical AI: Trial Matching AI', 'pharmaceutical-ai-trial-matching-ai', 20);

-- AI Clinical Trial Search (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-clinical-trial-search' AND level = 3 LIMIT 1), 'Pharmaceutical AI: Clinical Documentation AI', 'pharmaceutical-ai-clinical-documentation-ai', 10);

-- AI Cloud Cost Cutter Agents (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-cloud-cost-cutter-agents' AND level = 3 LIMIT 1), 'DevOps AI: Cost Prediction Cloud', 'devops-ai-cost-prediction-cloud', 10);

-- AI Code Smell Detectors (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-code-smell-detectors' AND level = 3 LIMIT 1), 'Code Review & Debug: Code Smell Detector', 'code-review-debug-code-smell-detector', 10);

-- AI Codebase Search Tools (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-codebase-search-tools' AND level = 3 LIMIT 1), 'Semantic Search: Code Search AI', 'semantic-search-code-search-ai', 10);

-- AI Color-Blind Accessibility Tools (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-color-blind-accessibility-tools' AND level = 3 LIMIT 1), 'Accessibility AI: Color Blind Simulator', 'accessibility-ai-color-blind-simulator', 10);

-- AI Compensation Benchmarking (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-compensation-benchmarking' AND level = 3 LIMIT 1), 'People Analytics: Compensation Benchmarking', 'people-analytics-compensation-benchmarking', 10);

-- AI Competitive Intelligence Agents (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-competitive-intelligence-agents' AND level = 3 LIMIT 1), 'AI Research Tools: Competitive Intelligence AI', 'ai-research-tools-competitive-intelligence-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-competitive-intelligence-agents' AND level = 3 LIMIT 1), 'Location AI: Location Intelligence', 'location-ai-location-intelligence', 20);

-- AI Compliment Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-compliment-generators' AND level = 3 LIMIT 1), 'Meme Creation AI: AI Compliment Generator', 'meme-creation-ai-ai-compliment-generator', 10);

-- AI Computer-Use Browser Agents (11 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-computer-use-browser-agents' AND level = 3 LIMIT 1), 'Vehicle AI: Autonomous Driving', 'vehicle-ai-autonomous-driving', 10),
((SELECT id FROM categories WHERE slug = 'ai-computer-use-browser-agents' AND level = 3 LIMIT 1), 'Computer Use AI: Desktop Automation Agent', 'computer-use-ai-desktop-automation-agent', 20),
((SELECT id FROM categories WHERE slug = 'ai-computer-use-browser-agents' AND level = 3 LIMIT 1), 'Computer Use AI: Screen-Aware AI Assistant', 'computer-use-ai-screen-aware-ai-assistant', 30),
((SELECT id FROM categories WHERE slug = 'ai-computer-use-browser-agents' AND level = 3 LIMIT 1), 'Computer Use AI: Multi-App Workflow Agent', 'computer-use-ai-multi-app-workflow-agent', 40),
((SELECT id FROM categories WHERE slug = 'ai-computer-use-browser-agents' AND level = 3 LIMIT 1), 'Computer Use AI: File Management Agent', 'computer-use-ai-file-management-agent', 50),
((SELECT id FROM categories WHERE slug = 'ai-computer-use-browser-agents' AND level = 3 LIMIT 1), 'Computer Use AI: System Optimization AI', 'computer-use-ai-system-optimization-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-computer-use-browser-agents' AND level = 3 LIMIT 1), 'Computer Use AI: OS-Level AI Assistant', 'computer-use-ai-os-level-ai-assistant', 70),
((SELECT id FROM categories WHERE slug = 'ai-computer-use-browser-agents' AND level = 3 LIMIT 1), 'Computer Use AI: Window Manager AI', 'computer-use-ai-window-manager-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-computer-use-browser-agents' AND level = 3 LIMIT 1), 'Computer Use AI: Clipboard AI Manager', 'computer-use-ai-clipboard-ai-manager', 90),
((SELECT id FROM categories WHERE slug = 'ai-computer-use-browser-agents' AND level = 3 LIMIT 1), 'Computer Use AI: Desktop Search AI', 'computer-use-ai-desktop-search-ai', 100),
((SELECT id FROM categories WHERE slug = 'ai-computer-use-browser-agents' AND level = 3 LIMIT 1), 'Computer Use AI: App Launcher AI', 'computer-use-ai-app-launcher-ai', 110);

-- AI Container Security Scanners (9 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-container-security-scanners' AND level = 3 LIMIT 1), 'Security AI: Threat Detection AI', 'security-ai-threat-detection-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-container-security-scanners' AND level = 3 LIMIT 1), 'Security AI: Phishing Detection', 'security-ai-phishing-detection', 20),
((SELECT id FROM categories WHERE slug = 'ai-container-security-scanners' AND level = 3 LIMIT 1), 'Security AI: Malware Analysis AI', 'security-ai-malware-analysis-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-container-security-scanners' AND level = 3 LIMIT 1), 'Security AI: SIEM AI', 'security-ai-siem-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-container-security-scanners' AND level = 3 LIMIT 1), 'Security AI: SOC Automation', 'security-ai-soc-automation', 50),
((SELECT id FROM categories WHERE slug = 'ai-container-security-scanners' AND level = 3 LIMIT 1), 'Security AI: Identity Verification', 'security-ai-identity-verification', 60),
((SELECT id FROM categories WHERE slug = 'ai-container-security-scanners' AND level = 3 LIMIT 1), 'Security AI: Access Anomaly Detection', 'security-ai-access-anomaly-detection', 70),
((SELECT id FROM categories WHERE slug = 'ai-container-security-scanners' AND level = 3 LIMIT 1), 'Security AI: Data Loss Prevention AI', 'security-ai-data-loss-prevention-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-container-security-scanners' AND level = 3 LIMIT 1), 'Security AI: Incident Response AI', 'security-ai-incident-response-ai', 90);

-- AI Content Brief Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-content-brief-generators' AND level = 3 LIMIT 1), 'SEO Writing: Content Brief Generators', 'seo-writing-content-brief-generators', 10);

-- AI Content Moderation APIs (11 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-content-moderation-apis' AND level = 3 LIMIT 1), 'Content AI: Content Moderation', 'content-ai-content-moderation', 10),
((SELECT id FROM categories WHERE slug = 'ai-content-moderation-apis' AND level = 3 LIMIT 1), 'Content Authenticity: AI Text Detection', 'content-authenticity-ai-text-detection', 20),
((SELECT id FROM categories WHERE slug = 'ai-content-moderation-apis' AND level = 3 LIMIT 1), 'Content Authenticity: Deepfake Detection', 'content-authenticity-deepfake-detection', 30),
((SELECT id FROM categories WHERE slug = 'ai-content-moderation-apis' AND level = 3 LIMIT 1), 'Content Authenticity: Image Authenticity', 'content-authenticity-image-authenticity', 40),
((SELECT id FROM categories WHERE slug = 'ai-content-moderation-apis' AND level = 3 LIMIT 1), 'Content Authenticity: Audio Deepfake Detection', 'content-authenticity-audio-deepfake-detection', 50),
((SELECT id FROM categories WHERE slug = 'ai-content-moderation-apis' AND level = 3 LIMIT 1), 'Content Authenticity: Video Verification', 'content-authenticity-video-verification', 60),
((SELECT id FROM categories WHERE slug = 'ai-content-moderation-apis' AND level = 3 LIMIT 1), 'Content Authenticity: Watermarking AI', 'content-authenticity-watermarking-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-content-moderation-apis' AND level = 3 LIMIT 1), 'Content Authenticity: Provenance Tracking', 'content-authenticity-provenance-tracking', 80),
((SELECT id FROM categories WHERE slug = 'ai-content-moderation-apis' AND level = 3 LIMIT 1), 'Content Authenticity: Misinformation Detection', 'content-authenticity-misinformation-detection', 90),
((SELECT id FROM categories WHERE slug = 'ai-content-moderation-apis' AND level = 3 LIMIT 1), 'Content Authenticity: Bot Detection', 'content-authenticity-bot-detection', 100),
((SELECT id FROM categories WHERE slug = 'ai-content-moderation-apis' AND level = 3 LIMIT 1), 'Content Authenticity: Synthetic Media Detection', 'content-authenticity-synthetic-media-detection', 110);

-- AI Content Repurposing Engines (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-content-repurposing-engines' AND level = 3 LIMIT 1), 'Content Marketing AI: Content Repurposing AI', 'content-marketing-ai-content-repurposing-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-content-repurposing-engines' AND level = 3 LIMIT 1), 'Pharmaceutical AI: Drug Repurposing AI', 'pharmaceutical-ai-drug-repurposing-ai', 20);

-- AI Contract Redlining Tools (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-contract-redlining-tools' AND level = 3 LIMIT 1), 'Contract AI: Redlining AI', 'contract-ai-redlining-ai', 10);

-- AI Conversational Search Engines (18 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-conversational-search-engines' AND level = 3 LIMIT 1), 'Conversational AI: Multi-Modal Chat AI', 'conversational-ai-multi-modal-chat-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-conversational-search-engines' AND level = 3 LIMIT 1), 'Conversational AI: Text-Only Chat AI', 'conversational-ai-text-only-chat-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-conversational-search-engines' AND level = 3 LIMIT 1), 'Conversational AI: Reasoning & Analysis AI', 'conversational-ai-reasoning-analysis-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-conversational-search-engines' AND level = 3 LIMIT 1), 'Conversational AI: Creative Writing AI', 'conversational-ai-creative-writing-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-conversational-search-engines' AND level = 3 LIMIT 1), 'Conversational AI: Research Assistant AI', 'conversational-ai-research-assistant-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-conversational-search-engines' AND level = 3 LIMIT 1), 'Conversational AI: Coding Copilot AI', 'conversational-ai-coding-copilot-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-conversational-search-engines' AND level = 3 LIMIT 1), 'Conversational AI: Math & Science AI', 'conversational-ai-math-science-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-conversational-search-engines' AND level = 3 LIMIT 1), 'Conversational AI: Language Learning AI', 'conversational-ai-language-learning-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-conversational-search-engines' AND level = 3 LIMIT 1), 'Conversational AI: Daily Planner AI', 'conversational-ai-daily-planner-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-conversational-search-engines' AND level = 3 LIMIT 1), 'Semantic Search: AI Search Engines', 'semantic-search-ai-search-engines', 100),
((SELECT id FROM categories WHERE slug = 'ai-conversational-search-engines' AND level = 3 LIMIT 1), 'AI Personality Engines: Character Memory Systems', 'ai-personality-engines-character-memory-systems', 110),
((SELECT id FROM categories WHERE slug = 'ai-conversational-search-engines' AND level = 3 LIMIT 1), 'AI Personality Engines: Long-Term Context AI', 'ai-personality-engines-long-term-context-ai', 120),
((SELECT id FROM categories WHERE slug = 'ai-conversational-search-engines' AND level = 3 LIMIT 1), 'AI Personality Engines: Persona Consistency', 'ai-personality-engines-persona-consistency', 130),
((SELECT id FROM categories WHERE slug = 'ai-conversational-search-engines' AND level = 3 LIMIT 1), 'AI Personality Engines: Multi-Character Worlds', 'ai-personality-engines-multi-character-worlds', 140),
((SELECT id FROM categories WHERE slug = 'ai-conversational-search-engines' AND level = 3 LIMIT 1), 'AI Personality Engines: AI Character Marketplace', 'ai-personality-engines-ai-character-marketplace', 150),
((SELECT id FROM categories WHERE slug = 'ai-conversational-search-engines' AND level = 3 LIMIT 1), 'AI Personality Engines: Character Voice Customization', 'ai-personality-engines-character-voice-customization', 160),
((SELECT id FROM categories WHERE slug = 'ai-conversational-search-engines' AND level = 3 LIMIT 1), 'AI Personality Engines: Character Backstory Generator', 'ai-personality-engines-character-backstory-generator', 170),
((SELECT id FROM categories WHERE slug = 'ai-conversational-search-engines' AND level = 3 LIMIT 1), 'AI Personality Engines: Character Relationship AI', 'ai-personality-engines-character-relationship-ai', 180);

-- AI Cover Letter Tailoring (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-cover-letter-tailoring' AND level = 3 LIMIT 1), 'Recruiting AI: Offer Letter AI', 'recruiting-ai-offer-letter-ai', 10);

-- AI Cross-Channel Publishers (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-cross-channel-publishers' AND level = 3 LIMIT 1), 'Advertising AI: Cross-Channel Attribution', 'advertising-ai-cross-channel-attribution', 10);

-- AI Crypto Market Analyzers (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-crypto-market-analyzers' AND level = 3 LIMIT 1), 'Investment AI: Market Sentiment AI', 'investment-ai-market-sentiment-ai', 10);

-- AI Crypto Tax Calculators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-crypto-tax-calculators' AND level = 3 LIMIT 1), 'Investment AI: Crypto Trading AI', 'investment-ai-crypto-trading-ai', 10);

-- AI CSAM Detection Tools (6 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-csam-detection-tools' AND level = 3 LIMIT 1), 'AI Governance: AI Risk Assessment', 'ai-governance-ai-risk-assessment', 10),
((SELECT id FROM categories WHERE slug = 'ai-csam-detection-tools' AND level = 3 LIMIT 1), 'AI Governance: Compliance Monitoring', 'ai-governance-compliance-monitoring', 20),
((SELECT id FROM categories WHERE slug = 'ai-csam-detection-tools' AND level = 3 LIMIT 1), 'AI Governance: Ethical AI Frameworks', 'ai-governance-ethical-ai-frameworks', 30),
((SELECT id FROM categories WHERE slug = 'ai-csam-detection-tools' AND level = 3 LIMIT 1), 'AI Governance: AI Impact Assessment', 'ai-governance-ai-impact-assessment', 40),
((SELECT id FROM categories WHERE slug = 'ai-csam-detection-tools' AND level = 3 LIMIT 1), 'AI Governance: Responsible AI Platforms', 'ai-governance-responsible-ai-platforms', 50),
((SELECT id FROM categories WHERE slug = 'ai-csam-detection-tools' AND level = 3 LIMIT 1), 'AI Governance: AI Transparency Tools', 'ai-governance-ai-transparency-tools', 60);

-- AI Customer Review Summarizers (3 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-customer-review-summarizers' AND level = 3 LIMIT 1), 'Shopping AI: Customer Segmentation AI', 'shopping-ai-customer-segmentation-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-customer-review-summarizers' AND level = 3 LIMIT 1), 'Shopping AI: Review Analysis AI', 'shopping-ai-review-analysis-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-customer-review-summarizers' AND level = 3 LIMIT 1), 'E-Commerce Operations: Customer Service AI', 'e-commerce-operations-customer-service-ai', 30);

-- AI Dashboard Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-dashboard-generators' AND level = 3 LIMIT 1), 'Data Visualization AI: Dashboard Builder AI', 'data-visualization-ai-dashboard-builder-ai', 10);

-- AI Data Anonymization Tools (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-data-anonymization-tools' AND level = 3 LIMIT 1), 'Privacy-Preserving AI: Data Anonymization AI', 'privacy-preserving-ai-data-anonymization-ai', 10);

-- AI Data Entry Agents (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-data-entry-agents' AND level = 3 LIMIT 1), 'Task-Specific Agents: Data Entry Agents', 'task-specific-agents-data-entry-agents', 10);

-- AI Dating Profile Coaches (9 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-dating-profile-coaches' AND level = 3 LIMIT 1), 'Dating & Social: Dating Profile Writer AI', 'dating-social-dating-profile-writer-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-dating-profile-coaches' AND level = 3 LIMIT 1), 'Dating & Social: Conversation Starter AI', 'dating-social-conversation-starter-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-dating-profile-coaches' AND level = 3 LIMIT 1), 'Dating & Social: Icebreaker Generator', 'dating-social-icebreaker-generator', 30),
((SELECT id FROM categories WHERE slug = 'ai-dating-profile-coaches' AND level = 3 LIMIT 1), 'Dating & Social: Compatibility Matcher AI', 'dating-social-compatibility-matcher-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-dating-profile-coaches' AND level = 3 LIMIT 1), 'Dating & Social: Texting Advisor AI', 'dating-social-texting-advisor-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-dating-profile-coaches' AND level = 3 LIMIT 1), 'Dating & Social: Date Idea Generator', 'dating-social-date-idea-generator', 60),
((SELECT id FROM categories WHERE slug = 'ai-dating-profile-coaches' AND level = 3 LIMIT 1), 'Dating & Social: Love Language Analyzer', 'dating-social-love-language-analyzer', 70),
((SELECT id FROM categories WHERE slug = 'ai-dating-profile-coaches' AND level = 3 LIMIT 1), 'Dating & Social: Conflict Resolution AI', 'dating-social-conflict-resolution-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-dating-profile-coaches' AND level = 3 LIMIT 1), 'Dating & Social: Anniversary Gift Planner', 'dating-social-anniversary-gift-planner', 90);

-- AI Decision Loggers (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-decision-loggers' AND level = 3 LIMIT 1), 'Purchase Decision AI: AI Product Advisor', 'purchase-decision-ai-ai-product-advisor', 10),
((SELECT id FROM categories WHERE slug = 'ai-decision-loggers' AND level = 3 LIMIT 1), 'Purchase Decision AI: Specification Comparator', 'purchase-decision-ai-specification-comparator', 20),
((SELECT id FROM categories WHERE slug = 'ai-decision-loggers' AND level = 3 LIMIT 1), 'Purchase Decision AI: Warranty Analyzer', 'purchase-decision-ai-warranty-analyzer', 30),
((SELECT id FROM categories WHERE slug = 'ai-decision-loggers' AND level = 3 LIMIT 1), 'Purchase Decision AI: Return Policy Checker', 'purchase-decision-ai-return-policy-checker', 40),
((SELECT id FROM categories WHERE slug = 'ai-decision-loggers' AND level = 3 LIMIT 1), 'Purchase Decision AI: Sustainability Score Product', 'purchase-decision-ai-sustainability-score-product', 50),
((SELECT id FROM categories WHERE slug = 'ai-decision-loggers' AND level = 3 LIMIT 1), 'Purchase Decision AI: Counterfeit Detector', 'purchase-decision-ai-counterfeit-detector', 60),
((SELECT id FROM categories WHERE slug = 'ai-decision-loggers' AND level = 3 LIMIT 1), 'Purchase Decision AI: Brand Reputation AI', 'purchase-decision-ai-brand-reputation-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-decision-loggers' AND level = 3 LIMIT 1), 'Purchase Decision AI: Similar Product Finder', 'purchase-decision-ai-similar-product-finder', 80),
((SELECT id FROM categories WHERE slug = 'ai-decision-loggers' AND level = 3 LIMIT 1), 'Purchase Decision AI: Budget Allocation Shopping', 'purchase-decision-ai-budget-allocation-shopping', 90),
((SELECT id FROM categories WHERE slug = 'ai-decision-loggers' AND level = 3 LIMIT 1), 'Purchase Decision AI: Impulse Buy Prevention', 'purchase-decision-ai-impulse-buy-prevention', 100);

-- AI Demo Coaches (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-demo-coaches' AND level = 3 LIMIT 1), 'Pitch & Demo AI: Sales Pitch AI', 'pitch-demo-ai-sales-pitch-ai', 10);

-- AI Dependency Updaters (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-dependency-updaters' AND level = 3 LIMIT 1), 'PM AI: Dependency Analysis AI', 'pm-ai-dependency-analysis-ai', 10);

-- AI Document Accessibility Checkers (7 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-document-accessibility-checkers' AND level = 3 LIMIT 1), 'Accessibility AI: Image Description AI', 'accessibility-ai-image-description-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-document-accessibility-checkers' AND level = 3 LIMIT 1), 'Accessibility AI: Cognitive Accessibility AI', 'accessibility-ai-cognitive-accessibility-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-document-accessibility-checkers' AND level = 3 LIMIT 1), 'Accessibility AI: Dyslexia Font AI', 'accessibility-ai-dyslexia-font-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-document-accessibility-checkers' AND level = 3 LIMIT 1), 'Accessibility AI: Captioning AI', 'accessibility-ai-captioning-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-document-accessibility-checkers' AND level = 3 LIMIT 1), 'Accessibility AI: Audio Description AI Accessibility', 'accessibility-ai-audio-description-ai-accessibility', 50),
((SELECT id FROM categories WHERE slug = 'ai-document-accessibility-checkers' AND level = 3 LIMIT 1), 'Accessibility AI: Easy Read AI', 'accessibility-ai-easy-read-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-document-accessibility-checkers' AND level = 3 LIMIT 1), 'Accessibility AI: Braille Translator AI', 'accessibility-ai-braille-translator-ai', 70);

-- AI Domain Name Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-domain-name-generators' AND level = 3 LIMIT 1), 'Naming AI: Domain Name Finder AI', 'naming-ai-domain-name-finder-ai', 10);

-- AI Dropshipping Product Researchers (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-dropshipping-product-researchers' AND level = 3 LIMIT 1), 'E-Commerce Operations: Dropshipping AI', 'e-commerce-operations-dropshipping-ai', 10);

-- AI Drug Interaction Checkers (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-drug-interaction-checkers' AND level = 3 LIMIT 1), 'Pharmaceutical AI: Drug Interaction AI', 'pharmaceutical-ai-drug-interaction-ai', 10);

-- AI E-Commerce Store Builders (5 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-e-commerce-store-builders' AND level = 3 LIMIT 1), 'No-Code Chatbot Platforms: E-commerce Bots', 'no-code-chatbot-platforms-e-commerce-bots', 10),
((SELECT id FROM categories WHERE slug = 'ai-e-commerce-store-builders' AND level = 3 LIMIT 1), 'E-Commerce Operations: Catalog Management AI', 'e-commerce-operations-catalog-management-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-e-commerce-store-builders' AND level = 3 LIMIT 1), 'E-Commerce Operations: Chatbot for Commerce', 'e-commerce-operations-chatbot-for-commerce', 30),
((SELECT id FROM categories WHERE slug = 'ai-e-commerce-store-builders' AND level = 3 LIMIT 1), 'E-Commerce Operations: Order Management AI', 'e-commerce-operations-order-management-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-e-commerce-store-builders' AND level = 3 LIMIT 1), 'E-Commerce Operations: Shipping Optimization', 'e-commerce-operations-shipping-optimization', 50);

-- AI Elder Care Companions (11 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-elder-care-companions' AND level = 3 LIMIT 1), 'Pet Care AI: Pet Health Monitor', 'pet-care-ai-pet-health-monitor', 10),
((SELECT id FROM categories WHERE slug = 'ai-elder-care-companions' AND level = 3 LIMIT 1), 'Pet Care AI: Dog Training AI', 'pet-care-ai-dog-training-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-elder-care-companions' AND level = 3 LIMIT 1), 'Pet Care AI: Cat Behavior AI', 'pet-care-ai-cat-behavior-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-elder-care-companions' AND level = 3 LIMIT 1), 'Pet Care AI: Pet Breed Identifier', 'pet-care-ai-pet-breed-identifier', 40),
((SELECT id FROM categories WHERE slug = 'ai-elder-care-companions' AND level = 3 LIMIT 1), 'Pet Care AI: Pet Nutrition Planner', 'pet-care-ai-pet-nutrition-planner', 50),
((SELECT id FROM categories WHERE slug = 'ai-elder-care-companions' AND level = 3 LIMIT 1), 'Pet Care AI: Vet Visit Scheduler', 'pet-care-ai-vet-visit-scheduler', 60),
((SELECT id FROM categories WHERE slug = 'ai-elder-care-companions' AND level = 3 LIMIT 1), 'Pet Care AI: Pet Activity Tracker', 'pet-care-ai-pet-activity-tracker', 70),
((SELECT id FROM categories WHERE slug = 'ai-elder-care-companions' AND level = 3 LIMIT 1), 'Pet Care AI: Lost Pet Finder AI', 'pet-care-ai-lost-pet-finder-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-elder-care-companions' AND level = 3 LIMIT 1), 'Pet Care AI: Pet Photo Enhancer', 'pet-care-ai-pet-photo-enhancer', 90),
((SELECT id FROM categories WHERE slug = 'ai-elder-care-companions' AND level = 3 LIMIT 1), 'Garden AI: Bonsai Care AI', 'garden-ai-bonsai-care-ai', 100),
((SELECT id FROM categories WHERE slug = 'ai-elder-care-companions' AND level = 3 LIMIT 1), 'Garden AI: Lawn Care Advisor AI', 'garden-ai-lawn-care-advisor-ai', 110);

-- AI Email Sequence Builders (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-email-sequence-builders' AND level = 3 LIMIT 1), 'Email Marketing AI: Subject Line AI', 'email-marketing-ai-subject-line-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-email-sequence-builders' AND level = 3 LIMIT 1), 'Email Marketing AI: Send Time Optimizer', 'email-marketing-ai-send-time-optimizer', 20),
((SELECT id FROM categories WHERE slug = 'ai-email-sequence-builders' AND level = 3 LIMIT 1), 'Email Marketing AI: Personalization AI', 'email-marketing-ai-personalization-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-email-sequence-builders' AND level = 3 LIMIT 1), 'Email Marketing AI: List Segmentation AI', 'email-marketing-ai-list-segmentation-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-email-sequence-builders' AND level = 3 LIMIT 1), 'Email Marketing AI: Email Design AI', 'email-marketing-ai-email-design-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-email-sequence-builders' AND level = 3 LIMIT 1), 'Email Marketing AI: A/B Testing AI', 'email-marketing-ai-a-b-testing-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-email-sequence-builders' AND level = 3 LIMIT 1), 'Email Marketing AI: Deliverability AI', 'email-marketing-ai-deliverability-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-email-sequence-builders' AND level = 3 LIMIT 1), 'Email Marketing AI: Unsubscribe Prediction', 'email-marketing-ai-unsubscribe-prediction', 80),
((SELECT id FROM categories WHERE slug = 'ai-email-sequence-builders' AND level = 3 LIMIT 1), 'Email Marketing AI: Win-Back Campaign AI', 'email-marketing-ai-win-back-campaign-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-email-sequence-builders' AND level = 3 LIMIT 1), 'Email Marketing AI: Email Analytics AI', 'email-marketing-ai-email-analytics-ai', 100);

-- AI Email Support Agents (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-email-support-agents' AND level = 3 LIMIT 1), 'Conversational Support: AI Email Support', 'conversational-support-ai-email-support', 10);

-- AI Employment Contract Reviewers (9 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-employment-contract-reviewers' AND level = 3 LIMIT 1), 'Contract AI: Contract Drafting AI', 'contract-ai-contract-drafting-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-employment-contract-reviewers' AND level = 3 LIMIT 1), 'Contract AI: Contract Review AI', 'contract-ai-contract-review-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-employment-contract-reviewers' AND level = 3 LIMIT 1), 'Contract AI: Clause Analysis', 'contract-ai-clause-analysis', 30),
((SELECT id FROM categories WHERE slug = 'ai-employment-contract-reviewers' AND level = 3 LIMIT 1), 'Contract AI: Risk Identification', 'contract-ai-risk-identification', 40),
((SELECT id FROM categories WHERE slug = 'ai-employment-contract-reviewers' AND level = 3 LIMIT 1), 'Contract AI: Obligation Tracking', 'contract-ai-obligation-tracking', 50),
((SELECT id FROM categories WHERE slug = 'ai-employment-contract-reviewers' AND level = 3 LIMIT 1), 'Contract AI: Contract Comparison', 'contract-ai-contract-comparison', 60),
((SELECT id FROM categories WHERE slug = 'ai-employment-contract-reviewers' AND level = 3 LIMIT 1), 'Contract AI: Template Generation', 'contract-ai-template-generation', 70),
((SELECT id FROM categories WHERE slug = 'ai-employment-contract-reviewers' AND level = 3 LIMIT 1), 'Contract AI: E-Signature Intelligence', 'contract-ai-e-signature-intelligence', 80),
((SELECT id FROM categories WHERE slug = 'ai-employment-contract-reviewers' AND level = 3 LIMIT 1), 'Contract AI: Contract Analytics', 'contract-ai-contract-analytics', 90);

-- AI Enterprise Search Engines (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-enterprise-search-engines' AND level = 3 LIMIT 1), 'Semantic Search: Enterprise Search AI', 'semantic-search-enterprise-search-ai', 10);

-- AI Etsy Listing Optimizers (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-etsy-listing-optimizers' AND level = 3 LIMIT 1), 'E-Commerce Operations: Product Listing AI', 'e-commerce-operations-product-listing-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-etsy-listing-optimizers' AND level = 3 LIMIT 1), 'Listing & Catalog AI: Product Title Generator', 'listing-catalog-ai-product-title-generator', 20),
((SELECT id FROM categories WHERE slug = 'ai-etsy-listing-optimizers' AND level = 3 LIMIT 1), 'Listing & Catalog AI: Product Feature Extractor', 'listing-catalog-ai-product-feature-extractor', 30),
((SELECT id FROM categories WHERE slug = 'ai-etsy-listing-optimizers' AND level = 3 LIMIT 1), 'Listing & Catalog AI: Catalog Enrichment AI', 'listing-catalog-ai-catalog-enrichment-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-etsy-listing-optimizers' AND level = 3 LIMIT 1), 'Listing & Catalog AI: Cross-Listing Automation', 'listing-catalog-ai-cross-listing-automation', 50),
((SELECT id FROM categories WHERE slug = 'ai-etsy-listing-optimizers' AND level = 3 LIMIT 1), 'Listing & Catalog AI: Product Categorizer AI', 'listing-catalog-ai-product-categorizer-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-etsy-listing-optimizers' AND level = 3 LIMIT 1), 'Listing & Catalog AI: Attribute Extraction', 'listing-catalog-ai-attribute-extraction', 70),
((SELECT id FROM categories WHERE slug = 'ai-etsy-listing-optimizers' AND level = 3 LIMIT 1), 'Listing & Catalog AI: Product Video Creator', 'listing-catalog-ai-product-video-creator', 80),
((SELECT id FROM categories WHERE slug = 'ai-etsy-listing-optimizers' AND level = 3 LIMIT 1), 'Listing & Catalog AI: A+ Content Writer', 'listing-catalog-ai-a-content-writer', 90),
((SELECT id FROM categories WHERE slug = 'ai-etsy-listing-optimizers' AND level = 3 LIMIT 1), 'Listing & Catalog AI: Marketplace Compliance AI', 'listing-catalog-ai-marketplace-compliance-ai', 100);

-- AI Expense Categorization (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-expense-categorization' AND level = 3 LIMIT 1), 'Accounting AI: Expense Categorization', 'accounting-ai-expense-categorization', 10);

-- AI Explainability Toolkits (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-explainability-toolkits' AND level = 3 LIMIT 1), 'AI Governance: Explainability Tools', 'ai-governance-explainability-tools', 10);

-- AI Facebook Group Engagement Tools (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-facebook-group-engagement-tools' AND level = 3 LIMIT 1), 'Engagement AI: Community Management AI', 'engagement-ai-community-management-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-facebook-group-engagement-tools' AND level = 3 LIMIT 1), 'Engagement AI: Comment Response AI', 'engagement-ai-comment-response-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-facebook-group-engagement-tools' AND level = 3 LIMIT 1), 'Engagement AI: DM Automation AI', 'engagement-ai-dm-automation-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-facebook-group-engagement-tools' AND level = 3 LIMIT 1), 'Engagement AI: Follower Analysis AI', 'engagement-ai-follower-analysis-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-facebook-group-engagement-tools' AND level = 3 LIMIT 1), 'Engagement AI: Hashtag Strategy AI', 'engagement-ai-hashtag-strategy-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-facebook-group-engagement-tools' AND level = 3 LIMIT 1), 'Engagement AI: Posting Schedule AI', 'engagement-ai-posting-schedule-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-facebook-group-engagement-tools' AND level = 3 LIMIT 1), 'Engagement AI: Content Calendar AI Social', 'engagement-ai-content-calendar-ai-social', 70),
((SELECT id FROM categories WHERE slug = 'ai-facebook-group-engagement-tools' AND level = 3 LIMIT 1), 'Engagement AI: UGC Curation AI', 'engagement-ai-ugc-curation-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-facebook-group-engagement-tools' AND level = 3 LIMIT 1), 'Engagement AI: Brand Mention AI', 'engagement-ai-brand-mention-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-facebook-group-engagement-tools' AND level = 3 LIMIT 1), 'Engagement AI: Virality Prediction AI', 'engagement-ai-virality-prediction-ai', 100);

-- AI Facebook Post Writers (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-facebook-post-writers' AND level = 3 LIMIT 1), 'Social Media Writing: Facebook Post Writers', 'social-media-writing-facebook-post-writers', 10),
((SELECT id FROM categories WHERE slug = 'ai-facebook-post-writers' AND level = 3 LIMIT 1), 'Platform-Specific AI: Facebook Content AI', 'platform-specific-ai-facebook-content-ai', 20);

-- AI Fairness Metric Tools (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-fairness-metric-tools' AND level = 3 LIMIT 1), 'AI Governance: Fairness Testing', 'ai-governance-fairness-testing', 10);

-- AI Family Calendar Helpers (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-family-calendar-helpers' AND level = 3 LIMIT 1), 'Child & Family AI: Baby Name Generator', 'child-family-ai-baby-name-generator', 10),
((SELECT id FROM categories WHERE slug = 'ai-family-calendar-helpers' AND level = 3 LIMIT 1), 'Child & Family AI: Baby Milestone Tracker', 'child-family-ai-baby-milestone-tracker', 20),
((SELECT id FROM categories WHERE slug = 'ai-family-calendar-helpers' AND level = 3 LIMIT 1), 'Child & Family AI: Bedtime Story Generator AI', 'child-family-ai-bedtime-story-generator-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-family-calendar-helpers' AND level = 3 LIMIT 1), 'Child & Family AI: Kids Activity Planner', 'child-family-ai-kids-activity-planner', 40),
((SELECT id FROM categories WHERE slug = 'ai-family-calendar-helpers' AND level = 3 LIMIT 1), 'Child & Family AI: Homework Helper AI', 'child-family-ai-homework-helper-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-family-calendar-helpers' AND level = 3 LIMIT 1), 'Child & Family AI: Screen Time Manager', 'child-family-ai-screen-time-manager', 60),
((SELECT id FROM categories WHERE slug = 'ai-family-calendar-helpers' AND level = 3 LIMIT 1), 'Child & Family AI: Child Safety AI', 'child-family-ai-child-safety-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-family-calendar-helpers' AND level = 3 LIMIT 1), 'Child & Family AI: Parenting Advice AI', 'child-family-ai-parenting-advice-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-family-calendar-helpers' AND level = 3 LIMIT 1), 'Child & Family AI: Family Calendar AI', 'child-family-ai-family-calendar-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-family-calendar-helpers' AND level = 3 LIMIT 1), 'Child & Family AI: College Planning AI', 'child-family-ai-college-planning-ai', 100);

-- AI Family Trip Planners (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-family-trip-planners' AND level = 3 LIMIT 1), 'Trip Planning AI: Family Trip Planner', 'trip-planning-ai-family-trip-planner', 10);

-- AI Fantasy Sports Team Name Generators (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-fantasy-sports-team-name-generators' AND level = 3 LIMIT 1), 'Personal Name AI: Fantasy Name Generator', 'personal-name-ai-fantasy-name-generator', 10),
((SELECT id FROM categories WHERE slug = 'ai-fantasy-sports-team-name-generators' AND level = 3 LIMIT 1), 'Sports Analysis AI: Fantasy Sports Optimizer', 'sports-analysis-ai-fantasy-sports-optimizer', 20);

-- AI File Organization Agents (11 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-file-organization-agents' AND level = 3 LIMIT 1), 'Task-Specific Agents: File Organization Agents', 'task-specific-agents-file-organization-agents', 10),
((SELECT id FROM categories WHERE slug = 'ai-file-organization-agents' AND level = 3 LIMIT 1), 'File Organization AI: Auto-Tag Files', 'file-organization-ai-auto-tag-files', 20),
((SELECT id FROM categories WHERE slug = 'ai-file-organization-agents' AND level = 3 LIMIT 1), 'File Organization AI: Smart Folder AI', 'file-organization-ai-smart-folder-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-file-organization-agents' AND level = 3 LIMIT 1), 'File Organization AI: Duplicate File Finder', 'file-organization-ai-duplicate-file-finder', 40),
((SELECT id FROM categories WHERE slug = 'ai-file-organization-agents' AND level = 3 LIMIT 1), 'File Organization AI: File Renaming AI', 'file-organization-ai-file-renaming-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-file-organization-agents' AND level = 3 LIMIT 1), 'File Organization AI: Photo Organizer AI', 'file-organization-ai-photo-organizer-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-file-organization-agents' AND level = 3 LIMIT 1), 'File Organization AI: Music Library Organizer', 'file-organization-ai-music-library-organizer', 70),
((SELECT id FROM categories WHERE slug = 'ai-file-organization-agents' AND level = 3 LIMIT 1), 'File Organization AI: Document Classifier', 'file-organization-ai-document-classifier', 80),
((SELECT id FROM categories WHERE slug = 'ai-file-organization-agents' AND level = 3 LIMIT 1), 'File Organization AI: Archive Manager AI', 'file-organization-ai-archive-manager-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-file-organization-agents' AND level = 3 LIMIT 1), 'File Organization AI: Storage Optimizer AI', 'file-organization-ai-storage-optimizer-ai', 100),
((SELECT id FROM categories WHERE slug = 'ai-file-organization-agents' AND level = 3 LIMIT 1), 'File Organization AI: Backup Scheduler AI', 'file-organization-ai-backup-scheduler-ai', 110);

-- AI Fitness Tracker Insights (15 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-fitness-tracker-insights' AND level = 3 LIMIT 1), 'Fitness AI: Workout Planning AI', 'fitness-ai-workout-planning-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-fitness-tracker-insights' AND level = 3 LIMIT 1), 'Fitness AI: Nutrition AI', 'fitness-ai-nutrition-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-fitness-tracker-insights' AND level = 3 LIMIT 1), 'Fitness AI: Form Correction AI', 'fitness-ai-form-correction-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-fitness-tracker-insights' AND level = 3 LIMIT 1), 'Fitness AI: Recovery AI', 'fitness-ai-recovery-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-fitness-tracker-insights' AND level = 3 LIMIT 1), 'Fitness AI: Sleep Optimization AI', 'fitness-ai-sleep-optimization-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-fitness-tracker-insights' AND level = 3 LIMIT 1), 'Fitness AI: Wearable Analytics AI', 'fitness-ai-wearable-analytics-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-fitness-tracker-insights' AND level = 3 LIMIT 1), 'Fitness AI: Virtual Trainer AI', 'fitness-ai-virtual-trainer-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-fitness-tracker-insights' AND level = 3 LIMIT 1), 'Fitness AI: Meditation AI', 'fitness-ai-meditation-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-fitness-tracker-insights' AND level = 3 LIMIT 1), 'Fitness AI: Breathing Exercise AI', 'fitness-ai-breathing-exercise-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-fitness-tracker-insights' AND level = 3 LIMIT 1), 'Fitness AI: Stretching Guide AI', 'fitness-ai-stretching-guide-ai', 100),
((SELECT id FROM categories WHERE slug = 'ai-fitness-tracker-insights' AND level = 3 LIMIT 1), 'Fitness AI: Exercise Form Checker', 'fitness-ai-exercise-form-checker', 110),
((SELECT id FROM categories WHERE slug = 'ai-fitness-tracker-insights' AND level = 3 LIMIT 1), 'Fitness AI: Calorie Counter AI', 'fitness-ai-calorie-counter-ai', 120),
((SELECT id FROM categories WHERE slug = 'ai-fitness-tracker-insights' AND level = 3 LIMIT 1), 'Fitness AI: Body Composition AI', 'fitness-ai-body-composition-ai', 130),
((SELECT id FROM categories WHERE slug = 'ai-fitness-tracker-insights' AND level = 3 LIMIT 1), 'Fitness AI: Wearable Data Analyzer', 'fitness-ai-wearable-data-analyzer', 140),
((SELECT id FROM categories WHERE slug = 'ai-fitness-tracker-insights' AND level = 3 LIMIT 1), 'Esoteric AI: Moon Phase Tracker', 'esoteric-ai-moon-phase-tracker', 150);

-- AI Focus Music Curators (11 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-focus-music-curators' AND level = 3 LIMIT 1), 'Personal Productivity AI: Focus & Flow AI', 'personal-productivity-ai-focus-flow-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-focus-music-curators' AND level = 3 LIMIT 1), 'Task & Focus AI: Smart To-Do AI', 'task-focus-ai-smart-to-do-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-focus-music-curators' AND level = 3 LIMIT 1), 'Task & Focus AI: Priority Matrix AI', 'task-focus-ai-priority-matrix-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-focus-music-curators' AND level = 3 LIMIT 1), 'Task & Focus AI: Deep Focus Timer AI', 'task-focus-ai-deep-focus-timer-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-focus-music-curators' AND level = 3 LIMIT 1), 'Task & Focus AI: Distraction Blocker AI', 'task-focus-ai-distraction-blocker-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-focus-music-curators' AND level = 3 LIMIT 1), 'Task & Focus AI: Daily Planner AI Work', 'task-focus-ai-daily-planner-ai-work', 60),
((SELECT id FROM categories WHERE slug = 'ai-focus-music-curators' AND level = 3 LIMIT 1), 'Task & Focus AI: Weekly Review AI', 'task-focus-ai-weekly-review-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-focus-music-curators' AND level = 3 LIMIT 1), 'Task & Focus AI: Goal Decomposer AI', 'task-focus-ai-goal-decomposer-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-focus-music-curators' AND level = 3 LIMIT 1), 'Task & Focus AI: Energy Management AI', 'task-focus-ai-energy-management-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-focus-music-curators' AND level = 3 LIMIT 1), 'Task & Focus AI: Context Switching AI', 'task-focus-ai-context-switching-ai', 100),
((SELECT id FROM categories WHERE slug = 'ai-focus-music-curators' AND level = 3 LIMIT 1), 'Task & Focus AI: Decision Fatigue Reducer', 'task-focus-ai-decision-fatigue-reducer', 110);

-- AI Foley Sound Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-foley-sound-generators' AND level = 3 LIMIT 1), 'Sound Design: Foley AI', 'sound-design-foley-ai', 10);

-- AI Follow-Up Email Drafters (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-follow-up-email-drafters' AND level = 3 LIMIT 1), 'Email Writing: Follow-Up Email AI', 'email-writing-follow-up-email-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-follow-up-email-drafters' AND level = 3 LIMIT 1), 'Meeting AI Tools: Follow-Up Task Creator', 'meeting-ai-tools-follow-up-task-creator', 20);

-- AI for Agriculture Crop Monitoring (5 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-for-agriculture-crop-monitoring' AND level = 3 LIMIT 1), 'Farming AI: Crop Monitoring AI', 'farming-ai-crop-monitoring-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-for-agriculture-crop-monitoring' AND level = 3 LIMIT 1), 'Farming AI: Irrigation AI', 'farming-ai-irrigation-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-for-agriculture-crop-monitoring' AND level = 3 LIMIT 1), 'Farming AI: Livestock Monitoring', 'farming-ai-livestock-monitoring', 30),
((SELECT id FROM categories WHERE slug = 'ai-for-agriculture-crop-monitoring' AND level = 3 LIMIT 1), 'Farming AI: Farm Equipment AI', 'farming-ai-farm-equipment-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-for-agriculture-crop-monitoring' AND level = 3 LIMIT 1), 'Farming AI: Sustainable Farming AI', 'farming-ai-sustainable-farming-ai', 50);

-- AI for Construction Site Monitoring (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-for-construction-site-monitoring' AND level = 3 LIMIT 1), 'Building AI: Site Monitoring AI', 'building-ai-site-monitoring-ai', 10);

-- AI for Energy Grid Optimization (11 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-for-energy-grid-optimization' AND level = 3 LIMIT 1), 'Process Optimization: Energy Optimization', 'process-optimization-energy-optimization', 10),
((SELECT id FROM categories WHERE slug = 'ai-for-energy-grid-optimization' AND level = 3 LIMIT 1), 'Energy AI: Grid Optimization', 'energy-ai-grid-optimization', 20),
((SELECT id FROM categories WHERE slug = 'ai-for-energy-grid-optimization' AND level = 3 LIMIT 1), 'Energy AI: Renewable Forecasting', 'energy-ai-renewable-forecasting', 30),
((SELECT id FROM categories WHERE slug = 'ai-for-energy-grid-optimization' AND level = 3 LIMIT 1), 'Energy AI: Energy Trading AI', 'energy-ai-energy-trading-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-for-energy-grid-optimization' AND level = 3 LIMIT 1), 'Energy AI: Smart Meter AI', 'energy-ai-smart-meter-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-for-energy-grid-optimization' AND level = 3 LIMIT 1), 'Energy AI: Building Energy AI', 'energy-ai-building-energy-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-for-energy-grid-optimization' AND level = 3 LIMIT 1), 'Energy AI: EV Charging AI', 'energy-ai-ev-charging-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-for-energy-grid-optimization' AND level = 3 LIMIT 1), 'Energy AI: Carbon Tracking AI', 'energy-ai-carbon-tracking-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-for-energy-grid-optimization' AND level = 3 LIMIT 1), 'Energy AI: Pipeline Monitoring', 'energy-ai-pipeline-monitoring', 90),
((SELECT id FROM categories WHERE slug = 'ai-for-energy-grid-optimization' AND level = 3 LIMIT 1), 'Energy AI: Drilling Optimization', 'energy-ai-drilling-optimization', 100),
((SELECT id FROM categories WHERE slug = 'ai-for-energy-grid-optimization' AND level = 3 LIMIT 1), 'Energy AI: Solar Panel AI', 'energy-ai-solar-panel-ai', 110);

-- AI for Factory Floor Optimization (11 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-for-factory-floor-optimization' AND level = 3 LIMIT 1), 'Process Optimization: Business Process Mining', 'process-optimization-business-process-mining', 10),
((SELECT id FROM categories WHERE slug = 'ai-for-factory-floor-optimization' AND level = 3 LIMIT 1), 'Process Optimization: Workflow Optimization AI', 'process-optimization-workflow-optimization-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-for-factory-floor-optimization' AND level = 3 LIMIT 1), 'Process Optimization: Capacity Planning AI', 'process-optimization-capacity-planning-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-for-factory-floor-optimization' AND level = 3 LIMIT 1), 'Process Optimization: Resource Allocation AI', 'process-optimization-resource-allocation-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-for-factory-floor-optimization' AND level = 3 LIMIT 1), 'Process Optimization: Scheduling Optimization', 'process-optimization-scheduling-optimization', 50),
((SELECT id FROM categories WHERE slug = 'ai-for-factory-floor-optimization' AND level = 3 LIMIT 1), 'Process Optimization: Cost Reduction AI', 'process-optimization-cost-reduction-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-for-factory-floor-optimization' AND level = 3 LIMIT 1), 'Process Optimization: Waste Reduction AI', 'process-optimization-waste-reduction-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-for-factory-floor-optimization' AND level = 3 LIMIT 1), 'Process Optimization: Maintenance Prediction', 'process-optimization-maintenance-prediction', 80),
((SELECT id FROM categories WHERE slug = 'ai-for-factory-floor-optimization' AND level = 3 LIMIT 1), 'Process Optimization: Safety Prediction AI', 'process-optimization-safety-prediction-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-for-factory-floor-optimization' AND level = 3 LIMIT 1), 'Pharmaceutical AI: Dosage Optimization AI', 'pharmaceutical-ai-dosage-optimization-ai', 100),
((SELECT id FROM categories WHERE slug = 'ai-for-factory-floor-optimization' AND level = 3 LIMIT 1), 'DevOps AI: Config Optimization AI', 'devops-ai-config-optimization-ai', 110);

-- AI for Fashion Pattern Making (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-for-fashion-pattern-making' AND level = 3 LIMIT 1), 'Fashion Tech AI: Pattern Design AI', 'fashion-tech-ai-pattern-design-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-for-fashion-pattern-making' AND level = 3 LIMIT 1), 'Fashion Design AI: Pattern Maker AI', 'fashion-design-ai-pattern-maker-ai', 20);

-- AI for Fashion Trend Forecasting (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-for-fashion-trend-forecasting' AND level = 3 LIMIT 1), 'Fashion Tech AI: Trend Forecasting AI', 'fashion-tech-ai-trend-forecasting-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-for-fashion-trend-forecasting' AND level = 3 LIMIT 1), 'Fashion Tech AI: Color Trend AI', 'fashion-tech-ai-color-trend-ai', 20);

-- AI for Film Pre-Production (9 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-for-film-pre-production' AND level = 3 LIMIT 1), 'Production AI: Quality Inspection AI', 'production-ai-quality-inspection-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-for-film-pre-production' AND level = 3 LIMIT 1), 'Production AI: Predictive Maintenance', 'production-ai-predictive-maintenance', 20),
((SELECT id FROM categories WHERE slug = 'ai-for-film-pre-production' AND level = 3 LIMIT 1), 'Production AI: Production Scheduling AI', 'production-ai-production-scheduling-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-for-film-pre-production' AND level = 3 LIMIT 1), 'Production AI: Supply Chain AI', 'production-ai-supply-chain-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-for-film-pre-production' AND level = 3 LIMIT 1), 'Production AI: Digital Twin', 'production-ai-digital-twin', 50),
((SELECT id FROM categories WHERE slug = 'ai-for-film-pre-production' AND level = 3 LIMIT 1), 'Production AI: Robotic Process AI', 'production-ai-robotic-process-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-for-film-pre-production' AND level = 3 LIMIT 1), 'Production AI: Energy Management AI', 'production-ai-energy-management-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-for-film-pre-production' AND level = 3 LIMIT 1), 'Production AI: Safety Monitoring AI', 'production-ai-safety-monitoring-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-for-film-pre-production' AND level = 3 LIMIT 1), 'Production AI: Yield Optimization', 'production-ai-yield-optimization', 90);

-- AI for Food Service Inventory (11 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-for-food-service-inventory' AND level = 3 LIMIT 1), 'Food Industry AI: Inventory Prediction Food', 'food-industry-ai-inventory-prediction-food', 10),
((SELECT id FROM categories WHERE slug = 'ai-for-food-service-inventory' AND level = 3 LIMIT 1), 'Food Identification: Food Photo Recognition', 'food-identification-food-photo-recognition', 20),
((SELECT id FROM categories WHERE slug = 'ai-for-food-service-inventory' AND level = 3 LIMIT 1), 'Food Identification: Nutrition Analyzer from Photo', 'food-identification-nutrition-analyzer-from-photo', 30),
((SELECT id FROM categories WHERE slug = 'ai-for-food-service-inventory' AND level = 3 LIMIT 1), 'Food Identification: Restaurant Menu Analyzer', 'food-identification-restaurant-menu-analyzer', 40),
((SELECT id FROM categories WHERE slug = 'ai-for-food-service-inventory' AND level = 3 LIMIT 1), 'Food Identification: Grocery List Generator AI', 'food-identification-grocery-list-generator-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-for-food-service-inventory' AND level = 3 LIMIT 1), 'Food Identification: Meal Prep Scheduler', 'food-identification-meal-prep-scheduler', 60),
((SELECT id FROM categories WHERE slug = 'ai-for-food-service-inventory' AND level = 3 LIMIT 1), 'Food Identification: Food Allergy Checker', 'food-identification-food-allergy-checker', 70),
((SELECT id FROM categories WHERE slug = 'ai-for-food-service-inventory' AND level = 3 LIMIT 1), 'Food Identification: Food Expiry Tracker AI', 'food-identification-food-expiry-tracker-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-for-food-service-inventory' AND level = 3 LIMIT 1), 'Food Identification: Shopping Budget Optimizer', 'food-identification-shopping-budget-optimizer', 90),
((SELECT id FROM categories WHERE slug = 'ai-for-food-service-inventory' AND level = 3 LIMIT 1), 'Food Identification: Barcode Nutrition Scanner', 'food-identification-barcode-nutrition-scanner', 100),
((SELECT id FROM categories WHERE slug = 'ai-for-food-service-inventory' AND level = 3 LIMIT 1), 'Food Identification: Restaurant Recommendation AI', 'food-identification-restaurant-recommendation-ai', 110);

-- AI for Government Citizen Services (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-for-government-citizen-services' AND level = 3 LIMIT 1), 'Public Sector AI: Citizen Services AI', 'public-sector-ai-citizen-services-ai', 10);

-- AI for Grant Writing (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-for-grant-writing' AND level = 3 LIMIT 1), 'Academic Writing: Grant Proposal Writers', 'academic-writing-grant-proposal-writers', 10);

-- AI for Insurance Claims Triage (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-for-insurance-claims-triage' AND level = 3 LIMIT 1), 'Insurance AI: Claims Triage AI', 'insurance-ai-claims-triage-ai', 10);

-- AI for Insurance Underwriting (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-for-insurance-underwriting' AND level = 3 LIMIT 1), 'Insurance AI: Underwriting AI Insurance', 'insurance-ai-underwriting-ai-insurance', 10);

-- AI for Logistics Route Optimization (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-for-logistics-route-optimization' AND level = 3 LIMIT 1), 'Supply Chain AI: Route Optimization AI', 'supply-chain-ai-route-optimization-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-for-logistics-route-optimization' AND level = 3 LIMIT 1), 'Location AI: Route Optimization Data', 'location-ai-route-optimization-data', 20);

-- AI for Manufacturing Defect Detection (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-for-manufacturing-defect-detection' AND level = 3 LIMIT 1), 'Production AI: Defect Detection', 'production-ai-defect-detection', 10);

-- AI for Mining Safety (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-for-mining-safety' AND level = 3 LIMIT 1), 'Mining AI: Ore Grade Prediction', 'mining-ai-ore-grade-prediction', 10),
((SELECT id FROM categories WHERE slug = 'ai-for-mining-safety' AND level = 3 LIMIT 1), 'Mining AI: Drill Optimization AI', 'mining-ai-drill-optimization-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-for-mining-safety' AND level = 3 LIMIT 1), 'Mining AI: Mine Planning AI', 'mining-ai-mine-planning-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-for-mining-safety' AND level = 3 LIMIT 1), 'Mining AI: Safety Monitoring Mining', 'mining-ai-safety-monitoring-mining', 40),
((SELECT id FROM categories WHERE slug = 'ai-for-mining-safety' AND level = 3 LIMIT 1), 'Mining AI: Equipment Health Mining', 'mining-ai-equipment-health-mining', 50),
((SELECT id FROM categories WHERE slug = 'ai-for-mining-safety' AND level = 3 LIMIT 1), 'Mining AI: Geology AI', 'mining-ai-geology-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-for-mining-safety' AND level = 3 LIMIT 1), 'Mining AI: Resource Estimation', 'mining-ai-resource-estimation', 70),
((SELECT id FROM categories WHERE slug = 'ai-for-mining-safety' AND level = 3 LIMIT 1), 'Mining AI: Blast Optimization', 'mining-ai-blast-optimization', 80),
((SELECT id FROM categories WHERE slug = 'ai-for-mining-safety' AND level = 3 LIMIT 1), 'Mining AI: Tailings Management AI', 'mining-ai-tailings-management-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-for-mining-safety' AND level = 3 LIMIT 1), 'Mining AI: Environmental Mining AI', 'mining-ai-environmental-mining-ai', 100);

-- AI for Pest & Disease Detection (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-for-pest-disease-detection' AND level = 3 LIMIT 1), 'Farming AI: Pest Detection AI', 'farming-ai-pest-detection-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-for-pest-disease-detection' AND level = 3 LIMIT 1), 'Garden AI: Plant Disease Detector', 'garden-ai-plant-disease-detector', 20);

-- AI for Pharma R&D (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-for-pharma-rd' AND level = 3 LIMIT 1), 'Pharmaceutical AI: Pharmacovigilance AI', 'pharmaceutical-ai-pharmacovigilance-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-for-pharma-rd' AND level = 3 LIMIT 1), 'Pharmaceutical AI: Regulatory Submission AI', 'pharmaceutical-ai-regulatory-submission-ai', 20);

-- AI for Public Benefits Eligibility (19 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-for-public-benefits-eligibility' AND level = 3 LIMIT 1), 'Public Sector AI: Document Processing', 'public-sector-ai-document-processing', 10),
((SELECT id FROM categories WHERE slug = 'ai-for-public-benefits-eligibility' AND level = 3 LIMIT 1), 'Public Sector AI: Permit Processing AI', 'public-sector-ai-permit-processing-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-for-public-benefits-eligibility' AND level = 3 LIMIT 1), 'Public Sector AI: Public Safety AI', 'public-sector-ai-public-safety-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-for-public-benefits-eligibility' AND level = 3 LIMIT 1), 'Public Sector AI: Traffic Management AI', 'public-sector-ai-traffic-management-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-for-public-benefits-eligibility' AND level = 3 LIMIT 1), 'Public Sector AI: Urban Planning AI', 'public-sector-ai-urban-planning-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-for-public-benefits-eligibility' AND level = 3 LIMIT 1), 'Public Sector AI: Tax Assessment AI', 'public-sector-ai-tax-assessment-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-for-public-benefits-eligibility' AND level = 3 LIMIT 1), 'Public Sector AI: Benefits Administration', 'public-sector-ai-benefits-administration', 70),
((SELECT id FROM categories WHERE slug = 'ai-for-public-benefits-eligibility' AND level = 3 LIMIT 1), 'Public Sector AI: Election Security AI', 'public-sector-ai-election-security-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-for-public-benefits-eligibility' AND level = 3 LIMIT 1), 'Public Sector AI: Emergency Response AI', 'public-sector-ai-emergency-response-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-for-public-benefits-eligibility' AND level = 3 LIMIT 1), 'Public Speaking AI: Speech Writer AI', 'public-speaking-ai-speech-writer-ai', 100),
((SELECT id FROM categories WHERE slug = 'ai-for-public-benefits-eligibility' AND level = 3 LIMIT 1), 'Public Speaking AI: Teleprompter AI', 'public-speaking-ai-teleprompter-ai', 110),
((SELECT id FROM categories WHERE slug = 'ai-for-public-benefits-eligibility' AND level = 3 LIMIT 1), 'Public Speaking AI: Presentation Coach AI', 'public-speaking-ai-presentation-coach-ai', 120),
((SELECT id FROM categories WHERE slug = 'ai-for-public-benefits-eligibility' AND level = 3 LIMIT 1), 'Public Speaking AI: Body Language AI', 'public-speaking-ai-body-language-ai', 130),
((SELECT id FROM categories WHERE slug = 'ai-for-public-benefits-eligibility' AND level = 3 LIMIT 1), 'Public Speaking AI: Voice Modulation AI', 'public-speaking-ai-voice-modulation-ai', 140),
((SELECT id FROM categories WHERE slug = 'ai-for-public-benefits-eligibility' AND level = 3 LIMIT 1), 'Public Speaking AI: Audience Engagement AI', 'public-speaking-ai-audience-engagement-ai', 150),
((SELECT id FROM categories WHERE slug = 'ai-for-public-benefits-eligibility' AND level = 3 LIMIT 1), 'Public Speaking AI: Q&A Preparation AI', 'public-speaking-ai-q-a-preparation-ai', 160),
((SELECT id FROM categories WHERE slug = 'ai-for-public-benefits-eligibility' AND level = 3 LIMIT 1), 'Public Speaking AI: Stage Presence Coach', 'public-speaking-ai-stage-presence-coach', 170),
((SELECT id FROM categories WHERE slug = 'ai-for-public-benefits-eligibility' AND level = 3 LIMIT 1), 'Public Speaking AI: Slide Timing AI', 'public-speaking-ai-slide-timing-ai', 180),
((SELECT id FROM categories WHERE slug = 'ai-for-public-benefits-eligibility' AND level = 3 LIMIT 1), 'Public Speaking AI: Debate Prep AI', 'public-speaking-ai-debate-prep-ai', 190);

-- AI for Soil Analysis (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-for-soil-analysis' AND level = 3 LIMIT 1), 'Farming AI: Soil Analysis AI', 'farming-ai-soil-analysis-ai', 10);

-- AI for Solar Yield Prediction (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-for-solar-yield-prediction' AND level = 3 LIMIT 1), 'Farming AI: Yield Prediction', 'farming-ai-yield-prediction', 10);

-- AI for Sports Performance Analytics (12 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-for-sports-performance-analytics' AND level = 3 LIMIT 1), 'People Analytics: Performance Prediction', 'people-analytics-performance-prediction', 10),
((SELECT id FROM categories WHERE slug = 'ai-for-sports-performance-analytics' AND level = 3 LIMIT 1), 'Sports Analytics AI: Player Performance AI', 'sports-analytics-ai-player-performance-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-for-sports-performance-analytics' AND level = 3 LIMIT 1), 'Sports Analytics AI: Game Strategy AI', 'sports-analytics-ai-game-strategy-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-for-sports-performance-analytics' AND level = 3 LIMIT 1), 'Sports Analytics AI: Injury Prediction', 'sports-analytics-ai-injury-prediction', 40),
((SELECT id FROM categories WHERE slug = 'ai-for-sports-performance-analytics' AND level = 3 LIMIT 1), 'Sports Analytics AI: Scouting AI', 'sports-analytics-ai-scouting-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-for-sports-performance-analytics' AND level = 3 LIMIT 1), 'Sports Analytics AI: Fan Engagement AI', 'sports-analytics-ai-fan-engagement-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-for-sports-performance-analytics' AND level = 3 LIMIT 1), 'Sports Analytics AI: Ticket Pricing AI', 'sports-analytics-ai-ticket-pricing-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-for-sports-performance-analytics' AND level = 3 LIMIT 1), 'Sports Analytics AI: Broadcast AI', 'sports-analytics-ai-broadcast-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-for-sports-performance-analytics' AND level = 3 LIMIT 1), 'Sports Analytics AI: Training AI', 'sports-analytics-ai-training-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-for-sports-performance-analytics' AND level = 3 LIMIT 1), 'Sports Analytics AI: Recruitment AI Sports', 'sports-analytics-ai-recruitment-ai-sports', 100),
((SELECT id FROM categories WHERE slug = 'ai-for-sports-performance-analytics' AND level = 3 LIMIT 1), 'Sports Analytics AI: Fantasy Sports AI', 'sports-analytics-ai-fantasy-sports-ai', 110),
((SELECT id FROM categories WHERE slug = 'ai-for-sports-performance-analytics' AND level = 3 LIMIT 1), 'Sports Analysis AI: Performance Benchmark AI', 'sports-analysis-ai-performance-benchmark-ai', 120);

-- AI for Sports Scouting (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-for-sports-scouting' AND level = 3 LIMIT 1), 'Sports Analysis AI: Opponent Scouting AI', 'sports-analysis-ai-opponent-scouting-ai', 10);

-- AI for Telecom Network Optimization (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-for-telecom-network-optimization' AND level = 3 LIMIT 1), 'Telecom AI: Network Optimization', 'telecom-ai-network-optimization', 10),
((SELECT id FROM categories WHERE slug = 'ai-for-telecom-network-optimization' AND level = 3 LIMIT 1), 'Telecom AI: Churn Prediction Telecom', 'telecom-ai-churn-prediction-telecom', 20),
((SELECT id FROM categories WHERE slug = 'ai-for-telecom-network-optimization' AND level = 3 LIMIT 1), 'Telecom AI: Fraud Detection Telecom', 'telecom-ai-fraud-detection-telecom', 30),
((SELECT id FROM categories WHERE slug = 'ai-for-telecom-network-optimization' AND level = 3 LIMIT 1), 'Telecom AI: Customer Service Telecom', 'telecom-ai-customer-service-telecom', 40),
((SELECT id FROM categories WHERE slug = 'ai-for-telecom-network-optimization' AND level = 3 LIMIT 1), 'Telecom AI: Predictive Maintenance Telecom', 'telecom-ai-predictive-maintenance-telecom', 50),
((SELECT id FROM categories WHERE slug = 'ai-for-telecom-network-optimization' AND level = 3 LIMIT 1), 'Telecom AI: Spectrum Management', 'telecom-ai-spectrum-management', 60),
((SELECT id FROM categories WHERE slug = 'ai-for-telecom-network-optimization' AND level = 3 LIMIT 1), 'Telecom AI: Tower Management', 'telecom-ai-tower-management', 70),
((SELECT id FROM categories WHERE slug = 'ai-for-telecom-network-optimization' AND level = 3 LIMIT 1), 'Telecom AI: 5G Planning AI', 'telecom-ai-5g-planning-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-for-telecom-network-optimization' AND level = 3 LIMIT 1), 'Telecom AI: Fiber Planning AI', 'telecom-ai-fiber-planning-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-for-telecom-network-optimization' AND level = 3 LIMIT 1), 'Telecom AI: Billing AI Telecom', 'telecom-ai-billing-ai-telecom', 100);

-- AI Frame Interpolation (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-frame-interpolation' AND level = 3 LIMIT 1), 'AI Video Editing: Frame Interpolation', 'ai-video-editing-frame-interpolation', 10);

-- AI Freelance Contract Builders (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-freelance-contract-builders' AND level = 3 LIMIT 1), 'Freelance AI: Freelance Proposal AI', 'freelance-ai-freelance-proposal-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-freelance-contract-builders' AND level = 3 LIMIT 1), 'Freelance AI: Rate Calculator AI', 'freelance-ai-rate-calculator-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-freelance-contract-builders' AND level = 3 LIMIT 1), 'Freelance AI: Client Finder AI', 'freelance-ai-client-finder-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-freelance-contract-builders' AND level = 3 LIMIT 1), 'Freelance AI: Invoice Generator Freelance AI', 'freelance-ai-invoice-generator-freelance-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-freelance-contract-builders' AND level = 3 LIMIT 1), 'Freelance AI: Contract Template AI', 'freelance-ai-contract-template-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-freelance-contract-builders' AND level = 3 LIMIT 1), 'Freelance AI: Time Tracker AI Freelance', 'freelance-ai-time-tracker-ai-freelance', 60),
((SELECT id FROM categories WHERE slug = 'ai-freelance-contract-builders' AND level = 3 LIMIT 1), 'Freelance AI: Portfolio Site AI', 'freelance-ai-portfolio-site-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-freelance-contract-builders' AND level = 3 LIMIT 1), 'Freelance AI: Testimonial Request AI', 'freelance-ai-testimonial-request-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-freelance-contract-builders' AND level = 3 LIMIT 1), 'Freelance AI: Tax Estimator Freelance', 'freelance-ai-tax-estimator-freelance', 90),
((SELECT id FROM categories WHERE slug = 'ai-freelance-contract-builders' AND level = 3 LIMIT 1), 'Freelance AI: Upwork Proposal Writer AI', 'freelance-ai-upwork-proposal-writer-ai', 100);

-- AI Freelancer Bookkeeping (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-freelancer-bookkeeping' AND level = 3 LIMIT 1), 'Accounting AI: Bookkeeping Automation', 'accounting-ai-bookkeeping-automation', 10);

-- AI Friendship Building Coaches (9 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-friendship-building-coaches' AND level = 3 LIMIT 1), 'Building AI: Blueprint AI', 'building-ai-blueprint-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-friendship-building-coaches' AND level = 3 LIMIT 1), 'Building AI: Cost Estimation AI', 'building-ai-cost-estimation-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-friendship-building-coaches' AND level = 3 LIMIT 1), 'Building AI: Safety Inspection AI', 'building-ai-safety-inspection-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-friendship-building-coaches' AND level = 3 LIMIT 1), 'Building AI: Material Estimation', 'building-ai-material-estimation', 40),
((SELECT id FROM categories WHERE slug = 'ai-friendship-building-coaches' AND level = 3 LIMIT 1), 'Building AI: Project Timeline AI', 'building-ai-project-timeline-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-friendship-building-coaches' AND level = 3 LIMIT 1), 'Building AI: BIM AI', 'building-ai-bim-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-friendship-building-coaches' AND level = 3 LIMIT 1), 'Building AI: Equipment Tracking AI', 'building-ai-equipment-tracking-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-friendship-building-coaches' AND level = 3 LIMIT 1), 'Building AI: Worker Safety AI', 'building-ai-worker-safety-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-friendship-building-coaches' AND level = 3 LIMIT 1), 'Building AI: Permit Processing AI', 'building-ai-permit-processing-ai', 90);

-- AI Game Map Generators (19 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-game-map-generators' AND level = 3 LIMIT 1), 'Game Play AI: Procedural Level Generator', 'game-play-ai-procedural-level-generator', 10),
((SELECT id FROM categories WHERE slug = 'ai-game-map-generators' AND level = 3 LIMIT 1), 'Game Play AI: Game Balance AI', 'game-play-ai-game-balance-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-game-map-generators' AND level = 3 LIMIT 1), 'Game Play AI: Anti-Cheat AI', 'game-play-ai-anti-cheat-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-game-map-generators' AND level = 3 LIMIT 1), 'Game Play AI: Player Behavior AI', 'game-play-ai-player-behavior-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-game-map-generators' AND level = 3 LIMIT 1), 'Game Play AI: In-Game Economy AI', 'game-play-ai-in-game-economy-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-game-map-generators' AND level = 3 LIMIT 1), 'Game Play AI: Matchmaking AI', 'game-play-ai-matchmaking-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-game-map-generators' AND level = 3 LIMIT 1), 'Game Play AI: Game Tutorial AI', 'game-play-ai-game-tutorial-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-game-map-generators' AND level = 3 LIMIT 1), 'Game Play AI: Difficulty Scaler AI', 'game-play-ai-difficulty-scaler-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-game-map-generators' AND level = 3 LIMIT 1), 'Game Play AI: Achievement System AI', 'game-play-ai-achievement-system-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-game-map-generators' AND level = 3 LIMIT 1), 'Game Creation AI: Game Idea Generator', 'game-creation-ai-game-idea-generator', 100),
((SELECT id FROM categories WHERE slug = 'ai-game-map-generators' AND level = 3 LIMIT 1), 'Game Creation AI: Game Design Document AI', 'game-creation-ai-game-design-document-ai', 110),
((SELECT id FROM categories WHERE slug = 'ai-game-map-generators' AND level = 3 LIMIT 1), 'Game Creation AI: Narrative Design AI', 'game-creation-ai-narrative-design-ai', 120),
((SELECT id FROM categories WHERE slug = 'ai-game-map-generators' AND level = 3 LIMIT 1), 'Game Creation AI: Quest Generator', 'game-creation-ai-quest-generator', 130),
((SELECT id FROM categories WHERE slug = 'ai-game-map-generators' AND level = 3 LIMIT 1), 'Game Creation AI: Lore Builder AI', 'game-creation-ai-lore-builder-ai', 140),
((SELECT id FROM categories WHERE slug = 'ai-game-map-generators' AND level = 3 LIMIT 1), 'Game Creation AI: Item Description AI', 'game-creation-ai-item-description-ai', 150),
((SELECT id FROM categories WHERE slug = 'ai-game-map-generators' AND level = 3 LIMIT 1), 'Game Creation AI: Skill Tree Designer', 'game-creation-ai-skill-tree-designer', 160),
((SELECT id FROM categories WHERE slug = 'ai-game-map-generators' AND level = 3 LIMIT 1), 'Game Creation AI: Map Generator AI', 'game-creation-ai-map-generator-ai', 170),
((SELECT id FROM categories WHERE slug = 'ai-game-map-generators' AND level = 3 LIMIT 1), 'Game Creation AI: Enemy Design AI', 'game-creation-ai-enemy-design-ai', 180),
((SELECT id FROM categories WHERE slug = 'ai-game-map-generators' AND level = 3 LIMIT 1), 'Game Creation AI: Boss Battle Designer', 'game-creation-ai-boss-battle-designer', 190);

-- AI Game Music Generators (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-game-music-generators' AND level = 3 LIMIT 1), 'Music Generation: Game Music AI', 'music-generation-game-music-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-game-music-generators' AND level = 3 LIMIT 1), 'Game Asset AI: Game Music AI', 'game-asset-ai-game-music-ai', 20);

-- AI Genetic Test Interpretation (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-genetic-test-interpretation' AND level = 3 LIMIT 1), 'Mystical & Spiritual AI: Dream Interpretation AI', 'mystical-spiritual-ai-dream-interpretation-ai', 10);

-- AI GIF Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-gif-generators' AND level = 3 LIMIT 1), 'Meme Creation AI: Reaction GIF Maker', 'meme-creation-ai-reaction-gif-maker', 10);

-- AI Goal-Setting Coaches (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-goal-setting-coaches' AND level = 3 LIMIT 1), 'Personal Productivity AI: Goal Setting AI', 'personal-productivity-ai-goal-setting-ai', 10);

-- AI Helm Chart Generators (12 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-helm-chart-generators' AND level = 3 LIMIT 1), 'Chart AI: Scatter Plot AI', 'chart-ai-scatter-plot-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-helm-chart-generators' AND level = 3 LIMIT 1), 'Chart AI: Bar Chart AI', 'chart-ai-bar-chart-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-helm-chart-generators' AND level = 3 LIMIT 1), 'Chart AI: Line Chart AI', 'chart-ai-line-chart-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-helm-chart-generators' AND level = 3 LIMIT 1), 'Chart AI: Pie Chart AI', 'chart-ai-pie-chart-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-helm-chart-generators' AND level = 3 LIMIT 1), 'Chart AI: Histogram AI', 'chart-ai-histogram-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-helm-chart-generators' AND level = 3 LIMIT 1), 'Chart AI: Box Plot AI', 'chart-ai-box-plot-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-helm-chart-generators' AND level = 3 LIMIT 1), 'Chart AI: Waterfall Chart AI', 'chart-ai-waterfall-chart-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-helm-chart-generators' AND level = 3 LIMIT 1), 'Chart AI: Radar Chart AI', 'chart-ai-radar-chart-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-helm-chart-generators' AND level = 3 LIMIT 1), 'Chart AI: Funnel Chart AI', 'chart-ai-funnel-chart-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-helm-chart-generators' AND level = 3 LIMIT 1), 'Chart AI: Gauge Chart AI', 'chart-ai-gauge-chart-ai', 100),
((SELECT id FROM categories WHERE slug = 'ai-helm-chart-generators' AND level = 3 LIMIT 1), 'Mystical & Spiritual AI: Astrology Chart AI', 'mystical-spiritual-ai-astrology-chart-ai', 110),
((SELECT id FROM categories WHERE slug = 'ai-helm-chart-generators' AND level = 3 LIMIT 1), 'Esoteric AI: Birth Chart Calculator', 'esoteric-ai-birth-chart-calculator', 120);

-- AI Help Center Authoring (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-help-center-authoring' AND level = 3 LIMIT 1), 'Help Desk AI: Ticket Auto-Resolution', 'help-desk-ai-ticket-auto-resolution', 10),
((SELECT id FROM categories WHERE slug = 'ai-help-center-authoring' AND level = 3 LIMIT 1), 'Help Desk AI: Ticket Routing AI', 'help-desk-ai-ticket-routing-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-help-center-authoring' AND level = 3 LIMIT 1), 'Help Desk AI: Sentiment-Based Priority', 'help-desk-ai-sentiment-based-priority', 30),
((SELECT id FROM categories WHERE slug = 'ai-help-center-authoring' AND level = 3 LIMIT 1), 'Help Desk AI: Knowledge Base AI', 'help-desk-ai-knowledge-base-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-help-center-authoring' AND level = 3 LIMIT 1), 'Help Desk AI: SLA Prediction', 'help-desk-ai-sla-prediction', 50),
((SELECT id FROM categories WHERE slug = 'ai-help-center-authoring' AND level = 3 LIMIT 1), 'Help Desk AI: Agent Assist AI', 'help-desk-ai-agent-assist-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-help-center-authoring' AND level = 3 LIMIT 1), 'Help Desk AI: Escalation Prediction', 'help-desk-ai-escalation-prediction', 70),
((SELECT id FROM categories WHERE slug = 'ai-help-center-authoring' AND level = 3 LIMIT 1), 'Help Desk AI: Customer History AI', 'help-desk-ai-customer-history-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-help-center-authoring' AND level = 3 LIMIT 1), 'Help Desk AI: Resolution Suggestion', 'help-desk-ai-resolution-suggestion', 90),
((SELECT id FROM categories WHERE slug = 'ai-help-center-authoring' AND level = 3 LIMIT 1), 'Help Desk AI: Quality Assurance AI', 'help-desk-ai-quality-assurance-ai', 100);

-- AI History Tutors (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-history-tutors' AND level = 3 LIMIT 1), 'Family History AI: Family Tree Builder AI', 'family-history-ai-family-tree-builder-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-history-tutors' AND level = 3 LIMIT 1), 'Family History AI: Ancestor Photo Restorer', 'family-history-ai-ancestor-photo-restorer', 20),
((SELECT id FROM categories WHERE slug = 'ai-history-tutors' AND level = 3 LIMIT 1), 'Family History AI: DNA Result Interpreter', 'family-history-ai-dna-result-interpreter', 30),
((SELECT id FROM categories WHERE slug = 'ai-history-tutors' AND level = 3 LIMIT 1), 'Family History AI: Historical Record Finder', 'family-history-ai-historical-record-finder', 40),
((SELECT id FROM categories WHERE slug = 'ai-history-tutors' AND level = 3 LIMIT 1), 'Family History AI: Heritage Recipe Finder', 'family-history-ai-heritage-recipe-finder', 50),
((SELECT id FROM categories WHERE slug = 'ai-history-tutors' AND level = 3 LIMIT 1), 'Family History AI: Migration Path Tracer', 'family-history-ai-migration-path-tracer', 60),
((SELECT id FROM categories WHERE slug = 'ai-history-tutors' AND level = 3 LIMIT 1), 'Family History AI: Surname Origin AI', 'family-history-ai-surname-origin-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-history-tutors' AND level = 3 LIMIT 1), 'Family History AI: Historical Photo Colorizer', 'family-history-ai-historical-photo-colorizer', 80),
((SELECT id FROM categories WHERE slug = 'ai-history-tutors' AND level = 3 LIMIT 1), 'Family History AI: Family Story Writer', 'family-history-ai-family-story-writer', 90),
((SELECT id FROM categories WHERE slug = 'ai-history-tutors' AND level = 3 LIMIT 1), 'Family History AI: Obituary Writer AI', 'family-history-ai-obituary-writer-ai', 100);

-- AI Home Renovation Planners (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-home-renovation-planners' AND level = 3 LIMIT 1), 'Home Management AI: Renovation Cost Estimator', 'home-management-ai-renovation-cost-estimator', 10);

-- AI Home Search Agents (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-home-search-agents' AND level = 3 LIMIT 1), 'Home Management AI: Property Tax Estimator', 'home-management-ai-property-tax-estimator', 10);

-- AI Home Value Estimators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-home-value-estimators' AND level = 3 LIMIT 1), 'Home Management AI: Home Value Estimator', 'home-management-ai-home-value-estimator', 10);

-- AI Horoscope Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-horoscope-generators' AND level = 3 LIMIT 1), 'Mystical & Spiritual AI: Horoscope Generator AI', 'mystical-spiritual-ai-horoscope-generator-ai', 10);

-- AI Hotel Deal Finders (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-hotel-deal-finders' AND level = 3 LIMIT 1), 'Hotel AI: Revenue Management AI', 'hotel-ai-revenue-management-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-hotel-deal-finders' AND level = 3 LIMIT 1), 'Hotel AI: Guest Experience AI', 'hotel-ai-guest-experience-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-hotel-deal-finders' AND level = 3 LIMIT 1), 'Hotel AI: Booking Optimization', 'hotel-ai-booking-optimization', 30),
((SELECT id FROM categories WHERE slug = 'ai-hotel-deal-finders' AND level = 3 LIMIT 1), 'Hotel AI: Concierge AI', 'hotel-ai-concierge-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-hotel-deal-finders' AND level = 3 LIMIT 1), 'Hotel AI: Menu Optimization', 'hotel-ai-menu-optimization', 50),
((SELECT id FROM categories WHERE slug = 'ai-hotel-deal-finders' AND level = 3 LIMIT 1), 'Hotel AI: Staff Scheduling AI', 'hotel-ai-staff-scheduling-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-hotel-deal-finders' AND level = 3 LIMIT 1), 'Hotel AI: Review Response AI', 'hotel-ai-review-response-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-hotel-deal-finders' AND level = 3 LIMIT 1), 'Hotel AI: Pricing AI Hotel', 'hotel-ai-pricing-ai-hotel', 80),
((SELECT id FROM categories WHERE slug = 'ai-hotel-deal-finders' AND level = 3 LIMIT 1), 'Hotel AI: Housekeeping AI', 'hotel-ai-housekeeping-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-hotel-deal-finders' AND level = 3 LIMIT 1), 'Hotel AI: Maintenance Prediction Hotel', 'hotel-ai-maintenance-prediction-hotel', 100);

-- AI Image-to-3D Object Tools (8 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-image-to-3d-object-tools' AND level = 3 LIMIT 1), '3D Generation: 3D Scene Builders', '3d-generation-3d-scene-builders', 10),
((SELECT id FROM categories WHERE slug = 'ai-image-to-3d-object-tools' AND level = 3 LIMIT 1), '3D Generation: Product 3D Render', '3d-generation-product-3d-render', 20),
((SELECT id FROM categories WHERE slug = 'ai-image-to-3d-object-tools' AND level = 3 LIMIT 1), '3D Generation: Architectural 3D', '3d-generation-architectural-3d', 30),
((SELECT id FROM categories WHERE slug = 'ai-image-to-3d-object-tools' AND level = 3 LIMIT 1), '3D Generation: 3D Printing Models', '3d-generation-3d-printing-models', 40),
((SELECT id FROM categories WHERE slug = 'ai-image-to-3d-object-tools' AND level = 3 LIMIT 1), '3D Generation: 3D Animation', '3d-generation-3d-animation', 50),
((SELECT id FROM categories WHERE slug = 'ai-image-to-3d-object-tools' AND level = 3 LIMIT 1), '3D Generation: Virtual Stage Design', '3d-generation-virtual-stage-design', 60),
((SELECT id FROM categories WHERE slug = 'ai-image-to-3d-object-tools' AND level = 3 LIMIT 1), '3D Generation: 3D Character Modeling', '3d-generation-3d-character-modeling', 70),
((SELECT id FROM categories WHERE slug = 'ai-image-to-3d-object-tools' AND level = 3 LIMIT 1), '3D Generation: Hologram Content', '3d-generation-hologram-content', 80);

-- AI Industry Trend Trackers (9 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-industry-trend-trackers' AND level = 3 LIMIT 1), 'Food Industry AI: Recipe Generation AI', 'food-industry-ai-recipe-generation-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-industry-trend-trackers' AND level = 3 LIMIT 1), 'Food Industry AI: Menu Optimization AI', 'food-industry-ai-menu-optimization-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-industry-trend-trackers' AND level = 3 LIMIT 1), 'Food Industry AI: Food Waste Reduction AI', 'food-industry-ai-food-waste-reduction-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-industry-trend-trackers' AND level = 3 LIMIT 1), 'Food Industry AI: Ingredient Substitution AI', 'food-industry-ai-ingredient-substitution-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-industry-trend-trackers' AND level = 3 LIMIT 1), 'Food Industry AI: Nutrition Analysis AI', 'food-industry-ai-nutrition-analysis-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-industry-trend-trackers' AND level = 3 LIMIT 1), 'Food Industry AI: Food Safety AI', 'food-industry-ai-food-safety-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-industry-trend-trackers' AND level = 3 LIMIT 1), 'Food Industry AI: Restaurant Analytics AI', 'food-industry-ai-restaurant-analytics-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-industry-trend-trackers' AND level = 3 LIMIT 1), 'Food Industry AI: Delivery Optimization AI Food', 'food-industry-ai-delivery-optimization-ai-food', 80),
((SELECT id FROM categories WHERE slug = 'ai-industry-trend-trackers' AND level = 3 LIMIT 1), 'Food Industry AI: Customer Preference AI Food', 'food-industry-ai-customer-preference-ai-food', 90);

-- AI Instagram Post Writers (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-instagram-post-writers' AND level = 3 LIMIT 1), 'Platform-Specific AI: Instagram Content AI', 'platform-specific-ai-instagram-content-ai', 10);

-- AI Insurance Claim Form Parsers (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-insurance-claim-form-parsers' AND level = 3 LIMIT 1), 'Insurance AI: Document Processing Insurance', 'insurance-ai-document-processing-insurance', 10);

-- AI Internal Tool Builders (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-internal-tool-builders' AND level = 3 LIMIT 1), 'No-Code Chatbot Platforms: Internal HR Bots', 'no-code-chatbot-platforms-internal-hr-bots', 10);

-- AI Interview Scheduling Bots (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-interview-scheduling-bots' AND level = 3 LIMIT 1), 'Recruiting AI: Interview Scheduling AI', 'recruiting-ai-interview-scheduling-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-interview-scheduling-bots' AND level = 3 LIMIT 1), 'Recruiting AI: Video Interview AI', 'recruiting-ai-video-interview-ai', 20);

-- AI Inventory Reorder Tools (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-inventory-reorder-tools' AND level = 3 LIMIT 1), 'Shopping AI: Inventory Forecasting', 'shopping-ai-inventory-forecasting', 10),
((SELECT id FROM categories WHERE slug = 'ai-inventory-reorder-tools' AND level = 3 LIMIT 1), 'Seller Tools AI: Inventory Alert AI', 'seller-tools-ai-inventory-alert-ai', 20);

-- AI Invoice to Accounting Tools (6 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-invoice-to-accounting-tools' AND level = 3 LIMIT 1), 'Accounting AI: Invoice Processing AI', 'accounting-ai-invoice-processing-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-invoice-to-accounting-tools' AND level = 3 LIMIT 1), 'Accounting AI: Reconciliation AI', 'accounting-ai-reconciliation-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-invoice-to-accounting-tools' AND level = 3 LIMIT 1), 'Accounting AI: Audit AI', 'accounting-ai-audit-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-invoice-to-accounting-tools' AND level = 3 LIMIT 1), 'Accounting AI: AP Automation', 'accounting-ai-ap-automation', 40),
((SELECT id FROM categories WHERE slug = 'ai-invoice-to-accounting-tools' AND level = 3 LIMIT 1), 'Accounting AI: AR Automation', 'accounting-ai-ar-automation', 50),
((SELECT id FROM categories WHERE slug = 'ai-invoice-to-accounting-tools' AND level = 3 LIMIT 1), 'Accounting AI: Cash Flow Prediction', 'accounting-ai-cash-flow-prediction', 60);

-- AI Job Search Agents (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-job-search-agents' AND level = 3 LIMIT 1), 'Job Hunting AI: Resume Builder AI', 'job-hunting-ai-resume-builder-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-job-search-agents' AND level = 3 LIMIT 1), 'Job Hunting AI: Cover Letter AI', 'job-hunting-ai-cover-letter-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-job-search-agents' AND level = 3 LIMIT 1), 'Job Hunting AI: LinkedIn Profile Optimizer', 'job-hunting-ai-linkedin-profile-optimizer', 30),
((SELECT id FROM categories WHERE slug = 'ai-job-search-agents' AND level = 3 LIMIT 1), 'Job Hunting AI: Job Match AI', 'job-hunting-ai-job-match-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-job-search-agents' AND level = 3 LIMIT 1), 'Job Hunting AI: Salary Negotiator AI', 'job-hunting-ai-salary-negotiator-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-job-search-agents' AND level = 3 LIMIT 1), 'Job Hunting AI: Interview Prep AI', 'job-hunting-ai-interview-prep-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-job-search-agents' AND level = 3 LIMIT 1), 'Job Hunting AI: Portfolio Builder AI', 'job-hunting-ai-portfolio-builder-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-job-search-agents' AND level = 3 LIMIT 1), 'Job Hunting AI: Career Path Advisor', 'job-hunting-ai-career-path-advisor', 80),
((SELECT id FROM categories WHERE slug = 'ai-job-search-agents' AND level = 3 LIMIT 1), 'Job Hunting AI: Networking Suggestion AI', 'job-hunting-ai-networking-suggestion-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-job-search-agents' AND level = 3 LIMIT 1), 'Job Hunting AI: Follow-Up Email AI Job', 'job-hunting-ai-follow-up-email-ai-job', 100);

-- AI Joke Generators (4 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-joke-generators' AND level = 3 LIMIT 1), 'Meme Creation AI: Meme Generator AI', 'meme-creation-ai-meme-generator-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-joke-generators' AND level = 3 LIMIT 1), 'Meme Creation AI: Meme Template Finder', 'meme-creation-ai-meme-template-finder', 20),
((SELECT id FROM categories WHERE slug = 'ai-joke-generators' AND level = 3 LIMIT 1), 'Meme Creation AI: Emoji Creator AI', 'meme-creation-ai-emoji-creator-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-joke-generators' AND level = 3 LIMIT 1), 'Meme Creation AI: Caricature AI', 'meme-creation-ai-caricature-ai', 40);

-- AI K-12 Math Tutors (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-k-12-math-tutors' AND level = 3 LIMIT 1), 'Teaching AI: AI Tutoring', 'teaching-ai-ai-tutoring', 10);

-- AI Lab Report Helpers (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-lab-report-helpers' AND level = 3 LIMIT 1), 'Academic Writing: Lab Report Helpers', 'academic-writing-lab-report-helpers', 10),
((SELECT id FROM categories WHERE slug = 'ai-lab-report-helpers' AND level = 3 LIMIT 1), 'EdTech Infrastructure: Virtual Lab AI', 'edtech-infrastructure-virtual-lab-ai', 20);

-- AI Landing Page Builders (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-landing-page-builders' AND level = 3 LIMIT 1), 'Copywriting: Landing Page Copy', 'copywriting-landing-page-copy', 10);

-- AI Language Conversation Partners (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-language-conversation-partners' AND level = 3 LIMIT 1), 'Teaching AI: Language Learning AI', 'teaching-ai-language-learning-ai', 10);

-- AI Legal Case Search (11 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-legal-case-search' AND level = 3 LIMIT 1), 'Semantic Search: Legal Search AI', 'semantic-search-legal-search-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-legal-case-search' AND level = 3 LIMIT 1), 'Legal Research AI: Case Law Search', 'legal-research-ai-case-law-search', 20),
((SELECT id FROM categories WHERE slug = 'ai-legal-case-search' AND level = 3 LIMIT 1), 'Legal Research AI: Statute Research AI', 'legal-research-ai-statute-research-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-legal-case-search' AND level = 3 LIMIT 1), 'Legal Research AI: Legal Brief Generator', 'legal-research-ai-legal-brief-generator', 40),
((SELECT id FROM categories WHERE slug = 'ai-legal-case-search' AND level = 3 LIMIT 1), 'Legal Research AI: Deposition Summary AI', 'legal-research-ai-deposition-summary-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-legal-case-search' AND level = 3 LIMIT 1), 'Legal Research AI: Patent Analysis AI', 'legal-research-ai-patent-analysis-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-legal-case-search' AND level = 3 LIMIT 1), 'Legal Research AI: Regulatory Compliance AI', 'legal-research-ai-regulatory-compliance-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-legal-case-search' AND level = 3 LIMIT 1), 'Legal Research AI: Legal Document Review', 'legal-research-ai-legal-document-review', 80),
((SELECT id FROM categories WHERE slug = 'ai-legal-case-search' AND level = 3 LIMIT 1), 'Legal Research AI: Litigation Prediction', 'legal-research-ai-litigation-prediction', 90),
((SELECT id FROM categories WHERE slug = 'ai-legal-case-search' AND level = 3 LIMIT 1), 'Legal Research AI: IP Portfolio Analysis', 'legal-research-ai-ip-portfolio-analysis', 100),
((SELECT id FROM categories WHERE slug = 'ai-legal-case-search' AND level = 3 LIMIT 1), 'Legal Research AI: Legal Billing AI', 'legal-research-ai-legal-billing-ai', 110);

-- AI Lesson Plan Builders for Teachers (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-lesson-plan-builders-for-teachers' AND level = 3 LIMIT 1), 'Teaching AI: Lesson Planning AI', 'teaching-ai-lesson-planning-ai', 10);

-- AI License Compliance Checkers (18 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-license-compliance-checkers' AND level = 3 LIMIT 1), 'Regulatory AI: Regulatory Monitoring AI', 'regulatory-ai-regulatory-monitoring-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-license-compliance-checkers' AND level = 3 LIMIT 1), 'Regulatory AI: Compliance Automation', 'regulatory-ai-compliance-automation', 20),
((SELECT id FROM categories WHERE slug = 'ai-license-compliance-checkers' AND level = 3 LIMIT 1), 'Regulatory AI: Audit AI Tools', 'regulatory-ai-audit-ai-tools', 30),
((SELECT id FROM categories WHERE slug = 'ai-license-compliance-checkers' AND level = 3 LIMIT 1), 'Regulatory AI: Risk Mapping AI', 'regulatory-ai-risk-mapping-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-license-compliance-checkers' AND level = 3 LIMIT 1), 'Regulatory AI: Incident Reporting AI', 'regulatory-ai-incident-reporting-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-license-compliance-checkers' AND level = 3 LIMIT 1), 'Regulatory AI: Training Compliance AI', 'regulatory-ai-training-compliance-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-license-compliance-checkers' AND level = 3 LIMIT 1), 'Regulatory AI: Change Management Compliance', 'regulatory-ai-change-management-compliance', 70),
((SELECT id FROM categories WHERE slug = 'ai-license-compliance-checkers' AND level = 3 LIMIT 1), 'Regulatory AI: Regulatory Filing AI', 'regulatory-ai-regulatory-filing-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-license-compliance-checkers' AND level = 3 LIMIT 1), 'Compliance AI: EU AI Act Compliance', 'compliance-ai-eu-ai-act-compliance', 90),
((SELECT id FROM categories WHERE slug = 'ai-license-compliance-checkers' AND level = 3 LIMIT 1), 'Compliance AI: NIST AI Framework', 'compliance-ai-nist-ai-framework', 100),
((SELECT id FROM categories WHERE slug = 'ai-license-compliance-checkers' AND level = 3 LIMIT 1), 'Compliance AI: FDA AI Regulation', 'compliance-ai-fda-ai-regulation', 110),
((SELECT id FROM categories WHERE slug = 'ai-license-compliance-checkers' AND level = 3 LIMIT 1), 'Compliance AI: Financial AI Compliance', 'compliance-ai-financial-ai-compliance', 120),
((SELECT id FROM categories WHERE slug = 'ai-license-compliance-checkers' AND level = 3 LIMIT 1), 'Compliance AI: Healthcare AI Compliance', 'compliance-ai-healthcare-ai-compliance', 130),
((SELECT id FROM categories WHERE slug = 'ai-license-compliance-checkers' AND level = 3 LIMIT 1), 'Compliance AI: Autonomous Vehicle AI Regulation', 'compliance-ai-autonomous-vehicle-ai-regulation', 140),
((SELECT id FROM categories WHERE slug = 'ai-license-compliance-checkers' AND level = 3 LIMIT 1), 'Compliance AI: Facial Recognition Policy', 'compliance-ai-facial-recognition-policy', 150),
((SELECT id FROM categories WHERE slug = 'ai-license-compliance-checkers' AND level = 3 LIMIT 1), 'Compliance AI: AI Procurement Policy', 'compliance-ai-ai-procurement-policy', 160),
((SELECT id FROM categories WHERE slug = 'ai-license-compliance-checkers' AND level = 3 LIMIT 1), 'Compliance AI: AI Impact Assessment', 'compliance-ai-ai-impact-assessment', 170),
((SELECT id FROM categories WHERE slug = 'ai-license-compliance-checkers' AND level = 3 LIMIT 1), 'Compliance AI: Algorithmic Audit', 'compliance-ai-algorithmic-audit', 180);

-- AI LinkedIn Post Writers (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-linkedin-post-writers' AND level = 3 LIMIT 1), 'Platform-Specific AI: LinkedIn Content AI', 'platform-specific-ai-linkedin-content-ai', 10);

-- AI Listing Photo Enhancers (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-listing-photo-enhancers' AND level = 3 LIMIT 1), 'Listing & Catalog AI: Product Photo Enhancement', 'listing-catalog-ai-product-photo-enhancement', 10);

-- AI Live Chat Copilots (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-live-chat-copilots' AND level = 3 LIMIT 1), 'Conversational Support: AI Live Chat', 'conversational-support-ai-live-chat', 10);

-- AI Live Wallpaper Video Generators (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-live-wallpaper-video-generators' AND level = 3 LIMIT 1), 'Live Streaming AI: Stream Overlay AI', 'live-streaming-ai-stream-overlay-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-live-wallpaper-video-generators' AND level = 3 LIMIT 1), 'Live Streaming AI: Real-Time Translation Overlay', 'live-streaming-ai-real-time-translation-overlay', 20),
((SELECT id FROM categories WHERE slug = 'ai-live-wallpaper-video-generators' AND level = 3 LIMIT 1), 'Live Streaming AI: Chat Moderation AI', 'live-streaming-ai-chat-moderation-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-live-wallpaper-video-generators' AND level = 3 LIMIT 1), 'Live Streaming AI: Stream Highlight Clipper', 'live-streaming-ai-stream-highlight-clipper', 40),
((SELECT id FROM categories WHERE slug = 'ai-live-wallpaper-video-generators' AND level = 3 LIMIT 1), 'Live Streaming AI: Virtual Background AI', 'live-streaming-ai-virtual-background-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-live-wallpaper-video-generators' AND level = 3 LIMIT 1), 'Live Streaming AI: Co-Host AI', 'live-streaming-ai-co-host-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-live-wallpaper-video-generators' AND level = 3 LIMIT 1), 'Live Streaming AI: Stream Analytics AI', 'live-streaming-ai-stream-analytics-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-live-wallpaper-video-generators' AND level = 3 LIMIT 1), 'Live Streaming AI: Donation Alert AI', 'live-streaming-ai-donation-alert-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-live-wallpaper-video-generators' AND level = 3 LIMIT 1), 'Live Streaming AI: Music Request AI', 'live-streaming-ai-music-request-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-live-wallpaper-video-generators' AND level = 3 LIMIT 1), 'Live Streaming AI: Game Stats Overlay AI', 'live-streaming-ai-game-stats-overlay-ai', 100);

-- AI Lo-Fi Beat Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-lo-fi-beat-generators' AND level = 3 LIMIT 1), 'Music Generation: Lo-Fi Generator', 'music-generation-lo-fi-generator', 10);

-- AI Long-Distance Relationship Helpers (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-long-distance-relationship-helpers' AND level = 3 LIMIT 1), 'Dating & Social: Long-Distance Relationship AI', 'dating-social-long-distance-relationship-ai', 10);

-- AI Loop Video Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-loop-video-generators' AND level = 3 LIMIT 1), 'Video Effects AI: Video Loop Creator', 'video-effects-ai-video-loop-creator', 10);

-- AI Macro Tracking Coaches (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-macro-tracking-coaches' AND level = 3 LIMIT 1), 'Fitness AI: Macro Calculator AI', 'fitness-ai-macro-calculator-ai', 10);

-- AI Magazine Layout Designers (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-magazine-layout-designers' AND level = 3 LIMIT 1), 'UI/UX AI: Layout Generator', 'ui-ux-ai-layout-generator', 10);

-- AI Marketing Mix Modeling (4 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-marketing-mix-modeling' AND level = 3 LIMIT 1), 'Content Marketing AI: Competitor Content Analysis', 'content-marketing-ai-competitor-content-analysis', 10),
((SELECT id FROM categories WHERE slug = 'ai-marketing-mix-modeling' AND level = 3 LIMIT 1), 'Advertising AI: Audience Targeting AI', 'advertising-ai-audience-targeting-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-marketing-mix-modeling' AND level = 3 LIMIT 1), 'Advertising AI: Retargeting AI', 'advertising-ai-retargeting-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-marketing-mix-modeling' AND level = 3 LIMIT 1), 'Advertising AI: Lookalike Audience AI', 'advertising-ai-lookalike-audience-ai', 40);

-- AI Marketing Persona Builders (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-marketing-persona-builders' AND level = 3 LIMIT 1), 'AI Personas: Fictional Persona', 'ai-personas-fictional-persona', 10);

-- AI MCP Server Builders (6 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-mcp-server-builders' AND level = 3 LIMIT 1), 'MCP & Integrations: MCP Server Builder', 'mcp-integrations-mcp-server-builder', 10),
((SELECT id FROM categories WHERE slug = 'ai-mcp-server-builders' AND level = 3 LIMIT 1), 'MCP & Integrations: MCP Client SDK', 'mcp-integrations-mcp-client-sdk', 20),
((SELECT id FROM categories WHERE slug = 'ai-mcp-server-builders' AND level = 3 LIMIT 1), 'MCP & Integrations: Tool Plugin Development', 'mcp-integrations-tool-plugin-development', 30),
((SELECT id FROM categories WHERE slug = 'ai-mcp-server-builders' AND level = 3 LIMIT 1), 'MCP & Integrations: AI Extension Development', 'mcp-integrations-ai-extension-development', 40),
((SELECT id FROM categories WHERE slug = 'ai-mcp-server-builders' AND level = 3 LIMIT 1), 'MCP & Integrations: AI Middleware', 'mcp-integrations-ai-middleware', 50),
((SELECT id FROM categories WHERE slug = 'ai-mcp-server-builders' AND level = 3 LIMIT 1), 'MCP & Integrations: Function Calling Framework', 'mcp-integrations-function-calling-framework', 60);

-- AI Meditation Music Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-meditation-music-generators' AND level = 3 LIMIT 1), 'Music Generation: Meditation Music AI', 'music-generation-meditation-music-ai', 10);

-- AI Meeting Bots for Microsoft Teams (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-meeting-bots-for-microsoft-teams' AND level = 3 LIMIT 1), 'Multi-Channel Bots: Microsoft Teams Bots', 'multi-channel-bots-microsoft-teams-bots', 10);

-- AI Meeting Sentiment Analysis (4 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-meeting-sentiment-analysis' AND level = 3 LIMIT 1), 'Investment AI: Fund Analysis AI', 'investment-ai-fund-analysis-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-meeting-sentiment-analysis' AND level = 3 LIMIT 1), 'DevOps AI: Log Analysis AI', 'devops-ai-log-analysis-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-meeting-sentiment-analysis' AND level = 3 LIMIT 1), 'Location AI: Foot Traffic Analysis', 'location-ai-foot-traffic-analysis', 30),
((SELECT id FROM categories WHERE slug = 'ai-meeting-sentiment-analysis' AND level = 3 LIMIT 1), 'Location AI: Trade Area Analysis', 'location-ai-trade-area-analysis', 40);

-- AI Mental Health Chatbots (7 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-mental-health-chatbots' AND level = 3 LIMIT 1), 'Mental Wellness AI: Mood Tracker AI', 'mental-wellness-ai-mood-tracker-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-mental-health-chatbots' AND level = 3 LIMIT 1), 'Mental Wellness AI: Breathing Exercise AI', 'mental-wellness-ai-breathing-exercise-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-mental-health-chatbots' AND level = 3 LIMIT 1), 'Mental Wellness AI: Journaling Prompt AI', 'mental-wellness-ai-journaling-prompt-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-mental-health-chatbots' AND level = 3 LIMIT 1), 'Mental Wellness AI: CBT Exercise AI', 'mental-wellness-ai-cbt-exercise-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-mental-health-chatbots' AND level = 3 LIMIT 1), 'Mental Wellness AI: Mindfulness Timer AI', 'mental-wellness-ai-mindfulness-timer-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-mental-health-chatbots' AND level = 3 LIMIT 1), 'Mental Wellness AI: Gratitude Journal AI', 'mental-wellness-ai-gratitude-journal-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-mental-health-chatbots' AND level = 3 LIMIT 1), 'Mental Wellness AI: Emotional Intelligence AI', 'mental-wellness-ai-emotional-intelligence-ai', 70);

-- AI Migration Assistants (e.g. Java → Kotlin) (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-migration-assistants-eg-java-kotlin' AND level = 3 LIMIT 1), 'Code Review & Debug: Migration Assistant', 'code-review-debug-migration-assistant', 10);

-- AI Mock Data Generators (23 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-mock-data-generators' AND level = 3 LIMIT 1), 'Data Visualization AI: Chart Generator AI', 'data-visualization-ai-chart-generator-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-mock-data-generators' AND level = 3 LIMIT 1), 'Data Visualization AI: Report Designer AI', 'data-visualization-ai-report-designer-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-mock-data-generators' AND level = 3 LIMIT 1), 'Data Visualization AI: Data Storytelling AI', 'data-visualization-ai-data-storytelling-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-mock-data-generators' AND level = 3 LIMIT 1), 'Data Visualization AI: Real-Time Data Viz', 'data-visualization-ai-real-time-data-viz', 40),
((SELECT id FROM categories WHERE slug = 'ai-mock-data-generators' AND level = 3 LIMIT 1), 'Data Visualization AI: Geographic Data Viz', 'data-visualization-ai-geographic-data-viz', 50),
((SELECT id FROM categories WHERE slug = 'ai-mock-data-generators' AND level = 3 LIMIT 1), 'Data Visualization AI: Network Graph AI', 'data-visualization-ai-network-graph-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-mock-data-generators' AND level = 3 LIMIT 1), 'Data Visualization AI: Timeline Viz AI', 'data-visualization-ai-timeline-viz-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-mock-data-generators' AND level = 3 LIMIT 1), 'Data Visualization AI: Heatmap Generator', 'data-visualization-ai-heatmap-generator', 80),
((SELECT id FROM categories WHERE slug = 'ai-mock-data-generators' AND level = 3 LIMIT 1), 'Data Visualization AI: Sankey Diagram AI', 'data-visualization-ai-sankey-diagram-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-mock-data-generators' AND level = 3 LIMIT 1), 'Investment AI: Alternative Data AI', 'investment-ai-alternative-data-ai', 100),
((SELECT id FROM categories WHERE slug = 'ai-mock-data-generators' AND level = 3 LIMIT 1), 'Data Enrichment AI: Company Data Enrichment', 'data-enrichment-ai-company-data-enrichment', 110),
((SELECT id FROM categories WHERE slug = 'ai-mock-data-generators' AND level = 3 LIMIT 1), 'Data Enrichment AI: Contact Enrichment', 'data-enrichment-ai-contact-enrichment', 120),
((SELECT id FROM categories WHERE slug = 'ai-mock-data-generators' AND level = 3 LIMIT 1), 'Data Enrichment AI: Firmographic Data', 'data-enrichment-ai-firmographic-data', 130),
((SELECT id FROM categories WHERE slug = 'ai-mock-data-generators' AND level = 3 LIMIT 1), 'Data Enrichment AI: Technographic Data', 'data-enrichment-ai-technographic-data', 140),
((SELECT id FROM categories WHERE slug = 'ai-mock-data-generators' AND level = 3 LIMIT 1), 'Data Enrichment AI: Intent Data Provider', 'data-enrichment-ai-intent-data-provider', 150),
((SELECT id FROM categories WHERE slug = 'ai-mock-data-generators' AND level = 3 LIMIT 1), 'Data Enrichment AI: Social Profile Enrichment', 'data-enrichment-ai-social-profile-enrichment', 160),
((SELECT id FROM categories WHERE slug = 'ai-mock-data-generators' AND level = 3 LIMIT 1), 'Data Enrichment AI: Email Finder AI', 'data-enrichment-ai-email-finder-ai', 170),
((SELECT id FROM categories WHERE slug = 'ai-mock-data-generators' AND level = 3 LIMIT 1), 'Data Enrichment AI: Phone Number Finder', 'data-enrichment-ai-phone-number-finder', 180),
((SELECT id FROM categories WHERE slug = 'ai-mock-data-generators' AND level = 3 LIMIT 1), 'Data Enrichment AI: Job Title Enrichment', 'data-enrichment-ai-job-title-enrichment', 190),
((SELECT id FROM categories WHERE slug = 'ai-mock-data-generators' AND level = 3 LIMIT 1), 'Data Enrichment AI: Revenue Estimator AI', 'data-enrichment-ai-revenue-estimator-ai', 200);
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-mock-data-generators' AND level = 3 LIMIT 1), 'Location AI: Geospatial Data AI', 'location-ai-geospatial-data-ai', 210),
((SELECT id FROM categories WHERE slug = 'ai-mock-data-generators' AND level = 3 LIMIT 1), 'Location AI: Weather Data AI', 'location-ai-weather-data-ai', 220),
((SELECT id FROM categories WHERE slug = 'ai-mock-data-generators' AND level = 3 LIMIT 1), 'Location AI: Environmental Monitoring Data', 'location-ai-environmental-monitoring-data', 230);

-- AI Model Card Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-model-card-generators' AND level = 3 LIMIT 1), 'AI Governance: Model Audit Tools', 'ai-governance-model-audit-tools', 10);

-- AI Model Try-On Tools (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-model-try-on-tools' AND level = 3 LIMIT 1), 'E-Commerce Operations: Virtual Try-On', 'e-commerce-operations-virtual-try-on', 10);

-- AI Multi-City Itinerary Builders (8 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-multi-city-itinerary-builders' AND level = 3 LIMIT 1), 'Multi-Channel Bots: WhatsApp Bots', 'multi-channel-bots-whatsapp-bots', 10),
((SELECT id FROM categories WHERE slug = 'ai-multi-city-itinerary-builders' AND level = 3 LIMIT 1), 'Multi-Channel Bots: Telegram Bots', 'multi-channel-bots-telegram-bots', 20),
((SELECT id FROM categories WHERE slug = 'ai-multi-city-itinerary-builders' AND level = 3 LIMIT 1), 'Multi-Channel Bots: Facebook Messenger Bots', 'multi-channel-bots-facebook-messenger-bots', 30),
((SELECT id FROM categories WHERE slug = 'ai-multi-city-itinerary-builders' AND level = 3 LIMIT 1), 'Multi-Channel Bots: Instagram DM Bots', 'multi-channel-bots-instagram-dm-bots', 40),
((SELECT id FROM categories WHERE slug = 'ai-multi-city-itinerary-builders' AND level = 3 LIMIT 1), 'Multi-Channel Bots: Slack Bots', 'multi-channel-bots-slack-bots', 50),
((SELECT id FROM categories WHERE slug = 'ai-multi-city-itinerary-builders' AND level = 3 LIMIT 1), 'Multi-Channel Bots: Discord Bots', 'multi-channel-bots-discord-bots', 60),
((SELECT id FROM categories WHERE slug = 'ai-multi-city-itinerary-builders' AND level = 3 LIMIT 1), 'Multi-Channel Bots: WeChat Bots', 'multi-channel-bots-wechat-bots', 70),
((SELECT id FROM categories WHERE slug = 'ai-multi-city-itinerary-builders' AND level = 3 LIMIT 1), 'Multi-Channel Bots: Line Bots', 'multi-channel-bots-line-bots', 80);

-- AI Multi-Source Research Agents (9 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-multi-source-research-agents' AND level = 3 LIMIT 1), 'AI Research Tools: Literature Review AI', 'ai-research-tools-literature-review-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-multi-source-research-agents' AND level = 3 LIMIT 1), 'AI Research Tools: Patent Search AI', 'ai-research-tools-patent-search-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-multi-source-research-agents' AND level = 3 LIMIT 1), 'AI Research Tools: Market Research AI', 'ai-research-tools-market-research-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-multi-source-research-agents' AND level = 3 LIMIT 1), 'AI Research Tools: Dataset Discovery', 'ai-research-tools-dataset-discovery', 40),
((SELECT id FROM categories WHERE slug = 'ai-multi-source-research-agents' AND level = 3 LIMIT 1), 'AI Research Tools: Trend Analysis AI', 'ai-research-tools-trend-analysis-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-multi-source-research-agents' AND level = 3 LIMIT 1), 'AI Research Tools: Citation Network AI', 'ai-research-tools-citation-network-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-multi-source-research-agents' AND level = 3 LIMIT 1), 'AI Research Tools: Expert Finder AI', 'ai-research-tools-expert-finder-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-multi-source-research-agents' AND level = 3 LIMIT 1), 'AI Research Tools: Grant Opportunity Finder', 'ai-research-tools-grant-opportunity-finder', 80),
((SELECT id FROM categories WHERE slug = 'ai-multi-source-research-agents' AND level = 3 LIMIT 1), 'Keyboard & Input AI: Multi-Language Input AI', 'keyboard-input-ai-multi-language-input-ai', 90);

-- AI Multilingual Support Bots (8 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-multilingual-support-bots' AND level = 3 LIMIT 1), 'Conversational Support: AI Phone Support', 'conversational-support-ai-phone-support', 10),
((SELECT id FROM categories WHERE slug = 'ai-multilingual-support-bots' AND level = 3 LIMIT 1), 'Conversational Support: AI SMS Support', 'conversational-support-ai-sms-support', 20),
((SELECT id FROM categories WHERE slug = 'ai-multilingual-support-bots' AND level = 3 LIMIT 1), 'Conversational Support: AI Social Media Support', 'conversational-support-ai-social-media-support', 30),
((SELECT id FROM categories WHERE slug = 'ai-multilingual-support-bots' AND level = 3 LIMIT 1), 'Conversational Support: AI WhatsApp Support', 'conversational-support-ai-whatsapp-support', 40),
((SELECT id FROM categories WHERE slug = 'ai-multilingual-support-bots' AND level = 3 LIMIT 1), 'Conversational Support: Video Support AI', 'conversational-support-video-support-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-multilingual-support-bots' AND level = 3 LIMIT 1), 'Conversational Support: Screen Share AI', 'conversational-support-screen-share-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-multilingual-support-bots' AND level = 3 LIMIT 1), 'Conversational Support: Co-Browsing AI', 'conversational-support-co-browsing-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-multilingual-support-bots' AND level = 3 LIMIT 1), 'Conversational Support: Proactive Support AI', 'conversational-support-proactive-support-ai', 80);

-- AI Natural Language SQL Tools (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-natural-language-sql-tools' AND level = 3 LIMIT 1), 'BI AI: Natural Language Query', 'bi-ai-natural-language-query', 10);

-- AI Nature Sound Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-nature-sound-generators' AND level = 3 LIMIT 1), 'Sound Design: Nature Sound AI', 'sound-design-nature-sound-ai', 10);

-- AI NPC Dialogue Engines (4 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-npc-dialogue-engines' AND level = 3 LIMIT 1), 'AI Personas: Philosophical Dialogue AI', 'ai-personas-philosophical-dialogue-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-npc-dialogue-engines' AND level = 3 LIMIT 1), 'AI Personality Engines: AI NPC Generator', 'ai-personality-engines-ai-npc-generator', 20),
((SELECT id FROM categories WHERE slug = 'ai-npc-dialogue-engines' AND level = 3 LIMIT 1), 'AI Personality Engines: AI Dialogue Writer', 'ai-personality-engines-ai-dialogue-writer', 30),
((SELECT id FROM categories WHERE slug = 'ai-npc-dialogue-engines' AND level = 3 LIMIT 1), 'Game Play AI: NPC Dialogue AI', 'game-play-ai-npc-dialogue-ai', 40);

-- AI Objection Handling Trainers (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-objection-handling-trainers' AND level = 3 LIMIT 1), 'Sales Engagement: Objection Handling AI', 'sales-engagement-objection-handling-ai', 10);

-- AI On-Chain Analytics (19 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-on-chain-analytics' AND level = 3 LIMIT 1), 'Supply Chain AI: Demand Planning AI', 'supply-chain-ai-demand-planning-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-on-chain-analytics' AND level = 3 LIMIT 1), 'Supply Chain AI: Inventory Optimization', 'supply-chain-ai-inventory-optimization', 20),
((SELECT id FROM categories WHERE slug = 'ai-on-chain-analytics' AND level = 3 LIMIT 1), 'Supply Chain AI: Supplier Risk AI', 'supply-chain-ai-supplier-risk-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-on-chain-analytics' AND level = 3 LIMIT 1), 'Supply Chain AI: Logistics Routing AI', 'supply-chain-ai-logistics-routing-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-on-chain-analytics' AND level = 3 LIMIT 1), 'Supply Chain AI: Warehouse AI', 'supply-chain-ai-warehouse-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-on-chain-analytics' AND level = 3 LIMIT 1), 'Supply Chain AI: Procurement AI', 'supply-chain-ai-procurement-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-on-chain-analytics' AND level = 3 LIMIT 1), 'Supply Chain AI: Quality Prediction', 'supply-chain-ai-quality-prediction', 70),
((SELECT id FROM categories WHERE slug = 'ai-on-chain-analytics' AND level = 3 LIMIT 1), 'Supply Chain AI: Supply Chain Visibility', 'supply-chain-ai-supply-chain-visibility', 80),
((SELECT id FROM categories WHERE slug = 'ai-on-chain-analytics' AND level = 3 LIMIT 1), 'Supply Chain AI: Carbon Footprint AI', 'supply-chain-ai-carbon-footprint-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-on-chain-analytics' AND level = 3 LIMIT 1), 'Supply Chain AI: Trade Compliance AI', 'supply-chain-ai-trade-compliance-ai', 100),
((SELECT id FROM categories WHERE slug = 'ai-on-chain-analytics' AND level = 3 LIMIT 1), 'Supply Chain AI: Shipment Tracking AI', 'supply-chain-ai-shipment-tracking-ai', 110),
((SELECT id FROM categories WHERE slug = 'ai-on-chain-analytics' AND level = 3 LIMIT 1), 'Supply Chain AI: Demand Forecasting Logistics', 'supply-chain-ai-demand-forecasting-logistics', 120),
((SELECT id FROM categories WHERE slug = 'ai-on-chain-analytics' AND level = 3 LIMIT 1), 'Supply Chain AI: Warehouse Robotics', 'supply-chain-ai-warehouse-robotics', 130),
((SELECT id FROM categories WHERE slug = 'ai-on-chain-analytics' AND level = 3 LIMIT 1), 'Supply Chain AI: Fleet Telematics AI', 'supply-chain-ai-fleet-telematics-ai', 140),
((SELECT id FROM categories WHERE slug = 'ai-on-chain-analytics' AND level = 3 LIMIT 1), 'Supply Chain AI: Customs AI', 'supply-chain-ai-customs-ai', 150),
((SELECT id FROM categories WHERE slug = 'ai-on-chain-analytics' AND level = 3 LIMIT 1), 'Supply Chain AI: Cross-Border AI', 'supply-chain-ai-cross-border-ai', 160),
((SELECT id FROM categories WHERE slug = 'ai-on-chain-analytics' AND level = 3 LIMIT 1), 'Supply Chain AI: Cold Chain AI', 'supply-chain-ai-cold-chain-ai', 170),
((SELECT id FROM categories WHERE slug = 'ai-on-chain-analytics' AND level = 3 LIMIT 1), 'Supply Chain AI: Returns Optimization', 'supply-chain-ai-returns-optimization', 180),
((SELECT id FROM categories WHERE slug = 'ai-on-chain-analytics' AND level = 3 LIMIT 1), 'Supply Chain AI: Last Mile AI', 'supply-chain-ai-last-mile-ai', 190);

-- AI Onboarding Doc Generators (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-onboarding-doc-generators' AND level = 3 LIMIT 1), 'Doc AI: API Doc Generator', 'doc-ai-api-doc-generator', 10),
((SELECT id FROM categories WHERE slug = 'ai-onboarding-doc-generators' AND level = 3 LIMIT 1), 'Doc AI: Code Doc AI', 'doc-ai-code-doc-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-onboarding-doc-generators' AND level = 3 LIMIT 1), 'Doc AI: README Generator', 'doc-ai-readme-generator', 30),
((SELECT id FROM categories WHERE slug = 'ai-onboarding-doc-generators' AND level = 3 LIMIT 1), 'Doc AI: Changelog AI', 'doc-ai-changelog-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-onboarding-doc-generators' AND level = 3 LIMIT 1), 'Doc AI: SDK Doc AI', 'doc-ai-sdk-doc-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-onboarding-doc-generators' AND level = 3 LIMIT 1), 'Doc AI: Architecture Doc AI', 'doc-ai-architecture-doc-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-onboarding-doc-generators' AND level = 3 LIMIT 1), 'Doc AI: Decision Doc AI', 'doc-ai-decision-doc-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-onboarding-doc-generators' AND level = 3 LIMIT 1), 'Doc AI: Runbook Generator AI', 'doc-ai-runbook-generator-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-onboarding-doc-generators' AND level = 3 LIMIT 1), 'Doc AI: Technical Spec AI', 'doc-ai-technical-spec-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-onboarding-doc-generators' AND level = 3 LIMIT 1), 'Doc AI: User Guide AI', 'doc-ai-user-guide-ai', 100);

-- AI Pantry-Based Recipe Tools (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-pantry-based-recipe-tools' AND level = 3 LIMIT 1), 'Recipe & Meal AI: Pantry-Based Meal AI', 'recipe-meal-ai-pantry-based-meal-ai', 10);

-- AI Parent-Teacher Communication Tools (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-parent-teacher-communication-tools' AND level = 3 LIMIT 1), 'EdTech Infrastructure: Parent Communication AI', 'edtech-infrastructure-parent-communication-ai', 10);

-- AI Pathology Slide Analysis (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-pathology-slide-analysis' AND level = 3 LIMIT 1), 'Slide Generation: Pitch Deck AI', 'slide-generation-pitch-deck-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-pathology-slide-analysis' AND level = 3 LIMIT 1), 'Slide Generation: Sales Deck Creator', 'slide-generation-sales-deck-creator', 20),
((SELECT id FROM categories WHERE slug = 'ai-pathology-slide-analysis' AND level = 3 LIMIT 1), 'Slide Generation: Training Deck AI', 'slide-generation-training-deck-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-pathology-slide-analysis' AND level = 3 LIMIT 1), 'Slide Generation: Conference Slide AI', 'slide-generation-conference-slide-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-pathology-slide-analysis' AND level = 3 LIMIT 1), 'Slide Generation: Investor Deck AI', 'slide-generation-investor-deck-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-pathology-slide-analysis' AND level = 3 LIMIT 1), 'Slide Generation: Product Launch Deck', 'slide-generation-product-launch-deck', 60),
((SELECT id FROM categories WHERE slug = 'ai-pathology-slide-analysis' AND level = 3 LIMIT 1), 'Slide Generation: Quarterly Report Slides', 'slide-generation-quarterly-report-slides', 70),
((SELECT id FROM categories WHERE slug = 'ai-pathology-slide-analysis' AND level = 3 LIMIT 1), 'Slide Generation: Webinar Slides AI', 'slide-generation-webinar-slides-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-pathology-slide-analysis' AND level = 3 LIMIT 1), 'Slide Generation: Workshop Materials AI', 'slide-generation-workshop-materials-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-pathology-slide-analysis' AND level = 3 LIMIT 1), 'Slide Generation: Infographic Slides AI', 'slide-generation-infographic-slides-ai', 100);

-- AI Patient Intake Bots (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-patient-intake-bots' AND level = 3 LIMIT 1), 'Pharmaceutical AI: Patient Recruitment AI', 'pharmaceutical-ai-patient-recruitment-ai', 10);

-- AI PDF Q&A Chat (19 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-pdf-qa-chat' AND level = 3 LIMIT 1), 'PDF Processing AI: PDF Summarizer AI', 'pdf-processing-ai-pdf-summarizer-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-pdf-qa-chat' AND level = 3 LIMIT 1), 'PDF Processing AI: PDF to Editable Doc', 'pdf-processing-ai-pdf-to-editable-doc', 20),
((SELECT id FROM categories WHERE slug = 'ai-pdf-qa-chat' AND level = 3 LIMIT 1), 'PDF Processing AI: PDF Chat & Q&A', 'pdf-processing-ai-pdf-chat-q-a', 30),
((SELECT id FROM categories WHERE slug = 'ai-pdf-qa-chat' AND level = 3 LIMIT 1), 'PDF Processing AI: PDF Merger AI', 'pdf-processing-ai-pdf-merger-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-pdf-qa-chat' AND level = 3 LIMIT 1), 'PDF Processing AI: PDF Splitter AI', 'pdf-processing-ai-pdf-splitter-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-pdf-qa-chat' AND level = 3 LIMIT 1), 'PDF Processing AI: PDF Data Extractor', 'pdf-processing-ai-pdf-data-extractor', 60),
((SELECT id FROM categories WHERE slug = 'ai-pdf-qa-chat' AND level = 3 LIMIT 1), 'PDF Processing AI: PDF Form Filler AI', 'pdf-processing-ai-pdf-form-filler-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-pdf-qa-chat' AND level = 3 LIMIT 1), 'PDF Processing AI: PDF Compressor AI', 'pdf-processing-ai-pdf-compressor-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-pdf-qa-chat' AND level = 3 LIMIT 1), 'PDF Processing AI: PDF Annotator AI', 'pdf-processing-ai-pdf-annotator-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-pdf-qa-chat' AND level = 3 LIMIT 1), 'PDF Creation AI: Report to PDF AI', 'pdf-creation-ai-report-to-pdf-ai', 100),
((SELECT id FROM categories WHERE slug = 'ai-pdf-qa-chat' AND level = 3 LIMIT 1), 'PDF Creation AI: Invoice PDF Generator', 'pdf-creation-ai-invoice-pdf-generator', 110),
((SELECT id FROM categories WHERE slug = 'ai-pdf-qa-chat' AND level = 3 LIMIT 1), 'PDF Creation AI: Contract PDF AI', 'pdf-creation-ai-contract-pdf-ai', 120),
((SELECT id FROM categories WHERE slug = 'ai-pdf-qa-chat' AND level = 3 LIMIT 1), 'PDF Creation AI: Presentation to PDF', 'pdf-creation-ai-presentation-to-pdf', 130),
((SELECT id FROM categories WHERE slug = 'ai-pdf-qa-chat' AND level = 3 LIMIT 1), 'PDF Creation AI: Resume to PDF AI', 'pdf-creation-ai-resume-to-pdf-ai', 140),
((SELECT id FROM categories WHERE slug = 'ai-pdf-qa-chat' AND level = 3 LIMIT 1), 'PDF Creation AI: Proposal PDF Generator', 'pdf-creation-ai-proposal-pdf-generator', 150),
((SELECT id FROM categories WHERE slug = 'ai-pdf-qa-chat' AND level = 3 LIMIT 1), 'PDF Creation AI: Certificate PDF AI', 'pdf-creation-ai-certificate-pdf-ai', 160),
((SELECT id FROM categories WHERE slug = 'ai-pdf-qa-chat' AND level = 3 LIMIT 1), 'PDF Creation AI: Ebook PDF Creator', 'pdf-creation-ai-ebook-pdf-creator', 170),
((SELECT id FROM categories WHERE slug = 'ai-pdf-qa-chat' AND level = 3 LIMIT 1), 'PDF Creation AI: Brochure PDF AI', 'pdf-creation-ai-brochure-pdf-ai', 180),
((SELECT id FROM categories WHERE slug = 'ai-pdf-qa-chat' AND level = 3 LIMIT 1), 'PDF Creation AI: Portfolio PDF Generator', 'pdf-creation-ai-portfolio-pdf-generator', 190);

-- AI PDF Translator (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-pdf-translator' AND level = 3 LIMIT 1), 'PDF Processing AI: PDF Translator', 'pdf-processing-ai-pdf-translator', 10);

-- AI Performance Profilers (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-performance-profilers' AND level = 3 LIMIT 1), 'PM AI: Team Performance AI', 'pm-ai-team-performance-ai', 10);

-- AI Performance Review Drafters (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-performance-review-drafters' AND level = 3 LIMIT 1), 'Code Review & Debug: Performance Optimizer', 'code-review-debug-performance-optimizer', 10);

-- AI Personal Budgeting Coaches (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-personal-budgeting-coaches' AND level = 3 LIMIT 1), 'Personal AI: Finance Advisor AI', 'personal-ai-finance-advisor-ai', 10);

-- AI Personalized Trip Planners (9 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-personalized-trip-planners' AND level = 3 LIMIT 1), 'Trip Planning AI: Itinerary Generator AI', 'trip-planning-ai-itinerary-generator-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-personalized-trip-planners' AND level = 3 LIMIT 1), 'Trip Planning AI: Flight Price Predictor', 'trip-planning-ai-flight-price-predictor', 20),
((SELECT id FROM categories WHERE slug = 'ai-personalized-trip-planners' AND level = 3 LIMIT 1), 'Trip Planning AI: Hotel Finder AI', 'trip-planning-ai-hotel-finder-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-personalized-trip-planners' AND level = 3 LIMIT 1), 'Trip Planning AI: Restaurant Discovery AI', 'trip-planning-ai-restaurant-discovery-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-personalized-trip-planners' AND level = 3 LIMIT 1), 'Trip Planning AI: Activity Recommender', 'trip-planning-ai-activity-recommender', 50),
((SELECT id FROM categories WHERE slug = 'ai-personalized-trip-planners' AND level = 3 LIMIT 1), 'Trip Planning AI: Packing List Generator', 'trip-planning-ai-packing-list-generator', 60),
((SELECT id FROM categories WHERE slug = 'ai-personalized-trip-planners' AND level = 3 LIMIT 1), 'Trip Planning AI: Budget Travel Planner', 'trip-planning-ai-budget-travel-planner', 70),
((SELECT id FROM categories WHERE slug = 'ai-personalized-trip-planners' AND level = 3 LIMIT 1), 'Trip Planning AI: Solo Travel AI', 'trip-planning-ai-solo-travel-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-personalized-trip-planners' AND level = 3 LIMIT 1), 'Trip Planning AI: Adventure Trip AI', 'trip-planning-ai-adventure-trip-ai', 90);

-- AI Pet Name Generators (11 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-pet-name-generators' AND level = 3 LIMIT 1), 'Pet Care AI: Pet Name Generator', 'pet-care-ai-pet-name-generator', 10),
((SELECT id FROM categories WHERE slug = 'ai-pet-name-generators' AND level = 3 LIMIT 1), 'Naming AI: Business Name Generator', 'naming-ai-business-name-generator', 20),
((SELECT id FROM categories WHERE slug = 'ai-pet-name-generators' AND level = 3 LIMIT 1), 'Naming AI: App Name Generator', 'naming-ai-app-name-generator', 30),
((SELECT id FROM categories WHERE slug = 'ai-pet-name-generators' AND level = 3 LIMIT 1), 'Naming AI: Podcast Name AI', 'naming-ai-podcast-name-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-pet-name-generators' AND level = 3 LIMIT 1), 'Personal Name AI: Pet Name Generator', 'personal-name-ai-pet-name-generator', 50),
((SELECT id FROM categories WHERE slug = 'ai-pet-name-generators' AND level = 3 LIMIT 1), 'Personal Name AI: Gamertag Generator', 'personal-name-ai-gamertag-generator', 60),
((SELECT id FROM categories WHERE slug = 'ai-pet-name-generators' AND level = 3 LIMIT 1), 'Personal Name AI: Username Generator', 'personal-name-ai-username-generator', 70),
((SELECT id FROM categories WHERE slug = 'ai-pet-name-generators' AND level = 3 LIMIT 1), 'Personal Name AI: Pen Name Generator', 'personal-name-ai-pen-name-generator', 80),
((SELECT id FROM categories WHERE slug = 'ai-pet-name-generators' AND level = 3 LIMIT 1), 'Personal Name AI: Stage Name AI', 'personal-name-ai-stage-name-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-pet-name-generators' AND level = 3 LIMIT 1), 'Personal Name AI: Superhero Name AI', 'personal-name-ai-superhero-name-ai', 100),
((SELECT id FROM categories WHERE slug = 'ai-pet-name-generators' AND level = 3 LIMIT 1), 'Personal Name AI: Couple Name Generator', 'personal-name-ai-couple-name-generator', 110);

-- AI Pinterest Pin Designers (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-pinterest-pin-designers' AND level = 3 LIMIT 1), 'Platform-Specific AI: Pinterest Content AI', 'platform-specific-ai-pinterest-content-ai', 10);

-- AI Pitch Deck Financial Slides (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-pitch-deck-financial-slides' AND level = 3 LIMIT 1), 'Pitch & Demo AI: Investor Deck AI', 'pitch-demo-ai-investor-deck-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-pitch-deck-financial-slides' AND level = 3 LIMIT 1), 'Pitch & Demo AI: Financial Projection AI', 'pitch-demo-ai-financial-projection-ai', 20);

-- AI Plagiarism Risk Checkers (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-plagiarism-risk-checkers' AND level = 3 LIMIT 1), 'Grammar & Editing: Plagiarism Checkers', 'grammar-editing-plagiarism-checkers', 10),
((SELECT id FROM categories WHERE slug = 'ai-plagiarism-risk-checkers' AND level = 3 LIMIT 1), 'EdTech Infrastructure: Plagiarism Detection', 'edtech-infrastructure-plagiarism-detection', 20);

-- AI Podcast-to-Clips Tools (11 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-podcast-to-clips-tools' AND level = 3 LIMIT 1), 'AI Shorts & Clips: YouTube Shorts Creator', 'ai-shorts-clips-youtube-shorts-creator', 10),
((SELECT id FROM categories WHERE slug = 'ai-podcast-to-clips-tools' AND level = 3 LIMIT 1), 'AI Shorts & Clips: TikTok Clip Maker', 'ai-shorts-clips-tiktok-clip-maker', 20),
((SELECT id FROM categories WHERE slug = 'ai-podcast-to-clips-tools' AND level = 3 LIMIT 1), 'AI Shorts & Clips: Instagram Reels AI', 'ai-shorts-clips-instagram-reels-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-podcast-to-clips-tools' AND level = 3 LIMIT 1), 'AI Shorts & Clips: Podcast Clip Extractor', 'ai-shorts-clips-podcast-clip-extractor', 40),
((SELECT id FROM categories WHERE slug = 'ai-podcast-to-clips-tools' AND level = 3 LIMIT 1), 'AI Shorts & Clips: Highlight Reel Maker', 'ai-shorts-clips-highlight-reel-maker', 50),
((SELECT id FROM categories WHERE slug = 'ai-podcast-to-clips-tools' AND level = 3 LIMIT 1), 'AI Shorts & Clips: Testimonial Clip AI', 'ai-shorts-clips-testimonial-clip-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-podcast-to-clips-tools' AND level = 3 LIMIT 1), 'AI Shorts & Clips: Tutorial Clip AI', 'ai-shorts-clips-tutorial-clip-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-podcast-to-clips-tools' AND level = 3 LIMIT 1), 'AI Shorts & Clips: Reaction Video AI', 'ai-shorts-clips-reaction-video-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-podcast-to-clips-tools' AND level = 3 LIMIT 1), 'AI Shorts & Clips: Before/After Video AI', 'ai-shorts-clips-before-after-video-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-podcast-to-clips-tools' AND level = 3 LIMIT 1), 'AI Shorts & Clips: Product Unboxing AI', 'ai-shorts-clips-product-unboxing-ai', 100),
((SELECT id FROM categories WHERE slug = 'ai-podcast-to-clips-tools' AND level = 3 LIMIT 1), 'Podcast AI: Podcast Editing AI', 'podcast-ai-podcast-editing-ai', 110);

-- AI Portfolio Site Builders (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-portfolio-site-builders' AND level = 3 LIMIT 1), 'Investment AI: Portfolio Optimization', 'investment-ai-portfolio-optimization', 10),
((SELECT id FROM categories WHERE slug = 'ai-portfolio-site-builders' AND level = 3 LIMIT 1), 'Location AI: Site Selection AI', 'location-ai-site-selection-ai', 20);

-- AI Pregnancy Tracking Bots (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-pregnancy-tracking-bots' AND level = 3 LIMIT 1), 'Pregnancy & Newborn: Pregnancy Tracker AI', 'pregnancy-newborn-pregnancy-tracker-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-pregnancy-tracking-bots' AND level = 3 LIMIT 1), 'Pregnancy & Newborn: Due Date Calculator', 'pregnancy-newborn-due-date-calculator', 20),
((SELECT id FROM categories WHERE slug = 'ai-pregnancy-tracking-bots' AND level = 3 LIMIT 1), 'Pregnancy & Newborn: Nutrition Guide Pregnancy', 'pregnancy-newborn-nutrition-guide-pregnancy', 30),
((SELECT id FROM categories WHERE slug = 'ai-pregnancy-tracking-bots' AND level = 3 LIMIT 1), 'Pregnancy & Newborn: Contraction Timer AI', 'pregnancy-newborn-contraction-timer-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-pregnancy-tracking-bots' AND level = 3 LIMIT 1), 'Pregnancy & Newborn: Baby Sleep Trainer', 'pregnancy-newborn-baby-sleep-trainer', 50),
((SELECT id FROM categories WHERE slug = 'ai-pregnancy-tracking-bots' AND level = 3 LIMIT 1), 'Pregnancy & Newborn: Breastfeeding Tracker', 'pregnancy-newborn-breastfeeding-tracker', 60),
((SELECT id FROM categories WHERE slug = 'ai-pregnancy-tracking-bots' AND level = 3 LIMIT 1), 'Pregnancy & Newborn: Growth Chart AI', 'pregnancy-newborn-growth-chart-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-pregnancy-tracking-bots' AND level = 3 LIMIT 1), 'Pregnancy & Newborn: Vaccination Scheduler', 'pregnancy-newborn-vaccination-scheduler', 80),
((SELECT id FROM categories WHERE slug = 'ai-pregnancy-tracking-bots' AND level = 3 LIMIT 1), 'Pregnancy & Newborn: Symptom Checker Baby', 'pregnancy-newborn-symptom-checker-baby', 90),
((SELECT id FROM categories WHERE slug = 'ai-pregnancy-tracking-bots' AND level = 3 LIMIT 1), 'Pregnancy & Newborn: Milestone Development AI', 'pregnancy-newborn-milestone-development-ai', 100);

-- AI Pricing Page Generators (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-pricing-page-generators' AND level = 3 LIMIT 1), 'Pricing AI: Dynamic Pricing AI', 'pricing-ai-dynamic-pricing-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-pricing-page-generators' AND level = 3 LIMIT 1), 'Pricing AI: Competitive Pricing AI', 'pricing-ai-competitive-pricing-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-pricing-page-generators' AND level = 3 LIMIT 1), 'Pricing AI: Discount Optimization AI', 'pricing-ai-discount-optimization-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-pricing-page-generators' AND level = 3 LIMIT 1), 'Pricing AI: Bundle Pricing AI', 'pricing-ai-bundle-pricing-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-pricing-page-generators' AND level = 3 LIMIT 1), 'Pricing AI: Freemium Optimization AI', 'pricing-ai-freemium-optimization-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-pricing-page-generators' AND level = 3 LIMIT 1), 'Pricing AI: Usage Pricing AI', 'pricing-ai-usage-pricing-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-pricing-page-generators' AND level = 3 LIMIT 1), 'Pricing AI: Tiered Pricing AI', 'pricing-ai-tiered-pricing-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-pricing-page-generators' AND level = 3 LIMIT 1), 'Pricing AI: Geographic Pricing AI', 'pricing-ai-geographic-pricing-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-pricing-page-generators' AND level = 3 LIMIT 1), 'Pricing AI: Surge Pricing AI', 'pricing-ai-surge-pricing-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-pricing-page-generators' AND level = 3 LIMIT 1), 'Pricing AI: Price Testing AI', 'pricing-ai-price-testing-ai', 100);

-- AI Print-on-Demand Mockup Tools (11 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-print-on-demand-mockup-tools' AND level = 3 LIMIT 1), 'UI/UX AI: Mockup AI', 'ui-ux-ai-mockup-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-print-on-demand-mockup-tools' AND level = 3 LIMIT 1), 'Print-on-Demand AI: T-Shirt Design AI', 'print-on-demand-ai-t-shirt-design-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-print-on-demand-mockup-tools' AND level = 3 LIMIT 1), 'Print-on-Demand AI: Mug Design AI', 'print-on-demand-ai-mug-design-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-print-on-demand-mockup-tools' AND level = 3 LIMIT 1), 'Print-on-Demand AI: Poster Design AI', 'print-on-demand-ai-poster-design-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-print-on-demand-mockup-tools' AND level = 3 LIMIT 1), 'Print-on-Demand AI: Phone Case AI', 'print-on-demand-ai-phone-case-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-print-on-demand-mockup-tools' AND level = 3 LIMIT 1), 'Print-on-Demand AI: Tote Bag Design AI', 'print-on-demand-ai-tote-bag-design-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-print-on-demand-mockup-tools' AND level = 3 LIMIT 1), 'Print-on-Demand AI: Sticker Design AI', 'print-on-demand-ai-sticker-design-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-print-on-demand-mockup-tools' AND level = 3 LIMIT 1), 'Print-on-Demand AI: Greeting Card AI', 'print-on-demand-ai-greeting-card-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-print-on-demand-mockup-tools' AND level = 3 LIMIT 1), 'Print-on-Demand AI: Calendar Design AI', 'print-on-demand-ai-calendar-design-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-print-on-demand-mockup-tools' AND level = 3 LIMIT 1), 'Print-on-Demand AI: Notebook Cover AI', 'print-on-demand-ai-notebook-cover-ai', 100),
((SELECT id FROM categories WHERE slug = 'ai-print-on-demand-mockup-tools' AND level = 3 LIMIT 1), 'Print-on-Demand AI: Puzzle Image AI', 'print-on-demand-ai-puzzle-image-ai', 110);

-- AI Prior Authorization Assistants (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-prior-authorization-assistants' AND level = 3 LIMIT 1), 'Healthcare Operations: Prior Authorization AI', 'healthcare-operations-prior-authorization-ai', 10);

-- AI Product Title Optimizers (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-product-title-optimizers' AND level = 3 LIMIT 1), 'Shopping AI: Product Recommendation AI', 'shopping-ai-product-recommendation-ai', 10);

-- AI Programmatic Ad Creative Tools (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-programmatic-ad-creative-tools' AND level = 3 LIMIT 1), 'Advertising AI: Ad Creative Generator', 'advertising-ai-ad-creative-generator', 10),
((SELECT id FROM categories WHERE slug = 'ai-programmatic-ad-creative-tools' AND level = 3 LIMIT 1), 'Advertising AI: Creative Testing AI', 'advertising-ai-creative-testing-ai', 20);

-- AI Prompt Injection Defenses (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-prompt-injection-defenses' AND level = 3 LIMIT 1), 'Prompt Tools: Prompt Injection Defense', 'prompt-tools-prompt-injection-defense', 10);

-- AI Property Maintenance Bots (9 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-property-maintenance-bots' AND level = 3 LIMIT 1), 'Property Tech AI: Property Valuation AI', 'property-tech-ai-property-valuation-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-property-maintenance-bots' AND level = 3 LIMIT 1), 'Property Tech AI: Property Search AI', 'property-tech-ai-property-search-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-property-maintenance-bots' AND level = 3 LIMIT 1), 'Property Tech AI: Lease Analysis AI', 'property-tech-ai-lease-analysis-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-property-maintenance-bots' AND level = 3 LIMIT 1), 'Property Tech AI: Construction AI', 'property-tech-ai-construction-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-property-maintenance-bots' AND level = 3 LIMIT 1), 'Property Tech AI: Smart Building AI', 'property-tech-ai-smart-building-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-property-maintenance-bots' AND level = 3 LIMIT 1), 'Property Tech AI: Real Estate Marketing AI', 'property-tech-ai-real-estate-marketing-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-property-maintenance-bots' AND level = 3 LIMIT 1), 'Property Tech AI: Tenant Screening AI', 'property-tech-ai-tenant-screening-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-property-maintenance-bots' AND level = 3 LIMIT 1), 'Property Tech AI: Property Inspection AI', 'property-tech-ai-property-inspection-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-property-maintenance-bots' AND level = 3 LIMIT 1), 'Property Tech AI: Market Analysis AI', 'property-tech-ai-market-analysis-ai', 90);

-- AI Push Notification Writers (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-push-notification-writers' AND level = 3 LIMIT 1), 'Copywriting: Push Notification Copy', 'copywriting-push-notification-copy', 10);

-- AI Quarterly Planning Tools (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-quarterly-planning-tools' AND level = 3 LIMIT 1), 'Event Planning AI: Wedding Planner AI Personal', 'event-planning-ai-wedding-planner-ai-personal', 10);

-- AI Realistic Spokesperson Videos (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-realistic-spokesperson-videos' AND level = 3 LIMIT 1), 'AI Avatars & Presenters: Virtual Spokesperson', 'ai-avatars-presenters-virtual-spokesperson', 10);

-- AI Recovery & Soreness Coaches (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-recovery-soreness-coaches' AND level = 3 LIMIT 1), 'Fitness AI: Recovery Optimizer AI', 'fitness-ai-recovery-optimizer-ai', 10);

-- AI Red Team Simulation Tools (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-red-team-simulation-tools' AND level = 3 LIMIT 1), 'Team Productivity AI: Meeting Optimizer AI', 'team-productivity-ai-meeting-optimizer-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-red-team-simulation-tools' AND level = 3 LIMIT 1), 'Team Productivity AI: Workflow Analysis AI', 'team-productivity-ai-workflow-analysis-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-red-team-simulation-tools' AND level = 3 LIMIT 1), 'Team Productivity AI: Bottleneck Detection', 'team-productivity-ai-bottleneck-detection', 30),
((SELECT id FROM categories WHERE slug = 'ai-red-team-simulation-tools' AND level = 3 LIMIT 1), 'Team Productivity AI: Team Allocation AI', 'team-productivity-ai-team-allocation-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-red-team-simulation-tools' AND level = 3 LIMIT 1), 'Team Productivity AI: Knowledge Sharing AI', 'team-productivity-ai-knowledge-sharing-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-red-team-simulation-tools' AND level = 3 LIMIT 1), 'Team Productivity AI: Process Mining AI', 'team-productivity-ai-process-mining-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-red-team-simulation-tools' AND level = 3 LIMIT 1), 'Team Productivity AI: Collaboration AI', 'team-productivity-ai-collaboration-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-red-team-simulation-tools' AND level = 3 LIMIT 1), 'Team Productivity AI: Standups AI', 'team-productivity-ai-standups-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-red-team-simulation-tools' AND level = 3 LIMIT 1), 'Team Productivity AI: OKR Tracking AI', 'team-productivity-ai-okr-tracking-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-red-team-simulation-tools' AND level = 3 LIMIT 1), 'Team Productivity AI: Sprint Velocity AI', 'team-productivity-ai-sprint-velocity-ai', 100);

-- AI Reddit Reply Helpers (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-reddit-reply-helpers' AND level = 3 LIMIT 1), 'Platform-Specific AI: Reddit Content AI', 'platform-specific-ai-reddit-content-ai', 10);

-- AI Reference Checking Bots (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-reference-checking-bots' AND level = 3 LIMIT 1), 'Recruiting AI: Reference Check AI', 'recruiting-ai-reference-check-ai', 10);

-- AI Resume Parsers (4 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-resume-parsers' AND level = 3 LIMIT 1), 'Recruiting AI: Resume Screening AI', 'recruiting-ai-resume-screening-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-resume-parsers' AND level = 3 LIMIT 1), 'Recruiting AI: Employer Branding AI', 'recruiting-ai-employer-branding-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-resume-parsers' AND level = 3 LIMIT 1), 'Recruiting AI: Diversity Hiring AI', 'recruiting-ai-diversity-hiring-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-resume-parsers' AND level = 3 LIMIT 1), 'Recruiting AI: Campus Recruiting AI', 'recruiting-ai-campus-recruiting-ai', 40);

-- AI Reverse Audio Search (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-reverse-audio-search' AND level = 3 LIMIT 1), 'Semantic Search: Audio Search AI', 'semantic-search-audio-search-ai', 10);

-- AI Reverse Image Search (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-reverse-image-search' AND level = 3 LIMIT 1), 'Semantic Search: Image Search AI', 'semantic-search-image-search-ai', 10);

-- AI Reverse Video Search (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-reverse-video-search' AND level = 3 LIMIT 1), 'Semantic Search: Video Search AI', 'semantic-search-video-search-ai', 10);

-- AI Review Request Bots (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-review-request-bots' AND level = 3 LIMIT 1), 'Seller Tools AI: Review Request AI', 'seller-tools-ai-review-request-ai', 10);

-- AI Risk Scoring Tools (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-risk-scoring-tools' AND level = 3 LIMIT 1), 'Investment AI: Risk Assessment AI', 'investment-ai-risk-assessment-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-risk-scoring-tools' AND level = 3 LIMIT 1), 'Investment AI: ESG Scoring AI', 'investment-ai-esg-scoring-ai', 20);

-- AI Roast Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-roast-generators' AND level = 3 LIMIT 1), 'Meme Creation AI: AI Roast Generator', 'meme-creation-ai-ai-roast-generator', 10);

-- AI Root Cause Analysis (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-root-cause-analysis' AND level = 3 LIMIT 1), 'DevOps AI: Root Cause AI', 'devops-ai-root-cause-ai', 10);

-- AI Royalty-Free Music Libraries (6 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-royalty-free-music-libraries' AND level = 3 LIMIT 1), 'Music Generation: Song Composition AI', 'music-generation-song-composition-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-royalty-free-music-libraries' AND level = 3 LIMIT 1), 'Music Generation: Beat Making AI', 'music-generation-beat-making-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-royalty-free-music-libraries' AND level = 3 LIMIT 1), 'Music Generation: Background Music AI', 'music-generation-background-music-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-royalty-free-music-libraries' AND level = 3 LIMIT 1), 'Music Generation: Jingle Creator', 'music-generation-jingle-creator', 40),
((SELECT id FROM categories WHERE slug = 'ai-royalty-free-music-libraries' AND level = 3 LIMIT 1), 'Music Generation: Ringtone Creator', 'music-generation-ringtone-creator', 50),
((SELECT id FROM categories WHERE slug = 'ai-royalty-free-music-libraries' AND level = 3 LIMIT 1), 'Music Generation: Royalty-Free Music AI', 'music-generation-royalty-free-music-ai', 60);

-- AI Running Plan Coaches (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-running-plan-coaches' AND level = 3 LIMIT 1), 'Fitness AI: Workout Plan Generator', 'fitness-ai-workout-plan-generator', 10),
((SELECT id FROM categories WHERE slug = 'ai-running-plan-coaches' AND level = 3 LIMIT 1), 'Fitness AI: Running Coach AI', 'fitness-ai-running-coach-ai', 20);

-- AI Sales Call Coaches (15 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-sales-call-coaches' AND level = 3 LIMIT 1), 'Sales Intelligence: Lead Scoring AI', 'sales-intelligence-lead-scoring-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-sales-call-coaches' AND level = 3 LIMIT 1), 'Sales Intelligence: Deal Prediction', 'sales-intelligence-deal-prediction', 20),
((SELECT id FROM categories WHERE slug = 'ai-sales-call-coaches' AND level = 3 LIMIT 1), 'Sales Intelligence: Pipeline Analytics', 'sales-intelligence-pipeline-analytics', 30),
((SELECT id FROM categories WHERE slug = 'ai-sales-call-coaches' AND level = 3 LIMIT 1), 'Sales Intelligence: Competitor Intelligence', 'sales-intelligence-competitor-intelligence', 40),
((SELECT id FROM categories WHERE slug = 'ai-sales-call-coaches' AND level = 3 LIMIT 1), 'Sales Intelligence: Account Mapping', 'sales-intelligence-account-mapping', 50),
((SELECT id FROM categories WHERE slug = 'ai-sales-call-coaches' AND level = 3 LIMIT 1), 'Sales Intelligence: Stakeholder Analysis', 'sales-intelligence-stakeholder-analysis', 60),
((SELECT id FROM categories WHERE slug = 'ai-sales-call-coaches' AND level = 3 LIMIT 1), 'Sales Intelligence: Territory Planning AI', 'sales-intelligence-territory-planning-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-sales-call-coaches' AND level = 3 LIMIT 1), 'Sales Intelligence: Quota Setting AI', 'sales-intelligence-quota-setting-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-sales-call-coaches' AND level = 3 LIMIT 1), 'Sales Engagement: Call Coaching AI', 'sales-engagement-call-coaching-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-sales-call-coaches' AND level = 3 LIMIT 1), 'Sales Engagement: Meeting Scheduling AI', 'sales-engagement-meeting-scheduling-ai', 100),
((SELECT id FROM categories WHERE slug = 'ai-sales-call-coaches' AND level = 3 LIMIT 1), 'Sales Engagement: Proposal Generation AI', 'sales-engagement-proposal-generation-ai', 110),
((SELECT id FROM categories WHERE slug = 'ai-sales-call-coaches' AND level = 3 LIMIT 1), 'Sales Engagement: Demo Automation', 'sales-engagement-demo-automation', 120),
((SELECT id FROM categories WHERE slug = 'ai-sales-call-coaches' AND level = 3 LIMIT 1), 'Sales Engagement: Follow-Up AI', 'sales-engagement-follow-up-ai', 130),
((SELECT id FROM categories WHERE slug = 'ai-sales-call-coaches' AND level = 3 LIMIT 1), 'Sales Engagement: Contract Generation', 'sales-engagement-contract-generation', 140),
((SELECT id FROM categories WHERE slug = 'ai-sales-call-coaches' AND level = 3 LIMIT 1), 'Sales Engagement: CPQ AI', 'sales-engagement-cpq-ai', 150);

-- AI Sales Forecasting Copilots (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-sales-forecasting-copilots' AND level = 3 LIMIT 1), 'Sales Engagement: Revenue Forecasting', 'sales-engagement-revenue-forecasting', 10);

-- AI Sales Sequence Builders (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-sales-sequence-builders' AND level = 3 LIMIT 1), 'Sales Engagement: Email Sequence AI', 'sales-engagement-email-sequence-ai', 10);

-- AI Sales Tax Compliance (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-sales-tax-compliance' AND level = 3 LIMIT 1), 'Accounting AI: Tax Preparation AI', 'accounting-ai-tax-preparation-ai', 10);

-- AI Schedule Defragmenters (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-schedule-defragmenters' AND level = 3 LIMIT 1), 'Garden AI: Watering Schedule AI', 'garden-ai-watering-schedule-ai', 10);

-- AI Schema Markup Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-schema-markup-generators' AND level = 3 LIMIT 1), 'SEO AI: Schema Markup AI', 'seo-ai-schema-markup-ai', 10);

-- AI Screen Reader Image Descriptions (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-screen-reader-image-descriptions' AND level = 3 LIMIT 1), 'Accessibility AI: Screen Reader AI', 'accessibility-ai-screen-reader-ai', 10);

-- AI Security Vulnerability Scanners (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-security-vulnerability-scanners' AND level = 3 LIMIT 1), 'Code Review & Debug: Security Vulnerability Scanner', 'code-review-debug-security-vulnerability-scanner', 10),
((SELECT id FROM categories WHERE slug = 'ai-security-vulnerability-scanners' AND level = 3 LIMIT 1), 'Security AI: Vulnerability Prediction', 'security-ai-vulnerability-prediction', 20);

-- AI Self-Serve BI Tools (9 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-self-serve-bi-tools' AND level = 3 LIMIT 1), 'BI AI: Automated Insights', 'bi-ai-automated-insights', 10),
((SELECT id FROM categories WHERE slug = 'ai-self-serve-bi-tools' AND level = 3 LIMIT 1), 'BI AI: Anomaly Detection BI', 'bi-ai-anomaly-detection-bi', 20),
((SELECT id FROM categories WHERE slug = 'ai-self-serve-bi-tools' AND level = 3 LIMIT 1), 'BI AI: KPI Monitoring AI', 'bi-ai-kpi-monitoring-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-self-serve-bi-tools' AND level = 3 LIMIT 1), 'BI AI: Executive Summary AI', 'bi-ai-executive-summary-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-self-serve-bi-tools' AND level = 3 LIMIT 1), 'BI AI: Board Report AI', 'bi-ai-board-report-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-self-serve-bi-tools' AND level = 3 LIMIT 1), 'BI AI: Competitive Dashboard AI', 'bi-ai-competitive-dashboard-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-self-serve-bi-tools' AND level = 3 LIMIT 1), 'BI AI: Market Dashboard AI', 'bi-ai-market-dashboard-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-self-serve-bi-tools' AND level = 3 LIMIT 1), 'BI AI: Sales Dashboard AI', 'bi-ai-sales-dashboard-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-self-serve-bi-tools' AND level = 3 LIMIT 1), 'BI AI: Finance Dashboard AI', 'bi-ai-finance-dashboard-ai', 90);

-- AI Shopify Storefront Builders (3 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-shopify-storefront-builders' AND level = 3 LIMIT 1), 'Seller Tools AI: Repricing AI', 'seller-tools-ai-repricing-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-shopify-storefront-builders' AND level = 3 LIMIT 1), 'Seller Tools AI: Refund Analyzer', 'seller-tools-ai-refund-analyzer', 20),
((SELECT id FROM categories WHERE slug = 'ai-shopify-storefront-builders' AND level = 3 LIMIT 1), 'Seller Tools AI: Return Rate Predictor', 'seller-tools-ai-return-rate-predictor', 30);

-- AI Shopping Comparison Agents (6 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-shopping-comparison-agents' AND level = 3 LIMIT 1), 'Shopping AI: Visual Search Shopping', 'shopping-ai-visual-search-shopping', 10),
((SELECT id FROM categories WHERE slug = 'ai-shopping-comparison-agents' AND level = 3 LIMIT 1), 'Shopping AI: Price Optimization AI', 'shopping-ai-price-optimization-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-shopping-comparison-agents' AND level = 3 LIMIT 1), 'Shopping AI: Personalization Engine', 'shopping-ai-personalization-engine', 30),
((SELECT id FROM categories WHERE slug = 'ai-shopping-comparison-agents' AND level = 3 LIMIT 1), 'Shopping AI: Return Prediction', 'shopping-ai-return-prediction', 40),
((SELECT id FROM categories WHERE slug = 'ai-shopping-comparison-agents' AND level = 3 LIMIT 1), 'Shopping AI: Fraud Detection', 'shopping-ai-fraud-detection', 50),
((SELECT id FROM categories WHERE slug = 'ai-shopping-comparison-agents' AND level = 3 LIMIT 1), 'Shopping AI: Dynamic Pricing AI', 'shopping-ai-dynamic-pricing-ai', 60);

-- AI Sign Language Avatar Tools (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-sign-language-avatar-tools' AND level = 3 LIMIT 1), 'Accessibility AI: Sign Language Translator AI', 'accessibility-ai-sign-language-translator-ai', 10);

-- AI Size Recommenders (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-size-recommenders' AND level = 3 LIMIT 1), 'E-Commerce Operations: Size Recommendation AI', 'e-commerce-operations-size-recommendation-ai', 10);

-- AI Skills Assessment Builders (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-skills-assessment-builders' AND level = 3 LIMIT 1), 'Recruiting AI: Skills Assessment AI', 'recruiting-ai-skills-assessment-ai', 10);

-- AI Sleep Quality Coaches (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-sleep-quality-coaches' AND level = 3 LIMIT 1), 'Mental Wellness AI: Sleep Tracker AI', 'mental-wellness-ai-sleep-tracker-ai', 10);

-- AI Sleep Sound Generators (7 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-sleep-sound-generators' AND level = 3 LIMIT 1), 'Sound Design: Ambient Sound Creator', 'sound-design-ambient-sound-creator', 10),
((SELECT id FROM categories WHERE slug = 'ai-sleep-sound-generators' AND level = 3 LIMIT 1), 'Sound Design: Audio Restoration', 'sound-design-audio-restoration', 20),
((SELECT id FROM categories WHERE slug = 'ai-sleep-sound-generators' AND level = 3 LIMIT 1), 'Sound Design: Noise Cancellation', 'sound-design-noise-cancellation', 30),
((SELECT id FROM categories WHERE slug = 'ai-sleep-sound-generators' AND level = 3 LIMIT 1), 'Sound Design: Audio Mastering AI', 'sound-design-audio-mastering-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-sleep-sound-generators' AND level = 3 LIMIT 1), 'Sound Design: Spatial Audio AI', 'sound-design-spatial-audio-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-sleep-sound-generators' AND level = 3 LIMIT 1), 'Sound Design: ASMR Generator', 'sound-design-asmr-generator', 60),
((SELECT id FROM categories WHERE slug = 'ai-sleep-sound-generators' AND level = 3 LIMIT 1), 'Sound Design: Urban Sound Design', 'sound-design-urban-sound-design', 70);

-- AI Slow-Motion Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-slow-motion-generators' AND level = 3 LIMIT 1), 'Video Effects AI: Slow Motion AI', 'video-effects-ai-slow-motion-ai', 10);

-- AI Smart Home Automation (11 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-smart-home-automation' AND level = 3 LIMIT 1), 'AI Automation: AI Workflow Automation', 'ai-automation-ai-workflow-automation', 10),
((SELECT id FROM categories WHERE slug = 'ai-smart-home-automation' AND level = 3 LIMIT 1), 'AI Automation: AI-Powered Zapier Alternatives', 'ai-automation-ai-powered-zapier-alternatives', 20),
((SELECT id FROM categories WHERE slug = 'ai-smart-home-automation' AND level = 3 LIMIT 1), 'AI Automation: RPA with AI', 'ai-automation-rpa-with-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-smart-home-automation' AND level = 3 LIMIT 1), 'AI Automation: Document Processing Automation', 'ai-automation-document-processing-automation', 40),
((SELECT id FROM categories WHERE slug = 'ai-smart-home-automation' AND level = 3 LIMIT 1), 'AI Automation: Email Automation AI', 'ai-automation-email-automation-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-smart-home-automation' AND level = 3 LIMIT 1), 'AI Automation: Social Media Automation AI', 'ai-automation-social-media-automation-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-smart-home-automation' AND level = 3 LIMIT 1), 'AI Automation: Data Entry Automation', 'ai-automation-data-entry-automation', 70),
((SELECT id FROM categories WHERE slug = 'ai-smart-home-automation' AND level = 3 LIMIT 1), 'AI Automation: Report Generation Automation', 'ai-automation-report-generation-automation', 80),
((SELECT id FROM categories WHERE slug = 'ai-smart-home-automation' AND level = 3 LIMIT 1), 'AI Automation: Invoice Processing AI', 'ai-automation-invoice-processing-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-smart-home-automation' AND level = 3 LIMIT 1), 'AI Automation: Contract Extraction AI', 'ai-automation-contract-extraction-ai', 100),
((SELECT id FROM categories WHERE slug = 'ai-smart-home-automation' AND level = 3 LIMIT 1), 'Home Management AI: Smart Home Controller AI', 'home-management-ai-smart-home-controller-ai', 110);

-- AI Social Media Engagement Agents (26 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-social-media-engagement-agents' AND level = 3 LIMIT 1), 'Task-Specific Agents: Social Media Agents', 'task-specific-agents-social-media-agents', 10),
((SELECT id FROM categories WHERE slug = 'ai-social-media-engagement-agents' AND level = 3 LIMIT 1), 'Social Media Writing: LinkedIn Post Generators', 'social-media-writing-linkedin-post-generators', 20),
((SELECT id FROM categories WHERE slug = 'ai-social-media-engagement-agents' AND level = 3 LIMIT 1), 'Social Media Writing: Instagram Caption AI', 'social-media-writing-instagram-caption-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-social-media-engagement-agents' AND level = 3 LIMIT 1), 'Social Media Writing: Pinterest Description AI', 'social-media-writing-pinterest-description-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-social-media-engagement-agents' AND level = 3 LIMIT 1), 'Social Media Writing: Reddit Post Helpers', 'social-media-writing-reddit-post-helpers', 50),
((SELECT id FROM categories WHERE slug = 'ai-social-media-engagement-agents' AND level = 3 LIMIT 1), 'Social Media Writing: Social Bio Generators', 'social-media-writing-social-bio-generators', 60),
((SELECT id FROM categories WHERE slug = 'ai-social-media-engagement-agents' AND level = 3 LIMIT 1), 'Social Media AI: Content Scheduling AI', 'social-media-ai-content-scheduling-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-social-media-engagement-agents' AND level = 3 LIMIT 1), 'Social Media AI: Hashtag Generator', 'social-media-ai-hashtag-generator', 80),
((SELECT id FROM categories WHERE slug = 'ai-social-media-engagement-agents' AND level = 3 LIMIT 1), 'Social Media AI: Trend Prediction', 'social-media-ai-trend-prediction', 90),
((SELECT id FROM categories WHERE slug = 'ai-social-media-engagement-agents' AND level = 3 LIMIT 1), 'Social Media AI: Social Listening', 'social-media-ai-social-listening', 100),
((SELECT id FROM categories WHERE slug = 'ai-social-media-engagement-agents' AND level = 3 LIMIT 1), 'Social Media AI: Influencer Discovery AI', 'social-media-ai-influencer-discovery-ai', 110),
((SELECT id FROM categories WHERE slug = 'ai-social-media-engagement-agents' AND level = 3 LIMIT 1), 'Social Media AI: Community Management AI', 'social-media-ai-community-management-ai', 120),
((SELECT id FROM categories WHERE slug = 'ai-social-media-engagement-agents' AND level = 3 LIMIT 1), 'Social Media AI: Social ROI Tracker', 'social-media-ai-social-roi-tracker', 130),
((SELECT id FROM categories WHERE slug = 'ai-social-media-engagement-agents' AND level = 3 LIMIT 1), 'Social Media AI: Viral Content Predictor', 'social-media-ai-viral-content-predictor', 140),
((SELECT id FROM categories WHERE slug = 'ai-social-media-engagement-agents' AND level = 3 LIMIT 1), 'Social Media AI: User Engagement AI', 'social-media-ai-user-engagement-ai', 150),
((SELECT id FROM categories WHERE slug = 'ai-social-media-engagement-agents' AND level = 3 LIMIT 1), 'Social Media AI: Crisis Detection AI', 'social-media-ai-crisis-detection-ai', 160),
((SELECT id FROM categories WHERE slug = 'ai-social-media-engagement-agents' AND level = 3 LIMIT 1), 'Fan & Media AI: Sports Highlight AI', 'fan-media-ai-sports-highlight-ai', 170),
((SELECT id FROM categories WHERE slug = 'ai-social-media-engagement-agents' AND level = 3 LIMIT 1), 'Fan & Media AI: Match Summary Writer', 'fan-media-ai-match-summary-writer', 180),
((SELECT id FROM categories WHERE slug = 'ai-social-media-engagement-agents' AND level = 3 LIMIT 1), 'Fan & Media AI: Sports Commentary AI', 'fan-media-ai-sports-commentary-ai', 190),
((SELECT id FROM categories WHERE slug = 'ai-social-media-engagement-agents' AND level = 3 LIMIT 1), 'Fan & Media AI: Fan Engagement Platform', 'fan-media-ai-fan-engagement-platform', 200);
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-social-media-engagement-agents' AND level = 3 LIMIT 1), 'Fan & Media AI: Sports Social Media AI', 'fan-media-ai-sports-social-media-ai', 210),
((SELECT id FROM categories WHERE slug = 'ai-social-media-engagement-agents' AND level = 3 LIMIT 1), 'Fan & Media AI: Stadium Experience AI', 'fan-media-ai-stadium-experience-ai', 220),
((SELECT id FROM categories WHERE slug = 'ai-social-media-engagement-agents' AND level = 3 LIMIT 1), 'Fan & Media AI: Sports Merchandise AI', 'fan-media-ai-sports-merchandise-ai', 230),
((SELECT id FROM categories WHERE slug = 'ai-social-media-engagement-agents' AND level = 3 LIMIT 1), 'Fan & Media AI: Ticket Pricing AI Sports', 'fan-media-ai-ticket-pricing-ai-sports', 240),
((SELECT id FROM categories WHERE slug = 'ai-social-media-engagement-agents' AND level = 3 LIMIT 1), 'Fan & Media AI: Sports Trivia AI', 'fan-media-ai-sports-trivia-ai', 250),
((SELECT id FROM categories WHERE slug = 'ai-social-media-engagement-agents' AND level = 3 LIMIT 1), 'Fan & Media AI: Player Comparison AI', 'fan-media-ai-player-comparison-ai', 260);

-- AI Solo Travel Planners (17 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-solo-travel-planners' AND level = 3 LIMIT 1), 'Travel AI: Flight Price Prediction', 'travel-ai-flight-price-prediction', 10),
((SELECT id FROM categories WHERE slug = 'ai-solo-travel-planners' AND level = 3 LIMIT 1), 'Travel AI: Hotel Recommendation AI', 'travel-ai-hotel-recommendation-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-solo-travel-planners' AND level = 3 LIMIT 1), 'Travel AI: Itinerary Planning AI', 'travel-ai-itinerary-planning-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-solo-travel-planners' AND level = 3 LIMIT 1), 'Travel AI: Travel Insurance AI', 'travel-ai-travel-insurance-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-solo-travel-planners' AND level = 3 LIMIT 1), 'Travel AI: Destination Discovery AI', 'travel-ai-destination-discovery-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-solo-travel-planners' AND level = 3 LIMIT 1), 'Travel AI: Restaurant Recommendation AI Travel', 'travel-ai-restaurant-recommendation-ai-travel', 60),
((SELECT id FROM categories WHERE slug = 'ai-solo-travel-planners' AND level = 3 LIMIT 1), 'Travel AI: Currency Exchange AI', 'travel-ai-currency-exchange-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-solo-travel-planners' AND level = 3 LIMIT 1), 'Travel AI: Travel Safety AI', 'travel-ai-travel-safety-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-solo-travel-planners' AND level = 3 LIMIT 1), 'Travel Assistance: Currency Converter AI', 'travel-assistance-currency-converter-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-solo-travel-planners' AND level = 3 LIMIT 1), 'Travel Assistance: Visa Requirements AI', 'travel-assistance-visa-requirements-ai', 100),
((SELECT id FROM categories WHERE slug = 'ai-solo-travel-planners' AND level = 3 LIMIT 1), 'Travel Assistance: Travel Safety Advisor', 'travel-assistance-travel-safety-advisor', 110),
((SELECT id FROM categories WHERE slug = 'ai-solo-travel-planners' AND level = 3 LIMIT 1), 'Travel Assistance: Local Transport Guide AI', 'travel-assistance-local-transport-guide-ai', 120),
((SELECT id FROM categories WHERE slug = 'ai-solo-travel-planners' AND level = 3 LIMIT 1), 'Travel Assistance: Cultural Etiquette AI', 'travel-assistance-cultural-etiquette-ai', 130),
((SELECT id FROM categories WHERE slug = 'ai-solo-travel-planners' AND level = 3 LIMIT 1), 'Travel Assistance: Time Zone Manager', 'travel-assistance-time-zone-manager', 140),
((SELECT id FROM categories WHERE slug = 'ai-solo-travel-planners' AND level = 3 LIMIT 1), 'Travel Assistance: Travel Insurance Advisor', 'travel-assistance-travel-insurance-advisor', 150),
((SELECT id FROM categories WHERE slug = 'ai-solo-travel-planners' AND level = 3 LIMIT 1), 'Travel Assistance: Airport Navigation AI', 'travel-assistance-airport-navigation-ai', 160),
((SELECT id FROM categories WHERE slug = 'ai-solo-travel-planners' AND level = 3 LIMIT 1), 'Travel Assistance: Jet Lag Recovery AI', 'travel-assistance-jet-lag-recovery-ai', 170);

-- AI Sound Effect Libraries (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-sound-effect-libraries' AND level = 3 LIMIT 1), 'Sound Design: Sound Effect Generator', 'sound-design-sound-effect-generator', 10);

-- AI Spatial Audio Tools (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-spatial-audio-tools' AND level = 3 LIMIT 1), 'Spatial AI: 3D Scene Generation', 'spatial-ai-3d-scene-generation', 10),
((SELECT id FROM categories WHERE slug = 'ai-spatial-audio-tools' AND level = 3 LIMIT 1), 'Spatial AI: Room Design AI', 'spatial-ai-room-design-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-spatial-audio-tools' AND level = 3 LIMIT 1), 'Spatial AI: Interior Design AI', 'spatial-ai-interior-design-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-spatial-audio-tools' AND level = 3 LIMIT 1), 'Spatial AI: Architecture AI', 'spatial-ai-architecture-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-spatial-audio-tools' AND level = 3 LIMIT 1), 'Spatial AI: Game Level Design AI', 'spatial-ai-game-level-design-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-spatial-audio-tools' AND level = 3 LIMIT 1), 'Spatial AI: Virtual World Builder', 'spatial-ai-virtual-world-builder', 60),
((SELECT id FROM categories WHERE slug = 'ai-spatial-audio-tools' AND level = 3 LIMIT 1), 'Spatial AI: Metaverse Content AI', 'spatial-ai-metaverse-content-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-spatial-audio-tools' AND level = 3 LIMIT 1), 'Spatial AI: Digital Twin Creation', 'spatial-ai-digital-twin-creation', 80),
((SELECT id FROM categories WHERE slug = 'ai-spatial-audio-tools' AND level = 3 LIMIT 1), 'Spatial AI: AR Filter Creation', 'spatial-ai-ar-filter-creation', 90),
((SELECT id FROM categories WHERE slug = 'ai-spatial-audio-tools' AND level = 3 LIMIT 1), 'Spatial AI: VR Environment AI', 'spatial-ai-vr-environment-ai', 100);

-- AI Speaker Talk-Time Analytics (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-speaker-talk-time-analytics' AND level = 3 LIMIT 1), 'Seller Tools AI: Seller Analytics AI', 'seller-tools-ai-seller-analytics-ai', 10);

-- AI Speaker Tracking Editors (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-speaker-tracking-editors' AND level = 3 LIMIT 1), 'PM AI: Budget Tracking AI', 'pm-ai-budget-tracking-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-speaker-tracking-editors' AND level = 3 LIMIT 1), 'PM AI: Milestone Tracking AI', 'pm-ai-milestone-tracking-ai', 20);

-- AI Sports Highlight Editors (7 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-sports-highlight-editors' AND level = 3 LIMIT 1), 'Sports Analysis AI: Match Prediction AI', 'sports-analysis-ai-match-prediction-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-sports-highlight-editors' AND level = 3 LIMIT 1), 'Sports Analysis AI: Player Stats Analyzer', 'sports-analysis-ai-player-stats-analyzer', 20),
((SELECT id FROM categories WHERE slug = 'ai-sports-highlight-editors' AND level = 3 LIMIT 1), 'Sports Analysis AI: Sports Betting AI', 'sports-analysis-ai-sports-betting-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-sports-highlight-editors' AND level = 3 LIMIT 1), 'Sports Analysis AI: Training Load Monitor', 'sports-analysis-ai-training-load-monitor', 40),
((SELECT id FROM categories WHERE slug = 'ai-sports-highlight-editors' AND level = 3 LIMIT 1), 'Sports Analysis AI: Injury Prevention AI', 'sports-analysis-ai-injury-prevention-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-sports-highlight-editors' AND level = 3 LIMIT 1), 'Sports Analysis AI: Formation Analyzer', 'sports-analysis-ai-formation-analyzer', 60),
((SELECT id FROM categories WHERE slug = 'ai-sports-highlight-editors' AND level = 3 LIMIT 1), 'Sports Analysis AI: Referee Decision AI', 'sports-analysis-ai-referee-decision-ai', 70);

-- AI Spreadsheet Analysts (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-spreadsheet-analysts' AND level = 3 LIMIT 1), 'Spreadsheet AI: Excel Formula AI', 'spreadsheet-ai-excel-formula-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-spreadsheet-analysts' AND level = 3 LIMIT 1), 'Spreadsheet AI: Google Sheets AI', 'spreadsheet-ai-google-sheets-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-spreadsheet-analysts' AND level = 3 LIMIT 1), 'Spreadsheet AI: Data Cleaning AI', 'spreadsheet-ai-data-cleaning-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-spreadsheet-analysts' AND level = 3 LIMIT 1), 'Spreadsheet AI: Pivot Table AI', 'spreadsheet-ai-pivot-table-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-spreadsheet-analysts' AND level = 3 LIMIT 1), 'Spreadsheet AI: Financial Modeling AI', 'spreadsheet-ai-financial-modeling-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-spreadsheet-analysts' AND level = 3 LIMIT 1), 'Spreadsheet AI: Forecasting Spreadsheets', 'spreadsheet-ai-forecasting-spreadsheets', 60),
((SELECT id FROM categories WHERE slug = 'ai-spreadsheet-analysts' AND level = 3 LIMIT 1), 'Spreadsheet AI: Data Validation AI', 'spreadsheet-ai-data-validation-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-spreadsheet-analysts' AND level = 3 LIMIT 1), 'Spreadsheet AI: Merge & Dedup AI', 'spreadsheet-ai-merge-dedup-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-spreadsheet-analysts' AND level = 3 LIMIT 1), 'Spreadsheet AI: Format Conversion AI', 'spreadsheet-ai-format-conversion-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-spreadsheet-analysts' AND level = 3 LIMIT 1), 'Spreadsheet AI: Spreadsheet Chat AI', 'spreadsheet-ai-spreadsheet-chat-ai', 100);

-- AI Startup Financial Models (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-startup-financial-models' AND level = 3 LIMIT 1), 'Accounting AI: Financial Close AI', 'accounting-ai-financial-close-ai', 10);

-- AI Stock Idea Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-stock-idea-generators' AND level = 3 LIMIT 1), 'Investment AI: Stock Analysis AI', 'investment-ai-stock-analysis-ai', 10);

-- AI Stress Management Coaches (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-stress-management-coaches' AND level = 3 LIMIT 1), 'Mental Wellness AI: Anxiety Management AI', 'mental-wellness-ai-anxiety-management-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-stress-management-coaches' AND level = 3 LIMIT 1), 'Mental Wellness AI: Stress Monitor AI', 'mental-wellness-ai-stress-monitor-ai', 20);

-- AI Stretching Routine Builders (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-stretching-routine-builders' AND level = 3 LIMIT 1), 'Fitness AI: Stretching Routine AI', 'fitness-ai-stretching-routine-ai', 10);

-- AI Survey Builders (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-survey-builders' AND level = 3 LIMIT 1), 'No-Code Chatbot Platforms: Survey Bots', 'no-code-chatbot-platforms-survey-bots', 10);

-- AI System Design Assistants (34 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Presentation Design: Template Generators', 'presentation-design-template-generators', 10),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Presentation Design: Brand-Aligned Slides', 'presentation-design-brand-aligned-slides', 20),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Presentation Design: Data Visualization Slides', 'presentation-design-data-visualization-slides', 30),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Presentation Design: Animated Presentations', 'presentation-design-animated-presentations', 40),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Presentation Design: Interactive Presentations', 'presentation-design-interactive-presentations', 50),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Presentation Design: Video Presentations', 'presentation-design-video-presentations', 60),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Presentation Design: One-Pager Generators', 'presentation-design-one-pager-generators', 70),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Presentation Design: Proposal Deck Design', 'presentation-design-proposal-deck-design', 80),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Presentation Design: Case Study Presentations', 'presentation-design-case-study-presentations', 90),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Presentation Design: Portfolio Presentations', 'presentation-design-portfolio-presentations', 100),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'UI/UX AI: Wireframe Generator AI', 'ui-ux-ai-wireframe-generator-ai', 110),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'UI/UX AI: Responsive Design AI', 'ui-ux-ai-responsive-design-ai', 120),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'UI/UX AI: Micro-Interaction AI', 'ui-ux-ai-micro-interaction-ai', 130),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'UI/UX AI: Design System AI', 'ui-ux-ai-design-system-ai', 140),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Pharmaceutical AI: Protocol Design AI', 'pharmaceutical-ai-protocol-design-ai', 150),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Interior Design AI: Room Design AI', 'interior-design-ai-room-design-ai', 160),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Interior Design AI: Virtual Home Staging', 'interior-design-ai-virtual-home-staging', 170),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Interior Design AI: Furniture Placement AI', 'interior-design-ai-furniture-placement-ai', 180),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Interior Design AI: Color Scheme Generator', 'interior-design-ai-color-scheme-generator', 190),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Interior Design AI: Kitchen Design AI', 'interior-design-ai-kitchen-design-ai', 200);
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Interior Design AI: Bathroom Design AI', 'interior-design-ai-bathroom-design-ai', 210),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Interior Design AI: Living Room Designer', 'interior-design-ai-living-room-designer', 220),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Interior Design AI: Bedroom Design AI', 'interior-design-ai-bedroom-design-ai', 230),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Interior Design AI: Office Space Designer', 'interior-design-ai-office-space-designer', 240),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Interior Design AI: Garden & Landscape AI', 'interior-design-ai-garden-landscape-ai', 250),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Type Design AI: Font Generator AI', 'type-design-ai-font-generator-ai', 260),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Type Design AI: Handwriting Font Creator', 'type-design-ai-handwriting-font-creator', 270),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Type Design AI: Logo Font Recommender', 'type-design-ai-logo-font-recommender', 280),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Type Design AI: Font Identifier AI', 'type-design-ai-font-identifier-ai', 290),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Type Design AI: Custom Typeface AI', 'type-design-ai-custom-typeface-ai', 300),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Type Design AI: Calligraphy AI', 'type-design-ai-calligraphy-ai', 310),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Type Design AI: Lettering Generator', 'type-design-ai-lettering-generator', 320),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Type Design AI: Monogram Designer AI', 'type-design-ai-monogram-designer-ai', 330),
((SELECT id FROM categories WHERE slug = 'ai-system-design-assistants' AND level = 3 LIMIT 1), 'Type Design AI: Display Font Creator', 'type-design-ai-display-font-creator', 340);

-- AI Talking Avatar Video Builders (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-talking-avatar-video-builders' AND level = 3 LIMIT 1), 'AI Avatars & Presenters: Sales Demo Avatar', 'ai-avatars-presenters-sales-demo-avatar', 10),
((SELECT id FROM categories WHERE slug = 'ai-talking-avatar-video-builders' AND level = 3 LIMIT 1), 'AI Avatars & Presenters: Sign Language Avatar', 'ai-avatars-presenters-sign-language-avatar', 20);

-- AI Tarot Reading Apps (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-tarot-reading-apps' AND level = 3 LIMIT 1), 'Mystical & Spiritual AI: AI Tarot Reader', 'mystical-spiritual-ai-ai-tarot-reader', 10);

-- AI Test-Coverage Boosters (6 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-test-coverage-boosters' AND level = 3 LIMIT 1), 'AI QA Tools: Load Test AI', 'ai-qa-tools-load-test-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-test-coverage-boosters' AND level = 3 LIMIT 1), 'AI QA Tools: API Test AI', 'ai-qa-tools-api-test-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-test-coverage-boosters' AND level = 3 LIMIT 1), 'AI QA Tools: Security Test AI', 'ai-qa-tools-security-test-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-test-coverage-boosters' AND level = 3 LIMIT 1), 'AI QA Tools: Regression Test AI', 'ai-qa-tools-regression-test-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-test-coverage-boosters' AND level = 3 LIMIT 1), 'AI QA Tools: Accessibility Test AI', 'ai-qa-tools-accessibility-test-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-test-coverage-boosters' AND level = 3 LIMIT 1), 'AI QA Tools: Performance Test AI', 'ai-qa-tools-performance-test-ai', 60);

-- AI Text Simplifiers (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-text-simplifiers' AND level = 3 LIMIT 1), 'Text Extraction AI: OCR Scanner AI', 'text-extraction-ai-ocr-scanner-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-text-simplifiers' AND level = 3 LIMIT 1), 'Text Extraction AI: Handwriting to Text', 'text-extraction-ai-handwriting-to-text', 20),
((SELECT id FROM categories WHERE slug = 'ai-text-simplifiers' AND level = 3 LIMIT 1), 'Text Extraction AI: Receipt Scanner AI', 'text-extraction-ai-receipt-scanner-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-text-simplifiers' AND level = 3 LIMIT 1), 'Text Extraction AI: Business Card Scanner', 'text-extraction-ai-business-card-scanner', 40),
((SELECT id FROM categories WHERE slug = 'ai-text-simplifiers' AND level = 3 LIMIT 1), 'Text Extraction AI: Document Digitizer', 'text-extraction-ai-document-digitizer', 50),
((SELECT id FROM categories WHERE slug = 'ai-text-simplifiers' AND level = 3 LIMIT 1), 'Text Extraction AI: Table Extractor AI', 'text-extraction-ai-table-extractor-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-text-simplifiers' AND level = 3 LIMIT 1), 'Text Extraction AI: Form Recognizer AI', 'text-extraction-ai-form-recognizer-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-text-simplifiers' AND level = 3 LIMIT 1), 'Text Extraction AI: License Plate Reader AI', 'text-extraction-ai-license-plate-reader-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-text-simplifiers' AND level = 3 LIMIT 1), 'Text Extraction AI: Passport Scanner AI', 'text-extraction-ai-passport-scanner-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-text-simplifiers' AND level = 3 LIMIT 1), 'Text Extraction AI: Prescription Reader AI', 'text-extraction-ai-prescription-reader-ai', 100);

-- AI Theme Extraction (11 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-theme-extraction' AND level = 3 LIMIT 1), 'Data Extraction AI: Invoice Data Extractor', 'data-extraction-ai-invoice-data-extractor', 10),
((SELECT id FROM categories WHERE slug = 'ai-theme-extraction' AND level = 3 LIMIT 1), 'Data Extraction AI: Bank Statement Parser', 'data-extraction-ai-bank-statement-parser', 20),
((SELECT id FROM categories WHERE slug = 'ai-theme-extraction' AND level = 3 LIMIT 1), 'Data Extraction AI: Contract Clause Extractor', 'data-extraction-ai-contract-clause-extractor', 30),
((SELECT id FROM categories WHERE slug = 'ai-theme-extraction' AND level = 3 LIMIT 1), 'Data Extraction AI: Resume Parser AI', 'data-extraction-ai-resume-parser-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-theme-extraction' AND level = 3 LIMIT 1), 'Data Extraction AI: Medical Record Extractor', 'data-extraction-ai-medical-record-extractor', 50),
((SELECT id FROM categories WHERE slug = 'ai-theme-extraction' AND level = 3 LIMIT 1), 'Data Extraction AI: Insurance Document AI', 'data-extraction-ai-insurance-document-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-theme-extraction' AND level = 3 LIMIT 1), 'Data Extraction AI: Tax Form Extractor', 'data-extraction-ai-tax-form-extractor', 70),
((SELECT id FROM categories WHERE slug = 'ai-theme-extraction' AND level = 3 LIMIT 1), 'Data Extraction AI: Legal Citation Extractor', 'data-extraction-ai-legal-citation-extractor', 80),
((SELECT id FROM categories WHERE slug = 'ai-theme-extraction' AND level = 3 LIMIT 1), 'Data Extraction AI: Financial Report Parser', 'data-extraction-ai-financial-report-parser', 90),
((SELECT id FROM categories WHERE slug = 'ai-theme-extraction' AND level = 3 LIMIT 1), 'Data Extraction AI: Research Paper Extractor', 'data-extraction-ai-research-paper-extractor', 100),
((SELECT id FROM categories WHERE slug = 'ai-theme-extraction' AND level = 3 LIMIT 1), 'Location AI: Map Data Extraction', 'location-ai-map-data-extraction', 110);

-- AI Threads Post Writers (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-threads-post-writers' AND level = 3 LIMIT 1), 'Social Media Writing: Threads Post Writers', 'social-media-writing-threads-post-writers', 10),
((SELECT id FROM categories WHERE slug = 'ai-threads-post-writers' AND level = 3 LIMIT 1), 'Platform-Specific AI: Threads Content AI', 'platform-specific-ai-threads-content-ai', 20);

-- AI TikTok Hook Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-tiktok-hook-generators' AND level = 3 LIMIT 1), 'Naming AI: Social Handle Finder', 'naming-ai-social-handle-finder', 10);

-- AI TikTok Script Writers (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-tiktok-script-writers' AND level = 3 LIMIT 1), 'Social Media Writing: TikTok Script Writers', 'social-media-writing-tiktok-script-writers', 10),
((SELECT id FROM categories WHERE slug = 'ai-tiktok-script-writers' AND level = 3 LIMIT 1), 'Platform-Specific AI: TikTok Content AI', 'platform-specific-ai-tiktok-content-ai', 20);

-- AI Time-Blocking Assistants (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-time-blocking-assistants' AND level = 3 LIMIT 1), 'Conversational AI: Personal Productivity AI', 'conversational-ai-personal-productivity-ai', 10);

-- AI Topic Monitoring Tools (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-topic-monitoring-tools' AND level = 3 LIMIT 1), 'MLOps & Monitoring: Model Monitoring', 'mlops-monitoring-model-monitoring', 10),
((SELECT id FROM categories WHERE slug = 'ai-topic-monitoring-tools' AND level = 3 LIMIT 1), 'MLOps & Monitoring: Data Drift Detection', 'mlops-monitoring-data-drift-detection', 20),
((SELECT id FROM categories WHERE slug = 'ai-topic-monitoring-tools' AND level = 3 LIMIT 1), 'MLOps & Monitoring: A/B Testing for Models', 'mlops-monitoring-a-b-testing-for-models', 30),
((SELECT id FROM categories WHERE slug = 'ai-topic-monitoring-tools' AND level = 3 LIMIT 1), 'MLOps & Monitoring: Model Versioning', 'mlops-monitoring-model-versioning', 40),
((SELECT id FROM categories WHERE slug = 'ai-topic-monitoring-tools' AND level = 3 LIMIT 1), 'MLOps & Monitoring: Pipeline Orchestration', 'mlops-monitoring-pipeline-orchestration', 50),
((SELECT id FROM categories WHERE slug = 'ai-topic-monitoring-tools' AND level = 3 LIMIT 1), 'MLOps & Monitoring: Annotation Tools', 'mlops-monitoring-annotation-tools', 60),
((SELECT id FROM categories WHERE slug = 'ai-topic-monitoring-tools' AND level = 3 LIMIT 1), 'MLOps & Monitoring: Synthetic Data Generation', 'mlops-monitoring-synthetic-data-generation', 70),
((SELECT id FROM categories WHERE slug = 'ai-topic-monitoring-tools' AND level = 3 LIMIT 1), 'MLOps & Monitoring: Bias Detection', 'mlops-monitoring-bias-detection', 80),
((SELECT id FROM categories WHERE slug = 'ai-topic-monitoring-tools' AND level = 3 LIMIT 1), 'MLOps & Monitoring: Explainability Tools', 'mlops-monitoring-explainability-tools', 90),
((SELECT id FROM categories WHERE slug = 'ai-topic-monitoring-tools' AND level = 3 LIMIT 1), 'MLOps & Monitoring: AI Cost Optimization', 'mlops-monitoring-ai-cost-optimization', 100);

-- AI Trading Strategy Backtesters (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-trading-strategy-backtesters' AND level = 3 LIMIT 1), 'Investment AI: Quantitative Trading', 'investment-ai-quantitative-trading', 10);

-- AI Travel Booking Agents (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-travel-booking-agents' AND level = 3 LIMIT 1), 'Travel AI: Activity Booking AI', 'travel-ai-activity-booking-ai', 10);

-- AI Travel Translation Earpieces (Apps) (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-travel-translation-earpieces-apps' AND level = 3 LIMIT 1), 'Travel AI: Language Translation Travel', 'travel-ai-language-translation-travel', 10),
((SELECT id FROM categories WHERE slug = 'ai-travel-translation-earpieces-apps' AND level = 3 LIMIT 1), 'Travel Assistance: Real-Time Translation AI Travel', 'travel-assistance-real-time-translation-ai-travel', 20);

-- AI Vegan Meal Planners (9 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-vegan-meal-planners' AND level = 3 LIMIT 1), 'Recipe & Meal AI: AI Recipe Generator', 'recipe-meal-ai-ai-recipe-generator', 10),
((SELECT id FROM categories WHERE slug = 'ai-vegan-meal-planners' AND level = 3 LIMIT 1), 'Recipe & Meal AI: Meal Planner AI', 'recipe-meal-ai-meal-planner-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-vegan-meal-planners' AND level = 3 LIMIT 1), 'Recipe & Meal AI: Ingredient Substitution AI', 'recipe-meal-ai-ingredient-substitution-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-vegan-meal-planners' AND level = 3 LIMIT 1), 'Recipe & Meal AI: Cooking Instruction AI', 'recipe-meal-ai-cooking-instruction-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-vegan-meal-planners' AND level = 3 LIMIT 1), 'Recipe & Meal AI: Diet-Specific Recipe AI', 'recipe-meal-ai-diet-specific-recipe-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-vegan-meal-planners' AND level = 3 LIMIT 1), 'Recipe & Meal AI: Recipe Scaling AI', 'recipe-meal-ai-recipe-scaling-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-vegan-meal-planners' AND level = 3 LIMIT 1), 'Recipe & Meal AI: Recipe from Photo AI', 'recipe-meal-ai-recipe-from-photo-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-vegan-meal-planners' AND level = 3 LIMIT 1), 'Recipe & Meal AI: Calorie Estimator AI', 'recipe-meal-ai-calorie-estimator-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-vegan-meal-planners' AND level = 3 LIMIT 1), 'Recipe & Meal AI: Wine Pairing AI', 'recipe-meal-ai-wine-pairing-ai', 90);

-- AI Video Format Conversion (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-video-format-conversion' AND level = 3 LIMIT 1), 'File Conversion AI: Image Format Converter', 'file-conversion-ai-image-format-converter', 10),
((SELECT id FROM categories WHERE slug = 'ai-video-format-conversion' AND level = 3 LIMIT 1), 'File Conversion AI: Video Format Converter', 'file-conversion-ai-video-format-converter', 20),
((SELECT id FROM categories WHERE slug = 'ai-video-format-conversion' AND level = 3 LIMIT 1), 'File Conversion AI: Audio Format Converter', 'file-conversion-ai-audio-format-converter', 30),
((SELECT id FROM categories WHERE slug = 'ai-video-format-conversion' AND level = 3 LIMIT 1), 'File Conversion AI: Document Format Converter', 'file-conversion-ai-document-format-converter', 40),
((SELECT id FROM categories WHERE slug = 'ai-video-format-conversion' AND level = 3 LIMIT 1), 'File Conversion AI: Ebook Format Converter', 'file-conversion-ai-ebook-format-converter', 50),
((SELECT id FROM categories WHERE slug = 'ai-video-format-conversion' AND level = 3 LIMIT 1), 'File Conversion AI: Spreadsheet Converter', 'file-conversion-ai-spreadsheet-converter', 60),
((SELECT id FROM categories WHERE slug = 'ai-video-format-conversion' AND level = 3 LIMIT 1), 'File Conversion AI: Database Format Converter', 'file-conversion-ai-database-format-converter', 70),
((SELECT id FROM categories WHERE slug = 'ai-video-format-conversion' AND level = 3 LIMIT 1), 'File Conversion AI: CAD Format Converter', 'file-conversion-ai-cad-format-converter', 80),
((SELECT id FROM categories WHERE slug = 'ai-video-format-conversion' AND level = 3 LIMIT 1), 'File Conversion AI: Font Format Converter', 'file-conversion-ai-font-format-converter', 90),
((SELECT id FROM categories WHERE slug = 'ai-video-format-conversion' AND level = 3 LIMIT 1), 'File Conversion AI: Archive Format Converter', 'file-conversion-ai-archive-format-converter', 100);

-- AI Video Green-Screen Tools (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-video-green-screen-tools' AND level = 3 LIMIT 1), 'AI Video Editing: Green Screen AI', 'ai-video-editing-green-screen-ai', 10);

-- AI Video Object Removal (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-video-object-removal' AND level = 3 LIMIT 1), 'Video Analysis AI: Video Object Tracking', 'video-analysis-ai-video-object-tracking', 10);

-- AI Video Restoration (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-video-restoration' AND level = 3 LIMIT 1), 'Video Enhancement AI: Old Video Restoration', 'video-enhancement-ai-old-video-restoration', 10);

-- AI Video Stabilization (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-video-stabilization' AND level = 3 LIMIT 1), 'AI Video Editing: Stabilization AI', 'ai-video-editing-stabilization-ai', 10);

-- AI Virtual Staging Tools (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-virtual-staging-tools' AND level = 3 LIMIT 1), 'Property Tech AI: Virtual Staging AI', 'property-tech-ai-virtual-staging-ai', 10);

-- AI Voice-of-Customer Analytics (21 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-voice-of-customer-analytics' AND level = 3 LIMIT 1), 'Predictive Analytics: Sales Forecasting', 'predictive-analytics-sales-forecasting', 10),
((SELECT id FROM categories WHERE slug = 'ai-voice-of-customer-analytics' AND level = 3 LIMIT 1), 'Predictive Analytics: Demand Forecasting', 'predictive-analytics-demand-forecasting', 20),
((SELECT id FROM categories WHERE slug = 'ai-voice-of-customer-analytics' AND level = 3 LIMIT 1), 'Predictive Analytics: Churn Prediction', 'predictive-analytics-churn-prediction', 30),
((SELECT id FROM categories WHERE slug = 'ai-voice-of-customer-analytics' AND level = 3 LIMIT 1), 'Predictive Analytics: Risk Scoring', 'predictive-analytics-risk-scoring', 40),
((SELECT id FROM categories WHERE slug = 'ai-voice-of-customer-analytics' AND level = 3 LIMIT 1), 'Predictive Analytics: Fraud Detection', 'predictive-analytics-fraud-detection', 50),
((SELECT id FROM categories WHERE slug = 'ai-voice-of-customer-analytics' AND level = 3 LIMIT 1), 'Predictive Analytics: Price Optimization', 'predictive-analytics-price-optimization', 60),
((SELECT id FROM categories WHERE slug = 'ai-voice-of-customer-analytics' AND level = 3 LIMIT 1), 'Predictive Analytics: Inventory Prediction', 'predictive-analytics-inventory-prediction', 70),
((SELECT id FROM categories WHERE slug = 'ai-voice-of-customer-analytics' AND level = 3 LIMIT 1), 'Predictive Analytics: Customer Lifetime Value', 'predictive-analytics-customer-lifetime-value', 80),
((SELECT id FROM categories WHERE slug = 'ai-voice-of-customer-analytics' AND level = 3 LIMIT 1), 'Predictive Analytics: Lead Scoring', 'predictive-analytics-lead-scoring', 90),
((SELECT id FROM categories WHERE slug = 'ai-voice-of-customer-analytics' AND level = 3 LIMIT 1), 'Predictive Analytics: Revenue Forecasting', 'predictive-analytics-revenue-forecasting', 100),
((SELECT id FROM categories WHERE slug = 'ai-voice-of-customer-analytics' AND level = 3 LIMIT 1), 'Text Analytics: Sentiment Analysis', 'text-analytics-sentiment-analysis', 110),
((SELECT id FROM categories WHERE slug = 'ai-voice-of-customer-analytics' AND level = 3 LIMIT 1), 'Text Analytics: Topic Modeling', 'text-analytics-topic-modeling', 120),
((SELECT id FROM categories WHERE slug = 'ai-voice-of-customer-analytics' AND level = 3 LIMIT 1), 'Text Analytics: Entity Extraction', 'text-analytics-entity-extraction', 130),
((SELECT id FROM categories WHERE slug = 'ai-voice-of-customer-analytics' AND level = 3 LIMIT 1), 'Text Analytics: Intent Classification', 'text-analytics-intent-classification', 140),
((SELECT id FROM categories WHERE slug = 'ai-voice-of-customer-analytics' AND level = 3 LIMIT 1), 'Text Analytics: Keyword Extraction', 'text-analytics-keyword-extraction', 150),
((SELECT id FROM categories WHERE slug = 'ai-voice-of-customer-analytics' AND level = 3 LIMIT 1), 'Text Analytics: Text Clustering', 'text-analytics-text-clustering', 160),
((SELECT id FROM categories WHERE slug = 'ai-voice-of-customer-analytics' AND level = 3 LIMIT 1), 'Text Analytics: Review Analysis', 'text-analytics-review-analysis', 170),
((SELECT id FROM categories WHERE slug = 'ai-voice-of-customer-analytics' AND level = 3 LIMIT 1), 'Text Analytics: Survey Analysis', 'text-analytics-survey-analysis', 180),
((SELECT id FROM categories WHERE slug = 'ai-voice-of-customer-analytics' AND level = 3 LIMIT 1), 'Text Analytics: Social Listening AI', 'text-analytics-social-listening-ai', 190),
((SELECT id FROM categories WHERE slug = 'ai-voice-of-customer-analytics' AND level = 3 LIMIT 1), 'Text Analytics: Brand Monitoring AI', 'text-analytics-brand-monitoring-ai', 200);
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-voice-of-customer-analytics' AND level = 3 LIMIT 1), 'People Analytics: Org Network Analysis', 'people-analytics-org-network-analysis', 210);

-- AI Voice Support Agents (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-voice-support-agents' AND level = 3 LIMIT 1), 'Voice Agents: Voice-Based Customer Service', 'voice-agents-voice-based-customer-service', 10);

-- AI Voice-to-Note Tools (11 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-voice-to-note-tools' AND level = 3 LIMIT 1), 'Personal Productivity AI: Note-Taking AI', 'personal-productivity-ai-note-taking-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-voice-to-note-tools' AND level = 3 LIMIT 1), 'Note-Taking AI: Meeting Notes AI', 'note-taking-ai-meeting-notes-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-voice-to-note-tools' AND level = 3 LIMIT 1), 'Note-Taking AI: Lecture Notes AI', 'note-taking-ai-lecture-notes-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-voice-to-note-tools' AND level = 3 LIMIT 1), 'Note-Taking AI: Research Notes AI', 'note-taking-ai-research-notes-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-voice-to-note-tools' AND level = 3 LIMIT 1), 'Note-Taking AI: Voice Note AI', 'note-taking-ai-voice-note-ai', 50),
((SELECT id FROM categories WHERE slug = 'ai-voice-to-note-tools' AND level = 3 LIMIT 1), 'Note-Taking AI: Linked Note AI', 'note-taking-ai-linked-note-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-voice-to-note-tools' AND level = 3 LIMIT 1), 'Note-Taking AI: Zettelkasten AI', 'note-taking-ai-zettelkasten-ai', 70),
((SELECT id FROM categories WHERE slug = 'ai-voice-to-note-tools' AND level = 3 LIMIT 1), 'Note-Taking AI: Cornell Notes AI', 'note-taking-ai-cornell-notes-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-voice-to-note-tools' AND level = 3 LIMIT 1), 'Note-Taking AI: Mind Map from Notes', 'note-taking-ai-mind-map-from-notes', 90),
((SELECT id FROM categories WHERE slug = 'ai-voice-to-note-tools' AND level = 3 LIMIT 1), 'Note-Taking AI: Note Summarizer', 'note-taking-ai-note-summarizer', 100),
((SELECT id FROM categories WHERE slug = 'ai-voice-to-note-tools' AND level = 3 LIMIT 1), 'Note-Taking AI: Note Search & Retrieve', 'note-taking-ai-note-search-retrieve', 110);

-- AI Walmart Marketplace Tools (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-walmart-marketplace-tools' AND level = 3 LIMIT 1), 'E-Commerce Operations: Marketplace AI', 'e-commerce-operations-marketplace-ai', 10);

-- AI Web Analytics Copilots (9 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-web-analytics-copilots' AND level = 3 LIMIT 1), 'Web Data AI: Smart Web Scraper', 'web-data-ai-smart-web-scraper', 10),
((SELECT id FROM categories WHERE slug = 'ai-web-analytics-copilots' AND level = 3 LIMIT 1), 'Web Data AI: Structured Data Extractor', 'web-data-ai-structured-data-extractor', 20),
((SELECT id FROM categories WHERE slug = 'ai-web-analytics-copilots' AND level = 3 LIMIT 1), 'Web Data AI: Price Monitoring Bot', 'web-data-ai-price-monitoring-bot', 30),
((SELECT id FROM categories WHERE slug = 'ai-web-analytics-copilots' AND level = 3 LIMIT 1), 'Web Data AI: Social Media Scraper AI', 'web-data-ai-social-media-scraper-ai', 40),
((SELECT id FROM categories WHERE slug = 'ai-web-analytics-copilots' AND level = 3 LIMIT 1), 'Web Data AI: Job Listing Scraper', 'web-data-ai-job-listing-scraper', 50),
((SELECT id FROM categories WHERE slug = 'ai-web-analytics-copilots' AND level = 3 LIMIT 1), 'Web Data AI: Real Estate Data Scraper', 'web-data-ai-real-estate-data-scraper', 60),
((SELECT id FROM categories WHERE slug = 'ai-web-analytics-copilots' AND level = 3 LIMIT 1), 'Web Data AI: Product Data Aggregator', 'web-data-ai-product-data-aggregator', 70),
((SELECT id FROM categories WHERE slug = 'ai-web-analytics-copilots' AND level = 3 LIMIT 1), 'Web Data AI: News Aggregator AI', 'web-data-ai-news-aggregator-ai', 80),
((SELECT id FROM categories WHERE slug = 'ai-web-analytics-copilots' AND level = 3 LIMIT 1), 'Web Data AI: Review Aggregator AI', 'web-data-ai-review-aggregator-ai', 90);

-- AI Web App Builders (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-web-app-builders' AND level = 3 LIMIT 1), 'No-Code Chatbot Platforms: Sales Chatbots', 'no-code-chatbot-platforms-sales-chatbots', 10),
((SELECT id FROM categories WHERE slug = 'ai-web-app-builders' AND level = 3 LIMIT 1), 'Visual AI Builders: AutoML Platforms', 'visual-ai-builders-automl-platforms', 20),
((SELECT id FROM categories WHERE slug = 'ai-web-app-builders' AND level = 3 LIMIT 1), 'Visual AI Builders: AI Workflow Builders', 'visual-ai-builders-ai-workflow-builders', 30),
((SELECT id FROM categories WHERE slug = 'ai-web-app-builders' AND level = 3 LIMIT 1), 'Visual AI Builders: Custom GPT Builders', 'visual-ai-builders-custom-gpt-builders', 40),
((SELECT id FROM categories WHERE slug = 'ai-web-app-builders' AND level = 3 LIMIT 1), 'Visual AI Builders: AI App Builders', 'visual-ai-builders-ai-app-builders', 50),
((SELECT id FROM categories WHERE slug = 'ai-web-app-builders' AND level = 3 LIMIT 1), 'Visual AI Builders: Chatbot Visual Builders', 'visual-ai-builders-chatbot-visual-builders', 60),
((SELECT id FROM categories WHERE slug = 'ai-web-app-builders' AND level = 3 LIMIT 1), 'Visual AI Builders: Voice App Builders', 'visual-ai-builders-voice-app-builders', 70),
((SELECT id FROM categories WHERE slug = 'ai-web-app-builders' AND level = 3 LIMIT 1), 'Visual AI Builders: Computer Vision Builders', 'visual-ai-builders-computer-vision-builders', 80),
((SELECT id FROM categories WHERE slug = 'ai-web-app-builders' AND level = 3 LIMIT 1), 'Visual AI Builders: NLP Pipeline Builders', 'visual-ai-builders-nlp-pipeline-builders', 90),
((SELECT id FROM categories WHERE slug = 'ai-web-app-builders' AND level = 3 LIMIT 1), 'Visual AI Builders: Predictive Model Builders', 'visual-ai-builders-predictive-model-builders', 100);

-- AI Wedding Invitation Designers (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-wedding-invitation-designers' AND level = 3 LIMIT 1), 'Invitation & RSVP AI: Invitation Designer AI', 'invitation-rsvp-ai-invitation-designer-ai', 10),
((SELECT id FROM categories WHERE slug = 'ai-wedding-invitation-designers' AND level = 3 LIMIT 1), 'Invitation & RSVP AI: Guest List Manager AI', 'invitation-rsvp-ai-guest-list-manager-ai', 20),
((SELECT id FROM categories WHERE slug = 'ai-wedding-invitation-designers' AND level = 3 LIMIT 1), 'Invitation & RSVP AI: Seating Chart AI', 'invitation-rsvp-ai-seating-chart-ai', 30),
((SELECT id FROM categories WHERE slug = 'ai-wedding-invitation-designers' AND level = 3 LIMIT 1), 'Invitation & RSVP AI: Event Timeline Creator', 'invitation-rsvp-ai-event-timeline-creator', 40),
((SELECT id FROM categories WHERE slug = 'ai-wedding-invitation-designers' AND level = 3 LIMIT 1), 'Invitation & RSVP AI: Menu Planner AI Events', 'invitation-rsvp-ai-menu-planner-ai-events', 50),
((SELECT id FROM categories WHERE slug = 'ai-wedding-invitation-designers' AND level = 3 LIMIT 1), 'Invitation & RSVP AI: Decoration Planner AI', 'invitation-rsvp-ai-decoration-planner-ai', 60),
((SELECT id FROM categories WHERE slug = 'ai-wedding-invitation-designers' AND level = 3 LIMIT 1), 'Invitation & RSVP AI: Event Budget Tracker', 'invitation-rsvp-ai-event-budget-tracker', 70),
((SELECT id FROM categories WHERE slug = 'ai-wedding-invitation-designers' AND level = 3 LIMIT 1), 'Invitation & RSVP AI: Party Game Suggester', 'invitation-rsvp-ai-party-game-suggester', 80),
((SELECT id FROM categories WHERE slug = 'ai-wedding-invitation-designers' AND level = 3 LIMIT 1), 'Invitation & RSVP AI: Photo Memory Book AI', 'invitation-rsvp-ai-photo-memory-book-ai', 90),
((SELECT id FROM categories WHERE slug = 'ai-wedding-invitation-designers' AND level = 3 LIMIT 1), 'Wedding AI Tools: Wedding Invitation AI', 'wedding-ai-tools-wedding-invitation-ai', 100);

-- AI Win-Loss Analysis Tools (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-win-loss-analysis-tools' AND level = 3 LIMIT 1), 'Sales Intelligence: Win/Loss Analysis', 'sales-intelligence-win-loss-analysis', 10);

-- AI Window Layout Managers (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-window-layout-managers' AND level = 3 LIMIT 1), 'Garden AI: Garden Layout Planner', 'garden-ai-garden-layout-planner', 10);

-- AI X / Twitter Thread Writers (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-x-twitter-thread-writers' AND level = 3 LIMIT 1), 'Social Media Writing: Twitter/X Thread Writers', 'social-media-writing-twitter-x-thread-writers', 10),
((SELECT id FROM categories WHERE slug = 'ai-x-twitter-thread-writers' AND level = 3 LIMIT 1), 'Platform-Specific AI: Twitter/X Content AI', 'platform-specific-ai-twitter-x-content-ai', 20);

-- AI Yes-Or-No Decision Bots (5 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-yes-or-no-decision-bots' AND level = 3 LIMIT 1), 'No-Code Chatbot Platforms: Customer Service Bots', 'no-code-chatbot-platforms-customer-service-bots', 10),
((SELECT id FROM categories WHERE slug = 'ai-yes-or-no-decision-bots' AND level = 3 LIMIT 1), 'No-Code Chatbot Platforms: Lead Qualification Bots', 'no-code-chatbot-platforms-lead-qualification-bots', 20),
((SELECT id FROM categories WHERE slug = 'ai-yes-or-no-decision-bots' AND level = 3 LIMIT 1), 'No-Code Chatbot Platforms: FAQ Bots', 'no-code-chatbot-platforms-faq-bots', 30),
((SELECT id FROM categories WHERE slug = 'ai-yes-or-no-decision-bots' AND level = 3 LIMIT 1), 'No-Code Chatbot Platforms: Onboarding Bots', 'no-code-chatbot-platforms-onboarding-bots', 40),
((SELECT id FROM categories WHERE slug = 'ai-yes-or-no-decision-bots' AND level = 3 LIMIT 1), 'No-Code Chatbot Platforms: IT Helpdesk Bots', 'no-code-chatbot-platforms-it-helpdesk-bots', 50);

-- AI Yoga Sequence Builders (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-yoga-sequence-builders' AND level = 3 LIMIT 1), 'Fitness AI: Yoga Pose AI', 'fitness-ai-yoga-pose-ai', 10);

-- AI YouTube Description Writers (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-youtube-description-writers' AND level = 3 LIMIT 1), 'Social Media Writing: YouTube Description Writers', 'social-media-writing-youtube-description-writers', 10);

-- AI YouTube Thumbnail Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-youtube-thumbnail-generators' AND level = 3 LIMIT 1), 'Naming AI: YouTube Channel Name', 'naming-ai-youtube-channel-name', 10);

-- AI YouTube Title Optimizers (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'ai-youtube-title-optimizers' AND level = 3 LIMIT 1), 'Platform-Specific AI: YouTube Content AI', 'platform-specific-ai-youtube-content-ai', 10);

-- All-In-One Writing Suites (27 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'all-in-one-writing-suites' AND level = 3 LIMIT 1), 'Copywriting: Tagline & Slogan AI', 'copywriting-tagline-slogan-ai', 10),
((SELECT id FROM categories WHERE slug = 'all-in-one-writing-suites' AND level = 3 LIMIT 1), 'Copywriting: Billboard & Print Copy', 'copywriting-billboard-print-copy', 20),
((SELECT id FROM categories WHERE slug = 'all-in-one-writing-suites' AND level = 3 LIMIT 1), 'Academic Writing: Thesis Assistants', 'academic-writing-thesis-assistants', 30),
((SELECT id FROM categories WHERE slug = 'all-in-one-writing-suites' AND level = 3 LIMIT 1), 'Academic Writing: Citation Generators', 'academic-writing-citation-generators', 40),
((SELECT id FROM categories WHERE slug = 'all-in-one-writing-suites' AND level = 3 LIMIT 1), 'Academic Writing: Literature Review AI', 'academic-writing-literature-review-ai', 50),
((SELECT id FROM categories WHERE slug = 'all-in-one-writing-suites' AND level = 3 LIMIT 1), 'Academic Writing: Abstract Writers', 'academic-writing-abstract-writers', 60),
((SELECT id FROM categories WHERE slug = 'all-in-one-writing-suites' AND level = 3 LIMIT 1), 'Academic Writing: Dissertation Assistants', 'academic-writing-dissertation-assistants', 70),
((SELECT id FROM categories WHERE slug = 'all-in-one-writing-suites' AND level = 3 LIMIT 1), 'Academic Writing: Essay Outline Generators', 'academic-writing-essay-outline-generators', 80),
((SELECT id FROM categories WHERE slug = 'all-in-one-writing-suites' AND level = 3 LIMIT 1), 'Academic Writing: Peer Review Assistants', 'academic-writing-peer-review-assistants', 90),
((SELECT id FROM categories WHERE slug = 'all-in-one-writing-suites' AND level = 3 LIMIT 1), 'Creative Writing: Fiction Story Generators', 'creative-writing-fiction-story-generators', 100),
((SELECT id FROM categories WHERE slug = 'all-in-one-writing-suites' AND level = 3 LIMIT 1), 'Creative Writing: Poetry AI', 'creative-writing-poetry-ai', 110),
((SELECT id FROM categories WHERE slug = 'all-in-one-writing-suites' AND level = 3 LIMIT 1), 'Creative Writing: Screenplay Writers', 'creative-writing-screenplay-writers', 120),
((SELECT id FROM categories WHERE slug = 'all-in-one-writing-suites' AND level = 3 LIMIT 1), 'Creative Writing: Song Lyric AI', 'creative-writing-song-lyric-ai', 130),
((SELECT id FROM categories WHERE slug = 'all-in-one-writing-suites' AND level = 3 LIMIT 1), 'Creative Writing: D&D Campaign Writers', 'creative-writing-d-d-campaign-writers', 140),
((SELECT id FROM categories WHERE slug = 'all-in-one-writing-suites' AND level = 3 LIMIT 1), 'Creative Writing: Fan Fiction AI', 'creative-writing-fan-fiction-ai', 150),
((SELECT id FROM categories WHERE slug = 'all-in-one-writing-suites' AND level = 3 LIMIT 1), 'Creative Writing: Joke & Comedy Writers', 'creative-writing-joke-comedy-writers', 160),
((SELECT id FROM categories WHERE slug = 'all-in-one-writing-suites' AND level = 3 LIMIT 1), 'Creative Writing: Children''''s Story AI', 'creative-writing-children-s-story-ai', 170),
((SELECT id FROM categories WHERE slug = 'all-in-one-writing-suites' AND level = 3 LIMIT 1), 'Creative Writing: Romance Novel AI', 'creative-writing-romance-novel-ai', 180),
((SELECT id FROM categories WHERE slug = 'all-in-one-writing-suites' AND level = 3 LIMIT 1), 'Creative Writing: Sci-Fi World Builder', 'creative-writing-sci-fi-world-builder', 190),
((SELECT id FROM categories WHERE slug = 'all-in-one-writing-suites' AND level = 3 LIMIT 1), 'Grammar & Editing: Grammar Checkers', 'grammar-editing-grammar-checkers', 200);
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'all-in-one-writing-suites' AND level = 3 LIMIT 1), 'Grammar & Editing: Tone Adjusters', 'grammar-editing-tone-adjusters', 210),
((SELECT id FROM categories WHERE slug = 'all-in-one-writing-suites' AND level = 3 LIMIT 1), 'Grammar & Editing: Readability Analyzers', 'grammar-editing-readability-analyzers', 220),
((SELECT id FROM categories WHERE slug = 'all-in-one-writing-suites' AND level = 3 LIMIT 1), 'Grammar & Editing: AI Content Detectors', 'grammar-editing-ai-content-detectors', 230),
((SELECT id FROM categories WHERE slug = 'all-in-one-writing-suites' AND level = 3 LIMIT 1), 'Grammar & Editing: Paraphrasing Tools', 'grammar-editing-paraphrasing-tools', 240),
((SELECT id FROM categories WHERE slug = 'all-in-one-writing-suites' AND level = 3 LIMIT 1), 'Grammar & Editing: Proofreaders', 'grammar-editing-proofreaders', 250),
((SELECT id FROM categories WHERE slug = 'all-in-one-writing-suites' AND level = 3 LIMIT 1), 'Grammar & Editing: Fact Checkers', 'grammar-editing-fact-checkers', 260),
((SELECT id FROM categories WHERE slug = 'all-in-one-writing-suites' AND level = 3 LIMIT 1), 'Grammar & Editing: Consistency Checkers', 'grammar-editing-consistency-checkers', 270);

-- All-Purpose AI Chat Companions (27 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1), 'Vehicle AI: Vehicle Diagnostics AI', 'vehicle-ai-vehicle-diagnostics-ai', 10),
((SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1), 'Vehicle AI: EV Battery AI', 'vehicle-ai-ev-battery-ai', 20),
((SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1), 'Vehicle AI: Parking AI', 'vehicle-ai-parking-ai', 30),
((SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1), 'Vehicle AI: Dealership AI', 'vehicle-ai-dealership-ai', 40),
((SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1), 'DevOps AI: Alert Correlation AI', 'devops-ai-alert-correlation-ai', 50),
((SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1), 'DevOps AI: Chaos Engineering AI', 'devops-ai-chaos-engineering-ai', 60),
((SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1), 'Character Chat AI: Fantasy Character Chat', 'character-chat-ai-fantasy-character-chat', 70),
((SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1), 'Character Chat AI: Historical Figure Chat', 'character-chat-ai-historical-figure-chat', 80),
((SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1), 'Character Chat AI: Custom Character Creator', 'character-chat-ai-custom-character-creator', 90),
((SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1), 'Character Chat AI: Story-Driven Roleplay', 'character-chat-ai-story-driven-roleplay', 100),
((SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1), 'Character Chat AI: Interactive Fiction AI', 'character-chat-ai-interactive-fiction-ai', 110),
((SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1), 'Character Chat AI: AI Dungeon Master', 'character-chat-ai-ai-dungeon-master', 120),
((SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1), 'Character Chat AI: Visual Novel AI', 'character-chat-ai-visual-novel-ai', 130),
((SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1), 'Character Chat AI: CYOA Story AI', 'character-chat-ai-cyoa-story-ai', 140),
((SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1), 'AI Personas: Celebrity Persona Chat', 'ai-personas-celebrity-persona-chat', 150),
((SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1), 'AI Personas: Professional Mentor AI', 'ai-personas-professional-mentor-ai', 160),
((SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1), 'AI Personas: Debate Partner AI', 'ai-personas-debate-partner-ai', 170),
((SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1), 'AI Personas: AI Pen Pal', 'ai-personas-ai-pen-pal', 180),
((SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1), 'AI Personas: AI Storyteller', 'ai-personas-ai-storyteller', 190),
((SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1), 'AI Personas: Comedy Improv AI', 'ai-personas-comedy-improv-ai', 200);
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1), 'Mystical & Spiritual AI: Affirmation Generator', 'mystical-spiritual-ai-affirmation-generator', 210),
((SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1), 'Mystical & Spiritual AI: Feng Shui Advisor AI', 'mystical-spiritual-ai-feng-shui-advisor-ai', 220),
((SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1), 'Garden AI: Plant Identifier AI', 'garden-ai-plant-identifier-ai', 230),
((SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1), 'Garden AI: Companion Planting AI', 'garden-ai-companion-planting-ai', 240),
((SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1), 'Garden AI: Harvest Predictor', 'garden-ai-harvest-predictor', 250),
((SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1), 'Garden AI: Indoor Plant Advisor', 'garden-ai-indoor-plant-advisor', 260),
((SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1), 'Garden AI: Herb Garden AI', 'garden-ai-herb-garden-ai', 270);

-- Anime Character Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'anime-character-generators' AND level = 3 LIMIT 1), 'Character Chat AI: Anime Character AI', 'character-chat-ai-anime-character-ai', 10);

-- Architectural Render Generators (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'architectural-render-generators' AND level = 3 LIMIT 1), 'Architectural AI: Building Exterior AI', 'architectural-ai-building-exterior-ai', 10),
((SELECT id FROM categories WHERE slug = 'architectural-render-generators' AND level = 3 LIMIT 1), 'Architectural AI: Floor Plan Generator', 'architectural-ai-floor-plan-generator', 20),
((SELECT id FROM categories WHERE slug = 'architectural-render-generators' AND level = 3 LIMIT 1), 'Architectural AI: Landscape Architecture AI', 'architectural-ai-landscape-architecture-ai', 30),
((SELECT id FROM categories WHERE slug = 'architectural-render-generators' AND level = 3 LIMIT 1), 'Architectural AI: Urban Planning AI', 'architectural-ai-urban-planning-ai', 40),
((SELECT id FROM categories WHERE slug = 'architectural-render-generators' AND level = 3 LIMIT 1), 'Architectural AI: Facade Design AI', 'architectural-ai-facade-design-ai', 50),
((SELECT id FROM categories WHERE slug = 'architectural-render-generators' AND level = 3 LIMIT 1), 'Architectural AI: Pool Design AI', 'architectural-ai-pool-design-ai', 60),
((SELECT id FROM categories WHERE slug = 'architectural-render-generators' AND level = 3 LIMIT 1), 'Architectural AI: Deck & Patio AI', 'architectural-ai-deck-patio-ai', 70),
((SELECT id FROM categories WHERE slug = 'architectural-render-generators' AND level = 3 LIMIT 1), 'Architectural AI: Garage Design AI', 'architectural-ai-garage-design-ai', 80),
((SELECT id FROM categories WHERE slug = 'architectural-render-generators' AND level = 3 LIMIT 1), 'Architectural AI: Tiny House Designer AI', 'architectural-ai-tiny-house-designer-ai', 90),
((SELECT id FROM categories WHERE slug = 'architectural-render-generators' AND level = 3 LIMIT 1), 'Architectural AI: Container Home AI', 'architectural-ai-container-home-ai', 100);

-- Audiobook Narration Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'audiobook-narration-generators' AND level = 3 LIMIT 1), 'Text-to-Speech: Audiobook Narration', 'text-to-speech-audiobook-narration', 10);

-- Background Replacers (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'background-replacers' AND level = 3 LIMIT 1), 'Background Generation: Phone Wallpaper AI', 'background-generation-phone-wallpaper-ai', 10),
((SELECT id FROM categories WHERE slug = 'background-replacers' AND level = 3 LIMIT 1), 'Background Generation: Desktop Wallpaper AI', 'background-generation-desktop-wallpaper-ai', 20),
((SELECT id FROM categories WHERE slug = 'background-replacers' AND level = 3 LIMIT 1), 'Background Generation: Zoom Background AI', 'background-generation-zoom-background-ai', 30),
((SELECT id FROM categories WHERE slug = 'background-replacers' AND level = 3 LIMIT 1), 'Background Generation: Website Background AI', 'background-generation-website-background-ai', 40),
((SELECT id FROM categories WHERE slug = 'background-replacers' AND level = 3 LIMIT 1), 'Background Generation: Social Media Background', 'background-generation-social-media-background', 50),
((SELECT id FROM categories WHERE slug = 'background-replacers' AND level = 3 LIMIT 1), 'Background Generation: Pattern Background AI', 'background-generation-pattern-background-ai', 60),
((SELECT id FROM categories WHERE slug = 'background-replacers' AND level = 3 LIMIT 1), 'Background Generation: Gradient Generator AI', 'background-generation-gradient-generator-ai', 70),
((SELECT id FROM categories WHERE slug = 'background-replacers' AND level = 3 LIMIT 1), 'Background Generation: Geometric Background AI', 'background-generation-geometric-background-ai', 80),
((SELECT id FROM categories WHERE slug = 'background-replacers' AND level = 3 LIMIT 1), 'Background Generation: Nature Scene Generator', 'background-generation-nature-scene-generator', 90),
((SELECT id FROM categories WHERE slug = 'background-replacers' AND level = 3 LIMIT 1), 'Background Generation: Abstract Wallpaper AI', 'background-generation-abstract-wallpaper-ai', 100);

-- Banking Inquiry Bots (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'banking-inquiry-bots' AND level = 3 LIMIT 1), 'Banking AI: Fraud Detection', 'banking-ai-fraud-detection', 10),
((SELECT id FROM categories WHERE slug = 'banking-inquiry-bots' AND level = 3 LIMIT 1), 'Banking AI: Credit Scoring AI', 'banking-ai-credit-scoring-ai', 20),
((SELECT id FROM categories WHERE slug = 'banking-inquiry-bots' AND level = 3 LIMIT 1), 'Banking AI: KYC/AML AI', 'banking-ai-kyc-aml-ai', 30),
((SELECT id FROM categories WHERE slug = 'banking-inquiry-bots' AND level = 3 LIMIT 1), 'Banking AI: Robo-Advisory', 'banking-ai-robo-advisory', 40),
((SELECT id FROM categories WHERE slug = 'banking-inquiry-bots' AND level = 3 LIMIT 1), 'Banking AI: Chatbot Banking', 'banking-ai-chatbot-banking', 50),
((SELECT id FROM categories WHERE slug = 'banking-inquiry-bots' AND level = 3 LIMIT 1), 'Banking AI: Loan Underwriting AI', 'banking-ai-loan-underwriting-ai', 60),
((SELECT id FROM categories WHERE slug = 'banking-inquiry-bots' AND level = 3 LIMIT 1), 'Banking AI: Collections AI', 'banking-ai-collections-ai', 70),
((SELECT id FROM categories WHERE slug = 'banking-inquiry-bots' AND level = 3 LIMIT 1), 'Banking AI: Wealth Management AI', 'banking-ai-wealth-management-ai', 80),
((SELECT id FROM categories WHERE slug = 'banking-inquiry-bots' AND level = 3 LIMIT 1), 'Banking AI: Insurance Underwriting', 'banking-ai-insurance-underwriting', 90),
((SELECT id FROM categories WHERE slug = 'banking-inquiry-bots' AND level = 3 LIMIT 1), 'Banking AI: Claims Processing AI', 'banking-ai-claims-processing-ai', 100);

-- Browser-Based Writing Pads (7 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'browser-based-writing-pads' AND level = 3 LIMIT 1), 'AI QA Tools: Cross-Browser Test AI', 'ai-qa-tools-cross-browser-test-ai', 10),
((SELECT id FROM categories WHERE slug = 'browser-based-writing-pads' AND level = 3 LIMIT 1), 'Browsing AI: AI Tab Manager', 'browsing-ai-ai-tab-manager', 20),
((SELECT id FROM categories WHERE slug = 'browser-based-writing-pads' AND level = 3 LIMIT 1), 'Browsing AI: AI Bookmark Organizer', 'browsing-ai-ai-bookmark-organizer', 30),
((SELECT id FROM categories WHERE slug = 'browser-based-writing-pads' AND level = 3 LIMIT 1), 'Browsing AI: AI Reading Mode', 'browsing-ai-ai-reading-mode', 40),
((SELECT id FROM categories WHERE slug = 'browser-based-writing-pads' AND level = 3 LIMIT 1), 'Browsing AI: AI Page Summarizer Extension', 'browsing-ai-ai-page-summarizer-extension', 50),
((SELECT id FROM categories WHERE slug = 'browser-based-writing-pads' AND level = 3 LIMIT 1), 'Browsing AI: AI Screenshot Annotator', 'browsing-ai-ai-screenshot-annotator', 60),
((SELECT id FROM categories WHERE slug = 'browser-based-writing-pads' AND level = 3 LIMIT 1), 'Browsing AI: AI Password Generator', 'browsing-ai-ai-password-generator', 70);

-- Chatbots for WhatsApp Business (7 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'chatbots-for-whatsapp-business' AND level = 3 LIMIT 1), 'Business Writing: Business Plan Writers', 'business-writing-business-plan-writers', 10),
((SELECT id FROM categories WHERE slug = 'chatbots-for-whatsapp-business' AND level = 3 LIMIT 1), 'Business Writing: Pitch Deck Copy', 'business-writing-pitch-deck-copy', 20),
((SELECT id FROM categories WHERE slug = 'chatbots-for-whatsapp-business' AND level = 3 LIMIT 1), 'Business Writing: Investor Update Writers', 'business-writing-investor-update-writers', 30),
((SELECT id FROM categories WHERE slug = 'chatbots-for-whatsapp-business' AND level = 3 LIMIT 1), 'Business Writing: SOW & Proposal Writers', 'business-writing-sow-proposal-writers', 40),
((SELECT id FROM categories WHERE slug = 'chatbots-for-whatsapp-business' AND level = 3 LIMIT 1), 'Business Writing: SOP Generators', 'business-writing-sop-generators', 50),
((SELECT id FROM categories WHERE slug = 'chatbots-for-whatsapp-business' AND level = 3 LIMIT 1), 'Business Writing: Performance Review AI', 'business-writing-performance-review-ai', 60),
((SELECT id FROM categories WHERE slug = 'chatbots-for-whatsapp-business' AND level = 3 LIMIT 1), 'Business Writing: Company Handbook Writers', 'business-writing-company-handbook-writers', 70);

-- Children-Safe Chat Apps (9 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'children-safe-chat-apps' AND level = 3 LIMIT 1), 'Children''''s Content AI: Storybook Generator', 'children-s-content-ai-storybook-generator', 10),
((SELECT id FROM categories WHERE slug = 'children-safe-chat-apps' AND level = 3 LIMIT 1), 'Children''''s Content AI: Coloring Page AI', 'children-s-content-ai-coloring-page-ai', 20),
((SELECT id FROM categories WHERE slug = 'children-safe-chat-apps' AND level = 3 LIMIT 1), 'Children''''s Content AI: Educational Story AI', 'children-s-content-ai-educational-story-ai', 30),
((SELECT id FROM categories WHERE slug = 'children-safe-chat-apps' AND level = 3 LIMIT 1), 'Children''''s Content AI: Bedtime Story Audio AI', 'children-s-content-ai-bedtime-story-audio-ai', 40),
((SELECT id FROM categories WHERE slug = 'children-safe-chat-apps' AND level = 3 LIMIT 1), 'Children''''s Content AI: Children''''s Song AI', 'children-s-content-ai-children-s-song-ai', 50),
((SELECT id FROM categories WHERE slug = 'children-safe-chat-apps' AND level = 3 LIMIT 1), 'Children''''s Content AI: Activity Sheet Generator', 'children-s-content-ai-activity-sheet-generator', 60),
((SELECT id FROM categories WHERE slug = 'children-safe-chat-apps' AND level = 3 LIMIT 1), 'Children''''s Content AI: Flashcard Maker AI', 'children-s-content-ai-flashcard-maker-ai', 70),
((SELECT id FROM categories WHERE slug = 'children-safe-chat-apps' AND level = 3 LIMIT 1), 'Children''''s Content AI: Puzzle Generator AI', 'children-s-content-ai-puzzle-generator-ai', 80),
((SELECT id FROM categories WHERE slug = 'children-safe-chat-apps' AND level = 3 LIMIT 1), 'Children''''s Content AI: Educational Game AI', 'children-s-content-ai-educational-game-ai', 90);

-- Children's Book Illustration Generators (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'childrens-book-illustration-generators' AND level = 3 LIMIT 1), 'Children''''s Content AI: Children''''s Illustration AI', 'children-s-content-ai-children-s-illustration-ai', 10),
((SELECT id FROM categories WHERE slug = 'childrens-book-illustration-generators' AND level = 3 LIMIT 1), 'Naming AI: Book Title Generator', 'naming-ai-book-title-generator', 20);

-- Code Comment Translators (26 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'code-comment-translators' AND level = 3 LIMIT 1), 'Code Generation: Code Completion', 'code-generation-code-completion', 10),
((SELECT id FROM categories WHERE slug = 'code-comment-translators' AND level = 3 LIMIT 1), 'Code Generation: Full-Stack Code Gen', 'code-generation-full-stack-code-gen', 20),
((SELECT id FROM categories WHERE slug = 'code-comment-translators' AND level = 3 LIMIT 1), 'Code Generation: Frontend Code AI', 'code-generation-frontend-code-ai', 30),
((SELECT id FROM categories WHERE slug = 'code-comment-translators' AND level = 3 LIMIT 1), 'Code Generation: Backend Code AI', 'code-generation-backend-code-ai', 40),
((SELECT id FROM categories WHERE slug = 'code-comment-translators' AND level = 3 LIMIT 1), 'Code Generation: Mobile Code AI', 'code-generation-mobile-code-ai', 50),
((SELECT id FROM categories WHERE slug = 'code-comment-translators' AND level = 3 LIMIT 1), 'Code Generation: Database Query AI', 'code-generation-database-query-ai', 60),
((SELECT id FROM categories WHERE slug = 'code-comment-translators' AND level = 3 LIMIT 1), 'Code Generation: API Code Generator', 'code-generation-api-code-generator', 70),
((SELECT id FROM categories WHERE slug = 'code-comment-translators' AND level = 3 LIMIT 1), 'Code Generation: Script Writing AI', 'code-generation-script-writing-ai', 80),
((SELECT id FROM categories WHERE slug = 'code-comment-translators' AND level = 3 LIMIT 1), 'Code Generation: Config File Generator', 'code-generation-config-file-generator', 90),
((SELECT id FROM categories WHERE slug = 'code-comment-translators' AND level = 3 LIMIT 1), 'Code Generation: Boilerplate Generator', 'code-generation-boilerplate-generator', 100),
((SELECT id FROM categories WHERE slug = 'code-comment-translators' AND level = 3 LIMIT 1), 'Code Review & Debug: Automated Code Review', 'code-review-debug-automated-code-review', 110),
((SELECT id FROM categories WHERE slug = 'code-comment-translators' AND level = 3 LIMIT 1), 'Code Review & Debug: Bug Detection AI', 'code-review-debug-bug-detection-ai', 120),
((SELECT id FROM categories WHERE slug = 'code-comment-translators' AND level = 3 LIMIT 1), 'Code Review & Debug: Refactoring Assistant', 'code-review-debug-refactoring-assistant', 130),
((SELECT id FROM categories WHERE slug = 'code-comment-translators' AND level = 3 LIMIT 1), 'Code Review & Debug: Test Generation AI', 'code-review-debug-test-generation-ai', 140),
((SELECT id FROM categories WHERE slug = 'code-comment-translators' AND level = 3 LIMIT 1), 'Code Review & Debug: Documentation Generator', 'code-review-debug-documentation-generator', 150),
((SELECT id FROM categories WHERE slug = 'code-comment-translators' AND level = 3 LIMIT 1), 'Code Review & Debug: Dependency Analyzer', 'code-review-debug-dependency-analyzer', 160),
((SELECT id FROM categories WHERE slug = 'code-comment-translators' AND level = 3 LIMIT 1), 'QR Code AI: AI Art QR Generator', 'qr-code-ai-ai-art-qr-generator', 170),
((SELECT id FROM categories WHERE slug = 'code-comment-translators' AND level = 3 LIMIT 1), 'QR Code AI: Branded QR Codes', 'qr-code-ai-branded-qr-codes', 180),
((SELECT id FROM categories WHERE slug = 'code-comment-translators' AND level = 3 LIMIT 1), 'QR Code AI: Dynamic QR Creator', 'qr-code-ai-dynamic-qr-creator', 190),
((SELECT id FROM categories WHERE slug = 'code-comment-translators' AND level = 3 LIMIT 1), 'QR Code AI: QR Code Scanner AI', 'qr-code-ai-qr-code-scanner-ai', 200);
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'code-comment-translators' AND level = 3 LIMIT 1), 'QR Code AI: QR Menu Generator', 'qr-code-ai-qr-menu-generator', 210),
((SELECT id FROM categories WHERE slug = 'code-comment-translators' AND level = 3 LIMIT 1), 'QR Code AI: QR Business Card', 'qr-code-ai-qr-business-card', 220),
((SELECT id FROM categories WHERE slug = 'code-comment-translators' AND level = 3 LIMIT 1), 'QR Code AI: QR Event Ticket', 'qr-code-ai-qr-event-ticket', 230),
((SELECT id FROM categories WHERE slug = 'code-comment-translators' AND level = 3 LIMIT 1), 'QR Code AI: QR Product Label', 'qr-code-ai-qr-product-label', 240),
((SELECT id FROM categories WHERE slug = 'code-comment-translators' AND level = 3 LIMIT 1), 'QR Code AI: QR Wi-Fi Share', 'qr-code-ai-qr-wi-fi-share', 250),
((SELECT id FROM categories WHERE slug = 'code-comment-translators' AND level = 3 LIMIT 1), 'QR Code AI: QR Payment Link', 'qr-code-ai-qr-payment-link', 260);

-- Course Lesson Video Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'course-lesson-video-generators' AND level = 3 LIMIT 1), 'Naming AI: Course Name Generator', 'naming-ai-course-name-generator', 10);

-- Court & Legal Transcription (11 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'court-legal-transcription' AND level = 3 LIMIT 1), 'Speech-to-Text: Legal Transcription', 'speech-to-text-legal-transcription', 10),
((SELECT id FROM categories WHERE slug = 'court-legal-transcription' AND level = 3 LIMIT 1), 'Court AI: Case Prediction AI', 'court-ai-case-prediction-ai', 20),
((SELECT id FROM categories WHERE slug = 'court-legal-transcription' AND level = 3 LIMIT 1), 'Court AI: Jury Selection AI', 'court-ai-jury-selection-ai', 30),
((SELECT id FROM categories WHERE slug = 'court-legal-transcription' AND level = 3 LIMIT 1), 'Court AI: Sentencing AI', 'court-ai-sentencing-ai', 40),
((SELECT id FROM categories WHERE slug = 'court-legal-transcription' AND level = 3 LIMIT 1), 'Court AI: Bail Assessment AI', 'court-ai-bail-assessment-ai', 50),
((SELECT id FROM categories WHERE slug = 'court-legal-transcription' AND level = 3 LIMIT 1), 'Court AI: Plea Bargain AI', 'court-ai-plea-bargain-ai', 60),
((SELECT id FROM categories WHERE slug = 'court-legal-transcription' AND level = 3 LIMIT 1), 'Court AI: Evidence Analysis AI', 'court-ai-evidence-analysis-ai', 70),
((SELECT id FROM categories WHERE slug = 'court-legal-transcription' AND level = 3 LIMIT 1), 'Court AI: Witness Credibility AI', 'court-ai-witness-credibility-ai', 80),
((SELECT id FROM categories WHERE slug = 'court-legal-transcription' AND level = 3 LIMIT 1), 'Court AI: Document Discovery AI', 'court-ai-document-discovery-ai', 90),
((SELECT id FROM categories WHERE slug = 'court-legal-transcription' AND level = 3 LIMIT 1), 'Court AI: Timeline Reconstruction AI', 'court-ai-timeline-reconstruction-ai', 100),
((SELECT id FROM categories WHERE slug = 'court-legal-transcription' AND level = 3 LIMIT 1), 'Court AI: Legal Citation AI', 'court-ai-legal-citation-ai', 110);

-- Custom Voice Cloning (19 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'custom-voice-cloning' AND level = 3 LIMIT 1), 'Voice Cloning: Personal Voice Clone', 'voice-cloning-personal-voice-clone', 10),
((SELECT id FROM categories WHERE slug = 'custom-voice-cloning' AND level = 3 LIMIT 1), 'Voice Cloning: Brand Voice Clone', 'voice-cloning-brand-voice-clone', 20),
((SELECT id FROM categories WHERE slug = 'custom-voice-cloning' AND level = 3 LIMIT 1), 'Voice Cloning: Celebrity Voice Simulation', 'voice-cloning-celebrity-voice-simulation', 30),
((SELECT id FROM categories WHERE slug = 'custom-voice-cloning' AND level = 3 LIMIT 1), 'Voice Cloning: Multilingual Voice Clone', 'voice-cloning-multilingual-voice-clone', 40),
((SELECT id FROM categories WHERE slug = 'custom-voice-cloning' AND level = 3 LIMIT 1), 'Voice Cloning: Singing Voice Synthesis', 'voice-cloning-singing-voice-synthesis', 50),
((SELECT id FROM categories WHERE slug = 'custom-voice-cloning' AND level = 3 LIMIT 1), 'Voice Cloning: Emotional Voice Variation', 'voice-cloning-emotional-voice-variation', 60),
((SELECT id FROM categories WHERE slug = 'custom-voice-cloning' AND level = 3 LIMIT 1), 'Voice Cloning: Child-Safe Voice Filters', 'voice-cloning-child-safe-voice-filters', 70),
((SELECT id FROM categories WHERE slug = 'custom-voice-cloning' AND level = 3 LIMIT 1), 'Voice Cloning: Elderly Voice Restoration', 'voice-cloning-elderly-voice-restoration', 80),
((SELECT id FROM categories WHERE slug = 'custom-voice-cloning' AND level = 3 LIMIT 1), 'Voice Cloning: Accent Conversion', 'voice-cloning-accent-conversion', 90),
((SELECT id FROM categories WHERE slug = 'custom-voice-cloning' AND level = 3 LIMIT 1), 'Voice Cloning: Real-Time Voice Changer', 'voice-cloning-real-time-voice-changer', 100),
((SELECT id FROM categories WHERE slug = 'custom-voice-cloning' AND level = 3 LIMIT 1), 'Custom Model Hosting: Private Model Hosting', 'custom-model-hosting-private-model-hosting', 110),
((SELECT id FROM categories WHERE slug = 'custom-voice-cloning' AND level = 3 LIMIT 1), 'Custom Model Hosting: On-Premise LLM', 'custom-model-hosting-on-premise-llm', 120),
((SELECT id FROM categories WHERE slug = 'custom-voice-cloning' AND level = 3 LIMIT 1), 'Custom Model Hosting: Edge Model Deployment', 'custom-model-hosting-edge-model-deployment', 130),
((SELECT id FROM categories WHERE slug = 'custom-voice-cloning' AND level = 3 LIMIT 1), 'Custom Model Hosting: Model API Wrapper', 'custom-model-hosting-model-api-wrapper', 140),
((SELECT id FROM categories WHERE slug = 'custom-voice-cloning' AND level = 3 LIMIT 1), 'Custom Model Hosting: Custom Endpoint Builder', 'custom-model-hosting-custom-endpoint-builder', 150),
((SELECT id FROM categories WHERE slug = 'custom-voice-cloning' AND level = 3 LIMIT 1), 'Custom Model Hosting: A/B Model Testing', 'custom-model-hosting-a-b-model-testing', 160),
((SELECT id FROM categories WHERE slug = 'custom-voice-cloning' AND level = 3 LIMIT 1), 'Custom Model Hosting: Canary Deployment AI', 'custom-model-hosting-canary-deployment-ai', 170),
((SELECT id FROM categories WHERE slug = 'custom-voice-cloning' AND level = 3 LIMIT 1), 'Custom Model Hosting: Model Fallback System', 'custom-model-hosting-model-fallback-system', 180),
((SELECT id FROM categories WHERE slug = 'custom-voice-cloning' AND level = 3 LIMIT 1), 'Custom Model Hosting: Latency Optimizer', 'custom-model-hosting-latency-optimizer', 190);

-- Dialect-Specific Translators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'dialect-specific-translators' AND level = 3 LIMIT 1), 'Platform-Specific AI: Snapchat Content AI', 'platform-specific-ai-snapchat-content-ai', 10);

-- Difficult Conversation Scripts (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'difficult-conversation-scripts' AND level = 3 LIMIT 1), 'Copywriting: TV Commercial Scripts', 'copywriting-tv-commercial-scripts', 10);

-- Distraction-Free AI Editors (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'distraction-free-ai-editors' AND level = 3 LIMIT 1), 'Grammar & Editing: Style Editors', 'grammar-editing-style-editors', 10);

-- Drag-and-Drop Bot Builders (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'drag-and-drop-bot-builders' AND level = 3 LIMIT 1), 'Visual AI Builders: Drag-and-Drop ML', 'visual-ai-builders-drag-and-drop-ml', 10);

-- Drive-Thru Voice Agents (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'drive-thru-voice-agents' AND level = 3 LIMIT 1), 'Voice Agents: Drive-Through AI', 'voice-agents-drive-through-ai', 10);

-- Edge AI Deployment Tools (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'edge-ai-deployment-tools' AND level = 3 LIMIT 1), 'AI Infrastructure: Edge AI Deployment', 'ai-infrastructure-edge-ai-deployment', 10),
((SELECT id FROM categories WHERE slug = 'edge-ai-deployment-tools' AND level = 3 LIMIT 1), 'DevOps AI: Deployment Risk AI', 'devops-ai-deployment-risk-ai', 20);

-- Editorial Fashion Photo Generators (16 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'editorial-fashion-photo-generators' AND level = 3 LIMIT 1), 'Fashion Tech AI: Virtual Try-On Fashion', 'fashion-tech-ai-virtual-try-on-fashion', 10),
((SELECT id FROM categories WHERE slug = 'editorial-fashion-photo-generators' AND level = 3 LIMIT 1), 'Fashion Tech AI: Size Recommendation', 'fashion-tech-ai-size-recommendation', 20),
((SELECT id FROM categories WHERE slug = 'editorial-fashion-photo-generators' AND level = 3 LIMIT 1), 'Fashion Tech AI: Style Recommendation', 'fashion-tech-ai-style-recommendation', 30),
((SELECT id FROM categories WHERE slug = 'editorial-fashion-photo-generators' AND level = 3 LIMIT 1), 'Fashion Tech AI: Fashion Design AI Industry', 'fashion-tech-ai-fashion-design-ai-industry', 40),
((SELECT id FROM categories WHERE slug = 'editorial-fashion-photo-generators' AND level = 3 LIMIT 1), 'Fashion Tech AI: Fabric Selection AI', 'fashion-tech-ai-fabric-selection-ai', 50),
((SELECT id FROM categories WHERE slug = 'editorial-fashion-photo-generators' AND level = 3 LIMIT 1), 'Fashion Tech AI: Sustainable Fashion AI', 'fashion-tech-ai-sustainable-fashion-ai', 60),
((SELECT id FROM categories WHERE slug = 'editorial-fashion-photo-generators' AND level = 3 LIMIT 1), 'Fashion Tech AI: Supply Chain Fashion AI', 'fashion-tech-ai-supply-chain-fashion-ai', 70),
((SELECT id FROM categories WHERE slug = 'editorial-fashion-photo-generators' AND level = 3 LIMIT 1), 'Fashion Design AI: Clothing Design Generator', 'fashion-design-ai-clothing-design-generator', 80),
((SELECT id FROM categories WHERE slug = 'editorial-fashion-photo-generators' AND level = 3 LIMIT 1), 'Fashion Design AI: Fabric Selector AI', 'fashion-design-ai-fabric-selector-ai', 90),
((SELECT id FROM categories WHERE slug = 'editorial-fashion-photo-generators' AND level = 3 LIMIT 1), 'Fashion Design AI: Fashion Sketch AI', 'fashion-design-ai-fashion-sketch-ai', 100),
((SELECT id FROM categories WHERE slug = 'editorial-fashion-photo-generators' AND level = 3 LIMIT 1), 'Fashion Design AI: Jewelry Design AI', 'fashion-design-ai-jewelry-design-ai', 110),
((SELECT id FROM categories WHERE slug = 'editorial-fashion-photo-generators' AND level = 3 LIMIT 1), 'Fashion Design AI: Shoe Design AI', 'fashion-design-ai-shoe-design-ai', 120),
((SELECT id FROM categories WHERE slug = 'editorial-fashion-photo-generators' AND level = 3 LIMIT 1), 'Fashion Design AI: Handbag Design AI', 'fashion-design-ai-handbag-design-ai', 130),
((SELECT id FROM categories WHERE slug = 'editorial-fashion-photo-generators' AND level = 3 LIMIT 1), 'Fashion Design AI: Hat & Accessory Design AI', 'fashion-design-ai-hat-accessory-design-ai', 140),
((SELECT id FROM categories WHERE slug = 'editorial-fashion-photo-generators' AND level = 3 LIMIT 1), 'Fashion Design AI: Costume Design AI', 'fashion-design-ai-costume-design-ai', 150),
((SELECT id FROM categories WHERE slug = 'editorial-fashion-photo-generators' AND level = 3 LIMIT 1), 'Fashion Design AI: Uniform Design AI', 'fashion-design-ai-uniform-design-ai', 160);

-- Education Q&A Bots (21 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'education-qa-bots' AND level = 3 LIMIT 1), 'Teaching AI: Curriculum Design AI', 'teaching-ai-curriculum-design-ai', 10),
((SELECT id FROM categories WHERE slug = 'education-qa-bots' AND level = 3 LIMIT 1), 'Teaching AI: Student Engagement AI', 'teaching-ai-student-engagement-ai', 20),
((SELECT id FROM categories WHERE slug = 'education-qa-bots' AND level = 3 LIMIT 1), 'Teaching AI: Special Education AI', 'teaching-ai-special-education-ai', 30),
((SELECT id FROM categories WHERE slug = 'education-qa-bots' AND level = 3 LIMIT 1), 'Teaching AI: STEM Education AI', 'teaching-ai-stem-education-ai', 40),
((SELECT id FROM categories WHERE slug = 'education-qa-bots' AND level = 3 LIMIT 1), 'Teaching AI: Early Childhood AI', 'teaching-ai-early-childhood-ai', 50),
((SELECT id FROM categories WHERE slug = 'education-qa-bots' AND level = 3 LIMIT 1), 'Teaching AI: Higher Education AI', 'teaching-ai-higher-education-ai', 60),
((SELECT id FROM categories WHERE slug = 'education-qa-bots' AND level = 3 LIMIT 1), 'EdTech Infrastructure: LMS AI Features', 'edtech-infrastructure-lms-ai-features', 70),
((SELECT id FROM categories WHERE slug = 'education-qa-bots' AND level = 3 LIMIT 1), 'EdTech Infrastructure: Proctoring AI', 'edtech-infrastructure-proctoring-ai', 80),
((SELECT id FROM categories WHERE slug = 'education-qa-bots' AND level = 3 LIMIT 1), 'EdTech Infrastructure: Student Analytics AI', 'edtech-infrastructure-student-analytics-ai', 90),
((SELECT id FROM categories WHERE slug = 'education-qa-bots' AND level = 3 LIMIT 1), 'EdTech Infrastructure: Adaptive Learning', 'edtech-infrastructure-adaptive-learning', 100),
((SELECT id FROM categories WHERE slug = 'education-qa-bots' AND level = 3 LIMIT 1), 'EdTech Infrastructure: Content Authoring AI', 'edtech-infrastructure-content-authoring-ai', 110),
((SELECT id FROM categories WHERE slug = 'education-qa-bots' AND level = 3 LIMIT 1), 'EdTech Infrastructure: Accreditation AI', 'edtech-infrastructure-accreditation-ai', 120),
((SELECT id FROM categories WHERE slug = 'education-qa-bots' AND level = 3 LIMIT 1), 'Music Education AI: Guitar Chord AI', 'music-education-ai-guitar-chord-ai', 130),
((SELECT id FROM categories WHERE slug = 'education-qa-bots' AND level = 3 LIMIT 1), 'Music Education AI: Piano Tutor AI', 'music-education-ai-piano-tutor-ai', 140),
((SELECT id FROM categories WHERE slug = 'education-qa-bots' AND level = 3 LIMIT 1), 'Music Education AI: Music Theory AI', 'music-education-ai-music-theory-ai', 150),
((SELECT id FROM categories WHERE slug = 'education-qa-bots' AND level = 3 LIMIT 1), 'Music Education AI: Ear Training AI', 'music-education-ai-ear-training-ai', 160),
((SELECT id FROM categories WHERE slug = 'education-qa-bots' AND level = 3 LIMIT 1), 'Music Education AI: Sight Reading AI', 'music-education-ai-sight-reading-ai', 170),
((SELECT id FROM categories WHERE slug = 'education-qa-bots' AND level = 3 LIMIT 1), 'Music Education AI: Rhythm Trainer', 'music-education-ai-rhythm-trainer', 180),
((SELECT id FROM categories WHERE slug = 'education-qa-bots' AND level = 3 LIMIT 1), 'Music Education AI: Instrument Tuner AI', 'music-education-ai-instrument-tuner-ai', 190),
((SELECT id FROM categories WHERE slug = 'education-qa-bots' AND level = 3 LIMIT 1), 'Music Education AI: Song Key Finder', 'music-education-ai-song-key-finder', 200);
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'education-qa-bots' AND level = 3 LIMIT 1), 'Music Education AI: Music Practice Scheduler', 'music-education-ai-music-practice-scheduler', 210);

-- Email Course Drafting (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'email-course-drafting' AND level = 3 LIMIT 1), 'Copywriting: Email Subject Line AI', 'copywriting-email-subject-line-ai', 10),
((SELECT id FROM categories WHERE slug = 'email-course-drafting' AND level = 3 LIMIT 1), 'Email Writing: Cold Email Writers', 'email-writing-cold-email-writers', 20),
((SELECT id FROM categories WHERE slug = 'email-course-drafting' AND level = 3 LIMIT 1), 'Email Writing: Newsletter Composers', 'email-writing-newsletter-composers', 30),
((SELECT id FROM categories WHERE slug = 'email-course-drafting' AND level = 3 LIMIT 1), 'Email Writing: Transactional Email Writers', 'email-writing-transactional-email-writers', 40),
((SELECT id FROM categories WHERE slug = 'email-course-drafting' AND level = 3 LIMIT 1), 'Email Writing: Drip Campaign Writers', 'email-writing-drip-campaign-writers', 50),
((SELECT id FROM categories WHERE slug = 'email-course-drafting' AND level = 3 LIMIT 1), 'Email Writing: Outreach Email AI', 'email-writing-outreach-email-ai', 60),
((SELECT id FROM categories WHERE slug = 'email-course-drafting' AND level = 3 LIMIT 1), 'Email Writing: Customer Win-Back Emails', 'email-writing-customer-win-back-emails', 70),
((SELECT id FROM categories WHERE slug = 'email-course-drafting' AND level = 3 LIMIT 1), 'Email Writing: Welcome Sequence Writers', 'email-writing-welcome-sequence-writers', 80),
((SELECT id FROM categories WHERE slug = 'email-course-drafting' AND level = 3 LIMIT 1), 'Email Writing: Apology Email AI', 'email-writing-apology-email-ai', 90),
((SELECT id FROM categories WHERE slug = 'email-course-drafting' AND level = 3 LIMIT 1), 'Email Writing: Internal Memo Writers', 'email-writing-internal-memo-writers', 100);

-- Episodic Memory Systems (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'episodic-memory-systems' AND level = 3 LIMIT 1), 'Agent Building: Agent Memory Systems', 'agent-building-agent-memory-systems', 10);

-- Event Poster Generators (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'event-poster-generators' AND level = 3 LIMIT 1), 'Pharmaceutical AI: Adverse Event AI', 'pharmaceutical-ai-adverse-event-ai', 10),
((SELECT id FROM categories WHERE slug = 'event-poster-generators' AND level = 3 LIMIT 1), 'Event Planning AI: Party Planner AI', 'event-planning-ai-party-planner-ai', 20),
((SELECT id FROM categories WHERE slug = 'event-poster-generators' AND level = 3 LIMIT 1), 'Event Planning AI: Birthday Planner AI', 'event-planning-ai-birthday-planner-ai', 30),
((SELECT id FROM categories WHERE slug = 'event-poster-generators' AND level = 3 LIMIT 1), 'Event Planning AI: Baby Shower Planner AI', 'event-planning-ai-baby-shower-planner-ai', 40),
((SELECT id FROM categories WHERE slug = 'event-poster-generators' AND level = 3 LIMIT 1), 'Event Planning AI: Reunion Planner AI', 'event-planning-ai-reunion-planner-ai', 50),
((SELECT id FROM categories WHERE slug = 'event-poster-generators' AND level = 3 LIMIT 1), 'Event Planning AI: Holiday Planner AI', 'event-planning-ai-holiday-planner-ai', 60),
((SELECT id FROM categories WHERE slug = 'event-poster-generators' AND level = 3 LIMIT 1), 'Event Planning AI: Graduation Party AI', 'event-planning-ai-graduation-party-ai', 70),
((SELECT id FROM categories WHERE slug = 'event-poster-generators' AND level = 3 LIMIT 1), 'Event Planning AI: Anniversary Planner AI', 'event-planning-ai-anniversary-planner-ai', 80),
((SELECT id FROM categories WHERE slug = 'event-poster-generators' AND level = 3 LIMIT 1), 'Event Planning AI: Farewell Party AI', 'event-planning-ai-farewell-party-ai', 90),
((SELECT id FROM categories WHERE slug = 'event-poster-generators' AND level = 3 LIMIT 1), 'Event Planning AI: Theme Party AI', 'event-planning-ai-theme-party-ai', 100);

-- FAQ Auto-Reply Bots (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'faq-auto-reply-bots' AND level = 3 LIMIT 1), 'DevOps AI: Auto-Scaling AI', 'devops-ai-auto-scaling-ai', 10),
((SELECT id FROM categories WHERE slug = 'faq-auto-reply-bots' AND level = 3 LIMIT 1), 'Browsing AI: AI Auto-Fill', 'browsing-ai-ai-auto-fill', 20);

-- Game Character Voice Generators (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'game-character-voice-generators' AND level = 3 LIMIT 1), 'Character Chat AI: Adventure Game AI', 'character-chat-ai-adventure-game-ai', 10),
((SELECT id FROM categories WHERE slug = 'game-character-voice-generators' AND level = 3 LIMIT 1), 'Game Asset AI: Game Character Generator', 'game-asset-ai-game-character-generator', 20);

-- Greeting Card Image Generators (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'greeting-card-image-generators' AND level = 3 LIMIT 1), 'AI Logo & Brand: Business Card Designers', 'ai-logo-brand-business-card-designers', 10),
((SELECT id FROM categories WHERE slug = 'greeting-card-image-generators' AND level = 3 LIMIT 1), 'Mystical & Spiritual AI: Oracle Card Reader AI', 'mystical-spiritual-ai-oracle-card-reader-ai', 20);

-- Healthcare Intake Bots (9 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'healthcare-intake-bots' AND level = 3 LIMIT 1), 'Healthcare Operations: Hospital Scheduling AI', 'healthcare-operations-hospital-scheduling-ai', 10),
((SELECT id FROM categories WHERE slug = 'healthcare-intake-bots' AND level = 3 LIMIT 1), 'Healthcare Operations: Patient Flow AI', 'healthcare-operations-patient-flow-ai', 20),
((SELECT id FROM categories WHERE slug = 'healthcare-intake-bots' AND level = 3 LIMIT 1), 'Healthcare Operations: Billing & Coding AI', 'healthcare-operations-billing-coding-ai', 30),
((SELECT id FROM categories WHERE slug = 'healthcare-intake-bots' AND level = 3 LIMIT 1), 'Healthcare Operations: Claims Processing AI', 'healthcare-operations-claims-processing-ai', 40),
((SELECT id FROM categories WHERE slug = 'healthcare-intake-bots' AND level = 3 LIMIT 1), 'Healthcare Operations: Population Health AI', 'healthcare-operations-population-health-ai', 50),
((SELECT id FROM categories WHERE slug = 'healthcare-intake-bots' AND level = 3 LIMIT 1), 'Healthcare Operations: Care Coordination AI', 'healthcare-operations-care-coordination-ai', 60),
((SELECT id FROM categories WHERE slug = 'healthcare-intake-bots' AND level = 3 LIMIT 1), 'Healthcare Operations: Telehealth AI', 'healthcare-operations-telehealth-ai', 70),
((SELECT id FROM categories WHERE slug = 'healthcare-intake-bots' AND level = 3 LIMIT 1), 'Healthcare Operations: Nursing AI', 'healthcare-operations-nursing-ai', 80),
((SELECT id FROM categories WHERE slug = 'healthcare-intake-bots' AND level = 3 LIMIT 1), 'Healthcare Operations: Pharmacy AI', 'healthcare-operations-pharmacy-ai', 90);

-- How-To Guide Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'how-to-guide-generators' AND level = 3 LIMIT 1), 'Mystical & Spiritual AI: Meditation Guide AI', 'mystical-spiritual-ai-meditation-guide-ai', 10);

-- Hyperrealistic Photo Generators (22 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'hyperrealistic-photo-generators' AND level = 3 LIMIT 1), 'AI QA Tools: AI Test Generation', 'ai-qa-tools-ai-test-generation', 10),
((SELECT id FROM categories WHERE slug = 'hyperrealistic-photo-generators' AND level = 3 LIMIT 1), 'Photo Effects AI: AI Filters & Presets', 'photo-effects-ai-ai-filters-presets', 20),
((SELECT id FROM categories WHERE slug = 'hyperrealistic-photo-generators' AND level = 3 LIMIT 1), 'Photo Effects AI: Photo to Cartoon', 'photo-effects-ai-photo-to-cartoon', 30),
((SELECT id FROM categories WHERE slug = 'hyperrealistic-photo-generators' AND level = 3 LIMIT 1), 'Photo Effects AI: Photo to Sketch', 'photo-effects-ai-photo-to-sketch', 40),
((SELECT id FROM categories WHERE slug = 'hyperrealistic-photo-generators' AND level = 3 LIMIT 1), 'Photo Effects AI: Photo to Painting', 'photo-effects-ai-photo-to-painting', 50),
((SELECT id FROM categories WHERE slug = 'hyperrealistic-photo-generators' AND level = 3 LIMIT 1), 'Photo Effects AI: Photo Colorization', 'photo-effects-ai-photo-colorization', 60),
((SELECT id FROM categories WHERE slug = 'hyperrealistic-photo-generators' AND level = 3 LIMIT 1), 'Photo Effects AI: Face Swap AI', 'photo-effects-ai-face-swap-ai', 70),
((SELECT id FROM categories WHERE slug = 'hyperrealistic-photo-generators' AND level = 3 LIMIT 1), 'Photo Effects AI: Age Progression AI', 'photo-effects-ai-age-progression-ai', 80),
((SELECT id FROM categories WHERE slug = 'hyperrealistic-photo-generators' AND level = 3 LIMIT 1), 'Photo Effects AI: Gender Swap AI', 'photo-effects-ai-gender-swap-ai', 90),
((SELECT id FROM categories WHERE slug = 'hyperrealistic-photo-generators' AND level = 3 LIMIT 1), 'Photo Effects AI: Hairstyle Changer AI', 'photo-effects-ai-hairstyle-changer-ai', 100),
((SELECT id FROM categories WHERE slug = 'hyperrealistic-photo-generators' AND level = 3 LIMIT 1), 'Photo Effects AI: Makeup Try-On AI', 'photo-effects-ai-makeup-try-on-ai', 110),
((SELECT id FROM categories WHERE slug = 'hyperrealistic-photo-generators' AND level = 3 LIMIT 1), 'Photo Utility AI: Image to Text (Alt Text)', 'photo-utility-ai-image-to-text-alt-text', 120),
((SELECT id FROM categories WHERE slug = 'hyperrealistic-photo-generators' AND level = 3 LIMIT 1), 'Photo Utility AI: Image Metadata Editor', 'photo-utility-ai-image-metadata-editor', 130),
((SELECT id FROM categories WHERE slug = 'hyperrealistic-photo-generators' AND level = 3 LIMIT 1), 'Photo Utility AI: Image Geolocator', 'photo-utility-ai-image-geolocator', 140),
((SELECT id FROM categories WHERE slug = 'hyperrealistic-photo-generators' AND level = 3 LIMIT 1), 'Photo Utility AI: Color Picker from Image', 'photo-utility-ai-color-picker-from-image', 150),
((SELECT id FROM categories WHERE slug = 'hyperrealistic-photo-generators' AND level = 3 LIMIT 1), 'Photo Utility AI: Image Watermark Adder', 'photo-utility-ai-image-watermark-adder', 160),
((SELECT id FROM categories WHERE slug = 'hyperrealistic-photo-generators' AND level = 3 LIMIT 1), 'Photo Utility AI: Image Watermark Remover', 'photo-utility-ai-image-watermark-remover', 170),
((SELECT id FROM categories WHERE slug = 'hyperrealistic-photo-generators' AND level = 3 LIMIT 1), 'Photo Utility AI: Image Comparison Slider', 'photo-utility-ai-image-comparison-slider', 180),
((SELECT id FROM categories WHERE slug = 'hyperrealistic-photo-generators' AND level = 3 LIMIT 1), 'Photo Utility AI: Image Annotation AI', 'photo-utility-ai-image-annotation-ai', 190),
((SELECT id FROM categories WHERE slug = 'hyperrealistic-photo-generators' AND level = 3 LIMIT 1), 'Photo Utility AI: Image Cropper AI', 'photo-utility-ai-image-cropper-ai', 200);
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'hyperrealistic-photo-generators' AND level = 3 LIMIT 1), 'Photo Utility AI: Image Batch Processor', 'photo-utility-ai-image-batch-processor', 210),
((SELECT id FROM categories WHERE slug = 'hyperrealistic-photo-generators' AND level = 3 LIMIT 1), 'Location AI: Satellite Image Analysis', 'location-ai-satellite-image-analysis', 220);

-- In-Car Voice Assistants (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'in-car-voice-assistants' AND level = 3 LIMIT 1), 'Vehicle AI: Connected Car AI', 'vehicle-ai-connected-car-ai', 10);

-- In-IDE Inline Coding Copilots (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'in-ide-inline-coding-copilots' AND level = 3 LIMIT 1), 'Specialized Coding: SQL Query AI', 'specialized-coding-sql-query-ai', 10),
((SELECT id FROM categories WHERE slug = 'in-ide-inline-coding-copilots' AND level = 3 LIMIT 1), 'Specialized Coding: Regex Generator', 'specialized-coding-regex-generator', 20),
((SELECT id FROM categories WHERE slug = 'in-ide-inline-coding-copilots' AND level = 3 LIMIT 1), 'Specialized Coding: Shell Script AI', 'specialized-coding-shell-script-ai', 30),
((SELECT id FROM categories WHERE slug = 'in-ide-inline-coding-copilots' AND level = 3 LIMIT 1), 'Specialized Coding: Data Pipeline Code', 'specialized-coding-data-pipeline-code', 40),
((SELECT id FROM categories WHERE slug = 'in-ide-inline-coding-copilots' AND level = 3 LIMIT 1), 'Specialized Coding: Infrastructure as Code', 'specialized-coding-infrastructure-as-code', 50),
((SELECT id FROM categories WHERE slug = 'in-ide-inline-coding-copilots' AND level = 3 LIMIT 1), 'Specialized Coding: CI/CD Config Generator', 'specialized-coding-ci-cd-config-generator', 60),
((SELECT id FROM categories WHERE slug = 'in-ide-inline-coding-copilots' AND level = 3 LIMIT 1), 'Specialized Coding: Dockerfile Generator', 'specialized-coding-dockerfile-generator', 70),
((SELECT id FROM categories WHERE slug = 'in-ide-inline-coding-copilots' AND level = 3 LIMIT 1), 'Specialized Coding: Kubernetes YAML AI', 'specialized-coding-kubernetes-yaml-ai', 80),
((SELECT id FROM categories WHERE slug = 'in-ide-inline-coding-copilots' AND level = 3 LIMIT 1), 'Specialized Coding: Terraform Generator', 'specialized-coding-terraform-generator', 90),
((SELECT id FROM categories WHERE slug = 'in-ide-inline-coding-copilots' AND level = 3 LIMIT 1), 'Specialized Coding: CloudFormation AI', 'specialized-coding-cloudformation-ai', 100);

-- Insurance Quote Bots (8 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'insurance-quote-bots' AND level = 3 LIMIT 1), 'Vehicle AI: Insurance Telematics', 'vehicle-ai-insurance-telematics', 10),
((SELECT id FROM categories WHERE slug = 'insurance-quote-bots' AND level = 3 LIMIT 1), 'Insurance AI: Policy Pricing AI', 'insurance-ai-policy-pricing-ai', 20),
((SELECT id FROM categories WHERE slug = 'insurance-quote-bots' AND level = 3 LIMIT 1), 'Insurance AI: Fraud Detection Insurance', 'insurance-ai-fraud-detection-insurance', 30),
((SELECT id FROM categories WHERE slug = 'insurance-quote-bots' AND level = 3 LIMIT 1), 'Insurance AI: Risk Assessment Insurance', 'insurance-ai-risk-assessment-insurance', 40),
((SELECT id FROM categories WHERE slug = 'insurance-quote-bots' AND level = 3 LIMIT 1), 'Insurance AI: Customer Retention Insurance', 'insurance-ai-customer-retention-insurance', 50),
((SELECT id FROM categories WHERE slug = 'insurance-quote-bots' AND level = 3 LIMIT 1), 'Insurance AI: Policy Recommendation', 'insurance-ai-policy-recommendation', 60),
((SELECT id FROM categories WHERE slug = 'insurance-quote-bots' AND level = 3 LIMIT 1), 'Insurance AI: Damage Assessment AI', 'insurance-ai-damage-assessment-ai', 70),
((SELECT id FROM categories WHERE slug = 'insurance-quote-bots' AND level = 3 LIMIT 1), 'Insurance AI: Compliance Insurance AI', 'insurance-ai-compliance-insurance-ai', 80);

-- Interview Transcription Tools (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'interview-transcription-tools' AND level = 3 LIMIT 1), 'Speech-to-Text: Interview Transcription', 'speech-to-text-interview-transcription', 10),
((SELECT id FROM categories WHERE slug = 'interview-transcription-tools' AND level = 3 LIMIT 1), 'AI Personas: Interview Practice AI', 'ai-personas-interview-practice-ai', 20);

-- Job Description Drafting (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'job-description-drafting' AND level = 3 LIMIT 1), 'Business Writing: Job Description Writers', 'business-writing-job-description-writers', 10);

-- Knowledge-Grounded Q&A Bots (11 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'knowledge-grounded-qa-bots' AND level = 3 LIMIT 1), 'AI Knowledge Base Bots: Document Q&A Bots', 'ai-knowledge-base-bots-document-q-a-bots', 10),
((SELECT id FROM categories WHERE slug = 'knowledge-grounded-qa-bots' AND level = 3 LIMIT 1), 'AI Knowledge Base Bots: PDF Chat Bots', 'ai-knowledge-base-bots-pdf-chat-bots', 20),
((SELECT id FROM categories WHERE slug = 'knowledge-grounded-qa-bots' AND level = 3 LIMIT 1), 'AI Knowledge Base Bots: Website Chat Widgets', 'ai-knowledge-base-bots-website-chat-widgets', 30),
((SELECT id FROM categories WHERE slug = 'knowledge-grounded-qa-bots' AND level = 3 LIMIT 1), 'AI Knowledge Base Bots: Internal Wiki Bots', 'ai-knowledge-base-bots-internal-wiki-bots', 40),
((SELECT id FROM categories WHERE slug = 'knowledge-grounded-qa-bots' AND level = 3 LIMIT 1), 'AI Knowledge Base Bots: Legal Document Bots', 'ai-knowledge-base-bots-legal-document-bots', 50),
((SELECT id FROM categories WHERE slug = 'knowledge-grounded-qa-bots' AND level = 3 LIMIT 1), 'AI Knowledge Base Bots: Medical Knowledge Bots', 'ai-knowledge-base-bots-medical-knowledge-bots', 60),
((SELECT id FROM categories WHERE slug = 'knowledge-grounded-qa-bots' AND level = 3 LIMIT 1), 'AI Knowledge Base Bots: Technical Support Bots', 'ai-knowledge-base-bots-technical-support-bots', 70),
((SELECT id FROM categories WHERE slug = 'knowledge-grounded-qa-bots' AND level = 3 LIMIT 1), 'AI Knowledge Base Bots: Training Material Bots', 'ai-knowledge-base-bots-training-material-bots', 80),
((SELECT id FROM categories WHERE slug = 'knowledge-grounded-qa-bots' AND level = 3 LIMIT 1), 'AI Knowledge Base Bots: Policy Compliance Bots', 'ai-knowledge-base-bots-policy-compliance-bots', 90),
((SELECT id FROM categories WHERE slug = 'knowledge-grounded-qa-bots' AND level = 3 LIMIT 1), 'AI Knowledge Base Bots: Research Paper Bots', 'ai-knowledge-base-bots-research-paper-bots', 100),
((SELECT id FROM categories WHERE slug = 'knowledge-grounded-qa-bots' AND level = 3 LIMIT 1), 'Multi-Channel Bots: SMS Chatbots', 'multi-channel-bots-sms-chatbots', 110);

-- Lead-Capture Web Bots (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'lead-capture-web-bots' AND level = 3 LIMIT 1), 'Browsing AI: AI Web Clipper', 'browsing-ai-ai-web-clipper', 10),
((SELECT id FROM categories WHERE slug = 'lead-capture-web-bots' AND level = 3 LIMIT 1), 'Web Data AI: Lead Scraper AI', 'web-data-ai-lead-scraper-ai', 20);

-- Lecture Transcription Tools (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'lecture-transcription-tools' AND level = 3 LIMIT 1), 'Speech-to-Text: Lecture Transcription', 'speech-to-text-lecture-transcription', 10);

-- Lifestyle Stock Image Generators (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'lifestyle-stock-image-generators' AND level = 3 LIMIT 1), 'Stock & Asset Generation: AI Stock Photos', 'stock-asset-generation-ai-stock-photos', 10),
((SELECT id FROM categories WHERE slug = 'lifestyle-stock-image-generators' AND level = 3 LIMIT 1), 'Stock & Asset Generation: Icon Generators', 'stock-asset-generation-icon-generators', 20),
((SELECT id FROM categories WHERE slug = 'lifestyle-stock-image-generators' AND level = 3 LIMIT 1), 'Stock & Asset Generation: Pattern Generators', 'stock-asset-generation-pattern-generators', 30),
((SELECT id FROM categories WHERE slug = 'lifestyle-stock-image-generators' AND level = 3 LIMIT 1), 'Stock & Asset Generation: Texture Creators', 'stock-asset-generation-texture-creators', 40),
((SELECT id FROM categories WHERE slug = 'lifestyle-stock-image-generators' AND level = 3 LIMIT 1), 'Stock & Asset Generation: Mockup Generators', 'stock-asset-generation-mockup-generators', 50),
((SELECT id FROM categories WHERE slug = 'lifestyle-stock-image-generators' AND level = 3 LIMIT 1), 'Stock & Asset Generation: Infographic AI', 'stock-asset-generation-infographic-ai', 60),
((SELECT id FROM categories WHERE slug = 'lifestyle-stock-image-generators' AND level = 3 LIMIT 1), 'Stock & Asset Generation: Chart & Graph AI', 'stock-asset-generation-chart-graph-ai', 70),
((SELECT id FROM categories WHERE slug = 'lifestyle-stock-image-generators' AND level = 3 LIMIT 1), 'Stock & Asset Generation: Map Illustration AI', 'stock-asset-generation-map-illustration-ai', 80),
((SELECT id FROM categories WHERE slug = 'lifestyle-stock-image-generators' AND level = 3 LIMIT 1), 'Stock & Asset Generation: Emoji & Sticker Creators', 'stock-asset-generation-emoji-sticker-creators', 90),
((SELECT id FROM categories WHERE slug = 'lifestyle-stock-image-generators' AND level = 3 LIMIT 1), 'Stock & Asset Generation: Meme Generators', 'stock-asset-generation-meme-generators', 100);

-- Listicle Generators (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'listicle-generators' AND level = 3 LIMIT 1), 'Copywriting: Ad Copy Generators', 'copywriting-ad-copy-generators', 10),
((SELECT id FROM categories WHERE slug = 'listicle-generators' AND level = 3 LIMIT 1), 'Copywriting: Headline Generators', 'copywriting-headline-generators', 20);

-- LLM Gateway Routers (11 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'llm-gateway-routers' AND level = 3 LIMIT 1), 'MCP & Integrations: LLM Gateway Builder', 'mcp-integrations-llm-gateway-builder', 10),
((SELECT id FROM categories WHERE slug = 'llm-gateway-routers' AND level = 3 LIMIT 1), 'LLM Observability: LLM Token Tracking', 'llm-observability-llm-token-tracking', 20),
((SELECT id FROM categories WHERE slug = 'llm-gateway-routers' AND level = 3 LIMIT 1), 'LLM Observability: Prompt & Response Logging', 'llm-observability-prompt-response-logging', 30),
((SELECT id FROM categories WHERE slug = 'llm-gateway-routers' AND level = 3 LIMIT 1), 'LLM Observability: Hallucination Detection', 'llm-observability-hallucination-detection', 40),
((SELECT id FROM categories WHERE slug = 'llm-gateway-routers' AND level = 3 LIMIT 1), 'LLM Observability: Cost Attribution', 'llm-observability-cost-attribution', 50),
((SELECT id FROM categories WHERE slug = 'llm-gateway-routers' AND level = 3 LIMIT 1), 'LLM Observability: Latency Monitoring', 'llm-observability-latency-monitoring', 60),
((SELECT id FROM categories WHERE slug = 'llm-gateway-routers' AND level = 3 LIMIT 1), 'LLM Observability: Quality Scoring', 'llm-observability-quality-scoring', 70),
((SELECT id FROM categories WHERE slug = 'llm-gateway-routers' AND level = 3 LIMIT 1), 'LLM Observability: User Feedback Collection', 'llm-observability-user-feedback-collection', 80),
((SELECT id FROM categories WHERE slug = 'llm-gateway-routers' AND level = 3 LIMIT 1), 'LLM Observability: Drift Detection LLM', 'llm-observability-drift-detection-llm', 90),
((SELECT id FROM categories WHERE slug = 'llm-gateway-routers' AND level = 3 LIMIT 1), 'LLM Observability: Compliance Logging', 'llm-observability-compliance-logging', 100),
((SELECT id FROM categories WHERE slug = 'llm-gateway-routers' AND level = 3 LIMIT 1), 'LLM Observability: Audit Trail AI', 'llm-observability-audit-trail-ai', 110);

-- Long-Form Article Drafting (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'long-form-article-drafting' AND level = 3 LIMIT 1), 'Long-Form Writing: Blog Post Generators', 'long-form-writing-blog-post-generators', 10),
((SELECT id FROM categories WHERE slug = 'long-form-article-drafting' AND level = 3 LIMIT 1), 'Long-Form Writing: Article Writers', 'long-form-writing-article-writers', 20),
((SELECT id FROM categories WHERE slug = 'long-form-article-drafting' AND level = 3 LIMIT 1), 'Long-Form Writing: Book Writing AI', 'long-form-writing-book-writing-ai', 30),
((SELECT id FROM categories WHERE slug = 'long-form-article-drafting' AND level = 3 LIMIT 1), 'Long-Form Writing: Whitepaper Generators', 'long-form-writing-whitepaper-generators', 40),
((SELECT id FROM categories WHERE slug = 'long-form-article-drafting' AND level = 3 LIMIT 1), 'Long-Form Writing: Case Study Writers', 'long-form-writing-case-study-writers', 50),
((SELECT id FROM categories WHERE slug = 'long-form-article-drafting' AND level = 3 LIMIT 1), 'Long-Form Writing: Report Generators', 'long-form-writing-report-generators', 60),
((SELECT id FROM categories WHERE slug = 'long-form-article-drafting' AND level = 3 LIMIT 1), 'Long-Form Writing: Ebook Creators', 'long-form-writing-ebook-creators', 70),
((SELECT id FROM categories WHERE slug = 'long-form-article-drafting' AND level = 3 LIMIT 1), 'Long-Form Writing: Newsletter Writers', 'long-form-writing-newsletter-writers', 80),
((SELECT id FROM categories WHERE slug = 'long-form-article-drafting' AND level = 3 LIMIT 1), 'Long-Form Writing: Press Release Writers', 'long-form-writing-press-release-writers', 90),
((SELECT id FROM categories WHERE slug = 'long-form-article-drafting' AND level = 3 LIMIT 1), 'Long-Form Writing: Ghostwriting AI', 'long-form-writing-ghostwriting-ai', 100);

-- Manga & Comic Translators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'manga-comic-translators' AND level = 3 LIMIT 1), 'Meme Creation AI: Comic Strip AI', 'meme-creation-ai-comic-strip-ai', 10);

-- Medical Dictation Transcription (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'medical-dictation-transcription' AND level = 3 LIMIT 1), 'Speech-to-Text: Medical Dictation', 'speech-to-text-medical-dictation', 10);

-- Meeting Agenda Drafting (7 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'meeting-agenda-drafting' AND level = 3 LIMIT 1), 'Meeting AI Tools: Meeting Scheduler AI', 'meeting-ai-tools-meeting-scheduler-ai', 10),
((SELECT id FROM categories WHERE slug = 'meeting-agenda-drafting' AND level = 3 LIMIT 1), 'Meeting AI Tools: Agenda Generator AI', 'meeting-ai-tools-agenda-generator-ai', 20),
((SELECT id FROM categories WHERE slug = 'meeting-agenda-drafting' AND level = 3 LIMIT 1), 'Meeting AI Tools: Meeting Summary Email AI', 'meeting-ai-tools-meeting-summary-email-ai', 30),
((SELECT id FROM categories WHERE slug = 'meeting-agenda-drafting' AND level = 3 LIMIT 1), 'Meeting AI Tools: Meeting Cost Calculator', 'meeting-ai-tools-meeting-cost-calculator', 40),
((SELECT id FROM categories WHERE slug = 'meeting-agenda-drafting' AND level = 3 LIMIT 1), 'Meeting AI Tools: Standup Bot AI', 'meeting-ai-tools-standup-bot-ai', 50),
((SELECT id FROM categories WHERE slug = 'meeting-agenda-drafting' AND level = 3 LIMIT 1), 'Meeting AI Tools: Retrospective Facilitator AI', 'meeting-ai-tools-retrospective-facilitator-ai', 60),
((SELECT id FROM categories WHERE slug = 'meeting-agenda-drafting' AND level = 3 LIMIT 1), 'Meeting AI Tools: 1-on-1 Question Generator', 'meeting-ai-tools-1-on-1-question-generator', 70);

-- Meeting Minutes Drafting (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'meeting-minutes-drafting' AND level = 3 LIMIT 1), 'Business Writing: Meeting Minutes AI', 'business-writing-meeting-minutes-ai', 10),
((SELECT id FROM categories WHERE slug = 'meeting-minutes-drafting' AND level = 3 LIMIT 1), 'Meeting AI Tools: Real-Time Minutes AI', 'meeting-ai-tools-real-time-minutes-ai', 20);

-- Memory Management Libraries (17 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'memory-management-libraries' AND level = 3 LIMIT 1), 'Advertising AI: Bid Management AI', 'advertising-ai-bid-management-ai', 10),
((SELECT id FROM categories WHERE slug = 'memory-management-libraries' AND level = 3 LIMIT 1), 'EdTech Infrastructure: Classroom Management AI', 'edtech-infrastructure-classroom-management-ai', 20),
((SELECT id FROM categories WHERE slug = 'memory-management-libraries' AND level = 3 LIMIT 1), 'Vehicle AI: Fleet Management AI', 'vehicle-ai-fleet-management-ai', 30),
((SELECT id FROM categories WHERE slug = 'memory-management-libraries' AND level = 3 LIMIT 1), 'PM AI: Resource Allocation AI', 'pm-ai-resource-allocation-ai', 40),
((SELECT id FROM categories WHERE slug = 'memory-management-libraries' AND level = 3 LIMIT 1), 'PM AI: Risk Prediction PM', 'pm-ai-risk-prediction-pm', 50),
((SELECT id FROM categories WHERE slug = 'memory-management-libraries' AND level = 3 LIMIT 1), 'PM AI: Status Reporting AI', 'pm-ai-status-reporting-ai', 60),
((SELECT id FROM categories WHERE slug = 'memory-management-libraries' AND level = 3 LIMIT 1), 'PM AI: Estimation AI', 'pm-ai-estimation-ai', 70),
((SELECT id FROM categories WHERE slug = 'memory-management-libraries' AND level = 3 LIMIT 1), 'PM AI: Retrospective AI', 'pm-ai-retrospective-ai', 80),
((SELECT id FROM categories WHERE slug = 'memory-management-libraries' AND level = 3 LIMIT 1), 'PM AI: Stakeholder Management AI', 'pm-ai-stakeholder-management-ai', 90),
((SELECT id FROM categories WHERE slug = 'memory-management-libraries' AND level = 3 LIMIT 1), 'Home Management AI: Home Maintenance Scheduler', 'home-management-ai-home-maintenance-scheduler', 100),
((SELECT id FROM categories WHERE slug = 'memory-management-libraries' AND level = 3 LIMIT 1), 'Home Management AI: Energy Usage Optimizer', 'home-management-ai-energy-usage-optimizer', 110),
((SELECT id FROM categories WHERE slug = 'memory-management-libraries' AND level = 3 LIMIT 1), 'Home Management AI: Decluttering AI', 'home-management-ai-decluttering-ai', 120),
((SELECT id FROM categories WHERE slug = 'memory-management-libraries' AND level = 3 LIMIT 1), 'Home Management AI: Moving Planner AI', 'home-management-ai-moving-planner-ai', 130),
((SELECT id FROM categories WHERE slug = 'memory-management-libraries' AND level = 3 LIMIT 1), 'Home Management AI: Cleaning Schedule AI', 'home-management-ai-cleaning-schedule-ai', 140),
((SELECT id FROM categories WHERE slug = 'memory-management-libraries' AND level = 3 LIMIT 1), 'Home Management AI: Home Insurance Advisor', 'home-management-ai-home-insurance-advisor', 150),
((SELECT id FROM categories WHERE slug = 'memory-management-libraries' AND level = 3 LIMIT 1), 'MCP & Integrations: Context Management', 'mcp-integrations-context-management', 160),
((SELECT id FROM categories WHERE slug = 'memory-management-libraries' AND level = 3 LIMIT 1), 'MCP & Integrations: Session Management', 'mcp-integrations-session-management', 170);

-- Mobile Writing Apps with AI (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'mobile-writing-apps-with-ai' AND level = 3 LIMIT 1), 'AI QA Tools: Mobile Test AI', 'ai-qa-tools-mobile-test-ai', 10),
((SELECT id FROM categories WHERE slug = 'mobile-writing-apps-with-ai' AND level = 3 LIMIT 1), 'AR Mobile AI: AR Furniture Placement', 'ar-mobile-ai-ar-furniture-placement', 20),
((SELECT id FROM categories WHERE slug = 'mobile-writing-apps-with-ai' AND level = 3 LIMIT 1), 'AR Mobile AI: AR Measurement Tool', 'ar-mobile-ai-ar-measurement-tool', 30),
((SELECT id FROM categories WHERE slug = 'mobile-writing-apps-with-ai' AND level = 3 LIMIT 1), 'AR Mobile AI: AR Navigation', 'ar-mobile-ai-ar-navigation', 40),
((SELECT id FROM categories WHERE slug = 'mobile-writing-apps-with-ai' AND level = 3 LIMIT 1), 'AR Mobile AI: AR Language Translation', 'ar-mobile-ai-ar-language-translation', 50),
((SELECT id FROM categories WHERE slug = 'mobile-writing-apps-with-ai' AND level = 3 LIMIT 1), 'AR Mobile AI: AR Plant Identifier', 'ar-mobile-ai-ar-plant-identifier', 60),
((SELECT id FROM categories WHERE slug = 'mobile-writing-apps-with-ai' AND level = 3 LIMIT 1), 'AR Mobile AI: AR Sky Map', 'ar-mobile-ai-ar-sky-map', 70),
((SELECT id FROM categories WHERE slug = 'mobile-writing-apps-with-ai' AND level = 3 LIMIT 1), 'AR Mobile AI: AR Art Gallery', 'ar-mobile-ai-ar-art-gallery', 80),
((SELECT id FROM categories WHERE slug = 'mobile-writing-apps-with-ai' AND level = 3 LIMIT 1), 'AR Mobile AI: AR Try-On Mobile', 'ar-mobile-ai-ar-try-on-mobile', 90),
((SELECT id FROM categories WHERE slug = 'mobile-writing-apps-with-ai' AND level = 3 LIMIT 1), 'AR Mobile AI: AR Interior Paint', 'ar-mobile-ai-ar-interior-paint', 100);

-- Model Cost Optimizers (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'model-cost-optimizers' AND level = 3 LIMIT 1), 'Custom Model Hosting: Cost Per Token Optimizer', 'custom-model-hosting-cost-per-token-optimizer', 10);

-- Multi-Agent Orchestration Platforms (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'multi-agent-orchestration-platforms' AND level = 3 LIMIT 1), 'AI Infrastructure: Model Training Platforms', 'ai-infrastructure-model-training-platforms', 10),
((SELECT id FROM categories WHERE slug = 'multi-agent-orchestration-platforms' AND level = 3 LIMIT 1), 'AI Infrastructure: GPU Cloud', 'ai-infrastructure-gpu-cloud', 20),
((SELECT id FROM categories WHERE slug = 'multi-agent-orchestration-platforms' AND level = 3 LIMIT 1), 'AI Infrastructure: Model Serving', 'ai-infrastructure-model-serving', 30),
((SELECT id FROM categories WHERE slug = 'multi-agent-orchestration-platforms' AND level = 3 LIMIT 1), 'AI Infrastructure: Federated Learning', 'ai-infrastructure-federated-learning', 40),
((SELECT id FROM categories WHERE slug = 'multi-agent-orchestration-platforms' AND level = 3 LIMIT 1), 'AI Infrastructure: AutoML Platforms', 'ai-infrastructure-automl-platforms', 50),
((SELECT id FROM categories WHERE slug = 'multi-agent-orchestration-platforms' AND level = 3 LIMIT 1), 'AI Infrastructure: Experiment Tracking', 'ai-infrastructure-experiment-tracking', 60),
((SELECT id FROM categories WHERE slug = 'multi-agent-orchestration-platforms' AND level = 3 LIMIT 1), 'AI Infrastructure: Model Registry', 'ai-infrastructure-model-registry', 70),
((SELECT id FROM categories WHERE slug = 'multi-agent-orchestration-platforms' AND level = 3 LIMIT 1), 'AI Infrastructure: Feature Store', 'ai-infrastructure-feature-store', 80),
((SELECT id FROM categories WHERE slug = 'multi-agent-orchestration-platforms' AND level = 3 LIMIT 1), 'AI Infrastructure: Data Labeling Platforms', 'ai-infrastructure-data-labeling-platforms', 90),
((SELECT id FROM categories WHERE slug = 'multi-agent-orchestration-platforms' AND level = 3 LIMIT 1), 'Agent Building: Multi-Agent Orchestration', 'agent-building-multi-agent-orchestration', 100);

-- Multi-Avatar Conversation Videos (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'multi-avatar-conversation-videos' AND level = 3 LIMIT 1), 'Seller Tools AI: Multi-Channel Sync', 'seller-tools-ai-multi-channel-sync', 10);

-- News Anchor Video Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'news-anchor-video-generators' AND level = 3 LIMIT 1), 'AI Avatars & Presenters: AI News Anchor', 'ai-avatars-presenters-ai-news-anchor', 10);

-- On-Device Chat Assistants (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'on-device-chat-assistants' AND level = 3 LIMIT 1), 'Mobile AI Assistants: On-Device AI Chat', 'mobile-ai-assistants-on-device-ai-chat', 10),
((SELECT id FROM categories WHERE slug = 'on-device-chat-assistants' AND level = 3 LIMIT 1), 'Mobile AI Assistants: Offline AI Tools', 'mobile-ai-assistants-offline-ai-tools', 20),
((SELECT id FROM categories WHERE slug = 'on-device-chat-assistants' AND level = 3 LIMIT 1), 'Mobile AI Assistants: AI Camera Apps', 'mobile-ai-assistants-ai-camera-apps', 30),
((SELECT id FROM categories WHERE slug = 'on-device-chat-assistants' AND level = 3 LIMIT 1), 'Mobile AI Assistants: AI Keyboard Mobile', 'mobile-ai-assistants-ai-keyboard-mobile', 40),
((SELECT id FROM categories WHERE slug = 'on-device-chat-assistants' AND level = 3 LIMIT 1), 'Mobile AI Assistants: AI Launcher', 'mobile-ai-assistants-ai-launcher', 50),
((SELECT id FROM categories WHERE slug = 'on-device-chat-assistants' AND level = 3 LIMIT 1), 'Mobile AI Assistants: AI Widget Builder', 'mobile-ai-assistants-ai-widget-builder', 60),
((SELECT id FROM categories WHERE slug = 'on-device-chat-assistants' AND level = 3 LIMIT 1), 'Mobile AI Assistants: AI Notification Manager', 'mobile-ai-assistants-ai-notification-manager', 70),
((SELECT id FROM categories WHERE slug = 'on-device-chat-assistants' AND level = 3 LIMIT 1), 'Mobile AI Assistants: AI Battery Optimizer', 'mobile-ai-assistants-ai-battery-optimizer', 80),
((SELECT id FROM categories WHERE slug = 'on-device-chat-assistants' AND level = 3 LIMIT 1), 'Mobile AI Assistants: AI Storage Cleaner', 'mobile-ai-assistants-ai-storage-cleaner', 90),
((SELECT id FROM categories WHERE slug = 'on-device-chat-assistants' AND level = 3 LIMIT 1), 'Mobile AI Assistants: AI Call Screener', 'mobile-ai-assistants-ai-call-screener', 100);

-- Open-Source Agent Frameworks (28 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Open Source Frameworks: PyTorch Ecosystem', 'open-source-frameworks-pytorch-ecosystem', 10),
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Open Source Frameworks: TensorFlow Ecosystem', 'open-source-frameworks-tensorflow-ecosystem', 20),
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Open Source Frameworks: Hugging Face Transformers', 'open-source-frameworks-hugging-face-transformers', 30),
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Open Source Frameworks: LangChain Framework', 'open-source-frameworks-langchain-framework', 40),
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Open Source Frameworks: LlamaIndex', 'open-source-frameworks-llamaindex', 50),
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Open Source Frameworks: CrewAI', 'open-source-frameworks-crewai', 60),
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Open Source Frameworks: AutoGen', 'open-source-frameworks-autogen', 70),
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Open Source Frameworks: Semantic Kernel', 'open-source-frameworks-semantic-kernel', 80),
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Open Source Frameworks: Haystack', 'open-source-frameworks-haystack', 90),
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Open Source Frameworks: Instructor Library', 'open-source-frameworks-instructor-library', 100),
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Agent Building: AI Agent SDK', 'agent-building-ai-agent-sdk', 110),
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Agent Building: Agent Tool Use', 'agent-building-agent-tool-use', 120),
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Agent Building: Agent Planning', 'agent-building-agent-planning', 130),
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Agent Building: Agent Evaluation', 'agent-building-agent-evaluation', 140),
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Agent Building: Agent Deployment', 'agent-building-agent-deployment', 150),
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Agent Building: Agent Monitoring', 'agent-building-agent-monitoring', 160),
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Agent Building: Agent Marketplace', 'agent-building-agent-marketplace', 170),
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Agent Building: Agent Communication Protocol', 'agent-building-agent-communication-protocol', 180),
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Open Source AI Ecosystem: Open Source LLMs', 'open-source-ai-ecosystem-open-source-llms', 190),
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Open Source AI Ecosystem: Open Source Image Models', 'open-source-ai-ecosystem-open-source-image-models', 200);
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Open Source AI Ecosystem: Open Source Voice Models', 'open-source-ai-ecosystem-open-source-voice-models', 210),
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Open Source AI Ecosystem: Open Source Embedding Models', 'open-source-ai-ecosystem-open-source-embedding-models', 220),
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Open Source AI Ecosystem: Open Source RAG Tools', 'open-source-ai-ecosystem-open-source-rag-tools', 230),
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Open Source AI Ecosystem: Open Source Agent Frameworks', 'open-source-ai-ecosystem-open-source-agent-frameworks', 240),
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Open Source AI Ecosystem: Open Source Annotation Tools', 'open-source-ai-ecosystem-open-source-annotation-tools', 250),
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Open Source AI Ecosystem: Open Source Training Tools', 'open-source-ai-ecosystem-open-source-training-tools', 260),
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Open Source AI Ecosystem: Open Source Evaluation', 'open-source-ai-ecosystem-open-source-evaluation', 270),
((SELECT id FROM categories WHERE slug = 'open-source-agent-frameworks' AND level = 3 LIMIT 1), 'Open Source AI Ecosystem: Open Source AI Benchmarks', 'open-source-ai-ecosystem-open-source-ai-benchmarks', 280);

-- Outfit Swap Tools (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'outfit-swap-tools' AND level = 3 LIMIT 1), 'Outfit & Wardrobe AI: Outfit Recommendation AI', 'outfit-wardrobe-ai-outfit-recommendation-ai', 10),
((SELECT id FROM categories WHERE slug = 'outfit-swap-tools' AND level = 3 LIMIT 1), 'Outfit & Wardrobe AI: Virtual Wardrobe Manager', 'outfit-wardrobe-ai-virtual-wardrobe-manager', 20),
((SELECT id FROM categories WHERE slug = 'outfit-swap-tools' AND level = 3 LIMIT 1), 'Outfit & Wardrobe AI: AI Stylist', 'outfit-wardrobe-ai-ai-stylist', 30),
((SELECT id FROM categories WHERE slug = 'outfit-swap-tools' AND level = 3 LIMIT 1), 'Outfit & Wardrobe AI: Fashion Trend Predictor', 'outfit-wardrobe-ai-fashion-trend-predictor', 40),
((SELECT id FROM categories WHERE slug = 'outfit-swap-tools' AND level = 3 LIMIT 1), 'Outfit & Wardrobe AI: Color Coordination AI', 'outfit-wardrobe-ai-color-coordination-ai', 50),
((SELECT id FROM categories WHERE slug = 'outfit-swap-tools' AND level = 3 LIMIT 1), 'Outfit & Wardrobe AI: Body Type Style AI', 'outfit-wardrobe-ai-body-type-style-ai', 60),
((SELECT id FROM categories WHERE slug = 'outfit-swap-tools' AND level = 3 LIMIT 1), 'Outfit & Wardrobe AI: Occasion Outfit AI', 'outfit-wardrobe-ai-occasion-outfit-ai', 70),
((SELECT id FROM categories WHERE slug = 'outfit-swap-tools' AND level = 3 LIMIT 1), 'Outfit & Wardrobe AI: Capsule Wardrobe Builder', 'outfit-wardrobe-ai-capsule-wardrobe-builder', 80),
((SELECT id FROM categories WHERE slug = 'outfit-swap-tools' AND level = 3 LIMIT 1), 'Outfit & Wardrobe AI: Thrift Fashion Finder', 'outfit-wardrobe-ai-thrift-fashion-finder', 90),
((SELECT id FROM categories WHERE slug = 'outfit-swap-tools' AND level = 3 LIMIT 1), 'Outfit & Wardrobe AI: Sustainable Fashion Advisor', 'outfit-wardrobe-ai-sustainable-fashion-advisor', 100);

-- Pencil Sketch Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'pencil-sketch-generators' AND level = 3 LIMIT 1), 'UI/UX AI: Sketch AI Plugins', 'ui-ux-ai-sketch-ai-plugins', 10);

-- People Removal Tools (7 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'people-removal-tools' AND level = 3 LIMIT 1), 'People Analytics: Employee Sentiment AI', 'people-analytics-employee-sentiment-ai', 10),
((SELECT id FROM categories WHERE slug = 'people-removal-tools' AND level = 3 LIMIT 1), 'People Analytics: Attrition Prediction', 'people-analytics-attrition-prediction', 20),
((SELECT id FROM categories WHERE slug = 'people-removal-tools' AND level = 3 LIMIT 1), 'People Analytics: Learning Recommendation', 'people-analytics-learning-recommendation', 30),
((SELECT id FROM categories WHERE slug = 'people-removal-tools' AND level = 3 LIMIT 1), 'People Analytics: Workforce Planning AI', 'people-analytics-workforce-planning-ai', 40),
((SELECT id FROM categories WHERE slug = 'people-removal-tools' AND level = 3 LIMIT 1), 'People Analytics: Succession Planning AI', 'people-analytics-succession-planning-ai', 50),
((SELECT id FROM categories WHERE slug = 'people-removal-tools' AND level = 3 LIMIT 1), 'People Analytics: Employee Engagement AI', 'people-analytics-employee-engagement-ai', 60),
((SELECT id FROM categories WHERE slug = 'people-removal-tools' AND level = 3 LIMIT 1), 'People Analytics: Culture Analytics AI', 'people-analytics-culture-analytics-ai', 70);

-- Personal Statement Writers (15 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'personal-statement-writers' AND level = 3 LIMIT 1), 'Personal AI: Life Coach AI', 'personal-ai-life-coach-ai', 10),
((SELECT id FROM categories WHERE slug = 'personal-statement-writers' AND level = 3 LIMIT 1), 'Personal AI: Fitness Advisor AI', 'personal-ai-fitness-advisor-ai', 20),
((SELECT id FROM categories WHERE slug = 'personal-statement-writers' AND level = 3 LIMIT 1), 'Personal AI: Nutrition Planner AI', 'personal-ai-nutrition-planner-ai', 30),
((SELECT id FROM categories WHERE slug = 'personal-statement-writers' AND level = 3 LIMIT 1), 'Personal AI: Mental Health Companion AI', 'personal-ai-mental-health-companion-ai', 40),
((SELECT id FROM categories WHERE slug = 'personal-statement-writers' AND level = 3 LIMIT 1), 'Personal AI: Career Coach AI', 'personal-ai-career-coach-ai', 50),
((SELECT id FROM categories WHERE slug = 'personal-statement-writers' AND level = 3 LIMIT 1), 'Personal AI: Travel Planner AI', 'personal-ai-travel-planner-ai', 60),
((SELECT id FROM categories WHERE slug = 'personal-statement-writers' AND level = 3 LIMIT 1), 'Personal AI: Relationship Advisor AI', 'personal-ai-relationship-advisor-ai', 70),
((SELECT id FROM categories WHERE slug = 'personal-statement-writers' AND level = 3 LIMIT 1), 'Personal AI: Habit Tracker AI', 'personal-ai-habit-tracker-ai', 80),
((SELECT id FROM categories WHERE slug = 'personal-statement-writers' AND level = 3 LIMIT 1), 'Personal AI: Meditation Guide AI', 'personal-ai-meditation-guide-ai', 90),
((SELECT id FROM categories WHERE slug = 'personal-statement-writers' AND level = 3 LIMIT 1), 'Personal Productivity AI: Task Prioritization AI', 'personal-productivity-ai-task-prioritization-ai', 100),
((SELECT id FROM categories WHERE slug = 'personal-statement-writers' AND level = 3 LIMIT 1), 'Personal Productivity AI: Email Triage AI', 'personal-productivity-ai-email-triage-ai', 110),
((SELECT id FROM categories WHERE slug = 'personal-statement-writers' AND level = 3 LIMIT 1), 'Personal Productivity AI: Document Organization AI', 'personal-productivity-ai-document-organization-ai', 120),
((SELECT id FROM categories WHERE slug = 'personal-statement-writers' AND level = 3 LIMIT 1), 'Personal Productivity AI: Habit Formation AI', 'personal-productivity-ai-habit-formation-ai', 130),
((SELECT id FROM categories WHERE slug = 'personal-statement-writers' AND level = 3 LIMIT 1), 'Personal Productivity AI: Decision Making AI', 'personal-productivity-ai-decision-making-ai', 140),
((SELECT id FROM categories WHERE slug = 'personal-statement-writers' AND level = 3 LIMIT 1), 'Personal Productivity AI: Journaling AI', 'personal-productivity-ai-journaling-ai', 150);

-- Pinterest-Style Image Generators (28 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'Text-to-Image: Photorealistic Generation', 'text-to-image-photorealistic-generation', 10),
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'Text-to-Image: Illustration Generation', 'text-to-image-illustration-generation', 20),
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'Text-to-Image: Architecture Visualization', 'text-to-image-architecture-visualization', 30),
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'Text-to-Image: Fashion Design AI', 'text-to-image-fashion-design-ai', 40),
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'Text-to-Image: Food Photography AI', 'text-to-image-food-photography-ai', 50),
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'Text-to-Image: Landscape Generation', 'text-to-image-landscape-generation', 60),
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'Text-to-Image: Character Design', 'text-to-image-character-design', 70),
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'Text-to-Image: Abstract Art Generation', 'text-to-image-abstract-art-generation', 80),
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'AI Image Editing: Background Removal', 'ai-image-editing-background-removal', 90),
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'AI Image Editing: Image Upscaling', 'ai-image-editing-image-upscaling', 100),
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'AI Image Editing: Object Removal', 'ai-image-editing-object-removal', 110),
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'AI Image Editing: Face Enhancement', 'ai-image-editing-face-enhancement', 120),
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'AI Image Editing: Color Correction AI', 'ai-image-editing-color-correction-ai', 130),
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'AI Image Editing: Style Transfer', 'ai-image-editing-style-transfer', 140),
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'AI Image Editing: Image Restoration', 'ai-image-editing-image-restoration', 150),
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'AI Image Editing: Old Photo Restoration', 'ai-image-editing-old-photo-restoration', 160),
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'AI Image Editing: Noise Reduction', 'ai-image-editing-noise-reduction', 170),
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'AI Image Editing: HDR Enhancement', 'ai-image-editing-hdr-enhancement', 180),
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'Niche Image Generation: AI Passport Photo', 'niche-image-generation-ai-passport-photo', 190),
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'Niche Image Generation: AI Product Flat Lay', 'niche-image-generation-ai-product-flat-lay', 200);
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'Niche Image Generation: AI Fashion Lookbook', 'niche-image-generation-ai-fashion-lookbook', 210),
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'Niche Image Generation: AI Real Estate Photo', 'niche-image-generation-ai-real-estate-photo', 220),
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'Niche Image Generation: AI Food Photography', 'niche-image-generation-ai-food-photography', 230),
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'Niche Image Generation: AI Car Photography', 'niche-image-generation-ai-car-photography', 240),
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'Niche Image Generation: AI Pet Photography', 'niche-image-generation-ai-pet-photography', 250),
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'Niche Image Generation: AI Architecture Photo', 'niche-image-generation-ai-architecture-photo', 260),
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'Niche Image Generation: AI Interior Photo', 'niche-image-generation-ai-interior-photo', 270),
((SELECT id FROM categories WHERE slug = 'pinterest-style-image-generators' AND level = 3 LIMIT 1), 'Niche Image Generation: AI Aerial View Generator', 'niche-image-generation-ai-aerial-view-generator', 280);

-- Plain Language Rewriters (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'plain-language-rewriters' AND level = 3 LIMIT 1), 'AI Personas: Language Partner AI', 'ai-personas-language-partner-ai', 10);

-- Podcast Episode Summarizers (9 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'podcast-episode-summarizers' AND level = 3 LIMIT 1), 'Podcast AI: Podcast Transcription', 'podcast-ai-podcast-transcription', 10),
((SELECT id FROM categories WHERE slug = 'podcast-episode-summarizers' AND level = 3 LIMIT 1), 'Podcast AI: Show Notes Generator', 'podcast-ai-show-notes-generator', 20),
((SELECT id FROM categories WHERE slug = 'podcast-episode-summarizers' AND level = 3 LIMIT 1), 'Podcast AI: Episode Summary AI', 'podcast-ai-episode-summary-ai', 30),
((SELECT id FROM categories WHERE slug = 'podcast-episode-summarizers' AND level = 3 LIMIT 1), 'Podcast AI: Intro/Outro Generator', 'podcast-ai-intro-outro-generator', 40),
((SELECT id FROM categories WHERE slug = 'podcast-episode-summarizers' AND level = 3 LIMIT 1), 'Podcast AI: Guest Research AI', 'podcast-ai-guest-research-ai', 50),
((SELECT id FROM categories WHERE slug = 'podcast-episode-summarizers' AND level = 3 LIMIT 1), 'Podcast AI: Podcast SEO AI', 'podcast-ai-podcast-seo-ai', 60),
((SELECT id FROM categories WHERE slug = 'podcast-episode-summarizers' AND level = 3 LIMIT 1), 'Podcast AI: Clip Extraction', 'podcast-ai-clip-extraction', 70),
((SELECT id FROM categories WHERE slug = 'podcast-episode-summarizers' AND level = 3 LIMIT 1), 'Podcast AI: Podcast Analytics AI', 'podcast-ai-podcast-analytics-ai', 80),
((SELECT id FROM categories WHERE slug = 'podcast-episode-summarizers' AND level = 3 LIMIT 1), 'Podcast AI: Cross-Posting AI', 'podcast-ai-cross-posting-ai', 90);

-- Policy Document Drafting (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'policy-document-drafting' AND level = 3 LIMIT 1), 'Regulatory AI: Policy Analyzer AI', 'regulatory-ai-policy-analyzer-ai', 10),
((SELECT id FROM categories WHERE slug = 'policy-document-drafting' AND level = 3 LIMIT 1), 'Regulatory AI: Document Compliance AI', 'regulatory-ai-document-compliance-ai', 20);

-- Privacy-First Chat Apps (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'privacy-first-chat-apps' AND level = 3 LIMIT 1), 'Privacy-Preserving AI: Federated Learning', 'privacy-preserving-ai-federated-learning', 10),
((SELECT id FROM categories WHERE slug = 'privacy-first-chat-apps' AND level = 3 LIMIT 1), 'Privacy-Preserving AI: Differential Privacy', 'privacy-preserving-ai-differential-privacy', 20),
((SELECT id FROM categories WHERE slug = 'privacy-first-chat-apps' AND level = 3 LIMIT 1), 'Privacy-Preserving AI: Synthetic Data Generation', 'privacy-preserving-ai-synthetic-data-generation', 30),
((SELECT id FROM categories WHERE slug = 'privacy-first-chat-apps' AND level = 3 LIMIT 1), 'Privacy-Preserving AI: PII Detection', 'privacy-preserving-ai-pii-detection', 40),
((SELECT id FROM categories WHERE slug = 'privacy-first-chat-apps' AND level = 3 LIMIT 1), 'Privacy-Preserving AI: Consent Management AI', 'privacy-preserving-ai-consent-management-ai', 50),
((SELECT id FROM categories WHERE slug = 'privacy-first-chat-apps' AND level = 3 LIMIT 1), 'Privacy-Preserving AI: Privacy by Design Tools', 'privacy-preserving-ai-privacy-by-design-tools', 60),
((SELECT id FROM categories WHERE slug = 'privacy-first-chat-apps' AND level = 3 LIMIT 1), 'Privacy-Preserving AI: Data Minimization', 'privacy-preserving-ai-data-minimization', 70),
((SELECT id FROM categories WHERE slug = 'privacy-first-chat-apps' AND level = 3 LIMIT 1), 'Privacy-Preserving AI: Right to Erasure Tools', 'privacy-preserving-ai-right-to-erasure-tools', 80),
((SELECT id FROM categories WHERE slug = 'privacy-first-chat-apps' AND level = 3 LIMIT 1), 'Privacy-Preserving AI: Cross-Border Data AI', 'privacy-preserving-ai-cross-border-data-ai', 90),
((SELECT id FROM categories WHERE slug = 'privacy-first-chat-apps' AND level = 3 LIMIT 1), 'Browsing AI: AI Privacy Shield Extension', 'browsing-ai-ai-privacy-shield-extension', 100);

-- Product Demo Video Builders (7 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'product-demo-video-builders' AND level = 3 LIMIT 1), 'Pitch & Demo AI: Startup Pitch Generator', 'pitch-demo-ai-startup-pitch-generator', 10),
((SELECT id FROM categories WHERE slug = 'product-demo-video-builders' AND level = 3 LIMIT 1), 'Pitch & Demo AI: Product Demo Script', 'pitch-demo-ai-product-demo-script', 20),
((SELECT id FROM categories WHERE slug = 'product-demo-video-builders' AND level = 3 LIMIT 1), 'Pitch & Demo AI: Elevator Pitch Writer', 'pitch-demo-ai-elevator-pitch-writer', 30),
((SELECT id FROM categories WHERE slug = 'product-demo-video-builders' AND level = 3 LIMIT 1), 'Pitch & Demo AI: Fundraising Strategy AI', 'pitch-demo-ai-fundraising-strategy-ai', 40),
((SELECT id FROM categories WHERE slug = 'product-demo-video-builders' AND level = 3 LIMIT 1), 'Pitch & Demo AI: Market Size Calculator', 'pitch-demo-ai-market-size-calculator', 50),
((SELECT id FROM categories WHERE slug = 'product-demo-video-builders' AND level = 3 LIMIT 1), 'Pitch & Demo AI: Competitor Comparison AI', 'pitch-demo-ai-competitor-comparison-ai', 60),
((SELECT id FROM categories WHERE slug = 'product-demo-video-builders' AND level = 3 LIMIT 1), 'Pitch & Demo AI: Cap Table AI', 'pitch-demo-ai-cap-table-ai', 70);

-- Product Mockup Generators (22 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'product-mockup-generators' AND level = 3 LIMIT 1), 'Text-to-Image: Product Mockup Generation', 'text-to-image-product-mockup-generation', 10),
((SELECT id FROM categories WHERE slug = 'product-mockup-generators' AND level = 3 LIMIT 1), 'Product Design AI: Product Render AI', 'product-design-ai-product-render-ai', 20),
((SELECT id FROM categories WHERE slug = 'product-mockup-generators' AND level = 3 LIMIT 1), 'Product Design AI: Packaging Design AI', 'product-design-ai-packaging-design-ai', 30),
((SELECT id FROM categories WHERE slug = 'product-mockup-generators' AND level = 3 LIMIT 1), 'Product Design AI: Label Design AI', 'product-design-ai-label-design-ai', 40),
((SELECT id FROM categories WHERE slug = 'product-mockup-generators' AND level = 3 LIMIT 1), 'Product Design AI: Merchandise Design AI', 'product-design-ai-merchandise-design-ai', 50),
((SELECT id FROM categories WHERE slug = 'product-mockup-generators' AND level = 3 LIMIT 1), 'Product Design AI: Print Design AI', 'product-design-ai-print-design-ai', 60),
((SELECT id FROM categories WHERE slug = 'product-mockup-generators' AND level = 3 LIMIT 1), 'Product Design AI: 3D Packaging', 'product-design-ai-3d-packaging', 70),
((SELECT id FROM categories WHERE slug = 'product-mockup-generators' AND level = 3 LIMIT 1), 'Product Design AI: Material Design AI', 'product-design-ai-material-design-ai', 80),
((SELECT id FROM categories WHERE slug = 'product-mockup-generators' AND level = 3 LIMIT 1), 'Product Design AI: Industrial Design AI', 'product-design-ai-industrial-design-ai', 90),
((SELECT id FROM categories WHERE slug = 'product-mockup-generators' AND level = 3 LIMIT 1), 'Product Design AI: Fashion Design AI', 'product-design-ai-fashion-design-ai', 100),
((SELECT id FROM categories WHERE slug = 'product-mockup-generators' AND level = 3 LIMIT 1), 'Product Design AI: Furniture Design AI', 'product-design-ai-furniture-design-ai', 110),
((SELECT id FROM categories WHERE slug = 'product-mockup-generators' AND level = 3 LIMIT 1), 'Product Discovery AI: Deal Finder AI', 'product-discovery-ai-deal-finder-ai', 120),
((SELECT id FROM categories WHERE slug = 'product-mockup-generators' AND level = 3 LIMIT 1), 'Product Discovery AI: Price Comparison AI', 'product-discovery-ai-price-comparison-ai', 130),
((SELECT id FROM categories WHERE slug = 'product-mockup-generators' AND level = 3 LIMIT 1), 'Product Discovery AI: Product Review Summarizer', 'product-discovery-ai-product-review-summarizer', 140),
((SELECT id FROM categories WHERE slug = 'product-mockup-generators' AND level = 3 LIMIT 1), 'Product Discovery AI: Gift Recommendation AI', 'product-discovery-ai-gift-recommendation-ai', 150),
((SELECT id FROM categories WHERE slug = 'product-mockup-generators' AND level = 3 LIMIT 1), 'Product Discovery AI: Size Recommendation AI Shopping', 'product-discovery-ai-size-recommendation-ai-shopping', 160),
((SELECT id FROM categories WHERE slug = 'product-mockup-generators' AND level = 3 LIMIT 1), 'Product Discovery AI: Coupon Finder AI', 'product-discovery-ai-coupon-finder-ai', 170),
((SELECT id FROM categories WHERE slug = 'product-mockup-generators' AND level = 3 LIMIT 1), 'Product Discovery AI: Wishlist Organizer AI', 'product-discovery-ai-wishlist-organizer-ai', 180),
((SELECT id FROM categories WHERE slug = 'product-mockup-generators' AND level = 3 LIMIT 1), 'Product Discovery AI: Grocery Price Tracker', 'product-discovery-ai-grocery-price-tracker', 190),
((SELECT id FROM categories WHERE slug = 'product-mockup-generators' AND level = 3 LIMIT 1), 'Product Discovery AI: Price Drop Alert AI', 'product-discovery-ai-price-drop-alert-ai', 200);
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'product-mockup-generators' AND level = 3 LIMIT 1), 'Product Discovery AI: Best Value Finder AI', 'product-discovery-ai-best-value-finder-ai', 210),
((SELECT id FROM categories WHERE slug = 'product-mockup-generators' AND level = 3 LIMIT 1), 'Naming AI: Product Name Generator', 'naming-ai-product-name-generator', 220);

-- Prompt A/B Testing Tools (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'prompt-ab-testing-tools' AND level = 3 LIMIT 1), 'Prompt Tools: Prompt A/B Testing', 'prompt-tools-prompt-a-b-testing', 10);

-- Prompt Cost Analyzers (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'prompt-cost-analyzers' AND level = 3 LIMIT 1), 'Prompt Tools: Prompt Cost Calculator', 'prompt-tools-prompt-cost-calculator', 10);

-- Prompt Versioning Systems (18 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'prompt-versioning-systems' AND level = 3 LIMIT 1), 'MCP & Integrations: Prompt Router', 'mcp-integrations-prompt-router', 10),
((SELECT id FROM categories WHERE slug = 'prompt-versioning-systems' AND level = 3 LIMIT 1), 'Prompt Tools: Prompt Template Library', 'prompt-tools-prompt-template-library', 20),
((SELECT id FROM categories WHERE slug = 'prompt-versioning-systems' AND level = 3 LIMIT 1), 'Prompt Tools: Prompt Optimizer', 'prompt-tools-prompt-optimizer', 30),
((SELECT id FROM categories WHERE slug = 'prompt-versioning-systems' AND level = 3 LIMIT 1), 'Prompt Tools: Prompt Version Control', 'prompt-tools-prompt-version-control', 40),
((SELECT id FROM categories WHERE slug = 'prompt-versioning-systems' AND level = 3 LIMIT 1), 'Prompt Tools: Prompt Chaining', 'prompt-tools-prompt-chaining', 50),
((SELECT id FROM categories WHERE slug = 'prompt-versioning-systems' AND level = 3 LIMIT 1), 'Prompt Tools: System Prompt Builder', 'prompt-tools-system-prompt-builder', 60),
((SELECT id FROM categories WHERE slug = 'prompt-versioning-systems' AND level = 3 LIMIT 1), 'Prompt Tools: Few-Shot Example Manager', 'prompt-tools-few-shot-example-manager', 70),
((SELECT id FROM categories WHERE slug = 'prompt-versioning-systems' AND level = 3 LIMIT 1), 'Prompt Tools: Prompt Playground', 'prompt-tools-prompt-playground', 80),
((SELECT id FROM categories WHERE slug = 'prompt-versioning-systems' AND level = 3 LIMIT 1), 'Prompt Marketplace: Community Prompts', 'prompt-marketplace-community-prompts', 90),
((SELECT id FROM categories WHERE slug = 'prompt-versioning-systems' AND level = 3 LIMIT 1), 'Prompt Marketplace: Premium Prompt Store', 'prompt-marketplace-premium-prompt-store', 100),
((SELECT id FROM categories WHERE slug = 'prompt-versioning-systems' AND level = 3 LIMIT 1), 'Prompt Marketplace: Prompt Rating System', 'prompt-marketplace-prompt-rating-system', 110),
((SELECT id FROM categories WHERE slug = 'prompt-versioning-systems' AND level = 3 LIMIT 1), 'Prompt Marketplace: Domain Prompt Packs', 'prompt-marketplace-domain-prompt-packs', 120),
((SELECT id FROM categories WHERE slug = 'prompt-versioning-systems' AND level = 3 LIMIT 1), 'Prompt Marketplace: GPT Store Integration', 'prompt-marketplace-gpt-store-integration', 130),
((SELECT id FROM categories WHERE slug = 'prompt-versioning-systems' AND level = 3 LIMIT 1), 'Prompt Marketplace: Custom GPT Builder', 'prompt-marketplace-custom-gpt-builder', 140),
((SELECT id FROM categories WHERE slug = 'prompt-versioning-systems' AND level = 3 LIMIT 1), 'Prompt Marketplace: Prompt Analytics', 'prompt-marketplace-prompt-analytics', 150),
((SELECT id FROM categories WHERE slug = 'prompt-versioning-systems' AND level = 3 LIMIT 1), 'Prompt Marketplace: Prompt Sharing Platform', 'prompt-marketplace-prompt-sharing-platform', 160),
((SELECT id FROM categories WHERE slug = 'prompt-versioning-systems' AND level = 3 LIMIT 1), 'Prompt Marketplace: Prompt Competition', 'prompt-marketplace-prompt-competition', 170),
((SELECT id FROM categories WHERE slug = 'prompt-versioning-systems' AND level = 3 LIMIT 1), 'Prompt Marketplace: Prompt Certification', 'prompt-marketplace-prompt-certification', 180);

-- Reading Level Adjusters (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'reading-level-adjusters' AND level = 3 LIMIT 1), 'Mystical & Spiritual AI: Palm Reading AI', 'mystical-spiritual-ai-palm-reading-ai', 10),
((SELECT id FROM categories WHERE slug = 'reading-level-adjusters' AND level = 3 LIMIT 1), 'Esoteric AI: Rune Reading AI', 'esoteric-ai-rune-reading-ai', 20);

-- Real Estate Inquiry Bots (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'real-estate-inquiry-bots' AND level = 3 LIMIT 1), 'Investment AI: Real Estate Valuation AI', 'investment-ai-real-estate-valuation-ai', 10);

-- Real-Time Voice Changers (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'real-time-voice-changers' AND level = 3 LIMIT 1), 'Speech-to-Text: Real-Time Transcription', 'speech-to-text-real-time-transcription', 10);

-- Recommendation Letter Drafting (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'recommendation-letter-drafting' AND level = 3 LIMIT 1), 'Esoteric AI: Crystal Recommendation AI', 'esoteric-ai-crystal-recommendation-ai', 10);

-- Reranker Model Tools (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'reranker-model-tools' AND level = 3 LIMIT 1), 'Model Customization: LLM Fine-Tuning Platform', 'model-customization-llm-fine-tuning-platform', 10),
((SELECT id FROM categories WHERE slug = 'reranker-model-tools' AND level = 3 LIMIT 1), 'Model Customization: LoRA Training', 'model-customization-lora-training', 20),
((SELECT id FROM categories WHERE slug = 'reranker-model-tools' AND level = 3 LIMIT 1), 'Model Customization: RLHF Platform', 'model-customization-rlhf-platform', 30),
((SELECT id FROM categories WHERE slug = 'reranker-model-tools' AND level = 3 LIMIT 1), 'Model Customization: DPO Training', 'model-customization-dpo-training', 40),
((SELECT id FROM categories WHERE slug = 'reranker-model-tools' AND level = 3 LIMIT 1), 'Model Customization: Dataset Preparation', 'model-customization-dataset-preparation', 50),
((SELECT id FROM categories WHERE slug = 'reranker-model-tools' AND level = 3 LIMIT 1), 'Model Customization: Data Annotation', 'model-customization-data-annotation', 60),
((SELECT id FROM categories WHERE slug = 'reranker-model-tools' AND level = 3 LIMIT 1), 'Model Customization: Synthetic Data for Training', 'model-customization-synthetic-data-for-training', 70),
((SELECT id FROM categories WHERE slug = 'reranker-model-tools' AND level = 3 LIMIT 1), 'Model Customization: Evaluation Benchmarks', 'model-customization-evaluation-benchmarks', 80),
((SELECT id FROM categories WHERE slug = 'reranker-model-tools' AND level = 3 LIMIT 1), 'Model Customization: Model Distillation', 'model-customization-model-distillation', 90),
((SELECT id FROM categories WHERE slug = 'reranker-model-tools' AND level = 3 LIMIT 1), 'Model Customization: Quantization Tools', 'model-customization-quantization-tools', 100);

-- Research Paper Summarizers (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'research-paper-summarizers' AND level = 3 LIMIT 1), 'Content Research: Topic Discovery AI', 'content-research-topic-discovery-ai', 10),
((SELECT id FROM categories WHERE slug = 'research-paper-summarizers' AND level = 3 LIMIT 1), 'Content Research: Headline Analyzer AI', 'content-research-headline-analyzer-ai', 20),
((SELECT id FROM categories WHERE slug = 'research-paper-summarizers' AND level = 3 LIMIT 1), 'Content Research: Content Gap AI', 'content-research-content-gap-ai', 30),
((SELECT id FROM categories WHERE slug = 'research-paper-summarizers' AND level = 3 LIMIT 1), 'Content Research: Competitor Content AI', 'content-research-competitor-content-ai', 40),
((SELECT id FROM categories WHERE slug = 'research-paper-summarizers' AND level = 3 LIMIT 1), 'Content Research: Audience Insights AI', 'content-research-audience-insights-ai', 50),
((SELECT id FROM categories WHERE slug = 'research-paper-summarizers' AND level = 3 LIMIT 1), 'Content Research: Trending Analysis', 'content-research-trending-analysis', 60),
((SELECT id FROM categories WHERE slug = 'research-paper-summarizers' AND level = 3 LIMIT 1), 'Content Research: Question Research AI', 'content-research-question-research-ai', 70),
((SELECT id FROM categories WHERE slug = 'research-paper-summarizers' AND level = 3 LIMIT 1), 'Content Research: User Intent AI', 'content-research-user-intent-ai', 80),
((SELECT id FROM categories WHERE slug = 'research-paper-summarizers' AND level = 3 LIMIT 1), 'Content Research: Content Scoring AI', 'content-research-content-scoring-ai', 90),
((SELECT id FROM categories WHERE slug = 'research-paper-summarizers' AND level = 3 LIMIT 1), 'Content Research: ROI Prediction AI', 'content-research-roi-prediction-ai', 100);

-- Sci-Fi Concept Art Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'sci-fi-concept-art-generators' AND level = 3 LIMIT 1), 'Text-to-Image: Concept Art Creation', 'text-to-image-concept-art-creation', 10);

-- SEO Blog Post Drafting (18 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'seo-blog-post-drafting' AND level = 3 LIMIT 1), 'SEO Writing: SEO Blog Writers', 'seo-writing-seo-blog-writers', 10),
((SELECT id FROM categories WHERE slug = 'seo-blog-post-drafting' AND level = 3 LIMIT 1), 'SEO Writing: Meta Description Generators', 'seo-writing-meta-description-generators', 20),
((SELECT id FROM categories WHERE slug = 'seo-blog-post-drafting' AND level = 3 LIMIT 1), 'SEO Writing: Title Tag Optimizers', 'seo-writing-title-tag-optimizers', 30),
((SELECT id FROM categories WHERE slug = 'seo-blog-post-drafting' AND level = 3 LIMIT 1), 'SEO Writing: Keyword Cluster Writers', 'seo-writing-keyword-cluster-writers', 40),
((SELECT id FROM categories WHERE slug = 'seo-blog-post-drafting' AND level = 3 LIMIT 1), 'SEO Writing: Pillar Page Creators', 'seo-writing-pillar-page-creators', 50),
((SELECT id FROM categories WHERE slug = 'seo-blog-post-drafting' AND level = 3 LIMIT 1), 'SEO Writing: FAQ Schema Writers', 'seo-writing-faq-schema-writers', 60),
((SELECT id FROM categories WHERE slug = 'seo-blog-post-drafting' AND level = 3 LIMIT 1), 'SEO Writing: Local SEO Content', 'seo-writing-local-seo-content', 70),
((SELECT id FROM categories WHERE slug = 'seo-blog-post-drafting' AND level = 3 LIMIT 1), 'SEO Writing: Product SEO Copy', 'seo-writing-product-seo-copy', 80),
((SELECT id FROM categories WHERE slug = 'seo-blog-post-drafting' AND level = 3 LIMIT 1), 'SEO Writing: Technical SEO Content', 'seo-writing-technical-seo-content', 90),
((SELECT id FROM categories WHERE slug = 'seo-blog-post-drafting' AND level = 3 LIMIT 1), 'SEO AI: Keyword Research AI', 'seo-ai-keyword-research-ai', 100),
((SELECT id FROM categories WHERE slug = 'seo-blog-post-drafting' AND level = 3 LIMIT 1), 'SEO AI: Content Optimization AI', 'seo-ai-content-optimization-ai', 110),
((SELECT id FROM categories WHERE slug = 'seo-blog-post-drafting' AND level = 3 LIMIT 1), 'SEO AI: Technical SEO AI', 'seo-ai-technical-seo-ai', 120),
((SELECT id FROM categories WHERE slug = 'seo-blog-post-drafting' AND level = 3 LIMIT 1), 'SEO AI: Link Building AI', 'seo-ai-link-building-ai', 130),
((SELECT id FROM categories WHERE slug = 'seo-blog-post-drafting' AND level = 3 LIMIT 1), 'SEO AI: Local SEO AI', 'seo-ai-local-seo-ai', 140),
((SELECT id FROM categories WHERE slug = 'seo-blog-post-drafting' AND level = 3 LIMIT 1), 'SEO AI: SERP Analysis AI', 'seo-ai-serp-analysis-ai', 150),
((SELECT id FROM categories WHERE slug = 'seo-blog-post-drafting' AND level = 3 LIMIT 1), 'SEO AI: Site Audit AI', 'seo-ai-site-audit-ai', 160),
((SELECT id FROM categories WHERE slug = 'seo-blog-post-drafting' AND level = 3 LIMIT 1), 'SEO AI: Rank Tracking AI', 'seo-ai-rank-tracking-ai', 170),
((SELECT id FROM categories WHERE slug = 'seo-blog-post-drafting' AND level = 3 LIMIT 1), 'SEO AI: Voice Search Optimization', 'seo-ai-voice-search-optimization', 180);

-- Serverless LLM Platforms (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'serverless-llm-platforms' AND level = 3 LIMIT 1), 'LLM APIs: GPT API', 'llm-apis-gpt-api', 10),
((SELECT id FROM categories WHERE slug = 'serverless-llm-platforms' AND level = 3 LIMIT 1), 'LLM APIs: Claude API', 'llm-apis-claude-api', 20),
((SELECT id FROM categories WHERE slug = 'serverless-llm-platforms' AND level = 3 LIMIT 1), 'LLM APIs: Gemini API', 'llm-apis-gemini-api', 30),
((SELECT id FROM categories WHERE slug = 'serverless-llm-platforms' AND level = 3 LIMIT 1), 'LLM APIs: Mistral API', 'llm-apis-mistral-api', 40),
((SELECT id FROM categories WHERE slug = 'serverless-llm-platforms' AND level = 3 LIMIT 1), 'LLM APIs: Llama API', 'llm-apis-llama-api', 50),
((SELECT id FROM categories WHERE slug = 'serverless-llm-platforms' AND level = 3 LIMIT 1), 'LLM APIs: Cohere API', 'llm-apis-cohere-api', 60),
((SELECT id FROM categories WHERE slug = 'serverless-llm-platforms' AND level = 3 LIMIT 1), 'LLM APIs: AI21 Labs API', 'llm-apis-ai21-labs-api', 70),
((SELECT id FROM categories WHERE slug = 'serverless-llm-platforms' AND level = 3 LIMIT 1), 'LLM APIs: DeepSeek API', 'llm-apis-deepseek-api', 80),
((SELECT id FROM categories WHERE slug = 'serverless-llm-platforms' AND level = 3 LIMIT 1), 'LLM APIs: Open Source LLM Hosting', 'llm-apis-open-source-llm-hosting', 90),
((SELECT id FROM categories WHERE slug = 'serverless-llm-platforms' AND level = 3 LIMIT 1), 'LLM APIs: Fine-Tuning APIs', 'llm-apis-fine-tuning-apis', 100);

-- Smart Speaker Skills (Category) (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'smart-speaker-skills-category' AND level = 3 LIMIT 1), 'Browsing AI: AI Ad Blocker Smart', 'browsing-ai-ai-ad-blocker-smart', 10);

-- Sticker Sheet Generators (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'sticker-sheet-generators' AND level = 3 LIMIT 1), 'Meme Creation AI: Sticker Maker AI', 'meme-creation-ai-sticker-maker-ai', 10);

-- Studio Portrait Generators (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'studio-portrait-generators' AND level = 3 LIMIT 1), 'AI Avatar & Portrait: Profile Picture Generators', 'ai-avatar-portrait-profile-picture-generators', 10),
((SELECT id FROM categories WHERE slug = 'studio-portrait-generators' AND level = 3 LIMIT 1), 'AI Avatar & Portrait: Corporate Headshot AI', 'ai-avatar-portrait-corporate-headshot-ai', 20),
((SELECT id FROM categories WHERE slug = 'studio-portrait-generators' AND level = 3 LIMIT 1), 'AI Avatar & Portrait: Anime Avatar Creators', 'ai-avatar-portrait-anime-avatar-creators', 30),
((SELECT id FROM categories WHERE slug = 'studio-portrait-generators' AND level = 3 LIMIT 1), 'AI Avatar & Portrait: 3D Avatar Generators', 'ai-avatar-portrait-3d-avatar-generators', 40),
((SELECT id FROM categories WHERE slug = 'studio-portrait-generators' AND level = 3 LIMIT 1), 'AI Avatar & Portrait: Cartoon Portrait AI', 'ai-avatar-portrait-cartoon-portrait-ai', 50),
((SELECT id FROM categories WHERE slug = 'studio-portrait-generators' AND level = 3 LIMIT 1), 'AI Avatar & Portrait: Fantasy Character Creator', 'ai-avatar-portrait-fantasy-character-creator', 60),
((SELECT id FROM categories WHERE slug = 'studio-portrait-generators' AND level = 3 LIMIT 1), 'AI Avatar & Portrait: Virtual Try-On Avatars', 'ai-avatar-portrait-virtual-try-on-avatars', 70),
((SELECT id FROM categories WHERE slug = 'studio-portrait-generators' AND level = 3 LIMIT 1), 'AI Avatar & Portrait: Pet Portrait AI', 'ai-avatar-portrait-pet-portrait-ai', 80),
((SELECT id FROM categories WHERE slug = 'studio-portrait-generators' AND level = 3 LIMIT 1), 'AI Avatar & Portrait: Baby Face Predictors', 'ai-avatar-portrait-baby-face-predictors', 90),
((SELECT id FROM categories WHERE slug = 'studio-portrait-generators' AND level = 3 LIMIT 1), 'AI Avatar & Portrait: Aging & De-Aging AI', 'ai-avatar-portrait-aging-de-aging-ai', 100);

-- Tattoo Flash Generators (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'tattoo-flash-generators' AND level = 3 LIMIT 1), 'Tattoo Design AI: Tattoo Generator AI', 'tattoo-design-ai-tattoo-generator-ai', 10),
((SELECT id FROM categories WHERE slug = 'tattoo-flash-generators' AND level = 3 LIMIT 1), 'Tattoo Design AI: Tattoo Placement Preview', 'tattoo-design-ai-tattoo-placement-preview', 20),
((SELECT id FROM categories WHERE slug = 'tattoo-flash-generators' AND level = 3 LIMIT 1), 'Tattoo Design AI: Tattoo Style AI', 'tattoo-design-ai-tattoo-style-ai', 30),
((SELECT id FROM categories WHERE slug = 'tattoo-flash-generators' AND level = 3 LIMIT 1), 'Tattoo Design AI: Custom Tattoo Design', 'tattoo-design-ai-custom-tattoo-design', 40),
((SELECT id FROM categories WHERE slug = 'tattoo-flash-generators' AND level = 3 LIMIT 1), 'Tattoo Design AI: Tattoo Meaning Finder', 'tattoo-design-ai-tattoo-meaning-finder', 50),
((SELECT id FROM categories WHERE slug = 'tattoo-flash-generators' AND level = 3 LIMIT 1), 'Tattoo Design AI: Tattoo Cover-Up AI', 'tattoo-design-ai-tattoo-cover-up-ai', 60),
((SELECT id FROM categories WHERE slug = 'tattoo-flash-generators' AND level = 3 LIMIT 1), 'Tattoo Design AI: Henna Design AI', 'tattoo-design-ai-henna-design-ai', 70),
((SELECT id FROM categories WHERE slug = 'tattoo-flash-generators' AND level = 3 LIMIT 1), 'Tattoo Design AI: Nail Art Design AI', 'tattoo-design-ai-nail-art-design-ai', 80),
((SELECT id FROM categories WHERE slug = 'tattoo-flash-generators' AND level = 3 LIMIT 1), 'Tattoo Design AI: Face Paint Design AI', 'tattoo-design-ai-face-paint-design-ai', 90),
((SELECT id FROM categories WHERE slug = 'tattoo-flash-generators' AND level = 3 LIMIT 1), 'Tattoo Design AI: Body Art Visualizer', 'tattoo-design-ai-body-art-visualizer', 100);

-- Text-to-Cinematic-Video (21 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'text-to-cinematic-video' AND level = 3 LIMIT 1), 'Text-to-Video: Full Video from Prompt', 'text-to-video-full-video-from-prompt', 10),
((SELECT id FROM categories WHERE slug = 'text-to-cinematic-video' AND level = 3 LIMIT 1), 'Text-to-Video: Short-Form Video AI', 'text-to-video-short-form-video-ai', 20),
((SELECT id FROM categories WHERE slug = 'text-to-cinematic-video' AND level = 3 LIMIT 1), 'Text-to-Video: Documentary Style AI', 'text-to-video-documentary-style-ai', 30),
((SELECT id FROM categories WHERE slug = 'text-to-cinematic-video' AND level = 3 LIMIT 1), 'Text-to-Video: Explainer Video AI', 'text-to-video-explainer-video-ai', 40),
((SELECT id FROM categories WHERE slug = 'text-to-cinematic-video' AND level = 3 LIMIT 1), 'Text-to-Video: Product Demo Video AI', 'text-to-video-product-demo-video-ai', 50),
((SELECT id FROM categories WHERE slug = 'text-to-cinematic-video' AND level = 3 LIMIT 1), 'Text-to-Video: Training Video AI', 'text-to-video-training-video-ai', 60),
((SELECT id FROM categories WHERE slug = 'text-to-cinematic-video' AND level = 3 LIMIT 1), 'Text-to-Video: Social Media Video AI', 'text-to-video-social-media-video-ai', 70),
((SELECT id FROM categories WHERE slug = 'text-to-cinematic-video' AND level = 3 LIMIT 1), 'Text-to-Video: Music Video AI', 'text-to-video-music-video-ai', 80),
((SELECT id FROM categories WHERE slug = 'text-to-cinematic-video' AND level = 3 LIMIT 1), 'Text-to-Video: Animation from Text', 'text-to-video-animation-from-text', 90),
((SELECT id FROM categories WHERE slug = 'text-to-cinematic-video' AND level = 3 LIMIT 1), 'Text-to-Video: Cinematic Scene AI', 'text-to-video-cinematic-scene-ai', 100),
((SELECT id FROM categories WHERE slug = 'text-to-cinematic-video' AND level = 3 LIMIT 1), 'AI Video Editing: Scene Detection', 'ai-video-editing-scene-detection', 110),
((SELECT id FROM categories WHERE slug = 'text-to-cinematic-video' AND level = 3 LIMIT 1), 'AI Video Editing: Audio Sync AI', 'ai-video-editing-audio-sync-ai', 120),
((SELECT id FROM categories WHERE slug = 'text-to-cinematic-video' AND level = 3 LIMIT 1), 'AI Video Editing: Subtitle Generation', 'ai-video-editing-subtitle-generation', 130),
((SELECT id FROM categories WHERE slug = 'text-to-cinematic-video' AND level = 3 LIMIT 1), 'AI Video Editing: Video Upscaling', 'ai-video-editing-video-upscaling', 140),
((SELECT id FROM categories WHERE slug = 'text-to-cinematic-video' AND level = 3 LIMIT 1), 'AI Video Editing: Multi-Cam Editing AI', 'ai-video-editing-multi-cam-editing-ai', 150),
((SELECT id FROM categories WHERE slug = 'text-to-cinematic-video' AND level = 3 LIMIT 1), 'AI Avatars & Presenters: Training Presenter AI', 'ai-avatars-presenters-training-presenter-ai', 160),
((SELECT id FROM categories WHERE slug = 'text-to-cinematic-video' AND level = 3 LIMIT 1), 'AI Avatars & Presenters: Multilingual Presenter', 'ai-avatars-presenters-multilingual-presenter', 170),
((SELECT id FROM categories WHERE slug = 'text-to-cinematic-video' AND level = 3 LIMIT 1), 'AI Avatars & Presenters: Virtual Instructor', 'ai-avatars-presenters-virtual-instructor', 180),
((SELECT id FROM categories WHERE slug = 'text-to-cinematic-video' AND level = 3 LIMIT 1), 'AI Avatars & Presenters: AI Influencer', 'ai-avatars-presenters-ai-influencer', 190),
((SELECT id FROM categories WHERE slug = 'text-to-cinematic-video' AND level = 3 LIMIT 1), 'AI Avatars & Presenters: Digital Twin', 'ai-avatars-presenters-digital-twin', 200);
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'text-to-cinematic-video' AND level = 3 LIMIT 1), 'AI Avatars & Presenters: Animated Mascot AI', 'ai-avatars-presenters-animated-mascot-ai', 210);

-- Thank-You Note Writers (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'thank-you-note-writers' AND level = 3 LIMIT 1), 'Invitation & RSVP AI: Thank You Note AI', 'invitation-rsvp-ai-thank-you-note-ai', 10);

-- Toast & Roast Writers (2 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'toast-roast-writers' AND level = 3 LIMIT 1), 'Copywriting: Product Description Writers', 'copywriting-product-description-writers', 10),
((SELECT id FROM categories WHERE slug = 'toast-roast-writers' AND level = 3 LIMIT 1), 'Copywriting: Radio Script Writers', 'copywriting-radio-script-writers', 20);

-- Tool-Use Routing Systems (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'tool-use-routing-systems' AND level = 3 LIMIT 1), 'Vehicle AI: ADAS Systems', 'vehicle-ai-adas-systems', 10);

-- Vector Art Generators (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'vector-art-generators' AND level = 3 LIMIT 1), 'Vector & AI Databases: Vector Databases', 'vector-ai-databases-vector-databases', 10),
((SELECT id FROM categories WHERE slug = 'vector-art-generators' AND level = 3 LIMIT 1), 'Vector & AI Databases: Graph Databases for AI', 'vector-ai-databases-graph-databases-for-ai', 20),
((SELECT id FROM categories WHERE slug = 'vector-art-generators' AND level = 3 LIMIT 1), 'Vector & AI Databases: Embedding Services', 'vector-ai-databases-embedding-services', 30),
((SELECT id FROM categories WHERE slug = 'vector-art-generators' AND level = 3 LIMIT 1), 'Vector & AI Databases: Semantic Search APIs', 'vector-ai-databases-semantic-search-apis', 40),
((SELECT id FROM categories WHERE slug = 'vector-art-generators' AND level = 3 LIMIT 1), 'Vector & AI Databases: RAG Frameworks', 'vector-ai-databases-rag-frameworks', 50),
((SELECT id FROM categories WHERE slug = 'vector-art-generators' AND level = 3 LIMIT 1), 'Vector & AI Databases: Knowledge Graph Tools', 'vector-ai-databases-knowledge-graph-tools', 60),
((SELECT id FROM categories WHERE slug = 'vector-art-generators' AND level = 3 LIMIT 1), 'Vector & AI Databases: AI Cache Systems', 'vector-ai-databases-ai-cache-systems', 70),
((SELECT id FROM categories WHERE slug = 'vector-art-generators' AND level = 3 LIMIT 1), 'Vector & AI Databases: Context Window Management', 'vector-ai-databases-context-window-management', 80),
((SELECT id FROM categories WHERE slug = 'vector-art-generators' AND level = 3 LIMIT 1), 'Vector & AI Databases: Prompt Management', 'vector-ai-databases-prompt-management', 90),
((SELECT id FROM categories WHERE slug = 'vector-art-generators' AND level = 3 LIMIT 1), 'Vector & AI Databases: AI Gateway & Routing', 'vector-ai-databases-ai-gateway-routing', 100);

-- Virtual Front-Desk Agents (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'virtual-front-desk-agents' AND level = 3 LIMIT 1), 'Virtual Companion: AI Friend', 'virtual-companion-ai-friend', 10),
((SELECT id FROM categories WHERE slug = 'virtual-front-desk-agents' AND level = 3 LIMIT 1), 'Virtual Companion: AI Girlfriend', 'virtual-companion-ai-girlfriend', 20),
((SELECT id FROM categories WHERE slug = 'virtual-front-desk-agents' AND level = 3 LIMIT 1), 'Virtual Companion: AI Boyfriend', 'virtual-companion-ai-boyfriend', 30),
((SELECT id FROM categories WHERE slug = 'virtual-front-desk-agents' AND level = 3 LIMIT 1), 'Virtual Companion: Emotional Support AI', 'virtual-companion-emotional-support-ai', 40),
((SELECT id FROM categories WHERE slug = 'virtual-front-desk-agents' AND level = 3 LIMIT 1), 'Virtual Companion: AI Pen Pal Companion', 'virtual-companion-ai-pen-pal-companion', 50),
((SELECT id FROM categories WHERE slug = 'virtual-front-desk-agents' AND level = 3 LIMIT 1), 'Virtual Companion: AI Diary / Journal Partner', 'virtual-companion-ai-diary-journal-partner', 60),
((SELECT id FROM categories WHERE slug = 'virtual-front-desk-agents' AND level = 3 LIMIT 1), 'Virtual Companion: AI Accountability Partner', 'virtual-companion-ai-accountability-partner', 70),
((SELECT id FROM categories WHERE slug = 'virtual-front-desk-agents' AND level = 3 LIMIT 1), 'Virtual Companion: Elderly Companion AI', 'virtual-companion-elderly-companion-ai', 80),
((SELECT id FROM categories WHERE slug = 'virtual-front-desk-agents' AND level = 3 LIMIT 1), 'Virtual Companion: Grief Support AI', 'virtual-companion-grief-support-ai', 90),
((SELECT id FROM categories WHERE slug = 'virtual-front-desk-agents' AND level = 3 LIMIT 1), 'Virtual Companion: Loneliness Support AI', 'virtual-companion-loneliness-support-ai', 100);

-- Visual Flow Bot Designers (1 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'visual-flow-bot-designers' AND level = 3 LIMIT 1), 'AI QA Tools: Visual Testing AI', 'ai-qa-tools-visual-testing-ai', 10);

-- Voice-First Phone Agents (23 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'voice-first-phone-agents' AND level = 3 LIMIT 1), 'Task-Specific Agents: Workflow Automation Agents', 'task-specific-agents-workflow-automation-agents', 10),
((SELECT id FROM categories WHERE slug = 'voice-first-phone-agents' AND level = 3 LIMIT 1), 'Task-Specific Agents: Email Management Agents', 'task-specific-agents-email-management-agents', 20),
((SELECT id FROM categories WHERE slug = 'voice-first-phone-agents' AND level = 3 LIMIT 1), 'Task-Specific Agents: Document Processing Agents', 'task-specific-agents-document-processing-agents', 30),
((SELECT id FROM categories WHERE slug = 'voice-first-phone-agents' AND level = 3 LIMIT 1), 'Task-Specific Agents: Web Scraping Agents', 'task-specific-agents-web-scraping-agents', 40),
((SELECT id FROM categories WHERE slug = 'voice-first-phone-agents' AND level = 3 LIMIT 1), 'Task-Specific Agents: Customer Outreach Agents', 'task-specific-agents-customer-outreach-agents', 50),
((SELECT id FROM categories WHERE slug = 'voice-first-phone-agents' AND level = 3 LIMIT 1), 'Task-Specific Agents: Meeting Summary Agents', 'task-specific-agents-meeting-summary-agents', 60),
((SELECT id FROM categories WHERE slug = 'voice-first-phone-agents' AND level = 3 LIMIT 1), 'Voice Agents: AI Phone Callers', 'voice-agents-ai-phone-callers', 70),
((SELECT id FROM categories WHERE slug = 'voice-first-phone-agents' AND level = 3 LIMIT 1), 'Voice Agents: Voice Commerce', 'voice-agents-voice-commerce', 80),
((SELECT id FROM categories WHERE slug = 'voice-first-phone-agents' AND level = 3 LIMIT 1), 'Voice Agents: Voice Search Assistants', 'voice-agents-voice-search-assistants', 90),
((SELECT id FROM categories WHERE slug = 'voice-first-phone-agents' AND level = 3 LIMIT 1), 'Voice Agents: Smart Speaker Skills', 'voice-agents-smart-speaker-skills', 100),
((SELECT id FROM categories WHERE slug = 'voice-first-phone-agents' AND level = 3 LIMIT 1), 'Voice Agents: Reception AI', 'voice-agents-reception-ai', 110),
((SELECT id FROM categories WHERE slug = 'voice-first-phone-agents' AND level = 3 LIMIT 1), 'Voice Agents: Telehealth Voice', 'voice-agents-telehealth-voice', 120),
((SELECT id FROM categories WHERE slug = 'voice-first-phone-agents' AND level = 3 LIMIT 1), 'Voice Agents: Banking Voice Agent', 'voice-agents-banking-voice-agent', 130),
((SELECT id FROM categories WHERE slug = 'voice-first-phone-agents' AND level = 3 LIMIT 1), 'Voice Agents: Insurance Voice Agent', 'voice-agents-insurance-voice-agent', 140),
((SELECT id FROM categories WHERE slug = 'voice-first-phone-agents' AND level = 3 LIMIT 1), 'Keyboard & Input AI: AI Keyboard Shortcuts', 'keyboard-input-ai-ai-keyboard-shortcuts', 150),
((SELECT id FROM categories WHERE slug = 'voice-first-phone-agents' AND level = 3 LIMIT 1), 'Keyboard & Input AI: Predictive Typing Desktop', 'keyboard-input-ai-predictive-typing-desktop', 160),
((SELECT id FROM categories WHERE slug = 'voice-first-phone-agents' AND level = 3 LIMIT 1), 'Keyboard & Input AI: Voice-to-Action Desktop', 'keyboard-input-ai-voice-to-action-desktop', 170),
((SELECT id FROM categories WHERE slug = 'voice-first-phone-agents' AND level = 3 LIMIT 1), 'Keyboard & Input AI: Gesture Recognition AI', 'keyboard-input-ai-gesture-recognition-ai', 180),
((SELECT id FROM categories WHERE slug = 'voice-first-phone-agents' AND level = 3 LIMIT 1), 'Keyboard & Input AI: Eye Tracking AI', 'keyboard-input-ai-eye-tracking-ai', 190),
((SELECT id FROM categories WHERE slug = 'voice-first-phone-agents' AND level = 3 LIMIT 1), 'Keyboard & Input AI: Dictation & Commands', 'keyboard-input-ai-dictation-commands', 200);
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'voice-first-phone-agents' AND level = 3 LIMIT 1), 'Keyboard & Input AI: Text Expansion AI', 'keyboard-input-ai-text-expansion-ai', 210),
((SELECT id FROM categories WHERE slug = 'voice-first-phone-agents' AND level = 3 LIMIT 1), 'Keyboard & Input AI: Smart Autocomplete Desktop', 'keyboard-input-ai-smart-autocomplete-desktop', 220),
((SELECT id FROM categories WHERE slug = 'voice-first-phone-agents' AND level = 3 LIMIT 1), 'Keyboard & Input AI: Handwriting Recognition Desktop', 'keyboard-input-ai-handwriting-recognition-desktop', 230);

-- Voice Search Builders (3 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'voice-search-builders' AND level = 3 LIMIT 1), 'Semantic Search: E-commerce Search AI', 'semantic-search-e-commerce-search-ai', 10),
((SELECT id FROM categories WHERE slug = 'voice-search-builders' AND level = 3 LIMIT 1), 'Semantic Search: Documentation Search', 'semantic-search-documentation-search', 20),
((SELECT id FROM categories WHERE slug = 'voice-search-builders' AND level = 3 LIMIT 1), 'Semantic Search: Medical Search AI', 'semantic-search-medical-search-ai', 30);

-- VSCode AI Extensions (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'vscode-ai-extensions' AND level = 3 LIMIT 1), 'Productivity Extensions: AI Email Writer Extension', 'productivity-extensions-ai-email-writer-extension', 10),
((SELECT id FROM categories WHERE slug = 'vscode-ai-extensions' AND level = 3 LIMIT 1), 'Productivity Extensions: AI Grammar Extension', 'productivity-extensions-ai-grammar-extension', 20),
((SELECT id FROM categories WHERE slug = 'vscode-ai-extensions' AND level = 3 LIMIT 1), 'Productivity Extensions: AI Translator Extension', 'productivity-extensions-ai-translator-extension', 30),
((SELECT id FROM categories WHERE slug = 'vscode-ai-extensions' AND level = 3 LIMIT 1), 'Productivity Extensions: AI Note Taker Extension', 'productivity-extensions-ai-note-taker-extension', 40),
((SELECT id FROM categories WHERE slug = 'vscode-ai-extensions' AND level = 3 LIMIT 1), 'Productivity Extensions: AI Text Expander', 'productivity-extensions-ai-text-expander', 50),
((SELECT id FROM categories WHERE slug = 'vscode-ai-extensions' AND level = 3 LIMIT 1), 'Productivity Extensions: AI Citation Generator', 'productivity-extensions-ai-citation-generator', 60),
((SELECT id FROM categories WHERE slug = 'vscode-ai-extensions' AND level = 3 LIMIT 1), 'Productivity Extensions: AI Price Tracker Extension', 'productivity-extensions-ai-price-tracker-extension', 70),
((SELECT id FROM categories WHERE slug = 'vscode-ai-extensions' AND level = 3 LIMIT 1), 'Productivity Extensions: AI Job Search Extension', 'productivity-extensions-ai-job-search-extension', 80),
((SELECT id FROM categories WHERE slug = 'vscode-ai-extensions' AND level = 3 LIMIT 1), 'Productivity Extensions: AI Social Media Extension', 'productivity-extensions-ai-social-media-extension', 90),
((SELECT id FROM categories WHERE slug = 'vscode-ai-extensions' AND level = 3 LIMIT 1), 'Productivity Extensions: AI Meeting Recorder Extension', 'productivity-extensions-ai-meeting-recorder-extension', 100);

-- Website Localization Tools (10 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'website-localization-tools' AND level = 3 LIMIT 1), 'Translation & Localization: Document Translation', 'translation-localization-document-translation', 10),
((SELECT id FROM categories WHERE slug = 'website-localization-tools' AND level = 3 LIMIT 1), 'Translation & Localization: Website Translation', 'translation-localization-website-translation', 20),
((SELECT id FROM categories WHERE slug = 'website-localization-tools' AND level = 3 LIMIT 1), 'Translation & Localization: Real-Time Chat Translation', 'translation-localization-real-time-chat-translation', 30),
((SELECT id FROM categories WHERE slug = 'website-localization-tools' AND level = 3 LIMIT 1), 'Translation & Localization: Subtitle Translation', 'translation-localization-subtitle-translation', 40),
((SELECT id FROM categories WHERE slug = 'website-localization-tools' AND level = 3 LIMIT 1), 'Translation & Localization: App Localization', 'translation-localization-app-localization', 50),
((SELECT id FROM categories WHERE slug = 'website-localization-tools' AND level = 3 LIMIT 1), 'Translation & Localization: Marketing Translation', 'translation-localization-marketing-translation', 60),
((SELECT id FROM categories WHERE slug = 'website-localization-tools' AND level = 3 LIMIT 1), 'Translation & Localization: Legal Translation', 'translation-localization-legal-translation', 70),
((SELECT id FROM categories WHERE slug = 'website-localization-tools' AND level = 3 LIMIT 1), 'Translation & Localization: Medical Translation', 'translation-localization-medical-translation', 80),
((SELECT id FROM categories WHERE slug = 'website-localization-tools' AND level = 3 LIMIT 1), 'Translation & Localization: Technical Translation', 'translation-localization-technical-translation', 90),
((SELECT id FROM categories WHERE slug = 'website-localization-tools' AND level = 3 LIMIT 1), 'Translation & Localization: Cultural Adaptation', 'translation-localization-cultural-adaptation', 100);

-- Wedding Speech Generators (23 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'wedding-speech-generators' AND level = 3 LIMIT 1), 'Speech-to-Text: Meeting Transcription', 'speech-to-text-meeting-transcription', 10),
((SELECT id FROM categories WHERE slug = 'wedding-speech-generators' AND level = 3 LIMIT 1), 'Speech-to-Text: Call Center Transcription', 'speech-to-text-call-center-transcription', 20),
((SELECT id FROM categories WHERE slug = 'wedding-speech-generators' AND level = 3 LIMIT 1), 'Speech-to-Text: Podcast Transcription', 'speech-to-text-podcast-transcription', 30),
((SELECT id FROM categories WHERE slug = 'wedding-speech-generators' AND level = 3 LIMIT 1), 'Speech-to-Text: Multilingual Transcription', 'speech-to-text-multilingual-transcription', 40),
((SELECT id FROM categories WHERE slug = 'wedding-speech-generators' AND level = 3 LIMIT 1), 'Speech-to-Text: Accessibility Captioning', 'speech-to-text-accessibility-captioning', 50),
((SELECT id FROM categories WHERE slug = 'wedding-speech-generators' AND level = 3 LIMIT 1), 'Text-to-Speech: Natural Voice Synthesis', 'text-to-speech-natural-voice-synthesis', 60),
((SELECT id FROM categories WHERE slug = 'wedding-speech-generators' AND level = 3 LIMIT 1), 'Text-to-Speech: E-Learning Voiceover', 'text-to-speech-e-learning-voiceover', 70),
((SELECT id FROM categories WHERE slug = 'wedding-speech-generators' AND level = 3 LIMIT 1), 'Text-to-Speech: IVR & Phone Systems', 'text-to-speech-ivr-phone-systems', 80),
((SELECT id FROM categories WHERE slug = 'wedding-speech-generators' AND level = 3 LIMIT 1), 'Text-to-Speech: Podcast Voice', 'text-to-speech-podcast-voice', 90),
((SELECT id FROM categories WHERE slug = 'wedding-speech-generators' AND level = 3 LIMIT 1), 'Text-to-Speech: Video Narration', 'text-to-speech-video-narration', 100),
((SELECT id FROM categories WHERE slug = 'wedding-speech-generators' AND level = 3 LIMIT 1), 'Text-to-Speech: Accessibility Screen Readers', 'text-to-speech-accessibility-screen-readers', 110),
((SELECT id FROM categories WHERE slug = 'wedding-speech-generators' AND level = 3 LIMIT 1), 'Text-to-Speech: Language Translation Voice', 'text-to-speech-language-translation-voice', 120),
((SELECT id FROM categories WHERE slug = 'wedding-speech-generators' AND level = 3 LIMIT 1), 'Text-to-Speech: Character Voice Acting', 'text-to-speech-character-voice-acting', 130),
((SELECT id FROM categories WHERE slug = 'wedding-speech-generators' AND level = 3 LIMIT 1), 'Text-to-Speech: Brand Voice Creation', 'text-to-speech-brand-voice-creation', 140),
((SELECT id FROM categories WHERE slug = 'wedding-speech-generators' AND level = 3 LIMIT 1), 'Wedding AI Tools: Wedding Speech Writer', 'wedding-ai-tools-wedding-speech-writer', 150),
((SELECT id FROM categories WHERE slug = 'wedding-speech-generators' AND level = 3 LIMIT 1), 'Wedding AI Tools: Wedding Budget Planner AI', 'wedding-ai-tools-wedding-budget-planner-ai', 160),
((SELECT id FROM categories WHERE slug = 'wedding-speech-generators' AND level = 3 LIMIT 1), 'Wedding AI Tools: Wedding Vendor Finder', 'wedding-ai-tools-wedding-vendor-finder', 170),
((SELECT id FROM categories WHERE slug = 'wedding-speech-generators' AND level = 3 LIMIT 1), 'Wedding AI Tools: Wedding Timeline AI', 'wedding-ai-tools-wedding-timeline-ai', 180),
((SELECT id FROM categories WHERE slug = 'wedding-speech-generators' AND level = 3 LIMIT 1), 'Wedding AI Tools: Seating Chart AI Wedding', 'wedding-ai-tools-seating-chart-ai-wedding', 190),
((SELECT id FROM categories WHERE slug = 'wedding-speech-generators' AND level = 3 LIMIT 1), 'Wedding AI Tools: Wedding Photo Editor', 'wedding-ai-tools-wedding-photo-editor', 200);
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'wedding-speech-generators' AND level = 3 LIMIT 1), 'Wedding AI Tools: Wedding Registry AI', 'wedding-ai-tools-wedding-registry-ai', 210),
((SELECT id FROM categories WHERE slug = 'wedding-speech-generators' AND level = 3 LIMIT 1), 'Wedding AI Tools: Honeymoon Planner AI', 'wedding-ai-tools-honeymoon-planner-ai', 220),
((SELECT id FROM categories WHERE slug = 'wedding-speech-generators' AND level = 3 LIMIT 1), 'Wedding AI Tools: Wedding Hashtag Generator', 'wedding-ai-tools-wedding-hashtag-generator', 230);

-- YouTube Video Summarizers (36 listing types)
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Effects AI: Video Filter AI', 'video-effects-ai-video-filter-ai', 10),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Effects AI: Time-Lapse AI', 'video-effects-ai-time-lapse-ai', 20),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Effects AI: Cinemagraph AI', 'video-effects-ai-cinemagraph-ai', 30),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Effects AI: Video Transition AI', 'video-effects-ai-video-transition-ai', 40),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Effects AI: Glitch Effect AI', 'video-effects-ai-glitch-effect-ai', 50),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Effects AI: Retro Video Filter', 'video-effects-ai-retro-video-filter', 60),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Effects AI: Bokeh Effect AI', 'video-effects-ai-bokeh-effect-ai', 70),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Effects AI: Video Overlay AI', 'video-effects-ai-video-overlay-ai', 80),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Enhancement AI: Video Colorization', 'video-enhancement-ai-video-colorization', 90),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Enhancement AI: Video Denoising', 'video-enhancement-ai-video-denoising', 100),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Enhancement AI: Video Frame Rate Boost', 'video-enhancement-ai-video-frame-rate-boost', 110),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Enhancement AI: Video Resolution Upscale', 'video-enhancement-ai-video-resolution-upscale', 120),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Enhancement AI: VHS to Digital AI', 'video-enhancement-ai-vhs-to-digital-ai', 130),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Enhancement AI: Video Stabilizer Pro', 'video-enhancement-ai-video-stabilizer-pro', 140),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Enhancement AI: Low-Light Video Enhance', 'video-enhancement-ai-low-light-video-enhance', 150),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Enhancement AI: Video Sharpening AI', 'video-enhancement-ai-video-sharpening-ai', 160),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Enhancement AI: Video HDR Converter', 'video-enhancement-ai-video-hdr-converter', 170),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Analysis AI: Video Content Moderation', 'video-analysis-ai-video-content-moderation', 180),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Analysis AI: Video Scene Classification', 'video-analysis-ai-video-scene-classification', 190),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Analysis AI: Video Emotion Detection', 'video-analysis-ai-video-emotion-detection', 200);
INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Analysis AI: Video Action Recognition', 'video-analysis-ai-video-action-recognition', 210),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Analysis AI: Video OCR', 'video-analysis-ai-video-ocr', 220),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Analysis AI: Video Timeline Marker', 'video-analysis-ai-video-timeline-marker', 230),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Analysis AI: Video Highlight Extraction', 'video-analysis-ai-video-highlight-extraction', 240),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Analysis AI: Video Quality Assessment', 'video-analysis-ai-video-quality-assessment', 250),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Analysis AI: Video Accessibility Checker', 'video-analysis-ai-video-accessibility-checker', 260),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Dubbing & Localization: AI Video Dubbing', 'video-dubbing-localization-ai-video-dubbing', 270),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Dubbing & Localization: Lip Sync Translation', 'video-dubbing-localization-lip-sync-translation', 280),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Dubbing & Localization: Subtitle Generator Multi-Language', 'video-dubbing-localization-subtitle-generator-multi-language', 290),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Dubbing & Localization: Voice-Over Translation', 'video-dubbing-localization-voice-over-translation', 300),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Dubbing & Localization: Sign Language Overlay AI', 'video-dubbing-localization-sign-language-overlay-ai', 310),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Dubbing & Localization: Audio Description AI', 'video-dubbing-localization-audio-description-ai', 320),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Dubbing & Localization: Cultural Adaptation Video', 'video-dubbing-localization-cultural-adaptation-video', 330),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Dubbing & Localization: Regional Accent Video', 'video-dubbing-localization-regional-accent-video', 340),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Dubbing & Localization: Video Localization QA', 'video-dubbing-localization-video-localization-qa', 350),
((SELECT id FROM categories WHERE slug = 'youtube-video-summarizers' AND level = 3 LIMIT 1), 'Video Dubbing & Localization: Multilingual Thumbnail AI', 'video-dubbing-localization-multilingual-thumbnail-ai', 360);
