/**
 * Type definitions for the scraper subsystem.
 * Used by API routes + UI; mirrors the 5 DB tables from
 * database/migration-scraper-tables.sql.
 */

export type L1Category =
  | 'aiml'
  | 'software-saas'
  | 'it-services'
  | 'professional-services'
  | 'startups'

export type JobStatus = 'queued' | 'running' | 'review' | 'applied' | 'failed' | 'skipped'
export type SessionStatus = 'running' | 'success' | 'failed' | 'cancelled' | 'review'
export type StepStatus = 'running' | 'ok' | 'error' | 'skipped'
export type StepType = 'crawl' | 'extract' | 'screenshot' | 'critique' | 'validate' | 'save'
export type DiscoveryStatus = 'running' | 'success' | 'failed' | 'cancelled'
export type CandidateStatus =
  | 'candidate'
  | 'queued'
  | 'scraped'
  | 'rejected'
  | 'duplicate'
  | 'dead'
export type CategoryResolvedBy = 'manual' | 'llm-auto' | 'llm-suggested'

export interface ScrapeJob {
  id: number
  slug: string
  company_name: string | null
  website: string
  category_l1: L1Category
  category_slug: string | null
  status: JobStatus
  last_session_id: number | null
  total_sessions: number
  total_cost_usd: number
  current_extracted_json: string | null
  current_source_citations: string | null
  current_screenshot_home_url: string | null
  current_screenshot_secondary_url: string | null
  queued_at: string
  applied_at: string | null
}

export interface ScrapeSession {
  id: number
  scrape_job_id: number
  status: SessionStatus
  total_steps: number
  failed_steps: number
  total_input_tokens: number
  total_output_tokens: number
  total_cost_usd: number
  pages_fetched: number
  extracted_json: string | null
  source_citations: string | null
  critique_flags: string | null
  screenshot_home_url: string | null
  screenshot_secondary_url: string | null
  llm_provider: string | null
  model_version: string | null
  started_at: string
  finished_at: string | null
  duration_ms: number | null
  error_summary: string | null
  applied_at: string | null
  applied_by: string | null
}

export interface ScrapeSessionStep {
  id: number
  session_id: number
  step_name: string
  step_index: number
  step_type: StepType
  status: StepStatus
  input_url: string | null
  input_prompt_preview: string | null
  output_status_code: number | null
  output_bytes: number | null
  output_excerpt: string | null
  input_tokens: number | null
  output_tokens: number | null
  cost_usd: number | null
  error_message: string | null
  started_at: string
  finished_at: string | null
  duration_ms: number | null
}

export interface CompanySeed {
  id: number
  candidate_name: string
  candidate_website: string
  proposed_slug: string | null
  category_l1: L1Category
  category_l3_slug: string | null
  category_l4_slug: string | null
  category_l5_slug: string | null
  category_confidence: number | null
  category_reasoning: string | null
  category_resolved_by: CategoryResolvedBy
  responsiveness_score: number | null
  responsiveness_factors: string | null
  predicted_responsive: number | null
  founded_year: number | null
  estimated_team_size: string | null
  funding_stage: string | null
  has_blog: number | null
  on_g2: number | null
  on_capterra: number | null
  on_producthunt: number | null
  last_blog_post_at: string | null
  linkedin_followers: number | null
  twitter_handle: string | null
  linkedin_url: string | null
  outreach_email: string | null
  url_alive: number | null
  url_last_checked: string | null
  url_status_code: number | null
  discovered_at: string
  discovered_from: string | null
  discovery_session_id: number | null
  status: CandidateStatus
  rejected_reason: string | null
  promoted_to_job_id: number | null
}

export interface DiscoverySession {
  id: number
  source_type: string | null
  source_url: string | null
  source_query: string | null
  target_l1: L1Category | null
  target_l3_slug: string | null
  companies_found: number
  companies_new: number
  companies_duplicate: number
  companies_failed: number
  started_at: string
  finished_at: string | null
  duration_ms: number | null
  cost_usd: number
  status: DiscoveryStatus
  error_message: string | null
}

/**
 * Source citation attached to every extracted field.
 * Required when the field's value is non-null — enforced by the validation
 * pass. If the LLM cannot quote it, the field must be null.
 */
export interface SourceCitation {
  url: string | null
  quote: string | null
}

/**
 * The final extracted JSON shape (one per scrape session). Mirrors the
 * columns of submissions that get filled during the enrich pass.
 */
export interface ExtractedListing {
  tagline: string | null
  description: string | null
  founded_year: number | null
  hq_city: string | null
  hq_country_code: string | null
  team_size: string | null
  logo_url: string | null
  linkedin_url: string | null
  twitter_url: string | null

  header_tags: string[]
  industries_served: string[]
  use_cases: string[]
  target_company_sizes: string[]
  key_features: string[]
  features: string[]

  pricing_model: string | null
  pricing_tiers: PricingTier[]
  integrations: IntegrationRef[]
  support_channels: string[]
  training_options: string[]
  languages: string[]
  compliance: string[]

  faqs: Faq[]
  pros: string[]
  cons: string[]

  starting_price: number | null
  starting_price_period: string | null
  starting_price_currency: string | null
  has_free_trial: boolean | null
  has_free_version: boolean | null
  has_ios_app: boolean | null
  has_android_app: boolean | null
}

export interface PricingTier {
  name: string
  price: number | null
  period: string
  features: string[]
}

export interface IntegrationRef {
  name: string
  website: string | null
  description: string | null
}

export interface Faq {
  question: string
  answer: string
}

/** Available LLM models with per-token pricing. */
export type GeminiModel = 'gemini-2.5-pro' | 'gemini-2.5-flash'
