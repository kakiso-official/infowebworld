import { headers } from 'next/headers'
import { createHash } from 'crypto'

const BOT_PATTERNS = [
  'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
  'yandexbot', 'sogou', 'exabot', 'ia_archiver',
  'facebookexternalhit', 'twitterbot', 'linkedinbot', 'whatsapp',
  'telegrambot', 'slackbot', 'discordbot', 'pinterestbot',
  'semrushbot', 'ahrefsbot', 'mj12bot', 'dotbot', 'rogerbot',
  'screaming frog', 'sitebulb', 'deepcrawl',
  'bot/', 'spider/', 'crawl', 'scraper', 'fetch', 'archiver',
  'headlesschrome', 'phantomjs', 'puppeteer', 'playwright',
  'selenium', 'wget', 'curl/', 'python-requests', 'python-urllib',
  'go-http-client', 'java/', 'apache-httpclient', 'okhttp',
  'node-fetch', 'axios/', 'http_request', 'libwww-perl',
  'mechanize', 'scrapy', 'nutch', 'colly',
  'preview', 'thumbnail', 'snap url',
  'uptimerobot', 'pingdom', 'statuscake', 'site24x7',
  'newrelic', 'datadog', 'gtmetrix', 'pagespeed',
]

export async function isBot(): Promise<boolean> {
  const h = await headers()
  const ua = (h.get('user-agent') || '').toLowerCase()
  if (!ua) return true
  return BOT_PATTERNS.some(p => ua.includes(p))
}

export async function detectDevice(): Promise<string> {
  const h = await headers()
  const ua = (h.get('user-agent') || '').toLowerCase()
  if (!ua) return 'desktop'
  if (/ipad|tablet|playbook|silk|kindle|nexus\s?(7|9|10)/i.test(ua)) return 'tablet'
  if (/mobile|android|iphone|ipod|opera\s?mini|iemobile|wp7|wp8|blackberry|bb10|windows\s?phone|symbian|webos/i.test(ua)) return 'mobile'
  return 'desktop'
}

export async function getCountryCode(): Promise<string | null> {
  const h = await headers()
  // Vercel provides x-vercel-ip-country, Cloudflare provides cf-ipcountry
  const cc = h.get('x-vercel-ip-country') || h.get('cf-ipcountry') || null
  if (cc && cc !== 'XX' && cc.length === 2) return cc.toUpperCase()
  return null
}

export async function getClientIp(): Promise<string> {
  const h = await headers()
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || '0.0.0.0'
}

export async function getUserAgent(): Promise<string> {
  const h = await headers()
  return (h.get('user-agent') || '').slice(0, 500)
}

export function getVisitorHash(ip: string, ua: string): string {
  const day = new Date().toISOString().slice(0, 10)
  return createHash('sha256').update(`${ip}|${ua}|${day}`).digest('hex')
}
