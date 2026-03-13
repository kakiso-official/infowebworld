import Navbar from './Navbar'
import Footer from './Footer'

export default function SharedLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
