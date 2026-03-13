import { useState, useEffect, useCallback } from 'react'
import Navbar from '../components/shared/Navbar'
import Footer from '../components/shared/Footer'
import ListingHeader from '../components/listing/ListingHeader'
import ListingOverview from '../components/listing/ListingOverview'
import ListingReviews from '../components/listing/ListingReviews'
import ListingSidebar from '../components/listing/ListingSidebar'
import '../styles/listing.css'

const SECTION_KEYS = ['overview', 'features', 'pricing', 'reviews', 'alternatives']

export default function ListingPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const handleTabChange = useCallback((tabKey) => {
    setActiveTab(tabKey)
    const section = document.getElementById('ls-' + tabKey)
    if (section) {
      const tabsWrap = document.querySelector('.ls-tabs-wrap')
      const offset = tabsWrap ? tabsWrap.offsetHeight : 50
      const top = section.getBoundingClientRect().top + window.pageYOffset - offset - 10
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    const sectionEls = SECTION_KEYS
      .map(s => document.getElementById('ls-' + s))
      .filter(Boolean)

    if (!sectionEls.length) return

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('ls-', '')
            setActiveTab(id)
          }
        })
      },
      { threshold: 0.15, rootMargin: '-80px 0px -60% 0px' }
    )

    sectionEls.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <Navbar />
      <ListingHeader activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="container">
        <div className="ls-layout">
          <main>
            <ListingOverview />
            <ListingReviews />
          </main>
          <aside className="ls-sidebar">
            <ListingSidebar />
          </aside>
        </div>
      </div>
      <Footer />
    </>
  )
}
