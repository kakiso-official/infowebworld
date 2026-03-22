<?php
/**
 * InfoWebWorld — Database Configuration for cPanel
 *
 * INSTRUCTIONS:
 * 1. In cPanel → MySQL Databases → Create a new database
 * 2. Create a database user and add it to the database with ALL PRIVILEGES
 * 3. Update the values below with your cPanel details
 * 4. Upload this file to your server (outside public_html for security)
 * 5. Run schema.sql then seed.sql via phpMyAdmin
 */

define('DB_HOST',     'localhost');           // Usually 'localhost' on cPanel
define('DB_NAME',     'your_cpanel_dbname');  // e.g. 'infowebw_maindb'
define('DB_USER',     'your_cpanel_dbuser');  // e.g. 'infowebw_admin'
define('DB_PASS',     'your_db_password');    // Set a strong password
define('DB_CHARSET',  'utf8mb4');
define('DB_PORT',     3306);

// Connection pool size hint for persistent connections
define('DB_PERSISTENT', true);

/**
 * Get a PDO database connection (singleton pattern)
 * Uses persistent connections for performance under high traffic
 */
function getDB(): PDO {
    static $pdo = null;

    if ($pdo === null) {
        $dsn = sprintf(
            'mysql:host=%s;port=%d;dbname=%s;charset=%s',
            DB_HOST, DB_PORT, DB_NAME, DB_CHARSET
        );

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,     // Use real prepared statements
            PDO::ATTR_PERSISTENT         => DB_PERSISTENT,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
        ];

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            // In production, log this instead of exposing details
            http_response_code(500);
            die(json_encode(['error' => 'Database connection failed']));
        }
    }

    return $pdo;
}

/**
 * Rate limiting check
 * Returns true if the request should be allowed
 */
function checkRateLimit(string $endpoint, int $maxHits = 60, int $windowSeconds = 60): bool {
    $db = getDB();
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $windowStart = date('Y-m-d H:i:s', floor(time() / $windowSeconds) * $windowSeconds);

    $stmt = $db->prepare(
        "INSERT INTO rate_limits (ip_address, endpoint, hits, window_start)
         VALUES (?, ?, 1, ?)
         ON DUPLICATE KEY UPDATE hits = hits + 1"
    );
    $stmt->execute([$ip, $endpoint, $windowStart]);

    $stmt = $db->prepare(
        "SELECT hits FROM rate_limits
         WHERE ip_address = ? AND endpoint = ? AND window_start = ?"
    );
    $stmt->execute([$ip, $endpoint, $windowStart]);
    $row = $stmt->fetch();

    return ($row['hits'] ?? 0) <= $maxHits;
}

/**
 * CORS headers for API responses
 */
function setCorsHeaders(): void {
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

/**
 * Send JSON response
 */
function jsonResponse(mixed $data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Get JSON body from POST/PUT request
 */
function getJsonBody(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}
