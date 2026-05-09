'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { marked } from 'marked'
import dynamic from 'next/dynamic'

/* SignupModal pulls in createPortal etc. — load it lazily so the chat widget
   itself stays small for the 95% of visits that never hit the auth gate. */
const SignupModal = dynamic(() => import('../auth/SignupModal'), { ssr: false })

interface Msg {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const STORAGE_KEY      = 'iww_chat_messages_v1'
const STORAGE_OPEN_KEY = 'iww_chat_open_v1'
const ANON_LIMIT       = 3

const GREETING: Msg = {
  id: 'greet',
  role: 'assistant',
  content:
    "Hey! I'm **InfoBot** — your guide to InfoWebWorld.\n\nTell me what you're trying to find (a tool, a category, a vendor) and I'll point you the right way. What can I help with?",
}

function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36) }

/* Render assistant content as sanitised HTML — we trust the model output enough
   for inline markdown but keep the sanitiser tight (no raw HTML, no scripts). */
function mdToHtml(text: string): string {
  marked.setOptions({ gfm: true, breaks: true })
  const html = marked.parse(text, { async: false }) as string
  /* Hard-strip <script> / <iframe> / on*= just in case. The model is instructed
     not to emit raw HTML, but defense-in-depth costs us nothing. */
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
}

const Sparkle = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" fill="currentColor" />
    <path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z" fill="currentColor" opacity="0.7" />
  </svg>
)

const SendIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default function ChatWidget() {
  const path = usePathname()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([GREETING])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [anonUsed, setAnonUsed] = useState(0)
  const [authed, setAuthed] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const inputRef  = useRef<HTMLTextAreaElement | null>(null)

  /* Hydrate persisted state. We mark `mounted` so we only render the portal
     after the first paint — avoids SSR/CSR mismatch on the open state. */
  useEffect(() => {
    setMounted(true)
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Msg[]
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed)
      }
      const wasOpen = localStorage.getItem(STORAGE_OPEN_KEY)
      if (wasOpen === '1') setOpen(true)
    } catch { /* ignore corrupt storage */ }
  }, [])

  /* Persist on every change. We deliberately don't persist `sending` etc. */
  useEffect(() => {
    if (!mounted) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)) } catch {}
  }, [messages, mounted])

  useEffect(() => {
    if (!mounted) return
    try { localStorage.setItem(STORAGE_OPEN_KEY, open ? '1' : '0') } catch {}
  }, [open, mounted])

  /* Scroll to bottom on new content. */
  useEffect(() => {
    if (!open) return
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, open, sending])

  /* Focus the input when the panel opens. */
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.focus(), 80)
    return () => clearTimeout(t)
  }, [open])

  const userMessageCount = useMemo(
    () => messages.filter(m => m.role === 'user').length,
    [messages]
  )
  const remainingFree = Math.max(0, ANON_LIMIT - anonUsed)
  const showLimitNotice = !authed && anonUsed > 0

  const send = async () => {
    const text = input.trim()
    if (!text || sending) return
    /* Anon visitors are blocked at the limit by the server too — we just gate
       client-side first to skip the round-trip and show the modal immediately. */
    if (!authed && userMessageCount >= ANON_LIMIT) {
      setShowAuth(true)
      return
    }

    setError('')
    const userMsg: Msg = { id: uid(), role: 'user', content: text }
    const assistantMsg: Msg = { id: uid(), role: 'assistant', content: '' }
    const nextHistory = [...messages, userMsg]
    setMessages([...nextHistory, assistantMsg])
    setInput('')
    setSending(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          /* Drop the canned greeting — Gemini only needs the real conversation. */
          messages: nextHistory.filter(m => m.id !== 'greet').map(m => ({ role: m.role, content: m.content })),
        }),
      })

      const headerAuthed = res.headers.get('X-Authed') === '1'
      const headerUsed = Number(res.headers.get('X-Anon-Used') || 0)
      if (headerAuthed) setAuthed(true)
      if (Number.isFinite(headerUsed)) setAnonUsed(headerUsed)

      if (res.status === 401) {
        const j = await res.json().catch(() => ({}))
        if (j?.code === 'auth_required') {
          /* Roll back the empty assistant placeholder + show the signup gate. */
          setMessages(prev => prev.filter(m => m.id !== assistantMsg.id))
          setShowAuth(true)
          setSending(false)
          return
        }
      }

      if (!res.ok) {
        let errMsg = 'Couldn\'t reach the assistant. Try again.'
        try {
          const j = await res.json()
          if (j?.error) errMsg = j.error
        } catch {
          /* Server might have returned plain text. Read it and surface it
             so the diagnostic message reaches the user. */
          try { const t = await res.text(); if (t) errMsg = t } catch {}
        }
        setError(errMsg)
        setMessages(prev => prev.filter(m => m.id !== assistantMsg.id))
        setSending(false)
        return
      }

      /* Non-streaming: server returns the full reply as plain text. We
         simulate a quick typewriter so the UI still feels alive instead of
         dumping a wall of text in one frame. */
      const replyText = (await res.text()).trim()
      const finalText = replyText ||
        "Hmm, I didn't get a reply that time. Try asking about a category " +
        "(\"AI writing tools\"), how to list your business, or browse " +
        "[Categories](/categories) directly."

      /* Reveal in ~12 chunks across ~400ms — feels live, no real streaming
         needed. Skipped if the reply is very short. */
      const STEPS = Math.min(12, Math.max(1, Math.ceil(finalText.length / 40)))
      const stepLen = Math.ceil(finalText.length / STEPS)
      for (let i = 1; i <= STEPS; i++) {
        const slice = finalText.slice(0, i * stepLen)
        setMessages(prev => prev.map(m =>
          m.id === assistantMsg.id ? { ...m, content: slice } : m
        ))
        if (i < STEPS) await new Promise(r => setTimeout(r, 32))
      }
      setMessages(prev => prev.map(m =>
        m.id === assistantMsg.id ? { ...m, content: finalText } : m
      ))
    } catch {
      setError('Network error. Please retry.')
      setMessages(prev => prev.filter(m => m.id !== assistantMsg.id))
    } finally {
      setSending(false)
    }
  }

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const reset = () => {
    setMessages([GREETING])
    setError('')
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }

  if (!mounted) return null
  /* The dashboard is an app shell with its own header / sidebar / right-side
     CTAs — a floating launcher pinned bottom-right competes with that chrome
     and isn't where logged-in owners go to ask InfoBot questions anyway. */
  if (path && path.startsWith('/dashboard')) return null

  return (
    <>
      {/* ── Floating launcher (collapsed state) ── */}
      {!open && (
        <button
          type="button"
          className="iwc-launcher"
          onClick={() => setOpen(true)}
          aria-label="Open chat"
        >
          <span className="iwc-launcher-icon" aria-hidden="true">
            <Sparkle size={40} />
          </span>
          <span className="iwc-launcher-label">I need a recommendation…</span>
        </button>
      )}

      {/* ── Expanded panel ── */}
      {open && (
        <div className="iwc-panel" role="dialog" aria-label="InfoBot chat">
          <header className="iwc-head">
            <div className="iwc-head-id">
              <span className="iwc-head-avatar" aria-hidden="true"><Sparkle size={16} /></span>
              <div className="iwc-head-text">
                <div className="iwc-head-name">InfoBot</div>
                <div className="iwc-head-sub">
                  {authed ? 'Unlimited · ask me anything' : `${remainingFree} free message${remainingFree === 1 ? '' : 's'} left`}
                </div>
              </div>
            </div>
            <div className="iwc-head-actions">
              <button type="button" className="iwc-head-btn" onClick={reset}
                title="Start over" aria-label="Start over">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                </svg>
              </button>
              <button type="button" className="iwc-head-btn" onClick={() => setOpen(false)}
                title="Close" aria-label="Close chat">
                <CloseIcon />
              </button>
            </div>
          </header>

          <div ref={scrollRef} className="iwc-scroll">
            {messages.map(m => {
              const isEmptyAssistant = m.role === 'assistant' && !m.content
              return (
                <div key={m.id} className={`iwc-msg iwc-msg--${m.role}`}>
                  {m.role === 'assistant' && (
                    <span className="iwc-msg-avatar" aria-hidden="true"><Sparkle size={12} /></span>
                  )}
                  {isEmptyAssistant ? (
                    <div className="iwc-bubble iwc-bubble--typing" aria-label="InfoBot is typing">
                      <span /><span /><span />
                    </div>
                  ) : (
                    <div
                      className="iwc-bubble"
                      /* eslint-disable-next-line react/no-danger */
                      dangerouslySetInnerHTML={{ __html: mdToHtml(m.content) }}
                    />
                  )}
                </div>
              )
            })}
            {error && <div className="iwc-error" role="alert">{error}</div>}
          </div>

          {showLimitNotice && !authed && (
            <div className="iwc-notice">
              {remainingFree === 0
                ? <>You&apos;ve used your free messages — <button type="button" onClick={() => setShowAuth(true)}>sign up</button> to keep chatting (unlimited, free).</>
                : <>{remainingFree} free message{remainingFree === 1 ? '' : 's'} left before sign-up. <button type="button" onClick={() => setShowAuth(true)}>Sign up now</button> for unlimited chat.</>}
            </div>
          )}

          <form className="iwc-input-row" onSubmit={e => { e.preventDefault(); send() }}>
            <textarea
              ref={inputRef}
              className="iwc-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder={!authed && remainingFree === 0 ? 'Sign up to keep chatting…' : 'Ask InfoBot anything…'}
              rows={1}
              disabled={sending || (!authed && remainingFree === 0)}
              maxLength={2000}
            />
            <button
              type="submit"
              className="iwc-send"
              disabled={sending || !input.trim() || (!authed && remainingFree === 0)}
              aria-label="Send"
            >
              {sending ? <span className="iwc-send-spin" aria-hidden="true" /> : <SendIcon />}
            </button>
          </form>

          <div className="iwc-foot">Powered by Gemini · InfoWebWorld AI</div>
        </div>
      )}

      <SignupModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          /* Successful signup → reload so the cookie-based auth state and
             unlimited messages take effect everywhere on the site. */
          setShowAuth(false)
          setAuthed(true)
          window.location.reload()
        }}
      />
    </>
  )
}
