'use client'

/**
 * Add Companies modal — paste a CSV-like list into the textarea and the
 * server creates scrape_jobs at status='queued'. The worker picks them
 * up automatically.
 *
 * Format (one per line, comma-separated):
 *   slug, company_name, website, category_l1, category_slug
 *
 * Examples:
 *   cursor,Cursor,https://cursor.com,ai-and-ml,ai-coding-assistant
 *   linear,Linear,https://linear.app,software-and-saas,project-management-software
 *
 * Lines starting with `#` are ignored. Headers (the literal `slug,name…`
 * line) are auto-skipped if detected. Existing slugs are returned in the
 * `duplicates` list — not an error.
 */

import { useState } from 'react'

interface Result {
  inserted: string[]
  duplicates: string[]
  errors: { website: string; error: string }[]
}

const PLACEHOLDER = `# One company per line:
# slug, company_name, website, category_l1, category_slug
cursor, Cursor, https://cursor.com, ai-and-ml, ai-coding-assistant
linear, Linear, https://linear.app, software-and-saas, project-management-software`

export default function AddCompaniesModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)

  const parseLines = (): {
    rows: {
      slug: string
      company_name: string
      website: string
      category_l1: string
      category_slug?: string
    }[]
    issues: string[]
  } => {
    const rows: {
      slug: string
      company_name: string
      website: string
      category_l1: string
      category_slug?: string
    }[] = []
    const issues: string[] = []
    /* Dedup at parse time so the user sees the warning in the modal
       instead of having half the entries silently dropped by the unique
       index on scrape_jobs.slug or canonicalUrl(scrape_jobs.website). */
    const seenWebsites = new Set<string>()
    const seenSlugs = new Set<string>()

    for (const [idx, rawLine] of text.split(/\r?\n/).entries()) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) continue
      const cells = line.split(',').map(c => c.trim())
      if (cells[0]?.toLowerCase() === 'slug' && cells[2]?.toLowerCase() === 'website') continue
      const [slug, company_name, rawWebsite, category_l1, category_slug] = cells
      if (!rawWebsite) continue

      /* Auto-prepend https:// for naked domains so users can paste
         "cursor.com" and have it work; reject anything that doesn't
         parse as a real URL so we don't queue garbage like "example". */
      let website = rawWebsite
      if (!/^https?:\/\//i.test(website)) website = `https://${website}`
      try {
        const u = new URL(website)
        if (!u.hostname.includes('.')) throw new Error('no dot')
      } catch {
        issues.push(`line ${idx + 1}: invalid URL "${rawWebsite}"`)
        continue
      }

      const websiteKey = website.toLowerCase().replace(/\/+$/, '')
      if (seenWebsites.has(websiteKey)) {
        issues.push(`line ${idx + 1}: duplicate website "${rawWebsite}" (already in this paste)`)
        continue
      }
      seenWebsites.add(websiteKey)

      if (slug) {
        const slugKey = slug.toLowerCase()
        if (seenSlugs.has(slugKey)) {
          issues.push(`line ${idx + 1}: duplicate slug "${slug}" (already in this paste)`)
          continue
        }
        seenSlugs.add(slugKey)
      }

      rows.push({
        slug: slug || '',
        company_name: company_name || '',
        website,
        category_l1: category_l1 || '',
        category_slug: category_slug || undefined,
      })
    }
    return { rows, issues }
  }

  const submit = async () => {
    setError(null); setResult(null); setBusy(true)
    try {
      const { rows: companies, issues } = parseLines()
      if (!companies.length) {
        const detail = issues.length
          ? `No valid lines after validation. Issues:\n  • ${issues.slice(0, 5).join('\n  • ')}`
          : 'No valid lines parsed. Each line: slug, name, website, category_l1, category_slug'
        setError(detail)
        return
      }
      if (issues.length) {
        /* Soft-warn but still submit the valid rows — the inverse
           (refuse to submit if any issue) punishes the user for typos
           in line 50 by also dropping the valid line 49. */
        console.warn(`[add-companies] ${issues.length} line(s) skipped:\n  - ${issues.join('\n  - ')}`)
      }
      const res = await fetch('/api/admin/scrape/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companies }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error || `HTTP ${res.status}`)
      const extraErrors = issues.map(msg => ({ website: '(local)', error: msg }))
      setResult({
        inserted: json.inserted,
        duplicates: json.duplicates,
        errors: [...(json.errors || []), ...extraErrors],
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="scrp-modal-backdrop" onClick={onClose}>
      <div className="scrp-modal" role="dialog" aria-label="Add companies" onClick={e => e.stopPropagation()}>
        <header className="scrp-modal-head">
          <h2>Add Companies</h2>
          <button type="button" className="scrp-modal-close" onClick={onClose} aria-label="Close">×</button>
        </header>

        <div className="scrp-modal-body">
          <p className="scrp-modal-help">
            Paste one company per line. Format:&nbsp;
            <code>slug, company_name, website, category_l1, category_slug</code>
          </p>
          <textarea
            className="scrp-modal-textarea"
            placeholder={PLACEHOLDER}
            value={text}
            onChange={e => setText(e.target.value)}
            rows={12}
          />
          {error && <div className="scrp-error">{error}</div>}
          {result && (
            <div className="scrp-modal-result">
              <div><strong>{result.inserted.length}</strong> added to queue</div>
              {result.duplicates.length > 0 && (
                <div><strong>{result.duplicates.length}</strong> already existed (skipped): {result.duplicates.slice(0, 6).join(', ')}{result.duplicates.length > 6 ? '…' : ''}</div>
              )}
              {result.errors.length > 0 && (
                <div className="scrp-error">{result.errors.length} errors: {result.errors.slice(0, 3).map(e => `${e.website} (${e.error})`).join(' · ')}</div>
              )}
            </div>
          )}
        </div>

        <footer className="scrp-modal-foot">
          <button type="button" className="scrp-btn" onClick={onClose}>
            {result ? 'Close' : 'Cancel'}
          </button>
          {!result && (
            <button type="button" className="scrp-btn scrp-btn--primary" onClick={submit} disabled={busy || !text.trim()}>
              {busy ? 'Adding…' : 'Add to queue'}
            </button>
          )}
          {result && (
            <button type="button" className="scrp-btn scrp-btn--primary" onClick={() => { onAdded() }}>
              Done — refresh queue
            </button>
          )}
        </footer>
      </div>
    </div>
  )
}
