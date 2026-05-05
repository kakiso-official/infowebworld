'use client'
import { useState } from 'react'
import { uploadFile } from '../../../../iww-hq/data/submissions-storage'

type Props = {
  value: string[]
  onChange: (arr: string[]) => void
  maxItems: number
  type: 'logo' | 'screenshot'
  /** Single-image variant (logo) shows a single 96x96 tile instead of a grid. */
  variant?: 'grid' | 'single'
}

/**
 * Image uploader. Solid 1.5px border (no dashed glow). Calls /api/upload via the
 * existing uploadFile helper. Handles multi-file selection up to maxItems.
 */
export default function Uploader({ value, onChange, maxItems, type, variant = 'grid' }: Props) {
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState('')

  const onFile = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setErr(''); setUploading(true)
    try {
      const added: string[] = []
      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) { setErr('Max 5MB per file'); continue }
        if (!/^image\//.test(file.type)) { setErr('Images only'); continue }
        if (value.length + added.length >= maxItems) break
        const url = await uploadFile(file, type)
        added.push(url)
      }
      if (added.length) onChange([...value, ...added].slice(0, maxItems))
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }
  const remove = (i: number) => onChange(value.filter((_, j) => j !== i))

  return (
    <div className={'df-up ' + (variant === 'single' ? 'df-up--single' : 'df-up--grid')}>
      <div className="df-up-grid">
        {value.map((url, i) => (
          <div key={url + i} className="df-up-tile">
            <img src={url} alt={`${type} ${i + 1}`} />
            <button type="button" className="df-up-rm" onClick={() => remove(i)} aria-label="Remove">
              <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}
        {value.length < maxItems && (
          <label className={'df-up-slot' + (uploading ? ' df-up-slot--busy' : '')}>
            <input
              type="file"
              accept="image/*"
              multiple={maxItems > 1}
              className="df-up-input"
              onChange={e => { onFile(e.target.files); e.target.value = '' }}
              disabled={uploading}
            />
            {uploading ? (
              <span className="df-up-spin">Uploading…</span>
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="22" height="22" className="df-up-ico" aria-hidden="true">
                  <path d="M12 16V4M6 10l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 18v2a2 2 0 002 2h12a2 2 0 002-2v-2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <span className="df-up-label">{variant === 'single' ? 'Upload logo' : 'Upload image'}</span>
                <span className="df-up-hint">PNG · JPG · SVG · 5MB</span>
              </>
            )}
          </label>
        )}
      </div>
      {err && <div className="df-err">{err}</div>}
    </div>
  )
}
