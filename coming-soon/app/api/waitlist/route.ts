import { NextRequest } from 'next/server'
import nodemailer from 'nodemailer'
import { query, execute, queryOne } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp, getUserAgent } from '@/lib/tracking'

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
function buildWelcomeEmail(): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Welcome to InfoWebWorld</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
  </style>
</head>
<body style="margin:0;padding:0;background:#F7F5F2;-webkit-font-smoothing:antialiased">

  <!--[if mso]><table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;font-family:'Nunito',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif">

    <!-- ════ LOGO ════ -->
    <div style="text-align:center;padding-bottom:28px">
      <span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:800;color:#1A1A1A;letter-spacing:-.3px">info</span><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:800;color:#E8553D;letter-spacing:-.3px">Web</span><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:800;color:#1A1A1A;letter-spacing:-.3px">World</span>
    </div>

    <!-- ════ MAIN CARD ════ -->
    <div style="background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(26,26,26,.04),0 8px 30px rgba(26,26,26,.06)">

      <!-- Hero banner -->
      <div style="background:#1A1A1A;padding:48px 44px 44px;text-align:center">
        <div style="font-family:'Nunito',sans-serif;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:2.5px;color:#E8553D;margin-bottom:14px">Welcome Aboard</div>
        <h1 style="margin:0 0 12px;font-family:'Nunito',sans-serif;font-size:30px;font-weight:800;color:#FFFFFF;line-height:1.2">You're one of the first.</h1>
        <p style="margin:0;font-family:'Nunito',sans-serif;font-size:15px;font-weight:400;color:#A8A4A0;line-height:1.65">We're building a new kind of business discovery platform &mdash; and you just secured early access before the world finds out.</p>
      </div>

      <!-- Warm welcome text -->
      <div style="padding:36px 44px 0">
        <p style="margin:0 0 16px;font-family:'Nunito',sans-serif;font-size:15px;font-weight:400;color:#4A4540;line-height:1.75">Something big is coming.</p>
        <p style="margin:0;font-family:'Nunito',sans-serif;font-size:15px;font-weight:400;color:#4A4540;line-height:1.75"><strong style="color:#1A1A1A">InfoWebWorld</strong> is where businesses get discovered by the right people &mdash; through verified reviews, real leads, and SEO that actually works. No noise. No pay-to-play rankings. Just genuine growth.</p>
      </div>

      <!-- ── Perks ── -->
      <div style="padding:32px 44px 0">
        <div style="font-family:'Nunito',sans-serif;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#E8553D;margin-bottom:20px">What you're getting early access to</div>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding-bottom:20px;vertical-align:top;width:40px">
              <div style="width:34px;height:34px;background:#FFF5F3;border-radius:10px;text-align:center;line-height:34px;font-size:15px">&#9889;</div>
            </td>
            <td style="padding-bottom:20px;padding-left:14px;vertical-align:top">
              <div style="font-family:'Nunito',sans-serif;font-size:14px;font-weight:800;color:#1A1A1A;margin-bottom:3px">Founding Member Pricing</div>
              <div style="font-family:'Nunito',sans-serif;font-size:13px;font-weight:400;color:#6B6560;line-height:1.55">Lock in lifetime access at a price that won't exist once we launch publicly. This is the lowest it will ever be.</div>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:20px;vertical-align:top;width:40px">
              <div style="width:34px;height:34px;background:#EFF6FF;border-radius:10px;text-align:center;line-height:34px;font-size:15px">&#128269;</div>
            </td>
            <td style="padding-bottom:20px;padding-left:14px;vertical-align:top">
              <div style="font-family:'Nunito',sans-serif;font-size:14px;font-weight:800;color:#1A1A1A;margin-bottom:3px">Permanent Dofollow Backlinks</div>
              <div style="font-family:'Nunito',sans-serif;font-size:13px;font-weight:400;color:#6B6560;line-height:1.55">Every listing gets a dofollow backlink to your website. Domain authority boost that compounds over time.</div>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:20px;vertical-align:top;width:40px">
              <div style="width:34px;height:34px;background:#F0F9F4;border-radius:10px;text-align:center;line-height:34px;font-size:15px">&#9733;</div>
            </td>
            <td style="padding-bottom:20px;padding-left:14px;vertical-align:top">
              <div style="font-family:'Nunito',sans-serif;font-size:14px;font-weight:800;color:#1A1A1A;margin-bottom:3px">Verified Reviews That Convert</div>
              <div style="font-family:'Nunito',sans-serif;font-size:13px;font-weight:400;color:#6B6560;line-height:1.55">Real reviews from real users. Build the kind of trust that turns visitors into paying customers.</div>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:0;vertical-align:top;width:40px">
              <div style="width:34px;height:34px;background:#FAF5FF;border-radius:10px;text-align:center;line-height:34px;font-size:15px">&#127760;</div>
            </td>
            <td style="padding-bottom:0;padding-left:14px;vertical-align:top">
              <div style="font-family:'Nunito',sans-serif;font-size:14px;font-weight:800;color:#1A1A1A;margin-bottom:3px">Global Reach &mdash; GEO, AEO &amp; SEO</div>
              <div style="font-family:'Nunito',sans-serif;font-size:13px;font-weight:400;color:#6B6560;line-height:1.55">Your business, discoverable across 500+ categories and 30+ countries. Optimized for search engines and AI answers.</div>
            </td>
          </tr>
        </table>
      </div>

      <!-- ── Divider ── -->
      <div style="padding:28px 44px 0"><div style="height:1px;background:#F0EDEA"></div></div>

      <!-- ── CTA ── -->
      <div style="padding:32px 44px 36px;text-align:center">
        <p style="margin:0 0 24px;font-family:'Nunito',sans-serif;font-size:16px;font-weight:700;color:#1A1A1A;line-height:1.5">Ready to be one of the first businesses on the platform?</p>
        <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="https://infowebworld.com/business" style="height:50px;v-text-anchor:middle;width:260px" arcsize="16%" fillcolor="#E8553D" stroke="f"><v:textbox inset="0,0,0,0"><center style="font-family:'Nunito',sans-serif;font-size:15px;font-weight:700;color:#ffffff">Get Listed Now</center></v:textbox></v:roundrect><![endif]-->
        <!--[if !mso]><!-->
        <a href="https://infowebworld.com/business" target="_blank" style="display:inline-block;background:#E8553D;color:#ffffff;text-decoration:none;font-family:'Nunito',sans-serif;font-weight:700;font-size:15px;padding:15px 42px;border-radius:10px;letter-spacing:.2px;mso-hide:all">Get Listed Now &nbsp;&#8594;</a>
        <!--<![endif]-->
        <p style="margin:18px 0 0;font-family:'Nunito',sans-serif;font-size:12px;font-weight:600;color:#B5B0AA">6-month money-back guarantee &nbsp;&#183;&nbsp; Cancel anytime</p>
      </div>

      <!-- ── What's next ── -->
      <div style="background:#FAFAF8;border-top:1px solid #F0EDEA;padding:32px 44px">
        <div style="font-family:'Nunito',sans-serif;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#1A1A1A;margin-bottom:22px">What happens next</div>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td width="36" style="vertical-align:top;padding-right:14px;padding-bottom:16px">
              <div style="width:28px;height:28px;background:#E8553D;border-radius:50%;text-align:center;line-height:28px;font-family:'Nunito',sans-serif;font-size:12px;font-weight:800;color:#fff">1</div>
            </td>
            <td style="vertical-align:top;padding-bottom:16px">
              <div style="font-family:'Nunito',sans-serif;font-size:14px;font-weight:700;color:#1A1A1A;line-height:1.3">You're on the list</div>
              <div style="font-family:'Nunito',sans-serif;font-size:12.5px;font-weight:400;color:#9A9590;line-height:1.5;margin-top:2px">We'll notify you first when the platform goes live.</div>
            </td>
          </tr>
          <tr>
            <td width="36" style="vertical-align:top;padding-right:14px;padding-bottom:16px">
              <div style="width:28px;height:28px;background:#1A1A1A;border-radius:50%;text-align:center;line-height:28px;font-family:'Nunito',sans-serif;font-size:12px;font-weight:800;color:#fff">2</div>
            </td>
            <td style="vertical-align:top;padding-bottom:16px">
              <div style="font-family:'Nunito',sans-serif;font-size:14px;font-weight:700;color:#1A1A1A;line-height:1.3">Early access invite</div>
              <div style="font-family:'Nunito',sans-serif;font-size:12.5px;font-weight:400;color:#9A9590;line-height:1.5;margin-top:2px">Set up your listing and claim your founding spot before the public launch.</div>
            </td>
          </tr>
          <tr>
            <td width="36" style="vertical-align:top;padding-right:14px">
              <div style="width:28px;height:28px;background:#1A1A1A;border-radius:50%;text-align:center;line-height:28px;font-family:'Nunito',sans-serif;font-size:12px;font-weight:800;color:#fff">3</div>
            </td>
            <td style="vertical-align:top">
              <div style="font-family:'Nunito',sans-serif;font-size:14px;font-weight:700;color:#1A1A1A;line-height:1.3">Go live globally</div>
              <div style="font-family:'Nunito',sans-serif;font-size:12.5px;font-weight:400;color:#9A9590;line-height:1.5;margin-top:2px">Your business goes live across 30+ countries. Leads, reviews, and backlinks start flowing.</div>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <!-- ════ FOOTER ════ -->
    <div style="text-align:center;padding:28px 16px 8px">
      <p style="margin:0 0 8px;font-family:'Nunito',sans-serif;font-size:13px;font-weight:600;color:#6B6560">
        <a href="https://infowebworld.com" target="_blank" style="color:#E8553D;text-decoration:none;font-weight:700">InfoWebWorld.com</a> &nbsp;&#8212;&nbsp; Global Growth Platform
      </p>
      <p style="margin:0 0 8px;font-family:'Nunito',sans-serif;font-size:11px;font-weight:400;color:#B5B0AA">Brain Stream Australia Pty Ltd &nbsp;&#183;&nbsp; Parramatta, NSW 2150, Australia</p>
      <div style="margin:16px auto 0;width:120px;height:1px;background:#E8E4DF"></div>
      <p style="margin:14px 0 0;font-family:'Nunito',sans-serif;font-size:11px;font-weight:600;color:#C5C0BA">
        <a href="https://infowebworld.com/business" target="_blank" style="color:#C5C0BA;text-decoration:none">Get Listed</a>
        &nbsp;&nbsp;&#183;&nbsp;&nbsp;
        <a href="https://infowebworld.com/plans" target="_blank" style="color:#C5C0BA;text-decoration:none">Plans</a>
        &nbsp;&nbsp;&#183;&nbsp;&nbsp;
        <a href="https://infowebworld.com/contact" target="_blank" style="color:#C5C0BA;text-decoration:none">Contact</a>
      </p>
    </div>

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const cleanEmail = email.trim().toLowerCase()
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
