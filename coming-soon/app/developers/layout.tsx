import type { Metadata } from 'next'
import type { ReactNode } from 'react'
/* Font Awesome's own sizing CSS. FA only injects it at runtime when a client
   component renders an icon, so server-rendered icons would show unsized. */
import '@fortawesome/fontawesome-svg-core/styles.css'
import '../styles/developers/base.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DvSubnav from './_components/shell/DvSubnav'
import { DEV_SECTION_TITLE } from '@/lib/developers/seo'

/* ═══════════════════════════════════════════════════════════════════════
   InfoWebWorld for Developers (/developers/**): one shell for the section.

     Navbar (fixed header + its own spacer)
     <div class="dv">                    every section style is scoped here
       DvSubnav                          sticky at top 0, z 40, under the header
       <main id="dv-content">            the page; the skip link lands here
     Footer

   The sub-nav sits outside <main> so "Skip to content" (its first link)
   really skips it. No data, no request APIs and no Suspense here, so pages
   stay static/ISR and notFound() keeps a real 404 status. .dv must never
   get overflow hidden: it would break the sticky sub-nav.
   ═══════════════════════════════════════════════════════════════════════ */

/* Fallback only: every page sets its own title. */
export const metadata: Metadata = { title: DEV_SECTION_TITLE }

export default function DevelopersLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Navbar />
      <div className="dv">
        <DvSubnav />
        <main id="dv-content" className="dv-main" tabIndex={-1}>
          {children}
        </main>
      </div>
      <Footer />
    </>
  )
}
