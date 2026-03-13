import { useEffect } from 'react'
import '../styles/landing.css'
import LandingNav from '../components/landing/LandingNav'
import Hero from '../components/landing/Hero'
import Logos from '../components/landing/Logos'
import Categories from '../components/landing/Categories'
import Featured from '../components/landing/Featured'
import Reviews from '../components/landing/Reviews'
import News from '../components/landing/News'
import Trending from '../components/landing/Trending'
import ValueProps from '../components/landing/ValueProps'
import Testimonials from '../components/landing/Testimonials'
import Cta from '../components/landing/Cta'
import LandingFooter from '../components/landing/LandingFooter'

export default function HomePage() {
  useEffect(() => {
    // Fade-in animations
    const fadeSections = document.querySelectorAll('.fade-section')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
    fadeSections.forEach(el => observer.observe(el))

    // Staggered grid animations
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const children = entry.target.querySelectorAll('.cat-card, .listing-card, .review-card, .review-card-v2, .review-featured, .trending-item, .trend-podium-card, .trend-row, .trend-item, .prop-card, .test-card, .news-compact, .news-card-v2')
          children.forEach((child, i) => {
            child.style.opacity = '0'
            child.style.transform = 'translateY(16px)'
            child.style.transition = 'opacity .5s cubic-bezier(.16,1,.3,1), transform .5s cubic-bezier(.16,1,.3,1)'
            child.style.transitionDelay = (i * 0.06) + 's'
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                child.style.opacity = '1'
                child.style.transform = 'translateY(0)'
              })
            })
          })
          staggerObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.05 })

    document.querySelectorAll('.categories-grid, .featured-masonry, .featured-grid, .reviews-grid-v2, .trend-grid, .props-grid, .testimonials-grid, .news-grid-v2').forEach(grid => {
      staggerObserver.observe(grid)
    })

    return () => {
      observer.disconnect()
      staggerObserver.disconnect()
    }
  }, [])

  return (
    <div id="app">
      <LandingNav />
      <Hero />
      <Logos />
      <Categories />
      <Featured />
      <Reviews />
      <News />
      <Trending />
      <ValueProps />
      <Testimonials />
      <Cta />
      <LandingFooter />
    </div>
  )
}
