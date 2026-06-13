'use client'

/* The dashboard form's df-* styles aren't loaded by the /iww-hq admin layout
   (only dashboard-shell.css is), so pull them in for this route. The .nl /
   .nl--form / .tp-content chrome already comes from dashboard-shell.css. */
import '../../../../styles/dashboard-form.css'

import Link from 'next/link'
import DashboardListingForm from '../../../../dashboard/new/form/DashboardListingForm'
import type { FormState, PlanKey } from '../../../../dashboard/new/form/types'
import { publicListingUrl } from '../../../../lib/listing-url'

type Props = {
  submissionUuid: string
  slug: string
  companyName: string
  plan: PlanKey
  listingMode: 'product' | 'company'
  initialFormState: Partial<FormState>
}

/**
 * Reuses the owner's DashboardListingForm in adminMode so the admin gets the
 * exact same comprehensive editor (every field, both company + product flows),
 * but with an admin header + submit to the admin endpoint.
 */
export default function AdminEditClient({
  submissionUuid, slug, companyName, plan, listingMode, initialFormState,
}: Props) {
  return (
    <div className="nl nl--form">
      <div
        style={{
          display: 'flex', flexDirection: 'column', gap: 4,
          padding: '6px 0 16px', marginBottom: 18,
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <Link
          href="/iww-hq/submissions"
          style={{ fontSize: 12.5, fontWeight: 700, color: '#E8553D', textDecoration: 'none', width: 'fit-content' }}
        >
          ← Back to submissions
        </Link>
        <h1 style={{ margin: '8px 0 0', fontSize: 20, fontWeight: 800, color: '#11181C', letterSpacing: '-.02em' }}>
          Editing · {companyName}
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>
          Admin edit — every field below saves straight to this{' '}
          {listingMode === 'company' ? 'company' : 'product'} listing and keeps its current status.
          {' · '}
          <Link
            href={publicListingUrl(slug, listingMode)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0C9A9A', fontWeight: 600 }}
          >
            View live page ↗
          </Link>
        </p>
      </div>

      <DashboardListingForm
        plan={plan}
        editMode
        adminMode
        submissionUuid={submissionUuid}
        initialFormState={initialFormState}
      />
    </div>
  )
}
