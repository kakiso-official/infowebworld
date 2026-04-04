'use client'
import { useState, useEffect } from 'react'

type Category = { id: number; name: string; slug: string; level: number }
type StatusInfo = { total: number; generated: number; recent: Array<{ category_id: number; name: string; slug: string; generated_at: string }> }

export default function SeoContentAdmin() {
  const [categories, setCategories] = useState<Category[]>([])
  const [status, setStatus] = useState<StatusInfo | null>(null)
  const [generating, setGenerating] = useState<number | null>(null)
  const [batchRunning, setBatchRunning] = useState(false)
  const [batchProgress, setBatchProgress] = useState('')
  const [log, setLog] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => {
      const cats = (d.data || []).filter((c: any) => Number(c.level) >= 2)
      setCategories(cats.map((c: any) => ({ id: Number(c.id), name: String(c.name), slug: String(c.slug), level: Number(c.level) })))
    })
    refreshStatus()
  }, [])

  const refreshStatus = () => {
    fetch('/api/admin/generate-seo-content').then(r => r.json()).then(setStatus)
  }

  const generateOne = async (catId: number, catName: string) => {
    setGenerating(catId)
    setLog(l => [...l, `Generating for ${catName}...`])
    try {
      const res = await fetch('/api/admin/generate-seo-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: catId }),
      })
      const data = await res.json()
      if (data.ok) {
        setLog(l => [...l, `✓ ${catName} — done`])
      } else {
        setLog(l => [...l, `✗ ${catName} — ${data.error}`])
      }
    } catch (err) {
      setLog(l => [...l, `✗ ${catName} — ${err}`])
    }
    setGenerating(null)
    refreshStatus()
  }

  const generateAll = async () => {
    setBatchRunning(true)
    setLog([`Starting batch generation for ${categories.length} categories...`])
    setBatchProgress(`0 / ${categories.length}`)

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i]
      setBatchProgress(`${i + 1} / ${categories.length}`)
      setLog(l => [...l, `[${i + 1}/${categories.length}] Generating ${cat.name}...`])
      try {
        const res = await fetch('/api/admin/generate-seo-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categoryId: cat.id }),
        })
        const data = await res.json()
        setLog(l => [...l, data.ok ? `  ✓ Done` : `  ✗ Error: ${data.error}`])
      } catch (err) {
        setLog(l => [...l, `  ✗ Error: ${err}`])
      }
    }

    setBatchRunning(false)
    setLog(l => [...l, `\nBatch complete!`])
    refreshStatus()
  }

  const s: React.CSSProperties = { fontFamily: 'var(--font-nunito), sans-serif' }
  const card: React.CSSProperties = { background: '#fff', border: '1.5px solid var(--h-border)', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '.75rem' }
  const btn: React.CSSProperties = { padding: '.4rem .85rem', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: '.78rem', fontFamily: 'inherit' }

  return (
    <div style={{ ...s, maxWidth: 900, margin: '0 auto', padding: '1.5rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '.5rem' }}>SEO Content Generator</h1>
      <p style={{ color: '#555', fontSize: '.85rem', marginBottom: '1.5rem' }}>Generate unique Gemini-powered SEO content for all L2/L3 category pages.</p>

      {/* Status */}
      <div style={card}>
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '.5rem' }}>
          <div><strong style={{ fontSize: '1.5rem', color: 'var(--h-accent)' }}>{status?.generated || 0}</strong><div style={{ fontSize: '.72rem', color: '#888' }}>Generated</div></div>
          <div><strong style={{ fontSize: '1.5rem' }}>{status?.total || 0}</strong><div style={{ fontSize: '.72rem', color: '#888' }}>Total L2/L3</div></div>
          <div><strong style={{ fontSize: '1.5rem', color: '#2FAE6A' }}>{status ? Math.round((status.generated / (status.total || 1)) * 100) : 0}%</strong><div style={{ fontSize: '.72rem', color: '#888' }}>Complete</div></div>
        </div>
        <button
          onClick={generateAll}
          disabled={batchRunning}
          style={{ ...btn, background: batchRunning ? '#ccc' : 'var(--h-accent)', color: '#fff', padding: '.55rem 1.25rem', fontSize: '.85rem' }}
        >
          {batchRunning ? `Generating ${batchProgress}...` : 'Generate All Categories'}
        </button>
      </div>

      {/* Log */}
      {log.length > 0 && (
        <div style={{ ...card, background: '#1a1a1a', color: '#eee', fontFamily: 'monospace', fontSize: '.75rem', maxHeight: 200, overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
          {log.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      )}

      {/* Category List */}
      <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: '1.5rem 0 .75rem' }}>Categories ({categories.length})</h2>
      <div>
        {categories.map(cat => {
          const hasContent = status?.recent?.some(r => r.category_id === cat.id)
          return (
            <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.5rem .75rem', borderBottom: '1px solid var(--h-border-light)' }}>
              <span style={{ width: 32, height: 20, borderRadius: 4, fontSize: '.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', background: cat.level === 2 ? '#3B82F620' : '#8B5CF620', color: cat.level === 2 ? '#3B82F6' : '#8B5CF6' }}>
                L{cat.level}
              </span>
              <span style={{ flex: 1, fontSize: '.82rem', fontWeight: 600 }}>{cat.name}</span>
              {hasContent && <span style={{ fontSize: '.65rem', color: '#2FAE6A', fontWeight: 700 }}>✓ Generated</span>}
              <button
                onClick={() => generateOne(cat.id, cat.name)}
                disabled={generating === cat.id || batchRunning}
                style={{ ...btn, background: generating === cat.id ? '#ccc' : '#f5f2ef', color: '#000' }}
              >
                {generating === cat.id ? 'Generating...' : hasContent ? 'Regenerate' : 'Generate'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
