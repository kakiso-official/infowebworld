<?php

header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: public, max-age=3600');

require_once __DIR__ . '/../iww-config.php';

$db = getDB();
$stmt = $db->query("SELECT slug, updated_at FROM blog_posts WHERE status = 'published' ORDER BY updated_at DESC");
$posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo '<?xml version="1.0" encoding="UTF-8"?>';
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

// Blog listing page
echo '<url>';
echo '<loc>https://infowebworld.com/infowebworld/blog</loc>';
echo '<lastmod>' . date('Y-m-d') . '</lastmod>';
echo '<changefreq>weekly</changefreq>';
echo '<priority>0.7</priority>';
echo '</url>';

// Individual blog posts
foreach ($posts as $post) {
    $lastmod = date('Y-m-d', strtotime($post['updated_at']));
    echo '<url>';
    echo '<loc>https://infowebworld.com/infowebworld/blog/' . htmlspecialchars($post['slug']) . '</loc>';
    echo '<lastmod>' . $lastmod . '</lastmod>';
    echo '<changefreq>weekly</changefreq>';
    echo '<priority>0.7</priority>';
    echo '</url>';
}

echo '</urlset>';
