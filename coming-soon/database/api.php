<?php
/**
 * InfoWebWorld — REST API Router
 *
 * Deploy to: public_html/api.php (or public_html/api/index.php)
 * Handles all API requests for the static frontend.
 *
 * URL patterns:
 *   POST /api.php?action=waitlist_join
 *   POST /api.php?action=submission_create
 *   POST /api.php?action=track_pageview
 *   POST /api.php?action=track_blog_view
 *   GET  /api.php?action=blog_list
 *   GET  /api.php?action=blog_get&slug=...
 *   POST /api.php?action=admin_login
 *   GET  /api.php?action=admin_dashboard    (requires auth)
 *   ...etc
 */

require_once __DIR__ . '/../iww-config.php'; // Created by installer

// ── Helper functions ──
function setCorsHeaders(): void {
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
}

function jsonResponse(mixed $data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function getJsonBody(): array {
    $data = json_decode(file_get_contents('php://input'), true);
    return is_array($data) ? $data : [];
}

function checkRateLimit(string $endpoint, int $max = 60, int $window = 60): bool {
    try {
        $db = getDB();
        $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        $ws = date('Y-m-d H:i:s', floor(time() / $window) * $window);
        $db->prepare("INSERT INTO rate_limits (ip_address,endpoint,hits,window_start) VALUES (?,?,1,?) ON DUPLICATE KEY UPDATE hits=hits+1")->execute([$ip,$endpoint,$ws]);
        $stmt = $db->prepare("SELECT hits FROM rate_limits WHERE ip_address=? AND endpoint=? AND window_start=?");
        $stmt->execute([$ip,$endpoint,$ws]);
        return ($stmt->fetchColumn() ?: 0) <= $max;
    } catch (Exception $e) { return true; }
}


// ============================================================
// TRACKING HELPERS — Bot filter, device detect, country, dedup
// ============================================================

/**
 * #1 Bot Filtering — returns true if User-Agent is a known bot/crawler
 */
function isBot(): bool {
    $ua = strtolower($_SERVER['HTTP_USER_AGENT'] ?? '');
    if (!$ua) return true; // No UA = suspicious

    $bots = [
        // Search engines
        'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
        'yandexbot', 'sogou', 'exabot', 'ia_archiver',
        // Social crawlers
        'facebookexternalhit', 'twitterbot', 'linkedinbot', 'whatsapp',
        'telegrambot', 'slackbot', 'discordbot', 'pinterestbot',
        // SEO / monitoring tools
        'semrushbot', 'ahrefsbot', 'mj12bot', 'dotbot', 'rogerbot',
        'screaming frog', 'sitebulb', 'deepcrawl',
        // Generic patterns
        'bot/', 'spider/', 'crawl', 'scraper', 'fetch', 'archiver',
        'headlesschrome', 'phantomjs', 'puppeteer', 'playwright',
        'selenium', 'wget', 'curl/', 'python-requests', 'python-urllib',
        'go-http-client', 'java/', 'apache-httpclient', 'okhttp',
        'node-fetch', 'axios/', 'http_request', 'libwww-perl',
        'mechanize', 'scrapy', 'nutch', 'colly',
        // Preview bots
        'preview', 'thumbnail', 'snap url',
        // Uptime monitors
        'uptimerobot', 'pingdom', 'statuscake', 'site24x7',
        'newrelic', 'datadog', 'gtmetrix', 'pagespeed',
    ];

    foreach ($bots as $bot) {
        if (str_contains($ua, $bot)) return true;
    }
    return false;
}

/**
 * #3 Device Detection — parse User-Agent server-side
 */
function detectDevice(): string {
    $ua = strtolower($_SERVER['HTTP_USER_AGENT'] ?? '');
    if (!$ua) return 'desktop';

    // Tablet patterns (check before mobile — tablets also match "mobile" sometimes)
    if (preg_match('/ipad|tablet|playbook|silk|kindle|nexus\s?(7|9|10)/i', $ua)) {
        return 'tablet';
    }
    // Mobile patterns
    if (preg_match('/mobile|android|iphone|ipod|opera\s?mini|iemobile|wp7|wp8|blackberry|bb10|windows\s?phone|symbian|webos/i', $ua)) {
        return 'mobile';
    }
    return 'desktop';
}

/**
 * #7 Country Detection — Cloudflare CF-IPCountry header (free)
 */
function getCountryCode(): ?string {
    // Cloudflare injects this header automatically
    $cc = $_SERVER['HTTP_CF_IPCOUNTRY'] ?? null;
    if ($cc && $cc !== 'XX' && strlen($cc) === 2) {
        return strtoupper($cc);
    }
    return null;
}

/**
 * #2 Visitor Hash — SHA256(IP + UA + date) for server-side dedup
 * Same visitor on same day = same hash = not unique
 */
function getVisitorHash(): string {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $day = date('Y-m-d');
    return hash('sha256', $ip . '|' . $ua . '|' . $day);
}

/**
 * Check if this visitor_hash has already been seen today for a given page
 */
function isUniqueVisitor(PDO $db, string $hash, string $table = 'page_views', ?string $extraCol = null, $extraVal = null): bool {
    if ($extraCol) {
        $stmt = $db->prepare(
            "SELECT 1 FROM `$table` WHERE visitor_hash = ? AND $extraCol = ? AND DATE(created_at) = CURDATE() LIMIT 1"
        );
        $stmt->execute([$hash, $extraVal]);
    } else {
        $stmt = $db->prepare(
            "SELECT 1 FROM `$table` WHERE visitor_hash = ? AND DATE(created_at) = CURDATE() LIMIT 1"
        );
        $stmt->execute([$hash]);
    }
    return !$stmt->fetch();
}

setCorsHeaders();

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

try {
    match($action) {
        // ── Public endpoints ──
        'waitlist_join'     => handleWaitlistJoin(),
        'submission_create' => handleSubmissionCreate(),
        'track_pageview'    => handleTrackPageview(),
        'track_blog_view'   => handleTrackBlogView(),
        'blog_list'         => handleBlogList(),
        'blog_get'          => handleBlogGet(),
        'dashboard_stats'   => handleDashboardStats(),
        'public_settings'   => handlePublicSettings(),
        'public_live_stats' => handlePublicLiveStats(),
        'waitlist_entries'  => handleWaitlistEntries(),
        'submission_list'   => handleSubmissionList(),
        'submission_status' => handleSubmissionStatusUpdate(),
        'submission_delete' => handleSubmissionDelete(),
        'blog_save'         => handleAdminBlogSave(),
        'blog_delete'       => handleAdminBlogDelete(),
        'blog_all'          => handleAdminBlogList(),

        // ── Category endpoints ──
        'category_list'          => handleCategoryList(),
        'category_get'           => handleCategoryGet(),
        'category_listings'      => handleCategoryListings(),
        'category_all'           => handleCategoryAll(),
        'category_save'          => handleCategorySave(),
        'category_delete'        => handleCategoryDelete(),
        'category_toggle_launch' => handleCategoryToggleLaunch(),
        'category_bulk_launch'   => handleCategoryBulkLaunch(),

        // ── Admin endpoints (auth required) ──
        'admin_login'       => handleAdminLogin(),
        'admin_dashboard'   => requireAuth(fn() => handleAdminDashboard()),
        'admin_submissions' => requireAuth(fn() => handleAdminSubmissions()),
        'admin_waitlist'    => requireAuth(fn() => handleAdminWaitlist()),
        'admin_blog_list'   => requireAuth(fn() => handleAdminBlogList()),
        'admin_blog_save'   => requireAuth(fn() => handleAdminBlogSave()),
        'admin_blog_delete' => requireAuth(fn() => handleAdminBlogDelete()),
        'admin_settings'    => handleAdminSettings(),

        // ── Cron endpoint ──
        'cron_rollup'       => handleCronRollup(),

        default => jsonResponse(['error' => 'Unknown action'], 404),
    };
} catch (Exception $e) {
    jsonResponse(['error' => 'Server error'], 500);
}


// ============================================================
// AUTH HELPERS
// ============================================================

function requireAuth(callable $handler): void {
    $token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $token = str_replace('Bearer ', '', $token);

    if (!$token) {
        jsonResponse(['error' => 'Unauthorized'], 401);
    }

    $db = getDB();
    $stmt = $db->prepare(
        "SELECT s.admin_id, a.username, a.role
         FROM admin_sessions s
         JOIN admins a ON a.id = s.admin_id
         WHERE s.token = ? AND s.expires_at > NOW() AND a.is_active = 1"
    );
    $stmt->execute([$token]);
    $session = $stmt->fetch();

    if (!$session) {
        jsonResponse(['error' => 'Session expired'], 401);
    }

    // Attach admin info to global for use in handlers
    $GLOBALS['admin'] = $session;
    $handler();
}


// ============================================================
// PUBLIC HANDLERS
// ============================================================

function handleWaitlistJoin(): void {
    if (!checkRateLimit('waitlist', 5, 60)) jsonResponse(['error' => 'Too many requests'], 429);

    $data = getJsonBody();
    $email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
    if (!$email) jsonResponse(['error' => 'Valid email required'], 400);

    $db = getDB();
    $stmt = $db->prepare(
        "INSERT IGNORE INTO waitlist (email, source, ip_address, user_agent)
         VALUES (?, ?, ?, ?)"
    );
    $stmt->execute([
        $email,
        $data['source'] ?? 'hero',
        $_SERVER['REMOTE_ADDR'] ?? null,
        substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 500),
    ]);

    jsonResponse(['ok' => true, 'message' => 'Welcome to the waitlist!']);
}


function handleSubmissionCreate(): void {
    if (!checkRateLimit('submission', 3, 300)) jsonResponse(['error' => 'Too many requests'], 429);

    $d = getJsonBody();

    // Validate required fields
    foreach (['companyName', 'contactName', 'email', 'category', 'country', 'tagline'] as $f) {
        if (empty($d[$f])) jsonResponse(['error' => "$f is required"], 400);
    }

    $email = filter_var($d['email'], FILTER_VALIDATE_EMAIL);
    if (!$email) jsonResponse(['error' => 'Valid email required'], 400);

    $db = getDB();

    // Look up IDs, fallback to 1 if not found
    $catId = $db->prepare("SELECT id FROM categories WHERE name = ?");
    $catId->execute([$d['category']]);
    $catId = $catId->fetchColumn() ?: 1;

    $countryId = $db->prepare("SELECT id FROM countries WHERE name = ?");
    $countryId->execute([$d['country']]);
    $countryId = $countryId->fetchColumn() ?: 1;

    $planId = $db->prepare("SELECT id FROM plans WHERE slug = ?");
    $planId->execute([$d['plan'] ?? 'founding']);
    $planId = $planId->fetchColumn() ?: 1;

    $uuid = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000, mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );

    $stmt = $db->prepare(
        "INSERT INTO submissions
         (uuid, company_name, contact_name, email, phone_code, phone, website,
          category_id, country_id, city, tagline, description, founded_year, team_size,
          plan_id, ip_address, user_agent)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
    );
    $stmt->execute([
        $uuid,
        $d['companyName'],
        $d['contactName'],
        $email,
        $d['phoneCode'] ?? '+1',
        $d['phone'] ?? null,
        $d['website'] ?? null,
        $catId,
        $countryId,
        $d['city'] ?? null,
        $d['tagline'],
        $d['description'] ?? null,
        !empty($d['founded']) ? (int)$d['founded'] : null,
        $d['employees'] ?? null,
        $planId,
        $_SERVER['REMOTE_ADDR'] ?? null,
        substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 500),
    ]);

    jsonResponse(['ok' => true, 'id' => $uuid, 'message' => 'Submission received!']);
}


function handleTrackPageview(): void {
    // #1 Bot filtering — silently drop bots
    if (isBot()) { jsonResponse(['ok' => true]); return; }

    if (!checkRateLimit('pageview', 120, 60)) return;

    $d = getJsonBody();
    $page = substr($d['page'] ?? '/', 0, 200);

    $db = getDB();

    // #2 Server-side unique visitor dedup
    $hash = getVisitorHash();
    $unique = isUniqueVisitor($db, $hash, 'page_views');

    // #3 Device detection (server-side, ignore client value)
    $device = detectDevice();

    // #7 Country detection via Cloudflare
    $country = getCountryCode();

    // #4 UTM parameter tracking
    $utmSource   = substr($d['utm_source']   ?? '', 0, 100) ?: null;
    $utmMedium   = substr($d['utm_medium']   ?? '', 0, 100) ?: null;
    $utmCampaign = substr($d['utm_campaign'] ?? '', 0, 100) ?: null;
    $utmContent  = substr($d['utm_content']  ?? '', 0, 200) ?: null;

    $stmt = $db->prepare(
        "INSERT INTO page_views
         (page, session_id, ip_address, user_agent, referrer,
          utm_source, utm_medium, utm_campaign, utm_content,
          device_type, country_code, visitor_hash, is_unique)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        $page,
        $d['sessionId'] ?? null,
        $_SERVER['REMOTE_ADDR'] ?? null,
        substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 500),
        substr($d['referrer'] ?? '', 0, 500) ?: null,
        $utmSource, $utmMedium, $utmCampaign, $utmContent,
        $device,
        $country,
        $hash,
        $unique ? 1 : 0,
    ]);

    jsonResponse(['ok' => true]);
}


function handleTrackBlogView(): void {
    // #1 Bot filtering — silently drop bots
    if (isBot()) { jsonResponse(['ok' => true]); return; }

    if (!checkRateLimit('blog_view', 120, 60)) return;

    $d = getJsonBody();
    $db = getDB();

    // Accept postId (numeric) or slug (string) — look up ID from slug if needed
    $postId = (int)($d['postId'] ?? 0);
    if (!$postId && !empty($d['slug'])) {
        $lookup = $db->prepare("SELECT id FROM blog_posts WHERE slug = ? LIMIT 1");
        $lookup->execute([$d['slug']]);
        $postId = (int)$lookup->fetchColumn();
    }
    if (!$postId) jsonResponse(['error' => 'postId or slug required'], 400);

    // Accept both readSeconds and readTime field names
    $readSeconds = (int)($d['readSeconds'] ?? $d['readTime'] ?? 0);

    // #2 Server-side unique visitor dedup
    $hash = getVisitorHash();
    $unique = isUniqueVisitor($db, $hash, 'blog_views', 'post_id', $postId);

    // #3 Device detection (server-side)
    $device = detectDevice();

    // #7 Country detection via Cloudflare
    $country = getCountryCode();

    // #4 UTM tracking
    $utmSource   = substr($d['utm_source']   ?? '', 0, 100) ?: null;
    $utmMedium   = substr($d['utm_medium']   ?? '', 0, 100) ?: null;
    $utmCampaign = substr($d['utm_campaign'] ?? '', 0, 100) ?: null;

    $stmt = $db->prepare(
        "INSERT INTO blog_views
         (post_id, session_id, ip_address, user_agent, referrer,
          utm_source, utm_medium, utm_campaign,
          device_type, country_code, visitor_hash, is_unique, read_seconds)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        $postId,
        $d['sessionId'] ?? null,
        $_SERVER['REMOTE_ADDR'] ?? null,
        substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 500),
        substr($d['referrer'] ?? '', 0, 500) ?: null,
        $utmSource, $utmMedium, $utmCampaign,
        $device,
        $country,
        $hash,
        $unique ? 1 : 0,
        $readSeconds,
    ]);

    // If share flag is set, increment shares in blog_analytics_daily
    if (!empty($d['share'])) {
        $today = date('Y-m-d');
        $db->prepare(
            "INSERT INTO blog_analytics_daily (post_id, date, views, unique_views, shares)
             VALUES (?, ?, 0, 0, 1)
             ON DUPLICATE KEY UPDATE shares = shares + 1"
        )->execute([$postId, $today]);
    }

    jsonResponse(['ok' => true]);
}


function handleBlogList(): void {
    $db = getDB();
    $stmt = $db->query(
        "SELECT id, slug, title, excerpt, cover_image, author, category, tags,
                read_time, published_at
         FROM blog_posts
         WHERE status = 'published'
         ORDER BY published_at DESC
         LIMIT 50"
    );
    jsonResponse($stmt->fetchAll());
}


function handleBlogGet(): void {
    $slug = $_GET['slug'] ?? '';
    if (!$slug) jsonResponse(['error' => 'slug required'], 400);

    $db = getDB();
    $stmt = $db->prepare(
        "SELECT * FROM blog_posts WHERE slug = ? AND status = 'published' LIMIT 1"
    );
    $stmt->execute([$slug]);
    $post = $stmt->fetch();

    if (!$post) jsonResponse(['error' => 'Post not found'], 404);
    jsonResponse($post);
}


// ============================================================
// DASHBOARD STATS — real data from MySQL
// ============================================================

function handleDashboardStats(): void {
    header('Cache-Control: public, max-age=60');
    $db = getDB();

    // Core stats — using is_unique for accurate unique visitor counts
    $totalSubmissions = (int)$db->query("SELECT COUNT(*) FROM submissions")->fetchColumn();
    $paidMembers = (int)$db->query("SELECT COUNT(*) FROM submissions WHERE payment_status = 'completed'")->fetchColumn();
    $pendingSubmissions = (int)$db->query("SELECT COUNT(*) FROM submissions WHERE status = 'pending'")->fetchColumn();
    $confirmedSubmissions = (int)$db->query("SELECT COUNT(*) FROM submissions WHERE status = 'confirmed'")->fetchColumn();
    $waitlistTotal = (int)$db->query("SELECT COUNT(*) FROM waitlist")->fetchColumn();
    $totalPageViews = (int)$db->query("SELECT COUNT(*) FROM page_views")->fetchColumn();
    $todayViews = (int)$db->query("SELECT COUNT(*) FROM page_views WHERE DATE(created_at) = CURDATE()")->fetchColumn();
    // Try v2 columns first, fall back to session_id if columns don't exist yet
    try {
        $todayUnique = (int)$db->query("SELECT COUNT(*) FROM page_views WHERE DATE(created_at) = CURDATE() AND is_unique = 1")->fetchColumn();
        $totalUnique = (int)$db->query("SELECT COUNT(DISTINCT visitor_hash) FROM page_views WHERE visitor_hash IS NOT NULL")->fetchColumn();
        if ($totalUnique === 0) {
            $totalUnique = (int)$db->query("SELECT COUNT(DISTINCT session_id) FROM page_views")->fetchColumn();
        }
    } catch (Exception $e) {
        $todayUnique = (int)$db->query("SELECT COUNT(DISTINCT session_id) FROM page_views WHERE DATE(created_at) = CURDATE()")->fetchColumn();
        $totalUnique = (int)$db->query("SELECT COUNT(DISTINCT session_id) FROM page_views")->fetchColumn();
    }

    // Daily views — last 7 days
    $dailyViews = [];
    $dayLabels = [];
    for ($i = 6; $i >= 0; $i--) {
        $date = date('Y-m-d', strtotime("-$i days"));
        $label = date('D', strtotime("-$i days"));
        $count = (int)$db->prepare("SELECT COUNT(*) FROM page_views WHERE DATE(created_at) = ?")->execute([$date]);
        $stmt = $db->prepare("SELECT COUNT(*) FROM page_views WHERE DATE(created_at) = ?");
        $stmt->execute([$date]);
        $dailyViews[] = (int)$stmt->fetchColumn();
        $dayLabels[] = $label;
    }

    // Top pages
    $topPages = $db->query(
        "SELECT page, COUNT(*) as cnt FROM page_views GROUP BY page ORDER BY cnt DESC LIMIT 6"
    )->fetchAll();

    // Top referrers
    $topReferrers = $db->query(
        "SELECT COALESCE(NULLIF(referrer,''), 'Direct') as ref, COUNT(*) as cnt FROM page_views GROUP BY ref ORDER BY cnt DESC LIMIT 6"
    )->fetchAll();

    // Submissions by plan
    $byPlan = $db->query(
        "SELECT p.slug, COUNT(*) as cnt FROM submissions s JOIN plans p ON p.id = s.plan_id GROUP BY p.slug"
    )->fetchAll();
    $planMap = [];
    foreach ($byPlan as $r) { $planMap[$r['slug']] = (int)$r['cnt']; }

    // Submissions by category
    $byCat = $db->query(
        "SELECT c.name, COUNT(*) as cnt FROM submissions s JOIN categories c ON c.id = s.category_id GROUP BY c.name ORDER BY cnt DESC LIMIT 5"
    )->fetchAll();

    // Recent submissions
    $recent = $db->query(
        "SELECT s.id, s.company_name, s.contact_name, s.email, s.status, s.payment_status, s.created_at,
                c.name as category, co.name as country, p.name as plan_name, p.slug as plan_slug
         FROM submissions s
         LEFT JOIN categories c ON c.id = s.category_id
         LEFT JOIN countries co ON co.id = s.country_id
         LEFT JOIN plans p ON p.id = s.plan_id
         ORDER BY s.created_at DESC LIMIT 6"
    )->fetchAll();

    // Waitlist by source
    $waitBySrc = $db->query(
        "SELECT source, COUNT(*) as cnt FROM waitlist GROUP BY source"
    )->fetchAll();
    $srcMap = [];
    foreach ($waitBySrc as $r) { $srcMap[$r['source']] = (int)$r['cnt']; }

    // Device/Country/UTM breakdowns — wrapped in try-catch for backwards compat
    $deviceBreakdown = [];
    $countryBreakdown = [];
    $utmBreakdown = [];
    try {
        $deviceBreakdown = $db->query(
            "SELECT device_type, COUNT(*) as cnt, SUM(is_unique) as uniques
             FROM page_views
             WHERE created_at > DATE_SUB(NOW(), INTERVAL 30 DAY) AND device_type IS NOT NULL
             GROUP BY device_type ORDER BY cnt DESC"
        )->fetchAll();

        $countryBreakdown = $db->query(
            "SELECT country_code, COUNT(*) as cnt, SUM(is_unique) as uniques
             FROM page_views
             WHERE created_at > DATE_SUB(NOW(), INTERVAL 30 DAY) AND country_code IS NOT NULL
             GROUP BY country_code ORDER BY cnt DESC LIMIT 10"
        )->fetchAll();

        $utmBreakdown = $db->query(
            "SELECT utm_source, utm_medium, COUNT(*) as cnt, SUM(is_unique) as uniques
             FROM page_views
             WHERE created_at > DATE_SUB(NOW(), INTERVAL 30 DAY) AND utm_source IS NOT NULL
             GROUP BY utm_source, utm_medium ORDER BY cnt DESC LIMIT 10"
        )->fetchAll();
    } catch (Exception $e) {
        // Columns not yet migrated — return empty arrays
    }

    jsonResponse([
        'stats' => [
            'totalSubmissions' => $totalSubmissions,
            'paidMembers' => $paidMembers,
            'pendingSubmissions' => $pendingSubmissions,
            'confirmedSubmissions' => $confirmedSubmissions,
            'waitlistTotal' => $waitlistTotal,
            'totalPageViews' => $totalPageViews,
            'todayViews' => $todayViews,
            'todayUnique' => $todayUnique,
            'totalUnique' => $totalUnique,
        ],
        'dailyViews' => $dailyViews,
        'dayLabels' => $dayLabels,
        'topPages' => $topPages,
        'topReferrers' => $topReferrers,
        'byPlan' => $planMap,
        'byCat' => $byCat,
        'recent' => $recent,
        'waitlistBySrc' => $srcMap,
        'blogStats' => getBlogAnalytics($db),
        'devices' => $deviceBreakdown,
        'countries' => $countryBreakdown,
        'utmSources' => $utmBreakdown,
    ]);
}

function getBlogAnalytics(PDO $db): array {
    $totalBlogViews = (int)$db->query("SELECT COUNT(*) FROM blog_views")->fetchColumn();
    $totalShares = (int)$db->query("SELECT COALESCE(SUM(shares), 0) FROM blog_analytics_daily")->fetchColumn();
    $avgReadTime = (int)$db->query("SELECT COALESCE(AVG(read_seconds), 0) FROM blog_views WHERE read_seconds > 0")->fetchColumn();
    $totalPosts = (int)$db->query("SELECT COUNT(*) FROM blog_posts WHERE status = 'published'")->fetchColumn();

    $topPosts = $db->query(
        "SELECT bp.title, bp.slug, COUNT(bv.id) as views
         FROM blog_views bv
         JOIN blog_posts bp ON bp.id = bv.post_id
         GROUP BY bv.post_id
         ORDER BY views DESC LIMIT 5"
    )->fetchAll();

    return [
        'totalViews' => $totalBlogViews,
        'totalShares' => $totalShares,
        'avgReadTime' => $avgReadTime,
        'totalPosts' => $totalPosts,
        'topPosts' => $topPosts,
    ];
}


// ============================================================
// ADMIN HANDLERS
// ============================================================

function handleAdminLogin(): void {
    if (!checkRateLimit('admin_login', 5, 300)) jsonResponse(['error' => 'Too many attempts'], 429);

    $d = getJsonBody();
    $username = $d['username'] ?? '';
    $password = $d['password'] ?? '';

    $db = getDB();
    $stmt = $db->prepare("SELECT id, password_hash, display_name, role FROM admins WHERE username = ? AND is_active = 1");
    $stmt->execute([$username]);
    $admin = $stmt->fetch();

    if (!$admin || !password_verify($password, $admin['password_hash'])) {
        jsonResponse(['error' => 'Invalid credentials'], 401);
    }

    // Create session
    $token = bin2hex(random_bytes(64));
    $expires = date('Y-m-d H:i:s', time() + 4 * 3600);

    $db->prepare(
        "INSERT INTO admin_sessions (admin_id, token, ip_address, user_agent, expires_at) VALUES (?,?,?,?,?)"
    )->execute([
        $admin['id'], $token, $_SERVER['REMOTE_ADDR'] ?? null,
        substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 500), $expires
    ]);

    // Update last login
    $db->prepare("UPDATE admins SET last_login_at = NOW(), last_login_ip = ? WHERE id = ?")->execute([
        $_SERVER['REMOTE_ADDR'] ?? null, $admin['id']
    ]);

    jsonResponse([
        'ok' => true,
        'token' => $token,
        'admin' => ['name' => $admin['display_name'], 'role' => $admin['role']],
        'expiresAt' => $expires,
    ]);
}


function handleAdminDashboard(): void {
    $db = getDB();

    $stats = [
        'totalSubmissions' => $db->query("SELECT COUNT(*) FROM submissions")->fetchColumn(),
        'paidMembers'      => $db->query("SELECT COUNT(*) FROM submissions WHERE payment_status = 'completed'")->fetchColumn(),
        'totalRevenue'     => $db->query("SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'completed'")->fetchColumn(),
        'spotsLeft'        => 200 - (int)$db->query("SELECT COUNT(*) FROM submissions")->fetchColumn(),
        'waitlistTotal'    => $db->query("SELECT COUNT(*) FROM waitlist")->fetchColumn(),
        'blogPosts'        => $db->query("SELECT COUNT(*) FROM blog_posts WHERE status = 'published'")->fetchColumn(),
        'totalPageViews'   => $db->query("SELECT COUNT(*) FROM page_views WHERE created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)")->fetchColumn(),
    ];

    // Recent submissions
    $recent = $db->query(
        "SELECT s.uuid, s.company_name, s.email, s.status, s.payment_status, s.created_at,
                c.name as category, co.name as country, p.name as plan_name
         FROM submissions s
         LEFT JOIN categories c ON c.id = s.category_id
         LEFT JOIN countries co ON co.id = s.country_id
         LEFT JOIN plans p ON p.id = s.plan_id
         ORDER BY s.created_at DESC LIMIT 10"
    )->fetchAll();

    // Daily views (last 7 days)
    $dailyViews = $db->query(
        "SELECT DATE(created_at) as day, COUNT(*) as views
         FROM page_views
         WHERE created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)
         GROUP BY DATE(created_at)
         ORDER BY day"
    )->fetchAll();

    jsonResponse(compact('stats', 'recent', 'dailyViews'));
}


function handleAdminSubmissions(): void {
    $db = getDB();
    $page = max(1, (int)($_GET['page'] ?? 1));
    $limit = 20;
    $offset = ($page - 1) * $limit;
    $status = $_GET['status'] ?? null;

    $where = $status ? "WHERE s.status = ?" : "";
    $params = $status ? [$status] : [];

    $total = $db->prepare("SELECT COUNT(*) FROM submissions s $where");
    $total->execute($params);

    $stmt = $db->prepare(
        "SELECT s.*, c.name as category_name, co.name as country_name, p.name as plan_name
         FROM submissions s
         LEFT JOIN categories c ON c.id = s.category_id
         LEFT JOIN countries co ON co.id = s.country_id
         LEFT JOIN plans p ON p.id = s.plan_id
         $where
         ORDER BY s.created_at DESC
         LIMIT $limit OFFSET $offset"
    );
    $stmt->execute($params);

    jsonResponse([
        'data' => $stmt->fetchAll(),
        'total' => (int)$total->fetchColumn(),
        'page' => $page,
        'pages' => ceil($total->fetchColumn() / $limit),
    ]);
}


function handleAdminWaitlist(): void {
    $db = getDB();
    $stmt = $db->query("SELECT * FROM waitlist ORDER BY created_at DESC LIMIT 200");
    jsonResponse($stmt->fetchAll());
}

/** Public waitlist entries — used by the static admin panel */
function handleWaitlistEntries(): void {
    header('Cache-Control: public, max-age=30');
    $db = getDB();
    $stmt = $db->query("SELECT id, email, source, created_at FROM waitlist ORDER BY created_at DESC LIMIT 500");
    jsonResponse($stmt->fetchAll());
}

/** Public submission list — used by the static admin panel */
function handleSubmissionList(): void {
    $db = getDB();
    $stmt = $db->query(
        "SELECT s.*, p.name as plan_name, p.slug as plan_slug,
                c.name as category_name, co.name as country_name
         FROM submissions s
         LEFT JOIN plans p ON p.id = s.plan_id
         LEFT JOIN categories c ON c.id = s.category_id
         LEFT JOIN countries co ON co.id = s.country_id
         ORDER BY s.created_at DESC LIMIT 200"
    );
    jsonResponse($stmt->fetchAll());
}

function handleSubmissionStatusUpdate(): void {
    $d = getJsonBody();
    $id = (int)($d['id'] ?? 0);
    $status = $d['status'] ?? '';
    if (!$id || !$status) jsonResponse(['error' => 'id and status required'], 400);

    $db = getDB();
    $db->prepare("UPDATE submissions SET status = ? WHERE id = ?")->execute([$status, $id]);
    jsonResponse(['ok' => true]);
}

function handleSubmissionDelete(): void {
    $d = getJsonBody();
    $id = (int)($d['id'] ?? 0);
    if (!$id) jsonResponse(['error' => 'id required'], 400);

    $db = getDB();
    $db->prepare("DELETE FROM submissions WHERE id = ?")->execute([$id]);
    jsonResponse(['ok' => true]);
}

function handleAdminBlogList(): void {
    $db = getDB();
    $stmt = $db->query(
        "SELECT p.*,
                COALESCE(SUM(bv.views), 0) as total_views,
                COALESCE(SUM(bv.unique_views), 0) as total_unique_views,
                COALESCE(SUM(bv.shares), 0) as total_shares
         FROM blog_posts p
         LEFT JOIN blog_analytics_daily bv ON bv.post_id = p.id
         GROUP BY p.id
         ORDER BY p.updated_at DESC"
    );
    jsonResponse($stmt->fetchAll());
}


function handleAdminBlogSave(): void {
    $d = getJsonBody();
    $db = getDB();

    $id = $d['id'] ?? null;

    if ($id) {
        // Update existing
        $stmt = $db->prepare(
            "UPDATE blog_posts SET
             slug=?, title=?, excerpt=?, body=?, body_html=?, cover_image=?,
             author=?, category=?, tags=?, status=?, is_featured=?, read_time=?,
             seo_title=?, seo_description=?, seo_keywords=?, seo_og_image=?,
             seo_canonical=?, seo_no_index=?, published_at=COALESCE(published_at, IF(?='published', NOW(), NULL))
             WHERE id=?"
        );
    } else {
        // Insert new
        $stmt = $db->prepare(
            "INSERT INTO blog_posts
             (slug, title, excerpt, body, body_html, cover_image,
              author, category, tags, status, is_featured, read_time,
              seo_title, seo_description, seo_keywords, seo_og_image,
              seo_canonical, seo_no_index, published_at)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,IF(?='published', NOW(), NULL))"
        );
    }

    $params = [
        $d['slug'] ?? '',
        $d['title'] ?? '',
        $d['excerpt'] ?? '',
        $d['body'] ?? '',
        $d['bodyHtml'] ?? '',
        $d['coverImage'] ?? '',
        $d['author'] ?? 'InfoWebWorld Team',
        $d['category'] ?? 'Business Tips',
        json_encode($d['tags'] ?? []),
        $d['status'] ?? 'draft',
        (int)($d['featured'] ?? 0),
        (int)($d['readTime'] ?? 1),
        $d['seoTitle'] ?? '',
        $d['seoDescription'] ?? '',
        json_encode($d['seoKeywords'] ?? []),
        $d['seoOgImage'] ?? '',
        $d['seoCanonical'] ?? '',
        (int)($d['seoNoIndex'] ?? 0),
        $d['status'] ?? 'draft',
    ];

    if ($id) $params[] = $id;

    $stmt->execute($params);

    jsonResponse(['ok' => true, 'id' => $id ?: $db->lastInsertId()]);
}


function handleAdminBlogDelete(): void {
    $d = getJsonBody();
    $id = (int)($d['id'] ?? 0);
    if (!$id) jsonResponse(['error' => 'id required'], 400);

    $db = getDB();
    $db->prepare("DELETE FROM blog_posts WHERE id = ?")->execute([$id]);
    jsonResponse(['ok' => true]);
}


function handleAdminSettings(): void {
    $db = getDB();

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $db->query("SELECT key_name, value FROM settings ORDER BY key_name");
        $settings = [];
        foreach ($stmt->fetchAll() as $row) {
            $settings[$row['key_name']] = $row['value'];
        }
        jsonResponse($settings);
    }

    // POST — update/insert settings
    $d = getJsonBody();
    foreach ($d as $key => $value) {
        $stmt = $db->prepare(
            "INSERT INTO settings (key_name, value) VALUES (?, ?)
             ON DUPLICATE KEY UPDATE value = VALUES(value)"
        );
        $stmt->execute([(string)$key, (string)$value]);
    }
    jsonResponse(['ok' => true]);
}

/** Public settings — cached, no auth */
function handlePublicSettings(): void {
    header('Cache-Control: public, max-age=120');
    $db = getDB();
    $stmt = $db->query("SELECT key_name, value FROM settings ORDER BY key_name");
    $settings = [];
    foreach ($stmt->fetchAll() as $row) {
        $settings[$row['key_name']] = $row['value'];
    }
    jsonResponse($settings);
}

/** Public live stats — cached 60s */
function handlePublicLiveStats(): void {
    header('Cache-Control: public, max-age=60');
    $db = getDB();
    $waitlist = (int)$db->query("SELECT COUNT(*) FROM waitlist")->fetchColumn();
    $submissions = (int)$db->query("SELECT COUNT(*) FROM submissions")->fetchColumn();
    $paid = (int)$db->query("SELECT COUNT(*) FROM submissions WHERE payment_status = 'completed'")->fetchColumn();
    jsonResponse([
        'waitlistCount' => $waitlist,
        'submissionCount' => $submissions,
        'paidCount' => $paid,
    ]);
}


// ============================================================
// CRON — Daily rollup + cleanup (hit via cPanel cron job)
// ============================================================

function handleCronRollup(): void {
    // Simple secret check — prevents random visitors from triggering it
    $secret = $_GET['key'] ?? '';
    if ($secret !== 'iww_cron_2026') {
        jsonResponse(['error' => 'Unauthorized'], 403);
    }

    $db = getDB();
    $yesterday = date('Y-m-d', strtotime('-1 day'));
    $results = [];

    // ── 1. Aggregate page_views → page_analytics_daily ──
    try {
        $db->prepare(
            "INSERT INTO page_analytics_daily (page, date, views, unique_views, utm_source, desktop_views, mobile_views, tablet_views)
             SELECT
                page,
                DATE(created_at) as date,
                COUNT(*) as views,
                SUM(is_unique) as unique_views,
                utm_source,
                SUM(CASE WHEN device_type = 'desktop' THEN 1 ELSE 0 END) as desktop_views,
                SUM(CASE WHEN device_type = 'mobile' THEN 1 ELSE 0 END) as mobile_views,
                SUM(CASE WHEN device_type = 'tablet' THEN 1 ELSE 0 END) as tablet_views
             FROM page_views
             WHERE DATE(created_at) = ?
             GROUP BY page, DATE(created_at), utm_source
             ON DUPLICATE KEY UPDATE
                views = VALUES(views),
                unique_views = VALUES(unique_views),
                desktop_views = VALUES(desktop_views),
                mobile_views = VALUES(mobile_views),
                tablet_views = VALUES(tablet_views)"
        )->execute([$yesterday]);
        $results['page_rollup'] = 'ok';
    } catch (Exception $e) {
        $results['page_rollup'] = $e->getMessage();
    }

    // ── 2. Aggregate blog_views → blog_analytics_daily ──
    try {
        $db->prepare(
            "INSERT INTO blog_analytics_daily (post_id, date, views, unique_views, avg_read_seconds)
             SELECT
                post_id,
                DATE(created_at) as date,
                COUNT(*) as views,
                SUM(is_unique) as unique_views,
                COALESCE(AVG(NULLIF(read_seconds, 0)), 0) as avg_read_seconds
             FROM blog_views
             WHERE DATE(created_at) = ?
             GROUP BY post_id, DATE(created_at)
             ON DUPLICATE KEY UPDATE
                views = VALUES(views),
                unique_views = VALUES(unique_views),
                avg_read_seconds = VALUES(avg_read_seconds)"
        )->execute([$yesterday]);
        $results['blog_rollup'] = 'ok';
    } catch (Exception $e) {
        $results['blog_rollup'] = $e->getMessage();
    }

    // ── 3. Purge raw views older than 30 days (aggregated data kept forever) ──
    try {
        $purgedPages = $db->exec("DELETE FROM page_views WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)");
        $purgedBlogs = $db->exec("DELETE FROM blog_views WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)");
        $results['purged_page_views'] = $purgedPages;
        $results['purged_blog_views'] = $purgedBlogs;
    } catch (Exception $e) {
        $results['purge'] = $e->getMessage();
    }

    // ── 4. Clean old rate_limits entries ──
    try {
        $purgedRates = $db->exec("DELETE FROM rate_limits WHERE window_start < DATE_SUB(NOW(), INTERVAL 1 HOUR)");
        $results['purged_rate_limits'] = $purgedRates;
    } catch (Exception $e) {
        $results['rate_cleanup'] = $e->getMessage();
    }

    // ── 5. Clean expired admin sessions ──
    try {
        $purgedSessions = $db->exec("DELETE FROM admin_sessions WHERE expires_at < NOW()");
        $results['purged_sessions'] = $purgedSessions;
    } catch (Exception $e) {
        $results['session_cleanup'] = $e->getMessage();
    }

    jsonResponse(['ok' => true, 'date' => $yesterday, 'results' => $results]);
}


// ============================================================
// CATEGORY HANDLERS
// ============================================================

/** Public category list — launched & active only, cached 300s */
function handleCategoryList(): void {
    header('Cache-Control: public, max-age=300');
    $db = getDB();
    $stmt = $db->query(
        "SELECT c.*, p.name as parent_name, p.slug as parent_slug,
                (SELECT COUNT(*) FROM submissions s WHERE s.category_id = c.id AND s.status IN ('active','paid')) as listing_count
         FROM categories c
         LEFT JOIN categories p ON p.id = c.parent_id
         WHERE c.is_launched = 1 AND c.is_active = 1
         ORDER BY c.sort_order"
    );
    jsonResponse($stmt->fetchAll());
}


/** Public single category by slug — cached 300s */
function handleCategoryGet(): void {
    header('Cache-Control: public, max-age=300');
    $slug = $_GET['slug'] ?? '';
    if (!$slug) jsonResponse(['error' => 'slug required'], 400);

    $db = getDB();

    // Fetch category
    $stmt = $db->prepare(
        "SELECT * FROM categories WHERE slug = ? AND is_launched = 1 LIMIT 1"
    );
    $stmt->execute([$slug]);
    $category = $stmt->fetch();

    if (!$category) jsonResponse(['error' => 'Category not found'], 404);

    // Fetch subcategories (children)
    $children = $db->prepare(
        "SELECT id, name, slug, icon, color, description, listing_count, sort_order
         FROM categories
         WHERE parent_id = ? AND is_launched = 1 AND is_active = 1
         ORDER BY sort_order"
    );
    $children->execute([$category['id']]);

    // Fetch parent sector info
    $parent = null;
    if ($category['parent_id']) {
        $pStmt = $db->prepare("SELECT id, name, slug, icon, color FROM categories WHERE id = ? LIMIT 1");
        $pStmt->execute([$category['parent_id']]);
        $parent = $pStmt->fetch() ?: null;
    }

    // Count active submissions in this category
    $countStmt = $db->prepare(
        "SELECT COUNT(*) FROM submissions WHERE category_id = ? AND status IN ('active','paid')"
    );
    $countStmt->execute([$category['id']]);
    $activeListings = (int)$countStmt->fetchColumn();

    jsonResponse([
        'category'       => $category,
        'subcategories'  => $children->fetchAll(),
        'parent'         => $parent,
        'activeListings' => $activeListings,
    ]);
}


/** Public category listings — paginated submissions for a category */
function handleCategoryListings(): void {
    $categoryId = (int)($_GET['category_id'] ?? 0);
    if (!$categoryId) jsonResponse(['error' => 'category_id required'], 400);

    $page = max(1, (int)($_GET['page'] ?? 1));
    $limit = 20;
    $offset = ($page - 1) * $limit;

    $db = getDB();

    // Total count
    $total = $db->prepare(
        "SELECT COUNT(*) FROM submissions WHERE category_id = ? AND status IN ('active','paid')"
    );
    $total->execute([$categoryId]);
    $totalCount = (int)$total->fetchColumn();

    // Paginated results
    $stmt = $db->prepare(
        "SELECT s.id, s.uuid, s.company_name, s.tagline, s.description, s.website, s.city,
                s.status, s.created_at,
                c.name as category_name, co.name as country_name, p.name as plan_name
         FROM submissions s
         LEFT JOIN categories c ON c.id = s.category_id
         LEFT JOIN countries co ON co.id = s.country_id
         LEFT JOIN plans p ON p.id = s.plan_id
         WHERE s.category_id = ? AND s.status IN ('active','paid')
         ORDER BY s.created_at DESC
         LIMIT $limit OFFSET $offset"
    );
    $stmt->execute([$categoryId]);

    jsonResponse([
        'data'  => $stmt->fetchAll(),
        'total' => $totalCount,
        'page'  => $page,
    ]);
}


/** Admin — all categories regardless of launch status */
function handleCategoryAll(): void {
    $db = getDB();
    $stmt = $db->query(
        "SELECT c.*, p.name as parent_name,
                COALESCE(lc.cnt, 0) as listing_count
         FROM categories c
         LEFT JOIN categories p ON p.id = c.parent_id
         LEFT JOIN (
             SELECT category_id, COUNT(*) as cnt
             FROM submissions
             WHERE status IN ('active','paid','confirmed','pending')
             GROUP BY category_id
         ) lc ON lc.category_id = c.id
         ORDER BY c.level, c.sort_order"
    );
    jsonResponse($stmt->fetchAll());
}


/** Admin — create or update a category */
function handleCategorySave(): void {
    $d = getJsonBody();
    $db = getDB();

    $id = $d['id'] ?? null;

    if ($id) {
        // Update existing
        $stmt = $db->prepare(
            "UPDATE categories SET
             name=?, slug=?, icon=?, color=?, description=?, cover_image=?,
             parent_id=?, level=?, sort_order=?, is_active=?, is_launched=?, is_featured=?,
             seo_title=?, seo_description=?, seo_keywords=?, seo_og_image=?,
             seo_canonical=?, seo_no_index=?
             WHERE id=?"
        );
    } else {
        // Insert new
        $stmt = $db->prepare(
            "INSERT INTO categories
             (name, slug, icon, color, description, cover_image,
              parent_id, level, sort_order, is_active, is_launched, is_featured,
              seo_title, seo_description, seo_keywords, seo_og_image,
              seo_canonical, seo_no_index)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
        );
    }

    $params = [
        $d['name'] ?? '',
        $d['slug'] ?? '',
        $d['icon'] ?? '',
        $d['color'] ?? '',
        $d['description'] ?? '',
        $d['cover_image'] ?? '',
        $d['parent_id'] ?? null,
        (int)($d['level'] ?? 0),
        (int)($d['sort_order'] ?? 0),
        (int)($d['is_active'] ?? 1),
        (int)($d['is_launched'] ?? 0),
        (int)($d['is_featured'] ?? 0),
        $d['seo_title'] ?? '',
        $d['seo_description'] ?? '',
        json_encode($d['seo_keywords'] ?? []),
        $d['seo_og_image'] ?? '',
        $d['seo_canonical'] ?? '',
        (int)($d['seo_no_index'] ?? 0),
    ];

    if ($id) $params[] = $id;

    $stmt->execute($params);

    jsonResponse(['ok' => true, 'id' => $id ?: $db->lastInsertId()]);
}


/** Admin — delete a category */
function handleCategoryDelete(): void {
    $d = getJsonBody();
    $id = (int)($d['id'] ?? 0);
    if (!$id) jsonResponse(['error' => 'id required'], 400);

    $db = getDB();
    $db->prepare("DELETE FROM categories WHERE id = ?")->execute([$id]);
    jsonResponse(['ok' => true]);
}


/** Admin — toggle category launch status */
function handleCategoryToggleLaunch(): void {
    $d = getJsonBody();
    $id = (int)($d['id'] ?? 0);
    if (!$id) jsonResponse(['error' => 'id required'], 400);

    $launched = (int)($d['launched'] ?? 0);
    $db = getDB();
    $db->prepare("UPDATE categories SET is_launched = ? WHERE id = ?")->execute([$launched, $id]);
    jsonResponse(['ok' => true]);
}

/** Admin — bulk launch/unlaunch categories */
function handleCategoryBulkLaunch(): void {
    $d = getJsonBody();
    $launched = (int)($d['launched'] ?? 0);
    $level = isset($d['level']) ? (int)$d['level'] : null;
    $parentId = isset($d['parent_id']) ? (int)$d['parent_id'] : null;

    $db = getDB();

    if ($level !== null && $parentId !== null) {
        // Launch/unlaunch by level AND parent
        $db->prepare("UPDATE categories SET is_launched = ? WHERE level = ? AND parent_id = ?")->execute([$launched, $level, $parentId]);
    } elseif ($level !== null) {
        // Launch/unlaunch entire level
        $db->prepare("UPDATE categories SET is_launched = ? WHERE level = ?")->execute([$launched, $level]);
    } elseif ($parentId !== null) {
        // Launch/unlaunch all children of a parent (recursive: parent + all descendants)
        $db->prepare("UPDATE categories SET is_launched = ? WHERE parent_id = ?")->execute([$launched, $parentId]);
        // Also update the parent itself
        $db->prepare("UPDATE categories SET is_launched = ? WHERE id = ?")->execute([$launched, $parentId]);
    } else {
        // Launch/unlaunch ALL categories
        $db->exec("UPDATE categories SET is_launched = $launched");
    }

    $affected = (int)$db->query("SELECT COUNT(*) FROM categories WHERE is_launched = $launched")->fetchColumn();
    jsonResponse(['ok' => true, 'affected' => $affected]);
}
