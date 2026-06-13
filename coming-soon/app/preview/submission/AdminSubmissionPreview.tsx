'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ListingDetailPage from '../../listing/ListingDetailPage'
import CompanyDetailPage from '../../profile/CompanyDetailPage'
import {
  submissionToProductInitialData,
  submissionToCompanyInitialData,
} from '../listing/preview-mapper'
import type { RealSubmission } from '../../iww-hq/data/submissions-storage'

/* postMessage protocol shared with /iww-hq/submissions:
   - child → parent: { type: READY }   (sent on mount; "send me the row")
   - parent → child: { type: DATA, sub }
   Both sides verify event.origin === window.location.origin. */
const MSG_READY = 'iww-sub-preview-ready'
const MSG_DATA = 'iww-sub-preview-data'

/**
 * Renders the real public listing/company page from a RealSubmission pushed
 * by the parent admin window. No banner chrome inside the frame — the admin
 * overlay supplies the context bar — so this is a clean, faithful render of
 * exactly what visitors will see.
 */
export default function AdminSubmissionPreview() {
  const [sub, setSub] = useState<RealSubmission | null>(null)

  const announceReady = useCallback(() => {
    try {
      // window.parent is the admin doc when embedded; falls back to self when
      // the route is opened standalone (harmless no-op).
      window.parent?.postMessage({ type: MSG_READY }, window.location.origin)
    } catch {
      /* cross-origin parent — ignore */
    }
  }, [])

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return
      const data = e.data as { type?: string; sub?: RealSubmission } | null
      if (data && data.type === MSG_DATA && data.sub) setSub(data.sub)
    }
    window.addEventListener('message', onMessage)
    announceReady()
    return () => window.removeEventListener('message', onMessage)
  }, [announceReady])

  const isCompany = sub?.listingMode === 'company'
  const initialData = useMemo(() => {
    if (!sub) return null
    return isCompany
      ? submissionToCompanyInitialData(sub)
      : submissionToProductInitialData(sub)
  }, [sub, isCompany])

  if (!sub || !initialData) {
    return (
      <>
        <Navbar />
        <div className="pvw-empty">
          <p>Loading preview…</p>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      {isCompany ? (
        <CompanyDetailPage initialData={initialData as never} />
      ) : (
        <ListingDetailPage initialData={initialData as never} />
      )}
      <Footer />
    </>
  )
}
