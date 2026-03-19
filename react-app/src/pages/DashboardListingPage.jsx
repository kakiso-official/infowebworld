import { useState } from 'react'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import ListingHero from '../components/dashboard/listing/ListingHero'
import ListingQuickStats from '../components/dashboard/listing/ListingQuickStats'
import ListingTabs from '../components/dashboard/listing/ListingTabs'
import OverviewTab from '../components/dashboard/listing/OverviewTab'
import EditListingTab from '../components/dashboard/listing/EditListingTab'
import ServicesPricingTab from '../components/dashboard/listing/ServicesPricingTab'
import SEOVisibilityTab from '../components/dashboard/listing/SEOVisibilityTab'
import MediaTab from '../components/dashboard/listing/MediaTab'

export default function DashboardListingPage() {
  const [tab, setTab] = useState('overview')

  return (
    <DashboardLayout title="My Listing" subtitle="Manage, edit, and optimize your business listing">
      <ListingHero />
      <ListingQuickStats />
      <ListingTabs activeTab={tab} setActiveTab={setTab} />
      {tab === 'overview' && <OverviewTab onNavigateToEdit={() => setTab('edit')} />}
      {tab === 'edit' && <EditListingTab />}
      {tab === 'services' && <ServicesPricingTab />}
      {tab === 'seo' && <SEOVisibilityTab />}
      {tab === 'media' && <MediaTab />}
    </DashboardLayout>
  )
}
