import { permanentRedirect } from 'next/navigation'

/* The directory landing is now the live homepage (app/page.tsx). This route
   permanently redirects to / so any old /test-landing-page links resolve to
   the canonical home. The section components still live in this folder and
   are imported by the homepage — only the route moved. */
export default function TestLandingPage() {
  permanentRedirect('/')
}
