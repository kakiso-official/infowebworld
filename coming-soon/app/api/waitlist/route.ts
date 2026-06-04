import { NextRequest } from 'next/server'
import nodemailer from 'nodemailer'
import dns from 'dns/promises'
import { query, execute, queryOne } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp, getUserAgent } from '@/lib/tracking'

/* ── Anti-spam ──────────────────────────────────────────────
   Three layers:
     1. Hardcoded deny-list of domains we've already seen abuse from.
     2. DNS MX-record check — if the domain has no mail exchanger,
        the email is fake/dead and we drop it.
     3. Honeypot — the frontend submits a hidden `website` field;
        bots blindly fill every field, real users leave it empty.
        Silent accept (return ok) so bots don't realise they're caught.
   ─────────────────────────────────────────────────────────── */

const BLOCKED_DOMAINS = new Set<string>([
  'parallelaid.com',
  'circuitprompt.com',
  // Add more known-bad domains here as they show up. Disposable email
  // domains (mailinator, tempmail, etc.) are also worth blocking later.
])

async function validateEmailDeliverable(email: string): Promise<{ ok: boolean; reason?: string }> {
  const at = email.lastIndexOf('@')
  if (at < 1 || at === email.length - 1) return { ok: false, reason: 'malformed' }
  const domain = email.slice(at + 1).toLowerCase()

  if (BLOCKED_DOMAINS.has(domain)) return { ok: false, reason: 'blocked-domain' }

  try {
    // resolveMx times out fast in Node (typically <500ms). Wrap in a
    // race in case the resolver hangs on a bad domain.
    const mxRecords = await Promise.race([
      dns.resolveMx(domain),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('mx-timeout')), 3000)
      ),
    ])
    if (!Array.isArray(mxRecords) || mxRecords.length === 0) {
      return { ok: false, reason: 'no-mx' }
    }
    return { ok: true }
  } catch (err) {
    // ENOTFOUND, ENODATA, timeout → not deliverable
    const msg = err instanceof Error ? err.message : String(err)
    return { ok: false, reason: `mx-failed:${msg.slice(0, 40)}` }
  }
}

export async function GET(request: NextRequest) {
  try {
    const rows = await query(
      'SELECT id, email, source, created_at FROM waitlist ORDER BY created_at DESC LIMIT 500'
    )
    return Response.json(rows)
  } catch (err) {
    console.error('GET /api/waitlist error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

/* ── Welcome email HTML ── */
/* Fonts: Bricolage Grotesque (headings) + Nunito (body) — loaded via <link> tag.
   Works in: Apple Mail, iOS Mail, Gmail Android, Outlook.com, Samsung Mail.
   Gmail desktop strips <link> — falls back to Georgia (headings) + system sans-serif (body). */
const F_HEAD = "'Bricolage Grotesque',Georgia,'Times New Roman',serif"
const F_BODY = "'Nunito',-apple-system,'Segoe UI',Roboto,sans-serif"

function buildWelcomeEmail(): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <meta name="x-apple-disable-message-reformatting">
  <title>Welcome to InfoWebWorld</title>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
  <!--[if mso]>
  <style>
    * { font-family: 'Segoe UI', Tahoma, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background:#F4F2EF;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale">

  <!--[if mso]><table role="presentation" width="620" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
  <div style="max-width:620px;margin:0 auto;padding:40px 16px">

    <!-- ════════ HEADER ════════ -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="text-align:center;padding-bottom:32px">
          <span style="font-family:${F_BODY};font-size:24px;font-weight:800;color:#1A1A1A;letter-spacing:-.4px">info</span><span style="font-family:${F_BODY};font-size:24px;font-weight:800;color:#E8553D;letter-spacing:-.4px">Web</span><span style="font-family:${F_BODY};font-size:24px;font-weight:800;color:#1A1A1A;letter-spacing:-.4px">World</span><span style="font-family:${F_BODY};font-size:11px;font-weight:600;color:#B5B0AA;vertical-align:top;margin-left:1px">.com</span>
        </td>
      </tr>
    </table>

    <!-- ════════ MAIN CARD ════════ -->
    <div style="background:#FFFFFF;border-radius:20px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.03),0 4px 16px rgba(0,0,0,.04)">

      <!-- ── Hero ── -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="background:#1A1A1A;padding:52px 48px 48px;text-align:center">
            <div style="font-family:${F_BODY};font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:3px;color:#E8553D;margin-bottom:18px">You're In</div>
            <h1 style="margin:0 0 16px;font-family:${F_HEAD};font-size:34px;font-weight:800;color:#FFFFFF;line-height:1.15;letter-spacing:-.3px">Welcome to the<br>future of discovery.</h1>
            <p style="margin:0;font-family:${F_BODY};font-size:15px;font-weight:400;color:rgba(255,255,255,.55);line-height:1.7;max-width:420px;display:inline-block">You just joined a community of forward-thinking businesses building their global presence.</p>
          </td>
        </tr>
      </table>

      <!-- ── Message ── -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="padding:40px 48px 0">
            <p style="margin:0 0 14px;font-family:${F_HEAD};font-size:20px;font-weight:800;color:#1A1A1A;line-height:1.3;letter-spacing:-.2px">We're not just another directory.</p>
            <p style="margin:0;font-family:${F_BODY};font-size:14.5px;font-weight:400;color:#5C5852;line-height:1.8"><strong style="color:#1A1A1A;font-weight:700">InfoWebWorld</strong> is a growth platform where real businesses get discovered by the right people. Verified reviews, qualified leads, dofollow backlinks, and visibility across 30+ countries &mdash; all in one place.</p>
          </td>
        </tr>
      </table>

      <!-- ── Perks ── -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="padding:36px 48px 0">
            <div style="font-family:${F_BODY};font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:2.5px;color:#E8553D;margin-bottom:24px">Early access includes</div>
          </td>
        </tr>
      </table>

      <!-- Perk items -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:0 48px">
        <tr>
          <td width="44" style="vertical-align:top;padding-bottom:22px">
            <div style="width:38px;height:38px;background:#FFF5F3;border-radius:12px;text-align:center;line-height:38px;font-size:17px">&#9889;</div>
          </td>
          <td style="vertical-align:top;padding-left:16px;padding-bottom:22px">
            <div style="font-family:${F_BODY};font-size:14px;font-weight:800;color:#1A1A1A;margin-bottom:4px">Founding Member Pricing</div>
            <div style="font-family:${F_BODY};font-size:13px;font-weight:400;color:#7A756F;line-height:1.6">Lifetime access at a price that disappears after launch. The lowest it will ever be.</div>
          </td>
        </tr>
        <tr>
          <td width="44" style="vertical-align:top;padding-bottom:22px">
            <div style="width:38px;height:38px;background:#EEF4FF;border-radius:12px;text-align:center;line-height:38px;font-size:17px">&#128279;</div>
          </td>
          <td style="vertical-align:top;padding-left:16px;padding-bottom:22px">
            <div style="font-family:${F_BODY};font-size:14px;font-weight:800;color:#1A1A1A;margin-bottom:4px">Permanent Dofollow Backlinks</div>
            <div style="font-family:${F_BODY};font-size:13px;font-weight:400;color:#7A756F;line-height:1.6">Every listing gets a dofollow link to your site. Domain authority that compounds.</div>
          </td>
        </tr>
        <tr>
          <td width="44" style="vertical-align:top;padding-bottom:22px">
            <div style="width:38px;height:38px;background:#EEFBF4;border-radius:12px;text-align:center;line-height:38px;font-size:17px">&#9733;</div>
          </td>
          <td style="vertical-align:top;padding-left:16px;padding-bottom:22px">
            <div style="font-family:${F_BODY};font-size:14px;font-weight:800;color:#1A1A1A;margin-bottom:4px">Verified Reviews That Convert</div>
            <div style="font-family:${F_BODY};font-size:13px;font-weight:400;color:#7A756F;line-height:1.6">Real reviews from real users. The kind of trust that turns browsers into buyers.</div>
          </td>
        </tr>
        <tr>
          <td width="44" style="vertical-align:top;padding-bottom:0">
            <div style="width:38px;height:38px;background:#F5F0FF;border-radius:12px;text-align:center;line-height:38px;font-size:17px">&#127760;</div>
          </td>
          <td style="vertical-align:top;padding-left:16px;padding-bottom:0">
            <div style="font-family:${F_BODY};font-size:14px;font-weight:800;color:#1A1A1A;margin-bottom:4px">Global Reach &mdash; SEO, GEO &amp; AEO</div>
            <div style="font-family:${F_BODY};font-size:13px;font-weight:400;color:#7A756F;line-height:1.6">Be discoverable in 500+ categories across 30+ countries. Optimized for search engines and AI.</div>
          </td>
        </tr>
      </table>

      <!-- ── CTA ── -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="padding:40px 48px 44px;text-align:center">
            <div style="height:1px;background:#F0EDEA;margin-bottom:36px"></div>
            <p style="margin:0 0 24px;font-family:${F_HEAD};font-size:18px;font-weight:800;color:#1A1A1A;line-height:1.35;letter-spacing:-.15px">Ready to get discovered?</p>
            <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="https://www.infowebworld.com/business" style="height:52px;v-text-anchor:middle;width:240px" arcsize="19%" fillcolor="#E8553D" stroke="f"><v:textbox inset="0,0,0,0"><center style="font-family:'Segoe UI',sans-serif;font-size:15px;font-weight:700;color:#ffffff">Get Listed Now &#8594;</center></v:textbox></v:roundrect><![endif]-->
            <!--[if !mso]><!-->
            <a href="https://www.infowebworld.com/business" target="_blank" style="display:inline-block;background:#E8553D;color:#ffffff;text-decoration:none;font-family:${F_BODY};font-weight:700;font-size:15px;padding:16px 44px;border-radius:12px;letter-spacing:.2px;mso-hide:all">Get Listed Now &nbsp;&#8594;</a>
            <!--<![endif]-->
            <p style="margin:16px 0 0;font-family:${F_BODY};font-size:11.5px;font-weight:600;color:#C5C0BA;letter-spacing:.2px">6-month money-back guarantee &nbsp;&#183;&nbsp; Cancel anytime</p>
          </td>
        </tr>
      </table>

      <!-- ── What's next ── -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#FAFAF8;border-top:1px solid #F0EDEA">
        <tr>
          <td style="padding:36px 48px 40px">
            <div style="font-family:${F_BODY};font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:2.5px;color:#1A1A1A;margin-bottom:24px">What happens next</div>

            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td width="40" style="vertical-align:top;padding-right:14px;padding-bottom:18px">
                  <div style="width:30px;height:30px;background:#E8553D;border-radius:50%;text-align:center;line-height:30px;font-family:${F_BODY};font-size:13px;font-weight:800;color:#fff">1</div>
                </td>
                <td style="vertical-align:top;padding-bottom:18px">
                  <div style="font-family:${F_BODY};font-size:14px;font-weight:700;color:#1A1A1A;line-height:1.3">You're on the early access list</div>
                  <div style="font-family:${F_BODY};font-size:12.5px;font-weight:400;color:#9A9590;line-height:1.55;margin-top:3px">We'll reach out the moment the platform goes live.</div>
                </td>
              </tr>
              <tr>
                <td width="40" style="vertical-align:top;padding-right:14px;padding-bottom:18px">
                  <div style="width:30px;height:30px;background:#2A2A2A;border-radius:50%;text-align:center;line-height:30px;font-family:${F_BODY};font-size:13px;font-weight:800;color:#fff">2</div>
                </td>
                <td style="vertical-align:top;padding-bottom:18px">
                  <div style="font-family:${F_BODY};font-size:14px;font-weight:700;color:#1A1A1A;line-height:1.3">Claim your founding spot</div>
                  <div style="font-family:${F_BODY};font-size:12.5px;font-weight:400;color:#9A9590;line-height:1.55;margin-top:3px">Set up your listing before anyone else. Lock in founding pricing.</div>
                </td>
              </tr>
              <tr>
                <td width="40" style="vertical-align:top;padding-right:14px">
                  <div style="width:30px;height:30px;background:#2A2A2A;border-radius:50%;text-align:center;line-height:30px;font-family:${F_BODY};font-size:13px;font-weight:800;color:#fff">3</div>
                </td>
                <td style="vertical-align:top">
                  <div style="font-family:${F_BODY};font-size:14px;font-weight:700;color:#1A1A1A;line-height:1.3">Grow globally</div>
                  <div style="font-family:${F_BODY};font-size:12.5px;font-weight:400;color:#9A9590;line-height:1.55;margin-top:3px">Leads, reviews, backlinks, and visibility across 30+ countries &mdash; on autopilot.</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

    </div>

    <!-- ════════ FOOTER ════════ -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="text-align:center;padding:32px 20px 12px">
          <p style="margin:0 0 10px;font-family:${F_BODY};font-size:13px;font-weight:700;color:#6B6560">
            <a href="https://www.infowebworld.com" target="_blank" style="color:#E8553D;text-decoration:none">InfoWebWorld.com</a>
            <span style="color:#C5C0BA;font-weight:400"> &nbsp;&#8212;&nbsp; Global Growth Platform</span>
          </p>
          <p style="margin:0 0 14px;font-family:${F_BODY};font-size:11px;font-weight:400;color:#C5C0BA">Brain Stream Australia Pty Ltd &nbsp;&#183;&nbsp; Parramatta, NSW 2150</p>
          <p style="margin:0;font-family:${F_BODY};font-size:11px;font-weight:600;color:#D5D0CA">
            <a href="https://www.infowebworld.com/business" target="_blank" style="color:#D5D0CA;text-decoration:none">Get Listed</a>
            <span style="color:#E8E4DF"> &nbsp;&#183;&nbsp; </span>
            <a href="https://www.infowebworld.com/business/plans" target="_blank" style="color:#D5D0CA;text-decoration:none">Plans</a>
            <span style="color:#E8E4DF"> &nbsp;&#183;&nbsp; </span>
            <a href="https://www.infowebworld.com/contact" target="_blank" style="color:#D5D0CA;text-decoration:none">Contact</a>
          </p>
        </td>
      </tr>
    </table>

  </div>
  <!--[if mso]></td></tr></table><![endif]-->

</body>
</html>`
}

/* ── Send welcome email via Gmail SMTP (same setup as contact form) ── */
async function sendWelcomeEmail(toEmail: string) {
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  if (!smtpUser || !smtpPass) {
    throw new Error('SMTP_USER or SMTP_PASS not configured')
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: smtpUser, pass: smtpPass },
  })

  await transporter.sendMail({
    from: `"InfoWebWorld" <${smtpUser}>`,
    to: toEmail,
    subject: `You're in — Welcome to InfoWebWorld`,
    html: buildWelcomeEmail(),
  })
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    if (!id) return Response.json({ error: 'ID is required' }, { status: 400 })
    await execute('DELETE FROM waitlist WHERE id = ?', [id])
    return Response.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/waitlist error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = await getClientIp()

    const limited = await checkRateLimit(ip, 'waitlist', 5, 60)
    if (!limited) {
      return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const body = await request.json()
    const { email, source } = body

    if (!email || typeof email !== 'string') {
      return Response.json({ error: 'Email is required' }, { status: 400 })
    }

    // Honeypot — bots blindly fill every form field including hidden ones.
    // The frontend renders a hidden text input named "website"; real users
    // never type into it. If we see anything in it, silently return success
    // so the bot thinks it worked and doesn't switch strategies.
    if (typeof body.website === 'string' && body.website.trim().length > 0) {
      console.warn('Waitlist honeypot tripped — silently rejecting:', email)
      return Response.json({ ok: true, message: 'Successfully joined the waitlist' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const cleanEmail = email.trim().toLowerCase()

    // Domain deny-list + MX deliverability check. Blocks: bot domains,
    // fake/typo domains, and anything that can't actually receive mail.
    const deliverable = await validateEmailDeliverable(cleanEmail)
    if (!deliverable.ok) {
      console.warn(`Waitlist blocked (${deliverable.reason}):`, cleanEmail)
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const userAgent = await getUserAgent()

    // Check if already on the waitlist
    const existing = await queryOne(
      'SELECT id FROM waitlist WHERE email = ? LIMIT 1',
      [cleanEmail]
    )
    if (existing) {
      return Response.json({ ok: true, message: 'Already on the waitlist', duplicate: true })
    }

    // Insert new entry
    await execute(
      'INSERT IGNORE INTO waitlist (email, source, ip_address, user_agent) VALUES (?, ?, ?, ?)',
      [cleanEmail, source || 'website', ip, userAgent]
    )

    // Send welcome email — must await so Vercel keeps the function alive
    let emailSent = false
    try {
      await sendWelcomeEmail(cleanEmail)
      emailSent = true
    } catch (err) {
      console.error('Welcome email failed:', err instanceof Error ? err.message : err)
    }

    return Response.json({ ok: true, message: 'Successfully joined the waitlist', emailSent })
  } catch (err) {
    console.error('POST /api/waitlist error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
