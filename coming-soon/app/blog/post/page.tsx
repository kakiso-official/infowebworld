import { redirect } from 'next/navigation'

/* Legacy route. The canonical blog post URL is /blog/[slug]; this old
   /blog/post?slug=… path now 301-redirects there (or to the blog index). */
export default async function BlogPostRedirect({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string | string[] }>
}) {
  const sp = await searchParams
  const slug = Array.isArray(sp.slug) ? sp.slug[0] : sp.slug
  redirect(slug ? `/blog/${encodeURIComponent(slug)}` : '/blog')
}
