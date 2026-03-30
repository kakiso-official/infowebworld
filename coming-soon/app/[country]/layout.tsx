import { notFound } from 'next/navigation'
import { isValidCountry, VALID_COUNTRIES } from '../config/countries'
import type { CountryCode } from '../config/countries'
import { CountryProvider } from '../config/country-context'

export async function generateStaticParams() {
  return VALID_COUNTRIES.map(c => ({ country: c }))
}

export default async function CountryLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ country: string }>
}) {
  const { country } = await params
  if (!isValidCountry(country)) notFound()

  return (
    <CountryProvider country={country as CountryCode}>
      {children}
    </CountryProvider>
  )
}
