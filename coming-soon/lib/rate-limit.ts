import { execute, queryOne } from './db'

export async function checkRateLimit(
  ip: string,
  endpoint: string,
  max = 60,
  windowSec = 60
): Promise<boolean> {
  try {
    const windowStart = new Date(Math.floor(Date.now() / (windowSec * 1000)) * windowSec * 1000)
      .toISOString().slice(0, 19).replace('T', ' ')

    await execute(
      `INSERT INTO rate_limits (ip_address, endpoint, hits, window_start)
       VALUES (?, ?, 1, ?)
       ON DUPLICATE KEY UPDATE hits = hits + 1`,
      [ip, endpoint, windowStart]
    )

    const row = await queryOne<{ hits: number }>(
      'SELECT hits FROM rate_limits WHERE ip_address = ? AND endpoint = ? AND window_start = ?',
      [ip, endpoint, windowStart]
    )

    return (row?.hits ?? 0) <= max
  } catch {
    return true
  }
}
