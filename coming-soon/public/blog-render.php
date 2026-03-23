<?php
/**
 * InfoWebWorld — Blog SSR Proxy
 *
 * Serves blog post pages with proper SEO meta tags for crawlers.
 * Apache rewrites /blog/{slug} to blog-render.php?slug={slug}.
 *
 * - Fetches post data from the database
 * - Reads the static blog/post.html shell
 * - Injects SEO meta tags, Open Graph tags, and JSON-LD into <head>
 * - Falls back to the unmodified HTML if the post isn't found
 */

require_once __DIR__ . '/../iww-config.php';

$slug = $_GET['slug'] ?? '';

// ── Read the static HTML shell ──────────────────────────────────────────────
$htmlPath = __DIR__ . '/blog/post.html';
$html = @file_get_contents($htmlPath);

if ($html === false) {
    http_response_code(500);
    echo 'Internal Server Error: unable to read blog template.';
    exit;
}

// ── If no slug or post not found, serve the static HTML as-is ───────────────
if ($slug === '') {
    header('Cache-Control: public, max-age=3600');
    echo $html;
    exit;
}

try {
    $db = getDB();
    $stmt = $db->prepare('SELECT * FROM blog_posts WHERE slug = ? AND status = \'published\' LIMIT 1');
    $stmt->execute([$slug]);
    $post = $stmt->fetch(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    // On DB error, serve the static HTML and let the React app handle it
    header('Cache-Control: public, max-age=3600');
    echo $html;
    exit;
}

if (!$post) {
    // Post not found — the React app will show "Post Not Found"
    header('Cache-Control: public, max-age=3600');
    echo $html;
    exit;
}

// ── Resolve SEO values with fallbacks ───────────────────────────────────────
$title       = $post['seo_title']       ?: ($post['title'] ?? '');
$description = $post['seo_description'] ?: ($post['excerpt'] ?? '');
$image       = $post['seo_og_image']    ?: ($post['cover_image'] ?? '');
$canonical   = 'https://infowebworld.com/infowebworld/blog/' . $slug;
$publishedAt = $post['published_at'] ?? '';
$updatedAt   = $post['updated_at']   ?? '';

// Parse seo_keywords from JSON (stored as JSON array in DB)
$keywords = '';
if (!empty($post['seo_keywords'])) {
    $decoded = json_decode($post['seo_keywords'], true);
    if (is_array($decoded)) {
        $keywords = implode(', ', $decoded);
    } else {
        // Fallback: treat as plain string
        $keywords = $post['seo_keywords'];
    }
}

// ── Escape for safe HTML attribute injection ────────────────────────────────
$eTitle       = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
$eDescription = htmlspecialchars($description, ENT_QUOTES, 'UTF-8');
$eImage       = htmlspecialchars($image, ENT_QUOTES, 'UTF-8');
$eCanonical   = htmlspecialchars($canonical, ENT_QUOTES, 'UTF-8');
$eKeywords    = htmlspecialchars($keywords, ENT_QUOTES, 'UTF-8');
$ePublished   = htmlspecialchars($publishedAt, ENT_QUOTES, 'UTF-8');
$eUpdated     = htmlspecialchars($updatedAt, ENT_QUOTES, 'UTF-8');

$pageTitle = $eTitle . ' | InfoWebWorld Blog';

// ── Build the SEO tag block ─────────────────────────────────────────────────
$seoTags = <<<HTML

    <meta name="description" content="{$eDescription}">
    <meta name="keywords" content="{$eKeywords}">
    <link rel="canonical" href="{$eCanonical}">
    <meta property="og:type" content="article">
    <meta property="og:title" content="{$eTitle}">
    <meta property="og:description" content="{$eDescription}">
    <meta property="og:image" content="{$eImage}">
    <meta property="og:url" content="{$eCanonical}">
    <meta property="article:published_time" content="{$ePublished}">
    <meta property="article:modified_time" content="{$eUpdated}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{$eTitle}">
    <meta name="twitter:description" content="{$eDescription}">
    <meta name="twitter:image" content="{$eImage}">
HTML;

// ── Build JSON-LD structured data ───────────────────────────────────────────
$jsonLd = [
    '@context'        => 'https://schema.org',
    '@type'           => 'BlogPosting',
    'headline'        => $title,
    'description'     => $description,
    'image'           => $image,
    'author'          => [
        '@type' => 'Organization',
        'name'  => 'InfoWebWorld',
    ],
    'publisher'       => [
        '@type' => 'Organization',
        'name'  => 'InfoWebWorld',
    ],
    'datePublished'   => $publishedAt,
    'dateModified'    => $updatedAt,
    'mainEntityOfPage' => [
        '@type' => 'WebPage',
        '@id'   => $canonical,
    ],
];

$jsonLdScript = "\n    <script type=\"application/ld+json\">" . json_encode($jsonLd, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "</script>";

// ── Inject into the HTML ────────────────────────────────────────────────────

// 1. Replace existing <title>…</title> if present, otherwise prepend title before </head>
if (preg_match('/<title>.*?<\/title>/is', $html)) {
    $html = preg_replace('/<title>.*?<\/title>/is', '<title>' . $pageTitle . '</title>', $html, 1);
    // Inject the rest of the SEO tags before </head>
    $html = str_replace('</head>', $seoTags . $jsonLdScript . "\n</head>", $html);
} else {
    // No existing title — inject title + SEO tags before </head>
    $titleTag = "\n    <title>{$pageTitle}</title>";
    $html = str_replace('</head>', $titleTag . $seoTags . $jsonLdScript . "\n</head>", $html);
}

// ── Serve ───────────────────────────────────────────────────────────────────
header('Cache-Control: public, max-age=3600');
header('Content-Type: text/html; charset=utf-8');
echo $html;
