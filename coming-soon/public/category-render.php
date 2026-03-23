<?php
/**
 * InfoWebWorld — Category SSR Proxy
 *
 * Serves category pages with proper SEO meta tags for crawlers.
 * Apache rewrites /category/{slug} to category-render.php?slug={slug}.
 *
 * - Fetches category data from the database
 * - Reads the static category.html shell
 * - Injects SEO meta tags, Open Graph tags, and JSON-LD into <head>
 * - Falls back to the unmodified HTML if the category isn't found
 */

require_once __DIR__ . '/../iww-config.php';

$slug = $_GET['slug'] ?? '';

// ── Read the static HTML shell ──────────────────────────────────────────────
$htmlPath = __DIR__ . '/category.html';
$html = @file_get_contents($htmlPath);

if ($html === false) {
    http_response_code(500);
    echo 'Internal Server Error: unable to read category template.';
    exit;
}

// ── If no slug, serve the static HTML as-is ─────────────────────────────────
if ($slug === '') {
    header('Cache-Control: public, max-age=3600');
    echo $html;
    exit;
}

try {
    $db = getDB();
    $stmt = $db->prepare(
        "SELECT c.*, p.name as parent_name, p.slug as parent_slug
         FROM categories c
         LEFT JOIN categories p ON p.id = c.parent_id
         WHERE c.slug = ? AND c.is_launched = 1 AND c.is_active = 1
         LIMIT 1"
    );
    $stmt->execute([$slug]);
    $cat = $stmt->fetch(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    header('Cache-Control: public, max-age=3600');
    echo $html;
    exit;
}

if (!$cat) {
    header('Cache-Control: public, max-age=3600');
    echo $html;
    exit;
}

// ── Count active listings ───────────────────────────────────────────────────
try {
    $countStmt = $db->prepare("SELECT COUNT(*) FROM submissions WHERE category_id = ? AND status IN ('active','paid')");
    $countStmt->execute([$cat['id']]);
    $listingCount = (int)$countStmt->fetchColumn();
} catch (Exception $e) {
    $listingCount = 0;
}

// ── Resolve SEO values with fallbacks ───────────────────────────────────────
$title       = $cat['seo_title']       ?: ($cat['name'] . ' — Best Businesses & Software');
$description = $cat['seo_description'] ?: ($cat['description'] ?: 'Discover the best ' . $cat['name'] . ' businesses and software on InfoWebWorld. Compare reviews, pricing, and features.');
$image       = $cat['seo_og_image']    ?: ($cat['cover_image'] ?? '');
$canonical   = $cat['seo_canonical']   ?: ('https://infowebworld.com/infowebworld/category/' . $slug);
$parentName  = $cat['parent_name']     ?? '';

$keywords = '';
if (!empty($cat['seo_keywords'])) {
    $decoded = json_decode($cat['seo_keywords'], true);
    if (is_array($decoded)) {
        $keywords = implode(', ', $decoded);
    } else {
        $keywords = $cat['seo_keywords'];
    }
}

// ── Escape for safe HTML injection ──────────────────────────────────────────
$eTitle       = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
$eDescription = htmlspecialchars($description, ENT_QUOTES, 'UTF-8');
$eImage       = htmlspecialchars($image, ENT_QUOTES, 'UTF-8');
$eCanonical   = htmlspecialchars($canonical, ENT_QUOTES, 'UTF-8');
$eKeywords    = htmlspecialchars($keywords, ENT_QUOTES, 'UTF-8');
$eCatName     = htmlspecialchars($cat['name'], ENT_QUOTES, 'UTF-8');
$eParent      = htmlspecialchars($parentName, ENT_QUOTES, 'UTF-8');

$pageTitle = $eTitle . ' | InfoWebWorld';

// ── Build the SEO tag block ─────────────────────────────────────────────────
$seoTags = <<<HTML

    <meta name="description" content="{$eDescription}">
    <meta name="keywords" content="{$eKeywords}">
    <link rel="canonical" href="{$eCanonical}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="{$eTitle}">
    <meta property="og:description" content="{$eDescription}">
    <meta property="og:image" content="{$eImage}">
    <meta property="og:url" content="{$eCanonical}">
    <meta property="og:site_name" content="InfoWebWorld">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{$eTitle}">
    <meta name="twitter:description" content="{$eDescription}">
    <meta name="twitter:image" content="{$eImage}">
HTML;

// ── Build JSON-LD structured data (CollectionPage) ──────────────────────────
$jsonLd = [
    '@context'    => 'https://schema.org',
    '@type'       => 'CollectionPage',
    'name'        => $cat['name'],
    'description' => $description,
    'url'         => $canonical,
    'image'       => $image,
    'publisher'   => [
        '@type' => 'Organization',
        'name'  => 'InfoWebWorld',
        'url'   => 'https://infowebworld.com',
    ],
    'mainEntity'  => [
        '@type'       => 'ItemList',
        'name'        => $cat['name'] . ' Directory',
        'description' => 'Business directory listings in ' . $cat['name'],
        'numberOfItems' => $listingCount,
    ],
];

// Add breadcrumb
$breadcrumbs = [
    ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => 'https://infowebworld.com/infowebworld/'],
    ['@type' => 'ListItem', 'position' => 2, 'name' => 'Categories', 'item' => 'https://infowebworld.com/infowebworld/categories'],
];
if ($parentName) {
    $breadcrumbs[] = ['@type' => 'ListItem', 'position' => 3, 'name' => $parentName, 'item' => 'https://infowebworld.com/infowebworld/categories#' . ($cat['parent_slug'] ?? '')];
    $breadcrumbs[] = ['@type' => 'ListItem', 'position' => 4, 'name' => $cat['name'], 'item' => $canonical];
} else {
    $breadcrumbs[] = ['@type' => 'ListItem', 'position' => 3, 'name' => $cat['name'], 'item' => $canonical];
}

$breadcrumbLd = [
    '@context'        => 'https://schema.org',
    '@type'           => 'BreadcrumbList',
    'itemListElement' => $breadcrumbs,
];

$jsonLdScript  = "\n    <script type=\"application/ld+json\">" . json_encode($jsonLd, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "</script>";
$jsonLdScript .= "\n    <script type=\"application/ld+json\">" . json_encode($breadcrumbLd, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "</script>";

// ── Inject into the HTML ────────────────────────────────────────────────────
if (preg_match('/<title>.*?<\/title>/is', $html)) {
    $html = preg_replace('/<title>.*?<\/title>/is', '<title>' . $pageTitle . '</title>', $html, 1);
    $html = str_replace('</head>', $seoTags . $jsonLdScript . "\n</head>", $html);
} else {
    $titleTag = "\n    <title>{$pageTitle}</title>";
    $html = str_replace('</head>', $titleTag . $seoTags . $jsonLdScript . "\n</head>", $html);
}

// ── Serve ───────────────────────────────────────────────────────────────────
header('Cache-Control: public, max-age=3600');
header('Content-Type: text/html; charset=utf-8');
echo $html;
