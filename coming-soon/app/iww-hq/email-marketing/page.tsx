'use client'
import { useState, useEffect, type CSSProperties } from 'react'
import { EMAIL_PRESETS } from './presets'

/* Admin → Email Marketing. Compose + send broadcasts to signed-up users /
   waitlist, manage reusable templates, and review send history. Sends through
   the shared SMTP transport (lib/email) via /api/admin/email-campaigns/send. */

type Template = { id: number; name: string; subject: string; body_html: string; updated_at: string }
type Campaign = { id: number; subject: string; audience: string; recipient_count: number; sent_count: number; failed_count: number; status: string; created_at: string }
type Counts = { all_users: number; verified_users: number; waitlist: number }

const AUDIENCES: { key: keyof Counts; label: string }[] = [
  { key: 'all_users', label: 'All signed-up users' },
  { key: 'verified_users', label: 'Verified-email users' },
  { key: 'waitlist', label: 'Waitlist subscribers' },
]

const STARTER = `<style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');</style>
<div style="font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
  <h1 style="font-size:22px;margin:0 0 12px">Hi {{name}},</h1>
  <p style="font-size:15px;line-height:1.6;color:#444">
    Write your message here. Use <strong>{{name}}</strong> and <strong>{{email}}</strong> to personalize.
  </p>
  <p style="margin:24px 0">
    <a href="https://www.infowebworld.com" style="background:#E8553D;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:700">Visit InfoWebWorld</a>
  </p>
  <hr style="border:none;border-top:1px solid #eee;margin:28px 0">
  <p style="font-size:12px;color:#999;line-height:1.5">
    InfoWebWorld &middot; Brain Stream Australia Pty Ltd, Parramatta, NSW 2150, Australia<br>
    You're receiving this because you signed up at infowebworld.com.
  </p>
</div>`

const input: CSSProperties = { width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 12, border: '1.5px solid var(--h-border)', background: '#fff', fontSize: 14, color: 'var(--h-heading)', outline: 'none', fontFamily: 'var(--font-inter)' }
const btnPrimary: CSSProperties = { padding: '10px 18px', borderRadius: 10, border: 'none', background: '#E8553D', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-inter)' }
const btnGhost: CSSProperties = { padding: '8px 14px', borderRadius: 10, border: '1.5px solid var(--h-border)', background: '#fff', color: 'var(--h-heading)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-inter)' }
const label: CSSProperties = { display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--h-heading)', margin: '0 0 6px' }
const card: CSSProperties = { background: '#fff', borderRadius: 18, border: '1.5px solid var(--h-border)', padding: 18 }

function fmtDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
const audLabel = (k: string) => AUDIENCES.find(a => a.key === k)?.label || k

export default function EmailMarketing() {
  const [tab, setTab] = useState<'compose' | 'presets' | 'templates' | 'history'>('compose')
  const [templates, setTemplates] = useState<Template[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [counts, setCounts] = useState<Counts>({ all_users: 0, verified_users: 0, waitlist: 0 })

  /* compose */
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState(STARTER)
  const [audience, setAudience] = useState<keyof Counts>('all_users')
  const [testEmail, setTestEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  /* template editor: null = list view; object = editing (id 0 = new) */
  const [edit, setEdit] = useState<{ id: number; name: string; subject: string; body: string } | null>(null)

  const loadTemplates = () =>
    fetch('/api/admin/email-templates', { credentials: 'same-origin', cache: 'no-store' })
      .then(r => r.json()).then(j => { if (j?.ok) setTemplates(j.templates || []) }).catch(() => {})
  const loadHistory = () =>
    fetch('/api/admin/email-campaigns', { credentials: 'same-origin', cache: 'no-store' })
      .then(r => r.json()).then(j => { if (j?.ok) { setCampaigns(j.campaigns || []); setCounts(j.audienceCounts || counts) } }).catch(() => {})

  useEffect(() => { loadTemplates(); loadHistory() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const post = async (payload: Record<string, unknown>) => {
    const r = await fetch('/api/admin/email-campaigns/send', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin',
      body: JSON.stringify(payload),
    })
    const j = await r.json().catch(() => ({}))
    return { ok: r.ok && j?.ok, j }
  }

  const sendTest = async () => {
    if (busy) return
    if (!subject.trim() || !body.trim()) { setMsg({ ok: false, text: 'Add a subject and body first.' }); return }
    if (!testEmail.trim()) { setMsg({ ok: false, text: 'Enter a test email address.' }); return }
    setBusy(true); setMsg(null)
    const { ok, j } = await post({ subject, bodyHtml: body, testEmail: testEmail.trim() })
    setMsg(ok ? { ok: true, text: `Test sent to ${j.sentTo}. Check the inbox.` } : { ok: false, text: j?.error || 'Test send failed.' })
    setBusy(false)
  }

  const sendBulk = async () => {
    if (busy) return
    if (!subject.trim() || !body.trim()) { setMsg({ ok: false, text: 'Add a subject and body first.' }); return }
    const n = counts[audience]
    if (!n) { setMsg({ ok: false, text: 'That audience has no recipients.' }); return }
    if (!confirm(`Send "${subject}" to ${n} ${audLabel(audience)}? This sends real email and can't be undone.`)) return
    setBusy(true); setMsg(null)
    const { ok, j } = await post({ subject, bodyHtml: body, audience })
    if (ok) {
      const extra = j.truncated ? ` (capped at ${j.recipientCount} of ${j.totalAudience} — Gmail's daily limit)` : ''
      setMsg({ ok: true, text: `Sent ${j.sentCount}/${j.recipientCount}${j.failedCount ? `, ${j.failedCount} failed` : ''}${extra}.` })
      loadHistory()
    } else {
      setMsg({ ok: false, text: j?.error || 'Send failed.' })
    }
    setBusy(false)
  }

  const saveTemplate = async () => {
    if (!edit) return
    if (!edit.name.trim() || !edit.subject.trim() || !edit.body.trim()) { alert('Name, subject and body are required.'); return }
    const payload = { name: edit.name, subject: edit.subject, bodyHtml: edit.body }
    const res = edit.id === 0
      ? await fetch('/api/admin/email-templates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(payload) })
      : await fetch(`/api/admin/email-templates/${edit.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(payload) })
    const j = await res.json().catch(() => ({}))
    if (res.ok && j?.ok) { setEdit(null); loadTemplates() } else alert(j?.error || 'Could not save template.')
  }

  const deleteTemplate = async (id: number) => {
    if (!confirm('Delete this template?')) return
    const res = await fetch(`/api/admin/email-templates/${id}`, { method: 'DELETE', credentials: 'same-origin' })
    if (res.ok) loadTemplates()
  }

  const useTemplate = (t: Template) => { setSubject(t.subject); setBody(t.body_html); setTab('compose'); setMsg(null) }

  const usePreset = (subj: string, html: string) => { setSubject(subj); setBody(html); setTab('compose'); setMsg(null) }
  const savePreset = async (pr: { name: string; subject: string; html: string }) => {
    const res = await fetch('/api/admin/email-templates', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin',
      body: JSON.stringify({ name: pr.name, subject: pr.subject, bodyHtml: pr.html }),
    })
    const j = await res.json().catch(() => ({}))
    if (res.ok && j?.ok) { loadTemplates(); alert('Saved to your templates.') } else alert(j?.error || 'Could not save.')
  }

  const Tab = ({ id, children }: { id: typeof tab; children: React.ReactNode }) => (
    <button onClick={() => setTab(id)} style={{
      padding: '8px 16px', borderRadius: 999, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
      fontFamily: 'var(--font-inter)',
      background: tab === id ? '#1A1A1A' : '#fff', color: tab === id ? '#fff' : 'var(--h-muted)',
      boxShadow: tab === id ? 'none' : 'inset 0 0 0 1.5px var(--h-border)',
    }}>{children}</button>
  )

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: 'var(--font-inter)' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <Tab id="compose">Compose &amp; Send</Tab>
        <Tab id="presets">Pre-made ({EMAIL_PRESETS.length})</Tab>
        <Tab id="templates">Templates ({templates.length})</Tab>
        <Tab id="history">History ({campaigns.length})</Tab>
      </div>

      {/* ───────────────────────── COMPOSE ───────────────────────── */}
      {tab === 'compose' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16 }}>
          {/* left: editor */}
          <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <span style={label}>Subject</span>
              <input style={input} value={subject} onChange={e => setSubject(e.target.value)} placeholder="Your subject line" maxLength={255} />
            </div>

            <div>
              <span style={label}>Audience</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {AUDIENCES.map(a => (
                  <label key={a.key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--h-heading)', cursor: 'pointer' }}>
                    <input type="radio" name="aud" checked={audience === a.key} onChange={() => setAudience(a.key)} />
                    {a.label}
                    <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: 'var(--h-muted)' }}>{counts[a.key]} recipients</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <span style={label}>Body (HTML) — <code style={{ fontSize: 11 }}>{'{{name}}'}</code> &amp; <code style={{ fontSize: 11 }}>{'{{email}}'}</code> are personalized</span>
              <textarea style={{ ...input, minHeight: 220, fontFamily: 'ui-monospace,Menlo,Consolas,monospace', fontSize: 12.5, lineHeight: 1.5, resize: 'vertical' }}
                value={body} onChange={e => setBody(e.target.value)} spellCheck={false} />
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                <button style={btnGhost} onClick={() => setBody(STARTER)}>Reset to starter</button>
                {templates.length > 0 && (
                  <select style={{ ...btnGhost, padding: '8px 12px' }} value="" onChange={e => { const t = templates.find(x => String(x.id) === e.target.value); if (t) useTemplate(t) }}>
                    <option value="">Load a template…</option>
                    {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                )}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--h-border-light)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input style={{ ...input, flex: 1 }} value={testEmail} onChange={e => setTestEmail(e.target.value)} placeholder="you@email.com" type="email" />
                <button style={{ ...btnGhost, whiteSpace: 'nowrap' }} disabled={busy} onClick={sendTest}>Send test</button>
              </div>
              <button style={{ ...btnPrimary, opacity: busy ? 0.6 : 1 }} disabled={busy} onClick={sendBulk}>
                {busy ? 'Working…' : `Send to ${counts[audience]} ${audLabel(audience)}`}
              </button>
              {msg && (
                <div style={{ fontSize: 13, fontWeight: 600, padding: '8px 12px', borderRadius: 10, background: msg.ok ? 'rgba(14,143,110,.1)' : '#FEF2F2', color: msg.ok ? '#0E8F6E' : '#B91C1C' }}>{msg.text}</div>
              )}
            </div>
          </div>

          {/* right: live preview */}
          <div style={{ ...card, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--h-border-light)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--h-muted)' }}>Live preview</div>
            <iframe title="preview" sandbox="" srcDoc={body} style={{ width: '100%', flex: 1, minHeight: 460, border: 'none', background: '#fff' }} />
          </div>
        </div>
      )}

      {/* ───────────────────────── PRE-MADE ───────────────────────── */}
      {tab === 'presets' && (
        <div>
          <p style={{ fontSize: 13, color: 'var(--h-muted)', margin: '0 0 14px', lineHeight: 1.5 }}>
            Polished, ready-to-send designs. <strong>Use</strong> loads one into Compose; <strong>Save</strong> stores an editable copy in your templates. <code style={{ fontSize: 11 }}>{'{{name}}'}</code> &amp; <code style={{ fontSize: 11 }}>{'{{email}}'}</code> personalize per recipient.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 14 }}>
            {EMAIL_PRESETS.map(pr => (
              <div key={pr.id} style={{ ...card, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 200, borderBottom: '1px solid var(--h-border-light)', background: '#FAF5F0', overflow: 'hidden' }}>
                  <iframe title={pr.name} sandbox="" srcDoc={pr.html} scrolling="no"
                    style={{ width: 600, height: 600, border: 'none', transform: 'scale(.45)', transformOrigin: 'top left', pointerEvents: 'none' }} />
                </div>
                <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--h-heading)' }}>{pr.name}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '.52rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', padding: '.15rem .45rem', borderRadius: 999, background: 'rgba(232,85,61,.1)', color: '#C2410C' }}>{pr.category}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--h-muted)', lineHeight: 1.45, flex: 1 }}>{pr.description}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                    <button style={{ ...btnPrimary, flex: 1, padding: '8px 12px', fontSize: 13 }} onClick={() => usePreset(pr.subject, pr.html)}>Use</button>
                    <button style={btnGhost} onClick={() => savePreset(pr)} title="Save an editable copy to your templates">Save</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────── TEMPLATES ───────────────────────── */}
      {tab === 'templates' && (
        <div>
          {!edit ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                <button style={btnPrimary} onClick={() => setEdit({ id: 0, name: '', subject: '', body: STARTER })}>+ New template</button>
              </div>
              {templates.length === 0 ? (
                <div style={{ ...card, textAlign: 'center', color: 'var(--h-muted)', padding: '3rem' }}>No templates yet. Create one to reuse it when composing.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {templates.map(t => (
                    <div key={t.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--h-heading)' }}>{t.name}</div>
                        <div style={{ fontSize: 12.5, color: 'var(--h-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.subject}</div>
                        <div style={{ fontSize: 11, color: 'var(--h-muted)', marginTop: 2 }}>Updated {fmtDate(t.updated_at)}</div>
                      </div>
                      <button style={btnGhost} onClick={() => useTemplate(t)}>Use</button>
                      <button style={btnGhost} onClick={() => setEdit({ id: t.id, name: t.name, subject: t.subject, body: t.body_html })}>Edit</button>
                      <button style={{ ...btnGhost, color: '#EF4444', borderColor: 'rgba(239,68,68,.3)' }} onClick={() => deleteTemplate(t.id)}>Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--h-heading)' }}>{edit.id === 0 ? 'New template' : 'Edit template'}</div>
              <div><span style={label}>Template name</span><input style={input} value={edit.name} maxLength={160} onChange={e => setEdit({ ...edit, name: e.target.value })} placeholder="e.g. Monthly newsletter" /></div>
              <div><span style={label}>Subject</span><input style={input} value={edit.subject} maxLength={255} onChange={e => setEdit({ ...edit, subject: e.target.value })} placeholder="Subject line" /></div>
              <div><span style={label}>Body (HTML)</span><textarea style={{ ...input, minHeight: 260, fontFamily: 'ui-monospace,Menlo,Consolas,monospace', fontSize: 12.5, lineHeight: 1.5, resize: 'vertical' }} value={edit.body} spellCheck={false} onChange={e => setEdit({ ...edit, body: e.target.value })} /></div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={btnPrimary} onClick={saveTemplate}>Save template</button>
                <button style={btnGhost} onClick={() => setEdit(null)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────── HISTORY ───────────────────────── */}
      {tab === 'history' && (
        <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
          {campaigns.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--h-muted)', fontSize: 14 }}>No campaigns sent yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
                <thead>
                  <tr>
                    {['Subject', 'Audience', 'Recipients', 'Sent', 'Failed', 'Status', 'Date'].map(h => (
                      <th key={h} style={{ textAlign: 'left', fontSize: '.56rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--h-muted)', padding: '.7rem 1rem', borderBottom: '1.5px solid var(--h-border)', background: 'var(--h-bg)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--h-border-light)' }}>
                      <td style={{ padding: '.6rem 1rem', fontSize: '.78rem', fontWeight: 600, color: 'var(--h-heading)', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.subject}</td>
                      <td style={{ padding: '.6rem 1rem', fontSize: '.72rem', color: 'var(--h-muted)' }}>{audLabel(c.audience)}</td>
                      <td style={{ padding: '.6rem 1rem', fontSize: '.74rem', fontWeight: 700, color: 'var(--h-heading)' }}>{c.recipient_count}</td>
                      <td style={{ padding: '.6rem 1rem', fontSize: '.74rem', fontWeight: 700, color: '#0E8F6E' }}>{c.sent_count}</td>
                      <td style={{ padding: '.6rem 1rem', fontSize: '.74rem', fontWeight: 700, color: c.failed_count ? '#EF4444' : 'var(--h-muted)' }}>{c.failed_count}</td>
                      <td style={{ padding: '.6rem 1rem' }}>
                        <span style={{ fontSize: '.56rem', fontWeight: 700, padding: '.15rem .5rem', borderRadius: 999, textTransform: 'capitalize',
                          background: c.status === 'sent' ? 'rgba(14,143,110,.12)' : c.status === 'failed' ? '#FEF2F2' : 'rgba(245,158,11,.14)',
                          color: c.status === 'sent' ? '#0E8F6E' : c.status === 'failed' ? '#B91C1C' : '#B45309' }}>{c.status}</span>
                      </td>
                      <td style={{ padding: '.6rem 1rem', fontSize: '.68rem', color: 'var(--h-muted)', whiteSpace: 'nowrap' }}>{fmtDate(c.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
