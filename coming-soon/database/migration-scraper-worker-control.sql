-- ──────────────────────────────────────────────────────────────────────────
-- Migration: scraper worker control + heartbeat tables.
--
-- Replaces the file-based signaling (.scrape-worker.stop /
-- .scrape-worker.heartbeat) used when the worker ran on the same machine
-- as the dev server. With the worker now living on a remote Linux server,
-- the Vercel admin UI and the worker process no longer share a filesystem
-- — so the signals move into MySQL, which both can already reach.
--
-- Two tables:
--   1. scrape_worker_control     single row (id=1); UI writes desired_state,
--                                worker reads it each iteration.
--   2. scrape_worker_heartbeats  one row per worker process (PK=worker_id);
--                                worker writes every poll, UI reads to show
--                                online/offline + day spend + in-flight jobs.
--
-- Both idempotent. Run in phpMyAdmin against cdbrisgy_infowebworld.
-- ──────────────────────────────────────────────────────────────────────────


-- ─── 1. scrape_worker_control ─────────────────────────────────────────────
-- Single-row control table. Always id=1. The Start/Stop buttons in the
-- admin UI flip desired_state. The long-running worker daemon polls this
-- row each iteration; on 'stopped' it goes idle (still heartbeats) without
-- claiming new jobs. Process stays alive — PM2 manages the daemon lifecycle.
CREATE TABLE IF NOT EXISTS scrape_worker_control (
  id              TINYINT UNSIGNED NOT NULL DEFAULT 1,
  desired_state   ENUM('running','stopped') NOT NULL DEFAULT 'stopped',
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by      VARCHAR(191) DEFAULT NULL,
  note            VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO scrape_worker_control (id, desired_state)
VALUES (1, 'stopped');


-- ─── 2. scrape_worker_heartbeats ──────────────────────────────────────────
-- One row per worker process. Worker writes this row on every poll
-- iteration; UI uses last_seen_at < 60s = process alive. Holds current
-- settings + day spend + current jobs so the UI can render fleet status
-- ("hetzner-prod-1 online, 2 in-flight, $1.43 today, gemini-2.5-flash")
-- without the worker needing an inbound HTTP endpoint.
CREATE TABLE IF NOT EXISTS scrape_worker_heartbeats (
  worker_id       VARCHAR(64) NOT NULL,
  hostname        VARCHAR(255) DEFAULT NULL,
  status          ENUM('starting','online','idle','draining','offline') NOT NULL DEFAULT 'starting',
  started_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  current_jobs    JSON DEFAULT NULL,
  day_key         VARCHAR(10) NOT NULL DEFAULT '',
  day_spend_usd   DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
  model           VARCHAR(100) DEFAULT NULL,
  concurrency     TINYINT UNSIGNED NOT NULL DEFAULT 1,
  poll_ms         INT UNSIGNED NOT NULL DEFAULT 10000,
  daily_cap_usd   DECIMAL(10,4) NOT NULL DEFAULT 20.0000,
  per_job_cap_usd DECIMAL(10,4) NOT NULL DEFAULT 0.5000,
  l1_filter       VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (worker_id),
  KEY idx_last_seen (last_seen_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
