'use client'

import { useEffect, useState, type ReactNode } from 'react'

/* ═══════════════════════════════════════════════════════════════════════
   Renders its children only AFTER the first user interaction, or after a
   short idle timeout — whichever comes first.

   Used to keep non-critical, JS-heavy globals (Google One Tap's GSI client,
   the InfoBot chat widget + its markdown parser) off the initial load's main
   thread. They still appear within a few seconds (or instantly on first
   scroll/tap), but they no longer tax LCP / Total Blocking Time on mobile —
   where those audits dominate the Lighthouse score.
   ═══════════════════════════════════════════════════════════════════════ */
export default function DeferredClient({
  children,
  timeout = 3000,
}: {
  children: ReactNode
  /** Hard fallback (ms) — mount even if the user never interacts. */
  timeout?: number
}) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let fired = false
    const events: (keyof WindowEventMap)[] = ['pointerdown', 'keydown', 'touchstart', 'scroll']
    let timer: ReturnType<typeof setTimeout>

    const cleanup = () => {
      events.forEach(e => window.removeEventListener(e, fire))
      clearTimeout(timer)
    }
    function fire() {
      if (fired) return
      fired = true
      cleanup()
      setReady(true)
    }

    events.forEach(e => window.addEventListener(e, fire, { once: true, passive: true }))
    timer = setTimeout(fire, timeout)
    return cleanup
  }, [timeout])

  return ready ? <>{children}</> : null
}
