'use client'
import Link from 'next/link'
import DashboardListingForm from '../../../new/form/DashboardListingForm'
import type { FormState, PlanKey } from '../../../new/form/types'
import DashboardHeader from '../../../DashboardHeader'

type Props = {
  submissionUuid: string
  slug: string
  companyName: string
  plan: PlanKey
  initialFormState: Partial<FormState>
}

export default function EditListingClient({
  submissionUuid, slug, companyName, plan, initialFormState,
}: Props) {
  return (
    <div className="nl nl--form">
      <DashboardHeader
        title={`Edit · ${companyName}`}
        breadcrumb={{
          trail: [
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'My listings', href: '/dashboard/listings' },
          ],
          current: companyName,
        }}
        subtitle={
          <>
            Update any field below — changes save to your live listing.
            {' · '}
            <Link href={`/company/${slug}`} className="nl-change-plan" target="_blank" rel="noopener noreferrer">
              View live page ↗
            </Link>
          </>
        }
      />
      <DashboardListingForm
        plan={plan}
        editMode
        submissionUuid={submissionUuid}
        initialFormState={initialFormState}
      />
    </div>
  )
}
