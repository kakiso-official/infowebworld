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
function buildWelcomeEmail(email: string, waitlistPosition: number): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Welcome to InfoWebWorld</title>
</head>
<body style="margin:0;padding:0;background:#F7F5F2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased">
  <div style="max-width:600px;margin:0 auto;padding:24px 16px">

    <!-- Top accent bar -->
    <div style="height:4px;background:linear-gradient(90deg,#E8553D 0%,#FF8A6B 50%,#E8553D 100%);border-radius:4px 4px 0 0"></div>

    <!-- Main card -->
    <div style="background:#FFFFFF;border:1px solid #E8E4DF;border-top:none;border-radius:0 0 12px 12px;padding:0;overflow:hidden">

      <!-- Header -->
      <div style="padding:40px 40px 0 40px;text-align:center">
        <div style="margin-bottom:24px">
          <span style="font-size:28px;font-weight:800;color:#1A1A1A;letter-spacing:-.5px">info</span><span style="font-size:28px;font-weight:800;color:#E8553D;letter-spacing:-.5px">Web</span><span style="font-size:28px;font-weight:800;color:#1A1A1A;letter-spacing:-.5px">World</span><span style="font-size:13px;color:#9A9590;font-weight:500">.com</span>
        </div>
        <h1 style="margin:0 0 8px 0;font-size:26px;font-weight:800;color:#1A1A1A;line-height:1.25">You're In.</h1>
        <p style="margin:0 0 4px 0;font-size:15px;color:#6B6560;line-height:1.6">Welcome to the future of business discovery.</p>
      </div>

      <!-- Position badge -->
      <div style="text-align:center;padding:24px 40px 0">
        <div style="display:inline-block;background:#FFF5F3;border:1.5px solid #FDDDD6;border-radius:10px;padding:16px 28px">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#E8553D;margin-bottom:4px">Your Position</div>
          <div style="font-size:36px;font-weight:800;color:#1A1A1A;line-height:1">#${waitlistPosition}</div>
          <div style="font-size:12px;color:#9A9590;margin-top:4px">Early Adopter</div>
        </div>
      </div>

      <!-- Divider -->
      <div style="padding:28px 40px 0">
        <div style="height:1px;background:#F0EDEA"></div>
      </div>

      <!-- What you'll get -->
      <div style="padding:28px 40px 0">
        <h2 style="margin:0 0 20px 0;font-size:16px;font-weight:700;color:#1A1A1A">What's waiting for you</h2>

        <!-- Benefit 1 -->
        <div style="display:flex;margin-bottom:18px">
          <div style="flex-shrink:0;width:36px;height:36px;background:#FFF5F3;border-radius:8px;text-align:center;line-height:36px;font-size:16px;margin-right:14px">&#128640;</div>
          <div>
            <div style="font-size:14px;font-weight:700;color:#1A1A1A;margin-bottom:2px">Early Access & Founding Pricing</div>
            <div style="font-size:13px;color:#6B6560;line-height:1.5">Lock in $239 lifetime access before it goes to $999. First 199 businesses only.</div>
          </div>
        </div>

        <!-- Benefit 2 -->
        <div style="display:flex;margin-bottom:18px">
          <div style="flex-shrink:0;width:36px;height:36px;background:#F0F9F4;border-radius:8px;text-align:center;line-height:36px;font-size:16px;margin-right:14px">&#128279;</div>
          <div>
            <div style="font-size:14px;font-weight:700;color:#1A1A1A;margin-bottom:2px">Dofollow SEO Backlinks</div>
            <div style="font-size:13px;color:#6B6560;line-height:1.5">Boost your domain authority with permanent dofollow backlinks from InfoWebWorld.</div>
          </div>
        </div>

        <!-- Benefit 3 -->
        <div style="display:flex;margin-bottom:18px">
          <div style="flex-shrink:0;width:36px;height:36px;background:#EFF6FF;border-radius:8px;text-align:center;line-height:36px;font-size:16px;margin-right:14px">&#11088;</div>
          <div>
            <div style="font-size:14px;font-weight:700;color:#1A1A1A;margin-bottom:2px">Verified Reviews & Trust</div>
            <div style="font-size:13px;color:#6B6560;line-height:1.5">Collect authentic reviews. Build trust. Convert visitors into customers.</div>
          </div>
        </div>

        <!-- Benefit 4 -->
        <div style="display:flex;margin-bottom:0">
          <div style="flex-shrink:0;width:36px;height:36px;background:#FAF5FF;border-radius:8px;text-align:center;line-height:36px;font-size:16px;margin-right:14px">&#127758;</div>
          <div>
            <div style="font-size:14px;font-weight:700;color:#1A1A1A;margin-bottom:2px">Global Discovery — GEO & AEO</div>
            <div style="font-size:13px;color:#6B6560;line-height:1.5">Get found worldwide. AI-optimized listings across 500+ categories and 30+ countries.</div>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div style="padding:28px 40px 0">
        <div style="height:1px;background:#F0EDEA"></div>
      </div>

      <!-- CTA -->
      <div style="padding:28px 40px;text-align:center">
        <p style="margin:0 0 20px 0;font-size:14px;color:#6B6560;line-height:1.6">Don't miss out on founding member pricing.<br>Secure your spot before slots run out.</p>
        <a href="https://infowebworld.com/business" target="_blank" style="display:inline-block;background:#E8553D;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 36px;border-radius:8px;letter-spacing:.3px">Claim Your Spot &rarr;</a>
        <p style="margin:16px 0 0 0;font-size:12px;color:#B5B0AA">6-month money-back guarantee &bull; Cancel anytime</p>
      </div>

      <!-- What's next timeline -->
      <div style="background:#FAFAF8;border-top:1px solid #F0EDEA;padding:28px 40px">
        <h2 style="margin:0 0 18px 0;font-size:15px;font-weight:700;color:#1A1A1A">What happens next</h2>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%">
          <tr>
            <td style="width:28px;vertical-align:top;padding-right:12px">
              <div style="width:22px;height:22px;background:#E8553D;border-radius:50%;text-align:center;line-height:22px;font-size:11px;font-weight:700;color:#fff">1</div>
            </td>
            <td style="padding-bottom:14px">
              <div style="font-size:13px;font-weight:700;color:#1A1A1A">You're on the list</div>
              <div style="font-size:12px;color:#9A9590">You'll hear from us first when we launch.</div>
            </td>
          </tr>
          <tr>
            <td style="width:28px;vertical-align:top;padding-right:12px">
              <div style="width:22px;height:22px;background:#1A1A1A;border-radius:50%;text-align:center;line-height:22px;font-size:11px;font-weight:700;color:#fff">2</div>
            </td>
            <td style="padding-bottom:14px">
              <div style="font-size:13px;font-weight:700;color:#1A1A1A">Early access invite</div>
              <div style="font-size:12px;color:#9A9590">Get in before the public. Set up your listing first.</div>
            </td>
          </tr>
          <tr>
            <td style="width:28px;vertical-align:top;padding-right:12px">
              <div style="width:22px;height:22px;background:#1A1A1A;border-radius:50%;text-align:center;line-height:22px;font-size:11px;font-weight:700;color:#fff">3</div>
            </td>
            <td>
              <div style="font-size:13px;font-weight:700;color:#1A1A1A">Go live globally</div>
              <div style="font-size:12px;color:#9A9590">Your business, discoverable across the world.</div>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:24px 16px 8px">
      <p style="margin:0 0 6px 0;font-size:12px;color:#9A9590">
        <a href="https://infowebworld.com" target="_blank" style="color:#E8553D;text-decoration:none;font-weight:600">InfoWebWorld.com</a> &mdash; Global Growth Platform
      </p>
      <p style="margin:0 0 6px 0;font-size:11px;color:#B5B0AA">Brain Stream Australia Pty Ltd &bull; Parramatta, NSW 2150, Australia</p>
      <p style="margin:0;font-size:11px;color:#B5B0AA">
        <a href="https://infowebworld.com/contact" target="_blank" style="color:#B5B0AA;text-decoration:none">Contact</a>
        &nbsp;&bull;&nbsp;
        <a href="https://infowebworld.com/plans" target="_blank" style="color:#B5B0AA;text-decoration:none">Plans</a>
      </p>
    </div>

  </div>
</body>
</html>
`
}

/* ── Send welcome email via Gmail SMTP (same setup as contact form) ── */
async function sendWelcomeEmail(toEmail: string, position: number) {
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  if (!smtpUser || !smtpPass) {
    console.error('SMTP credentials not set — welcome email not sent')
    return
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: smtpUser, pass: smtpPass },
    })

    await transporter.sendMail({
      from: `"InfoWebWorld" <${smtpUser}>`,
      to: toEmail,
      subject: `You're In! Welcome to InfoWebWorld — Position #${position}`,
      html: buildWelcomeEmail(toEmail, position),
    })
  } catch (err) {
    console.error('Welcome email send failed:', err instanceof Error ? err.message : err)
  }
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

    // Get their position (total count)
    const countRow = await queryOne('SELECT COUNT(*) as cnt FROM waitlist')
    const position = Number(countRow?.cnt ?? 1)

    // Send welcome email (don't block the response)
    sendWelcomeEmail(cleanEmail, position).catch(() => {})

    return Response.json({ ok: true, message: 'Successfully joined the waitlist' })
  } catch (err) {
    console.error('POST /api/waitlist error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
