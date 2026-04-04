'use client'
import { useEffect, useState, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const prevPath = useRef(pathname + searchParams.toString())

  useEffect(() => {
    const current = pathname + searchParams.toString()
    if (current === prevPath.current) return

    // Navigation completed — finish the bar
    prevPath.current = current
    if (timerRef.current) clearInterval(timerRef.current)
    setProgress(100)
    const t = setTimeout(() => { setVisible(false); setProgress(0) }, 300)
    return () => clearTimeout(t)
  }, [pathname, searchParams])

  // Listen for click on links to START the bar
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) return
      if (anchor.target === '_blank') return
      // Internal navigation — start progress bar
      setVisible(true)
      setProgress(15)
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 90) return p
          return p + (90 - p) * 0.1
        })
      }, 100)
    }
    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  if (!visible && progress === 0) return null

  return (
    <div className="np-bar" style={{ transform: `scaleX(${progress / 100})`, opacity: progress >= 100 ? 0 : 1 }} />
  )
}
