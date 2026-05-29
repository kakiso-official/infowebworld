/* PM2 ecosystem config for the scraper worker daemon.
 *
 * Usage on the Linux server (from the project root):
 *
 *   pm2 start ecosystem.config.cjs --only scraper-worker
 *   pm2 save
 *   pm2 startup            # one-time: makes PM2 auto-start on reboot
 *
 * The worker reads .env.local from process.cwd() via scrape-env.mjs,
 * so PM2 must be launched from the project root (or the cwd field set
 * to an absolute path).
 *
 * kill_timeout: PM2 sends SIGINT on `pm2 stop`, then waits this long for
 * the worker to drain in-flight scrapes before SIGKILL. 90s lets a slow
 * job finish; tune higher if you raise --concurrency.
 */
module.exports = {
  apps: [
    {
      name: 'scraper-worker',
      script: 'scripts/scrape-worker.mjs',
      // args: '--worker-id=prod-1 --concurrency=1 --model=gemini-2.5-pro --poll=10000 --daily-cap=20 --job-cap=0.50',
      autorestart: true,
      max_memory_restart: '1G',
      max_restarts: 50,
      min_uptime: '30s',
      kill_timeout: 90_000,
      out_file: './logs/scraper-worker.out.log',
      error_file: './logs/scraper-worker.err.log',
      merge_logs: true,
      time: true,
    },
  ],
}
