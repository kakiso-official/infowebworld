import { useState, useEffect } from 'react'
import Navbar from '../components/shared/Navbar'
import Footer from '../components/shared/Footer'
import PricingHeader from '../components/pricing/PricingHeader'
import PricingCards from '../components/pricing/PricingCards'
import PricingTrust from '../components/pricing/PricingTrust'
import PricingCompare from '../components/pricing/PricingCompare'
import PricingFAQ from '../components/pricing/PricingFAQ'
import '../styles/pricing.css'

export default function PricingPage() {
  const [annual, setAnnual] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
      <PricingHeader annual={annual} setAnnual={setAnnual} />
      <PricingCards annual={annual} />
      <PricingTrust />
      <PricingCompare />
      <PricingFAQ />
      <Footer />
    </>
  )
}
