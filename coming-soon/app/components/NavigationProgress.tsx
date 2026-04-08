'use client'
import { useEffect, useRef, useCallback } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const barRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const startRef = useRef(0)
  const activeRef = useRef(false)
  const prevPath = useRef('')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setBar = useCallback((pct: number, opacity = 1) => {
    if (!barRef.current) return
    barRef.current.style.transform = `scaleX(${pct / 100})`
    barRef.current.style.opacity = String(opacity)
    barRef.current.style.display = pct === 0 && opacity === 0 ? 'none' : 'block'
  }, [])

  const finish = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null }
    activeRef.current = false
    setBar(100, 1)
    // Fade out then hide
    setTimeout(() => setBar(100, 0), 200)
    setTimeout(() => setBar(0, 0), 500)
  }, [setBar])

  const start = useCallback(() => {
    // Cancel any existing animation
    cancelAnimationFrame(rafRef.current)
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null }

    activeRef.current = true
    startRef.current = Date.now()
    setBar(0, 1)

    // Animate: fast to 30%, slow to 70%, crawl to 90%, then wait
    const tick = () => {
      if (!activeRef.current) return
      const elapsed = Date.now() - startRef.current
      let pct: number
      if (elapsed < 300) {
        pct = (elapsed / 300) * 30          // 0-30% in 300ms (fast start)
      } else if (elapsed < 1500) {
        pct = 30 + ((elapsed - 300) / 1200) * 40  // 30-70% over 1.2s
      } else if (elapsed < 5000) {
        pct = 70 + ((elapsed - 1500) / 3500) * 18 // 70-88% over 3.5s (crawl)
      } else {
        pct = 88 + Math.min((elapsed - 5000) / 10000, 1) * 4  // 88-92% very slowly
      }
      setBar(Math.min(pct, 92), 1)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    // Safety timeout: finish after 15s no matter what
    timeoutRef.current = setTimeout(() => {
      if (activeRef.current) finish()
    }, 15000)
  }, [setBar, finish])

  // Complete on route change
  useEffect(() => {
    const current = pathname + (searchParams?.toString() || '')
    if (prevPath.current && current !== prevPath.current && activeRef.current) {
      finish()
    }
    prevPath.current = current
  }, [pathname, searchParams, finish])

  // Listen for link clicks to start
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('javascript:')) return
      if (anchor.target === '_blank') return
      // Skip if clicking same page
      const url = new URL(href, window.location.origin)
      const current = window.location.pathname + window.location.search
      const target = url.pathname + url.search
      if (current === target) return
      start()
    }
    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      cancelAnimationFrame(rafRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [start])

  return <div ref={barRef} className="np-bar" style={{ display: 'none' }} />
}
