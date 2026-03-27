-- ============================================================
-- InfoWebWorld — Complete MySQL Schema
-- Optimized for 100K+ concurrent users on cPanel/MySQL 8+
-- Run this ONCE on your cPanel MySQL database
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- ============================================================
-- 1. ADMINS — dashboard login
-- ============================================================
CREATE TABLE `admins` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `display_name` VARCHAR(100) DEFAULT 'Admin',
  `email` VARCHAR(180) DEFAULT NULL,
  `role` ENUM('super_admin','admin','editor') NOT NULL DEFAULT 'admin',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `last_login_at` DATETIME DEFAULT NULL,
  `last_login_ip` VARCHAR(45) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_admins_username` (`username`),
  UNIQUE KEY `uk_admins_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 2. ADMIN SESSIONS — secure token-based auth
-- ============================================================
CREATE TABLE `admin_sessions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `admin_id` INT UNSIGNED NOT NULL,
  `token` VARCHAR(128) NOT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(500) DEFAULT NULL,
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sessions_token` (`token`),
  KEY `idx_sessions_admin` (`admin_id`),
  KEY `idx_sessions_expires` (`expires_at`),
  CONSTRAINT `fk_sessions_admin` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 3. CATEGORIES — business listing categories
-- ============================================================
CREATE TABLE `categories` (
  `id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(80) NOT NULL,
  `slug` VARCHAR(80) NOT NULL,
  `color` VARCHAR(7) NOT NULL DEFAULT '#6B7280',
  `sort_order` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_categories_slug` (`slug`),
  KEY `idx_categories_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 4. COUNTRIES — supported countries + phone codes
-- ============================================================
CREATE TABLE `countries` (
  `id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(80) NOT NULL,
  `code` CHAR(2) NOT NULL,
  `phone_code` VARCHAR(6) NOT NULL,
  `sort_order` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_countries_code` (`code`),
  KEY `idx_countries_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 5. PLANS — pricing tiers (founding, early adopter, standard)
-- ============================================================
CREATE TABLE `plans` (
  `id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(30) NOT NULL,
  `name` VARCHAR(60) NOT NULL,
  `tag_label` VARCHAR(40) DEFAULT NULL,
  `tag_color` VARCHAR(7) DEFAULT '#E8553D',
  `price` DECIMAL(8,2) NOT NULL,
  `currency` CHAR(3) NOT NULL DEFAULT 'USD',
  `period` ENUM('one-time','monthly','yearly') NOT NULL,
  `period_label` VARCHAR(100) DEFAULT NULL,
  `max_spots` INT UNSIGNED DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 0,
  `is_locked` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `features` JSON DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_plans_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 6. WAITLIST — email signups from landing page
-- ============================================================
CREATE TABLE `waitlist` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(180) NOT NULL,
  `source` ENUM('hero','footer','cta','popup','referral') NOT NULL DEFAULT 'hero',
  `referral_code` VARCHAR(20) DEFAULT NULL,
  `referred_by` BIGINT UNSIGNED DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(500) DEFAULT NULL,
  `country_code` CHAR(2) DEFAULT NULL,
  `status` ENUM('subscribed','confirmed','bounced','unsubscribed') NOT NULL DEFAULT 'subscribed',
  `confirmed_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_waitlist_email` (`email`),
  KEY `idx_waitlist_source` (`source`),
  KEY `idx_waitlist_status` (`status`),
  KEY `idx_waitlist_created` (`created_at`),
  KEY `idx_waitlist_referral` (`referral_code`),
  KEY `idx_waitlist_referred_by` (`referred_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 7. SUBMISSIONS — business listing applications
-- ============================================================
CREATE TABLE `submissions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL,
  `company_name` VARCHAR(200) NOT NULL,
  `contact_name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(180) NOT NULL,
  `phone_code` VARCHAR(6) DEFAULT '+1',
  `phone` VARCHAR(20) DEFAULT NULL,
  `website` VARCHAR(500) DEFAULT NULL,
  `category_id` SMALLINT UNSIGNED NOT NULL,
  `country_id` SMALLINT UNSIGNED NOT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `tagline` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `founded_year` SMALLINT UNSIGNED DEFAULT NULL,
  `team_size` VARCHAR(20) DEFAULT NULL,
  `plan_id` SMALLINT UNSIGNED NOT NULL,
  `status` ENUM('pending','confirmed','paid','active','rejected','suspended') NOT NULL DEFAULT 'pending',
  `payment_status` ENUM('unpaid','pending','completed','refunded','failed') NOT NULL DEFAULT 'unpaid',
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(500) DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `confirmed_at` DATETIME DEFAULT NULL,
  `paid_at` DATETIME DEFAULT NULL,
  `activated_at` DATETIME DEFAULT NULL,
  `expires_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_submissions_uuid` (`uuid`),
  KEY `idx_submissions_email` (`email`),
  KEY `idx_submissions_company` (`company_name`(50)),
  KEY `idx_submissions_category` (`category_id`),
  KEY `idx_submissions_country` (`country_id`),
  KEY `idx_submissions_plan` (`plan_id`),
  KEY `idx_submissions_status` (`status`),
  KEY `idx_submissions_payment` (`payment_status`),
  KEY `idx_submissions_created` (`created_at`),
  KEY `idx_submissions_status_created` (`status`, `created_at`),
  CONSTRAINT `fk_submissions_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `fk_submissions_country` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`),
  CONSTRAINT `fk_submissions_plan` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 8. PAYMENTS — payment transactions
-- ============================================================
CREATE TABLE `payments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `submission_id` BIGINT UNSIGNED NOT NULL,
  `plan_id` SMALLINT UNSIGNED NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `currency` CHAR(3) NOT NULL DEFAULT 'USD',
  `payment_method` ENUM('stripe','paypal','razorpay','bank_transfer','manual') DEFAULT NULL,
  `transaction_id` VARCHAR(200) DEFAULT NULL,
  `gateway_response` JSON DEFAULT NULL,
  `status` ENUM('pending','processing','completed','failed','refunded','disputed') NOT NULL DEFAULT 'pending',
  `refund_amount` DECIMAL(10,2) DEFAULT NULL,
  `refund_reason` VARCHAR(500) DEFAULT NULL,
  `refunded_at` DATETIME DEFAULT NULL,
  `paid_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_payments_transaction` (`transaction_id`),
  KEY `idx_payments_submission` (`submission_id`),
  KEY `idx_payments_status` (`status`),
  KEY `idx_payments_method` (`payment_method`),
  KEY `idx_payments_created` (`created_at`),
  CONSTRAINT `fk_payments_submission` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_payments_plan` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 9. BLOG POSTS — content management
-- ============================================================
CREATE TABLE `blog_posts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(120) NOT NULL,
  `title` VARCHAR(250) NOT NULL,
  `excerpt` VARCHAR(500) DEFAULT NULL,
  `body` MEDIUMTEXT NOT NULL,
  `body_html` MEDIUMTEXT DEFAULT NULL,
  `cover_image` VARCHAR(500) DEFAULT NULL,
  `author` VARCHAR(100) NOT NULL DEFAULT 'InfoWebWorld Team',
  `category` VARCHAR(60) NOT NULL DEFAULT 'Business Tips',
  `tags` JSON DEFAULT NULL,
  `status` ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `read_time` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  `seo_title` VARCHAR(70) DEFAULT NULL,
  `seo_description` VARCHAR(170) DEFAULT NULL,
  `seo_keywords` JSON DEFAULT NULL,
  `seo_og_image` VARCHAR(500) DEFAULT NULL,
  `seo_canonical` VARCHAR(500) DEFAULT NULL,
  `seo_no_index` TINYINT(1) NOT NULL DEFAULT 0,
  `published_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_blog_slug` (`slug`),
  KEY `idx_blog_status` (`status`),
  KEY `idx_blog_featured` (`is_featured`),
  KEY `idx_blog_category` (`category`),
  KEY `idx_blog_published` (`published_at`),
  KEY `idx_blog_status_published` (`status`, `published_at` DESC),
  FULLTEXT KEY `ft_blog_search` (`title`, `excerpt`, `body`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 10. BLOG ANALYTICS — daily aggregated per-post stats
-- ============================================================
CREATE TABLE `blog_analytics_daily` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `post_id` BIGINT UNSIGNED NOT NULL,
  `date` DATE NOT NULL,
  `views` INT UNSIGNED NOT NULL DEFAULT 0,
  `unique_views` INT UNSIGNED NOT NULL DEFAULT 0,
  `shares` INT UNSIGNED NOT NULL DEFAULT 0,
  `avg_read_seconds` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_blog_analytics` (`post_id`, `date`),
  KEY `idx_blog_analytics_date` (`date`),
  CONSTRAINT `fk_blog_analytics_post` FOREIGN KEY (`post_id`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 11. BLOG VIEWS — individual view events (granular tracking)
-- ============================================================
CREATE TABLE `blog_views` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `post_id` BIGINT UNSIGNED NOT NULL,
  `session_id` VARCHAR(64) DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(500) DEFAULT NULL,
  `referrer` VARCHAR(500) DEFAULT NULL,
  `device_type` ENUM('desktop','mobile','tablet') DEFAULT NULL,
  `country_code` CHAR(2) DEFAULT NULL,
  `read_seconds` SMALLINT UNSIGNED DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_blog_views_post` (`post_id`),
  KEY `idx_blog_views_session` (`session_id`),
  KEY `idx_blog_views_created` (`created_at`),
  KEY `idx_blog_views_post_created` (`post_id`, `created_at`),
  CONSTRAINT `fk_blog_views_post` FOREIGN KEY (`post_id`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 12. PAGE VIEWS — site-wide analytics
-- ============================================================
CREATE TABLE `page_views` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `page` VARCHAR(200) NOT NULL,
  `session_id` VARCHAR(64) DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(500) DEFAULT NULL,
  `referrer` VARCHAR(500) DEFAULT NULL,
  `utm_source` VARCHAR(100) DEFAULT NULL,
  `utm_medium` VARCHAR(100) DEFAULT NULL,
  `utm_campaign` VARCHAR(100) DEFAULT NULL,
  `utm_content` VARCHAR(200) DEFAULT NULL,
  `device_type` ENUM('desktop','mobile','tablet') DEFAULT NULL,
  `country` VARCHAR(2) DEFAULT NULL,
  `visitor_hash` VARCHAR(64) DEFAULT NULL,
  `is_unique` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pageviews_page` (`page`(50)),
  KEY `idx_pageviews_session` (`session_id`),
  KEY `idx_pageviews_created` (`created_at`),
  KEY `idx_pageviews_page_created` (`page`(50), `created_at`),
  KEY `idx_pageviews_visitor` (`visitor_hash`),
  KEY `idx_pageviews_utm` (`utm_source`),
  KEY `idx_pageviews_unique` (`is_unique`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 13. PAGE ANALYTICS — daily aggregated site stats
-- ============================================================
CREATE TABLE `page_analytics_daily` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `page` VARCHAR(200) NOT NULL,
  `date` DATE NOT NULL,
  `views` INT UNSIGNED NOT NULL DEFAULT 0,
  `unique_views` INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_page_analytics` (`page`(100), `date`),
  KEY `idx_page_analytics_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 14. CONTACT MESSAGES — inquiries & portfolio requests
-- ============================================================
CREATE TABLE `contact_messages` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(180) NOT NULL,
  `subject` VARCHAR(200) DEFAULT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('general','portfolio','support','partnership') NOT NULL DEFAULT 'general',
  `status` ENUM('new','read','replied','archived') NOT NULL DEFAULT 'new',
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `replied_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_contact_email` (`email`),
  KEY `idx_contact_status` (`status`),
  KEY `idx_contact_type` (`type`),
  KEY `idx_contact_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 15. REFERRALS — waitlist referral tracking
-- ============================================================
CREATE TABLE `referrals` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `referrer_id` BIGINT UNSIGNED NOT NULL,
  `referred_id` BIGINT UNSIGNED NOT NULL,
  `referral_code` VARCHAR(20) NOT NULL,
  `status` ENUM('pending','confirmed','rewarded') NOT NULL DEFAULT 'pending',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_referrals_referrer` (`referrer_id`),
  KEY `idx_referrals_referred` (`referred_id`),
  KEY `idx_referrals_code` (`referral_code`),
  CONSTRAINT `fk_referrals_referrer` FOREIGN KEY (`referrer_id`) REFERENCES `waitlist` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_referrals_referred` FOREIGN KEY (`referred_id`) REFERENCES `waitlist` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 16. EMAIL LOG — all sent emails tracked
-- ============================================================
CREATE TABLE `email_log` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `to_email` VARCHAR(180) NOT NULL,
  `subject` VARCHAR(300) NOT NULL,
  `template` VARCHAR(60) DEFAULT NULL,
  `status` ENUM('queued','sent','delivered','bounced','failed') NOT NULL DEFAULT 'queued',
  `provider` VARCHAR(30) DEFAULT NULL,
  `provider_id` VARCHAR(200) DEFAULT NULL,
  `error_message` VARCHAR(500) DEFAULT NULL,
  `sent_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email_to` (`to_email`),
  KEY `idx_email_status` (`status`),
  KEY `idx_email_template` (`template`),
  KEY `idx_email_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 17. SETTINGS — site-wide key-value config
-- ============================================================
CREATE TABLE `settings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `key_name` VARCHAR(100) NOT NULL,
  `value` TEXT DEFAULT NULL,
  `type` ENUM('string','number','boolean','json') NOT NULL DEFAULT 'string',
  `description` VARCHAR(300) DEFAULT NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_settings_key` (`key_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 18. AUDIT LOG — track all admin actions
-- ============================================================
CREATE TABLE `audit_log` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `admin_id` INT UNSIGNED DEFAULT NULL,
  `action` VARCHAR(60) NOT NULL,
  `entity_type` VARCHAR(40) DEFAULT NULL,
  `entity_id` BIGINT UNSIGNED DEFAULT NULL,
  `details` JSON DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_audit_admin` (`admin_id`),
  KEY `idx_audit_action` (`action`),
  KEY `idx_audit_entity` (`entity_type`, `entity_id`),
  KEY `idx_audit_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 19. RATE LIMITING — API abuse prevention
-- ============================================================
CREATE TABLE `rate_limits` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ip_address` VARCHAR(45) NOT NULL,
  `endpoint` VARCHAR(100) NOT NULL,
  `hits` INT UNSIGNED NOT NULL DEFAULT 1,
  `window_start` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_rate_ip_endpoint_window` (`ip_address`, `endpoint`, `window_start`),
  KEY `idx_rate_window` (`window_start`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


SET FOREIGN_KEY_CHECKS = 1;


-- ============================================================
-- EVENTS — auto-cleanup old data (run on MySQL 8+ with EVENT_SCHEDULER)
-- ============================================================

DELIMITER ;;

-- Clean expired admin sessions every hour
CREATE EVENT IF NOT EXISTS `cleanup_expired_sessions`
ON SCHEDULE EVERY 1 HOUR
DO DELETE FROM `admin_sessions` WHERE `expires_at` < NOW();;

-- Clean rate limit entries older than 1 hour
CREATE EVENT IF NOT EXISTS `cleanup_rate_limits`
ON SCHEDULE EVERY 15 MINUTE
DO DELETE FROM `rate_limits` WHERE `window_start` < DATE_SUB(NOW(), INTERVAL 1 HOUR);;

-- Aggregate blog views into daily analytics (runs at midnight)
CREATE EVENT IF NOT EXISTS `aggregate_blog_analytics`
ON SCHEDULE EVERY 1 DAY
STARTS CONCAT(CURDATE() + INTERVAL 1 DAY, ' 00:05:00')
DO
BEGIN
  INSERT INTO `blog_analytics_daily` (`post_id`, `date`, `views`, `unique_views`, `avg_read_seconds`)
  SELECT
    `post_id`,
    DATE(`created_at`) as `date`,
    COUNT(*) as `views`,
    COUNT(DISTINCT `session_id`) as `unique_views`,
    AVG(`read_seconds`) as `avg_read_seconds`
  FROM `blog_views`
  WHERE DATE(`created_at`) = CURDATE() - INTERVAL 1 DAY
  GROUP BY `post_id`, DATE(`created_at`)
  ON DUPLICATE KEY UPDATE
    `views` = VALUES(`views`),
    `unique_views` = VALUES(`unique_views`),
    `avg_read_seconds` = VALUES(`avg_read_seconds`);
END;;

-- Aggregate page views daily
CREATE EVENT IF NOT EXISTS `aggregate_page_analytics`
ON SCHEDULE EVERY 1 DAY
STARTS CONCAT(CURDATE() + INTERVAL 1 DAY, ' 00:10:00')
DO
BEGIN
  INSERT INTO `page_analytics_daily` (`page`, `date`, `views`, `unique_views`)
  SELECT
    `page`,
    DATE(`created_at`) as `date`,
    COUNT(*) as `views`,
    COUNT(DISTINCT `session_id`) as `unique_views`
  FROM `page_views`
  WHERE DATE(`created_at`) = CURDATE() - INTERVAL 1 DAY
  GROUP BY `page`, DATE(`created_at`)
  ON DUPLICATE KEY UPDATE
    `views` = VALUES(`views`),
    `unique_views` = VALUES(`unique_views`);
END;;

-- Purge granular view logs older than 90 days (keep aggregated data forever)
CREATE EVENT IF NOT EXISTS `purge_old_views`
ON SCHEDULE EVERY 1 DAY
STARTS CONCAT(CURDATE() + INTERVAL 1 DAY, ' 01:00:00')
DO
BEGIN
  DELETE FROM `blog_views` WHERE `created_at` < DATE_SUB(NOW(), INTERVAL 90 DAY);
  DELETE FROM `page_views` WHERE `created_at` < DATE_SUB(NOW(), INTERVAL 90 DAY);
END;;

DELIMITER ;
