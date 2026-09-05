/* ─── Shared SERP-safe metadata helpers ────────────────────────────────
   Pure functions, zero imports — safe to use from server components,
   client components and scripts alike.

   Why this file exists (2026-09 Screaming Frog audit):
   · 100% of category page titles overflowed Google's ~580px SERP cut
     (median 708-786px), so the money keyword was being truncated away.
   · 2,584 pages overflowed the ~985px snippet width, /listing/* worst
     because it hard-sliced to exactly 160 chars — still too wide, and
     it cut mid-word.
   · 157 seeded company rows carry scraper-error text or an
     abbreviation-truncated fragment as their description; those must
     never reach a meta tag or a rendered card.
   ──────────────────────────────────────────────────────────────────── */

/* Budgets calibrated against this site's own crawl (7,046 measured pages,
   Aug 2026), not guessed: titles rendered at a median 9.28px/char and
   descriptions at 6.40px/char.
     580px title cut   -> ~62 chars   (58-62 char titles measured p90 578px)
     985px snippet cut -> ~153 chars  (148-152 char descs measured p90 986px)
   Both budgets sit just under those so the p90 case still fits. */

/** Google truncates SERP titles around 580px. */
export const TITLE_BUDGET = 60

/** Google truncates snippets around 985px. The previous hard 160-char
 *  slice measured ~1,020px and overflowed on 761 of 823 listing pages. */
export const DESC_BUDGET = 145

/** Collapse whitespace and trim. */
function tidy(s: string): string {
  return (s || '').replace(/\s+/g, ' ').trim()
}

/**
 * Trim `text` to at most `budget` characters without cutting a word in half.
 * Prefers ending on a sentence boundary when one sits reasonably deep into
 * the budget, otherwise falls back to the last word boundary.
 */
export function trimToBudget(text: string, budget: number): string {
  const s = tidy(text)
  if (s.length <= budget) return s

  const head = s.slice(0, budget + 1)

  /* A sentence end deep enough into the budget reads better than a hard cut. */
  const sentenceEnd = Math.max(
    head.lastIndexOf('. '),
    head.lastIndexOf('! '),
    head.lastIndexOf('? '),
  )
  if (sentenceEnd >= Math.floor(budget * 0.6)) {
    return s.slice(0, sentenceEnd + 1).trim()
  }

  const space = head.lastIndexOf(' ')
  const cut = space > 0 ? space : budget
  return s.slice(0, cut).replace(/[\s,;:\-–—]+$/, '').trim()
}

/**
 * Build a meta description that fits the snippet budget WITHOUT losing the
 * trailing clause.
 *
 * The lead sentence is variable-length and the suffix (e.g. "Updated
 * September 2026.") is fixed and valuable, so the lead is clamped to
 * `budget - suffix` and only then joined. Clamping the assembled string
 * instead would silently delete the freshness clause on every page — which
 * is exactly what a naive implementation does here, because the lead alone
 * already fills the budget on most category templates.
 */
export function clampDescription(
  lead: string,
  suffix = '',
  budget = DESC_BUDGET,
): string {
  const tail = tidy(suffix)
  const tailPart = tail ? ` ${tail}` : ''
  /* Never let a long suffix starve the lead below something readable. */
  const leadBudget = Math.max(60, budget - tailPart.length)

  const s = tidy(lead)
  if (s.length <= leadBudget) return `${s}${tailPart}`.trim()

  const head = s.slice(0, leadBudget + 1)

  /* Best ending, in order of how well it reads:
     1. a sentence end   → "...transparent pricing & features."
     2. a clause end     → "...top picks, verified reviews."
     3. a word boundary  → last resort, closed with a period       */
  const sentenceEnd = Math.max(
    head.lastIndexOf('. '), head.lastIndexOf('! '), head.lastIndexOf('? '),
  )
  if (sentenceEnd >= Math.floor(leadBudget * 0.5)) {
    return `${s.slice(0, sentenceEnd + 1).trim()}${tailPart}`.trim()
  }

  const clauseEnd = Math.max(head.lastIndexOf(', '), head.lastIndexOf('; '))
  const cut = clauseEnd >= Math.floor(leadBudget * 0.5)
    ? clauseEnd
    : (head.lastIndexOf(' ') > 0 ? head.lastIndexOf(' ') : leadBudget)

  const body = s.slice(0, cut).replace(/[\s,;:\-–—]+$/, '').trim()
  return `${body}.${tailPart}`.trim()
}

/**
 * Assemble a title that stays inside the SERP budget.
 *
 * `core` always survives — it carries the ranking keyword. Each extra is
 * appended only if the result still fits, in the order given (most
 * valuable first). An extra that doesn't fit is skipped, not fatal: a
 * short brand suffix can still land after a long clause was dropped.
 */
export function buildSerpTitle(
  core: string,
  extras: { text: string; sep?: string }[] = [],
  budget = TITLE_BUDGET,
): string {
  let out = tidy(core)
  for (const extra of extras) {
    const text = tidy(extra.text)
    if (!text) continue
    const next = `${out}${extra.sep ?? ' - '}${text}`
    if (next.length <= budget) out = next
  }
  return out
}

/* ─── Junk-content guard ──────────────────────────────────────────────
   The bulk-enrichment waves wrote two kinds of garbage into
   submissions.description / submissions.tagline:

   A) the enrichment agent's own error message, e.g.
      "Page verification failed - bot-gated site preventing content access"
   B) a fragment cut at an abbreviation's period by a naive sentence
      splitter, e.g. "C.H." / "Arthur J." / "Chuck E."

   Both are live and user-visible today on indexed category pages, so the
   render surfaces guard against them rather than trusting the column.
   ──────────────────────────────────────────────────────────────────── */

const JUNK_PATTERNS: RegExp[] = [
  /\b(unable|failed|couldn'?t|could not|cannot)\s+to?\s*(extract|verify|access|retrieve|read|determine)/i,
  /\b(page|site|website|homepage|content)\s+(is\s+)?(blocked|unavailable|inaccessible|not available|empty)/i,
  /\bverification failed\b/i,
  /\bbot[- ]gated\b/i,
  /\b(security (checkpoint|challenge|service|measures)|browser verification|captcha)\b/i,
  /\brequires? javascript\b/i,
  /\bno (content|business information|text|information) (available|accessible)\b/i,
  /\bcontent (not available|unavailable)\b/i,
  /\baccess (denied|forbidden)\b/i,
  /\b(limited|no) information available\b/i,
  /\bhomepage returned empty\b/i,
  /\b403\b.*\b(forbidden|error)\b/i,
]

/** Trailing fragment left by splitting on an abbreviation's period —
 *  "C.H." / "Arthur J." / "Dewan P.N." / "CorpTech, Inc." */
const ABBREV_TAIL = /(?:^|\s)(?:[A-Z]\.){1,3}$|(?:^|\s)[A-Z][a-z]{0,3}\.$/

/** Below this, a stored description is a truncation artefact, not prose.
 *  Every observed Pattern-B casualty was 25 chars or less. */
export const MIN_DESCRIPTION_CHARS = 25

/**
 * True when a stored description/tagline is unusable and must not be
 * rendered or emitted as a meta description.
 *
 * `minLength` is a parameter because taglines are legitimately shorter
 * than descriptions — callers emitting a meta description should pass a
 * stricter floor than callers rendering a card subtitle.
 */
export function isJunkText(value: unknown, minLength = MIN_DESCRIPTION_CHARS): boolean {
  if (typeof value !== 'string') return true
  const s = value.trim()
  if (!s) return true

  /* Pattern B: too short to be real prose. "C.H." / "Robert W." / "A.M." */
  if (s.length < minLength) return true

  /* A SHORT string ending on a bare abbreviation is a truncation. Long
     prose that happens to end in "Inc." is left alone — the tail check
     only fires where truncation is actually plausible. */
  if (s.length < 60 && ABBREV_TAIL.test(s)) return true

  /* Pattern A: the enrichment agent's own error text. */
  return JUNK_PATTERNS.some(re => re.test(s))
}

/** The value if it is usable, otherwise the fallback. */
export function cleanText(value: unknown, fallback = '', minLength = MIN_DESCRIPTION_CHARS): string {
  return isJunkText(value, minLength) ? fallback : String(value).trim()
}
