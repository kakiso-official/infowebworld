import { useState, useEffect } from 'react'
import Navbar from '../components/shared/Navbar'
import Footer from '../components/shared/Footer'
import CategoryHeader from '../components/category/CategoryHeader'
import CategoryFilters from '../components/category/CategoryFilters'
import CategoryListings from '../components/category/CategoryListings'
import CategorySidebar from '../components/category/CategorySidebar'
import '../styles/category.css'

export default function CategoryPage() {
  const [filtersOpen, setFiltersOpen] = useState(false)

  const toggleFilters = () => setFiltersOpen(prev => !prev)
  const closeFilters = () => setFiltersOpen(false)

  // Fade-in animation with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll('.fade-in')
    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Navbar />
      <CategoryHeader />
      <div className="container">
        <div className="cat-layout">
          <aside className={`cat-filters${filtersOpen ? ' open' : ''}`}>
            <CategoryFilters />
          </aside>
          <main>
            <CategoryListings onToggleFilters={toggleFilters} />
          </main>
          <aside className="cat-sidebar">
            <CategorySidebar />
          </aside>
        </div>
      </div>
      <div
        className={`cat-filter-overlay${filtersOpen ? ' open' : ''}`}
        onClick={closeFilters}
      ></div>
      <Footer />
    </>
  )
}
