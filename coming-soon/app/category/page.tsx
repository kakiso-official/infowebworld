import { Suspense } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CategoryPage from './CategoryPage'

export default function CategoryDetailPage() {
  return (
    <>
      <Navbar />
      <Suspense><CategoryPage /></Suspense>
      <Footer />
    </>
  )
}
