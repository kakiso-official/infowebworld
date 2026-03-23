import type { Metadata } from 'next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CategoriesBrowse from './CategoriesBrowse'

export const metadata: Metadata = {
  title: 'Browse Categories | InfoWebWorld',
  description: 'Explore business categories and find listings across industries on InfoWebWorld.',
}

export default function CategoriesPage() {
  return (
    <>
      <Navbar />
      <CategoriesBrowse />
      <Footer />
    </>
  )
}
