/**
 * Thin Gemini API client — structured-output focused.
 *
 * Uses Google's generativelanguage REST endpoint (same one the chat widget
 * already uses) so no new SDK dep. responseSchema + responseMimeType give
 * guaranteed-JSON output; if Gemini emits malformed JSON we throw rather
 * than fall back to regex parsing.
 *
 * Cost is tracked per call against the published rate card. Two tiers used:
 *   gemini-2.5-pro    $1.25/M input  $10.00/M output  (best quality)
 *   gemini-2.5-flash  $0.30/M input  $ 2.50/M output  (4x cheaper)
 * Pro is the default for scraper passes; flash for cheap helpers like
 * "guess a slug" or "guess a category" where output is short.
 */

const ENDPOINT = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

const PRICING = {
  'gemini-2.5-pro':   { in: 1.25, out: 10.00 },
  'gemini-2.5-flash': { in: 0.30, out:  2.50 },
}

/**
 * Call Gemini with a JSON-schema-constrained response.
 *
 * @param {object} opts
 * @param {string} opts.apiKey
 * @param {string} [opts.model='gemini-2.5-pro']
 * @param {string} [opts.system]                    System instruction (Gemini calls this `systemInstruction`)
 * @param {string} opts.prompt                      Main user prompt
 * @param {object} [opts.responseSchema]            JSON Schema for structured output
 * @param {number} [opts.temperature=0.2]
 * @param {number} [opts.maxOutputTokens=8192]
 * @param {number} [opts.thinkingBudget=0]          0 = disable hidden reasoning; saves tokens
 * @param {number} [opts.retries=2]                 Retry on 429 / 5xx
 *
 * @returns {Promise<{ json: any, inputTokens: number, outputTokens: number, costUsd: number, rawText: string }>}
 */
export async function callGemini({
  apiKey,
  model = 'gemini-2.5-pro',
  system,
  prompt,
  responseSchema,
  temperature = 0.2,
  maxOutputTokens = 8192,
  thinkingBudget = null,
  retries = 2,
}) {
  if (!apiKey) throw new Error('Gemini: apiKey is required')
  if (!prompt) throw new Error('Gemini: prompt is required')

  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature,
      maxOutputTokens,
      topP: 0.95,
      topK: 40,
    },
  }
  /* Gemini 2.5 Pro rejects thinkingBudget=0 ("only works in thinking mode").
     Only emit thinkingConfig if explicitly set, and silently drop the
     budget=0 + pro combination so callers don't have to model-switch. */
  if (thinkingBudget != null && !(thinkingBudget === 0 && /pro/i.test(model))) {
    body.generationConfig.thinkingConfig = { thinkingBudget }
  }
  if (system) body.systemInstruction = { parts: [{ text: system }] }
  if (responseSchema) {
    body.generationConfig.responseMimeType = 'application/json'
    body.generationConfig.responseSchema = responseSchema
  }

  let attempt = 0
  let lastErr
  while (attempt <= retries) {
    try {
      const resp = await fetch(`${ENDPOINT(model)}?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!resp.ok) {
        const errText = await resp.text().catch(() => '')
        if ((resp.status === 429 || resp.status >= 500) && attempt < retries) {
          await sleep(2 ** attempt * 1500)
          attempt++
          continue
        }
        throw new Error(`Gemini ${resp.status}: ${errText.slice(0, 400)}`)
      }
      const payload = await resp.json()
      const candidates = payload?.candidates ?? []
      const parts = candidates[0]?.content?.parts ?? []
      const rawText = parts.map(p => p?.text ?? '').join('')

      let parsed
      if (responseSchema) {
        parsed = parseJsonLoose(rawText)
        if (parsed === undefined) {
          /* Transient malformed JSON — retry like a 5xx before giving up.
             A one-off bad emission shouldn't fail the whole extract pass;
             only throw once retries are exhausted, surfacing the rawText
             prefix so the failing step row has a useful error_message. */
          if (attempt < retries) {
            await sleep(2 ** attempt * 1500)
            attempt++
            continue
          }
          throw new Error(`Gemini returned unparseable JSON: ${rawText.slice(0, 300)}`)
        }
      } else {
        parsed = rawText
      }

      const usage = payload?.usageMetadata ?? {}
      const inputTokens = usage.promptTokenCount ?? 0
      const outputTokens = (usage.candidatesTokenCount ?? 0) + (usage.thoughtsTokenCount ?? 0)
      const costUsd = computeCost(model, inputTokens, outputTokens)

      return { json: parsed, inputTokens, outputTokens, costUsd, rawText }
    } catch (err) {
      lastErr = err
      if (attempt >= retries) throw err
      await sleep(2 ** attempt * 1500)
      attempt++
    }
  }
  throw lastErr ?? new Error('Gemini: exhausted retries')
}

export function computeCost(model, inputTokens, outputTokens) {
  const p = PRICING[model] ?? PRICING['gemini-2.5-pro']
  return (inputTokens / 1_000_000) * p.in + (outputTokens / 1_000_000) * p.out
}

export function pricingFor(model) {
  return PRICING[model] ?? PRICING['gemini-2.5-pro']
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

/* Three-pass JSON parser. Gemini with responseSchema USUALLY returns
   clean JSON, but we've seen ```json fences, leading commentary, and
   trailing markdown. Try strict first (fast path), then fence-strip,
   then substring-between-first-{-and-last-}. Returns undefined if all
   three fail, so the caller can distinguish "no JSON" from "valid null". */
function parseJsonLoose(rawText) {
  if (typeof rawText !== 'string' || !rawText) return undefined
  try { return JSON.parse(rawText) } catch {}

  const stripped = rawText.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim()
  try { return JSON.parse(stripped) } catch {}

  /* Substring extraction — find a balanced top-level { ... } or [ ... ].
     Cheaper than a real parser and works on the failure modes we've seen
     (Gemini prepending "Here is the JSON:" or appending "Note: ..."). */
  const firstObj = stripped.indexOf('{')
  const firstArr = stripped.indexOf('[')
  const first = firstObj === -1 ? firstArr
              : firstArr === -1 ? firstObj
              : Math.min(firstObj, firstArr)
  if (first === -1) return undefined
  const openChar = stripped[first]
  const closeChar = openChar === '{' ? '}' : ']'
  const last = stripped.lastIndexOf(closeChar)
  if (last <= first) return undefined
  try { return JSON.parse(stripped.slice(first, last + 1)) } catch {}
  return undefined
}
