/**
 * Gemini responseSchema definitions for each pass of the pipeline.
 *
 * Every extracted field has _source_url + _source_quote siblings so we can
 * verify the claim against the fetched HTML. The validation step refuses any
 * non-null field whose source is missing — that's how "real info only" is
 * enforced end-to-end.
 *
 * Arrays of strings (key_features, use_cases, etc.) cite the SOURCE PAGE
 * once at the array level — quoting each element would be wasteful and the
 * page URL plus the LLM having extracted the list is verification enough.
 *
 * Array-of-objects (pricing_tiers, integrations, faqs) put the source on
 * the WRAPPING object so the page is tied to the bundle, not to each row.
 *
 * Format follows Google's spec: OpenAPI 3 schema subset, with `nullable`.
 */

// ─── Reusable fragments ─────────────────────────────────────────────────
const nullableString = { type: 'string', nullable: true }
const nullableInt    = { type: 'integer', nullable: true }
const nullableNumber = { type: 'number', nullable: true }
const nullableBool   = { type: 'boolean', nullable: true }

const stringList = { type: 'array', items: { type: 'string' } }

// ─── Pass 1: Base info ──────────────────────────────────────────────────
export const baseInfoSchema = {
  type: 'object',
  properties: {
    tagline: nullableString,
    tagline_source_url: nullableString,
    tagline_source_quote: nullableString,

    description: nullableString,
    description_source_url: nullableString,
    description_source_quote: nullableString,

    founded_year: nullableInt,
    founded_year_source_url: nullableString,
    founded_year_source_quote: nullableString,

    hq_city: nullableString,
    hq_country_code: nullableString,
    hq_source_url: nullableString,
    hq_source_quote: nullableString,

    team_size: nullableString,
    team_size_source_url: nullableString,
    team_size_source_quote: nullableString,

    logo_url: nullableString,
    linkedin_url: nullableString,
    twitter_url: nullableString,
  },
  required: [
    'tagline', 'description',
    'tagline_source_url', 'tagline_source_quote',
    'description_source_url', 'description_source_quote',
  ],
}

// ─── Pass 2: Pricing ────────────────────────────────────────────────────
export const pricingSchema = {
  type: 'object',
  properties: {
    pricing_model: nullableString,
    pricing_tiers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          price: nullableNumber,
          period: { type: 'string' },
          features: stringList,
        },
        required: ['name', 'period', 'features'],
      },
    },
    pricing_source_url: nullableString,
    pricing_source_quote: nullableString,

    starting_price: nullableNumber,
    starting_price_period: nullableString,
    starting_price_currency: nullableString,

    has_free_trial: nullableBool,
    has_free_version: nullableBool,
    free_tier_source_url: nullableString,
    free_tier_source_quote: nullableString,
  },
  required: ['pricing_model', 'pricing_tiers'],
}

// ─── Pass 3: Features + integrations + apps ─────────────────────────────
// key_features is a RICH array — each entry has {name, description} so the
// listing page can render a proper headline + paragraph per feature, not
// a one-line bullet.  features is a SEPARATE plain-string list, broader
// and more comprehensive — the "all features" reference.
export const featuresSchema = {
  type: 'object',
  properties: {
    key_features: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          source_quote: nullableString,
        },
        required: ['name', 'description'],
      },
    },
    key_features_source_url: nullableString,

    features: stringList,
    features_source_url: nullableString,

    integrations: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          website: nullableString,
          description: nullableString,
        },
        required: ['name'],
      },
    },
    integrations_source_url: nullableString,

    languages: stringList,
    compliance: stringList,
    compliance_source_url: nullableString,
    compliance_source_quote: nullableString,

    has_ios_app: nullableBool,
    has_android_app: nullableBool,
    apps_source_url: nullableString,
    apps_source_quote: nullableString,
  },
  required: ['key_features', 'features', 'integrations'],
}

// ─── Pass 4: FAQs (AEO-targeted) ────────────────────────────────────────
export const faqsSchema = {
  type: 'object',
  properties: {
    faqs: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          question: { type: 'string' },
          answer: { type: 'string' },
          source_url: nullableString,
          source_quote: nullableString,
        },
        required: ['question', 'answer'],
      },
    },
  },
  required: ['faqs'],
}

// ─── Pass 5: Classification (uses passes 1-4 outputs as input) ──────────
export const classificationSchema = {
  type: 'object',
  properties: {
    header_tags: stringList,
    industries_served: stringList,
    use_cases: stringList,
    target_company_sizes: stringList,
    pros: stringList,
    cons: stringList,
    support_channels: stringList,
    training_options: stringList,
  },
  required: [
    'header_tags', 'industries_served', 'use_cases',
    'target_company_sizes', 'pros', 'cons',
  ],
}

// ─── Pass 6: Self-critique (hallucination detector) ─────────────────────
export const critiqueSchema = {
  type: 'object',
  properties: {
    overall_quality: {
      type: 'string',
      enum: ['high', 'medium', 'low'],
    },
    flagged_fields: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          field_path: { type: 'string' },
          reason: { type: 'string' },
          severity: { type: 'string', enum: ['error', 'warning'] },
        },
        required: ['field_path', 'reason', 'severity'],
      },
    },
    summary: { type: 'string' },
  },
  required: ['overall_quality', 'flagged_fields', 'summary'],
}

// ─── Category resolution (used by discovery agent + per-listing) ────────
export const categorySchema = {
  type: 'object',
  properties: {
    l3_slug: nullableString,
    l4_slug: nullableString,
    l5_slug: nullableString,
    confidence: { type: 'number' },
    reasoning: { type: 'string' },
  },
  required: ['confidence', 'reasoning'],
}
