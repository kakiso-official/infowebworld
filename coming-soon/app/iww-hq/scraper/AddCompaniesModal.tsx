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

  const parseLines = () => {
    const out: {
      slug: string
      company_name: string
      website: string
      category_l1: string
      category_slug?: string
    }[] = []
    for (const rawLine of text.split(/\r?\n/)) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) continue
      const cells = line.split(',').map(c => c.trim())
      // skip header
      if (cells[0]?.toLowerCase() === 'slug' && cells[2]?.toLowerCase() === 'website') continue
      const [slug, company_name, website, category_l1, category_slug] = cells
      if (!website) continue
      out.push({
        slug: slug || '',
        company_name: company_name || '',
        website,
        category_l1: category_l1 || '',
        category_slug: category_slug || undefined,
      })
    }
    return out
  }

  const submit = async () => {
    setError(null); setResult(null); setBusy(true)
    try {
      const companies = parseLines()
      if (!companies.length) {
        setError('No valid lines parsed. Each line: slug, name, website, category_l1, category_slug')
        return
      }
      const res = await fetch('/api/admin/scrape/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companies }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error || `HTTP ${res.status}`)
      setResult({ inserted: json.inserted, duplicates: json.duplicates, errors: json.errors })
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
