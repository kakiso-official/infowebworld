import { redirect } from 'next/navigation'
import { countryHref } from '@/app/config/countries'

export default async function ListingSlugRedirect({
  params,
}: {
  params: Promise<{ country: string; slug: string }>
}) {
  const { country, slug } = await params
  redirect(countryHref(country, `/company/${slug}`))
}
