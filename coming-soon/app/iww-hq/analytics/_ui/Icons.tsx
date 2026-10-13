'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faMagnifyingGlass, faRobot, faShareNodes, faEnvelope, faLink, faArrowPointer, faBullhorn,
  faRectangleAd, faHandshake, faTag, faDesktop, faMobileScreenButton, faTabletScreenButton,
  faGlobe, faUserPlus, faRightToBracket, faFileCirclePlus, faFlag, faStar, faPaperPlane,
  faCartShopping, faArrowUpRightFromSquare, faPhone, faFileArrowDown, faComments, faPenToSquare,
  faBug, faTriangleExclamation, faHandPointer, faCircleQuestion, faEye, faArrowRotateLeft,
} from '@fortawesome/free-solid-svg-icons'
import {
  faOpenai, faClaude, faGoogle, faMicrosoft, faYahoo, faYandex, faBrave, faLinkedin, faFacebook,
  faInstagram, faXTwitter, faReddit, faYoutube, faPinterest, faQuora, faTiktok, faThreads, faBluesky,
  faMastodon, faHackerNews, faProductHunt, faDiscord, faSlack, faTelegram, faWhatsapp, faSnapchat,
  faTumblr, faVk, faWeibo, faXing, faLine, faChrome, faFirefoxBrowser, faSafari, faEdge, faOpera,
  faInternetExplorer, faWindows, faApple, faAndroid, faLinux, faUbuntu, faYandexInternational,
} from '@fortawesome/free-brands-svg-icons'
import type { Channel } from '@/lib/analytics/types'
import { sourceDef, sourceLabel } from '@/lib/analytics/sources'
import { channelLabel, deviceLabel, eventLabel, isNone } from '../_lib/labels'
import { countryName } from '../_lib/format'

/* Font Awesome only (project rule). Brand names come from SourceDef.faBrand;
   only the brands actually referenced there are imported, so the bundle
   doesn't pull in the whole brands pack. */
const BRANDS: Record<string, IconDefinition> = {
  openai: faOpenai, google: faGoogle, microsoft: faMicrosoft, yahoo: faYahoo, yandex: faYandex,
  brave: faBrave, linkedin: faLinkedin, facebook: faFacebook, instagram: faInstagram,
  'x-twitter': faXTwitter, reddit: faReddit, youtube: faYoutube, pinterest: faPinterest,
  quora: faQuora, tiktok: faTiktok, threads: faThreads, bluesky: faBluesky, mastodon: faMastodon,
  'hacker-news': faHackerNews, 'product-hunt': faProductHunt, discord: faDiscord, slack: faSlack,
  telegram: faTelegram, whatsapp: faWhatsapp, snapchat: faSnapchat, tumblr: faTumblr, vk: faVk,
  weibo: faWeibo, xing: faXing, line: faLine,
}
/* Sources with an FA brand icon that sources.ts doesn't list (FA 7 added them). */
const SOURCE_BRAND_EXTRA: Record<string, IconDefinition> = { claude: faClaude }

const CHANNEL_ICONS: Record<Channel, IconDefinition> = {
  organic_search: faMagnifyingGlass,
  ai_assistant: faRobot,
  social: faShareNodes,
  email: faEnvelope,
  referral: faLink,
  direct: faArrowPointer,
  paid_search: faBullhorn,
  paid_social: faBullhorn,
  display: faRectangleAd,
  affiliate: faHandshake,
  other_campaign: faTag,
}

interface IconBaseProps {
  /** Extra class on the wrapper. */
  className?: string
  /** Show the name as a native tooltip (title). Default true. */
  titled?: boolean
}

/** Icon for a channel (search = magnifier, AI = robot...). */
export function ChannelIcon({ channel, className, titled = true }: { channel: string | null | undefined } & IconBaseProps) {
  const icon = CHANNEL_ICONS[channel as Channel] ?? faCircleQuestion
  return (
    <span className={'an-ico ' + (className ?? '')} title={titled ? channelLabel(channel) : undefined} aria-hidden="true">
      <FontAwesomeIcon icon={icon} />
    </span>
  )
}

/**
 * Icon for a traffic source: the brand (Google, ChatGPT, LinkedIn...) when
 * Font Awesome has it, else the channel's icon. Pass the channel when known
 * so unknown referrers still get a sensible icon.
 */
export function SourceIcon({ source, channel, className, titled = true }: { source?: string | null; channel?: string | null } & IconBaseProps) {
  const def = sourceDef(source)
  const brand = (source && SOURCE_BRAND_EXTRA[source]) || (def?.faBrand ? BRANDS[def.faBrand] : undefined)
  const ch = channel ?? def?.channel ?? (source === '(direct)' || source === '(internal)' ? 'direct' : null)
  const icon = brand ?? CHANNEL_ICONS[ch as Channel] ?? faGlobe
  return (
    <span className={'an-ico ' + (brand ? 'an-ico--brand ' : '') + (className ?? '')} title={titled ? sourceLabel(source ?? null) : undefined} aria-hidden="true">
      <FontAwesomeIcon icon={icon} />
    </span>
  )
}

/** Desktop / mobile / tablet. */
export function DeviceIcon({ device, className, titled = true }: { device: string | null | undefined } & IconBaseProps) {
  const icon = device === 'mobile' ? faMobileScreenButton : device === 'tablet' ? faTabletScreenButton : device === 'desktop' ? faDesktop : faCircleQuestion
  return (
    <span className={'an-ico ' + (className ?? '')} title={titled ? deviceLabel(device) : undefined} aria-hidden="true">
      <FontAwesomeIcon icon={icon} />
    </span>
  )
}

/** Browser brand by name as stored by the collector ("Chrome", "Edge", "Samsung Internet"...). */
export function BrowserIcon({ browser, className, titled = true }: { browser: string | null | undefined } & IconBaseProps) {
  const b = (browser ?? '').toLowerCase()
  const icon =
    b.includes('edge') ? faEdge
      : b.includes('opera') ? faOpera
        : b.includes('firefox') ? faFirefoxBrowser
          : b.includes('yandex') ? faYandexInternational
            : b.includes('safari') ? faSafari
              : b.includes('chrome') || b.includes('webview') || b.includes('samsung') || b.includes('vivaldi') ? faChrome
                : b === 'ie' || b.includes('explorer') ? faInternetExplorer
                  : b.includes('facebook') ? faFacebook
                    : b.includes('instagram') ? faInstagram
                      : b.includes('linkedin') ? faLinkedin
                        : b.includes('whatsapp') ? faWhatsapp
                          : b.includes('telegram') ? faTelegram
                            : faGlobe
  return (
    <span className={'an-ico ' + (className ?? '')} title={titled ? (browser || 'Unknown') : undefined} aria-hidden="true">
      <FontAwesomeIcon icon={icon} />
    </span>
  )
}

/** Operating system by name ("Windows", "macOS", "iOS", "Android"...). */
export function OsIcon({ os, className, titled = true }: { os: string | null | undefined } & IconBaseProps) {
  const o = (os ?? '').toLowerCase()
  const icon =
    o.includes('windows') ? faWindows
      : o.includes('mac') || o.includes('ios') || o.includes('ipad') ? faApple
        : o.includes('android') ? faAndroid
          : o.includes('chrome') ? faChrome
            : o.includes('ubuntu') ? faUbuntu
              : o.includes('linux') ? faLinux
                : faDesktop
  return (
    <span className={'an-ico ' + (className ?? '')} title={titled ? (os || 'Unknown') : undefined} aria-hidden="true">
      <FontAwesomeIcon icon={icon} />
    </span>
  )
}

/**
 * Country flag from flagcdn (same source as the rest of the site). Unknown
 * country -> a neutral globe. `alt` is the country name, so a flag is never
 * the only carrier of the information when it stands alone.
 */
export function CountryFlag({ code, className, decorative = false }: { code: string | null | undefined; className?: string; decorative?: boolean }) {
  const cc = (code ?? '').toLowerCase()
  if (isNone(code) || !/^[a-z]{2}$/.test(cc)) {
    return (
      <span className={'an-ico ' + (className ?? '')} title="Unknown country" aria-hidden="true">
        <FontAwesomeIcon icon={faGlobe} />
      </span>
    )
  }
  const name = countryName(code)
  return (
    // eslint-disable-next-line @next/next/no-img-element -- tiny CDN flag; next/image would add a request hop for a 20px icon
    <img
      className={'an-flag ' + (className ?? '')}
      src={`https://flagcdn.com/w40/${cc}.png`}
      alt={decorative ? '' : name}
      title={name}
      width={20}
      height={15}
      loading="lazy"
      decoding="async"
    />
  )
}

const EVENT_ICONS: Record<string, IconDefinition> = {
  signup_completed: faUserPlus,
  login: faRightToBracket,
  listing_submitted: faFileCirclePlus,
  claim_submitted: faFlag,
  review_submitted: faStar,
  lead_sent: faPaperPlane,
  contact_submitted: faEnvelope,
  purchase: faCartShopping,
  website_click: faArrowUpRightFromSquare,
  email_click: faEnvelope,
  phone_click: faPhone,
  outbound_click: faArrowUpRightFromSquare,
  file_download: faFileArrowDown,
  search: faMagnifyingGlass,
  signup_started: faUserPlus,
  login_started: faRightToBracket,
  review_started: faPenToSquare,
  chat_opened: faComments,
  share: faShareNodes,
  cta_click: faHandPointer,
  not_found: faTriangleExclamation,
  js_error: faBug,
}

/** Icon for an event name (custom events get a pointer). */
export function EventIcon({ name, className, titled = true }: { name: string | null | undefined } & IconBaseProps) {
  const icon = (name && EVENT_ICONS[name]) || faHandPointer
  return (
    <span className={'an-ico ' + (className ?? '')} title={titled ? eventLabel(name) : undefined} aria-hidden="true">
      <FontAwesomeIcon icon={icon} />
    </span>
  )
}

/** Icon for a pageview item in feeds/timelines (eye; back/forward gets a return arrow). */
export function PageviewIcon({ navType, className }: { navType?: string | null; className?: string }) {
  return (
    <span className={'an-ico ' + (className ?? '')} aria-hidden="true">
      <FontAwesomeIcon icon={navType === 'traverse' || navType === 'back_forward' ? faArrowRotateLeft : faEye} />
    </span>
  )
}
