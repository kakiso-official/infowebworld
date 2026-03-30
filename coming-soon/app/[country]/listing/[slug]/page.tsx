import { redirect } from 'next/navigation'

export default async function ListingSlugRedirect({
  params,
}: {
  params: Promise<{ country: string; slug: string }>
}) {
  const { country, slug } = await params
  redirect(`/${country}/company/${slug}`)
}
