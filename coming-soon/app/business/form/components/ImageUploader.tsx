'use client'
import { useState } from 'react'
import { uploadFile } from '../../../iww-hq/data/submissions-storage'
import { I } from '../icons'

type Props = {
  value: string[]
  onChange: (arr: string[]) => void
  maxItems: number
  type: 'logo' | 'screenshot'
}

/**
 * <label>-based uploader so the native file picker opens reliably on every browser.
 * The <input type="file"> lives inside the <label> — clicking anywhere on the slot
 * triggers the picker without needing a click handler.
 */
export default function ImageUploader({ value, onChange, maxItems, type }: Props) {
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
    <div className="lf2-uploader">
      <div className="lf2-uploader-grid">
        {value.map((url, i) => (
          <div key={i} className="lf2-upload-item">
            <img src={url} alt="" />
            <button type="button" className="lf2-upload-rm" onClick={() => remove(i)} aria-label="Remove">{I.x}</button>
          </div>
        ))}
        {value.length < maxItems && (
          <label className={`lf2-upload-slot${uploading ? ' lf2-upload-slot--busy' : ''}`}>
            <input
              type="file"
              accept="image/*"
              multiple={maxItems > 1}
              className="lf2-upload-input"
              onChange={e => { onFile(e.target.files); e.target.value = '' }}
              disabled={uploading}
            />
            {uploading ? (
              <span className="lf2-upload-spin">Uploading…</span>
            ) : (
              <>
                <span className="lf2-upload-icon">{I.upload}</span>
                <span className="lf2-upload-label">Click to upload</span>
                <span className="lf2-upload-hint">PNG, JPG, SVG · Max 5MB</span>
              </>
            )}
          </label>
        )}
      </div>
      {err && <div className="lf2-field-error">{err}</div>}
    </div>
  )
}
