import type { Metadata } from 'next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ContactPage from './ContactPage'

export const metadata: Metadata = {
  title: 'Contact Us - InfoWebWorld.com',
  description: 'Get in touch with the InfoWebWorld team. We\'d love to hear from you — questions, partnerships, business inquiries, or feedback.',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <ContactPage />
      <Footer />
    </>
  )
}
