import { redirect } from 'next/navigation'
import { countryHref } from '@/app/config/countries'

export default async function ListingSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug  } = await params; const country = ""
  redirect(countryHref(country, `/company/${slug}`))
}
