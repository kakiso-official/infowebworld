import nodemailer, { type Transporter } from 'nodemailer'

/**
 * Transactional email infrastructure shared by every notify-* path.
 *
 *   - sendEmail()      — drop-in send. Never throws. Returns ok|false.
 *   - buildEmailShell()— branded HTML wrapper used by the templates in
 *                        ./email-templates.ts.
 *   - escapeHtml()     — defence against unsanitized user input bleeding
 *                        into the email markup (review titles, names, etc.).
 *
 * SMTP config comes from env: SMTP_USER, SMTP_PASS, SMTP_HOST (defaults to
 * smtp.gmail.com:465). The transporter is module-cached so repeated sends
 * inside one runtime instance reuse the same auth handshake.
 */

const F_HEAD = "'Bricolage Grotesque',Georgia,'Times New Roman',serif"
const F_BODY = "'Nunito',-apple-system,'Segoe UI',Roboto,sans-serif"
const SITE = 'https://www.infowebworld.com'

export const EMAIL_FONTS = { F_HEAD, F_BODY }
export const EMAIL_SITE = SITE

let cachedTransporter: Transporter | null = null
function getTransporter(): Transporter | null {
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  if (!smtpUser || !smtpPass) return null
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: smtpUser, pass: smtpPass },
    })
  }
  return cachedTransporter
}

interface SendArgs {
  to: string
  subject: string
  html: string
  text?: string
  replyTo?: string
}

/**
 * Send a transactional email. Returns true on success, false on any failure
 * (missing config, auth error, network error). Never throws — callers always
 * treat false as "we tried and moved on" so the originating API request
 * never fails just because email delivery did.
 */
export async function sendEmail(args: SendArgs): Promise<boolean> {
  try {
    const transporter = getTransporter()
    if (!transporter) {
      console.warn('[email] SMTP not configured (SMTP_USER / SMTP_PASS missing) — skipping send')
      return false
    }
    if (!args.to) {
      console.warn('[email] missing "to" — skipping send')
      return false
    }
    const smtpUser = process.env.SMTP_USER
    await transporter.sendMail({
      from: `"InfoWebWorld" <${smtpUser}>`,
      to: args.to,
      subject: args.subject,
      html: args.html,
      text: args.text,
      replyTo: args.replyTo,
    })
    return true
  } catch (err) {
    console.error('[email] sendEmail failed:', err instanceof Error ? err.message : err)
    return false
  }
}

/** Defence-in-depth HTML escape for any string we render inside email markup. */
export function escapeHtml(input: string): string {
  if (!input) return ''
  return input.replace(/[&<>"']/g, c =>
    c === '&' ? '&amp;'
    : c === '<' ? '&lt;'
    : c === '>' ? '&gt;'
    : c === '"' ? '&quot;'
    : '&#39;')
}

interface ShellArgs {
  preheader: string
  eyebrow: string
  title: string
  /** HTML inserted between the title and the CTA. Keep table-based for client compat. */
  bodyHtml: string
  ctaUrl?: string
  ctaText?: string
  ctaSecondaryUrl?: string
  ctaSecondaryText?: string
  footerNote?: string
}

/**
 * Branded email layout used by every notification template. White card on cream
 * background, coral accent (#E8553D), Bricolage headings + Nunito body. Falls
 * back to system fonts in clients that strip <link rel="stylesheet">.
 */
export function buildEmailShell(args: ShellArgs): string {
  const cta = args.ctaUrl && args.ctaText ? `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:6px 48px 4px;text-align:left">
          <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${args.ctaUrl}" style="height:46px;v-text-anchor:middle;width:220px" arcsize="22%" fillcolor="#E8553D" stroke="f"><v:textbox inset="0,0,0,0"><center style="font-family:'Segoe UI',sans-serif;font-size:14.5px;font-weight:700;color:#ffffff">${escapeHtml(args.ctaText)}</center></v:textbox></v:roundrect><![endif]-->
          <!--[if !mso]><!-->
          <a href="${args.ctaUrl}" target="_blank" style="display:inline-block;background:#E8553D;color:#ffffff;text-decoration:none;font-family:${F_BODY};font-weight:700;font-size:14.5px;padding:13px 28px;border-radius:12px;letter-spacing:.2px;mso-hide:all">${escapeHtml(args.ctaText)} &nbsp;&#8594;</a>
          <!--<![endif]-->
        </td>
      </tr>
    </table>
  ` : ''

  const ctaSec = args.ctaSecondaryUrl && args.ctaSecondaryText ? `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:14px 48px 0">
          <a href="${args.ctaSecondaryUrl}" target="_blank" style="font-family:${F_BODY};font-size:13px;color:#5C5852;text-decoration:underline;font-weight:600">${escapeHtml(args.ctaSecondaryText)}</a>
        </td>
      </tr>
    </table>
  ` : ''

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <meta name="x-apple-disable-message-reformatting">
  <title>${escapeHtml(args.title)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
  <!--[if mso]><style>* { font-family: 'Segoe UI', Tahoma, sans-serif !important }</style><![endif]-->
</head>
<body style="margin:0;padding:0;background:#F4F2EF;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale">
  <div style="display:none;font-size:1px;line-height:1px;color:#F4F2EF;max-height:0;max-width:0;opacity:0;overflow:hidden">${escapeHtml(args.preheader)}</div>
  <!--[if mso]><table role="presentation" width="620" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
  <div style="max-width:620px;margin:0 auto;padding:36px 16px">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="text-align:center;padding-bottom:24px">
          <span style="font-family:${F_BODY};font-size:22px;font-weight:800;color:#1A1A1A;letter-spacing:-.4px">info</span><span style="font-family:${F_BODY};font-size:22px;font-weight:800;color:#E8553D;letter-spacing:-.4px">Web</span><span style="font-family:${F_BODY};font-size:22px;font-weight:800;color:#1A1A1A;letter-spacing:-.4px">World</span><span style="font-family:${F_BODY};font-size:10px;font-weight:600;color:#B5B0AA;vertical-align:top;margin-left:1px">.com</span>
        </td>
      </tr>
    </table>
    <div style="background:#FFFFFF;border-radius:18px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.03),0 4px 16px rgba(0,0,0,.04)">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="padding:36px 48px 6px">
            <div style="font-family:${F_BODY};font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2.5px;color:#E8553D;margin-bottom:14px">${escapeHtml(args.eyebrow)}</div>
            <h1 style="margin:0 0 14px;font-family:${F_HEAD};font-size:25px;font-weight:800;color:#1A1A1A;line-height:1.25;letter-spacing:-.2px">${escapeHtml(args.title)}</h1>
          </td>
        </tr>
      </table>
      ${args.bodyHtml}
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr><td style="padding:18px 0 0"></td></tr>
      </table>
      ${cta}
      ${ctaSec}
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="padding:24px 48px 36px"></td></tr></table>
    </div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="text-align:center;padding:28px 16px 12px">
          <p style="margin:0 0 10px;font-family:${F_BODY};font-size:13px;font-weight:700;color:#6B6560">
            <a href="${SITE}" target="_blank" style="color:#E8553D;text-decoration:none">InfoWebWorld.com</a>
            <span style="color:#C5C0BA;font-weight:400"> &nbsp;&#8212;&nbsp; Global Business Directory</span>
          </p>
          <p style="margin:0 0 12px;font-family:${F_BODY};font-size:11px;color:#C5C0BA">${escapeHtml(args.footerNote || "Sent because you're the listing owner.")}</p>
          <p style="margin:0;font-family:${F_BODY};font-size:11px;font-weight:600;color:#D5D0CA">
            <a href="${SITE}/dashboard" target="_blank" style="color:#D5D0CA;text-decoration:none">Dashboard</a>
            <span style="color:#E8E4DF"> &nbsp;&#183;&nbsp; </span>
            <a href="${SITE}/dashboard/settings" target="_blank" style="color:#D5D0CA;text-decoration:none">Settings</a>
            <span style="color:#E8E4DF"> &nbsp;&#183;&nbsp; </span>
            <a href="${SITE}/contact" target="_blank" style="color:#D5D0CA;text-decoration:none">Contact</a>
          </p>
        </td>
      </tr>
    </table>
  </div>
  <!--[if mso]></td></tr></table><![endif]-->
</body>
</html>`
}

/** Build the actor (reviewer/liker/etc) avatar block — img if URL, otherwise initials tile. */
export function avatarBlock(name: string | null, avatarUrl: string | null, accent = '#E8553D'): string {
  const safeName = name?.trim() || 'A'
  const initials = safeName
    .split(/\s+/).map(s => s[0] || '').slice(0, 2).join('').toUpperCase() || 'A'
  if (avatarUrl) {
    return `<img src="${avatarUrl}" width="42" height="42" alt="" style="display:block;border-radius:999px;border:1px solid #E8E4DF">`
  }
  return `<div style="width:42px;height:42px;background:${accent};border-radius:999px;color:#fff;font-family:${F_BODY};font-size:14px;font-weight:800;text-align:center;line-height:42px;letter-spacing:.04em">${escapeHtml(initials)}</div>`
}
