// src/app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [
    totalTraders,
    activeTraders,
    pendingKYC,
    disqualified,
    countries,
    qualifiedForBracket,
    activeMatches,
    emailsSentToday,
    recentRegistrations,
    phaseBreakdown,
  ] = await Promise.all([
    db.trader.count(),
    db.trader.count({ where: { status: { in: ['ACTIVE', 'KYC_APPROVED'] } } }),
    db.trader.count({ where: { status: 'KYC_PENDING' } }),
    db.trader.count({ where: { status: 'DISQUALIFIED' } }),
    db.trader.groupBy({ by: ['countryId'], _count: true }).then(r => r.length),
    db.qualifierEntry.count({ where: { qualified: true } }),
    db.match.count({ where: { status: 'ACTIVE' } }),
    db.emailLog.count({
      where: {
        status: 'SENT',
        sentAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
    // Last 7 days registrations
    db.$queryRaw<Array<{ date: string; count: number }>>`
      SELECT DATE(registered_at) as date, COUNT(*) as count
      FROM traders
      WHERE registered_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(registered_at)
      ORDER BY date ASC
    `,
    db.trader.groupBy({
      by: ['status'],
      _count: true,
    }),
  ])

  return NextResponse.json({
    totalTraders,
    activeTraders,
    pendingKYC,
    disqualified,
    countries,
    qualifiedForBracket,
    activeMatches,
    emailsSentToday,
    recentRegistrations,
    statusBreakdown: Object.fromEntries(phaseBreakdown.map(p => [p.status, p._count])),
  })
}
