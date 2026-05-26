-- ──────────────────────────────────────────────────────────────────────────
-- Migration: scraper subsystem.
--
-- Five tables:
--   1. scrape_jobs              one row per company queued for scraping
--   2. scrape_sessions          one row per scrape attempt (jobs have many)
--   3. scrape_session_steps     fine-grained step log per session (Gantt UI)
--   4. companies_seed           pre-discovery candidate pool (the 5,000)
--   5. discovery_sessions       one row per candidate-discovery run
--
-- All idempotent (CREATE TABLE IF NOT EXISTS). Run in phpMyAdmin against
-- cdbrisgy_infowebworld. No inline end-of-line comments — phpMyAdmin
-- pastes can flatten newlines and eat the rest of a statement.
--
-- Foreign keys are intentionally omitted on the scraper tables so the
-- scraper subsystem stays decoupled from submissions / business_users —
-- the application layer enforces integrity. Drop / recreate any single
-- table without touching the rest.
-- ──────────────────────────────────────────────────────────────────────────


-- ─── 1. scrape_jobs ────────────────────────────────────────────────────────
-- One row per company in the system. The slug is the durable key —
-- everything else can change. `current_*` columns hold the latest applied
-- session's output so the listing detail view doesn't need a join.
CREATE TABLE IF NOT EXISTS scrape_jobs (
  id                            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug                          VARCHAR(191) NOT NULL,
  company_name                  VARCHAR(255) DEFAULT NULL,
  website                       VARCHAR(500) NOT NULL,
  category_l1                   VARCHAR(50) NOT NULL,
  category_slug                 VARCHAR(191) DEFAULT NULL,
  status                        ENUM('queued','running','review','applied','failed','skipped') NOT NULL DEFAULT 'queued',
  last_session_id               BIGINT UNSIGNED DEFAULT NULL,
  total_sessions                INT UNSIGNED NOT NULL DEFAULT 0,
  total_cost_usd                DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
  current_extracted_json        LONGTEXT DEFAULT NULL,
  current_source_citations      LONGTEXT DEFAULT NULL,
  current_screenshot_home_url   VARCHAR(500) DEFAULT NULL,
  current_screenshot_secondary_url VARCHAR(500) DEFAULT NULL,
  queued_at                     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  applied_at                    DATETIME DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_slug (slug),
  KEY idx_status (status),
  KEY idx_category_status (category_l1, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─── 2. scrape_sessions ────────────────────────────────────────────────────
-- One row per scrape attempt. A listing can have many sessions over time
-- (initial scrape, re-scrape after pricing change, etc.). status tracks the
-- session lifecycle; applied_at is non-null once a session has been written
-- through to the submissions table.
CREATE TABLE IF NOT EXISTS scrape_sessions (
  id                       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  scrape_job_id            BIGINT UNSIGNED NOT NULL,
  status                   ENUM('running','success','failed','cancelled','review') NOT NULL DEFAULT 'running',
  total_steps              INT UNSIGNED NOT NULL DEFAULT 0,
  failed_steps             INT UNSIGNED NOT NULL DEFAULT 0,
  total_input_tokens       INT UNSIGNED NOT NULL DEFAULT 0,
  total_output_tokens      INT UNSIGNED NOT NULL DEFAULT 0,
  total_cost_usd           DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
  pages_fetched            INT UNSIGNED NOT NULL DEFAULT 0,
  extracted_json           LONGTEXT DEFAULT NULL,
  source_citations         LONGTEXT DEFAULT NULL,
  critique_flags           LONGTEXT DEFAULT NULL,
  screenshot_home_url      VARCHAR(500) DEFAULT NULL,
  screenshot_secondary_url VARCHAR(500) DEFAULT NULL,
  llm_provider             VARCHAR(50) DEFAULT NULL,
  model_version            VARCHAR(100) DEFAULT NULL,
  started_at               DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finished_at              DATETIME DEFAULT NULL,
  duration_ms              INT UNSIGNED DEFAULT NULL,
  error_summary            TEXT DEFAULT NULL,
  applied_at               DATETIME DEFAULT NULL,
  applied_by               VARCHAR(191) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_job (scrape_job_id, started_at),
  KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─── 3. scrape_session_steps ───────────────────────────────────────────────
-- One row per step inside a session. Feeds the Gantt-style timeline UI.
-- step_name values: crawl-home, crawl-pricing, crawl-features, crawl-faq,
-- crawl-about, screenshot-home, screenshot-secondary, extract-base,
-- extract-pricing, extract-features, extract-faqs, extract-classify,
-- self-critique, validate-citations, save-session.
CREATE TABLE IF NOT EXISTS scrape_session_steps (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  session_id            BIGINT UNSIGNED NOT NULL,
  step_name             VARCHAR(50) NOT NULL,
  step_index            INT UNSIGNED NOT NULL,
  step_type             ENUM('crawl','extract','screenshot','critique','validate','save') NOT NULL,
  status                ENUM('running','ok','error','skipped') NOT NULL DEFAULT 'running',
  input_url             VARCHAR(500) DEFAULT NULL,
  input_prompt_preview  TEXT DEFAULT NULL,
  output_status_code    SMALLINT UNSIGNED DEFAULT NULL,
  output_bytes          INT UNSIGNED DEFAULT NULL,
  output_excerpt        TEXT DEFAULT NULL,
  input_tokens          INT UNSIGNED DEFAULT NULL,
  output_tokens         INT UNSIGNED DEFAULT NULL,
  cost_usd              DECIMAL(10,4) DEFAULT NULL,
  error_message         TEXT DEFAULT NULL,
  started_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finished_at           DATETIME DEFAULT NULL,
  duration_ms           INT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_session (session_id, step_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─── 4. discovery_sessions ─────────────────────────────────────────────────
-- One row per candidate-discovery run. A run hits one source (YC directory,
-- Product Hunt, Clutch, manual CSV, Gemini-search) and produces candidate
-- companies. Tracks cost so the Dashboards tab can show total discovery
-- spend per L1.
CREATE TABLE IF NOT EXISTS discovery_sessions (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  source_type           VARCHAR(50) DEFAULT NULL,
  source_url            VARCHAR(500) DEFAULT NULL,
  source_query          TEXT DEFAULT NULL,
  target_l1             VARCHAR(50) DEFAULT NULL,
  target_l3_slug        VARCHAR(191) DEFAULT NULL,
  companies_found       INT UNSIGNED NOT NULL DEFAULT 0,
  companies_new         INT UNSIGNED NOT NULL DEFAULT 0,
  companies_duplicate   INT UNSIGNED NOT NULL DEFAULT 0,
  companies_failed      INT UNSIGNED NOT NULL DEFAULT 0,
  started_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finished_at           DATETIME DEFAULT NULL,
  duration_ms           INT UNSIGNED DEFAULT NULL,
  cost_usd              DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
  status                ENUM('running','success','failed','cancelled') NOT NULL DEFAULT 'running',
  error_message         TEXT DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_status (status, started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─── 5. companies_seed ─────────────────────────────────────────────────────
-- The pre-scrape candidate pool — target 1,000 per L1 (5,000 total across
-- AI/ML, Software & SaaS, IT Services, Professional Services, Startups).
--
-- Three groups of columns:
--   * Identity + URL (candidate_name, candidate_website, proposed_slug)
--   * Hierarchical category resolution (L1 / L3 / L4 / L5 + confidence
--     + reasoning + who/what resolved it)
--   * Responsiveness predictor (score + factors + signals like founded_year,
--     team_size, funding_stage, presence on G2/Capterra/Product Hunt, etc.)
--
-- discovery_session_id and promoted_to_job_id are intentional plain BIGINTs
-- without FK so a table can be wiped independently. Application layer
-- maintains integrity.
CREATE TABLE IF NOT EXISTS companies_seed (
  id                       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  candidate_name           VARCHAR(255) NOT NULL,
  candidate_website        VARCHAR(500) NOT NULL,
  proposed_slug            VARCHAR(191) DEFAULT NULL,
  category_l1              VARCHAR(50) NOT NULL,
  category_l3_slug         VARCHAR(191) DEFAULT NULL,
  category_l4_slug         VARCHAR(191) DEFAULT NULL,
  category_l5_slug         VARCHAR(191) DEFAULT NULL,
  category_confidence      DECIMAL(3,2) DEFAULT NULL,
  category_reasoning       TEXT DEFAULT NULL,
  category_resolved_by     ENUM('manual','llm-auto','llm-suggested') NOT NULL DEFAULT 'llm-suggested',
  responsiveness_score     DECIMAL(3,2) DEFAULT NULL,
  responsiveness_factors   JSON DEFAULT NULL,
  predicted_responsive     TINYINT(1) DEFAULT NULL,
  founded_year             SMALLINT UNSIGNED DEFAULT NULL,
  estimated_team_size      VARCHAR(20) DEFAULT NULL,
  funding_stage            VARCHAR(50) DEFAULT NULL,
  has_blog                 TINYINT(1) DEFAULT NULL,
  on_g2                    TINYINT(1) DEFAULT NULL,
  on_capterra              TINYINT(1) DEFAULT NULL,
  on_producthunt           TINYINT(1) DEFAULT NULL,
  last_blog_post_at        DATE DEFAULT NULL,
  linkedin_followers       INT UNSIGNED DEFAULT NULL,
  twitter_handle           VARCHAR(100) DEFAULT NULL,
  linkedin_url             VARCHAR(500) DEFAULT NULL,
  outreach_email           VARCHAR(255) DEFAULT NULL,
  url_alive                TINYINT(1) DEFAULT NULL,
  url_last_checked         DATETIME DEFAULT NULL,
  url_status_code          SMALLINT UNSIGNED DEFAULT NULL,
  discovered_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  discovered_from          VARCHAR(100) DEFAULT NULL,
  discovery_session_id     BIGINT UNSIGNED DEFAULT NULL,
  status                   ENUM('candidate','queued','scraped','rejected','duplicate','dead') NOT NULL DEFAULT 'candidate',
  rejected_reason          VARCHAR(255) DEFAULT NULL,
  promoted_to_job_id       BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_website (candidate_website),
  KEY idx_l1_status_score (category_l1, status, responsiveness_score),
  KEY idx_l3 (category_l3_slug),
  KEY idx_discovery (discovery_session_id),
  KEY idx_promoted (promoted_to_job_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
