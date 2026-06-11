import { NextRequest } from 'next/server'
import { randomInt } from 'node:crypto'
import { hash } from 'bcryptjs'
import nodemailer from 'nodemailer'
import { queryOne, execute } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/tracking'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const OTP_TTL_MINUTES = 10
const RESEND_COOLDOWN_SECONDS = 60

export async function POST(request: NextRequest) {
  try {
    const ip = await getClientIp()

    // Rate limit: 5 requests / 5 minutes per IP (covers resends)
    if (!(await checkRateLimit(ip, 'signup-request', 5, 300))) {
      return Response.json(
        { ok: false, error: 'Too many requests. Try again in a few minutes.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')
    const confirmPassword = String(body.confirmPassword || '')
    const name = String(body.name || '').trim().slice(0, 120) || null

    if (!EMAIL_RE.test(email)) {
      return Response.json({ ok: false, error: 'Enter a valid email address.' }, { status: 400 })
    }
    if (password.length < 8) {
      return Response.json({ ok: false, error: 'Password must be at least 8 characters.' }, { status: 400 })
    }
    if (password !== confirmPassword) {
      return Response.json({ ok: false, error: 'Passwords do not match.' }, { status: 400 })
    }

    // Block if an account already exists for this email
    const existing = await queryOne<{ id: number }>(
      'SELECT id FROM business_users WHERE email = ? LIMIT 1',
      [email]
    )
    if (existing) {
      return Response.json(
        { ok: false, error: 'An account already exists for this email. Try signing in.' },
        { status: 409 }
      )
    }

    // Check resend cooldown for this email — compute elapsed in MySQL so
    // timezone drift between the DB and Vercel can't corrupt the math.
    const pending = await queryOne<{ seconds_since_last: number }>(
      `SELECT TIMESTAMPDIFF(SECOND, last_sent_at, NOW()) AS seconds_since_last
       FROM email_otps WHERE email = ? LIMIT 1`,
      [email]
    )
    if (pending) {
      const elapsed = Number(pending.seconds_since_last)
      if (elapsed < RESEND_COOLDOWN_SECONDS) {
        const wait = Math.ceil(RESEND_COOLDOWN_SECONDS - elapsed)
        return Response.json(
          { ok: false, error: `Please wait ${wait}s before requesting a new code.` },
          { status: 429 }
        )
      }
    }

    // Generate the 6-digit code (zero-padded, cryptographically random)
    const code = String(randomInt(0, 1_000_000)).padStart(6, '0')
    const [codeHash, passwordHash] = await Promise.all([
      hash(code, 10),
      hash(password, 10),
    ])

    // UPSERT the pending OTP row — reset attempts on new issuance,
    // increment resends so we can cap abuse later if needed.
    await execute(
      `INSERT INTO email_otps
         (email, code_hash, password_hash, name, expires_at, attempts, resends, last_sent_at)
       VALUES
         (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL ${OTP_TTL_MINUTES} MINUTE), 0, 0, NOW())
       ON DUPLICATE KEY UPDATE
         code_hash     = VALUES(code_hash),
         password_hash = VALUES(password_hash),
         name          = VALUES(name),
         expires_at    = VALUES(expires_at),
         attempts      = 0,
         resends       = resends + 1,
         last_sent_at  = NOW()`,
      [email, codeHash, passwordHash, name]
    )

    await sendOtpEmail(email, code)

    return Response.json({
      ok: true,
      message: `We sent a 6-digit code to ${email}. It expires in ${OTP_TTL_MINUTES} minutes.`,
      expiresInMinutes: OTP_TTL_MINUTES,
    })
  } catch (err) {
    console.error('POST /api/auth/signup-request error:', err)
    return Response.json({ ok: false, error: 'Could not send verification code. Please try again.' }, { status: 500 })
  }
}

async function sendOtpEmail(toEmail: string, code: string) {
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
    subject: `Your InfoWebWorld verification code: ${code}`,
    text: `Your InfoWebWorld verification code is ${code}. It expires in ${OTP_TTL_MINUTES} minutes. If you did not request this, ignore this email.`,
    html: buildOtpEmail(code),
  })
}

function buildOtpEmail(code: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Your verification code</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet" />
  </head>
  <body style="margin:0;padding:0;background:#FAF5F0;font-family:Nunito,Segoe UI,Arial,sans-serif;color:#1A1A1A;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#FAF5F0;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;background:#FFFFFF;border:1.5px solid #E8E3DE;border-radius:18px;overflow:hidden;">
            <tr>
              <td style="background:#1A1A1A;padding:28px 28px 22px;">
                <div style="font-family:Nunito,Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#E8553D;margin-bottom:8px;">Verify your email</div>
                <div style="font-family:'Bricolage Grotesque',Georgia,serif;font-size:26px;font-weight:800;letter-spacing:-.02em;color:#FFFFFF;line-height:1.2;">One more step</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#5C5C5C;">
                  Use the code below to finish creating your InfoWebWorld account. It expires in ${OTP_TTL_MINUTES} minutes.
                </p>
                <div style="text-align:center;margin:24px 0;">
                  <div style="display:inline-block;background:#FAF5F0;border:1.5px solid #E8E3DE;border-radius:14px;padding:18px 28px;font-family:'Bricolage Grotesque',Georgia,serif;font-size:36px;font-weight:800;letter-spacing:.28em;color:#1A1A1A;">
                    ${code}
                  </div>
                </div>
                <p style="margin:20px 0 0;font-size:13px;line-height:1.5;color:#9A9590;">
                  If you did not request this code, you can safely ignore this email. Someone may have typed your address by mistake.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px 22px;border-top:1px solid #F0EBE6;font-size:11px;color:#9A9590;text-align:center;">
                InfoWebWorld &middot; Global Business Directory
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}
