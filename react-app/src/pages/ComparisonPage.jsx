import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/shared/Navbar'
import Footer from '../components/shared/Footer'
import ComparisonHeader from '../components/comparison/ComparisonHeader'
import ComparisonTable from '../components/comparison/ComparisonTable'
import '../styles/comparison.css'

export default function ComparisonPage() {
  useEffect(() => {
    // Fade-in animations for sections
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationDelay = '0s'
          entry.target.style.animationPlayState = 'running'
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.05 })

    document.querySelectorAll('.cmp-section').forEach(el => {
      el.style.animationPlayState = 'paused'
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handlePrint = () => window.print()

  return (
    <>
      <Navbar />
      <ComparisonHeader onPrint={handlePrint} />
      <ComparisonTable />

      {/* CTA Section */}
      <div className="container">
        <div className="cmp-cta">
          <div className="cmp-cta-title">Need help choosing the right tool?</div>
          <p className="cmp-cta-desc">
            Try our recommendation engine. Answer a few quick questions and get a personalized shortlist tailored to your team's needs, budget, and tech stack.
          </p>
          <Link to="/search" className="cmp-cta-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            Get Recommendations
          </Link>
        </div>
      </div>

      <Footer />
    </>
  )
}
