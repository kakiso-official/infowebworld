import { NextResponse } from 'next/server'
import { buildCategorySitemap } from '../sitemap-category.xml/route'

export async function GET() {
  const xml = await buildCategorySitemap('eu')
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
