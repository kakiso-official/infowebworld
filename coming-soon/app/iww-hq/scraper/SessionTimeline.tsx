'use client'

/**
 * Gantt-style step timeline for a single scrape session.
 *
 * Renders one horizontal bar per step. Bar length is proportional to step
 * duration; bar colour is the step status. Polls /api/admin/scrape/sessions/[id]
 * every 1.5s when `live` is true (session still running) so the bars
 * appear in real time as the worker writes them.
 *
 * Click a step to expand details (input URL, prompt preview, output excerpt,
 * error message, full cost breakdown).
 */

import { useCallback, useEffect, useRef, useState } from 'react'

interface Step {
  id: number
  step_name: string
  step_index: number
  step_type: string
  status: string
  input_url: string | null
  input_prompt_preview: string | null
  output_status_code: number | null
  output_bytes: number | null
  output_excerpt: string | null
  input_tokens: number | null
  output_tokens: number | null
  cost_usd: number | null
  error_message: string | null
  started_at: string
  finished_at: string | null
  duration_ms: number | null
}

export default function SessionTimeline({ sessionId, live }: { sessionId: number; live: boolean }) {
  const [steps, setSteps] = useState<Step[]>([])
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  /* In-flight guard so a slow network can't stack requests. Without this,
     a 2s fetch on a 1.5s interval queues a new request before the previous
     resolves, then both update state in the wrong order. */
  const inFlight = useRef(false)
  const cancelled = useRef(false)

  const reload = useCallback(async () => {
    if (inFlight.current) return
    inFlight.current = true
    try {
      const res = await fetch(`/api/admin/scrape/sessions/${sessionId}`, { cache: 'no-store' })
      const json = await res.json()
      if (!cancelled.current && json.ok) setSteps(json.steps)
    } catch {
      /* Swallow transient fetch errors — next tick retries. */
    } finally {
      inFlight.current = false
      if (!cancelled.current) setLoading(false)
    }
  }, [sessionId])

  useEffect(() => {
    cancelled.current = false
    reload()
    if (!live) return
    /* 5s + hidden-tab pause (was 1.5s always-on): each tick is a function
       invocation with multiple MySQL queries against the slow cPanel DB. */
    const id = setInterval(() => { if (!document.hidden) reload() }, 5000)
    return () => {
      cancelled.current = true
      clearInterval(id)
    }
  }, [sessionId, live, reload])

  const maxDuration = Math.max(1, ...steps.map(s => s.duration_ms ?? 0))

  return (
    <div className="scrp-timeline">
      {loading && <div className="scrp-timeline-loading">Loading steps…</div>}
      {!loading && steps.length === 0 && <div className="scrp-timeline-loading">No steps recorded yet.</div>}
      {steps.map(step => {
        const widthPct = step.duration_ms ? Math.max(2, (step.duration_ms / maxDuration) * 100) : (step.status === 'running' ? 8 : 2)
        const expanded = expandedStep === step.id
        return (
          <div
            key={step.id}
            className={`scrp-step scrp-step--${step.status} scrp-step--${step.step_type}`}
          >
            <button
              type="button"
              className="scrp-step-head"
              onClick={() => setExpandedStep(expanded ? null : step.id)}
            >
              <span className="scrp-step-idx">{step.step_index}</span>
              <span className="scrp-step-name">{step.step_name}</span>
              <span className="scrp-step-bar-track">
                <span className="scrp-step-bar" style={{ width: `${widthPct}%` }} />
              </span>
              <span className="scrp-step-stats">
                <span className={`scrp-step-status scrp-step-status--${step.status}`}>{stepGlyph(step.status)}</span>
                {step.duration_ms != null && <span>{formatMs(step.duration_ms)}</span>}
                {step.output_bytes != null && <span>{formatBytes(step.output_bytes)}</span>}
                {(step.input_tokens != null || step.output_tokens != null) && (
                  <span>{step.input_tokens ?? 0}+{step.output_tokens ?? 0}t</span>
                )}
                {step.cost_usd != null && step.cost_usd > 0 && <span>${step.cost_usd.toFixed(4)}</span>}
              </span>
            </button>
            {expanded && (
              <div className="scrp-step-body">
                {step.input_url && (
                  <div className="scrp-kv">
                    <span className="scrp-kv-k">URL</span>
                    <a href={step.input_url} target="_blank" rel="noopener noreferrer" className="scrp-kv-v">{step.input_url}</a>
                  </div>
                )}
                {step.output_status_code != null && (
                  <div className="scrp-kv">
                    <span className="scrp-kv-k">HTTP</span>
                    <span className="scrp-kv-v">{step.output_status_code}</span>
                  </div>
                )}
                {step.input_prompt_preview && (
                  <div className="scrp-kv scrp-kv--block">
                    <span className="scrp-kv-k">Prompt (first 500)</span>
                    <pre className="scrp-kv-pre">{step.input_prompt_preview}</pre>
                  </div>
                )}
                {step.output_excerpt && (
                  <div className="scrp-kv scrp-kv--block">
                    <span className="scrp-kv-k">Output excerpt</span>
                    <pre className="scrp-kv-pre">{step.output_excerpt}</pre>
                  </div>
                )}
                {step.error_message && (
                  <div className="scrp-kv scrp-kv--block">
                    <span className="scrp-kv-k">Error</span>
                    <pre className="scrp-kv-pre scrp-kv-pre--err">{step.error_message}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function stepGlyph(status: string): string {
  return status === 'ok' ? '✓'
    : status === 'error' ? '✗'
    : status === 'skipped' ? '–'
    : status === 'running' ? '⟳' : '?'
}

function formatMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function formatBytes(b: number): string {
  if (b < 1024) return `${b}B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)}KB`
  return `${(b / 1024 / 1024).toFixed(2)}MB`
}
