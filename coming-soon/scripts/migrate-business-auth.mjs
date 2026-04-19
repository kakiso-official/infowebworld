import { readFileSync } from 'node:fs'
import mysql from 'mysql2/promise'

const env = {}
const raw = readFileSync('.env.local', 'utf8')
for (const line of raw.split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (!m) continue
  let v = m[2]
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
  env[m[1]] = v
}

const conn = await mysql.createConnection({
  host: env.DATABASE_HOST, port: Number(env.DATABASE_PORT || 3306),
  database: env.DATABASE_NAME, user: env.DATABASE_USER, password: env.DATABASE_PASSWORD,
  ssl: env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  multipleStatements: true,
})

const statements = [
  `CREATE TABLE IF NOT EXISTS business_users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL,
    email VARCHAR(255) NOT NULL,
    email_verified TINYINT(1) NOT NULL DEFAULT 0,
    name VARCHAR(120),
    avatar_url VARCHAR(500),
    password_hash VARCHAR(255) NULL,
    provider VARCHAR(20) NOT NULL DEFAULT 'email',
    provider_id VARCHAR(190) NULL,
    last_login_at DATETIME NULL,
    last_login_ip VARCHAR(45) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_uuid (uuid),
    UNIQUE KEY uk_email (email),
    UNIQUE KEY uk_provider_id (provider, provider_id),
    KEY k_email (email)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS business_sessions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    token VARCHAR(128) NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(500) NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_token (token),
    KEY k_user (user_id),
    KEY k_expires (expires_at),
    CONSTRAINT fk_bus_session_user FOREIGN KEY (user_id) REFERENCES business_users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  /* OAuth state tokens — short-lived, holds PKCE verifier + intended redirect */
  `CREATE TABLE IF NOT EXISTS oauth_states (
    state CHAR(64) NOT NULL PRIMARY KEY,
    provider VARCHAR(20) NOT NULL,
    code_verifier VARCHAR(128) NULL,
    redirect_after VARCHAR(500) NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY k_expires (expires_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
]

for (const sql of statements) {
  console.log('Running:', sql.slice(0, 60) + '...')
  await conn.query(sql)
}

// Add user_id column to submissions if missing
const [subs] = await conn.execute('DESCRIBE submissions')
const hasUserCol = subs.some(c => c.Field === 'user_id')
if (!hasUserCol) {
  console.log('Adding submissions.user_id')
  await conn.query(`ALTER TABLE submissions ADD COLUMN user_id INT UNSIGNED NULL AFTER plan_id`)
  await conn.query(`ALTER TABLE submissions ADD KEY k_user (user_id)`)
} else {
  console.log('submissions.user_id already exists — skipping ALTER')
}

console.log('\n=== business_users schema ===')
const [u] = await conn.execute('DESCRIBE business_users')
console.table(u)

console.log('\n=== business_sessions schema ===')
const [s] = await conn.execute('DESCRIBE business_sessions')
console.table(s)

console.log('\n=== oauth_states schema ===')
const [o] = await conn.execute('DESCRIBE oauth_states')
console.table(o)

await conn.end()
console.log('\nMigration complete.')
