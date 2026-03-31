import { Suspense } from 'react'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import CategoryPage from '../CategoryPage'

export default async function CategoryDetailRoute({
  params,
}: {
  params: Promise<{ segments: string[] }>
}) {
  const { segments } = await params
  return (
    <>
      <Navbar />
      <Suspense><CategoryPage segments={segments} /></Suspense>
      <Footer />
    </>
  )
}
