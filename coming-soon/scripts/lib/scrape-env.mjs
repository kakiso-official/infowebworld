/**
 * Loads .env.local from the project root into a plain object.
 * Same parsing rules the existing scripts use (capture-screenshots.mjs etc.)
 * so behaviour stays consistent across the script directory.
 *
 * Real process.env values override anything in .env.local — letting you do
 *   GEMINI_API_KEY=xxx node scripts/scrape-listing.mjs <slug>
 * without editing the file.
 */
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

export function loadEnv(cwd = process.cwd()) {
  const env = {}
  const envPath = join(cwd, '.env.local')
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, 'utf8')
    for (const line of content.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (!m) continue
      let v = m[2]
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1)
      }
      env[m[1]] = v
    }
  }
  for (const k of Object.keys(env)) {
    if (process.env[k]) env[k] = process.env[k]
  }
  // also surface any process.env-only keys that we care about
  for (const k of ['GEMINI_API_KEY', 'DATABASE_HOST', 'DATABASE_PORT', 'DATABASE_NAME', 'DATABASE_USER', 'DATABASE_PASSWORD', 'DATABASE_SSL']) {
    if (process.env[k] && !env[k]) env[k] = process.env[k]
  }
  return env
}

export function requireEnv(env, keys) {
  const missing = keys.filter(k => !env[k])
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`)
  }
}
