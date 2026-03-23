<?php
/**
 * Self-extracting deploy script for cPanel.
 *
 * 1. Upload deploy.php + infowebworld-deploy.zip to public_html/infowebworld/
 * 2. Visit: https://infowebworld.com/infowebworld/deploy.php
 * 3. Delete both deploy.php and the zip after success.
 */
header('Content-Type: text/html; charset=utf-8');

echo "<pre style='font:16px/1.6 monospace;max-width:700px;margin:40px auto'>";
echo "=== InfoWebWorld Deploy ===\n\n";

$zip_name = 'infowebworld-deploy.zip';
$zip_path = __DIR__ . '/' . $zip_name;
$dest     = __DIR__;

if (!file_exists($zip_path)) {
    echo "ERROR: $zip_name not found!\n";
    echo "Upload it to the same folder as deploy.php\n</pre>";
    exit;
}

echo "Found: $zip_name (" . round(filesize($zip_path) / 1024) . " KB)\n";

if (!class_exists('ZipArchive')) {
    echo "ERROR: PHP ZipArchive extension not available.\n</pre>";
    exit;
}

$zip = new ZipArchive();
if ($zip->open($zip_path) !== true) {
    echo "ERROR: Could not open zip.\n</pre>";
    exit;
}

$total   = $zip->numFiles;
$created = 0;
$errors  = [];

echo "Entries: $total\n";
echo "Extracting (backslash-safe)...\n\n";

// Manual extraction: convert \ to / and create dirs explicitly
for ($i = 0; $i < $total; $i++) {
    $entry = $zip->getNameIndex($i);
    // Normalize Windows backslashes to forward slashes
    $clean = str_replace('\\', '/', $entry);

    $target = $dest . '/' . $clean;

    // Directory entry (ends with /)
    if (substr($clean, -1) === '/') {
        if (!is_dir($target)) {
            @mkdir($target, 0755, true);
        }
        continue;
    }

    // File entry — ensure parent dir exists
    $parent = dirname($target);
    if (!is_dir($parent)) {
        @mkdir($parent, 0755, true);
    }

    // Read from zip and write to disk
    $data = $zip->getFromIndex($i);
    if ($data === false) {
        $errors[] = $clean;
        continue;
    }

    file_put_contents($target, $data);
    @chmod($target, 0644);
    $created++;
}

$zip->close();

echo "Extracted $created files.\n";
if (count($errors) > 0) {
    echo "Failed: " . count($errors) . "\n";
    foreach ($errors as $e) echo "  - $e\n";
}

// Verify critical paths
echo "\nVerification:\n";
$checks = [
    '_next'                    => is_dir("$dest/_next"),
    '_next/static/chunks'      => is_dir("$dest/_next/static/chunks"),
    '_next/static/css'         => is_dir("$dest/_next/static/css"),
    '_next/static/media'       => is_dir("$dest/_next/static/media"),
    'index.html'               => is_file("$dest/index.html"),
    '.htaccess'                => is_file("$dest/.htaccess"),
];

$all_ok = true;
foreach ($checks as $path => $exists) {
    $icon = $exists ? 'OK' : 'MISSING';
    echo "  [$icon] $path\n";
    if (!$exists) $all_ok = false;
}

// Fix permissions on all dirs
$dirs = 0;
$ri = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($dest, RecursiveDirectoryIterator::SKIP_DOTS),
    RecursiveIteratorIterator::SELF_FIRST
);
foreach ($ri as $item) {
    if ($item->isDir()) { @chmod($item->getPathname(), 0755); $dirs++; }
}
echo "\nDirectory permissions fixed: $dirs\n";

if ($all_ok) {
    echo "\nSUCCESS! Site is deployed.\n";
    echo "\n>>> NOW DELETE deploy.php AND $zip_name from your server! <<<\n";
} else {
    echo "\nWARNING: Some paths are missing. Check the list above.\n";
}

echo "</pre>";
