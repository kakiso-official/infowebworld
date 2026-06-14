/* Pre-made email templates for Admin → Email Marketing.
   Curated, branded, ready to send. Each one uses {{name}} / {{email}}
   personalization (substituted per recipient at send time). Kept in code so
   they're always available without seeding the DB; the admin can "Use" one in
   Compose or "Save to my templates" to persist an editable copy. */

export type EmailPreset = {
  id: string
  name: string
  category: string
  subject: string
  description: string
  html: string
}

const SITE = 'https://www.infowebworld.com'
const LOGO = `${SITE}/logo/infowebworldlogo-logoforlightbackgrounds.png`

/* Inter everywhere. The @import makes the live preview + web-font-capable email
   clients render Inter; the stack falls back cleanly elsewhere (Gmail etc.). */
const INTER = "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"

/** Google Noto Emoji as a PNG (renders in every client as an image — unlike
   icon fonts/SVG, which Gmail & Outlook strip). Served from the jsDelivr CDN. */
const ICON = (cp: string) => `https://cdn.jsdelivr.net/gh/googlefonts/noto-emoji/png/128/emoji_u${cp}.png`

/** Premium, mobile-responsive email shell — a full HTML document with a
   viewport meta + media queries (padding & sizes shrink on phones, the CTA goes
   full-width), soft canvas, centered logo, white rounded card with a soft
   shadow, and a clean footer. Table-based + inline styles + !important media
   overrides for consistent rendering across email clients. */
function shell(inner: string, _accent = '#E8553D'): string {
  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');</style>
<style>
  body{margin:0;padding:0;width:100%!important}
  img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic}
  a{text-decoration:none}
  @media only screen and (max-width:600px){
    .em-outer{padding:14px 8px 30px!important}
    .em-card{padding:28px 20px 26px!important;border-radius:14px!important}
    .em-h1{font-size:23px!important;line-height:1.28!important}
    .em-hero-p{font-size:14.5px!important}
    .em-btn-tbl{width:100%!important}
    .em-btn-a{display:block!important;text-align:center!important;padding:15px 20px!important}
  }
</style>
</head>
<body style="margin:0;padding:0;background:#F4F2EF;font-family:${INTER}">
  <div class="em-outer" style="max-width:600px;margin:0 auto;padding:30px 14px 40px">
    <div style="text-align:center;padding:4px 0 22px">
      <img src="${LOGO}" alt="InfoWebWorld" width="150" style="display:inline-block;max-width:150px;height:auto;border:0">
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #ECEAE6;border-radius:18px;box-shadow:0 12px 34px -14px rgba(20,16,14,.14)">
      <tr><td class="em-card" style="padding:44px 42px 40px">
${inner}
      </td></tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:26px 24px 0;text-align:center">
        <div style="font-size:13px;font-weight:800;color:#1A1A1A;letter-spacing:-.01em">InfoWebWorld</div>
        <div style="margin:8px 0 0">
          <a href="https://www.linkedin.com/company/infowebworld/" style="color:#9A9590;font-size:12.5px;font-weight:600;text-decoration:none;margin:0 7px">LinkedIn</a>
          <a href="https://x.com/infowebworld_x" style="color:#9A9590;font-size:12.5px;font-weight:600;text-decoration:none;margin:0 7px">X</a>
          <a href="https://www.instagram.com/infowebworld" style="color:#9A9590;font-size:12.5px;font-weight:600;text-decoration:none;margin:0 7px">Instagram</a>
        </div>
        <div style="margin:14px 0 0;font-size:12px;line-height:1.7;color:#A8A39E">
          Brain Stream Australia Pty Ltd &middot; Parramatta, NSW 2150, Australia<br>
          You're receiving this because you signed up at infowebworld.com. &nbsp;<a href="mailto:hello@infowebworld.com?subject=Unsubscribe" style="color:#A8A39E;text-decoration:underline">Unsubscribe</a>
        </div>
      </td></tr>
    </table>
  </div>
</body></html>`
}

/** Premium centered CTA button (table-wrapped, bulletproof for email). */
function button(text: string, href: string, accent = '#E8553D'): string {
  return `        <div style="text-align:center;margin:30px 0 6px">
          <table role="presentation" class="em-btn-tbl" cellpadding="0" cellspacing="0" style="display:inline-block"><tr>
            <td style="border-radius:12px;background:${accent}">
              <a class="em-btn-a" href="${href}" style="display:inline-block;padding:14px 34px;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;border-radius:12px;letter-spacing:.01em">${text}</a>
            </td></tr></table>
        </div>`
}

/** Premium feature row: a rounded tinted tile holding a PNG icon (Noto Emoji,
   renders everywhere as an image) + a title and description beside it. */
function iconRow(cp: string, title: string, desc: string): string {
  return `        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px"><tr>
          <td valign="top" width="52" style="width:52px">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr><td width="46" height="46" style="width:46px;height:46px;border-radius:13px;background:#FBF1ED;text-align:center;vertical-align:middle">
              <img src="${ICON(cp)}" alt="" width="24" height="24" style="display:inline-block;vertical-align:middle;border:0">
            </td></tr></table>
          </td>
          <td valign="middle" style="padding-left:15px">
            <div style="font-weight:700;color:#1A1A1A;font-size:15.5px;margin-bottom:3px;letter-spacing:-.01em">${title}</div>
            <div style="color:#6B6560;font-size:13.5px;line-height:1.55">${desc}</div>
          </td></tr></table>`
}

const h1 = (t: string) => `        <h1 style="margin:0 0 14px;font-size:23px;line-height:1.3;color:#1A1A1A;font-weight:800">${t}</h1>`
const p = (t: string) => `        <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#4A4540">${t}</p>`

export const EMAIL_PRESETS: EmailPreset[] = [
  {
    id: 'company-outreach',
    name: 'Company outreach (with profile)',
    category: 'Outreach',
    subject: '{{company_name}}, we built your profile on InfoWebWorld 👀',
    description: 'For the Companies audience — shows a live, browser-framed preview of the full /profile page built for each company, with a claim CTA. Tokens: {{company_name}}, {{listing_preview}}, {{claim_url}}.',
    html: shell(
      `        <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#C2410C;margin:0 0 10px">A profile, built for you</div>` +
      h1('We built {{company_name}} a profile on InfoWebWorld') +
      p('Hi {{company_name}} team — we feature standout companies across the technology and services world, and we’ve put together a complete, professional profile for you on InfoWebWorld, our global business directory. Here’s the full page, live:') +
      `        <div style="margin:6px 0 24px">{{listing_preview}}</div>` +
      p('It’s ready and working for you right now. Here’s what it gives {{company_name}}:') +
      iconRow('2705', 'A verified, SEO-ready profile', 'Your services, awards, clients and reviews on one page that ranks — with a dofollow backlink to your website.') +
      iconRow('1f4ac', 'Reviews &amp; qualified leads', 'Collect verified client reviews and receive enquiries from buyers browsing your category.') +
      iconRow('1f6e1', 'Claim it free in under a minute', 'Verify with a work email on your domain and you instantly own the page — edit anything, anytime.') +
      button('Claim your free profile', '{{claim_url}}') +
      `        <p style="margin:22px 0 0;text-align:center;font-size:13.5px;line-height:1.6;color:#9A9590">Not the right person? Please forward this to whoever runs {{company_name}}’s marketing — or just reply and we’ll help.</p>`
    ),
  },
  {
    id: 'welcome',
    name: 'Welcome',
    category: 'Onboarding',
    subject: 'Welcome to InfoWebWorld, {{name}} 👋',
    description: 'Greet new sign-ups and point them to their first action.',
    html: shell(
      `        <div style="text-align:center">
          <table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:0 auto"><tr><td width="80" height="80" style="width:80px;height:80px;border-radius:50%;background:#FCEEE9;text-align:center;vertical-align:middle">
            <img src="${ICON('1f44b')}" alt="Welcome" width="42" height="42" style="display:inline-block;vertical-align:middle;border:0">
          </td></tr></table>
        </div>
        <h1 class="em-h1" style="margin:20px 0 12px;text-align:center;font-size:27px;line-height:1.25;color:#1A1A1A;font-weight:800;letter-spacing:-.02em">Welcome aboard, {{name}}!</h1>
        <p class="em-hero-p" style="margin:0 auto 30px;max-width:432px;text-align:center;font-size:15.5px;line-height:1.65;color:#5A5550">We're thrilled to have you. InfoWebWorld is where you discover, compare and review the best software, agencies and professionals across 80+ industries.</p>` +
      iconRow('1f9ed', 'Discover verified businesses', 'Find the best providers in your industry, backed by real reviews.') +
      iconRow('1f6e1', 'Claim your listing', 'Take ownership of your business and earn the Verified badge — free.') +
      iconRow('2b50', 'Leave honest reviews', 'Help thousands of buyers choose with confidence.') +
      button('Explore InfoWebWorld', SITE) +
      `        <p style="margin:22px 0 0;text-align:center;font-size:13.5px;line-height:1.6;color:#9A9590">Questions? Just reply to this email — a real person reads every one.</p>`
    ),
  },
  {
    id: 'claim-listing',
    name: 'Claim your listing',
    category: 'Growth',
    subject: 'Is your business on InfoWebWorld, {{name}}?',
    description: 'Nudge users to claim and verify their business listing.',
    html: shell(
      h1('Claim your free business listing') +
      p('Hi {{name}}, your business may already be listed on InfoWebWorld. Claim it to take control — it’s free and takes about a minute.') +
      `        <ul style="margin:0 0 8px;padding-left:20px;font-size:15px;line-height:1.7;color:#4A4540">
          <li>Manage your details, photos and services</li>
          <li>Respond to reviews and questions</li>
          <li>Get the <strong>Verified by InfoWebWorld</strong> badge</li>
        </ul>` +
      button('Claim your listing', SITE) +
      p('Verify with a work email on your company domain and you’re approved instantly.')
    ),
  },
  {
    id: 'feature-update',
    name: 'Product update',
    category: 'Announcement',
    subject: "What's new on InfoWebWorld ✨",
    description: 'Announce new features or improvements.',
    html: shell(
      h1("We've shipped some updates") +
      p('Hi {{name}}, here’s what’s new on InfoWebWorld this month:') +
      `        <div style="border-left:3px solid #E8553D;padding:2px 0 2px 16px;margin:0 0 16px">
          <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#1A1A1A">Instant listing claims</p>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#4A4540">Claim and verify your business in seconds with a domain email.</p>
        </div>
        <div style="border-left:3px solid #3B82F6;padding:2px 0 2px 16px;margin:0 0 16px">
          <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#1A1A1A">Better category pages</p>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#4A4540">Richer comparisons and buyer guides across every sector.</p>
        </div>` +
      button('See what’s new', SITE, '#3B82F6')
    , '#3B82F6'),
  },
  {
    id: 'newsletter',
    name: 'Monthly digest',
    category: 'Newsletter',
    subject: 'Your InfoWebWorld monthly digest',
    description: 'Editorial roundup with a few sections.',
    html: shell(
      h1('This month on InfoWebWorld') +
      p('Hi {{name}}, the highlights from across the platform:') +
      `        <p style="margin:0 0 6px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#C2410C">Trending categories</p>` +
      p('AI &amp; ML tools, IT services agencies and professional services saw the most activity this month.') +
      `        <p style="margin:18px 0 6px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#C2410C">Tip of the month</p>` +
      p('Comparing options? Use side-by-side comparison pages to weigh features, pricing and reviews at a glance.') +
      button('Read more on the blog', `${SITE}/blog`)
    ),
  },
  {
    id: 'offer',
    name: 'Special offer',
    category: 'Promotion',
    subject: '{{name}}, an exclusive offer inside 🎁',
    description: 'Promote a discount or early-bird premium plan.',
    html: shell(
      h1('A limited-time offer, just for you') +
      p('Hi {{name}}, upgrade your listing to Premium and stand out — dofollow backlinks, priority placement and lead generation.') +
      `        <div style="text-align:center;background:#FFF7F4;border:1.5px dashed #F3C8BD;border-radius:12px;padding:18px;margin:0 0 8px">
          <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#C2410C">Early-bird</div>
          <div style="font-size:30px;font-weight:800;color:#1A1A1A;line-height:1.2">Save 40%</div>
          <div style="font-size:13px;color:#6B6560">on annual plans — limited spots</div>
        </div>` +
      button('Claim your offer', `${SITE}/business/plans`) +
      p('<span style="font-size:13px;color:#9A9590">Offer ends soon. Terms apply.</span>')
    ),
  },
  {
    id: 're-engagement',
    name: 'We miss you',
    category: 'Re-engagement',
    subject: 'We miss you, {{name}}',
    description: 'Win back inactive users.',
    html: shell(
      h1("It's been a while, {{name}}") +
      p("A lot has changed on InfoWebWorld since you last visited — new listings, fresh reviews and better tools to find exactly what you need.") +
      button('See what’s new', SITE) +
      p('<span style="font-size:13px;color:#9A9590">Not interested anymore? No problem — you can unsubscribe below.</span>')
    , '#7C3AED'),
  },
  {
    id: 'review-request',
    name: 'Review request',
    category: 'Engagement',
    subject: '{{name}}, share your experience',
    description: 'Ask users to leave a review or complete their profile.',
    html: shell(
      h1('Your opinion helps thousands of buyers') +
      p('Hi {{name}}, have you worked with a business listed on InfoWebWorld? A short, honest review helps others choose with confidence — and takes under two minutes.') +
      button('Write a review', SITE, '#0E8F6E') +
      p('Verified reviews from real users are what make InfoWebWorld trustworthy. Thank you for being part of it.')
    , '#0E8F6E'),
  },
]
