// src/app/api/admin/crm/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthUser } from '@/lib/auth'
import { sendEmail } from '@/lib/email'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const assignedTo = searchParams.get('assignedTo')
  const search = searchParams.get('search')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')

  const where: any = {}
  if (status) where.leadStatus = status
  if (assignedTo) where.assignedTo = assignedTo
  if (search) {
    where.trader = {
      OR: [
        { displayName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    }
  }

  const [records, total] = await Promise.all([
    db.cRMRecord.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ nextFollowUp: 'asc' }, { createdAt: 'desc' }],
      include: {
        trader: {
          select: {
            id: true, displayName: true, email: true, phone: true,
            status: true, registeredAt: true,
            country: { select: { code: true, name: true, flag: true } },
            accounts: { select: { phase: true, status: true, currentBalance: true, openingBalance: true }, take: 1 },
            _count: { select: { emails: true } },
          },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
      },
    }),
    db.cRMRecord.count({ where }),
  ])

  // Stats
  const stats = await db.cRMRecord.groupBy({
    by: ['leadStatus'],
    _count: true,
  })

  return NextResponse.json({
    records,
    stats: Object.fromEntries(stats.map(s => [s.leadStatus, s._count])),
    pagination: { page, limit, total },
  })
}

const activitySchema = z.object({
  traderId: z.string(),
  type: z.enum(['email', 'call', 'note', 'status_change']),
  description: z.string().min(3),
  nextFollowUp: z.string().optional(),
  assignedTo: z.string().optional(),
  tags: z.array(z.string()).optional(),
  leadStatus: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'REGISTERED', 'CONVERTED', 'LOST']).optional(),
})

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const data = activitySchema.parse(body)

  const crmRecord = await db.cRMRecord.findUnique({ where: { traderId: data.traderId } })
  if (!crmRecord) return NextResponse.json({ error: 'CRM record not found' }, { status: 404 })

  await db.$transaction(async (tx) => {
    await tx.cRMActivity.create({
      data: {
        crmId: crmRecord.id,
        type: data.type,
        description: data.description,
        performedBy: user.email,
      },
    })

    await tx.cRMRecord.update({
      where: { id: crmRecord.id },
      data: {
        lastContactAt: new Date(),
        nextFollowUp: data.nextFollowUp ? new Date(data.nextFollowUp) : undefined,
        assignedTo: data.assignedTo,
        tags: data.tags,
        leadStatus: data.leadStatus,
        notes: data.description,
      },
    })
  })

  return NextResponse.json({ success: true })
}

// Bulk email endpoint
const bulkEmailSchema = z.object({
  traderIds: z.array(z.string()).optional(),
  filterStatus: z.string().optional(),
  filterCountry: z.string().optional(),
  subject: z.string().min(3),
  html: z.string().min(10),
  templateId: z.string().optional(),
})

export async function PUT(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const data = bulkEmailSchema.parse(body)

  const where: any = {}
  if (data.traderIds?.length) {
    where.id = { in: data.traderIds }
  } else {
    if (data.filterStatus) where.status = data.filterStatus
    if (data.filterCountry) where.country = { code: data.filterCountry }
  }

  const traders = await db.trader.findMany({
    where,
    select: { id: true, email: true, firstName: true },
  })

  let sent = 0
  let failed = 0

  for (const trader of traders) {
    const success = await sendEmail({
      to: trader.email,
      subject: data.subject,
      html: data.html.replace('{{firstName}}', trader.firstName),
      traderId: trader.id,
      template: data.templateId,
    })
    success ? sent++ : failed++
  }

  return NextResponse.json({ success: true, sent, failed, total: traders.length })
}
