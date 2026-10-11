'use client'

import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch, faPlay } from '@fortawesome/free-solid-svg-icons'
import { formatBytes, formatDuration } from '@/lib/developers/format'
import { prettyJson } from '@/lib/developers/highlight'
import type { IsoDateTime } from '@/lib/developers/types'
import DvTime from '../ui/DvTime'
import CopyButton from '../ui/CopyButton'
import { CodeLines } from '../ui/CodeBlock'
import { DvBadge } from '../ui/Badges'

/* ═══════════════════════════════════════════════════════════════════════
   TryItPanel (spec 3.15, 4.11) - the only place on an API detail page that
   calls anywhere else. The URL is fixed (never editable: this can only
   ever call the recorded sample, not an arbitrary host) and the page only
   renders this component when the server has already decided the sample
   is eligible (GET, https, no key, our CORS check passed).

   Request: fetch(url, { mode: 'cors', credentials: 'omit', referrerPolicy:
   'no-referrer', cache: 'no-store' }), a 10s AbortController timeout, and
   at most 64 KB read from the stream. JSON is pretty-printed and
   tokenized with the same pure, client-safe tokenizer the server uses
   (lib/developers/highlight.ts); HTML is never injected - text renders as
   React text, and an image response becomes an <img> from a revoked-on-
   next-run blob URL. No server proxy, ever.
   ═══════════════════════════════════════════════════════════════════════ */

export interface TryItPanelProps {
  url: string
  /** When our last automated check ran (for the CORS-change error copy). */
  checkedAt?: IsoDateTime | null
  className?: string
}

const TIMEOUT_MS = 10000
const CAP_BYTES = 64 * 1024
const COOLDOWN_MS = 2000

type BodyKind = 'json' | 'text' | 'image' | 'binary'

interface SuccessResult {
  status: number
  statusText: string
  ms: number
  contentType: string
  bytes: number
  cut: boolean
  bodyKind: BodyKind
  bodyText: string
  imageUrl: string | null
}

type Phase = 'idle' | 'sending' | 'success' | { kind: 'network' | 'timeout' }

function statusTone(status: number): 'ok' | 'warn' | 'bad' {
  if (status >= 200 && status < 300) return 'ok'
  if (status >= 500) return 'bad'
  return 'warn'
}

export default function TryItPanel({ url, checkedAt, className }: TryItPanelProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [result, setResult] = useState<SuccessResult | null>(null)
  const [coolingDown, setCoolingDown] = useState(false)
  const imageUrlRef = useRef<string | null>(null)
  const cooldownTimer = useRef<number | null>(null)

  useEffect(() => () => {
    if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current)
    if (cooldownTimer.current) window.clearTimeout(cooldownTimer.current)
  }, [])

  const sending = phase === 'sending'
  const disabled = sending || coolingDown

  async function send() {
    if (disabled) return
    setPhase('sending')
    if (imageUrlRef.current) {
      URL.revokeObjectURL(imageUrlRef.current)
      imageUrlRef.current = null
    }
    setResult(null)

    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS)
    const start = performance.now()

    try {
      const res = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
        cache: 'no-store',
        signal: controller.signal,
      })
      const ms = performance.now() - start
      const contentType = res.headers.get('content-type') || ''
      const isImage = /^image\//i.test(contentType)
      let bytes = 0
      let cut = false
      let bodyText = ''
      let imageUrl: string | null = null

      if (res.body) {
        const reader = res.body.getReader()
        if (isImage) {
          const chunks: Uint8Array[] = []
          for (;;) {
            const { done, value } = await reader.read()
            if (done) break
            if (bytes + value.length > CAP_BYTES) {
              chunks.push(value.slice(0, Math.max(0, CAP_BYTES - bytes)))
              bytes = CAP_BYTES
              cut = true
              try { await reader.cancel() } catch { /* already closing */ }
              break
            }
            chunks.push(value)
            bytes += value.length
          }
          imageUrl = URL.createObjectURL(new Blob(chunks as BlobPart[], { type: contentType }))
          imageUrlRef.current = imageUrl
        } else {
          const decoder = new TextDecoder()
          for (;;) {
            const { done, value } = await reader.read()
            if (done) break
            if (bytes + value.length > CAP_BYTES) {
              bodyText += decoder.decode(value.slice(0, Math.max(0, CAP_BYTES - bytes)), { stream: true })
              bytes = CAP_BYTES
              cut = true
              try { await reader.cancel() } catch { /* already closing */ }
              break
            }
            bodyText += decoder.decode(value, { stream: true })
            bytes += value.length
          }
          if (!cut) bodyText += decoder.decode()
        }
      }

      const looksJson = /[/+]json\b/i.test(contentType) || (!contentType && prettyJson(bodyText) !== null)
      const bodyKind: BodyKind = isImage ? 'image' : looksJson ? 'json' : /^text\//i.test(contentType) || !contentType ? 'text' : 'binary'

      window.clearTimeout(timer)
      setResult({ status: res.status, statusText: res.statusText, ms, contentType, bytes, cut, bodyKind, bodyText, imageUrl })
      setPhase('success')
    } catch (err) {
      window.clearTimeout(timer)
      const timedOut = (err as { name?: string } | null)?.name === 'AbortError'
      setPhase({ kind: timedOut ? 'timeout' : 'network' })
    } finally {
      setCoolingDown(true)
      cooldownTimer.current = window.setTimeout(() => setCoolingDown(false), COOLDOWN_MS)
    }
  }

  const host = (() => {
    try { return new URL(url).hostname } catch { return url }
  })()

  return (
    <div className={className}>
      <div className="dv-tryit-request">
        <DvBadge tone="info">GET</DvBadge>
        <code>{url}</code>
      </div>
      <p className="dv-tryit-note">This request goes straight from your browser to {host}. No proxy.</p>
      <div className="dv-tryit-actions">
        <button type="button" className="dv-btn dv-btn--primary dv-btn--sm" onClick={send} disabled={disabled} aria-busy={sending}>
          <FontAwesomeIcon icon={sending ? faCircleNotch : faPlay} spin={sending} aria-hidden="true" />
          Send request
        </button>
      </div>

      <div className="dv-tryit-result" role="status" aria-live="polite">
        {phase === 'idle' && <p className="dv-tryit-placeholder">Press Send to run the request.</p>}

        {sending && (
          <div className="dv-skel" aria-hidden="true">
            <span className="dv-skel-line" style={{ width: '70%' }} />
            <span className="dv-skel-line" style={{ width: '92%' }} />
            <span className="dv-skel-line" style={{ width: '84%' }} />
            <span className="dv-skel-line" style={{ width: '60%' }} />
          </div>
        )}

        {typeof phase === 'object' && phase.kind === 'network' && (
          <p className="dv-tryit-placeholder">
            The browser blocked this request or the API did not answer. This can happen when the API changed its
            CORS rules after our last check{checkedAt ? <> (<DvTime iso={checkedAt} />)</> : null}. Use the Quick
            start request instead.
          </p>
        )}
        {typeof phase === 'object' && phase.kind === 'timeout' && (
          <p className="dv-tryit-placeholder">No answer after 10 seconds.</p>
        )}

        {phase === 'success' && result && (
          <>
            <div className="dv-tryit-status">
              <span className={`dv-tryit-dot dv-tryit-dot--${statusTone(result.status)}`} aria-hidden="true" />
              <span className="dv-tryit-status-code">{result.status} {result.statusText}</span>
              <span className="dv-tryit-status-sep">&middot;</span>
              <span>{formatDuration(result.ms)}</span>
              {result.contentType && (
                <>
                  <span className="dv-tryit-status-sep">&middot;</span>
                  <span>{result.contentType.split(';')[0]}</span>
                </>
              )}
              <span className="dv-tryit-status-sep">&middot;</span>
              <span>{formatBytes(result.bytes)}</span>
              {(result.bodyKind === 'json' || result.bodyKind === 'text') && (
                <span className="dv-tryit-copy">
                  <CopyButton
                    text={result.bodyKind === 'json' ? prettyJson(result.bodyText) ?? result.bodyText : result.bodyText}
                    label="Copy response"
                    tone="light"
                  />
                </span>
              )}
            </div>

            {result.bodyKind === 'image' && result.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={result.imageUrl} alt={`Response image from ${host}`} className="dv-tryit-img" />
            )}
            {result.bodyKind === 'json' && (
              <pre className="dv-code-pre dv-tryit-body" tabIndex={0}>
                <code><CodeLines code={prettyJson(result.bodyText) ?? result.bodyText} lang="json" /></code>
              </pre>
            )}
            {result.bodyKind === 'text' && (
              <pre className="dv-code-pre dv-tryit-body" tabIndex={0}><code>{result.bodyText}</code></pre>
            )}
            {result.bodyKind === 'binary' && (
              <p className="dv-tryit-placeholder">Binary response ({result.contentType || 'unknown type'}, {formatBytes(result.bytes)}).</p>
            )}
            {result.cut && <p className="dv-tryit-cut">Showing the first 64 KB.</p>}
          </>
        )}
      </div>
    </div>
  )
}
