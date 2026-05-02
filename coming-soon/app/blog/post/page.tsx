import { Suspense } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import BlogReader from './BlogReader'

export default function BlogPostPage() {
  return (
    <>
      <Navbar />
      <Suspense><BlogReader /></Suspense>
      <Footer />
    </>
  )
}
