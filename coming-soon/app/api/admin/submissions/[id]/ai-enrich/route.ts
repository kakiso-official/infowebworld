import { NextRequest } from 'next/server'
import { execute, queryOne } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { geminiChat } from '@/lib/ai'

/**
 * POST /api/admin/submissions/[id]/ai-enrich
 *
 * Admin-only. Reads the company's OWN website (home + a couple of common
 * about pages), feeds the real page text to Gemini, and fills ONLY the
 * fields that are currently empty on the listing — it never overwrites data
 * that's already there, and never changes status.
 *
 * STRICT / no bluffing: Gemini is told to use only what the website text (and
 * existing listing data) actually supports, and to return null / [] for
 * anything it can't ground. Each value is then re-validated server-side before
 * it's written. `id` may be the numeric pk or the uuid.
 */

const ENUM_TEAM = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+']

type Spec = { key: string; col: string; type: 'text' | 'int' | 'enum' | 'url' | 'strArr' | 'awardArr' | 'clientArr'; hint: string }
const SPECS: Spec[] = [
  { key: 'description', col: 'description', type: 'text', hint: '1-3 plain sentences on what the company does (from the site)' },
  { key: 'tagline', col: 'tagline', type: 'text', hint: 'a short one-line tagline, max ~120 chars' },
  { key: 'founded_year', col: 'founded_year', type: 'int', hint: 'the founding year, ONLY if the site states it' },
  { key: 'team_size', col: 'team_size', type: 'enum', hint: `team/employee-size bucket (one of: ${ENUM_TEAM.join(', ')}), ONLY if the site states a size` },
  { key: 'hq_location', col: 'hq_location', type: 'text', hint: 'headquarters as "City, State, Country" if the site states it' },
  { key: 'industries_served', col: 'industries_served', type: 'strArr', hint: 'industries / sectors they serve (from the site)' },
  { key: 'header_tags', col: 'header_tags', type: 'strArr', hint: 'their main services / specialties as 3-6 short tags' },
  { key: 'languages', col: 'languages', type: 'strArr', hint: 'languages they operate in, ONLY if stated' },
  { key: 'linkedin', col: 'linkedin', type: 'url', hint: 'their LinkedIn company URL (from a link on the site)' },
  { key: 'twitter', col: 'twitter', type: 'url', hint: 'their Twitter / X URL (from a link on the site)' },
  { key: 'facebook', col: 'facebook', type: 'url', hint: 'their Facebook URL (from a link on the site)' },
  { key: 'awards', col: 'awards', type: 'awardArr', hint: 'awards/recognitions LISTED ON THE SITE, as [{name, year}]' },
  { key: 'clients_summary', col: 'clients_summary', type: 'text', hint: 'one sentence naming real clients IF the site names them' },
  { key: 'client_logos', col: 'client_logos', type: 'clientArr', hint: 'named clients WITH their website domain, as [{name, url}], only if the site names them' },
  { key: 'intro_video_url', col: 'intro_video_url', type: 'url', hint: 'a YouTube video URL the site embeds or links' },
]

function isEmpty(type: Spec['type'], v: unknown): boolean {
  if (type === 'strArr' || type === 'awardArr' || type === 'clientArr') {
    if (v == null || v === '' || v === '[]') return true
    if (Array.isArray(v)) return v.length === 0
    try { return !Array.isArray(JSON.parse(String(v))) || JSON.parse(String(v)).length === 0 } catch { return false }
  }
  if (type === 'int') return v == null || Number(v) === 0
  return v == null || String(v).trim() === ''
}

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#0?39;|&apos;/g, "'")
    .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

function grabLinks(html: string) {
  const g = (re: RegExp) => (html.match(re) || [])[0] || null
  return {
    linkedin: g(/https?:\/\/[\w.]*linkedin\.com\/company\/[\w\-./]+/i),
    twitter: g(/https?:\/\/(?:www\.)?(?:twitter|x)\.com\/[A-Za-z0-9_]+/i),
    facebook: g(/https?:\/\/(?:www\.)?facebook\.com\/[\w.\-/]+/i),
    youtube: g(/https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)[\w-]+|youtu\.be\/[\w-]+)/i),
  }
}

async function readSite(website: string): Promise<{ text: string; links: Record<string, string | null> }> {
  if (!website) return { text: '', links: {} }
  let base = website.trim()
  if (!/^https?:\/\//i.test(base)) base = 'https://' + base
  const urls = [base]
  try { const u = new URL(base); for (const p of ['/about', '/about-us', '/company']) urls.push(u.origin + p) } catch { /* ignore */ }
  let text = ''
  const links: Record<string, string | null> = {}
  for (const url of urls) {
    if (text.length > 9000) break
    try {
      const ctrl = new AbortController()
      const t = setTimeout(() => ctrl.abort(), 8000)
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; InfoWebWorldBot/1.0)' }, signal: ctrl.signal, redirect: 'follow' })
      clearTimeout(t)
      if (!res.ok) continue
      const html = await res.text()
      const l = grabLinks(html)
      for (const k of Object.keys(l)) if (!links[k] && (l as Record<string, string | null>)[k]) links[k] = (l as Record<string, string | null>)[k]
      text += '\n' + htmlToText(html)
    } catch { /* skip page */ }
  }
  return { text: text.slice(0, 12000), links }
}

function cleanJson(raw: string): string {
  return raw.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim()
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  try {
    const { id } = await params
    const isUuid = /^[0-9a-f]{8}-/i.test(id)
    const sub = await queryOne<Record<string, unknown>>(
      `SELECT * FROM submissions WHERE ${isUuid ? 'uuid' : 'id'} = ? LIMIT 1`,
      [id],
    )
    if (!sub) return Response.json({ error: 'Not found' }, { status: 404 })

    const website = String(sub.website || '')
    if (!website) return Response.json({ error: 'This listing has no website to read.' }, { status: 400 })

    /* Which fields are empty → those are the only ones we ask Gemini for. */
    const empties = SPECS.filter((s) => isEmpty(s.type, sub[s.col]))
    if (empties.length === 0) {
      return Response.json({ ok: true, filled: [], message: 'Nothing to fill — every field already has data.' })
    }

    const { text: siteText, links } = await readSite(website)
    if (siteText.replace(/\s/g, '').length < 200) {
      return Response.json({ ok: true, filled: [], message: "Couldn't read enough from the website to fill anything (site may be JS-only or blocked).", read: siteText.length }, { status: 200 })
    }

    /* Existing data we DO have, for grounding/context (don't re-ask for these). */
    const existing: Record<string, unknown> = {
      company_name: sub.company_name, category: sub.category_name ?? null,
      country: sub.country_name ?? null, website,
    }
    for (const s of SPECS) if (!isEmpty(s.type, sub[s.col])) existing[s.key] = sub[s.col]

    const schemaLines = empties.map((s) => `  "${s.key}": ${s.type === 'strArr' || s.type === 'awardArr' || s.type === 'clientArr' ? '[]' : 'null'}  // ${s.hint}`).join('\n')
    const linkHints = Object.entries(links).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n') || '(none found)'

    const system = `You are a precise data extractor for a business directory. You will be given a company's existing listing data and the TEXT of their official website. Fill ONLY the requested fields, using ONLY facts that the website text (or the existing listing data) explicitly supports. NEVER guess, infer beyond the text, or use outside knowledge. If a field is not clearly supported, return null (or [] for lists). Do NOT invent awards, clients, videos, founding years, team sizes, or anything else. Output ONE JSON object with EXACTLY the requested keys and nothing else.`

    const prompt = `COMPANY (existing listing data):
${JSON.stringify(existing, null, 2)}

LINKS FOUND ON THE SITE (use these for linkedin/twitter/facebook/intro_video_url only if they belong to this company):
${linkHints}

WEBSITE TEXT (the only source of truth — extract only what is here):
"""
${siteText}
"""

Return a JSON object with EXACTLY these keys (use null / [] when the website doesn't clearly support a value — do not fill it just to fill it):
{
${schemaLines}
}`

    const raw = await geminiChat({ system, prompt, json: true, temperature: 0.15, maxTokens: 2048 })
    let parsed: Record<string, unknown>
    try { parsed = JSON.parse(cleanJson(raw)) } catch { return Response.json({ error: 'AI returned unparseable output.' }, { status: 502 }) }

    const year = new Date().getFullYear()
    const sets: string[] = []
    const vals: unknown[] = []
    const filled: { field: string; value: string }[] = []

    const pushFilled = (s: Spec, dbVal: unknown, label: string) => {
      sets.push(`${s.col} = ?`); vals.push(dbVal); filled.push({ field: s.key, value: label })
    }

    for (const s of empties) {
      const v = parsed[s.key]
      if (v == null) continue
      if (s.type === 'text') {
        const t = String(v).trim()
        if (t) pushFilled(s, t, t.length > 60 ? t.slice(0, 57) + '…' : t)
      } else if (s.type === 'int') {
        const num = Math.trunc(Number(v))
        if (num >= 1800 && num <= year) pushFilled(s, num, String(num))
      } else if (s.type === 'enum') {
        const t = String(v).trim()
        if (ENUM_TEAM.includes(t)) pushFilled(s, t, t)
      } else if (s.type === 'url') {
        const t = String(v).trim()
        if (/^https?:\/\/\S+$/.test(t)) {
          if (s.key === 'intro_video_url' && !/youtube\.com|youtu\.be/i.test(t)) continue
          pushFilled(s, t, t.replace(/^https?:\/\//, '').slice(0, 40))
        }
      } else if (s.type === 'strArr') {
        const arr = Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean).slice(0, 8) : []
        if (arr.length) pushFilled(s, JSON.stringify(arr), arr.slice(0, 4).join(', '))
      } else if (s.type === 'awardArr') {
        const arr = Array.isArray(v)
          ? v.map((x) => (typeof x === 'string' ? { name: x.trim(), year: null } : { name: String((x as Record<string, unknown>)?.name || '').trim(), year: (x as Record<string, unknown>)?.year ?? null }))
              .filter((a) => a.name).slice(0, 10)
          : []
        if (arr.length) pushFilled(s, JSON.stringify(arr), `${arr.length} award${arr.length > 1 ? 's' : ''}`)
      } else if (s.type === 'clientArr') {
        const arr = Array.isArray(v)
          ? v.map((x) => {
              const o = (x || {}) as Record<string, unknown>
              const name = String(o.name || '').trim()
              let url = String(o.url || o.domain || '').trim()
              if (url && !/^https?:\/\//.test(url)) url = 'https://' + url.replace(/^www\./, '')
              return { name, url: url || null }
            }).filter((c) => c.name).slice(0, 12)
          : []
        if (arr.length) pushFilled(s, JSON.stringify(arr), `${arr.length} client${arr.length > 1 ? 's' : ''}`)
      }
    }

    if (!sets.length) {
      return Response.json({ ok: true, filled: [], message: 'Gemini read the site but found nothing verifiable to add — left as-is.' })
    }

    vals.push(sub.id)
    await execute(`UPDATE submissions SET ${sets.join(', ')}, updated_at = NOW() WHERE id = ?`, vals)

    return Response.json({ ok: true, filled, count: filled.length })
  } catch (err) {
    console.error('ai-enrich error:', err)
    return Response.json({ error: String(err instanceof Error ? err.message : err) }, { status: 500 })
  }
}
