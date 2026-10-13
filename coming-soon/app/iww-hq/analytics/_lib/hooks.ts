'use client'
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type RefObject } from 'react'

/* Small DOM hooks shared by charts and controls. */

/** useLayoutEffect in the browser (measure before paint); useEffect on the server. */
export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * Width of an element, kept current with ResizeObserver. 0 until measured -
 * charts render a same-height placeholder until then, so nothing jumps.
 */
export function useElementWidth<T extends HTMLElement>(): [RefObject<T | null>, number] {
  const ref = useRef<T | null>(null)
  const [width, setWidth] = useState(0)
  useIsoLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const measure = () => setWidth(Math.round(el.getBoundingClientRect().width))
    raf = requestAnimationFrame(measure)
    if (typeof ResizeObserver === 'undefined') return () => cancelAnimationFrame(raf)
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measure)
    })
    ro.observe(el)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])
  return [ref, width]
}

/** Close a popover on outside pointerdown or Escape. */
export function useDismiss(ref: RefObject<HTMLElement | null>, open: boolean, onClose: () => void): void {
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [ref, open, onClose])
}

/* One shared ticking clock (instead of a timer per "3 min ago" label). */
const clockListeners = new Set<() => void>()
let clockNow = 0
let clockTimer: ReturnType<typeof setInterval> | null = null
function subscribeClock(cb: () => void) {
  clockListeners.add(cb)
  if (!clockTimer) {
    clockNow = Date.now()
    clockTimer = setInterval(() => {
      clockNow = Date.now()
      for (const l of clockListeners) l()
    }, 15_000)
  }
  return () => {
    clockListeners.delete(cb)
    if (!clockListeners.size && clockTimer) { clearInterval(clockTimer); clockTimer = null }
  }
}
const getClock = () => clockNow
const getServerClock = () => 0

/**
 * Current time in ms, re-rendering every 15 s - for relative times
 * ("3 min ago"). 0 before the first subscription (treat as "unknown").
 */
export function useNow(): number {
  return useSyncExternalStore(subscribeClock, getClock, getServerClock)
}

function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

/** True when the user asked the OS for reduced motion. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  )
}
