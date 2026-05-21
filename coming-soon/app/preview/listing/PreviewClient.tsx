'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ListingDetailPage from '../../listing/ListingDetailPage'
import CompanyDetailPage from '../../profile/CompanyDetailPage'
import {
  PREVIEW_STORAGE_KEY, buildProductInitialData, buildCompanyInitialData,
  type PreviewPayload,
} from './preview-mapper'

function timeAgo(ts: number): string {
  const diff = Math.max(0, Date.now() - ts)
  const s = Math.floor(diff / 1000)
  if (s < 5)   return 'just now'
  if (s < 60)  return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60)  return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24)  return `${h}h ago`
  return new Date(ts).toLocaleString()
}

/**
 * Reads the latest in-progress form snapshot from localStorage and renders
 * the live ListingDetailPage / CompanyDetailPage with it. Auto-refreshes
 * across tabs via the `storage` event so editing in the form tab updates
 * the preview tab in real time.
 *
 * Self-contained: no server state, no auth check. The data is per-browser,
 * so the worst case for a non-owner who navigates here is seeing their own
 * (empty) preview state.
 */
export default function PreviewClient() {
  const [payload, setPayload] = useState<PreviewPayload | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [tick, setTick] = useState(0) // forces re-render of "saved Xs ago"

  const readFromStorage = useCallback(() => {
    try {
      const raw = localStorage.getItem(PREVIEW_STORAGE_KEY)
      if (!raw) { setPayload(null); return }
      const parsed = JSON.parse(raw) as PreviewPayload
      if (parsed && parsed.form) setPayload(parsed)
      else setPayload(null)
    } catch { setPayload(null) }
  }, [])

  useEffect(() => {
    readFromStorage()
    setLoaded(true)
    const onStorage = (e: StorageEvent) => {
      if (e.key === PREVIEW_STORAGE_KEY) readFromStorage()
    }
    window.addEventListener('storage', onStorage)
    /* Re-tick the "saved Xs ago" label every 5s without re-reading storage. */
    const intv = setInterval(() => setTick(t => t + 1), 5000)
    return () => {
      window.removeEventListener('storage', onStorage)
      clearInterval(intv)
    }
  }, [readFromStorage])

  const isCompany = payload?.form.listingMode === 'company'
  const initialData = useMemo(() => {
    if (!payload) return null
    return isCompany
      ? buildCompanyInitialData(payload.form)
      : buildProductInitialData(payload.form)
  }, [payload, isCompany])

  if (loaded && !payload) {
    return (
      <>
        <Navbar />
        <div className="pvw-empty">
          <h1>Nothing to preview yet</h1>
          <p>
            Start filling out your listing in the editor — your preview updates here
            automatically as you type. Keep this tab open in another window for a
            live, side-by-side view.
          </p>
          <a className="pvw-empty-cta" href="/dashboard/new">Open the editor →</a>
        </div>
        <Footer />
      </>
    )
  }

  if (!loaded || !payload || !initialData) {
    return (
      <>
        <Navbar />
        <div className="pvw-empty"><p>Loading preview…</p></div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="pvw-banner" role="status" aria-live="polite">
        <span className="pvw-banner-dot" aria-hidden="true" />
        <span>
          <span className="pvw-banner-title">Live preview</span>
          <span className="pvw-banner-sub"> · {isCompany ? 'Company profile' : 'Product listing'} — updates as you edit</span>
        </span>
        <span className="pvw-banner-saved" key={tick}>
          Last edit {timeAgo(payload.savedAt)}
        </span>
        <span className="pvw-banner-actions">
          <button type="button" className="pvw-banner-btn" onClick={readFromStorage}>
            Refresh
          </button>
          <a className="pvw-banner-btn pvw-banner-btn--primary" href="/dashboard/new">
            Back to editor
          </a>
        </span>
      </div>
      {isCompany ? (
        <CompanyDetailPage initialData={initialData as never} />
      ) : (
        <ListingDetailPage initialData={initialData as never} />
      )}
      <Footer />
    </>
  )
}
