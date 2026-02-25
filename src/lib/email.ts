// src/lib/email.ts
import nodemailer from 'nodemailer'
import { db } from './db'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

interface SendEmailParams {
  to: string
  subject: string
  html: string
  traderId?: string
  template?: string
}

export async function sendEmail(params: SendEmailParams): Promise<boolean> {
  const log = await db.emailLog.create({
    data: {
      to: params.to,
      from: process.env.EMAIL_FROM || 'noreply@worldcup.holaprime.com',
      subject: params.subject,
      body: params.html,
      traderId: params.traderId,
      template: params.template,
      status: 'QUEUED',
    },
  })

  try {
    await transporter.sendMail({
      from: `"Hola Prime World Cup" <${process.env.EMAIL_FROM}>`,
      to: params.to,
      subject: params.subject,
      html: params.html,
    })

    await db.emailLog.update({
      where: { id: log.id },
      data: { status: 'SENT', sentAt: new Date() },
    })
    return true
  } catch (error) {
    await db.emailLog.update({
      where: { id: log.id },
      data: { status: 'FAILED', error: String(error) },
    })
    return false
  }
}

// ─── EMAIL TEMPLATES ──────────────────────────────────────────────────────

export function templateRegistrationConfirm(params: {
  firstName: string
  displayName: string
  countryName: string
}) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; background: #0a0a0a; color: #fff; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
  .header { background: linear-gradient(135deg, #0D2B4E, #C0392B); padding: 40px; border-radius: 12px; text-align: center; margin-bottom: 30px; }
  .header h1 { margin: 0; font-size: 28px; font-weight: 900; }
  .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; }
  .card { background: #1a1a2e; border: 1px solid #2d2d4e; border-radius: 12px; padding: 30px; margin-bottom: 20px; }
  .highlight { color: #D4A017; font-weight: bold; }
  .btn { display: inline-block; background: #C0392B; color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px; }
  .footer { text-align: center; color: #555; font-size: 12px; margin-top: 30px; }
</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏆 HOLA PRIME WORLD CUP</h1>
      <p>Prop Trading World Cup 2026</p>
    </div>
    <div class="card">
      <h2>Welcome, ${params.firstName}! 🎉</h2>
      <p>Your registration for the <strong>Hola Prime Prop Trading World Cup</strong> has been confirmed.</p>
      <p>You're representing <span class="highlight">${params.countryName}</span> in the first-ever global prop trading championship.</p>
      <p><strong>Your display name:</strong> <span class="highlight">${params.displayName}</span></p>
      <h3>What's Next?</h3>
      <ul>
        <li>Complete your <strong>KYC verification</strong> within 48 hours</li>
        <li>Your funded trading account will be provisioned upon approval</li>
        <li>Qualifier opens <strong>June 1, 2026</strong></li>
      </ul>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="btn">Go to Dashboard →</a>
    </div>
    <div class="footer">
      <p>Hola Prime World Cup 2026 | <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#555">worldcup.holaprime.com</a></p>
      <p>This email was sent to you because you registered for the Hola Prime World Cup.</p>
    </div>
  </div>
</body>
</html>
`
}

export function templateKYCApproved(params: { firstName: string; accountNumber: string; accountSize: string }) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; background: #0a0a0a; color: #fff; margin: 0; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
  .header { background: linear-gradient(135deg, #1E8449, #117A8B); padding: 40px; border-radius: 12px; text-align: center; margin-bottom: 30px; }
  .card { background: #1a1a2e; border: 1px solid #2d2d4e; border-radius: 12px; padding: 30px; }
  .highlight { color: #D4A017; font-weight: bold; }
  .btn { display: inline-block; background: #C0392B; color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px; }
</style></head>
<body>
  <div class="container">
    <div class="header"><h1>✅ KYC Approved!</h1></div>
    <div class="card">
      <h2>You're cleared to trade, ${params.firstName}!</h2>
      <p>Your identity has been verified. Your funded trading account is ready:</p>
      <p><strong>Account Number:</strong> <span class="highlight">${params.accountNumber}</span></p>
      <p><strong>Starting Balance:</strong> <span class="highlight">$${params.accountSize}</span></p>
      <p>Login credentials have been sent in a separate secure email.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="btn">View Dashboard →</a>
    </div>
  </div>
</body>
</html>
`
}

export function templateMatchAnnouncement(params: {
  firstName: string
  opponentName: string
  opponentCountry: string
  phase: string
  startDate: string
  endDate: string
}) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; background: #0a0a0a; color: #fff; margin: 0; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
  .header { background: linear-gradient(135deg, #0D2B4E, #C0392B); padding: 40px; border-radius: 12px; text-align: center; margin-bottom: 30px; }
  .vs { font-size: 48px; font-weight: 900; color: #D4A017; }
  .card { background: #1a1a2e; border: 1px solid #2d2d4e; border-radius: 12px; padding: 30px; }
  .btn { display: inline-block; background: #C0392B; color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px; }
</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>${params.phase}</h1>
      <div class="vs">⚔️</div>
      <p>Your match has been drawn!</p>
    </div>
    <div class="card">
      <h2>Get ready, ${params.firstName}!</h2>
      <p>You are facing <strong>${params.opponentName}</strong> from <strong>${params.opponentCountry}</strong></p>
      <p><strong>Match Period:</strong> ${params.startDate} — ${params.endDate}</p>
      <p>A new funded account will be provisioned for this round. The trader with the higher % return by end of the match period advances.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/bracket" class="btn">View Bracket →</a>
    </div>
  </div>
</body>
</html>
`
}
