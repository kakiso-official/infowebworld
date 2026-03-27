'use client'
import { useState, useEffect, useMemo } from 'react'
import { fetchAllSubmissions, updateSubmissionStatus, deleteSubmission, fetchSubmissionStats, type RealSubmission, type FaqItem } from '../data/submissions-storage'

const statusColors: Record<string, string> = { paid: '#2FAE6A', confirmed: '#3B82F6', pending: '#F59E0B', rejected: '#EF4444', active: '#14B8A6', suspended: '#9CA3AF' }
const Pill = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <span style={{ fontSize: '.56rem', fontWeight: 700, padding: '.15rem .5rem', borderRadius: 999, background: `${color}15`, color, textTransform: 'capitalize' }}>{children}</span>
)

/* ── Detail Modal ── */
function DetailModal({ sub, onClose, onStatusChange, onFaqSave }: { sub: RealSubmission; onClose: () => void; onStatusChange: (id: string, s: RealSubmission['status']) => void; onFaqSave: (id: string, faqs: FaqItem[]) => void }) {
  const [editingFaqs, setEditingFaqs] = useState(false)
  const [faqs, setFaqs] = useState<FaqItem[]>(sub.faqs.length > 0 ? sub.faqs : [{ question: '', answer: '' }])
  const updateFaqField = (idx: number, field: keyof FaqItem, val: string) => {
    const next = [...faqs]; next[idx] = { ...next[idx], [field]: val }; setFaqs(next)
  }
  const addFaqRow = () => { if (faqs.length < 8) setFaqs([...faqs, { question: '', answer: '' }]) }
  const removeFaqRow = (idx: number) => { if (faqs.length > 1) setFaqs(faqs.filter((_, i) => i !== idx)) }
  const saveFaqs = () => { onFaqSave(sub.id, faqs.filter(f => f.question.trim() && f.answer.trim())); setEditingFaqs(false) }
  const lbl: React.CSSProperties = { fontSize: '.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--h-muted)', marginBottom: '.15rem' }
  const val: React.CSSProperties = { fontSize: '.82rem', fontWeight: 500, color: 'var(--h-heading)', wordBreak: 'break-word' }
  const Field = ({ label, value }: { label: string; value: string }) => value ? (
    <div style={{ padding: '.6rem 0', borderBottom: '1px solid var(--h-border-light)' }}>
      <div style={lbl}>{label}</div>
      <div style={val}>{value}</div>
    </div>
  ) : null

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 100, backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: 520, maxHeight: '85vh', overflowY: 'auto', background: '#fff', borderRadius: 24, border: '1.5px solid var(--h-border)', zIndex: 101, padding: 0 }}>
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1.5px solid var(--h-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', borderRadius: '24px 24px 0 0', zIndex: 1 }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, fontFamily: "var(--font-bricolage), 'Bricolage Grotesque', sans-serif", color: 'var(--h-heading)', marginBottom: '.15rem' }}>{sub.companyName}</h3>
            <div style={{ display: 'flex', gap: '.35rem', alignItems: 'center' }}>
              <Pill color={statusColors[sub.status]}>{sub.status}</Pill>
              <span style={{ fontSize: '.58rem', color: 'var(--h-muted)' }}>{sub.id}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 999, border: '1.5px solid var(--h-border)', background: '#fff', cursor: 'pointer', fontSize: '.8rem', fontWeight: 700, color: 'var(--h-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>X</button>
        </div>

        {/* Body */}
        <div style={{ padding: '1rem 1.5rem' }}>
          {/* Business Info Section */}
          <div style={{ fontSize: '.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--h-accent)', marginBottom: '.25rem', marginTop: '.5rem' }}>Business Information</div>
          <Field label="Company / Business Name" value={sub.companyName} />
          <Field label="Contact Person" value={sub.contactName} />
          <Field label="Business Email" value={sub.email} />
          <Field label="Phone Number" value={sub.phone ? `${sub.phoneCode} ${sub.phone}` : ''} />
          <Field label="Website URL" value={sub.website} />

          {/* Details Section */}
          <div style={{ fontSize: '.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--h-accent)', marginBottom: '.25rem', marginTop: '1.25rem' }}>Listing Details</div>
          <Field label="Category" value={sub.category} />
          <Field label="Country" value={sub.country} />
          <Field label="State / Province" value={sub.state} />
          <Field label="City" value={sub.city} />
          <Field label="Tagline" value={sub.tagline} />
          <Field label="Description" value={sub.description} />
          <Field label="Slug (URL)" value={sub.slug} />
          <Field label="Year Founded" value={sub.founded} />
          <Field label="Team Size" value={sub.employees} />
          <Field label="Funding" value={sub.funding} />
          <Field label="HQ Location" value={sub.hqLocation} />

          {/* Media Section */}
          <div style={{ fontSize: '.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--h-accent)', marginBottom: '.25rem', marginTop: '1.25rem' }}>Media</div>
          {sub.logoUrl && (
            <div style={{ padding: '.6rem 0', borderBottom: '1px solid var(--h-border-light)' }}>
              <div style={lbl}>Logo</div>
              <img src={sub.logoUrl} alt="Logo" style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover', border: '1px solid var(--h-border)' }} />
            </div>
          )}
          {sub.screenshots.length > 0 && (
            <div style={{ padding: '.6rem 0', borderBottom: '1px solid var(--h-border-light)' }}>
              <div style={lbl}>Screenshots ({sub.screenshots.length})</div>
              <div style={{ display: 'flex', gap: '.35rem', flexWrap: 'wrap', marginTop: '.3rem' }}>
                {sub.screenshots.map((s, i) => (
                  <img key={i} src={s} alt={`Screenshot ${i + 1}`} style={{ width: 80, height: 50, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--h-border)' }} />
                ))}
              </div>
            </div>
          )}
          <Field label="Demo Video" value={sub.demoVideo} />

          {/* Product Section */}
          <div style={{ fontSize: '.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--h-accent)', marginBottom: '.25rem', marginTop: '1.25rem' }}>Product Details</div>
          {sub.features.length > 0 && (
            <div style={{ padding: '.6rem 0', borderBottom: '1px solid var(--h-border-light)' }}>
              <div style={lbl}>Features ({sub.features.length})</div>
              <ul style={{ paddingLeft: '1rem', margin: '.3rem 0 0' }}>
                {sub.features.map((f, i) => <li key={i} style={{ fontSize: '.75rem', color: 'var(--h-heading)', marginBottom: '.15rem' }}>{f}</li>)}
              </ul>
            </div>
          )}
          {sub.integrations.length > 0 && (
            <div style={{ padding: '.6rem 0', borderBottom: '1px solid var(--h-border-light)' }}>
              <div style={lbl}>Integrations</div>
              <div style={{ display: 'flex', gap: '.25rem', flexWrap: 'wrap', marginTop: '.3rem' }}>
                {sub.integrations.map((t, i) => (
                  <span key={i} style={{ fontSize: '.55rem', fontWeight: 700, padding: '.15rem .45rem', borderRadius: 999, background: 'var(--h-bg)', color: 'var(--h-body)', border: '1px solid var(--h-border-light)' }}>{t}</span>
                ))}
              </div>
            </div>
          )}
          <Field label="Pricing Model" value={sub.pricingModel} />
          {sub.pricingTiers.length > 0 && (
            <div style={{ padding: '.6rem 0', borderBottom: '1px solid var(--h-border-light)' }}>
              <div style={lbl}>Pricing Tiers</div>
              {sub.pricingTiers.map((t, i) => (
                <div key={i} style={{ fontSize: '.75rem', color: 'var(--h-heading)', marginTop: '.2rem' }}>
                  <strong>{t.name}</strong>: ${t.price} {t.period}
                </div>
              ))}
            </div>
          )}

          {/* Social Links */}
          <div style={{ fontSize: '.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--h-accent)', marginBottom: '.25rem', marginTop: '1.25rem' }}>Social Links</div>
          <Field label="LinkedIn" value={sub.linkedin} />
          <Field label="Twitter / X" value={sub.twitter} />
          <Field label="Facebook" value={sub.facebook} />

          {/* FAQ Section */}
          <div style={{ fontSize: '.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--h-accent)', marginBottom: '.25rem', marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>FAQs ({sub.faqs.length})</span>
            <button onClick={() => setEditingFaqs(!editingFaqs)} style={{ fontSize: '.55rem', fontWeight: 700, padding: '.15rem .5rem', borderRadius: 999, border: '1.5px solid var(--h-accent)', background: editingFaqs ? 'var(--h-accent)' : 'transparent', color: editingFaqs ? '#fff' : 'var(--h-accent)', cursor: 'pointer', fontFamily: 'var(--font-nunito)' }}>
              {editingFaqs ? 'Cancel' : 'Edit FAQs'}
            </button>
          </div>
          {!editingFaqs ? (
            sub.faqs.length > 0 ? sub.faqs.map((faq, i) => (
              <div key={i} style={{ padding: '.5rem 0', borderBottom: '1px solid var(--h-border-light)' }}>
                <div style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--h-heading)', marginBottom: '.1rem' }}>Q: {faq.question}</div>
                <div style={{ fontSize: '.7rem', color: 'var(--h-body)', lineHeight: 1.5 }}>A: {faq.answer}</div>
              </div>
            )) : <div style={{ padding: '.5rem 0', fontSize: '.72rem', color: 'var(--h-muted)' }}>No FAQs added yet. Click &ldquo;Edit FAQs&rdquo; to add.</div>
          ) : (
            <div style={{ padding: '.5rem 0' }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ background: 'var(--h-bg)', borderRadius: 12, padding: '.6rem', marginBottom: '.5rem', border: '1px solid var(--h-border-light)', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.35rem' }}>
                    <span style={{ fontSize: '.55rem', fontWeight: 700, color: 'var(--h-accent)', textTransform: 'uppercase' }}>Q&A {i + 1}</span>
                    {faqs.length > 1 && <button onClick={() => removeFaqRow(i)} style={{ fontSize: '.55rem', fontWeight: 700, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Remove</button>}
                  </div>
                  <input type="text" placeholder="Question..." value={faq.question} onChange={e => updateFaqField(i, 'question', e.target.value)}
                    style={{ width: '100%', padding: '.4rem .6rem', borderRadius: 8, border: '1.5px solid var(--h-border)', fontSize: '.72rem', fontFamily: 'var(--font-nunito)', marginBottom: '.35rem', outline: 'none', boxSizing: 'border-box' }} />
                  <textarea placeholder="Answer..." value={faq.answer} onChange={e => updateFaqField(i, 'answer', e.target.value)} rows={2}
                    style={{ width: '100%', padding: '.4rem .6rem', borderRadius: 8, border: '1.5px solid var(--h-border)', fontSize: '.72rem', fontFamily: 'var(--font-nunito)', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: '.4rem' }}>
                {faqs.length < 8 && <button onClick={addFaqRow} style={{ fontSize: '.6rem', fontWeight: 700, padding: '.25rem .6rem', borderRadius: 999, border: '1.5px dashed var(--h-border)', background: 'transparent', cursor: 'pointer', color: 'var(--h-accent)', fontFamily: 'var(--font-nunito)' }}>+ Add Q&A</button>}
                <button onClick={saveFaqs} style={{ fontSize: '.6rem', fontWeight: 700, padding: '.25rem .6rem', borderRadius: 999, border: '1.5px solid #2FAE6A', background: '#2FAE6A', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-nunito)' }}>Save FAQs</button>
              </div>
            </div>
          )}

          {/* Plan + Meta Section */}
          <div style={{ fontSize: '.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--h-accent)', marginBottom: '.25rem', marginTop: '1.25rem' }}>Plan & Status</div>
          <Field label="Selected Plan" value={sub.plan === 'founding' ? 'Founding Company — $239 Lifetime' : sub.plan === 'early-adopter' ? 'Early Adopter — $99/yr' : 'Standard — $239/yr'} />
          <Field label="Current Status" value={sub.status} />
          <Field label="Submitted At" value={new Date(sub.submittedAt).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })} />
          {sub.approvedAt && <Field label="Approved At" value={new Date(sub.approvedAt).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })} />}
        </div>

        {/* Actions */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1.5px solid var(--h-border)', display: 'flex', gap: '.4rem', flexWrap: 'wrap', position: 'sticky', bottom: 0, background: '#fff', borderRadius: '0 0 24px 24px' }}>
          <span style={{ fontSize: '.65rem', fontWeight: 700, color: 'var(--h-muted)', alignSelf: 'center', marginRight: '.25rem' }}>Set status:</span>
          {(['pending', 'confirmed', 'paid', 'active', 'rejected'] as const).map(s => (
            <button key={s} onClick={() => onStatusChange(sub.id, s)}
              style={{ padding: '.3rem .65rem', borderRadius: 999, fontSize: '.58rem', fontWeight: 700, cursor: 'pointer', border: sub.status === s ? `2px solid ${statusColors[s]}` : '1.5px solid var(--h-border)', background: sub.status === s ? `${statusColors[s]}15` : '#fff', color: sub.status === s ? statusColors[s] : 'var(--h-body)', fontFamily: "var(--font-nunito)", transition: 'all .2s', textTransform: 'capitalize' }}>
              {s}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

/* ── Main Page ── */
export default function Submissions() {
  const [subs, setSubs] = useState<RealSubmission[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [detail, setDetail] = useState<RealSubmission | null>(null)
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, paid: 0 })

  const reload = async () => {
    const [s, st] = await Promise.all([fetchAllSubmissions(), fetchSubmissionStats()])
    setSubs(s); setStats(st)
  }
  useEffect(() => { reload() }, [])

  const filtered = useMemo(() => subs.filter(s => {
    const q = search.toLowerCase()
    const matchQ = !q || s.companyName.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.contactName.toLowerCase().includes(q)
    const matchF = filter === 'all' || s.status === filter
    return matchQ && matchF
  }), [subs, search, filter])

  const handleStatusChange = async (id: string, status: RealSubmission['status']) => {
    await updateSubmissionStatus(id, status)
    await reload()
    if (detail?.id === id) setDetail({ ...detail, status })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this submission permanently?')) return
    await deleteSubmission(id); await reload(); if (detail?.id === id) setDetail(null)
  }

  const exportCSV = () => {
    const headers = 'ID,Company,Contact,Email,Phone,Website,Category,Country,City,Tagline,Description,Founded,TeamSize,Plan,Status,Date\n'
    const rows = filtered.map(s => `${s.id},"${s.companyName}","${s.contactName}",${s.email},"${s.phoneCode} ${s.phone}","${s.website}","${s.category}",${s.country},"${s.city}","${s.tagline}","${(s.description || '').replace(/"/g, '""')}",${s.founded},${s.employees},${s.plan},${s.status},${s.submittedAt}`).join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'submissions.csv'; a.click()
  }

  const btnBase: React.CSSProperties = { padding: '.4rem .85rem', borderRadius: 999, fontSize: '.65rem', fontWeight: 700, cursor: 'pointer', border: '1.5px solid var(--h-border)', transition: 'all .25s', fontFamily: "var(--font-nunito), 'Nunito', sans-serif" }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Detail Modal */}
      {detail && <DetailModal sub={detail} onClose={() => setDetail(null)} onStatusChange={handleStatusChange} onFaqSave={async (id, faqs) => {
        await fetch(`/api/submissions/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ faqs }) }).catch(() => {})
        await reload()
        if (detail?.id === id) setDetail({ ...detail, faqs })
      }} />}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '.65rem', marginBottom: '.85rem' }}>
        {[
          { l: 'Total', v: stats.total, c: '#E8553D' },
          { l: 'Pending', v: stats.pending, c: '#F59E0B' },
          { l: 'Confirmed', v: stats.confirmed, c: '#3B82F6' },
          { l: 'Paid', v: stats.paid, c: '#2FAE6A' },
        ].map(s => (
          <div key={s.l} style={{ background: '#fff', borderRadius: 20, border: '1.5px solid var(--h-border)', padding: '.85rem 1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.c }} />
            <p style={{ fontSize: '.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--h-muted)', marginBottom: '.2rem' }}>{s.l}</p>
            <p style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: "var(--font-nunito)", color: 'var(--h-heading)', lineHeight: 1 }}>{s.v}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.65rem', alignItems: 'center', marginBottom: '.85rem' }}>
        <input type="text" placeholder="Search company, email, category, contact..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, height: 40, padding: '0 .85rem', borderRadius: 14, border: '1.5px solid var(--h-border)', background: '#fff', fontSize: '.8rem', color: 'var(--h-heading)', outline: 'none', fontFamily: "var(--font-nunito)" }} />
        <div style={{ display: 'flex', gap: '.35rem' }}>
          {['all', 'pending', 'confirmed', 'paid', 'rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ ...btnBase, background: filter === f ? '#E8553D' : '#fff', color: filter === f ? '#fff' : 'var(--h-muted)', borderColor: filter === f ? '#E8553D' : 'var(--h-border)', textTransform: 'capitalize' }}>{f}</button>
          ))}
        </div>
        <button onClick={exportCSV} style={{ ...btnBase, background: '#fff', color: 'var(--h-heading)' }}>Export CSV</button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid var(--h-border)', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--h-muted)', fontSize: '.85rem' }}>
            {subs.length === 0 ? 'No submissions yet. They will appear here when users submit the Get Listed form.' : 'No submissions match your filter.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 750 }}>
              <thead>
                <tr>
                  {['#', 'Company', 'Category', 'Country', 'Plan', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', fontSize: '.56rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--h-muted)', padding: '.7rem 1rem', borderBottom: '1.5px solid var(--h-border)', background: 'var(--h-bg)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(sub => (
                  <tr key={sub.id} style={{ borderBottom: '1px solid var(--h-border-light)', transition: 'background .15s' }}>
                    <td style={{ padding: '.65rem 1rem', fontSize: '.62rem', fontWeight: 700, color: 'var(--h-muted)' }}>{sub.id}</td>
                    <td style={{ padding: '.65rem 1rem' }}>
                      <span style={{ display: 'block', fontSize: '.78rem', fontWeight: 700, color: 'var(--h-heading)' }}>{sub.companyName}</span>
                      <span style={{ fontSize: '.58rem', color: 'var(--h-muted)' }}>{sub.contactName} &middot; {sub.email}</span>
                    </td>
                    <td style={{ padding: '.65rem 1rem', fontSize: '.7rem', fontWeight: 600, color: 'var(--h-body)' }}>{sub.category}</td>
                    <td style={{ padding: '.65rem 1rem', fontSize: '.7rem', color: 'var(--h-body)' }}>{sub.city ? `${sub.city}, ` : ''}{sub.country}</td>
                    <td style={{ padding: '.65rem 1rem' }}><Pill color="#E8553D">{sub.plan === 'founding' ? 'Founding' : sub.plan === 'early-adopter' ? 'Early Adopter' : 'Standard'}</Pill></td>
                    <td style={{ padding: '.65rem 1rem' }}><Pill color={statusColors[sub.status]}>{sub.status}</Pill></td>
                    <td style={{ padding: '.65rem 1rem', fontSize: '.68rem', color: 'var(--h-muted)' }}>{sub.submittedAt.slice(0, 10)}</td>
                    <td style={{ padding: '.65rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '.3rem' }}>
                        <button onClick={() => setDetail(sub)} style={{ padding: '.2rem .55rem', borderRadius: 999, fontSize: '.55rem', fontWeight: 700, cursor: 'pointer', border: '1.5px solid var(--h-accent)', background: 'rgba(232,85,61,.04)', color: 'var(--h-accent)', fontFamily: "var(--font-nunito)", transition: 'all .2s' }}>Detail</button>
                        <button onClick={() => handleDelete(sub.id)} style={{ padding: '.2rem .55rem', borderRadius: 999, fontSize: '.55rem', fontWeight: 700, cursor: 'pointer', border: '1.5px solid rgba(239,68,68,.2)', background: '#fff', color: '#EF4444', fontFamily: "var(--font-nunito)", transition: 'all .2s' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ padding: '.75rem 1rem', fontSize: '.62rem', fontWeight: 600, color: 'var(--h-muted)', borderTop: '1px solid var(--h-border-light)' }}>
          Showing {filtered.length} of {subs.length} submissions
        </div>
      </div>
    </div>
  )
}
