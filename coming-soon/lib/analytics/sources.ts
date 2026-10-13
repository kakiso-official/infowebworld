import type { Channel } from './types'

/* ═══════════════════════════════════════════════════════════════════════════
   Known traffic sources - one table used by the collector (to classify a
   referrer or utm_source) and by the reports (to show a friendly name and
   pick an icon). Isomorphic.

   `key` is what an_sessions.source stores for known sources. Unknown
   referrers store their host (www. stripped), unknown utm_source values
   store the lower-cased value.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface SourceDef {
  key: string
  label: string
  channel: Channel
  /** Exact hosts (lower-case, without a leading "www."). */
  hosts?: string[]
  /** Host patterns for families like google.co.uk, yandex.ru. */
  patterns?: RegExp[]
  /** Extra utm_source spellings that mean this source. */
  aliases?: string[]
  /** Font Awesome brand icon name (free-brands), when one exists. */
  faBrand?: string
}

export const SOURCES: SourceDef[] = [
  /* ── AI assistants (checked before search engines: gemini.google.com etc.) */
  { key: 'chatgpt',    label: 'ChatGPT',     channel: 'ai_assistant', hosts: ['chatgpt.com', 'chat.openai.com', 'openai.com'], aliases: ['chatgpt.com', 'chatgpt', 'openai', 'gpt'], faBrand: 'openai' },
  { key: 'perplexity', label: 'Perplexity',  channel: 'ai_assistant', hosts: ['perplexity.ai'], aliases: ['perplexity.ai', 'perplexity'] },
  { key: 'claude',     label: 'Claude',      channel: 'ai_assistant', hosts: ['claude.ai'], aliases: ['claude.ai', 'claude', 'anthropic'] },
  { key: 'gemini',     label: 'Gemini',      channel: 'ai_assistant', hosts: ['gemini.google.com', 'bard.google.com'], aliases: ['gemini', 'bard'] },
  { key: 'copilot',    label: 'Copilot',     channel: 'ai_assistant', hosts: ['copilot.microsoft.com', 'copilot.cloud.microsoft', 'm365.cloud.microsoft'], aliases: ['copilot', 'bing_chat'] },
  { key: 'deepseek',   label: 'DeepSeek',    channel: 'ai_assistant', hosts: ['chat.deepseek.com', 'deepseek.com'], aliases: ['deepseek'] },
  { key: 'meta_ai',    label: 'Meta AI',     channel: 'ai_assistant', hosts: ['meta.ai'], aliases: ['meta.ai', 'meta_ai'] },
  { key: 'grok',       label: 'Grok',        channel: 'ai_assistant', hosts: ['grok.com', 'x.ai'], aliases: ['grok'] },
  { key: 'mistral',    label: 'Le Chat (Mistral)', channel: 'ai_assistant', hosts: ['chat.mistral.ai'], aliases: ['mistral', 'lechat'] },
  { key: 'you',        label: 'You.com',     channel: 'ai_assistant', hosts: ['you.com'], aliases: ['you.com'] },
  { key: 'phind',      label: 'Phind',       channel: 'ai_assistant', hosts: ['phind.com'] },
  { key: 'poe',        label: 'Poe',         channel: 'ai_assistant', hosts: ['poe.com'] },
  { key: 'duck_ai',    label: 'Duck.ai',     channel: 'ai_assistant', hosts: ['duck.ai'] },
  { key: 'qwen',       label: 'Qwen',        channel: 'ai_assistant', hosts: ['chat.qwen.ai', 'tongyi.aliyun.com'] },
  { key: 'kimi',       label: 'Kimi',        channel: 'ai_assistant', hosts: ['kimi.com', 'kimi.moonshot.cn'] },

  /* ── Email (before search: mail.google.com) */
  { key: 'gmail',      label: 'Gmail',       channel: 'email', hosts: ['mail.google.com', 'gmail.com', 'com.google.android.gm', 'com.google.android.gm.lite'], faBrand: 'google' },
  { key: 'outlook',    label: 'Outlook',     channel: 'email', hosts: ['outlook.live.com', 'outlook.office.com', 'outlook.office365.com', 'outlook.com'], faBrand: 'microsoft' },
  { key: 'yahoo_mail', label: 'Yahoo Mail',  channel: 'email', hosts: ['mail.yahoo.com'], faBrand: 'yahoo' },
  { key: 'proton_mail', label: 'Proton Mail', channel: 'email', hosts: ['mail.proton.me', 'mail.protonmail.com'] },
  { key: 'zoho_mail',  label: 'Zoho Mail',   channel: 'email', hosts: ['mail.zoho.com', 'mail.zoho.in'] },

  /* ── Search engines */
  /* google.* except product subdomains that link like ordinary websites
     (Docs, Sites, Drive, News, Play, Search Console...) - those stay referrals. */
  { key: 'google',     label: 'Google',      channel: 'organic_search', patterns: [/^(?!(docs|sites|drive|groups|news|play|support|developers|cloud|console|ads|analytics|search|business|calendar|meet|photos|chrome)\.)([a-z0-9-]+\.)?google\.[a-z]{2,3}(\.[a-z]{2})?$/], hosts: ['com.google.android.googlequicksearchbox'], aliases: ['google'], faBrand: 'google' },
  { key: 'bing',       label: 'Bing',        channel: 'organic_search', hosts: ['bing.com', 'cn.bing.com'], aliases: ['bing'], faBrand: 'microsoft' },
  { key: 'duckduckgo', label: 'DuckDuckGo',  channel: 'organic_search', hosts: ['duckduckgo.com', 'html.duckduckgo.com', 'lite.duckduckgo.com'], aliases: ['duckduckgo', 'ddg'] },
  { key: 'yahoo',      label: 'Yahoo',       channel: 'organic_search', patterns: [/^(.+\.)?search\.yahoo\.com$/, /^(.+\.)?yahoo\.(com|co\.[a-z]{2}|[a-z]{2})$/], aliases: ['yahoo'], faBrand: 'yahoo' },
  { key: 'yandex',     label: 'Yandex',      channel: 'organic_search', patterns: [/^(.+\.)?yandex\.[a-z.]+$/], hosts: ['ya.ru'], aliases: ['yandex'], faBrand: 'yandex' },
  { key: 'baidu',      label: 'Baidu',       channel: 'organic_search', hosts: ['baidu.com', 'm.baidu.com'], aliases: ['baidu'] },
  { key: 'ecosia',     label: 'Ecosia',      channel: 'organic_search', hosts: ['ecosia.org'], aliases: ['ecosia'] },
  { key: 'brave',      label: 'Brave Search', channel: 'organic_search', hosts: ['search.brave.com'], aliases: ['brave'], faBrand: 'brave' },
  { key: 'startpage',  label: 'Startpage',   channel: 'organic_search', hosts: ['startpage.com'] },
  { key: 'qwant',      label: 'Qwant',       channel: 'organic_search', hosts: ['qwant.com'] },
  { key: 'naver',      label: 'Naver',       channel: 'organic_search', hosts: ['naver.com', 'search.naver.com', 'm.search.naver.com'] },
  { key: 'seznam',     label: 'Seznam',      channel: 'organic_search', hosts: ['seznam.cz', 'search.seznam.cz'] },
  { key: 'sogou',      label: 'Sogou',       channel: 'organic_search', hosts: ['sogou.com', 'm.sogou.com'] },
  { key: 'so360',      label: '360 Search',  channel: 'organic_search', hosts: ['so.com', 'm.so.com'] },
  { key: 'aol',        label: 'AOL Search',  channel: 'organic_search', hosts: ['search.aol.com'] },
  { key: 'ask',        label: 'Ask',         channel: 'organic_search', hosts: ['ask.com'] },
  { key: 'yep',        label: 'Yep',         channel: 'organic_search', hosts: ['yep.com'] },
  { key: 'kagi',       label: 'Kagi',        channel: 'organic_search', hosts: ['kagi.com'] },
  { key: 'mojeek',     label: 'Mojeek',      channel: 'organic_search', hosts: ['mojeek.com'] },
  { key: 'petal',      label: 'Petal Search', channel: 'organic_search', hosts: ['petalsearch.com'] },
  { key: 'coccoc',     label: 'Cốc Cốc',     channel: 'organic_search', hosts: ['coccoc.com'] },

  /* ── Social networks and communities */
  { key: 'linkedin',   label: 'LinkedIn',    channel: 'social', hosts: ['linkedin.com', 'lnkd.in', 'com.linkedin.android'], aliases: ['linkedin', 'li'], faBrand: 'linkedin' },
  { key: 'facebook',   label: 'Facebook',    channel: 'social', hosts: ['facebook.com', 'm.facebook.com', 'l.facebook.com', 'lm.facebook.com', 'web.facebook.com', 'fb.com', 'fb.me', 'com.facebook.katana'], aliases: ['facebook', 'fb'], faBrand: 'facebook' },
  { key: 'instagram',  label: 'Instagram',   channel: 'social', hosts: ['instagram.com', 'l.instagram.com', 'com.instagram.android'], aliases: ['instagram', 'ig'], faBrand: 'instagram' },
  { key: 'x',          label: 'X (Twitter)', channel: 'social', hosts: ['t.co', 'twitter.com', 'x.com', 'mobile.twitter.com'], aliases: ['twitter', 'x', 'x.com'], faBrand: 'x-twitter' },
  { key: 'reddit',     label: 'Reddit',      channel: 'social', hosts: ['reddit.com', 'old.reddit.com', 'out.reddit.com', 'np.reddit.com', 'new.reddit.com'], aliases: ['reddit'], faBrand: 'reddit' },
  { key: 'youtube',    label: 'YouTube',     channel: 'social', hosts: ['youtube.com', 'm.youtube.com', 'youtu.be', 'com.google.android.youtube'], aliases: ['youtube', 'yt'], faBrand: 'youtube' },
  { key: 'pinterest',  label: 'Pinterest',   channel: 'social', patterns: [/^(.+\.)?pinterest\.[a-z.]+$/], hosts: ['pin.it'], aliases: ['pinterest'], faBrand: 'pinterest' },
  { key: 'quora',      label: 'Quora',       channel: 'social', hosts: ['quora.com'], aliases: ['quora'], faBrand: 'quora' },
  { key: 'tiktok',     label: 'TikTok',      channel: 'social', hosts: ['tiktok.com'], aliases: ['tiktok'], faBrand: 'tiktok' },
  { key: 'threads',    label: 'Threads',     channel: 'social', hosts: ['threads.net', 'threads.com'], aliases: ['threads'], faBrand: 'threads' },
  { key: 'bluesky',    label: 'Bluesky',     channel: 'social', hosts: ['bsky.app'], aliases: ['bluesky', 'bsky'], faBrand: 'bluesky' },
  { key: 'mastodon',   label: 'Mastodon',    channel: 'social', patterns: [/(^|\.)mastodon\./, /^mas\.to$/], aliases: ['mastodon'], faBrand: 'mastodon' },
  { key: 'hacker_news', label: 'Hacker News', channel: 'social', hosts: ['news.ycombinator.com'], aliases: ['hackernews', 'hn'], faBrand: 'hacker-news' },
  { key: 'product_hunt', label: 'Product Hunt', channel: 'social', hosts: ['producthunt.com'], aliases: ['producthunt', 'product_hunt'], faBrand: 'product-hunt' },
  { key: 'discord',    label: 'Discord',     channel: 'social', hosts: ['discord.com', 'discordapp.com'], aliases: ['discord'], faBrand: 'discord' },
  { key: 'slack',      label: 'Slack',       channel: 'social', hosts: ['slack.com', 'app.slack.com', 'com.slack'], aliases: ['slack'], faBrand: 'slack' },
  { key: 'telegram',   label: 'Telegram',    channel: 'social', hosts: ['t.me', 'web.telegram.org', 'org.telegram.messenger'], aliases: ['telegram'], faBrand: 'telegram' },
  { key: 'whatsapp',   label: 'WhatsApp',    channel: 'social', hosts: ['wa.me', 'web.whatsapp.com', 'api.whatsapp.com', 'com.whatsapp'], aliases: ['whatsapp', 'wa'], faBrand: 'whatsapp' },
  { key: 'snapchat',   label: 'Snapchat',    channel: 'social', hosts: ['snapchat.com'], aliases: ['snapchat'], faBrand: 'snapchat' },
  { key: 'tumblr',     label: 'Tumblr',      channel: 'social', hosts: ['tumblr.com'], faBrand: 'tumblr' },
  { key: 'vk',         label: 'VK',          channel: 'social', hosts: ['vk.com'], faBrand: 'vk' },
  { key: 'weibo',      label: 'Weibo',       channel: 'social', hosts: ['weibo.com'], faBrand: 'weibo' },
  { key: 'xing',       label: 'XING',        channel: 'social', hosts: ['xing.com'], faBrand: 'xing' },
  { key: 'line',       label: 'LINE',        channel: 'social', hosts: ['line.me'], faBrand: 'line' },
]

/** Referrers that are part of our own flows (sign-in, payment) - never a new traffic source. */
export const EXCLUDED_REFERRER_HOSTS = [
  'infowebworld.com', 'accounts.google.com', 'accounts.youtube.com',
  'paypal.com', 'sandbox.paypal.com', 'checkout.stripe.com',
  'appleid.apple.com', 'login.microsoftonline.com', 'login.live.com',
  'localhost', '127.0.0.1',
]

/** Hosts that end with one of these are excluded too (preview deploys, our subdomains). */
export const EXCLUDED_REFERRER_SUFFIXES = ['.infowebworld.com', '.vercel.app', '.sslip.io']

const BY_HOST = new Map<string, SourceDef>()
const BY_ALIAS = new Map<string, SourceDef>()
const BY_KEY = new Map<string, SourceDef>()
for (const s of SOURCES) {
  BY_KEY.set(s.key, s)
  BY_ALIAS.set(s.key, s)
  for (const h of s.hosts ?? []) { BY_HOST.set(h, s); BY_ALIAS.set(h, s) }
  for (const a of s.aliases ?? []) BY_ALIAS.set(a, s)
}

/** Lower-case a host, drop a leading "www." / "m." mobile prefix is kept (handled by hosts lists). */
export function normalizeHost(host: string): string {
  return host.trim().toLowerCase().replace(/^www\./, '').replace(/\.$/, '')
}

/** Known source for a referrer host (or android-app package), else null. */
export function sourceForHost(rawHost: string): SourceDef | null {
  const host = normalizeHost(rawHost)
  if (!host) return null
  const exact = BY_HOST.get(host)
  if (exact) return exact
  for (const s of SOURCES) if (s.patterns?.some(re => re.test(host))) return s
  return null
}

/** Known source for a utm_source value (e.g. "chatgpt.com", "LinkedIn", "fb"), else null. */
export function sourceForUtm(utmSource: string): SourceDef | null {
  const v = utmSource.trim().toLowerCase().replace(/^www\./, '')
  if (!v) return null
  return BY_ALIAS.get(v) ?? sourceForHost(v)
}

export function isExcludedReferrerHost(rawHost: string): boolean {
  const host = normalizeHost(rawHost)
  if (!host) return false
  return EXCLUDED_REFERRER_HOSTS.includes(host) || EXCLUDED_REFERRER_SUFFIXES.some(sfx => host.endsWith(sfx))
}

/** Display name for a stored an_sessions.source value. */
export function sourceLabel(source: string | null | undefined): string {
  if (!source) return '(unknown)'
  if (source === '(direct)') return 'Direct'
  if (source === '(internal)') return 'Returning tab'
  return BY_KEY.get(source)?.label ?? source
}

export function sourceDef(source: string | null | undefined): SourceDef | null {
  return source ? BY_KEY.get(source) ?? null : null
}
