import { NextRequest } from 'next/server'
import { Resend } from 'resend'
import { execute } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/tracking'

export async function POST(request: NextRequest) {
  try {
    const ip = await getClientIp()

    // Rate limit: 3 submissions per 5 minutes
    const allowed = await checkRateLimit(ip, 'contact', 3, 300)
    if (!allowed) {
      return Response.json({ error: 'Too many messages. Please try again later.' }, { status: 429 })
    }

    const body = await request.json()

    // Honeypot check — bots fill this hidden field, humans don't
    if (body.company) {
      return Response.json({ ok: true })
    }

    // Timestamp check — reject if submitted within 2 seconds of page load
    if (body._ts && Date.now() - Number(body._ts) < 2000) {
      return Response.json({ ok: true })
    }

    // Turnstile captcha verification (if configured)
    if (process.env.TURNSTILE_SECRET_KEY) {
      const token = body.captchaToken
      if (!token) {
        return Response.json({ error: 'Please complete the captcha.' }, { status: 400 })
      }
      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${token}&remoteip=${ip}`,
      })
      const verifyData = await verifyRes.json()
      if (!verifyData.success) {
        return Response.json({ error: 'Captcha verification failed.' }, { status: 400 })
      }
    }

    // Validate required fields
    const { name, email, subject, message } = body
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return Response.json({ error: 'All fields are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return Response.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    if (message.trim().length > 5000) {
      return Response.json({ error: 'Message too long (max 5000 characters).' }, { status: 400 })
    }

    // Store in database
    await execute(
      `INSERT INTO contact_messages (name, email, subject, message, ip_address, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [name.trim(), email.trim().toLowerCase(), subject.trim(), message.trim(), ip]
    )

    // Send email via Resend API
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: 'InfoWebWorld Contact <onboarding@resend.dev>',
          to: 'infowebworld.com@gmail.com',
          replyTo: email.trim().toLowerCase(),
          subject: `[iWW Contact] ${subject.trim()} — from ${name.trim()}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
              <h2 style="color:#E8553D;margin-bottom:4px">New Contact Message</h2>
              <hr style="border:none;border-top:2px solid #f0f0f0;margin:12px 0">
              <p><strong>Name:</strong> ${name.trim()}</p>
              <p><strong>Email:</strong> <a href="mailto:${email.trim()}">${email.trim()}</a></p>
              <p><strong>Subject:</strong> ${subject.trim()}</p>
              <hr style="border:none;border-top:1px solid #f0f0f0;margin:12px 0">
              <p><strong>Message:</strong></p>
              <p style="white-space:pre-wrap;color:#333">${message.trim()}</p>
              <hr style="border:none;border-top:2px solid #f0f0f0;margin:16px 0">
              <p style="font-size:12px;color:#999">Sent from infowebworld.com/contact • IP: ${ip}</p>
            </div>
          `,
        })
      } catch (emailErr) {
        console.error('Email send failed (message still saved to DB):', emailErr)
      }
    }

    return Response.json({ ok: true, message: 'Message sent successfully.' }, { status: 201 })
  } catch (err) {
    console.error('POST /api/contact error:', err)
    return Response.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
