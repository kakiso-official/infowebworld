import { useState } from 'react'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import ProfileHero from '../components/dashboard/profile/ProfileHero'
import ProfileSectionTabs from '../components/dashboard/profile/ProfileSectionTabs'
import BasicInfoForm from '../components/dashboard/profile/BasicInfoForm'
import BusinessDetailsForm from '../components/dashboard/profile/BusinessDetailsForm'
import PhotosMediaForm from '../components/dashboard/profile/PhotosMediaForm'
import HoursContactForm from '../components/dashboard/profile/HoursContactForm'

export default function DashboardProfilePage() {
  const [activeSection, setActiveSection] = useState('basic')

  return (
    <DashboardLayout title="Business Profile" subtitle="Manage your public listing">
      <ProfileHero />
      <ProfileSectionTabs activeSection={activeSection} setActiveSection={setActiveSection} />

      {activeSection === 'basic' && <BasicInfoForm />}
      {activeSection === 'details' && <BusinessDetailsForm />}
      {activeSection === 'media' && <PhotosMediaForm />}
      {activeSection === 'hours' && <HoursContactForm />}
    </DashboardLayout>
  )
}
