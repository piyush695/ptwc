// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, signToken } from '@/lib/auth'
import { sendEmail, templateRegistrationConfirm } from '@/lib/email'
import { z } from 'zod'

const schema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  displayName: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, _ and - allowed'),
  email: z.string().email(),
  password: z.string().min(8).regex(/(?=.*[A-Z])(?=.*[0-9])/, 'Must contain uppercase and number'),
  countryCode: z.string().length(2),
  dateOfBirth: z.string().optional(),
  phone: z.string().optional(),
  referralCode: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    // Check tournament config
    const config = await db.tournamentConfig.findFirst()
    if (!config?.registrationOpen) {
      return NextResponse.json({ error: 'Registration is not currently open' }, { status: 403 })
    }

    // Check country eligibility
    const country = await db.country.findUnique({ where: { code: data.countryCode.toUpperCase() } })
    if (!country || !country.isEligible) {
      return NextResponse.json({ error: 'Your country is not eligible for this tournament' }, { status: 400 })
    }

    // Uniqueness checks
    const [emailExists, displayNameExists] = await Promise.all([
      db.user.findUnique({ where: { email: data.email } }),
      db.trader.findUnique({ where: { displayName: data.displayName } }),
    ])

    if (emailExists) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    if (displayNameExists) return NextResponse.json({ error: 'Display name already taken' }, { status: 409 })

    // Create user + trader in transaction
    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          passwordHash: await hashPassword(data.password),
          role: 'TRADER',
        },
      })

      const trader = await tx.trader.create({
        data: {
          userId: user.id,
          countryId: country.id,
          firstName: data.firstName,
          lastName: data.lastName,
          displayName: data.displayName,
          email: data.email,
          phone: data.phone,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
          referredBy: data.referralCode,
          status: 'REGISTERED',
        },
      })
// Create a default TradingAccount for this trader (so leaderboard works immediately)
const config = await tx.tournamentConfig.findFirst();
const startingPhase = config?.currentPhase ?? "REGISTRATION";

// Pick your standard starting amount (change if needed)
const openingBalance = 50000;

// Unique account number (stable + unique)
const accountNumber = `HP-${String(trader.id).slice(0, 8).toUpperCase()}`;

await tx.tradingAccount.create({
  data: {
    traderId: trader.id,
    accountNumber,

    // If your schema requires brokerAccountId (not optional), uncomment next line
    // brokerAccountId: `BROKER-${accountNumber}`,

    phase: startingPhase,
    status: "ACTIVE",

    openingBalance,
    currentBalance: openingBalance,
    currentEquity: openingBalance,
    peakBalance: openingBalance,
    maxDrawdown: 0,

    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    totalVolumeLots: 0,
    lastSyncAt: new Date(),
  },
});

      // Create CRM record
      await tx.cRMRecord.create({
        data: {
          traderId: trader.id,
          leadStatus: 'REGISTERED',
          source: req.headers.get('referer')?.includes('instagram') ? 'social'
            : req.headers.get('referer')?.includes('google') ? 'paid'
            : data.referralCode ? 'referral' : 'direct',
        },
      })

      return { user, trader }
    })

    // Send welcome email (non-blocking)
    sendEmail({
      to: data.email,
      subject: '🏆 Welcome to Hola Prime World Cup — Registration Confirmed!',
      html: templateRegistrationConfirm({
        firstName: data.firstName,
        displayName: data.displayName,
        countryName: country.name,
      }),
      traderId: result.trader.id,
      template: 'registration_confirm',
    }).catch(console.error)

    // Create session token
    const token = await signToken({
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role,
      traderId: result.trader.id,
    })

    const res = NextResponse.json({
      success: true,
      trader: {
        id: result.trader.id,
        displayName: result.trader.displayName,
        status: result.trader.status,
        countryCode: data.countryCode,
      },
    }, { status: 201 })

    res.cookies.set('hp_wc_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    return res
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
