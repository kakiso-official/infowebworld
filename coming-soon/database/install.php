<?php
/**
 * InfoWebWorld — One-Click Database Installer
 *
 * INSTRUCTIONS:
 * 1. In cPanel → MySQL Databases → create a database + user + grant ALL PRIVILEGES
 * 2. Upload this file to public_html/infowebworld/install.php
 * 3. Visit https://yourdomain.com/infowebworld/install.php
 * 4. Fill in your DB credentials and click Install
 * 5. The file SELF-DELETES after successful installation
 */

// Prevent caching
header('Cache-Control: no-store');

$result = null;
$error = null;
$success = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'install') {

    $host = trim($_POST['db_host'] ?? 'localhost');
    $name = trim($_POST['db_name'] ?? '');
    $user = trim($_POST['db_user'] ?? '');
    $pass = $_POST['db_pass'] ?? '';
    $adminUser = trim($_POST['admin_user'] ?? 'infowebworld2026');
    $adminPass = $_POST['admin_pass'] ?? 'Info_@Web_@World@2026-03-26';
    $adminEmail = trim($_POST['admin_email'] ?? 'admin@infowebworld.com');
    $adminName = trim($_POST['admin_name'] ?? 'Admin');

    if (!$name || !$user) {
        $error = 'Database name and user are required.';
    } else {
        try {
            $dsn = "mysql:host=$host;charset=utf8mb4";
            $pdo = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);

            // Select the database
            $pdo->exec("USE `$name`");

            // ═══════════════════════════════════════════
            // RUN SCHEMA — All 19 tables
            // ═══════════════════════════════════════════

            $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");

            // 1. Admins
            $pdo->exec("CREATE TABLE IF NOT EXISTS `admins` (
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
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            // 2. Admin Sessions
            $pdo->exec("CREATE TABLE IF NOT EXISTS `admin_sessions` (
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
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            // 3. Categories
            $pdo->exec("CREATE TABLE IF NOT EXISTS `categories` (
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
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            // 4. Countries
            $pdo->exec("CREATE TABLE IF NOT EXISTS `countries` (
                `id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
                `name` VARCHAR(80) NOT NULL,
                `code` CHAR(2) NOT NULL,
                `phone_code` VARCHAR(6) NOT NULL,
                `sort_order` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
                `is_active` TINYINT(1) NOT NULL DEFAULT 1,
                PRIMARY KEY (`id`),
                UNIQUE KEY `uk_countries_code` (`code`),
                KEY `idx_countries_sort` (`sort_order`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            // 5. Plans
            $pdo->exec("CREATE TABLE IF NOT EXISTS `plans` (
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
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            // 6. Waitlist
            $pdo->exec("CREATE TABLE IF NOT EXISTS `waitlist` (
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
                KEY `idx_waitlist_created` (`created_at`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            // 7. Submissions
            $pdo->exec("CREATE TABLE IF NOT EXISTS `submissions` (
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
                KEY `idx_submissions_category` (`category_id`),
                KEY `idx_submissions_country` (`country_id`),
                KEY `idx_submissions_plan` (`plan_id`),
                KEY `idx_submissions_status` (`status`),
                KEY `idx_submissions_created` (`created_at`),
                CONSTRAINT `fk_submissions_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
                CONSTRAINT `fk_submissions_country` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`),
                CONSTRAINT `fk_submissions_plan` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            // 8. Payments
            $pdo->exec("CREATE TABLE IF NOT EXISTS `payments` (
                `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                `submission_id` BIGINT UNSIGNED NOT NULL,
                `plan_id` SMALLINT UNSIGNED NOT NULL,
                `amount` DECIMAL(10,2) NOT NULL,
                `currency` CHAR(3) NOT NULL DEFAULT 'USD',
                `payment_method` ENUM('stripe','paypal','razorpay','bank_transfer','manual') DEFAULT NULL,
                `transaction_id` VARCHAR(200) DEFAULT NULL,
                `gateway_response` JSON DEFAULT NULL,
                `status` ENUM('pending','processing','completed','failed','refunded','disputed') NOT NULL DEFAULT 'pending',
                `paid_at` DATETIME DEFAULT NULL,
                `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`),
                KEY `idx_payments_submission` (`submission_id`),
                KEY `idx_payments_status` (`status`),
                KEY `idx_payments_created` (`created_at`),
                CONSTRAINT `fk_payments_submission` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE,
                CONSTRAINT `fk_payments_plan` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            // 9. Blog Posts
            $pdo->exec("CREATE TABLE IF NOT EXISTS `blog_posts` (
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
                KEY `idx_blog_published` (`published_at`),
                FULLTEXT KEY `ft_blog_search` (`title`, `excerpt`, `body`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            // 10. Blog Analytics Daily
            $pdo->exec("CREATE TABLE IF NOT EXISTS `blog_analytics_daily` (
                `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                `post_id` BIGINT UNSIGNED NOT NULL,
                `date` DATE NOT NULL,
                `views` INT UNSIGNED NOT NULL DEFAULT 0,
                `unique_views` INT UNSIGNED NOT NULL DEFAULT 0,
                `shares` INT UNSIGNED NOT NULL DEFAULT 0,
                `avg_read_seconds` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
                PRIMARY KEY (`id`),
                UNIQUE KEY `uk_blog_analytics` (`post_id`, `date`),
                CONSTRAINT `fk_blog_analytics_post` FOREIGN KEY (`post_id`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            // 11. Blog Views
            $pdo->exec("CREATE TABLE IF NOT EXISTS `blog_views` (
                `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                `post_id` BIGINT UNSIGNED NOT NULL,
                `session_id` VARCHAR(64) DEFAULT NULL,
                `ip_address` VARCHAR(45) DEFAULT NULL,
                `user_agent` VARCHAR(500) DEFAULT NULL,
                `referrer` VARCHAR(500) DEFAULT NULL,
                `device_type` ENUM('desktop','mobile','tablet') DEFAULT NULL,
                `read_seconds` SMALLINT UNSIGNED DEFAULT 0,
                `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`),
                KEY `idx_blog_views_post` (`post_id`),
                KEY `idx_blog_views_created` (`created_at`),
                CONSTRAINT `fk_blog_views_post` FOREIGN KEY (`post_id`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            // 12. Page Views
            $pdo->exec("CREATE TABLE IF NOT EXISTS `page_views` (
                `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                `page` VARCHAR(200) NOT NULL,
                `session_id` VARCHAR(64) DEFAULT NULL,
                `ip_address` VARCHAR(45) DEFAULT NULL,
                `user_agent` VARCHAR(500) DEFAULT NULL,
                `referrer` VARCHAR(500) DEFAULT NULL,
                `device_type` ENUM('desktop','mobile','tablet') DEFAULT NULL,
                `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`),
                KEY `idx_pageviews_page` (`page`(50)),
                KEY `idx_pageviews_created` (`created_at`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            // 13. Contact Messages
            $pdo->exec("CREATE TABLE IF NOT EXISTS `contact_messages` (
                `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                `name` VARCHAR(120) NOT NULL,
                `email` VARCHAR(180) NOT NULL,
                `subject` VARCHAR(200) DEFAULT NULL,
                `message` TEXT NOT NULL,
                `type` ENUM('general','portfolio','support','partnership') NOT NULL DEFAULT 'general',
                `status` ENUM('new','read','replied','archived') NOT NULL DEFAULT 'new',
                `ip_address` VARCHAR(45) DEFAULT NULL,
                `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`),
                KEY `idx_contact_status` (`status`),
                KEY `idx_contact_created` (`created_at`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            // 14. Settings
            $pdo->exec("CREATE TABLE IF NOT EXISTS `settings` (
                `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                `key_name` VARCHAR(100) NOT NULL,
                `value` TEXT DEFAULT NULL,
                `type` ENUM('string','number','boolean','json') NOT NULL DEFAULT 'string',
                `description` VARCHAR(300) DEFAULT NULL,
                `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`),
                UNIQUE KEY `uk_settings_key` (`key_name`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            // 15. Audit Log
            $pdo->exec("CREATE TABLE IF NOT EXISTS `audit_log` (
                `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                `admin_id` INT UNSIGNED DEFAULT NULL,
                `action` VARCHAR(60) NOT NULL,
                `entity_type` VARCHAR(40) DEFAULT NULL,
                `entity_id` BIGINT UNSIGNED DEFAULT NULL,
                `details` JSON DEFAULT NULL,
                `ip_address` VARCHAR(45) DEFAULT NULL,
                `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`),
                KEY `idx_audit_action` (`action`),
                KEY `idx_audit_created` (`created_at`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            // 16. Rate Limits
            $pdo->exec("CREATE TABLE IF NOT EXISTS `rate_limits` (
                `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                `ip_address` VARCHAR(45) NOT NULL,
                `endpoint` VARCHAR(100) NOT NULL,
                `hits` INT UNSIGNED NOT NULL DEFAULT 1,
                `window_start` DATETIME NOT NULL,
                PRIMARY KEY (`id`),
                UNIQUE KEY `uk_rate_ip_endpoint_window` (`ip_address`, `endpoint`, `window_start`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");

            // ═══════════════════════════════════════════
            // SEED DATA
            // ═══════════════════════════════════════════

            // Admin user with bcrypt hash
            $hash = password_hash($adminPass, PASSWORD_BCRYPT);
            $stmt = $pdo->prepare("INSERT IGNORE INTO `admins` (`username`,`password_hash`,`display_name`,`email`,`role`) VALUES (?,?,?,?,'super_admin')");
            $stmt->execute([$adminUser, $hash, $adminName, $adminEmail]);

            // Categories
            $cats = [
                ['Technology & SaaS','technology-saas','#4361EE'],['Restaurants & Food','restaurants-food','#E8553D'],
                ['Healthcare & Wellness','healthcare-wellness','#2FAE6A'],['Real Estate','real-estate','#3B82F6'],
                ['Legal & Financial','legal-financial','#8B5CF6'],['Education & Training','education-training','#14B8A6'],
                ['Marketing & Creative','marketing-creative','#EC4899'],['Home Services','home-services','#F59E0B'],
                ['Automotive','automotive','#6B7280'],['Beauty & Spa','beauty-spa','#D4729A'],
                ['Fitness & Sports','fitness-sports','#5CB8A2'],['Finance & Banking','finance-banking','#D4A028'],
                ['Travel & Hospitality','travel-hospitality','#4A9BDE'],['Design & Architecture','design-architecture','#FF6B8A'],
                ['Manufacturing','manufacturing','#2B4C8C'],['Non-Profit & NGO','non-profit-ngo','#7C5CFC'],
            ];
            $catStmt = $pdo->prepare("INSERT IGNORE INTO `categories` (`name`,`slug`,`color`,`sort_order`) VALUES (?,?,?,?)");
            foreach ($cats as $i => $c) { $catStmt->execute([$c[0], $c[1], $c[2], $i+1]); }

            // Countries
            $countries = [
                ['United States','US','+1'],['India','IN','+91'],['United Kingdom','GB','+44'],
                ['Canada','CA','+1'],['Australia','AU','+61'],['Germany','DE','+49'],
                ['France','FR','+33'],['Netherlands','NL','+31'],['Singapore','SG','+65'],
                ['UAE','AE','+971'],['Other','XX','+0'],
            ];
            $coStmt = $pdo->prepare("INSERT IGNORE INTO `countries` (`name`,`code`,`phone_code`,`sort_order`) VALUES (?,?,?,?)");
            foreach ($countries as $i => $c) { $coStmt->execute([$c[0], $c[1], $c[2], $i+1]); }

            // Plans
            $pdo->exec("INSERT IGNORE INTO `plans` (`slug`,`name`,`tag_label`,`tag_color`,`price`,`period`,`period_label`,`max_spots`,`is_active`,`is_locked`,`sort_order`,`features`) VALUES
                ('founding','Founding Company','First 200 Only','#E8553D',240.00,'one-time','Lifetime — pay once, listed forever',200,1,0,1,'[\"Permanent lifetime listing\",\"Founding Member badge\",\"Dofollow backlink (DA 72+)\",\"Priority search placement\",\"Verified business profile\",\"Analytics dashboard\",\"Unlimited photos & media\",\"Lead generation tools\"]'),
                ('early-adopter','Early Adopter','First 1,000','#4361EE',99.00,'yearly','59% off standard yearly price',1000,0,1,2,'[\"Full business listing\",\"Dofollow backlink (DA 72+)\",\"Verified profile badge\",\"Review management\",\"Analytics dashboard\",\"Lead generation tools\",\"Priority support\",\"Social media integration\"]'),
                ('standard','Standard','Post-Launch','#2FAE6A',240.00,'yearly','Regular launch pricing',NULL,0,1,3,'[\"Full business listing\",\"Dofollow backlink (DA 72+)\",\"Verified profile badge\",\"Review management\",\"Analytics dashboard\",\"Lead generation tools\"]')
            ");

            // Settings
            $pdo->exec("INSERT IGNORE INTO `settings` (`key_name`,`value`,`type`,`description`) VALUES
                ('site_name','InfoWebWorld','string','Site name'),
                ('site_url','https://kiranelectro.com/infowebworld','string','Site URL'),
                ('pioneer_joined','15','number','Pioneer members joined'),
                ('pioneer_total','200','number','Total pioneer spots'),
                ('launch_date','2026-04-25','string','Launch date'),
                ('contact_email','hello@infowebworld.com','string','Contact email')
            ");

            // ═══════════════════════════════════════════
            // CREATE config.php
            // ═══════════════════════════════════════════
            $configContent = "<?php\ndefine('DB_HOST','$host');\ndefine('DB_NAME','$name');\ndefine('DB_USER','$user');\ndefine('DB_PASS','$pass');\ndefine('DB_CHARSET','utf8mb4');\n\nfunction getDB():PDO{\n    static \$pdo=null;\n    if(\$pdo===null){\n        \$pdo=new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset='.DB_CHARSET,DB_USER,DB_PASS,[\n            PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,\n            PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC,\n            PDO::ATTR_EMULATE_PREPARES=>false,\n        ]);\n    }\n    return \$pdo;\n}\n";

            $configPath = dirname(__DIR__) . '/iww-config.php';
            file_put_contents($configPath, $configContent);

            // Count tables
            $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
            $tableCount = count($tables);

            $success = true;
            $result = "Database installed successfully!\n\n"
                . "Tables created: $tableCount\n"
                . "Admin user: $adminUser\n"
                . "Config saved to: $configPath\n\n"
                . "This installer will now self-delete.";

            // Self-delete
            @unlink(__FILE__);

        } catch (PDOException $e) {
            $error = 'Database error: ' . $e->getMessage();
        } catch (Exception $e) {
            $error = 'Error: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>InfoWebWorld — Database Installer</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,sans-serif;background:#FAF5F0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1rem}
.card{background:#fff;border-radius:20px;border:1.5px solid #E8E3DE;padding:2rem;max-width:460px;width:100%}
h1{font-size:1.2rem;font-weight:800;color:#1A1A1A;margin-bottom:.25rem}
p.sub{font-size:.78rem;color:#5C5C5C;margin-bottom:1.5rem}
label{display:block;font-size:.7rem;font-weight:700;color:#1A1A1A;margin-bottom:.3rem}
input{width:100%;height:44px;border:1.5px solid #E8E3DE;border-radius:12px;padding:0 .85rem;font-size:.82rem;color:#1A1A1A;outline:none;background:#FAF5F0;margin-bottom:.85rem}
input:focus{border-color:#E8553D;box-shadow:0 0 0 3px rgba(232,85,61,.08);background:#fff}
.row{display:grid;grid-template-columns:1fr 1fr;gap:.5rem}
button{width:100%;height:48px;border:none;border-radius:999px;background:#E8553D;color:#fff;font-size:.85rem;font-weight:700;cursor:pointer;margin-top:.5rem}
button:hover{background:#D44A33}
.ok{background:#D4F5E2;color:#2FAE6A;padding:1rem;border-radius:14px;font-size:.78rem;white-space:pre-line;margin-bottom:1rem;font-weight:600}
.err{background:#FDDDD6;color:#E8553D;padding:1rem;border-radius:14px;font-size:.78rem;margin-bottom:1rem;font-weight:600}
.note{font-size:.62rem;color:#9A9590;margin-top:1rem;line-height:1.5}
hr{border:none;height:1px;background:#E8E3DE;margin:1.25rem 0}
</style>
</head>
<body>
<div class="card">
<?php if ($success): ?>
    <h1>Installation Complete</h1>
    <div class="ok"><?= htmlspecialchars($result) ?></div>
    <p class="note">This file has been automatically deleted for security. Your database is ready.</p>
<?php else: ?>
    <h1>InfoWebWorld Database Setup</h1>
    <p class="sub">Fill in your cPanel MySQL credentials. Everything else is automatic.</p>

    <?php if ($error): ?>
        <div class="err"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>

    <form method="POST">
        <input type="hidden" name="action" value="install">

        <label>Database Host</label>
        <input type="text" name="db_host" value="localhost" required>

        <label>Database Name *</label>
        <input type="text" name="db_name" placeholder="e.g. kiranele_infowebdb" required>

        <label>Database User *</label>
        <input type="text" name="db_user" placeholder="e.g. kiranele_iwwadmin" required>

        <label>Database Password *</label>
        <input type="password" name="db_pass" placeholder="Your database password" required>

        <hr>

        <label>Admin Username</label>
        <input type="text" name="admin_user" value="infowebworld2026" required>

        <label>Admin Password</label>
        <input type="text" name="admin_pass" value="Info_@Web_@World@2026-03-26" required>

        <div class="row">
            <div>
                <label>Admin Name</label>
                <input type="text" name="admin_name" value="Aadil Parmar" required>
            </div>
            <div>
                <label>Admin Email</label>
                <input type="email" name="admin_email" value="admin@infowebworld.com" required>
            </div>
        </div>

        <button type="submit">Install Database</button>
    </form>

    <p class="note">This will create 16 tables, seed categories/countries/plans, create the admin user with a bcrypt-hashed password, and save your database config. The installer self-deletes after completion.</p>
<?php endif; ?>
</div>
</body>
</html>
