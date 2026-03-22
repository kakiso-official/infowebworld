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

        // ── Admin endpoints (auth required) ──
        'admin_login'       => handleAdminLogin(),
        'admin_dashboard'   => requireAuth(fn() => handleAdminDashboard()),
        'admin_submissions' => requireAuth(fn() => handleAdminSubmissions()),
        'admin_waitlist'    => requireAuth(fn() => handleAdminWaitlist()),
        'admin_blog_list'   => requireAuth(fn() => handleAdminBlogList()),
        'admin_blog_save'   => requireAuth(fn() => handleAdminBlogSave()),
        'admin_blog_delete' => requireAuth(fn() => handleAdminBlogDelete()),
        'admin_settings'    => requireAuth(fn() => handleAdminSettings()),

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
    if (!checkRateLimit('pageview', 120, 60)) return;

    $d = getJsonBody();
    $page = $d['page'] ?? '/';

    $db = getDB();
    $stmt = $db->prepare(
        "INSERT INTO page_views (page, session_id, ip_address, user_agent, referrer, device_type)
         VALUES (?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        substr($page, 0, 200),
        $d['sessionId'] ?? null,
        $_SERVER['REMOTE_ADDR'] ?? null,
        substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 500),
        $d['referrer'] ?? null,
        $d['device'] ?? null,
    ]);

    jsonResponse(['ok' => true]);
}


function handleTrackBlogView(): void {
    if (!checkRateLimit('blog_view', 120, 60)) return;

    $d = getJsonBody();
    $postId = (int)($d['postId'] ?? 0);
    if (!$postId) jsonResponse(['error' => 'postId required'], 400);

    $db = getDB();
    $stmt = $db->prepare(
        "INSERT INTO blog_views (post_id, session_id, ip_address, user_agent, referrer, device_type, read_seconds)
         VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        $postId,
        $d['sessionId'] ?? null,
        $_SERVER['REMOTE_ADDR'] ?? null,
        substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 500),
        $d['referrer'] ?? null,
        $d['device'] ?? null,
        (int)($d['readSeconds'] ?? 0),
    ]);

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
    $db = getDB();

    // Core stats
    $totalSubmissions = (int)$db->query("SELECT COUNT(*) FROM submissions")->fetchColumn();
    $paidMembers = (int)$db->query("SELECT COUNT(*) FROM submissions WHERE payment_status = 'completed'")->fetchColumn();
    $pendingSubmissions = (int)$db->query("SELECT COUNT(*) FROM submissions WHERE status = 'pending'")->fetchColumn();
    $confirmedSubmissions = (int)$db->query("SELECT COUNT(*) FROM submissions WHERE status = 'confirmed'")->fetchColumn();
    $waitlistTotal = (int)$db->query("SELECT COUNT(*) FROM waitlist")->fetchColumn();
    $totalPageViews = (int)$db->query("SELECT COUNT(*) FROM page_views")->fetchColumn();
    $todayViews = (int)$db->query("SELECT COUNT(*) FROM page_views WHERE DATE(created_at) = CURDATE()")->fetchColumn();
    $todayUnique = (int)$db->query("SELECT COUNT(DISTINCT session_id) FROM page_views WHERE DATE(created_at) = CURDATE()")->fetchColumn();
    $totalUnique = (int)$db->query("SELECT COUNT(DISTINCT session_id) FROM page_views")->fetchColumn();

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
    ]);
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
        $stmt = $db->query("SELECT key_name, value, type FROM settings ORDER BY key_name");
        $settings = [];
        foreach ($stmt->fetchAll() as $row) {
            $settings[$row['key_name']] = $row['value'];
        }
        jsonResponse($settings);
    }

    // POST — update settings
    $d = getJsonBody();
    foreach ($d as $key => $value) {
        $db->prepare("UPDATE settings SET value = ? WHERE key_name = ?")->execute([(string)$value, $key]);
    }
    jsonResponse(['ok' => true]);
}
