-- ============================================================
-- InfoWebWorld — Seed Data
-- Run AFTER schema.sql
-- ============================================================

-- ── Admin user (password: Info_@Web_@World@2026-03-26) ──
-- Hash generated with PHP: password_hash('Info_@Web_@World@2026-03-26', PASSWORD_BCRYPT)
-- You MUST regenerate this hash on your server. This is a placeholder.
INSERT INTO `admins` (`username`, `password_hash`, `display_name`, `email`, `role`) VALUES
('infowebworld2026', '$2y$12$PLACEHOLDER_REGENERATE_ON_SERVER', 'Aadil Parmar', 'admin@infowebworld.com', 'super_admin');


-- ── Categories (16 — matches ListingForm.tsx) ──
INSERT INTO `categories` (`name`, `slug`, `color`, `sort_order`) VALUES
('Technology & SaaS',     'technology-saas',      '#4361EE', 1),
('Restaurants & Food',    'restaurants-food',     '#E8553D', 2),
('Healthcare & Wellness', 'healthcare-wellness',  '#2FAE6A', 3),
('Real Estate',           'real-estate',          '#3B82F6', 4),
('Legal & Financial',     'legal-financial',      '#8B5CF6', 5),
('Education & Training',  'education-training',   '#14B8A6', 6),
('Marketing & Creative',  'marketing-creative',   '#EC4899', 7),
('Home Services',         'home-services',        '#F59E0B', 8),
('Automotive',            'automotive',           '#6B7280', 9),
('Beauty & Spa',          'beauty-spa',           '#D4729A', 10),
('Fitness & Sports',      'fitness-sports',       '#5CB8A2', 11),
('Finance & Banking',     'finance-banking',      '#D4A028', 12),
('Travel & Hospitality',  'travel-hospitality',   '#4A9BDE', 13),
('Design & Architecture', 'design-architecture',  '#FF6B8A', 14),
('Manufacturing',         'manufacturing',        '#2B4C8C', 15),
('Non-Profit & NGO',      'non-profit-ngo',       '#7C5CFC', 16);


-- ── Countries (11 — matches ListingForm.tsx) ──
INSERT INTO `countries` (`name`, `code`, `phone_code`, `sort_order`) VALUES
('United States',  'US', '+1',   1),
('India',          'IN', '+91',  2),
('United Kingdom', 'GB', '+44',  3),
('Canada',         'CA', '+1',   4),
('Australia',      'AU', '+61',  5),
('Germany',        'DE', '+49',  6),
('France',         'FR', '+33',  7),
('Netherlands',    'NL', '+31',  8),
('Singapore',      'SG', '+65',  9),
('UAE',            'AE', '+971', 10),
('Other',          'XX', '+0',   99);


-- ── Plans (3 tiers — matches pricing section) ──
INSERT INTO `plans` (`slug`, `name`, `tag_label`, `tag_color`, `price`, `period`, `period_label`, `max_spots`, `is_active`, `is_locked`, `sort_order`, `features`) VALUES
('founding', 'Founding Company', 'First 200 Only', '#E8553D', 240.00, 'one-time',
 'Lifetime — pay once, listed forever', 200, 1, 0, 1,
 '["Permanent lifetime listing","Founding Member badge","Dofollow backlink (DA 72+)","Priority search placement","Verified business profile","Analytics dashboard","Unlimited photos & media","Lead generation tools"]'),

('early-adopter', 'Early Adopter', 'First 1,000', '#4361EE', 99.00, 'yearly',
 '59% off standard yearly price', 1000, 0, 1, 2,
 '["Full business listing","Dofollow backlink (DA 72+)","Verified profile badge","Review management","Analytics dashboard","Lead generation tools","Priority support","Social media integration"]'),

('standard', 'Standard', 'Post-Launch', '#2FAE6A', 240.00, 'yearly',
 'Regular launch pricing', NULL, 0, 1, 3,
 '["Full business listing","Dofollow backlink (DA 72+)","Verified profile badge","Review management","Analytics dashboard","Lead generation tools"]');


-- ── Default Settings ──
INSERT INTO `settings` (`key_name`, `value`, `type`, `description`) VALUES
('site_name',           'InfoWebWorld',           'string',  'Site display name'),
('site_url',            'https://infowebworld.com', 'string', 'Canonical site URL'),
('pioneer_joined',      '15',                     'number',  'Number of pioneer members joined'),
('pioneer_total',       '200',                    'number',  'Total pioneer spots'),
('launch_date',         '2026-04-25',             'string',  'Target launch date'),
('contact_email',       'hello@infowebworld.com', 'string',  'Public contact email'),
('maintenance_mode',    'false',                  'boolean', 'Enable maintenance mode'),
('analytics_enabled',   'true',                   'boolean', 'Enable page view tracking'),
('blog_comments',       'false',                  'boolean', 'Enable blog comments'),
('default_og_image',    '/og-image.png',          'string',  'Default OpenGraph image'),
('gtm_id',             '',                        'string',  'Google Tag Manager ID'),
('smtp_host',          '',                        'string',  'SMTP server host'),
('smtp_port',          '587',                     'number',  'SMTP server port'),
('smtp_user',          '',                        'string',  'SMTP username'),
('smtp_pass',          '',                        'string',  'SMTP password (encrypted)');
