import { useState, useEffect } from 'react'

const allImages = [
  '/images/Gusranda26 Author Portfolio _ Freepik.jpeg',
  '/images/Homeopathy Close Up.jpeg',
  '/images/Office 📍.jpeg',
  '/images/anthropomorphic-portrait-animal-dressed-human-clothes-doing-daily-activities.jpg',
  '/images/front-view-woman-reading-newspaper.jpg',
  '/images/man-restroom-reading-newspaper.jpg',
  '/images/#fitness #workout #gym #gymlife #health….jpeg',
]

export { allImages }

export default function RotatingImage({ images = allImages, interval = 4000, alt = '', startIndex = 0 }) {
  const [current, setCurrent] = useState(startIndex % images.length)

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length)
    }, interval)
    return () => clearInterval(timer)
  }, [images.length, interval])

  return (
    <>
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={alt}
          loading="lazy"
          className={`rot-img ${i === current ? 'rot-img--active' : ''}`}
        />
      ))}
    </>
  )
}
