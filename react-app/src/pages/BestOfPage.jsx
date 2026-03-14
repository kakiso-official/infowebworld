import { useEffect } from 'react'
import Navbar from '../components/shared/Navbar'
import Footer from '../components/shared/Footer'
import BestOfHeader from '../components/best-of/BestOfHeader'
import BestOfWinners from '../components/best-of/BestOfWinners'
import BestOfSidebar from '../components/best-of/BestOfSidebar'
import '../styles/best-of.css'

export default function BestOfPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
      <BestOfHeader />
      <div className="container">
        <div className="bo-layout">
          <BestOfWinners />
          <BestOfSidebar />
        </div>
      </div>
      <Footer />
    </>
  )
}
