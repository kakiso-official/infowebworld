/* Shared (client + server safe) helpers for the company-outreach email
   (Admin → Email Marketing → Companies).

   - buildListingPreviewBlock() — the "browser-window" block that frames each
     company's full-page /profile DESKTOP screenshot (email_preview_url), with a
     ●●● titlebar + URL pill, the screenshot, and a footer link. Falls back to a
     "see your profile" card when no screenshot has been captured yet.
   - applyCompanyTokens() — substitutes the per-company tokens in an email body.

   Used by BOTH the send route (server, per recipient) and the admin compose
   preview (client, "Preview as <company>"). MUST stay free of server-only
   imports (no lib/email / nodemailer) so the client bundle can import it. */

export const COMPANY_EMAIL_SITE = 'https://www.infowebworld.com'

const INTER = "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"

export interface CompanyEmailData {
  id?: number
  slug: string
  company_name: string
  tagline?: string | null
  email?: string | null
  email_preview_url?: string | null
}

/** Local HTML escape (kept here so this module has no server-only deps). */
function esc(s: string): string {
  return (s || '').replace(/[&<>"']/g, (c) =>
    c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '"' ? '&quot;' : '&#39;')
}

/** URL of a LIVE screenshot of `pageUrl`, via a no-key screenshot service so no
    capture script ever has to run — the image always reflects the current page.
    Defaults to WordPress mShots (free, no API key, full-page). Override with
    NEXT_PUBLIC_SCREENSHOT_TEMPLATE (tokens {url} / {width}) to swap providers,
    e.g. a keyed service for higher fidelity. The page must be publicly reachable
    (companies live on prod) for the service to render it. */
export function screenshotServiceUrl(pageUrl: string, width = 1280): string {
  const tpl = process.env.NEXT_PUBLIC_SCREENSHOT_TEMPLATE
  if (tpl) return tpl.replace(/\{url\}/g, encodeURIComponent(pageUrl)).replace(/\{width\}/g, String(width))
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(pageUrl)}?w=${width}`
}

/** Browser-window mock framing the company's full-page profile screenshot.
    The shot is generated automatically by the live screenshot service (no
    scripts); a manually-set email_preview_url overrides it when present. */
export function buildListingPreviewBlock(c: CompanyEmailData, site = COMPANY_EMAIL_SITE): string {
  const profileUrl = `${site}/profile/${encodeURIComponent(c.slug)}`
  const urlLabel = `infowebworld.com/profile/${c.slug}`
  const shot = (c.email_preview_url || '').trim() || screenshotServiceUrl(profileUrl)

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;max-width:520px;border-radius:14px;overflow:hidden;border:1px solid #E4E0DB;box-shadow:0 20px 44px -20px rgba(20,16,14,.30)">
  <tr>
    <td style="background:#2A2622;padding:11px 14px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td width="60" valign="middle" style="white-space:nowrap">
          <span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:#FF5F57"></span>
          <span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:#FEBC2E;margin-left:6px"></span>
          <span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:#28C840;margin-left:6px"></span>
        </td>
        <td valign="middle" style="padding-left:12px">
          <div style="background:#3A352F;border-radius:8px;padding:6px 12px;font:600 11px ${INTER};color:#CFC8C0;letter-spacing:.2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">&#128274;&nbsp; ${esc(urlLabel)}</div>
        </td>
      </tr></table>
    </td>
  </tr>
  <tr>
    <td style="background:#ffffff;padding:0;line-height:0;font-size:0">
      <a href="${profileUrl}" target="_blank" style="display:block">
        <img src="${shot}" alt="${esc(c.company_name)} — company profile on InfoWebWorld" width="520" style="display:block;width:100%;max-width:520px;height:auto;border:0;outline:none">
      </a>
    </td>
  </tr>
  <tr>
    <td style="background:#FBFAF8;border-top:1px solid #EFEBE5;padding:11px 14px;text-align:center">
      <a href="${profileUrl}" target="_blank" style="font:700 12.5px ${INTER};color:#E8553D;text-decoration:none">Open your full profile &#8599;</a>
    </td>
  </tr>
</table>`
}

/** Substitute per-company tokens. {{name}} maps to the company name so an
    existing "Hi {{name}}" greeting keeps working for the company audience. */
export function applyCompanyTokens(html: string, c: CompanyEmailData, site = COMPANY_EMAIL_SITE): string {
  const profileUrl = `${site}/profile/${encodeURIComponent(c.slug)}`
  return html
    .replace(/\{\{\s*listing_preview\s*\}\}/gi, buildListingPreviewBlock(c, site))
    .replace(/\{\{\s*company_name\s*\}\}/gi, esc(c.company_name))
    .replace(/\{\{\s*name\s*\}\}/gi, esc(c.company_name))
    .replace(/\{\{\s*tagline\s*\}\}/gi, esc(c.tagline || ''))
    .replace(/\{\{\s*profile_url\s*\}\}/gi, profileUrl)
    .replace(/\{\{\s*claim_url\s*\}\}/gi, profileUrl)
    .replace(/\{\{\s*email\s*\}\}/gi, esc(c.email || ''))
}
