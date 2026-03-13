import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/shared/Navbar'
import Footer from '../components/shared/Footer'
import NewsTicker from '../components/news/NewsTicker'
import NewsHero from '../components/news/NewsHero'
import EditorsPicks from '../components/news/EditorsPicks'
import NewsGrid from '../components/news/NewsGrid'
import NewsSidebar from '../components/news/NewsSidebar'
import '../styles/news.css'

export default function NewsPage() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })

    // Fade-in animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1'
          entry.target.style.transform = 'translateY(0)'
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' })

    document.querySelectorAll('.nws-card, .nws-side-card, .nws-newsletter, .nws-pick-card').forEach((el, i) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(16px)'
      el.style.transition = `opacity .5s cubic-bezier(.16,1,.3,1) ${i * 0.04}s, transform .5s cubic-bezier(.16,1,.3,1) ${i * 0.04}s`
      observer.observe(el)
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <div className="nws-page-wrap">
      <Navbar />
      <NewsTicker />
      <NewsHero />
      <EditorsPicks />

      <div className="container">
        {/* Breadcrumb */}
        <nav className="nws-breadcrumb">
          <Link to="/">Home</Link>
          <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
          <span>News & Insights</span>
        </nav>

        {/* Content + Sidebar */}
        <div className="nws-content">
          <div>
            <NewsGrid />
          </div>
          <NewsSidebar />
        </div>
      </div>

      {/* Scroll to top */}
      <button
        className={`nws-scroll-top${showScrollTop ? ' visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        <svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15" /></svg>
      </button>

      <Footer />
    </div>
  )
}
