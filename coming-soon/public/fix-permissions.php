<?php
/**
 * Run ONCE after extracting the zip on cPanel/DirectAdmin.
 * Visit: https://infowebworld.com/infowebworld/fix-permissions.php
 * Then DELETE this file from the server.
 */
header('Content-Type: text/plain');

$dir = __DIR__;
$dirs = 0;
$files = 0;
$errors = [];

$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS),
    RecursiveIteratorIterator::SELF_FIRST
);

foreach ($iterator as $item) {
    $path = $item->getPathname();
    if ($item->isDir()) {
        if (@chmod($path, 0755)) { $dirs++; }
        else { $errors[] = "DIR FAIL: $path"; }
    } else {
        if (@chmod($path, 0644)) { $files++; }
        else { $errors[] = "FILE FAIL: $path"; }
    }
}

// Also fix current directory
@chmod($dir, 0755);

echo "=== InfoWebWorld Permission Fix ===\n\n";
echo "Directories fixed: $dirs\n";
echo "Files fixed: $files\n";

if (count($errors) > 0) {
    echo "\nErrors (" . count($errors) . "):\n";
    foreach ($errors as $e) { echo "  $e\n"; }
} else {
    echo "\nAll permissions set successfully!\n";
}

echo "\n>>> NOW DELETE THIS FILE from your server! <<<\n";
